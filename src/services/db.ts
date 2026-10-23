/**
 * Lava Hub Universal Data Service
 * Enforces business logic, atomic seat allocations, FIFO waitlist cascades, and token security.
 */

import {
  Workshop,
  Instructor,
  Registration,
  AttendanceRecord,
  FeedbackSubmission,
  RegistrationStatus,
  AttendanceStatus,
} from '../types/index.ts';
import { normalizeEmail, calculateRemainingSeats } from '../lib/utils.ts';

// Initial Seed Instructors
const INITIAL_INSTRUCTORS: Instructor[] = [
  {
    id: 'inst-1',
    slug: 'ayan-ali-farah',
    name: 'Ayan Ali Farah',
    role: 'Senior Frontend Architect',
    bio: '8+ years leading frontend engineering at global tech startups. Dedicated to empowering East African tech talent through practical modern web development.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    expertise: ['React', 'TypeScript', 'Design Systems', 'Performance'],
    socialLinks: { github: 'https://github.com', linkedin: 'https://linkedin.com' },
  },
  {
    id: 'inst-2',
    slug: 'mohamed-aden-nur',
    name: 'Mohamed Aden Nur',
    role: 'AI Engineer & Researcher',
    bio: 'Specialist in machine learning applications, prompt engineering, and LLM orchestration. Active contributor in Somali diaspora tech circles.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    expertise: ['AI & ML', 'Python', 'LLM Integrations', 'REST APIs'],
    socialLinks: { github: 'https://github.com', twitter: 'https://twitter.com' },
  },
  {
    id: 'inst-3',
    slug: 'fartun-hassan-omar',
    name: 'Fartun Hassan Omar',
    role: 'Full-Stack Developer & Mentor',
    bio: 'Specializes in JavaScript ecosystems, Node.js, and databases. Dedicated to leading community workshops for aspiring developers in Mogadishu and Hargeisa.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    expertise: ['JavaScript', 'Node.js', 'PostgreSQL', 'Web Development'],
    socialLinks: { github: 'https://github.com' },
  },
  {
    id: 'inst-4',
    slug: 'khalid-ismail-warsame',
    name: 'Khalid Ismail Warsame',
    role: 'Cloud & Systems Engineer',
    bio: 'Specializes in scalable web systems, containerization, and automated workflows. Co-organizer of community coding initiatives.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    expertise: ['Docker', 'Cloud Infrastructure', 'Web Dev', 'Linux'],
    socialLinks: { linkedin: 'https://linkedin.com' },
  },
];

