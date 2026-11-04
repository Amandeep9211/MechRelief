import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { useApp } from '../state/AppState';
import { Page, Header, Button, Card, Row, Pill } from '../components/ui';

// SOS (proposal): admin ko in-app alert + trusted contact ko live location ka SMS.
export default function Sos() {
  const router = useRouter();
  const { reason } = useLocalSearchParams();
  const { user, job } = useApp();
  const [sent, setSent] = useState(false);
  const codeMismatch = reason === 'code';

  if (sent) {
    return (
      <Page
        header={<Header title="SOS" />}
        footer={<Button title="Back to my request" onPress={() => router.back()} />}
      >
        <View style={s.center}>
          <View style={[s.circle, { backgroundColor: colors.green }]}><Icon name="check" size={50} color="#fff" /></View>
          <Text style={s.title}>Alert sent</Text>
          <Text style={s.sub}>Help is being arranged. Stay where you are, in a safe place if you can.</Text>
        </View>
        <Card style={{ marginTop: 18 }}>
          <Row label="Admin" value="Alerted in app" color={colors.green} />
          <Row label="SMS to trusted contact" value="Sent" color={colors.green} sub={`${user.trusted.name}, ${user.trusted.phone}`} />
          <Row label="Live location link" value="Shared" color={colors.green} />
          {job ? <Row label="Request" value={job.id} /> : null}
        </Card>
        <Text style={s.small}>The SMS goes through a local SMS gateway, so your contact receives it even without the MechRelief app.</Text>
      </Page>
    );
  }

  return (
    <Page
      header={<Header title="SOS Emergency" />}
      footer={<Button title="Cancel, I am okay" variant="ghost" onPress={() => router.back()} />}
    >
      <View style={s.center}>
        {codeMismatch ? <Pill text="Job code did not match" tone="red" icon="alert" /> : null}
        <Text style={s.title}>Do you need help?</Text>
        <Text style={s.sub}>Press and confirm. We alert the admin and text your trusted contact with your live location.</Text>

        <Pressable onPress={() => setSent(true)} style={({ pressed }) => [s.big, pressed && { transform: [{ scale: 0.97 }] }]}>
          <View style={s.ring2}><View style={s.ring1}><View style={s.core}>
            <Icon name="alarm-light" size={54} color="#fff" />
            <Text style={s.sosText}>SOS</Text>
          </View></View></View>
        </Pressable>
        <Text style={s.tap}>Tap to send alert</Text>
      </View>

      <Card style={{ marginTop: 20 }}>
        <View style={s.contact}>
          <View style={s.cIcon}><Icon name="shield-account" size={22} color={colors.orange} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.cLabel}>Trusted contact</Text>
            <Text style={s.cName}>{user.trusted.name}</Text>
            <Text style={s.cPhone}>{user.trusted.phone}</Text>
          </View>
          <Pressable onPress={() => router.push('/trusted-contact')}><Text style={s.change}>Change</Text></Pressable>
        </View>
      </Card>
    </Page>
  );
}

const s = StyleSheet.create({
  center: { alignItems: 'center', paddingTop: 10 },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  sub: { color: '#AAB4C0', fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 21, paddingHorizontal: 12 },
  circle: { width: 96, height: 96, borderRadius: 48, alignItems: 'center', justifyContent: 'center' },
  big: { marginTop: 28 },
  ring2: { width: 250, height: 250, borderRadius: 125, backgroundColor: 'rgba(229,50,45,0.1)', alignItems: 'center', justifyContent: 'center' },
  ring1: { width: 204, height: 204, borderRadius: 102, backgroundColor: 'rgba(229,50,45,0.2)', alignItems: 'center', justifyContent: 'center' },
  core: { width: 160, height: 160, borderRadius: 80, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', shadowColor: colors.red, shadowOpacity: 0.6, shadowRadius: 24, elevation: 14 },
  sosText: { color: '#fff', fontSize: 24, fontWeight: '900', letterSpacing: 3, marginTop: 2 },
  tap: { color: colors.muted, fontSize: 13, marginTop: 12 },
  small: { color: colors.muted, fontSize: 12.5, textAlign: 'center', marginTop: 14, lineHeight: 18 },
  contact: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,122,26,0.12)', alignItems: 'center', justifyContent: 'center' },
  cLabel: { color: colors.muted, fontSize: 12 },
  cName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  cPhone: { color: colors.muted, fontSize: 13 },
  change: { color: colors.orange, fontSize: 14, fontWeight: '700' },
});
