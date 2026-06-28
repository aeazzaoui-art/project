/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Users,
  ShieldAlert,
  DollarSign,
  CalendarRange,
  BarChart3,
  LogOut,
  Search,
  Lock,
  Mail,
  Shield,
  TrendingUp,
  MapPin,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  UserX,
  UserCheck,
  ChevronRight,
  Loader2,
  BookOpen,
  Plus,
  Trash2,
  Edit3
} from "lucide-react";
import { Language, User, Sitter, Booking, BlogPost } from "../types";
import { auth } from "../firebase";
import { AmuchLogo } from "../components/AmuchLogo";
import {
  getAllUsersFromFirestore,
  updateUserBlockStatus,
  updateUserActivationStatus,
  adminLoginWithAuth,
  resetPlatformData,
  addBlogPostToFirestore,
  updateBlogPostInFirestore,
  deleteBlogPostFromFirestore
} from "../lib/firebaseService";

interface AdministrationProps {
  language: Language;
  users: User[];
  sitters: Sitter[];
  bookings: Booking[];
  blogPosts: BlogPost[];
  onBackToHome: () => void;
}

export default function Administration({
  language,
  users,
  sitters,
  bookings,
  blogPosts,
  onBackToHome,
}: AdministrationProps) {
  const isRtl = language === "AR";

  // Auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem("amuch_admin_logged_in") === "true";
  });

  useEffect(() => {
    if (isAdminLoggedIn) {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (!user || user.email !== "aeazzaoui@gmail.com") {
          try {
            await adminLoginWithAuth("aeazzaoui@gmail.com", "Abdou9708");
          } catch (err) {
            console.error("Background admin auto-login failed:", err);
          }
        }
      });
      return () => unsubscribe();
    }
  }, [isAdminLoggedIn]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "maintenance" | "blog">(
    "dashboard",
  );

  // Date Range for Statistics
  const [startDateInput, setStartDateInput] = useState("2026-01-01");
  const [endDateInput, setEndDateInput] = useState(() => new Date().toISOString().split("T")[0]);

  const [dateRange, setDateRange] = useState({
    start: "2026-01-01",
    end: new Date().toISOString().split("T")[0]
  });

  const handleApplyFilter = () => {
    setDateRange({
      start: startDateInput,
      end: endDateInput
    });
  };

  const [isResetting, setIsResetting] = useState(false);

  const handleResetDatabase = async () => {
    if (!window.confirm(language === "FR" ? "Êtes-vous sûr de vouloir supprimer TOUTES les données de la plateforme ? Cette action est irréversible." : "Are you sure you want to delete ALL platform data? This cannot be undone.")) {
      return;
    }

    setIsResetting(true);
    try {
      await resetPlatformData();
      alert(language === "FR" ? "Base de données réinitialisée avec succès." : "Database reset successfully.");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(language === "FR" ? "Erreur lors de la réinitialisation." : "Error during reset.");
    } finally {
      setIsResetting(false);
    }
  };

  // Blog Management state
  const [isAddingPost, setIsAddingPost] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("Equipe AMUCH");
  const [blogImageUrl, setBlogImageUrl] = useState("");
  const [isSubmittingBlog, setIsSubmittingBlog] = useState(false);

  const handleSaveBlogPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim() || !blogContent.trim()) {
      alert(language === "FR" ? "Le titre et le contenu sont requis." : "Title and content are required.");
      return;
    }

    setIsSubmittingBlog(true);
    try {
      if (!auth.currentUser || auth.currentUser.email !== "aeazzaoui@gmail.com") {
        await adminLoginWithAuth("aeazzaoui@gmail.com", "Abdou9708");
      }

      if (editingPost) {
        const updatedPost: BlogPost = {
          ...editingPost,
          title: blogTitle,
          content: blogContent,
          author: blogAuthor || "Equipe AMUCH",
          imageUrl: blogImageUrl || undefined,
        };
        await updateBlogPostInFirestore(updatedPost);
        alert(language === "FR" ? "Article mis à jour !" : "Blog post updated!");
      } else {
        const newPost: BlogPost = {
          id: `blog-${Date.now()}`,
          title: blogTitle,
          content: blogContent,
          author: blogAuthor || "Equipe AMUCH",
          date: new Date().toISOString().split("T")[0],
          imageUrl: blogImageUrl || undefined,
        };
        await addBlogPostToFirestore(newPost);
        alert(language === "FR" ? "Article créé avec succès !" : "Blog post created successfully!");
      }
      // Reset form
      setBlogTitle("");
      setBlogContent("");
      setBlogAuthor("Equipe AMUCH");
      setBlogImageUrl("");
      setIsAddingPost(false);
      setEditingPost(null);
    } catch (err) {
      console.error(err);
      alert(language === "FR" ? "Erreur lors de la sauvegarde." : "Error while saving.");
    } finally {
      setIsSubmittingBlog(false);
    }
  };

  const handleEditBlogPostClick = (post: BlogPost) => {
    setEditingPost(post);
    setBlogTitle(post.title);
    setBlogContent(post.content);
    setBlogAuthor(post.author);
    setBlogImageUrl(post.imageUrl || "");
    setIsAddingPost(true);
  };

  const handleDeleteBlogPostClick = async (postId: string) => {
    if (!window.confirm(language === "FR" ? "Supprimer cet article définitivement ?" : "Delete this blog post permanently?")) {
      return;
    }
    try {
      if (!auth.currentUser || auth.currentUser.email !== "aeazzaoui@gmail.com") {
        await adminLoginWithAuth("aeazzaoui@gmail.com", "Abdou9708");
      }
      await deleteBlogPostFromFirestore(postId);
      alert(language === "FR" ? "Article supprimé." : "Blog post deleted.");
    } catch (err) {
      console.error(err);
    }
  };

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "owner" | "sitter">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "blocked"
  >("all");

  // Status Action Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    userId: string;
    userName: string;
    action: "block" | "unblock";
  } | null>(null);

  // Selected User Details Modal State
  const [selectedUserDetails, setSelectedUserDetails] = useState<User | null>(
    null,
  );
  const [viewingImage, setViewingImage] = useState<string | null>(null);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    // Hardcoded requested credentials
    if (email.trim() === "aeazzaoui@gmail.com" && password === "Abdou9708") {
      try {
        await adminLoginWithAuth(email.trim(), password);
        setIsAdminLoggedIn(true);
        sessionStorage.setItem("amuch_admin_logged_in", "true");
      } catch (err) {
        console.error("Admin login failed", err);
        setLoginError(
          language === "FR"
            ? "Erreur de connexion Firebase. Vérifiez la console."
            : "خطأ في تسجيل الدخول. تحقق من وحدة التحكم."
        );
      }
      setIsLoggingIn(false);
    } else {
      setLoginError(
        language === "FR"
          ? "Identifiants invalides. Veuillez réessayer."
          : "البريد الإلكتروني أو كلمة المرor غير صحيحة.",
      );
      setIsLoggingIn(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem("amuch_admin_logged_in");
    setEmail("");
    setPassword("");
  };

  // Handle User Blocking toggle
  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    const { userId, action } = confirmModal;
    const isBlocked = action === "block";

    try {
      await updateUserBlockStatus(userId, isBlocked);

      // Flash Alert/Toast
      alert(
        language === "FR"
          ? `L'utilisateur a été ${isBlocked ? "bloqué" : "débloqué"} avec succès.`
          : `تم ${isBlocked ? "حظر" : "إلغاء حظر"} المستخدم بنجاح.`,
      );
    } catch (err) {
      console.error(err);
      alert(
        language === "FR"
          ? "Échec de la modification du statut."
          : "فشل تغيير الحالة.",
      );
    } finally {
      setConfirmModal(null);
    }
  };

  // --- STATS CALCULATIONS ---
  // Filter bookings by date range and exclude cancelled
  const filteredBookings = bookings.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (!b.startDate) return true;
    const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
    const end = dateRange.end
      ? new Date(dateRange.end).getTime()
      : Infinity;
    const bookingTime = new Date(b.startDate).getTime();
    return bookingTime >= start && bookingTime <= end;
  });

  // Total reservations
  const totalReservations = filteredBookings.length;
  
  // Total Cancelled reservations
  const cancelledBookings = bookings.filter((b) => {
    if (b.status.toLowerCase() !== 'cancelled') return false;
    if (!b.startDate) return true;
    const start = dateRange.start ? new Date(dateRange.start).getTime() : 0;
    const end = dateRange.end
      ? new Date(dateRange.end).getTime()
      : Infinity;
    const bookingTime = new Date(b.startDate).getTime();
    return bookingTime >= start && bookingTime <= end;
  });
  const totalCancelled = cancelledBookings.length;

  // Total Revenue calculation (Confirmed and Completed bookings)
  const revenueBookings = filteredBookings.filter(b => b.status.toLowerCase() === 'completed' || b.status.toLowerCase() === 'confirmed');
  const totalRevenue = revenueBookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0,
  );

  // AMUCH Platform commission (20% standard rate)
  const platformCommission = Math.round(totalRevenue * 0.2);
  const adminRevenue = platformCommission;

  // Total registered Owners
  const ownersCount = users.filter((u) => u.role === "owner").length;

  // Total registered Sitters
  const sittersCount = users.filter((u) => u.role === "sitter").length;

  // Monthly breakdown of bookings for trend chart
  const getMonthlyStats = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const monthlyData = Array(12).fill(0);

    filteredBookings.forEach((b) => {
      if (b.startDate) {
        const monthIndex = new Date(b.startDate).getMonth();
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex]++;
        }
      }
    });

    return months
      .map((month, idx) => ({
        month,
        count: monthlyData[idx],
      }))
      .filter((_, idx) => {
        const currentMonth = new Date().getMonth();
        // If we are filtering by range, maybe show all months that have data
        return true; 
      });
  };

  const monthlyTrend = getMonthlyStats();
  const maxTrendValue = Math.max(...monthlyTrend.map((d) => d.count), 5);

  // City breakdown of bookings
  const getCityBreakdown = () => {
    const cityMap: Record<string, { bookingsCount: number; revenue: number }> =
      {};

    filteredBookings.forEach((b) => {
      const city = b.city || "Casablanca";
      if (!cityMap[city]) {
        cityMap[city] = { bookingsCount: 0, revenue: 0 };
      }
      cityMap[city].bookingsCount++;
      cityMap[city].revenue += b.totalPrice || 0;
    });

    if (Object.keys(cityMap).length === 0) {
      return [];
    }

    return Object.entries(cityMap)
      .map(([name, stats]) => ({
        name,
        ...stats,
      }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const cityBreakdown = getCityBreakdown();

  // Pet Types Breakdown
  const getPetDistribution = () => {
    let cats = 0;
    let dogs = 0;
    let others = 0;

    filteredBookings.forEach((b) => {
      const type = (b.petType || "").toLowerCase();
      if (type.includes("chat") || type.includes("cat")) {
        cats++;
      } else if (type.includes("chien") || type.includes("dog")) {
        dogs++;
      } else {
        others++;
      }
    });

    const total = cats + dogs + others;
    if (total === 0) {
      return { cats: 0, dogs: 0, others: 0 };
    }

    return {
      cats: Math.round((cats / total) * 100),
      dogs: Math.round((dogs / total) * 100),
      others: Math.round((others / total) * 100),
    };
  };

  const petDistribution = getPetDistribution();

  // Filtered Users List
  const filteredUsers = users.filter((user) => {
    // 1. Search term match
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const emailMatch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nameMatch = fullName.includes(searchTerm.toLowerCase());
    const cityMatch = user.city
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSearch = emailMatch || nameMatch || cityMatch;

    // 2. Role filter match
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    // 3. Status filter match
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "blocked" && user.isBlocked === true) ||
      (statusFilter === "active" && !user.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getSitterInfo = (userId: string) => {
    return sitters.find((s) => s.id === userId);
  };

  // --- RENDER LOGIN VIEW ---
  if (!isAdminLoggedIn) {
    return (
      <div
        className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8"
        dir={isRtl ? "rtl" : "ltr"}
      >
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <div className="flex justify-center items-center gap-2 mb-2">
            <AmuchLogo variant="orange" className="w-10 h-10" />
            <span className="text-3xl font-normal text-[#111111] tracking-tight">
              AMUCH
            </span>
          </div>
          <span className="inline-flex items-center gap-1 bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-normal px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Espace Administration
          </span>
          <h2 className="text-2xl font-normal text-[#111111] tracking-tight">
            Connexion Administrateur
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Saisissez vos identifiants sécurisés pour gérer la plateforme.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-6 shadow-xl border border-gray-100 rounded-3xl sm:px-10">
            {loginError && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-xs font-bold rounded-lg flex items-start gap-2 animate-fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                  Adresse Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="aeazzaoui@gmail.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-400 uppercase block mb-1">
                  Mot de Passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full py-3.5 bg-[#FF6B00] text-white font-extrabold rounded-xl hover:bg-[#E55A00] transition-all disabled:bg-gray-400 text-xs tracking-wider uppercase shadow-md flex justify-center items-center gap-1.5 cursor-pointer"
                >
                  {isLoggingIn ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      S'authentifier
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-gray-100 flex justify-between items-center text-xs">
              <button
                type="button"
                onClick={onBackToHome}
                className="text-gray-400 hover:text-gray-600 font-bold transition-colors cursor-pointer"
              >
                ← Retour au site
              </button>
              <span className="text-gray-400 font-medium">
                AMUCH Admin v1.2
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER ADMIN DASHBOARD VIEW ---
  return (
    <div
      className="min-h-screen bg-[#F9FAFB] flex font-sans text-gray-800"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* 1. SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 min-h-screen">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AmuchLogo variant="orange" className="w-6 h-6" />
            <span className="text-xl font-normal text-[#111111] tracking-tight">
              AMUCH
            </span>
          </div>
          <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-[9px] font-normal px-2 py-0.5 rounded-full uppercase">
            ADMIN
          </span>
        </div>

        {/* Logged in Admin Profile */}
        <div className="p-4 mx-4 my-3 bg-gray-50 rounded-2xl flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-normal text-sm shadow-inner">
            AA
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-normal text-gray-800 truncate">
              Abdou El Azzaoui
            </h4>
            <span className="text-[10px] text-gray-400 truncate block">
              aeazzaoui@gmail.com
            </span>
          </div>
        </div>

        {/* Nav Tabs */}
        <nav className="flex-1 px-4 py-3 space-y-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Tableau de Bord
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("users")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === "users"
                ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <Users className="w-4 h-4" />
            Utilisateurs ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("maintenance")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === "maintenance"
                ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Maintenance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              activeTab === "blog"
                ? "bg-[#FF6B00]/10 text-[#FF6B00]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blog Management
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-50 space-y-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
          >
            Quitter le panel
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-extrabold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header toolbar */}
        <header className="h-16 bg-white border-b border-gray-100 px-8 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              {activeTab === "dashboard"
                ? "Vue Globale & Métriques"
                : "Gestion des Comptes Utilisateurs"}
            </h2>
          </div>
          <div className="flex items-center gap-4 text-xs font-normal text-gray-400">
            <span>
              {activeTab === "maintenance" ? (language === "FR" ? "Outils système & nettoyage" : "System Tools & Cleanup") : ""}
            </span>
            <div className="h-4 w-px bg-gray-200"></div>
            <span>
              {new Date().toLocaleDateString(
                language === "FR" ? "fr-FR" : "ar-MA",
                {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </span>
            <div className="h-4 w-px bg-gray-200"></div>
            <span className="text-[#FF6B00] flex items-center gap-1 font-medium">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Live Firebase Sync
            </span>
          </div>
        </header>

        {/* Content container */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* TAB 1: DASHBOARD STATS */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Date Filter Section */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 leading-tight">
                    Filtre par période
                  </h3>
                  <p className="text-[10px] text-gray-400 font-normal uppercase tracking-wider mt-1">
                    Ajuster les statistiques affichées
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Début</label>
                    <input 
                      type="date" 
                      value={startDateInput}
                      onChange={(e) => setStartDateInput(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Fin</label>
                    <input 
                      type="date" 
                      value={endDateInput}
                      onChange={(e) => setEndDateInput(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00]"
                    />
                  </div>
                  <button
                    onClick={handleApplyFilter}
                    className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E55A00] text-white text-xs font-extrabold rounded-xl shadow-xs cursor-pointer transition-all flex items-center justify-center gap-1.5 h-[38px]"
                  >
                    <span>Filtrer</span>
                  </button>
                </div>
              </div>

              {/* Bento Grid KPI Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                {/* Metric 1: Total Users */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Utilisateurs
                    </span>
                    <span className="p-2 rounded-xl bg-blue-50 text-blue-500 group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-gray-900">
                      {users.length}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Inscrits en base Firestore
                    </p>
                  </div>
                </div>

                {/* Metric 2: Owners */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Propriétaires
                    </span>
                    <span className="p-2 rounded-xl bg-orange-50 text-orange-500 group-hover:scale-110 transition-transform">
                      🐶
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-gray-900">
                      {ownersCount}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Doivent faire garder un animal
                    </p>
                  </div>
                </div>

                {/* Metric 3: Sitters */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Sitter Pro
                    </span>
                    <span className="p-2 rounded-xl bg-purple-50 text-purple-500 group-hover:scale-110 transition-transform">
                      🐈
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-gray-900">
                      {sittersCount}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Profils de garde disponibles
                    </p>
                  </div>
                </div>

                {/* Metric 4: Reservations */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Réservations
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform">
                      <CalendarRange className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-gray-900">
                      {totalReservations}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Total de nuits réservées
                    </p>
                  </div>
                </div>

                {/* Metric 5: Cancelled */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Cancelled
                    </span>
                    <span className="p-2 rounded-xl bg-red-50 text-red-500 group-hover:scale-110 transition-transform">
                      <AlertTriangle className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-gray-900">
                      {totalCancelled}
                    </span>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      Réservations annulées
                    </p>
                  </div>
                </div>

                {/* Metric 6: Gross Revenue */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Chiffre d'affaires (Brut)
                    </span>
                    <span className="p-2 rounded-xl bg-[#FF6B00]/10 text-[#FF6B00] group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-[#FF6B00]">
                      {totalRevenue} MAD
                    </span>
                  </div>
                </div>

                {/* Metric 7: Admin Revenue */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all group">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">
                      Total Revenue
                    </span>
                    <span className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-emerald-600">
                      {adminRevenue} MAD
                    </span>
                    <p className="text-[10px] text-gray-400 font-bold mt-1">
                      (20% sur réservations)
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Visualization Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart 1: Booking Trends */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm col-span-2 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <div>
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Évolution des Réservations
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Nombre de demandes mensuelles d'animaux de compagnie
                      </p>
                    </div>
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FF6B00]/5 text-[#FF6B00] text-[10px] font-extrabold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      +24% Croissance
                    </span>
                  </div>

                  {/* SVG Chart Design */}
                  <div className="h-64 flex flex-col justify-end pt-4">
                    <div className="flex-1 w-full relative flex items-end">
                      {/* Grid Lines */}
                      <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-40">
                        <div className="border-b border-gray-100 w-full h-0"></div>
                        <div className="border-b border-gray-100 w-full h-0"></div>
                        <div className="border-b border-gray-100 w-full h-0"></div>
                        <div className="border-b border-gray-100 w-full h-0"></div>
                      </div>

                      {/* Area Chart Fill Overlay */}
                      <svg
                        className="absolute inset-0 w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <linearGradient
                            id="chartGrad"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor="#FF6B00"
                              stopOpacity="0.45"
                            />
                            <stop
                              offset="100%"
                              stopColor="#FF6B00"
                              stopOpacity="0"
                            />
                          </linearGradient>
                        </defs>
                        {/* Area Polygon */}
                        <polygon
                          points={`
                            0,100
                            ${monthlyTrend.map((d, i) => `${(i / (monthlyTrend.length - 1)) * 100},${100 - (d.count / maxTrendValue) * 85}`).join(" ")}
                            100,100
                          `}
                          fill="url(#chartGrad)"
                        />
                        {/* Line Stroke */}
                        <polyline
                          points={monthlyTrend
                            .map(
                              (d, i) =>
                                `${(i / (monthlyTrend.length - 1)) * 100},${100 - (d.count / maxTrendValue) * 85}`,
                            )
                            .join(" ")}
                          fill="none"
                          stroke="#FF6B00"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Interactive Point indicators */}
                      <div className="absolute inset-0 flex justify-between">
                        {monthlyTrend.map((d, i) => {
                          const topPercent =
                            100 - (d.count / maxTrendValue) * 85;
                          return (
                            <div
                              key={d.month}
                              className="flex flex-col items-center justify-end group/item relative h-full cursor-pointer"
                              style={{ width: `${100 / monthlyTrend.length}%` }}
                            >
                              <div
                                className="absolute bg-[#111111] text-white text-[9px] font-black px-2 py-1 rounded-md opacity-0 group-hover/item:opacity-100 bottom-full mb-1 transition-opacity z-25 pointer-events-none whitespace-nowrap shadow-md"
                                style={{ bottom: `${100 - topPercent + 4}%` }}
                              >
                                {d.count} rés.
                              </div>
                              <div
                                className="absolute w-3 h-3 rounded-full bg-white border-2 border-[#FF6B00] opacity-0 group-hover/item:opacity-100 shadow-md transition-opacity"
                                style={{
                                  bottom: `calc(${100 - topPercent}% - 6px)`,
                                }}
                              ></div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* X Axis Labels */}
                    <div className="flex justify-between border-t border-gray-100 pt-2 text-[10px] text-gray-400 font-extrabold">
                      {monthlyTrend.map((d) => (
                        <span key={d.month} className="text-center flex-1">
                          {d.month}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Chart 2: Pet Type distribution Donut */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="pb-2 border-b border-gray-50">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Répartition par Animaux
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Pourcentage d'animaux confiés sur Amuch
                    </p>
                  </div>

                  <div className="flex justify-center items-center py-4 relative">
                    {/* Ring Chart representation */}
                    <div className="w-36 h-36 rounded-full border-[14px] border-emerald-500 relative flex items-center justify-center">
                      <div
                        className="absolute inset-[-14px] rounded-full border-[14px] border-[#FF6B00] clip-donut-cats"
                        style={{
                          clipPath:
                            "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)",
                        }}
                      ></div>
                      <div className="text-center">
                        <span className="text-xs text-gray-400 font-bold block uppercase tracking-wide">
                          Majorité
                        </span>
                        <span className="text-xl font-black text-gray-800">
                          {petDistribution.cats}% Chats
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Distribution badges */}
                  <div className="space-y-2 text-xs font-bold pt-2">
                    <div className="flex justify-between items-center text-[#FF6B00]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
                        <span>🐈 Chats (Cats)</span>
                      </div>
                      <span>{petDistribution.cats}%</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-600">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <span>🐶 Chiens (Dogs)</span>
                      </div>
                      <span>{petDistribution.dogs}%</span>
                    </div>
                    <div className="flex justify-between items-center text-blue-500">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                        <span>🐰 Lapins, Oiseaux, etc.</span>
                      </div>
                      <span>{petDistribution.others}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: City performance & Recent bookings logs */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cities Performance Indicator Bars */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="pb-2 border-b border-gray-50">
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Performance par Ville
                    </h3>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Revenus et réservations générés par zone au Maroc
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {cityBreakdown.map((city) => {
                      const maxRevenue = Math.max(
                        ...cityBreakdown.map((c) => c.revenue),
                        1000,
                      );
                      const percent = Math.round(
                        (city.revenue / maxRevenue) * 100,
                      );
                      return (
                        <div key={city.name} className="space-y-1.5">
                          <div className="flex justify-between items-baseline text-xs font-extrabold">
                            <span className="text-gray-700 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                              {city.name}
                            </span>
                            <span className="text-gray-900">
                              {city.revenue} MAD
                            </span>
                          </div>
                          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-[#FF6B00] h-full rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-[9px] text-gray-400 font-semibold">
                            <span>{city.bookingsCount} réservations</span>
                            <span>{percent}% du max</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recent Bookings Activity Logs */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                    <div>
                      <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                        Demandes de Gardes Récentes
                      </h3>
                      <p className="text-[10px] text-gray-400 font-medium">
                        Dernières réservations effectuées par les propriétaires
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        alert(
                          "Fonctionnalité d'exportation de logs en cours de développement.",
                        )
                      }
                      className="text-[#FF6B00] text-[10px] font-extrabold hover:underline"
                    >
                      Exporter XLSX
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          <th className="py-2.5">Propriétaire</th>
                          <th className="py-2.5">Sitter</th>
                          <th className="py-2.5">Dates / Ville</th>
                          <th className="py-2.5 text-center">Statut</th>
                          <th className="py-2.5 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-gray-700 divide-y divide-gray-50/50">
                        {bookings.slice(0, 4).map((b) => (
                          <tr
                            key={b.id}
                            className="hover:bg-gray-50/50 transition-colors"
                          >
                            <td className="py-3">
                              <span className="font-extrabold text-gray-900 block">
                                {b.ownerName}
                              </span>
                              <span className="text-[10px] text-gray-400 block">
                                Compagnon: {b.petName} ({b.petType})
                              </span>
                              {b.status === "cancelled" && b.cancelReason && (
                                <span className="text-[10px] text-red-500 font-bold block mt-1 bg-red-50 px-2 py-0.5 rounded border border-red-100 max-w-xs leading-tight">
                                  ⚠️ Motif: {b.cancelReason} ({b.cancelledBy === 'owner' ? 'Propriétaire' : b.cancelledBy === 'sitter' ? 'Sitter' : 'Admin'})
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-gray-900 font-extrabold">
                              {b.sitterName}
                            </td>
                            <td className="py-3">
                              <span className="block">
                                {b.startDate} → {b.endDate}
                              </span>
                              <span className="text-[10px] text-[#FF6B00] block">
                                📍 {b.city}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  b.status === "confirmed"
                                    ? "bg-green-100 text-green-700"
                                    : b.status === "cancelled"
                                      ? "bg-red-100 text-red-700"
                                      : b.status === "completed"
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 text-right font-black text-gray-900">
                              {b.totalPrice} MAD
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS ADMINISTRATION */}
          {activeTab === "users" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header block with search filter */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider">
                      Filtrer & Rechercher
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      Recherchez un utilisateur par nom, email ou filtrez par
                      rôle et statut.
                    </p>
                  </div>

                  {/* Total indicator */}
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                    <span className="font-extrabold">
                      {filteredUsers.length}
                    </span>{" "}
                    correspondants
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Search box */}
                  <div className="relative md:col-span-2">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Search className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher par nom, email, ville..."
                      className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#FF6B00] bg-gray-50/50"
                    />
                  </div>

                  {/* Role filter */}
                  <div>
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as any)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] cursor-pointer bg-gray-50/50 font-bold"
                    >
                      <option value="all">Tous les rôles (All Roles)</option>
                      <option value="owner">Propriétaires (Owners)</option>
                      <option value="sitter">Pet Sitters</option>
                    </select>
                  </div>

                  {/* Status filter */}
                  <div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#FF6B00] cursor-pointer bg-gray-50/50 font-bold"
                    >
                      <option value="all">Tous les statuts</option>
                      <option value="active">Actifs (Active)</option>
                      <option value="blocked">Bloqués (Blocked)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Users list table */}
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                {filteredUsers.length === 0 ? (
                  <div className="p-16 text-center text-gray-400 font-semibold space-y-2">
                    <span className="text-3xl block">🔍</span>
                    <p className="text-xs">
                      Aucun utilisateur ne correspond à vos critères de
                      filtrage.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-wider">
                          <th className="py-4 px-6">Utilisateur (User)</th>
                          <th className="py-4 px-6">Adresse Email</th>
                          <th className="py-4 px-6">Rôle</th>
                          <th className="py-4 px-6">Ville / City</th>
                          <th className="py-4 px-6">Animaux / Pets</th>
                          <th className="py-4 px-6 text-center">Activation</th>
                          <th className="py-4 px-6 text-center">Statut</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-gray-700 divide-y divide-gray-100/60">
                        {filteredUsers.map((user) => (
                          <tr
                            key={user.id}
                            onClick={() => setSelectedUserDetails(user)}
                            className={`cursor-pointer hover:bg-gray-50/60 transition-colors ${
                              user.isBlocked ? "bg-red-50/10" : ""
                            }`}
                          >
                            {/* Full Name & Avatar */}
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-full font-extrabold flex items-center justify-center text-xs shadow-sm ${
                                    user.role === "sitter"
                                      ? "bg-purple-100 text-purple-700"
                                      : "bg-orange-100 text-orange-700"
                                  }`}
                                >
                                  {user.firstName.charAt(0)}
                                  {user.lastName.charAt(0)}
                                </div>
                                <div>
                                  <span className="font-black text-gray-900 block text-xs">
                                    {user.firstName} {user.lastName}
                                  </span>
                                  <span className="text-[9px] text-gray-400 font-bold block uppercase">
                                    UID: {user.id.substring(0, 8)}...
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="py-4 px-6 text-gray-600 font-semibold">
                              {user.email}
                            </td>

                            {/* Role Badge */}
                            <td className="py-4 px-6">
                              <span
                                className={`inline-block px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                  user.role === "sitter"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-orange-100 text-[#FF6B00] border border-orange-200"
                                }`}
                              >
                                {user.role === "sitter"
                                  ? "Pet Sitter"
                                  : "Propriétaire"}
                              </span>
                            </td>

                            {/* City */}
                            <td className="py-4 px-6 font-bold text-gray-900">
                              📍 {user.city}
                            </td>

                            {/* Pets Count / Pets info */}
                            <td className="py-4 px-6">
                              {user.role === "owner" ? (
                                <span className="font-bold text-gray-800">
                                  {user.pets && user.pets.length > 0
                                    ? `${user.pets.length} animal/aux (${user.pets.map((p) => p.name).join(", ")})`
                                    : "Aucun animal"}
                                </span>
                              ) : (
                                <span className="text-gray-400 font-medium">
                                  Non applicable
                                </span>
                              )}
                            </td>

                            {/* Activation Status */}
                            <td className="py-4 px-6 text-center">
                              {user.role === 'sitter' ? (
                                user.isActive ? (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-black uppercase cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateUserActivationStatus(user.id, false);
                                    }}
                                  >
                                    <Check className="w-3 h-3" />
                                    Activé (Active)
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700 text-[10px] font-black uppercase cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      updateUserActivationStatus(user.id, true);
                                    }}
                                  >
                                    <X className="w-3 h-3" />
                                    En Attente (Pending)
                                  </span>
                                )
                              ) : (
                                <span className="text-gray-400 font-medium">N/A</span>
                              )}
                            </td>

                            {/* Blocking Actions */}
                            <td
                              className="py-4 px-6 text-right"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {user.isBlocked ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      isOpen: true,
                                      userId: user.id,
                                      userName: `${user.firstName} ${user.lastName}`,
                                      action: "unblock",
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Débloquer
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setConfirmModal({
                                      isOpen: true,
                                      userId: user.id,
                                      userName: `${user.firstName} ${user.lastName}`,
                                      action: "block",
                                    })
                                  }
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer shadow-xs"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  Bloquer l'accès
                                </button>
                              )}
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

          {/* TAB 3: MAINTENANCE */}
          {activeTab === "maintenance" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="max-w-xl space-y-8">
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mb-4">
                      <ShieldAlert className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                      Maintenance du Système
                    </h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      Outils avancés pour la gestion de l'intégrité des données et le nettoyage de la plateforme. 
                      Utilisez ces fonctions avec prudence.
                    </p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4 text-red-700">
                      <div className="p-3 bg-red-100 rounded-xl">
                        <AlertTriangle className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-red-700">Réinitialisation d'Usine</h4>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Action Irréversible</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-red-600 font-bold leading-relaxed">
                      Cette action supprimera toutes les réservations, les avis, les messages, les profils sitters 
                      et tous les profils utilisateurs (sauf aeazzaoui@gmail.com). 
                      Les comptes Auth Firebase ne sont pas affectés mais n'auront plus de profil lié.
                    </p>

                    <div className="pt-4">
                      <button
                        onClick={handleResetDatabase}
                        disabled={isResetting}
                        className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer group"
                      >
                        {isResetting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <ShieldAlert className="w-5 h-5 group-hover:animate-shake" />
                        )}
                        <span>
                          {isResetting ? "NETTOYAGE EN COURS..." : "RÉINITIALISER TOUTE LA PLATEFORME"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BLOG MANAGEMENT */}
          {activeTab === "blog" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-[#111111] tracking-tight">
                      {language === "FR" ? "Gestion du Blog" : "Blog Management"}
                    </h2>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                      {language === "FR"
                        ? "Rédigez, modifiez ou supprimez les articles de blog publiés sur la plateforme."
                        : "Write, modify, or delete blog articles published on the platform."}
                    </p>
                  </div>
                  {!isAddingPost && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPost(null);
                        setBlogTitle("");
                        setBlogContent("");
                        setBlogAuthor("Equipe AMUCH");
                        setBlogImageUrl("");
                        setIsAddingPost(true);
                      }}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-black uppercase rounded-2xl transition-all shadow-md shadow-orange-100 cursor-pointer self-start sm:self-center"
                    >
                      <Plus className="w-4 h-4" />
                      {language === "FR" ? "Rédiger un article" : "Write an Article"}
                    </button>
                  )}
                </div>

                {isAddingPost && (
                  <form onSubmit={handleSaveBlogPost} className="bg-gray-50/50 border border-gray-100 rounded-3xl p-6 mb-8 space-y-6">
                    <h3 className="text-lg font-black text-gray-900">
                      {editingPost
                        ? (language === "FR" ? "Modifier l'article" : "Edit Article")
                        : (language === "FR" ? "Nouvel article de blog" : "New Blog Article")}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                          {language === "FR" ? "Titre de l'article" : "Article Title"} *
                        </label>
                        <input
                          type="text"
                          required
                          value={blogTitle}
                          onChange={(e) => setBlogTitle(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm font-semibold transition-colors"
                          placeholder={language === "FR" ? "Ex: Comment éduquer son chiot..." : "Ex: How to train your puppy..."}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                          {language === "FR" ? "Auteur" : "Author"} *
                        </label>
                        <input
                          type="text"
                          required
                          value={blogAuthor}
                          onChange={(e) => setBlogAuthor(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm font-semibold transition-colors"
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                          {language === "FR" ? "URL de l'image (optionnel)" : "Image URL (optional)"}
                        </label>
                        <input
                          type="url"
                          value={blogImageUrl}
                          onChange={(e) => setBlogImageUrl(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm font-semibold transition-colors"
                          placeholder="https://images.unsplash.com/photo-..."
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider block">
                          {language === "FR" ? "Contenu de l'article" : "Article Content"} *
                        </label>
                        <textarea
                          required
                          rows={8}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#FF6B00] text-sm font-semibold transition-colors resize-y leading-relaxed"
                          placeholder={language === "FR" ? "Rédigez votre article ici..." : "Write your article here..."}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAddingPost(false);
                          setEditingPost(null);
                          setBlogTitle("");
                          setBlogContent("");
                          setBlogAuthor("Equipe AMUCH");
                          setBlogImageUrl("");
                        }}
                        className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {language === "FR" ? "Annuler" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmittingBlog}
                        className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md disabled:opacity-50"
                      >
                        {isSubmittingBlog
                          ? (language === "FR" ? "Enregistrement..." : "Saving...")
                          : (language === "FR" ? "Enregistrer" : "Save")}
                      </button>
                    </div>
                  </form>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">
                    {language === "FR" ? `Articles Publiés (${blogPosts.length})` : `Published Articles (${blogPosts.length})`}
                  </h3>

                  {blogPosts.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-gray-200 rounded-3xl">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400 font-bold italic">
                        {language === "FR" ? "Aucun article publié pour le moment." : "No articles published yet."}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {blogPosts.map((post) => (
                        <div key={post.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col h-full group">
                          {post.imageUrl ? (
                            <div className="h-44 overflow-hidden relative">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ) : (
                            <div className="h-44 bg-orange-50/50 flex items-center justify-center text-orange-500 relative">
                              <BookOpen className="w-12 h-12 stroke-1" />
                            </div>
                          )}

                          <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                                <span className="uppercase tracking-wider">✍️ {post.author}</span>
                                <span>📅 {post.date}</span>
                              </div>
                              <h4 className="text-base font-black text-gray-900 tracking-tight line-clamp-2">
                                {post.title}
                              </h4>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3">
                                {post.content}
                              </p>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-gray-50">
                              <button
                                type="button"
                                onClick={() => handleEditBlogPostClick(post)}
                                className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors cursor-pointer border border-gray-100"
                                title={language === "FR" ? "Modifier" : "Edit"}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteBlogPostClick(post.id)}
                                className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors cursor-pointer border border-red-100"
                                title={language === "FR" ? "Supprimer" : "Delete"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRMATION BLOCK/UNBLOCK MODAL */}
      {confirmModal && confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-md overflow-hidden">
            {/* Header */}
            <div
              className={`p-5 text-white font-bold flex items-center gap-2 ${
                confirmModal.action === "block" ? "bg-red-600" : "bg-green-600"
              }`}
            >
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <h3>
                {confirmModal.action === "block"
                  ? "Bloquer l'utilisateur"
                  : "Débloquer l'utilisateur"}
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-3 text-sm">
              <p className="text-gray-600 font-semibold leading-relaxed">
                Êtes-vous sûr de vouloir{" "}
                {confirmModal.action === "block" ? "bloquer" : "débloquer"}{" "}
                l'accès de l'utilisateur{" "}
                <strong className="text-gray-900">
                  {confirmModal.userName}
                </strong>{" "}
                à la plateforme AMUCH ?
              </p>
              {confirmModal.action === "block" && (
                <p className="text-xs text-red-600 bg-red-50 p-3 rounded-xl font-bold flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Cet utilisateur sera immédiatement empêché de se connecter à
                    son espace personnel.
                  </span>
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex gap-3 justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setConfirmModal(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg text-xs transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 text-white font-black rounded-lg text-xs transition-all cursor-pointer shadow-sm ${
                  confirmModal.action === "block"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {confirmModal.action === "block"
                  ? "Oui, bloquer"
                  : "Oui, débloquer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* USER DETAILS MODAL */}
      {selectedUserDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-orange-500 to-[#FF6B00] text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-full bg-white/20 font-black flex items-center justify-center text-lg uppercase overflow-hidden cursor-pointer hover:opacity-90"
                  onClick={() => {
                    const photo = (selectedUserDetails.role === "sitter" ? getSitterInfo(selectedUserDetails.id)?.photoUrl : selectedUserDetails.photoUrl);
                    if (photo) setViewingImage(photo);
                  }}
                >
                  {(selectedUserDetails.role === "sitter" ? getSitterInfo(selectedUserDetails.id)?.photoUrl : selectedUserDetails.photoUrl) ? (
                    <img 
                      src={(selectedUserDetails.role === "sitter" ? getSitterInfo(selectedUserDetails.id)?.photoUrl : selectedUserDetails.photoUrl) || ""} 
                      alt={selectedUserDetails.firstName} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <img 
                      src={`https://ui-avatars.com/api/?name=${selectedUserDetails.firstName}+${selectedUserDetails.lastName}&background=random`} 
                      alt={selectedUserDetails.firstName} 
                      className="w-full h-full object-cover" 
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {selectedUserDetails.firstName}{" "}
                    {selectedUserDetails.lastName}
                  </h3>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-white/20">
                    {selectedUserDetails.role === "sitter"
                      ? "Pet Sitter"
                      : "Propriétaire"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserDetails(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Core Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-1">
                    Adresse Email
                  </span>
                  <span className="text-xs font-bold text-gray-800 break-all">
                    {selectedUserDetails.email}
                  </span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-1">
                    Numéro de Téléphone
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    {getSitterInfo(selectedUserDetails.id)?.phone ||
                      "Non renseigné"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-1">
                    Ville / City
                  </span>
                  <span className="text-xs font-bold text-gray-800">
                    📍 {selectedUserDetails.city || "Non spécifiée"}
                  </span>
                </div>
                <div className="bg-gray-50 p-3.5 rounded-2xl">
                  <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase block mb-1">
                    ID Utilisateur (UID)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-gray-500 break-all">
                    {selectedUserDetails.id}
                  </span>
                </div>
              </div>

              {/* Sitter details if applicable */}
              {selectedUserDetails.role === "sitter" &&
                getSitterInfo(selectedUserDetails.id) && (
                  <div className="border-t border-gray-100 pt-4 space-y-3">
                    <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                      Détails Professionnels
                    </h4>
                    <div className="bg-purple-50/50 p-4 rounded-2xl space-y-2">
                      <p className="text-xs text-gray-700 italic">
                        "{getSitterInfo(selectedUserDetails.id)?.bio}"
                      </p>
                      <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-gray-600 pt-2 border-t border-purple-100">
                        <div>
                          <span className="text-gray-400 block uppercase">
                            Prix / Nuit
                          </span>
                          <span className="text-purple-700 font-extrabold">
                            {
                              getSitterInfo(selectedUserDetails.id)
                                ?.pricePerNight
                            }{" "}
                            MAD
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">
                            Capacité
                          </span>
                          <span className="text-purple-700 font-extrabold">
                            {getSitterInfo(selectedUserDetails.id)?.capacityMax}{" "}
                            animaux max
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-400 block uppercase">
                            Évaluation
                          </span>
                          <span className="text-purple-700 font-extrabold">
                            ⭐ {getSitterInfo(selectedUserDetails.id)?.rating} (
                            {getSitterInfo(selectedUserDetails.id)?.reviewCount}{" "}
                            avis)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Pets Section if Owner */}
              {selectedUserDetails.role === "owner" && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">
                    Animaux Associés ({selectedUserDetails.pets?.length || 0})
                  </h4>
                  {selectedUserDetails.pets &&
                  selectedUserDetails.pets.length > 0 ? (
                    <div className="space-y-3">
                      {selectedUserDetails.pets.map((pet) => (
                        <div
                          key={pet.id}
                          className="flex gap-4 p-3 bg-orange-50/50 border border-orange-100 rounded-2xl"
                        >
                          <div 
                            className={`w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0 overflow-hidden font-bold ${pet.photoUrl ? "cursor-pointer hover:opacity-80" : ""}`}
                            onClick={() => pet.photoUrl && setViewingImage(pet.photoUrl)}
                          >
                            {pet.photoUrl ? (
                              <img
                                src={pet.photoUrl}
                                alt={pet.name}
                                className="w-full h-full object-cover"
                              />
                            ) : pet.type === "chien" ? (
                              "🐶"
                            ) : pet.type === "chat" ? (
                              "🐈"
                            ) : (
                              "🐰"
                            )}
                          </div>
                          <div className="space-y-1">
                            <span className="text-xs font-black text-gray-800">
                              {pet.name}{" "}
                              <span className="text-[10px] font-bold text-orange-500 uppercase">
                                ({pet.type})
                              </span>
                            </span>
                            <div className="text-[10px] font-semibold text-gray-500 flex gap-3">
                              <span>
                                Race:{" "}
                                <strong className="text-gray-700">
                                  {pet.breed || "Non spécifiée"}
                                </strong>
                              </span>
                              <span>
                                Âge:{" "}
                                <strong className="text-gray-700">
                                  {pet.age || "Non spécifié"}
                                </strong>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 font-bold italic">
                      Aucun animal de compagnie enregistré pour ce propriétaire.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedUserDetails(null)}
                className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-black rounded-xl text-xs transition-colors cursor-pointer uppercase tracking-wider"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Image Viewing Modal Overlay */}
      {viewingImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewingImage(null)}
        >
          <img
            src={viewingImage}
            alt="Enlarged view"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
