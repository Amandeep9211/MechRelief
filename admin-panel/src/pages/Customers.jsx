import { useMemo, useState } from 'react';
import { useStore } from '../store';
import { Card, KV, Modal, PageHead, SearchBox, Table } from '../ui';

export default function Customers() {
  const { customers, bookings } = useStore();
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);
  const count = (id) => bookings.filter((b) => b.customerId === id).length;

  const rows = useMemo(() => customers.filter((c) => {
    const s = q.trim().toLowerCase();
    return !s || [c.name, c.phone].join(' ').toLowerCase().includes(s);
  }), [customers, q]);

  const cols = [
    { key: 'n', label: 'Customer', render: (c) => <><div className="cell-main">{c.name}</div><div className="cell-sub">{c.phone}</div></> },
    { key: 'car', label: 'Car', render: (c) => c.car },
    { key: 'b', label: 'Bookings', align: 'right', render: (c) => count(c.id) },
  ];

  return (
    <>
      <PageHead title="Customers"><SearchBox value={q} onChange={setQ} placeholder="Search customers..." /></PageHead>
      <Card pad={false}><Table cols={cols} rows={rows} onRow={setSel} empty="No customers found." /></Card>
      {sel && <CustomerModal id={sel.id} onClose={() => setSel(null)} />}
    </>
  );
}

function CustomerModal({ id, onClose }) {
  const { customers } = useStore();
  const c = customers.find((x) => x.id === id);
  return (
    <Modal title={c.name} onClose={onClose}>
      <KV label="Phone">{c.phone}</KV>
      <KV label="Car">{c.car}</KV>
      <KV label="Area">{c.area}</KV>
      <KV label="Trusted contact">{c.trusted.name} · {c.trusted.phone}</KV>
    </Modal>
  );
}
