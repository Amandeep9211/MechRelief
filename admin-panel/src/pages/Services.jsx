import { useState } from 'react';
import { useStore } from '../store';
import { Btn, Card, Icon, Modal, PageHead, Toggle } from '../ui';
import { CATEGORIES, money } from '../data';

// Admin sets prices here. Backend step: stored in MySQL and read by the customer app.
export default function Services() {
  const { pricing, catActive, setCategoryActive } = useStore();
  const [edit, setEdit] = useState(null);
  const isOn = (id) => catActive[id] !== false;

  return (
    <>
      <PageHead title="Services & Pricing" sub="Prices apply to new bookings." />
      <Card>
        {CATEGORIES.map((c) => (
          <div key={c.id} className="list-row" style={{ opacity: isOn(c.id) ? 1 : 0.5 }}>
            <div className="chip-ic"><Icon name={c.icon} size={19} /></div>
            <div className="grow"><div className="cell-main">{c.title}</div><div className="cell-sub">{c.id === 'towing' ? `Towing ${money(pricing.towing.groups[0].items[0][1])} per km` : `Service charge ${money(pricing[c.id].service)}`}</div></div>
            <Btn kind="ghost" small onClick={() => setEdit(c.id)}>Edit prices</Btn>
            <Toggle on={isOn(c.id)} onChange={(v) => setCategoryActive(c.id, v)} label={`Enable ${c.title}`} />
          </div>
        ))}
      </Card>
      {edit && <EditPricing id={edit} onClose={() => setEdit(null)} />}
    </>
  );
}

function EditPricing({ id, onClose }) {
  const { pricing, savePricing } = useStore();
  const cat = CATEGORIES.find((c) => c.id === id);
  const [f, setF] = useState(() => JSON.parse(JSON.stringify(pricing[id])));
  const num = (v) => Math.max(0, Number(String(v).replace(/\D/g, '')) || 0);
  const setItem = (gi, ii, v) => setF({ ...f, groups: f.groups.map((g, a) => (a !== gi ? g : { ...g, items: g.items.map((it, b) => (b !== ii ? it : [it[0], num(v)])) })) });

  return (
    <Modal title={cat.title} onClose={onClose} footer={<><Btn kind="ghost" onClick={onClose}>Cancel</Btn><Btn onClick={() => { savePricing(id, f); onClose(); }}>Save</Btn></>}>
      {id !== 'towing' && <div className="row-edit"><span>Service charge (Rs)</span><input value={f.service} onChange={(e) => setF({ ...f, service: num(e.target.value) })} inputMode="numeric" /></div>}
      <div className="row-edit"><span>{id === 'towing' ? 'Worker travel rate (Rs per km)' : 'Distance rate (Rs per km)'}</span><input value={f.perKm} onChange={(e) => setF({ ...f, perKm: num(e.target.value) })} inputMode="numeric" /></div>
      {f.groups.map((g, gi) => (
        <div key={g.name}>
          <div className="sec">{g.name}</div>
          {g.items.map((it, ii) => (
            <div key={it[0]} className="row-edit"><span>{it[0]}</span><input value={it[1]} onChange={(e) => setItem(gi, ii, e.target.value)} inputMode="numeric" /></div>
          ))}
        </div>
      ))}
      {id === 'denting' && <div className="note" style={{ marginTop: 16 }}>Customers pay this service charge and the distance charge up front. It is adjusted in the final repair bill.</div>}
    </Modal>
  );
}
