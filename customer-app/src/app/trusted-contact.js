import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../constants/theme';
import { useApp } from '../state/AppState';
import { Page, Header, Button, Input, FieldLabel } from '../components/ui';

export default function TrustedContact() {
  useTheme();
  const router = useRouter();
  const { user, setUser } = useApp();
  const [name, setName] = useState(user.trusted.name);
  const [phone, setPhone] = useState(user.trusted.phone);
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) return setError('Please enter a name and a valid phone number.');
    if (phone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')) return setError('Your trusted contact must be a different number from your own.');
    setUser({ ...user, trusted: { name: name.trim(), phone: phone.trim() } });
    router.back();
  };

  return (
    <Page header={<Header title="Trusted Contact" fallback="/(tabs)/profile" />} footer={<Button title="Save Contact" icon="content-save-outline" onPress={save} />}>
      <View style={s.info}>
        <Icon name="shield-account" size={26} color={colors.orange} />
        <Text style={s.infoText}>If you press SOS during a job, this person gets an SMS with your live location, even if they do not have the app.</Text>
      </View>
      <FieldLabel>Contact name</FieldLabel>
      <Input icon="account-heart-outline" value={name} onChangeText={setName} placeholder="Full name" autoCapitalize="words" />
      <FieldLabel>Contact phone number</FieldLabel>
      <Input icon="phone-alert-outline" value={phone} onChangeText={setPhone} placeholder="03xx xxxxxxx" keyboardType="phone-pad" />
      {error ? <Text style={s.err}>{error}</Text> : null}
    </Page>
  );
}

const s = themed((colors) => ({
  info: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: 'rgba(255,122,26,0.08)', borderWidth: 1, borderColor: 'rgba(255,122,26,0.25)', marginBottom: 6 },
  infoText: { flex: 1, color: colors.soft2, fontSize: 13.5, lineHeight: 19 },
  err: { color: colors.red, fontSize: 13, marginTop: 12 },
}));
