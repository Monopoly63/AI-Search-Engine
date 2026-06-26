import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  BrainCircuit,
  Code2,
  ExternalLink,
  FlaskConical,
  Gauge,
  Github,
  Grid3X3,
  Instagram,
  Languages,
  Menu,
  Moon,
  Network,
  PanelRightOpen,
  Play,
  RotateCcw,
  Route,
  Sparkles,
  Sun,
  TerminalSquare,
  X,
} from 'lucide-react';
import { ALGOS, AlgoKey, CellState, Graph, GraphTrace, Point, RunStatus, ROWS, COLS } from './np-types';
import { runAlgorithm, buildRandomGraph, traceGraphBFS, traceGraphDFS, traceGraphGreedy, traceGraphHill, traceGraphAStar } from './np-algos';
import { CONTENT } from './np-content';
import {
  SidebarLabel, MiniStatRow, Divider, Badge,
  FlowDiagram, CodeBlock, GhostButton, StatusPill, Numeric, StatRowCompact, LabelRow, Legend,
} from './np-ui';
import { GraphView } from './np-graph-view';
import {
  Lang, Theme, DICTS, getSavedLang, getSavedTheme,
  applyDocumentLang, applyDocumentTheme,
} from './np-i18n';

/* ============================================================
   AI SEARCH INTELLIGENCE — Search Studio
   Premium interface rebuild · business logic preserved
   ============================================================ */

const AUTHOR_NAME = 'Abdulmoin Hablas';
const AUTHOR_NAME_AR = 'عبدالمعين حبلص';
const INSTAGRAM_URL = 'https://www.instagram.com/li0vy_?igsh=MXZ2czd3ODA3ejJ6ZA==';
const PORTFOLIO_URL = 'https://portfolio-monopoly63s-projects.vercel.app/';
const GITHUB_URL = 'https://github.com/Monopoly63/AI-Search-Engine';

function makeEmptyGrid(): CellState[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({
      kind: 'empty' as const, visitOrder: -1, pathOrder: -1,
    })),
  );
}

function pointsEqual(a: Point, b: Point) { return a.r === b.r && a.c === b.c; }

function getInitialAlgo(param: string | null): AlgoKey {
  return ALGOS.some((a) => a.key === param) ? (param as AlgoKey) : 'BFS';
}

