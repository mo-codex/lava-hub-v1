import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Flame, Menu, X, Globe, Sun, Moon, Users } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.tsx';

interface NavbarProps {
  currentLang?: 'en' | 'so';
  onToggleLang?: () => void;
}

export function Navbar({ currentLang = 'en', onToggleLang }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: currentLang === 'so' ? 'Aqoon-is-weydaarsiyada' : 'Workshops', href: '/workshops' },
    { label: currentLang === 'so' ? 'Macallimiinta' : 'Instructors', href: '/instructors' },
    { label: currentLang === 'so' ? 'Bulshada' : 'Community', href: '/join' },
    { label: currentLang === 'so' ? 'Nagu Saabsan' : 'About', href: '/about' },
    { label: currentLang === 'so' ? 'Xiriir' : 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4 sm:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-slate-900 dark:text-white group whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 rounded-md"
            aria-label="Lava Hub Home"
          >
            <div className="w-9 h-9 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Flame className="w-5 h-5 fill-current text-white" aria-hidden="true" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-display">
              LAVA<span className="text-orange-600">HUB</span>
            </span>
          </Link>

          {/* Zone 2: Primary Nav Links */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`transition-colors whitespace-nowrap py-1 relative ${
                    isActive
                      ? 'text-orange-600 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                  {isActive && (
                    <span
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Language toggle + Theme Toggle + Join Free CTA) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {/* Theme Toggle (Sun/Moon) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" aria-hidden="true" />
              )}
            </button>

            {/* Language Toggle */}
            {onToggleLang && (
              <button
                type="button"
                onClick={onToggleLang}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                aria-label={`Switch language to ${currentLang === 'en' ? 'Somali' : 'English'}`}
              >
                <Globe className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                <span className="uppercase">{currentLang === 'en' ? 'SO' : 'EN'}</span>
              </button>
            )}

            <Link
              to="/workshops"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-slate-950 bg-[#FF5722] hover:bg-[#F4511E] active:scale-[0.98] transition-all rounded-lg shadow-sm whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500"
            >
              {currentLang === 'so' ? 'Kusoo Biir Bilaash' : 'Join Free'}
            </Link>
          </div>

          {/* Mobile Actions: Theme + Lang + Hamburger */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>

            {onToggleLang && (
              <button
                type="button"
                onClick={onToggleLang}
                className="p-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md"
                aria-label="Toggle language"
              >
                <span className="uppercase">{currentLang === 'en' ? 'SO' : 'EN'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Accessible Mobile Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 shadow-lg"
        >
          <nav className="flex flex-col space-y-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-3 py-2.5 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2">
            <Link
              to="/workshops"
              className="w-full flex items-center justify-center px-4 py-3 text-base font-semibold text-slate-950 bg-[#FF5722] hover:bg-[#F4511E] rounded-lg shadow-sm"
            >
              {currentLang === 'so' ? 'Kusoo Biir Bilaash' : 'Join Free'}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
