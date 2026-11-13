import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../../constants/theme';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';
import MapPreview from '../../components/MapPreview';
import { Page, Header, Button, Card, Row, Divider, Pill, SectionTitle, ConfirmModal } from '../../components/ui';

const ETAS = [10, 15, 20, 30];

// Direct assignment (proposal): request seedha is worker ko aati hai; worker "acknowledge" karke ETA batata hai.
export default function Request() {
  useTheme();
  const router = useRouter();
  const { wRequest: r, acceptRequest, rejectRequest } = useApp();
  const [eta, setEta] = useState(15);
  const [rejectOpen, setRejectOpen] = useState(false);

  if (!r) {
    return (
      <Page header={<Header title="Request" fallback="/mechanic" />}>
        <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 60 }}>No pending request.</Text>
        <Button title="Back to Dashboard" onPress={() => router.replace('/mechanic')} style={{ marginTop: 20 }} />
      </Page>
    );
  }

  return (
    <Page
      header={<Header title="New Request" subtitle={r.id} fallback="/mechanic" right={r.emergency ? <Pill text="EMERGENCY" tone="red" icon="alert" /> : null} />}
      footer={
        <View style={{ gap: 10 }}>
          <Button title={`Acknowledge, arrive in ${eta} min`} icon="check-circle-outline" onPress={() => { acceptRequest(eta); router.replace('/mechanic/job'); }} />
          <Button title="Decline request" variant="ghost" small onPress={() => setRejectOpen(true)} />
        </View>
      }
    >
      <MapPreview height={170} route label={`${r.km} km from you`} />

      <Card style={{ marginTop: 14 }}>
        <Text style={s.title}>{r.title}</Text>
        <Text style={s.issue}>{r.issue}</Text>
        {r.note ? <Text style={s.note}>"{r.note}"</Text> : null}
        <Divider />
        <Row label="Customer" value={r.customer} />
        <Row label="Car" value={r.car} />
        <Row label="Location" value={r.location} />
        <Row label="Distance" value={`${r.km} km`} />
      </Card>

      <SectionTitle>Fare</SectionTitle>
      <Card>
        <Row label="Service charge" value={money(r.service)} />
        <Row label="Distance charge" value={money(r.distance)} />
        <Divider />
        <Row label="Total fare" value={money(r.total)} bold color={colors.orange} />
        <Row label="Advance paid online (15%)" value={money(r.advance)} />
        <Row label="Cash to collect (85%)" value={money(r.cash)} />
      </Card>

      <SectionTitle>When can you reach?</SectionTitle>
      <View style={s.etas}>
        {ETAS.map((m) => (
          <Pressable key={m} onPress={() => setEta(m)} style={[s.eta, eta === m && s.etaOn]}>
            <Text style={[s.etaNum, eta === m && { color: colors.orangeText }]}>{m}</Text>
            <Text style={s.etaLbl}>min</Text>
          </Pressable>
        ))}
      </View>
      <Text style={s.hint}>The customer sees this arrival time as soon as you acknowledge.</Text>

      <ConfirmModal
        visible={rejectOpen} danger icon="close-circle-outline" title="Decline this request?" message="The request will go back to the admin. Declining often can affect your availability score."
        confirmText="Decline" cancelText="Go back"
        onCancel={() => setRejectOpen(false)}
        onConfirm={() => { setRejectOpen(false); rejectRequest(); router.replace('/mechanic'); }}
      />
    </Page>
  );
}

const s = themed((colors) => ({
  title: { color: colors.muted, fontSize: 13, fontWeight: '700' },
  issue: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 4 },
  note: { color: colors.soft, fontSize: 13.5, fontStyle: 'italic', marginTop: 6, lineHeight: 19 },
  etas: { flexDirection: 'row', gap: 10 },
  eta: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder },
  etaOn: { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.1)' },
  etaNum: { color: colors.text, fontSize: 22, fontWeight: '800' },
  etaLbl: { color: colors.muted, fontSize: 11.5 },
  hint: { color: colors.faint, fontSize: 12, marginTop: 10 },
}));
