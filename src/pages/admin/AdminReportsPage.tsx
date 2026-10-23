import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Award, TrendingUp, ShieldCheck } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Registration, FeedbackSubmission } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';

export function AdminReportsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [feedback, setFeedback] = useState<FeedbackSubmission[]>([]);

  useEffect(() => {
    setWorkshops(db.getWorkshops());
    setRegistrations(db.getRegistrations());
    setFeedback(db.getFeedback());
  }, []);

  const totalSeats = workshops.reduce((acc, w) => acc + w.capacity, 0);
  const totalConfirmed = registrations.filter((r) => r.status === 'confirmed').length;
  const totalWaitlist = registrations.filter((r) => r.status === 'waitlisted').length;
  const totalCancelled = registrations.filter((r) => r.status === 'cancelled').length;

  const experienceCounts = {
    beginner: registrations.filter((r) => r.experienceLevel === 'beginner').length,
    intermediate: registrations.filter((r) => r.experienceLevel === 'intermediate').length,
    advanced: registrations.filter((r) => r.experienceLevel === 'advanced').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Platform Analytics & Reports
        </h1>
        <p className="text-xs text-slate-500">
          Cohort health, student experience demographic breakdown, and seat utilization metrics.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Total Capacity</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
            {totalSeats}
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Confirmed Students</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
            {totalConfirmed}
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Waitlisted</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-amber-600">
            {totalWaitlist}
          </p>
        </Card>

        <Card className="p-4 space-y-1">
          <p className="text-xs text-slate-500 font-semibold uppercase">Cancellations</p>
          <p className="text-2xl font-bold font-mono tabular-nums text-slate-500">
            {totalCancelled}
          </p>
        </Card>
      </div>

      {/* Demographic Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Student Experience Distribution
          </h2>
          <div className="space-y-3 text-xs">
            {Object.entries(experienceCounts).map(([level, count]) => {
              const pct = registrations.length > 0 ? Math.round((count / registrations.length) * 100) : 0;
              return (
                <div key={level} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="capitalize">{level}</span>
                    <span className="font-mono tabular-nums">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-500 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
            Cohort Capacity Utilization
          </h2>
          <div className="space-y-3 text-xs">
            {workshops.map((ws) => {
              const pct = ws.capacity > 0 ? Math.round((ws.confirmedCount / ws.capacity) * 100) : 0;
              return (
                <div key={ws.id} className="space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="truncate max-w-[200px]">{ws.title}</span>
                    <span className="font-mono tabular-nums">
                      {ws.confirmedCount} / {ws.capacity} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${pct >= 90 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
