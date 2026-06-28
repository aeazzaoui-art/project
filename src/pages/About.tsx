/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShieldCheck, Users, Sparkles, Map, Award } from 'lucide-react';
import { Language, ActivePage } from '../types';
import { translations } from '../translations';

interface AboutProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
}

export default function About({ language, setActivePage }: AboutProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  return (
    <div className="font-sans min-h-screen bg-white pb-16" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. HERO SECTION */}
      <section className="bg-[#FF6B00] text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 relative z-10">
          <span className="text-[10px] uppercase font-extrabold tracking-widest bg-white/20 px-3 py-1.5 rounded-full inline-block">
            {language === 'FR' ? "Qui sommes-nous ?" : "من نحن ؟"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight">
            {t.about_hero}
          </h1>
          <p className="text-white/80 text-sm max-w-lg mx-auto leading-relaxed">
            {language === 'FR' 
              ? "AMUCH unit les propriétaires d'animaux de compagnie marocains avec des pet sitters de confiance à proximité."
              : "تجمع أموش أصحاب الحيوانات الأليفة في المغرب مع حراس موثوقين بالقرب منهم."}
          </p>
        </div>
      </section>

      {/* 2. HISTORY & VALUES */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-[#111111]">
              {t.about_history_title}
            </h2>
            <div className="w-12 h-1 bg-[#FF6B00] rounded-full"></div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t.about_history_text}
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {language === 'FR' 
                ? "Que ce soit à Casablanca, Rabat ou Tanger, nous croyons que chaque animal mérite le meilleur traitement chaleureux possible, sans cages, au sein d'une vraie famille marocaine."
                : "سواء في الدار البيضاء، الرباط أو طنجة، نحن نؤمن بأن كل حيوان يستحق أفضل رعاية دافئة ممكنة، بدون أقفاص، داخل أسرة مغربية حقيقية."}
            </p>
          </div>

          {/* Visual card of values */}
          <div className="bg-[#F7F7F7] border border-[#E0E0E0] rounded-3xl p-8 space-y-6">
            <h3 className="font-extrabold text-base text-[#111111] uppercase tracking-wider">{language === 'FR' ? "Nos 3 Valeurs Piliers" : "قيمنا الأساسية الثلاث"}</h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">{language === 'FR' ? "1. Confiance Absolue" : "ثقة مطلقة"}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{language === 'FR' ? "Vérification des profils, de la CIN et de l'environnement des sitters." : "التحقق الشامل والدقيق من الملفات والهوية وسكن الحراس."}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">{language === 'FR' ? "2. Bienveillance Animale" : "الرفق بالحيوان"}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{language === 'FR' ? "Amour et respect inconditionnels des besoins de chaque compagnon." : "الحب والاحترام غير المشروط لاحتياجات كل رفيق أليف."}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#FF6B00] shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#111111]">{language === 'FR' ? "3. Esprit Communautaire" : "روح المجتمع"}</h4>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{language === 'FR' ? "Entraide chaleureuse entre amoureux des animaux partout au Maroc." : "التعاون والدعم المتبادل والدافئ بين محبي الحيوانات بالمغرب."}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CHIFFRES CLÉS (METRICS) */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-extrabold text-[#111111] mb-12">
            {language === 'FR' ? "AMUCH en quelques chiffres" : "أموش في أرقام"}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#FF6B00] block">500+</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{language === 'FR' ? "Sitters Vérifiés" : "حارس معتمد"}</span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#FF6B00] block">10+</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{language === 'FR' ? "Villes Couvertes" : "مدن مغطاة"}</span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#FF6B00] block">5000+</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{language === 'FR' ? "Gardiens Heureux" : "أصحاب حيوانات سعداء"}</span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl font-black text-[#FF6B00] block">4.9★</span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{language === 'FR' ? "Note Moyenne" : "متوسط التقييم"}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL ABOUT CTA CARD */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-[#111111] text-white rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00]/10 to-transparent pointer-events-none"></div>
          <h2 className="text-2xl sm:text-3xl font-extrabold relative z-10">
            {language === 'FR' ? "Rejoignez la communauté AMUCH aujourd'hui" : "انضم إلى مجتمع أموش المغربي اليوم"}
          </h2>
          <p className="text-sm text-gray-400 max-w-md mx-auto relative z-10 leading-relaxed">
            {language === 'FR' 
              ? "Que vous soyez propriétaire cherchant la sérénité ou sitter passionné d'animaux, il y a une place pour vous."
              : "سواء كنت صاحب حيوان يبحث عن الأمان وراحة البال، أو حارساً شغوفاً بالحيوانات، هناك مكان لك."}
          </p>
          <div className="relative z-10">
            <button
              onClick={() => setActivePage('signup-owner')}
              className="px-8 py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-xl font-extrabold transition-all hover:scale-105 cursor-pointer shadow-md"
            >
              {t.ctafinal_btn}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
