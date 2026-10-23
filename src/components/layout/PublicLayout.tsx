import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { useT } from '../../i18n/LanguageContext.tsx';

export function PublicLayout() {
  const { language, toggleLanguage } = useT();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      <Navbar currentLang={language} onToggleLang={toggleLanguage} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer currentLang={language} />
    </div>
  );
}
