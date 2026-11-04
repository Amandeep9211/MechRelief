import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../constants/theme';

// Un screens ke liye jo abhi banne baaki hain.
export default function ComingSoon({ title, icon, note }) {
  return (
    <SafeAreaView style={styles.wrap}>
      <MaterialCommunityIcons name={icon} size={48} color={colors.orange} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.note}>{note}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: colors.bg },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginTop: 14 },
  note: { color: colors.muted, fontSize: 14, marginTop: 6, textAlign: 'center' },
});
