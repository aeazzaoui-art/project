/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, PawPrint, User as UserIcon, Globe, LogOut } from 'lucide-react';
import { Language, ActivePage, User } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  authMode?: 'login' | 'signup';
  setAuthMode?: (mode: 'login' | 'signup') => void;
}

export default function Header({
  language,
  setLanguage,
  activePage,
  setActivePage,
  currentUser,
  setCurrentUser,
  authMode,
  setAuthMode
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const t = translations[language];
  const isRtl = language === 'AR';

  const navLinks: Array<{ label: string; page: ActivePage }> = [
    { label: t.nav_home, page: 'home' },
    { label: t.nav_find_sitter, page: 'search' },
    { label: t.nav_become_sitter, page: 'signup-sitter' },
    { label: t.nav_about, page: 'about' },
    { label: t.nav_faq, page: 'faq' }
  ];

  const handleLogout = () => {
    setCurrentUser(null);
    setActivePage('home');
    setMobileMenuOpen(false);
  };

  const selectLanguage = (lang: Language) => {
    setLanguage(lang);
    setLangDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E0E0E0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left Side: Logo */}
        <div 
          onClick={() => { setActivePage('home'); setMobileMenuOpen(false); }}
          className="flex items-center gap-2 cursor-pointer group"
          id="header-logo"
        >
          <div className="p-2 bg-[#FF6B00] rounded-xl text-white group-hover:bg-[#E55A00] transition-colors">
            <PawPrint className="w-6 h-6" />
          </div>
          <span className="font-sans font-extrabold text-2xl tracking-wider text-[#FF6B00]">
            AMUCH
          </span>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-8" dir={isRtl ? 'rtl' : 'ltr'}>
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => setActivePage(link.page)}
              className={`text-[15px] font-semibold transition-colors duration-200 cursor-pointer ${
                activePage === link.page
                  ? 'text-[#FF6B00] border-b-2 border-[#FF6B00] pb-1'
                  : 'text-[#111111] hover:text-[#FF6B00]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right Side: Lang and Auth (Desktop) */}
        <div className="hidden lg:flex items-center gap-4" dir={isRtl ? 'rtl' : 'ltr'}>
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-[#111111] text-sm font-semibold hover:border-[#FF6B00] transition-all cursor-pointer"
              id="desktop-language-selector-btn"
            >
              <Globe className="w-4 h-4 text-[#FF6B00]" />
              <span>{language}</span>
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg border border-gray-100 shadow-xl py-1 z-50">
                <button
                  onClick={() => selectLanguage('FR')}
                  className="w-full text-left px-4 py-2 text-sm text-[#111111] hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  🇫🇷 <span className="text-xs">Français</span>
                </button>
                <button
                  onClick={() => selectLanguage('AR')}
                  className="w-full text-left px-4 py-2 text-sm text-[#111111] hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  🇲🇦 <span className="text-xs">العربية</span>
                </button>
                <button
                  onClick={() => selectLanguage('EN')}
                  className="w-full text-left px-4 py-2 text-sm text-[#111111] hover:bg-gray-50 flex items-center gap-2 font-medium cursor-pointer"
                >
                  🇬🇧 <span className="text-xs">English</span>
                </button>
              </div>
            )}
          </div>

          {/* User Authentication Actions */}
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setActivePage(currentUser.role === 'owner' ? 'owner-dashboard' : 'sitter-dashboard');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#111111] rounded-lg text-sm font-bold transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-[#FF6B00]" />
                <span>{currentUser.firstName} ({currentUser.role === 'owner' ? 'Owner' : 'Sitter'})</span>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all cursor-pointer"
                title={t.nav_logout}
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  if (setAuthMode) setAuthMode('login');
                  setActivePage('signup-owner');
                }}
                className="px-4 py-2 rounded-lg border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold text-sm transition-all cursor-pointer"
              >
                {t.nav_login}
              </button>
              <button
                onClick={() => {
                  if (setAuthMode) setAuthMode('signup');
                  setActivePage('signup-owner');
                }}
                className="px-4 py-2 rounded-lg bg-[#FF6B00] text-white hover:bg-[#E55A00] font-bold text-sm transition-all cursor-pointer shadow-sm"
              >
                {t.nav_signup}
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger (Lg and down) */}
        <div className="flex lg:hidden items-center gap-2">
          {/* Mobile Language shortcut */}
          <button
            onClick={() => setLanguage(language === 'FR' ? 'AR' : language === 'AR' ? 'EN' : 'FR')}
            className="p-2 rounded-lg border border-gray-200 text-xs font-bold text-[#FF6B00] bg-gray-50"
          >
            {language}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#FF6B00] hover:bg-[#FF6B00]/10 transition-colors cursor-pointer"
            id="mobile-hamburger-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-navigation-drawer"
          className="lg:hidden fixed inset-0 top-20 bg-[#111111]/95 backdrop-blur-sm z-30 transition-all duration-300"
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          <div className="px-6 py-8 flex flex-col gap-6 text-center">
            {navLinks.map((link) => (
              <button
                key={link.page}
                onClick={() => {
                  setActivePage(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`text-xl font-bold py-2 ${
                  activePage === link.page ? 'text-[#FF6B00]' : 'text-white hover:text-[#FF6B00]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="h-[1px] bg-white/10 my-2" />

            {/* Mobile Lang select */}
            <div className="flex justify-center gap-4 text-white font-bold">
              <button 
                onClick={() => { selectLanguage('FR'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg ${language === 'FR' ? 'bg-[#FF6B00] text-white' : 'text-gray-400'}`}
              >
                Français
              </button>
              <button 
                onClick={() => { selectLanguage('AR'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg ${language === 'AR' ? 'bg-[#FF6B00] text-white' : 'text-gray-400'}`}
              >
                العربية
              </button>
              <button 
                onClick={() => { selectLanguage('EN'); setMobileMenuOpen(false); }}
                className={`px-3 py-1 rounded-lg ${language === 'EN' ? 'bg-[#FF6B00] text-white' : 'text-gray-400'}`}
              >
                English
              </button>
            </div>

            <div className="h-[1px] bg-white/10 my-2" />

            {/* Auth actions mobile */}
            {currentUser ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    setActivePage(currentUser.role === 'owner' ? 'owner-dashboard' : 'sitter-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm"
                >
                  {currentUser.firstName} ({currentUser.role === 'owner' ? 'Owner' : 'Sitter'})
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 rounded-xl bg-red-600/20 text-red-400 font-bold text-sm flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav_logout}</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode('login');
                    setActivePage('signup-owner');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold text-sm transition-all"
                >
                  {t.nav_login}
                </button>
                <button
                  onClick={() => {
                    if (setAuthMode) setAuthMode('signup');
                    setActivePage('signup-owner');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-xl bg-[#FF6B00] text-white hover:bg-[#E55A00] font-bold text-sm transition-all"
                >
                  {t.nav_signup}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
