import { View, Text, Pressable, ScrollView, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../../constants/categories';
import { colors, radius } from '../../constants/theme';
import Logo from '../../components/Logo';
import { useApp } from '../../state/AppState';
import { money } from '../../utils/format';

// ================= HOME SCREEN =================
// Ye file Home page hai. Abhi saara data dummy hai; login/backend ke baad asli aayega.

// Categories ko 4, 4, 3 ki rows mein baantna (design jaisa; aakhri row poori chaurai leti hai)
const ROWS = [CATEGORIES.slice(0, 4), CATEGORIES.slice(4, 8), CATEGORIES.slice(8)];

export default function Home() {
  const router = useRouter();
  const { job, notifications } = useApp();
  const hasUnread = notifications.some((n) => n.unread);
  const STATUS = { queued: 'In Queue', enroute: 'On the Way', arrived: 'Arrived', working: 'In Progress', payment: 'Payment Due' };
  const openBooking = (id) => router.push({ pathname: '/book/[category]', params: { category: id } });

  return (
    <SafeAreaView style={styles.flex} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header: logo, naam, tagline, bell */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Logo width={150} />
            <Text style={styles.sub}>
              Repairs <Text style={{ color: colors.orange }}>wherever you are.</Text>
            </Text>
          </View>
          <Pressable style={styles.bellWrap} onPress={() => router.push('/notifications')} hitSlop={8}>
            <MaterialCommunityIcons name="bell-outline" size={26} color={colors.text} />
            {hasUnread && <View style={styles.dot} />}
          </Pressable>
        </View>

        {/* Hero banner */}
        <View style={styles.hero}>
          <Image source={require('../../../assets/welcome-hero.jpg')} style={styles.heroImg} resizeMode="cover" />
          <LinearGradient
            colors={[colors.card, 'rgba(20,24,29,0.92)', 'rgba(20,24,29,0)']}
            locations={[0, 0.42, 0.85]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroText}>
            <Text style={styles.heroTag}>ON-DEMAND</Text>
            <Text style={styles.heroTitle}>
              Professional{'\n'}Mechanics{'\n'}at <Text style={{ color: colors.orange }}>Your Doorstep</Text>
            </Text>
            <Text style={styles.heroSub}>Quick  ·  Reliable  ·  Affordable</Text>
            <Pressable style={styles.heroBtn} onPress={() => openBooking('general')}>
              <Text style={styles.heroBtnText}>Book a Mechanic</Text>
              <MaterialCommunityIcons name="arrow-right" size={18} color="#fff" />
            </Pressable>
          </View>
        </View>

        {/* Our Services */}
        <Text style={styles.section}>Our Services</Text>
        <View style={{ gap: ROW_GAP }}>
          {ROWS.map((row, i) => (
            <View key={i} style={styles.row}>
              {row.map((c) => (
                <Pressable key={c.id} style={styles.cell} onPress={() => openBooking(c.id)}>
                  <MaterialCommunityIcons name={c.icon} size={28} color={colors.orange} />
                  <Text style={styles.cellText} numberOfLines={2}>{c.title}</Text>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        {/* Your Service Request (chalti hui request, Track tab se judi hui) */}
        <Text style={styles.section}>Your Service Request</Text>
        {job ? (
          <Pressable style={styles.request} onPress={() => router.push('/(tabs)/track')}>
            <View style={styles.reqIcon}>
              <MaterialCommunityIcons name="tools" size={28} color={colors.orange} />
            </View>
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={styles.reqTitle}>{job.title}</Text>
              <View style={styles.reqLine}>
                <MaterialCommunityIcons name="account-wrench-outline" size={14} color={colors.orange} />
                <Text style={styles.reqText}>{job.worker.name} ({job.worker.code})</Text>
              </View>
              <View style={styles.reqLine}>
                <MaterialCommunityIcons name="clock-outline" size={14} color={colors.orange} />
                <Text style={styles.reqText}>
                  {job.status === 'queued' ? `Wait: ~${job.waitMin} min` : job.status === 'enroute' ? `ETA: ${job.etaMin} min` : money(job.price.total)}
                </Text>
              </View>
            </View>
            <View style={styles.reqRight}>
              <View style={styles.statusRow}>
                <View style={styles.statusPill}><Text style={styles.statusText}>{STATUS[job.status]}</Text></View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={colors.text} />
              </View>
              <View style={styles.reqLine}>
                <MaterialCommunityIcons name="map-marker" size={14} color="#4DA3FF" />
                <Text style={[styles.reqText, { color: '#4DA3FF' }]} numberOfLines={1}>{job.location}</Text>
              </View>
            </View>
          </Pressable>
        ) : (
          <View style={[styles.request, { justifyContent: 'center' }]}>
            <MaterialCommunityIcons name="car-info" size={26} color={colors.muted} />
            <Text style={[styles.reqText, { flex: 1, fontSize: 13.5 }]}>No active request. Pick a service above to book one.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const ROW_GAP = 10;
const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 130 }, // floating navbar ke neeche content na chhupe

  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, gap: 10 },
  logo: { width: 44, height: 40, alignItems: 'center', justifyContent: 'flex-end' },
  logoPin: { position: 'absolute', top: -4, right: 0 },
  brand: { color: colors.text, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  sub: { color: colors.text, fontSize: 11.5, marginTop: 1 },
  bellWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  dot: {
    position: 'absolute', top: 3, right: 5, width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.orangeDark, borderWidth: 1.5, borderColor: colors.bg,
  },

  hero: {
    height: 190, borderRadius: radius.lg, overflow: 'hidden', backgroundColor: colors.card,
  },
  heroImg: { position: 'absolute', right: 0, top: 0, height: '100%', width: 270 },
  heroText: { flex: 1, padding: 16, justifyContent: 'center', gap: 5, maxWidth: '65%' },
  heroTag: { color: colors.orange, fontSize: 10.5, fontWeight: '700', letterSpacing: 1.2 },
  heroTitle: { color: colors.text, fontSize: 21, fontWeight: '800', lineHeight: 25 },
  heroSub: { color: colors.muted, fontSize: 11 },
  heroBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6,
    alignSelf: 'flex-start', height: 38, paddingHorizontal: 16, borderRadius: radius.pill,
    backgroundColor: colors.orange,
  },
  heroBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  section: { color: colors.text, fontSize: 18, fontWeight: '700', marginTop: 22, marginBottom: 12 },
  row: { flexDirection: 'row', gap: ROW_GAP },
  cell: {
    flex: 1, height: 86, borderRadius: radius.md, paddingHorizontal: 4,
    alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.card,
  },
  cellText: { color: colors.text, fontSize: 11, textAlign: 'center' },

  request: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: radius.lg,
    backgroundColor: colors.card,
  },
  reqIcon: {
    width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.cardAlt,
  },
  reqTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  reqLine: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  reqText: { color: colors.muted, fontSize: 12 },
  reqRight: { alignItems: 'flex-end', gap: 10 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statusPill: {
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill,
    backgroundColor: colors.greenSoft,
  },
  statusText: { color: colors.green, fontSize: 11, fontWeight: '600' },
});
