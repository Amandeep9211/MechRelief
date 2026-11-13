import { useState } from 'react';
import {
  View, Text, Image, Linking, Pressable, Modal, TextInput, Switch, ScrollView, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius, themed, useTheme } from '../constants/theme';

// Saari screens ke common tukde (header, button, card, inputs...). Taake har screen ek jaisi dikhe.

export function Header({ title, subtitle, right, onBack, fallback = '/(tabs)', hideBack }) {
  useTheme();
  const router = useRouter();
  const back = onBack ?? (() => (router.canGoBack() ? router.back() : router.replace(fallback)));
  return (
    <View style={u.header}>
      {hideBack ? <View style={{ width: 4 }} /> : (
        <Pressable onPress={back} hitSlop={10} style={u.backBtn}>
          <Icon name="chevron-left" size={26} color={colors.text} />
        </Pressable>
      )}
      <View style={{ flex: 1 }}>
        <Text style={u.headerTitle} numberOfLines={1}>{title}</Text>
        {subtitle ? <Text style={u.headerSub} numberOfLines={1}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

// Page = SafeArea + (optional header) + scroll + (optional sticky footer)
export function Page({ children, header, footer, tabbed, scroll = true, contentStyle }) {
  useTheme();
  const insets = useSafeAreaInsets();
  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[u.content, tabbed && { paddingBottom: 130 }, footer && { paddingBottom: 24 }, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[u.content, { flex: 1 }, contentStyle]}>{children}</View>
  );
  return (
    <SafeAreaView style={u.flex} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {header}
        {body}
        {footer ? <View style={[u.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>{footer}</View> : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Button({ title, icon, onPress, variant = 'primary', disabled, style, small }) {
  useTheme();
  const h = small ? 44 : 54;
  const content = (color) => (
    <>
      {icon ? <Icon name={icon} size={small ? 18 : 22} color={color} /> : null}
      <Text style={[u.btnText, small && { fontSize: 15 }, { color }]}>{title}</Text>
    </>
  );
  if (variant === 'primary') {
    return (
      <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => [{ opacity: disabled ? 0.45 : pressed ? 0.88 : 1 }, style]}>
        <LinearGradient colors={['#FF8A2A', colors.orangeDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={[u.btn, { height: h }]}>
          {content(colors.onAccent)}
        </LinearGradient>
      </Pressable>
    );
  }
  const tone = {
    ghost: { bg: 'transparent', border: colors.border, color: colors.text },
    soft: { bg: 'rgba(255,122,26,0.12)', border: 'rgba(255,122,26,0.35)', color: colors.orangeText },
    danger: { bg: colors.redSoft, border: 'rgba(229,50,45,0.5)', color: colors.redText },
    success: { bg: colors.greenSoft, border: 'rgba(63,191,111,0.5)', color: colors.green },
  }[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [u.btn, { height: h, backgroundColor: tone.bg, borderWidth: 1, borderColor: tone.border, opacity: disabled ? 0.45 : pressed ? 0.85 : 1 }, style]}
    >
      {content(tone.color)}
    </Pressable>
  );
}

export const Card = ({ children, style }) => {
  useTheme();
  return <View style={[u.card, style]}>{children}</View>;
};

export const SectionTitle = ({ children, right }) => {
  useTheme();
  return (
  <View style={u.sectionRow}>
    <Text style={u.section}>{children}</Text>
    {right}
  </View>
);
};

export function Pill({ text, tone = 'orange', icon }) {
  useTheme();
  const t = {
    orange: ['rgba(255,122,26,0.14)', colors.orangeText],
    green: [colors.greenSoft, colors.green],
    red: [colors.redSoft, colors.redText],
    blue: ['rgba(77,163,255,0.14)', colors.blue],
    gray: ['rgba(154,163,173,0.14)', colors.muted],
  }[tone];
  return (
    <View style={[u.pill, { backgroundColor: t[0] }]}>
      {icon ? <Icon name={icon} size={12} color={t[1]} /> : null}
      <Text style={[u.pillText, { color: t[1] }]}>{text}</Text>
    </View>
  );
}

export function Avatar({ name = '?', size = 48 }) {
  useTheme();
  const initials = name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.cardAlt, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: colors.orangeText, fontWeight: '800', fontSize: size * 0.36 }}>{initials}</Text>
    </View>
  );
}

export const Row = ({ label, value, bold, color, sub }) => {
  useTheme();
  return (
  <View style={u.row}>
    <View style={{ flex: 1 }}>
      <Text style={[u.rowLabel, bold && { color: colors.text, fontWeight: '700' }]}>{label}</Text>
      {sub ? <Text style={u.rowSub}>{sub}</Text> : null}
    </View>
    <Text style={[u.rowValue, bold && { fontSize: 17, fontWeight: '800' }, color && { color }]}>{value}</Text>
  </View>
);
};

export const Divider = () => {
  useTheme();
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 10 }} />;
};

export const FieldLabel = ({ children }) => {
  useTheme();
  return <Text style={u.fieldLabel}>{children}</Text>;
};

export function Input({ icon, style, multiline, ...props }) {
  useTheme();
  const [focus, setFocus] = useState(false);
  return (
    <View style={[u.input, multiline && { height: 92, alignItems: 'flex-start', paddingTop: 14 }, focus && { borderColor: colors.orange }, style]}>
      {icon ? <Icon name={icon} size={22} color={colors.orange} /> : null}
      <TextInput
        style={[u.inputText, multiline && { height: '100%', textAlignVertical: 'top' }]}
        placeholderTextColor={colors.muted}
        multiline={multiline}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />
    </View>
  );
}

// Chhote options ke liye: kai cards mein se ek chuno.
export function ChoiceRow({ options, value, onChange }) {
  useTheme();
  return (
    <View style={u.choiceRow}>
      {options.map((opt) => {
        const on = value === opt.value;
        return (
          <Pressable key={opt.value} onPress={() => onChange(opt.value)} style={[u.choice, on && u.choiceOn]}>
            <View style={[u.radio, on && { borderColor: colors.orange }]}>{on ? <View style={u.radioDot} /> : null}</View>
            <View style={{ flex: 1 }}>
              <Text style={[u.choiceText, on && { color: colors.text }]}>{opt.label}</Text>
              {opt.sub ? <Text style={u.choiceSub}>{opt.sub}</Text> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

// Dropdown (neeche se sheet khulti hai)
export function Select({ value, options, onChange, icon = 'chevron-down-circle-outline' }) {
  useTheme();
  const [open, setOpen] = useState(false);
  const cur = options.find((o) => o.value === value);
  return (
    <>
      <Pressable onPress={() => setOpen(true)} style={u.input}>
        <Icon name={icon} size={22} color={colors.orange} />
        <Text style={[u.inputText, { paddingVertical: 16 }]} numberOfLines={1}>{cur?.label ?? 'Select'}</Text>
        {cur?.right ? <Text style={u.selRight}>{cur.right}</Text> : null}
        <Icon name="chevron-down" size={22} color={colors.muted} />
      </Pressable>
      <Modal transparent visible={open} animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={u.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={u.sheet} onPress={() => {}}>
            <View style={u.grabber} />
            {options.map((o) => (
              <Pressable key={o.value} onPress={() => { onChange(o.value); setOpen(false); }} style={u.sheetItem}>
                <View style={{ flex: 1 }}>
                  <Text style={[u.sheetText, o.value === value && { color: colors.orangeText, fontWeight: '700' }]}>{o.label}</Text>
                  {o.sub ? <Text style={u.choiceSub}>{o.sub}</Text> : null}
                </View>
                {o.right ? <Text style={[u.sheetRight, o.value === value && { color: colors.orangeText }]}>{o.right}</Text> : null}
                {o.value === value ? <Icon name="check" size={20} color={colors.orange} /> : null}
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

export function Stepper({ value, onChange, min = 1, max = 99, unit }) {
  useTheme();
  const btn = (name, fn, off) => (
    <Pressable onPress={fn} disabled={off} style={[u.stepBtn, off && { opacity: 0.35 }]}>
      <Icon name={name} size={22} color={colors.orange} />
    </Pressable>
  );
  return (
    <View style={u.stepper}>
      {btn('minus', () => onChange(Math.max(min, value - 1)), value <= min)}
      <Text style={u.stepValue}>{value}{unit ? ` ${unit}` : ''}</Text>
      {btn('plus', () => onChange(Math.min(max, value + 1)), value >= max)}
    </View>
  );
}

// Photos (denting): gallery se chun sakte hain ya camera se kheench sakte hain. Max `max` photos.
export function PhotoPicker({ value = [], onChange, max = 4 }) {
  useTheme();
  const add = async (fromCamera) => {
    try {
      const perm = fromCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) return;
      const opts = { mediaTypes: ['images'], quality: 0.6, allowsMultipleSelection: !fromCamera, selectionLimit: max - value.length };
      const res = fromCamera ? await ImagePicker.launchCameraAsync(opts) : await ImagePicker.launchImageLibraryAsync(opts);
      if (res.canceled) return;
      onChange([...value, ...res.assets.map((a) => a.uri)].slice(0, max));
    } catch (e) { /* camera na ho (web / emulator) to chup-chaap ignore */ }
  };
  return (
    <View>
      <View style={u.photoGrid}>
        {value.map((uri, i) => (
          <View key={uri + i} style={u.photoBox}>
            <Image source={{ uri }} style={u.photoImg} />
            <Pressable onPress={() => onChange(value.filter((_, j) => j !== i))} style={u.photoX} hitSlop={6}>
              <Icon name="close" size={14} color={colors.onAccent} />
            </Pressable>
          </View>
        ))}
        {value.length < max ? (
          <Pressable onPress={() => add(false)} style={[u.photoBox, u.photoAdd]}>
            <Icon name="image-plus" size={26} color={colors.orange} />
            <Text style={u.photoAddText}>Add photo</Text>
          </Pressable>
        ) : null}
      </View>
      {Platform.OS !== 'web' && value.length < max ? (
        <Pressable onPress={() => add(true)} style={u.photoCam}>
          <Icon name="camera-outline" size={18} color={colors.orange} />
          <Text style={u.photoCamText}>Take a photo with camera</Text>
        </Pressable>
      ) : null}
      <Text style={u.photoHint}>{value.length}/{max} photos. Clear photos help the mechanic quote faster.</Text>
    </View>
  );
}

// Call button: phone ka dialer khol deta hai (tel:). Booking ke baad customer aur mechanic ek dusre ko call kar sakte hain.
// compact = sirf gol icon, warna label ke saath lamba button.
export function CallButton({ phone, label = 'Call', compact }) {
  useTheme();
  const dial = () => { try { Linking.openURL(`tel:${String(phone).replace(/[^0-9+]/g, '')}`); } catch (e) { /* web par dialer na ho to ignore */ } };
  if (compact) {
    return (
      <Pressable onPress={dial} accessibilityLabel={label} style={({ pressed }) => [u.callRound, pressed && { opacity: 0.8 }]}>
        <Icon name="phone" size={22} color={colors.onAccent} />
      </Pressable>
    );
  }
  return (
    <Pressable onPress={dial} style={({ pressed }) => [u.callBar, pressed && { opacity: 0.85 }]}>
      <Icon name="phone" size={20} color={colors.green} />
      <Text style={u.callBarText}>{label}</Text>
      <Text style={u.callBarNum}>{phone}</Text>
    </Pressable>
  );
}

export function ToggleRow({ label, sub, value, onChange, tone = 'orange', icon }) {
  useTheme();
  const c = tone === 'red' ? colors.red : colors.orange;
  return (
    <Pressable onPress={() => onChange(!value)} style={[u.toggleRow, value && { borderColor: c, backgroundColor: tone === 'red' ? colors.redSoft : 'rgba(255,122,26,0.08)' }]}>
      {icon ? <Icon name={icon} size={24} color={c} /> : null}
      <View style={{ flex: 1 }}>
        <Text style={u.toggleLabel}>{label}</Text>
        {sub ? <Text style={u.toggleSub}>{sub}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onChange} trackColor={{ true: c, false: colors.fieldBorder }} thumbColor={colors.onAccent} />
    </Pressable>
  );
}

// Dark / Light chunne wali row (customer aur mechanic dono ki Profile mein)
export function AppearanceRow() {
  const { mode, pref, setMode } = useTheme();
  const opts = [['light', 'white-balance-sunny', 'Light'], ['dark', 'weather-night', 'Dark'], ['system', 'cellphone', 'System']];
  const sub = pref === 'system' ? `Following your phone (${mode === 'light' ? 'light' : 'dark'} right now)` : 'Choose how the app looks';
  return (
    <View style={ap.wrap}>
      <View style={ap.head}>
        <Icon name="theme-light-dark" size={22} color={colors.orange} />
        <View style={{ flex: 1 }}>
          <Text style={ap.title}>Appearance</Text>
          <Text style={ap.sub}>{sub}</Text>
        </View>
      </View>
      <View style={ap.seg}>
        {opts.map(([key, icon, label]) => {
          const on = pref === key;
          return (
            <Pressable key={key} onPress={() => setMode(key)} accessibilityRole="button" accessibilityLabel={`${label} theme`} style={[ap.opt, on && ap.optOn]}>
              <Icon name={icon} size={17} color={on ? colors.onAccent : colors.muted} />
              <Text style={[ap.optText, on && { color: colors.onAccent }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const ap = themed((colors) => ({
  wrap: { padding: 14, borderRadius: radius.md, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, gap: 12 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  title: { color: colors.text, fontSize: 15.5, fontWeight: '700' },
  sub: { color: colors.faint, fontSize: 12, marginTop: 2 },
  seg: { flexDirection: 'row', gap: 8, padding: 4, borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder },
  opt: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, height: 42, borderRadius: radius.sm },
  optOn: { backgroundColor: colors.orange },
  optText: { color: colors.muted, fontSize: 14, fontWeight: '700' },
}));

export function Stars({ value, onChange, size = 38 }) {
  useTheme();
  return (
    <View style={{ flexDirection: 'row', gap: 6 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Pressable key={n} disabled={!onChange} onPress={() => onChange && onChange(n)} hitSlop={4}>
          <Icon name={n <= value ? 'star' : 'star-outline'} size={size} color={n <= value ? colors.amber : colors.muted} />
        </Pressable>
      ))}
    </View>
  );
}

// Custom popup (Alert ki jagah, taake web par bhi chale)
export function ConfirmModal({ visible, title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger, onConfirm, onCancel, icon }) {
  useTheme();
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
      <View style={[u.backdrop, { justifyContent: 'center', padding: 24 }]}>
        <View style={u.dialog}>
          {icon ? (
            <View style={[u.dialogIcon, danger && { backgroundColor: colors.redSoft }]}>
              <Icon name={icon} size={28} color={danger ? colors.redText : colors.orange} />
            </View>
          ) : null}
          <Text style={u.dialogTitle}>{title}</Text>
          <Text style={u.dialogMsg}>{message}</Text>
          <View style={{ gap: 10, marginTop: 18 }}>
            <Button title={confirmText} variant={danger ? 'danger' : 'primary'} onPress={onConfirm} />
            {cancelText ? <Button title={cancelText} variant="ghost" onPress={onCancel} /> : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function Empty({ icon, title, note, action }) {
  useTheme();
  return (
    <View style={u.empty}>
      <View style={u.emptyIcon}><Icon name={icon} size={38} color={colors.orange} /></View>
      <Text style={u.emptyTitle}>{title}</Text>
      <Text style={u.emptyNote}>{note}</Text>
      {action ? <View style={{ marginTop: 18, alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}

// Vertical progress steps (Track screen ke liye)
export function Timeline({ steps, current }) {
  useTheme();
  return (
    <View>
      {steps.map((s, i) => {
        const done = i < current, now = i === current;
        return (
          <View key={s} style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <View style={[u.tDot, done && { backgroundColor: colors.green, borderColor: colors.green }, now && { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.2)' }]}>
                {done ? <Icon name="check" size={13} color={colors.onAccent} /> : now ? <View style={u.tNow} /> : null}
              </View>
              {i < steps.length - 1 ? <View style={[u.tLine, done && { backgroundColor: colors.green }]} /> : null}
            </View>
            <Text style={[u.tText, (done || now) && { color: colors.text }, now && { fontWeight: '700' }]}>{s}</Text>
          </View>
        );
      })}
    </View>
  );
}

// Floating, curved navbar ki style (customer aur mechanic dono tabs mein same)
export function useTabBarStyle() {
  useTheme();
  const insets = useSafeAreaInsets();
  return {
    position: 'absolute', left: 16, right: 16, bottom: Math.max(insets.bottom, 8) + 10, height: 68,
    paddingTop: 8, paddingBottom: 10, borderRadius: 32, backgroundColor: colors.nav, borderWidth: 1, borderColor: colors.navBorder, borderTopWidth: 1, borderTopColor: colors.navBorder,
    elevation: 14, shadowColor: '#000', shadowOpacity: colors.shadow, shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
  };
}

const u = themed((colors) => ({
  flex: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  headerTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  headerSub: { color: colors.muted, fontSize: 12.5, marginTop: 1 },
  footer: { paddingHorizontal: 16, paddingTop: 12, backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, borderTopLeftRadius: 24, borderTopRightRadius: 24 },

  btn: { borderRadius: radius.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingHorizontal: 18 },
  btnText: { fontSize: 17, fontWeight: '700' },

  card: { padding: 16, borderRadius: radius.lg, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 12 },
  section: { color: colors.text, fontSize: 17, fontWeight: '700' },

  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  pillText: { fontSize: 11.5, fontWeight: '700' },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  rowLabel: { color: colors.muted, fontSize: 14 },
  rowSub: { color: colors.faint, fontSize: 11.5, marginTop: 1 },
  rowValue: { color: colors.text, fontSize: 14.5, fontWeight: '600' },

  fieldLabel: { color: colors.soft2, fontSize: 13.5, fontWeight: '600', marginBottom: 8, marginTop: 14 },
  input: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 54, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder },
  inputText: { flex: 1, minWidth: 0, color: colors.text, fontSize: 16, height: '100%', ...Platform.select({ web: { outlineStyle: 'none' } }) },

  choiceRow: { gap: 10 },
  choice: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder },
  choiceOn: { borderColor: colors.orange, backgroundColor: 'rgba(255,122,26,0.08)' },
  choiceText: { color: colors.muted, fontSize: 15, fontWeight: '600' },
  choiceSub: { color: colors.faint, fontSize: 12, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.muted, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.orange },

  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.card, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 16, paddingBottom: 30, borderWidth: 1, borderColor: colors.border },
  grabber: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: 10 },
  sheetItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 6, borderBottomWidth: 1, borderBottomColor: colors.border },
  sheetRight: { color: colors.muted, fontSize: 15, fontWeight: '700', marginRight: 10 },
  selRight: { color: colors.orangeText, fontSize: 14, fontWeight: '700' },
  sheetText: { color: colors.text, fontSize: 16 },

  photoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  photoBox: { width: 92, height: 92, borderRadius: radius.md, overflow: 'hidden', backgroundColor: colors.field },
  photoImg: { width: '100%', height: '100%' },
  photoX: { position: 'absolute', top: 5, right: 5, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.65)', alignItems: 'center', justifyContent: 'center' },
  photoAdd: { alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.orange },
  photoAddText: { color: colors.orangeText, fontSize: 12, fontWeight: '600' },
  photoCam: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12, alignSelf: 'flex-start' },
  photoCamText: { color: colors.orangeText, fontSize: 14, fontWeight: '600' },
  photoHint: { color: colors.muted, fontSize: 12, marginTop: 10 },
  callRound: { width: 46, height: 46, borderRadius: 23, backgroundColor: colors.green, alignItems: 'center', justifyContent: 'center' },
  callBar: { flexDirection: 'row', alignItems: 'center', gap: 10, height: 50, paddingHorizontal: 16, borderRadius: radius.md, backgroundColor: colors.greenSoft },
  callBarText: { color: colors.green, fontWeight: '700', fontSize: 15, flex: 1 },
  callBarNum: { color: colors.muted, fontSize: 13 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 54, borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder, paddingHorizontal: 8 },
  stepBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,122,26,0.12)' },
  stepValue: { color: colors.text, fontSize: 18, fontWeight: '700' },

  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: radius.md, backgroundColor: colors.field, borderWidth: 1, borderColor: colors.fieldBorder },
  toggleLabel: { color: colors.text, fontSize: 15, fontWeight: '600' },
  toggleSub: { color: colors.muted, fontSize: 12, marginTop: 2, lineHeight: 16 },

  dialog: { backgroundColor: colors.card, borderRadius: 28, padding: 22, borderWidth: 1, borderColor: colors.border },
  dialogIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,122,26,0.14)', alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  dialogTitle: { color: colors.text, fontSize: 20, fontWeight: '800' },
  dialogMsg: { color: colors.soft, fontSize: 14.5, marginTop: 8, lineHeight: 21 },

  empty: { alignItems: 'center', paddingVertical: 50, paddingHorizontal: 20 },
  emptyIcon: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,122,26,0.1)', alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '800', marginTop: 16 },
  emptyNote: { color: colors.muted, fontSize: 14, textAlign: 'center', marginTop: 6, lineHeight: 20 },

  tDot: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  tNow: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.orange },
  tLine: { width: 2, height: 22, backgroundColor: colors.border },
  tText: { color: colors.muted, fontSize: 14, paddingTop: 2, paddingBottom: 18 },
}));
