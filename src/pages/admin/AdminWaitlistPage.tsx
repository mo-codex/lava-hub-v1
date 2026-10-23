import React, { useState, useEffect } from 'react';
import { Clock, Send, CheckCircle2, ShieldCheck, Users } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Registration, Workshop } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { formatMogadishuTime } from '../../lib/utils.ts';

export function AdminWaitlistPage() {
  const [waitlist, setWaitlist] = useState<Registration[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const allRegs = db.getRegistrations();
    const sortFn = (a: Registration, b: Registration) => {
      const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (timeDiff !== 0) return timeDiff;
      return a.id.localeCompare(b.id);
    };
    const waitlisted = allRegs.filter((r) => r.status === 'waitlisted').sort(sortFn);
    setWaitlist(waitlisted);
    setWorkshops(db.getWorkshops());

    return db.subscribe(() => {
      const updated = db.getRegistrations().filter((r) => r.status === 'waitlisted').sort(sortFn);
      setWaitlist(updated);
    });
  }, []);

  const handlePromoteDirectly = (reg: Registration) => {
    reg.status = 'confirmed';
    reg.updatedAt = new Date().toISOString();
    db.recordEmailDelivery({
      recipientEmail: reg.email,
      eventType: 'manual_admin_seat_offer',
      subject: 'Great news! An admin has reserved your workshop seat (Lava Hub)',
      status: 'delivered',
      providerMessageId: `resend_admin_${Date.now()}`,
    });
    setMessage(`Promoted ${reg.fullName} to Confirmed seat and dispatched notification.`);
    setTimeout(() => setMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Waiting List Priority Queue
        </h1>
        <p className="text-xs text-slate-500">
          Strict First-In-First-Out (FIFO) queue with automatic cascade promotions when registered seats are cancelled.
        </p>
      </div>

      {message && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          {message}
        </div>
      )}

      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Position</th>
              <th className="py-3 px-4">Participant</th>
              <th className="py-3 px-4">Workshop</th>
              <th className="py-3 px-4">Waitlist Enrolled Time</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {waitlist.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                  The waiting list is currently clear. No pending waitlisted participants.
                </td>
              </tr>
            ) : (
              waitlist.map((reg, index) => {
                const ws = workshops.find((w) => w.id === reg.workshopId);
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-mono font-bold text-orange-600">
                      #{index + 1} Priority
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{reg.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{reg.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium">{ws?.title || reg.workshopId}</td>
                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-500">
                      {formatMogadishuTime(reg.createdAt, { format: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        onClick={() => handlePromoteDirectly(reg)}
                        className="text-[11px] py-1 px-3"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        <span>Promote to Seat</span>
                      </Button>
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
