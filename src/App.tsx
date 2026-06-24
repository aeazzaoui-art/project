/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Language,
  ActivePage,
  User,
  Sitter,
  Booking,
  Message,
  Pet,
  Review,
} from "./types";
import { translations } from "./translations";
import { SITTERS, REVIEWS } from "./data";
import {
  getSitters,
  saveUser,
  getUser,
  getBookings,
  saveBooking,
  updateBookingInFirestore,
  getReviewsFromFirestore,
  saveSitter,
  logoutWithAuth,
} from "./lib/firebaseService";

// Component imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import WhatsAppButton from "./components/WhatsAppButton";

// Page imports
import Home from "./pages/Home";
import Search from "./pages/Search";
import SitterProfile from "./pages/SitterProfile";
import SignUpOwner from "./pages/SignUpOwner";
import SignUpSitter from "./pages/SignUpSitter";
import OwnerDashboard from "./pages/OwnerDashboard";
import SitterDashboard from "./pages/SitterDashboard";
import ChatView from "./pages/ChatView";
import About from "./pages/About";
import FAQView from "./pages/FAQView";
import Administration from "./pages/Administration";

import { useFirestoreRealtime } from "./lib/useFirestoreRealtime";
import { Loader2 } from "lucide-react";
import { auth } from "./firebase";

