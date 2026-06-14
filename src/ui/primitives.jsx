// =============================================================
// ArtCyc Design-System — wiederverwendbare Presentational Components (Phase 2)
// Props-basiert, keine App-Logik. Dark-Mode über bestehende CSS (card-surface,
// ios-seg-active, Token-Overrides). Verwendet von den V2-Screens.
// =============================================================
import { ChevronRight } from 'lucide-react';
import { STATUS, TONE } from './tokens';

// iOS Segmented Control — vereinheitlicht Zeitraum/Modus/Variante.
// options: [value, label, badge?][]. compact = kleine Pille (z. B. A/B im Hero).
export function SegmentedControl({ value, onChange, options, compact = false }) {
  if (compact) {
    return (
      <div className="flex gap-0.5 bg-[#E5E5EA] rounded-full p-0.5 text-[11px] font-medium">
        {options.map(([val, label]) => (
          <button key={val} onClick={() => onChange(val)}
            className={'px-2.5 py-1 rounded-full transition ' + (value === val ? 'ios-seg-active' : 'text-slate-500 active:opacity-60')}>{label}</button>
        ))}
      </div>
    );
  }
  return (
    <div className="bg-[#E5E5EA] rounded-[13px] p-1 flex gap-1 text-[13px] font-medium">
      {options.map(([val, label, badge]) => (
        <button key={val} onClick={() => onChange(val)}
          className={'flex-1 px-2 py-1.5 rounded-[10px] transition ' + (value === val ? 'ios-seg-active' : 'text-slate-500 active:opacity-60')}>
          {label}{badge != null && <span className="ml-1 opacity-50 tabular-nums">{badge}</span>}
        </button>
      ))}
    </div>
  );
}

// Gleichrangige Metrik-Kachel. Ohne accent: ruhige, zentrierte Kachel
// (Quick Insights). Mit accent: getönte Identitäts-Karte (subtiler Tint +
// farbiger Rahmen/Icon/Label), Zahl bleibt weiß/maximal lesbar. App-weit
// gleiche Bedeutung → gleicher accent.
const ACCENT = {
  sky:     { bg: 'bg-sky-50',     border: 'border-sky-100',     fg: 'text-sky-600' },
  violet:  { bg: 'bg-violet-50',  border: 'border-violet-100',  fg: 'text-violet-600' },
  amber:   { bg: 'bg-amber-50',   border: 'border-amber-100',   fg: 'text-amber-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-100', fg: 'text-emerald-600' },
  rose:    { bg: 'bg-rose-50',    border: 'border-rose-100',    fg: 'text-rose-600' },
};
export function MetricCard({ label, value, sub, accent, icon: Icon }) {
  const A = accent && ACCENT[accent];
  if (A) {
    return (
      <div className={`rounded-[20px] p-3.5 border ${A.bg} ${A.border}`}>
        <div className={`flex items-center gap-1.5 ${A.fg}`}>
          {Icon && <Icon size={14} strokeWidth={2.4} className="shrink-0" />}
          <span className="text-[11px] font-semibold leading-tight truncate">{label}</span>
        </div>
        <div className="text-[24px] font-bold text-slate-900 tabular-nums mt-1.5 leading-none">{value}</div>
        {sub != null && <div className="text-[11px] text-slate-400 tabular-nums mt-1 truncate">{sub}</div>}
      </div>
    );
  }
  return (
    <div className="card-surface rounded-[20px] p-3 text-center">
      <div className="text-[11px] text-slate-500 font-medium leading-tight">{label}</div>
      <div className="text-[21px] font-bold text-slate-900 tabular-nums mt-1 leading-none">{value}</div>
      {sub != null && <div className="text-[11px] text-slate-400 tabular-nums mt-1 truncate">{sub}</div>}
    </div>
  );
}

// Status-Breakdown: items = [{label, value, count, tone}], tone ∈ TONE.
export function StatusBreakdown({ items }) {
  return (
    <div className={'grid gap-3 ' + (items.length === 3 ? 'grid-cols-3' : 'grid-cols-2')}>
      {items.map((it, i) => {
        const tone = TONE[it.tone] || TONE.neutral;
        return (
          <div key={i} className={'rounded-[20px] p-3.5 text-center ' + tone.card}>
            <div className={'text-[12px] font-medium ' + tone.label}>{it.label}</div>
            <div className={'text-[27px] font-bold tabular-nums leading-none mt-1 ' + tone.value}>{it.value}</div>
            {it.count != null && <div className={'text-[11px] tabular-nums mt-0.5 ' + tone.sub}>{it.count}</div>}
          </div>
        );
      })}
    </div>
  );
}

// Leerzustand — identische Logik je Filter.
export function EmptyState({ title, hint }) {
  return (
    <div className="card-surface rounded-[22px] p-8 text-center">
      <div className="text-[15px] text-slate-400">{title}</div>
      {hint && <div className="text-[13px] text-slate-400 mt-1">{hint}</div>}
    </div>
  );
}

// Progressive Disclosure — Toggle-Button für sekundäre Inhalte.
export function DisclosureToggle({ open, onToggle, labelOpen, labelClosed }) {
  return (
    <button onClick={onToggle}
      className="w-full text-[13px] font-medium text-[#007AFF] active:opacity-60 pt-1 flex items-center justify-center gap-1">
      {open ? labelOpen : labelClosed}
      <ChevronRight size={15} strokeWidth={2.4} className={'transition-transform ' + (open ? 'rotate-90' : '')} />
    </button>
  );
}

