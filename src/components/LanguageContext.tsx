'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggleLang: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  const toggleLang = useCallback(() => {
    setLang(prev => (prev === 'en' ? 'hi' : 'en'));
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Common translations used across the site
export const TRANSLATIONS = {
  hero: {
    badge: {
      en: "India's Public Consumer Complaint Registry",
      hi: "भारत की सार्वजनिक उपभोक्ता शिकायत रजिस्ट्री",
    },
    headline1: {
      en: 'Unresolved Issue?',
      hi: 'कोई समस्या अनसुलझी है?',
    },
    headline2: {
      en: 'Bring It to Light.',
      hi: 'इसे सबके सामने लाएं।',
    },
    subtext: {
      en: 'Document your complaint. Get a tracking token. Receive email updates. No login. No signup. Just transparency.',
      hi: 'शिकायत दर्ज करें। ट्रैकिंग टोकन पाएं। ईमेल अपडेट पाएं। कोई लॉगिन नहीं। कोई साइनअप नहीं। बस पारदर्शिता।',
    },
    ctaFile: {
      en: 'File a Complaint',
      hi: 'शिकायत दर्ज करें',
    },
    ctaTrack: {
      en: 'Track Your Complaint',
      hi: 'शिकायत ट्रैक करें',
    },
  },
} as const;

export function t(translations: { en: string; hi: string }, lang: Language): string {
  return translations[lang];
}
