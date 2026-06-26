/**
 * TheoryPage — AI Lab Lectures
 * All 9 lab sessions from Dr. Ghada Safi
 * CSS variables only — fully theme-aware
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AI_LECTURES, AILecture, LecKey } from './np-lectures';
import { Lang, Theme, getSavedLang, getSavedTheme, applyDocumentLang, applyDocumentTheme } from './np-i18n';

/* ── Badge ── */
function Badge({ text }: { text: string }) {
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const,
      background: 'var(--accent-soft)',
      border: '1px solid var(--border-strong)',
      color: 'var(--fg-muted)',
    }}>{text}</span>
  );
}

/* ── Code snippet ── */
function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div style={{ borderRadius: 6, border: '1px solid var(--border)', overflow: 'hidden', marginTop: 12 }}>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '5px 12px',
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 10, color: 'var(--fg-faint)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>python</span>
        <button onClick={copy} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 10, color: 'var(--fg-dim)', fontFamily: 'monospace',
        }}>
          {copied ? '✓ copied' : '⧉ copy'}
        </button>
      </div>
      <pre style={{
        margin: 0, padding: '12px 14px',
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
        color: 'var(--fg-muted)', lineHeight: 1.7, overflowX: 'auto',
        background: 'var(--bg-panel)',
      }}><code>{code}</code></pre>
    </div>
  );
}

