import { useEffect, useState } from 'react';
import { Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { Bell, HardHat, LayoutDashboard, ClipboardList, LogOut, Menu, Settings as Cog, Tags, Users } from 'lucide-react';
import { useStore } from './store';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Workers from './pages/Workers';
import Customers from './pages/Customers';
import Services from './pages/Services';
import Settings from './pages/Settings';
import Alerts from './pages/Alerts';

export default function App() {
  const { admin } = useStore();
  if (!admin) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  return <Shell />;
}

function Shell() {
  const { logout, sos, disputes, toasts } = useStore();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [loc.pathname]);

  const newSos = sos.filter((s) => s.status === 'new').length;
  const openDisputes = disputes.filter((d) => d.status === 'open').length;
  const link = (to, Ic, label, cnt) => (
    <NavLink to={to} end={to === '/'} className={({ isActive }) => (isActive ? 'active' : '')}>
      <Ic size={19} /> {label}{cnt ? <span className="cnt">{cnt}</span> : null}
    </NavLink>
  );

  return (
    <div className="shell">
      <aside className={`side ${open ? 'open' : ''}`}>
        <div className="brand">
          <img className="car" src="./mechrelief-car.png" alt="" />
          <img className="word" src="./mechrelief-wordmark.png" alt="MechRelief" />
          <small>Admin</small>
        </div>
        <nav className="nav">
          {link('/', LayoutDashboard, 'Dashboard')}
          {link('/bookings', ClipboardList, 'Bookings')}
          {link('/workers', HardHat, 'Workers')}
          {link('/customers', Users, 'Customers')}
          {link('/services', Tags, 'Services & Pricing')}
          {link('/alerts', Bell, 'Alerts', newSos + openDisputes)}
          {link('/settings', Cog, 'Settings')}
        </nav>
        <div className="side-foot">
          <button className="btn btn-ghost" style={{ width: '100%' }} onClick={logout}><LogOut size={16} /> Log out</button>
        </div>
      </aside>

      <div className="main">
        <header className="top">
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu"><Menu size={22} /></button>
          <div className="grow" />
        </header>
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/workers" element={<Workers />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/services" element={<Services />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      <div className="toasts">{toasts.map((t) => <div key={t.id} className={`toast ${t.tone}`}>{t.msg}</div>)}</div>
    </div>
  );
}