// Status-Legende = Toggle (Chart-Linien zu-/abschalten). fixed = immer an.
export function StatusLegendToggle({ active, onClick, color, label, fixed = false }) {
  return (
    <button onClick={fixed ? undefined : onClick} disabled={fixed}
      className={'inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full transition ' +
        (active ? 'bg-slate-100 text-slate-700' : 'bg-slate-100/50 text-slate-400 active:opacity-60')}>
      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color, opacity: active ? 1 : 0.35 }} />
      {label}
    </button>
  );
}

// Trend-Chart — Geklappt grün (primär), Getroffen amber, Gefährlich rot
// (sekundär, zuschaltbar). comp = [{label, success, third, fail, total}].
export function TrendChart({ comp, is3 = false, showHit = false, showDanger = false }) {
  if (!comp || comp.length < 2) {
    return <div className="text-[13px] text-slate-400 py-6 text-center">Zu wenig Daten für diesen Zeitraum.</div>;
  }
  const W = 320, H = 110, P = 8;
  const xs = (i) => P + (i * (W - 2 * P)) / (comp.length - 1);
  const ys = (v) => H - P - (v / 100) * (H - 2 * P);
  const r = (b, key) => b.total > 0 ? (b[key] / b.total) * 100 : 0;
  const line = (key) => comp.map((b, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${ys(r(b, key)).toFixed(1)}`).join(' ');
  const area = `${line('success')} L${xs(comp.length - 1).toFixed(1)},${H - P} L${xs(0).toFixed(1)},${H - P} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none">
      <defs><linearGradient id="ds-trend-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={STATUS.success} stopOpacity="0.20" /><stop offset="100%" stopColor={STATUS.success} stopOpacity="0" />
      </linearGradient></defs>
      <line x1={P} y1={ys(80)} x2={W - P} y2={ys(80)} stroke="currentColor" strokeOpacity="0.14" strokeDasharray="3 4" className="text-slate-400" />
      <path d={area} fill="url(#ds-trend-grad)" />
      {showHit && is3 && <path d={line('third')} fill="none" stroke={STATUS.hit} strokeWidth="1.8" strokeOpacity="0.9" strokeLinecap="round" strokeLinejoin="round" />}
      {showDanger && <path d={line('fail')} fill="none" stroke={STATUS.danger} strokeWidth="1.8" strokeOpacity="0.9" strokeDasharray="2 3" strokeLinecap="round" strokeLinejoin="round" />}
      <path d={line('success')} fill="none" stroke={STATUS.success} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      {comp.map((b, i) => <circle key={i} cx={xs(i)} cy={ys(r(b, 'success'))} r="2.4" fill={STATUS.success} />)}
    </svg>
  );
}

// Hero-KPI — eine dominante Kennzahl. A/B: 'number' (Default) | 'ring'.
// Zahl bleibt in beiden Varianten primär lesbar; Ring tritt semantisch zurück.
export function HeroKPI({
  eyebrow = 'Erfolgsquote', value, unit = '%', totalLine, delta,
  footerLeft, footerRight, variant = 'number', onVariantChange,
}) {
  const v = value || 0;
  const R = 56, C = 2 * Math.PI * R, ringOffset = C * (1 - v / 100);
  const deltaChip = delta == null ? null : (
    <span className={'inline-flex items-center gap-1 text-[12px] font-semibold px-2 py-1 rounded-full tabular-nums ' +
      (delta > 0 ? 'bg-emerald-50 text-emerald-700' : delta < 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500')}>
      {delta > 0 ? '↑' : delta < 0 ? '↓' : '·'} {Math.abs(delta)} % · 4 Wochen
    </span>
  );
  const footer = (footerLeft || footerRight) && (
    <div className="mt-3 pt-3 border-t border-slate-100 text-[13px] flex items-center justify-between gap-2">
      <span className="text-slate-500 truncate">{footerLeft}</span>
      <span className="font-medium text-slate-700 tabular-nums shrink-0">{footerRight}</span>
    </div>
  );
  return (
    <div className="card-surface rounded-[26px] p-6">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-emerald-600">{eyebrow}</div>
        {onVariantChange && (
          <SegmentedControl compact value={variant} onChange={onVariantChange} options={[['number', 'Zahl'], ['ring', 'Ring']]} />
        )}
      </div>
      {variant === 'ring' ? (
        <div className="flex items-center gap-6 mt-3">
          <div className="relative shrink-0" style={{ width: 128, height: 128 }}>
            <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" strokeOpacity="0.10" strokeWidth="8" className="text-slate-400" />
              <circle cx="64" cy="64" r={R} fill="none" stroke={STATUS.success} strokeOpacity="0.85" strokeWidth="8" strokeLinecap="round"
                strokeDasharray={C} strokeDashoffset={ringOffset} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[42px] leading-none font-bold tracking-tight text-slate-900 tabular-nums">{v}</span>
              <span className="text-[12px] font-semibold text-slate-400">{unit}</span>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            {totalLine && <div className="text-[15px] text-slate-500 tabular-nums">{totalLine}</div>}
            {deltaChip && <div className="mt-2">{deltaChip}</div>}
            {footer}
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-end gap-1 mt-1">
            <span className="text-[72px] leading-[0.82] font-bold tracking-tight text-slate-900 tabular-nums">{v}</span>
            <span className="text-[30px] font-bold text-slate-400 mb-1.5">{unit}</span>
            {deltaChip && <span className="ml-auto mb-2">{deltaChip}</span>}
          </div>
          {totalLine && <div className="mt-1.5 text-[15px] text-slate-500 tabular-nums">{totalLine}</div>}
          {footer}
        </>
      )}
    </div>
  );
}
