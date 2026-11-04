import { useEffect, useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATEGORIES } from '../../constants/categories';
import { CONFIG, priceFor, EMERGENCY_CHARGE, DESCRIPTION_REQUIRED } from '../../data/categoryConfig';
import { colors, radius } from '../../constants/theme';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';
import MapPreview from '../../components/MapPreview';
import {
  Page, Header, Button, Card, SectionTitle, FieldLabel, Input, ChoiceRow, Select, Stepper, PhotoPicker, ToggleRow, Row, Divider, Pill,
} from '../../components/ui';

// Proposal: "ek hi reusable booking screen". Fields har category ke CONFIG se aate hain.
// Universal fields (car + location) hamesha, phir category ke fields, phir price breakdown.
export default function Booking() {
  const { category, emergency } = useLocalSearchParams();
  const router = useRouter();
  const { draft, startDraft, setDraft, user, job } = useApp();
  const cat = CATEGORIES.find((c) => c.id === category);
  const cfg = CONFIG[category];

  // Is category ka naya form shuru karo
  useEffect(() => {
    if (!draft || draft.categoryId !== category) startDraft(category);
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

  const d = draft && draft.categoryId === category ? draft : null;
  const price = useMemo(() => (d ? priceFor(category, d.answers, d.emergency) : null), [d, category]);
  const hasActive = !!job;

  useEffect(() => {
    if (emergency === '1' && d && !d.emergency) setDraft({ ...d, emergency: true });
  }, [emergency, !!d]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cat || !cfg || !d) return <Page header={<Header title="New Request" />}><Text style={{ color: colors.muted }}>Loading...</Text></Page>;

  const set = (patch) => setDraft({ ...d, ...patch });
  const setAns = (key, v) => set({ answers: { ...d.answers, [key]: v } });

  const needsDrop = category === 'towing' && !d.answers.drop?.trim();
  const needsLocation = !d.location.trim();
  const descRequired = DESCRIPTION_REQUIRED.includes(category);
  const needsDesc = descRequired && !d.answers.notes?.trim();
  const disabled = hasActive || needsLocation || needsDrop || needsDesc || !d.car.trim();

  const onContinue = () => {
    setDraft({ ...d, price });
    router.push('/payment');
  };

  return (
    <Page
      header={<Header title={cat.fullName} subtitle="New service request" fallback="/(tabs)"
        right={<View style={s.catIcon}><Icon name={cat.icon} size={22} color={colors.orange} /></View>} />}
      footer={
        <>
          <View style={s.footTop}>
            <View>
              <Text style={s.footLabel}>Total (incl. distance)</Text>
              <Text style={s.footTotal}>{money(price.total)}</Text>
            </View>
            <Pill text={`Pay ${money(price.advance)} now`} tone="orange" icon="cash-fast" />
          </View>
          <Button title="Review & Pay Advance" icon="arrow-right" onPress={onContinue} disabled={disabled} />
        </>
      }
    >
      {hasActive && (
        <View style={s.banner}>
          <Icon name="information-outline" size={20} color={colors.orange} />
          <Text style={s.bannerText}>You already have an active request. Finish it from the Track tab before booking another service.</Text>
        </View>
      )}

      <Text style={s.hint}>{cfg.hint}</Text>

      {/* 1) Universal fields */}
      <SectionTitle>Your car</SectionTitle>
      <Input icon="car-outline" placeholder="Car type / model (e.g. Honda Civic 2018)" value={d.car} onChangeText={(v) => set({ car: v })} />

      <FieldLabel>Service location</FieldLabel>
      <MapPreview height={140} label="Map preview (Google Maps comes with backend)" />
      <Input
        style={{ marginTop: 10 }} icon="map-marker-outline" placeholder="Enter address or landmark"
        value={d.location} onChangeText={(v) => set({ location: v })}
      />
      <Pressable style={s.gps} onPress={() => set({ location: 'Gulberg III, Lahore' })}>
        <Icon name="crosshairs-gps" size={18} color={colors.orange} />
        <Text style={s.gpsText}>Use my current location</Text>
      </Pressable>

      <View style={{ marginTop: 14 }}>
        <ToggleRow
          icon="alert-octagon-outline" tone="red" label="This is an emergency" value={d.emergency} onChange={(v) => set({ emergency: v })}
          sub={`Goes to the front of the queue if the worker is busy. Adds Rs ${EMERGENCY_CHARGE} emergency charge.`}
        />
      </View>

      {/* 2) Category ke fields */}
      <SectionTitle>Service details</SectionTitle>
      {cfg.fields.filter((f) => !f.showIf || f.showIf(d.answers)).map((f) => (
        <View key={f.key} style={f.type === 'toggle' ? { marginTop: 12 } : null}>
          {f.type !== 'toggle' && f.type !== 'checklist' ? <FieldLabel>{f.label}</FieldLabel> : null}
          {f.type === 'choice' && <ChoiceRow options={f.options} value={d.answers[f.key]} onChange={(v) => setAns(f.key, v)} />}
          {f.type === 'select' && <Select options={f.options} value={d.answers[f.key]} onChange={(v) => setAns(f.key, v)} />}
          {f.type === 'stepper' && <Stepper value={d.answers[f.key]} min={f.min} max={f.max} unit={f.unit ?? 'L'} onChange={(v) => setAns(f.key, v)} />}
          {f.type === 'toggle' && <ToggleRow label={f.label} sub={f.sub} value={!!d.answers[f.key]} onChange={(v) => setAns(f.key, v)} />}
          {f.type === 'text' && (
            <Input icon={f.icon} multiline={f.multiline} placeholder={f.placeholder} value={d.answers[f.key]} onChangeText={(v) => setAns(f.key, v)} />
          )}
          {f.type === 'photos' && <PhotoPicker value={d.answers[f.key]} max={f.max} onChange={(v) => setAns(f.key, v)} />}
          {f.type === 'info' && (
            <Card style={s.info}><Icon name="information-outline" size={20} color={colors.orange} /><Text style={s.infoText}>{f.text({ car: d.car })}</Text></Card>
          )}
          {f.type === 'checklist' && (
            <>
              <FieldLabel>{f.label}</FieldLabel>
              <Card style={{ gap: 10 }}>
                {f.items.map((it) => (
                  <View key={it} style={s.checkRow}>
                    <Icon name="checkbox-marked-circle-outline" size={20} color={colors.green} />
                    <Text style={s.checkText}>{it}</Text>
                  </View>
                ))}
              </Card>
            </>
          )}
        </View>
      ))}

      {/* Description: har service par. General Repair mein zaroori, baaqi mein optional */}
      <FieldLabel>{descRequired ? 'Description (required)' : 'Description (optional)'}</FieldLabel>
      <Input
        icon="text-box-outline" multiline value={d.answers.notes} onChangeText={(v) => setAns('notes', v)}
        placeholder={descRequired ? 'Describe the problem, e.g. car shakes at high speed' : 'Anything the mechanic should know?'}
      />
      {needsDesc ? <Text style={s.req}>Please describe the problem to continue.</Text> : null}

      {/* 3) Price breakdown (booking se pehle, proposal ka Objective 2) */}
      <SectionTitle>Price breakdown</SectionTitle>
      <Card>
        {price.part > 0 ? <Row label={price.partLabel} value={money(price.part)} /> : null}
        <Row label={price.serviceLabel} value={money(price.service)} />
        <Row label="Distance charge" sub={`${price.km} km x Rs ${price.perKm} per km`} value={money(price.distance)} />
        {price.emergency > 0 ? <Row label="Emergency charge" sub="Priority dispatch" value={money(price.emergency)} color={colors.red} /> : null}
        <Divider />
        <Row label="Total" value={money(price.total)} bold color={colors.orange} />
      </Card>
      {price.note ? (
        <View style={s.noteBox}><Icon name="information-outline" size={18} color={colors.orange} /><Text style={s.noteText}>{price.note}</Text></View>
      ) : null}
      <View style={s.split}>
        <View style={s.splitBox}>
          <Text style={s.splitNum}>15%</Text>
          <Text style={s.splitMain}>{money(price.advance)}</Text>
          <Text style={s.splitSub}>Advance, paid now online</Text>
        </View>
        <View style={s.splitBox}>
          <Text style={s.splitNum}>85%</Text>
          <Text style={s.splitMain}>{money(price.cash)}</Text>
          <Text style={s.splitSub}>Cash to worker after the job</Text>
        </View>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  catIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  hint: { color: colors.muted, fontSize: 13.5, lineHeight: 19 },
  banner: { flexDirection: 'row', gap: 10, padding: 12, borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.1)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.35)', marginBottom: 12 },
  bannerText: { flex: 1, color: colors.text, fontSize: 13, lineHeight: 18 },
  gps: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-start' },
  gpsText: { color: colors.orange, fontSize: 14, fontWeight: '600' },
  info: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { color: colors.text, fontSize: 14, flex: 1 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkText: { color: colors.text, fontSize: 14 },
  req: { color: colors.red, fontSize: 12.5, marginTop: 8 },
  noteBox: { flexDirection: 'row', gap: 8, alignItems: 'flex-start', marginTop: 12, padding: 12, borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.1)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.35)' },
  noteText: { flex: 1, color: colors.text, fontSize: 12.5, lineHeight: 18 },
  split: { flexDirection: 'row', gap: 10, marginTop: 12 },
  splitBox: { flex: 1, padding: 14, borderRadius: radius.md, backgroundColor: '#12171E', borderWidth: 1, borderColor: '#2A323C' },
  splitNum: { color: colors.orange, fontSize: 13, fontWeight: '800' },
  splitMain: { color: colors.text, fontSize: 19, fontWeight: '800', marginTop: 4 },
  splitSub: { color: colors.muted, fontSize: 11.5, marginTop: 3 },
  footTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  footLabel: { color: colors.muted, fontSize: 12 },
  footTotal: { color: colors.text, fontSize: 22, fontWeight: '800' },
});
