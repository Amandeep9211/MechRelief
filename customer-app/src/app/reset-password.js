import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius } from '../constants/theme';
import { Page, Header, Button, Input, FieldLabel } from '../components/ui';

// Forgot password, step 3: naya password set karo. Phir login par wapas.
export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const rules = [
    ['At least 6 characters', password.length >= 6],
    ['Both passwords match', password.length > 0 && password === confirm],
  ];

  const save = () => {
    if (password.length < 6) return setError('Your password must be at least 6 characters long.');
    if (password !== confirm) return setError('The two passwords do not match.');
    setError('');
    // TODO (backend step): POST /auth/reset-password { phone, code, newPassword }
    setDone(true);
  };

  if (done) {
    return (
      <Page footer={<Button title="Back to Login" icon="login" onPress={() => router.replace('/login')} />}>
        <View style={s.hero}>
          <View style={[s.iconWrap, { backgroundColor: colors.green }]}><Icon name="check" size={46} color="#fff" /></View>
          <Text style={s.title}>Password updated</Text>
          <Text style={s.sub}>Your password has been changed. You can now sign in with your new password.</Text>
        </View>
      </Page>
    );
  }

  const eye = (
    <Pressable onPress={() => setShow((v) => !v)} hitSlop={10}>
      <Icon name={show ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.muted} />
    </Pressable>
  );

  return (
    <Page
      header={<Header title="New Password" fallback="/login" />}
      footer={<Button title="Reset Password" icon="lock-check-outline" onPress={save} />}
    >
      <View style={s.hero}>
        <View style={s.iconWrap}><Icon name="shield-lock-outline" size={42} color={colors.orange} /></View>
        <Text style={s.title}>Create a new password</Text>
        <Text style={s.sub}>Your number is verified. Choose a new password for your account.</Text>
      </View>

      <FieldLabel>New password</FieldLabel>
      <Input icon="lock-outline" placeholder="New password" secureTextEntry={!show} autoCapitalize="none" value={password} onChangeText={(v) => { setPassword(v); setError(''); }} />
      <FieldLabel>Confirm new password</FieldLabel>
      <View>
        <Input icon="lock-check-outline" placeholder="Confirm new password" secureTextEntry={!show} autoCapitalize="none" value={confirm} onChangeText={(v) => { setConfirm(v); setError(''); }} />
        <View style={s.eye}>{eye}</View>
      </View>

      <View style={s.rules}>
        {rules.map(([t, ok]) => (
          <View key={t} style={s.rule}>
            <Icon name={ok ? 'check-circle' : 'circle-outline'} size={18} color={ok ? colors.green : colors.muted} />
            <Text style={[s.ruleText, ok && { color: colors.text }]}>{t}</Text>
          </View>
        ))}
      </View>
      {error ? <Text style={s.err}>{error}</Text> : null}
    </Page>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', paddingVertical: 10, marginBottom: 6 },
  iconWrap: { width: 88, height: 88, borderRadius: 44, backgroundColor: 'rgba(255,122,26,0.12)', alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  sub: { color: '#AAB4C0', fontSize: 14.5, textAlign: 'center', marginTop: 8, lineHeight: 21, paddingHorizontal: 8 },
  eye: { position: 'absolute', right: 16, top: 0, bottom: 0, justifyContent: 'center' },
  rules: { marginTop: 16, gap: 8 },
  rule: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleText: { color: colors.muted, fontSize: 13.5 },
  err: { color: colors.red, fontSize: 13, marginTop: 12 },
});
