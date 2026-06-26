/**
 * Theory Page — AI Lab Lectures
 * All 9 lab sessions from Dr. Ghada Safi
 * Same visual design as main Neural Pathfinder interface
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AI_LECTURES, AILecture, LecKey } from './np-lectures';
import { Lang, Theme, getSavedLang, getSavedTheme, applyDocumentLang, applyDocumentTheme } from './np-i18n';

/* ── tiny helpers ── */
function Badge({ text, accent }: { text: string; accent: string }) {
  const colors: Record<string, string> = {
    cyan:   'rgba(6,182,212,.2)',
    purple: 'rgba(139,92,246,.2)',
    pink:   'rgba(236,72,153,.2)',
    green:  'rgba(34,197,94,.2)',
    orange: 'rgba(249,115,22,.2)',
  };
  return (
    <span style={{
      padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 600,
      background: colors[accent] || 'rgba(255,255,255,.1)',
      border: `1px solid ${colors[accent] || 'rgba(255,255,255,.1)'}`,
      color: 'rgba(255,255,255,.8)', letterSpacing: '0.08em', textTransform: 'uppercase',
    }}>{text}</span>
  );
}

function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div style={{ borderRadius: 8, border: '1px solid rgba(255,255,255,.08)', overflow: 'hidden', marginTop: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 12px', background: 'rgba(255,255,255,.03)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,.3)', fontFamily: 'monospace', letterSpacing: '0.1em' }}>python</span>
        <button onClick={copy} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: 'rgba(255,255,255,.4)', fontFamily: 'monospace' }}>
          {copied ? '✓ copied' : '⧉ copy'}
        </button>
      </div>
      <pre style={{ margin: 0, padding: '12px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: 'rgba(255,255,255,.7)', lineHeight: 1.7, overflowX: 'auto', background: 'transparent' }}><code>{code}</code></pre>
    </div>
  );
}

