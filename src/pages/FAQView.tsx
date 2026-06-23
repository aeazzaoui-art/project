/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ArrowRight, ShieldCheck, UserCheck, CreditCard } from 'lucide-react';
import { Language, ActivePage } from '../types';
import { translations } from '../translations';
import { FAQS } from '../data';

interface FAQViewProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
}

export default function FAQView({ language, setActivePage }: FAQViewProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // State to track opened FAQ question index
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Category filter state
  const [activeCategory, setActiveCategory] = useState<'all' | 'owner' | 'sitter' | 'security'>('all');

  const categories = [
    { id: 'all', label: language === 'FR' ? "Tout" : language === 'AR' ? "الكل" : "All", icon: HelpCircle },
    { id: 'owner', label: t.faq_cat_owners, icon: UserCheck },
    { id: 'sitter', label: t.faq_cat_sitters, icon: ShieldCheck },
    { id: 'security', label: t.faq_cat_security, icon: CreditCard }
  ];

  // Filter FAQs list
  const filteredFaqs = FAQS.filter((faq) => {
    if (activeCategory === 'all') return true;
    return faq.category === activeCategory;
  });

  return (
    <div className="font-sans min-h-screen bg-[#F7F7F7] py-16" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Hud Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111111]">
            {t.faq_title}
          </h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {t.faq_subtitle}
          </p>
        </div>

        {/* Categories Tab pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  setOpenIndex(null); // Reset open accordion on category change
                }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FF6B00] text-white border-[#FF6B00] shadow-md'
                    : 'bg-white border-gray-200 text-gray-500 hover:text-[#111111]'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Accordion Grid */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className="bg-white border border-[#E0E0E0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Trigger Row Button */}
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#111111] hover:bg-gray-50/50 transition-colors cursor-pointer"
                >
                  <span className={`text-sm md:text-base ${isRtl ? 'text-right' : 'text-left'}`}>
                    {faq.question[language]}
                  </span>
                  <div className="p-1 rounded-full text-[#FF6B00] shrink-0">
                    {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Collapsible Content Area */}
                {isOpen && (
                  <div className="p-5 border-t border-gray-100 bg-gray-50/50 text-xs md:text-sm text-gray-600 leading-relaxed">
                    {faq.answer[language]}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions block */}
        <div className="mt-12 bg-white border border-[#E0E0E0] rounded-3xl p-6 sm:p-8 text-center space-y-4">
          <h3 className="font-extrabold text-base text-[#111111]">
            {language === 'FR' ? "Vous n'avez pas trouvé de réponse à votre question ?" : "لم تجد إجابة لسؤالك؟"}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            {language === 'FR' 
              ? "Notre équipe d'assistance marocaine AMUCH est disponible 7j/7 pour vous accompagner par email ou WhatsApp."
              : "فريق دعم أموش المغربي متواجد لمساعدتكم وإجابة أسئلتكم على مدار الساعة طوال أيام الأسبوع."}
          </p>
          <div>
            <button
              onClick={() => alert(language === 'FR' ? "Utilisez le bouton orange WhatsApp flottant en bas à droite pour chatter !" : "اضغط على زر الواتساب البرتقالي العائم أسفل اليمين للتواصل مباشرة!")}
              className="px-6 py-3 bg-[#FF6B00] text-white hover:bg-[#E55A00] font-bold text-xs rounded-lg transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{language === 'FR' ? "Contacter le Support" : "اتصل بالدعم الفني"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
