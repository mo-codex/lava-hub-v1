import React from 'react';
import { Link } from 'react-router-dom';

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Privacy Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: October 2026</p>
      <div className="max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
        <p>
          Lava Hub values your privacy. We collect minimal personal data required for workshop registration (name, email address, optional WhatsApp number, and experience level) to allocate seats, send verification tokens, and dispatch private workshop links.
        </p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-6 font-display">Data Retention & Protection</h2>
        <p>
          We do not sell or rent participant details. We store only hashed tokens for verification, cancellation, and feedback. You may request data deletion or cancel your registration at any time through your single-use cancellation link.
        </p>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Terms of Service</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: October 2026</p>
      <div className="max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
        <p>
          Welcome to Lava Hub. By registering for or participating in our workshops, you agree to respect community guidelines, maintain professional conduct, and refrain from unauthorized redistribution of live session recordings.
        </p>
        <p>
          All Lava Hub workshops are provided 100% free of charge. No individual or entity is authorized to charge fees for Lava Hub workshop registration or attendance.
        </p>
      </div>
    </div>
  );
}

export function CancellationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">Cancellation Policy</h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: October 2026</p>
      <div className="max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm sm:text-base leading-relaxed">
        <p>
          Seats are limited and high-demand. If you register and are unable to attend, please cancel your registration at least 2 hours before the workshop start time using the cancellation link provided in your confirmation email.
        </p>
        <p>
          Upon cancellation, your seat is automatically offered to the next participant on the waiting list in strict FIFO order.
        </p>
      </div>
    </div>
  );
}
