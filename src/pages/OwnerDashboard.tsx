/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, PawPrint, Calendar, MessageSquare, Star, UserCheck, LogOut, Plus, ShieldCheck } from 'lucide-react';
import { Language, User, Pet, Booking, Message } from '../types';
import { translations } from '../translations';

interface OwnerDashboardProps {
  language: Language;
  currentUser: User;
  onLogout: () => void;
  bookings: Booking[];
  chats: Message[];
  onAddPet: (pet: Pet) => void;
  onNavigateToChat: () => void;
}

export default function OwnerDashboard({
  language,
  currentUser,
  onLogout,
  bookings,
  chats,
  onAddPet,
  onNavigateToChat
}: OwnerDashboardProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Navigation tab states inside dashboard
  const [activeTab, setActiveTab] = useState<'home' | 'pets' | 'bookings' | 'messages'>('home');

  // New Pet inline modal form states
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'chien' | 'chat' | 'lapin' | 'oiseau' | 'autre'>('chien');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');

  const sidebarItems = [
    { id: 'home', label: language === 'FR' ? "Accueil Dashboard" : language === 'AR' ? "الرئيسية" : "Dashboard Home", icon: LayoutDashboard },
    { id: 'pets', label: t.db_owner_my_pets, icon: PawPrint },
    { id: 'bookings', label: language === 'FR' ? "Mes Réservations" : language === 'AR' ? "حجوزاتي" : "My Bookings", icon: Calendar },
    { id: 'messages', label: language === 'FR' ? "Messages" : language === 'AR' ? "الرسائل" : "Messages", icon: MessageSquare }
  ];

  const handleAddNewPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim() || !newPetBreed.trim() || !newPetAge.trim()) {
      return;
    }
    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetName,
      type: newPetType,
      breed: newPetBreed,
      age: newPetAge,
      photoUrl: newPetType === 'chien' ? '🐶' : newPetType === 'chat' ? '🐱' : newPetType === 'lapin' ? '🐰' : newPetType === 'oiseau' ? '🦜' : '🐾'
    };
    onAddPet(newPet);
    // Reset form
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setShowAddPetForm(false);
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col lg:flex-row" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* LEFT SIDEBAR HUD */}
      <aside className="w-full lg:w-72 bg-[#111111] text-white flex flex-col justify-between shrink-0 font-sans border-r-2 border-[#FF6B00]">
        <div>
          {/* Sitter Avatar/Name block */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FF6B00] flex items-center justify-center font-black text-white text-lg">
              {currentUser.firstName[0]}{currentUser.lastName[0]}
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{currentUser.firstName} {currentUser.lastName}</h4>
              <p className="text-[10px] text-[#FF6B00] font-black uppercase tracking-wider">{currentUser.role} Account</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                    activeTab === item.id
                      ? 'bg-[#FF6B00] text-white shadow-md'
                      : 'hover:bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout bottom */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>{t.nav_logout}</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEW AREA */}
      <main className="flex-1 p-6 md:p-10 space-y-8">
        
        {/* TAB 1: HOME DASHBOARD ACCUEIL */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Top Welcome Title */}
            <div>
              <h1 className="text-3xl font-black text-[#111111] mb-1">
                {t.db_owner_welcome} {currentUser.firstName} 👋
              </h1>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{currentUser.city} &bull; Morocco</p>
            </div>

            {/* Top Row: Next Active reservation */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Highlight reservation */}
              <div className="lg:col-span-2 bg-[#FF6B00] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between h-48">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                  <PawPrint className="w-48 h-48 text-white" />
                </div>
                <div className="relative z-10 space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block mb-2">
                    {t.db_owner_next_booking}
                  </span>
                  {bookings.length > 0 ? (
                    <>
                      <h3 className="text-2xl font-black">{bookings[0].sitterName}</h3>
                      <p className="text-sm text-white/90 font-bold">
                        {bookings[0].startDate} {language === 'FR' ? "au" : "إلى"} {bookings[0].endDate}
                      </p>
                      <p className="text-xs text-white/80 font-semibold">{language === 'FR' ? "Pour l'animal :" : "For:"} {bookings[0].petName}</p>
                    </>
                  ) : (
                    <h3 className="text-xl font-bold">{t.db_owner_no_bookings}</h3>
                  )}
                </div>
                <div className="relative z-10">
                  {bookings.length > 0 ? (
                    <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold w-fit capitalize">
                      {bookings[0].status === 'pending' ? t.db_owner_status_pending : t.db_owner_status_confirmed}
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="px-4 py-2 bg-white text-[#FF6B00] rounded-xl text-xs font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-md"
                    >
                      {language === 'FR' ? "Faire une demande de garde" : "Create request"}
                    </button>
                  )}
                </div>
              </div>

              {/* Animals Quick summary info block */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h4 className="font-extrabold text-[#111111] text-base mb-1">{t.db_owner_my_pets}</h4>
                  <p className="text-xs text-gray-500 mb-4">{currentUser.pets.length} {language === 'FR' ? "enregistrés" : "registered"}</p>
                </div>
                <div className="flex -space-x-2 overflow-hidden mb-4">
                  {currentUser.pets.map((pet) => (
                    <div key={pet.id} className="inline-block h-10 w-10 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-lg shadow-sm" title={pet.name}>
                      {pet.photoUrl}
                    </div>
                  ))}
                  <button
                    onClick={() => setShowAddPetForm(true)}
                    className="inline-block h-10 w-10 rounded-full bg-gray-100 hover:bg-orange-100 border-2 border-white flex items-center justify-center text-sm font-bold text-[#FF6B00] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => setActiveTab('pets')}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs font-bold rounded-xl text-center cursor-pointer"
                >
                  {language === 'FR' ? "Gérer mes animaux" : "Manage Pets"}
                </button>
              </div>
            </div>

            {/* Second Row: Active bookings listing table */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="font-extrabold text-[#111111] text-lg border-b border-gray-100 pb-3">
                {t.db_owner_active_bookings}
              </h3>

              {bookings.length === 0 ? (
                <p className="text-sm text-gray-500">{t.db_owner_no_bookings}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                        <th className="py-3 px-4">{t.db_owner_sitter}</th>
                        <th className="py-3 px-4">{t.db_owner_dates}</th>
                        <th className="py-3 px-4">{t.db_owner_status}</th>
                        <th className="py-3 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-bold text-[#111111]">{booking.sitterName}</td>
                          <td className="py-3.5 px-4 font-semibold text-xs text-gray-500">{booking.startDate} - {booking.endDate}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                            }`}>
                              {booking.status === 'confirmed' ? t.db_owner_status_confirmed : t.db_owner_status_pending}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-[#111111]">{booking.totalPrice} MAD</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PETS */}
        {activeTab === 'pets' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#111111]">{t.db_owner_my_pets}</h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{language === 'FR' ? "Ajoutez et gérez vos fiches animaux" : "Manage your pet records"}</p>
              </div>
              <button
                onClick={() => setShowAddPetForm(true)}
                className="px-5 py-3 bg-[#FF6B00] text-white rounded-xl text-xs font-extrabold hover:bg-[#E55A00] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'FR' ? "Ajouter un Animal" : "Add Pet"}</span>
              </button>
            </div>

            {/* Inline Pet Form */}
            {showAddPetForm && (
              <form onSubmit={handleAddNewPet} className="bg-[#FF6B00]/5 border border-[#FF6B00]/10 rounded-2xl p-6 space-y-4">
                <h3 className="font-extrabold text-sm text-[#FF6B00]">{language === 'FR' ? "Enregistrer un nouveau compagnon" : "Register new pet"}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_name}</label>
                    <input
                      type="text"
                      required
                      value={newPetName}
                      onChange={(e) => setNewPetName(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
                      placeholder="e.g. Max"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_type}</label>
                    <select
                      value={newPetType}
                      onChange={(e) => setNewPetType(e.target.value as any)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white cursor-pointer"
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
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_breed}</label>
                    <input
                      type="text"
                      required
                      value={newPetBreed}
                      onChange={(e) => setNewPetBreed(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
                      placeholder="e.g. Golden Retriever"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t.signup_pet_age}</label>
                    <input
                      type="text"
                      required
                      value={newPetAge}
                      onChange={(e) => setNewPetAge(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white"
                      placeholder="e.g. 1 an, 8 mois"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#FF6B00] text-white rounded-xl text-xs font-bold hover:bg-[#E55A00] transition-all cursor-pointer shadow-sm"
                  >
                    {language === 'FR' ? "Sauvegarder l'animal" : "Save Pet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddPetForm(false)}
                    className="px-5 py-2.5 bg-gray-200 text-[#111111] rounded-xl text-xs font-bold hover:bg-gray-300 transition-all cursor-pointer"
                  >
                    {language === 'FR' ? "Annuler" : "Cancel"}
                  </button>
                </div>
              </form>
            )}

            {/* Pets List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {currentUser.pets.map((pet) => (
                <div key={pet.id} className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shadow-sm border border-[#FF6B00]/10">
                      {pet.photoUrl}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base text-[#111111]">{pet.name}</h4>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide capitalize">{pet.type} &bull; {pet.breed}</p>
                      <p className="text-[11px] text-[#FF6B00] font-bold">{pet.age}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert("Simulé : Profil de l'animal éditable dans la version finale.")}
                    className="text-xs font-extrabold text-gray-500 hover:text-[#FF6B00] cursor-pointer"
                  >
                    {language === 'FR' ? "Modifier" : "Edit"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: RESERVATIONS DETAILS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#111111] border-b border-gray-200 pb-4">
              {language === 'FR' ? "Mes demandes de réservation" : "My Booking Demands"}
            </h2>

            {bookings.length === 0 ? (
              <p className="text-sm text-gray-500">{t.db_owner_no_bookings}</p>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-[#111111]">{booking.sitterName}</span>
                        <span className="text-xs text-gray-400 capitalize">&bull; {booking.city}</span>
                      </div>
                      <p className="text-xs font-bold text-gray-500">
                        🗓️ {booking.startDate} {language === 'FR' ? "au" : "إلى"} {booking.endDate}
                      </p>
                      <p className="text-xs font-semibold text-gray-400 capitalize">
                        🐶 {language === 'FR' ? "Animal pris en charge :" : "Pet in Care:"} {booking.petName}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                      <div>
                        <span className="text-xs font-bold text-gray-400 block">Total</span>
                        <span className="font-extrabold text-base text-[#111111]">{booking.totalPrice} MAD</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'confirmed' ? t.db_owner_status_confirmed : t.db_owner_status_pending}
                        </span>
                        <button
                          onClick={() => alert(language === 'FR' ? "Chat en direct avec le sitter depuis l'onglet Messagerie." : "Open chat from message panel.")}
                          className="p-2 border border-gray-200 hover:border-[#FF6B00] rounded-lg text-gray-500 hover:text-[#FF6B00] transition-colors cursor-pointer"
                          title="Chatter"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: RECENT MESSAGES */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#111111]">{language === 'FR' ? "Messagerie interne" : "Conversations"}</h2>
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{language === 'FR' ? "Échangez avec vos sitters" : "Chat with sitters"}</p>
              </div>
              <button
                onClick={onNavigateToChat}
                className="px-5 py-2.5 bg-[#FF6B00] text-white hover:bg-[#E55A00] rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
              >
                {language === 'FR' ? "Ouvrir la messagerie" : "Open Inbox"}
              </button>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm divide-y divide-gray-100">
              <div 
                onClick={onNavigateToChat}
                className="py-4 first:pt-0 last:pb-0 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 rounded-xl px-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center">AE</div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111111]">Anass El Mansouri</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">Salam, Lily va super bien ! On vient de rentrer de promenade...</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">10:45</span>
              </div>

              <div 
                onClick={onNavigateToChat}
                className="py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 rounded-xl px-2 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center">AB</div>
                  <div>
                    <h4 className="font-extrabold text-sm text-[#111111]">Amina Benjelloun</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">Je suis disponible pour garder Caramel aux dates indiquées.</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-gray-400">Hier</span>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