export default function Index() {
  /* ---------- i18n + Theme ---------- */
  const [searchParams, setSearchParams] = useSearchParams();
  const [lang, setLang] = useState<Lang>(() => getSavedLang());
  const [theme, setTheme] = useState<Theme>(() => getSavedTheme());
  const t = DICTS[lang];
  const isRTL = lang === 'ar';
  const isLight = theme === 'light';

  useEffect(() => { applyDocumentLang(lang); window.localStorage.setItem('np-lang', lang); }, [lang]);
  useEffect(() => { applyDocumentTheme(theme); window.localStorage.setItem('np-theme', theme); }, [theme]);

  const toggleLang = () => setLang((l) => (l === 'en' ? 'ar' : 'en'));
  const toggleTheme = () => setTheme((th) => (th === 'dark' ? 'light' : 'dark'));
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  /* ---------- Algorithm state ---------- */
  const [algo, setAlgo] = useState<AlgoKey>(() => getInitialAlgo(searchParams.get('algo')));
  const [fadeIn, setFadeIn] = useState<boolean>(true);

  const algoLabel = useMemo<Record<AlgoKey, string>>(() => ({
    BFS: t.algoBFS, DFS: t.algoDFS, GREEDY: t.algoGreedy, HILL: t.algoHill, ASTAR: t.algoASTAR,
  }), [t]);

  const handleAlgoChange = (next: AlgoKey) => {
    if (next === algo) return;
    setFadeIn(false);
    setSearchParams({ algo: next }, { replace: true });
    window.setTimeout(() => { setAlgo(next); setFadeIn(true); }, 180);
    setSidebarOpen(false);
  };

  /* ---------- Grid drawer state ---------- */
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [grid, setGrid] = useState<CellState[][]>(() => makeEmptyGrid());
  const [start] = useState<Point>({ r: 2, c: 2 });
  const [goal] = useState<Point>({ r: ROWS - 3, c: COLS - 3 });
  const [gridSpeed, setGridSpeed] = useState<number>(80);
  const [gridRun, setGridRun] = useState<{ running: boolean; stepIdx: number; pathIdx: number; snap: ReturnType<typeof runAlgorithm> | null; status: RunStatus }>({
    running: false, stepIdx: 0, pathIdx: 0, snap: null, status: 'IDLE',
  });

  const isDrawingRef = useRef<{ mode: 'wall' | 'erase' | null }>({ mode: null });

  useEffect(() => {
    const up = () => { isDrawingRef.current.mode = null; };
    window.addEventListener('mouseup', up);
    return () => window.removeEventListener('mouseup', up);
  }, []);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDrawerOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  const toggleWall = useCallback((r: number, c: number, mode: 'wall' | 'erase') => {
    setGrid((prev) => {
      if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) return prev;
      const next = prev.map((row) => row.slice());
      next[r][c] = { ...next[r][c], kind: mode === 'wall' ? 'wall' : 'empty', visitOrder: -1, pathOrder: -1 };
      return next;
    });
  }, [start, goal]);

  const handleCellDown = (r: number, c: number) => {
    if (gridRun.running) return;
    if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) return;
    const mode: 'wall' | 'erase' = grid[r][c].kind === 'wall' ? 'erase' : 'wall';
    isDrawingRef.current.mode = mode;
    toggleWall(r, c, mode);
  };
  const handleCellEnter = (r: number, c: number) => {
    if (gridRun.running) return;
    const mode = isDrawingRef.current.mode;
    if (!mode) return;
    if ((r === start.r && c === start.c) || (r === goal.r && c === goal.c)) return;
    toggleWall(r, c, mode);
  };

  const resetGrid = () => {
    setGridRun({ running: false, stepIdx: 0, pathIdx: 0, snap: null, status: 'IDLE' });
    setGrid((prev) => prev.map((row) => row.map((c) => ({ ...c, visitOrder: -1, pathOrder: -1 }))));
  };

  const randomizeGrid = () => {
    if (gridRun.running) return;
    const next = makeEmptyGrid();
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
      if (pointsEqual({ r, c }, start) || pointsEqual({ r, c }, goal)) continue;
      if (Math.random() < 0.25) next[r][c].kind = 'wall';
    }
    setGrid(next);
    resetGrid();
  };

  const playGrid = () => {
    const snap = runAlgorithm(algo, grid, start, goal);
    setGrid((prev) => {
      const next = prev.map((row) => row.map((c) => ({ ...c, visitOrder: -1, pathOrder: -1 })));
      snap.visitedOrder.forEach((p, i) => { if (next[p.r][p.c].kind !== 'wall') next[p.r][p.c].visitOrder = i; });
      snap.path.forEach((p, i) => { if (next[p.r][p.c].kind !== 'wall') next[p.r][p.c].pathOrder = i; });
      return next;
    });
    setGridRun({ running: true, stepIdx: 0, pathIdx: 0, snap, status: 'SEARCHING' });
  };

  const toggleGridPlayback = () => {
    if (gridRun.running) {
      setGridRun((r) => ({ ...r, running: false }));
      return;
    }
    if (gridRun.snap && gridRun.status === 'SEARCHING') {
      setGridRun((r) => ({ ...r, running: true }));
      return;
    }
    playGrid();
  };

  useEffect(() => {
    if (!gridRun.running || !gridRun.snap) return;
    const id = window.setInterval(() => {
      setGridRun((r) => {
        if (!r.snap) return r;
        if (r.stepIdx < r.snap.visitedOrder.length) return { ...r, stepIdx: r.stepIdx + 1 };
        if (!r.snap.found) return { ...r, running: false, status: 'NO_PATH' };
        if (r.pathIdx < r.snap.path.length) return { ...r, pathIdx: r.pathIdx + 1 };
        return { ...r, running: false, status: 'PATH_FOUND' };
      });
    }, Math.max(10, gridSpeed));
    return () => window.clearInterval(id);
  }, [gridRun.running, gridRun.snap, gridSpeed]);

  /* ---------- Graph state (per-algorithm) ---------- */
  const [graph, setGraph] = useState<Graph>(() => buildRandomGraph(algo));
  const [graphTrace, setGraphTrace] = useState<GraphTrace>(() => traceForAlgo(algo, graph));
  const [gStepIdx, setGStepIdx] = useState<number>(0);
  const [gPathIdx, setGPathIdx] = useState<number>(0);
  const [gRunning, setGRunning] = useState<boolean>(false);
  const [gSpeed, setGSpeed] = useState<number>(500);

  function traceForAlgo(a: AlgoKey, g: Graph): GraphTrace {
    if (a === 'BFS') return traceGraphBFS(g);
    if (a === 'DFS') return traceGraphDFS(g);
    if (a === 'GREEDY') return traceGraphGreedy(g);
    if (a === 'ASTAR') return traceGraphAStar(g);
    return traceGraphHill(g);
  }

  useEffect(() => {
    const g = buildRandomGraph(algo);
    const trace = traceForAlgo(algo, g);
    setGraph(g); setGraphTrace(trace);
    setGStepIdx(0); setGPathIdx(0);
    setGRunning(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algo]);

  useEffect(() => {
    if (!gRunning) return;
    const id = window.setInterval(() => {
      setGStepIdx((s) => (s < graphTrace.steps.length ? s + 1 : s));
      setGPathIdx((p) => {
        if (gStepIdx >= graphTrace.steps.length && graphTrace.found && p < graphTrace.finalPath.length) return p + 1;
        return p;
      });
    }, Math.max(80, gSpeed));
    return () => window.clearInterval(id);
  }, [gRunning, gSpeed, graphTrace, gStepIdx]);

  useEffect(() => {
    if (gStepIdx >= graphTrace.steps.length && (!graphTrace.found || gPathIdx >= graphTrace.finalPath.length)) {
      setGRunning(false);
    }
  }, [gStepIdx, gPathIdx, graphTrace]);

  const handleGraphPlay = () => {
    if (gStepIdx >= graphTrace.steps.length && (!graphTrace.found || gPathIdx >= graphTrace.finalPath.length)) {
      setGStepIdx(0); setGPathIdx(0);
    }
    setGRunning(true);
  };
  const handleGraphPause = () => setGRunning(false);
  const handleGraphReset = () => { setGRunning(false); setGStepIdx(0); setGPathIdx(0); };
  const handleNewGraph = () => {
    const g = buildRandomGraph(algo);
    const trace = traceForAlgo(algo, g);
    setGraph(g); setGraphTrace(trace);
    setGStepIdx(0); setGPathIdx(0);
    setGRunning(true);
  };

  /* ---------- Copy code ---------- */
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTENT[algo].python);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch { /* ignore */ }
  };

  /* ---------- Grid cell size ---------- */
  const cellSize = 'clamp(18px, 4.8vw, 26px)';

  /* ---------- Mini sidebar stats ---------- */
  const sidebarStats = useMemo(() => {
    const explored = Math.min(gStepIdx, graphTrace.steps.length);
    const pathLen = graphTrace.found ? Math.min(gPathIdx, graphTrace.finalPath.length) : 0;
    return { explored, pathLen, total: graphTrace.steps.length };
  }, [gStepIdx, gPathIdx, graphTrace]);

  /* ---------- Localized descriptions & props ---------- */
  const localizedContent = useMemo(() => {
    const baseRaw = CONTENT[algo];
    const base = { ...baseRaw.properties };
    const descKey: Record<AlgoKey, string[]> = {
      BFS: [t.bfsDesc1, t.bfsDesc2, t.bfsDesc3],
      DFS: [t.dfsDesc1, t.dfsDesc2, t.dfsDesc3],
      GREEDY: [t.greDesc1, t.greDesc2, t.greDesc3],
      HILL: [t.hilDesc1, t.hilDesc2, t.hilDesc3],
      ASTAR: [t.astarDesc1, t.astarDesc2, t.astarDesc3],
    };
    const localizeValue = (v: 'YES' | 'NO' | 'CONDITIONAL') => {
      if (lang === 'ar') {
        if (v === 'YES') return 'نعم';
        if (v === 'NO') return 'لا';
        return 'مشروط';
      }
      return v === 'CONDITIONAL' ? 'COND.' : v;
    };
    return {
      description: descKey[algo],
      properties: {
        complete: localizeValue(base.complete),
        optimal: localizeValue(base.optimal),
        time: base.time,
        space: base.space,
      },
      flow: baseRaw.flow,
      python: baseRaw.python,
    };
  }, [algo, lang, t]);

  const content = localizedContent;

  const pillLabels: Record<RunStatus, string> = {
    IDLE: t.pillIdle, SEARCHING: t.pillSearching, PATH_FOUND: t.pillPathFound, NO_PATH: t.pillNoPath,
  };

  const legendItems = [
    { color: 'var(--accent-soft)', label: t.legStart, border: 'var(--accent)' },
    { color: 'transparent', label: t.legGoal, border: 'var(--accent)' },
    { color: 'var(--wall)', label: t.legWall, border: 'var(--border)' },
    { color: 'var(--visited)', label: t.legExplored, border: 'var(--visited-border)' },
    { color: 'var(--path)', label: t.legPath, border: 'var(--path)' },
  ];

  const statusText =
    gRunning ? t.statusRunning :
    (gStepIdx >= graphTrace.steps.length && graphTrace.found && gPathIdx >= graphTrace.finalPath.length) ? t.statusDone :
    gStepIdx === 0 ? t.statusIdle : t.statusPaused;

  const displayedAuthor = lang === 'ar' ? AUTHOR_NAME_AR : AUTHOR_NAME;
  const currentAlgoMeta = ALGOS.find((a) => a.key === algo)!;
  const currentPathLen = graphTrace.found ? graphTrace.finalPath.length : 0;
  const gridExplored = gridRun.snap ? Math.min(gridRun.stepIdx, gridRun.snap.visitedOrder.length) : 0;

  return (
    <div className="premium-root" dir={isRTL ? 'rtl' : 'ltr'}>
      <header className="mobile-commandbar">
        <Link to="/" className="brand-lockup" style={{ textDecoration: 'none' }}>
          <span className="brand-mark"><BrainCircuit aria-hidden="true" /></span>
          <span>
            <span className="brand-title">{t.brand}</span>
            <span className="brand-kicker">{t.tagline}</span>
          </span>
        </Link>
        <div className="control-cluster">
          <button className="icon-button" type="button" onClick={toggleTheme} aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}>
            {isLight ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <button className="icon-button" type="button" onClick={toggleLang} aria-label={isRTL ? 'تبديل اللغة' : 'Toggle language'}>
            <Languages aria-hidden="true" />
          </button>
          <button className="icon-button" type="button" onClick={() => setSidebarOpen((o) => !o)} aria-label={isRTL ? 'فتح القائمة' : 'Open navigation'}>
            {sidebarOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </header>

      <div className="premium-shell">
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', transition: 'all 280ms' }}
          />
        )}
        <aside className={`command-rail glass-card${sidebarOpen ? ' is-open' : ''}`} aria-label={isRTL ? 'مساحة التحكم' : 'Command rail'}>
          <div style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 8, width: '100%' }} className="mobile-drawer-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span className="brand-mark" style={{ width: 30, height: 30 }}><BrainCircuit size={16} /></span>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg-strong)', letterSpacing: 0.5 }}>{t.brand}</span>
            </div>
            <button type="button" onClick={() => setSidebarOpen(false)} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-strong)', borderRadius: 8, padding: '6px 8px', color: 'var(--fg-strong)', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          </div>
          <div className="brand-lockup desktop-only">
            <span className="brand-mark"><BrainCircuit aria-hidden="true" /></span>
            <span style={{ minWidth: 0 }}>
              <span className="brand-title">{t.brand}</span>
              <span className="brand-kicker">{t.tagline}</span>
            </span>
          </div>

          <div className="rail-scroll np-scroll">
            <div className="rail-section">
              <SidebarLabel text={isRTL ? 'الملاحة' : 'Navigation'} />
              <nav className="rail-nav">
                <Link to="/" onClick={() => setSidebarOpen(false)} className="rail-nav-link is-active">
                  <span className="nav-icon"><Network aria-hidden="true" /></span>
                  <span className="algo-copy"><span className="algo-name">{isRTL ? 'استوديو البحث' : 'Search Studio'}</span><span className="algo-meta">AI pathfinding runtime</span></span>
                </Link>
                <Link to="/ml-lab" onClick={() => setSidebarOpen(false)} className="rail-nav-link">
                  <span className="nav-icon"><FlaskConical aria-hidden="true" /></span>
                  <span className="algo-copy"><span className="algo-name">{isRTL ? 'مختبر ML' : 'ML Lab'}</span><span className="algo-meta">Real dataset analysis</span></span>
                </Link>
                <Link to="/theory" onClick={() => setSidebarOpen(false)} className="rail-nav-link">
                  <span className="nav-icon"><BookOpen aria-hidden="true" /></span>
                  <span className="algo-copy"><span className="algo-name">{isRTL ? 'المحاضرات' : 'Theory'}</span><span className="algo-meta">Lectures and code</span></span>
                </Link>
              </nav>
            </div>

            <div style={{ height: 18 }} />
            <div className="rail-section">
              <SidebarLabel text={t.algorithms} />
              <div className="rail-nav" role="listbox" aria-label={t.algorithms}>
                {ALGOS.map((a, index) => {
                  const active = a.key === algo;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      onClick={() => handleAlgoChange(a.key)}
                      className={`algorithm-button${active ? ' is-active' : ''}`}
                      aria-pressed={active}
                    >
                      <span className="algo-index">{String(index + 1).padStart(2, '0')}</span>
                      <span className="algo-copy">
                        <span className="algo-name">{algoLabel[a.key]}</span>
                        <span className="algo-meta">{a.short}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ height: 18 }} />
            <div className="rail-section">
              <SidebarLabel text={t.liveStats} />
              <div className="telemetry-list">
                <MiniStatRow label={t.statAlgorithm} value={algo} highlight />
                <MiniStatRow label={t.statExplored} value={`${sidebarStats.explored}/${sidebarStats.total}`} />
                <MiniStatRow label={t.statPath} value={String(sidebarStats.pathLen)} />
                <MiniStatRow label={t.statStatus} value={statusText} />
              </div>
            </div>

            <div style={{ height: 18 }} />
            <div className="author-card">
              <div className="author-row">
                <span className="avatar-orb">{lang === 'ar' ? 'عح' : 'AH'}</span>
                <span style={{ minWidth: 0 }}>
                  <span className="author-name">{displayedAuthor}</span>
                  <span className="author-role">{t.role}</span>
                </span>
              </div>
              <div className="social-grid">
                <SocialLink href={PORTFOLIO_URL} label={t.portfolio}><ExternalLink aria-hidden="true" /></SocialLink>
                <SocialLink href={INSTAGRAM_URL} label={t.instagram}><Instagram aria-hidden="true" /></SocialLink>
                <SocialLink href={GITHUB_URL} label={t.github}><Github aria-hidden="true" /></SocialLink>
              </div>
            </div>
          </div>

          <div className="control-cluster desktop-only" style={{ justifyContent: 'space-between' }}>
            <button className="icon-button" type="button" onClick={toggleTheme} aria-label={isRTL ? 'تبديل المظهر' : 'Toggle theme'}>
              {isLight ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            </button>
            <button className="icon-button" type="button" onClick={toggleLang} aria-label={isRTL ? 'تبديل اللغة' : 'Toggle language'}>
              <Languages aria-hidden="true" />
            </button>
            <button className="primary-button" type="button" onClick={() => setDrawerOpen(true)} style={{ flex: 1 }}>
              <Grid3X3 size={16} aria-hidden="true" /> {t.openGrid.replace('▶ ', '')}
            </button>
          </div>
        </aside>

        <main className="premium-main">
          <section className="glass-card workspace-hero np-fade-in">
            <div>
              <span className="eyebrow"><span>{t.interactiveLearning.replace('// ', '')}</span></span>
              <h1 className="hero-title">{algoLabel[algo]}</h1>
              <p className="hero-description">{content.description[0]}</p>
              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={handleGraphPlay}>
                  <Play size={16} aria-hidden="true" /> {t.btnRun.replace('▶ ', '')}
                </button>
                <button className="ghost-button" type="button" onClick={handleNewGraph}>
                  <RotateCcw size={16} aria-hidden="true" /> {t.btnNewGraph.replace('⟳ ', '')}
                </button>
                <button className="ghost-button" type="button" onClick={() => setDrawerOpen(true)}>
                  <PanelRightOpen size={16} aria-hidden="true" /> {t.openGrid.replace('▶ ', '')}
                </button>
              </div>
            </div>
            <div className="hero-status-card">
              <div className="status-orbit">
                <div className="status-orbit-value">
                  <strong>{sidebarStats.explored}</strong>
                  <span>{t.statExplored}</span>
                </div>
              </div>
              <div className="telemetry-list" style={{ marginTop: 16 }}>
                <MiniStatRow label="Runtime" value={t.runtimeOnline} highlight />
                <MiniStatRow label="Frontier" value={graphTrace.frontierLabel} />
                <MiniStatRow label="Heuristic" value={algo === 'BFS' || algo === 'DFS' ? 'Uninformed' : 'Manhattan'} />
              </div>
            </div>
          </section>

          <section className="metric-grid" aria-label={isRTL ? 'مؤشرات الخوارزمية' : 'Algorithm metrics'}>
            <MetricCard icon={<Gauge aria-hidden="true" />} label={t.propTime} value={content.properties.time} sub={currentAlgoMeta.short} />
            <MetricCard icon={<Route aria-hidden="true" />} label={t.propSpace} value={content.properties.space} sub={t.propSpace} />
            <MetricCard icon={<Sparkles aria-hidden="true" />} label={t.propOptimal} value={content.properties.optimal} sub={t.propOptimal} />
            <MetricCard icon={<Network aria-hidden="true" />} label={t.statPath} value={String(currentPathLen)} sub={t.sectionGraph} />
          </section>

          <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 200ms ease' }}>
            <div className="bento-grid">
              <div className="bento-stack">
                <section className="glass-card card-pad">
                  <div className="section-heading">
                    <div className="section-title-group">
                      <div className="section-kicker">01 · {t.sectionExplanation}</div>
                      <h2 className="section-title">{isRTL ? 'منطق البحث وسلوك الخوارزمية' : 'Search logic and algorithm behavior'}</h2>
                    </div>
                    <TerminalSquare aria-hidden="true" color="var(--fg-dim)" />
                  </div>
                  <div className="rich-copy">
                    {content.description.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                  <div className="badge-grid">
                    <Badge label={t.propComplete} value={content.properties.complete} />
                    <Badge label={t.propOptimal} value={content.properties.optimal} />
                    <Badge label={t.propTime} value={content.properties.time} mono />
                    <Badge label={t.propSpace} value={content.properties.space} mono />
                  </div>
                </section>

                <section className="glass-card card-pad">
                  <div className="section-heading">
                    <div className="section-title-group">
                      <div className="section-kicker">03 · {t.sectionGraph}</div>
                      <h2 className="section-title">{isRTL ? 'محطة تتبع الرسم البياني' : 'Graph traversal workstation'}</h2>
                    </div>
                  </div>
                  <GraphView
                    graph={graph}
                    trace={graphTrace}
                    gStepIdx={gStepIdx}
                    gPathIdx={gPathIdx}
                    running={gRunning}
                    speed={gSpeed}
                    onPlay={handleGraphPlay}
                    onPause={handleGraphPause}
                    onReset={handleGraphReset}
                    onNewGraph={handleNewGraph}
                    onSpeedChange={setGSpeed}
                    t={t}
                  />
                </section>

                <section className="code-shell glass-card glass-card--flat">
                  <div className="code-toolbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className="window-dots"><span /><span /><span /></span>
                      <span className="code-name">{algo.toLowerCase()}.py</span>
                    </div>
                    <button onClick={handleCopy} type="button" className={`copy-button${copied ? ' is-success' : ''}`}>
                      {copied ? t.copied : t.copy}
                    </button>
                  </div>
                  <CodeBlock code={content.python} />
                </section>
              </div>

              <aside className="bento-stack">
                <section className="glass-card card-pad">
                  <div className="section-heading">
                    <div className="section-title-group">
                      <div className="section-kicker">02 · {t.controlFlow}</div>
                      <h2 className="section-title">{isRTL ? 'مسار القرار' : 'Decision path'}</h2>
                    </div>
                  </div>
                  <FlowDiagram steps={content.flow} />
                </section>

                <section className="glass-card card-pad">
                  <SidebarLabel text={t.telemetry} />
                  <div className="telemetry-list">
                    <StatRowCompact label={t.tStatus} value={<StatusPill status={gridRun.status} labels={pillLabels} />} />
                    <StatRowCompact label={t.tExplored} value={<Numeric n={gridExplored} />} />
                    <StatRowCompact label={t.tPath} value={<Numeric n={gridRun.snap && gridRun.snap.found ? Math.min(gridRun.pathIdx, gridRun.snap.path.length) : 0} />} />
                    <StatRowCompact label={t.speed} value={<span className="numeric-value">{gridSpeed}ms</span>} />
                  </div>
                  <Divider />
                  <p className="section-description">{t.gridHint}</p>
                  <button className="primary-button" type="button" onClick={() => setDrawerOpen(true)} style={{ width: '100%', marginTop: 16 }}>
                    <Grid3X3 size={16} aria-hidden="true" /> {t.openGrid.replace('▶ ', '')}
                  </button>
                </section>

                <section className="glass-card card-pad">
                  <SidebarLabel text={isRTL ? 'إشارات النظام' : 'System signals'} />
                  <div className="telemetry-list">
                    <MiniStatRow label="Σ" value="BFS · DFS · GBFS · A*" />
                    <MiniStatRow label="h(n)" value="Manhattan" />
                    <MiniStatRow label="Grid" value={`${ROWS}×${COLS}`} />
                    <MiniStatRow label="Mode" value="Deterministic trace" />
                  </div>
                </section>
              </aside>
            </div>
          </div>

          <footer className="footer-strip">
            <span>{t.footerLeft}</span>
            <span>© {new Date().getFullYear()} <strong style={{ color: 'var(--fg)' }}>{displayedAuthor}</strong></span>
            <span>{t.footerRight}</span>
          </footer>
        </main>
      </div>

      {/* Grid visualizer drawer */}
      <div onClick={() => setDrawerOpen(false)} className={`drawer-backdrop${drawerOpen ? ' is-open' : ' is-closed'}`} />
      <section className={`grid-drawer${drawerOpen ? ' is-open' : ''}`} aria-hidden={!drawerOpen} aria-label={t.drawerTitle}>
        <div className="drawer-header">
          <div>
            <div className="section-kicker">{t.drawerTitle.replace('// ', '')}</div>
            <h2 className="section-title" style={{ marginTop: 4, fontSize: 20 }}>{algoLabel[algo]} · {ROWS} × {COLS}</h2>
          </div>
          <button className="icon-button" type="button" onClick={() => setDrawerOpen(false)} aria-label={isRTL ? 'إغلاق' : 'Close'}>
            <X aria-hidden="true" />
          </button>
        </div>

        <div className="drawer-body np-scroll">
          <div className="grid-stage">
            <div className="grid-board" style={{ gridTemplateColumns: `repeat(${COLS}, ${cellSize})`, gridTemplateRows: `repeat(${ROWS}, ${cellSize})` }}>
              {grid.map((row, r) => row.map((cell, c) => {
                const isStart = r === start.r && c === start.c;
                const isGoal = r === goal.r && c === goal.c;
                const isWall = cell.kind === 'wall';
                const isVisited = cell.visitOrder >= 0 && cell.visitOrder < gridRun.stepIdx;
                const isPath = cell.pathOrder >= 0 && cell.pathOrder < gridRun.pathIdx;

                let bg = 'rgba(255,255,255,0.035)';
                let border = '1px solid var(--border)';
                let shadow = 'none';
                let animation: string | undefined;
                let cellContent: ReactNode = null;

                if (isWall) { bg = 'var(--wall)'; border = '1px solid var(--border)'; }
                else if (isPath) { bg = 'var(--path)'; border = '1px solid var(--path)'; animation = 'np-path-pulse 1.4s ease-in-out infinite'; }
                else if (isVisited) {
                  bg = 'var(--visited)'; border = '1px solid var(--visited-border)';
                  shadow = '0 0 18px var(--accent-glow)';
                  animation = 'np-ripple 260ms ease-out both';
                }
                if (isStart) {
                  bg = 'var(--accent-soft)'; border = '1px solid var(--accent)'; animation = 'np-start-pulse 1.6s ease-in-out infinite';
                  cellContent = <span style={{ color: 'var(--fg-strong)', fontSize: 10, fontWeight: 900 }}>S</span>;
                } else if (isGoal) {
                  bg = 'transparent'; border = '1px solid var(--accent)'; shadow = '0 0 18px var(--accent-glow)';
                  cellContent = <span style={{ width: 9, height: 9, background: 'var(--accent)', transform: 'rotate(45deg)', display: 'inline-block', borderRadius: 2 }} />;
                }

                const delay = isVisited && cell.visitOrder >= 0 ? Math.min(cell.visitOrder * 6, 300)
                  : isPath && cell.pathOrder >= 0 ? Math.min(cell.pathOrder * 30, 900) : 0;

                return (
                  <div
                    key={`${r}-${c}`}
                    className="grid-cell"
                    onMouseDown={() => handleCellDown(r, c)}
                    onMouseEnter={() => handleCellEnter(r, c)}
                    role="button"
                    aria-label={`${r}, ${c}`}
                    tabIndex={gridRun.running || isStart || isGoal ? -1 : 0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCellDown(r, c); }}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      background: bg,
                      border,
                      boxShadow: shadow,
                      animation,
                      animationDelay: `${delay}ms`,
                      cursor: isStart || isGoal ? 'default' : 'crosshair',
                      color: isPath ? 'var(--accent-fg)' : 'var(--fg-strong)',
                    }}
                  >{cellContent}</div>
                );
              }))}
            </div>
          </div>

          <Legend title={t.legend} items={legendItems} />

          <div className="glass-card drawer-section">
            <SidebarLabel text={t.controls} />
            <div className="drawer-controls">
              <GhostButton label={gridRun.running ? t.btnPause : t.btnPlay} solid={!gridRun.running} onClick={toggleGridPlayback} />
              <GhostButton label={t.btnReset} onClick={resetGrid} />
              <GhostButton label={t.btnRandom} onClick={randomizeGrid} />
              <GhostButton label={t.btnClear} onClick={() => { setGrid(makeEmptyGrid()); resetGrid(); }} />
            </div>
            <div style={{ marginTop: 16 }}>
              <LabelRow label={t.speed} value={`${gridSpeed}ms`} />
              <input className="np-range" type="range" min={10} max={300} step={5} value={gridSpeed} onChange={(e) => setGridSpeed(Number(e.target.value))} />
            </div>
          </div>

          <div className="glass-card drawer-section">
            <SidebarLabel text={t.telemetry} />
            <div className="telemetry-list">
              <StatRowCompact label={t.tStatus} value={<StatusPill status={gridRun.status} labels={pillLabels} />} />
              <StatRowCompact label={t.tExplored} value={<Numeric n={gridRun.snap ? Math.min(gridRun.stepIdx, gridRun.snap.visitedOrder.length) : 0} />} />
              <StatRowCompact label={t.tPath} value={<Numeric n={gridRun.snap && gridRun.snap.found ? Math.min(gridRun.pathIdx, gridRun.snap.path.length) : 0} />} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ icon, label, value, sub }: { icon: ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="metric-card glass-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
        <span className="metric-label">{label}</span>
        <span style={{ color: 'var(--fg-dim)', display: 'inline-flex' }}>{icon}</span>
      </div>
      <div>
        <div className="metric-value">{value}</div>
        {sub && <div className="metric-sub">{sub}</div>}
      </div>
    </div>
  );
}

function SocialLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="social-link" aria-label={label} title={label}>
      {children}
      <span>{label}</span>
    </a>
  );
}
