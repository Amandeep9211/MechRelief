import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../constants/theme';
import { useTabBarStyle } from '../../../components/ui';
import { slideTransition } from '../../../components/tabTransition';

const tab = (title, icon) => ({
  title,
  tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name={icon} size={size} color={color} />,
});

export default function MechanicTabs() {
  const tabBarStyle = useTabBarStyle();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        ...slideTransition,
        lazy: false, // sab tabs pehle se load, taake pehli baar bhi slide ho
        tabBarActiveTintColor: colors.orange,
        tabBarInactiveTintColor: '#AEB7C2',
        tabBarHideOnKeyboard: true,
        tabBarStyle,
        tabBarItemStyle: { borderRadius: 24 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        sceneStyle: { backgroundColor: colors.bg },
      }}
    >
      <Tabs.Screen name="index" options={tab('Dashboard', 'view-dashboard-outline')} />
      <Tabs.Screen name="jobs" options={tab('My Jobs', 'clipboard-text-clock-outline')} />
      <Tabs.Screen name="profile" options={tab('Profile', 'account-outline')} />
    </Tabs>
  );
}
