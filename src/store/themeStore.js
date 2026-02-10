import { create } from 'zustand'

/**
 * Store de tema con Zustand
 */
export const useThemeStore = create((set) => ({
  isDark: false,
  
  setIsDark: (isDark) => set({ isDark }),
  
  toggleTheme: () =>
    set((state) => ({
      isDark: !state.isDark,
    })),
}))
