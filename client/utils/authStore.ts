import { UserDB } from '@/user/db-types';
import { createTrio, TeamTrio } from '@/user/teamTrio';
import { deleteItemAsync, getItem, setItem } from 'expo-secure-store';
import { Platform } from 'react-native';
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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, name: string, password: string) => Promise<void>;
  logout: () => void;
};

const webStorageHandler = {
  setItem: (key: string, val: string) => {
    localStorage.setItem(key, val);
  },
  getItem: (key: string) => {
    return localStorage.getItem(key);
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

const mobileStorageHandler = {
  setItem,
  getItem,
  removeItem: deleteItemAsync,
};

const storageHandler = Platform.OS === 'web' ? webStorageHandler : mobileStorageHandler;

const userDBToUser = async (userData: UserDB) => {
  const nfl = userData.picks.picks.find((pick) => pick.league === 'NFL');
  const ncaa = userData.picks.picks.find((pick) => pick.league === 'NCAA');
  const nflTrio = nfl ? (await createTrio(nfl)) || undefined : undefined;
  const ncaaTrio = ncaa ? (await createTrio(ncaa)) || undefined : undefined;

  return {
    profile: {
      name: userData.name,
      email: userData.email,
      picture: userData.picture,
    },
    nflPicks: nflTrio,
    ncaaPicks: ncaaTrio,
    picksFinalized: userData.picks.finalized,
  };
};

export const useAuthStore = create(
  persist<UserState>(
    (set) => ({
      user: null,
      userToken: null,
      login: async (email: string, password: string) => {
        try {
          const res = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + 'auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();

          if (res.ok) {
            const user = await userDBToUser(data.user);
            set((state) => {
              return {
                ...state,
                user,
                userToken: data.token,
              };
            });
          } else {
            throw new Error(data.message || 'Unable to login');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Unable to login');
        }
      },
      signup: async (email: string, name: string, password: string) => {
        try {
          const res = await fetch(process.env.EXPO_PUBLIC_SERVER_URL + 'auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email: email.trim(), name: name.trim(), password }),
            headers: { 'Content-Type': 'application/json' },
          });

          const data = await res.json();

          if (res.ok) {
            const user = await userDBToUser(data.user);
            set((state) => {
              return {
                ...state,
                user,
                userToken: data.token,
              };
            });
          } else {
            throw new Error(data.message || 'Unable to login');
          }
        } catch (error) {
          console.error(error);
          throw new Error('Unable to signup');
        }
      },
      logout: () => {
        set((state) => {
          return {
            ...state,
            user: null,
            userToken: null,
          };
        });
      },
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => storageHandler),
    }
  )
);
