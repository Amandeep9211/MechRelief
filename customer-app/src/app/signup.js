import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, Image, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import Logo from '../components/Logo';
import { useApp } from '../state/AppState';

// Customer signup screen. Abhi sirf screen + validation hai (backend agle step mein jurega).
// Mechanic accounts yahan nahi banate: unhe sirf admin add karta hai.

// Ek input field (icon + text). Baar baar likhna na pade is liye alag component.
function Field({ icon, name, focus, setFocus, right, ...props }) {
  return (
    <View style={[styles.input, focus === name && styles.inputFocus]}>
      <MaterialCommunityIcons name={icon} size={22} color={colors.orange} />
      <TextInput
        style={styles.inputText}
        placeholderTextColor={colors.muted}
        onFocus={() => setFocus(name)}
        onBlur={() => setFocus(null)}
        {...props}
      />
      {right}
    </View>
  );
}

export default function Signup() {
  const router = useRouter();
  const { user, setPending } = useApp();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [agree, setAgree] = useState(false);
  const [focus, setFocus] = useState(null);
  const [error, setError] = useState('');

  const digits = (s) => s.replace(/\D/g, '');

  const onSignup = () => {
    if (!name.trim() || !phone.trim() || !password || !confirm) {
      return setError('Please enter your name, phone number and password.');
    }
    if (digits(phone).length < 10) return setError('Please enter a valid phone number (at least 10 digits).');
    if (password.length < 6) return setError('Your password must be at least 6 characters long.');
    if (password !== confirm) return setError('The two passwords do not match.');
    if (!contactName.trim() || digits(contactPhone).length < 10) {
      return setError('Please enter your trusted contact\'s name and a valid phone number for SOS alerts.');
    }
    if (digits(contactPhone) === digits(phone)) {
      return setError('Your trusted contact must be a different number from your own.');
    }
    if (!agree) return setError('Please accept the Terms & Privacy Policy to continue.');
    setError('');
    // Account abhi nahi banta: pehle phone number OTP se verify hoga (verify-otp screen).
    setPending({ name: name.trim(), phone: phone.trim(), car: user.car, trusted: { name: contactName.trim(), phone: contactPhone.trim() } });
    // TODO (backend step): POST /auth/signup sends the OTP SMS; POST /auth/verify-otp creates the account.
    router.push({ pathname: '/verify-otp', params: { mode: 'signup', phone: phone.trim() } });
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.flex}>
        <LinearGradient colors={['#141A22', colors.bg]} style={StyleSheet.absoluteFill} />
        <SafeAreaView style={styles.flex}>
          <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {/* Header: back button, logo, photo */}
            <View style={styles.header}>
              <View style={styles.heroBox}>
                <Image source={require('../../assets/login-hero.jpg')} style={styles.heroImg} resizeMode="cover" />
                <LinearGradient
                  colors={[colors.bg, 'rgba(11,13,16,0)']}
                  locations={[0, 0.2]}
                  start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
                  style={StyleSheet.absoluteFill}
                />
                <LinearGradient colors={[colors.bg, 'rgba(11,13,16,0)']} style={styles.heroTopFade} />
              </View>

              <Pressable onPress={() => router.back()} hitSlop={10} style={styles.back}>
                <MaterialCommunityIcons name="chevron-left" size={26} color={colors.text} />
              </Pressable>

              <View style={styles.brandBlock}>
                <Logo width={150} />
                <Text style={styles.tagline}>Repairs</Text>
                <Text style={[styles.tagline, { color: colors.orange, fontWeight: '600' }]}>wherever you are.</Text>
              </View>
            </View>

            {/* Signup card */}
            <View style={styles.card}>
              <Text style={styles.title}>Create Account 🚀</Text>
              <Text style={styles.subtitle}>Sign up to get help on the road, anytime</Text>

              <Field
                icon="account-outline" name="name" focus={focus} setFocus={setFocus}
                placeholder="Full Name" autoComplete="name" autoCapitalize="words"
                value={name} onChangeText={setName}
              />
              <Field
                icon="phone-outline" name="phone" focus={focus} setFocus={setFocus}
                placeholder="Phone Number" keyboardType="phone-pad" autoComplete="tel"
                value={phone} onChangeText={setPhone}
              />
              <Field
                icon="lock-outline" name="password" focus={focus} setFocus={setFocus}
                placeholder="Password" secureTextEntry={!showPassword} autoCapitalize="none"
                value={password} onChangeText={setPassword}
                right={
                  <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
                    <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
                  </Pressable>
                }
              />
              <Field
                icon="lock-check-outline" name="confirm" focus={focus} setFocus={setFocus}
                placeholder="Confirm Password" secureTextEntry={!showPassword} autoCapitalize="none"
                value={confirm} onChangeText={setConfirm}
              />

              {/* Trusted contact (SOS) */}
              <View style={styles.sosHead}>
                <View style={styles.sosIcon}>
                  <MaterialCommunityIcons name="shield-account" size={20} color={colors.orange} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sosTitle}>Trusted Contact (SOS)</Text>
                  <Text style={styles.sosNote}>In an emergency, this person receives your live location by SMS.</Text>
                </View>
              </View>
              <Field
                icon="account-heart-outline" name="cname" focus={focus} setFocus={setFocus}
                placeholder="Contact Name" autoCapitalize="words"
                value={contactName} onChangeText={setContactName}
              />
              <Field
                icon="phone-alert-outline" name="cphone" focus={focus} setFocus={setFocus}
                placeholder="Contact Phone Number" keyboardType="phone-pad"
                value={contactPhone} onChangeText={setContactPhone}
              />

              {/* Terms */}
              <Pressable onPress={() => setAgree((v) => !v)} style={styles.terms} accessibilityRole="checkbox" accessibilityState={{ checked: agree }}>
                <View style={[styles.check, agree && styles.checkOn]}>
                  {agree && <MaterialCommunityIcons name="check" size={15} color="#fff" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.link}>Terms</Text> & <Text style={styles.link}>Privacy Policy</Text>
                </Text>
              </Pressable>

              {error ? <Text style={styles.error}>{error}</Text> : null}

              <Pressable onPress={onSignup} style={({ pressed }) => pressed && { opacity: 0.88 }}>
                <LinearGradient
                  colors={['#FF8A2A', colors.orangeDark]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.btn}
                >
                  <MaterialCommunityIcons name="account-plus-outline" size={22} color="#fff" />
                  <Text style={styles.btnText}>Create Account</Text>
                </LinearGradient>
              </Pressable>

              <View style={styles.loginRow}>
                <Text style={styles.loginMuted}>Already have an account?</Text>
                <Pressable onPress={() => router.replace('/login')} style={styles.loginLink}>
                  <Text style={styles.loginText}>Login</Text>
                  <MaterialCommunityIcons name="arrow-right" size={16} color={colors.orange} />
                </Pressable>
              </View>
            </View>

            <Text style={styles.footerText}>SAFE   ·   FAST   ·   RELIABLE</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 28 },

  header: { height: 190, overflow: 'hidden' },
  heroBox: { position: 'absolute', right: 0, bottom: 0, width: 235, height: 144 },
  heroImg: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' },
  heroTopFade: { position: 'absolute', left: 0, right: 0, top: 0, height: 40 },
  back: {
    position: 'absolute', top: 10, left: 14, width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(20,24,29,0.85)', borderWidth: 1, borderColor: '#262C33',
  },
  brandBlock: { flex: 1, justifyContent: 'flex-end', paddingLeft: 20, paddingBottom: 14 },
  tagline: { fontSize: 11.5, color: colors.text, marginTop: 3 },

  card: {
    marginHorizontal: 16, marginTop: -6, padding: 20, borderRadius: 28,
    backgroundColor: 'rgba(15,19,25,0.92)', borderWidth: 1, borderColor: '#242B34',
  },
  title: { color: colors.text, fontSize: 27, fontWeight: '800' },
  subtitle: { color: '#AAB4C0', fontSize: 14.5, marginTop: 6, marginBottom: 18 },

  input: {
    flexDirection: 'row', alignItems: 'center', gap: 12, height: 54, paddingHorizontal: 16,
    borderRadius: radius.md, backgroundColor: '#12171E', borderWidth: 1, borderColor: '#2A323C', marginBottom: 12,
  },
  inputFocus: { borderColor: colors.orange },
  inputText: { flex: 1, minWidth: 0, color: colors.text, fontSize: 16, height: '100%', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  sosHead: {
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, marginBottom: 14, padding: 12,
    borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.08)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.25)',
  },
  sosIcon: {
    width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,122,26,0.15)',
  },
  sosTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  sosNote: { color: '#AAB4C0', fontSize: 12, marginTop: 2, lineHeight: 16 },

  terms: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 14 },
  check: {
    width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: colors.muted,
    alignItems: 'center', justifyContent: 'center',
  },
  checkOn: { backgroundColor: colors.orange, borderColor: colors.orange },
  termsText: { color: '#AAB4C0', fontSize: 13.5, flexShrink: 1 },
  link: { color: colors.orange, fontWeight: '600' },

  error: { color: colors.red, fontSize: 13, marginBottom: 12, lineHeight: 18 },

  btn: {
    height: 54, borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 10,
  },
  btnText: { color: '#fff', fontSize: 19, fontWeight: '700' },

  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 20 },
  loginMuted: { color: '#AAB4C0', fontSize: 14 },
  loginLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  loginText: { color: colors.orange, fontSize: 15, fontWeight: '600' },

  footerText: { color: '#7C8794', fontSize: 11, letterSpacing: 2.5, textAlign: 'center', marginTop: 22 },
});
