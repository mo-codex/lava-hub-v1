import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  ArrowRight,
  Code,
  Users,
  Award,
  Calendar,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Globe,
  ShieldCheck,
  BookOpen,
  XCircle,
  Send,
  Bell,
} from 'lucide-react';
import { db } from '../../services/db.ts';
import { Workshop, Instructor } from '../../types/index.ts';
import { useT } from '../../i18n/LanguageContext.tsx';
import { formatMogadishuTime, calculateRemainingSeats } from '../../lib/utils.ts';
import { Card } from '../../components/ui/Card.tsx';

export function HomePage() {
  const { t, language } = useT();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [communityEmail, setCommunityEmail] = useState('');
  const [communitySubmitted, setCommunitySubmitted] = useState(false);
  const [communityMessage, setCommunityMessage] = useState('');

  useEffect(() => {
    const refresh = () => {
      setWorkshops(db.getPublicWorkshops().slice(0, 3));
      setInstructors(db.getInstructors().slice(0, 4));
    };
    refresh();
    return db.subscribe(refresh);
  }, []);

  const handleCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityEmail) return;
    const res = db.subscribeCommunity(communityEmail);
    setCommunityMessage(res.message);
    setCommunitySubmitted(true);
  };

  const faqs = [
    {
      q: language === 'so' ? 'Aqoon-is-weydaarsiyadu ma runbaa inay bilaash yihiin?' : 'Are workshops really 100% free?',
      a: language === 'so'
        ? 'Haa, dhammaan aqoon-is-weydaarsiyada Lava Hub waa bilaash weligood. Ma jiraan wax khidmad ah oo qarsoon ama lacag-bixin ah.'
        : 'Yes, every Lava Hub workshop is 100% free of charge. No credit card, deposit, or paid tier is ever required.',
    },
    {
      q: language === 'so' ? 'Ma u baahanahay inaan samaysto akoon arday?' : 'Do I need to create a student account to attend?',
      a: language === 'so'
        ? 'Maya! Waxaad ku diiwaangashan kartaa qaab marti ah (guest registration) adigoo isticmaalaya magacaaga iyo emailkaaga.'
        : 'No student account or password is required. You can register as a guest using your email, and joining details will be dispatched directly to your inbox.',
    },
    {
      q: language === 'so' ? 'Maxaa dhacaya haddii kuraastu buuxsanto?' : 'What happens if a workshop is fully booked?',
      a: language === 'so'
        ? 'Waxaad si toos ah ugu biiri kartaa liiska sugitaanka (waiting list). Haddii qof ka baxo, kursiga waxaa loo fidinayaa qofka ugu horreeya liiska.'
        : 'You will be placed on our automated FIFO waiting list. When a registered participant cancels, seats automatically cascade to the next eligible person.',
    },
    {
      q: language === 'so' ? 'Xilligee ayaa kalfadhiyada tooska ah la qabtaa?' : 'What timezone are the workshops scheduled in?',
      a: language === 'so'
        ? 'Dhammaan waqtiyada waxaa lagu soo bandhigaa Waqtiga Bariga Afrika (Africa/Mogadishu, UTC+3) si ay ugu habboonaato dhalinyarada dalka iyo gobolka.'
        : 'All workshops are scheduled and displayed in East Africa Time (Africa/Mogadishu, UTC+3), optimized for learners across Somalia, Somaliland, and neighboring regions.',
    },
  ];

  return (
    <div className="space-y-20 py-8 md:py-16">
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-950 dark:text-orange-300 text-xs font-semibold tracking-wide border border-orange-200 dark:border-orange-900/60">
            <Flame className="w-3.5 h-3.5 text-orange-600 fill-current" />
            <span>{t('hero.tagline')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight font-display">
            {t('hero.headline')}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {t('hero.description')}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/workshops"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-slate-950 bg-[#FF5722] hover:bg-[#F4511E] rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              <span>{t('hero.ctaWorkshops')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/join"
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl transition-colors flex items-center justify-center"
            >
              <span>{t('hero.ctaCommunity')}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CORE BENEFITS / PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('pillars.practical')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillars.practicalDesc')}
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('pillars.free')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillars.freeDesc')}
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              {t('pillars.community')}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t('pillars.communityDesc')}
            </p>
          </Card>
        </div>
      </section>

      {/* 3. HOW IT WORKS (3 Simple Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            How Lava Hub Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Zero friction, zero account passwords. Designed for immediate learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-md">
              Step 01
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Browse Workshop Catalog
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Select upcoming live sessions across Web Dev, JavaScript, React, and AI led by seasoned mentors.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-md">
              Step 02
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Register as Guest in 30 Seconds
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Enter your name and email to immediately reserve your seat or join the automatic priority waitlist.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 dark:bg-orange-950/40 px-2.5 py-1 rounded-md">
              Step 03
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
              Join Live & Build Projects
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Receive your private joining link, attend live on Zoom / Google Meet, write code, and ask questions.
            </p>
          </div>
        </div>
      </section>

      {/* 4. UPCOMING WORKSHOPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Upcoming Live Cohorts
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Interactive sessions with capped seat capacity for focused, personal mentorship.
            </p>
          </div>
          <Link
            to="/workshops"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
          >
            <span>View All Workshops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {workshops.map((ws) => {
            const remainingSeats = calculateRemainingSeats(ws.capacity, ws.confirmedCount);
            const isFull = remainingSeats === 0;
            const isCancelled = ws.status === 'cancelled';

            return (
              <Card
                key={ws.id}
                className={`flex flex-col justify-between overflow-hidden group hover:shadow-lg transition-all ${
                  isCancelled ? 'opacity-85 border-red-200 dark:border-red-900/40' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="h-44 -mx-6 -mt-6 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                    <img
                      src={ws.coverImage}
                      alt={ws.title}
                      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                        isCancelled ? 'grayscale-50' : ''
                      }`}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                      <span>{ws.category}</span>
                      {isCancelled ? (
                        <span className="font-mono text-[11px] bg-red-600 px-2 py-0.5 rounded font-bold">
                          Cancelled
                        </span>
                      ) : (
                        <span className="font-mono tabular-nums bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                          Free
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatMogadishuTime(ws.startTime, { format: 'short' })}</span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-orange-600 font-display line-clamp-2">
                      {ws.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {ws.summary}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs font-mono tabular-nums">
                    {isCancelled ? (
                      <span className="text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 font-sans">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Cohort Cancelled</span>
                      </span>
                    ) : isFull ? (
                      <span className="text-amber-600 font-semibold">Waitlist Open</span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">{remainingSeats} seats left</span>
                    )}
                  </div>
                  <Link
                    to={`/workshops/${ws.slug}`}
                    className="text-xs font-semibold text-slate-900 dark:text-white hover:text-orange-600 inline-flex items-center gap-1"
                  >
                    <span>Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* 5. FEATURED INSTRUCTORS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
              Learn from Industry Mentors
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Engineers from the Somali diaspora giving back to upskill youth in Somalia and Somaliland.
            </p>
          </div>
          <Link
            to="/instructors"
            className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0"
          >
            <span>View All Mentors</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((inst) => (
            <Card key={inst.id} className="p-5 space-y-3 text-center">
              <img
                src={inst.photoUrl}
                alt={inst.name}
                className="w-20 h-20 rounded-full mx-auto object-cover object-top border-2 border-orange-500/20"
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display">
                  {inst.name}
                </h3>
                <p className="text-xs text-orange-600 font-medium">{inst.role}</p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                {inst.bio}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* 6. AUTHENTIC TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 space-y-8">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">
              Community Voices
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display">
              Real Impact for Young Builders
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "The React 19 session helped me land my first junior frontend freelance client in Hargeisa. Practical live coding beats reading theory any day."
              </p>
              <div className="pt-2 text-xs">
                <p className="font-bold text-white">Guled Farah</p>
                <p className="text-slate-400 text-[11px]">Frontend Developer, Somaliland</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Being able to ask questions directly to Somali engineers working in Europe gave me the confidence to build my own AI web apps."
              </p>
              <div className="pt-2 text-xs">
                <p className="font-bold text-white">Khadra Warsame</p>
                <p className="text-slate-400 text-[11px]">CS Student, Mogadishu</p>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-3">
              <p className="text-xs text-slate-300 leading-relaxed italic">
                "Lava Hub represents what tech education should look like: open, free, zero gatekeeping, and built by our own community."
              </p>
              <div className="pt-2 text-xs">
                <p className="font-bold text-white">Ahmed Bile</p>
                <p className="text-slate-400 text-[11px]">Diaspora Mentor, London</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Everything you need to know about attending workshops on Lava Hub.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between text-sm font-semibold text-slate-900 dark:text-white"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. INTERACTIVE JOIN COMMUNITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-xl overflow-hidden relative">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Col: Info & Perks */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-semibold border border-orange-500/30">
                <Users className="w-3.5 h-3.5" />
                <span>Join 2,400+ Ambitious Tech Learners</span>
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight leading-tight">
                  Join the Lava Hub Community
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                  Connect with peer learners across Mogadishu, Hargeisa, Garowe, and the global diaspora. Get instant alerts when workshop seats open, participate in group code challenges, and build practical projects together.
                </p>
              </div>

              {/* 3 Value Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="text-orange-400 font-bold text-xs flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5" />
                    <span>Priority Alerts</span>
                  </div>
                  <p className="text-[11px] text-slate-400">First notice when limited-seat cohorts open.</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="text-sky-400 font-bold text-xs flex items-center gap-1.5">
                    <Code className="w-3.5 h-3.5" />
                    <span>Study Groups</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Collaborate on repositories and assignments.</p>
                </div>

                <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-3.5 space-y-1">
                  <div className="text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>Mentor Q&A</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Direct advice from diaspora engineers.</p>
                </div>
              </div>
            </div>

            {/* Right Col: Instant Interactive Signup Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 sm:p-7 shadow-lg space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-display">
                    Get Free Community Access
                  </h3>
                  <p className="text-xs text-slate-400">
                    Zero spam. Unsubscribe anytime with 1 click.
                  </p>
                </div>

                {communitySubmitted ? (
                  <div className="py-6 text-center space-y-3 bg-slate-900/60 rounded-xl p-4 border border-emerald-500/30">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Welcome Aboard!</h4>
                      <p className="text-xs text-slate-300">{communityMessage}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCommunitySubmitted(false);
                        setCommunityEmail('');
                      }}
                      className="text-[11px] font-semibold text-orange-400 hover:underline pt-2 inline-block"
                    >
                      Subscribe another email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleCommunitySubmit} className="space-y-3">
                    <div>
                      <label htmlFor="homeCommunityEmail" className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                        Your Email Address
                      </label>
                      <input
                        id="homeCommunityEmail"
                        type="email"
                        required
                        placeholder="e.g. yourname@example.com"
                        value={communityEmail}
                        onChange={(e) => setCommunityEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-900 border border-slate-600 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-950 bg-[#FF5722] hover:bg-[#F4511E] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <span>Join Lava Hub Community Free</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>100% Free Forever</span>
                      </span>
                      <Link to="/join" className="text-orange-400 hover:underline font-medium">
                        Learn more →
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
