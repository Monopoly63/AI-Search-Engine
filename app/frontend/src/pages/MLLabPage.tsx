/**
 * MLLabPage — wrapper for the ML Lab module
 * Uses CSS variables only — fully theme-aware (dark + light)
 */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Lang, Theme, DICTS, getSavedLang, getSavedTheme, applyDocumentLang, applyDocumentTheme } from './np-i18n';
import MLLab from './MLLab';
import LiveTrainer from './LiveTrainer';

export default function MLLabPage() {
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const t = DICTS[lang];
  const isRTL = lang === 'ar';
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'analysis' | 'trainer'>('analysis');

  useEffect(() => { applyDocumentLang(lang);  localStorage.setItem('np-lang', lang);  }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); localStorage.setItem('np-theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(th => th === 'dark' ? 'light' : 'dark');
  const toggleLang  = () => setLang(l  => l  === 'en'   ? 'ar'   : 'en');

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'}
      style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, flexWrap: 'wrap',
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
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--fg-strong)', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                {isRTL ? 'مختبر التعلم الآلي' : 'ML Lab'}
              </div>
              <div style={{ fontSize: 9, color: 'var(--fg-faint)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'monospace' }}>
                {isRTL ? 'بيانات Kaggle · 10,000 سجل' : 'Real Kaggle Data · 10,000 Records'}
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{
            display: 'flex', gap: 3,
            padding: '3px',
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: 'var(--bg-panel)',
          }}>
            {[
              { to: '/',        label: isRTL ? 'البحث'     : 'AI Search' },
              { to: '/ml-lab',  label: isRTL ? 'المختبر'   : 'ML Lab',   active: true },
              { to: '/theory',  label: isRTL ? 'المحاضرات' : 'Theory' },
            ].map(item => (
              <Link key={item.to} to={item.to} style={{
                padding: '5px 14px', borderRadius: 6,
                fontSize: 11, fontWeight: 600,
                textDecoration: 'none',
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

          {/* Toggles */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={toggleTheme} style={{
              padding: '6px 12px', borderRadius: 5,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-panel)', color: 'var(--fg-muted)',
              fontSize: 10, cursor: 'pointer', fontFamily: 'monospace',
              transition: 'all 150ms',
            }}>
              {isLight ? '☀ Light' : '☾ Dark'}
            </button>
            <button onClick={toggleLang} style={{
              padding: '6px 12px', borderRadius: 5,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-panel)', color: 'var(--fg-muted)',
              fontSize: 10, cursor: 'pointer', fontFamily: 'monospace',
              transition: 'all 150ms',
            }}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 20px 0' }}>
        <div style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          padding: '20px 24px',
          marginBottom: 24,
          display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 6,
            border: '1.5px solid var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, background: 'var(--accent-soft)',
          }}>
            <span style={{ fontSize: 20 }}>⚗</span>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <h2 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 700, color: 'var(--fg-strong)', letterSpacing: 0.3 }}>
              {isRTL ? 'مختبر التعلم الآلي التفاعلي' : 'Interactive Machine Learning Lab'}
            </h2>
            <p style={{ margin: '0 0 12px', fontSize: 13, color: 'var(--fg-muted)', lineHeight: 1.6 }}>
              {isRTL
                ? 'جميع النتائج محسوبة من بيانات Kaggle الحقيقية (10,000 موظف، 34 خاصية). لا بيانات وهمية.'
                : 'All results computed from real Kaggle data (10,000 employees, 34 features). Zero mock data.'}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {['Linear Regression','K-Means','PCA','Decision Tree','Isolation Forest','Random Forest'].map(m => (
                <span key={m} style={{
                  padding: '3px 10px', borderRadius: 4,
                  fontSize: 10, fontWeight: 600, letterSpacing: '0.06em',
                  background: 'var(--accent-soft)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--fg-muted)',
                }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{
          background: 'var(--bg-panel)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 40,
        }}>
          {/* Tab bar */}
          <div style={{
            display: 'flex', gap: 0,
            borderBottom: '1px solid var(--border)',
            background: 'var(--bg-elevated)',
          }}>
            {([
              { id: 'analysis', label: isRTL ? '📊 تحليل البيانات' : '📊 Data Analysis' },
              { id: 'trainer',  label: isRTL ? '🚀 تدريب Live'    : '🚀 Live Trainer'  },
            ] as const).map(tab => (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="ml-tab-btn"
                style={{
                  borderRadius: 0,
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--fg-strong)' : 'var(--fg-faint)',
                  background: 'transparent',
                  borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                  paddingBottom: 10,
                  fontFamily: 'Space Grotesk, Inter, sans-serif',
                  fontSize: 12, fontWeight: 600,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'analysis'
            ? <MLLab lang={lang} />
            : <LiveTrainer lang={lang} />
          }
        </div>
      </div>
    </div>
  );
}
