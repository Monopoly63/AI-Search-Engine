import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const errorMessage =
    searchParams.get('msg') ||
    'Sorry, your authentication information is invalid or has expired';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="premium-root" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <section className="glass-card card-pad" style={{ width: 'min(100%, 460px)', textAlign: 'center' }}>
        <div style={{ display: 'inline-grid', placeItems: 'center', width: 58, height: 58, borderRadius: 22, border: '1px solid var(--border)', background: 'var(--danger-soft)', color: 'var(--danger)' }}>
          <AlertCircle aria-hidden="true" size={28} strokeWidth={1.7} />
        </div>
        <h1 className="section-title" style={{ marginTop: 18 }}>Authentication Error</h1>
        <p className="section-description" style={{ marginTop: 10 }}>{errorMessage}</p>
        <p className="metric-sub" style={{ marginTop: 16 }}>
          {countdown > 0 ? `Returning home in ${countdown} seconds` : 'Redirecting...'}
        </p>
        <button type="button" className="primary-button" onClick={handleReturnHome} style={{ marginTop: 18 }}>
          Return to Home
        </button>
      </section>
    </div>
  );
}
