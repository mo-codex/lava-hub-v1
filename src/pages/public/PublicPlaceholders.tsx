import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, ShieldCheck, Mail, Users } from 'lucide-react';

export function WorkshopDetailPage() {
  const { slug } = useParams();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Link to="/workshops" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Workshops
      </Link>
      <h1 className="text-3xl font-bold font-display text-slate-900">Workshop Details</h1>
      <p className="text-slate-600">Viewing workshop slug: <code className="bg-slate-100 px-2 py-0.5 rounded text-sm">{slug}</code></p>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Workshop details, agenda, and registration button will be populated in Milestone 03.</p>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { slug } = useParams();
  return (
    <div className="max-w-lg mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-bold font-display text-slate-900">Register for Workshop</h1>
      <p className="text-sm text-slate-600">Registering for: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">{slug}</code></p>
      <div className="bg-white p-6 rounded-xl border border-slate-200">
        <p className="text-sm text-slate-500">Guest registration form (Milestone 07) will be connected here.</p>
      </div>
    </div>
  );
}

export function RegistrationStatusPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <ShieldCheck className="w-12 h-12 text-emerald-600 mx-auto" />
      <h1 className="text-2xl font-bold font-display text-slate-900">Registration Status</h1>
      <p className="text-sm text-slate-600">Verification & confirmation landing flow.</p>
    </div>
  );
}

export function RegistrationCancelPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <Clock className="w-12 h-12 text-amber-600 mx-auto" />
      <h1 className="text-2xl font-bold font-display text-slate-900">Cancel Registration</h1>
      <p className="text-sm text-slate-600">Secure single-use cancellation confirmation.</p>
    </div>
  );
}

export function WaitlistAcceptPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <ShieldCheck className="w-12 h-12 text-orange-600 mx-auto" />
      <h1 className="text-2xl font-bold font-display text-slate-900">Accept Seat Offer</h1>
      <p className="text-sm text-slate-600">Waiting list seat promotion and acceptance flow.</p>
    </div>
  );
}

export function FeedbackPage() {
  const { token } = useParams();
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
      <h1 className="text-2xl font-bold font-display text-slate-900">Workshop Feedback</h1>
      <p className="text-sm text-slate-600">Token-authorized feedback survey (Milestone 13).</p>
    </div>
  );
}

export function InstructorsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold font-display text-slate-900">Instructors Directory</h1>
      <p className="text-slate-600">Meet the industry mentors and workshop leads.</p>
      <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
        Instructor profiles will be populated in Milestone 03 & 11.
      </div>
    </div>
  );
}

export function InstructorDetailPage() {
  const { slug } = useParams();
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Link to="/instructors" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-800">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Instructors
      </Link>
      <h1 className="text-3xl font-bold font-display text-slate-900">Instructor Profile</h1>
      <p className="text-sm text-slate-600">Instructor: <code className="bg-slate-100 px-1.5 py-0.5 rounded">{slug}</code></p>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold font-display text-slate-900">About Lava Hub</h1>
      <p className="text-lg text-slate-600 leading-relaxed">
        Lava Hub was created to unlock practical technical education for young people in Somalia, Somaliland, and the diaspora.
      </p>
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-700 space-y-3">
        <h2 className="font-bold text-slate-900">Our Mission</h2>
        <p className="text-sm leading-relaxed">
          Democratize high-impact tech skills through live interactive workshops, open collaboration, and community-driven mentorship.
        </p>
      </div>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold font-display text-slate-900">Contact Lava Hub</h1>
      <p className="text-slate-600 text-sm">Have a question or want to host a workshop? Send us a message.</p>
      <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Email</label>
          <input type="email" placeholder="you@example.com" className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" readOnly />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">Message</label>
          <textarea rows={4} placeholder="Your message..." className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm" readOnly />
        </div>
        <button type="button" className="w-full py-2.5 bg-slate-900 text-white rounded-lg text-sm font-semibold">
          Contact Form (Milestone 03)
        </button>
      </div>
    </div>
  );
}

export function JoinCommunityPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <h1 className="text-3xl font-bold font-display text-slate-900">Join Lava Hub Community</h1>
      <p className="text-slate-600 text-sm">Get notified about upcoming free workshops and collaborate with fellow builders.</p>
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-sm text-slate-500">
        Community signup form (Milestone 13A) will be active here.
      </div>
    </div>
  );
}
