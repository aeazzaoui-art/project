/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Star, ShieldCheck, MapPin, Calendar, Heart, MessageSquare, ChevronLeft, CalendarCheck } from 'lucide-react';
import { Language, Sitter, Review } from '../types';
import { translations } from '../translations';

interface SitterProfileProps {
  language: Language;
  sitter: Sitter;
  reviews: Review[];
  onBack: () => void;
  onBook: (dates: { start: string; end: string }) => void;
  onStartChat: () => void;
}

export default function SitterProfile({ language, sitter, reviews, onBack, onBook, onStartChat }: SitterProfileProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Get reviews only for this sitter
  const sitterReviews = useMemo(() => {
    return reviews.filter((r) => r.sitterId === sitter.id);
  }, [sitter.id, reviews]);

  // Generate mini calendar dates for next 14 days
  const nextDays = useMemo(() => {
    const days = [];
    const today = new Date('2026-06-23');
    for (let i = 0; i < 14; i++) {
      const next = new Date(today);
      next.setDate(today.getDate() + i);
      const iso = next.toISOString().split('T')[0];
      const isAvailable = sitter.availabilities.includes(iso);
      days.push({
        dateStr: iso,
        dayNum: next.getDate(),
        monthStr: next.toLocaleString(language === 'AR' ? 'ar' : 'fr', { month: 'short' }),
        weekday: next.toLocaleString(language === 'AR' ? 'ar' : 'fr', { weekday: 'short' }),
        isAvailable
      });
    }
    return days;
  }, [sitter.availabilities, language]);

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Cover Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-[#FF6B00] via-[#E55A00] to-[#FF6B00]/40 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end">
          <button
            onClick={onBack}
            className="absolute top-6 left-6 flex items-center gap-1.5 px-4 py-2 bg-white/90 hover:bg-white text-[#111111] font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.profile_back}</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left / Central Info (Column 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sitter Intro Header Card */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                {/* Large Profile Image */}
                <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
                  <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-xl flex items-center justify-center font-extrabold text-3xl text-[#FF6B00] relative shrink-0">
                    {sitter.photoUrl}
                    {sitter.verified && (
                      <span className="absolute bottom-1.5 right-1.5 p-1 bg-green-500 rounded-full text-white border-2 border-white" title="Vérifié">
                        <ShieldCheck className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-extrabold text-[#111111]">
                      {sitter.firstName} {sitter.lastName}
                    </h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-semibold text-gray-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-[#FF6B00]" />
                        {sitter.city}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1 text-[#FF6B00]">
                        <Star className="w-4 h-4 fill-[#FF6B00] stroke-none" />
                        {sitter.rating} / 5 ({sitter.reviewCount} avis)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sitter Actions */}
                <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
                  <button
                    id="profile-action-book-btn"
                    onClick={() => onBook({ start: '2026-06-24', end: '2026-06-28' })}
                    className="flex-1 md:flex-none px-6 py-3 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-colors cursor-pointer text-center shadow-md whitespace-nowrap"
                  >
                    {t.profile_book_now}
                  </button>
                  <button
                    id="profile-action-message-btn"
                    onClick={onStartChat}
                    className="flex-1 md:flex-none px-6 py-3 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/5 rounded-xl font-extrabold transition-colors cursor-pointer text-center whitespace-nowrap"
                  >
                    {t.profile_send_message}
                  </button>
                </div>
              </div>

              {/* Bio description */}
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-extrabold text-[#111111] text-lg mb-3">
                  {t.profile_about} {sitter.firstName}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {sitter.bio}
                </p>
              </div>

              {/* Accepted animal chips */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {language === 'FR' ? "Animaux accueillis" : language === 'AR' ? "الحيوانات المستضافة" : "Pets Welcomed"}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sitter.acceptedAnimals.map((animal) => (
                    <span
                      key={animal}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 text-[#111111] font-bold text-sm rounded-xl flex items-center gap-2 capitalize"
                    >
                      <span>
                        {animal === 'chien' && '🐶'}
                        {animal === 'chat' && '🐱'}
                        {animal === 'lapin' && '🐰'}
                        {animal === 'oiseau' && '🦜'}
                        {animal === 'autre' && '🐾'}
                      </span>
                      <span>
                        {animal === 'chien' && (language === 'FR' ? 'Chien' : language === 'AR' ? 'كلب' : 'Dog')}
                        {animal === 'chat' && (language === 'FR' ? 'Chat' : language === 'AR' ? 'قطة' : 'Cat')}
                        {animal === 'lapin' && (language === 'FR' ? 'Lapin' : language === 'AR' ? 'أرنب' : 'Rabbit')}
                        {animal === 'oiseau' && (language === 'FR' ? 'Oiseau' : language === 'AR' ? 'طائر' : 'Bird')}
                        {animal === 'autre' && (language === 'FR' ? 'Autre' : language === 'AR' ? 'آخر' : 'Other')}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Disponibilités Mini-Calendar */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-[#111111] text-lg flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-[#FF6B00]" />
                  {t.profile_availabilities}
                </h3>
                {/* Calendar Legend */}
                <div className="flex items-center gap-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-[#FF6B00] rounded-full"></div>
                    <span className="text-gray-500">{t.profile_available_legend}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                    <span className="text-gray-500">{t.profile_unavailable_legend}</span>
                  </div>
                </div>
              </div>

              {/* Scrollable grid of days */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 pt-2">
                {nextDays.map((day) => (
                  <div
                    key={day.dateStr}
                    className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                      day.isAvailable
                        ? 'bg-[#FF6B00]/5 border-[#FF6B00] text-[#FF6B00]'
                        : 'bg-gray-50 border-gray-100 text-gray-400'
                    }`}
                  >
                    <span className="text-[10px] font-extrabold uppercase">{day.weekday}</span>
                    <span className="text-lg font-black my-1">{day.dayNum}</span>
                    <span className="text-[9px] font-bold uppercase">{day.monthStr}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews list Section */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
              <h3 className="font-extrabold text-[#111111] text-lg border-b border-gray-100 pb-4">
                {t.profile_reviews_title} ({sitterReviews.length + 4})
              </h3>

              <div className="space-y-6">
                {/* Seed reviews */}
                {sitterReviews.map((rev) => (
                  <div key={rev.id} className="space-y-3 pb-6 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 font-bold text-sm text-[#FF6B00] flex items-center justify-center">
                          {rev.authorName[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#111111]">{rev.authorName}</h4>
                          <p className="text-xs text-gray-500">{rev.authorCity} &bull; {rev.date}</p>
                        </div>
                      </div>
                      <div className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                        ★ {rev.rating}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">
                      "{rev.text}"
                    </p>
                  </div>
                ))}

                {/* Additional simulated reviews if none correspond specifically */}
                <div className="space-y-3 pb-6 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF6B00] font-bold text-sm flex items-center justify-center">
                        M
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#111111]">Mehdi</h4>
                        <p className="text-xs text-gray-500">Rabat &bull; 2026-06-02</p>
                      </div>
                    </div>
                    <div className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                      ★ 5
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic">
                    {language === 'FR' && "Une garde en or ! Tout s'est idéalement déroulé. Très professionnel et passionné d'animaux."}
                    {language === 'AR' && "رعاية ذهبية! كل شيء سار بشكل مثالي. محترف للغاية ومحب للحيوانات."}
                    {language === 'EN' && "Outstanding pet sitting service! Everything went flawlessly. Highly professional and caring."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Pricing & Booking (Column 3) */}
          <div className="space-y-6">
            {/* Pricing Summary Widget */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="font-extrabold text-[#111111] text-base border-b border-gray-100 pb-4">
                {t.profile_pricing}
              </h3>

              <div className="space-y-4">
                {/* Night pricing */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-500">{t.profile_price_night}</span>
                  <span className="font-extrabold text-[#111111]">{sitter.pricePerNight} MAD</span>
                </div>

                {/* Day visit pricing */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-500">{t.profile_price_day}</span>
                  <span className="font-extrabold text-[#111111]">{Math.round(sitter.pricePerNight * 0.7)} MAD</span>
                </div>

                {/* Weekend pricing */}
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-gray-500">{t.profile_price_weekend}</span>
                  <span className="font-extrabold text-[#111111]">{sitter.priceWeekend || (sitter.pricePerNight * 2 - 20)} MAD</span>
                </div>
              </div>

              <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/20 rounded-2xl p-4 text-center space-y-2">
                <span className="text-xs font-bold text-gray-500 uppercase block">
                  {language === 'FR' ? "Capacité maximale" : language === 'AR' ? "السعة القصوى" : "Max Capacity"}
                </span>
                <span className="text-lg font-black text-[#FF6B00]">
                  {sitter.capacityMax} {sitter.capacityMax > 1 ? (language === 'FR' ? 'animaux' : language === 'AR' ? 'حيوانات' : 'pets') : (language === 'FR' ? 'animal' : language === 'AR' ? 'حيوان' : 'pet')}
                </span>
              </div>
            </div>

            {/* Quick trust checklist */}
            <div className="bg-[#111111] text-white rounded-3xl p-6 shadow-sm space-y-4">
              <h4 className="font-bold text-sm tracking-wider uppercase text-[#FF6B00]">
                {language === 'FR' ? "Garantie AMUCH" : language === 'AR' ? "ضمانة أموش" : "AMUCH Guarantee"}
              </h4>
              <ul className="text-xs space-y-3 font-medium text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="text-[#FF6B00] font-bold">✔</span>
                  <span>{language === 'FR' ? "Profil CIN vérifié par nos équipes" : "National ID card (CIN) verified by team"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF6B00] font-bold">✔</span>
                  <span>{language === 'FR' ? "Assurance en cas d'urgence vétérinaire" : "Veterinary emergency support coverage"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#FF6B00] font-bold">✔</span>
                  <span>{language === 'FR' ? "Photos et nouvelles quotidiennes garanties" : "Daily text & photo updates guaranteed"}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
