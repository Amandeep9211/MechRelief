import { useStore } from '../store';
import { Badge, Btn, KV, Modal } from '../ui';
import { STATUS_LABEL, STATUS_TONE, catTitle, fmtDate, money } from '../data';

// Booking detail (used by Dashboard, Bookings, Workers, Customers).
export default function BookingModal({ id, onClose }) {
  const { bookings, customers, workers, patchBooking } = useStore();
  const b = bookings.find((x) => x.id === id);
  if (!b) return null;
  const c = customers.find((x) => x.id === b.customerId);
  const w = workers.find((x) => x.id === b.workerId);
  const active = !['completed', 'cancelled'].includes(b.status);
  const p = b.price;

  return (
    <Modal
      title={`Booking ${b.id}`} onClose={onClose}
      footer={<>
        {active && <Btn kind="danger" onClick={() => { patchBooking(b.id, { status: 'cancelled', refund: b.status === 'queued' ? p.advance : 0 }, `Booking ${b.id} cancelled`); onClose(); }}>Cancel booking</Btn>}
        <Btn kind="ghost" onClick={onClose}>Close</Btn>
      </>}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 14 }}>
        <Badge tone={STATUS_TONE[b.status]}>{STATUS_LABEL[b.status]}</Badge>
        {b.emergency ? <Badge tone="red">Emergency</Badge> : null}
        <span style={{ color: 'var(--muted)' }}>{catTitle(b.categoryId)} · {fmtDate(b.createdAt)}</span>
      </div>
      <KV label="Customer">{c?.name} · {c?.phone}</KV>
      <KV label="Worker">{w?.name}</KV>
      <KV label="Car">{b.car}</KV>
      <KV label="Location">{b.area}, Lahore</KV>
      <KV label="Description">{b.description || 'None'}</KV>
      <div className="sec">Price</div>
      {p.part > 0 && <KV label="Part cost">{money(p.part)}</KV>}
      <KV label={b.categoryId === 'towing' ? `Towing charge (${b.towKm} km x Rs 90)` : 'Service charge'}>{money(p.service)}</KV>
      <KV label="Distance charge (worker travel)">{money(p.distance)}</KV>
      {p.emergency > 0 && <KV label="Emergency charge">{money(p.emergency)}</KV>}
      <KV label="Total">{money(p.total)}</KV>
      <KV label="Advance paid (15%)">{money(p.advance)}</KV>
      <KV label="Cash to worker (85%)">{money(p.cash)}</KV>
    </Modal>
  );
}
