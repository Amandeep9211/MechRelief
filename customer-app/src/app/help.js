import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, radius, themed, useTheme } from '../constants/theme';
import { Page, Header, SectionTitle } from '../components/ui';

const FAQ = [
  ['How do I book a service?', 'Open Home, tap a service, enter your car and location, check the price breakdown, then pay the 15% advance.'],
  ['How is the price decided?', 'You see the part cost, service charge and distance charge before you confirm. There are no surprise charges.'],
  ['What is the job code for?', 'It makes sure the right worker turned up. You and the worker both get the same code. Ask the worker to say theirs and check it matches yours.'],
  ['How do I pay?', 'You pay 15% online through JazzCash as an advance. The remaining 85% is paid in cash after the job, and both of you confirm it in the app.'],
  ['What if my worker is busy?', 'Your request joins a queue. Emergency requests go first and the next job is assigned automatically when the worker is free.'],
  ['Can I get my advance back?', 'Yes, if you cancel while your request is still in the queue. Once a worker has been assigned, the advance is not refundable.'],
  ['What does SOS do?', 'It alerts the admin in the app and sends an SMS with your live location to your trusted contact.'],
];

export default function Help() {
  useTheme();
  const [open, setOpen] = useState(0);
  return (
    <Page header={<Header title="Help & Support" fallback="/(tabs)/profile" />}>
      <SectionTitle>Frequently asked</SectionTitle>
      {FAQ.map(([q, a], i) => (
        <Pressable key={q} onPress={() => setOpen(open === i ? -1 : i)} style={s.item}>
          <View style={s.top}>
            <Text style={s.q}>{q}</Text>
            <Icon name={open === i ? 'chevron-up' : 'chevron-down'} size={22} color={colors.orange} />
          </View>
          {open === i ? <Text style={s.a}>{a}</Text> : null}
        </Pressable>
      ))}
      <View style={s.contact}>
        <Icon name="headset" size={26} color={colors.orange} />
        <Text style={s.cText}>Need more help? Contact the MechRelief admin team from your booking or by SOS during a job.</Text>
      </View>
    </Page>
  );
}

const s = themed((colors) => ({
  item: { padding: 14, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 10 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  q: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '600' },
  a: { color: colors.soft, fontSize: 13.5, lineHeight: 20, marginTop: 10 },
  contact: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.08)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.25)', marginTop: 10 },
  cText: { flex: 1, color: colors.soft2, fontSize: 13.5, lineHeight: 19 },
}));
