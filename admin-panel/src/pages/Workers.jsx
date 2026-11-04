import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useStore } from '../store';
import { Badge, Btn, Card, Field, KV, Modal, PageHead, SearchBox, Table } from '../ui';
import { CATEGORIES, catTitle } from '../data';

const TONES = { online: 'green', busy: 'orange', offline: 'gray' };
const genPass = () => 'MR' + Math.random().toString(36).slice(2, 8).toUpperCase();

export default function Workers() {
  const { workers, addWorker } = useStore();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const [adding, setAdding] = useState(false);

  const rows = useMemo(() => workers.filter((w) => {
    const s = q.trim().toLowerCase();
    return !s || [w.name, w.phone, catTitle(w.categoryId)].join(' ').toLowerCase().includes(s);
  }), [workers, q]);

  const cols = [
    { key: 'n', label: 'Worker', render: (w) => <><div className="cell-main">{w.name}</div><div className="cell-sub">{w.phone}</div></> },
    { key: 'c', label: 'Service', render: (w) => catTitle(w.categoryId) },
    { key: 's', label: 'Status', render: (w) => (w.active ? <Badge tone={TONES[w.status]}>{w.status[0].toUpperCase() + w.status.slice(1)}</Badge> : <Badge tone="red">Deactivated</Badge>) },
    { key: 'r', label: 'Rating', align: 'right', render: (w) => (w.rating ? `★ ${w.rating}` : '-') },
  ];

  return (
    <>
      <PageHead title="Workers" sub="Workers are added by you. They sign in to the worker app with the phone number and password.">
        <SearchBox value={q} onChange={setQ} placeholder="Search workers..." />
        <Btn onClick={() => setAdding(true)}><Plus size={17} /> Add Worker</Btn>
      </PageHead>
      <Card pad={false}><Table cols={cols} rows={rows} onRow={setSel} empty="No workers found." /></Card>
      {sel && <WorkerModal id={sel.id} onClose={() => setSel(null)} />}
      {adding && <AddWorker onClose={() => setAdding(false)} onSave={(w) => { addWorker(w); setAdding(false); }} />}
    </>
  );
}

function AddWorker({ onClose, onSave }) {
  const { workers } = useStore();
  const [f, setF] = useState({ name: '', phone: '', categoryId: 'general', password: genPass() });
  const [err, setErr] = useState({});
  const set = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setErr({ ...err, [k]: '' }); };

  const save = () => {
    const e = {};
    if (f.name.trim().length < 3) e.name = 'Enter the full name.';
    const digits = f.phone.replace(/\D/g, '');
    if (digits.length < 11) e.phone = 'Enter an 11-digit phone number (03xx xxxxxxx).';
    else if (workers.some((w) => w.phone.replace(/\D/g, '') === digits)) e.phone = 'A worker with this phone number already exists.';
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({ name: f.name.trim(), phone: digits, categoryId: f.categoryId, area: '-', experience: 0 });
  };

  return (
    <Modal title="Add Worker" onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={save}>Create Account</Btn></>}>
      <Field label="Full name" error={err.name}><input value={f.name} onChange={set('name')} placeholder="e.g. Ali Raza" /></Field>
      <Field label="Phone number" error={err.phone}><input value={f.phone} onChange={set('phone')} placeholder="03xx xxxxxxx" inputMode="tel" /></Field>
      <Field label="Service"><select value={f.categoryId} onChange={set('categoryId')}>{CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select></Field>
      <Field label="Temporary password" hint="Give this to the worker. They can change it after the first login."><input value={f.password} onChange={set('password')} /></Field>
    </Modal>
  );
}

function WorkerModal({ id, onClose }) {
  const { workers, patchWorker } = useStore();
  const w = workers.find((x) => x.id === id);
  if (!w) return null;
  return (
    <Modal title={w.name} onClose={onClose} footer={
      <>
        {w.active
          ? <Btn kind="danger" onClick={() => { patchWorker(w.id, { active: false, status: 'offline' }, `${w.name} deactivated`); onClose(); }}>Deactivate</Btn>
          : <Btn kind="success" onClick={() => { patchWorker(w.id, { active: true }, `${w.name} activated`); onClose(); }}>Activate</Btn>}
      </>
    }>
      <KV label="Phone">{w.phone}</KV>
      <KV label="Service">{catTitle(w.categoryId)}</KV>
      <KV label="Status">{w.active ? w.status : 'deactivated'}</KV>
      <KV label="Rating">{w.rating ? `★ ${w.rating}` : '-'}</KV>
      <KV label="Jobs done">{w.jobs}</KV>
    </Modal>
  );
}
