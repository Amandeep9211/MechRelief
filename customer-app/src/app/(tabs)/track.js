import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';
import MapPreview from '../../components/MapPreview';
import { Page, Header, Button, CallButton, Card, Row, Divider, Avatar, Pill, Timeline, ConfirmModal, Empty, SectionTitle } from '../../components/ui';

const STEPS = ['Request confirmed', 'Worker on the way', 'Arrived, job code verified', 'Work in progress', 'Payment'];
const ORDER = ['queued', 'enroute', 'arrived', 'working', 'payment'];
const PILL = {
  queued: ['In queue', 'orange'], enroute: ['On the way', 'green'], arrived: ['Arrived', 'blue'],
  working: ['In progress', 'blue'], payment: ['Payment due', 'orange'],
};

// Track tab: chalti hui request ka poora safar (queue > raaste mein > pohonch gaya > kaam > payment).
export default function Track() {
  const router = useRouter();
  const { job, updateJob, cancelJob } = useApp();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!job) {
    return (
      <Page tabbed header={<Header title="Track Worker" hideBack />}>
        <Empty
          icon="map-marker-radius-outline" title="No active request"
          note="When you book a service you can follow your worker, see the job code and confirm payment here."
          action={<Button title="Book a Service" icon="plus" onPress={() => router.push('/(tabs)')} />}
        />
      </Page>
    );
  }

  const st = job.status;
  const idx = ORDER.indexOf(st);
  const p = job.price;
  const [pillText, pillTone] = PILL[st];

  // ---- DEMO controls: supervisor ko poora flow dikhane ke liye agla step ----
  const demoLabel = {
    queued: 'Worker becomes free, request assigned',
    enroute: 'Worker arrives at your location',
    arrived: 'Skip: verify code and start work',
    working: 'Worker marks job complete',
    payment: job.custPaid ? 'Worker confirms cash received' : 'Customer pays cash first',
  }[st];
  const demoNext = () => {
    if (st === 'queued') updateJob({ status: 'enroute', queuePos: 0, waitMin: 0, etaMin: 15 });
    else if (st === 'enroute') updateJob({ status: 'arrived', etaMin: 0 });
    else if (st === 'arrived') updateJob({ status: 'working' });
    else if (st === 'working') updateJob({ status: 'payment' });
    else if (st === 'payment' && job.custPaid) router.push('/rate');
  };

  const cancelMsg = st === 'queued'
    ? `You are still in the queue, so your advance of ${money(p.advance)} will be refunded to JazzCash.`
    : `${job.worker.name} is already on the way. The advance of ${money(p.advance)} is not refundable after a worker is assigned.`;

  return (
    <Page
      tabbed
      header={
        <Header title="Track Worker" subtitle={`${job.title}  ·  ${job.id}`} hideBack right={<Pill text={pillText} tone={pillTone} />} />
      }
    >
      {/* Map ya queue */}
      {st === 'queued' ? (
        <Card style={s.queue}>
          <Icon name="timer-sand" size={30} color={colors.orange} />
          <Text style={s.qTitle}>You are #{job.queuePos} in the queue</Text>
          <Text style={s.qSub}>Estimated wait about {job.waitMin} min. {job.emergency ? 'Emergency requests go first.' : 'Emergency requests are served first.'} The next job is assigned automatically the moment your worker is free.</Text>
        </Card>
      ) : (
        <>
          <MapPreview height={210} route worker progress={st === 'enroute' ? 0.45 : 1} label="Live location (Firebase + Google Maps comes with backend)" />
          {st === 'enroute' && (
            <View style={s.eta}>
              <Icon name="clock-fast" size={20} color={colors.orange} />
              <Text style={s.etaText}>Arriving in <Text style={{ color: colors.orange, fontWeight: '800' }}>{job.etaMin} min</Text></Text>
            </View>
          )}
        </>
      )}

      {/* Worker */}
      <Card style={{ marginTop: 14 }}>
        <View style={s.wRow}>
          <Avatar name={job.worker.name} size={50} />
          <View style={{ flex: 1 }}>
            <Text style={s.wName}>{job.worker.name}  <Icon name="shield-check" size={14} color={colors.green} /></Text>
            <Text style={s.wSub}>{job.worker.role} ({job.worker.code})</Text>
            <View style={s.rating}><Icon name="star" size={13} color="#FFB020" /><Text style={s.wSub}>{job.worker.rating}  ·  {job.worker.jobs} jobs</Text></View>
          </View>
          <CallButton compact phone={job.worker.phone} label={`Call ${job.worker.name}`} />
        </View>
      </Card>

      {/* Stage ke hisab se card */}
      {st === 'enroute' && (
        <JobCode code={job.jobCode} note="Worker will say this code when he arrives. Check it matches." />
      )}

      {st === 'arrived' && (
        <Card style={s.verify}>
          <Icon name="shield-key-outline" size={30} color={colors.orange} />
          <Text style={s.vTitle}>Worker has arrived. Verify the job code</Text>
          <Text style={s.vSub}>Ask the worker to say their job code out loud. Compare it with yours below.</Text>
          <JobCode code={job.jobCode} flat />
          <View style={{ gap: 10, marginTop: 14, alignSelf: 'stretch' }}>
            <Button title="Code matches, start work" icon="check-circle-outline" variant="success" onPress={() => updateJob({ status: 'working' })} />
            <Button title="Code does not match" icon="alert-outline" variant="danger" onPress={() => router.push({ pathname: '/sos', params: { reason: 'code' } })} />
          </View>
        </Card>
      )}

      {st === 'working' && (
        <Card style={s.center}>
          <Icon name="wrench-clock" size={32} color={colors.orange} />
          <Text style={s.vTitle}>Work in progress</Text>
          <Text style={s.vSub}>{job.worker.name} is working on your {job.title.toLowerCase()}. You will be asked to confirm payment when the job is complete.</Text>
        </Card>
      )}

      {st === 'payment' && (
        <Card style={s.pay}>
          <Text style={s.vTitle}>Job complete. Confirm payment</Text>
          <Row label="Total" value={money(p.total)} />
          <Row label="Advance already paid (15%)" value={`- ${money(p.advance)}`} color={colors.green} />
          <Divider />
          <Row label="Cash to hand to worker" value={money(p.cash)} bold color={colors.orange} />
          <Text style={s.vSub}>Both you and the worker confirm in the app. If the two do not match, the admin is alerted to sort it out.</Text>
          {job.mismatch ? (
            <View style={s.mismatch}>
              <Icon name="alert-circle-outline" size={20} color="#FF6B66" />
              <Text style={s.mismatchText}>Amounts do not match. This has been flagged to the admin as a dispute. You will be contacted.</Text>
            </View>
          ) : job.custPaid ? (
            <View style={s.waiting}>
              <Icon name="timer-sand" size={18} color={colors.orange} />
              <Text style={s.waitText}>You confirmed payment. Waiting for the worker to confirm...</Text>
            </View>
          ) : (
            <Button title={`I paid ${money(p.cash)} cash`} icon="cash-check" onPress={() => updateJob({ custPaid: true })} style={{ marginTop: 14 }} />
          )}
        </Card>
      )}

      {/* Timeline */}
      <SectionTitle>Progress</SectionTitle>
      <Card><Timeline steps={STEPS} current={idx} /></Card>

      {/* SOS aur cancel */}
      {st !== 'payment' && (
        <Pressable style={s.sos} onPress={() => router.push('/sos')}>
          <View style={s.sosIcon}><Icon name="alarm-light" size={24} color="#fff" /></View>
          <View style={{ flex: 1 }}>
            <Text style={s.sosTitle}>SOS Emergency</Text>
            <Text style={s.sosSub}>Alerts the admin and sends your live location to your trusted contact</Text>
          </View>
          <Icon name="chevron-right" size={22} color="#FF6B66" />
        </Pressable>
      )}
      {(st === 'queued' || st === 'enroute') && (
        <Button title="Cancel request" variant="ghost" small onPress={() => setCancelOpen(true)} style={{ marginTop: 12 }} />
      )}

      {/* DEMO */}
      <View style={s.demo}>
        <Text style={s.demoTag}>DEMO CONTROL</Text>
        <Text style={s.demoText}>For presentation only. Moves the request to the next stage.</Text>
        <Button small variant="soft" icon="skip-next" title={demoLabel} onPress={demoNext} />
        {st === 'payment' && job.custPaid && !job.mismatch ? (
          <Button small variant="danger" icon="alert-circle-outline" title="Worker enters a different amount" onPress={() => updateJob({ mismatch: true })} style={{ marginTop: 8 }} />
        ) : null}
      </View>

      <ConfirmModal
        visible={cancelOpen} danger icon="close-octagon-outline" title="Cancel this request?" message={cancelMsg}
        confirmText="Yes, cancel request" cancelText="Keep request"
        onCancel={() => setCancelOpen(false)}
        onConfirm={() => { setCancelOpen(false); cancelJob(); }}
      />
    </Page>
  );
}

