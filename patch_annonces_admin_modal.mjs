import fs from 'fs';
let code = fs.readFileSync('src/pages/Administration.tsx', 'utf8');

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
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-8">
              
              {/* Image if available */}
              {selectedAnnounceDetails.photoUrl && (
                <div className="w-full h-64 rounded-2xl overflow-hidden shadow-sm">
                  <img src={selectedAnnounceDetails.photoUrl} alt={selectedAnnounceDetails.title} className="w-full h-full object-cover" />
                </div>
              )}

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
  '{selectedUserDetails && (',
  modalCode + '\n      {selectedUserDetails && ('
);

fs.writeFileSync('src/pages/Administration.tsx', code);
