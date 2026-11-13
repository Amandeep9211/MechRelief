import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, useTheme } from '../../constants/theme';
import { useTabBarStyle } from '../../components/ui';
import { slideTransition } from '../../components/tabTransition';

// Neeche wali 4 tabs. Har tab ek file hai is folder mein (index, bookings, track, profile).
const tab = (title, icon) => ({
  title,
  tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={icon} size={size} color={color} />,
});

export default function TabsLayout() {
  useTheme();
  const tabBarStyle = useTabBarStyle(); // floating, sticky, curved navbar

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        ...slideTransition,
        lazy: false, // sab tabs pehle se load, taake pehli baar bhi slide ho
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: colors.navInactive,
        tabBarHideOnKeyboard: true,
        tabBarStyle,
        tabBarItemStyle: { borderRadius: 24 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={tab('Home', 'home')} />
      <Tabs.Screen name="bookings" options={tab('Bookings', 'calendar-month-outline')} />
      <Tabs.Screen name="track" options={tab('Track', 'map-marker-outline')} />
      <Tabs.Screen name="profile" options={tab('Profile', 'account-outline')} />
    </Tabs>
  );
}
