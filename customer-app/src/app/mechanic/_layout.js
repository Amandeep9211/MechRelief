import { Stack } from 'expo-router';
import { colors, useTheme } from '../../constants/theme';

// Mechanic (worker) ka hissa: neeche tabs (Dashboard, Jobs, Profile) aur upar se khulne wali screens (request, job).
export default function MechanicLayout() {
  useTheme();
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />;
}
