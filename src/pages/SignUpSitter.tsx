/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserCheck, Sparkles, FileText, Smartphone, Shield, ArrowRight, ArrowLeft, Upload, Check, Coins } from 'lucide-react';
import { Language, User, Sitter, AnimalType } from '../types';
import { translations } from '../translations';

interface SignUpSitterProps {
  language: Language;
  onSignUpComplete: (sitter: Sitter) => void;
}

export default function SignUpSitter({ language, onSignUpComplete }: SignUpSitterProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('Casablanca');

  const [bio, setBio] = useState('');
  const [capacity, setCapacity] = useState(2);
  const [acceptedPets, setAcceptedPets] = useState<Record<AnimalType, boolean>>({
    chien: true,
    chat: true,
    lapin: false,
    oiseau: false,
    autre: false
  });

  const [pricePerNight, setPricePerNight] = useState(150);
  const [priceWeekend, setPriceWeekend] = useState(280);

  const [phone, setPhone] = useState('');
  const [smsCode, setSmsCode] = useState('');
  const [isSmsSent, setIsSmsSent] = useState(false);
  const [isSmsVerified, setIsSmsVerified] = useState(false);
  const [terms, setTerms] = useState(false);

  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const togglePet = (type: AnimalType) => {
    setAcceptedPets((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const sendSimulatedSms = () => {
    if (!phone) {
      setError(language === 'FR' ? "Entrez votre numéro de téléphone." : "أدخل رقم هاتفك أولاً");
      return;
    }
    setError('');
    setIsSmsSent(true);
    alert(language === 'FR' ? "AMUCH : Votre code de vérification SMS est : 2026" : "أموش: رمز التحقق الخاص بك هو: 2026");
  };

  const verifySmsCode = () => {
    if (smsCode === '2026') {
      setIsSmsVerified(true);
      setError('');
    } else {
      setError(language === 'FR' ? "Code incorrect. Veuillez saisir 2026." : "الرمز غير صحيح. يرجى إدخال 2026");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!firstName || !lastName || !email || !password) {
        setError(language === 'FR' ? "Remplissez tous les champs." : "يرجى ملء جميع الحقول");
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (!bio.trim() || bio.length < 20) {
        setError(language === 'FR' ? "Votre bio doit faire au moins 20 caractères." : "يجب أن تحتوي سيرتك الذاتية على 20 حرفًا على الأقل.");
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      setError('');
      setStep(4);
    } else if (step === 4) {
      if (!isSmsVerified) {
        setError(language === 'FR' ? "Veuillez d'abord vérifier votre numéro de téléphone." : "يرجى التحقق من رقم هاتفك أولاً.");
        return;
      }
      if (!terms) {
        setError(language === 'FR' ? "Vous devez accepter nos conditions." : "يجب الموافقة على الشروط أولاً.");
        return;
      }

      setError('');
      setIsSubmitted(true);

      const newSitter: Sitter = {
        id: `sitter-${Date.now()}`,
        firstName,
        lastName,
        city,
        verified: true,
        rating: 5.0,
        reviewCount: 0,
        acceptedAnimals: (Object.keys(acceptedPets) as AnimalType[]).filter(k => acceptedPets[k]),
        pricePerNight,
        priceWeekend,
        bio,
        photoUrl: (firstName[0] + lastName[0]).toUpperCase(),
        capacityMax: capacity,
        phone,
        availabilities: ['2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28']
      };

      // Call profile signup completion in App state
      setTimeout(() => {
        onSignUpComplete(newSitter);
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        
        {/* Step Indicator HUD */}
        {!isSubmitted && (
          <div className="text-center space-y-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto">
              <UserCheck className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#111111]">
              {t.signup_sitter_title}
            </h1>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              {language === 'FR' ? "Rejoignez le réseau n°1 au Maroc et augmentez vos revenus en gardant des animaux mignons." : "Join Morocco's trusted pet care team and start earning doing what you love."}
            </p>
          </div>
        )}

        {/* Stepper progress bars */}
        {!isSubmitted && (
          <div className="grid grid-cols-4 gap-2 mb-6 text-[10px] font-bold text-gray-400">
            <div className={`text-center pb-2 border-b-2 ${step >= 1 ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-gray-200'}`}>
              {t.signup_sitter_step1}
            </div>
            <div className={`text-center pb-2 border-b-2 ${step >= 2 ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-gray-200'}`}>
              {t.signup_sitter_step2}
            </div>
            <div className={`text-center pb-2 border-b-2 ${step >= 3 ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-gray-200'}`}>
              {t.signup_sitter_step3}
            </div>
            <div className={`text-center pb-2 border-b-2 ${step >= 4 ? 'border-[#FF6B00] text-[#FF6B00]' : 'border-gray-200'}`}>
              {t.signup_sitter_step4}
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm font-bold mb-6 text-center">
            ⚠️ {error}
          </div>
        )}

        {/* Successful submissions HUD card */}
        {isSubmitted ? (
          <div className="bg-white border border-[#E0E0E0] rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto text-4xl animate-bounce">
              ✓
            </div>
            <h2 className="text-2xl font-black text-[#111111]">
              {language === 'FR' ? "Dossier soumis avec succès !" : "Application Submitted Successfully!"}
            </h2>
            <div className="bg-green-50 border border-green-100 p-5 rounded-2xl max-w-md mx-auto text-sm font-bold text-green-800 leading-relaxed">
              {t.signup_sitter_success}
            </div>
            <p className="text-xs text-gray-500 animate-pulse">
              {language === 'FR' ? "Redirection vers votre tableau de bord en cours..." : "Redirecting to your sitter dashboard shortly..."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-10 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* STEP 1: ACCOUNT DETAILS */}
              {step === 1 && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_fname}</label>
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="Youssef"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_lname}</label>
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="Naciri"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_email}</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                      placeholder="youssef@amuch.ma"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.search_city}</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer"
                    >
                      <option value="Casablanca">Casablanca</option>
                      <option value="Rabat">Rabat</option>
                      <option value="Tanger">Tanger</option>
                      <option value="Marrakech">Marrakech</option>
                      <option value="Agadir">Agadir</option>
                      <option value="Fès">Fès</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_pass}</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>{t.signup_owner_continue}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: PROFILE CREATION */}
              {step === 2 && (
                <div className="space-y-6">
                  {/* Photo Profile Simulation */}
                  <div className="flex flex-col sm:flex-row items-center gap-5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center font-bold text-[#FF6B00] text-xl shrink-0">
                      YN
                    </div>
                    <div className="text-center sm:text-left space-y-1.5">
                      <span className="text-xs font-bold text-gray-500 block uppercase">{language === 'FR' ? "Photo de profil Sitter" : "Sitter Profile Photo"}</span>
                      <button type="button" className="text-xs font-extrabold text-[#FF6B00] hover:underline cursor-pointer">
                        {language === 'FR' ? "Modifier / Téléverser une photo" : "Upload picture"}
                      </button>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_bio}</label>
                    <textarea
                      required
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder={t.signup_sitter_bio_placeholder}
                      rows={5}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                    />
                  </div>

                  {/* Accepted animals checkboxes */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-gray-500 uppercase block">{t.search_filter_animal_types}</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {(Object.keys(acceptedPets) as AnimalType[]).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => togglePet(type)}
                          className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                            acceptedPets[type]
                              ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]'
                              : 'border-gray-200 bg-transparent text-gray-500'
                          }`}
                        >
                          <span>
                            {type === 'chien' && '🐶'}
                            {type === 'chat' && '🐱'}
                            {type === 'lapin' && '🐰'}
                            {type === 'oiseau' && '🦜'}
                            {type === 'autre' && '🐾'}
                          </span>
                          <span className="capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Max capacity slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-gray-500 uppercase">
                      <span>{t.signup_sitter_cap}</span>
                      <span className="text-[#FF6B00] font-extrabold">{capacity}</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="6"
                      value={capacity}
                      onChange={(e) => setCapacity(parseInt(e.target.value))}
                      className="w-full accent-[#FF6B00] cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 border border-gray-200 text-[#111111] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.signup_owner_back}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>{t.signup_owner_continue}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: RATES & AVAILABILITIES */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_rate_night}</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={pricePerNight}
                          onChange={(e) => setPricePerNight(parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        />
                        <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">MAD</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_rate_weekend}</label>
                      <div className="relative">
                        <input
                          type="number"
                          required
                          value={priceWeekend}
                          onChange={(e) => setPriceWeekend(parseInt(e.target.value))}
                          className="w-full border border-gray-300 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        />
                        <span className="absolute right-4 top-3.5 text-xs font-bold text-gray-400">MAD</span>
                      </div>
                    </div>
                  </div>

                  {/* Availability Cal placeholder */}
                  <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                      <Coins className="w-5 h-5 text-[#FF6B00]" />
                      {language === 'FR' ? "Calendrier de Disponibilités" : "Availability Calendar"}
                    </h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {language === 'FR' 
                        ? "Par défaut, votre calendrier sera ouvert pour les 30 prochains jours. Vous pourrez ajuster vos plages de repos ou indisponibilités depuis votre espace membre."
                        : "By default, your profile availability is set for the upcoming 30 days. You can black-out rest periods in your dashboard."}
                    </p>
                    <div className="p-3 bg-white border border-gray-100 rounded-xl text-center text-xs font-bold text-green-600">
                      🐾 30 {language === 'FR' ? "jours de disponibilité activés d'office" : "days of default availability turned on"}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="w-1/3 py-4 border border-gray-200 text-[#111111] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.signup_owner_back}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>{t.signup_owner_continue}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: TRUST VERIFICATION & SUBMIT */}
              {step === 4 && (
                <div className="space-y-6">
                  {/* ID Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_id_upload} <span className="text-red-500">*</span></label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-[#FF6B00]/5 hover:border-[#FF6B00] transition-all">
                      <FileText className="w-8 h-8 text-[#FF6B00] mx-auto mb-2" />
                      <span className="text-xs font-extrabold text-[#111111] block">
                        {language === 'FR' ? "Déposer votre CIN (Recto/Verso) ou Passeport" : "Upload Government ID card"}
                      </span>
                      <span className="text-[10px] text-gray-400 mt-1 block">Fichiers acceptés : PDF, JPG, PNG (Max. 10MB)</span>
                    </div>
                  </div>

                  {/* SMS verify simulator */}
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
                    <h4 className="text-sm font-bold text-[#111111] flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#FF6B00]" />
                      {language === 'FR' ? "Sécurité : Vérification SMS" : "Security: SMS Verification"}
                    </h4>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_phone}</label>
                      <div className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+212 6 12 34 56 78"
                          disabled={isSmsVerified}
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        />
                        <button
                          type="button"
                          onClick={sendSimulatedSms}
                          disabled={isSmsVerified}
                          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-[#111111] text-xs font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          {isSmsSent ? (language === 'FR' ? "Renvoyer" : "إعادة إرسال") : (language === 'FR' ? "Recevoir le code" : "استلام الرمز")}
                        </button>
                      </div>
                    </div>

                    {isSmsSent && !isSmsVerified && (
                      <div className="space-y-3 pt-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_sitter_sms}</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={smsCode}
                            onChange={(e) => setSmsCode(e.target.value)}
                            placeholder="Entrez 2026"
                            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                          />
                          <button
                            type="button"
                            onClick={verifySmsCode}
                            className="px-5 py-2 bg-[#FF6B00] text-white text-xs font-bold rounded-xl hover:bg-[#E55A00] transition-colors cursor-pointer"
                          >
                            {language === 'FR' ? "Valider" : "تأكيد"}
                          </button>
                        </div>
                      </div>
                    )}

                    {isSmsVerified && (
                      <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl text-center">
                        ✓ {language === 'FR' ? "Numéro de téléphone validé avec succès !" : "Phone number verified!"}
                      </div>
                    )}
                  </div>

                  {/* Conditions checkbox */}
                  <label className="flex items-start gap-3 cursor-pointer pt-2">
                    <input
                      type="checkbox"
                      checked={terms}
                      onChange={(e) => setTerms(e.target.checked)}
                      className="w-5 h-5 rounded text-[#FF6B00] border-gray-300 accent-[#FF6B00] shrink-0 mt-0.5 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-600 leading-relaxed">
                      {language === 'FR' 
                        ? "Je certifie sur l'honneur l'exactitude de mes informations et j'accepte la Charte de Confiance AMUCH de garde d'animaux."
                        : "I certify that all provided details are correct and I accept the AMUCH Trust Charter."}
                    </span>
                  </label>

                  <div className="flex gap-4 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="w-1/3 py-4 border border-gray-200 text-[#111111] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.signup_owner_back}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-4 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Shield className="w-5 h-5" />
                      <span>{t.signup_sitter_submit}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
          </div>
        )}

      </div>
    </div>
  );
}
