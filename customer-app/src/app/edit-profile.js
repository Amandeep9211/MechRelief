import { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, themed, useTheme } from '../constants/theme';
import { useApp } from '../state/AppState';
import { Page, Header, Button, Input, FieldLabel, Avatar } from '../components/ui';

export default function EditProfile() {
  useTheme();
  const router = useRouter();
  const { user, setUser } = useApp();
  const [name, setName] = useState(user.name);
  const [car, setCar] = useState(user.car);
  const [error, setError] = useState('');

  const save = () => {
    if (!name.trim()) return setError('Please enter your name.');
    setUser({ ...user, name: name.trim(), car: car.trim() });
    router.back();
  };

  return (
    <Page header={<Header title="Edit Profile" fallback="/(tabs)/profile" />} footer={<Button title="Save Changes" icon="content-save-outline" onPress={save} />}>
      <View style={{ alignItems: 'center', paddingVertical: 8 }}><Avatar name={name || '?'} size={84} /></View>
      <FieldLabel>Full name</FieldLabel>
      <Input icon="account-outline" value={name} onChangeText={setName} placeholder="Full name" autoCapitalize="words" />
      <FieldLabel>Phone number</FieldLabel>
      <Input icon="phone-outline" value={user.phone} editable={false} style={{ opacity: 0.55 }} />
      <Text style={s.note}>Phone number is your login, so it cannot be changed here.</Text>
      <FieldLabel>My car (car type / model)</FieldLabel>
      <Input icon="car-outline" value={car} onChangeText={setCar} placeholder="e.g. Honda Civic 2018" />
      {error ? <Text style={s.err}>{error}</Text> : null}
    </Page>
  );
}

const s = themed((colors) => ({
  note: { color: colors.muted, fontSize: 12, marginTop: 6 },
  err: { color: colors.red, fontSize: 13, marginTop: 12 },
}));
