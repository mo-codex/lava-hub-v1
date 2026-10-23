import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { PublicLayout } from '../components/layout/PublicLayout.tsx';
import { HomePage } from '../pages/public/HomePage.tsx';
import { WorkshopsPage } from '../pages/public/WorkshopsPage.tsx';
import { WorkshopDetailPage } from '../pages/public/WorkshopDetailPage.tsx';
import { RegisterPage } from '../pages/public/RegisterPage.tsx';
import {
  RegistrationStatusPage,
  RegistrationCancelPage,
  WaitlistAcceptPage,
} from '../pages/public/RegistrationStatusPage.tsx';
import {
  InstructorsPage,
  InstructorDetailPage,
} from '../pages/public/InstructorsPage.tsx';
import {
  AboutPage,
  ContactPage,
  JoinCommunityPage,
  FeedbackPage,
} from '../pages/public/AboutContactPages.tsx';
import {
  PrivacyPage,
  TermsPage,
  CancellationPolicyPage,
} from '../pages/public/LegalPages.tsx';
import { NotFoundPage } from '../pages/public/NotFoundPage.tsx';

// Admin Pages
import { AdminLoginPage } from '../pages/admin/AdminLoginPage.tsx';
import { AdminLayout } from '../pages/admin/AdminLayout.tsx';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage.tsx';
import { AdminWorkshopsPage } from '../pages/admin/AdminWorkshopsPage.tsx';
import { AdminRegistrationsPage } from '../pages/admin/AdminRegistrationsPage.tsx';
import { AdminAttendancePage } from '../pages/admin/AdminAttendancePage.tsx';
import { AdminWaitlistPage } from '../pages/admin/AdminWaitlistPage.tsx';
import { AdminInstructorsPage } from '../pages/admin/AdminInstructorsPage.tsx';
import { AdminEmailsPage } from '../pages/admin/AdminEmailsPage.tsx';
import { AdminFeedbackPage } from '../pages/admin/AdminFeedbackPage.tsx';
import { AdminReportsPage } from '../pages/admin/AdminReportsPage.tsx';
import {
  AdminMessagesPage,
  AdminCommunityPage,
  AdminTeamPage,
} from '../pages/admin/AdminOtherPages.tsx';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage.tsx';

export function AppRoutes() {
  return (
    <Routes>
      {/* 19 Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/workshops/:slug" element={<WorkshopDetailPage />} />
        <Route path="/workshops/:slug/register" element={<RegisterPage />} />
        <Route path="/registration/confirmation" element={<RegistrationStatusPage />} />
        <Route path="/registration/verify" element={<RegistrationStatusPage />} />
        <Route path="/registration/cancel" element={<RegistrationCancelPage />} />
        <Route path="/waitlist/accept" element={<WaitlistAcceptPage />} />
        <Route path="/feedback/:token" element={<FeedbackPage />} />
        <Route path="/join" element={<JoinCommunityPage />} />
        <Route path="/join/verify" element={<RegistrationStatusPage />} />
        <Route path="/join/unsubscribe" element={<RegistrationCancelPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/instructors" element={<InstructorsPage />} />
        <Route path="/instructors/:slug" element={<InstructorDetailPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/cancellation-policy" element={<CancellationPolicyPage />} />
      </Route>

      {/* Admin Protected Authentication & Operations Routes */}
      <Route path="/admins/login" element={<AdminLoginPage />} />
      <Route path="/admins" element={<AdminLayout />}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="workshops" element={<AdminWorkshopsPage />} />
        <Route path="registrations" element={<AdminRegistrationsPage />} />
        <Route path="attendance" element={<AdminAttendancePage />} />
        <Route path="waitlist" element={<AdminWaitlistPage />} />
        <Route path="instructors" element={<AdminInstructorsPage />} />
        <Route path="emails" element={<AdminEmailsPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route path="community" element={<AdminCommunityPage />} />
        <Route path="team" element={<AdminTeamPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<PublicLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
