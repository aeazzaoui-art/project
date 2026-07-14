import React, { useState } from 'react';
import { Language, Announcement, User } from '../types';
import { Megaphone, Plus, Search, MapPin, Phone, Check, Loader2 } from 'lucide-react';
import { addAnnouncementToFirestore } from '../lib/firebaseService';

interface AnnoncesProps {
  language: Language;
  announcements: Announcement[];
  currentUser: User | null;
  onPostClick: () => void;
}

export default function Annonces({ language, announcements, currentUser, onPostClick }: AnnoncesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'adoption' | 'lost' | 'found' | 'wanted'>('all');
  
  const [isPosting, setIsPosting] = useState(false);
  
  // Form State
  const [annType, setAnnType] = useState<'adoption' | 'lost' | 'found' | 'wanted'>('adoption');
  const [annTitle, setAnnTitle] = useState('');
  const [annDesc, setAnnDesc] = useState('');
  const [annCity, setAnnCity] = useState('');
  const [annPhone, setAnnPhone] = useState('');
  const [annPhotoUrl, setAnnPhotoUrl] = useState('');
  const [annPetType, setAnnPetType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publicAnnouncements = announcements.filter(a => a.status === 'approved');
  
  const filteredAnnouncements = publicAnnouncements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ann.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || ann.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    
    if (!annTitle.trim() || !annDesc.trim() || !annCity.trim()) {
      alert(language === 'FR' ? "Titre, description et ville sont requis." : "Title, description and city are required.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newAnn: Announcement = {
        id: `ann-${Date.now()}`,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        type: annType,
        title: annTitle,
        description: annDesc,
        city: annCity,
        contactPhone: annPhone,
        petType: annPetType,
        status: 'pending',
        dateAdded: new Date().toISOString()
      };
      await addAnnouncementToFirestore(newAnn);
      alert(language === 'FR' ? "Annonce envoyée pour validation !" : "Announcement submitted for approval!");
      setIsPosting(false);
      setAnnTitle('');
      setAnnDesc('');
      setAnnCity('');
      setAnnPhone('');
      setAnnPhotoUrl('');
      setAnnPetType('');
    } catch (err) {
      console.error(err);
      alert(language === 'FR' ? "Erreur lors de l'envoi." : "Error submitting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePostClick = () => {
    if (currentUser) {
      setIsPosting(true);
    } else {
      onPostClick(); // Redirect to login/signup
    }
  };

  return (
    <div className="pt-24 pb-16 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-[#FF6B00]/10 text-[#FF6B00] font-bold rounded-full text-xs tracking-wider uppercase mb-4">
              {language === 'FR' ? "Annonces" : "Classifieds"}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
              {language === 'FR' ? "Petites annonces" : "Pet Announcements"}
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              {language === 'FR'
                ? "Adoptions, animaux perdus ou trouvés. La communauté s'entraide."
                : "Adoptions, lost or found pets. The community helps each other."}
            </p>
          </div>
          
          {!isPosting && (
            <button
              onClick={handlePostClick}
              className="inline-flex items-center gap-2 px-6 py-4 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-sm font-bold uppercase rounded-2xl transition-all shadow-xl shadow-orange-100 shrink-0"
            >
              <Plus className="w-5 h-5" />
              {language === 'FR' ? "Poster une annonce" : "Post an Announcement"}
            </button>
          )}
        </div>
        
        {/* Post Form */}
        {isPosting && (
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-orange-900/5 mb-12 animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              {language === 'FR' ? "Nouvelle annonce" : "New Announcement"}
            </h3>
            <form onSubmit={handlePostSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Type d'annonce" : "Type"} *
                  </label>
                  <select
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium"
                  >
                    <option value="adoption">{language === 'FR' ? "Offre d'adoption" : "Adoption Offer"}</option>
                    <option value="wanted">{language === 'FR' ? "Recherche animal" : "Wanted Pet"}</option>
                    <option value="lost">{language === 'FR' ? "Perdu" : "Lost"}</option>
                    <option value="found">{language === 'FR' ? "Trouvé" : "Found"}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Titre" : "Title"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={annTitle}
                    onChange={(e) => setAnnTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Ville" : "City"} *
                  </label>
                  <input
                    type="text"
                    required
                    value={annCity}
                    onChange={(e) => setAnnCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Téléphone de contact" : "Contact Phone"}
                  </label>
                  <input
                    type="text"
                    value={annPhone}
                    onChange={(e) => setAnnPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Photo (optionnel)" : "Photo (optional)"}
                  </label>
                  <label className="border-2 border-dashed border-gray-300 hover:border-[#FF6B00] rounded-2xl p-6 text-center cursor-pointer bg-gray-50 hover:bg-[#FF6B00]/5 transition-all block relative">
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
                              setAnnPhotoUrl(reader.result);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    {annPhotoUrl ? (
                      <div className="relative h-40 w-full overflow-hidden rounded-xl">
                        <img src={annPhotoUrl} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="py-4 space-y-2">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                          <Plus className="w-6 h-6 text-gray-400" />
                        </div>
                        <span className="text-xs text-gray-500 font-semibold block">
                          {language === 'FR' ? "Cliquez pour téléverser une image" : "Click to upload an image"}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Description" : "Description"} *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={annDesc}
                    onChange={(e) => setAnnDesc(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium resize-y"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsPosting(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
                  disabled={isSubmitting}
                >
                  {language === 'FR' ? "Annuler" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#111111] hover:bg-black text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {language === 'FR' ? "Envoyer pour validation" : "Submit for Approval"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        {!isPosting && (
          <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-orange-900/5 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={language === 'FR' ? "Rechercher..." : "Search..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium transition-all"
                />
              </div>
              
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium appearance-none cursor-pointer transition-all"
              >
                <option value="all">{language === 'FR' ? "Toutes les annonces" : "All announcements"}</option>
                <option value="adoption">{language === 'FR' ? "Adoptions" : "Adoptions"}</option>
                <option value="wanted">{language === 'FR' ? "Recherches" : "Wanted"}</option>
                <option value="lost">{language === 'FR' ? "Perdus" : "Lost"}</option>
                <option value="found">{language === 'FR' ? "Trouvés" : "Found"}</option>
              </select>
            </div>
          </div>
        )}

        {/* List */}
        {!isPosting && (
          filteredAnnouncements.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm animate-in fade-in">
              <Megaphone className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {language === 'FR' ? "Aucune annonce" : "No announcements"}
              </h3>
              <p className="text-gray-500">
                {language === 'FR' 
                  ? "Soyez le premier à poster une annonce !" 
                  : "Be the first to post an announcement!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredAnnouncements.map((ann, index) => (
                <div 
                  key={ann.id}
                  className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${(index % 6) * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-6">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                      ann.type === 'adoption' ? 'bg-green-50 text-green-700' :
                      ann.type === 'lost' ? 'bg-red-50 text-red-700' :
                      ann.type === 'found' ? 'bg-blue-50 text-blue-700' :
                      'bg-purple-50 text-purple-700'
                    }`}>
                      {ann.type === 'adoption' ? (language === 'FR' ? 'Adoption' : 'Adoption') :
                       ann.type === 'lost' ? (language === 'FR' ? 'Perdu' : 'Lost') :
                       ann.type === 'found' ? (language === 'FR' ? 'Trouvé' : 'Found') :
                       (language === 'FR' ? 'Recherche' : 'Wanted')}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(ann.dateAdded).toLocaleDateString(language === 'FR' ? 'fr-FR' : 'en-US')}
                    </span>
                  </div>

                  {ann.photoUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
                      <img src={ann.photoUrl} alt={ann.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {ann.title}
                  </h3>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-3 text-gray-600">
                      <MapPin className="w-4 h-4 shrink-0 text-gray-400 mt-0.5" />
                      <span className="text-sm font-medium">{ann.city}</span>
                    </div>
                    
                    {ann.contactPhone && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="w-4 h-4 shrink-0 text-gray-400" />
                        <a href={`tel:${ann.contactPhone}`} className="text-sm hover:text-[#FF6B00] transition-colors">
                          {ann.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-gray-100 mt-auto">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {ann.description}
                    </p>
                    {ann.userName && (
                      <p className="text-xs text-gray-400 mt-4 text-right italic">
                        {language === 'FR' ? "Posté par" : "Posted by"} {ann.userName}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
