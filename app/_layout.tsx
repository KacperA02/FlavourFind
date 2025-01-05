import { Stack } from 'expo-router/stack';
import { PaperProvider,DefaultTheme } from 'react-native-paper';
import { SessionProvider } from '@/contexts/AuthContext';
import { FavoritesProvider } from '@/contexts/FavouriteContext';
// theme for the app using react-native-paper. Making sure the phone is the same as the website version
const theme = {
  ...DefaultTheme,
  dark: true, 
  colors: {
    ...DefaultTheme.colors,
    primary: '#007BFF',
    accent: '#FFC107',
  },
};
export default function Layout() {
  return (
    <PaperProvider theme={theme}>
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
