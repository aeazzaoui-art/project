/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, UserCheck, Calendar, MessageSquare, Star, LogOut, Coins, Heart, BellRing } from 'lucide-react';
import { Language, Sitter, Booking, Review } from '../types';
import { translations } from '../translations';

interface SitterDashboardProps {
  language: Language;
  currentSitter: Sitter;
  onLogout: () => void;
  bookings: Booking[];
  onUpdateBookingStatus: (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed', cancelReason?: string, cancelledBy?: 'sitter' | 'owner' | 'admin') => void;
  onNavigateToChat: (partnerId?: string) => void;
  reviews: Review[];
}

export default function SitterDashboard({
  language,
  currentSitter,
  onLogout,
  bookings,
  onUpdateBookingStatus,
  onNavigateToChat,
  reviews
}: SitterDashboardProps) {
  const t = translations[language];
  const isRtl = language === 'AR';

  // Sitter navigation rail tab states
  const [activeTab, setActiveTab] = useState<'home' | 'bookings' | 'reviews' | 'earnings'>('home');

  // Cancel Booking modal states
  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);

  const sidebarItems = [
    { id: 'home', label: language === 'FR' ? "Accueil Sitter" : language === 'AR' ? "رئيسية الحارس" : "Sitter Home", icon: LayoutDashboard },
    { id: 'bookings', label: language === 'FR' ? "Mes Réservations" : language === 'AR' ? "طلبات الرعاية" : "My Bookings", icon: Calendar },
    { id: 'chat', label: language === 'FR' ? "Messagerie" : language === 'AR' ? "المراسلات" : "Messages", icon: MessageSquare },
    { id: 'reviews', label: language === 'FR' ? "Mes Avis" : language === 'AR' ? "تقييماتي" : "My Reviews", icon: Star },
    { id: 'earnings', label: language === 'FR' ? "Mes Gains" : language === 'AR' ? "أرباحي" : "My Earnings", icon: Coins }
  ];

  // Derive metrics
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const totalEarnings = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col lg:flex-row" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* LEFT SIDEBAR RAIL */}
      <aside className="w-full lg:w-72 bg-[#111111] text-white flex flex-col justify-between shrink-0 border-r-2 border-[#FF6B00]">
        <div>
          {/* Sitter Identification Card */}
          <div className="p-6 border-b border-white/10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FF6B00] overflow-hidden flex items-center justify-center font-black text-white text-lg shrink-0">
              {currentSitter.photoUrl && (currentSitter.photoUrl.startsWith('data:image') || currentSitter.photoUrl.startsWith('http')) ? (
                <img src={currentSitter.photoUrl} alt="Sitter" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                `${currentSitter.firstName[0]}${currentSitter.lastName[0]}`
              )}
            </div>
            <div>
              <h4 className="font-extrabold text-sm">{currentSitter.firstName} {currentSitter.lastName}</h4>
              <p className="text-[10px] text-[#FF6B00] font-black uppercase tracking-wider">Verified Sitter ⭐</p>
            </div>
          </div>

