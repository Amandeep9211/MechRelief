import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../../../constants/theme';
import { WORKER } from '../../../data/mock';
import { useApp } from '../../../state/AppState';
import { Page, Header, Avatar, Card, Row, Pill, Divider, ConfirmModal, SectionTitle, AppearanceRow } from '../../../components/ui';

export default function MechanicProfile() {
  useTheme();
  const router = useRouter();
  const { wHistory } = useApp();
  const [logout, setLogout] = useState(false);

  return (
    <Page tabbed header={<Header title="Profile" hideBack />}>
      <Card style={s.top}>
        <Avatar name={WORKER.name} size={68} />
        <View style={{ flex: 1 }}>
          <Text style={s.name}>{WORKER.name}</Text>
          <Text style={s.sub}>{WORKER.role} ({WORKER.code})</Text>
          <View style={{ marginTop: 6 }}><Pill text="CNIC verified" tone="green" icon="shield-check" /></View>
        </View>
      </Card>

      <View style={s.stats}>
        <View style={s.stat}><Text style={s.num}>{WORKER.jobs + wHistory.length - 5}</Text><Text style={s.lbl}>Total jobs</Text></View>
        <View style={s.stat}><View style={s.rate}><Icon name="star" size={16} color={colors.amber} /><Text style={s.num}>{WORKER.rating}</Text></View><Text style={s.lbl}>Rating</Text></View>
        <View style={s.stat}><Text style={s.num}>{WORKER.joined}</Text><Text style={s.lbl}>Joined</Text></View>
      </View>

      <SectionTitle>Assigned categories</SectionTitle>
      <Card>
        {WORKER.categories.map((c) => (
          <View key={c} style={s.cat}><Icon name="check-circle-outline" size={20} color={colors.green} /><Text style={s.catText}>{c}</Text></View>
        ))}
        <Divider />
        <Text style={s.note}>Categories are assigned by the admin when your account is registered. Contact the admin to change them.</Text>
      </Card>

      <SectionTitle>Account</SectionTitle>
      <Card>
        <Row label="Phone" value={WORKER.phone} />
        <Row label="Account type" value="Worker (admin registered)" />
      </Card>

      <SectionTitle>Appearance</SectionTitle>
      <AppearanceRow />

      <Pressable style={s.logout} onPress={() => setLogout(true)}>
        <Icon name="logout" size={20} color={colors.redText} />
        <Text style={s.logoutText}>Log out</Text>
      </Pressable>

      <ConfirmModal
        visible={logout} icon="logout" title="Log out?" message="You will stop receiving requests until you sign in again."
        confirmText="Log out" cancelText="Stay signed in"
        onCancel={() => setLogout(false)} onConfirm={() => { setLogout(false); router.replace('/login'); }}
      />
    </Page>
  );
}

const s = themed((colors) => ({
  top: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  name: { color: colors.text, fontSize: 20, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 13.5, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  num: { color: colors.orangeText, fontSize: 18, fontWeight: '800' },
  rate: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lbl: { color: colors.muted, fontSize: 11.5, marginTop: 3 },
  cat: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  catText: { color: colors.text, fontSize: 15 },
  note: { color: colors.muted, fontSize: 12.5, lineHeight: 18 },
  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 50, borderRadius: radius.pill, marginTop: 22, backgroundColor: colors.redSoft, borderWidth: 1, borderColor: 'rgba(229,50,45,0.5)' },
  logoutText: { color: colors.redText2, fontSize: 16, fontWeight: '700' },
}));
