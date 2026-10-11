import { create } from 'zustand';
import { User } from 'firebase/auth';

/**
 * @fileOverview Forge OS Global Auth Store
 * Manages user session and profile state across the mesh.
 */

interface AuthState {
  user: User | null;
  profile: any | null;
  isReady: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: any) => void;
  setReady: (ready: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  isReady: false,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setReady: (ready) => set({ isReady: ready }),
}));
