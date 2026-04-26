import React from 'react';
import { RunStatus } from './np-types';
import { tokenizeLine, tokenStyle, Token } from './np-content';

export function SidebarLabel({ text }: { text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 4, height: 4, background: 'var(--accent)', boxShadow: '0 0 4px var(--accent-glow)' }} />
      <span className="np-sans" style={{ fontSize: 10, letterSpacing: 2.5, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export function MiniStatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0' }}>
      <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
      <span className="np-mono" style={{ fontSize: 11, color: highlight ? 'var(--fg-strong)' : 'var(--fg-muted)', letterSpacing: 0.5, fontVariantNumeric: 'tabular-nums', fontWeight: highlight ? 700 : 500 }}>{value}</span>
    </div>
  );
}

export function SectionBar({ index, title }: { index: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <span className="np-mono" style={{ padding: '5px 10px', border: '1px solid var(--border-strong)', fontSize: 11, letterSpacing: 2, color: 'var(--fg-strong)', background: 'var(--bg-panel)', borderRadius: 3, fontWeight: 700 }}>{index}</span>
      <span className="np-sans" style={{ fontSize: 13, letterSpacing: 2.5, color: 'var(--fg)', textTransform: 'uppercase', fontWeight: 700 }}>{title}</span>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

export function Divider() { return <div style={{ height: 1, background: 'var(--border)', margin: '14px 0' }} />; }

export function Badge({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  const emphasize = value === 'YES' || value === 'نعم';
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', border: '1px solid var(--border-strong)', background: 'var(--bg-panel)', borderRadius: 4 }}>
      <span className="np-sans" style={{ fontSize: 9, letterSpacing: 1.5, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{label}</span>
      <span className={mono ? 'np-mono' : 'np-sans'} style={{ fontSize: 11, color: emphasize ? 'var(--fg-strong)' : 'var(--fg)', letterSpacing: mono ? 0.5 : 1.5, textTransform: 'uppercase', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export function FlowDiagram({ steps }: { steps: string[] }) {
  return (
    <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
      {steps.map((s, i) => {
        const highlight = i === 0 || i === steps.length - 1;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div className="np-sans" style={{
              width: '100%', padding: '10px 10px',
              border: `1px solid ${highlight ? 'var(--border-accent)' : 'var(--border)'}`,
              background: highlight ? 'var(--accent-soft)' : 'var(--bg-panel)',
              color: highlight ? 'var(--fg-strong)' : 'var(--fg-muted)',
              fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', textAlign: 'center', borderRadius: 3,
              fontWeight: highlight ? 700 : 500,
              boxShadow: highlight ? 'var(--shadow-glow)' : 'none',
            }}>{s}</div>
            {i < steps.length - 1 && (
              <div style={{ color: 'var(--fg-faint)', fontSize: 10, lineHeight: 1 }}>▼</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CodeBlock({ code }: { code: string }) {
  const lines = code.split('\n');
  return (
    <div className="np-scroll" style={{ maxHeight: 480, overflow: 'auto', background: 'var(--bg-alt)', direction: 'ltr' }}>
      <pre className="np-mono" style={{ margin: 0, padding: '14px 0', fontSize: 12.5, lineHeight: 1.7 }}>
        {lines.map((line, i) => {
          const tokens: Token[] = tokenizeLine(line);
          return (
            <div key={i} style={{ display: 'flex', minWidth: 'min-content' }}>
              <span style={{ display: 'inline-block', width: 48, textAlign: 'right', paddingRight: 14, color: 'var(--fg-faint)', borderRight: '1px solid var(--border)', userSelect: 'none', flexShrink: 0 }}>{i + 1}</span>
              <span style={{ paddingLeft: 14, paddingRight: 14, whiteSpace: 'pre', flex: 1 }}>
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
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="np-sans"
      style={{
        padding: '9px 12px',
        background: solid ? 'var(--accent)' : hover ? 'var(--accent-soft)' : 'var(--bg-panel)',
        color: solid ? 'var(--accent-fg)' : 'var(--fg)',
        border: `1px solid ${solid ? 'var(--accent)' : 'var(--border-strong)'}`,
        fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', fontWeight: 600,
        cursor: 'pointer', borderRadius: 3,
        boxShadow: solid ? 'var(--shadow-glow)' : 'none',
        transition: 'all 150ms',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  );
}

export function StatusPill({ status, labels }: { status: RunStatus; labels: Record<RunStatus, string> }) {
  const isActive = status === 'SEARCHING';
  const isSuccess = status === 'PATH_FOUND';
  const isFail = status === 'NO_PATH';
  return (
    <span className="np-sans" style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
      border: `1px solid ${isSuccess ? 'var(--border-accent)' : isFail ? 'var(--border-strong)' : 'var(--border)'}`,
      background: isSuccess ? 'var(--accent-soft)' : 'transparent',
      fontSize: 10, letterSpacing: 1.2, color: isSuccess ? 'var(--fg-strong)' : isFail ? 'var(--fg)' : 'var(--fg-muted)',
      fontWeight: 600,
      borderRadius: 3,
    }}>
      {isActive && <span style={{ width: 5, height: 5, background: 'var(--fg-strong)', borderRadius: '50%', animation: 'np-blink 0.9s ease-in-out infinite' }} />}
      {labels[status]}
    </span>
  );
}

export function Numeric({ n, suffix }: { n: number; suffix?: string }) {
  return <span className="np-mono" style={{ fontSize: 12, color: 'var(--fg-strong)', letterSpacing: 0.5, fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{n}{suffix ?? ''}</span>;
}

export function StatRowCompact({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px dashed var(--border)' }}>
      <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1.2, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
      {value}
    </div>
  );
}

export function LabelRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
      <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1.2, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 500 }}>{label}</span>
      <span className="np-mono" style={{ fontSize: 11, color: 'var(--fg-strong)', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{value}</span>
    </div>
  );
}

export function Legend({ title, items }: { title: string; items: { color: string; label: string; border?: string }[] }) {
  return (
    <div className="np-glass" style={{ padding: 14, borderRadius: 4 }}>
      <SidebarLabel text={title} />
      <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
        {items.map((it) => (
          <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 14, height: 14, background: it.color, border: `1px solid ${it.border || 'var(--border-strong)'}`, display: 'inline-block', borderRadius: 2 }} />
            <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1, color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 500 }}>{it.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}