import fs from 'fs';
let code = fs.readFileSync('src/pages/Administration.tsx', 'utf8');

const tabContentOld = `
          {/* TAB 6: ANNONCES MANAGEMENT */}
          {activeTab === "annonces" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-[#111111] tracking-tight">
                    {language === "FR" ? "Gestion des Annonces" : "Announcements Management"}
                  </h2>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed mt-1">
                    {language === "FR"
                      ? "Validez ou supprimez les annonces proposées par les utilisateurs."
                      : "Approve or delete announcements submitted by users."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {announcements.length === 0 ? (
                    <div className="col-span-full py-12 text-center text-gray-400">
                      <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                      <p>{language === "FR" ? "Aucune annonce." : "No announcements."}</p>
                    </div>
                  ) : (
                    announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                      >
                        <div className="p-5 flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <span className={\`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full \${
                              ann.type === 'adoption' ? 'bg-green-50 text-green-700' :
                              ann.type === 'lost' ? 'bg-red-50 text-red-700' :
                              ann.type === 'found' ? 'bg-blue-50 text-blue-700' :
                              'bg-purple-50 text-purple-700'
                            }\`}>
                              {ann.type}
                            </span>
                            <span className={\`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full \${
                              ann.status === 'approved' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-orange-50 text-orange-600'
                            }\`}>
                              {ann.status}
                            </span>
                          </div>
                          <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {ann.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                            {ann.description}
                          </p>
                          <div className="text-xs text-gray-500 mb-1">
                            <span className="font-semibold">{language === "FR" ? "Ville:" : "City:"}</span> {ann.city}
                          </div>
                          <div className="text-xs text-gray-500">
                            <span className="font-semibold">{language === "FR" ? "Par:" : "By:"}</span> {ann.userName || 'Unknown'}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 flex justify-end gap-2 border-t border-gray-100">
                          {ann.status === 'pending' && (
                            <button
                              onClick={async () => {
                                try {
                                  await updateAnnouncementInFirestore({ ...ann, status: 'approved' });
                                } catch (e) { console.error(e); }
                              }}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                            >
                              {language === "FR" ? "Accepter" : "Approve"}
                            </button>
                          )}
                          <button
                            onClick={async () => {
                              if(window.confirm('Sur ?')) {
                                try {
                                  await deleteAnnouncementFromFirestore(ann.id);
                                } catch (e) { console.error(e); }
                              }
                            }}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            {language === "FR" ? "Supprimer" : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
`;

const tabContentNew = `
          {/* TAB 6: ANNONCES MANAGEMENT */}
          {activeTab === "annonces" && (
            <div className="space-y-6 animate-fade-in">
              {/* Header */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      {language === "FR" ? "Gestion des Annonces" : "Announcements Management"}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-semibold">
                      {language === "FR"
                        ? "Validez ou supprimez les annonces proposées par les utilisateurs."
                        : "Approve or delete announcements submitted by users."}
                    </p>
                  </div>

                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                    <span className="font-bold">{announcements.length}</span>{" "}
                    {language === "FR" ? "annonces" : "announcements"}
                  </span>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
                {announcements.length === 0 ? (
                  <div className="p-16 text-center text-gray-400 font-semibold space-y-2">
                    <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-xs">
                      {language === "FR" ? "Aucune annonce." : "No announcements."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          <th className="py-4 px-6">{language === "FR" ? "Titre" : "Title"}</th>
                          <th className="py-4 px-6">{language === "FR" ? "Type" : "Type"}</th>
                          <th className="py-4 px-6">{language === "FR" ? "Utilisateur" : "User"}</th>
                          <th className="py-4 px-6">{language === "FR" ? "Ville" : "City"}</th>
                          <th className="py-4 px-6 text-center">{language === "FR" ? "Statut" : "Status"}</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="font-semibold text-gray-700 divide-y divide-gray-100/60">
                        {announcements.map((ann) => (
                          <tr
                            key={ann.id}
                            onClick={() => setSelectedAnnounceDetails(ann)}
                            className="cursor-pointer hover:bg-gray-50/60 transition-colors"
                          >
                            <td className="py-4 px-6 font-bold text-gray-900">{ann.title}</td>
                            <td className="py-4 px-6">
                              <span className={\`px-2 py-1 text-[9px] font-bold uppercase rounded-full \${
                                ann.type === 'adoption' ? 'bg-green-50 text-green-700' :
                                ann.type === 'lost' ? 'bg-red-50 text-red-700' :
                                ann.type === 'found' ? 'bg-blue-50 text-blue-700' :
                                'bg-purple-50 text-purple-700'
                              }\`}>
                                {ann.type}
                              </span>
                            </td>
                            <td className="py-4 px-6">{ann.userName || 'Unknown'}</td>
                            <td className="py-4 px-6">{ann.city}</td>
                            <td className="py-4 px-6 text-center">
                              <span className={\`inline-flex items-center justify-center px-2 py-1 text-[9px] font-bold uppercase tracking-wider rounded-md \${
                                ann.status === "approved"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-orange-50 text-orange-700"
                              }\`}>
                                {ann.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={(e) => { e.stopPropagation(); setSelectedAnnounceDetails(ann); }}
                                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                              >
                                {language === "FR" ? "Détails" : "Details"}
                              </button>
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
`;
code = code.replace(tabContentOld, tabContentNew);

