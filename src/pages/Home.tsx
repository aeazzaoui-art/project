/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PawPrint, Calendar, Star, Users, ShieldCheck, Heart, MapPin, MessageSquare, BookOpen } from 'lucide-react';
import { Language, ActivePage, BlogPost } from '../types';
import { translations } from '../translations';
import { CITIES } from '../data';

interface HomeProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
  blogPosts?: BlogPost[];
}

export default function Home({ language, setActivePage, blogPosts = [] }: HomeProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  return (
    <div className="font-sans min-h-screen bg-white" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden py-16 md:py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="text-center lg:text-left space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold tracking-wider uppercase">
                🇲🇦 {language === 'FR' ? "Fait au Maroc avec Amour" : language === 'AR' ? "صُنع في المغرب بكل حب" : "Made in Morocco with Love"}
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#111111] leading-tight tracking-tight">
                {t.hero_title}
              </h1>
              <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {t.hero_subtitle}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  id="hero-find-sitter-btn"
                  onClick={() => setActivePage('search')}
                  className="w-full sm:w-auto px-8 py-4 bg-[#FF6B00] text-white font-extrabold rounded-lg hover:bg-[#E55A00] transition-all hover:scale-[1.02] shadow-lg cursor-pointer"
                >
                  {t.hero_cta_find}
                </button>
                <button
                  id="hero-become-sitter-btn"
                  onClick={() => setActivePage('signup-sitter')}
                  className="w-full sm:w-auto px-8 py-4 border-2 border-[#FF6B00] text-[#FF6B00] bg-transparent font-extrabold rounded-lg hover:bg-[#FF6B00] hover:text-white transition-all cursor-pointer"
                >
                  {t.hero_cta_become}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-6 text-sm text-gray-500 font-semibold border-t border-gray-100">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FF6B00]">✔</span>
                  <span>{t.hero_badge_profiles}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FF6B00]">✔</span>
                  <span>{t.hero_badge_reviews}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FF6B00]">✔</span>
                  <span>{t.hero_badge_chat}</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual (Modern, high-contrast, clean illustration) */}
            <div className="flex justify-center relative">
              <div className="relative w-full max-w-md md:max-w-lg aspect-square rounded-3xl bg-gradient-to-tr from-[#FF6B00]/5 to-transparent p-6 flex items-center justify-center">
                {/* Visual SVG elements representing pet care & Morocco */}
                <svg viewBox="0 0 500 500" className="w-full h-full max-h-[400px]">
                  {/* Decorative background arcs / ripples */}
                  <circle cx="250" cy="250" r="180" fill="none" stroke="#FF6B00" strokeWidth="2" strokeDasharray="8 8" className="opacity-20" />
                  <circle cx="250" cy="250" r="120" fill="none" stroke="#FF6B00" strokeWidth="1" className="opacity-10" />

                  {/* Human shape */}
                  <path d="M120 380 C120 280, 240 280, 240 380 Z" fill="#F7F7F7" stroke="#111111" strokeWidth="4" />
                  <circle cx="180" cy="220" r="45" fill="#FFFFFF" stroke="#111111" strokeWidth="4" />
                  {/* Human hair & smile */}
                  <path d="M140 200 C150 170, 210 170, 220 200 Z" fill="#111111" />
                  <path d="M170 235 Q180 245, 190 235" fill="none" stroke="#111111" strokeWidth="3" strokeLinecap="round" />
                  {/* Eyeglasses */}
                  <circle cx="168" cy="218" r="8" fill="none" stroke="#FF6B00" strokeWidth="2" />
                  <circle cx="192" cy="218" r="8" fill="none" stroke="#FF6B00" strokeWidth="2" />
                  <line x1="176" y1="218" x2="184" y2="218" stroke="#FF6B00" strokeWidth="2" />

                  {/* Dog shape on the right */}
                  <path d="M260 380 C260 300, 380 300, 380 380 Z" fill="#FFFFFF" stroke="#111111" strokeWidth="4" />
                  <circle cx="320" cy="250" r="40" fill="#F7F7F7" stroke="#111111" strokeWidth="4" />
                  {/* Dog ears */}
                  <path d="M280 220 C275 250, 290 260, 295 240 Z" fill="#FF6B00" stroke="#111111" strokeWidth="3" />
                  <path d="M360 220 C365 250, 350 260, 345 240 Z" fill="#FF6B00" stroke="#111111" strokeWidth="3" />
                  {/* Dog eyes & nose */}
                  <circle cx="308" cy="245" r="4" fill="#111111" />
                  <circle cx="332" cy="245" r="4" fill="#111111" />
                  <ellipse cx="320" cy="258" rx="7" ry="4" fill="#111111" />
                  <path d="M315 268 Q320 274, 325 268" fill="none" stroke="#111111" strokeWidth="2" />

                  {/* Moroccan Geometric Star Badge */}
                  <g transform="translate(250, 110) scale(0.8)">
                    <path d="M0 -40 L12 -12 L40 0 L12 12 L0 40 L-12 12 L-40 0 L-12 -12 Z" fill="#FF6B00" />
                    <circle cx="0" cy="0" r="8" fill="#FFFFFF" />
                  </g>

                  {/* Small cat outline on left */}
                  <g transform="translate(80, 280) scale(0.6)">
                    <path d="M40 80 C40 40, 90 40, 90 80 Z" fill="#FF6B00" stroke="#111111" strokeWidth="4" />
                    <polygon points="45,45 55,60 40,60" fill="#111111" />
                    <polygon points="85,45 75,60 90,60" fill="#111111" />
                  </g>
                </svg>

                {/* Overlap Badges */}
                <div className="absolute top-4 right-4 bg-white border border-[#E0E0E0] shadow-xl rounded-2xl p-3 flex items-center gap-3 animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-lg">🐾</div>
                  <div>
                    <h5 className="text-xs font-extrabold text-[#111111]">Casablanca</h5>
                    <p className="text-[10px] text-gray-500">12 sitters dispos</p>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white border border-[#E0E0E0] shadow-xl rounded-2xl p-3 flex items-center gap-3">
                  <div className="flex text-[#FF6B00]">⭐ ⭐ ⭐ ⭐ ⭐</div>
                  <span className="text-xs font-bold text-[#111111]">(4.9/5)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. COMMENT ÇA MARCHE SECTION */}
      <section className="py-20 bg-[#F7F7F7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              {t.how_title}
            </h2>
            <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mb-6 text-2xl font-bold">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-3">
                {t.how_step1_title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.how_step1_desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mb-6 text-2xl font-bold">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-3">
                {t.how_step2_title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.how_step2_desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.01] flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mb-6 text-2xl font-bold">
                <Star className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-3">
                {t.how_step3_title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t.how_step3_desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POURQUOI CHOISIR AMUCH SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Header / Text on left */}
            <div className="lg:col-span-4 text-center lg:text-left space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
                {t.why_title}
              </h2>
              <p className="text-base text-gray-600 leading-relaxed">
                {language === 'FR' && "AMUCH réinvente la garde d'animaux au Maroc en plaçant la confiance, la simplicité et la sécurité au cœur de chaque rencontre."}
                {language === 'AR' && "تعيد منصة أموش ابتكار خدمة رعاية الحيوانات الأليفة في المغرب من خلال وضع الثقة والسهولة والسلامة في قلب كل لقاء."}
                {language === 'EN' && "AMUCH reinvents pet sitting in Morocco by prioritizing trust, simplicity, and safety in every match."}
              </p>
              <button
                onClick={() => setActivePage('about')}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#FF6B00] hover:text-[#E55A00] transition-colors cursor-pointer pt-2"
              >
                <span>{language === 'FR' ? "Découvrir notre histoire" : language === 'AR' ? "اكتشف قصتنا" : "Discover our story"}</span>
                <span>&rarr;</span>
              </button>
            </div>

            {/* Grid on right */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Feature 1 */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 hover:border-[#FF6B00] transition-all">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] mb-4">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{t.why_feature1_title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{t.why_feature1_desc}</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 hover:border-[#FF6B00] transition-all">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] mb-4">
                  <Star className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{t.why_feature2_title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{t.why_feature2_desc}</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 hover:border-[#FF6B00] transition-all">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] mb-4">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{t.why_feature3_title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{t.why_feature3_desc}</p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 hover:border-[#FF6B00] transition-all">
                <div className="w-12 h-12 bg-[#FF6B00]/10 rounded-xl flex items-center justify-center text-[#FF6B00] mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-[#111111] mb-2">{t.why_feature4_title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{t.why_feature4_desc}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. VILLES COUVERTES SECTION */}
      <section className="bg-[#FF6B00] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2">
              {t.cities_title}
            </h2>
            <p className="text-white/85 text-sm max-w-xl mx-auto">
              {t.cities_subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-lg font-bold">
            {CITIES.map((city, idx) => (
              <div 
                key={city} 
                onClick={() => setActivePage('search')}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all cursor-pointer select-none"
              >
                <MapPin className="w-5 h-5 text-white" />
                <span>{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. TÉMOIGNAGES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
              {t.testimonials_title}
            </h2>
            <p className="text-gray-600 text-sm">
              {t.testimonials_subtitle}
            </p>
            <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="text-orange-500 text-lg mb-4">★ ★ ★ ★ ★</div>
                <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                  "{t.test1_text}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white font-extrabold flex items-center justify-center text-sm">
                  Y
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111111]">{t.test1_name}</h5>
                  <p className="text-xs text-gray-500">{t.test1_city}</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="text-orange-500 text-lg mb-4">★ ★ ★ ★ ★</div>
                <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                  "{t.test2_text}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#E55A00] text-white font-extrabold flex items-center justify-center text-sm">
                  M
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111111]">{t.test2_name}</h5>
                  <p className="text-xs text-gray-500">{t.test2_city}</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-left shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="text-orange-500 text-lg mb-4">★ ★ ★ ★ ★</div>
                <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                  "{t.test3_text}"
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white font-extrabold flex items-center justify-center text-sm">
                  S
                </div>
                <div>
                  <h5 className="font-bold text-sm text-[#111111]">{t.test3_name}</h5>
                  <p className="text-xs text-gray-500">{t.test3_city}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      {blogPosts && blogPosts.length > 0 && (
        <section className="py-20 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold tracking-wider uppercase mb-3">
                📰 {language === 'FR' ? "Actualités & Conseils" : language === 'AR' ? "أخبار ونصائح" : "News & Tips"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111111] mb-4">
                {language === 'FR' ? "Le Blog de l'AMUCH" : language === 'AR' ? "مدونة أموش" : "The AMUCH Blog"}
              </h2>
              <div className="w-16 h-1 bg-[#FF6B00] mx-auto rounded-full mb-4"></div>
              <p className="text-sm text-gray-500 font-medium">
                {language === 'FR' 
                  ? "Retrouvez nos derniers conseils pour prendre soin de vos compagnons à quatre pattes."
                  : language === 'AR'
                  ? "اكتشف أحدث النصائح لرعاية حيواناتك الأليفة."
                  : "Find our latest tips for taking care of your four-legged companions."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <div key={post.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col h-full group">
                  {post.imageUrl ? (
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={post.imageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-orange-50/50 flex items-center justify-center text-orange-500 relative">
                      <BookOpen className="w-12 h-12 stroke-1" />
                    </div>
                  )}

                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1 font-semibold">✍️ {post.author}</span>
                        <span className="flex items-center gap-1 font-semibold">📅 {post.date}</span>
                      </div>
                      <h3 className="text-lg font-extrabold text-[#111111] leading-tight tracking-tight line-clamp-2 group-hover:text-[#FF6B00] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-4">
                        {post.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                      <button
                        onClick={() => {
                          setActivePage('blog');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-[#FF6B00] hover:text-[#E55A00] text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all group-hover:translate-x-1 cursor-pointer"
                      >
                        {language === 'FR' ? "Lire la suite" : language === 'AR' ? "اقرأ المزيد" : "Read more"} →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View all blog posts button */}
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  setActivePage('blog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-gray-150 hover:border-[#FF6B00] hover:text-[#FF6B00] text-gray-800 font-extrabold text-xs tracking-wider uppercase rounded-xl transition-all shadow-xs cursor-pointer"
              >
                {language === 'FR' ? "Voir tous les articles" : language === 'AR' ? "عرض جميع المقالات" : "View all articles"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA FINALE */}
      <section className="py-20 bg-[#111111] text-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {t.ctafinal_title}
          </h2>
          <p className="text-base text-gray-400 max-w-lg mx-auto">
            {t.ctafinal_subtitle}
          </p>
          <button
            id="cta-final-start-btn"
            onClick={() => setActivePage('signup-owner')}
            className="px-10 py-4 bg-[#FF6B00] text-white hover:bg-[#E55A00] rounded-xl font-extrabold transition-all hover:scale-105 cursor-pointer shadow-lg"
          >
            {t.ctafinal_btn}
          </button>
        </div>
      </section>
    </div>
  );
}
