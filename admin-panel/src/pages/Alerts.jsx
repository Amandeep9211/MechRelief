import { useState } from 'react';
import { useStore } from '../store';
import { Badge, Btn, Card, Empty, PageHead, Tabs } from '../ui';
import { ago, catTitle, money } from '../data';

// SOS alerts and cash disputes in one place. Resolve with one click.
export default function Alerts() {
  const { sos, disputes, customers, workers, bookings, patchSos, patchDispute, patchBooking } = useStore();
  const openSos = sos.filter((s) => s.status !== 'resolved');
  const openDisp = disputes.filter((d) => d.status === 'open');
  const [tab, setTab] = useState(openSos.length || !openDisp.length ? 'sos' : 'disputes');
  const cust = (id) => customers.find((c) => c.id === id);
  const bk = (id) => bookings.find((b) => b.id === id);

  return (
    <>
      <PageHead title="Alerts" sub="Things that need your response." />
      <div className="toolbar">
        <Tabs value={tab} onChange={setTab} tabs={[{ value: 'sos', label: 'SOS', count: openSos.length }, { value: 'disputes', label: 'Cash disputes', count: openDisp.length }]} />
      </div>

      {tab === 'sos' && (
        <Card>
          {openSos.length === 0 && <Empty text="No open SOS alerts." />}
          {openSos.map((s) => {
            const c = cust(s.customerId);
            return (
              <div key={s.id} className="list-row">
                <div className="grow">
                  <div className="cell-main">{c?.name} · {c?.phone} {s.status === 'new' ? <Badge tone="red">New</Badge> : <Badge tone="yellow">Acknowledged</Badge>}</div>
                  <div className="cell-sub">{s.location} · {ago(s.time)} · SMS sent to {c?.trusted.name}</div>
                </div>
                {s.status === 'new' && <Btn kind="ghost" small onClick={() => patchSos(s.id, { status: 'acknowledged' }, 'SOS acknowledged')}>Acknowledge</Btn>}
                <Btn kind="success" small onClick={() => patchSos(s.id, { status: 'resolved' }, 'SOS resolved')}>Resolve</Btn>
              </div>
            );
          })}
        </Card>
      )}

      {tab === 'disputes' && (
        <Card>
          {openDisp.length === 0 && <Empty text="No open disputes." />}
          {openDisp.map((d) => {
            const b = bk(d.bookingId);
            const w = workers.find((x) => x.id === b.workerId);
            return (
              <div key={d.id} className="list-row">
                <div className="grow">
                  <div className="cell-main">{b.id} · {catTitle(b.categoryId)} · {money(b.price.cash)} cash</div>
                  <div className="cell-sub">{cust(b.customerId)?.name} and {w?.name}: {d.reason}</div>
                </div>
                <Btn kind="success" small onClick={() => { patchBooking(b.id, { cashCustomer: true, cashWorker: true }); patchDispute(d.id, { status: 'resolved' }, 'Dispute resolved'); }}>Resolve</Btn>
              </div>
            );
          })}
        </Card>
      )}
    </>
  );
}
