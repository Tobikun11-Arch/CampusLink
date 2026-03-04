import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Redirect, Stack} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';

import {useColorScheme} from '../hooks/use-color-scheme';
import {AppProviders} from '../src/shared/providers/app-providers';
import {useAuthStore} from '../src/shared/stores/auth.store';
import {useOnboardingStore} from '../src/shared/stores/onboarding.store';

export const unstable_settings = {
  anchor: '(tabs)'
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const accessToken = useAuthStore(s => s.accessToken);
  const isBootstrapping = useAuthStore(s => s.isBootstrapping);
  const hasSeenGetStarted = useOnboardingStore(s => s.hasSeenGetStarted);
  const isOnboardingBootstrapping = useOnboardingStore(s => s.isBootstrapping);

  const isAuthed = !!accessToken;
  const authedHref = '/(tabs)' as any;
  const unauthedHref = '/(auth)/login' as any;
  const onboardingHref = '/(onboarding)/get-started' as any;
  const isReady = !isBootstrapping && !isOnboardingBootstrapping;

  return (
    <AppProviders>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {!isReady ? null : isAuthed ? (
          <Redirect href={authedHref} />
        ) : hasSeenGetStarted ? (
          <Redirect href={unauthedHref} />
        ) : (
          <Redirect href={onboardingHref} />
        )}
        <Stack>
          <Stack.Screen name="(auth)" options={{headerShown: false}} />
          <Stack.Screen name="(onboarding)" options={{headerShown: false}} />
          <Stack.Screen name="(tabs)" options={{headerShown: false}} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProviders>
  );
}
