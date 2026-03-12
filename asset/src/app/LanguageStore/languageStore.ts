// src/store/languageStore.ts
import { create } from "zustand";

export interface LanguageOption {
  value: string;
  label: string;
}

interface LanguageState {
  selectedLanguage: LanguageOption;
  languageOptions: LanguageOption[];
  setLanguage: (value: string) => void;
}

const languageOptions: LanguageOption[] = [
  { value: "oro", label: "Oromo" },
  { value: "en", label: "English" },
  { value: "am", label: "Amharic" },
  { value: "kor", label: "Korean" },
  { value: "chn", label: "Chinese" },
];

export const useLanguageStore = create<LanguageState>((set) => ({
  selectedLanguage: languageOptions[1], // English by default
  languageOptions,
  setLanguage: (value) => {
    const newLanguage = languageOptions.find((opt) => opt.value === value);
    if (newLanguage) {
      set({ selectedLanguage: newLanguage });
    }
  },
}));