// Initial Seed Workshops
const INITIAL_WORKSHOPS: Workshop[] = [
  {
    id: 'ws-1',
    slug: 'modern-react-from-scratch-2026',
    title: 'Building Interactive Web Apps with Modern React',
    summary: 'Learn component design, reactive state, accessible UI, and modern hooks by building a live application.',
    description:
      'This comprehensive hands-on workshop takes you from React fundamentals to building a live, responsive dashboard. Learn how industry engineers structure scalable components, manage reactive state, and leverage Tailwind CSS for accessible web apps.',
    category: 'React',
    coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    capacity: 35,
    confirmedCount: 32,
    waitlistCount: 4,
    startTime: '2026-11-05T15:00:00Z',
    endTime: '2026-11-05T17:30:00Z',
    timezone: 'Africa/Mogadishu',
    registrationOpenDate: '2026-10-15T00:00:00Z',
    registrationCloseDate: '2026-11-05T13:00:00Z',
    status: 'published',
    instructorIds: ['inst-1'],
    prerequisites: ['Basic HTML & CSS knowledge', 'Familiarity with JavaScript variables and functions', 'Computer with web browser'],
    agenda: [
      { time: '00:00 - 00:30', topic: 'Modern React Architecture & Component Foundations' },
      { time: '00:30 - 01:15', topic: 'State, Props & Interactive Hooks' },
      { time: '01:15 - 02:00', topic: 'Building the Practical Project' },
      { time: '02:00 - 02:30', topic: 'Live Q&A, Code Review & Community Discussion' },
    ],
    privateMeetingUrl: 'https://zoom.us/j/98765432101',
    privateMeetingPassword: 'LAVA2026_REACT',
  },
  {
    id: 'ws-2',
    slug: 'javascript-async-apis-deep-dive',
    title: 'Mastering Asynchronous JavaScript & REST APIs',
    summary: 'Demystify Promises, async/await, HTTP error handling, and live API integrations.',
    description:
      'Asynchronous code is the core engine of modern web development. In this interactive session, you will learn the event loop, handle real API data streams, build resilient network calls, and eliminate unhandled promise rejections.',
    category: 'JavaScript',
    coverImage: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800',
    capacity: 40,
    confirmedCount: 28,
    waitlistCount: 0,
    startTime: '2026-11-12T15:00:00Z',
    endTime: '2026-11-12T17:00:00Z',
    timezone: 'Africa/Mogadishu',
    registrationOpenDate: '2026-10-18T00:00:00Z',
    registrationCloseDate: '2026-11-12T13:00:00Z',
    status: 'published',
    instructorIds: ['inst-3'],
    prerequisites: ['Basic JavaScript syntax', 'Code editor (VS Code recommended)'],
    agenda: [
      { time: '00:00 - 00:30', topic: 'The JS Event Loop & Callbacks Explained' },
      { time: '00:30 - 01:15', topic: 'Modern Promises & Async/Await In Action' },
      { time: '01:15 - 02:00', topic: 'Hands-On API Project & Live Troubleshooting' },
    ],
    privateMeetingUrl: 'https://meet.google.com/lav-ahub-jsm',
    privateMeetingPassword: 'LAVA_JS',
  },
  {
    id: 'ws-3',
    slug: 'ai-applications-developer-primer',
    title: 'Building AI-Powered Web Applications with Modern APIs',
    summary: 'Connect web apps to modern AI foundation models, craft structured prompts, and implement streaming UI.',
    description:
      'Learn how software engineers integrate generative AI into practical web apps. We will cover prompt engineering, structured JSON responses, streaming text and media, and rate-limiting safeguards.',
    category: 'AI',
    coverImage: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
    capacity: 30,
    confirmedCount: 30,
    waitlistCount: 7,
    startTime: '2026-11-19T15:00:00Z',
    endTime: '2026-11-19T17:30:00Z',
    timezone: 'Africa/Mogadishu',
    registrationOpenDate: '2026-10-20T00:00:00Z',
    registrationCloseDate: '2026-11-19T13:00:00Z',
    status: 'published',
    instructorIds: ['inst-2'],
    prerequisites: ['Intermediate JavaScript or TypeScript', 'Basic command line familiarity'],
    agenda: [
      { time: '00:00 - 00:45', topic: 'AI APIs & Structured Output Schemas' },
      { time: '00:45 - 01:45', topic: 'Live Coding: Streaming Assistant Interface' },
      { time: '01:45 - 02:30', topic: 'Production Safeguards & Q&A' },
    ],
    privateMeetingUrl: 'https://zoom.us/j/98765432103',
    privateMeetingPassword: 'LAVA_AI_PRO',
  },
  {
    id: 'ws-4',
    slug: 'responsive-web-design-tailwind-v4',
    title: 'Responsive Web Design with Modern CSS & Tailwind',
    summary: 'Design and code stunning, mobile-first web pages that adapt cleanly across all devices.',
    description:
      'Master CSS grid, flexbox, fluid clamp typography, mobile touch ergonomics, and the ultra-fast engine of Tailwind CSS v4.',
    category: 'Web Development',
    coverImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    capacity: 50,
    confirmedCount: 15,
    waitlistCount: 0,
    startTime: '2026-11-26T15:00:00Z',
    endTime: '2026-11-26T17:00:00Z',
    timezone: 'Africa/Mogadishu',
    registrationOpenDate: '2026-10-25T00:00:00Z',
    registrationCloseDate: '2026-11-26T13:00:00Z',
    status: 'published',
    instructorIds: ['inst-1', 'inst-4'],
    prerequisites: ['No prior coding required', 'Curiosity and a web browser'],
    agenda: [
      { time: '00:00 - 00:30', topic: 'CSS Layout Mechanics: Flexbox vs Grid' },
      { time: '00:30 - 01:15', topic: 'Tailwind Tokens, Radii & Typography Scales' },
      { time: '01:15 - 02:00', topic: 'Build a Live Responsive Landing Page' },
    ],
    privateMeetingUrl: 'https://meet.google.com/lav-tail-wind',
  },
];

