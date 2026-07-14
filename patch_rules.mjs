import fs from 'fs';
let code = fs.readFileSync('firestore.rules', 'utf8');

// I'll update the isAdmin function to check more robustly
code = code.replace(
  `        request.auth.token.email == "Aeazzaoui@gmail.com" ||`,
  `        request.auth.token.email == "Aeazzaoui@gmail.com" ||
        request.auth.token.email.lower() == "aeazzaoui@gmail.com" ||`
);

fs.writeFileSync('firestore.rules', code);
