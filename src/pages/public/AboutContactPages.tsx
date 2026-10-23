import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Flame, Send, CheckCircle2, Star, ShieldCheck, Heart, Sparkles, Users } from 'lucide-react';
import { db } from '../../services/db.ts';
import { Card } from '../../components/ui/Card.tsx';
import { Input, Textarea } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Hero */}
      <div className="space-y-4 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-950 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-orange-600 fill-current" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Bridging the Global Tech Opportunity Gap
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Lava Hub is an open, community-led online workshop platform created to empower young people in Somalia, Somaliland, and the diaspora with practical modern tech skills.
        </p>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            100% Free Forever
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Education should have zero financial friction. All our workshops, code resources, and mentor sessions are free.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Industry Mentorship
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Led by experienced Somali engineers working across the globe in fintech, AI, cloud computing, and product development.
          </p>
        </Card>

        <Card className="p-6 space-y-3">
          <h3 className="font-bold text-base text-slate-900 dark:text-white font-display">
            Practical Projects
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            No endless theory slides. Every workshop ends with a deployed project or real repository you can showcase.
          </p>
        </Card>
      </div>

      {/* Story */}
      <Card className="p-8 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
          Why "Lava Hub"?
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Lava represents energy, transformation, and solid foundations forming under intense pressure. Somalia and the Horn of Africa possess one of the youngest, most resilient populations in the world. By connecting ambitious youth directly with diaspora engineers and practical curriculums, we ignite lasting career transformation.
        </p>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          Our tagline — <strong>Learn. Collaborate. Rise.</strong> — is our collective commitment.
        </p>
      </Card>
    </div>
  );
}

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    db.submitContactMessage(name, email, message);
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Contact Lava Hub
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Have questions, suggestions, or want to mentor a workshop? We would love to hear from you.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Message Delivered!
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Thank you for reaching out. A Lava Hub team member will review your message shortly.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(false);
                setName('');
                setEmail('');
                setMessage('');
              }}
              className="text-xs"
            >
              Send Another Note
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your Name *"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hassan Mohamed"
            />
            <Input
              label="Email Address *"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. hassan@example.com"
            />
            <Textarea
              label="Message *"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help or collaborate?"
            />
            <Button
              type="submit"
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold text-xs"
            >
              Send Message
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}

export function JoinCommunityPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = db.subscribeCommunity(email);
    setMessage(res.message);
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 text-xs font-semibold border border-orange-200 dark:border-orange-900/60">
          <Users className="w-3.5 h-3.5 text-orange-600" />
          <span>Join 2,400+ Somali Tech Builders</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
          Join the Lava Hub Community
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          Be the first to hear about upcoming free workshops, connect with diaspora mentors, share project feedback, and join local tech study circles in Somalia, Somaliland, and abroad.
        </p>
      </div>

      {/* Main Grid: Form & Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Signup Form Card */}
        <Card className="p-6 sm:p-8 space-y-6 shadow-md border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-display">
              Free Membership Signup
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No account password needed. We send cohort links and invites directly to your inbox.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-8 space-y-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl p-6 border border-emerald-500/30">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">You're on the list!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300">{message}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline pt-2 block mx-auto"
              >
                Add another email address
              </button>
            </div>
          ) : (
            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                label="Your Email Address *"
                type="email"
                required
                placeholder="e.g. yourname@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                helperText="We never share your email. You can unsubscribe at any time."
              />
              <Button
                type="submit"
                className="w-full py-3 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold text-xs shadow-sm"
              >
                Join Community Free
              </Button>
            </form>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Free Forever</span>
            </span>
            <span>Africa/Mogadishu (UTC+3)</span>
          </div>
        </Card>

        {/* Community Perks */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Priority Cohort Alerts</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Workshop seats are capped to ensure quality discussion. Community members receive reservation announcements 24 hours before public social posts.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-sm">
              <Users className="w-4 h-4" />
              <span>Peer Study Circles</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Find study partners in Mogadishu, Hargeisa, Garowe, Nairobi, and across Europe & North America to practice JavaScript, React, and Full-Stack challenges.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <Heart className="w-4 h-4" />
              <span>Diaspora Mentorship Q&A</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Get resume, portfolio, and project feedback directly from experienced Somali engineers working at leading tech enterprises.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FeedbackPage() {
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingContent, setRatingContent] = useState(5);
  const [ratingInstructor, setRatingInstructor] = useState(5);
  const [keyLearnings, setKeyLearnings] = useState('');
  const [improvements, setImprovements] = useState('');
  const [allowTestimonial, setAllowTestimonial] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyLearnings) return;
    const ws = db.getWorkshops()[0];
    db.submitFeedback({
      workshopId: ws.id,
      registrationId: `reg-anon-${Date.now()}`,
      ratingOverall,
      ratingContent,
      ratingInstructor,
      keyLearnings,
      improvements,
      allowTestimonial,
    });
    setSubmitted(true);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12 md:py-16 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
          Workshop Feedback
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Your candid feedback helps our volunteer instructors improve future sessions for the Somali tech community.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Thank You for Your Feedback!
            </h2>
            <p className="text-xs text-slate-500">
              Your input has been recorded and will be reviewed by the mentorship team.
            </p>
            <Link to="/workshops" className="inline-block pt-2 text-xs font-semibold text-orange-600">
              Browse More Workshops
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Overall Rating */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
                Overall Experience ({ratingOverall} / 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRatingOverall(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= ratingOverall
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Key Learnings */}
            <Textarea
              label="What was the most valuable thing you learned? *"
              required
              rows={3}
              value={keyLearnings}
              onChange={(e) => setKeyLearnings(e.target.value)}
              placeholder="e.g. Building components, async fetching..."
            />

            {/* Improvements */}
            <Textarea
              label="What could we improve next time?"
              rows={2}
              value={improvements}
              onChange={(e) => setImprovements(e.target.value)}
              placeholder="e.g. More live coding time, longer Q&A..."
            />

            {/* Testimonial Consent Checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                type="checkbox"
                id="testimonialConsent"
                checked={allowTestimonial}
                onChange={(e) => setAllowTestimonial(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-300 text-orange-600 focus:ring-orange-500"
              />
              <label
                htmlFor="testimonialConsent"
                className="text-xs text-slate-600 dark:text-slate-400 leading-snug cursor-pointer"
              >
                Allow Lava Hub to feature my anonymized quote on the website to inspire other young builders.
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold text-xs"
            >
              Submit Feedback
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
