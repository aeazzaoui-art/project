import fs from 'fs';

// 1. Update src/data.ts
let dataCode = fs.readFileSync('src/data.ts', 'utf8');
dataCode = dataCode.replace(
  "category: 'owner' | 'sitter' | 'security';",
  "category: 'owner' | 'sitter' | 'security' | 'services';"
);

const newFAQs = `
  {
    category: 'services',
    question: {
      FR: "Comment publier une annonce (adoption, perdu, trouvé) ?",
      AR: "كيف يمكنني نشر إعلان (تبني، مفقود، تم العثور عليه)؟",
      EN: "How to post an announcement (adoption, lost, found)?"
    },
    answer: {
      FR: "Pour publier une annonce, vous devez être inscrit en tant que propriétaire d'animal. Une fois connecté, accédez à la rubrique Annonces et soumettez votre demande. Elle sera vérifiée par notre équipe avant d'être publique.",
      AR: "لنشر إعلان، يجب أن تكون مسجلاً كمالك حيوان أليف. بمجرد تسجيل الدخول، انتقل إلى قسم الإعلانات وقدم طلبك. سيتم مراجعته من قبل فريقنا قبل أن يصبح عامًا.",
      EN: "To post an announcement, you must be registered as a pet owner. Once logged in, go to the Announcements section and submit your request. It will be verified by our team before going public."
    }
  },
  {
    category: 'services',
    question: {
      FR: "Comment figurer dans l'Annuaire (Vétérinaires, Animaleries) ?",
      AR: "كيف يمكنني الإدراج في الدليل (الأطباء البيطريون، متاجر الحيوانات الأليفة)؟",
      EN: "How to be listed in the Directory (Vets, Pet Shops)?"
    },
    answer: {
      FR: "L'inscription dans notre annuaire est un service payant réservé aux professionnels. Si vous êtes intéressé, veuillez nous contacter par email ou via notre numéro WhatsApp pour plus d'informations.",
      AR: "التسجيل في دليلنا هو خدمة مدفوعة مخصصة للمحترفين. إذا كنت مهتمًا، يرجى الاتصال بنا عبر البريد الإلكتروني أو عبر رقم الواتساب الخاص بنا لمزيد من المعلومات.",
      EN: "Listing in our directory is a paid service reserved for professionals. If you are interested, please contact us by email or via our WhatsApp number for more information."
    }
  }
`;

dataCode = dataCode.replace(
  "  }\n];",
  "  },\n" + newFAQs + "\n];"
);
fs.writeFileSync('src/data.ts', dataCode);

// 2. Update src/pages/FAQView.tsx
let faqViewCode = fs.readFileSync('src/pages/FAQView.tsx', 'utf8');

const newCategory = `{ id: 'security', label: t.faq_cat_security, icon: CreditCard },
    { id: 'services', label: language === 'FR' ? "Services" : language === 'AR' ? "الخدمات" : "Services", icon: ShieldCheck }`;
faqViewCode = faqViewCode.replace(
  "{ id: 'security', label: t.faq_cat_security, icon: CreditCard }",
  newCategory
);

faqViewCode = faqViewCode.replace(
  "const [activeCategory, setActiveCategory] = useState<'all' | 'owner' | 'sitter' | 'security'>('all');",
  "const [activeCategory, setActiveCategory] = useState<'all' | 'owner' | 'sitter' | 'security' | 'services'>('all');"
);

fs.writeFileSync('src/pages/FAQView.tsx', faqViewCode);
