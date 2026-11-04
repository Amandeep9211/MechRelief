import { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../constants/theme';
import SplashScreen from '../components/SplashScreen';
import { AppProvider } from '../state/AppState';

// Root layout: poori app ka "frame". Stack = screens ek ke upar ek (push/pop).
// Har app launch par pehle animated splash chalti hai, uske baad Stack (Welcome) aata hai.
// AppProvider = poori app ki shared yaaddasht (user, chalti request, history).
export default function RootLayout() {
  const [splashDone, setSplashDone] = useState(false);

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
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      />
    </AppProvider>
  );
}
