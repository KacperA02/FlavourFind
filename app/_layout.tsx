import { Stack } from 'expo-router/stack';
import { PaperProvider } from 'react-native-paper';
import { SessionProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavouriteContext';
export default function Layout() {
  return (
    <PaperProvider>
    <SessionProvider>
      {/* favourites provider wrapped all tabs to keep the pages to date asyncoursly */}
      <FavoritesProvider>
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </FavoritesProvider>
    </SessionProvider>
    </PaperProvider>
  );
}
