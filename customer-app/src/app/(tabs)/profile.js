import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../state/AppState';
import { Page, Header, Avatar, Card, ConfirmModal, Pill } from '../../components/ui';

function Item({ icon, title, sub, onPress, right, danger }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.item, pressed && { opacity: 0.8 }]}>
      <View style={[s.itemIcon, danger && { backgroundColor: colors.redSoft }]}>
        <Icon name={icon} size={22} color={danger ? '#FF6B66' : colors.orange} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[s.itemTitle, danger && { color: '#FF8A85' }]}>{title}</Text>
        {sub ? <Text style={s.itemSub}>{sub}</Text> : null}
      </View>
      {right ?? <Icon name="chevron-right" size={22} color={colors.muted} />}
    </Pressable>
  );
}

export default function Profile() {
  const router = useRouter();
  const { user, history, notifications } = useApp();
  const [logout, setLogout] = useState(false);
  const done = history.filter((h) => h.status === 'completed').length;
  const unread = notifications.filter((n) => n.unread).length;

  return (
    <Page tabbed header={<Header title="Profile" hideBack />}>
      <Card style={s.top}>
        <Avatar name={user.name} size={68} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{user.name}</Text>
          <Text style={s.phone}>{user.phone}</Text>
          <View style={{ marginTop: 6 }}><Pill text="Customer account" tone="orange" icon="account-check-outline" /></View>
        </View>
        <Pressable onPress={() => router.push('/edit-profile')} style={s.edit}><Icon name="pencil-outline" size={20} color={colors.text} /></Pressable>
      </Card>

      <View style={s.stats}>
        <View style={s.stat}><Text style={s.statNum}>{done}</Text><Text style={s.statLbl}>Services done</Text></View>
        <View style={s.stat}><Text style={s.statNum}>{history.filter((h) => h.rating).length}</Text><Text style={s.statLbl}>Reviews given</Text></View>
        <View style={s.stat}><Text style={s.statNum}>1</Text><Text style={s.statLbl}>Saved car</Text></View>
      </View>

      <Text style={s.group}>Account</Text>
      <Item icon="car-outline" title="My car" sub={user.car} onPress={() => router.push('/edit-profile')} />
      <Item icon="shield-account-outline" title="Trusted contact (SOS)" sub={`${user.trusted.name}, ${user.trusted.phone}`} onPress={() => router.push('/trusted-contact')} />
      <Item
        icon="bell-outline" title="Notifications" sub="Updates about your requests" onPress={() => router.push('/notifications')}
        right={unread ? <View style={s.badge}><Text style={s.badgeText}>{unread}</Text></View> : undefined}
      />

      <Text style={s.group}>Support</Text>
      <Item icon="help-circle-outline" title="Help & support" sub="FAQs and how MechRelief works" onPress={() => router.push('/help')} />
      <Item icon="logout" title="Log out" danger onPress={() => setLogout(true)} right={<View />} />

      <Text style={s.ver}>MechRelief v1.0 (frontend demo)</Text>

      <ConfirmModal
        visible={logout} icon="logout" title="Log out?" message="You will need to sign in again with your phone number and password."
        confirmText="Log out" cancelText="Stay signed in"
        onCancel={() => setLogout(false)}
        onConfirm={() => { setLogout(false); router.replace('/login'); }}
      />
    </Page>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  phone: { color: colors.muted, fontSize: 13.5, marginTop: 2 },
  edit: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  statNum: { color: colors.orange, fontSize: 22, fontWeight: '800' },
  statLbl: { color: colors.muted, fontSize: 11.5, marginTop: 2 },
  group: { color: colors.muted, fontSize: 12.5, fontWeight: '700', letterSpacing: 1, marginTop: 22, marginBottom: 10, textTransform: 'uppercase' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  itemIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  itemTitle: { color: colors.text, fontSize: 15.5, fontWeight: '600' },
  itemSub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  badge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: colors.orangeDark, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  ver: { color: '#5E6670', fontSize: 12, textAlign: 'center', marginTop: 20 },
});
