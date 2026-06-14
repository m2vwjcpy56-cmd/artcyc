// =============================================================
// ArtCyc Design-Tokens — Single Source of Truth (Phase 2)
// Werte hier ändern → app-weit konsistent. Verwendet vom Design-System
// (src/ui/primitives.jsx) und den V2-Screens.
// =============================================================

// Verbindliche Status-Farbsemantik (identisch zu KPI-Karten, Labels, Charts).
// Rot NUR als Warnsignal, nie als dominante Hero-Wirkung. Dark-mode-fest
// (iOS-Systemfarben, auf hell + dunkel lesbar).
export const STATUS = {
  success: '#34C759', // Geklappt
  hit: '#FF9F0A',     // Getroffen
  danger: '#FF453A',  // Gefährlich
};

export const BRAND = '#FF9500'; // Akzent / Brand-Orange
export const TINT = '#007AFF';  // interaktiv (iOS-Blau)

// Radius-System → Card-Ränge (ein dominantes Objekt pro Screen = Hero).
export const RADIUS = {
  hero: 'rounded-[26px]',
  card: 'rounded-[22px]',
  tile: 'rounded-[20px]',
};

// Typo-Skala (strikt): eyebrow / metric / title / support / caption.
export const TYPE = {
  eyebrow: 'text-[12px] font-semibold uppercase tracking-wider',
  title: 'text-[15px] font-semibold',
  support: 'text-[15px] text-slate-500',
  caption: 'text-[12px] text-slate-400',
};

// Spacing (8pt-Grid): Sektionsabstand > Intra-Card. Bottom-Nav-Clearance.
export const SPACE = {
  screen: 'space-y-6',   // zwischen Sektionen
  section: 'space-y-3',  // innerhalb einer Sektion/Card
  navClear: 'pb-28',     // Platz für die Bottom-Bar
};

// Tonalität für Status-Flächen (Breakdown etc.). danger = zurückhaltend.
export const TONE = {
  success: { card: 'bg-emerald-50 border border-emerald-100', label: 'text-emerald-700', value: 'text-emerald-700', sub: 'text-emerald-600/70' },
  hit: { card: 'bg-amber-50 border border-amber-100', label: 'text-amber-700', value: 'text-amber-700', sub: 'text-amber-600/70' },
  danger: { card: 'card-surface', label: 'text-slate-500', value: 'text-rose-600', sub: 'text-slate-400' },
  neutral: { card: 'card-surface', label: 'text-slate-500', value: 'text-slate-900', sub: 'text-slate-400' },
};
