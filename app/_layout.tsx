import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Redirect, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '../hooks/use-color-scheme';
import {AppProviders} from '../src/shared/providers/app-providers';
import {useAuthStore} from '../src/shared/stores/auth.store';

export const unstable_settings = {
  anchor: '(tabs)'
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const accessToken = useAuthStore(s => s.accessToken);
  const isBootstrapping = useAuthStore(s => s.isBootstrapping);

  const isAuthed = !!accessToken;
  const authedHref = '/(tabs)' as any;
  const unauthedHref = '/(auth)/login' as any;

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {isBootstrapping ? null : isAuthed ? (
          <Redirect href={authedHref} />
        ) : (
          <Redirect href={unauthedHref} />
        )}
        <Stack>
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
          <Stack.Screen
            name="modal"
            options={{presentation: 'modal', title: 'Modal'}}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProviders>
  );
}
