import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../../constants/theme';
import { DEMO_JOB_CODE } from '../../data/mock';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';
import MapPreview from '../../components/MapPreview';
import { Page, Header, Button, CallButton, Card, Row, Divider, Pill, Timeline, ConfirmModal } from '../../components/ui';

const STEPS = ['Request acknowledged', 'On the way', 'Arrived, job code verified', 'Work in progress', 'Cash collected'];
const IDX = { enroute: 1, verify: 2, working: 3, collect: 4, done: 5 };

// Worker ki chalti job: raaste mein > pohonch gaya (job code) > kaam > cash collect (dual confirmation) > khatam.
export default function WorkerJob() {
  useTheme();
  const router = useRouter();
  const { wJob: j, setWJob, finishWorkerJob } = useApp();
  const [mismatchOpen, setMismatchOpen] = useState(false);
  const [done, setDone] = useState(false);

  if (!j && !done) {
    return (
      <Page header={<Header title="Job" fallback="/mechanic" />}>
        <Text style={{ color: colors.muted, textAlign: 'center', marginTop: 60 }}>No active job.</Text>
        <Button title="Back to Dashboard" onPress={() => router.replace('/mechanic')} style={{ marginTop: 20 }} />
      </Page>
    );
  }

  if (done) {
    return (
      <Page footer={<Button title="Back to Dashboard" onPress={() => router.replace('/mechanic')} />}>
        <View style={s.center}>
          <View style={s.tick}><Icon name="check" size={44} color={colors.onAccent} /></View>
          <Text style={s.title}>Job completed</Text>
          <Text style={s.sub}>Payment was confirmed by you and the customer. The customer will now rate the service.</Text>
        </View>
        <Card style={{ marginTop: 18 }}>
          <Row label="Fare earned" value={money(done.total)} bold color={colors.orange} />
          <Row label="Collected in cash" value={money(done.cash)} />
          <Row label="Paid online as advance" value={money(done.advance)} />
        </Card>
      </Page>
    );
  }

  const stage = j.stage;
  const set = (stage) => setWJob({ ...j, stage });

  return (
    <Page
      header={<Header title={j.title} subtitle={j.id} fallback="/mechanic" right={j.emergency ? <Pill text="EMERGENCY" tone="red" icon="alert" /> : null} />}
    >
      {stage === 'enroute' || stage === 'verify' ? <MapPreview height={170} route worker progress={stage === 'enroute' ? 0.5 : 1} label="Navigation (Google Maps comes with backend)" /> : null}

      <Card style={{ marginTop: 14 }}>
        <Row label="Customer" value={j.customer} />
        <Row label="Issue" value={j.issue} />
        <Row label="Car" value={j.car} />
        <Row label="Location" value={j.location} />
        {j.phone ? <View style={{ marginTop: 12 }}><CallButton phone={j.phone} label="Call customer" /></View> : null}
      </Card>

      {stage === 'enroute' && (
        <Card style={s.stageCard}>
          <Icon name="navigation-variant-outline" size={30} color={colors.orange} />
          <Text style={s.stageTitle}>Head to the customer</Text>
          <Text style={s.stageSub}>The customer can see your live location. You promised to arrive in {j.eta} min.</Text>
          <Button title="I have arrived" icon="map-marker-check-outline" onPress={() => set('verify')} style={{ alignSelf: 'stretch', marginTop: 14 }} />
        </Card>
      )}

      {stage === 'verify' && (
        <Card style={s.stageCard}>
          <Icon name="shield-key-outline" size={30} color={colors.orange} />
          <Text style={s.stageTitle}>Say your job code to the customer</Text>
          <Text style={s.stageSub}>The customer will check it against the code in their own app. Do not start work until they confirm.</Text>
          <View style={s.codeRow}>
            {DEMO_JOB_CODE.split('').map((c, i) => <View key={i} style={s.codeCell}><Text style={s.codeChar}>{c}</Text></View>)}
          </View>
          <Button title="Customer confirmed, start work" icon="check-circle-outline" variant="success" onPress={() => set('working')} style={{ alignSelf: 'stretch', marginTop: 14 }} />
        </Card>
      )}

      {stage === 'working' && (
        <Card style={s.stageCard}>
          <Icon name="wrench-clock" size={32} color={colors.orange} />
          <Text style={s.stageTitle}>Work in progress</Text>
          <Text style={s.stageSub}>Finish the repair, then mark the job complete to collect payment.</Text>
          <Button title="Mark job complete" icon="flag-checkered" onPress={() => set('collect')} style={{ alignSelf: 'stretch', marginTop: 14 }} />
        </Card>
      )}

      {stage === 'collect' && (
        <Card style={[s.stageCard, { borderColor: 'rgba(255,122,26,0.55)' }]}>
          <Text style={s.stageTitle}>Collect payment</Text>
          <Text style={s.cash}>{money(j.cash)}</Text>
          <Text style={s.stageSub}>Cash to collect from the customer (85% of {money(j.total)}). The 15% advance of {money(j.advance)} was paid online.</Text>
          <Text style={[s.stageSub, { marginTop: 8 }]}>Press the button only after you have received the cash. The customer confirms on their side too. If the two do not match, the admin is alerted.</Text>
          <Button
            title="Payment received" icon="cash-check" style={{ alignSelf: 'stretch', marginTop: 14 }}
            onPress={() => { const snap = j; finishWorkerJob(); setDone(snap); }}
          />
          <Button title="Amount does not match" variant="danger" small icon="alert-circle-outline" onPress={() => setMismatchOpen(true)} style={{ alignSelf: 'stretch', marginTop: 10 }} />
        </Card>
      )}

      <View style={{ marginTop: 18 }}>
        <Text style={s.progress}>Progress</Text>
        <Card style={{ marginTop: 10 }}><Timeline steps={STEPS} current={IDX[stage]} /></Card>
      </View>

      <ConfirmModal
        visible={mismatchOpen} danger icon="alert-circle-outline" title="Report a mismatch?"
        message="The admin will be alerted with both confirmations and will handle the dispute. You will be contacted."
        confirmText="Report to admin" cancelText="Go back"
        onCancel={() => setMismatchOpen(false)} onConfirm={() => setMismatchOpen(false)}
      />
    </Page>
  );
}

const s = themed((colors) => ({
  center: { alignItems: 'center', paddingTop: 20 },
  tick: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 16 },
  sub: { color: colors.soft, fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 21, paddingHorizontal: 10 },
  stageCard: { marginTop: 14, alignItems: 'center', borderColor: 'rgba(255,122,26,0.4)' },
  stageTitle: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  stageSub: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  codeRow: { flexDirection: 'row', gap: 10, marginTop: 16 },
  codeCell: { width: 54, height: 64, borderRadius: 14, backgroundColor: colors.field, borderWidth: 1, borderColor: 'rgba(255,122,26,0.45)', alignItems: 'center', justifyContent: 'center' },
  codeChar: { color: colors.text, fontSize: 32, fontWeight: '800' },
  cash: { color: colors.orangeText, fontSize: 38, fontWeight: '800', marginTop: 8 },
  progress: { color: colors.text, fontSize: 17, fontWeight: '700' },
}));
