/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sitter, Review } from './types';

export const CITIES = [
  'Casablanca',
  'Rabat',
  'Tanger',
  'Marrakech',
  'Agadir',
  'Fès'
];

export const SITTERS: Sitter[] = [
  {
    id: 'sitter-1',
    firstName: 'Anass',
    lastName: 'El Mansouri',
    city: 'Casablanca',
    verified: true,
    rating: 4.9,
    reviewCount: 28,
    acceptedAnimals: ['chien', 'chat'],
    pricePerNight: 150,
    priceWeekend: 280,
    phone: '+212612345678',
    photoUrl: 'AE', // Initial letters fallback
    capacityMax: 2,
    bio: "Passionné d'animaux depuis mon enfance, j'ai l'habitude de garder des chiens et des chats dans un appartement spacieux et sécurisé au quartier Gauthier. Promenades assurées au parc de la Ligue Arabe !",
    availabilities: [
      '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28',
      '2026-07-01', '2026-07-02', '2026-07-03', '2026-07-04', '2026-07-05'
    ]
  },
  {
    id: 'sitter-2',
    firstName: 'Amina',
    lastName: 'Benjelloun',
    city: 'Rabat',
    verified: true,
    rating: 4.8,
    reviewCount: 19,
    acceptedAnimals: ['chat', 'oiseau', 'lapin'],
    pricePerNight: 120,
    priceWeekend: 220,
    phone: '+212623456789',
    photoUrl: 'AB',
    capacityMax: 3,
    bio: "Douce et attentionnée, je prendrai soin de votre félin ou petit compagnon à l'Agdal. J'ai grandi avec des chats et je m'adapte à toutes leurs habitudes et caprices pour qu'ils ne se sentent jamais seuls.",
    availabilities: [
      '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-29', '2026-06-30',
      '2026-07-05', '2026-07-06', '2026-07-07'
    ]
  },
  {
    id: 'sitter-3',
    firstName: 'Youssef',
    lastName: 'Tazi',
    city: 'Tanger',
    verified: true,
    rating: 5.0,
    reviewCount: 14,
    acceptedAnimals: ['chien', 'lapin'],
    pricePerNight: 180,
    priceWeekend: 320,
    phone: '+212634567890',
    photoUrl: 'YT',
    capacityMax: 1,
    bio: "Situé près de la marina de Tanger, j'ai un grand balcon entièrement sécurisé et propose au moins deux longues balades quotidiennes sur la corniche. Ambiance chaleureuse et jeux garantis !",
    availabilities: [
      '2026-06-24', '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28',
      '2026-07-10', '2026-07-11', '2026-07-12'
    ]
  },
  {
    id: 'sitter-4',
    firstName: 'Ghita',
    lastName: 'Alami',
    city: 'Marrakech',
    verified: true,
    rating: 4.7,
    reviewCount: 22,
    acceptedAnimals: ['chien', 'chat', 'lapin'],
    pricePerNight: 160,
    priceWeekend: 300,
    phone: '+212645678901',
    photoUrl: 'GA',
    capacityMax: 4,
    bio: "Grande amoureuse de la nature et des animaux, j'habite une charmante maison avec jardin entièrement clos et sécurisé à l'Hivernage. Votre toutou ou minou aura toute la place nécessaire pour s'épanouir.",
    availabilities: [
      '2026-06-23', '2026-06-24', '2026-06-25', '2026-06-26', '2026-07-01', '2026-07-02', '2026-07-03'
    ]
  },
  {
    id: 'sitter-5',
    firstName: 'Tarik',
    lastName: 'Amrani',
    city: 'Agadir',
    verified: true,
    rating: 4.9,
    reviewCount: 15,
    acceptedAnimals: ['chien', 'oiseau'],
    pricePerNight: 140,
    priceWeekend: 260,
    phone: '+212656789012',
    photoUrl: 'TA',
    capacityMax: 2,
    bio: "Grand adepte de sport et de plein air, idéal pour promener et stimuler vos chiens à Agadir. Je m'adapte aux besoins des vieux toutous calmes comme aux jeunes sportifs débordant d'énergie.",
    availabilities: [
      '2026-06-25', '2026-06-26', '2026-06-27', '2026-06-28', '2026-06-29', '2026-06-30'
    ]
  },
  {
    id: 'sitter-6',
    firstName: 'Kenza',
    lastName: 'Fassi',
    city: 'Fès',
    verified: false,
    rating: 4.6,
    reviewCount: 8,
    acceptedAnimals: ['chat', 'lapin', 'autre'],
    pricePerNight: 110,
    priceWeekend: 200,
    phone: '+212667890123',
    photoUrl: 'KF',
    capacityMax: 2,
    bio: "Étudiante calme et passionnée, j'accueille vos petits compagnons dans une ambiance paisible et affectueuse. Présence constante assurée pour leur plus grand réconfort.",
    availabilities: [
      '2026-06-23', '2026-06-24', '2026-06-27', '2026-06-28', '2026-06-29', '2026-06-30'
    ]
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    sitterId: 'sitter-1',
    authorName: 'Yasmine',
    authorCity: 'Casablanca',
    rating: 5,
    date: '2026-05-18',
    text: "J'ai enfin pu partir en vacances sans stresser pour mon chat. Anass m'a donné des nouvelles tous les jours avec des photos ! Il a été absolument parfait."
  },
  {
    id: 'rev-2',
    sitterId: 'sitter-1',
    authorName: 'Mohamed',
    authorCity: 'Casablanca',
    rating: 4.8,
    date: '2026-06-10',
    text: "Super expérience avec Anass. Mon chien Rocky l'adore déjà et est revenu en pleine forme après sa garde d'un week-end."
  },
  {
    id: 'rev-3',
    sitterId: 'sitter-2',
    authorName: 'Mehdi',
    authorCity: 'Rabat',
    rating: 5,
    date: '2026-06-02',
    text: "Réservation simple, chat rapide et accueil chaleureux de la part d'Amina. Mon chat Caramel s'est tout de suite senti chez lui."
  },
  {
    id: 'rev-4',
    sitterId: 'sitter-3',
    authorName: 'Sara',
    authorCity: 'Tanger',
    rating: 5,
    date: '2026-05-29',
    text: "Mon chien était tellement bien soigné par Youssef près de la marina. Les promenades sur la corniche lui ont fait le plus grand bien !"
  },
  {
    id: 'rev-5',
    sitterId: 'sitter-4',
    authorName: 'Salma',
    authorCity: 'Marrakech',
    rating: 4,
    date: '2026-04-12',
    text: "Très bon séjour pour mon lapin. Ghita dispose d'un magnifique jardin clos et sécurisé, parfait pour gambader."
  }
];

