import { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { useApp } from '../state/AppState';
import { Page, Header, Button } from '../components/ui';

// OTP verification. Do jagah use hoti hai:
//  mode = 'signup' -> code sahi hone par account ban jata hai aur user Home par jata hai
//  mode = 'reset'  -> code sahi hone par "Set new password" screen khulti hai
// Backend step mein code SMS gateway se aayega. Abhi demo ke liye code 123456 hai.
const DEMO_OTP = '123456';
const LEN = 6;
const RESEND_SECONDS = 45;

const maskPhone = (p = '') => {
  const d = p.replace(/\D/g, '');
  return d.length >= 7 ? `${d.slice(0, 4)} ••••• ${d.slice(-3)}` : p;
};

export default function VerifyOtp() {
  const router = useRouter();
  const { mode = 'signup', phone = '' } = useLocalSearchParams();
  const { pending, setUser, setPending } = useApp();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(RESEND_SECONDS);
  const [resent, setResent] = useState(false);
  const [focused, setFocused] = useState(true);
  const inputRef = useRef(null);
  const isSignup = mode === 'signup';

  useEffect(() => {
    if (seconds <= 0) return undefined;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  const onChange = (v) => {
    setError('');
    setCode(v.replace(/\D/g, '').slice(0, LEN));
  };

  const verify = () => {
    if (code.length < LEN) return setError('Please enter the 6-digit code.');
    if (code !== DEMO_OTP) return setError('That code is not correct. Please try again.');
    // TODO (backend step): POST /auth/verify-otp { phone, code }
    if (isSignup) {
      if (pending) setUser(pending);
      setPending(null);
      router.replace('/(tabs)');
    } else {
      router.replace({ pathname: '/reset-password', params: { phone } });
    }
  };

  const resend = () => {
    setCode('');
    setError('');
    setSeconds(RESEND_SECONDS);
    setResent(true);
    inputRef.current?.focus();
  };

  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <Page
      header={<Header title={isSignup ? 'Verify Phone Number' : 'Verify Your Number'} fallback={isSignup ? '/signup' : '/forgot-password'} />}
      footer={<Button title={isSignup ? 'Verify & Create Account' : 'Verify Code'} icon="shield-check-outline" onPress={verify} disabled={code.length < LEN} />}
    >
      <View style={s.hero}>
        <View style={s.iconWrap}><Icon name="message-processing-outline" size={40} color={colors.orange} /></View>
        <Text style={s.title}>Enter the 6-digit code</Text>
        <Text style={s.sub}>
          We sent a verification code by SMS to{'\n'}
          <Text style={s.phone}>{maskPhone(phone)}</Text>
        </Text>
      </View>

      {/* 6 dabbe + ek chhupa hua TextInput jo digits pakadta hai */}
      <Pressable style={s.boxesWrap} onPress={() => inputRef.current?.focus()}>
        <View style={s.boxes}>
          {Array.from({ length: LEN }).map((_, i) => {
            const active = focused && i === Math.min(code.length, LEN - 1);
            return (
              <View key={i} style={[s.box, active && s.boxActive, error && s.boxError, code[i] && s.boxFilled]}>
                <Text style={s.digit}>{code[i] ?? ''}</Text>
              </View>
            );
          })}
        </View>
        <TextInput
          ref={inputRef}
          value={code}
          onChangeText={onChange}
          keyboardType="number-pad"
          maxLength={LEN}
          autoFocus
          textContentType="oneTimeCode"
          autoComplete="sms-otp"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={s.hidden}
        />
      </Pressable>

      {error ? (
        <View style={s.errRow}><Icon name="alert-circle-outline" size={16} color={colors.red} /><Text style={s.err}>{error}</Text></View>
      ) : null}

      <View style={s.resendRow}>
        {seconds > 0 ? (
          <Text style={s.resendMuted}>Resend code in <Text style={{ color: colors.text, fontWeight: '700' }}>{mm}:{ss}</Text></Text>
        ) : (
          <Pressable onPress={resend} hitSlop={8}><Text style={s.resend}>Resend code</Text></Pressable>
        )}
      </View>
      {resent ? <Text style={s.sentNote}>A new code has been sent.</Text> : null}

      <Pressable onPress={() => router.back()} style={s.change}>
        <Icon name="pencil-outline" size={16} color={colors.orange} />
        <Text style={s.changeText}>Wrong number? Change it</Text>
      </Pressable>

      <View style={s.demo}>
        <Text style={s.demoTag}>DEMO MODE</Text>
        <Text style={s.demoText}>No SMS is sent in this demo. Use the code <Text style={{ color: colors.orange, fontWeight: '800', letterSpacing: 2 }}>{DEMO_OTP}</Text>.</Text>
      </View>
    </Page>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 10 },
  iconWrap: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,122,26,0.12)', alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 16 },
  sub: { color: '#AAB4C0', fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 22 },
  phone: { color: colors.text, fontWeight: '700' },
  boxesWrap: { marginTop: 22, alignItems: 'center' },
  boxes: { flexDirection: 'row', gap: 10 },
  box: { width: 48, height: 60, borderRadius: 14, backgroundColor: '#12171E', borderWidth: 1, borderColor: '#2A323C', alignItems: 'center', justifyContent: 'center' },
  boxActive: { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.08)' },
  boxFilled: { borderColor: '#3A434D' },
  boxError: { borderColor: colors.red },
  digit: { color: colors.text, fontSize: 26, fontWeight: '800' },
  hidden: { position: 'absolute', width: '100%', height: '100%', opacity: 0.01, color: 'transparent', ...Platform.select({ web: { outlineStyle: 'none', cursor: 'pointer' } }) },
  errRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 14 },
  err: { color: colors.red, fontSize: 13.5 },
  resendRow: { alignItems: 'center', marginTop: 22 },
  resendMuted: { color: colors.muted, fontSize: 14 },
  resend: { color: colors.orange, fontSize: 15, fontWeight: '700' },
  sentNote: { color: colors.green, fontSize: 12.5, textAlign: 'center', marginTop: 6 },
  change: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 18 },
  changeText: { color: colors.orange, fontSize: 14, fontWeight: '600' },
  demo: { marginTop: 28, padding: 14, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: '#3A434D', gap: 4 },
  demoTag: { color: colors.muted, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  demoText: { color: '#8B95A1', fontSize: 13, lineHeight: 19 },
});
