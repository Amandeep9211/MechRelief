import { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../constants/categories';
import { describeAnswers } from '../data/categoryConfig';
import { colors, radius, themed, useTheme } from '../constants/theme';
import { useApp } from '../state/AppState';
import { money } from '../utils/format';
import { Page, Header, Button, Card, SectionTitle, Row, Divider, Pill, Input, FieldLabel } from '../components/ui';

// Advance payment: total ka 15% abhi online (JazzCash sandbox), baqi 85% cash kaam ke baad.
export default function Payment() {
  useTheme();
  const router = useRouter();
  const { draft, user, createJob } = useApp();
  const [phone, setPhone] = useState(user.phone);
  const [busy, setBusy] = useState(false);

  if (!draft?.price) {
    return <Page header={<Header title="Payment" />}><Text style={{ color: colors.muted }}>Please fill in the booking form first.</Text></Page>;
  }
  const cat = CATEGORIES.find((c) => c.id === draft.categoryId);
  const p = draft.price;

  const pay = () => {
    setBusy(true);
    // Backend step: yahan JazzCash sandbox API call hogi. Abhi 1.4 second ka nakli intezaar.
    setTimeout(() => {
      createJob();
      setBusy(false);
      router.replace('/job-confirmed');
    }, 1400);
  };

  return (
    <Page
      header={<Header title="Confirm & Pay" subtitle="Step 2 of 2" />}
      footer={<Button title={busy ? 'Processing...' : `Pay ${money(p.advance)} Advance`} icon={busy ? undefined : 'lock-outline'} onPress={pay} disabled={busy} />}
    >
      <Card>
        <View style={s.head}>
          <View style={s.icon}><Icon name={cat.icon} size={26} color={colors.orange} /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>{cat.fullName}</Text>
            <Text style={s.sub}>{draft.car}</Text>
          </View>
          {draft.emergency ? <Pill text="EMERGENCY" tone="red" icon="alert" /> : null}
        </View>
        <Divider />
        <Row label="Location" value={draft.location || 'Current location'} />
        {describeAnswers(draft.categoryId, draft.answers).map((l) => <Row key={l.label} label={l.label} value={l.value} />)}
      </Card>

      <SectionTitle>Price</SectionTitle>
      <Card>
        {p.part > 0 ? <Row label={p.partLabel} value={money(p.part)} /> : null}
        <Row label={p.serviceLabel} value={money(p.service)} />
        <Row label="Distance charge" sub={`${p.km} km x Rs ${p.perKm} per km`} value={money(p.distance)} />
        {p.emergency > 0 ? <Row label="Emergency charge" sub="Priority dispatch" value={money(p.emergency)} color={colors.red} /> : null}
        <Divider />
        <Row label="Total" value={money(p.total)} bold />
        <Row label="Advance now (15%)" value={money(p.advance)} color={colors.orange} bold />
        <Row label="Cash after job (85%)" value={money(p.cash)} />
      </Card>
      {p.note ? <Text style={s.priceNote}>{p.note}</Text> : null}

      <SectionTitle>Pay advance with</SectionTitle>
      <Card style={{ borderColor: colors.orange }}>
        <View style={s.head}>
          <View style={[s.icon, { backgroundColor: '#E8412C' }]}><Text style={s.jc}>J</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={s.title}>JazzCash</Text>
            <Text style={s.sub}>Mobile wallet</Text>
          </View>
          <Pill text="Test mode" tone="gray" />
        </View>
        <FieldLabel>JazzCash mobile number</FieldLabel>
        <Input icon="phone-outline" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
      </Card>

      <View style={s.note}>
        {busy ? <ActivityIndicator color={colors.orange} /> : <Icon name="shield-check-outline" size={20} color={colors.green} />}
        <Text style={s.noteText}>
          {busy ? 'Waiting for JazzCash confirmation...' : 'The advance is refunded if you cancel while your request is still in the queue. The rest is paid in cash and confirmed by both of you in the app.'}
        </Text>
      </View>
    </Page>
  );
}

const s = themed((colors) => ({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  jc: { color: colors.onAccent, fontWeight: '900', fontSize: 20 },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  sub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  priceNote: { color: colors.muted, fontSize: 12.5, lineHeight: 18, marginTop: 10 },
  note: { flexDirection: 'row', gap: 10, alignItems: 'center', marginTop: 16, padding: 12, borderRadius: radius.md, backgroundColor: colors.greenSoft },
  noteText: { flex: 1, color: colors.greenText, fontSize: 12.5, lineHeight: 18 },
}));
