import { Stack } from 'expo-router';
import { useAuthStore } from './utils/authStore';

export default function RootLayout() {
  const { user, shouldCreateAccount } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user !== null}>
        <Stack.Screen name="index" />
        <Stack.Screen name="launchpad" />
        <Stack.Screen name="teamSelect" />
        <Stack.Screen name="home" />
        <Stack.Screen name="teamAddModal" options={{ presentation: 'modal' }} />
      </Stack.Protected>
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Protected guard={shouldCreateAccount}>
          <Stack.Screen name="(auth)/signup" />
        </Stack.Protected>
      </Stack.Protected>
    </Stack>
  );
}
