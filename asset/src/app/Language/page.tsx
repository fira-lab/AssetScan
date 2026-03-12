// src/app/Language/page.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useColorMode } from "@/components/ui/color-mode";
import { useLanguageStore } from "../LanguageStore/languageStore";

export default function LanguagePage() {
  const { colorMode } = useColorMode();
  const { selectedLanguage, setLanguage, languageOptions } = useLanguageStore();

  const handleChange = (value: string) => {
    setLanguage(value);
    console.log("Language changed to:", value);
  };

  return (
    <Select onValueChange={handleChange} value={selectedLanguage?.value || ""}>
      <SelectTrigger
        className={`w-full ${
          colorMode === "light"
            ? "bg-white text-black border-gray-200"
            : "bg-black text-white border-gray-700"
        }`}
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent
        className={
          colorMode === "light"
            ? "bg-white text-black"
            : "bg-gray-900 text-white"
        }
      >
        {languageOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            className={colorMode === "light" ? "text-black" : "text-white"}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
