/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserPlus, Sparkles, CheckCircle, ArrowRight, ArrowLeft, Upload, FileCheck, HelpCircle, LogIn, Loader2 } from 'lucide-react';
import { Language, User, Pet, AnimalType, Sitter } from '../types';
import { translations } from '../translations';
import { SITTERS } from '../data';
import { signUpOwnerWithAuth, loginWithAuth, getSitter } from '../lib/firebaseService';
import SignUpSitter from './SignUpSitter';
import { TermsModal } from './Terms';

interface SignUpOwnerProps {
  language: Language;
  onSignUpComplete: (user: User) => void;
  onSitterSignUpComplete: (sitter: Sitter) => void;
  initialMode?: 'login' | 'signup';
  onLoginComplete?: (user: User) => void;
}

export default function SignUpOwner({
  language,
  onSignUpComplete,
  onSitterSignUpComplete,
  initialMode = 'signup',
  onLoginComplete
}: SignUpOwnerProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  const [currentMode, setCurrentMode] = useState<'login' | 'signup'>(initialMode);
  const [signUpRole, setSignUpRole] = useState<'owner' | 'sitter'>('owner');
  const [sitterStep, setSitterStep] = useState(1);

  useEffect(() => {
    setCurrentMode(initialMode);
  }, [initialMode]);

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Account States
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [city, setCity] = useState('Casablanca');

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState<'owner' | 'sitter'>('owner');

  // Step 2: Pets States
  const [pets, setPets] = useState<Pet[]>([
    { id: 'pet-1', name: '', type: 'chien', breed: '', age: '', photoUrl: '🐶' }
  ]);
  const [currentPetIdx, setCurrentPetIdx] = useState(0);

  // General errors
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoginSubmitted, setIsLoginSubmitted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  // Handle adding another pet
  const handleAddAnotherPet = () => {
    const newId = `pet-${Date.now()}`;
    setPets((prev) => [
      ...prev,
      { id: newId, name: '', type: 'chien', breed: '', age: '', photoUrl: '🐶' }
    ]);
    setCurrentPetIdx(pets.length);
  };

  const updatePetField = (field: keyof Pet, value: any) => {
    setPets((prev) => {
      const copy = [...prev];
      copy[currentPetIdx] = {
        ...copy[currentPetIdx],
        [field]: value,
        // Automatically match icon on type change
        photoUrl: field === 'type' 
          ? (value === 'chien' ? '🐶' : value === 'chat' ? '🐱' : value === 'lapin' ? '🐰' : value === 'oiseau' ? '🦜' : '🐾')
          : copy[currentPetIdx].photoUrl
      };
      return copy;
    });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      setError(language === 'FR' ? 'Veuillez remplir tous les champs requis.' : 'الرجاء ملء جميع الحقول المطلوبة');
      return;
    }
    if (password !== confirmPassword) {
      setError(language === 'FR' ? 'Les mots de passe ne correspondent pas.' : 'كلمات المرور غير متطابقة');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate pet details
    const activePet = pets[currentPetIdx];
    if (!activePet.name.trim() || !activePet.breed.trim() || !activePet.age.trim()) {
      setError(language === 'FR' ? "Veuillez renseigner le nom, la race et l'âge de votre animal." : "الرجاء إدخال اسم، سلالة وعمر حيوانك الأليف.");
      return;
    }
    setError('');
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    if (!termsAccepted) {
      setIsTermsModalOpen(true);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const activePets = pets.filter(p => p.name.trim() !== '');
      const userData: Omit<User, 'id'> = {
        firstName,
        lastName,
        email,
        role: 'owner',
        city,
        pets: activePets
      };
      
      const newUser = await signUpOwnerWithAuth(email, password, userData);
      setIsSubmitted(true);
      setTimeout(() => {
        onSignUpComplete(newUser);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      if (err?.message === 'EMAIL_ALREADY_EXISTS' || err?.code === 'auth/email-already-in-use' || String(err?.message || '').includes('email-already-in-use')) {
        setError(
          language === 'FR'
            ? "Cette adresse e-mail est déjà associée à un compte existant. Veuillez vous connecter ou utiliser un autre e-mail."
            : "عنوان البريد الإلكتروني هذا مرتبط بالفعل بحساب موجود. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر."
        );
      } else {
        setError(err?.message || "An error occurred during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError(language === 'FR' ? 'Veuillez remplir tous les champs.' : 'الرجاء ملء جميع الحقول');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const loggedUser = await loginWithAuth(loginEmail, loginPassword);
      
      if (loggedUser.isBlocked) {
        throw new Error(
          language === 'FR' 
            ? "Votre compte a été suspendu ou bloqué par l'administrateur de la plateforme Amuch." 
            : "تم تعليق حسابك أو حظره من قبل مسؤول منصة أموش."
        );
      }
      
      localStorage.setItem('amuch_user', JSON.stringify(loggedUser));
      if (loggedUser.role === 'sitter') {
        let matchedSitter = await getSitter(loggedUser.id);
        if (!matchedSitter) {
          // Fallback if not found, though should exist
          matchedSitter = SITTERS.find(s => s.id === loggedUser.id) || SITTERS[0];
        }
        localStorage.setItem('amuch_sitter_user', JSON.stringify(matchedSitter));
      } else {
        localStorage.removeItem('amuch_sitter_user');
      }

      if (onLoginComplete) {
        setIsLoginSubmitted(true);
        setTimeout(() => {
          onLoginComplete(loggedUser);
        }, 1500);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Login failed. Please check your email and password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-12 px-4 sm:px-6 lg:px-8" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto">
        
        {/* Page title and Header intro */}
        <div className="text-center space-y-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto">
            {currentMode === 'login' ? (
              <LogIn className="w-6 h-6" />
            ) : (
              <UserPlus className="w-6 h-6" />
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-[#111111]">
            {currentMode === 'login'
              ? (language === 'FR' ? "Connexion à votre compte" : language === 'AR' ? "تسجيل الدخول إلى حسابك" : "Log In to Your Account")
              : t.signup_owner_title
            }
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {currentMode === 'login'
              ? (language === 'FR' ? "Accédez à votre espace AMUCH pour gérer vos réservations et vos messages." : language === 'AR' ? "الولوج إلى حسابك في أموش لإدارة حجوزاتك ورسائلك." : "Access your AMUCH space to manage your bookings and messages.")
              : (language === 'FR' ? "Trouvez la garde idéale et chattez avec les meilleurs sitters à proximité." : language === 'AR' ? "ابحث عن الرعاية المثالية ودردش مع أفضل الحراس القريبين منك." : "Find the perfect pet sitter and chat with trusted locals.")
            }
          </p>
        </div>

        {/* Tab Switcher for Sign Up / Log In */}
        {((currentMode === 'login') || (currentMode === 'signup' && signUpRole === 'owner' && step === 1) || (currentMode === 'signup' && signUpRole === 'sitter' && sitterStep === 1)) && (
          <div className="flex bg-white rounded-2xl p-1 border border-[#E0E0E0] mb-6 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setError('');
                setCurrentMode('signup');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer text-center ${
                currentMode === 'signup'
                  ? 'bg-[#FF6B00] text-white shadow-md'
                  : 'text-gray-500 hover:text-[#111111]'
              }`}
            >
              {language === 'FR' ? "S'inscrire" : language === 'AR' ? "إنشاء حساب" : "Sign Up"}
            </button>
            <button
              type="button"
              onClick={() => {
                setError('');
                setCurrentMode('login');
              }}
              className={`flex-1 py-3 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer text-center ${
                currentMode === 'login'
                  ? 'bg-[#FF6B00] text-white shadow-md'
                  : 'text-gray-500 hover:text-[#111111]'
              }`}
            >
              {language === 'FR' ? "Connexion" : language === 'AR' ? "تسجيل الدخول" : "Log In"}
            </button>
          </div>
        )}

        {/* Unified Role Selector for Sign Up (only in signup mode on step 1) */}
        {currentMode === 'signup' && ((signUpRole === 'owner' && step === 1) || (signUpRole === 'sitter' && sitterStep === 1)) && (
          <div className="mb-6 space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
              {language === 'FR' ? "Je souhaite m'inscrire en tant que :" : language === 'AR' ? "أريد التسجيل كـ :" : "I want to sign up as:"}
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setSignUpRole('owner')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  signUpRole === 'owner'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-extrabold shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'
                }`}
              >
                <span className="text-xl">🐶</span>
                <span className="text-xs font-bold">
                  {language === 'FR' ? "Propriétaire d'animal" : language === 'AR' ? "صاحب حيوان أليف" : "Pet Owner"}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSignUpRole('sitter')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                  signUpRole === 'sitter'
                    ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-extrabold shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'
                }`}
              >
                <span className="text-xl">🐈</span>
                <span className="text-xs font-bold">
                  {language === 'FR' ? "Pet Sitter" : language === 'AR' ? "حارس حيوانات" : "Pet Sitter"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Form Stepper HUD bar (only in signup mode for owners) */}
        {currentMode === 'signup' && signUpRole === 'owner' && (
          <div className="bg-white border border-[#E0E0E0] rounded-2xl px-6 py-4 shadow-sm mb-6 flex justify-between items-center text-xs font-bold text-gray-400">
            <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-[#FF6B00]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 1 ? 'border-[#FF6B00] bg-[#FF6B00]/5 font-black' : 'border-gray-300'}`}>1</span>
              <span>{t.signup_owner_step1}</span>
            </div>
            <div className="flex-1 h-[1px] bg-gray-200 mx-4"></div>
            <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-[#FF6B00]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 2 ? 'border-[#FF6B00] bg-[#FF6B00]/5 font-black' : 'border-gray-300'}`}>2</span>
              <span>{t.signup_owner_step2}</span>
            </div>
            <div className="flex-1 h-[1px] bg-gray-200 mx-4"></div>
            <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-[#FF6B00]' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center border text-[10px] ${step >= 3 ? 'border-[#FF6B00] bg-[#FF6B00]/5 font-black' : 'border-gray-300'}`}>3</span>
              <span>{t.signup_owner_step3}</span>
            </div>
          </div>
        )}

        {/* Global form errors */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm font-bold mb-6 text-center animate-pulse">
            ⚠️ {error}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[#FF6B00]" />
            <p className="font-black text-[#111111] animate-pulse uppercase tracking-widest text-xs">
              {language === 'FR' ? "Traitement en cours..." : language === 'AR' ? "جاري المعالجة..." : "Processing..."}
            </p>
          </div>
        )}

        {/* Active step contents wrapper */}
        {currentMode === 'signup' && signUpRole === 'sitter' ? (
          <SignUpSitter
            language={language}
            onSignUpComplete={onSitterSignUpComplete}
            isEmbedded={true}
            onStepChange={setSitterStep}
          />
        ) : isSubmitted ? (
          <div className="bg-white border border-[#E0E0E0] rounded-3xl p-8 text-center shadow-xl space-y-6">
            <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto text-4xl animate-bounce">
              ✓
            </div>
            <h2 className="text-2xl font-black text-[#111111]">
              {language === 'FR' ? "Compte créé avec succès !" : language === 'AR' ? "تم إنشاء الحساب بنجاح!" : "Account Created Successfully!"}
            </h2>
            <div className="bg-green-50 border border-green-100 p-5 rounded-2xl max-w-md mx-auto text-sm font-bold text-green-800 leading-relaxed">
              {language === 'FR' ? "Votre profil a été enregistré avec succès." : language === 'AR' ? "تم حفظ ملفك الشخصي بنجاح." : "Your profile has been saved successfully."}
            </div>
            <p className="text-xs text-gray-500 animate-pulse">
              {language === 'FR' ? "Redirection vers votre tableau de bord en cours..." : language === 'AR' ? "جاري التوجيه إلى لوحة التحكم الخاصة بك..." : "Redirecting to your dashboard shortly..."}
            </p>
          </div>
        ) : (
          <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-10 shadow-md">
          
          {/* LOGIN VIEW */}
          {currentMode === 'login' ? (
            isLoginSubmitted ? (
              <div className="bg-white rounded-3xl text-center space-y-6 py-4">
                <div className="w-20 h-20 rounded-full bg-green-500 text-white flex items-center justify-center mx-auto text-4xl animate-bounce">
                  ✓
                </div>
                <h2 className="text-2xl font-black text-[#111111]">
                  {language === 'FR' ? "Connexion réussie !" : language === 'AR' ? "تم تسجيل الدخول بنجاح!" : "Login Successful!"}
                </h2>
                <div className="bg-green-50 border border-green-100 p-5 rounded-2xl max-w-md mx-auto text-sm font-bold text-green-800 leading-relaxed">
                  {language === 'FR' ? "Vous êtes maintenant connecté(e)." : language === 'AR' ? "أنت الآن متصل." : "You are now logged in."}
                </div>
                <p className="text-xs text-gray-500 animate-pulse">
                  {language === 'FR' ? "Redirection vers votre tableau de bord..." : language === 'AR' ? "جاري التوجيه إلى لوحة التحكم..." : "Redirecting to your dashboard..."}
                </p>
              </div>
            ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              {/* Role Selector Card Buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase block mb-1">
                  {language === 'FR' ? "Vous êtes :" : language === 'AR' ? "أنت :" : "You are:"}
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setLoginRole('owner')}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      loginRole === 'owner'
                        ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-extrabold shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <span className="text-xl">🐶</span>
                    <span className="text-xs font-bold">
                      {language === 'FR' ? "Propriétaire d'animal" : language === 'AR' ? "صاحب حيوان أليف" : "Pet Owner"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginRole('sitter')}
                    className={`p-4 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                      loginRole === 'sitter'
                        ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] font-extrabold shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <span className="text-xl">🐈</span>
                    <span className="text-xs font-bold">
                      {language === 'FR' ? "Pet Sitter" : language === 'AR' ? "حارس حيوانات" : "Pet Sitter"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_email} <span className="text-red-500">*</span></label>
                <input
                  id="login-email-input"
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                  placeholder={loginRole === 'sitter' ? "anass@amuch.ma" : "salma@amuch.ma"}
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_pass} <span className="text-red-500">*</span></label>
                <input
                  id="login-password-input"
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                  placeholder="••••••••"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 bg-[#FF6B00] text-white hover:bg-[#E55A00] font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <LogIn className="w-5 h-5" />
                  <span>{loading ? (language === 'FR' ? "Connexion..." : "جاري الاتصال...") : (language === 'FR' ? "Se connecter" : language === 'AR' ? "تسجيل الدخول" : "Log In")}</span>
                </button>
              </div>
            </form>
            )
          ) : (
            <>
              {/* STEP 1: ACCOUNT CREATION */}
              {step === 1 && (
                <form onSubmit={handleStep1Submit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_fname} <span className="text-red-500">*</span></label>
                      <input
                        id="signup-owner-fname-input"
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="Amine"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_lname} <span className="text-red-500">*</span></label>
                      <input
                        id="signup-owner-lname-input"
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="El Idrissi"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_email} <span className="text-red-500">*</span></label>
                    <input
                      id="signup-owner-email-input"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                      placeholder="amine@example.ma"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.search_city} <span className="text-red-500">*</span></label>
                    <select
                      id="signup-owner-city-select"
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_pass} <span className="text-red-500">*</span></label>
                      <input
                        id="signup-owner-password-input"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_owner_pass_confirm} <span className="text-red-500">*</span></label>
                      <input
                        id="signup-owner-confirm-password-input"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      id="signup-owner-step1-btn"
                      type="submit"
                      className="w-full py-4 bg-[#FF6B00] text-white hover:bg-[#E55A00] font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{t.signup_owner_continue}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: PETS FORM */}
              {step === 2 && (
                <form onSubmit={handleStep2Submit} className="space-y-6">
                  {/* Pets selector / indicator HUD tabs */}
                  <div className="flex gap-2 items-center flex-wrap">
                    {pets.map((pet, idx) => (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => {
                          setError('');
                          setCurrentPetIdx(idx);
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                          currentPetIdx === idx
                            ? 'border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]'
                            : 'border-gray-200 bg-transparent text-gray-500'
                        }`}
                      >
                        {pet.name ? `${pet.photoUrl} ${pet.name}` : `${language === 'FR' ? "Animal n°" : "حيوان رقم"} ${idx + 1}`}
                      </button>
                    ))}
                    <button
                      id="signup-owner-add-pet-btn"
                      type="button"
                      onClick={handleAddAnotherPet}
                      className="px-4 py-2 border-2 border-dashed border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/5 rounded-lg text-xs font-extrabold transition-all cursor-pointer"
                    >
                      {t.signup_pet_add_another}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 pt-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pet Name */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_name} <span className="text-red-500">*</span></label>
                        <input
                          id={`pet-name-input-${currentPetIdx}`}
                          type="text"
                          required
                          value={pets[currentPetIdx]?.name || ''}
                          onChange={(e) => updatePetField('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                          placeholder="Lily"
                        />
                      </div>

                      {/* Pet Type */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_type} <span className="text-red-500">*</span></label>
                        <select
                          id={`pet-type-select-${currentPetIdx}`}
                          value={pets[currentPetIdx]?.type || 'chien'}
                          onChange={(e) => updatePetField('type', e.target.value as AnimalType)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer"
                        >
                          <option value="chien">Chien 🐶</option>
                          <option value="chat">Chat 🐱</option>
                          <option value="lapin">Lapin 🐰</option>
                          <option value="oiseau">Oiseau 🦜</option>
                          <option value="autre">Autre 🐾</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Pet Breed */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_breed} <span className="text-red-500">*</span></label>
                        <input
                          id={`pet-breed-input-${currentPetIdx}`}
                          type="text"
                          required
                          value={pets[currentPetIdx]?.breed || ''}
                          onChange={(e) => updatePetField('breed', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                          placeholder="e.g. Husky, Siamois, Belge"
                        />
                      </div>

                      {/* Pet Age */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_age} <span className="text-red-500">*</span></label>
                        <input
                          id={`pet-age-input-${currentPetIdx}`}
                          type="text"
                          required
                          value={pets[currentPetIdx]?.age || ''}
                          onChange={(e) => updatePetField('age', e.target.value)}
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
                          placeholder="e.g. 2 ans, 6 mois"
                        />
                      </div>
                    </div>

                    {/* Real file upload area */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_photo}</label>
                      <label className="border-2 border-dashed border-gray-300 hover:border-[#FF6B00] rounded-2xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-[#FF6B00]/5 transition-all block relative">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (typeof reader.result === 'string') {
                                  updatePetField('photoUrl', reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        {pets[currentPetIdx]?.photoUrl && (pets[currentPetIdx].photoUrl.startsWith('data:image') || pets[currentPetIdx].photoUrl.startsWith('http')) ? (
                          <div className="space-y-2">
                            <img src={pets[currentPetIdx].photoUrl} alt="Pet Preview" className="w-20 h-20 rounded-xl object-cover mx-auto border" referrerPolicy="no-referrer" />
                            <span className="text-xs font-extrabold text-[#FF6B00] block">{language === 'FR' ? "Changer d'image" : "Change image"}</span>
                          </div>
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-[#FF6B00] mx-auto mb-2" />
                            <span className="text-xs font-bold text-gray-600 block">
                              {language === 'FR' ? "Déposer l'image ou cliquer pour téléverser" : "Upload animal photo here"}
                            </span>
                            <span className="text-[10px] text-gray-400 mt-1 block">PNG, JPG ou JPEG (Max. 5MB)</span>
                          </>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-4 border border-gray-200 text-[#111111] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>{t.signup_owner_back}</span>
                    </button>
                    <button
                      id="signup-owner-step2-btn"
                      type="submit"
                      className="flex-1 py-4 bg-[#FF6B00] text-white hover:bg-[#E55A00] font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                    >
                      <span>{t.signup_owner_continue}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: SUMMARY CONFIRMATION */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-2xl p-6 space-y-4">
                    <h3 className="font-extrabold text-[#111111] text-base border-b border-[#FF6B00]/10 pb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                      {language === 'FR' ? "Résumé du Compte" : "Account Summary"}
                    </h3>

                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-xs font-semibold">
                      <div>
                        <span className="text-gray-400 block mb-0.5">{language === 'FR' ? "Nom Complet :" : "Full Name:"}</span>
                        <span className="text-[#111111]">{firstName} {lastName}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">{language === 'FR' ? "Ville de résidence :" : "Resident City:"}</span>
                        <span className="text-[#111111]">{city}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-400 block mb-0.5">{language === 'FR' ? "Email de connexion :" : "Sign-in Email:"}</span>
                        <span className="text-[#111111]">{email}</span>
                      </div>
                    </div>
                  </div>

                  {/* Pets summary listing */}
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-[#111111] text-sm">{language === 'FR' ? "Vos compagnons enregistrés" : "Registered Pets"}</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {pets.map((pet) => (
                        <div key={pet.id} className="border border-gray-200 rounded-xl p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-lg">{pet.photoUrl}</div>
                          <div>
                            <h5 className="font-bold text-sm text-[#111111]">{pet.name}</h5>
                            <p className="text-[11px] text-gray-500 capitalize">{pet.breed} &bull; {pet.age}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Terms of conditions and submission */}
                  <div className="pt-4 border-t border-gray-100 space-y-6">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        id="accept-terms-checkbox"
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        className="w-5 h-5 rounded text-[#FF6B00] border-gray-300 accent-[#FF6B00] shrink-0 mt-0.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-600 leading-relaxed">
                        {t.signup_owner_terms}
                      </span>
                    </label>

                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-1/3 py-4 border border-gray-200 text-[#111111] font-bold rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>{t.signup_owner_back}</span>
                      </button>
                      <button
                        id="signup-owner-final-submit-btn"
                        onClick={handleFinalSubmit}
                        disabled={loading}
                        className={`flex-1 py-4 bg-[#FF6B00] text-white hover:bg-[#E55A00] font-extrabold rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>{loading ? (language === 'FR' ? "Inscription..." : "جاري التسجيل...") : t.signup_owner_submit}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          </div>
        )}
      </div>

      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAgree={() => {
          setTermsAccepted(true);
          setIsTermsModalOpen(false);
          // Trigger form submit immediately on acceptance
          setTimeout(() => {
            const btn = document.getElementById('signup-owner-final-submit-btn');
            if (btn) {
              btn.click();
            }
          }, 100);
        }}
        language={language}
      />
    </div>
  );
}