          {/* Navigation link tags */}
          <nav className="p-4 space-y-1.5">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'chat') {
                      onNavigateToChat();
                    } else {
                      setActiveTab(item.id as any);
                    }
                  }}
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

        {/* Log out action */}
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

      {/* CORE CONTENT LAYOUT */}
      <main className="flex-1 p-6 md:p-10 space-y-8 font-sans">
        
        {/* TAB 1: DASHBOARD HOME ACCUEIL */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Greeting Header */}
            <div>
              <h1 className="text-3xl font-black text-[#111111] mb-1">
                {t.db_owner_welcome} {currentSitter.firstName} 👋
              </h1>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">{currentSitter.city} &bull; Verified Pet Sitter</p>
            </div>

            {/* Quick Metrics HUD */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Earnings card */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase block">{t.db_sitter_earnings}</span>
                  <span className="text-3xl font-black text-[#FF6B00] block">{totalEarnings} MAD</span>
                </div>
                <div className="p-4 bg-[#FF6B00]/10 rounded-2xl text-[#FF6B00]">
                  <Coins className="w-8 h-8" />
                </div>
              </div>

              {/* Pending reservation count card */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase block">{t.db_sitter_pending_count}</span>
                  <span className="text-3xl font-black text-[#111111] block">{pendingCount}</span>
                </div>
                <div className={`p-4 rounded-2xl ${pendingCount > 0 ? 'bg-red-50 text-red-500 animate-pulse' : 'bg-gray-100 text-gray-400'}`}>
                  <BellRing className="w-8 h-8" />
                </div>
              </div>

              {/* Sitter public score */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex items-center justify-between">
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-gray-400 uppercase block">{language === 'FR' ? "Note Moyenne" : "Average Rating"}</span>
                  <span className="text-3xl font-black text-[#111111] block flex items-center gap-1">
                    ★ {currentSitter.rating}
                  </span>
                </div>
                <div className="p-4 bg-orange-50 text-orange-400 rounded-2xl">
                  <Star className="w-8 h-8 fill-orange-400 stroke-none" />
                </div>
              </div>
            </div>

            {/* Bookings Action Panel Table */}
            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
              <h3 className="font-extrabold text-[#111111] text-lg border-b border-gray-100 pb-3">
                {language === 'FR' ? "Demandes de garde en attente" : "Pending Sitting Requests"}
              </h3>

              {bookings.filter(b => b.status === 'pending').length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-6">{language === 'FR' ? "Aucune demande en attente pour le moment." : "No pending care requests currently."}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                        <th className="py-3 px-4">{t.db_sitter_clients}</th>
                        <th className="py-3 px-4">{t.db_owner_dates}</th>
                        <th className="py-3 px-4">{language === 'FR' ? "Animal" : "Animal"}</th>
                        <th className="py-3 px-4">Gains</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.filter(b => b.status === 'pending').map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-bold text-[#111111]">{booking.ownerName}</td>
                          <td className="py-3.5 px-4 font-semibold text-xs text-gray-500">{booking.startDate} au {booking.endDate}</td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-[#FF6B00]">{booking.petName} ({booking.petType})</td>
                          <td className="py-3.5 px-4 font-black text-[#111111]">{booking.totalPrice} MAD</td>
                          <td className="py-3.5 px-4">
                            <div className="flex gap-2 justify-center items-center">
                              <button
                                onClick={() => onUpdateBookingStatus(booking.id, 'confirmed')}
                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer shadow-sm"
                              >
                                {language === 'FR' ? "Confirmer" : "Accept"}
                              </button>
                              <button
                                onClick={() => {
                                  setCancelBookingId(booking.id);
                                  setShowCancelModal(true);
                                }}
                                className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                {language === 'FR' ? "Refuser" : "Decline"}
                              </button>
                              <button
                                onClick={() => onNavigateToChat(booking.ownerId)}
                                className="p-1.5 bg-orange-100 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white rounded-lg transition-colors cursor-pointer"
                                title={language === 'FR' ? "Discuter" : "Chat"}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#111111] border-b border-gray-200 pb-4">
              {language === 'FR' ? "Toutes les réservations" : "All Bookings History"}
            </h2>

            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm overflow-hidden">
              {bookings.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-8">{language === 'FR' ? "Aucun historique de réservation." : "No historic bookings available."}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-gray-600">
                    <thead>
                      <tr className="border-b border-gray-100 text-xs font-bold text-gray-400 uppercase">
                        <th className="py-3 px-4">{t.db_sitter_clients}</th>
                        <th className="py-3 px-4">{t.db_owner_dates}</th>
                        <th className="py-3 px-4">Animal</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4 text-center">Statut</th>
                        <th className="py-3 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                          <td className="py-3.5 px-4 font-bold text-[#111111]">{booking.ownerName}</td>
                          <td className="py-3.5 px-4 font-semibold text-xs text-gray-500">{booking.startDate} au {booking.endDate}</td>
                          <td className="py-3.5 px-4 capitalize font-semibold text-gray-700">{booking.petName} ({booking.petType})</td>
                          <td className="py-3.5 px-4 font-bold text-[#111111]">{booking.totalPrice} MAD</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'pending'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {booking.status === 'confirmed' && t.db_owner_status_confirmed}
                              {booking.status === 'pending' && t.db_owner_status_pending}
                              {booking.status === 'cancelled' && t.db_owner_status_cancelled}
                              {booking.status === 'completed' && t.db_owner_status_completed}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex gap-2 justify-center items-center">
                              <button
                                onClick={() => onNavigateToChat(booking.ownerId)}
                                className="p-1.5 bg-orange-100 hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white rounded-lg transition-colors cursor-pointer"
                                title={language === 'FR' ? "Discuter" : "Chat"}
                              >
                                <MessageSquare className="w-4 h-4" />
                              </button>
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button
                                  onClick={() => {
                                    setCancelBookingId(booking.id);
                                    setShowCancelModal(true);
                                  }}
                                  className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                                  title={language === 'FR' ? "Annuler la réservation" : "Cancel booking"}
                                >
                                  {language === 'FR' ? "Annuler" : "Cancel"}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: REVIEWS LOG */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#111111] border-b border-gray-200 pb-4">
              {language === 'FR' ? "Avis certifiés reçus" : "My Public Certified Reviews"}
            </h2>

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="bg-white border border-[#E0E0E0] rounded-2xl p-8 text-center text-gray-500">
                  {language === 'FR' ? "Vous n'avez pas encore reçu d'avis." : "You have not received any reviews yet."}
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="bg-white border border-[#E0E0E0] rounded-2xl p-6 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FF6B00] font-bold flex items-center justify-center">
                          {rev.authorName[0]}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#111111]">{rev.authorName}</h4>
                          <p className="text-xs text-gray-400">{rev.authorCity} &bull; {rev.date}</p>
                        </div>
                      </div>
                      <span className="text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded">
                        ★ {rev.rating}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{rev.text}"</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: EARNINGS BLOCK */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#111111] border-b border-gray-200 pb-4">
              {t.db_sitter_earnings}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Gross Card */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">{language === 'FR' ? "Chiffre d'affaires brut" : "Gross Revenue"}</span>
                  <span className="text-3xl font-black text-gray-800">{totalEarnings} MAD</span>
                </div>
                <p className="text-[10px] text-gray-400 mt-4 font-semibold">{language === 'FR' ? "Montant total payé par les clients" : "Total amount paid by clients"}</p>
              </div>

              {/* Commission Card */}
              <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase block mb-1">
                    {language === 'FR' ? "Commission AMUCH (20%)" : "AMUCH Commission (20%)"}
                  </span>
                  <span className="text-3xl font-black text-[#FF6B00]">{Math.round(totalEarnings * 0.2)} MAD</span>
                </div>
                <p className="text-[10px] text-[#FF6B00] mt-4 font-bold">
                  {language === 'FR' ? "À payer / Déduit à la fin du mois" : "To pay / Deducted by end of month"}
                </p>
              </div>

              {/* Net Earnings Card */}
              <div className="bg-green-50 border border-green-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-green-700 uppercase block mb-1">{language === 'FR' ? "Vos gains nets (80%)" : "Your Net Earnings (80%)"}</span>
                  <span className="text-3xl font-black text-green-800">{Math.round(totalEarnings * 0.8)} MAD</span>
                </div>
                <p className="text-[10px] text-green-600 mt-4 font-bold">{language === 'FR' ? "Votre rémunération nette conservée" : "Your retained net payout"}</p>
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-3xl p-6 md:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="font-extrabold text-[#111111] text-lg">{language === 'FR' ? "Fonctionnement de la commission" : "How commission works"}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {language === 'FR' 
                    ? "Conformément aux directives de la plateforme AMUCH, une commission transparente de 20% est appliquée sur l'ensemble des réservations complétées. Ces fonds contribuent au maintien technique du service, à l'assistance client marocaine disponible 24/7, ainsi qu'à la promotion de vos profils pour maximiser vos réservations."
                    : "In accordance with AMUCH policies, a transparent 20% commission is calculated on all completed bookings. These fees support platform hosting, 24/7 Moroccan customer support, and marketing actions to bring more clients to your verified profiles."}
                </p>
                <div className="p-4 bg-orange-50/50 border border-[#FF6B00]/10 rounded-xl">
                  <p className="text-[11px] text-[#FF6B00] font-bold leading-relaxed">
                    {language === 'FR'
                      ? "⚠️ Rappel : La commission de 20% sur vos réservations terminées du mois en cours est due en fin de mois. Vous pouvez régler vos commissions d'intermédiation AMUCH à tout moment depuis votre espace ou par virement bancaire."
                      : "⚠️ Reminder: The 20% commission on completed bookings for the current month is due at the end of the month via bank transfer."}
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50 space-y-3">
                <h4 className="font-bold text-xs text-[#111111] uppercase tracking-wider">{language === 'FR' ? "Détails des gains récents" : "Recent earnings detail"}</h4>
                <div className="space-y-2.5 text-xs">
                  {bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').length === 0 ? (
                    <p className="text-xs text-gray-400 py-3 text-center">{language === 'FR' ? "Aucune réservation comptabilisée" : "No booking earnings accounted yet"}</p>
                  ) : (
                    bookings.filter(b => b.status === 'confirmed' || b.status === 'completed').map((b) => (
                      <div key={b.id} className="flex justify-between items-center bg-white border border-gray-200/50 rounded-lg p-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-700">{b.ownerName} &bull; {b.petName}</span>
                          <span className="text-[10px] text-gray-400">{language === 'FR' ? "Commission (20%) :" : "Commission (20%):"} {Math.round(b.totalPrice * 0.2)} MAD</span>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="font-extrabold text-[#FF6B00]">{b.totalPrice} MAD</span>
                          <span className="text-[10px] text-green-600 font-bold">{language === 'FR' ? "Net :" : "Net:"} {Math.round(b.totalPrice * 0.8)} MAD</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
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
              placeholder={language === 'FR' ? "Ex: Indisponibilité de dernière minute, urgence..." : "Reason for cancellation..."}
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
                    onUpdateBookingStatus(cancelBookingId, 'cancelled', cancelReason, 'sitter');
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
    </div>
  );
}
