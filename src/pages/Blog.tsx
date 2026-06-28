/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BookOpen, Search, User, Calendar, ArrowLeft, ArrowRight, Clock, Share2 } from 'lucide-react';
import { Language, ActivePage, BlogPost } from '../types';

interface BlogProps {
  language: Language;
  setActivePage: (page: ActivePage) => void;
  blogPosts: BlogPost[];
}

export default function Blog({ language, setActivePage, blogPosts }: BlogProps) {
  const isRtl = language === 'AR';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  // Filter posts based on search query
  const filteredPosts = blogPosts.filter(post => {
    const query = searchQuery.toLowerCase();
    return (
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  });

  // Share functionality (simulated or real clipboard copy)
  const handleShare = (post: BlogPost) => {
    const url = window.location.href;
    navigator.clipboard.writeText(`${url}\n\nCheck out this post: "${post.title}"`);
    alert(
      language === 'FR'
        ? "Lien de l'article copié dans le presse-papiers !"
        : language === 'AR'
        ? "تم نسخ رابط المقال إلى الحافظة!"
        : "Article link copied to clipboard!"
    );
  };

  return (
    <div className="font-sans min-h-screen bg-[#FDFDFD] pb-24" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* 1. HERO HEADER */}
      <section className="bg-gradient-to-b from-orange-50 via-white to-transparent py-16 sm:py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] text-[11px] font-extrabold tracking-widest uppercase">
            📰 {language === 'FR' ? "Le Blog AMUCH" : language === 'AR' ? "مدونة أموش" : "AMUCH Blog"}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight">
            {language === 'FR'
              ? "Conseils, Actualités & Guides Animaux"
              : language === 'AR'
              ? "نصائح، أخبار وإرشادات للحيوانات"
              : "Tips, News & Pet Care Guides"}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 max-w-xl mx-auto font-medium leading-relaxed">
            {language === 'FR'
              ? "Découvrez les articles rédigés par nos experts pour le bien-être de vos chiens, chats et autres compagnons au Maroc."
              : language === 'AR'
              ? "اكتشف المقالات التي كتبها خبراؤنا من أجل رفاهية كلابك وقططك وحيواناتك الأليفة في المغرب."
              : "Discover articles written by our experts for the well-being of your dogs, cats, and other pets in Morocco."}
          </p>

          {!selectedPost && (
            <div className="max-w-md mx-auto pt-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    language === 'FR'
                      ? "Rechercher un article..."
                      : language === 'AR'
                      ? "البحث عن مقال..."
                      : "Search an article..."
                  }
                  className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#FF6B00]/10 transition-all shadow-sm"
                />
                <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4`} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {selectedPost ? (
          /* ARTICLE DETAILED VIEW */
          <article className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm p-6 sm:p-10 space-y-8 animate-in fade-in duration-300">
            <button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#FF6B00] transition-colors cursor-pointer group"
            >
              {isRtl ? <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />}
              {language === 'FR' ? "Retour aux articles" : language === 'AR' ? "العودة إلى المقالات" : "Back to articles"}
            </button>

            {selectedPost.imageUrl && (
              <div className="h-[280px] sm:h-[400px] w-full rounded-2xl overflow-hidden shadow-xs">
                <img
                  src={selectedPost.imageUrl}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 border-b border-gray-50 pb-4">
                <span className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                  <User className="w-3.5 h-3.5" />
                  {selectedPost.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedPost.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {Math.max(1, Math.ceil(selectedPost.content.split(' ').length / 200))} min read
                </span>
                <button
                  onClick={() => handleShare(selectedPost)}
                  className="ml-auto inline-flex items-center gap-1 text-gray-400 hover:text-[#FF6B00] transition-colors cursor-pointer"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-gray-900 leading-tight tracking-tight">
                {selectedPost.title}
              </h1>
            </div>

            <div className="text-sm sm:text-base text-gray-700 font-medium leading-relaxed whitespace-pre-wrap space-y-4">
              {selectedPost.content}
            </div>

            <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-[#FF6B00] font-black uppercase text-sm">
                  {selectedPost.author.charAt(0)}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">{language === 'FR' ? "Rédigé par" : language === 'AR' ? "كتبه" : "Written by"}</p>
                  <p className="text-sm font-bold text-gray-900">{selectedPost.author}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="px-5 py-2.5 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00] rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'FR' ? "Tous les articles" : language === 'AR' ? "جميع المقالات" : "All articles"}
              </button>
            </div>
          </article>
        ) : (
          /* BLOG POSTS LIST */
          <div className="space-y-10">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-3xl max-w-xl mx-auto">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4 stroke-1 animate-bounce" />
                <h3 className="text-lg font-black text-gray-800 mb-1">
                  {language === 'FR' ? "Aucun article trouvé" : language === 'AR' ? "لم يتم العثور على مقالات" : "No articles found"}
                </h3>
                <p className="text-sm text-gray-400 font-medium">
                  {language === 'FR'
                    ? "Essayez d'ajuster votre recherche avec un mot-clé différent."
                    : language === 'AR'
                    ? "يرجى محاولة البحث بكلمة مفتاحية مختلفة."
                    : "Try adjusting your search with a different keyword."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {language === 'FR' ? "Réinitialiser" : language === 'AR' ? "إعادة تعيين" : "Reset"}
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col h-full group"
                  >
                    {post.imageUrl ? (
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-orange-50/50 flex items-center justify-center text-orange-500 relative">
                        <BookOpen className="w-12 h-12 stroke-1" />
                      </div>
                    )}

                    <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-1 font-semibold">✍️ {post.author}</span>
                          <span className="flex items-center gap-1 font-semibold">📅 {post.date}</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-[#111111] leading-tight tracking-tight line-clamp-2 group-hover:text-[#FF6B00] transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed line-clamp-4">
                          {post.content}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="text-[#FF6B00] hover:text-[#E55A00] text-xs font-black uppercase tracking-wider flex items-center gap-1 transition-all group-hover:translate-x-1 cursor-pointer"
                        >
                          {language === 'FR' ? "Lire la suite" : language === 'AR' ? "اقرأ المزيد" : "Read more"} →
                        </button>
                        <button
                          onClick={() => handleShare(post)}
                          className="p-1.5 text-gray-400 hover:text-[#FF6B00] transition-colors rounded-lg hover:bg-gray-50"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
