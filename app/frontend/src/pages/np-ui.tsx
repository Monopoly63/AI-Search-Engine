import React from 'react';
import { RunStatus } from './np-types';
import { tokenizeLine, tokenStyle, Token } from './np-content';

export function SidebarLabel({ text }: { text: string }) {
  return <div className="rail-label"><span>{text}</span></div>;
}

export function MiniStatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="telemetry-row">
      <span>{label}</span>
      <span className="numeric-value" style={highlight ? undefined : { color: 'var(--fg-muted)' }}>{value}</span>
    </div>
  );
}

export function SectionBar({ index, title }: { index: string; title: string }) {
  return (
    <div className="section-heading" style={{ marginBottom: 0 }}>
      <div className="section-title-group">
        <div className="section-kicker">{index}</div>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="premium-divider" aria-hidden="true" />
    </div>
  );
}

export function Divider() { return <div className="premium-divider" />; }

export function Badge({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="np-badge">
      <span className="np-badge-label">{label}</span>
      <span className={`np-badge-value${mono ? ' np-mono' : ''}`}>{value}</span>
    </div>
  );
}

export function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div className="flow-list">
      {steps.map((s, i) => {
        const highlight = i === 0 || i === steps.length - 1;
        return (
          <div key={i} className={`flow-step${highlight ? ' is-key' : ''}`}>
            <span className="flow-index">{String(i + 1).padStart(2, '0')}</span>
            <span className="flow-text">{s}</span>
          </div>
        );
      })}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <div className="np-code-scroll np-scroll" dir="ltr">
      <pre>
        {lines.map((line, i) => {
          const tokens: Token[] = tokenizeLine(line);
          return (
            <div key={i} className="code-line">
              <span className="code-line-number">{i + 1}</span>
              <span className="code-line-content">
                {tokens.length === 0 ? ' ' : tokens.map((t, ti) => <span key={ti} style={tokenStyle(t.type)}>{t.text}</span>)}
              </span>
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export function GhostButton({ label, onClick, solid }: { label: string; onClick: () => void; solid?: boolean }) {
  return (
    <button onClick={onClick} type="button" className={solid ? 'primary-button' : 'ghost-button'}>
      {label}
    </button>
  );
}

export function StatusPill({ status, labels }: { status: RunStatus; labels: Record<RunStatus, string> }) {
  const isActive = status === 'SEARCHING';
  const isSuccess = status === 'PATH_FOUND';
  const isFail = status === 'NO_PATH';
  return (
    <span className={`status-pill${isActive ? ' is-active' : ''}${isSuccess ? ' is-success' : ''}${isFail ? ' is-fail' : ''}`}>
      {isActive && <span className="status-dot" aria-hidden="true" />}
      {labels[status]}
    </span>
  );
}

export function Numeric({ n, suffix }: { n: number; suffix?: string }) {
  return <span className="numeric-value">{n}{suffix ?? ''}</span>;
}

export function StatRowCompact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="telemetry-row">
      <span>{label}</span>
      {value}
    </div>
  );
}

export function LabelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="telemetry-row" style={{ borderBottom: 0 }}>
      <span>{label}</span>
      <span className="numeric-value">{value}</span>
    </div>
  );
}

export function Legend({ title, items }: { title: string; items: { color: string; label: string; border?: string }[] }) {
  return (
    <div className="glass-card drawer-section">
      <SidebarLabel text={title} />
      <div className="legend-grid">
        {items.map((it) => (
          <div key={it.label} className="legend-item">
            <span className="legend-swatch" style={{ background: it.color, borderColor: it.border || 'var(--border-strong)' }} />
            <span>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