export default function App() {
  const {
    users,
    sitters: realtimeSitters,
    bookings: realtimeBookings,
    reviews: realtimeReviews,
    currentUser: realtimeCurrentUser,
    currentSitterUser: realtimeCurrentSitterUser,
    loading: realtimeLoading,
    authLoading,
  } = useFirestoreRealtime();

  // --- 1. LOCAL STORAGE PERSISTENCE STATES ---
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("amuch_language");
    return (saved as Language) || "FR";
  });

  const [activePage, _setActivePage] = useState<ActivePage>(() => {
    const saved = localStorage.getItem("amuch_active_page");
    return (saved as ActivePage) || "home";
  });

  const [isPageTransitioning, setIsPageTransitioning] = useState(false);

  const setActivePage = (page: ActivePage) => {
    setIsPageTransitioning(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      _setActivePage(page);
      setIsPageTransitioning(false);
    }, 150);
  };

  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("amuch_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [currentSitterUser, setCurrentSitterUser] = useState<Sitter | null>(
    () => {
      const saved = localStorage.getItem("amuch_sitter_user");
      return saved ? JSON.parse(saved) : null;
    },
  );

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem("amuch_bookings");
    return saved ? JSON.parse(saved) : [];
  });

  // Active selected sitter for detail profile view
  const [sitters, setSitters] = useState<Sitter[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(() => {
    const saved = localStorage.getItem("amuch_selected_sitter");
    return saved ? JSON.parse(saved) : null;
  });

  const [activeChatPartnerId, setActiveChatPartnerId] = useState<string | null>(
    null,
  );

  // Sync realtime data
  useEffect(() => {
    if (!realtimeLoading) {
      setSitters(realtimeSitters);
      setBookings(realtimeBookings);
      setReviews(realtimeReviews);
    }
  }, [realtimeSitters, realtimeBookings, realtimeReviews, realtimeLoading]);

  // Sync auth data
  useEffect(() => {
    if (!authLoading) {
      if (realtimeCurrentUser) {
        if (realtimeCurrentUser.isBlocked) {
          // Log out the blocked user
          logoutWithAuth().catch(console.error);
          setCurrentUser(null);
          setCurrentSitterUser(null);
          setActivePage("home");
          localStorage.removeItem("amuch_user");
          localStorage.removeItem("amuch_sitter_user");
          alert(
            language === "FR"
              ? "Votre compte a été suspendu par l'administrateur de la plateforme."
              : "تم تعليق حسابك من قبل المسؤول.",
          );
        } else {
          setCurrentUser(realtimeCurrentUser);
          setCurrentSitterUser(realtimeCurrentSitterUser);
        }
      } else {
        // If realtimeCurrentUser is null but Firebase Auth has an active session,
        // we might be in the middle of a signup or login write/propagate transition.
        // We only clear local states if there is genuinely no authenticated user at all.
        if (!auth.currentUser) {
          setCurrentUser(null);
          setCurrentSitterUser(null);
        }
      }
    }
  }, [realtimeCurrentUser, realtimeCurrentSitterUser, authLoading, language]);

  // Sync URL Path with activePage (handling /adminstration or /administration)
  useEffect(() => {
    const syncPathWithPage = () => {
      const path = window.location.pathname;
      if (path === "/administration" || path === "/adminstration") {
        setActivePage("administration");
      } else if (activePage === "administration") {
        setActivePage("home");
      }
    };

    window.addEventListener("popstate", syncPathWithPage);
    // Run once on mount to handle direct URL visits
    const initialPath = window.location.pathname;
    if (initialPath === "/administration" || initialPath === "/adminstration") {
      setActivePage("administration");
    }
    return () => window.removeEventListener("popstate", syncPathWithPage);
  }, []);

  // Push Page state to browser history pathname
  useEffect(() => {
    const path = window.location.pathname;
    if (activePage === "administration") {
      if (path !== "/adminstration" && path !== "/administration") {
        window.history.pushState({}, "", "/administration");
      }
    } else {
      if (path === "/adminstration" || path === "/administration") {
        window.history.pushState({}, "", "/");
      }
    }
  }, [activePage]);

  // Modal for quick booking flow
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    sitter: Sitter | null;
    dates: { start: string; end: string };
  }>({
    isOpen: false,
    sitter: null,
    dates: { start: "2026-06-24", end: "2026-06-28" },
  });

  const [bookingPetId, setBookingPetId] = useState<string>("");

  // Save states to local storage on change
  useEffect(() => {
    localStorage.setItem("amuch_language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("amuch_active_page", activePage);
  }, [activePage]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("amuch_user", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("amuch_user");
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentSitterUser) {
      localStorage.setItem(
        "amuch_sitter_user",
        JSON.stringify(currentSitterUser),
      );
    } else {
      localStorage.removeItem("amuch_sitter_user");
    }
  }, [currentSitterUser]);

  useEffect(() => {
    localStorage.setItem("amuch_bookings", JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    if (selectedSitter) {
      localStorage.setItem(
        "amuch_selected_sitter",
        JSON.stringify(selectedSitter),
      );
    } else {
      localStorage.removeItem("amuch_selected_sitter");
    }
  }, [selectedSitter]);

  // --- 2. SEO & META TAG UPDATES ---
  useEffect(() => {
    // Dynamic page title based on language and active page
    let pageTitle = "AMUCH — Plateforme marocaine de garde d'animaux";
    let metaDesc =
      "Trouvez un pet sitter de confiance au Maroc. Services de garde vérifiés pour chiens et chats.";

    if (language === "AR") {
      pageTitle = "أموش — ابحث عن حارس حيوانات موثوق في المغرب";
      metaDesc =
        "أموش يربط أصحاب الحيوانات الأليفة بحراس حيوانات معتمدين وموثوقين في المغرب. احجز الآن وسافر بدون قلق.";
    } else if (language === "EN") {
      pageTitle = "AMUCH — Find a Trusted Pet Sitter in Morocco";
      metaDesc =
        "AMUCH connects pet owners with verified pet sitters in Morocco. Book online, live chat and travel worry-free.";
    }

    // Append page-specific titles
    switch (activePage) {
      case "search":
        pageTitle += ` | ${language === "FR" ? "Trouver un sitter" : language === "AR" ? "ابحث عن حارس" : "Find Sitter"}`;
        break;
      case "profile":
        if (selectedSitter) {
          pageTitle += ` | ${selectedSitter.firstName} ${selectedSitter.lastName}`;
        }
        break;
      case "signup-owner":
        pageTitle += ` | ${language === "FR" ? "Inscription Propriétaire" : language === "AR" ? "تسجيل المالك" : "Owner Sign Up"}`;
        break;
      case "signup-sitter":
        pageTitle += ` | ${language === "FR" ? "Devenir Pet Sitter" : language === "AR" ? "كن حارساً" : "Become Sitter"}`;
        break;
      case "owner-dashboard":
      case "sitter-dashboard":
        pageTitle += ` | ${language === "FR" ? "Tableau de Bord" : language === "AR" ? "لوحة التحكم" : "Dashboard"}`;
        break;
      case "chat":
        pageTitle += ` | ${language === "FR" ? "Messagerie" : language === "AR" ? "المحادثات" : "Messages"}`;
        break;
      case "about":
        pageTitle += ` | ${language === "FR" ? "À propos" : language === "AR" ? "من نحن" : "About Us"}`;
        break;
      case "faq":
        pageTitle += ` | FAQ`;
        break;
    }

    document.title = pageTitle;

    // Update meta description
    const descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
      descMeta.setAttribute("content", metaDesc);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = metaDesc;
      document.head.appendChild(meta);
    }
  }, [language, activePage, selectedSitter]);

  // --- 3. CORE STATE CALLBACK HANDLERS ---

  // Sitter selects to see detailed profile of another sitter
  const handleSelectSitter = (sitter: Sitter) => {
    setSelectedSitter(sitter);
    setActivePage("profile");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // User starts booking flow
  const handleBookSitterFlow = (
    sitter: Sitter,
    dates: { start: string; end: string },
  ) => {
    // If user is not logged in as owner, redirect them to Sign Up / Log In as Owner
    if (!currentUser || currentUser.role !== "owner") {
      alert(
        language === "FR"
          ? "Pour réserver un Sitter, veuillez d'abord créer votre compte propriétaire et ajouter vos animaux."
          : "لحجز حارس حيوانات، يرجى إنشاء حساب صاحب حيوان أليف أولاً وتسجيل حيواناتك.",
      );
      setActivePage("signup-owner");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If user has no pets, redirect them to dashboard to add one
    if (currentUser.pets.length === 0) {
      alert(
        language === "FR"
          ? "Veuillez d'abord enregistrer un animal dans votre tableau de bord."
          : "يرجى تسجيل حيوان أليف أولاً في لوحة التحكم الخاصة بك.",
      );
      setActivePage("owner-dashboard");
      return;
    }

    // Open booking modal
    setBookingPetId(currentUser.pets[0].id);
    setBookingModal({
      isOpen: true,
      sitter,
      dates,
    });
  };

  // Finalizes booking inside modal
  const handleConfirmBooking = () => {
    if (!bookingModal.sitter || !currentUser) return;

    const pet =
      currentUser.pets.find((p) => p.id === bookingPetId) ||
      currentUser.pets[0];

    // Calculate total days
    const d1 = new Date(bookingModal.dates.start);
    const d2 = new Date(bookingModal.dates.end);
    const days = Math.max(
      1,
      Math.round((d2.getTime() - d1.getTime()) / (1000 * 3600 * 24)),
    );
    const total = days * bookingModal.sitter.pricePerNight;

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      sitterId: bookingModal.sitter.id,
      sitterName: `${bookingModal.sitter.firstName} ${bookingModal.sitter.lastName}`,
      ownerId: currentUser.id,
      ownerName: `${currentUser.firstName} ${currentUser.lastName}`,
      petName: pet.name,
      petType: pet.type,
      city: bookingModal.sitter.city,
      startDate: bookingModal.dates.start,
      endDate: bookingModal.dates.end,
      totalPrice: total,
      status: "pending",
    };

    setBookings((prev) => [newBooking, ...prev]);
    saveBooking(newBooking); // Save to Firestore API
    setBookingModal({
      isOpen: false,
      sitter: null,
      dates: { start: "", end: "" },
    });

    alert(
      language === "FR"
        ? "Demande de réservation envoyée ! Retrouvez vos demandes dans votre Tableau de Bord."
        : "تم إرسال طلب الحجز بنجاح! يمكنك تتبع طلباتك في لوحة التحكم.",
    );

    setActivePage("owner-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Sitter updates reservation status from dashboard
  const handleUpdateBookingStatus = (
    bookingId: string,
    newStatus: "confirmed" | "cancelled" | "completed",
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b)),
    );
    updateBookingInFirestore(bookingId, newStatus); // Save to Firestore API
    alert(
      language === "FR"
        ? `Réservation mise à jour avec succès : statut ${newStatus === "confirmed" ? "Confirmé" : newStatus === "cancelled" ? "Annulé" : "Terminé"}.`
        : `تم تحديث حالة الحجز بنجاح.`,
    );
  };

  // Add pet to current logged-in owner user
  const handleAddPetToUser = (newPet: Pet) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      pets: [...currentUser.pets, newPet],
    };
    setCurrentUser(updatedUser);
    saveUser(updatedUser); // Save to Firestore API
    alert(
      language === "FR"
        ? `${newPet.name} a bien été enregistré(e) !`
        : `تم تسجيل ${newPet.name} بنجاح!`,
    );
  };

  // On completing Owner Registration
  const handleOwnerSignUpComplete = (user: User) => {
    setCurrentUser(user);
    setCurrentSitterUser(null);
    setActivePage("owner-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // On completing Sitter Registration
  const handleSitterSignUpComplete = (sitter: Sitter) => {
    const authEmail = auth.currentUser?.email || `${sitter.firstName.toLowerCase()}@amuch.ma`;
    const sitterUser: User = {
      id: sitter.id,
      firstName: sitter.firstName,
      lastName: sitter.lastName,
      email: authEmail,
      role: "sitter",
      city: sitter.city,
      pets: [],
    };
    setCurrentUser(sitterUser);
    setCurrentSitterUser(sitter);
    // Note: useFirestoreRealtime handles adding/syncing the new sitter in list state automatically
    setActivePage("sitter-dashboard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Starts chat directly with a sitter
  const handleStartChatWithSitter = (sitter: Sitter) => {
    setActiveChatPartnerId(sitter.id);
    setActivePage("chat");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogout = () => {
    logoutWithAuth().catch(console.error);
    setCurrentUser(null);
    setCurrentSitterUser(null);
    setActivePage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isRtl = language === "AR";

  if (realtimeLoading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F7F7]">
        <Loader2 className="w-10 h-10 animate-spin text-[#FF6B00]" />
      </div>
    );
  }

  if (activePage === "administration") {
    return (
      <Administration
        language={language}
        users={users}
        sitters={sitters}
        bookings={bookings}
        onBackToHome={() => setActivePage("home")}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white select-none">
      {/* 1. HEADER HUD */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activePage={activePage}
        setActivePage={setActivePage}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        authMode={authMode}
        setAuthMode={setAuthMode}
      />

      {/* 2. MAIN ACTIVE VIEW ROUTER */}
      <div className="flex-grow">
        {activePage === "home" && (
          <Home language={language} setActivePage={setActivePage} />
        )}

        {activePage === "search" && (
          <Search
            language={language}
            sitters={sitters}
            onSelectSitter={handleSelectSitter}
            onBookSitter={(sitter, dates) =>
              handleBookSitterFlow(sitter, dates)
            }
          />
        )}

        {activePage === "profile" && selectedSitter && (
          <SitterProfile
            language={language}
            sitter={selectedSitter}
            reviews={reviews}
            onBack={() => setActivePage("search")}
            onBook={(dates) => handleBookSitterFlow(selectedSitter, dates)}
            onStartChat={() => handleStartChatWithSitter(selectedSitter)}
          />
        )}

        {activePage === "signup-owner" && (
          <SignUpOwner
            language={language}
            onSignUpComplete={handleOwnerSignUpComplete}
            onSitterSignUpComplete={handleSitterSignUpComplete}
            initialMode={authMode}
            onLoginComplete={(user) => {
              setCurrentUser(user);
              if (user.role === "sitter") {
                const matched =
                  sitters.find((s) => s.id === user.id) || sitters[0];
                setCurrentSitterUser(matched);
                setActivePage("sitter-dashboard");
              } else {
                setCurrentSitterUser(null);
                setActivePage("owner-dashboard");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activePage === "signup-sitter" && (
          <SignUpSitter
            language={language}
            onSignUpComplete={handleSitterSignUpComplete}
          />
        )}

        {activePage === "owner-dashboard" && currentUser && (
          <OwnerDashboard
            language={language}
            currentUser={currentUser}
            onLogout={handleLogout}
            bookings={bookings.filter(
              (b) =>
                b.ownerId === currentUser.id || b.ownerId === "owner-default",
            )}
            chats={[]}
            onAddPet={handleAddPetToUser}
            onNavigateToChat={() => setActivePage("chat")}
          />
        )}

        {activePage === "sitter-dashboard" && currentSitterUser && (
          <SitterDashboard
            language={language}
            currentSitter={currentSitterUser}
            onLogout={handleLogout}
            bookings={bookings.filter(
              (b) =>
                b.sitterId === currentSitterUser.id ||
                b.sitterId === "sitter-1",
            )}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onNavigateToChat={() => setActivePage("chat")}
            reviews={reviews.filter(
              (r) =>
                r.sitterId === currentSitterUser.id ||
                r.sitterId === "sitter-1",
            )}
          />
        )}

        {activePage === "chat" && (
          <ChatView
            language={language}
            currentUser={currentUser}
            sitters={sitters}
            activeChatPartnerId={activeChatPartnerId}
            setActiveChatPartnerId={setActiveChatPartnerId}
            onViewSitterProfile={(sitterId) => {
              const matched =
                sitters.find((s) => s.id === sitterId) || sitters[0];
              setSelectedSitter(matched);
              setActivePage("profile");
            }}
          />
        )}

        {activePage === "about" && (
          <About language={language} setActivePage={setActivePage} />
        )}

        {activePage === "faq" && (
          <FAQView language={language} setActivePage={setActivePage} />
        )}
      </div>

      {/* 3. BOOKING SELECTION POPUP MODAL (REALISTIC DIALOG) */}
      {bookingModal.isOpen && bookingModal.sitter && currentUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div
            className="bg-white rounded-3xl border border-[#E0E0E0] shadow-2xl w-full max-w-md overflow-hidden"
            dir={isRtl ? "rtl" : "ltr"}
          >
            {/* Header */}
            <div className="bg-[#FF6B00] text-white p-5 font-bold text-center">
              <h3 className="text-lg">
                {language === "FR"
                  ? "Finaliser la Demande de Garde"
                  : "Confirm Booking Request"}
              </h3>
              <p className="text-xs text-white/90 font-semibold mt-1">
                {bookingModal.sitter.firstName} {bookingModal.sitter.lastName}{" "}
                &bull; {bookingModal.sitter.city}
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-sm">
              {/* Pet selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide block">
                  {language === "FR"
                    ? "Quel compagnon faire garder ?"
                    : "Which pet requires care?"}
                </label>
                <select
                  value={bookingPetId}
                  onChange={(e) => setBookingPetId(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00] cursor-pointer"
                >
                  {currentUser.pets.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.photoUrl} {p.name} ({p.breed})
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates confirmation */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl text-center">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    {language === "FR" ? "Arrivée" : "Start"}
                  </span>
                  <span className="font-extrabold text-xs text-[#111111]">
                    {bookingModal.dates.start}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase block">
                    {language === "FR" ? "Départ" : "End"}
                  </span>
                  <span className="font-extrabold text-xs text-[#111111]">
                    {bookingModal.dates.end}
                  </span>
                </div>
              </div>

              {/* Pricing breakdown summary */}
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-100 font-bold">
                <span className="text-gray-500">
                  {language === "FR" ? "Tarif nuit" : "Rate per night"}
                </span>
                <span className="text-sm text-[#111111]">
                  {bookingModal.sitter.pricePerNight} MAD
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-1 font-bold">
                <span className="text-gray-500">
                  {language === "FR" ? "Total Estimé" : "Estimated Total"}
                </span>
                <span className="text-xl text-[#FF6B00]">
                  {Math.max(
                    1,
                    Math.round(
                      (new Date(bookingModal.dates.end).getTime() -
                        new Date(bookingModal.dates.start).getTime()) /
                        (1000 * 3600 * 24),
                    ),
                  ) * bookingModal.sitter.pricePerNight}{" "}
                  MAD
                </span>
              </div>
            </div>

            {/* Footer action buttons */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 border-t border-gray-100">
              <button
                onClick={handleConfirmBooking}
                className="flex-1 py-3 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-extrabold rounded-xl transition-colors text-xs text-center cursor-pointer shadow-sm"
              >
                {language === "FR" ? "Envoyer la Demande" : "Send Request"}
              </button>
              <button
                onClick={() =>
                  setBookingModal({
                    isOpen: false,
                    sitter: null,
                    dates: { start: "", end: "" },
                  })
                }
                className="px-5 py-3 bg-gray-200 hover:bg-gray-300 text-[#111111] font-bold rounded-xl transition-colors text-xs text-center cursor-pointer"
              >
                {language === "FR" ? "Annuler" : "Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FOOTER */}
      <Footer
        language={language}
        setLanguage={setLanguage}
        setActivePage={setActivePage}
      />

      {/* 5. PRIVACY COOKIE HUD */}
      <CookieBanner language={language} />

      {/* 6. WHATSAPP SUPPORT CHAT WIDGET */}
      <WhatsAppButton language={language} />
    </div>
  );
}
