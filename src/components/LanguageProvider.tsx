"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// A simple dictionary for UI strings. 
// Note: Database content (like character names, clues) will come directly from the DB fields (nameAr / nameEn).
const dictionary = {
  ar: {
    "lobby.title": "لغز في المعرض المغلق",
    "lobby.subtitle": "ملف القضية #0482",
    "lobby.description": "تمت سرقة تحفة فنية. اختفى أمين المعرض. انقطعت الكهرباء، واجتمع المشتبه بهم في الردهة.",
    "lobby.enter_code": "أدخل رمز الدخول",
    "lobby.validate": "التحقق من البيانات",
    "lobby.start_case": "بدء القضية",
    "lobby.suspects": "المشتبه بهم",
    "lobby.players": "لاعبين",
    "lobby.waiting": "في انتظار المضيف لبدء التحقيق...",
    "lobby.note": "ملاحظة شخصية: لا تثق بأمين المعرض. رأيته يحمل المفتاح الرئيسي بالقرب من الجناح الشمالي...",
    "character.threat_level": "مستوى التهديد: أحمر",
    "character.active_suspect": "مشتبه به نشط",
    "character.high_priority": "أولوية قصوى",
    "character.public_profile": "الملف العام",
    "character.hidden_motive": "الدافع الخفي",
    "character.secret_alibi": "الحجة السرية",
    "character.return_evidence": "العودة لسجل الأدلة",
    "character.pass_device": "قم بتمرير الجهاز إلى",
    "character.i_am": "أنا",
    "character.hold_reveal": "اضغط مطولاً للكشف عن الهوية",
    "evidence.board": "لوحة الأدلة",
    "evidence.classified": "نتائج سرية من مسرح الجريمة. قم بربط العناصر لبناء التسلسل الزمني.",
    "evidence.field_intel": "ذكاء ميداني",
    "nav.lobby": "الردهة",
    "nav.dashboard": "الملف",
    "nav.evidence": "الأدلة",
    "lobby.mainHeading": "اختر وضع اللعبة",
    "lobby.offlineMode": "لعب دون اتصال (محلي)",
    "lobby.offlineDesc": "قم بتمرير الجهاز بين الأصدقاء في نفس المكان.",
    "lobby.hostOnline": "استضافة لعبة عبر الإنترنت",
    "lobby.hostDesc": "أنشئ غرفة وشارك الرمز مع أصدقائك.",
    "lobby.joinOnline": "الانضمام للعبة عبر الإنترنت",
    "lobby.joinDesc": "أدخل الرمز للانضمام إلى غرفة موجودة.",
    "lobby.minPlayers": "مطلوب 3 لاعبين على الأقل.",
    "lobby.enterName": "أدخل اسمك",
    "lobby.back": "رجوع",
    "lobby.enterPlayerNames": "أدخل أسماء اللاعبين",
    "lobby.playerPlaceholder": "لاعب",
    "lobby.judgeOption": "القاضي؟",
    "lobby.addPlayer": "+ إضافة لاعب",
    "lobby.generatingCase": "جاري إنشاء القضية...",
    "lobby.startOfflineGame": "بدء اللعبة محلياً",
    "lobby.hostGameTitle": "استضافة لعبة",
    "lobby.joinGameTitle": "الانضمام للعبة",
    "lobby.yourNameLabel": "اسمك",
    "lobby.joinCodeLabel": "رمز الانضمام",
    "lobby.joinCodePlaceholder": "XXXXXX",
    "lobby.processing": "جاري المعالجة...",
    "lobby.createLobbyBtn": "إنشاء غرفة",
    "lobby.joinLobbyBtn": "الانضمام للغرفة"
  },
  en: {
    "lobby.title": "A Crime at the Closed Gallery",
    "lobby.subtitle": "Case File #0482",
    "lobby.description": "A masterpiece stolen. A curator missing. The lights are out, and the suspects are gathered in the foyer.",
    "lobby.enter_code": "Enter Access Code",
    "lobby.validate": "VALIDATE CREDENTIALS",
    "lobby.start_case": "START CASE",
    "lobby.suspects": "The Suspects",
    "lobby.players": "PLAYERS",
    "lobby.waiting": "Waiting for host to initiate the investigation...",
    "lobby.note": "NOTE TO SELF: Don't trust the Curator. I saw him with the master key near the North Wing...",
    "character.threat_level": "Threat Level: RED",
    "character.active_suspect": "Active Suspect",
    "character.high_priority": "HIGH PRIORITY",
    "character.public_profile": "Public Profile",
    "character.hidden_motive": "Hidden Motive",
    "character.secret_alibi": "Secret Alibi",
    "character.return_evidence": "RETURN TO EVIDENCE LOG",
    "character.pass_device": "Pass the device to",
    "character.i_am": "I am",
    "character.hold_reveal": "Hold to Reveal Identity",
    "evidence.board": "Evidence Board",
    "evidence.classified": "Classified findings from the scene. Cross-reference items to build your timeline.",
    "evidence.field_intel": "Field Intelligence",
    "nav.lobby": "Lobby",
    "nav.dashboard": "Dashboard",
    "nav.evidence": "Evidence",
    "lobby.mainHeading": "Choose Game Mode",
    "lobby.offlineMode": "Play Offline (Local)",
    "lobby.offlineDesc": "Pass-and-play on a single device with friends.",
    "lobby.hostOnline": "Host Online Game",
    "lobby.hostDesc": "Create a lobby and share the code.",
    "lobby.joinOnline": "Join Online Game",
    "lobby.joinDesc": "Enter a code to join an existing lobby.",
    "lobby.minPlayers": "Minimum 3 players required.",
    "lobby.enterName": "Enter your name",
    "lobby.enterCode": "Enter join code",
    "lobby.back": "Back",
    "lobby.enterPlayerNames": "Enter Player Names",
    "lobby.playerPlaceholder": "Player",
    "lobby.judgeOption": "Judge?",
    "lobby.addPlayer": "+ Add Player",
    "lobby.generatingCase": "GENERATING CASE...",
    "lobby.startOfflineGame": "START OFFLINE GAME",
    "lobby.hostGameTitle": "Host Game",
    "lobby.joinGameTitle": "Join Game",
    "lobby.yourNameLabel": "Your Name",
    "lobby.joinCodeLabel": "Join Code",
    "lobby.joinCodePlaceholder": "XXXXXX",
    "lobby.processing": "PROCESSING...",
    "lobby.createLobbyBtn": "CREATE LOBBY",
    "lobby.joinLobbyBtn": "JOIN LOBBY"
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage for saved preference
    const savedLang = localStorage.getItem("app-lang") as Language;
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguage(savedLang);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = language;
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      localStorage.setItem("app-lang", language);
    }
  }, [language, mounted]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "ar" ? "en" : "ar"));
  };

  const t = (key: string) => {
    return dictionary[language]?.[key as keyof typeof dictionary["en"]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {!mounted ? (
        <div style={{ visibility: "hidden" }}>{children}</div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
