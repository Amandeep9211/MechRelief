import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from '../store';
import { Badge, Card, PageHead, SearchBox, Table, Tabs } from '../ui';
import { STATUS_LABEL, STATUS_TONE, catTitle, fmtDate, money } from '../data';
import BookingModal from './BookingModal';

export default function Bookings() {
  const { bookings, customers, workers } = useStore();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get('q') || '');
  const [tab, setTab] = useState('all');
  const [sel, setSel] = useState(null);
  const cust = (id) => customers.find((c) => c.id === id);
  const worker = (id) => workers.find((w) => w.id === id);

  const counts = useMemo(() => ({
    all: bookings.length,
    active: bookings.filter((b) => !['completed', 'cancelled'].includes(b.status)).length,
    completed: bookings.filter((b) => b.status === 'completed').length,
    cancelled: bookings.filter((b) => b.status === 'cancelled').length,
  }), [bookings]);

  const rows = useMemo(() => bookings.filter((b) => {
    if (tab === 'active' && ['completed', 'cancelled'].includes(b.status)) return false;
    if (tab === 'completed' && b.status !== 'completed') return false;
    if (tab === 'cancelled' && b.status !== 'cancelled') return false;
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return [b.id, cust(b.customerId)?.name, worker(b.workerId)?.name, catTitle(b.categoryId), b.area].join(' ').toLowerCase().includes(s);
  }), [bookings, tab, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const cols = [
    { key: 'id', label: 'Booking', render: (b) => <><div className="cell-main">{b.id}</div><div className="cell-sub">{fmtDate(b.createdAt)}</div></> },
    { key: 'cat', label: 'Service', render: (b) => <>{catTitle(b.categoryId)} {b.emergency ? <Badge tone="red">Emergency</Badge> : null}</> },
    { key: 'cust', label: 'Customer', render: (b) => <><div className="cell-main">{cust(b.customerId)?.name}</div><div className="cell-sub">{b.area}</div></> },
        { key: 'st', label: 'Status', render: (b) => <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge> },
    { key: 'amt', label: 'Total', align: 'right', render: (b) => <b>{money(b.price.total)}</b> },
  ];

  return (
    <>
      <PageHead title="Bookings" />
      <div className="toolbar">
        <Tabs value={tab} onChange={setTab} tabs={[
          { value: 'all', label: 'All', count: counts.all }, { value: 'active', label: 'Active', count: counts.active },
          { value: 'completed', label: 'Completed', count: counts.completed }, { value: 'cancelled', label: 'Cancelled', count: counts.cancelled },
        ]} />
        <div style={{ flex: 1 }} />
        <SearchBox value={q} onChange={setQ} placeholder="Search bookings..." />
      </div>
      <Card pad={false}><Table cols={cols} rows={rows} onRow={setSel} empty="No bookings match your filters." /></Card>
      {sel && <BookingModal id={sel.id} onClose={() => setSel(null)} />}
    </>
  );
}
