import fs from 'fs';
let code = fs.readFileSync('src/pages/Annonces.tsx', 'utf8');

// 1. add state
code = code.replace(
  "const [annPhone, setAnnPhone] = useState('');",
  "const [annPhone, setAnnPhone] = useState('');\n  const [annPhotoUrl, setAnnPhotoUrl] = useState('');"
);

// 2. add photo to newAnn
const creationCode = `
    const newAnn: Announcement = {
      id: \`ann_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`,
      userId: currentUser.id,
      userName: currentUser.firstName,
      type: annType,
      title: annTitle,
      description: annDesc,
      city: annCity,
      contactPhone: annPhone,
      petType: annPetType,
      status: 'pending',
      dateAdded: new Date().toISOString()
    };
`;
const creationCodeNew = `
    const newAnn: Announcement = {
      id: \`ann_\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}\`,
      userId: currentUser.id,
      userName: currentUser.firstName,
      type: annType,
      title: annTitle,
      description: annDesc,
      city: annCity,
      contactPhone: annPhone,
      petType: annPetType,
      photoUrl: annPhotoUrl,
      status: 'pending',
      dateAdded: new Date().toISOString()
    };
`;
code = code.replace(creationCode, creationCodeNew);

// 3. Reset photoUrl after submission
code = code.replace(
  "setAnnPhone('');",
  "setAnnPhone('');\n      setAnnPhotoUrl('');"
);

// 4. Add Image input to form
const phoneInputStr = `                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">
                    {language === 'FR' ? "Téléphone de contact" : "Contact Phone"}
                  </label>
                  <input
                    type="text"
                    value={annPhone}
                    onChange={(e) => setAnnPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#FF6B00] outline-none font-medium"
                  />
                </div>`;
                
const photoInputStr = `
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
`;

code = code.replace(phoneInputStr, phoneInputStr + photoInputStr);


fs.writeFileSync('src/pages/Annonces.tsx', code);
