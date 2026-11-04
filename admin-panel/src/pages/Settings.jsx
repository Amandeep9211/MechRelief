import { useState } from 'react';
import { useStore } from '../store';
import { Btn, Card, Field, PageHead } from '../ui';

export default function Settings() {
  const { settings, saveSettings, admin, toast } = useStore();
  const [f, setF] = useState(settings);
  const [pw, setPw] = useState({ next: '', again: '' });
  const num = (k, max) => (e) => setF({ ...f, [k]: Math.min(max ?? 1e6, Number(String(e.target.value).replace(/\D/g, '')) || 0) });
  const dirty = JSON.stringify(f) !== JSON.stringify(settings);

  const changePw = () => {
    if (pw.next.length < 6) return toast('Password must be at least 6 characters.', 'red');
    if (pw.next !== pw.again) return toast('The two passwords do not match.', 'red');
    setPw({ next: '', again: '' });
    toast('Password updated');
  };

  return (
    <>
      <PageHead title="Settings" />
      <div className="grid g2">
        <Card title="Charges" right={<Btn small disabled={!dirty} onClick={() => saveSettings(f)}>Save</Btn>}>
          <Field label="Advance payment (%)" hint="Paid online when booking. The rest is cash."><input value={f.advancePct} onChange={num('advancePct', 100)} inputMode="numeric" /></Field>
          <Field label="Emergency charge (Rs)"><input value={f.emergencyCharge} onChange={num('emergencyCharge')} inputMode="numeric" /></Field>
          <Field label="Worker travel rate (Rs / km)"><input value={f.defaultPerKm} onChange={num('defaultPerKm')} inputMode="numeric" /></Field>
        </Card>
        <Card title="Admin account" right={<Btn small kind="ghost" onClick={changePw}>Update password</Btn>}>
          <Field label="Email"><input value={admin.email} readOnly /></Field>
          <Field label="New password"><input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
          <Field label="Confirm new password"><input type="password" value={pw.again} onChange={(e) => setPw({ ...pw, again: e.target.value })} /></Field>
        </Card>
      </div>
    </>
  );
}
