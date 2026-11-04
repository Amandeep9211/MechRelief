import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../../constants/categories';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';
import { Page, Header, Pill, Empty, Button } from '../../components/ui';

const TABS = [['active', 'Active'], ['completed', 'Completed'], ['cancelled', 'Cancelled']];

// Bookings tab: Active (chalti hui), Completed, Cancelled. Card dabane par detail khulti hai.
export default function Bookings() {
  const router = useRouter();
  const { job, history } = useApp();
  const [tab, setTab] = useState('active');

  const rows = tab === 'active'
    ? (job ? [{ id: job.id, categoryId: job.categoryId, title: job.title, status: 'active', date: job.createdAt, worker: job.worker.name, total: job.price.total, live: job.status }] : [])
    : history.filter((h) => h.status === tab);

  return (
    <Page tabbed header={<Header title="My Bookings" hideBack />}>
      <View style={s.tabs}>
        {TABS.map(([k, label]) => (
          <Pressable key={k} onPress={() => setTab(k)} style={[s.tab, tab === k && s.tabOn]}>
            <Text style={[s.tabText, tab === k && { color: '#fff' }]}>{label}</Text>
          </Pressable>
        ))}
      </View>

      {rows.length === 0 ? (
        <Empty
          icon="calendar-blank-outline" title={`No ${tab} bookings`}
          note={tab === 'active' ? 'Your running request will show up here.' : 'Nothing here yet.'}
          action={tab === 'active' ? <Button title="Book a Service" icon="plus" onPress={() => router.push('/(tabs)')} /> : null}
        />
      ) : rows.map((b) => {
        const cat = CATEGORIES.find((c) => c.id === b.categoryId);
        const tone = b.status === 'completed' ? 'green' : b.status === 'cancelled' ? 'red' : 'orange';
        const label = b.status === 'active' ? ({ queued: 'In queue', enroute: 'On the way', arrived: 'Arrived', working: 'In progress', payment: 'Payment due' }[b.live]) : b.status;
        return (
          <Pressable
            key={b.id + b.status}
            style={s.card}
            onPress={() => (b.status === 'active' ? router.push('/(tabs)/track') : router.push({ pathname: '/booking-detail', params: { id: b.id } }))}
          >
            <View style={s.icon}><Icon name={cat?.icon ?? 'wrench'} size={26} color={colors.orange} /></View>
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={s.title}>{b.title}</Text>
              <Text style={s.meta}>{b.id}  ·  {b.date}</Text>
              <Text style={s.meta}>Worker: {b.worker}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 8 }}>
              <Pill text={label[0].toUpperCase() + label.slice(1)} tone={tone} />
              <Text style={s.total}>{money(b.total)}</Text>
            </View>
          </Pressable>
        );
      })}
    </Page>
  );
}

const s = StyleSheet.create({
  tabs: { flexDirection: 'row', backgroundColor: colors.card, borderRadius: radius.pill, padding: 4, borderWidth: 1, borderColor: colors.border, marginBottom: 14 },
  tab: { flex: 1, height: 38, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  tabOn: { backgroundColor: colors.orange },
  tabText: { color: colors.muted, fontSize: 13.5, fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  icon: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 12 },
  total: { color: colors.text, fontSize: 14, fontWeight: '800' },
});
