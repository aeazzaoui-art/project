/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';
import { Language } from '../types';

interface CookieBannerProps {
  language: Language;
}

export default function CookieBanner({ language }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('amuch_cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('amuch_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('amuch_cookie_consent', 'declined');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const isRtl = language === 'AR';

  return (
    <div
      id="cookie-consent-banner"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed bottom-4 left-4 right-4 z-50 max-w-4xl mx-auto bg-white border border-[#E0E0E0] shadow-2xl rounded-xl p-5 md:p-6 transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#FF6B00]/10 rounded-lg text-[#FF6B00] shrink-0 mt-1 md:mt-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#111111] mb-1">
              {language === 'FR' && "Respect de votre vie privée (Loi 09-08 / CNDP)"}
              {language === 'AR' && "احترام خصوصيتكم (القانون 09-08 / اللجنة الوطنية CNDP)"}
              {language === 'EN' && "Respecting your privacy (Law 09-08 / CNDP)"}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {language === 'FR' && "En poursuivant votre navigation, vous acceptez l'utilisation de cookies nécessaires au bon fonctionnement de la plateforme AMUCH, conformément à la loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel."}
              {language === 'AR' && "بمواصلة تصفحكم، فإنكم تقبلون استخدام ملفات تعريف الارتباط الضرورية لتشغيل منصة أموش، بما يتوافق مع القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي."}
              {language === 'EN' && "By continuing your browsing, you accept the use of cookies necessary for the proper functioning of the AMUCH platform, in accordance with Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data."}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto shrink-0 justify-end">
          <button
            id="decline-cookies-btn"
            onClick={handleDecline}
            className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-[#111111] border border-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            {language === 'FR' && "Refuser"}
            {language === 'AR' && "رفض"}
            {language === 'EN' && "Decline"}
          </button>
          <button
            id="accept-cookies-btn"
            onClick={handleAccept}
            className="px-5 py-2 text-xs font-semibold bg-[#FF6B00] text-white rounded-lg hover:bg-[#E55A00] transition-colors cursor-pointer shadow-sm"
          >
            {language === 'FR' && "Accepter & Continuer"}
            {language === 'AR' && "قبول ومتابعة"}
            {language === 'EN' && "Accept & Continue"}
          </button>
          <button
            id="close-cookies-icon-btn"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors hidden md:block"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
