/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MessageSquare, X, Send, Heart } from 'lucide-react';
import { Language } from '../types';

interface WhatsAppButtonProps {
  language: Language;
}

export default function WhatsAppButton({ language }: WhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'support'; text: string }>>([
    {
      sender: 'support',
      text: language === 'FR' 
        ? "Salam ! Bienvenue chez AMUCH Support 🐾 Comment pouvons-nous vous aider aujourd'hui ?"
        : language === 'AR'
        ? "السلام عليكم! مرحباً بكم في دعم أموش 🐾 كيف يمكننا مساعدتكم اليوم؟"
        : "Salam! Welcome to AMUCH Support 🐾 How can we help you today?"
    }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = message;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setMessage('');

    // Simulate friendly automatic Moroccan pet support response
    setTimeout(() => {
      let reply = "";
      if (language === 'FR') {
        reply = "Merci pour votre message ! Un conseiller de l'équipe AMUCH va vous répondre sur WhatsApp (+212 6 0000 0000) dans quelques instants. À très bientôt ! 🧡";
      } else if (language === 'AR') {
        reply = "شكراً لرسالتكم! سيقوم مستشار من فريق أموش بالرد عليكم عبر الواتساب (+212 6 0000 0000) في غضون لحظات قليلة. نراكم قريباً! 🧡";
      } else {
        reply = "Thank you for your message! An AMUCH team advisor will get back to you on WhatsApp (+212 6 0000 0000) in just a few moments. Speak soon! 🧡";
      }
      setChatHistory((prev) => [...prev, { sender: 'support', text: reply }]);
    }, 1000);
  };

  const isRtl = language === 'AR';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end" dir={isRtl ? 'rtl' : 'ltr'}>
      {isOpen ? (
        <div className="bg-white border border-[#E0E0E0] shadow-2xl rounded-2xl w-80 md:w-96 overflow-hidden mb-4 transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="bg-[#FF6B00] p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg text-white">
                AM
              </div>
              <div>
                <h4 className="font-bold text-sm">AMUCH Support</h4>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  {language === 'FR' && "En ligne (Moins de 5 min)"}
                  {language === 'AR' && "متصل (أقل من 5 دقائق)"}
                  {language === 'EN' && "Online (Under 5 min)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="h-64 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-3">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                  chat.sender === 'user'
                    ? 'bg-[#FF6B00] text-white self-end'
                    : 'bg-white text-gray-800 border border-gray-100 self-start'
                }`}
              >
                {chat.text}
              </div>
            ))}
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-[#E0E0E0] flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                language === 'FR' 
                  ? "Votre message sur WhatsApp..." 
                  : language === 'AR' 
                  ? "اكتب رسالتك للواتساب..." 
                  : "Your message on WhatsApp..."
              }
              className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00]"
            />
            <button
              type="submit"
              className="p-2 bg-[#FF6B00] text-white rounded-xl hover:bg-[#E55A00] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : null}

      {/* Trigger floating button */}
      <button
        id="whatsapp-support-floating-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#FF6B00] hover:bg-[#E55A00] text-white p-4 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 cursor-pointer relative group"
        aria-label="WhatsApp Support"
      >
        <MessageSquare className="w-6 h-6 animate-pulse" />
        <span className="absolute right-14 bg-[#111111] text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md">
          {language === 'FR' && "Besoin d'aide ? Chattez avec nous !"}
          {language === 'AR' && "هل تحتاج إلى مساعدة؟ تواصل معنا!"}
          {language === 'EN' && "Need help? Chat with us!"}
        </span>
      </button>
    </div>
  );
}
