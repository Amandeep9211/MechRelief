import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { colors, themed, useTheme } from '../constants/theme';

// Map ki jagah ek khud-banaya hua "map preview" (koi API key nahi chahiye).
// Backend step mein yahan asli Google Map aayega. Props:
//  - route: worker se customer tak ka rasta dikhao
//  - worker: worker ka marker dikhao
//  - progress: 0..1, worker rasta kitna tay kar chuka (marker aage barhta hai)
export default function MapPreview({ height = 200, route = false, worker = false, progress = 0.35, label, style }) {
  useTheme();
  const you = { x: 0.74, y: 0.7 };
  const start = { x: 0.16, y: 0.24 };
  const mid = { x: you.x, y: start.y };       // rasta: pehle seedha, phir neeche
  // L-shaped rasta dots se
  const dots = [];
  const N = 22;
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const p = t < 0.55
      ? { x: start.x + (mid.x - start.x) * (t / 0.55), y: start.y }
      : { x: mid.x, y: mid.y + (you.y - mid.y) * ((t - 0.55) / 0.45) };
    dots.push({ ...p, t });
  }
  const w = dots.find((d) => d.t >= progress) ?? dots[dots.length - 1];

  return (
    <View style={[s.map, { height }, style]}>
      {/* Grid = galiyan */}
      {[0.18, 0.38, 0.58, 0.78].map((y) => <View key={'h' + y} style={[s.road, { top: `${y * 100}%`, left: 0, right: 0, height: 9 }]} />)}
      {[0.12, 0.34, 0.56, 0.78].map((x) => <View key={'v' + x} style={[s.road, { left: `${x * 100}%`, top: 0, bottom: 0, width: 9 }]} />)}
      <View style={[s.block, { left: '38%', top: '22%', width: '14%', height: '12%' }]} />
      <View style={[s.block, { left: '60%', top: '42%', width: '12%', height: '12%' }]} />
      <View style={[s.block, { left: '14%', top: '62%', width: '16%', height: '12%' }]} />

      {route && dots.map((d, i) => (
        <View key={i} style={[s.dot, { left: `${d.x * 100}%`, top: `${d.y * 100}%`, opacity: d.t <= progress ? 0.35 : 1 }]} />
      ))}

      {/* Customer ki location */}
      <View style={[s.marker, { left: `${you.x * 100}%`, top: `${you.y * 100}%` }]}>
        <View style={s.pulse} />
        <Icon name="map-marker" size={34} color={colors.orange} style={{ marginTop: -26 }} />
      </View>

      {worker && (
        <View style={[s.marker, { left: `${w.x * 100}%`, top: `${w.y * 100}%` }]}>
          <View style={s.car}><Icon name="car-wrench" size={18} color={colors.onAccent} /></View>
        </View>
      )}

      {label ? (
        <View style={s.label}>
          <Icon name="map-outline" size={13} color={colors.muted} />
          <Text style={s.labelText}>{label}</Text>
        </View>
      ) : null}
    </View>
  );
}

const s = themed((colors) => ({
  map: { borderRadius: 20, overflow: 'hidden', backgroundColor: colors.mapBg, borderWidth: 1, borderColor: colors.border },
  road: { position: 'absolute', backgroundColor: colors.mapRoad },
  block: { position: 'absolute', backgroundColor: colors.mapBlock, borderRadius: 6 },
  dot: { position: 'absolute', width: 7, height: 7, borderRadius: 4, marginLeft: -3, marginTop: -3, backgroundColor: colors.orange },
  marker: { position: 'absolute', width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  pulse: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,122,26,0.18)' },
  car: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#2D6BFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.onAccent },
  label: { position: 'absolute', left: 10, bottom: 8, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.mapLabel, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  labelText: { color: colors.muted, fontSize: 10.5 },
}));
