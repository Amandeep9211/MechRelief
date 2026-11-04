import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, radius } from '../constants/theme';
import { useApp } from '../state/AppState';
import { Page, Header } from '../components/ui';

export default function Notifications() {
  const { notifications, markAllRead } = useApp();
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <Page
      header={<Header title="Notifications" subtitle={unread ? `${unread} new` : 'All caught up'}
        right={unread ? <Pressable onPress={markAllRead}><Text style={s.mark}>Mark all read</Text></Pressable> : null} />}
    >
      {notifications.map((n) => (
        <View key={n.id} style={[s.item, n.unread && s.unread]}>
          <View style={s.icon}><Icon name={n.icon} size={22} color={colors.orange} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{n.title}</Text>
            <Text style={s.body}>{n.body}</Text>
            <Text style={s.time}>{n.time}</Text>
          </View>
          {n.unread ? <View style={s.dot} /> : null}
        </View>
      ))}
    </Page>
  );
}

const s = StyleSheet.create({
  mark: { color: colors.orange, fontSize: 13, fontWeight: '700' },
  item: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  unread: { borderColor: 'rgba(255,122,26,0.4)', backgroundColor: 'rgba(255,122,26,0.05)' },
  icon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  body: { color: '#AAB4C0', fontSize: 13, marginTop: 3, lineHeight: 18 },
  time: { color: '#6E7782', fontSize: 11.5, marginTop: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orangeDark, marginTop: 4 },
});
