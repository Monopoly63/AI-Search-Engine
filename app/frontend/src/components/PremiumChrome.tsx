import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpenText, BrainCircuit, FlaskConical, Languages, Moon, Network, SunMedium } from 'lucide-react';
import { Lang } from '@/pages/np-i18n';

type ActiveKey = 'search' | 'lab' | 'theory';

type PremiumTopNavProps = {
  lang: Lang;
  isLight: boolean;
  active: ActiveKey;
  title: string;
  subtitle: string;
  onToggleTheme: () => void;
  onToggleLang: () => void;
  children?: ReactNode;
};

const navItems = (isRTL: boolean) => [
  { key: 'search' as const, to: '/', label: isRTL ? 'البحث' : 'Search Studio', icon: Network },
  { key: 'lab' as const, to: '/ml-lab', label: isRTL ? 'المختبر' : 'ML Lab', icon: FlaskConical },
  { key: 'theory' as const, to: '/theory', label: isRTL ? 'المحاضرات' : 'Theory', icon: BookOpenText },
];

export function PremiumTopNav({
  lang,
  isLight,
  active,
  title,
  subtitle,
  onToggleTheme,
  onToggleLang,
  children,
}: PremiumTopNavProps) {
  const isRTL = lang === 'ar';
  const location = useLocation();

  return (
    <header className="premium-topbar" aria-label={isRTL ? 'التنقل الرئيسي' : 'Primary navigation'}>
      <Link to="/" className="topbar-brand" aria-label="AI Search Intelligence home">
        <span className="brand-mark"><BrainCircuit aria-hidden="true" /></span>
        <span style={{ minWidth: 0 }}>
          <span className="brand-title">{title}</span>
          <span className="brand-kicker">{subtitle}</span>
        </span>
      </Link>

      <nav className="topbar-nav" aria-label={isRTL ? 'الأقسام' : 'Sections'}>
        {navItems(isRTL).map((item) => {
          const Icon = item.icon;
          const selected = active === item.key || location.pathname === item.to;
          return (
            <Link key={item.key} to={item.to} className={`topbar-link${selected ? ' is-active' : ''}`}>
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="topbar-actions">
        {children}
        <button className="icon-button" type="button" onClick={onToggleTheme} aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}>
          {isLight ? <SunMedium aria-hidden="true" /> : <Moon aria-hidden="true" />}
        </button>
        <button className="icon-button" type="button" onClick={onToggleLang} aria-label={isRTL ? 'تبديل اللغة' : 'Toggle language'}>
          <Languages aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
