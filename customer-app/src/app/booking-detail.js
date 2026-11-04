import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATEGORIES } from '../constants/categories';
import { colors } from '../constants/theme';
import { useApp } from '../state/AppState';
import { money } from '../utils/format';
import { Page, Header, Card, Row, Divider, Pill, Stars, Button, Avatar } from '../components/ui';

// Purani (completed / cancelled) booking ki tafseel.
export default function BookingDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { history } = useApp();
  const b = history.find((h) => h.id === id);

  if (!b) return <Page header={<Header title="Booking" />}><Text style={{ color: colors.muted }}>Booking not found.</Text></Page>;
  const cat = CATEGORIES.find((c) => c.id === b.categoryId);
  const completed = b.status === 'completed';
  const advance = Math.round(b.total * 0.15);

  return (
    <Page
      header={<Header title="Booking Details" subtitle={b.id} fallback="/(tabs)/bookings" />}
      footer={b.hasReport ? <Button title="View Inspection Report" icon="file-document-outline" onPress={() => router.push('/inspection-report')} /> : undefined}
    >
      <Card style={s.top}>
        <View style={s.icon}><Icon name={cat?.icon ?? 'wrench'} size={30} color={colors.orange} /></View>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>{b.title}</Text>
          <Text style={s.sub}>{b.date}</Text>
        </View>
        <Pill text={completed ? 'Completed' : 'Cancelled'} tone={completed ? 'green' : 'red'} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <View style={s.worker}>
          <Avatar name={b.worker} size={44} />
          <View style={{ flex: 1 }}>
            <Text style={s.wName}>{b.worker}</Text>
            <Text style={s.sub}>Assigned worker</Text>
          </View>
          {completed && b.rating ? <Stars value={b.rating} size={16} /> : null}
        </View>
        <Divider />
        <Row label="Car" value={b.car} />
        <Row label="Location" value={b.location} />
        <Row label="Details" value={b.detail} />
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Row label="Total" value={money(b.total)} bold />
        <Row label="Advance (15%)" value={money(advance)} />
        {completed ? <Row label="Paid in cash (85%)" value={money(b.total - advance)} /> : null}
        {!completed ? (
          <Row label="Advance refund" value={b.refund ? `${money(b.refund)} refunded` : 'Not refundable'} color={b.refund ? colors.green : '#FF6B66'} />
        ) : null}
      </Card>

      {completed && b.review ? (
        <Card style={{ marginTop: 12 }}>
          <Text style={s.rl}>Your review</Text>
          <Text style={s.rv}>{b.review}</Text>
        </Card>
      ) : null}
    </Page>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  icon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  sub: { color: colors.muted, fontSize: 12.5, marginTop: 2 },
  worker: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wName: { color: colors.text, fontSize: 16, fontWeight: '700' },
  rl: { color: colors.muted, fontSize: 12.5, fontWeight: '700', marginBottom: 6 },
  rv: { color: colors.text, fontSize: 14, lineHeight: 20 },
});
