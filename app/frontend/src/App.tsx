import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// MODULE_IMPORTS_START
// MODULE_IMPORTS_END

const Index = lazy(() => import('./pages/Index'));
const MLLabPage = lazy(() => import('./pages/MLLabPage'));
const TheoryPage = lazy(() => import('./pages/TheoryPage'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const AuthError = lazy(() => import('./pages/AuthError'));

const RouteFallback = () => (
  <div
    style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--bg)',
      color: 'var(--fg-muted)',
      fontFamily: 'var(--font-sans)',
    }}
  >
    <div style={{ display: 'grid', gap: 12, justifyItems: 'center' }}>
      <span className="np-spinner" aria-hidden="true" />
      <span style={{ fontSize: 12, letterSpacing: '.08em', textTransform: 'uppercase' }}>Loading workspace</span>
    </div>
  </div>
);

const AppRoutes = () => (
  <Suspense fallback={<RouteFallback />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/ml-lab" element={<MLLabPage />} />
      <Route path="/theory" element={<TheoryPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/error" element={<AuthError />} />
      {/* MODULE_ROUTES_START */}
      {/* MODULE_ROUTES_END */}
    </Routes>
  </Suspense>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
export { AppRoutes };
