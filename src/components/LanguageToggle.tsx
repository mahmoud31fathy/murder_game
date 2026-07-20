"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 text-xs font-label-caps hover:bg-white/10 transition-colors"
      title={language === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
    >
      {language === 'ar' ? 'EN' : 'ع'}
    </button>
  );
}
