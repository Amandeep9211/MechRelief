import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, radius } from '../../../constants/theme';
import { useApp } from '../../../state/AppState';
import { money } from '../../../utils/format';
import { Page, Header, Stars, SectionTitle } from '../../../components/ui';

// Mechanic ki purani jobs aur kamai.
export default function Jobs() {
  const { wHistory, wStats } = useApp();
  return (
    <Page tabbed header={<Header title="My Jobs" subtitle="Completed jobs and earnings" hideBack />}>
      <View style={s.sum}>
        <View style={{ flex: 1 }}>
          <Text style={s.sumLbl}>This week</Text>
          <Text style={s.sumNum}>{money(wStats.weekEarning)}</Text>
        </View>
        <View style={s.sep} />
        <View style={{ flex: 1 }}>
          <Text style={s.sumLbl}>Today</Text>
          <Text style={s.sumNum}>{money(wStats.todayEarning)}</Text>
        </View>
      </View>
      <Text style={s.note}>Cash is collected from customers directly. The 15% advance is held by MechRelief.</Text>

      <SectionTitle>Completed ({wHistory.length})</SectionTitle>
      {wHistory.map((j) => (
        <View key={j.id} style={s.card}>
          <View style={s.icon}><Icon name="check-decagram-outline" size={24} color={colors.green} /></View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text style={s.title}>{j.title}</Text>
            <Text style={s.meta}>{j.customer}  ·  {j.date}</Text>
            <Stars value={j.rating} size={13} />
          </View>
          <Text style={s.earn}>{money(j.earning)}</Text>
        </View>
      ))}
    </Page>
  );
}

const s = StyleSheet.create({
  sum: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: radius.lg, backgroundColor: 'rgba(255,122,26,0.1)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.35)' },
  sumLbl: { color: colors.muted, fontSize: 12.5 },
  sumNum: { color: colors.orange, fontSize: 24, fontWeight: '800', marginTop: 4 },
  sep: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,122,26,0.3)', marginHorizontal: 16 },
  note: { color: '#6E7782', fontSize: 12, marginTop: 10, lineHeight: 17 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  icon: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.greenSoft },
  title: { color: colors.text, fontSize: 15, fontWeight: '700' },
  meta: { color: colors.muted, fontSize: 12.5 },
  earn: { color: colors.text, fontSize: 15, fontWeight: '800' },
});
