import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../../../constants/theme';
import { WORKER } from '../../../data/mock';
import { useApp } from '../../../state/AppState';
import { money } from '../../../utils/format';
import { Page, Avatar, Card, Pill, SectionTitle, ToggleRow, Button } from '../../../components/ui';

const STAGE = { enroute: 'On the way', verify: 'Verify job code', working: 'In progress', collect: 'Collect cash' };

// Mechanic Dashboard: availability, aaj ki kamai, nayi request, chalti job, queue.
export default function Dashboard() {
  useTheme();
  const router = useRouter();
  const { wAvailable, setWAvailable, wRequest, wQueue, wJob, wStats } = useApp();
  const queue = [...wQueue].sort((a, b) => Number(b.emergency) - Number(a.emergency)); // Emergency pehle

  return (
    <Page
      tabbed
      header={
        <View style={s.head}>
          <Avatar name={WORKER.name} size={50} />
          <View style={{ flex: 1 }}>
            <Text style={s.hello}>Hello, {WORKER.name.split(' ')[0]}</Text>
            <Text style={s.role}>{WORKER.role} ({WORKER.code})</Text>
          </View>
          <Pill text="Verified" tone="green" icon="shield-check" />
        </View>
      }
    >
      <ToggleRow
        icon={wAvailable ? 'toggle-switch' : 'toggle-switch-off-outline'}
        label={wAvailable ? 'You are Available' : 'You are Offline'}
        sub={wAvailable ? 'Requests for your categories come straight to you.' : 'Switch on to receive new requests.'}
        value={wAvailable} onChange={setWAvailable}
      />

      <View style={s.stats}>
        <View style={s.stat}><Text style={s.num}>{wStats.todayJobs}</Text><Text style={s.lbl}>Jobs today</Text></View>
        <View style={s.stat}><Text style={s.num}>{money(wStats.todayEarning)}</Text><Text style={s.lbl}>Earned today</Text></View>
        <View style={s.stat}><View style={s.rate}><Icon name="star" size={16} color={colors.amber} /><Text style={s.num}>{wStats.rating}</Text></View><Text style={s.lbl}>Rating</Text></View>
      </View>

      {/* Chalti hui job */}
      {wJob ? (
        <>
          <SectionTitle>Current job</SectionTitle>
          <Pressable style={[s.card, { borderColor: colors.orange }]} onPress={() => router.push('/mechanic/job')}>
            <View style={s.icon}><Icon name="tools" size={26} color={colors.orange} /></View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={s.title}>{wJob.title}  ·  {wJob.id}</Text>
              <Text style={s.meta}>{wJob.customer}  ·  {wJob.car}</Text>
              <Text style={s.meta}>{wJob.location}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Pill text={STAGE[wJob.stage]} tone="blue" />
              <Icon name="chevron-right" size={22} color={colors.text} />
            </View>
          </Pressable>
        </>
      ) : null}

      {/* Nayi request */}
      <SectionTitle>New request</SectionTitle>
      {!wAvailable ? (
        <Card2 icon="power-sleep" text="You are offline. Go available to receive requests." />
      ) : wRequest ? (
        <Pressable style={[s.card, s.newCard]} onPress={() => router.push('/mechanic/request')}>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={s.row}>
              {wRequest.emergency ? <Pill text="EMERGENCY" tone="red" icon="alert" /> : <Pill text="New" tone="orange" />}
              <Text style={s.reqId}>{wRequest.id}</Text>
            </View>
            <Text style={s.title}>{wRequest.title}: {wRequest.issue}</Text>
            <Text style={s.meta}>{wRequest.customer}  ·  {wRequest.km} km away</Text>
            <Text style={s.meta}>{wRequest.location}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 4 }}>
            <Text style={s.earnLbl}>Fare</Text>
            <Text style={s.earn}>{money(wRequest.total)}</Text>
            <Icon name="chevron-right" size={22} color={colors.text} />
          </View>
        </Pressable>
      ) : (
        <Card2 icon="bell-sleep-outline" text="No new requests right now. You will be notified when one arrives." />
      )}

      {/* Queue */}
      {queue.length ? (
        <>
          <SectionTitle right={<Text style={s.sortNote}>Emergency first</Text>}>Request queue ({queue.length})</SectionTitle>
          {queue.map((q, i) => (
            <View key={q.id} style={s.card}>
              <View style={s.pos}><Text style={s.posText}>{i + 1}</Text></View>
              <View style={{ flex: 1, gap: 3 }}>
                <Text style={s.title}>{q.title}: {q.issue}</Text>
                <Text style={s.meta}>{q.customer}  ·  {q.car}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                {q.emergency ? <Pill text="EMERGENCY" tone="red" /> : null}
                <Text style={s.meta}>{q.wait}</Text>
              </View>
            </View>
          ))}
          <Text style={s.autoNote}>The next job is assigned to you automatically when you finish the current one.</Text>
        </>
      ) : null}
    </Page>
  );
}

function Card2({ icon, text }) {
  useTheme();
  return (
    <View style={[s.card, { justifyContent: 'center' }]}>
      <Icon name={icon} size={26} color={colors.muted} />
      <Text style={[s.meta, { flex: 1, fontSize: 13.5 }]}>{text}</Text>
    </View>
  );
}

const s = themed((colors) => ({
  head: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6 },
  hello: { color: colors.text, fontSize: 22, fontWeight: '800' },
  role: { color: colors.muted, fontSize: 13, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 10, marginTop: 12 },
  stat: { flex: 1, paddingVertical: 14, alignItems: 'center', borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  num: { color: colors.text, fontSize: 17, fontWeight: '800' },
  rate: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  lbl: { color: colors.muted, fontSize: 11.5, marginTop: 3 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  newCard: { borderColor: 'rgba(255,122,26,0.55)', backgroundColor: 'rgba(255,122,26,0.06)' },
  icon: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 12.5 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  reqId: { color: colors.muted, fontSize: 12 },
  earnLbl: { color: colors.muted, fontSize: 11 },
  earn: { color: colors.orangeText, fontSize: 18, fontWeight: '800' },
  pos: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  posText: { color: colors.orangeText, fontWeight: '800' },
  sortNote: { color: colors.muted, fontSize: 12 },
  autoNote: { color: colors.faint, fontSize: 12, lineHeight: 17, marginTop: 2 },
}));
