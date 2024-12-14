import { Stack } from 'expo-router/stack';
import { PaperProvider } from 'react-native-paper';
import { SessionProvider } from '@/contexts/AuthContext';
export default function Layout() {
  return (
    <PaperProvider>
    <SessionProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </SessionProvider>
    </PaperProvider>
  );
}
