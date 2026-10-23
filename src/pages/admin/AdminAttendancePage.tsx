import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  UserX,
  RotateCcw,
  Download,
  CheckCircle2,
  Users,
  Search,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Registration, AttendanceRecord } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Select } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { sanitizeCsvCell, formatMogadishuTime } from '../../lib/utils.ts';

export function AdminAttendancePage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('');
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const wsList = db.getWorkshops();
    setWorkshops(wsList);
    if (wsList.length > 0 && !selectedWorkshopId) {
      setSelectedWorkshopId(wsList[0].id);
    }
  }, []);

  useEffect(() => {
    if (!selectedWorkshopId) return;
    setRegistrations(db.getRegistrations(selectedWorkshopId));
    setAttendance(db.getAttendance(selectedWorkshopId));

    return db.subscribe(() => {
      setRegistrations(db.getRegistrations(selectedWorkshopId));
      setAttendance(db.getAttendance(selectedWorkshopId));
    });
  }, [selectedWorkshopId]);

  const selectedWorkshop = workshops.find((w) => w.id === selectedWorkshopId);

  // Confirmed attendees only (Waitlisted and cancelled participants cannot be marked present)
  const confirmedAttendees = registrations.filter((r) => r.status === 'confirmed');

  const filteredAttendees = confirmedAttendees.filter(
    (a) =>
      a.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getAttendanceStatus = (regId: string) => {
    const record = attendance.find((a) => a.registrationId === regId);
    return record?.status || 'unmarked';
  };

  const handleMark = (regId: string, status: 'present' | 'absent' | 'unmarked') => {
    if (!selectedWorkshopId) return;
    const res = db.markAttendance(selectedWorkshopId, regId, status);
    if (res.success) {
      setStatusMessage(res.message);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  const handleBulkMarkPresent = () => {
    if (!selectedWorkshopId) return;
    const count = db.bulkMarkAttendance(selectedWorkshopId, 'present');
    setStatusMessage(`Marked all ${count} confirmed attendees as Present.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // CSV Export with Formula Injection Neutralization
  const handleExportCsv = () => {
    if (!selectedWorkshop) return;

    const headers = [
      'Participant Name',
      'Email Address',
      'Experience Level',
      'Registration Status',
      'Attendance Status',
      'Marked Time (EAT)',
    ];

    const rows = confirmedAttendees.map((r) => {
      const att = attendance.find((a) => a.registrationId === r.id);
      return [
        sanitizeCsvCell(r.fullName),
        sanitizeCsvCell(r.email),
        sanitizeCsvCell(r.experienceLevel),
        sanitizeCsvCell(r.status),
        sanitizeCsvCell(att?.status || 'unmarked'),
        sanitizeCsvCell(
          att?.markedAt
            ? formatMogadishuTime(att.markedAt, { format: 'short' })
            : 'Not marked'
        ),
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `lavahub_attendance_${selectedWorkshop.slug}_${Date.now()}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const presentCount = attendance.filter(
    (a) => a.workshopId === selectedWorkshopId && a.status === 'present'
  ).length;
  const absentCount = attendance.filter(
    (a) => a.workshopId === selectedWorkshopId && a.status === 'absent'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Live Workshop Attendance Sheet
          </h1>
          <p className="text-xs text-slate-500">
            Track student check-ins, record attendance logs, and securely export sanitized CSV rosters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportCsv}
            disabled={confirmedAttendees.length === 0}
            className="text-xs font-semibold"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            onClick={handleBulkMarkPresent}
            disabled={confirmedAttendees.length === 0}
            className="text-xs font-bold"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            <span>Bulk Mark All Present</span>
          </Button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          {statusMessage}
        </div>
      )}

      {/* Workshop Selector & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="md:col-span-2">
          <Select
            label="Select Workshop Cohort"
            value={selectedWorkshopId}
            onChange={(e) => setSelectedWorkshopId(e.target.value)}
            options={workshops.map((w) => ({
              label: `${w.title} (${w.confirmedCount} confirmed)`,
              value: w.id,
            }))}
          />
        </div>

        <Card className="p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Present</span>
          <span className="font-bold text-emerald-600 text-sm font-mono tabular-nums">
            {presentCount} / {confirmedAttendees.length}
          </span>
        </Card>

        <Card className="p-3.5 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Absent</span>
          <span className="font-bold text-rose-600 text-sm font-mono tabular-nums">
            {absentCount}
          </span>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Filter attendees by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg"
        />
      </div>

      {/* Attendees Table */}
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
            <tr>
              <th className="py-3 px-4">Attendee</th>
              <th className="py-3 px-4">Level</th>
              <th className="py-3 px-4">Current Status</th>
              <th className="py-3 px-4 text-right">Attendance Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filteredAttendees.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-500 text-xs">
                  No confirmed attendees found for this workshop.
                </td>
              </tr>
            ) : (
              filteredAttendees.map((reg) => {
                const currentStatus = getAttendanceStatus(reg.id);
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{reg.fullName}</p>
                      <p className="text-[11px] text-slate-500 font-mono">{reg.email}</p>
                    </td>
                    <td className="py-3 px-4 capitalize font-mono text-[11px]">{reg.experienceLevel}</td>
                    <td className="py-3 px-4">
                      <StatusBadge status={currentStatus} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleMark(reg.id, 'present')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            currentStatus === 'present'
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-100'
                          }`}
                        >
                          Present
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMark(reg.id, 'absent')}
                          className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                            currentStatus === 'absent'
                              ? 'bg-rose-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-100'
                          }`}
                        >
                          Absent
                        </button>

                        <button
                          type="button"
                          onClick={() => handleMark(reg.id, 'unmarked')}
                          className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Reset to unmarked"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
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
