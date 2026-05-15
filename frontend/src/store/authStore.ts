import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authService, User } from '../services/auth';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        const { user, token } = await authService.login(email, password);
        localStorage.setItem('auth_token', token);
        set({ user, token, isAuthenticated: true });
      },

      logout: async () => {
        try {
          await authService.logout();
        } finally {
          localStorage.removeItem('auth_token');
          set({ user: null, token: null, isAuthenticated: false });
        }
      },

      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
