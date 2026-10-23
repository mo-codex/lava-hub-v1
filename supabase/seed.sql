-- Lava Hub Phase 0 Seed Data
-- Seed file: supabase/seed.sql

-- 1. Platform Settings
INSERT INTO platform_settings (key, value) VALUES
  ('cancellation_cutoff_hours', '2'::jsonb),
  ('waitlist_offer_expiry_hours', '24'::jsonb),
  ('verification_expiry_hours', '24'::jsonb),
  ('default_timezone', '"Africa/Mogadishu"'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- 2. Instructors
INSERT INTO instructors (id, slug, name, role, bio, photo_url, expertise, is_active) VALUES
  (
    '00000000-0000-0000-0000-000000000001',
    'ayan-ali-farah',
    'Ayan Ali Farah',
    'Senior Frontend Architect @ Global Tech',
    'Passionate about empowering the next generation of East African developers. 8+ years building enterprise React systems.',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    ARRAY['React', 'TypeScript', 'Design Systems', 'Performance'],
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'mohamed-aden-nur',
    'Mohamed Aden Nur',
    'AI Engineer & Open Source Contributor',
    'Building modern LLM applications and machine learning pipelines. Active mentor in Somali diaspora tech circles.',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    ARRAY['AI & Machine Learning', 'Python', 'LLMs', 'API Design'],
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000003',
    'fartun-hassan-omar',
    'Fartun Hassan Omar',
    'Full-Stack Developer & Community Builder',
    'Self-taught developer turned lead engineer. Dedicated to organizing free coding bootcamps for women in Hargeisa and Mogadishu.',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
    ARRAY['JavaScript', 'Node.js', 'PostgreSQL', 'Web Development'],
    TRUE
  ),
  (
    '00000000-0000-0000-0000-000000000004',
    'khalid-ismail-warsame',
    'Khalid Ismail Warsame',
    'Cloud Systems & DevOps Specialist',
    'Specializes in scalable backend architectures and modern web infrastructure. Co-organizer of Somali Tech Meetups.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    ARRAY['Docker', 'Cloud Infrastructure', 'Web Dev', 'Linux'],
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

-- 3. Workshops
INSERT INTO workshops (
  id, slug, title, summary, description, category, cover_image, capacity,
  start_time, end_time, timezone, registration_open_date, registration_close_date,
  status, prerequisites, agenda
) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'modern-react-from-scratch-2026',
    'Building Interactive Web Apps with Modern React',
    'Learn component design, hooks, responsive layouts, and state management by building a real project from scratch.',
    'This intensive 2.5-hour hands-on workshop takes you from React fundamentals to building a live interactive dashboard. We will explore component modularity, the new React 19 hooks, clean Tailwind styling, and production state patterns.',
    'React',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800',
    35,
    '2026-11-05T15:00:00Z',
    '2026-11-05T17:30:00Z',
    'Africa/Mogadishu',
    '2026-10-20T00:00:00Z',
    '2026-11-05T13:00:00Z',
    'published',
    ARRAY['Basic HTML & CSS knowledge', 'Familiarity with JavaScript variables and functions', 'Computer with Node.js installed'],
    '[{"time": "00:00 - 00:30", "topic": "React 19 Architecture & Component Foundations"}, {"time": "00:30 - 01:15", "topic": "State, Props & Interactive Hooks"}, {"time": "01:15 - 02:00", "topic": "Building the Practical Project"}, {"time": "02:00 - 02:30", "topic": "Live Q&A, Code Review & Community Discussion"}]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'javascript-async-apis-deep-dive',
    'Mastering Asynchronous JavaScript & REST APIs',
    'Understand Promises, async/await, fetch, and error handling patterns through real-world API integrations.',
    'Async programming is often the biggest hurdle for new JavaScript developers. In this workshop, you will demystify the event loop, master Promise chaining, write clean async/await logic, and handle HTTP errors gracefully.',
    'JavaScript',
    'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&q=80&w=800',
    40,
    '2026-11-12T15:00:00Z',
    '2026-11-12T17:00:00Z',
    'Africa/Mogadishu',
    '2026-10-22T00:00:00Z',
    '2026-11-12T13:00:00Z',
    'published',
    ARRAY['Basic JavaScript syntax', 'Code editor (VS Code recommended)'],
    '[{"time": "00:00 - 00:30", "topic": "The JS Event Loop & Callback Hell Explained"}, {"time": "00:30 - 01:15", "topic": "Modern Promises & Async/Await In Action"}, {"time": "01:15 - 02:00", "topic": "Hands-On API Project & Live Troubleshooting"}]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'ai-applications-developer-primer',
    'Building AI-Powered Web Applications with Modern APIs',
    'Discover how to connect web apps to modern AI foundation models, craft structured prompts, and implement streaming UI.',
    'Learn how software engineers integrate generative AI into practical web apps. We will cover prompt engineering, structured JSON responses, streaming text and media, and rate-limiting safeguards.',
    'AI',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&q=80&w=800',
    30,
    '2026-11-19T15:00:00Z',
    '2026-11-19T17:30:00Z',
    'Africa/Mogadishu',
    '2026-10-25T00:00:00Z',
    '2026-11-19T13:00:00Z',
    'published',
    ARRAY['Intermediate JavaScript or TypeScript', 'Basic command line experience'],
    '[{"time": "00:00 - 00:45", "topic": "AI APIs & Structured Outputs"}, {"time": "00:45 - 01:45", "topic": "Live Coding: Realtime AI Assistant Interface"}, {"time": "01:45 - 02:30", "topic": "Production Guardrails & Student Showcase"}]'::jsonb
  ),
  (
    '10000000-0000-0000-0000-000000000004',
    'responsive-web-design-tailwind-v4',
    'Responsive Web Design with Modern CSS & Tailwind',
    'Design and code stunning, mobile-first web pages that adapt flawlessly across phones, tablets, and desktop displays.',
    'Master CSS grid, flexbox, clamp typography, mobile touch targets, and the high-speed engine of Tailwind CSS v4.',
    'Web Development',
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=800',
    50,
    '2026-11-26T15:00:00Z',
    '2026-11-26T17:00:00Z',
    'Africa/Mogadishu',
    '2026-10-28T00:00:00Z',
    '2026-11-26T13:00:00Z',
    'published',
    ARRAY['No prior coding required', 'Web browser and curiosity'],
    '[{"time": "00:00 - 00:30", "topic": "CSS Layout Mechanics: Flex vs Grid"}, {"time": "00:30 - 01:15", "topic": "Tailwind Tokens, Radii & Typography"}, {"time": "01:15 - 02:00", "topic": "Build a Live Responsive Landing Page"}]'::jsonb
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Workshop Meetings (Protected Zoom/Meet links)
INSERT INTO workshop_meetings (workshop_id, platform, meeting_url, meeting_password, instructions) VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Zoom',
    'https://zoom.us/j/98765432101',
    'LAVA2026',
    'Please join 5 minutes early to test your audio. Have your VS Code editor ready.'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'Google Meet',
    'https://meet.google.com/lav-ahub-jsm',
    NULL,
    'Ensure you have a stable internet connection.'
  )
ON CONFLICT (workshop_id) DO NOTHING;
