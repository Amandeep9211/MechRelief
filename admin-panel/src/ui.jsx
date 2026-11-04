import { useEffect, useState } from 'react';
import { X, Search, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import * as Icons from 'lucide-react';

export const Icon = ({ name, size = 18 }) => { const C = Icons[name] || Icons.Circle; return <C size={size} />; };

export const Badge = ({ tone = 'gray', children }) => <span className={`badge b-${tone}`}>{children}</span>;

export const Card = ({ title, right, children, pad = true, className = '' }) => (
  <section className={`card ${className}`}>
    {(title || right) && <header className="card-h"><h3>{title}</h3>{right}</header>}
    <div className={pad ? 'card-b' : ''}>{children}</div>
  </section>
);

export const PageHead = ({ title, sub, children }) => (
  <div className="page-head">
    <div><h1>{title}</h1>{sub ? <p>{sub}</p> : null}</div>
    <div className="actions">{children}</div>
  </div>
);

export const Btn = ({ kind = 'primary', small, children, ...p }) => (
  <button {...p} className={`btn btn-${kind} ${small ? 'btn-sm' : ''} ${p.className || ''}`}>{children}</button>
);

export const Stat = ({ icon, label, value, sub, tone = 'orange' }) => (
  <div className="stat">
    <div className={`stat-ic t-${tone}`}><Icon name={icon} size={20} /></div>
    <div><div className="stat-l">{label}</div><div className="stat-v">{value}</div>{sub ? <div className="stat-s">{sub}</div> : null}</div>
  </div>
);

export const Field = ({ label, hint, error, children }) => (
  <label className="field"><span>{label}</span>{children}{hint ? <small>{hint}</small> : null}{error ? <em>{error}</em> : null}</label>
);

export const SearchBox = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="searchbox"><Search size={16} /><input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>
);

export const Select = ({ value, onChange, options, all }) => (
  <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
    {all ? <option value="">{all}</option> : null}
    {options.map((o) => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
  </select>
);

export const Toggle = ({ on, onChange, label }) => (
  <button type="button" className={`toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on} aria-label={label}><i /></button>
);

export const Tabs = ({ value, onChange, tabs }) => (
  <div className="tabs">{tabs.map((t) => (
    <button key={t.value} className={value === t.value ? 'on' : ''} onClick={() => onChange(t.value)}>{t.label}{t.count != null ? <b>{t.count}</b> : null}</button>
  ))}</div>
);

export const Empty = ({ text = 'Nothing to show here.' }) => <div className="empty"><Inbox size={30} /><p>{text}</p></div>;

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={onClose}>
      <div className={`modal ${wide ? 'wide' : ''}`} onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <header><h3>{title}</h3><button className="x" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="modal-b">{children}</div>
        {footer ? <footer>{footer}</footer> : null}
      </div>
    </div>
  );
}

export const KV = ({ label, children }) => <div className="kv"><span>{label}</span><b>{children}</b></div>;

// Simple table with search-free pagination. cols: [{ key, label, render, align }]
export function Table({ cols, rows, onRow, pageSize = 10, empty }) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  useEffect(() => { if (page >= pages) setPage(0); }, [rows.length, pages, page]);
  const slice = rows.slice(page * pageSize, page * pageSize + pageSize);
  if (!rows.length) return <Empty text={empty} />;
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead><tr>{cols.map((c) => <th key={c.key} style={{ textAlign: c.align }}>{c.label}</th>)}</tr></thead>
          <tbody>
            {slice.map((r, i) => (
              <tr key={r.id ?? i} onClick={onRow ? () => onRow(r) : undefined} className={onRow ? 'click' : ''}>
                {cols.map((c) => <td key={c.key} style={{ textAlign: c.align }}>{c.render ? c.render(r) : r[c.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > pageSize && (
        <div className="pager">
          <span>{page * pageSize + 1}-{Math.min(rows.length, (page + 1) * pageSize)} of {rows.length}</span>
          <div>
            <button disabled={page === 0} onClick={() => setPage(page - 1)} aria-label="Previous page"><ChevronLeft size={16} /></button>
            <button disabled={page >= pages - 1} onClick={() => setPage(page + 1)} aria-label="Next page"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </>
  );
}

// ---- charts (pure SVG / CSS, no library) ----
export function BarChart({ data, height = 190, color = 'var(--orange)', fmt = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="bars" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="bar-col">
          <span className="bar-v">{fmt(d.value)}</span>
          <div className="bar-track"><div className="bar" style={{ height: `${(d.value / max) * 100}%`, background: color }} /></div>
          <span className="bar-l">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export function HBars({ data, fmt = (v) => v }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="hbars">
      {data.map((d) => (
        <div key={d.label} className="hbar">
          <div className="hbar-t"><span>{d.label}</span><b>{fmt(d.value)}</b></div>
          <div className="hbar-track"><div style={{ width: `${(d.value / max) * 100}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export const Stars = ({ n }) => <span className="stars" aria-label={`${n} stars`}>{'★'.repeat(Math.round(n))}<i>{'★'.repeat(5 - Math.round(n))}</i></span>;
