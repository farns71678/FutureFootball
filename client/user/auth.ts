import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// todo: in ios the storage will persist accross app installation. Needs to be taken into account

const storageKey = 'user_token';

const authUser = async (token: string) => {
  const res = await fetch('auth/login', { method: 'POST', headers: { token: token } });

  if (res.ok) {
    return await res.json();
  } else {
  }
};

const login = async () => {
  if (Platform.OS !== 'web') {
    const token = await SecureStore.getItemAsync(storageKey);

    if (token) {
    } else {
    }
  } else {
  }
};

const deleteToken = async () => {
  return await SecureStore.deleteItemAsync(storageKey);
};

const saveToken = async (token: string) => {
  if (Platform.OS !== 'web') {
  } else {
  }
};

const Auth = { login, saveToken };

export default Auth;
