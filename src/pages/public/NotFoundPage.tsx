import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Home, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center max-w-md space-y-6">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-2xl flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8 fill-current" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            404 — Page Not Found
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-semibold text-sm shadow-sm transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to Lava Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
