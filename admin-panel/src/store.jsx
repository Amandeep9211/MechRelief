import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { BOOKINGS, CUSTOMERS, DISPUTES, INSPECTIONS, PAYMENTS, PRICING, REVIEWS, SETTINGS, SOS, WORKERS } from './data';

// In-memory state for the whole admin panel (resets on refresh). Backend step: every setter becomes an API call.
const Ctx = createContext(null);
export const useStore = () => useContext(Ctx);

const read = (k) => { try { return sessionStorage.getItem(k); } catch { return null; } };
const write = (k, v) => { try { v === null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch { /* ignore */ } };

export function StoreProvider({ children }) {
  const [admin, setAdmin] = useState(read('mr_admin') ? { name: 'Admin', email: read('mr_admin') } : null);
  const [workers, setWorkers] = useState(WORKERS);
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [bookings, setBookings] = useState(BOOKINGS);
  const [disputes, setDisputes] = useState(DISPUTES);
  const [sos, setSos] = useState(SOS);
  const [reviews, setReviews] = useState(REVIEWS);
  const [pricing, setPricing] = useState(PRICING);
  const [settings, setSettings] = useState(SETTINGS);
  const [catActive, setCatActive] = useState({});
  const [toasts, setToasts] = useState([]);
  const [adminPw, setAdminPw] = useState('admin123'); // demo password; backend step: stored hashed in MySQL

  const toast = useCallback((msg, tone = 'green') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  const login = (email) => { write('mr_admin', email); setAdmin({ name: 'Admin', email }); };
  const logout = () => { write('mr_admin', null); setAdmin(null); };

  const value = useMemo(() => ({
    admin, login, logout, toast, toasts, adminPw, setAdminPw,
    workers, customers, bookings, disputes, sos, reviews, pricing, settings, catActive,
    payments: PAYMENTS, inspections: INSPECTIONS,
    addWorker: (w) => { setWorkers((l) => [{ ...w, id: `W-${201 + l.length}`, rating: 0, jobs: 0, status: 'offline', verified: true, active: true, joined: new Date().toISOString() }, ...l]); toast('Worker account created'); },
    patchWorker: (id, patch, msg) => { setWorkers((l) => l.map((w) => (w.id === id ? { ...w, ...patch } : w))); if (msg) toast(msg); },
    patchCustomer: (id, patch, msg) => { setCustomers((l) => l.map((c) => (c.id === id ? { ...c, ...patch } : c))); if (msg) toast(msg); },
    patchBooking: (id, patch, msg) => { setBookings((l) => l.map((b) => (b.id === id ? { ...b, ...patch } : b))); if (msg) toast(msg); },
    patchDispute: (id, patch, msg) => { setDisputes((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d))); if (msg) toast(msg); },
    patchSos: (id, patch, msg) => { setSos((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d))); if (msg) toast(msg); },
    patchReview: (id, patch, msg) => { setReviews((l) => l.map((d) => (d.id === id ? { ...d, ...patch } : d))); if (msg) toast(msg); },
    savePricing: (catId, next) => { setPricing((p) => ({ ...p, [catId]: next })); toast('Pricing saved'); },
    setCategoryActive: (catId, v) => { setCatActive((a) => ({ ...a, [catId]: v })); toast(v ? 'Service enabled' : 'Service disabled', v ? 'green' : 'yellow'); },
    saveSettings: (s) => { setSettings(s); toast('Settings saved'); },
  }), [admin, adminPw, workers, customers, bookings, disputes, sos, reviews, pricing, settings, catActive, toasts, toast]); // eslint-disable-line react-hooks/exhaustive-deps

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
