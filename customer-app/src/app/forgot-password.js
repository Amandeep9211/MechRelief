import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { Page, Header, Button, Input, FieldLabel } from '../components/ui';

// Forgot password, step 1: phone number do, SMS code aayega (verify-otp screen), phir naya password (reset-password).
export default function ForgotPassword() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  const send = () => {
    if (phone.replace(/\D/g, '').length < 10) return setError('Please enter a valid phone number (at least 10 digits).');
    setError('');
    // TODO (backend step): POST /auth/forgot-password { phone } sends the reset code by SMS.
    router.push({ pathname: '/verify-otp', params: { mode: 'reset', phone: phone.trim() } });
  };

  return (
    <Page
      header={<Header title="Forgot Password" fallback="/login" />}
      footer={<Button title="Send Verification Code" icon="send-outline" onPress={send} />}
    >
      <View style={s.hero}>
        <View style={s.iconWrap}><Icon name="lock-reset" size={42} color={colors.orange} /></View>
        <Text style={s.title}>Reset your password</Text>
        <Text style={s.sub}>Enter the phone number linked to your account. We will send you a 6-digit code to confirm it is you.</Text>
      </View>

      <FieldLabel>Phone number</FieldLabel>
      <Input icon="phone-outline" placeholder="03xx xxxxxxx" keyboardType="phone-pad" autoComplete="tel" value={phone} onChangeText={(v) => { setPhone(v); setError(''); }} />
      {error ? <Text style={s.err}>{error}</Text> : null}

      <View style={s.steps}>
        <Text style={s.stepsTitle}>How it works</Text>
        {['Enter your phone number', 'Type the 6-digit code we text you', 'Choose a new password'].map((t, i) => (
          <View key={t} style={s.step}>
            <View style={s.stepNum}><Text style={s.stepNumText}>{i + 1}</Text></View>
            <Text style={s.stepText}>{t}</Text>
          </View>
        ))}
      </View>

      <Pressable onPress={() => router.replace('/login')} style={s.back}>
        <Icon name="arrow-left" size={16} color={colors.orange} />
        <Text style={s.backText}>Back to login</Text>
      </Pressable>
    </Page>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 10, marginBottom: 6 },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,122,26,0.12)', alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 16 },
  sub: { color: '#AAB4C0', fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 21, paddingHorizontal: 8 },
  err: { color: colors.red, fontSize: 13, marginTop: 10 },
  steps: { marginTop: 26, padding: 16, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, gap: 12 },
  stepsTitle: { color: colors.text, fontSize: 15, fontWeight: '700' },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNum: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,122,26,0.14)', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { color: colors.orange, fontWeight: '800', fontSize: 13 },
  stepText: { color: '#C3CAD2', fontSize: 14, flex: 1 },
  back: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24 },
  backText: { color: colors.orange, fontSize: 14.5, fontWeight: '600' },
});
