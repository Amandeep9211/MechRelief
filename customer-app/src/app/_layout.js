import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors, useTheme, ThemeProvider } from '../constants/theme';
import SplashScreen from '../components/SplashScreen';
import { AppProvider } from '../state/AppState';

// Root layout: poori app ka "frame". Stack = screens ek ke upar ek (push/pop).
// Har app launch par pehle animated splash chalti hai, uske baad Stack (Welcome) aata hai.
// ThemeProvider = dark/light theme ki yaaddasht. AppProvider = baaki shared yaaddasht (user, chalti request, history).
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}

function Shell() {
  const { isLight } = useTheme();
  const [splashDone, setSplashDone] = useState(false);

  // Splash hamesha dark rehti hai (brand intro), uske baad chuna hua theme lagta hai.
  if (!splashDone) {
    return (
      <>
        <StatusBar style="light" />
        <SplashScreen onFinish={() => setSplashDone(true)} />
      </>
    );
  }

  return (
    <AppProvider>
      <StatusBar style={isLight ? 'dark' : 'light'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </AppProvider>
  );
}
