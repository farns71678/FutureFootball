import { TeamTrio } from '@/user/teamTrio';
import { deleteItemAsync, getItem, setItem } from 'expo-secure-store';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type Profile = {
  name: string;
  email: string;
  picture?: Uint8Array;
};

type User = {
  profile: Profile;
  nflPicks?: TeamTrio;
  ncaaPicks?: TeamTrio;
  picksFinalized: boolean;
};

type UserState = {
  user: User | null;
  userToken: string | null;
  shouldCreateAccount: boolean;
  login: () => void;
  logout: () => void;
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      userToken: null,
      shouldCreateAccount: false,
      login: () => {
        set((state) => {
          return {
            ...state,
            loggedIn: true,
          };
        });
      },
      logout: () => {
        set((state) => {
          return {
            ...state,
            loggedIn: true,
          };
        });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    }
  )
);
