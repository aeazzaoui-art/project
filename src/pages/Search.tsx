/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Star, ShieldCheck, MapPin, Search as SearchIcon, Filter, Sliders, CalendarDays, Check, PawPrint } from 'lucide-react';
import { Language, Sitter, AnimalType, Review } from '../types';
import { translations } from '../translations';
import { CITIES } from '../data';
import { getSitterRatingAndCount } from '../lib/ratingUtils';

interface SearchProps {
  language: Language;
  sitters: Sitter[];
  reviews: Review[];
  onSelectSitter: (sitter: Sitter) => void;
  onBookSitter: (sitter: Sitter, dates: { start: string; end: string }) => void;
}

export default function Search({ language, sitters, reviews, onSelectSitter, onBookSitter }: SearchProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Search States
  const [selectedCity, setSelectedCity] = useState('Casablanca');
  const [startDate, setStartDate] = useState('2026-06-24');
  const [endDate, setEndDate] = useState('2026-06-28');
  const [selectedAnimalType, setSelectedAnimalType] = useState<AnimalType | 'all'>('all');

  // Sidebar Filter States
  const [minRating, setMinRating] = useState<number>(4.5);
  const [maxPrice, setMaxPrice] = useState<number>(200);
  const [acceptedPets, setAcceptedPets] = useState<Record<AnimalType, boolean>>({
    chien: true,
    chat: true,
    lapin: true,
    oiseau: true,
    autre: true
  });
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);

  const handleAnimalCheckbox = (type: AnimalType) => {
    setAcceptedPets((prev) => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  // Live filtering logic
  const filteredSitters = useMemo(() => {
    return sitters.filter((sitter) => {
      // 1. City check
      if (selectedCity && sitter.city.toLowerCase() !== selectedCity.toLowerCase()) {
        return false;
      }

      // 2. Rating check
      const { rating } = getSitterRatingAndCount(sitter, reviews);
      if (rating > 0 && rating < minRating) {
        return false;
      }

      // 3. Price check
      if (sitter.pricePerNight > maxPrice) {
        return false;
      }

      // 4. Verification check
      if (onlyVerified && !sitter.verified) {
        return false;
      }

      // 5. Check if accepts the animal selected in top bar
      if (selectedAnimalType !== 'all' && !sitter.acceptedAnimals.includes(selectedAnimalType as AnimalType)) {
        return false;
      }

      // 6. Check if accepts any of the active sidebar checkboxes
      const acceptedBySitter = sitter.acceptedAnimals.some((animal) => acceptedPets[animal]);
      if (!acceptedBySitter) {
        return false;
      }

      return true;
    });
  }, [sitters, selectedCity, selectedAnimalType, minRating, maxPrice, onlyVerified, acceptedPets]);

  return (
    <div className="min-h-screen bg-[#F7F7F7]" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Top Search Bar Form Container */}
      <div className="bg-[#FF6B00] text-white py-10 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center lg:text-left">
            {t.search_bar_title}
          </h1>

          <div className="bg-white text-[#111111] p-4 sm:p-6 rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {/* Field 1: City */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                {t.search_city}
              </label>
              <select
                id="search-city-dropdown"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF6B00] cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Autre">{language === 'FR' ? "Autre" : language === 'AR' ? "مدينة أخرى" : "Other"}</option>
              </select>
            </div>

            {/* Field 2: Start date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#FF6B00]" />
                {t.search_start}
              </label>
              <input
                id="search-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF6B00] cursor-pointer"
              />
            </div>

            {/* Field 3: End date */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#FF6B00]" />
                {t.search_end}
              </label>
              <input
                id="search-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF6B00] cursor-pointer"
              />
            </div>

            {/* Field 4: Animal type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1">
                <PawPrint className="w-3.5 h-3.5 text-[#FF6B00]" />
                {t.search_animal}
              </label>
              <select
                id="search-animal-dropdown"
                value={selectedAnimalType}
                onChange={(e) => setSelectedAnimalType(e.target.value as AnimalType | 'all')}
                className="w-full border border-[#E0E0E0] rounded-xl px-3 py-3 text-sm font-semibold focus:outline-none focus:border-[#FF6B00] cursor-pointer"
              >
                <option value="all">{language === 'FR' ? "Tous" : language === 'AR' ? "الكل" : "All"}</option>
                <option value="chien">{language === 'FR' ? "Chien 🐶" : language === 'AR' ? "كلب 🐶" : "Dog 🐶"}</option>
                <option value="chat">{language === 'FR' ? "Chat 🐱" : language === 'AR' ? "قطة 🐱" : "Cat 🐱"}</option>
                <option value="lapin">{language === 'FR' ? "Lapin 🐰" : language === 'AR' ? "أرنب 🐰" : "Rabbit 🐰"}</option>
                <option value="oiseau">{language === 'FR' ? "Oiseau 🦜" : language === 'AR' ? "طائر 🦜" : "Bird 🦜"}</option>
                <option value="autre">{language === 'FR' ? "Autre 🐾" : language === 'AR' ? "آخر 🐾" : "Other 🐾"}</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              id="top-search-submit-btn"
              className="w-full bg-[#FF6B00] text-white hover:bg-[#E55A00] transition-colors py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <SearchIcon className="w-5 h-5" />
              <span>{t.search_btn}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Search Content layout (Sidebar + Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters (Column 1) */}
          <div className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm h-fit space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="font-extrabold text-[#111111] flex items-center gap-2 text-base">
                <Sliders className="w-5 h-5 text-[#FF6B00]" />
                {t.search_filters_title}
              </h3>
              <button
                onClick={() => {
                  setMinRating(4.5);
                  setMaxPrice(200);
                  setOnlyVerified(false);
                  setAcceptedPets({ chien: true, chat: true, lapin: true, oiseau: true, autre: true });
                }}
                className="text-xs font-bold text-[#FF6B00] hover:underline cursor-pointer"
              >
                {language === 'FR' ? "Réinitialiser" : language === 'AR' ? "إعادة ضبط" : "Reset"}
              </button>
            </div>

            {/* Filter 1: Rating slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-[#111111]">
                <span>{t.search_filter_rating}</span>
                <span className="text-[#FF6B00]">★ {minRating}</span>
              </div>
              <input
                id="filter-rating-slider"
                type="range"
                min="4.0"
                max="5.0"
                step="0.1"
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
            </div>

            {/* Filter 2: Price slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-[#111111]">
                <span>{t.search_filter_price}</span>
                <span className="text-[#FF6B00]">{maxPrice} MAD</span>
              </div>
              <input
                id="filter-price-slider"
                type="range"
                min="80"
                max="300"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-[#FF6B00] cursor-pointer"
              />
            </div>

            {/* Filter 3: Checkboxes */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#111111]">
                {t.search_filter_animal_types}
              </h4>
              <div className="space-y-2.5">
                {(Object.keys(acceptedPets) as AnimalType[]).map((type) => (
                  <label key={type} className="flex items-center gap-3 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input
                      id={`filter-pet-${type}`}
                      type="checkbox"
                      checked={acceptedPets[type]}
                      onChange={() => handleAnimalCheckbox(type)}
                      className="w-4.5 h-4.5 rounded text-[#FF6B00] focus:ring-[#FF6B00] border-gray-300 accent-[#FF6B00] cursor-pointer"
                    />
                    <span className="capitalize">
                      {type === 'chien' && (language === 'FR' ? 'Chien 🐶' : language === 'AR' ? 'كلب' : 'Dog')}
                      {type === 'chat' && (language === 'FR' ? 'Chat 🐱' : language === 'AR' ? 'قطة' : 'Cat')}
                      {type === 'lapin' && (language === 'FR' ? 'Lapin 🐰' : language === 'AR' ? 'أرنب' : 'Rabbit')}
                      {type === 'oiseau' && (language === 'FR' ? 'Oiseau 🦜' : language === 'AR' ? 'طائر' : 'Bird')}
                      {type === 'autre' && (language === 'FR' ? 'Autre 🐾' : language === 'AR' ? 'آخر' : 'Other')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter 4: Verified Sitter Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <label htmlFor="verified-toggle" className="text-sm font-bold text-[#111111] cursor-pointer">
                {t.search_filter_verified}
              </label>
              <button
                id="verified-toggle"
                onClick={() => setOnlyVerified(!onlyVerified)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  onlyVerified ? 'bg-[#FF6B00]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    onlyVerified ? (isRtl ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Sitter Grid (Columns 2-4) */}
          <div className="lg:col-span-3 space-y-6">
            {filteredSitters.length === 0 ? (
              <div className="bg-white border border-[#E0E0E0] rounded-2xl p-12 text-center shadow-sm space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-[#111111]">{t.search_no_results}</h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {language === 'FR' ? "Essayez de modifier ou de réinitialiser vos filtres de recherche pour afficher plus de professionnels disponibles." : "Try expanding your price range or selection filters to find more available sitters."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSitters.map((sitter) => {
                  const { rating, reviewCount } = getSitterRatingAndCount(sitter, reviews);
                  return (
                    <div
                      key={sitter.id}
                      id={`sitter-card-${sitter.id}`}
                      className="bg-white border border-[#E0E0E0] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      {/* Top Content */}
                      <div className="p-5 space-y-4">
                        {/* Avatar and Name row */}
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-[#FF6B00]/10 border-2 border-[#FF6B00] overflow-hidden flex items-center justify-center font-extrabold text-lg text-[#FF6B00] shrink-0">
                            {sitter.photoUrl && (sitter.photoUrl.startsWith('data:image') || sitter.photoUrl.startsWith('http')) ? (
                              <img src={sitter.photoUrl} alt="Sitter" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              sitter.photoUrl || `${sitter.firstName[0]}${sitter.lastName[0]}`
                            )}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-base text-[#111111] truncate">
                              {sitter.firstName} {sitter.lastName[0]}.
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-semibold text-gray-500 flex items-center gap-0.5">
                                <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                                {sitter.city}
                              </span>
                              {sitter.verified && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200">
                                  {t.search_verified_badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Rating row */}
                        <div className="flex items-center justify-between text-xs font-bold bg-gray-50 rounded-lg p-2.5">
                          <span className="text-[#FF6B00] flex items-center gap-0.5">
                            <Star className="w-4 h-4 fill-[#FF6B00] stroke-none" />
                            {rating > 0 ? rating : "0.0"}
                          </span>
                          <span className="text-gray-500">({reviewCount} {language === 'FR' ? "avis" : language === 'AR' ? "تقييم" : "reviews"})</span>
                        </div>

                      {/* Bio excerpt */}
                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {sitter.bio}
                      </p>

                      {/* Animals chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {sitter.acceptedAnimals.map((animal) => (
                          <span key={animal} className="text-[10px] font-bold bg-[#FF6B00]/5 text-[#FF6B00] px-2 py-0.5 rounded-md capitalize">
                            {animal === 'chien' && '🐶'}
                            {animal === 'chat' && '🐱'}
                            {animal === 'lapin' && '🐰'}
                            {animal === 'oiseau' && '🦜'}
                            {animal === 'autre' && '🐾'}
                            {" "}
                            {animal}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & Booking buttons at bottom */}
                    <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-3 mt-auto">
                      <div className="flex items-baseline justify-between">
                        <span className="text-xs font-bold text-gray-500">{language === 'FR' ? "Tarif" : language === 'AR' ? "السعر" : "Rate"}</span>
                        <span className="text-base font-extrabold text-[#111111]">
                          {sitter.pricePerNight} <span className="text-xs font-bold text-gray-600">{t.search_per_night}</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          id={`view-profile-btn-${sitter.id}`}
                          onClick={() => onSelectSitter(sitter)}
                          className="w-full py-2 border border-[#FF6B00] text-[#FF6B00] font-bold text-xs rounded-lg hover:bg-[#FF6B00]/5 transition-colors text-center cursor-pointer"
                        >
                          {t.search_btn_profile}
                        </button>
                        <button
                          id={`book-now-btn-${sitter.id}`}
                          onClick={() => onBookSitter(sitter, { start: startDate, end: endDate })}
                          className="w-full py-2 bg-[#FF6B00] text-white font-bold text-xs rounded-lg hover:bg-[#E55A00] transition-colors text-center cursor-pointer shadow-sm"
                        >
                          {t.search_btn_book}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
