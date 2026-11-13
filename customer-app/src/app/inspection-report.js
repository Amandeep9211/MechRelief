import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../constants/theme';
import { INSPECTION_REPORT as R } from '../data/mock';
import { Page, Header, Card, Row, Divider, Button, SectionTitle } from '../components/ui';

const TONE = {
  ok: ['check-circle', 'green', 'Good'],
  attention: ['alert-circle', 'amber', 'Needs attention'],
  bad: ['close-circle', 'redText', 'Problem'],
};

// Car Inspection ki structured report (proposal Objective 4). Inspector checklist bharta hai, customer ko report milti hai.
export default function InspectionReport() {
  useTheme();
  const router = useRouter();
  return (
    <Page
      header={<Header title="Inspection Report" subtitle={R.bookingId} fallback="/(tabs)/bookings" />}
      footer={<Button title="Done" onPress={() => router.replace('/(tabs)/bookings')} />}
    >
      <Card style={s.score}>
        <View style={s.ring}><Text style={s.num}>{R.score}</Text><Text style={s.of}>/ 100</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={s.verdict}>{R.verdict}</Text>
          <Text style={s.sub}>{R.car}</Text>
        </View>
      </Card>

      <Card style={{ marginTop: 12 }}>
        <Row label="Inspected by" value={R.inspector} />
        <Row label="Date" value={R.date} />
        <Row label="Items checked" value={`${R.items.length}`} />
      </Card>

      <SectionTitle>Checklist results</SectionTitle>
      {R.items.map((it) => {
        const [icon, token, label] = TONE[it.status];
        const color = colors[token];
        return (
          <View key={it.name} style={s.item}>
            <Icon name={icon} size={24} color={color} />
            <View style={{ flex: 1 }}>
              <View style={s.itemTop}>
                <Text style={s.itemName}>{it.name}</Text>
                <Text style={[s.itemTag, { color }]}>{label}</Text>
              </View>
              <Text style={s.note}>{it.note}</Text>
            </View>
          </View>
        );
      })}
    </Page>
  );
}

const s = themed((colors) => ({
  score: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ring: { width: 92, height: 92, borderRadius: 46, borderWidth: 6, borderColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  num: { color: colors.text, fontSize: 28, fontWeight: '800', lineHeight: 30 },
  of: { color: colors.muted, fontSize: 11 },
  verdict: { color: colors.text, fontSize: 17, fontWeight: '800', lineHeight: 22 },
  sub: { color: colors.muted, fontSize: 13, marginTop: 4 },
  item: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  itemTop: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  itemName: { color: colors.text, fontSize: 14.5, fontWeight: '700', flex: 1 },
  itemTag: { fontSize: 12, fontWeight: '700' },
  note: { color: colors.soft, fontSize: 12.5, marginTop: 4, lineHeight: 18 },
}));
