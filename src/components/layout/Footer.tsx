import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Heart } from 'lucide-react';

interface FooterProps {
  currentLang?: 'en' | 'so';
}

export function Footer({ currentLang = 'en' }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 text-white group"
              aria-label="Lava Hub Home"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white">
                <Flame className="w-4 h-4 fill-current" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-xl tracking-tight font-display">
                LAVA<span className="text-orange-500">HUB</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              {currentLang === 'so'
                ? 'Lava Hub waa madal furan oo dhalinyarada Soomaaliyeed u fududaysa barashada xirfadaha farsamada gacanta ee casriga ah iyada oo la adeegsanayo aqoon-is-weydaarsiyo toos ah oo bilaash ah.'
                : 'Lava Hub empowers youth in Somalia, Somaliland, and the diaspora to master practical modern tech skills through free, live online workshops and collaborative community learning.'}
            </p>
            <p className="text-xs text-slate-500 font-medium">
              Tagline: <span className="text-orange-400">Learn. Collaborate. Rise.</span>
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {currentLang === 'so' ? 'Bogagga Muhiimka ah' : 'Navigation'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/workshops" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Aqoon-is-weydaarsiyo' : 'Workshops Catalog'}
                </Link>
              </li>
              <li>
                <Link to="/instructors" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Macallimiinta' : 'Instructors'}
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Nagu Saabsan' : 'About Lava Hub'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Nala Soo Xiriir' : 'Contact Us'}
                </Link>
              </li>
              <li>
                <Link to="/join" className="hover:text-orange-400 text-orange-400 transition-colors">
                  {currentLang === 'so' ? 'Kusoo Biir Bulshada' : 'Join Community'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Policies & Admin */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {currentLang === 'so' ? 'Shuruucda & Amniga' : 'Legal & Admin'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Khadka Qarsoodiga' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Shuruudaha Adeegga' : 'Terms of Service'}
                </Link>
              </li>
              <li>
                <Link to="/cancellation-policy" className="hover:text-white transition-colors">
                  {currentLang === 'so' ? 'Shuruucda Joojinta' : 'Cancellation Policy'}
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  to="/admins/login"
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center gap-1"
                >
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} Lava Hub. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            <span>Built for the Somali tech community with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current inline" aria-label="love" />
          </p>
        </div>
      </div>
    </footer>
  );
}
