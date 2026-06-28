/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PawPrint, Mail, Phone, Flame, ShieldAlert, Facebook, Instagram, Smartphone } from 'lucide-react';
import { Language, ActivePage } from '../types';
import { translations } from '../translations';

interface FooterProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  setActivePage: (page: ActivePage) => void;
}

export default function Footer({ language, setLanguage, setActivePage }: FooterProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#111111] text-gray-400 font-sans border-t-4 border-[#FF6B00]">
      {/* Top Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10" dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <div 
              onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 mb-4 cursor-pointer group w-fit"
            >
              <div className="p-2 bg-[#FF6B00] rounded-xl text-white group-hover:bg-[#E55A00] transition-colors">
                <PawPrint className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-wider text-white">
                AMUCH
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-sm text-gray-400">
              {t.footer_desc}
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="https://instagram.com" target="_blank" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://tiktok.com" target="_blank" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-[#FF6B00] transition-colors">
                <Smartphone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer_col_platform}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('search'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_find_sitter}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('signup-sitter'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_become_sitter}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {language === 'FR' ? "Tarifs" : language === 'AR' ? "الأسعار" : "Pricing"}
                </button>
              </li>
            </ul>
          </div>

          {/* Info Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer_col_infos}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <button 
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_about}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {language === 'FR' ? "Comment ça marche ?" : language === 'AR' ? "كيف يعمل؟" : "How it works?"}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('faq'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_faq}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActivePage('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#FF6B00] transition-colors text-left cursor-pointer"
                >
                  {t.nav_blog}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 tracking-wide">
              {t.footer_col_contact}
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs">contact@amuch.ma</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#FF6B00]" />
                <span className="text-xs" dir="ltr">+212 6 00 00 00 00</span>
              </li>
              <li className="text-xs text-gray-500 mt-2">
                Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Language Selector and CNDP Notice */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Language Selector */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500">{language === 'FR' ? 'Langue :' : language === 'AR' ? 'اللغة :' : 'Language :'}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => selectLanguage('FR')}
                className={`text-xs px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${language === 'FR' ? 'bg-[#FF6B00] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
              >
                Français
              </button>
              <button 
                onClick={() => selectLanguage('AR')}
                className={`text-xs px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${language === 'AR' ? 'bg-[#FF6B00] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
              >
                العربية
              </button>
              <button 
                onClick={() => selectLanguage('EN')}
                className={`text-xs px-3 py-1.5 rounded font-bold transition-all cursor-pointer ${language === 'EN' ? 'bg-[#FF6B00] text-white' : 'bg-white/5 hover:bg-white/10 text-gray-300'}`}
              >
                English
              </button>
            </div>
          </div>

          {/* CNDP Badge info */}
          <div className="flex items-center gap-2 text-xs text-gray-500 max-w-md text-center md:text-right">
            <ShieldAlert className="w-4 h-4 text-[#FF6B00] shrink-0" />
            <span>{t.footer_cookie_mention}</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-[#0c0c0c] py-6 text-xs border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div>
            &copy; 2026 AMUCH &mdash; {t.footer_rights}
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              {language === 'FR' ? "Mentions légales" : language === 'AR' ? "الشروط القانونية" : "Legal Mentions"}
            </button>
            <span>&middot;</span>
            <button 
              onClick={() => { setActivePage('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              {language === 'FR' ? "Confidentialité" : language === 'AR' ? "سياسة الخصوصية" : "Privacy Policy"}
            </button>
            <span>&middot;</span>
            <button 
              onClick={() => { setActivePage('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-white transition-colors cursor-pointer text-left"
            >
              {language === 'FR' ? "Conditions Générales" : language === 'AR' ? "الشروط والأحكام" : "Terms & Conditions"}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
