/**
 * Core Domain Types for Lava Hub Platform (Phase 0)
 */

export type WorkshopCategory = 'Web Development' | 'JavaScript' | 'React' | 'AI';

export type WorkshopStatus = 'draft' | 'published' | 'cancelled' | 'archived';

export type RegistrationStatus =
  | 'pending_verification'
  | 'confirmed'
  | 'waitlisted'
  | 'cancelled'
  | 'expired';

export type AttendanceStatus = 'unmarked' | 'present' | 'absent';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Instructor {
  id: string;
  slug: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  expertise: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

export interface Workshop {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: WorkshopCategory;
  coverImage: string;
  capacity: number;
  confirmedCount: number;
  waitlistCount: number;
  startTime: string; // UTC ISO string
  endTime: string;   // UTC ISO string
  timezone: string;  // e.g., 'Africa/Mogadishu'
  registrationOpenDate: string;
  registrationCloseDate: string;
  status: WorkshopStatus;
  instructorIds: string[];
  prerequisites: string[];
  agenda: { time: string; topic: string }[];
  // Private field — NEVER exposed to public visitors
  privateMeetingUrl?: string;
  privateMeetingPassword?: string;
}

export interface Registration {
  id: string;
  workshopId: string;
  fullName: string;
  email: string;
  whatsapp?: string;
  experienceLevel: ExperienceLevel;
  status: RegistrationStatus;
  verificationToken?: string;
  tokenExpiresAt?: string;
  cancellationCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  workshopId: string;
  registrationId: string;
  status: AttendanceStatus;
  markedAt?: string;
  markedBy?: string;
}

export interface FeedbackSubmission {
  id: string;
  workshopId: string;
  registrationId: string;
  ratingOverall: number; // 1-5
  ratingContent: number; // 1-5
  ratingInstructor: number; // 1-5
  keyLearnings: string;
  improvements?: string;
  allowTestimonial: boolean;
  submittedAt: string;
}
