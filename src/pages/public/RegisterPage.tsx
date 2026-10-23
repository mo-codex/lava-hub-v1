import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Flame,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Registration } from '../../types/index.ts';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Input, Select } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';

const registrationSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name (at least 2 characters)'),
  email: z.string().email('Please enter a valid email address'),
  whatsapp: z.string().optional(),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced']),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export function RegisterPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    success: boolean;
    status: 'confirmed' | 'waitlisted' | 'already_registered';
    registration?: Registration;
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsapp: '',
      experienceLevel: 'beginner',
    },
  });

  useEffect(() => {
    if (!slug) return;
    const ws = db.getWorkshopBySlug(slug, false);
    if (ws) {
      setWorkshop(ws);
    }
  }, [slug]);

  if (!workshop) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-slate-500">Workshop not found.</p>
        <Link to="/workshops" className="text-sm font-semibold text-orange-600 hover:underline">
          Return to Workshops
        </Link>
      </div>
    );
  }

  const remainingSeats = calculateRemainingSeats(workshop.capacity, workshop.confirmedCount);
  const isWaitlist = remainingSeats === 0;

  const onSubmit = (data: RegistrationFormData) => {
    const res = db.registerGuest({
      workshopId: workshop.id,
      fullName: data.fullName,
      email: data.email,
      whatsapp: data.whatsapp,
      experienceLevel: data.experienceLevel,
    });

    if (res.message.includes('already have an active registration')) {
      setSubmissionResult({
        success: true,
        status: 'already_registered',
        registration: res.registration,
        message: 'You already have an active registration for this workshop.',
      });
    } else {
      setSubmissionResult({
        success: res.success,
        status: res.status as 'confirmed' | 'waitlisted',
        registration: res.registration,
        message: res.message,
      });
    }
  };

  // Submission Result View
  if (submissionResult) {
    return (
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <Card className="p-8 text-center space-y-6 shadow-xl border-slate-200 dark:border-slate-800">
          {submissionResult.status === 'confirmed' ? (
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          ) : submissionResult.status === 'waitlisted' ? (
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>
          )}

          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
              {submissionResult.status === 'confirmed'
                ? 'Your Seat is Confirmed!'
                : submissionResult.status === 'waitlisted'
                ? 'You are on the Waiting List'
                : 'Registration Already Active'}
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              {submissionResult.message}
            </p>
          </div>

          {/* Workshop Details Box */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700">
            <p className="font-semibold text-slate-900 dark:text-white text-sm">
              {workshop.title}
            </p>
            <p className="text-slate-500 font-mono tabular-nums">
              📅 {formatMogadishuTime(workshop.startTime, { format: 'full' })}
            </p>
            <p className="text-slate-500">
              👤 Registered as: <strong>{submissionResult.registration?.fullName}</strong> ({submissionResult.registration?.email})
            </p>
            {submissionResult.status === 'confirmed' && (
              <p className="text-emerald-600 font-medium pt-1">
                ✓ A confirmation email with workshop guidelines has been sent.
              </p>
            )}
          </div>

          {/* Single-use Cancellation Link Notice */}
          {submissionResult.registration?.cancellationCode && (
            <div className="pt-2 text-xs text-slate-500 space-y-2">
              <p>
                Cannot make it? You can cancel your seat anytime to give someone on the waitlist a chance:
              </p>
              <Link
                to={`/registration/cancel?token=${submissionResult.registration.cancellationCode}`}
                className="text-xs font-semibold text-rose-600 hover:underline"
              >
                Cancel Registration
              </Link>
            </div>
          )}

          <div className="pt-4 flex items-center justify-center gap-3">
            <Link
              to="/workshops"
              className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
            >
              Browse More Workshops
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-6">
      <Link
        to={`/workshops/${workshop.slug}`}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Workshop Details
      </Link>

      {/* Workshop Summary Banner */}
      <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 space-y-1">
        <div className="flex items-center justify-between text-xs font-semibold text-orange-900 dark:text-orange-300">
          <span>{workshop.category}</span>
          <span className="font-mono tabular-nums">
            {isWaitlist ? 'Waiting List' : `${remainingSeats} seats available`}
          </span>
        </div>
        <h2 className="text-sm font-bold text-slate-900 dark:text-white font-display">
          {workshop.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-mono tabular-nums">
          {formatMogadishuTime(workshop.startTime, { format: 'short' })}
        </p>
      </div>

      {/* Registration Form Card */}
      <Card className="p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white">
            {isWaitlist ? 'Join the Waiting List' : 'Free Workshop Registration'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {isWaitlist
              ? 'This session is full. Enter your details to automatically receive a seat offer if someone cancels.'
              : 'Guest registration. No student password or account required.'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Ayan Ali Farah"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="e.g. ayan@example.com"
            error={errors.email?.message}
            helperText="Your workshop confirmation and joining details will be sent here."
            {...register('email')}
          />

          <Input
            label="WhatsApp Number (Optional)"
            type="tel"
            placeholder="e.g. +252 61 5000000"
            helperText="Optional for calendar and SMS reminder updates."
            error={errors.whatsapp?.message}
            {...register('whatsapp')}
          />

          <Select
            label="Experience Level *"
            error={errors.experienceLevel?.message}
            options={[
              { label: 'Beginner (New to this topic)', value: 'beginner' },
              { label: 'Intermediate (Built some projects)', value: 'intermediate' },
              { label: 'Advanced (Professional experience)', value: 'advanced' },
            ]}
            {...register('experienceLevel')}
          />

          <div className="pt-2">
            <Button
              type="submit"
              isLoading={isSubmitting}
              className="w-full py-3 text-sm font-bold bg-[#FF5722] hover:bg-[#F4511E] text-slate-950"
            >
              {isWaitlist ? 'Join Priority Waitlist' : 'Confirm Free Registration'}
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Free · We respect your privacy · No spam</span>
          </div>
        </form>
      </Card>
    </div>
  );
}
