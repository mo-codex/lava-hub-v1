import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Flame,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Instructor } from '../../types/index.ts';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';
import { useT } from '../../i18n/LanguageContext.tsx';
import { Card } from '../../components/ui/Card.tsx';

export function WorkshopDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useT();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [instructors, setInstructors] = useState<Instructor[]>([]);

  useEffect(() => {
    if (!slug) return;
    const load = () => {
      const ws = db.getWorkshopBySlug(slug, false);
      if (ws) {
        setWorkshop(ws);
        const allInst = db.getInstructors();
        const assigned = allInst.filter((i) => ws.instructorIds?.includes(i.id));
        setInstructors(assigned.length > 0 ? assigned : [allInst[0]]);
      }
    };
    load();
    return db.subscribe(load);
  }, [slug]);

  if (!workshop) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workshop Not Found</h2>
        <p className="text-sm text-slate-500">The workshop you are looking for does not exist or may have been unlisted.</p>
        <Link to="/workshops" className="inline-flex items-center text-sm font-semibold text-orange-600 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-1" /> Browse Catalog
        </Link>
      </div>
    );
  }

  const remainingSeats = calculateRemainingSeats(workshop.capacity, workshop.confirmedCount);
  const isFull = remainingSeats === 0;
  const isCancelled = workshop.status === 'cancelled';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Back link */}
      <div>
        <Link
          to="/workshops"
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Workshops Catalog
        </Link>
      </div>

      {/* Cancelled Notice Banner */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-800 dark:text-red-300 flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">This workshop cohort has been cancelled by the mentors.</p>
            <p>Registration is closed for this session. Please browse our catalog for upcoming alternative cohorts.</p>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Metadata */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="text-orange-600 font-semibold">{workshop.category}</span>
            <span aria-hidden="true">·</span>
            <span>Live Interactive Session</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-600 font-semibold">100% Free</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
            {workshop.title}
          </h1>

          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {workshop.summary}
          </p>

          {/* Quick Schedule Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Date & Time</p>
                <p className="font-semibold text-slate-900 dark:text-white font-mono tabular-nums text-xs sm:text-sm">
                  {formatMogadishuTime(workshop.startTime, { format: 'full' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration & Timezone</p>
                <p className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm">
                  2.5 Hours · East Africa Time (EAT)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Capacity & Registration Action Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 space-y-6 sticky top-24 border-slate-200 dark:border-slate-800 shadow-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-700 dark:text-slate-300">Seat Capacity</span>
                <span className="font-mono tabular-nums text-slate-900 dark:text-white">
                  {workshop.confirmedCount} / {workshop.capacity}
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all rounded-full ${
                    isCancelled
                      ? 'bg-red-500'
                      : isFull
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(100, (workshop.confirmedCount / workshop.capacity) * 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isCancelled
                  ? 'Cohort cancelled by mentors.'
                  : isFull
                  ? `Seats are fully booked. ${workshop.waitlistCount} people currently on waitlist.`
                  : `${remainingSeats} seats remaining for live interactive attendance.`}
              </p>
            </div>

            <div className="space-y-3">
              {isCancelled ? (
                <div className="w-full py-3.5 px-4 text-center text-xs font-bold text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-950/60 rounded-xl border border-red-300 dark:border-red-800">
                  Cohort Cancelled
                </div>
              ) : (
                <Link
                  to={`/workshops/${workshop.slug}/register`}
                  className="w-full py-3.5 px-4 text-center text-sm font-bold text-slate-950 bg-[#FF5722] hover:bg-[#F4511E] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                >
                  <span>{isFull ? 'Join Priority Waitlist' : 'Register for Free Seat'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
              <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Guest registration. No account needed.</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>• Live session on Zoom / Google Meet</p>
              <p>• Access link sent after email confirmation</p>
              <p>• Free cancellation up to 2h before start</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Workshop Content: Overview, Agenda, Prerequisites */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Description */}
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              About This Workshop
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
              <p>{workshop.description}</p>
            </div>
          </div>

          {/* Agenda */}
          {workshop.agenda && workshop.agenda.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Workshop Agenda
              </h2>
              <div className="space-y-3">
                {workshop.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-4"
                  >
                    <span className="text-xs font-mono font-semibold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-md shrink-0">
                      {item.time}
                    </span>
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      {item.topic}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerequisites */}
          {workshop.prerequisites && workshop.prerequisites.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                Prerequisites & Requirements
              </h2>
              <ul className="space-y-2">
                {workshop.prerequisites.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Instructor Profiles */}
        <div className="lg:col-span-1 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display">
            Meet the Instructor
          </h2>
          {instructors.map((inst) => (
            <Card key={inst.id} className="p-5 space-y-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={inst.photoUrl}
                  alt={inst.name}
                  className="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                    {inst.name}
                  </h3>
                  <p className="text-xs text-orange-600 font-medium">{inst.role}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {inst.bio}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {inst.expertise.map((exp) => (
                  <span
                    key={exp}
                    className="text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
