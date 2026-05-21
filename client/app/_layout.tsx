import { useAuthStore } from '@/utils/authStore';
import { Stack } from 'expo-router';

export default function RootLayout() {
  const { user, dataLoaded } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={user !== null}>
        {/* <Stack.Screen name="index" /> */}
        <Stack.Protected guard={dataLoaded}>
          <Stack.Screen name="index" />
        </Stack.Protected>
        <Stack.Protected guard={user !== null && !user.picksFinalized}>
          <Stack.Screen name="launchpad" />
          <Stack.Screen name="teamSelect" />
          <Stack.Screen name="teamAddModal" options={{ presentation: 'modal' }} />
        </Stack.Protected>
        <Stack.Protected guard={user !== null && user.picksFinalized}>
          <Stack.Screen name="home" />
        </Stack.Protected>
      </Stack.Protected>
      <Stack.Protected guard={user === null}>
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
      </Stack.Protected>
    </Stack>
  );
}
