/**
 * MLLabPage — premium wrapper for the ML Lab module
 * Functionality preserved; visual system rebuilt from first principles.
 */
import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { Database, FlaskConical, Gauge, PlayCircle } from 'lucide-react';
import { Lang, Theme, getSavedLang, getSavedTheme, applyDocumentLang, applyDocumentTheme } from './np-i18n';
import { PremiumTopNav } from '@/components/PremiumChrome';
import MLLab from './MLLab';
import LiveTrainer from './LiveTrainer';

export default function MLLabPage() {
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const isRTL = lang === 'ar';
  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState<'analysis' | 'trainer'>('analysis');

  useEffect(() => { applyDocumentLang(lang); localStorage.setItem('np-lang', lang); }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); localStorage.setItem('np-theme', theme); }, [theme]);

  const toggleTheme = () => setTheme(th => th === 'dark' ? 'light' : 'dark');
  const toggleLang = () => setLang(l => l === 'en' ? 'ar' : 'en');

  return (
    <div className="premium-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <PremiumTopNav
        lang={lang}
        isLight={isLight}
        active="lab"
        title={isRTL ? 'مختبر التعلم الآلي' : 'Machine Learning Lab'}
        subtitle={isRTL ? 'بيانات حقيقية · نماذج مباشرة' : 'Real data · live modeling'}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
      />

      <main className="page-wrap">
        <section className="glass-card page-hero np-fade-in">
          <div>
            <span className="eyebrow"><span>{isRTL ? 'محطة تحليل مؤسسية' : 'Enterprise analysis station'}</span></span>
            <h1 className="page-title">{isRTL ? 'مختبر نماذج حي.' : 'Live model intelligence.'}</h1>
            <p className="page-subtitle">
              {isRTL
                ? 'واجهة تحليل فاخرة لبيانات Kaggle الحقيقية: نماذج تقليدية، رسوم تفاعلية، وسجل تدريب حي يحافظ على منطق التطبيق الأصلي بالكامل.'
                : 'A premium analysis interface for real Kaggle data: classical models, precise visualizations, and a live training console while preserving the original application logic.'}
            </p>
            <div className="pill-row">
              {['Linear Regression', 'K-Means', 'PCA', 'Decision Tree', 'Isolation Forest', 'Random Forest'].map(m => (
                <span key={m} className="soft-pill">{m}</span>
              ))}
            </div>
          </div>

          <div className="metric-grid" style={{ minWidth: 320, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
            <HeroMetric icon={<Database aria-hidden="true" />} label={isRTL ? 'السجلات' : 'Records'} value="10,000" />
            <HeroMetric icon={<Gauge aria-hidden="true" />} label={isRTL ? 'الخصائص' : 'Features'} value="34" />
            <HeroMetric icon={<FlaskConical aria-hidden="true" />} label={isRTL ? 'النماذج' : 'Models'} value="8" />
            <HeroMetric icon={<PlayCircle aria-hidden="true" />} label={isRTL ? 'تدريب' : 'Trainer'} value="Live" />
          </div>
        </section>

        <section className="glass-card lab-panel">
          <div className="lab-tabs" role="tablist" aria-label={isRTL ? 'أوضاع المختبر' : 'Lab modes'}>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'analysis'}
              onClick={() => setActiveTab('analysis')}
              className={`lab-tab${activeTab === 'analysis' ? ' is-active' : ''}`}
            >
              {isRTL ? 'تحليل البيانات' : 'Data Analysis'}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'trainer'}
              onClick={() => setActiveTab('trainer')}
              className={`lab-tab${activeTab === 'trainer' ? ' is-active' : ''}`}
            >
              {isRTL ? 'التدريب المباشر' : 'Live Trainer'}
            </button>
          </div>

          {activeTab === 'analysis'
            ? <MLLab lang={lang} />
            : <LiveTrainer lang={lang} />
          }
        </section>
      </main>
    </div>
  );
}

function HeroMetric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="metric-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, color: 'var(--fg-dim)' }}>
        <span className="metric-label">{label}</span>
        {icon}
      </div>
      <div className="metric-value">{value}</div>
    </div>
  );
}
