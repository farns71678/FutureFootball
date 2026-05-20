import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { User } from './db-types';

// todo: in ios the storage will persist accross app installation. Needs to be taken into account


type StorageHandler = {
  setKey: (key: string, val: string) => Promise<void>,
  getKey: (key: string) => Promise<string | null>,
  deleteKey: (key: string) => Promise<void>
};

const webStorageHandler: StorageHandler = {
  setKey: async (key: string, val: string) => {
    localStorage.setItem(key, val);
  },
  getKey: async (key: string) => {
    return await new Promise((resolve) => resolve(localStorage.getItem(key)));
  },
  deleteKey: async (key: string) => {
    localStorage.removeItem(key);
  }
};

const mobileStorageHandler: StorageHandler = {
  setKey: async (key: string, val: string) => {
    await SecureStore.setItemAsync(key, val);
  },
  getKey: async (key: string) => {
    const token = await SecureStore.getItemAsync(key);
    return token;
  },
  deleteKey: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  }
};

const storageHandler = Platform.OS === 'web' ? webStorageHandler : mobileStorageHandler;

const tokenKey = 'user_token';

const authUser = async (token: string): Promise<User | null> => {
  const res = await fetch('auth/login', { method: 'POST', headers: { 'token': token } });

  if (res.ok) {
    return (await res.json()) as User;
  }
  return null;
};

const login = async (): Promise<boolean> => {
  const token = await storageHandler.getKey(tokenKey);
  if (token) {
    const user = await authUser(token);
    return user ? true : false;
  }
  return false;
};

const deleteToken = async () => {
  await storageHandler.deleteKey(tokenKey);
};

const saveToken = async (token: string) => {
  await storageHandler.setKey(tokenKey, token);
};

const Auth = { login, saveToken, deleteToken };

export default Auth;
