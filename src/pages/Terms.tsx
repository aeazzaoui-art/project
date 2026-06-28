/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Scale, BookOpen, AlertCircle, CheckCircle2, UserCheck, ShieldAlert, ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react';
import { Language, ActivePage } from '../types';

interface TermsProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
}

export default function Terms({ language, setActivePage }: TermsProps) {
  const isRtl = language === 'AR';

  return (
    <div className="font-sans min-h-screen bg-[#FDFDFD] pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-orange-50 via-white to-transparent py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-[11px] font-extrabold tracking-widest uppercase">
            ⚖️ {language === 'FR' ? "Conditions d'utilisation" : language === 'AR' ? "الشروط والأحكام" : "Terms & Conditions"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight">
            {language === 'FR'
              ? "Conditions Générales d'Utilisation"
              : language === 'AR'
              ? "الشروط والأحكام العامة"
              : "Terms & Conditions"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            {language === 'FR'
              ? "Veuillez lire attentivement les règles et conditions de notre plateforme avant d'utiliser nos services."
              : language === 'AR'
              ? "يرجى قراءة شروط وقواعد منصتنا بعناية قبل استخدام خدماتنا."
              : "Please read our platform rules and conditions carefully before using our services."}
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
              <Scale className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">Marketplace Role</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Connecting Owners & Sitters</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <UserCheck className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">Independent Parties</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Agreement is direct and mutual</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-[#FF6B00] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-xs text-gray-900 uppercase tracking-wide">Moroccan Law</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Governed by local regulations</p>
              </div>
            </div>
          </div>

          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                1
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Acceptance of Terms</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you") and <strong>AMUCH</strong> ("we", "us", "our") governing your access to and use of the AMUCH platform at <a href="https://amuch.ma" target="_blank" rel="noreferrer" className="text-[#FF6B00] hover:underline">amuch.ma</a> (the "Platform").
              </p>
              <p>
                By registering an account, accessing the Platform, or using any of its services, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree, you must not use the Platform.
              </p>
              <p>
                These Terms apply to all users of the Platform, including pet owners ("Owners"), pet sitters ("Sitters"), and visitors.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                2
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">AMUCH's Role — We Are a Marketplace, Not a Pet Care Provider</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>AMUCH is an online marketplace and technology platform. Our role is limited to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Providing tools that allow Owners to discover and connect with Sitters.</li>
                <li>Facilitating communication between Owners and Sitters via our integrated messaging system.</li>
                <li>Enabling Sitters to list their profiles and availability.</li>
                <li>Providing a review and rating system.</li>
              </ul>
              <p className="mt-2 text-gray-600">
                AMUCH does not provide pet sitting or pet care services. We are not a party to any agreement between an Owner and a Sitter. AMUCH does not employ, supervise, direct, or control Sitters. Any pet care arrangement is made entirely between the Owner and Sitter as independent private individuals. AMUCH bears no responsibility for the quality, safety, or outcome of any pet care service arranged through the Platform.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                3
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Eligibility</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>To use the Platform, you must:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Be at least 18 years of age.</li>
                <li>Have the legal capacity to enter into a binding contract under Moroccan law.</li>
                <li>Not have been previously suspended or banned from the Platform.</li>
                <li>Provide accurate, truthful, and complete registration information.</li>
              </ul>
              <p className="mt-2 text-gray-600">
                By registering, you represent and warrant that you meet all of the above requirements.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                4
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">User Accounts</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>You are responsible for maintaining the confidentiality of your account credentials. You agree to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Provide accurate and up-to-date information when registering and maintaining your profile.</li>
                <li>Not share your account with any third party.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Accept full responsibility for all activities that occur under your account.</li>
              </ul>
              <p className="mt-2 text-gray-600">
                AMUCH reserves the right to suspend or terminate accounts that contain false information, violate these Terms, or engage in behavior harmful to other users or the Platform.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                5
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Owner Responsibilities</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>As a pet Owner using the Platform, you agree and acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-gray-500">
                <li>You are solely responsible for evaluating and selecting a Sitter. AMUCH's verification process does not constitute an endorsement or guarantee of any Sitter's fitness, suitability, or ability to care for your pet.</li>
                <li>You must provide accurate, complete, and up-to-date information about your pet, including health conditions, behavioral issues, dietary needs, medications, and any history of aggression or unpredictability.</li>
                <li>You are responsible for ensuring your pet is up to date on vaccinations and legally compliant with all applicable Moroccan animal ownership regulations.</li>
                <li>You acknowledge that pet sitting involves inherent risks, including but not limited to illness, injury, escape, or death of the animal. You accept these risks and agree that AMUCH shall not be held liable for any such outcome.</li>
                <li>You are responsible for arranging appropriate pet insurance or veterinary care coverage before entrusting your pet to any Sitter.</li>
                <li>Any service agreement, schedule, payment, and terms of care are agreed directly with the Sitter. AMUCH is not a party to this agreement.</li>
              </ul>
            </div>
          </div>

          {/* Section 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                6
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Sitter Responsibilities</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>As a Sitter offering services through the Platform, you agree and acknowledge that:</p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-gray-500">
                <li>You are an independent individual and not an employee, agent, contractor, or representative of AMUCH.</li>
                <li>You are solely responsible for all pet care services you provide. AMUCH assumes no liability for any harm, loss, injury, or death of any animal in your care.</li>
                <li>You must provide accurate, honest, and current information in your profile, including your experience, qualifications, and the types of animals you can accommodate.</li>
                <li>You must not accept bookings for animals or situations that exceed your experience or capacity.</li>
                <li>You are responsible for complying with all applicable Moroccan laws and regulations relating to animal care.</li>
                <li>You are responsible for any harm caused to an Owner's pet during the sitting period, and AMUCH shall not be held liable for damages arising from your acts or omissions.</li>
                <li>You must not engage in any abusive, neglectful, or harmful treatment of any animal in your care.</li>
              </ul>
            </div>
          </div>

          {/* Section 7 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                7
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Bookings & Service Agreements</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>All bookings are made directly between Owners and Sitters. AMUCH provides tools to facilitate this process but is not responsible for the performance, fulfillment, or outcome of any booking. Specifically:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>AMUCH does not guarantee that a Sitter will honor a confirmed booking.</li>
                <li>AMUCH does not guarantee the quality or outcome of any pet care service.</li>
                <li>Cancellations, rescheduling, and refund terms are agreed between Owner and Sitter directly. AMUCH does not mediate financial disputes arising from bookings.</li>
              </ul>
              <p className="mt-2">
                In the event of a dispute between an Owner and a Sitter, AMUCH may, at its sole discretion, offer assistance, but is under no obligation to do so and accepts no liability for the outcome.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                8
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Payments & Fees</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                Currently, AMUCH does not process payments directly between Owners and Sitters. Any financial arrangements are made independently between the parties. AMUCH bears no liability for non-payment, fraud, or financial disputes arising from these arrangements.
              </p>
              <p>
                If AMUCH introduces payment processing features in the future, separate payment terms will apply and will be communicated to users in advance.
              </p>
              <p>
                AMUCH reserves the right to charge platform fees in the future. Any such fees will be disclosed clearly to users before implementation.
              </p>
            </div>
          </div>

          {/* Section 9 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                9
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Limitation of Liability</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>To the maximum extent permitted by applicable Moroccan law, AMUCH, its founders, employees, partners, and affiliates shall not be liable for:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Any injury, illness, death, loss, or harm to any animal arising from a booking or service arranged through the Platform.</li>
                <li>Any personal injury, property damage, or financial loss suffered by any Owner, Sitter, or third party as a result of interactions arranged through the Platform.</li>
                <li>Any loss of data, unauthorized access, or security breach beyond our reasonable control.</li>
                <li>Any indirect, incidental, special, consequential, or punitive damages of any nature.</li>
                <li>Any damages arising from a Sitter's failure to provide agreed services, or an Owner's failure to provide accurate pet information.</li>
                <li>Any acts or omissions of third-party service providers.</li>
                <li>Platform downtime, technical failures, or service interruptions.</li>
              </ul>
              <p className="mt-2 font-bold text-gray-800">
                Our total aggregate liability in any circumstance shall not exceed the greater of MAD 500 or any fees you have paid to AMUCH in the 3 months preceding the claim.
              </p>
            </div>
          </div>

          {/* Section 10 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                10
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Disclaimer of Warranties</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>The Platform and all content, services, and features are provided on an "as is" and "as available" basis without any warranties of any kind, express or implied, including but not limited to:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-gray-500">
                <li>Fitness for a particular purpose.</li>
                <li>Accuracy or completeness of any Sitter profile or information.</li>
                <li>Uninterrupted, error-free, or secure operation of the Platform.</li>
                <li>The suitability, reliability, or character of any Sitter or Owner.</li>
              </ul>
              <p className="mt-2">
                AMUCH's Sitter verification process (identity document review and profile completion) is a good-faith effort to improve platform safety. It does not constitute a background check, professional vetting, or guarantee of fitness to provide pet care. Users rely on verified profiles at their own risk.
              </p>
            </div>
          </div>

          {/* Section 11 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                11
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Prohibited Conduct</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>You agree not to use the Platform to:</p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-500">
                <li>Provide false, misleading, or fraudulent information in your profile or communications.</li>
                <li>Harass, threaten, or abuse other users.</li>
                <li>Circumvent the Platform by arranging services off-platform to avoid future fees.</li>
                <li>Post or transmit any content that is unlawful, offensive, or harmful.</li>
                <li>Impersonate any person or entity.</li>
                <li>Attempt to gain unauthorized access to any part of the Platform or another user's account.</li>
                <li>Use the Platform for any commercial purpose other than offering genuine pet sitting services.</li>
                <li>Harm, neglect, or mistreat any animal in your care as a Sitter.</li>
              </ul>
              <p className="mt-2 text-gray-500 text-xs font-bold uppercase tracking-wider">
                Violations may result in immediate account suspension or permanent ban, without notice or refund.
              </p>
            </div>
          </div>

          {/* Section 12 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                12
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">User-Generated Content</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                By posting content on the Platform (including profile information, pet photos, messages, and reviews), you grant AMUCH a non-exclusive, royalty-free, worldwide license to display and use that content solely for the purpose of operating the Platform.
              </p>
              <p>
                You are solely responsible for any content you post. You represent that you own or have the right to share all content you submit. AMUCH does not verify the accuracy of user-generated content and is not responsible for it.
              </p>
              <p>
                AMUCH reserves the right to remove any content that violates these Terms or is otherwise harmful, without notice.
              </p>
            </div>
          </div>

          {/* Section 13 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                13
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Termination</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                You may delete your account at any time from your account settings. AMUCH may suspend or terminate your access at any time, with or without notice, for any reason including violation of these Terms, fraudulent activity, or behavior harmful to other users or animals.
              </p>
              <p>
                Upon termination, your right to use the Platform ceases immediately. Provisions of these Terms that by their nature should survive termination (including Sections 9, 10, 14, and 15) shall continue to apply.
              </p>
            </div>
          </div>

          {/* Section 14 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                14
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Dispute Resolution</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                Any dispute between an Owner and a Sitter arising from a booking is a matter between those two parties. AMUCH is not obligated to mediate or resolve such disputes.
              </p>
              <p>
                Any dispute between you and AMUCH shall first be submitted for good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to the competent courts of Morocco.
              </p>
            </div>
          </div>

          {/* Section 15 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                15
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Governing Law</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                These Terms are governed by and construed in accordance with the laws of the Kingdom of Morocco. Any legal action or proceeding arising under these Terms shall be brought exclusively in the competent courts of Morocco, and you consent to the personal jurisdiction of such courts.
              </p>
            </div>
          </div>

          {/* Section 16 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                16
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Changes to These Terms</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-medium leading-relaxed">
              <p>
                AMUCH reserves the right to modify these Terms at any time. We will notify users of material changes via email or a prominent notice on the Platform at least 14 days before the changes take effect. Continued use of the Platform after the effective date constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Platform.
              </p>
            </div>
          </div>

          {/* Section 17 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black text-sm">
                17
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Contact</h2>
            </div>
            <div className="pl-11 text-gray-600 space-y-3 text-sm sm:text-base font-semibold leading-relaxed">
              <div className="bg-gray-50 border border-gray-150 p-6 rounded-2xl space-y-1.5 text-gray-700 font-medium">
                <p className="text-xs uppercase tracking-wider font-extrabold text-[#FF6B00]">AMUCH Team</p>
                <p>Morocco</p>
                <p className="flex items-center gap-2 mt-2">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <a href="mailto:Contact@amuch.ma" className="text-[#FF6B00] hover:underline">Contact@amuch.ma</a>
                </p>
                <p className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-400 shrink-0" />
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

// A reusable small popup modal component for signing up
interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  language: Language;
}

export function TermsModal({ isOpen, onClose, onAgree, language }: TermsModalProps) {
  const isRtl = language === 'AR';
  const [hasScrolled, setHasScrolled] = React.useState(false);
  const [isChecked, setIsChecked] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setHasScrolled(false);
      setIsChecked(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      // Allow user to check even if they haven't scrolled completely, but prompt them to scroll or read.
      if (scrollTop + clientHeight >= scrollHeight - 30) {
        setHasScrolled(true);
      }
    }
  };

  const handleAgreeClick = () => {
    if (isChecked) {
      onAgree();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-gray-100 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-[#FF6B00]" />
            <h3 className="text-base sm:text-lg font-black text-gray-900">
              {language === 'FR' 
                ? "Conditions Générales d'Utilisation" 
                : language === 'AR' 
                ? "الشروط والأحكام العامة" 
                : "Terms & Conditions"}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 text-lg font-black cursor-pointer p-1"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Terms Text */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="p-6 overflow-y-auto text-xs sm:text-sm text-gray-600 space-y-4 flex-grow font-medium leading-relaxed"
        >
          <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-3 text-orange-800">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-[11px] sm:text-xs font-semibold">
              {language === 'FR'
                ? "Veuillez lire et accepter les Conditions Générales d'Utilisation ci-dessous pour finaliser votre inscription."
                : language === 'AR'
                ? "يرجى القراءة والموافقة على الشروط والأحكام العامة أدناه لإكمال عملية التسجيل."
                : "Please read and accept the Terms & Conditions below to complete your registration."}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-extrabold text-gray-900 text-sm">1. Acceptance of Terms</h4>
            <p>
              These Terms and Conditions ("Terms") constitute a legally binding agreement between you ("User", "you") and AMUCH ("we", "our") governing your access to and use of the AMUCH platform at amuch.vercel.app (the "Platform").
              By registering, accessing, or using any part of the service, you agree to be bound by these Terms and our Privacy Policy.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">2. AMUCH's Role — We Are a Marketplace</h4>
            <p>
              AMUCH is an online marketplace and technology platform. Our role is limited to providing tools to discover and connect with sitters, facilitating communication, enabling profile listings, and providing a rating system.
              AMUCH does not provide pet sitting or pet care services. We are not a party to any agreement between an Owner and a Sitter.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">3. Eligibility</h4>
            <p>
              To use the Platform, you must be at least 18 years of age, have the legal capacity under Moroccan law, not have been previously suspended, and provide accurate registration info.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">4. User Accounts</h4>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. You accept full responsibility for all activities that occur under your account. AMUCH reserves the right to suspend or terminate accounts.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">5. Owner Responsibilities</h4>
            <p>
              Owners are solely responsible for evaluating and selecting a Sitter. You must provide accurate, complete information about your pet, including health and behavior. Sitting involves inherent risks, and AMUCH is not liable for illness, escape, injury, or death.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">6. Sitter Responsibilities</h4>
            <p>
              Sitters are independent individuals, not employees of AMUCH. You are solely responsible for the services you provide, and must comply with Moroccan animal care laws.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">7. Bookings & Payments</h4>
            <p>
              All bookings are direct contracts. AMUCH currently does not process payments directly; any financial arrangements are made independently. AMUCH is not liable for non-payment or disputes.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">8. Limitation of Liability</h4>
            <p>
              To the maximum extent permitted by Moroccan law, AMUCH is not liable for animal injury, escape, death, or any damages. Aggregate liability is capped at MAD 500.
            </p>

            <h4 className="font-extrabold text-gray-900 text-sm">9. Prohibited Conduct & Governing Law</h4>
            <p>
              Users must not provide fraudulent data, bypass the platform, or mistreat animals. These Terms are governed by the laws of the Kingdom of Morocco, and competent courts of Morocco hold exclusive jurisdiction.
            </p>
          </div>
        </div>

        {/* Action Checkbox & Agree Buttons */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 space-y-4">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
              className="w-4 h-4 rounded-sm border-gray-300 text-[#FF6B00] focus:ring-[#FF6B00]/20 mt-0.5 cursor-pointer"
            />
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              {language === 'FR'
                ? "J'ai lu et j'accepte les Conditions Générales d'Utilisation d'AMUCH."
                : language === 'AR'
                ? "لقد قرأت وأوافق على الشروط والأحكام العامة لمنصة أموش."
                : "I have read and agree to the AMUCH Terms and Conditions."}
            </span>
          </label>

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              {language === 'FR' ? "Annuler" : language === 'AR' ? "إلغاء" : "Cancel"}
            </button>
            <button
              onClick={handleAgreeClick}
              disabled={!isChecked}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                isChecked
                  ? 'bg-[#FF6B00] hover:bg-[#E55A00] text-white shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
              {language === 'FR' ? "Accepter & S'inscrire" : language === 'AR' ? "قبول وتسجيل" : "Accept & Register"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