// Seed Registrations
const INITIAL_REGISTRATIONS: Registration[] = [
  {
    id: 'reg-1',
    workshopId: 'ws-1',
    fullName: 'Hamza Abdi Warsame',
    email: 'hamza.warsame@example.com',
    whatsapp: '+252615000001',
    experienceLevel: 'intermediate',
    status: 'confirmed',
    verificationToken: 'token-verify-1',
    cancellationCode: 'cancel-hamza-1',
    createdAt: '2026-10-21T08:30:00Z',
    updatedAt: '2026-10-21T08:35:00Z',
  },
  {
    id: 'reg-2',
    workshopId: 'ws-1',
    fullName: 'Fadumo Jama Elmi',
    email: 'fadumo.elmi@example.com',
    whatsapp: '+252615000002',
    experienceLevel: 'beginner',
    status: 'confirmed',
    verificationToken: 'token-verify-2',
    cancellationCode: 'cancel-fadumo-2',
    createdAt: '2026-10-21T09:15:00Z',
    updatedAt: '2026-10-21T09:20:00Z',
  },
  {
    id: 'reg-3',
    workshopId: 'ws-3',
    fullName: 'Yusuf Hassan Ali',
    email: 'yusuf.ali@example.com',
    whatsapp: '+252615000003',
    experienceLevel: 'advanced',
    status: 'waitlisted',
    verificationToken: 'token-verify-3',
    cancellationCode: 'cancel-yusuf-3',
    createdAt: '2026-10-22T10:00:00Z',
    updatedAt: '2026-10-22T10:00:00Z',
  },
];

export interface EmailDeliveryRecord {
  id: string;
  recipientEmail: string;
  eventType: string;
  subject: string;
  status: 'delivered' | 'queued' | 'failed';
  providerMessageId: string;
  timestamp: string;
}

export interface WaitlistOffer {
  id: string;
  registrationId: string;
  tokenHash: string;
  expiresAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

class LavaHubDatabase {
  private workshops: Workshop[] = [];
  private instructors: Instructor[] = [];
  private registrations: Registration[] = [];
  private attendance: AttendanceRecord[] = [];
  private feedback: FeedbackSubmission[] = [];
  private emailDeliveries: EmailDeliveryRecord[] = [];
  private waitlistOffers: WaitlistOffer[] = [];
  private contactMessages: { id: string; name: string; email: string; message: string; date: string }[] = [];
  private communitySubscribers: { id: string; email: string; date: string }[] = [];
  private regSeq = 0;
  private listeners: (() => void)[] = [];