/* ── Lecture content ── */
function LectureView({ lec, isRTL }: { lec: AILecture; isRTL: boolean }) {
  const tr = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'var(--fg-faint)' }}>
            {String(lec.number).padStart(2, '0')}
          </span>
          <Badge text={tr(lec.tag)} />
          {lec.algoLink && (
            <Link to={`/?algo=${lec.algoLink}`} style={{
              fontSize: 10, color: 'var(--fg-dim)', textDecoration: 'none',
              border: '1px solid var(--border)', padding: '2px 8px',
              borderRadius: 4, fontFamily: 'monospace',
              transition: 'color 150ms',
            }}>
              → {lec.algoLink} Lab ↗
            </Link>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'var(--fg-strong)', lineHeight: 1.3 }}>
          {tr(lec.title)}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>
          {tr(lec.summary)}
        </p>
      </div>

      {/* Sections */}
      {lec.sections.map((sec, si) => (
        <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{
            margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--fg)',
            borderBottom: '1px solid var(--border)', paddingBottom: 8,
          }}>
            {tr(sec.heading)}
          </h3>
          {sec.paragraphs.map((p, pi) => (
            <p key={pi} style={{ margin: 0, fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.65 }}>{tr(p)}</p>
          ))}
          {sec.bullets && (
            <ul style={{ margin: '4px 0', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sec.bullets.map((b, bi) => (
                <li key={bi} style={{ fontSize: 12, color: 'var(--fg-dim)', lineHeight: 1.5 }}>{tr(b)}</li>
              ))}
            </ul>
          )}
          {sec.code && <CodeSnippet code={sec.code} />}
        </div>
      ))}

      {/* Examples */}
      {lec.examples && lec.examples.length > 0 && (
        <div style={{
          padding: '12px 16px', borderRadius: 6,
          border: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
        }}>
          <p style={{ margin: '0 0 8px', fontSize: 10, color: 'var(--fg-faint)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {isRTL ? 'أمثلة' : 'Examples'}
          </p>
          {lec.examples.map((ex, ei) => (
            <p key={ei} style={{ margin: '4px 0', fontSize: 12, color: 'var(--fg-dim)', fontFamily: 'monospace' }}>{tr(ex)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main page ── */
export default function TheoryPage() {
  const [lang, setLang]   = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const [active, setActive] = useState<LecKey>('lab1');
  const [sideOpen, setSideOpen] = useState(false);
  const isRTL   = lang === 'ar';
  const isLight = theme === 'light';

  useEffect(() => { applyDocumentLang(lang);  localStorage.setItem('np-lang', lang);  }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); localStorage.setItem('np-theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(th => th === 'dark' ? 'light' : 'dark');
  const toggleLang  = () => setLang(l  => l  === 'en'   ? 'ar'   : 'en');

  const lec = AI_LECTURES.find(l => l.id === active)!;
  const tr  = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 16, zIndex: 50,
        maxWidth: 1240, margin: '16px auto',
        borderRadius: 9999,
        background: 'rgba(19, 21, 28, 0.85)',
        border: '1px solid rgba(255,255,255,0.14)',
        boxShadow: '0 15px 45px rgba(0,0,0,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, flexWrap: 'wrap',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 34, height: 34,
              border: '1.5px solid var(--accent)',
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}>
              <div style={{ width: 12, height: 12, background: 'var(--accent)', transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--fg-strong)', textTransform: 'uppercase' }}>
                {isRTL ? 'سينابس نكسس الذكي' : 'SYNAPSE NEXUS AI'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--fg-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                {isRTL ? 'محاضرات نظرية' : 'Theory Lectures'}
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{
            display: 'flex', gap: 3, padding: '3px',
            border: '1px solid var(--border)',
            borderRadius: 8, background: 'var(--bg-panel)',
          }}>
            {[
              { to: '/',        label: isRTL ? 'البحث'     : 'AI Search' },
              { to: '/ml-lab',  label: isRTL ? 'المختبر'   : 'ML Lab' },
              { to: '/theory',  label: isRTL ? 'المحاضرات' : 'Theory', active: true },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{
                padding: '5px 14px', borderRadius: 6,
                fontSize: 11, fontWeight: 600, textDecoration: 'none',
                letterSpacing: '0.04em',
                color: item.active ? 'var(--fg-strong)' : 'var(--fg-muted)',
                background: item.active ? 'var(--bg-elevated)' : 'transparent',
                border: item.active ? '1px solid var(--border-strong)' : '1px solid transparent',
                transition: 'all 150ms',
              }}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Controls */}
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button onClick={toggleTheme} style={{
              padding: '6px 12px', borderRadius: 5,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-panel)', color: 'var(--fg-muted)',
              fontSize: 10, cursor: 'pointer', fontFamily: 'monospace',
            }}>
              {isLight ? '☀ Light' : '☾ Dark'}
            </button>
            <button onClick={toggleLang} style={{
              padding: '6px 12px', borderRadius: 5,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-panel)', color: 'var(--fg-muted)',
              fontSize: 10, cursor: 'pointer', fontFamily: 'monospace',
            }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            {/* Mobile lecture list toggle */}
            <button onClick={() => setSideOpen(o => !o)} style={{
              display: 'none',
              padding: '6px 10px', borderRadius: 5,
              border: '1px solid var(--border-strong)',
              background: sideOpen ? 'var(--accent-soft)' : 'var(--bg-panel)',
              color: 'var(--fg-muted)',
              fontSize: 13, cursor: 'pointer',
            }} className="theory-mobile-toggle">
              {sideOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '28px 20px',
        display: 'grid', gridTemplateColumns: '220px 1fr',
        gap: 24,
      }} className="theory-grid">

        {/* ── Lecture list sidebar ── */}
        <aside style={{
          position: 'sticky', top: 72,
          height: 'fit-content',
          display: 'flex', flexDirection: 'column', gap: 3,
        }} className={`theory-sidebar${sideOpen ? ' theory-sidebar--open' : ''}`}>
          <p style={{
            margin: '0 0 10px', fontSize: 9,
            color: 'var(--fg-faint)', letterSpacing: '0.12em',
            textTransform: 'uppercase', fontFamily: 'monospace',
          }}>
            {isRTL ? 'المحاضرات' : 'Lectures'}
          </p>
          {AI_LECTURES.map(l => (
            <button key={l.id}
              onClick={() => { setActive(l.id); setSideOpen(false); }}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '9px 12px', borderRadius: 5, cursor: 'pointer',
                textAlign: isRTL ? 'right' : 'left', width: '100%',
                background: active === l.id ? 'var(--accent-soft)' : 'transparent',
                border: '1px solid ' + (active === l.id ? 'var(--border-accent)' : 'transparent'),
                borderInlineStart: active === l.id ? '2.5px solid var(--accent)' : '1px solid transparent',
                color: active === l.id ? 'var(--fg-strong)' : 'var(--fg-muted)',
                transition: 'all 160ms',
              }}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'var(--fg-faint)', paddingTop: 2, minWidth: 18, flexShrink: 0 }}>
                {String(l.number).padStart(2, '0')}
              </span>
              <span style={{ fontSize: 11, fontWeight: active === l.id ? 700 : 500, lineHeight: 1.4 }}>
                {tr(l.title)}
              </span>
            </button>
          ))}
        </aside>

        {/* ── Lecture content ── */}
        <article style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8, padding: '28px 30px',
          minHeight: 500,
        }}>
          <LectureView key={active} lec={lec} isRTL={isRTL} />
        </article>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          .theory-grid { grid-template-columns: 1fr !important; }
          .theory-sidebar {
            position: static !important;
            display: none !important;
          }
          .theory-sidebar.theory-sidebar--open {
            display: flex !important;
            background: var(--bg-panel);
            border: 1px solid var(--border);
            border-radius: 8px;
            padding: 12px;
            max-height: 280px;
            overflow-y: auto;
          }
          .theory-mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
}
