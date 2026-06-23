/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, ShieldCheck, Heart, User, MessageSquare } from 'lucide-react';
import { Language, Message, ChatConversation } from '../types';
import { translations } from '../translations';
import { getMessagesFromFirestore, sendMessageToFirestore } from '../lib/firebaseService';

interface ChatViewProps {
  language: Language;
  onViewSitterProfile: (sitterId: string) => void;
}

export default function ChatView({ language, onViewSitterProfile }: ChatViewProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Seed list of conversations
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      sitterId: 'sitter-1',
      sitterName: 'Anass El Mansouri',
      sitterPhoto: 'AE',
      sitterCity: 'Casablanca',
      lastMessageText: "Salam ! Ne vous en faites pas, Lily s'est très bien habituée à l'appartement.",
      lastMessageTime: '10:45',
      unreadCount: 0
    },
    {
      sitterId: 'sitter-2',
      sitterName: 'Amina Benjelloun',
      sitterPhoto: 'AB',
      sitterCity: 'Rabat',
      lastMessageText: "Parfait, je reste disponible si vous voulez faire un appel vidéo ce soir.",
      lastMessageTime: 'Hier',
      unreadCount: 1
    }
  ]);

  const [activeConvId, setActiveConvId] = useState<string>('sitter-1');
  const activeConv = conversations.find((c) => c.sitterId === activeConvId) || conversations[0];

  // Seed messages for each conversation
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'sitter-1': [
      { id: 'm1', senderId: 'user', recipientId: 'sitter-1', text: "Bonjour Anass, est-ce que Lily s'est bien adaptée pour sa première journée ?", timestamp: '10:30' },
      { id: 'm2', senderId: 'sitter-1', recipientId: 'user', text: "Salam ! Ne vous en faites pas, Lily s'est très bien habituée à l'appartement. Elle a fini toute sa pâtée et se repose actuellement sur le canapé 🛋️", timestamp: '10:42' },
      { id: 'm3', senderId: 'sitter-1', recipientId: 'user', text: "Je vous envoie des photos de notre promenade au parc de la Ligue Arabe d'ici une heure !", timestamp: '10:45' }
    ],
    'sitter-2': [
      { id: 'm4', senderId: 'user', recipientId: 'sitter-2', text: "Bonjour Amina, quels sont vos créneaux libres pour la semaine prochaine ?", timestamp: 'Hier' },
      { id: 'm5', senderId: 'sitter-2', recipientId: 'user', text: "Parfait, je reste disponible si vous voulez faire un appel vidéo ce soir.", timestamp: 'Hier' }
    ]
  });

  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  // Load messages from Firestore on mount
  useEffect(() => {
    async function loadMessages() {
      try {
        const fireMessages = await getMessagesFromFirestore();
        if (fireMessages.length > 0) {
          const grouped: Record<string, Message[]> = {
            'sitter-1': [],
            'sitter-2': []
          };
          
          fireMessages.forEach(msg => {
            const partnerId = msg.senderId === 'user' ? msg.recipientId : msg.senderId;
            if (!grouped[partnerId]) {
              grouped[partnerId] = [];
            }
            grouped[partnerId].push(msg);
          });
          
          setMessages(prev => {
            const copy = { ...prev };
            Object.keys(grouped).forEach(key => {
              if (grouped[key].length > 0) {
                copy[key] = grouped[key];
              }
            });
            return copy;
          });
          
          // Update conversation list preview based on last messages
          setConversations(prev => {
            return prev.map(conv => {
              const convMsgs = grouped[conv.sitterId];
              if (convMsgs && convMsgs.length > 0) {
                const lastMsg = convMsgs[convMsgs.length - 1];
                return {
                  ...conv,
                  lastMessageText: lastMsg.text,
                  lastMessageTime: lastMsg.timestamp
                };
              }
              return conv;
            });
          });
        }
      } catch (err) {
        console.error("Failed to load messages from Firestore:", err);
      }
    }
    loadMessages();
  }, []);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsgText = inputText;
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'user',
      recipientId: activeConvId,
      text: newMsgText,
      timestamp: new Date().toLocaleTimeString(language === 'AR' ? 'ar' : 'fr', { hour: '2-digit', minute: '2-digit' })
    };

    // Update messages in state
    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));

    sendMessageToFirestore(newMsg); // Save to Firestore API

    // Clear text area
    setInputText('');

    // Update conversation list preview
    setConversations((prev) => {
      return prev.map((c) => {
        if (c.sitterId === activeConvId) {
          return {
            ...c,
            lastMessageText: newMsgText,
            lastMessageTime: newMsg.timestamp
          };
        }
        return c;
      });
    });

    // Simulate Sitter response delay
    setTimeout(() => {
      let replyText = "";
      if (activeConvId === 'sitter-1') {
        replyText = language === 'FR' 
          ? "Entendu ! Je vous prépare les petites vidéos tout de suite. Lily vous fait un gros bisou ! 🐾"
          : language === 'AR'
          ? "مفهوم! سأقوم بإعداد مقاطع الفيديو القصيرة لكم الآن. ليلي ترسل لكم قبلة كبيرة! 🐾"
          : "Understood! I'll get the videos ready for you right now. Lily sends you a big hug! 🐾";
      } else {
        replyText = language === 'FR'
          ? "C'est noté ! Je me connecte dès ce soir pour notre appel. À bientôt !"
          : "أموش: تم التدوين! سأتصل بكم هذا المساء للتحدث. أراك قريباً !";
      }

      const responseMsg: Message = {
        id: `msg-resp-${Date.now()}`,
        senderId: activeConvId,
        recipientId: 'user',
        text: replyText,
        timestamp: new Date().toLocaleTimeString(language === 'AR' ? 'ar' : 'fr', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => ({
        ...prev,
        [activeConvId]: [...(prev[activeConvId] || []), responseMsg]
      }));

      sendMessageToFirestore(responseMsg); // Save response to Firestore API

      setConversations((prev) => {
        return prev.map((c) => {
          if (c.sitterId === activeConvId) {
            return {
              ...c,
              lastMessageText: replyText,
              lastMessageTime: responseMsg.timestamp
            };
          }
          return c;
        });
      });

    }, 1500);
  };

  const currentChatMessages = messages[activeConvId] || [];

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-6 sm:py-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title hud */}
        <h1 className="text-2xl font-black text-[#111111] mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#FF6B00]" />
          {t.chat_title}
        </h1>

        <div className="bg-white border border-[#E0E0E0] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] max-h-[650px]">
          
          {/* Left Column: Conversations selection list (Col 1-4) */}
          <div className="md:col-span-4 border-r border-[#E0E0E0] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {language === 'FR' ? "Discussions Actives" : "Active Chats"}
            </div>
            
            <div className="divide-y divide-gray-50 overflow-y-auto flex-1">
              {conversations.map((conv) => {
                const isActive = conv.sitterId === activeConvId;
                return (
                  <div
                    key={conv.sitterId}
                    id={`chat-sidebar-conv-${conv.sitterId}`}
                    onClick={() => {
                      setActiveConvId(conv.sitterId);
                      // Clear unread on select
                      setConversations((prev) => prev.map((c) => c.sitterId === conv.sitterId ? { ...c, unreadCount: 0 } : c));
                    }}
                    className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${
                      isActive ? 'bg-[#FF6B00]/5 text-[#FF6B00]' : 'hover:bg-gray-50 text-[#111111]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 rounded-full bg-[#FF6B00]/10 border-2 border-[#FF6B00]/20 flex items-center justify-center font-bold text-sm text-[#FF6B00] shrink-0">
                        {conv.sitterPhoto}
                      </div>
                      <div className="min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isActive ? 'text-[#FF6B00]' : 'text-[#111111]'}`}>
                          {conv.sitterName}
                        </h4>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{conv.lastMessageText}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[9px] font-bold text-gray-400">{conv.lastMessageTime}</span>
                      {conv.unreadCount > 0 && (
                        <span className="w-4 h-4 rounded-full bg-[#FF6B00] text-white text-[9px] font-black flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Chat view Window (Col 5-12) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-gray-50">
            {/* Sitter Chat Header */}
            <div className="bg-white border-b border-[#E0E0E0] p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 border border-[#FF6B00] flex items-center justify-center font-bold text-sm text-[#FF6B00]">
                  {activeConv.sitterPhoto}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-[#111111] flex items-center gap-1.5">
                    <span>{activeConv.sitterName}</span>
                    <span className="inline-flex text-[10px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-black border border-green-100">
                      {t.search_verified_badge}
                    </span>
                  </h3>
                  <p className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-[#FF6B00]" />
                    {activeConv.sitterCity}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onViewSitterProfile(activeConv.sitterId)}
                className="px-4 py-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/5 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                {t.search_btn_profile}
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[420px]">
              {currentChatMessages.map((msg) => {
                const isMe = msg.senderId === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[75%] ${isMe ? (isRtl ? 'mr-auto items-start' : 'ml-auto items-end') : (isRtl ? 'ml-auto items-end' : 'mr-auto items-start')}`}
                  >
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isMe 
                        ? 'bg-[#FF6B00] text-white rounded-br-none shadow-sm' 
                        : 'bg-white border border-gray-200 text-[#111111] rounded-bl-none shadow-sm'
                    }`}>
                      {msg.text}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 px-1">{msg.timestamp}</span>
                  </div>
                );
              })}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Typing Area */}
            <form onSubmit={handleSend} className="bg-white border-t border-[#E0E0E0] p-4 flex gap-3">
              <input
                id="chat-message-input-field"
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={t.chat_placeholder}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
              />
              <button
                id="chat-send-msg-btn"
                type="submit"
                className="px-6 py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">{t.chat_send}</span>
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
