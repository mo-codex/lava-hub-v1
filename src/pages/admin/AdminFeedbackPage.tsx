import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Check, X, ShieldCheck } from 'lucide-react';
import { db } from '../../services/db.ts';
import { FeedbackSubmission, Workshop } from '../../types/index.ts';
import { Card } from '../../components/ui/Card.tsx';
import { formatMogadishuTime } from '../../lib/utils.ts';

export function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);

  useEffect(() => {
    setFeedbacks(db.getFeedback());
    setWorkshops(db.getWorkshops());
    return db.subscribe(() => {
      setFeedbacks(db.getFeedback());
    });
  }, []);

  const avgOverall =
    feedbacks.length > 0
      ? (feedbacks.reduce((sum, f) => sum + f.ratingOverall, 0) / feedbacks.length).toFixed(1)
      : '5.0';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            Participant Feedback & Testimonials
          </h1>
          <p className="text-xs text-slate-500">
            Ratings, survey takeaways, and testimonial curation. Quotes require explicit attendee permission before publishing.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-slate-900 dark:text-white">{avgOverall} / 5.0</span>
          <span className="text-slate-500">({feedbacks.length} submissions)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbacks.length === 0 ? (
          <div className="md:col-span-2 py-12 text-center text-slate-500 text-xs bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            No feedback submitted yet. Feedback links are sent to attendees after workshops conclude.
          </div>
        ) : (
          feedbacks.map((fb) => {
            const ws = workshops.find((w) => w.id === fb.workshopId);
            return (
              <Card key={fb.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= fb.ratingOverall
                            ? 'text-amber-500 fill-amber-500'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                    {formatMogadishuTime(fb.submittedAt, { format: 'short' })}
                  </span>
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Workshop: {ws?.title || 'Workshop'}
                </p>

                <div className="space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg text-xs">
                  <p className="font-medium text-slate-700 dark:text-slate-300">
                    "{fb.keyLearnings}"
                  </p>
                  {fb.improvements && (
                    <p className="text-slate-500 text-[11px] pt-1">
                      Improvement suggestion: {fb.improvements}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span
                    className={`font-medium ${
                      fb.allowTestimonial ? 'text-emerald-600' : 'text-slate-400'
                    }`}
                  >
                    {fb.allowTestimonial
                      ? '✓ Allowed for public testimonial'
                      : 'Private feedback only'}
                  </span>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
