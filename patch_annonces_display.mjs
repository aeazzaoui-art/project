import fs from 'fs';
let code = fs.readFileSync('src/pages/Annonces.tsx', 'utf8');

const targetStr = `                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {ann.title}
                  </h3>`;
                  
const replacerStr = `                  {ann.photoUrl && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden mb-4">
                      <img src={ann.photoUrl} alt={ann.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                    {ann.title}
                  </h3>`;

code = code.replace(targetStr, replacerStr);

fs.writeFileSync('src/pages/Annonces.tsx', code);
