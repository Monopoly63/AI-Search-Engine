/**
 * TheoryPage — premium lecture reader
 * All educational content preserved; interface rebuilt as a refined reading product.
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenText, Menu, X } from 'lucide-react';
import { AI_LECTURES, AILecture, LecKey } from './np-lectures';
import { Lang, Theme, getSavedLang, getSavedTheme, applyDocumentLang, applyDocumentTheme } from './np-i18n';
import { PremiumTopNav } from '@/components/PremiumChrome';

function Badge({ text }: { text: string }) {
  return <span className="theory-badge">{text}</span>;
}

function CodeSnippet({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="theory-code-card">
      <div className="theory-code-header">
        <span className="theory-code-lang">python</span>
        <button type="button" onClick={copy} className="theory-copy-btn">
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <pre className="theory-code-pre"><code>{code}</code></pre>
    </div>
  );
}

function LectureView({ lec, isRTL }: { lec: AILecture; isRTL: boolean }) {
  const tr = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;
  return (
    <div className="theory-article-inner">
      <header className="theory-article-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span className="soft-pill">{String(lec.number).padStart(2, '0')}</span>
          <Badge text={tr(lec.tag)} />
          {lec.algoLink && (
            <Link to={`/?algo=${lec.algoLink}`} className="soft-pill" style={{ textDecoration: 'none' }}>
              {lec.algoLink} Lab
            </Link>
          )}
        </div>
        <h2 className="theory-title">{tr(lec.title)}</h2>
        <p className="theory-summary">{tr(lec.summary)}</p>
      </header>

      {lec.sections.map((sec, si) => (
        <section key={si} className="theory-section">
          <h3 className="theory-section-title">{tr(sec.heading)}</h3>
          {sec.paragraphs.map((p, pi) => (
            <p key={pi}>{tr(p)}</p>
          ))}
          {sec.bullets && (
            <ul>
              {sec.bullets.map((b, bi) => <li key={bi}>{tr(b)}</li>)}
            </ul>
          )}
          {sec.code && <CodeSnippet code={sec.code} />}
        </section>
      ))}

      {lec.examples && lec.examples.length > 0 && (
        <aside className="theory-examples">
          <p className="theory-example-title">{isRTL ? 'أمثلة' : 'Examples'}</p>
          {lec.examples.map((ex, ei) => <p key={ei} className="theory-example">{tr(ex)}</p>)}
        </aside>
      )}
    </div>
  );
}

export default function TheoryPage() {
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const [active, setActive] = useState<LecKey>('lab1');
  const [sideOpen, setSideOpen] = useState(false);
  const isRTL = lang === 'ar';
  const isLight = theme === 'light';

  useEffect(() => { applyDocumentLang(lang); localStorage.setItem('np-lang', lang); }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); localStorage.setItem('np-theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(th => th === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  const lec = AI_LECTURES.find(l => l.id === active)!;
  const tr = (s: { en: string; ar: string }) => isRTL ? s.ar : s.en;

  return (
    <div className="premium-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <PremiumTopNav
        lang={lang}
        isLight={isLight}
        active="theory"
        title={isRTL ? 'محاضرات الذكاء الاصطناعي' : 'AI Theory Lectures'}
        subtitle={isRTL ? 'قارئ معرفي تفاعلي' : 'Interactive knowledge reader'}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
      >
        <button type="button" className="icon-button theory-mobile-toggle" onClick={() => setSideOpen(o => !o)} aria-label={isRTL ? 'قائمة المحاضرات' : 'Lecture list'}>
          {sideOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </PremiumTopNav>

      <main className="page-wrap">
        <section className="glass-card page-hero np-fade-in">
          <div>
            <span className="eyebrow"><span>{isRTL ? 'منهج مختبر الذكاء الاصطناعي' : 'AI lab curriculum'}</span></span>
            <h1 className="page-title">{isRTL ? 'محاضرات مصممة للتركيز.' : 'Lectures designed for focus.'}</h1>
            <p className="page-subtitle">
              {isRTL
                ? 'بيئة قراءة فاخرة للمفاهيم، الأمثلة، ومقاطع Python مع تنقل سريع بين الجلسات وربط مباشر باستوديو الخوارزميات.'
                : 'A refined reading environment for concepts, examples, and Python snippets with fast session navigation and direct links into the algorithm studio.'}
            </p>
          </div>
          <div className="hero-status-card" style={{ minWidth: 240 }}>
            <div className="brand-lockup">
              <span className="brand-mark"><BookOpenText aria-hidden="true" /></span>
              <span>
                <span className="brand-title">{AI_LECTURES.length} {isRTL ? 'محاضرات' : 'Lectures'}</span>
                <span className="brand-kicker">Search · ML · Python</span>
              </span>
            </div>
          </div>
        </section>

        <div className="theory-layout">
          <aside className={`glass-card theory-sidebar-panel${sideOpen ? ' is-open' : ''}`} aria-label={isRTL ? 'المحاضرات' : 'Lectures'}>
            <div className="rail-label"><span>{isRTL ? 'المحاضرات' : 'Lecture index'}</span></div>
            {AI_LECTURES.map(l => (
              <button key={l.id}
                type="button"
                onClick={() => { setActive(l.id); setSideOpen(false); }}
                className={`theory-list-button${active === l.id ? ' is-active' : ''}`}
              >
                <span className="theory-list-index">{String(l.number).padStart(2, '0')}</span>
                <span className="theory-list-title">{tr(l.title)}</span>
              </button>
            ))}
          </aside>

          <article className="glass-card theory-article" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {/* Prominent Visible Lesson Navigation Bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflowX: 'auto', padding: '12px 16px', background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 16, width: '100%' }} role="tablist" aria-label={isRTL ? 'تصفح الدروس' : 'Browse lessons'}>
              <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg-dim)', textTransform: 'uppercase', letterSpacing: 0.5, flexShrink: 0, paddingInlineEnd: 4 }}>
                {isRTL ? 'الدروس:' : 'Lessons:'}
              </span>
              {AI_LECTURES.map((l) => {
                const isActive = active === l.id;
                return (
                  <button
                    key={l.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(l.id)}
                    style={{
                      padding: '8px 16px', borderRadius: 9999, border: isActive ? '1px solid var(--fg-strong)' : '1px solid transparent',
                      background: isActive ? 'var(--fg-strong)' : 'transparent', color: isActive ? 'var(--bg)' : 'var(--fg-muted)',
                      fontSize: 12, fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap', cursor: 'pointer', transition: 'all 200ms', flexShrink: 0
                    }}
                  >
                    {String(l.number).padStart(2, '0')}: {l.tag[isRTL ? 'ar' : 'en']}
                  </button>
                );
              })}
            </div>

            <LectureView key={active} lec={lec} isRTL={isRTL} />

            {/* Prominent Lesson Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)' }}>
              {(() => {
                const idx = AI_LECTURES.findIndex(x => x.id === active);
                return (
                  <>
                    <button
                      type="button"
                      disabled={idx <= 0}
                      onClick={() => setActive(AI_LECTURES[idx - 1].id)}
                      className="ghost-button"
                      style={{ padding: '10px 18px', borderRadius: 12, fontWeight: 700, cursor: idx <= 0 ? 'not-allowed' : 'pointer', opacity: idx <= 0 ? 0.4 : 1 }}
                    >
                      → {isRTL ? 'الدرس السابق' : 'Previous Lesson'}
                    </button>
                    <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: 'var(--fg-dim)', fontWeight: 700 }}>
                      {String(idx + 1).padStart(2, '0')} / {String(AI_LECTURES.length).padStart(2, '0')}
                    </span>
                    <button
                      type="button"
                      disabled={idx >= AI_LECTURES.length - 1}
                      onClick={() => setActive(AI_LECTURES[idx + 1].id)}
                      className="primary-button"
                      style={{ padding: '10px 22px', borderRadius: 12, fontWeight: 800, cursor: idx >= AI_LECTURES.length - 1 ? 'not-allowed' : 'pointer', opacity: idx >= AI_LECTURES.length - 1 ? 0.4 : 1 }}
                    >
                      {isRTL ? 'الدرس التالي' : 'Next Lesson'} ←
                    </button>
                  </>
                );
              })()}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
