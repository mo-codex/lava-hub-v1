import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Clock,
  UserCheck,
  ArrowRight,
  Plus,
  AlertCircle,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Registration } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { StatusBadge } from '../../components/ui/StatusBadge.tsx';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';

export function AdminDashboardPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  useEffect(() => {
    setWorkshops(db.getWorkshops());
    setRegistrations(db.getRegistrations());
    return db.subscribe(() => {
      setWorkshops(db.getWorkshops());
      setRegistrations(db.getRegistrations());
    });
  }, []);

  const totalCapacity = workshops.reduce((sum, w) => sum + w.capacity, 0);
  const confirmedRegs = registrations.filter((r) => r.status === 'confirmed');
  const waitlistRegs = registrations.filter((r) => r.status === 'waitlisted');
  const publishedCount = workshops.filter((w) => w.status === 'published').length;

  const nearFullWorkshops = workshops.filter((w) => {
    const remaining = calculateRemainingSeats(w.capacity, w.confirmedCount);
    return w.status === 'published' && remaining <= 5;
  });

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Operational Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time platform activity, seat allocations, and attendee registrations.
          </p>
        </div>
        <Link
          to="/admins/workshops"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold text-xs rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Manage Workshops</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Workshops</span>
            <Calendar className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {workshops.length}
          </p>
          <p className="text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">{publishedCount} published</span> ·{' '}
            {workshops.length - publishedCount} drafts
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Confirmed Seats</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {confirmedRegs.length}
          </p>
          <p className="text-xs text-slate-500">
            Total capacity: <span className="font-mono">{totalCapacity}</span>
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Waitlist Queue</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {waitlistRegs.length}
          </p>
          <p className="text-xs text-slate-500">Auto-cascade promotion enabled</p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Capacity Fill Rate</span>
            <UserCheck className="w-4 h-4 text-sky-600" />
          </div>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalCapacity > 0 ? Math.round((confirmedRegs.length / totalCapacity) * 100) : 0}%
          </p>
          <p className="text-xs text-slate-500">Across active cohorts</p>
        </Card>
      </div>

      {/* Near Capacity Alert */}
      {nearFullWorkshops.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-bold text-amber-900 dark:text-amber-200">
              High Demand: {nearFullWorkshops.length} workshop(s) nearing capacity
            </p>
            <p className="text-amber-800 dark:text-amber-300">
              {nearFullWorkshops.map((w) => `${w.title} (${calculateRemainingSeats(w.capacity, w.confirmedCount)} seats left)`).join(' · ')}
            </p>
          </div>
        </div>
      )}

      {/* Recent Registrations Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Recent Participant Registrations
          </h2>
          <Link
            to="/admins/registrations"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View All Registrations</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <Card className="overflow-x-auto p-0">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase font-semibold">
              <tr>
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">Workshop</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4">Date Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {registrations.slice(0, 6).map((reg) => {
                const ws = workshops.find((w) => w.id === reg.workshopId);
                return (
                  <tr key={reg.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-900 dark:text-white">{reg.fullName}</p>
                      <p className="text-[11px] text-slate-500">{reg.email}</p>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {ws?.title || reg.workshopId}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={reg.status} />
                    </td>
                    <td className="py-3 px-4 capitalize font-mono text-[11px]">{reg.experienceLevel}</td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-500">
                      {formatMogadishuTime(reg.createdAt, { format: 'short' })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
