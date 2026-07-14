import fs from 'fs';
let code = fs.readFileSync('src/data.ts', 'utf8');

// The replacement replaced the end of SITTERS instead of FAQS.
// I need to find the `FAQS` array.

// 1. Remove the misplaced new FAQs
const misplaced = `  {
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
  }`;

code = code.replace(misplaced, "");

// Now add it to the end of FAQS. We know FAQS ends at the end of the file.
// The end of the file currently is:
//   }
// ];

// But wait, when I replaced, it became `},\n\n];`. So the end of file might be `},\n\n];`

code = code.trim();
if(code.endsWith("];")) {
  code = code.substring(0, code.lastIndexOf("}"));
  code += `},
${misplaced}
];`;
}

fs.writeFileSync('src/data.ts', code);
