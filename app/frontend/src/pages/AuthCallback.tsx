import { useEffect } from 'react';
import { client } from '../lib/api';

export default function AuthCallback() {
  useEffect(() => {
    client.auth.login();
  }, []);

  return (
    <div className="premium-root" style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <div className="glass-card card-pad" style={{ width: 'min(100%, 420px)', textAlign: 'center' }}>
        <span className="np-spinner" aria-hidden="true" />
        <h1 className="section-title" style={{ marginTop: 18 }}>Processing authentication</h1>
        <p className="section-description" style={{ marginTop: 8 }}>Please wait while we complete the sign-in flow.</p>
      </div>
    </div>
  );
}