const stateDec = `  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "maintenance" | "blog" | "annuaire" | "annonces" | "settings">(
    "dashboard",
  );`;
const stateDecNew = `  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "maintenance" | "blog" | "annuaire" | "annonces" | "settings">(
    "dashboard",
  );
  const [selectedAnnounceDetails, setSelectedAnnounceDetails] = useState<Announcement | null>(null);`;
code = code.replace(stateDec, stateDecNew);

const modalCode = `
      {/* -------------------- SELECTED ANNOUNCE MODAL -------------------- */}
      {selectedAnnounceDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedAnnounceDetails(null)}
          ></div>
          <div className="relative bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10 rounded-t-3xl">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">
                  {selectedAnnounceDetails.title}
                </h3>
                <span className="text-xs text-gray-500 font-medium">
                  {language === "FR" ? "Posté le" : "Posted on"} {new Date(selectedAnnounceDetails.dateAdded).toLocaleDateString()}
                </span>
              </div>
              <button
                onClick={() => setSelectedAnnounceDetails(null)}
                className="w-10 h-10 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === "FR" ? "Utilisateur" : "User"}
                  </span>
                  <span className="font-bold text-sm text-gray-800">
                    {selectedAnnounceDetails.userName || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === "FR" ? "Ville" : "City"}
                  </span>
                  <span className="font-bold text-sm text-gray-800">
                    {selectedAnnounceDetails.city}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === "FR" ? "Téléphone" : "Phone"}
                  </span>
                  <span className="font-bold text-sm text-gray-800">
                    {selectedAnnounceDetails.contactPhone || "-"}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    {language === "FR" ? "Type" : "Type"}
                  </span>
                  <span className="font-bold text-sm text-gray-800">
                    {selectedAnnounceDetails.type}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                  {language === "FR" ? "Description" : "Description"}
                </span>
                <p className="text-sm text-gray-700 leading-relaxed bg-gray-50/50 p-6 rounded-2xl">
                  {selectedAnnounceDetails.description}
                </p>
              </div>

              {/* Status & Actions */}
              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                    {language === "FR" ? "Statut actuel" : "Current Status"}
                  </span>
                  <span className={\`inline-flex items-center justify-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg \${
                    selectedAnnounceDetails.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : "bg-orange-50 text-orange-700"
                  }\`}>
                    {selectedAnnounceDetails.status}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {selectedAnnounceDetails.status === 'pending' && (
                    <button
                      onClick={async () => {
                        try {
                          await updateAnnouncementInFirestore({ ...selectedAnnounceDetails, status: 'approved' });
                          setSelectedAnnounceDetails(null);
                        } catch (e) { console.error(e); }
                      }}
                      className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#E05E00] text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 cursor-pointer"
                    >
                      {language === "FR" ? "Approuver" : "Approve"}
                    </button>
                  )}
                  {selectedAnnounceDetails.status === 'approved' && (
                    <button
                      onClick={async () => {
                        try {
                          await updateAnnouncementInFirestore({ ...selectedAnnounceDetails, status: 'pending' });
                          setSelectedAnnounceDetails(null);
                        } catch (e) { console.error(e); }
                      }}
                      className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      {language === "FR" ? "Révocquer" : "Revoke"}
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if(window.confirm('Etes-vous sur ?')) {
                        try {
                          await deleteAnnouncementFromFirestore(selectedAnnounceDetails.id);
                          setSelectedAnnounceDetails(null);
                        } catch (e) { console.error(e); }
                      }
                    }}
                    className="px-5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    {language === "FR" ? "Supprimer" : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
`;

code = code.replace(
  '      {/* -------------------- SELECTED USER MODAL -------------------- */}',
  modalCode + '\n      {/* -------------------- SELECTED USER MODAL -------------------- */}'
);

fs.writeFileSync('src/pages/Administration.tsx', code);
