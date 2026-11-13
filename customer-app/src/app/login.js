import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../constants/theme';
import Logo from '../components/Logo';

// Login screen. Abhi sirf screen hai (backend login agle step mein jurega).
const ROLES = [
  { id: 'customer', label: 'Login as Customer' },
  { id: 'mechanic', label: 'Login as Mechanic' },
];

export default function Login() {
  useTheme();
  const router = useRouter();
  const [role, setRole] = useState('customer');       // radio button ki state
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focus, setFocus] = useState(null);           // kaunsa input chuna hua hai
  const [error, setError] = useState('');

  const onLogin = () => {
    if (!phone.trim() || !password) {
      setError('Please enter both your phone number and password.');
      return;
    }
    setError('');
    // TODO (backend step): yahan API call hogi: POST /auth/login { phone, password, role }
    router.replace(role === 'customer' ? '/(tabs)' : '/mechanic');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.flex}>
        <LinearGradient colors={[colors.bgTop, colors.bg]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Header: photo + logo + naam */}
            <View style={styles.header}>
              <View style={styles.heroBox}>
                <Image source={require('../../assets/login-hero.jpg')} style={styles.heroImg} resizeMode="cover" />
                <LinearGradient
                  colors={[colors.bg, colors.bgClear]}
                  locations={[0, 0.2]}
                  start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                <LinearGradient
                  colors={[colors.bg, colors.bgClear]}
                  style={styles.heroTopFade}
                />
              </View>
              <View style={styles.brandBlock}>
                <Logo width={150} />
                <Text style={styles.tagline}>Repairs</Text>
                <Text style={[styles.tagline, { color: colors.orangeText, fontWeight: '600' }]}>wherever you are.</Text>
              </View>
            </View>

            {/* Login card */}
            <View style={styles.card}>
              <Text style={styles.title}>Welcome Back 👋</Text>
              <Text style={styles.subtitle}>Sign in to your account to continue</Text>

              {/* Radio buttons: Customer / Mechanic */}
              <View style={styles.roles}>
                {ROLES.map((r) => {
                  const selected = role === r.id;
                  return (
                    <Pressable
                      key={r.id}
                      onPress={() => setRole(r.id)}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      style={[styles.role, selected && styles.roleSelected]}
                    >
                      <View style={[styles.radio, selected && styles.radioSelected]}>
                        {selected && <View style={styles.radioDot} />}
                      </View>
                      <Text style={[styles.roleText, selected && { color: colors.text }]}>{r.label}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Phone */}
              <View style={[styles.input, focus === 'phone' && styles.inputFocus]}>
                <MaterialCommunityIcons name="account-outline" size={24} color={colors.orange} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Phone Number"
                  placeholderTextColor={colors.muted}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setFocus('phone')}
                  onBlur={() => setFocus(null)}
                />
              </View>

              {/* Password */}
              <View style={[styles.input, focus === 'password' && styles.inputFocus]}>
                <MaterialCommunityIcons name="lock-outline" size={24} color={colors.orange} />
                <TextInput
                  style={styles.inputText}
                  placeholder="Password"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocus('password')}
                  onBlur={() => setFocus(null)}
                />
                <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                  <MaterialCommunityIcons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              </View>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable style={styles.forgot} onPress={() => router.push('/forgot-password')}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </Pressable>

              <Pressable onPress={onLogin} style={({ pressed }) => pressed && { opacity: 0.88 }}>
                <LinearGradient
                  colors={['#FF8A2A', colors.orangeDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.loginBtn}
                >
                  <MaterialCommunityIcons name="login" size={22} color={colors.onAccent} />
                  <Text style={styles.loginText}>Login</Text>
                </LinearGradient>
              </Pressable>

              {/* Sign Up sirf customer ke liye: workers sirf admin add karta hai */}
              {role === 'customer' && (
                <View style={styles.signupRow}>
                  <Text style={styles.signupMuted}>Don't have an account?</Text>
                  <Pressable onPress={() => router.push('/signup')} style={styles.signupLink}>
                    <Text style={styles.signupText}>Sign Up</Text>
                    <MaterialCommunityIcons name="arrow-right" size={16} color={colors.orange} />
                  </Pressable>
                </View>
              )}
              {role === 'mechanic' && (
                <Text style={styles.adminNote}>Mechanic accounts are created by the admin. Sign in with the details the admin gave you.</Text>
              )}
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <View style={styles.footerLogo}>
                <MaterialCommunityIcons name="car" size={22} color={colors.orange} />
                <MaterialCommunityIcons name="map-marker" size={13} color={colors.orange} style={{ position: 'absolute', top: -7, right: -4 }} />
              </View>
              <View style={styles.footerLine} />
            </View>
            <Text style={styles.footerText}>SAFE   ·   FAST   ·   RELIABLE</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = themed((colors) => ({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 24 },

  header: { height: 200, overflow: 'hidden' },
  heroBox: { position: 'absolute', right: 0, bottom: 0, width: 235, height: 144 },
  heroImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  heroTopFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 40 },
  brandBlock: { flex: 1, justifyContent: 'center', paddingLeft: 20 },
  logo: { width: 60, height: 50, justifyContent: 'flex-end' },
  logoPin: { position: 'absolute', top: -10, right: 2 },
  brand: { fontSize: 27, fontWeight: '800', color: colors.text, letterSpacing: -1, marginTop: 4 },
  tagline: { fontSize: 11.5, color: colors.text, marginTop: 3 },

  card: {
    marginHorizontal: 16, marginTop: -6, padding: 20, borderRadius: 28,
    backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.borderSoft,
  },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  subtitle: { color: colors.soft, fontSize: 14.5, marginTop: 6, marginBottom: 16 },

  roles: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  role: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 10, height: 46,
    borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder,
  },
  roleSelected: { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.08)' },
  radio: {
    width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: colors.orange },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange },
  roleText: { color: colors.muted, fontSize: 12.5, fontWeight: '600', flexShrink: 1 },

  input: {
    flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, paddingHorizontal: 16,
    borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder, marginBottom: 12,
  },
  inputFocus: { borderColor: colors.orange },
  inputText: { flex: 1, minWidth: 0, color: colors.text, fontSize: 16, height: '100%', ...Platform.select({ web: { outlineStyle: 'none' } }) },
  error: { color: colors.red, fontSize: 13, marginBottom: 6 },

  forgot: { alignSelf: 'flex-end', marginBottom: 16, marginTop: 2 },
  forgotText: { color: colors.orangeText, fontSize: 14 },

  loginBtn: {
    height: 54, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  loginText: { color: colors.onAccent, fontSize: 19, fontWeight: '700' },

  signupRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
  signupMuted: { color: colors.soft, fontSize: 14 },
  signupLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  signupText: { color: colors.orangeText, fontSize: 15, fontWeight: '600' },
  adminNote: { color: colors.soft, fontSize: 12.5, textAlign: 'center', marginTop: 18, lineHeight: 18 },

  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 22, paddingHorizontal: 40 },
  footerLine: { flex: 1, height: 1, backgroundColor: colors.borderSoft },
  footerLogo: { width: 34, height: 26, alignItems: 'center', justifyContent: 'center' },
  footerText: { color: colors.faint, fontSize: 11, letterSpacing: 2.5, textAlign: 'center', marginTop: 10 },
}));
