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
  onUpdateBookingStatus: (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed', cancelReason?: string, cancelledBy?: 'sitter' | 'owner' | 'admin') => void;
  onAddReview: (bookingId: string, sitterId: string, authorName: string, authorCity: string, rating: number, text: string) => void;
}

export default function OwnerDashboard({
  language,
  currentUser,
  onLogout,
  bookings,
  chats,
  onAddPet,
  onNavigateToChat,
  onUpdateBookingStatus,
  onAddReview
}: OwnerDashboardProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Navigation tab states inside dashboard
  const [activeTab, setActiveTab] = useState<'home' | 'pets' | 'bookings' | 'messages'>('home');

  // Cancel Booking modal states
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Review modal states
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");

  // New Pet inline modal form states
  const [showAddPetForm, setShowAddPetForm] = useState(false);
  const [newPetName, setNewPetName] = useState('');
  const [newPetType, setNewPetType] = useState<'chien' | 'chat' | 'lapin' | 'oiseau' | 'autre'>('chien');
  const [newPetBreed, setNewPetBreed] = useState('');
  const [newPetAge, setNewPetAge] = useState('');
  const [newPetPhotoUrl, setNewPetPhotoUrl] = useState('');

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
      photoUrl: newPetPhotoUrl || (newPetType === 'chien' ? '🐶' : newPetType === 'chat' ? '🐱' : newPetType === 'lapin' ? '🐰' : newPetType === 'oiseau' ? '🦜' : '🐾')
    };
    onAddPet(newPet);
    // Reset form
    setNewPetName('');
    setNewPetBreed('');
    setNewPetAge('');
    setNewPetPhotoUrl('');
    setShowAddPetForm(false);
  };

  // Filter out cancelled bookings for the dashboard view
  const activeBookings = bookings.filter(b => b.status !== 'cancelled');

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
                  {activeBookings.length > 0 ? (
                    <>
                      <h3 className="text-2xl font-black">{activeBookings[0].sitterName}</h3>
                      <p className="text-sm text-white/90 font-bold">
                        {activeBookings[0].startDate} {language === 'FR' ? "au" : "إلى"} {activeBookings[0].endDate}
                      </p>
                      <p className="text-xs text-white/80 font-semibold">{language === 'FR' ? "Pour l'animal :" : "For:"} {activeBookings[0].petName}</p>
                    </>
                  ) : (
                    <h3 className="text-xl font-bold">{t.db_owner_no_bookings}</h3>
                  )}
                </div>
                <div className="relative z-10">
                  {activeBookings.length > 0 ? (
                    <div className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold w-fit capitalize">
                      {activeBookings[0].status === 'pending' ? t.db_owner_status_pending : t.db_owner_status_confirmed}
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
                    <div key={pet.id} className="inline-block h-10 w-10 rounded-full bg-orange-100 border-2 border-white overflow-hidden flex items-center justify-center text-lg shadow-sm" title={pet.name}>
                      {pet.photoUrl && (pet.photoUrl.startsWith('data:image') || pet.photoUrl.startsWith('http')) ? (
                        <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        pet.photoUrl
                      )}
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

              {activeBookings.length === 0 ? (
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
                      {activeBookings.map((booking) => (
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

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">{language === 'FR' ? "Photo de l'animal (Optionnel)" : "Pet Photo (Optional)"}</label>
                  <label className="border border-dashed border-gray-300 hover:border-[#FF6B00] rounded-xl p-3 text-center cursor-pointer bg-white hover:bg-[#FF6B00]/5 transition-all block relative">
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
                              setNewPetPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {newPetPhotoUrl ? (
                      <div className="flex items-center gap-3 justify-center">
                        <img src={newPetPhotoUrl} alt="Pet Preview" className="w-10 h-10 rounded-lg object-cover border animate-fade-in" referrerPolicy="no-referrer" />
                        <span className="text-xs font-extrabold text-[#FF6B00]">{language === 'FR' ? "Changer" : "Change"}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500 font-semibold">{language === 'FR' ? "Cliquez pour téléverser une image" : "Click to upload an image"}</span>
                    )}
                  </label>
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
                    <div className="w-16 h-16 rounded-2xl bg-orange-50 overflow-hidden flex items-center justify-center text-3xl shadow-sm border border-[#FF6B00]/10 shrink-0">
                      {pet.photoUrl && (pet.photoUrl.startsWith('data:image') || pet.photoUrl.startsWith('http')) ? (
                        <img src={pet.photoUrl} alt={pet.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        pet.photoUrl
                      )}
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
                      {booking.status === 'cancelled' && booking.cancelReason && (
                        <p className="text-[11px] text-red-600 bg-red-50 px-2.5 py-1 rounded-lg font-bold inline-block border border-red-100 mt-1">
                          ⚠️ {language === 'FR' ? "Annulé :" : "Cancelled:"} {booking.cancelReason} {booking.cancelledBy && `(par ${booking.cancelledBy === 'owner' ? 'vous' : booking.cancelledBy === 'sitter' ? 'le sitter' : 'l\'admin'})`}
                        </p>
                      )}
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
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status === 'confirmed' && t.db_owner_status_confirmed}
                          {booking.status === 'pending' && t.db_owner_status_pending}
                          {booking.status === 'cancelled' && t.db_owner_status_cancelled}
                          {booking.status === 'completed' && t.db_owner_status_completed}
                        </span>
                        <button
                          onClick={() => alert(language === 'FR' ? "Chat en direct avec le sitter depuis l'onglet Messagerie." : "Open chat from message panel.")}
                          className="p-2 border border-gray-200 hover:border-[#FF6B00] rounded-lg text-gray-500 hover:text-[#FF6B00] transition-colors cursor-pointer"
                          title="Chatter"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        {(booking.status === 'pending' || booking.status === 'confirmed') && (
                          <button
                            onClick={() => {
                              setCancelBookingId(booking.id);
                              setShowCancelModal(true);
                            }}
                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            {language === 'FR' ? "Annuler" : "Cancel"}
                          </button>
                        )}
                        {booking.status === 'completed' && (
                          <button
                            onClick={() => {
                              setReviewBooking(booking);
                              setShowReviewModal(true);
                            }}
                            className="px-3 py-2 bg-orange-50 hover:bg-orange-100 text-[#FF6B00] font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Star className="w-3.5 h-3.5 fill-[#FF6B00] stroke-none" />
                            {language === 'FR' ? "Laisser un avis" : "Leave Review"}
                          </button>
                        )}
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

            
          </div>
        )}

      </main>

      {/* Cancellation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-lg text-gray-900">
              {language === 'FR' ? "Annuler la réservation" : "Cancel Reservation"}
            </h3>
            <p className="text-xs text-gray-500 font-semibold">
              {language === 'FR'
                ? "Veuillez indiquer le motif de l'annulation. Ce motif sera visible par l'autre utilisateur et l'administration."
                : "Please enter the reason for cancellation. This will be shared with the other user and administration."}
            </p>
            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 min-h-[100px]"
              placeholder={language === 'FR' ? "Ex: Changement de plan de voyage, urgence..." : "Reason for cancellation..."}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelBookingId(null);
                  setCancelReason("");
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'FR' ? "Retour" : "Go Back"}
              </button>
              <button
                type="button"
                disabled={!cancelReason.trim()}
                onClick={() => {
                  if (cancelBookingId) {
                    onUpdateBookingStatus(cancelBookingId, 'cancelled', cancelReason, 'owner');
                  }
                  setShowCancelModal(false);
                  setCancelBookingId(null);
                  setCancelReason("");
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'FR' ? "Confirmer l'annulation" : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {showReviewModal && reviewBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-4">
            <h3 className="font-extrabold text-lg text-gray-900">
              {language === 'FR' ? "Laisser un avis certifié" : "Leave a Certified Review"}
            </h3>
            <p className="text-xs text-gray-500 font-semibold">
              {language === 'FR'
                ? `Donnez votre avis sur votre expérience de garde pour ${reviewBooking.petName} avec ${reviewBooking.sitterName}.`
                : `Rate your pet sitting experience for ${reviewBooking.petName} with ${reviewBooking.sitterName}.`}
            </p>

            {/* Star Rating selector */}
            <div className="flex items-center justify-center gap-2 py-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className="p-1 cursor-pointer transition-transform active:scale-95"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= reviewRating
                        ? "fill-[#FF6B00] text-[#FF6B00]"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] min-h-[100px]"
              placeholder={language === 'FR' ? "Votre message d'avis (ex: garde fantastique, très professionnel...)" : "Write your review message..."}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowReviewModal(false);
                  setReviewBooking(null);
                  setReviewText("");
                  setReviewRating(5);
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'FR' ? "Retour" : "Go Back"}
              </button>
              <button
                type="button"
                disabled={!reviewText.trim()}
                onClick={() => {
                  if (reviewBooking) {
                  onAddReview(
                      reviewBooking.id,
                      reviewBooking.sitterId,
                      `${currentUser.firstName} ${currentUser.lastName || ""}`.trim() || "Propriétaire",
                      currentUser.city || "Casablanca",
                      reviewRating,
                      reviewText
                    );
                  }
                  setShowReviewModal(false);
                  setReviewBooking(null);
                  setReviewText("");
                  setReviewRating(5);
                }}
                className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#E55A00] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {language === 'FR' ? "Publier l'avis" : "Submit Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
