import React, { useState, useEffect } from 'react';
import { Search, Filter, XCircle, Mail, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Registration, Workshop } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { Select } from '../../components/ui/Input.tsx';
import { formatMogadishuTime } from '../../lib/utils.ts';

export function AdminRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackNotice, setFeedbackNotice] = useState<string | null>(null);

  useEffect(() => {
    setRegistrations(db.getRegistrations());
    setWorkshops(db.getWorkshops());
    return db.subscribe(() => {
      setRegistrations(db.getRegistrations());
      setWorkshops(db.getWorkshops());
    });
  }, []);

  const handleCancelRegistration = (reg: Registration) => {
    if (confirm(`Cancel active registration for ${reg.fullName}?`)) {
      const res = db.cancelRegistration(reg.id);
      if (res.success) {
        if (res.promotedEmail) {
          setFeedbackNotice(
            `Registration cancelled. Auto-cascade promoted next waitlisted student: ${res.promotedEmail}!`
          );
        } else {
          setFeedbackNotice('Registration cancelled successfully.');
        }
        setTimeout(() => setFeedbackNotice(null), 5000);
      }
    }
  };

  const handleResendConfirmation = (reg: Registration) => {
    const ws = workshops.find((w) => w.id === reg.workshopId);
    db.recordEmailDelivery({
      recipientEmail: reg.email,
      eventType: 'manual_resend_confirmation',
      subject: `Resent Confirmation: ${ws?.title || 'Workshop'} (Lava Hub)`,
      status: 'delivered',
      providerMessageId: `resend_manual_${Date.now()}`,
    });
    setFeedbackNotice(`Resent confirmation email to ${reg.email}`);
    setTimeout(() => setFeedbackNotice(null), 4000);
  };

  const filtered = registrations.filter((reg) => {
    const matchesWs = selectedWorkshopId === 'all' || reg.workshopId === selectedWorkshopId;
    const matchesStatus = selectedStatus === 'all' || reg.status === selectedStatus;
    const matchesSearch =
      reg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesWs && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Registration Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit guest attendees, manage registration statuses, and trigger automatic cascade waitlist promotions.
          </p>
        </div>
      </div>

      {feedbackNotice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search attendee name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg placeholder:text-slate-400"
          />
        </div>

        <Select
          value={selectedWorkshopId}
          onChange={(e) => setSelectedWorkshopId(e.target.value)}
          className="text-xs py-2"
          options={[
            { label: 'All Workshops', value: 'all' },
            ...workshops.map((w) => ({ label: w.title, value: w.id })),
          ]}
        />

        <Select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="text-xs py-2"
          options={[
            { label: 'All Statuses', value: 'all' },
            { label: 'Confirmed', value: 'confirmed' },
            { label: 'Waitlisted', value: 'waitlisted' },
            { label: 'Pending Verification', value: 'pending_verification' },
            { label: 'Cancelled', value: 'cancelled' },
          ]}
        />
      </div>

      {/* Registrations Table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Participant</th>
              <th className="py-3 px-4">Workshop</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Registration Date</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500 text-xs">
                  No registrations found matching criteria.
                </td>
              </tr>
            ) : (
              filtered.map((reg) => {
                const ws = workshops.find((w) => w.id === reg.workshopId);
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white text-xs">{reg.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{reg.email}</p>
                      {reg.whatsapp && (
                        <p className="text-[10px] text-slate-400">WhatsApp: {reg.whatsapp}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {ws?.title || reg.workshopId}
                    </td>
                    <td className="py-3.5 px-4 capitalize font-mono text-[11px]">{reg.experienceLevel}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500 text-[11px]">
                      {formatMogadishuTime(reg.createdAt, { format: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {reg.status !== 'cancelled' && (
                          <button
                            onClick={() => handleCancelRegistration(reg)}
                            className="p-1 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded flex items-center gap-1 text-[11px] font-semibold"
                            title="Cancel Registration"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleResendConfirmation(reg)}
                          className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-1 text-[11px]"
                          title="Resend email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Resend</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
