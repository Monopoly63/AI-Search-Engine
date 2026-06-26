import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FlaskConical, GitBranch, GraduationCap, Instagram } from 'lucide-react';
import {
  Lang, Theme, DICTS, getSavedLang, getSavedTheme,
  applyDocumentLang, applyDocumentTheme,
} from './np-i18n';
// Inline toggles (no Tree Lab dependency)
import MLLab from './MLLab';

const INSTAGRAM_URL = 'https://www.instagram.com/li0vy_?igsh=MXZ2czd3ODA3ejJ6ZA==';

export default function MLLabPage() {
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const t = DICTS[lang];
  const isRTL = lang === 'ar';

  useEffect(() => { applyDocumentLang(lang); window.localStorage.setItem('np-lang', lang); }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); window.localStorage.setItem('np-theme', theme); }, [theme]);

  return (
    <div className="min-h-screen text-white relative">
      {/* HEADER */}
      <header className="sticky top-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-xl glass-strong flex items-center justify-center">
              <FlaskConical className="w-5 h-5 text-white" strokeWidth={1.5} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse-glow"></span>
            </div>
            <div>
              <h1 className="text-base md:text-lg font-semibold text-white" style={{letterSpacing:'0.05em'}}>
                {isRTL ? 'مختبر التعلم الآلي' : 'ML Lab'}
              </h1>
              <p className="text-[10px] text-[#a0a0a0] uppercase mt-0.5" style={{letterSpacing:'0.15em'}}>
                {isRTL ? 'بيانات Kaggle الحقيقية' : 'Real Kaggle Data · 10,000 Records'}
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 glass p-1 rounded-xl">
            <Link to="/" className="px-4 py-1.5 text-xs font-semibold text-[#a0a0a0] hover:text-white rounded-lg transition-colors inline-flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" strokeWidth={1.5} />
              {isRTL ? 'البحث' : 'AI Search'}
            </Link>
            <span className="px-4 py-1.5 text-xs font-semibold text-white glass-strong rounded-lg inline-flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" strokeWidth={1.5} />
              {isRTL ? 'المختبر' : 'ML Lab'}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => { const l = lang === 'en' ? 'ar' : 'en'; setLang(l); window.localStorage.setItem('np-lang', l); }}
              style={{padding:'6px 12px',borderRadius:6,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.04)',color:'rgba(255,255,255,.6)',fontSize:10,cursor:'pointer',fontFamily:'monospace'}}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <button onClick={() => { const t = theme === 'dark' ? 'light' : 'dark'; setTheme(t); applyDocumentTheme(t); window.localStorage.setItem('np-theme', t); }}
              style={{padding:'6px 12px',borderRadius:6,border:'1px solid rgba(255,255,255,.12)',background:'rgba(255,255,255,.04)',color:'rgba(255,255,255,.6)',fontSize:10,cursor:'pointer',fontFamily:'monospace'}}>
              {theme === 'dark' ? '☀' : '☾'}
            </button>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="group w-11 h-11 rounded-xl glass hidden sm:flex items-center justify-center transition-all duration-200 hover:bg-white/10">
              <Instagram className="w-5 h-5 text-white/90" strokeWidth={1.5} />
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-5 py-8">
        {/* Hero section */}
        <div className="mb-8">
          <div className="glass-strong rounded-2xl p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl glass flex items-center justify-center flex-shrink-0">
                <FlaskConical className="w-6 h-6 text-white" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                  {isRTL ? 'مختبر التعلم الآلي التفاعلي' : 'Interactive Machine Learning Lab'}
                </h2>
                <p className="text-sm text-[#a0a0a0] max-w-2xl">
                  {isRTL
                    ? 'جميع النتائج محسوبة من بيانات Kaggle الحقيقية (10,000 موظف، 34 خاصية) باستخدام scikit-learn الفعلي. لا بيانات وهمية.'
                    : 'All results computed from real Kaggle data (10,000 employees, 34 features) using actual scikit-learn models. Zero mock data.'}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['Linear Regression','K-Means','PCA','Decision Tree','Isolation Forest','Random Forest'].map(m=>(
                    <span key={m} className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{background:'rgba(255,255,255,.06)',border:'1px solid rgba(255,255,255,.1)',color:'rgba(255,255,255,.65)'}}>
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ML Lab Module */}
        <div className="glass rounded-2xl overflow-hidden">
          <MLLab lang={lang} />
        </div>
      </main>

    </div>
  );
}
