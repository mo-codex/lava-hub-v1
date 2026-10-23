import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Flame, Shield, ArrowLeft } from 'lucide-react';

export function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 space-y-6 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto text-white">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold font-display">Lava Hub Admin Portal</h1>
          <p className="text-xs text-slate-400">Restricted to authorized administrators</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Email</label>
            <input type="email" placeholder="admin@lavahub.org" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white" readOnly />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-300 mb-1">Password</label>
            <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white" readOnly />
          </div>
          <button type="button" className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold rounded-lg text-sm">
            Sign In (Supabase Auth — Milestone 05)
          </button>
        </div>
        <div className="text-center pt-2">
          <Link to="/" className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Lava Hub
          </Link>
        </div>
      </div>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-600 rounded flex items-center justify-center">
            <Flame className="w-4 h-4 fill-current text-white" />
          </div>
          <span className="font-bold text-sm">LAVA HUB ADMIN</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <Link to="/" className="text-slate-300 hover:text-white">Public Site</Link>
          <Link to="/admins/login" className="text-slate-300 hover:text-white">Logout</Link>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-display text-slate-900">Admin Operations Dashboard</h1>
      <p className="text-sm text-slate-600">Operational overview, workshop metrics, registrations, and attendance management.</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['Total Workshops', 'Active Registrations', 'Waitlist Queue', 'Attendance Rate'].map((item, idx) => (
          <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="text-xs text-slate-500 uppercase font-semibold">{item}</div>
            <div className="text-2xl font-bold text-slate-900 mt-2">—</div>
          </div>
        ))}
      </div>
    </div>
  );
}
