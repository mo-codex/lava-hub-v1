import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Flame, Shield, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext.tsx';
import { Card } from '../../components/ui/Card.tsx';
import { Input } from '../../components/ui/Input.tsx';
import { Button } from '../../components/ui/Button.tsx';

export function AdminLoginPage() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@lavahub.org');
  const [password, setPassword] = useState('LavaHub2026!');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admins');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = login(email, password);
    if (success) {
      navigate('/admins');
    } else {
      setError('Invalid admin credentials. Please check your email and password.');
    }
  };

  const handleDemoSignIn = () => {
    login('admin@lavahub.org', 'LavaHub2026!');
    navigate('/admins');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center mx-auto text-white shadow-lg">
            <Flame className="w-6 h-6 fill-current" />
          </div>
          <h1 className="text-2xl font-bold font-display tracking-tight">Lava Hub Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Authorized administrator authentication & operational dashboard
          </p>
        </div>

        <Card className="bg-slate-800/90 border-slate-700 p-6 sm:p-8 space-y-5 shadow-2xl">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Admin Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@lavahub.org"
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
            />

            <Button
              type="submit"
              className="w-full py-2.5 bg-[#FF5722] hover:bg-[#F4511E] text-slate-950 font-bold text-xs"
            >
              Sign In to Admin Portal
            </Button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-slate-700/80">
            <button
              type="button"
              onClick={handleDemoSignIn}
              className="w-full py-2 px-3 text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-orange-400" />
              <span>One-Click Super Admin Sign In</span>
            </button>
          </div>
        </Card>

        <div className="text-center">
          <Link
            to="/"
            className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