export interface TeamMember {
  name: string;
  roleKey: string;
  photoUrl: string;
}

export const TEAM: TeamMember[] = [
  {
    name: 'Karim El Otmani',
    roleKey: 'about_team_role2',
    photoUrl: 'KO'
  },
  {
    name: 'Sofia Alami',
    roleKey: 'about_team_role1',
    photoUrl: 'SA'
  },
  {
    name: 'Driss Belkhayat',
    roleKey: 'about_team_role3',
    photoUrl: 'DB'
  }
];

export interface FAQItem {
  question: Record<string, string>;
  answer: Record<string, string>;
  category: 'owner' | 'sitter' | 'security';
}

export const FAQS: FAQItem[] = [
  {
    category: 'owner',
    question: {
      FR: "Comment puis-je m'assurer que le pet sitter est digne de confiance ?",
      AR: "كيف يمكنني التأكد من أن حارس الحيوانات جدير بالثقة؟",
      EN: "How can I make sure that the pet sitter is trustworthy?"
    },
    answer: {
      FR: "Tous nos pet sitters inscrits passent par un processus rigoureux de vérification : validation de leur pièce d'identité (CIN), de leur numéro de téléphone, et entretien de validation. De plus, les avis laissés par d'autres propriétaires sont certifiés après chaque prestation réelle.",
      AR: "يمر جميع حراس الحيوانات المسجلين بعملية تحقق صارمة: التحقق من بطاقة الهوية الوطنية (CIN)، ورقم الهاتف، ومقابلة التحقق. بالإضافة إلى ذلك، فإن التقييمات التي يتركها أصحاب الحيوانات الآخرون تكون معتمدة وحقيقية بعد كل حجز فعلي.",
      EN: "All our registered pet sitters go through a rigorous verification process: validation of their government ID (CIN), phone number check, and validation interview. Additionally, reviews left by other pet owners are certified after each completed booking."
    }
  },
  {
    category: 'owner',
    question: {
      FR: "Que se passe-t-il en cas d'urgence médicale pour mon animal ?",
      AR: "ماذا يحدث في حالة الطوارئ الطبية لحيواني الأليف؟",
      EN: "What happens in case of a medical emergency for my pet?"
    },
    answer: {
      FR: "Lors de votre réservation, vous partagez le contact de votre vétérinaire habituel. En cas de pépin, le pet sitter vous contacte immédiatement et s'engage à emmener l'animal chez votre vétérinaire ou dans la clinique d'urgence la plus proche de sa ville.",
      AR: "أثناء حجزك، تشارك معلومات الاتصال بطبيبك البيطري المعتاد. في حالة حدوث أي طارئ، يتصل بك حارس الحيوان فوراً ويلتزم بأخذ الحيوان إلى طبيبك البيطري أو إلى أقرب عيادة بيطرية للطوارئ في مدينته.",
      EN: "During your booking, you share your regular veterinarian's contact info. In case of any issue, the pet sitter will contact you immediately and agrees to take your pet to your vet or to the nearest emergency veterinary clinic in their city."
    }
  },
  {
    category: 'sitter',
    question: {
      FR: "Combien cela coûte-t-il de s'inscrire en tant que pet sitter ?",
      AR: "كم تبلغ تكلفة التسجيل كحارس حيوانات أليفة؟",
      EN: "How much does it cost to register as a pet sitter?"
    },
    answer: {
      FR: "L'inscription pour les pet sitters est 100% gratuite. Vous fixez vous-même vos propres tarifs par nuit ou par jour. AMUCH ne prélève aucun abonnement mensuel. Seule une commission d'intermédiation transparente de 20% est calculée sur vos réservations confirmées.",
      AR: "التسجيل لحراس الحيوانات الأليفة مجاني بنسبة %100. أنت من يحدد أسعارك الخاصة لليلة أو اليوم. أموش لا تفرض أي اشتراكات شهرية، بينما يتم احتساب عمولة وساطة بنسبة 20% فقط على حجوزاتكم المؤكدة.",
      EN: "Registration for pet sitters is 100% free. You set your own rates per night or per day. AMUCH does not charge any monthly subscription. Only a transparent 20% service commission is calculated on your confirmed bookings."
    }
  },
  {
    category: 'sitter',
    question: {
      FR: "Comment fonctionne la commission AMUCH de 20% ?",
      AR: "كيف تعمل عمولة أموش بنسبة 20%؟",
      EN: "How does the 20% AMUCH commission work?"
    },
    answer: {
      FR: "AMUCH perçoit une commission d'intermédiation de 20% sur le montant brut des réservations complétées. Ces frais sont réinvestis pour assurer la maintenance technique du service, financer l'assistance client locale 24/7 au Maroc, et mener des campagnes marketing pour attirer continuellement de nouveaux propriétaires d'animaux de compagnie sur vos profils.",
      AR: "تقتطع منصة أموش عمولة قدرها 20% من إجمالي مبالغ الحجوزات المكتملة. تساهم هذه العمولة في تمويل تشغيل وتطوير المنصة في المغرب، ودعم العملاء على مدار الساعة، وإطلاق حملات تسويقية لربطكم بالمزيد من مربي وملاك الحيوانات.",
      EN: "AMUCH charges a 20% intermediation commission on the gross amount of completed bookings. These fees support technical maintenance, 24/7 local customer support in Morocco, and marketing campaigns to continually attract new pet owners to your profiles."
    }
  },
  {
    category: 'sitter',
    question: {
      FR: "Puis-je refuser une demande de garde ?",
      AR: "هل يمكنني رفض طلب الرعاية أو الحراسة؟",
      EN: "Can I decline a pet sitting request?"
    },
    answer: {
      FR: "Absolument. Vous êtes totalement libre d'accepter ou de refuser les demandes de garde en fonction de vos disponibilités, de vos affinités ou des spécificités de l'animal.",
      AR: "بالتأكيد. أنت حر تمامًا في قبول أو رفض طلبات الرعاية والحراسة بناءً على توفرك، أو تفضيلاتك، أو الخصائص الفريدة لكل حيوان أليف.",
      EN: "Absolutely. You are completely free to accept or decline booking requests based on your availability, affinities, or specific pet needs."
    }
  },
  {
    category: 'security',
    question: {
      FR: "Comment fonctionne le système de messagerie ?",
      AR: "كيف يعمل نظام المراسلة والدردشة؟",
      EN: "How does the messaging system work?"
    },
    answer: {
      FR: "AMUCH intègre une messagerie sécurisée interne. Elle vous permet d'échanger des messages, de poser toutes vos questions et de recevoir régulièrement des nouvelles et des photos de votre compagnon durant son séjour, sans avoir à dévoiler vos données personnelles dès le départ.",
      AR: "يحتوي أموش على نظام دردشة آمن مدمج. يتيح لكم تبادل الرسائل، طرح الاستفسارات، وتلقي أخبار وصور حيوانكم الأليف بانتظام خلال فترة إقامته، دون الحاجة إلى الكشف عن معلوماتكم الشخصية في البداية.",
      EN: "AMUCH includes a secure built-in chat. It allows you to exchange messages, ask questions, and receive regular updates and photos of your pet during their stay, without having to share your personal contact details upfront."
    }
  },
  {
    category: 'security',
    question: {
      FR: "Mes données personnelles sont-elles protégées au Maroc ?",
      AR: "هل بياناتي الشخصية محمية ومؤمنة في المغرب؟",
      EN: "Is my personal data protected in Morocco?"
    },
    answer: {
      FR: "Oui, la protection de votre vie privée est une priorité absolue. Notre plateforme est développée conformément aux directives de la CNDP (Loi marocaine n° 09-08 relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel). Vos pièces d'identité et numéros de téléphone restent cryptés et confidentiels.",
      AR: "نعم، حماية خصوصيتكم هي أولويتنا القصوى. تم تطوير منصتنا وفقاً لتوجيهات اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (القانون المغربي رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي). تظل وثائق الهوية وأرقام الهواتف مشفرة وسرية تماماً.",
      EN: "Yes, protecting your privacy is an absolute priority. Our platform is developed in compliance with the CNDP guidelines (Moroccan Law No. 09-08 on the protection of individuals with regard to the processing of personal data). Your identity documents and phone numbers remain encrypted and confidential."
    }
  }
];