  constructor() {
    this.loadState();
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('lavahub_')) {
          this.loadState();
          this.notify();
        }
      });
    }
  }

  private loadState() {
    try {
      const storedWorkshops = localStorage.getItem('lavahub_workshops');
      const storedInstructors = localStorage.getItem('lavahub_instructors');
      const storedRegistrations = localStorage.getItem('lavahub_registrations');
      const storedAttendance = localStorage.getItem('lavahub_attendance');
      const storedFeedback = localStorage.getItem('lavahub_feedback');
      const storedEmails = localStorage.getItem('lavahub_emails');
      const storedOffers = localStorage.getItem('lavahub_offers');
      const storedMessages = localStorage.getItem('lavahub_messages');
      const storedCommunity = localStorage.getItem('lavahub_community');

      this.workshops = storedWorkshops ? JSON.parse(storedWorkshops) : INITIAL_WORKSHOPS;
      this.instructors = storedInstructors ? JSON.parse(storedInstructors) : INITIAL_INSTRUCTORS;
      this.registrations = storedRegistrations ? JSON.parse(storedRegistrations) : INITIAL_REGISTRATIONS;
      this.attendance = storedAttendance ? JSON.parse(storedAttendance) : [];
      this.feedback = storedFeedback ? JSON.parse(storedFeedback) : [];
      this.emailDeliveries = storedEmails ? JSON.parse(storedEmails) : [];
      this.waitlistOffers = storedOffers ? JSON.parse(storedOffers) : [];
      this.contactMessages = storedMessages ? JSON.parse(storedMessages) : [];
      this.communitySubscribers = storedCommunity ? JSON.parse(storedCommunity) : [];
    } catch {
      this.workshops = INITIAL_WORKSHOPS;
      this.instructors = INITIAL_INSTRUCTORS;
      this.registrations = INITIAL_REGISTRATIONS;
    }
  }

  private persist() {
    try {
      localStorage.setItem('lavahub_workshops', JSON.stringify(this.workshops));
      localStorage.setItem('lavahub_instructors', JSON.stringify(this.instructors));
      localStorage.setItem('lavahub_registrations', JSON.stringify(this.registrations));
      localStorage.setItem('lavahub_attendance', JSON.stringify(this.attendance));
      localStorage.setItem('lavahub_feedback', JSON.stringify(this.feedback));
      localStorage.setItem('lavahub_emails', JSON.stringify(this.emailDeliveries));
      localStorage.setItem('lavahub_offers', JSON.stringify(this.waitlistOffers));
      localStorage.setItem('lavahub_messages', JSON.stringify(this.contactMessages));
      localStorage.setItem('lavahub_community', JSON.stringify(this.communitySubscribers));
    } catch {
      // ignore
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // --- WORKSHOPS ---
  public getWorkshops(): Workshop[] {
    return [...this.workshops];
  }

  public getPublishedWorkshops(): Workshop[] {
    return this.workshops.filter((w) => w.status === 'published');
  }

  public getPublicWorkshops(): Workshop[] {
    // Return published and cancelled workshops so students see active catalog & cancellations
    return this.workshops.filter((w) => w.status === 'published' || w.status === 'cancelled');
  }

  public getWorkshopBySlug(slugOrId: string, isAuthenticatedAdmin = false): Workshop | undefined {
    const ws = this.workshops.find((w) => w.slug === slugOrId || w.id === slugOrId);
    if (!ws) return undefined;
    if (isAuthenticatedAdmin) return ws;
    // Security: sanitize meeting link from public view
    const { privateMeetingUrl, privateMeetingPassword, ...safeWs } = ws;
    return safeWs as Workshop;
  }

  public getWorkshopById(id: string, isAuthenticatedAdmin = false): Workshop | undefined {
    const ws = this.workshops.find((w) => w.id === id);
    if (!ws) return undefined;
    if (isAuthenticatedAdmin) return ws;
    const { privateMeetingUrl, privateMeetingPassword, ...safeWs } = ws;
    return safeWs as Workshop;
  }

  public saveWorkshop(workshopData: Partial<Workshop>): Workshop {
    if (workshopData.id) {
      // Update existing workshop
      const idx = this.workshops.findIndex((w) => w.id === workshopData.id);
      if (idx !== -1) {
        this.workshops[idx] = {
          ...this.workshops[idx],
          ...workshopData,
        };
        this.persist();
        return this.workshops[idx];
      }
    }
    // Create new workshop
    const newWs: Workshop = {
      id: `ws-${Date.now()}-${String(++this.regSeq).padStart(4, '0')}`,
      slug:
        workshopData.slug ||
        (workshopData.title || 'workshop')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      title: workshopData.title || 'Untitled Workshop',
      summary: workshopData.summary || '',
      description: workshopData.description || '',
      category: workshopData.category || 'Web Development',
      coverImage:
        workshopData.coverImage ||
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
      capacity: Number(workshopData.capacity) || 30,
      confirmedCount: 0,
      waitlistCount: 0,
      startTime: workshopData.startTime || new Date(Date.now() + 86400000 * 7).toISOString(),
      endTime: workshopData.endTime || new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(),
      timezone: 'Africa/Mogadishu',
      registrationOpenDate: new Date().toISOString(),
      registrationCloseDate: workshopData.startTime || new Date(Date.now() + 86400000 * 7).toISOString(),
      status: workshopData.status || 'published', // Default to published so it shows on public site immediately
      instructorIds: workshopData.instructorIds || ['inst-1'],
      prerequisites: workshopData.prerequisites || [],
      agenda: workshopData.agenda || [],
      privateMeetingUrl: workshopData.privateMeetingUrl || '',
      privateMeetingPassword: workshopData.privateMeetingPassword || '',
    };
    this.workshops.unshift(newWs);
    this.persist();
    return newWs;
  }

  public cancelWorkshop(id: string): Workshop | undefined {
    const ws = this.workshops.find((w) => w.id === id);
    if (ws) {
      ws.status = 'cancelled';
      this.persist();
      return ws;
    }
    return undefined;
  }

  public deleteWorkshop(id: string) {
    this.workshops = this.workshops.filter((w) => w.id !== id);
    this.persist();
  }

  // --- INSTRUCTORS ---
  public getInstructors(): Instructor[] {
    return [...this.instructors];
  }

  public getInstructorBySlug(slug: string): Instructor | undefined {
    return this.instructors.find((i) => i.slug === slug);
  }

  public saveInstructor(instructorData: Partial<Instructor>): Instructor {
    if (instructorData.id) {
      const idx = this.instructors.findIndex((i) => i.id === instructorData.id);
      if (idx !== -1) {
        this.instructors[idx] = { ...this.instructors[idx], ...instructorData };
        this.persist();
        return this.instructors[idx];
      }
    }
    const newInst: Instructor = {
      id: `inst-${Date.now()}`,
      slug:
        instructorData.slug ||
        (instructorData.name || 'instructor')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
      name: instructorData.name || 'New Instructor',
      role: instructorData.role || 'Industry Mentor',
      bio: instructorData.bio || '',
      photoUrl:
        instructorData.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      expertise: instructorData.expertise || ['Web Development'],
      socialLinks: instructorData.socialLinks,
    };
    this.instructors.push(newInst);
    this.persist();
    return newInst;
  }

  // --- REGISTRATIONS (Guest Registration Flow & Concurrency Safe Allocation) ---
  public getRegistrations(workshopId?: string): Registration[] {
    if (workshopId) {
      return this.registrations.filter((r) => r.workshopId === workshopId);
    }
    return [...this.registrations];
  }

  public registerGuest(params: {
    workshopId: string;
    fullName: string;
    email: string;
    whatsapp?: string;
    experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  }): {
    success: boolean;
    registration?: Registration;
    status: RegistrationStatus;
    message: string;
  } {
    const normalizedEmail = normalizeEmail(params.email);
    const workshop = this.workshops.find((w) => w.id === params.workshopId);

    if (!workshop) {
      return { success: false, status: 'expired', message: 'Workshop not found.' };
    }

    if (workshop.status !== 'published') {
      return { success: false, status: 'expired', message: 'Registration is not open for this workshop.' };
    }

    // Check duplicate active registration
    const existing = this.registrations.find(
      (r) =>
        r.workshopId === params.workshopId &&
        normalizeEmail(r.email) === normalizedEmail &&
        r.status !== 'cancelled' &&
        r.status !== 'expired'
    );

    if (existing) {
      return {
        success: true,
        registration: existing,
        status: existing.status,
        message: 'You already have an active registration for this workshop.',
      };
    }

    // Atomic seat capacity check
    const activeConfirmed = this.registrations.filter(
      (r) => r.workshopId === params.workshopId && (r.status === 'confirmed' || r.status === 'pending_verification')
    ).length;

    const remaining = calculateRemainingSeats(workshop.capacity, activeConfirmed);
    const assignedStatus: RegistrationStatus = remaining > 0 ? 'confirmed' : 'waitlisted';

    const verificationToken = `vtok-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const cancellationCode = `canc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    const newReg: Registration = {
      id: `reg-${Date.now()}-${String(++this.regSeq).padStart(6, '0')}`,
      workshopId: params.workshopId,
      fullName: params.fullName.trim(),
      email: normalizedEmail,
      whatsapp: params.whatsapp?.trim(),
      experienceLevel: params.experienceLevel,
      status: assignedStatus,
      verificationToken,
      cancellationCode,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.registrations.unshift(newReg);

    // Update counts on workshop
    this.recomputeWorkshopCounts(params.workshopId);

    // Log Transactional Email Dispatch (Resend simulation)
    this.recordEmailDelivery({
      recipientEmail: normalizedEmail,
      eventType: assignedStatus === 'confirmed' ? 'registration_confirmation' : 'waitlist_enrolled',
      subject:
        assignedStatus === 'confirmed'
          ? `Confirmed: ${workshop.title} (Lava Hub)`
          : `Waitlisted: ${workshop.title} (Lava Hub)`,
      status: 'delivered',
      providerMessageId: `resend_${Date.now()}`,
    });

    this.persist();

    return {
      success: true,
      registration: newReg,
      status: assignedStatus,
      message:
        assignedStatus === 'confirmed'
          ? 'Registration successful! Your seat is reserved.'
          : 'The workshop is fully booked. You have been added to the priority waiting list.',
    };
  }

  // --- CANCELLATION & CASCADE WAITLIST PROMOTION ---
  public cancelRegistration(tokenOrId: string): { success: boolean; message: string; promotedEmail?: string } {
    const reg = this.registrations.find(
      (r) => r.cancellationCode === tokenOrId || r.id === tokenOrId || r.verificationToken === tokenOrId
    );
    if (!reg) {
      return { success: false, message: 'Invalid or expired cancellation link.' };
    }
    if (reg.status === 'cancelled') {
      return { success: true, message: 'This registration has already been cancelled.' };
    }

    const wasConfirmed = reg.status === 'confirmed' || reg.status === 'pending_verification';
    reg.status = 'cancelled';
    reg.updatedAt = new Date().toISOString();

    let promotedEmail: string | undefined = undefined;

    // If a confirmed participant cancels, cascade promote the oldest waitlisted participant in FIFO order!
    if (wasConfirmed) {
      const waitlisted = this.registrations
        .filter((r) => r.workshopId === reg.workshopId && r.status === 'waitlisted')
        .sort((a, b) => {
          const timeDiff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          if (timeDiff !== 0) return timeDiff;
          return a.id.localeCompare(b.id);
        });

      if (waitlisted.length > 0) {
        const nextInLine = waitlisted[0];
        nextInLine.status = 'confirmed';
        nextInLine.updatedAt = new Date().toISOString();
        promotedEmail = nextInLine.email;

        // Dispatched seat offer email
        this.recordEmailDelivery({
          recipientEmail: nextInLine.email,
          eventType: 'waitlist_promoted_seat_offer',
          subject: 'Good news! A seat opened up for you at Lava Hub',
          status: 'delivered',
          providerMessageId: `resend_offer_${Date.now()}`,
        });
      }
    }

    this.recomputeWorkshopCounts(reg.workshopId);
    this.persist();

    return {
      success: true,
      message: 'Your registration has been securely cancelled.',
      promotedEmail,
    };
  }

  // --- ATTENDANCE MANAGEMENT ---
  public getAttendance(workshopId: string): AttendanceRecord[] {
    return this.attendance.filter((a) => a.workshopId === workshopId);
  }

  public markAttendance(
    workshopId: string,
    registrationId: string,
    status: AttendanceStatus
  ): { success: boolean; message: string } {
    const reg = this.registrations.find((r) => r.id === registrationId);
    if (!reg) return { success: false, message: 'Registration record not found.' };

    // Invariant: cancelled and waitlisted participants cannot be marked present!
    if ((reg.status === 'cancelled' || reg.status === 'waitlisted') && status === 'present') {
      return { success: false, message: 'Cannot mark cancelled or waitlisted participant as present.' };
    }

    const existingIdx = this.attendance.findIndex((a) => a.registrationId === registrationId);
    if (existingIdx !== -1) {
      this.attendance[existingIdx].status = status;
      this.attendance[existingIdx].markedAt = new Date().toISOString();
    } else {
      this.attendance.push({
        id: `att-${Date.now()}`,
        workshopId,
        registrationId,
        status,
        markedAt: new Date().toISOString(),
      });
    }

    this.persist();
    return { success: true, message: `Attendance updated to ${status}.` };
  }

  public bulkMarkAttendance(workshopId: string, status: AttendanceStatus): number {
    const confirmedRegs = this.registrations.filter(
      (r) => r.workshopId === workshopId && r.status === 'confirmed'
    );
    let count = 0;
    for (const r of confirmedRegs) {
      this.markAttendance(workshopId, r.id, status);
      count++;
    }
    return count;
  }

  // --- FEEDBACK ---
  public submitFeedback(data: Omit<FeedbackSubmission, 'id' | 'submittedAt'>): {
    success: boolean;
    message: string;
  } {
    const existing = this.feedback.find((f) => f.registrationId === data.registrationId);
    if (existing) {
      return { success: false, message: 'Feedback has already been submitted for this workshop.' };
    }
    const newFeedback: FeedbackSubmission = {
      ...data,
      id: `fb-${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.feedback.unshift(newFeedback);
    this.persist();
    return { success: true, message: 'Thank you for your valuable feedback!' };
  }

  public getFeedback(workshopId?: string): FeedbackSubmission[] {
    if (workshopId) {
      return this.feedback.filter((f) => f.workshopId === workshopId);
    }
    return [...this.feedback];
  }

  // --- CONTACT & COMMUNITY ---
  public submitContactMessage(name: string, email: string, message: string) {
    this.contactMessages.unshift({
      id: `msg-${Date.now()}`,
      name,
      email: normalizeEmail(email),
      message,
      date: new Date().toISOString(),
    });
    this.persist();
    return { success: true, message: 'Your message has been sent to the Lava Hub team.' };
  }

  public getContactMessages() {
    return [...this.contactMessages];
  }

  public subscribeCommunity(email: string) {
    const normalized = normalizeEmail(email);
    if (this.communitySubscribers.some((s) => s.email === normalized)) {
      return { success: true, message: 'You are already subscribed to the Lava Hub community!' };
    }
    this.communitySubscribers.unshift({
      id: `sub-${Date.now()}`,
      email: normalized,
      date: new Date().toISOString(),
    });
    this.persist();
    return { success: true, message: 'Welcome to the Lava Hub community!' };
  }

  public getCommunitySubscribers() {
    return [...this.communitySubscribers];
  }

  // --- EMAILS LOG ---
  public recordEmailDelivery(record: Omit<EmailDeliveryRecord, 'id' | 'timestamp'>) {
    this.emailDeliveries.unshift({
      ...record,
      id: `email-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
    });
    this.persist();
  }

  public getEmailDeliveries(): EmailDeliveryRecord[] {
    return [...this.emailDeliveries];
  }

  private recomputeWorkshopCounts(workshopId: string) {
    const ws = this.workshops.find((w) => w.id === workshopId);
    if (!ws) return;
    const confirmed = this.registrations.filter(
      (r) => r.workshopId === workshopId && (r.status === 'confirmed' || r.status === 'pending_verification')
    ).length;
    const waitlisted = this.registrations.filter(
      (r) => r.workshopId === workshopId && r.status === 'waitlisted'
    ).length;

    ws.confirmedCount = confirmed;
    ws.waitlistCount = waitlisted;
  }
}

export const db = new LavaHubDatabase();
