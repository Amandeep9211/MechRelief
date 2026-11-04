import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { Badge, Card, PageHead, Stat, Table } from '../ui';
import { STATUS_LABEL, STATUS_TONE, ago, catTitle, money } from '../data';
import BookingModal from './BookingModal';

const sameDay = (a) => new Date(a).toDateString() === new Date().toDateString();

export default function Dashboard() {
  const { bookings, workers, customers, sos, disputes } = useStore();
  const [sel, setSel] = useState(null);
  const active = bookings.filter((b) => !['completed', 'cancelled'].includes(b.status));
  const openSos = sos.filter((s) => s.status !== 'resolved').length;
  const openDisp = disputes.filter((d) => d.status === 'open').length;
  const online = workers.filter((w) => w.active && w.status !== 'offline').length;

  const cols = [
    { key: 'id', label: 'Booking', render: (b) => <><div className="cell-main">{b.id}</div><div className="cell-sub">{ago(b.createdAt)}</div></> },
    { key: 'cat', label: 'Service', render: (b) => <>{catTitle(b.categoryId)} {b.emergency ? <Badge tone="red">Emergency</Badge> : null}</> },
    { key: 'cust', label: 'Customer', render: (b) => customers.find((c) => c.id === b.customerId)?.name },
    { key: 'st', label: 'Status', render: (b) => <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge> },
    { key: 'amt', label: 'Total', align: 'right', render: (b) => money(b.price.total) },
  ];

  return (
    <>
      <PageHead title="Dashboard" sub="What is happening right now." />
      <div className="stats">
        <Stat icon="ClipboardList" label="Bookings today" value={bookings.filter((b) => sameDay(b.createdAt)).length} />
        <Stat icon="Activity" tone="blue" label="Active jobs" value={active.length} />
        <Stat icon="HardHat" tone="green" label="Workers online" value={online} />
        <Stat icon="Siren" tone="red" label="Open alerts" value={openSos + openDisp} sub={`${openSos} SOS · ${openDisp} disputes`} />
      </div>
      <Card title="Live requests" right={<Link to="/bookings" className="btn btn-ghost btn-sm">All bookings</Link>} pad={false}>
        <Table cols={cols} rows={active} onRow={setSel} pageSize={8} empty="No active requests right now." />
      </Card>
      {sel && <BookingModal id={sel.id} onClose={() => setSel(null)} />}
    </>
  );
}
