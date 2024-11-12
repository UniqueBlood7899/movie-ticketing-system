//src/stores/auth.tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type AuthStore = {
  token: string | null
  user: any | null
  role: 'user' | 'admin' | null
  setAuth: (token: string, user: any, role: 'user' | 'admin') => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setAuth: (token, user, role) => set({ token, user, role }),
      logout: () => set({ token: null, user: null, role: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)