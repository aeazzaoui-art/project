/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, Lock, Eye, CheckCircle2, Mail, FileText, ArrowLeft, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Language, ActivePage } from '../types';

interface PrivacyProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
}

export default function Privacy({ language, setActivePage }: PrivacyProps) {
  const isRtl = language === 'AR';

  return (
    <div className="font-sans min-h-screen bg-[#FDFDFD] pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-orange-50 via-white to-transparent py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-[11px] font-extrabold tracking-widest uppercase">
            🛡️ {language === 'FR' ? "Confidentialité" : language === 'AR' ? "سياسة الخصوصية" : "Privacy Policy"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight">
            {language === 'FR'
              ? "Politique de Confidentialité"
              : language === 'AR'
              ? "سياسة الخصوصية"
              : "Privacy Policy"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            {language === 'FR'
              ? "Découvrez comment nous protégeons et gérons vos données personnelles sur la plateforme AMUCH."
              : language === 'AR'
              ? "تعرف على كيفية حماية وإدارة بياناتك الشخصية على منصة أموش."
              : "Learn how we protect and manage your personal data on the AMUCH platform."}
          </p>

          <div className="pt-4">
            <button
              onClick={() => {
                setActivePage('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors cursor-pointer group"
            >
              {isRtl ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              {language === 'FR' ? "Retour à l'accueil" : language === 'AR' ? "العودة إلى الرئيسية" : "Back to Home"}
            </button>
          </div>
        </div>
      </section>

      {/* 2. BODY CONTENT */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xs p-6 sm:p-12 space-y-12">
          
          {/* Quick trust metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-orange-50/50 p-6 rounded-2xl border border-orange-100/40">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">Moroccan Law 09-08</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Fully compliant and secure</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">No selling data</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">We never sell your details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">Zero Ad Cookies</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">No cross-site tracking cookies</p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Introduction</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                <strong>AMUCH</strong> ("we", "our", or "us") operates the platform accessible at <a href="https://amuch.ma" target="_blank" rel="noreferrer" className="text-[#FF6B00] hover:underline">amuch.ma</a> (the "Platform"), a marketplace connecting pet owners ("Owners") with pet sitters ("Sitters") across Morocco.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our Platform. By creating an account or using any part of our service, you agree to the practices described in this Policy.
              </p>
              <p>
                AMUCH is operated from Morocco and is governed by Moroccan data protection law (<strong>Law No. 09-08</strong> on the Protection of Personal Data). Where applicable, we also align with internationally recognized privacy standards.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Data We Collect</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-4 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                We collect information you provide directly and information generated through your use of the Platform:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-gray-500">
                <li><strong className="text-gray-700">Account information:</strong> Full name, email address, phone number, city, and password (hashed).</li>
                <li><strong className="text-gray-700">Profile information:</strong> Profile photo, biography, and for Sitters: identity document, experience, accepted animal types, and availability.</li>
                <li><strong className="text-gray-700">Pet information:</strong> Pet name, species, breed, age, weight, health notes, and photos uploaded by Owners.</li>
                <li><strong className="text-gray-700">Booking data:</strong> Requested dates, service type, location details, and booking status history.</li>
                <li><strong className="text-gray-700">Messages:</strong> Content exchanged through our integrated messaging system.</li>
                <li><strong className="text-gray-700">Reviews and ratings:</strong> Written reviews and star ratings submitted after completed bookings.</li>
                <li><strong className="text-gray-700">Usage data:</strong> Pages visited, clicks, search filters, time on Platform, IP address, browser type, and device information.</li>
                <li><strong className="text-gray-700">Communications:</strong> Support messages or feedback you send to us.</li>
              </ul>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">How We Use Your Data</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>We use collected data strictly to operate, improve, and protect the Platform:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Create and manage your account and profile.</li>
                <li>Facilitate connections and bookings between Owners and Sitters.</li>
                <li>Enable real-time messaging between users.</li>
                <li>Display verified profiles, ratings, and reviews to other users.</li>
                <li>Send transactional notifications (booking confirmations, review requests).</li>
                <li>Verify Sitter identity and maintain platform safety standards.</li>
                <li>Detect and prevent fraud, abuse, or violations of our Terms.</li>
                <li>Analyze usage to improve features and fix bugs.</li>
                <li>Respond to support requests and comply with applicable Moroccan law.</li>
              </ul>
              <p className="pt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-green-50 text-green-700 px-3 py-1 rounded-lg border border-green-200">
                  <CheckCircle2 className="w-3.5 h-3.5" /> We do not sell your personal data to third parties. We do not use your data for targeted advertising.
                </span>
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Sharing & Disclosure</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <ul className="list-disc list-inside space-y-2 pl-2 text-gray-500">
                <li><strong className="text-gray-700">Between users:</strong> Your public profile is visible to registered users. Private contact details are shared only when a booking is confirmed.</li>
                <li><strong className="text-gray-700">Service providers:</strong> Trusted third-party providers for hosting, email, and analytics — bound by confidentiality obligations.</li>
                <li><strong className="text-gray-700">Legal compliance:</strong> When required by Moroccan law, court order, or government authority.</li>
                <li><strong className="text-gray-700">Safety:</strong> To prevent harm to a person or animal, or to investigate serious misconduct.</li>
                <li><strong className="text-gray-700">Business transfer:</strong> In the event of a merger or acquisition, with prior user notification.</li>
              </ul>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Storage & Security</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                We implement technical and organizational security measures including HTTPS encryption, password hashing, access controls, and regular security reviews.
              </p>
              <p>
                No system is 100% secure. AMUCH cannot guarantee absolute security of data transmitted over the internet. You use the Platform at your own risk and are responsible for keeping your login credentials confidential.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Data Retention</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Profile and pet data are deleted within 30 days of account deletion.</li>
                <li>Booking records may be retained up to 2 years for legal and dispute resolution purposes.</li>
                <li>Reviews may remain in anonymized form on the platform.</li>
                <li>Certain data may be retained longer where required by Moroccan law.</li>
              </ul>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Your Rights</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                Under Moroccan Law No. 09-08, you have the right to access, rectify, delete, object to, and request portability of your personal data. Contact us at the address below — we will respond within 30 days.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Cookies</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                We use cookies to keep you logged in, remember language preferences, and analyze Platform usage. We do not use advertising or cross-site tracking cookies. You may disable cookies in your browser, though this may affect functionality.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Minors</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                AMUCH is not directed at persons under 18. We do not knowingly collect data from minors. If we discover a minor has registered, we will terminate the account and delete associated data immediately.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Policy Changes</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                We will notify registered users of material changes via email or a platform notice at least 14 days before changes take effect. Continued use of the Platform constitutes acceptance of the updated Policy.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Contact</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-semibold leading-relaxed">
              <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl space-y-1.5 text-gray-700 font-medium">
                <p className="text-xs uppercase tracking-wider font-extrabold text-[#FF6B00]">AMUCH Team</p>
                <p>Morocco</p>
                <p className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href="mailto:contact@amuch.ma" className="text-[#FF6B00] hover:underline">contact@amuch.ma</a>
                </p>
                <p className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href="https://amuch.ma" target="_blank" rel="noreferrer" className="text-[#FF6B00] hover:underline">amuch.ma</a>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
