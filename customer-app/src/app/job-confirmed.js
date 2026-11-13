import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../constants/theme';
import { useApp } from '../state/AppState';
import { money } from '../utils/format';
import { Page, Button, Card, Row, Divider, Avatar, Pill } from '../components/ui';

// Payment ke baad: request confirm, worker ka naam, job code, aur agar worker busy ho to queue ki maloomat.
export default function JobConfirmed() {
  useTheme();
  const router = useRouter();
  const { job } = useApp();

  if (!job) {
    return (
      <Page>
        <Text style={{ color: colors.muted, marginTop: 60, textAlign: 'center' }}>No active request.</Text>
        <Button title="Go Home" onPress={() => router.replace('/(tabs)')} style={{ marginTop: 20 }} />
      </Page>
    );
  }
  const queued = job.status === 'queued';

  return (
    <Page
      footer={
        <View style={{ gap: 10 }}>
          <Button title={queued ? 'View Queue Status' : 'Track Worker'} icon="map-marker-path" onPress={() => router.replace('/(tabs)/track')} />
          <Button title="Back to Home" variant="ghost" onPress={() => router.replace('/(tabs)')} />
        </View>
      }
    >
      <View style={s.hero}>
        <View style={s.tick}><Icon name="check" size={44} color={colors.onAccent} /></View>
        <Text style={s.title}>{queued ? 'Request Placed' : 'Request Confirmed'}</Text>
        <Text style={s.sub}>
          {queued
            ? 'Your worker is busy right now. You are in the queue and will be assigned automatically.'
            : `${job.worker.name} has acknowledged your request and is on the way.`}
        </Text>
        <Text style={s.id}>Booking {job.id}</Text>
      </View>

      {queued ? (
        <Card style={s.queue}>
          <View style={s.queueRow}>
            <View style={s.queueBox}><Text style={s.queueNum}>#{job.queuePos}</Text><Text style={s.queueLbl}>Your position</Text></View>
            <View style={s.queueBox}><Text style={s.queueNum}>~{job.waitMin} min</Text><Text style={s.queueLbl}>Estimated wait</Text></View>
          </View>
          <Text style={s.queueNote}>
            {job.emergency ? 'Marked as Emergency, so you are ahead of normal requests.' : 'Emergency requests are served first, then others in the order received.'}
          </Text>
        </Card>
      ) : null}

      <Card style={{ marginTop: 14 }}>
        <View style={s.workerRow}>
          <Avatar name={job.worker.name} size={52} />
          <View style={{ flex: 1 }}>
            <Text style={s.wName}>{job.worker.name}</Text>
            <Text style={s.wSub}>{job.worker.role} ({job.worker.code})</Text>
            <View style={s.rating}><Icon name="star" size={14} color={colors.amber} /><Text style={s.ratingText}>{job.worker.rating}  ·  {job.worker.jobs} jobs</Text></View>
          </View>
          <Pill text="Verified" tone="green" icon="shield-check" />
        </View>
      </Card>

      <View style={s.codeBox}>
        <Text style={s.codeLabel}>YOUR JOB CODE</Text>
        <View style={s.codeRow}>
          {job.jobCode.split('').map((c, i) => <View key={i} style={s.codeCell}><Text style={s.codeChar}>{c}</Text></View>)}
        </View>
        <Text style={s.codeNote}>When the worker arrives, ask them to say their code. It must match this one. If it does not, do not let them start.</Text>
      </View>

      <Card style={{ marginTop: 14 }}>
        <Row label="Service" value={job.title} />
        <Row label="Location" value={job.location} />
        <Divider />
        <Row label="Advance paid" value={money(job.price.advance)} color={colors.green} />
        <Row label="Cash to pay after job" value={money(job.price.cash)} />
      </Card>
    </Page>
  );
}

const s = themed((colors) => ({
  hero: { alignItems: 'center', paddingVertical: 14 },
  tick: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 26, fontWeight: '800', marginTop: 16 },
  sub: { color: colors.soft, fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 21, paddingHorizontal: 10 },
  id: { color: colors.orangeText, fontSize: 13, fontWeight: '700', marginTop: 10 },
  queue: { borderColor: 'rgba(255,122,26,0.4)', backgroundColor: 'rgba(255,122,26,0.07)', marginTop: 10 },
  queueRow: { flexDirection: 'row', gap: 10 },
  queueBox: { flex: 1, alignItems: 'center', paddingVertical: 8 },
  queueNum: { color: colors.orangeText, fontSize: 28, fontWeight: '800' },
  queueLbl: { color: colors.muted, fontSize: 12, marginTop: 2 },
  queueNote: { color: colors.soft2, fontSize: 12.5, textAlign: 'center', marginTop: 8, lineHeight: 18 },
  workerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wName: { color: colors.text, fontSize: 17, fontWeight: '700' },
  wSub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { color: colors.muted, fontSize: 12.5 },
  codeBox: { marginTop: 14, padding: 18, borderRadius: radius.lg, backgroundColor: colors.field, borderWidth: 1, borderColor: 'rgba(255,122,26,0.45)', alignItems: 'center' },
  codeLabel: { color: colors.orangeText, fontSize: 12, fontWeight: '800', letterSpacing: 2 },
  codeRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  codeCell: { width: 54, height: 64, borderRadius: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  codeChar: { color: colors.text, fontSize: 32, fontWeight: '800' },
  codeNote: { color: colors.muted, fontSize: 12.5, textAlign: 'center', marginTop: 12, lineHeight: 18 },
}));
