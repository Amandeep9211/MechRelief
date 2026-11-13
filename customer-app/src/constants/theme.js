import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

// Saare colours, spacing aur fonts ek hi jagah. Design badalna ho to sirf yahan badlo.
// App ke do theme hain: dark (default) aur light. Dono ke token (naam) bilkul same hain,
// sirf values alag hain. Isliye screens mein sirf `colors.card`, `colors.text` jaise naam likhe jate hain.

const dark = {
  bg: '#0B0D10',
  bgTop: '#161C24', // login / welcome ke upar wala halka gradient
  bgClear: 'rgba(11,13,16,0)', // bg ka transparent roop (photo fade ke liye)
  card: '#14181D',
  cardAlt: '#1A1F25',
  glass: 'rgba(15,19,25,0.92)', // login/signup ka card
  glass2: 'rgba(20,24,29,0.85)',
  cardClear: 'rgba(20,24,29,0)',
  border: '#262C33',
  borderSoft: '#242B34',
  border2: '#3A434D', // dashed / thoda zyada nazar aane wali line
  field: '#12171E', // input, choice, stepper ka background
  fieldBorder: '#2A323C',
  text: '#F5F6F7',
  soft: '#AAB4C0', // doosre darje ka text
  soft2: '#C3CAD2',
  muted: '#9AA3AD',
  faint: '#6E7782', // sabse halka text
  orange: '#FF7A1A',
  orangeDark: '#F25C05',
  orangeText: '#FF7A1A', // orange rang ka text (light mein thoda gehra, taake parha jaye)
  onAccent: '#FFFFFF', // orange / green / red ke upar likha text ya icon
  nav: '#232C38', // bottom navbar
  navBorder: '#232C38',
  navInactive: '#AEB7C2',
  red: '#E5322D',
  redSoft: 'rgba(229,50,45,0.15)',
  redText: '#FF6B66',
  redText2: '#FF8A85',
  redSub: '#D9A5A2',
  green: '#3FBF6F',
  greenSoft: 'rgba(63,191,111,0.15)',
  greenText: '#BFE8CF',
  amber: '#FFB020',
  amberText: '#FFB020',
  blue: '#4DA3FF',
  mapBg: '#1B2229',
  mapRoad: '#262F38',
  mapBlock: '#212A24',
  mapLabel: 'rgba(11,13,16,0.8)',
  shadow: 0.45, // navbar ke shadow ki gehrai
};

const light = {
  bg: '#F3F5F8',
  bgTop: '#E7ECF2',
  bgClear: 'rgba(243,245,248,0)',
  card: '#FFFFFF',
  cardAlt: '#ECEFF3',
  glass: 'rgba(255,255,255,0.94)',
  glass2: 'rgba(255,255,255,0.9)',
  cardClear: 'rgba(255,255,255,0)',
  border: '#DCE1E7',
  borderSoft: '#E3E7EC',
  border2: '#C6CED7',
  field: '#F1F4F7',
  fieldBorder: '#D3DAE2',
  text: '#11161C',
  soft: '#4A5562',
  soft2: '#38424E',
  muted: '#5F6B78',
  faint: '#7B8693',
  orange: '#FF7A1A',
  orangeDark: '#F25C05',
  orangeText: '#C65A0A',
  onAccent: '#FFFFFF',
  nav: '#FFFFFF',
  navBorder: '#DCE1E7',
  navInactive: '#6B7682',
  red: '#E5322D',
  redSoft: 'rgba(229,50,45,0.1)',
  redText: '#D32F2A',
  redText2: '#C42621',
  redSub: '#A3524E',
  green: '#1F9D55',
  greenSoft: 'rgba(31,157,85,0.12)',
  greenText: '#1B7A45',
  amber: '#F2A100',
  amberText: '#A86A00',
  blue: '#2A7DDB',
  mapBg: '#E3E9EE',
  mapRoad: '#FFFFFF',
  mapBlock: '#D2E2D6',
  mapLabel: 'rgba(255,255,255,0.92)',
  shadow: 0.16,
};

export const palettes = { dark, light };
export const radius = { sm: 10, md: 14, lg: 20, pill: 999 };
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

// ---- Abhi kaunsa theme chal raha hai ----
let current = 'dark';
export const getMode = () => current;

// `colors` hamesha abhi ke theme ki value deta hai (jab render ke waqt padho).
export const colors = new Proxy({}, {
  get: (_, key) => palettes[current][key],
  has: (_, key) => key in palettes[current],
  ownKeys: () => Object.keys(palettes[current]),
  getOwnPropertyDescriptor: (_, key) => ({ enumerable: true, configurable: true, value: palettes[current][key] }),
});

// themed((colors) => ({ ... })) = StyleSheet.create ki jagah. Dono theme ke liye alag styles banata hai
// aur render ke waqt abhi wale theme ke style deta hai.
export function themed(factory) {
  const cache = {};
  const build = (mode) => (cache[mode] ??= StyleSheet.create(factory(palettes[mode])));
  return new Proxy({}, { get: (_, key) => build(current)[key] });
}

// ---- Theme yaad rakhna (phone band hone ke baad bhi) ----
const KEY = 'mechrelief_theme';
let AsyncStorage = null;
try { AsyncStorage = require('@react-native-async-storage/async-storage').default; } catch { AsyncStorage = null; }

const load = async () => {
  try {
    if (AsyncStorage) return await AsyncStorage.getItem(KEY);
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(KEY) ?? null;
  } catch { /* ignore */ }
  return null;
};
const save = (m) => {
  try {
    if (AsyncStorage) AsyncStorage.setItem(KEY, m);
    else if (Platform.OS === 'web') globalThis.localStorage?.setItem(KEY, m);
  } catch { /* ignore */ }
};

const Ctx = createContext({ mode: 'dark', pref: 'system', setMode: () => {} });
const PREFS = ['light', 'dark', 'system'];

// Root par ek baar lagta hai. Theme badalte hi saari screens dobara draw hoti hain.
// pref = user ne kya chuna ('light' | 'dark' | 'system'). mode = asal mein kaunsa theme lag raha hai ('light' | 'dark').
// 'system' ho to phone ki apni setting (light/dark) follow hoti hai, aur phone mein badalte hi app bhi badal jati hai.
export function ThemeProvider({ children }) {
  const system = useColorScheme(); // 'light' | 'dark' | null (phone ki setting)
  const [pref, setPref] = useState('system');

  const mode = pref === 'system' ? (system === 'light' ? 'light' : 'dark') : pref;
  current = mode; // render shuru hone se pehle global badlo, taake bachon ko sahi rang milein

  const setMode = useCallback((m) => {
    if (!PREFS.includes(m)) return;
    setPref(m);
    save(m);
  }, []);

  useEffect(() => {
    let live = true;
    load().then((m) => { if (live && PREFS.includes(m)) setPref(m); });
    return () => { live = false; };
  }, []);

  const value = useMemo(() => ({ mode, pref, setMode }), [mode, pref, setMode]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

// Har screen/component jo colours use karta hai, isay ek baar call karta hai (theme badalne par dobara draw hone ke liye).
export function useTheme() {
  const { mode, pref, setMode } = useContext(Ctx);
  return { mode, pref, isLight: mode === 'light', setMode, colors: palettes[mode] };
}
