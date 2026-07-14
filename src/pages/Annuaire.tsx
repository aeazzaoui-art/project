import React, { useState } from 'react';
import { Language, DirectoryEntry } from '../types';
import { Store, MapPin, Search, Phone, Stethoscope } from 'lucide-react';

interface AnnuaireProps {
  language: Language;
  directoryEntries: DirectoryEntry[];
}

export default function Annuaire({ language, directoryEntries }: AnnuaireProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'veterinaire' | 'animalerie'>('all');
  const [cityFilter, setCityFilter] = useState('');

  // Get unique cities
  const cities = Array.from(new Set(directoryEntries.map(e => e.city))).sort();

  const filteredEntries = directoryEntries.filter(entry => {
    const matchesSearch = entry.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          entry.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    const matchesCity = !cityFilter || entry.city === cityFilter;

    return matchesSearch && matchesType && matchesCity;
  });

  return (
    <div className="pt-24 pb-16 bg-[#F7F7F7] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="inline-block px-4 py-1.5 bg-[#FF6B00]/10 text-[#FF6B00] font-bold rounded-full text-xs tracking-wider uppercase mb-6">
            {language === 'FR' ? "Notre Annuaire" : "Our Directory"}
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
            {language === 'FR' ? "Trouvez les meilleurs services" : "Find the best services"} <br />
            <span className="text-[#FF6B00]">{language === 'FR' ? "pour vos animaux" : "for your pets"}</span>
          </h1>
          <p className="text-lg text-gray-600 font-medium leading-relaxed">
            {language === 'FR'
              ? "Découvrez notre sélection d'animaleries et de vétérinaires de confiance près de chez vous."
              : "Discover our selection of trusted pet shops and veterinarians near you."}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-[2rem] p-4 shadow-xl shadow-orange-900/5 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'FR' ? "Rechercher par nom..." : "Search by name..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium transition-all"
              />
            </div>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as 'all' | 'veterinaire' | 'animalerie')}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium appearance-none cursor-pointer transition-all"
            >
              <option value="all">{language === 'FR' ? "Tous les types" : "All types"}</option>
              <option value="veterinaire">{language === 'FR' ? "Vétérinaires" : "Veterinarians"}</option>
              <option value="animalerie">{language === 'FR' ? "Animaleries" : "Pet Shops"}</option>
            </select>

            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="w-full px-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium appearance-none cursor-pointer transition-all"
            >
              <option value="">{language === 'FR' ? "Toutes les villes" : "All cities"}</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredEntries.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] shadow-sm animate-in fade-in">
            <Store className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {language === 'FR' ? "Aucun résultat trouvé" : "No results found"}
            </h3>
            <p className="text-gray-500">
              {language === 'FR' 
                ? "Essayez de modifier vos filtres de recherche." 
                : "Try modifying your search filters."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEntries.map((entry, index) => (
              <div 
                key={entry.id}
                className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 group animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${(index % 6) * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                    entry.type === 'veterinaire' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'bg-orange-50 text-[#FF6B00]'
                  }`}>
                    {entry.type === 'veterinaire' ? <Stethoscope className="w-7 h-7" /> : <Store className="w-7 h-7" />}
                  </div>
                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                    entry.type === 'veterinaire'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-orange-50 text-orange-700'
                  }`}>
                    {entry.type === 'veterinaire' 
                      ? (language === 'FR' ? 'Vétérinaire' : 'Veterinarian') 
                      : (language === 'FR' ? 'Animalerie' : 'Pet Shop')}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight group-hover:text-[#FF6B00] transition-colors">
                  {entry.name}
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-gray-600">
                    <MapPin className="w-5 h-5 shrink-0 text-gray-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">{entry.city}</p>
                      {entry.address && <p className="text-sm">{entry.address}</p>}
                    </div>
                  </div>
                  
                  {entry.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-5 h-5 shrink-0 text-gray-400" />
                      <a href={`tel:${entry.phone}`} className="hover:text-[#FF6B00] font-medium transition-colors">
                        {entry.phone}
                      </a>
                    </div>
                  )}
                </div>

                {entry.description && (
                  <div className="pt-6 border-t border-gray-100">
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {entry.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
