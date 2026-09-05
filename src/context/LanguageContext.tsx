"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Language = "en" | "hi" | "mr" | "gu" | "ta" | "te" | "bn" | "kn";

export interface LanguageOption {
  code: Language;
  label: string;
  native: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", native: "English", flag: "🇬🇧" },
  { code: "hi", label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { code: "mr", label: "Marathi", native: "मराठी", flag: "🚩" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ta", label: "Tamil", native: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "Telugu", native: "తెలుగు", flag: "🇮🇳" },
  { code: "bn", label: "Bengali", native: "বাংলা", flag: "🇮🇳" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
];

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    nav_home: "Home",
    nav_wizard: "Find My Scheme",
    nav_calculator: "EMI Calculator",
    nav_locator: "Partner Locator",
    nav_checklist: "Checklist",
    nav_learn: "How It Works",
    nav_get_started: "Get Started",

    // Hero
    hero_badge: "✨ Government SC Loan Schemes · Made Simple",
    hero_title_1: "The money is waiting.",
    hero_title_2: "We show you the way to it.",
    hero_desc: "Crores in earmarked government funding for SC entrepreneurs and students goes underutilized every year — simply because people don't know which scheme fits them, what their EMI looks like, or which Channel Partner to walk into. SchemeSaathi fixes all three.",
    hero_cta_find: "Find My Scheme →",
    hero_cta_locate: "Locate Partners Near Me",

    // Stats
    stat_1_val: "₹50 L",
    stat_1_lbl: "max project financing under Term Loan",
    stat_2_val: "6.5%",
    stat_2_lbl: "interest from, among India's cheapest",
    stat_3_val: "100+",
    stat_3_lbl: "Channel Partners you can choose between",
    stat_4_val: "90%",
    stat_4_lbl: "of project cost can be financed",

    // Modules
    mod_badge: "Interactive Tools",
    mod_title: "Three steps between you and your loan",
    mod_sub: "Each step is one module — they hand off to each other automatically.",

    // Financial Literacy Section
    fin_sec_badge: "🏛️ Financial Literacy · Concessional Lending",
    fin_sec_title: "Understand the Channel Finance System",
    fin_sec_sub: "How concessional government credit flows from the ministry directly to your local bank branch.",
    fin_card1_tag: "Apex Model",
    fin_card1_title: "What is Channel Finance?",
    fin_card1_desc: "The Ministry of Social Justice (via NSFDC) operates as an apex refinancing body. Instead of disbursing loans directly from New Delhi, it routes subsidized funds through state corporations and authorized banks so you have local branch access, local language support, and in-person verification.",
    fin_card2_tag: "3 Real Schemes",
    fin_card2_title: "Three Real Scheme Categories",
    fin_card2_desc: "1. Micro Finance Scheme: Up to ₹1.40 Lakh (6.5% p.a.) for small income-generating trades.\n2. Term Loan Scheme: Up to ₹50.00 Lakh (8%–12.5% p.a.) for business, manufacturing & vehicles.\n3. Educational Loan Scheme: Up to ₹25 Lakh in India / ₹40 Lakh abroad (7% p.a.) for higher degrees.",
    fin_card3_tag: "Channel Partners",
    fin_card3_title: "Who are Channel Partners?",
    fin_card3_desc: "State Channelising Agencies (SCAs), Public Sector Banks (PSBs like SBI, PNB, BoB), Regional Rural Banks (RRBs), and qualified NBFC-MFIs. They verify your documents, assess project viability, and sanction your loan at government subsidized rates.",

    // Wizard
    wiz_step_0: "About You",
    wiz_step_1: "Your Goal",
    wiz_step_2: "Project Cost",
    wiz_step_3: "Background",
    wiz_title_0: "Tell us about yourself",
    wiz_sub_0: "We customize the scheme and nearest channel partners to your district.",
    wiz_state_lbl: "State",
    wiz_state_ph: "Select state…",
    wiz_dist_lbl: "District",
    wiz_dist_ph: "Select district…",
    wiz_dist_wait: "Select a state first",
    wiz_cat_lbl: "Social Category",
    wiz_age_lbl: "Applicant Age",
    wiz_years: "years",

    wiz_title_1: "What do you need the loan for?",
    wiz_sub_1: "Select your loan purpose and specific project activity.",
    wiz_pur_biz: "Business",
    wiz_pur_biz_hint: "Shop, retail, transport, manufacturing",
    wiz_pur_agri: "Agriculture & Allied",
    wiz_pur_agri_hint: "Dairy, poultry, fishery, sheep rearing",
    wiz_pur_edu: "Education",
    wiz_pur_edu_hint: "Professional / technical higher degrees",
    wiz_act_select: "Select Specific Activity / Trade",
    wiz_act_edu_select: "Select Specific Course / Degree",
    wiz_act_ph: "Choose activity…",
    wiz_act_selected: "Selected:",
    wiz_course_loc: "Course Location",
    wiz_course_in: "India 🇮🇳 (₹25L Max)",
    wiz_course_ab: "Abroad ✈️ (₹40L Max)",

    wiz_title_2: "Financial parameters",
    wiz_sub_2: "Government concessional loans finance up to 90% of cost with 10% margin money.",
    wiz_cost_lbl: "Estimated Project Cost",
    wiz_course_cost_lbl: "Total Course Cost",
    wiz_financed_lbl: "Financed (90%):",
    wiz_income_lbl: "Annual Family Income",
    wiz_income_rule: "💡 Income Rule: Family income up to ₹3.00L qualifies for Micro Finance (6.5% interest) and up to ₹5.00L for Term Loan (8%–12.5%).",

    wiz_title_3: "Review & Match",
    wiz_sub_3: "Verify your details before generating your AI loan recommendation.",
    wiz_edu_lbl: "Highest Education Level",
    wiz_edu_ph: "Select education level…",
    wiz_profile_sum: "Profile Summary",
    wiz_sum_loc: "Location:",
    wiz_sum_pur: "Purpose:",
    wiz_sum_cost: "Cost:",
    wiz_sum_inc: "Income:",
    wiz_btn_back: "← Back",
    wiz_btn_continue: "Continue →",
    wiz_btn_submit: "Get Recommendation ✨",
    wiz_btn_analyzing: "Analyzing…",

    // Recommendation
    rec_eligible_heading: "You are eligible for the",
    rec_micro_name: "Micro Finance Scheme",
    rec_term_name: "Term Loan Scheme",
    rec_edu_name: "Educational Loan Scheme",
    rec_micro_sub: "Small projects up to ₹1.40 lakh at 6.5% concessional interest",
    rec_term_sub: "Larger projects up to ₹50.00 lakh at 8.0%–12.5% concessional interest",
    rec_edu_sub: "Higher education financing up to ₹25.00 lakh in India / ₹40.00 lakh abroad at 7.0% concessional interest",

    // Calculator
    calc_tag: "🧮 Financial Planner",
    calc_title: "EMI & Amortization Calculator",
    calc_sub_rec: "Pre-filled for your scheme — adjust sliders to explore.",
    calc_loan_amt: "Loan Amount",
    calc_rate: "Interest Rate",
    calc_tenure: "Repayment Tenure",
    calc_moratorium: "Moratorium / Grace Period",
    calc_moratorium_check: "Pay simple interest during grace period",
    calc_moratorium_hint: "(drastically lowers total repayment)",
    calc_find_apply: "Find Where To Apply 📍 →",
    calc_monthly_emi: "Your monthly EMI",
    calc_grace_emi: "Monthly EMI after grace period",
    calc_principal: "Principal Loan",
    calc_total_interest: "Total Interest",
    calc_total_repayment: "Total Repayment",
    calc_repay_sched: "Repayment schedule",
    calc_expand: "Expand schedule ▼",
    calc_less: "Show less ▲",

    // Locator
    loc_tag: "📍 Channel Partners",
    loc_title: "Geo-Spatial Channel Partner Locator",
    loc_sub: "Showing nearest authorised branches, sorted by distance.",
    loc_type_lbl: "Type",
    loc_dist_lbl: "District",
    loc_near_me: "📍 Near Me",
    loc_show_npa: "Show high-NPA partners",
    loc_nearest_badge: "Nearest",
    loc_call: "📞 Call",
    loc_directions: "➤ Directions",
    loc_btn_send_app: "Send My Application to This Partner",

    // Application Modal
    modal_app_title: "Application Dossier Generated",
    modal_app_sub: "Your simulated loan application package is ready for branch submission.",
    modal_ref_lbl: "Application Reference No.",
    modal_partner_lbl: "Target Channel Partner",
    modal_scheme_lbl: "Concessional Scheme",
    modal_amount_lbl: "Requested Loan Amount",
    modal_applicant_lbl: "Applicant Profile",
    modal_next_title: "Next Steps at Bank Branch",
    modal_step_1: "1. Note your generated Reference Number.",
    modal_step_2: "2. Carry your Aadhaar, SC Caste Certificate, and Income Proof.",
    modal_step_3: "3. Meet the Nodal Channel Finance / Agri-SME Officer at this branch for formal processing.",
    modal_btn_print: "Print / Download Summary",
    modal_btn_done: "Done / Close",
    modal_submitted_badge: "Application Generated & Queued",

    // Checklist
    chk_tag: "📄 Official Requirements",
    chk_title: "Document Checklist",
    chk_sub: "Everything an authorised Channel Partner asks for. Check off items as you gather them.",
    chk_print: "Print / Save PDF 🖨️",
    chk_mandatory: "Mandatory for Every Scheme",

    // Chatbot
    chat_title: "Ask Saathi AI",
    chat_sub: "Real-Time Government Scheme AI",
    chat_ph: "Ask about schemes, EMIs, or bank branches…",
    chat_send: "Send",
    chat_thinking: "Saathi AI is finding exact schemes…",
    chat_suggested: "💡 Suggested Queries:",
  },

  hi: {
    // Navigation
    nav_home: "मुख्य पृष्ठ",
    nav_wizard: "योजना खोजें",
    nav_calculator: "ईएमआई कैलकुलेटर",
    nav_locator: "पार्टनर लोकेटर",
    nav_checklist: "दस्तावेज़ सूची",
    nav_learn: "चैनल वित्त गाइड",
    nav_get_started: "शुरू करें",

    // Hero
    hero_badge: "✨ अनुसूचित जाति (SC) सरकारी ऋण योजनाएं · आसान और सरल",
    hero_title_1: "सरकारी धन उपलब्ध है।",
    hero_title_2: "हम आपको सही रास्ता दिखाते हैं।",
    hero_desc: "अनुसूचित जाति (SC) के उद्यमियों और छात्रों के लिए करोड़ों रुपये का सरकारी फंड हर साल बिना उपयोग के रह जाता है — क्योंकि लोगों को सही योजना, ईएमआई और बैंक शाखा की जानकारी नहीं होती। SchemeSaathi इन तीनों का समाधान करता है।",
    hero_cta_find: "मेरी योजना खोजें →",
    hero_cta_locate: "नजदीकी बैंक खोजें",

    // Stats
    stat_1_val: "₹50 लाख",
    stat_1_lbl: "टर्म लोन के तहत अधिकतम ऋण राशि",
    stat_2_val: "6.5%",
    stat_2_lbl: "न्यूनतम ब्याज दर, भारत में सबसे सस्ती",
    stat_3_val: "100+",
    stat_3_lbl: "अधिकृत चैनल पार्टनर बैंक और संस्थाएं",
    stat_4_val: "90%",
    stat_4_lbl: "परियोजना लागत का 90% सरकारी वित्तपोषण",

    // Modules
    mod_badge: "उपयोगी उपकरण",
    mod_title: "ऋण प्राप्त करने के 3 आसान चरण",
    mod_sub: "प्रत्येक चरण एक-दूसरे से स्वतः जुड़े हुए हैं।",

    // Financial Literacy Section
    fin_sec_badge: "🏛️ वित्तीय साक्षरता · रियायती ऋण प्रणाली",
    fin_sec_title: "चैनल वित्त प्रणाली को समझें",
    fin_sec_sub: "सरकारी रियायती ऋण मंत्रालय से सीधे आपकी स्थानीय बैंक शाखा तक कैसे पहुंचता है।",
    fin_card1_tag: "शीर्ष संस्था मॉडल",
    fin_card1_title: "चैनल वित्त (Channel Finance) क्या है?",
    fin_card1_desc: "सामाजिक न्याय मंत्रालय (NSFDC के माध्यम से) एक शीर्ष पुनर्वित्त संस्था के रूप में कार्य करता है। नई दिल्ली से सीधे ऋण देने के बजाय, यह राज्य निगमों और अधिकृत बैंकों के माध्यम से रियायती धन भेजता है ताकि आपको स्थानीय शाखा, स्थानीय भाषा और व्यक्तिगत सहायता मिल सके।",
    fin_card2_tag: "3 वास्तविक योजनाएं",
    fin_card2_title: "तीन प्रमुख रियायती योजना श्रेणियां",
    fin_card2_desc: "1. माइक्रो फाइनेंस योजना: छोटे आय-उत्पादक कार्यों के लिए ₹1.40 लाख तक (6.5% वार्षिक ब्याज)।\n2. टर्म लोन योजना: व्यापार, उद्योग व वाहनों के लिए ₹50.00 लाख तक (8%–12.5% ब्याज)।\n3. शिक्षा ऋण योजना: उच्च शिक्षा के लिए भारत में ₹25 लाख / विदेश में ₹40 लाख तक (7% ब्याज)।",
    fin_card3_tag: "चैनल पार्टनर",
    fin_card3_title: "चैनल पार्टनर कौन हैं?",
    fin_card3_desc: "राज्य चैनलाइजिंग एजेंसियां (SCAs), सार्वजनिक क्षेत्र के बैंक (PSB जैसे SBI, PNB, BoB), क्षेत्रीय ग्रामीण बैंक (RRBs) और योग्य NBFC-MFIs। वे आपके दस्तावेज़ों की जांच करते हैं, परियोजना की पुष्टि करते हैं और सरकारी रियायती दरों पर ऋण स्वीकृत करते हैं।",

    // Wizard
    wiz_step_0: "आपके बारे में",
    wiz_step_1: "आपका लक्ष्य",
    wiz_step_2: "परियोजना लागत",
    wiz_step_3: "समीक्षा",
    wiz_title_0: "अपने बारे में बताएं",
    wiz_sub_0: "हम आपके जिले के अनुसार सही योजना और नजदीकी बैंक शाखा की पहचान करते हैं।",
    wiz_state_lbl: "राज्य (State)",
    wiz_state_ph: "राज्य चुनें…",
    wiz_dist_lbl: "जिला (District)",
    wiz_dist_ph: "जिला चुनें…",
    wiz_dist_wait: "पहले राज्य चुनें",
    wiz_cat_lbl: "सामाजिक श्रेणी (Category)",
    wiz_age_lbl: "आवेदक की आयु",
    wiz_years: "वर्ष",

    wiz_title_1: "आपको ऋण किस उद्देश्य के लिए चाहिए?",
    wiz_sub_1: "अपने ऋण का उद्देश्य और विशिष्ट कार्यक्षेत्र चुनें।",
    wiz_pur_biz: "व्यवसाय / व्यापार",
    wiz_pur_biz_hint: "दुकान, खुदरा, परिवहन, विनिर्माण",
    wiz_pur_agri: "कृषि एवं संबद्ध",
    wiz_pur_agri_hint: "डेयरी, मुर्गी पालन, मत्स्य पालन, पशुपालन",
    wiz_pur_edu: "उच्च शिक्षा",
    wiz_pur_edu_hint: "व्यावसायिक एवं तकनीकी उच्च डिग्रियां",
    wiz_act_select: "विशिष्ट गतिविधि / व्यापार चुनें",
    wiz_act_edu_select: "विशिष्ट कोर्स / डिग्री चुनें",
    wiz_act_ph: "गतिविधि चुनें…",
    wiz_act_selected: "चयनित:",
    wiz_course_loc: "कोर्स का स्थान",
    wiz_course_in: "भारत में 🇮🇳 (अधिकतम ₹25 लाख)",
    wiz_course_ab: "विदेश में ✈️ (अधिकतम ₹40 लाख)",

    wiz_title_2: "वित्तीय आवश्यकताएं",
    wiz_sub_2: "सरकारी रियायती ऋण में 90% सरकार देती है और केवल 10% आपका अंशदान होता है।",
    wiz_cost_lbl: "अनुमानित परियोजना लागत",
    wiz_course_cost_lbl: "कोर्स की कुल लागत",
    wiz_financed_lbl: "सरकारी ऋण (90%):",
    wiz_income_lbl: "वार्षिक पारिवारिक आय",
    wiz_income_rule: "💡 आय नियम: ₹3.00 लाख तक की आय पर माइक्रो फाइनेंस (6.5% ब्याज) और ₹5.00 लाख तक टर्म लोन (8%–12.5%) मिलता है।",

    wiz_title_3: "समीक्षा एवं मिलान",
    wiz_sub_3: "अपनी AI ऋण सिफारिश जनरेट करने से पहले विवरण की पुष्टि करें।",
    wiz_edu_lbl: "उच्चतम शिक्षा स्तर",
    wiz_edu_ph: "शिक्षा स्तर चुनें…",
    wiz_profile_sum: "प्रोफ़ाइल सारांश",
    wiz_sum_loc: "स्थान:",
    wiz_sum_pur: "उद्देश्य:",
    wiz_sum_cost: "लागत:",
    wiz_sum_inc: "आय:",
    wiz_btn_back: "← पीछे",
    wiz_btn_continue: "आगे बढ़ें →",
    wiz_btn_submit: "योजना सिफारिश प्राप्त करें ✨",
    wiz_btn_analyzing: "विश्लेषण जारी है…",

    // Recommendation
    rec_eligible_heading: "आप पात्र हैं:",
    rec_micro_name: "माइक्रो फाइनेंस योजना (Micro Finance Scheme)",
    rec_term_name: "टर्म लोन योजना (Term Loan Scheme)",
    rec_edu_name: "शिक्षा ऋण योजना (Educational Loan Scheme)",
    rec_micro_sub: "6.5% रियायती ब्याज दर पर ₹1.40 लाख तक की छोटी परियोजनाएं",
    rec_term_sub: "8.0%–12.5% रियायती ब्याज दर पर ₹50.00 लाख तक की बड़ी परियोजनाएं",
    rec_edu_sub: "7.0% रियायती ब्याज दर पर भारत में ₹25 लाख / विदेश में ₹40 लाख तक की उच्च शिक्षा",

    // Calculator
    calc_tag: "🧮 वित्तीय योजनाकार",
    calc_title: "ईएमआई एवं पुनर्भुगतान कैलकुलेटर",
    calc_sub_rec: "आपकी योजना के अनुसार पूर्व-भरी हुई — स्लाइडर से जांचें।",
    calc_loan_amt: "ऋण राशि (Loan Amount)",
    calc_rate: "ब्याज दर (% प्रति वर्ष)",
    calc_tenure: "पुनर्भुगतान अवधि (महीने)",
    calc_moratorium: "मोराटोरियम / छूट अवधि (महीने)",
    calc_moratorium_check: "छूट अवधि के दौरान साधारण ब्याज का भुगतान करें",
    calc_moratorium_hint: "(कुल भुगतान में भारी बचत होती है)",
    calc_find_apply: "आवेदन कहां करें देखें 📍 →",
    calc_monthly_emi: "आपकी मासिक ईएमआई",
    calc_grace_emi: "छूट अवधि के बाद मासिक ईएमआई",
    calc_principal: "मूल ऋण राशि",
    calc_total_interest: "कुल ब्याज",
    calc_total_repayment: "कुल पुनर्भुगतान",
    calc_repay_sched: "पुनर्भुगतान अनुसूची (Repayment Schedule)",
    calc_expand: "अनुसूची देखें ▼",
    calc_less: "छुपाएं ▲",

    // Locator
    loc_tag: "📍 चैनल पार्टनर बैंक",
    loc_title: "नजदीकी अधिकृत बैंक एवं संस्था खोजक",
    loc_sub: "दूरी के अनुसार क्रमबद्ध नजदीकी अधिकृत शाखाएं दिखाई जा रही हैं।",
    loc_type_lbl: "प्रकार",
    loc_dist_lbl: "जिला",
    loc_near_me: "📍 मेरे पास",
    loc_show_npa: "उच्च-NPA पार्टनर दिखाएं",
    loc_nearest_badge: "सबसे पास",
    loc_call: "📞 फोन करें",
    loc_directions: "➤ दिशा-निर्देश",
    loc_btn_send_app: "इस पार्टनर को मेरा आवेदन भेजें",

    // Application Modal
    modal_app_title: "आवेदन डॉसियर तैयार है",
    modal_app_sub: "आपका ऋण आवेदन पत्र बैंक शाखा में जमा करने के लिए तैयार है।",
    modal_ref_lbl: "आवेदन संदर्भ संख्या (Reference No.)",
    modal_partner_lbl: "लक्षित चैनल पार्टनर",
    modal_scheme_lbl: "रियायती ऋण योजना",
    modal_amount_lbl: "अनुरोधित ऋण राशि",
    modal_applicant_lbl: "आवेदक प्रोफ़ाइल",
    modal_next_title: "बैंक शाखा में अगले चरण",
    modal_step_1: "1. अपनी जनरेट की गई संदर्भ संख्या नोट करें।",
    modal_step_2: "2. अपना आधार, SC जाति प्रमाण पत्र और आय प्रमाण पत्र साथ रखें।",
    modal_step_3: "3. औपचारिक प्रक्रिया के लिए इस शाखा के नोडल चैनल फाइनेंस / एग्री-एसएमई अधिकारी से मिलें।",
    modal_btn_print: "प्रिंट / सारांश डाउनलोड करें",
    modal_btn_done: "पूर्ण / बंद करें",
    modal_submitted_badge: "आवेदन जनरेट एवं कतारबद्ध",

    // Checklist
    chk_tag: "📄 आधिकारिक आवश्यकताएं",
    chk_title: "आवश्यक दस्तावेज़ सूची (Checklist)",
    chk_sub: "बैंक जाने से पहले इन सभी दस्तावेज़ों की जांच कर लें।",
    chk_print: "प्रिंट / PDF सहेजें 🖨️",
    chk_mandatory: "प्रत्येक योजना के लिए अनिवार्य दस्तावेज़",

    // Chatbot
    chat_title: "साथी AI से पूछें",
    chat_sub: "सरकारी योजना AI सलाहकार",
    chat_ph: "योजनाओं, ईएमआई या बैंक शाखाओं के बारे में पूछें…",
    chat_send: "भेजें",
    chat_thinking: "साथी AI सटीक योजना खोज रहा है…",
    chat_suggested: "💡 सुझाए गए प्रश्न:",
  },

  mr: {
    // Navigation
    nav_home: "मुख्यपृष्ठ",
    nav_wizard: "योजना शोधा",
    nav_calculator: "EMI कॅल्क्युलेटर",
    nav_locator: "पार्टनर लोकेटर",
    nav_checklist: "कागदपत्रे यादी",
    nav_learn: "चॅनल वित्त मार्गदर्शक",
    nav_get_started: "सुरू करा",

    // Hero
    hero_badge: "✨ अनुसूचित जाती (SC) शासकीय कर्ज योजना · सोप्या भाषेत",
    hero_title_1: "शासनाचा निधी उपलब्ध आहे.",
    hero_title_2: "आम्ही दाखवतो योग्य मार्ग.",
    hero_desc: "अनुसूचित जातीच्या (SC) उद्योजकांसाठी आणि विद्यार्थ्यांसाठी कोट्यवधी रुपयांचा शासकीय निधी दरवर्षी पडून राहतो — कारण लोकांना योग्य योजना, EMI आणि अधिकृत बँकेची माहिती नसते. SchemeSaathi या तिन्हींची अचूक माहिती देते.",
    hero_cta_find: "माझी योजना शोधा →",
    hero_cta_locate: "जवळची बँक शाखा शोधा",

    // Stats
    stat_1_val: "₹50 लाख",
    stat_1_lbl: "टर्म लोन अंतर्गत कमाल कर्ज मर्यादा",
    stat_2_val: "6.5%",
    stat_2_lbl: "सवलतीचा व्याजदर, भारतातील सर्वात स्वस्त",
    stat_3_val: "100+",
    stat_3_lbl: "अधिकृत चॅनल पार्टनर बँका व संस्था",
    stat_4_val: "90%",
    stat_4_lbl: "प्रकल्प खर्चाच्या 90% शासकीय वित्तपुरवठा",

    // Modules
    mod_badge: "उपयुक्त टूल्स",
    mod_title: "कर्ज मिळवण्याचे 3 सोपे टप्पे",
    mod_sub: "प्रत्येक टप्पा एकमेकांशी आपोआप जोडलेला आहे.",

    // Financial Literacy Section
    fin_sec_badge: "🏛️ आर्थिक साक्षरता · सवलतीची कर्ज प्रणाली",
    fin_sec_title: "चॅनल वित्त प्रणाली समजून घ्या",
    fin_sec_sub: "शासकीय सवलतीचे कर्ज मंत्रालयाकडून थेट तुमच्या स्थानिक बँक शाखेत कसे पोहोचते.",
    fin_card1_tag: "शीर्ष संस्था मॉडेल",
    fin_card1_title: "चॅनल फायनान्स म्हणजे काय?",
    fin_card1_desc: "सामाजिक न्याय मंत्रालय (NSFDC मार्फत) शीर्ष पुनर्वित्त संस्था म्हणून काम करते. नवी दिल्लीतून थेट कर्ज वाटप करण्याऐवजी, ते राज्य महामंडळे आणि अधिकृत बँकांद्वारे सवलतीचा निधी पाठवते जेणेकरून तुम्हाला स्थानिक बँक, स्थानिक भाषा आणि थेट मदत मिळू शकेल.",
    fin_card2_tag: "3 प्रत्यक्ष योजना",
    fin_card2_title: "तीन प्रमुख सवलतीच्या कर्ज योजना",
    fin_card2_desc: "1. मायक्रो फायनान्स योजना: लहान उत्पन्नाच्या व्यवसायांसाठी ₹1.40 लाखांपर्यंत (6.5% व्याजदर).\n2. टर्म लोन योजना: व्यापार, उत्पादन व वाहनांसाठी ₹50.00 लाखांपर्यंत (8%–12.5% व्याजदर).\n3. शैक्षणिक कर्ज योजना: उच्च शिक्षणासाठी भारतात ₹25 लाख / परदेशात ₹40 लाखांपर्यंत (7% व्याजदर).",
    fin_card3_tag: "चॅनल पार्टनर",
    fin_card3_title: "चॅनल पार्टनर कोण आहेत?",
    fin_card3_desc: "राज्य चॅनेलायझिंग एजन्सी (SCAs), सार्वजनिक क्षेत्रातील बँका (PSB जसे की SBI, PNB, BoB), प्रादेशिक ग्रामीण बँका (RRBs) आणि पात्र NBFC-MFIs. ते तुमच्या कागदपत्रांची पडताळणी करतात आणि सवलतीच्या दरात कर्ज मंजूर करतात.",

    // Wizard
    wiz_step_0: "माहिती",
    wiz_step_1: "उद्दिष्ट",
    wiz_step_2: "प्रकल्प खर्च",
    wiz_step_3: "पडताळणी",
    wiz_title_0: "तुमच्याबद्दल सांगा",
    wiz_sub_0: "आम्ही तुमच्या जिल्ह्यानुसार योग्य शासकीय योजना आणि जवळच्या बँकांची माहिती देतो.",
    wiz_state_lbl: "राज्य (State)",
    wiz_state_ph: "राज्य निवडा…",
    wiz_dist_lbl: "जिल्हा (District)",
    wiz_dist_ph: "जिल्हा निवडा…",
    wiz_dist_wait: "आधी राज्य निवडा",
    wiz_cat_lbl: "सामाजिक प्रवर्ग (Category)",
    wiz_age_lbl: "अर्जदाराचे वय",
    wiz_years: "वर्षे",

    wiz_title_1: "तुम्हाला कर्ज कशासाठी हवे आहे?",
    wiz_sub_1: "कर्जाचा हेतू आणि नेमका व्यवसाय प्रकार निवडा.",
    wiz_pur_biz: "व्यवसाय / उद्योग",
    wiz_pur_biz_hint: "दुकान, किरकोळ विक्री, वाहतूक, उत्पादन",
    wiz_pur_agri: "शेती व पूरक व्यवसाय",
    wiz_pur_agri_hint: "दुग्धव्यवसाय, कुक्कुटपालन, मत्स्यपालन, शेळीपालन",
    wiz_pur_edu: "उच्च शिक्षण",
    wiz_pur_edu_hint: "व्यावसायिक व तांत्रिक उच्च पदव्या",
    wiz_act_select: "नेमका व्यवसाय / उपक्रम निवडा",
    wiz_act_edu_select: "नेमका कोर्स / पदवी निवडा",
    wiz_act_ph: "उपक्रम निवडा…",
    wiz_act_selected: "निवडलेले:",
    wiz_course_loc: "शिक्षणाचे ठिकाण",
    wiz_course_in: "भारतात 🇮🇳 (कमाल ₹25 लाख)",
    wiz_course_ab: "परदेशात ✈️ (कमाल ₹40 लाख)",

    wiz_title_2: "आर्थिक तपशील",
    wiz_sub_2: "शासकीय सवलतीच्या कर्जात 90% रक्कम शासन देते आणि फक्त 10% स्वतःचे योगदान लागते.",
    wiz_cost_lbl: "अंदाजे प्रकल्प खर्च",
    wiz_course_cost_lbl: "कोर्सचा एकूण खर्च",
    wiz_financed_lbl: "शासकीय कर्ज (90%):",
    wiz_income_lbl: "वार्षिक कौटुंबिक उत्पन्न",
    wiz_income_rule: "💡 उत्पन्न नियम: ₹3.00 लाखांपर्यंत मायक्रो फायनान्स (6.5% व्याज) आणि ₹5.00 लाखांपर्यंत टर्म लोन (8%–12.5%) मिळते.",

    wiz_title_3: "पुनरावलोकन व AI शिफारस",
    wiz_sub_3: "AI शिफारस मिळवण्यापूर्वी तुमचे तपशील तपासा.",
    wiz_edu_lbl: "उच्चतम शिक्षण",
    wiz_edu_ph: "शिक्षण निवडा…",
    wiz_profile_sum: "प्रोफाइल सारांश",
    wiz_sum_loc: "ठिकाण:",
    wiz_sum_pur: "हेतू:",
    wiz_sum_cost: "खर्च:",
    wiz_sum_inc: "उत्पन्न:",
    wiz_btn_back: "← मागे",
    wiz_btn_continue: "पुढे जा →",
    wiz_btn_submit: "योजना शिफारस मिळवा ✨",
    wiz_btn_analyzing: "विश्लेषण सुरू आहे…",

    // Recommendation
    rec_eligible_heading: "तुम्ही पात्र आहात:",
    rec_micro_name: "मायक्रो फायनान्स योजना (Micro Finance Scheme)",
    rec_term_name: "टर्म लोन योजना (Term Loan Scheme)",
    rec_edu_name: "शैक्षणिक कर्ज योजना (Educational Loan Scheme)",
    rec_micro_sub: "6.5% सवलतीच्या व्याजदरात ₹1.40 लाखांपर्यंतचे लहान प्रकल्प",
    rec_term_sub: "8.0%–12.5% सवलतीच्या व्याजदरात ₹50.00 लाखांपर्यंतचे मोठे प्रकल्प",
    rec_edu_sub: "7.0% सवलतीच्या व्याजदरात भारतात ₹25 लाख / परदेशात ₹40 लाखांपर्यंतचे उच्च शिक्षण",

    // Calculator
    calc_tag: "🧮 आर्थिक नियोजन",
    calc_title: "EMI आणि परतफेड कॅल्क्युलेटर",
    calc_sub_rec: "तुमच्या योजनेनुसार आपोआप भरलेले — स्लायडरने तपासा.",
    calc_loan_amt: "कर्ज रक्कम (Loan Amount)",
    calc_rate: "व्याजदर (% दरसाल)",
    calc_tenure: "परतफेड मुदत (महिने)",
    calc_moratorium: "सवलत कालावधी (मोराटोरियम महिने)",
    calc_moratorium_check: "सवलत काळात फक्त साधे व्याज भरा",
    calc_moratorium_hint: "(एकूण परतफेडीत मोठी बचत होते)",
    calc_find_apply: "अर्ज कुठे करायचा ते पाहा 📍 →",
    calc_monthly_emi: "तुमचा मासिक EMI",
    calc_grace_emi: "सवलत काळानंतर मासिक EMI",
    calc_principal: "मुद्दल कर्ज",
    calc_total_interest: "एकूण व्याज",
    calc_total_repayment: "एकूण परतफेड",
    calc_repay_sched: "मासिक परतफेड वेळापत्रक",
    calc_expand: "तपशील पाहा ▼",
    calc_less: "कमी करा ▲",

    // Locator
    loc_tag: "📍 चॅनल पार्टनर बँका",
    loc_title: "जवळच्या अधिकृत बँका व संस्था शोधा",
    loc_sub: "दूरीनुसार क्रमबद्ध अधिकृत बँक शाखा दाखवल्या आहेत.",
    loc_type_lbl: "प्रकार",
    loc_dist_lbl: "जिल्हा",
    loc_near_me: "📍 माझ्या जवळ",
    loc_show_npa: "उच्च-NPA पार्टनर दाखवा",
    loc_nearest_badge: "सर्वात जवळ",
    loc_call: "📞 कॉल करा",
    loc_directions: "➤ मार्ग",
    loc_btn_send_app: "या पार्टनरकडे माझा अर्ज पाठवा",

    // Application Modal
    modal_app_title: "अर्ज डॉसियर तयार झाले आहे",
    modal_app_sub: "तुमचा कर्ज अर्ज बँक शाखेत सादर करण्यासाठी तयार आहे.",
    modal_ref_lbl: "अर्ज संदर्भ क्रमांक (Reference No.)",
    modal_partner_lbl: "निवडलेला चॅनल पार्टनर",
    modal_scheme_lbl: "सवलतीची कर्ज योजना",
    modal_amount_lbl: "मागणी केलेली कर्ज रक्कम",
    modal_applicant_lbl: "अर्जदार प्रोफाइल",
    modal_next_title: "बँक शाखेतील पुढील पायऱ्या",
    modal_step_1: "1. तुमचा तयार झालेला संदर्भ क्रमांक नोंदवून ठेवा.",
    modal_step_2: "2. आधार कार्ड, SC जातीचा दाखला आणि उत्पन्नाचा दाखला सोबत ठेवा.",
    modal_step_3: "3. पुढील प्रक्रियेसाठी या शाखेतील नोडल चॅनल फायनान्स / कृषी-एसएमई अधिकाऱ्यास भेटा.",
    modal_btn_print: "प्रिंट / सारांश डाउनलोड करा",
    modal_btn_done: "पूर्ण / बंद करा",
    modal_submitted_badge: "अर्ज तयार आणि रांगेत दाखल",

    // Checklist
    chk_tag: "📄 अधिकृत कागदपत्रे",
    chk_title: "कागदपत्रांची यादी (Checklist)",
    chk_sub: "बँकेत जाण्यापूर्वी ही सर्व आवश्यक कागदपत्रे गोळा करा.",
    chk_print: "प्रिंट / PDF सेव्ह करा 🖨️",
    chk_mandatory: "प्रत्येक योजनेसाठी अनिवार्य कागदपत्रे",

    // Chatbot
    chat_title: "साथी AI ला विचारा",
    chat_sub: "शासकीय योजना AI सहाय्यक",
    chat_ph: "योजना, ईएमआय किंवा बँक शाखांबद्दल विचारा…",
    chat_send: "पाठवा",
    chat_thinking: "साथी AI अचूक योजना शोधत आहे…",
    chat_suggested: "💡 सुचवलेले प्रश्न:",
  },

  gu: {},
  ta: {},
  te: {},
  bn: {},
  kn: {},
};

// Fallback logic for languages to inherit English
["gu", "ta", "te", "bn", "kn"].forEach((l) => {
  TRANSLATIONS[l as Language] = { ...TRANSLATIONS.en };
});

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("schemesaathi_lang") as Language | null;
    if (saved && TRANSLATIONS[saved]) {
      setLangState(saved);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      localStorage.setItem("schemesaathi_lang", l);
    } catch {}
  };

  const t = (key: string): string => {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.en;
    if (dict[key]) return dict[key];
    if (TRANSLATIONS.en[key]) return TRANSLATIONS.en[key];
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}
