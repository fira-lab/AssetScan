import { create } from "zustand";

interface ColorModeState {
  colorMode: "light" | "dark";
  toggleColorMode: () => void;
}

export const useColorMode = create<ColorModeState>((set) => ({
  colorMode: "light",
  toggleColorMode: () =>
    set((state) => ({
      colorMode: state.colorMode === "light" ? "dark" : "light",
    })),
}));
