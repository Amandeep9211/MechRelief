import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import Logo from '../components/Logo';

const FEATURES = [
  { icon: 'shield-check', label: 'Trusted\nExperts' },
  { icon: 'lightning-bolt', label: 'Fast\nResponse' },
  { icon: 'map-marker', label: 'Live\nTracking' },
  { icon: 'shield-lock', label: 'Safe &\nSecure' },
];

// Pehli screen (Welcome). File ka naam index.js => route "/"
export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.flex}>
      <LinearGradient colors={['#1A212A', colors.bg]} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.flex}>
        {/* Logo, naam, tagline */}
        <View style={styles.top}>
          <Logo width={270} />
          <Text style={[styles.tagline, { marginTop: 14 }]}>Repairs</Text>
          <Text style={[styles.tagline, { color: colors.orange, marginTop: 2 }]}>wherever you are.</Text>
        </View>

        {/* Photo: upar aur neeche se background mein ghul jati hai */}
        <View style={styles.photoWrap}>
          <Image source={require('../../assets/welcome-hero.jpg')} style={styles.photo} resizeMode="cover" />
          <LinearGradient colors={[colors.bg, 'rgba(11,13,16,0)']} style={[styles.fade, { top: 0 }]} pointerEvents="none" />
          <LinearGradient colors={['rgba(11,13,16,0)', colors.bg]} style={[styles.fade, { bottom: 0 }]} pointerEvents="none" />
        </View>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((f, i) => (
            <View key={f.icon} style={[styles.feature, i > 0 && styles.divider]}>
              <View style={styles.featureIcon}>
                <MaterialCommunityIcons name={f.icon} size={22} color={colors.orange} />
              </View>
              <Text style={styles.featureLabel}>{f.label}</Text>
            </View>
          ))}
        </View>

        <Pressable
          onPress={() => router.push('/login')}
          style={({ pressed }) => [styles.cta, pressed && { opacity: 0.85 }]}
        >
          <Text style={styles.ctaText}>Get Started</Text>
          <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  logo: { width: 110, height: 90, alignItems: 'center', justifyContent: 'flex-end' },
  pin: { position: 'absolute', top: -6, right: 2 },
  brand: { fontSize: 46, fontWeight: '800', color: colors.text, letterSpacing: -1, marginTop: 4 },
  tagline: { fontSize: 19, fontWeight: '600', color: colors.text, marginTop: 8, textAlign: 'center' },

  photoWrap: { width: '100%', aspectRatio: 1008 / 795 },
  photo: { ...StyleSheet.absoluteFillObject, width: '100%', height: '100%' },
  fade: { position: 'absolute', left: 0, right: 0, height: 60 },

  features: { flexDirection: 'row', marginHorizontal: 12, paddingVertical: 10 },
  feature: { flex: 1, alignItems: 'center' },
  divider: { borderLeftWidth: 1, borderLeftColor: colors.border },
  featureIcon: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,122,26,0.12)', marginBottom: 6,
  },
  featureLabel: { fontSize: 11, color: colors.text, textAlign: 'center', lineHeight: 14 },

  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginHorizontal: 16, marginTop: 12, marginBottom: 12, height: 54, borderRadius: radius.md,
    backgroundColor: colors.orange,
  },
  ctaText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
