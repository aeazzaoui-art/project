/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, MapPin, MessageSquare } from 'lucide-react';
import { Language, Message, ChatConversation, User as AppUser, Sitter } from '../types';
import { translations } from '../translations';
import { getMessagesFromFirestore, sendMessageToFirestore, getUser } from '../lib/firebaseService';

interface ChatViewProps {
  language: Language;
  currentUser: AppUser | null;
  sitters: Sitter[];
  activeChatPartnerId: string | null;
  setActiveChatPartnerId: (id: string | null) => void;
  onViewSitterProfile: (sitterId: string) => void;
}

export default function ChatView({ 
  language, 
  currentUser, 
  sitters, 
  activeChatPartnerId, 
  setActiveChatPartnerId,
  onViewSitterProfile 
}: ChatViewProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string>('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [partnerProfiles, setPartnerProfiles] = useState<Record<string, { name: string; photo: string; city: string }>>({});
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto scroll to chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvId]);

  // Load messages and build conversations dynamically
  useEffect(() => {
    if (!currentUser) return;

    let active = true;

    function formatMessageTime(timestampStr: string): string {
      try {
        const date = new Date(timestampStr);
        if (isNaN(date.getTime())) return timestampStr;
        return date.toLocaleTimeString(language === 'AR' ? 'ar' : 'fr', { hour: '2-digit', minute: '2-digit' });
      } catch {
        return timestampStr;
      }
    }

    async function loadDataAndBuildConversations() {
      try {
        const fireMessages = await getMessagesFromFirestore();
        if (!active) return;

        // Filter messages involving current user
        const myMessages = fireMessages.filter(
          (m) => m.senderId === currentUser.id || m.recipientId === currentUser.id
        );

        // Group messages by partnerId
        const grouped: Record<string, Message[]> = {};
        myMessages.forEach((msg) => {
          const partnerId = msg.senderId === currentUser.id ? msg.recipientId : msg.senderId;
          if (!grouped[partnerId]) {
            grouped[partnerId] = [];
          }
          grouped[partnerId].push(msg);
        });

        // Collect all partner IDs
        const partnerIds = Object.keys(grouped);

        // Ensure active partner is in the list
        if (activeChatPartnerId && !partnerIds.includes(activeChatPartnerId)) {
          partnerIds.push(activeChatPartnerId);
          grouped[activeChatPartnerId] = [];
        }

        // Fetch missing partner profiles
        const newProfilesToFetch = partnerIds.filter(
          (pid) => !sitters.some((s) => s.id === pid) && !partnerProfiles[pid]
        );

        const fetchedProfiles: Record<string, { name: string; photo: string; city: string }> = {};
        for (const pid of newProfilesToFetch) {
          const uDoc = await getUser(pid);
          if (uDoc) {
            fetchedProfiles[pid] = {
              name: `${uDoc.firstName} ${uDoc.lastName}`,
              photo: (uDoc.firstName[0] + uDoc.lastName[0]).toUpperCase(),
              city: uDoc.city || ''
            };
          } else {
            fetchedProfiles[pid] = {
              name: 'Propriétaire',
              photo: 'PR',
              city: ''
            };
          }
        }

        if (Object.keys(fetchedProfiles).length > 0) {
          setPartnerProfiles((prev) => ({ ...prev, ...fetchedProfiles }));
        }

        // Build conversations list
        const builtConversations: ChatConversation[] = partnerIds.map((pid) => {
          const msgs = grouped[pid] || [];
          const lastMsg = msgs[msgs.length - 1];

          let name = 'Utilisateur';
          let photo = 'UT';
          let city = '';

          const sitter = sitters.find((s) => s.id === pid);
          if (sitter) {
            name = `${sitter.firstName} ${sitter.lastName}`;
            photo = (sitter.firstName[0] + sitter.lastName[0]).toUpperCase();
            city = sitter.city;
          } else {
            const cached = { ...partnerProfiles, ...fetchedProfiles }[pid];
            if (cached) {
              name = cached.name;
              photo = cached.photo;
              city = cached.city;
            }
          }

          return {
            sitterId: pid,
            sitterName: name,
            sitterPhoto: photo,
            sitterCity: city,
            lastMessageText: lastMsg ? lastMsg.text : (language === 'FR' ? 'Aucun message' : 'لا رسائل'),
            lastMessageTime: lastMsg ? formatMessageTime(lastMsg.timestamp) : '',
            unreadCount: 0
          };
        });

        setConversations(builtConversations);
        setMessages(grouped);

        // Set active conversation ID if not set yet
        if (activeChatPartnerId) {
          setActiveConvId(activeChatPartnerId);
        } else if (!activeConvId && builtConversations.length > 0) {
          setActiveConvId(builtConversations[0].sitterId);
        }
      } catch (err) {
        console.error("Error loading chat conversations:", err);
      }
    }

    loadDataAndBuildConversations();

    // Poll every 5 seconds for robust real-time updates
    const interval = setInterval(loadDataAndBuildConversations, 5000);

    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [currentUser, sitters, activeChatPartnerId, language]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser || !activeConvId) return;

    const newMsgText = inputText;
    setInputText('');

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      recipientId: activeConvId,
      text: newMsgText,
      timestamp: new Date().toISOString()
    };

    // Optimistically update locally
    setMessages((prev) => ({
      ...prev,
      [activeConvId]: [...(prev[activeConvId] || []), newMsg]
    }));

    try {
      await sendMessageToFirestore(newMsg);
      
      // If talking to a demo seed sitter, trigger mock responses
      if (activeConvId === 'sitter-1' || activeConvId === 'sitter-2') {
        setTimeout(async () => {
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
            recipientId: currentUser.id,
            text: replyText,
            timestamp: new Date().toISOString()
          };

          await sendMessageToFirestore(responseMsg);
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-8 bg-white border border-gray-200 rounded-3xl shadow-md max-w-sm">
          <MessageSquare className="w-12 h-12 text-[#FF6B00] mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            {language === 'FR' ? "Veuillez vous connecter" : "يرجى تسجيل الدخول"}
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            {language === 'FR' ? "Vous devez être connecté pour accéder à la messagerie." : "يجب أن تكون مسجلاً للدخول للوصول إلى الرسائل."}
          </p>
        </div>
      </div>
    );
  }

  const activeConv = conversations.find((c) => c.sitterId === activeConvId);
  const currentChatMessages = messages[activeConvId] || [];

  return (
    <div className="min-h-screen bg-[#F7F7F7] py-6 sm:py-10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-2xl font-black text-[#111111] mb-6 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-[#FF6B00]" />
          {t.chat_title}
        </h1>

        <div className="bg-white border border-[#E0E0E0] rounded-3xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[550px] max-h-[650px]">
          
          {/* Left Column: Conversations */}
          <div className="md:col-span-4 border-r border-[#E0E0E0] flex flex-col">
            <div className="p-4 border-b border-gray-100 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
              {language === 'FR' ? "Discussions Actives" : "Active Chats"}
            </div>
            
            <div className="divide-y divide-gray-50 overflow-y-auto flex-1">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs font-bold text-gray-400">
                  {language === 'FR' ? "Aucune discussion active" : "لا توجد محادثات نشطة"}
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = conv.sitterId === activeConvId;
                  return (
                    <div
                      key={conv.sitterId}
                      id={`chat-sidebar-conv-${conv.sitterId}`}
                      onClick={() => {
                        setActiveConvId(conv.sitterId);
                        setActiveChatPartnerId(conv.sitterId);
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
                })
              )}
            </div>
          </div>

          {/* Right Column: Chat window */}
          <div className="md:col-span-8 flex flex-col justify-between bg-gray-50">
            {activeConv ? (
              <>
                {/* Header */}
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
                      {activeConv.sitterCity && (
                        <p className="text-[10px] text-gray-400 font-bold flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-[#FF6B00]" />
                          {activeConv.sitterCity}
                        </p>
                      )}
                    </div>
                  </div>

                  {sitters.some((s) => s.id === activeConv.sitterId) && (
                    <button
                      onClick={() => onViewSitterProfile(activeConv.sitterId)}
                      className="px-4 py-2 border border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00]/5 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      {t.search_btn_profile}
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-6 overflow-y-auto space-y-4 max-h-[420px]">
                  {currentChatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <MessageSquare className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-400">
                        {language === 'FR' ? "Envoyez le premier message !" : "أرسل أول رسالة للبدء !"}
                      </p>
                    </div>
                  ) : (
                    currentChatMessages.map((msg) => {
                      const isMe = msg.senderId === currentUser.id;
                      // Display dynamic timestamp
                      let displayTime = '';
                      try {
                        const date = new Date(msg.timestamp);
                        displayTime = isNaN(date.getTime()) ? msg.timestamp : date.toLocaleTimeString(language === 'AR' ? 'ar' : 'fr', { hour: '2-digit', minute: '2-digit' });
                      } catch {
                        displayTime = msg.timestamp;
                      }

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
                          <span className="text-[9px] font-bold text-gray-400 mt-1 px-1">{displayTime}</span>
                        </div>
                      );
                    })
                  )}
                  <div ref={chatBottomRef} />
                </div>

                {/* Footer form */}
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
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-gray-50">
                <MessageSquare className="w-16 h-16 text-[#FF6B00]/20 mb-4 animate-pulse" />
                <h3 className="text-sm font-black text-gray-700 mb-1">
                  {language === 'FR' ? "Sélectionnez une discussion" : "اختر محادثة"}
                </h3>
                <p className="text-xs font-bold text-gray-400 max-w-xs leading-relaxed">
                  {language === 'FR' ? "Choisissez un contact dans la liste de gauche pour commencer à discuter." : "اختر جهة اتصال من القائمة اليسرى لبدء التحدث."}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
