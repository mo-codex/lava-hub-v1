import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Flame,
  LayoutDashboard,
  Calendar,
  Users,
  Clock,
  UserCheck,
  Award,
  Mail,
  MessageSquare,
  BarChart3,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  Shield,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { useTheme } from '../../context/ThemeContext.tsx';

export function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admins/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admins' },
    { label: 'Workshops', icon: Calendar, href: '/admins/workshops' },
    { label: 'Registrations', icon: Users, href: '/admins/registrations' },
    { label: 'Waitlist', icon: Clock, href: '/admins/waitlist' },
    { label: 'Attendance', icon: UserCheck, href: '/admins/attendance' },
    { label: 'Instructors', icon: Award, href: '/admins/instructors' },
    { label: 'Email Logs', icon: Mail, href: '/admins/emails' },
    { label: 'Feedback', icon: MessageSquare, href: '/admins/feedback' },
    { label: 'Reports', icon: BarChart3, href: '/admins/reports' },
    { label: 'Messages', icon: Mail, href: '/admins/messages' },
    { label: 'Community', icon: Users, href: '/admins/community' },
    { label: 'Settings', icon: Settings, href: '/admins/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col md:flex-row text-slate-900 dark:text-slate-100">
      {/* Top Mobile Bar */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-orange-600 rounded flex items-center justify-center">
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <span className="font-bold text-sm font-display">LAVA HUB ADMIN</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800"
            aria-label="Toggle admin sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-200 md:static md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 space-y-6">
          {/* Brand */}
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5 text-white">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-current" />
              </div>
              <div>
                <span className="font-extrabold text-base tracking-tight font-display">
                  LAVA<span className="text-orange-500">HUB</span>
                </span>
                <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Admin Portal
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.href === '/admins'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`
                }
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User and Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-800 text-orange-400 flex items-center justify-center font-bold text-xs uppercase">
                {admin?.email?.[0] || 'A'}
              </div>
              <div className="truncate max-w-[120px]">
                <p className="font-semibold text-white truncate text-xs">{admin?.email || 'Admin'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">Role: Super Admin</p>
              </div>
            </div>

            <button
              onClick={toggleTheme}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <Link
              to="/"
              className="text-slate-400 hover:text-white inline-flex items-center gap-1 text-[11px]"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-rose-400 hover:text-rose-300 inline-flex items-center gap-1 text-[11px] font-semibold"
            >
              <LogOut className="w-3 h-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <header className="hidden md:flex bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 px-8 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Authorized Session · Role-Based Access Control (RBAC) Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs flex items-center gap-1.5"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span className="capitalize">{theme}</span>
            </button>

            <Link
              to="/"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <span>Open Lava Hub</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
