// =============================================================
// React-ErrorBoundary mit automatischer Crash-Meldung
// =============================================================
//
// Fängt React-Render-Errors die nicht von window.onerror erwischt
// werden (z. B. Lifecycle-Errors innerhalb von Komponenten).
// Meldet sie an die report-error-Edge-Function und zeigt einen
// einfachen Reload-Screen — auf Deutsch, weil hier i18n nicht
// garantiert noch funktioniert.
// =============================================================

import React from 'react';
import { reportError } from './errorReporter.js';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Component-Stack ist sehr wertvoll für's Debugging — packen wir
    // an den eigentlichen Stack mit dran damit Resend-Mail beides hat.
    const merged = new Error(error?.message || 'React error');
    merged.stack = (error?.stack || '') + '\n\nComponent-Stack:' + (info?.componentStack || '');
    reportError(merged, 'ReactErrorBoundary');
  }

  handleReload = () => {
    try { location.reload(); } catch {}
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20, fontFamily: '-apple-system,BlinkMacSystemFont,system-ui,sans-serif',
        background: '#F2F2F7', color: '#0f172a', zIndex: 9999
      }}>
        <div style={{ maxWidth: 420, background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>⚠️</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Etwas ist schiefgelaufen</h2>
          <p style={{ fontSize: 14, color: '#3C3C43', margin: '0 0 16px', lineHeight: 1.45 }}>
            Der Fehler wurde automatisch an den Entwickler gemeldet. Die App lässt
            sich oft mit einem Reload weiterverwenden.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              background: '#FF9500', color: '#fff', border: 0, borderRadius: 9999,
              padding: '10px 18px', fontSize: 15, fontWeight: 600, cursor: 'pointer', width: '100%'
            }}>
            App neu laden
          </button>
          <details style={{ marginTop: 16 }}>
            <summary style={{ fontSize: 12, color: '#8E8E93', cursor: 'pointer' }}>Details</summary>
            <pre style={{ fontSize: 11, color: '#64748b', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginTop: 8, maxHeight: 200, overflow: 'auto' }}>
              {String(this.state.error?.stack || this.state.error?.message || this.state.error)}
            </pre>
          </details>
        </div>
      </div>
    );
  }
}
