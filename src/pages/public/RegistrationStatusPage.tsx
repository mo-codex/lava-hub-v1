import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Button } from '../../components/ui/Button.tsx';

export function RegistrationStatusPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const type = searchParams.get('type') || 'verify';

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
          Email Verified Successfully
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Your email address has been verified. Your seat is confirmed for the upcoming workshop.
        </p>
      </div>
      <div className="pt-2">
        <Link
          to="/workshops"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800"
        >
          <span>Explore All Workshops</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export function RegistrationCancelPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'idle' | 'cancelled' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [promotedEmail, setPromotedEmail] = useState<string | undefined>();

  const handleCancel = () => {
    if (!token) {
      setStatus('error');
      setMessage('Missing or invalid cancellation token.');
      return;
    }

    const res = db.cancelRegistration(token);
    if (res.success) {
      setStatus('cancelled');
      setMessage(res.message);
      setPromotedEmail(res.promotedEmail);
    } else {
      setStatus('error');
      setMessage(res.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <Card className="p-8 space-y-6">
        {status === 'cancelled' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Registration Cancelled
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
              {promotedEmail && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium pt-2">
                  ✓ Your seat was automatically offered to the next waitlisted student ({promotedEmail}). Thank you for keeping workshops accessible!
                </p>
              )}
            </div>
            <div className="pt-4">
              <Link
                to="/workshops"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-medium text-xs hover:bg-slate-800"
              >
                <span>Browse Other Workshops</span>
              </Link>
            </div>
          </>
        ) : status === 'error' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white">
                Cancellation Error
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">{message}</p>
            </div>
            <Link
              to="/workshops"
              className="inline-flex items-center text-xs font-semibold text-orange-600 hover:underline"
            >
              Return to Catalog
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                Confirm Cancellation
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Are you sure you want to cancel your seat? Once cancelled, your seat will be automatically given to the next person waiting.
              </p>
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="danger"
                onClick={handleCancel}
                className="w-full py-2.5 text-xs font-bold"
              >
                Yes, Cancel My Registration
              </Button>
              <Link
                to="/"
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white py-1"
              >
                Never mind, keep my seat
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export function WaitlistAcceptPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
      <Card className="p-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-600 flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
            {accepted ? 'Seat Confirmed!' : 'A Seat Opened Up!'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {accepted
              ? 'You have accepted the seat offer. Your registration is now confirmed!'
              : 'You have been promoted from the waiting list. Click below to claim your seat.'}
          </p>
        </div>
        {!accepted ? (
          <Button
            onClick={() => setAccepted(true)}
            className="w-full py-3 text-xs font-bold bg-[#FF5722] hover:bg-[#F4511E] text-slate-950"
          >
            Claim My Free Seat
          </Button>
        ) : (
          <Link
            to="/workshops"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800"
          >
            Go to Workshops
          </Link>
        )}
      </Card>
    </div>
  );
}
