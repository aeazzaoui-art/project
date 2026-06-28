/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './types';

export const translations: Record<Language, Record<string, string>> = {
  FR: {
    // Nav
    nav_home: "Accueil",
    nav_find_sitter: "Trouver un Pet Sitter",
    nav_become_sitter: "Devenir Pet Sitter",
    nav_about: "À propos",
    nav_faq: "FAQ",
    nav_blog: "Blog",
    nav_login: "Connexion",
    nav_signup: "S'inscrire",
    nav_dashboard: "Mon Tableau de Bord",
    nav_logout: "Déconnexion",

    // Hero
    hero_title: "Partez l'esprit tranquille. Votre animal est entre de bonnes mains.",
    hero_subtitle: "AMUCH connecte les propriétaires d'animaux avec des pet sitters vérifiés au Maroc.",
    hero_cta_find: "Trouver un Pet Sitter",
    hero_cta_become: "Devenir Pet Sitter",
    hero_badge_profiles: "Profils vérifiés",
    hero_badge_reviews: "Avis certifiés",
    hero_badge_chat: "Chat intégré",

    // How it works
    how_title: "Comment ça marche ?",
    how_step1_title: "1. Créez votre compte",
    how_step1_desc: "Inscrivez-vous gratuitement et ajoutez les profils détaillés de vos animaux.",
    how_step2_title: "2. Recherchez un sitter",
    how_step2_desc: "Filtrez par ville, dates et types d'animaux acceptés pour trouver la perle rare.",
    how_step3_title: "3. Réservez et chattez",
    how_step3_desc: "Discutez en direct via notre messagerie sécurisée, réservez et laissez votre avis !",

    // Why AMUCH
    why_title: "Pourquoi choisir AMUCH ?",
    why_feature1_title: "Sitters vérifiés",
    why_feature1_desc: "Tous nos pet sitters sont rigoureusement vérifiés avec profil détaillé, pièces d'identité et photo.",
    why_feature2_title: "Avis authentiques",
    why_feature2_desc: "Chaque séjour déclenche automatiquement un système d'avis certifié pour garantir la transparence.",
    why_feature3_title: "Chat intégré",
    why_feature3_desc: "Discutez directement et gratuitement avec votre sitter avant et pendant la garde de votre compagnon.",
    why_feature4_title: "Couverture nationale",
    why_feature4_desc: "Disponible dans les plus grandes villes : Casablanca, Rabat, Tanger, Marrakech, Agadir et Fès.",

    // Cities
    cities_title: "Disponible dans vos villes",
    cities_subtitle: "Nos sitters certifiés vous attendent à travers le Maroc :",

    // Testimonials
    testimonials_title: "Ce que disent nos utilisateurs",
    testimonials_subtitle: "Découvrez les retours d'expérience de notre chaleureuse communauté.",
    test1_name: "Yasmine",
    test1_city: "Casablanca",
    test1_text: "J'ai enfin pu partir en vacances sans stresser pour mon chat. La sitter était absolument parfaite !",
    test2_name: "Mehdi",
    test2_city: "Rabat",
    test2_text: "Réservation simple, chat rapide et efficace, je recommande vivement la plateforme AMUCH !",
    test3_name: "Sara",
    test3_city: "Tanger",
    test3_text: "Mon chien était tellement bien soigné. Je reviendrai à chaque voyage, merci beaucoup !",

    // CTA Final
    ctafinal_title: "Prêt à partir l'esprit tranquille ?",
    ctafinal_subtitle: "Inscrivez-vous gratuitement dès aujourd'hui et trouvez le sitter parfait.",
    ctafinal_btn: "Commencer maintenant",

    // Footer
    footer_desc: "AMUCH est la première plateforme marocaine de confiance dédiée à la garde d'animaux de compagnie.",
    footer_col_platform: "Plateforme",
    footer_col_infos: "Infos",
    footer_col_contact: "Contact",
    footer_rights: "Tous droits réservés | Mentions légales | Politique de confidentialité",
    footer_cookie_mention: "Conforme CNDP - Loi marocaine sur la protection des données personnelles.",

    // Search Page
    search_bar_title: "Trouver un Pet Sitter idéal au Maroc",
    search_city: "Votre ville",
    search_start: "Date de début",
    search_end: "Date de fin",
    search_animal: "Type d'animal",
    search_btn: "Rechercher",
    search_filters_title: "Filtrer les résultats",
    search_filter_rating: "Note minimale",
    search_filter_price: "Tarif max par nuit",
    search_filter_animal_types: "Animaux acceptés",
    search_filter_verified: "Disponibilité confirmée uniquement",
    search_no_results: "Aucun pet sitter ne correspond à vos critères de recherche.",
    search_per_night: "MAD / nuit",
    search_btn_profile: "Voir le profil",
    search_btn_book: "Réserver",
    search_verified_badge: "Vérifié ✔",

    // Profile Page
    profile_back: "← Retour à la recherche",
    profile_about: "À propos de",
    profile_pricing: "Grille tarifaire",
    profile_price_night: "Par nuit",
    profile_price_day: "Par jour / Visite",
    profile_price_weekend: "Week-end (2 nuits)",
    profile_availabilities: "Disponibilités",
    profile_reviews_title: "Avis des propriétaires",
    profile_book_now: "Réserver maintenant",
    profile_send_message: "Envoyer un message",
    profile_global_rating: "Note globale",
    profile_available_legend: "Disponible",
    profile_unavailable_legend: "Indisponible",

    // Sign Up Owner
    signup_owner_title: "Inscription Propriétaire",
    signup_owner_step1: "Compte",
    signup_owner_step2: "Vos Animaux",
    signup_owner_step3: "Confirmation",
    signup_owner_fname: "Prénom",
    signup_owner_lname: "Nom",
    signup_owner_email: "Adresse Email",
    signup_owner_pass: "Mot de passe",
    signup_owner_pass_confirm: "Confirmer le mot de passe",
    signup_owner_continue: "Continuer",
    signup_owner_back: "Retour",
    signup_pet_name: "Nom de l'animal",
    signup_pet_type: "Type d'animal",
    signup_pet_breed: "Race",
    signup_pet_age: "Âge",
    signup_pet_photo: "Photo de l'animal (Glissez-déposez ou cliquez)",
    signup_pet_add_another: "+ Ajouter un autre animal",
    signup_owner_terms: "J'accepte les conditions d'utilisation et la politique de confidentialité.",
    signup_owner_submit: "Créer mon compte",
    signup_owner_success: "Votre compte propriétaire a été créé avec succès ! Bienvenue chez AMUCH.",

    // Sign Up Sitter
    signup_sitter_title: "Devenir Pet Sitter AMUCH",
    signup_sitter_step1: "Compte",
    signup_sitter_step2: "Profil Sitter",
    signup_sitter_step3: "Tarifs & Dispos",
    signup_sitter_step4: "Vérification",
    signup_sitter_bio: "Bio / Présentation",
    signup_sitter_bio_placeholder: "Décrivez votre expérience avec les animaux, votre logement, et pourquoi vous adorez faire du pet sitting...",
    signup_sitter_cap: "Capacité maximale d'animaux",
    signup_sitter_rate_night: "Tarif par nuit (MAD)",
    signup_sitter_rate_weekend: "Tarif Week-end (MAD)",
    signup_sitter_id_upload: "Téléverser votre pièce d'identité (CIN ou Passeport)",
    signup_sitter_phone: "Numéro de téléphone",
    signup_sitter_sms: "Vérification SMS (Code reçu)",
    signup_sitter_submit: "Soumettre mon profil",
    signup_sitter_success: "Votre profil est en cours de vérification. Nous vous répondons sous 24h par SMS et Email.",

    // Owner Dashboard
    db_owner_welcome: "Bienvenue,",
    db_owner_next_booking: "Prochaine réservation active",
    db_owner_my_pets: "Mes Animaux",
    db_owner_active_bookings: "Réservations actives & passées",
    db_owner_messages: "Mes messages récents",
    db_owner_sitter: "Sitter",
    db_owner_dates: "Dates",
    db_owner_status: "Statut",
    db_owner_action: "Action",
    db_owner_no_pets: "Vous n'avez pas encore enregistré d'animal.",
    db_owner_no_bookings: "Aucune réservation en cours.",
    db_owner_status_pending: "En attente",
    db_owner_status_confirmed: "Confirmé",
    db_owner_status_completed: "Terminé",
    db_owner_status_cancelled: "Annulé",

    // Sitter Dashboard
    db_sitter_earnings: "Gains ce mois-ci",
    db_sitter_pending_count: "Réservations en attente",
    db_sitter_recent_reviews: "Derniers avis reçus",
    db_sitter_clients: "Propriétaire",
    db_sitter_earnings_total: "Total gagné",

    // Chat
    chat_title: "Messagerie AMUCH",
    chat_placeholder: "Saisissez votre message...",
    chat_send: "Envoyer",

    // About
    about_hero: "Notre mission : des animaux heureux, des propriétaires sereins.",
    about_history_title: "L'histoire d'AMUCH",
    about_history_text: "Née à Casablanca de la passion d'amoureux des animaux, AMUCH comble le manque de solutions de garde de confiance au Maroc. Nous construisons une communauté soudée basée sur la confiance, la bienveillance et le respect des animaux.",
    about_team_title: "L'équipe fondatrice",
    about_team_role1: "Co-fondatrice & Comportementaliste Félin",
    about_team_role2: "Co-fondateur & Spécialiste Canin",
    about_team_role3: "Responsable Confiance & Sécurité",

    // FAQ
    faq_title: "Questions Fréquentes",
    faq_subtitle: "Trouvez rapidement des réponses à toutes vos interrogations.",
    faq_cat_owners: "Pour les Propriétaires",
    faq_cat_sitters: "Pour les Pet Sitters",
    faq_cat_security: "Paiement & Sécurité"
  },
  AR: {
    // Nav
    nav_home: "الرئيسية",
    nav_find_sitter: "ابحث عن حارس حيوانات",
    nav_become_sitter: "كن حارساً للحيوانات",
    nav_about: "من نحن",
    nav_faq: "الأسئلة الشائعة",
    nav_blog: "المدونة",
    nav_login: "تسجيل الدخول",
    nav_signup: "إنشاء حساب",
    nav_dashboard: "لوحة التحكم الخاصة بي",
    nav_logout: "تسجيل الخروج",

    // Hero
    hero_title: "سافر بدون قلق. حيوانك الأليف في أيدٍ أمينة.",
    hero_subtitle: "أموش يربط أصحاب الحيوانات الأليفة بحراس حيوانات معتمدين في المغرب.",
    hero_cta_find: "ابحث عن حارس حيوانات",
    hero_cta_become: "كن حارساً للحيوانات",
    hero_badge_profiles: "ملفات شخصية موثوقة",
    hero_badge_reviews: "تقييمات موثوقة",
    hero_badge_chat: "محادثة مدمجة",

    // How it works
    how_title: "كيف يعمل أموش؟",
    how_step1_title: "1. أنشئ حسابك",
    how_step1_desc: "سجل مجانًا وأضف الملفات الشخصية المفصلة لحيواناتك الأليفة.",
    how_step2_title: "2. ابحث عن حارس مناسب",
    how_step2_desc: "قم بالتصفية حسب المدينة والتواريخ وأنواع الحيوانات المقبولة للعثور على الأفضل.",
    how_step3_title: "3. احجز وتواصل",
    how_step3_desc: "دردش مباشرة من خلال نظام الرسائل الآمن لدينا، احجز واترك تقييمك بعد الخدمة!",

    // Why AMUCH
    why_title: "لماذا تختار أموش؟",
    why_feature1_title: "حراس حيوانات معتمدون",
    why_feature1_desc: "يتم التحقق من جميع حراس الحيوانات لدينا بدقة مع ملفات شخصية مفصلة وبطاقة الهوية والصورة الشخصية.",
    why_feature2_title: "تقييمات حقيقية",
    why_feature2_desc: "تُطلق كل إقامة تلقائيًا نظام تقييم معتمد لضمان الشفافية الكاملة والجودة.",
    why_feature3_title: "دردشة مدمجة",
    why_feature3_desc: "تواصل مباشرة ومجاناً مع حارس حيوانك قبل وأثناء فترة الرعاية دون أي قيود.",
    why_feature4_title: "تغطية وطنية شاملة",
    why_feature4_desc: "متوفر في كبرى المدن المغربية: الدار البيضاء، الرباط، طنجة، مراكش، أكادير، وفاس.",

    // Cities
    cities_title: "متواجدون في مدينتكم",
    cities_subtitle: "حراس الحيوانات المعتمدون لدينا بانتظاركم في جميع أنحاء المغرب:",

    // Testimonials
    testimonials_title: "ماذا يقول مستخدمونا",
    testimonials_subtitle: "اكتشف تجارب وآراء مجتمعنا الدافئ.",
    test1_name: "ياسمين",
    test1_city: "الدار البيضاء",
    test1_text: "تمكنت أخيرًا من الذهاب في إجازة دون القلق على قطتي. كانت الحارسة مثالية للغاية ومحترفة!",
    test2_name: "مهدي",
    test2_city: "الرباط",
    test2_text: "حجز سهل، محادثة سريعة وفعالة للغاية، أنصح بشدة باستخدام منصة أموش للجميع!",
    test3_name: "سارة",
    test3_city: "طنجة",
    test3_text: "تمت رعاية كلبي بشكل رائع جداً. سأعود بالتأكيد في كل رحلة قادمة، شكراً جزيلاً أموش!",

    // CTA Final
    ctafinal_title: "هل أنت مستعد للسفر براحة بال؟",
    ctafinal_subtitle: "سجل مجاناً اليوم وجد الحارس المثالي لحيوانك الأليف.",
    ctafinal_btn: "ابدأ الآن مجاناً",

    // Footer
    footer_desc: "أموش هي أول منصة مغربية موثوقة مخصصة لرعاية وحراسة الحيوانات الأليفة المنزلية.",
    footer_col_platform: "المنصة",
    footer_col_infos: "معلومات",
    footer_col_contact: "اتصل بنا",
    footer_rights: "جميع الحقوق محفوظة | الشروط القانونية | سياسة الخصوصية",
    footer_cookie_mention: "متوافق مع اللجنة الوطنية لمراقبة حماية المعطيات ذات الطابع الشخصي (CNDP) - القانون المغربي لحماية المعطيات الشخصية.",

    // Search Page
    search_bar_title: "ابحث عن حارس الحيوانات المثالي في المغرب",
    search_city: "مدينتك",
    search_start: "تاريخ البدء",
    search_end: "تاريخ الانتهاء",
    search_animal: "نوع الحيوان",
    search_btn: "بحث",
    search_filters_title: "تصفية النتائج",
    search_filter_rating: "الحد الأدنى للتقييم",
    search_filter_price: "أقصى سعر لليلة",
    search_filter_animal_types: "الحيوانات المقبولة",
    search_filter_verified: "المتوفرين فورياً فقط",
    search_no_results: "لا يوجد حارس حيوانات يتطابق مع معايير البحث الخاصة بك حالياً.",
    search_per_night: "درهم / ليلة",
    search_btn_profile: "عرض الملف الشخصي",
    search_btn_book: "احجز الآن",
    search_verified_badge: "موثوق ✔",

    // Profile Page
    profile_back: "← العودة إلى البحث",
    profile_about: "نبذة عن",
    profile_pricing: "جدول الأسعار",
    profile_price_night: "لكل ليلة",
    profile_price_day: "باليوم / زيارة",
    profile_price_weekend: "نهاية الأسبوع (ليلتان)",
    profile_availabilities: "التوفر",
    profile_reviews_title: "تقييمات أصحاب الحيوانات",
    profile_book_now: "احجز الآن",
    profile_send_message: "أرسل رسالة",
    profile_global_rating: "التقييم العام",
    profile_available_legend: "متوفر",
    profile_unavailable_legend: "غير متوفر",

    // Sign Up Owner
    signup_owner_title: "تسجيل صاحب حيوان أليف",
    signup_owner_step1: "الحساب",
    signup_owner_step2: "حيواناتك",
    signup_owner_step3: "التأكيد",
    signup_owner_fname: "الاسم الشخصي",
    signup_owner_lname: "الاسم العائلي",
    signup_owner_email: "البريد الإلكتروني",
    signup_owner_pass: "كلمة المرور",
    signup_owner_pass_confirm: "تأكيد كلمة المرور",
    signup_owner_continue: "متابعة",
    signup_owner_back: "رجوع",
    signup_pet_name: "اسم الحيوان",
    signup_pet_type: "نوع الحيوان",
    signup_pet_breed: "السلالة / فصيلة",
    signup_pet_age: "العمر",
    signup_pet_photo: "صورة الحيوان (اسحب وأفلت هنا أو انقر)",
    signup_pet_add_another: "+ أضف حيواناً آخر",
    signup_owner_terms: "أوافق على شروط الاستخدام وسياسة الخصوصية المعمول بها.",
    signup_owner_submit: "إنشاء حسابي",
    signup_owner_success: "تم إنشاء حساب صاحب الحيوان بنجاح! مرحبًا بك في منصة أموش.",

    // Sign Up Sitter
    signup_sitter_title: "كن حارس حيوانات مع أموش",
    signup_sitter_step1: "الحساب",
    signup_sitter_step2: "ملف الحارس",
    signup_sitter_step3: "الأسعار والتوفر",
    signup_sitter_step4: "التحقق",
    signup_sitter_bio: "سيرتك الذاتية / تقديم نفسك",
    signup_sitter_bio_placeholder: "صف خبرتك مع الحيوانات الأليفة، طبيعة سكنك، ولماذا تحب تقديم خدمات حراسة الحيوانات...",
    signup_sitter_cap: "الحد الأقصى للحيوانات في نفس الوقت",
    signup_sitter_rate_night: "السعر لكل ليلة (درهم)",
    signup_sitter_rate_weekend: "سعر نهاية الأسبوع (درهم)",
    signup_sitter_id_upload: "تحميل وثيقة الهوية الرسمية (البطاقة الوطنية أو جواز السفر)",
    signup_sitter_phone: "رقم الهاتف",
    signup_sitter_sms: "التحقق عبر رسالة SMS (الرمز المستلم)",
    signup_sitter_submit: "إرسال ملفي الشخصي",
    signup_sitter_success: "ملفك الشخصي قيد المراجعة والتحقق حالياً. سنرد عليك في غضون 24 ساعة عبر الهاتف والبريد الإلكتروني.",

    // Owner Dashboard
    db_owner_welcome: "مرحباً بك،",
    db_owner_next_booking: "الحجز النشط القادم",
    db_owner_my_pets: "حيواناتي الأليفة",
    db_owner_active_bookings: "الحجوزات النشطة والسابقة",
    db_owner_messages: "رسائلي الأخيرة",
    db_owner_sitter: "الحارس",
    db_owner_dates: "التواريخ",
    db_owner_status: "الحالة",
    db_owner_action: "الإجراء",
    db_owner_no_pets: "لم تقم بتسجيل أي حيوان أليف بعد.",
    db_owner_no_bookings: "لا توجد حجوزات جارية حالياً.",
    db_owner_status_pending: "قيد الانتظار",
    db_owner_status_confirmed: "مؤكد",
    db_owner_status_completed: "مكتمل",
    db_owner_status_cancelled: "ملغى",

    // Sitter Dashboard
    db_sitter_earnings: "أرباح هذا الشهر",
    db_sitter_pending_count: "الحجوزات في الانتظار",
    db_sitter_recent_reviews: "آخر التقييمات المستلمة",
    db_sitter_clients: "صاحب الحيوان",
    db_sitter_earnings_total: "مجموع الأرباح",

    // Chat
    chat_title: "محادثات أموش",
    chat_placeholder: "اكتب رسالتك هنا...",
    chat_send: "إرسال",

    // About
    about_hero: "مهمتنا: حيوانات سعيدة، وأصحاب مطمئنين تماماً.",
    about_history_title: "قصة أموش",
    about_history_text: "تأسست أموش في الدار البيضاء بدافع الشغف وحب الحيوانات الأليفة، لسد النقص الحاد في حلول الرعاية والحراسة الموثوقة بالمغرب. نحن نبني مجتمعاً متماسكاً يرتكز على الثقة والرفق بالحيوان.",
    about_team_title: "الفريق المؤسس",
    about_team_role1: "شريكة مؤسسة وأخصائية سلوك القطط",
    about_team_role2: "شريك مؤسس وأخصائي تدريب الكلاب",
    about_team_role3: "مدير الثقة والأمان والسلامة",

    // FAQ
    faq_title: "الأسئلة الشائعة",
    faq_subtitle: "اعثر بسرعة على إجابات لجميع استفساراتك وأسئلتك.",
    faq_cat_owners: "لأصحاب الحيوانات الأليفة",
    faq_cat_sitters: "لحراس الحيوانات",
    faq_cat_security: "الدفع والأمان والسلامة"
  },
  EN: {
    // Nav
    nav_home: "Home",
    nav_find_sitter: "Find a Pet Sitter",
    nav_become_sitter: "Become a Pet Sitter",
    nav_about: "About Us",
    nav_faq: "FAQ",
    nav_blog: "Blog",
    nav_login: "Log In",
    nav_signup: "Sign Up",
    nav_dashboard: "My Dashboard",
    nav_logout: "Log Out",

    // Hero
    hero_title: "Travel worry-free. Your pet is in trusted hands.",
    hero_subtitle: "AMUCH connects pet owners with verified pet sitters in Morocco.",
    hero_cta_find: "Find a Pet Sitter",
    hero_cta_become: "Become a Pet Sitter",
    hero_badge_profiles: "Verified profiles",
    hero_badge_reviews: "Certified reviews",
    hero_badge_chat: "Built-in chat",

    // How it works
    how_title: "How it works",
    how_step1_title: "1. Create your account",
    how_step1_desc: "Sign up for free and add your pets' detailed profiles.",
    how_step2_title: "2. Search for a sitter",
    how_step2_desc: "Filter by city, dates, and accepted pet types to find your perfect match.",
    how_step3_title: "3. Book & chat",
    how_step3_desc: "Discuss live via our secure messaging, book and leave a review!",

    // Why AMUCH
    why_title: "Why choose AMUCH?",
    why_feature1_title: "Verified sitters",
    why_feature1_desc: "All our pet sitters are thoroughly verified with detailed profiles, ID check, and photos.",
    why_feature2_title: "Authentic reviews",
    why_feature2_desc: "Every booking automatically triggers our certified review system to guarantee transparency.",
    why_feature3_title: "Built-in chat",
    why_feature3_desc: "Chat directly and for free with your sitter before and during your pet's stay.",
    why_feature4_title: "National coverage",
    why_feature4_desc: "Available in main Moroccan cities: Casablanca, Rabat, Tangier, Marrakech, Agadir, and Fes.",

    // Cities
    cities_title: "Available in your cities",
    cities_subtitle: "Our certified sitters are waiting for you across Morocco:",

    // Testimonials
    testimonials_title: "What our users say",
    testimonials_subtitle: "Read genuine feedback from our warm and growing community.",
    test1_name: "Yasmine",
    test1_city: "Casablanca",
    test1_text: "I was finally able to go on vacation without worrying about my cat. The sitter was absolutely perfect!",
    test2_name: "Mehdi",
    test2_city: "Rabat",
    test2_text: "Simple booking, fast chat, and excellent care. I highly recommend the AMUCH platform!",
    test3_name: "Sara",
    test3_city: "Tangier",
    test3_text: "My dog was so incredibly well taken care of. I will book again for my next trip, thank you!",

    // CTA Final
    ctafinal_title: "Ready to travel worry-free?",
    ctafinal_subtitle: "Sign up for free today and find the perfect pet sitter.",
    ctafinal_btn: "Get started now",

    // Footer
    footer_desc: "AMUCH is Morocco's first trusted platform dedicated to pet sitting and pet care.",
    footer_col_platform: "Platform",
    footer_col_infos: "Infos",
    footer_col_contact: "Contact",
    footer_rights: "All rights reserved | Legal Mentions | Privacy Policy",
    footer_cookie_mention: "CNDP Compliant - Moroccan law on the protection of personal data.",

    // Search Page
    search_bar_title: "Find the Perfect Pet Sitter in Morocco",
    search_city: "Your city",
    search_start: "Start date",
    search_end: "End date",
    search_animal: "Pet type",
    search_btn: "Search",
    search_filters_title: "Filter Results",
    search_filter_rating: "Minimum rating",
    search_filter_price: "Max price per night",
    search_filter_animal_types: "Accepted pets",
    search_filter_verified: "Confirmed availability only",
    search_no_results: "No pet sitters match your search criteria at the moment.",
    search_per_night: "MAD / night",
    search_btn_profile: "View profile",
    search_btn_book: "Book now",
    search_verified_badge: "Verified ✔",

    // Profile Page
    profile_back: "← Back to search",
    profile_about: "About",
    profile_pricing: "Pricing grid",
    profile_price_night: "Per night",
    profile_price_day: "Per day / Visit",
    profile_price_weekend: "Weekend (2 nights)",
    profile_availabilities: "Availabilities",
    profile_reviews_title: "Owners Reviews",
    profile_book_now: "Book now",
    profile_send_message: "Send message",
    profile_global_rating: "Overall rating",
    profile_available_legend: "Available",
    profile_unavailable_legend: "Unavailable",

    // Sign Up Owner
    signup_owner_title: "Pet Owner Registration",
    signup_owner_step1: "Account",
    signup_owner_step2: "Your Pets",
    signup_owner_step3: "Confirmation",
    signup_owner_fname: "First name",
    signup_owner_lname: "Last name",
    signup_owner_email: "Email Address",
    signup_owner_pass: "Password",
    signup_owner_pass_confirm: "Confirm password",
    signup_owner_continue: "Continue",
    signup_owner_back: "Back",
    signup_pet_name: "Pet's name",
    signup_pet_type: "Pet type",
    signup_pet_breed: "Breed / Variety",
    signup_pet_age: "Age",
    signup_pet_photo: "Pet photo (Drag & drop or click to upload)",
    signup_pet_add_another: "+ Add another pet",
    signup_owner_terms: "I accept the terms of use and the privacy policy.",
    signup_owner_submit: "Create my account",
    signup_owner_success: "Your owner account was successfully created! Welcome to AMUCH.",

    // Sign Up Sitter
    signup_sitter_title: "Become an AMUCH Pet Sitter",
    signup_sitter_step1: "Account",
    signup_sitter_step2: "Sitter Profile",
    signup_sitter_step3: "Rates & Dispos",
    signup_sitter_step4: "Verification",
    signup_sitter_bio: "Bio / Presentation",
    signup_sitter_bio_placeholder: "Describe your experience with pets, your home environment, and why you love pet sitting...",
    signup_sitter_cap: "Maximum pets at the same time",
    signup_sitter_rate_night: "Price per night (MAD)",
    signup_sitter_rate_weekend: "Weekend price (MAD)",
    signup_sitter_id_upload: "Upload official ID card (CIN or Passport)",
    signup_sitter_phone: "Phone number",
    signup_sitter_sms: "SMS verification (Received code)",
    signup_sitter_submit: "Submit my profile",
    signup_sitter_success: "Your profile is currently under review. We will reply within 24 hours via SMS and Email.",

    // Owner Dashboard
    db_owner_welcome: "Welcome,",
    db_owner_next_booking: "Next active booking",
    db_owner_my_pets: "My Pets",
    db_owner_active_bookings: "Active & past bookings",
    db_owner_messages: "My recent messages",
    db_owner_sitter: "Sitter",
    db_owner_dates: "Dates",
    db_owner_status: "Status",
    db_owner_action: "Action",
    db_owner_no_pets: "You haven't registered any pets yet.",
    db_owner_no_bookings: "No active bookings at this time.",
    db_owner_status_pending: "Pending",
    db_owner_status_confirmed: "Confirmed",
    db_owner_status_completed: "Completed",
    db_owner_status_cancelled: "Cancelled",

    // Sitter Dashboard
    db_sitter_earnings: "Earnings this month",
    db_sitter_pending_count: "Pending bookings",
    db_sitter_recent_reviews: "Latest reviews received",
    db_sitter_clients: "Pet Owner",
    db_sitter_earnings_total: "Total earned",

    // Chat
    chat_title: "AMUCH Chat",
    chat_placeholder: "Type your message here...",
    chat_send: "Send",

    // About
    about_hero: "Our mission: happy pets, serene owners.",
    about_history_title: "The AMUCH Story",
    about_history_text: "Born in Casablanca from the passion of pet lovers, AMUCH addresses the critical shortage of trusted pet sitting solutions in Morocco. We are building a caring, respectful community focused on pet welfare.",
    about_team_title: "The Founding Team",
    about_team_role1: "Co-founder & Feline Behaviorist",
    about_team_role2: "Co-founder & Canine Training Expert",
    about_team_role3: "Head of Trust, Safety & Support",

    // FAQ
    faq_title: "Frequently Asked Questions",
    faq_subtitle: "Quickly find answers to your questions.",
    faq_cat_owners: "For Owners",
    faq_cat_sitters: "For Pet Sitters",
    faq_cat_security: "Payment & Safety"
  }
};
