// =============================================================
// Feature-Flags / Prototyp-Schalter für ArtCyc Coach
// =============================================================
//
// Ein einfacher, localStorage-basierter Schalter, mit dem der User
// (in den Einstellungen) experimentelle Funktionen vorab freischalten
// kann, die noch nicht für alle ausgerollt sind.
//
// API:
//   getProtoFeatures()  -> boolean    aktueller Zustand
//   setProtoFeatures(on)              schaltet um + benachrichtigt Hörer
//   useProtoFeatures()  -> boolean    React-Hook, re-rendert bei Änderung
//
// Andere Komponenten (z. B. die kommende Feedback-Dokumentation) prüfen
// einfach `useProtoFeatures()` und blenden ihre UI nur dann ein.
// =============================================================
import { useState, useEffect } from 'react';

export const PROTO_KEY = 'artcyc:proto-features';
const CHANGE_EVENT = 'artcyc:proto-features-change';

export function getProtoFeatures() {
  try { return localStorage.getItem(PROTO_KEY) === '1'; } catch { return false; }
}

export function setProtoFeatures(on) {
  try { localStorage.setItem(PROTO_KEY, on ? '1' : '0'); } catch { /* localStorage evtl. blockiert */ }
  // Gleiche-Tab-Hörer benachrichtigen (das native 'storage'-Event feuert nur
  // in ANDEREN Tabs, nicht im selben).
  try { window.dispatchEvent(new Event(CHANGE_EVENT)); } catch { /* SSR/kein window */ }
}

export function useProtoFeatures() {
  const [on, setOn] = useState(getProtoFeatures);
  useEffect(() => {
    const handler = () => setOn(getProtoFeatures());
    window.addEventListener(CHANGE_EVENT, handler);
    window.addEventListener('storage', handler); // Sync über mehrere Tabs
    return () => {
      window.removeEventListener(CHANGE_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);
  return on;
}