function LectureView({ lec, isRTL }: { lec: AILecture; isRTL: boolean }) {
  const t = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Lecture header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,.3)' }}>
            {String(lec.number).padStart(2,'0')}
          </span>
          <Badge text={t(lec.tag)} accent={lec.accent} />
          {lec.algoLink && (
            <Link to={`/?algo=${lec.algoLink}`}
              style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', textDecoration: 'none', border: '1px solid rgba(255,255,255,.1)', padding: '2px 8px', borderRadius: 4, fontFamily: 'monospace' }}>
              → {lec.algoLink} Lab ↗
            </Link>
          )}
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: 'rgba(255,255,255,.92)', lineHeight: 1.3 }}>
          {t(lec.title)}
        </h2>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
          {t(lec.summary)}
        </p>
      </div>

      {/* Sections */}
      {lec.sections.map((sec, si) => (
        <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,.8)', borderBottom: '1px solid rgba(255,255,255,.06)', paddingBottom: 8 }}>
            {t(sec.heading)}
          </h3>
          {sec.paragraphs.map((p, pi) => (
            <p key={pi} style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,.55)', lineHeight: 1.65 }}>{t(p)}</p>
          ))}
          {sec.bullets && (
            <ul style={{ margin: '4px 0', padding: '0 0 0 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {sec.bullets.map((b, bi) => (
                <li key={bi} style={{ fontSize: 12, color: 'rgba(255,255,255,.5)', lineHeight: 1.5 }}>{t(b)}</li>
              ))}
            </ul>
          )}
          {sec.code && <CodeSnippet code={sec.code} />}
        </div>
      ))}

      {/* Examples */}
      {lec.examples && lec.examples.length > 0 && (
        <div style={{ padding: '12px 16px', borderRadius: 8, border: '1px solid rgba(255,255,255,.06)', background: 'rgba(255,255,255,.02)' }}>
          <p style={{ margin: '0 0 8px', fontSize: 11, color: 'rgba(255,255,255,.3)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {isRTL ? 'أمثلة' : 'Examples'}
          </p>
          {lec.examples.map((ex, ei) => (
            <p key={ei} style={{ margin: '4px 0', fontSize: 12, color: 'rgba(255,255,255,.5)', fontFamily: 'monospace' }}>{t(ex)}</p>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TheoryPage() {
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const [active, setActive] = useState<LecKey>('lab1');
  const isRTL = lang === 'ar';

  useEffect(() => { applyDocumentLang(lang); }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); }, [theme]);

  const lec = AI_LECTURES.find(l => l.id === active)!;
  const t = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;

  return (
    <div className="min-h-screen" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Header — same as main page */}
      <header className="sticky top-0 z-50" style={{ background: 'rgba(9,9,9,.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 34, height: 34, border: '1.5px solid rgba(255,255,255,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
              <div style={{ width: 12, height: 12, background: 'rgba(255,255,255,.8)', transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <div style={{ fontSize: 12, letterSpacing: '0.15em', color: 'rgba(255,255,255,.9)', fontWeight: 700, textTransform: 'uppercase' }}>
                {isRTL ? 'المستكشف العصبي' : 'Neural Pathfinder'}
              </div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                {isRTL ? 'محاضرات نظرية' : 'Theory Lectures'}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: 4, padding: '4px', border: '1px solid rgba(255,255,255,.08)', borderRadius: 12, background: 'rgba(255,255,255,.03)' }}>
            <Link to="/" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.5)', textDecoration: 'none', letterSpacing: '0.04em' }}>
              {isRTL ? '⟵ المختبر' : 'Lab ↗'}
            </Link>
            <span style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', letterSpacing: '0.04em' }}>
              {isRTL ? 'المحاضرات' : 'Theory'}
            </span>
            <Link to="/ml-lab" style={{ padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.5)', textDecoration: 'none', letterSpacing: '0.04em' }}>
              ML Lab ↗
            </Link>
          </nav>

          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => { const t = theme === 'dark' ? 'light' : 'dark'; setTheme(t); applyDocumentTheme(t); window.localStorage.setItem('np-theme', t); }}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.6)', fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>
              {theme === 'dark' ? '☀ Light' : '☾ Dark'}
            </button>
            <button onClick={() => { const l = lang === 'en' ? 'ar' : 'en'; setLang(l); window.localStorage.setItem('np-lang', l); }}
              style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid rgba(255,255,255,.12)', background: 'rgba(255,255,255,.04)', color: 'rgba(255,255,255,.6)', fontSize: 10, cursor: 'pointer', fontFamily: 'monospace' }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 20px', display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Lecture list sidebar */}
        <aside style={{ position: 'sticky', top: 80, height: 'fit-content', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <p style={{ margin: '0 0 10px', fontSize: 9, color: 'rgba(255,255,255,.25)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
            {isRTL ? 'المحاضرات' : 'Lectures'}
          </p>
          {AI_LECTURES.map(l => (
            <button key={l.id}
              onClick={() => setActive(l.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: isRTL ? 'right' : 'left',
                background: active === l.id ? 'rgba(255,255,255,.08)' : 'transparent',
                borderLeft: active === l.id && !isRTL ? '2px solid rgba(255,255,255,.5)' : '2px solid transparent',
                borderRight: active === l.id && isRTL ? '2px solid rgba(255,255,255,.5)' : '2px solid transparent',
                transition: 'all .15s',
              }}>
              <span style={{ fontSize: 9, fontFamily: 'monospace', color: 'rgba(255,255,255,.3)', minWidth: 16 }}>{String(l.number).padStart(2,'0')}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: active === l.id ? 'rgba(255,255,255,.9)' : 'rgba(255,255,255,.45)', lineHeight: 1.3 }}>
                {t(l.title)}
              </span>
            </button>
          ))}
        </aside>

        {/* Lecture content */}
        <div style={{ border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '28px 32px', background: 'rgba(255,255,255,.02)' }}>
          <LectureView lec={lec} isRTL={isRTL} />
        </div>
      </main>
    </div>
  );
}