function JobCode({ code, note, flat }) {
  return (
    <View style={[s.codeBox, flat && { backgroundColor: 'transparent', borderWidth: 0, marginTop: 8, padding: 0 }]}>
      {!flat && <Text style={s.codeLabel}>YOUR JOB CODE</Text>}
      <View style={s.codeRow}>
        {code.split('').map((c, i) => <View key={i} style={s.codeCell}><Text style={s.codeChar}>{c}</Text></View>)}
      </View>
      {note ? <Text style={s.codeNote}>{note}</Text> : null}
    </View>
  );
}

const s = StyleSheet.create({
  queue: { alignItems: 'center', borderColor: 'rgba(255,122,26,0.4)', backgroundColor: 'rgba(255,122,26,0.07)', paddingVertical: 22 },
  qTitle: { color: colors.text, fontSize: 21, fontWeight: '800', marginTop: 10 },
  qSub: { color: '#C3CAD2', fontSize: 13.5, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  eta: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 12 },
  etaText: { color: colors.text, fontSize: 15 },
  wRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  wSub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  codeBox: { marginTop: 14, padding: 16, borderRadius: radius.lg, backgroundColor: '#12171E', borderWidth: 1, borderColor: 'rgba(255,122,26,0.45)', alignItems: 'center' },
  codeLabel: { color: colors.orange, fontSize: 11.5, fontWeight: '800', letterSpacing: 2 },
  codeRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  codeCell: { width: 50, height: 58, borderRadius: 13, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  codeChar: { color: colors.text, fontSize: 29, fontWeight: '800' },
  codeNote: { color: colors.muted, fontSize: 12.5, textAlign: 'center', marginTop: 10, lineHeight: 18 },
  verify: { marginTop: 14, alignItems: 'center', borderColor: 'rgba(255,122,26,0.5)' },
  center: { marginTop: 14, alignItems: 'center' },
  pay: { marginTop: 14, borderColor: 'rgba(255,122,26,0.5)' },
  vTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginTop: 10, textAlign: 'center' },
  vSub: { color: colors.muted, fontSize: 13, textAlign: 'center', marginTop: 8, lineHeight: 19 },
  waiting: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.1)' },
  waitText: { flex: 1, color: colors.text, fontSize: 13 },
  mismatch: { flexDirection: 'row', gap: 8, marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: colors.redSoft },
  mismatchText: { flex: 1, color: '#FFB3B0', fontSize: 13, lineHeight: 18 },
  sos: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 18, padding: 14, borderRadius: radius.lg, backgroundColor: colors.redSoft, borderWidth: 1, borderColor: 'rgba(229,50,45,0.5)' },
  sosIcon: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  sosTitle: { color: '#FF8A85', fontSize: 16, fontWeight: '800' },
  sosSub: { color: '#D9A5A2', fontSize: 12, marginTop: 2, lineHeight: 16 },
  demo: { marginTop: 22, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: '#3A434D', gap: 6 },
  demoTag: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  demoText: { color: '#6E7782', fontSize: 12, marginBottom: 6 },
});
