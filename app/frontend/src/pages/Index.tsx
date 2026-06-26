import { Link } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALGOS, AlgoKey, CellState, Graph, GraphTrace, Point, RunStatus, ROWS, COLS } from './np-types';
import { runAlgorithm, buildRandomGraph, traceGraphBFS, traceGraphDFS, traceGraphGreedy, traceGraphHill, traceGraphAStar } from './np-algos';
import { CONTENT } from './np-content';
import {
  SidebarLabel, MiniStatRow, SectionBar, Divider, Badge,
  FlowDiagram, CodeBlock, GhostButton, StatusPill, Numeric, StatRowCompact, LabelRow, Legend,
} from './np-ui';
import { GraphView } from './np-graph-view';
import {
  Lang, Theme, DICTS, getSavedLang, getSavedTheme,
  applyDocumentLang, applyDocumentTheme,
} from './np-i18n';

/* ============================================================
   NEURAL PATHFINDER // AI SEARCH ENGINE v1.0
   By Abdulmoin Hablas
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

/* ============================================================ */

export default function Index() {
  /* ---------- i18n + Theme ---------- */
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

  /* ---------- Algorithm state ---------- */
  const [algo, setAlgo] = useState<AlgoKey>('BFS');
  const [fadeIn, setFadeIn] = useState<boolean>(true);

  const algoLabel = useMemo<Record<AlgoKey, string>>(() => ({
    BFS: t.algoBFS, DFS: t.algoDFS, GREEDY: t.algoGreedy, HILL: t.algoHill, ASTAR: t.algoASTAR,
  }), [t]);

  const handleAlgoChange = (next: AlgoKey) => {
    if (next === algo) return;
    setFadeIn(false);
    window.setTimeout(() => { setAlgo(next); setFadeIn(true); }, 180);
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
  const cellSize = 26;

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
    // Build bilingual descriptions
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

  /* ============================================================ */

  return (
    <div className="np-dot-grid" dir={isRTL ? 'rtl' : 'ltr'} style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)' }}>
      <div className="np-shell" style={{ display: 'grid', gridTemplateColumns: '280px 1fr', minHeight: '100vh' }}>

      {/* Mobile nav toggle */}
      <div className="np-mobile-header" style={{
        display: 'none',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '10px 16px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        alignItems: 'center', justifyContent: 'space-between',
      }}
        // show on mobile via CSS class
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 26, height: 26, border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
            <div style={{ width: 9, height: 9, background: 'var(--accent)', transform: 'rotate(45deg)' }} />
          </div>
          <span className="np-sans" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: 'var(--fg-strong)', textTransform: 'uppercase' }}>{t.brand}</span>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={toggleTheme} className="np-sans" style={{ padding: '6px 10px', border: '1px solid var(--border-strong)', background: 'var(--bg-panel)', color: 'var(--fg)', fontSize: 10, cursor: 'pointer', borderRadius: 3 }}>
            {isLight ? '☀' : '☾'}
          </button>
          <button onClick={toggleLang} className="np-sans" style={{ padding: '6px 10px', border: '1px solid var(--border-strong)', background: 'var(--bg-panel)', color: 'var(--fg)', fontSize: 10, cursor: 'pointer', borderRadius: 3 }}>
            {lang === 'en' ? 'ع' : 'EN'}
          </button>
          <button onClick={() => setSidebarOpen(o => !o)} className="np-sans" style={{ padding: '6px 10px', border: '1px solid var(--border-strong)', background: sidebarOpen ? 'var(--accent-soft)' : 'var(--bg-panel)', color: 'var(--fg)', fontSize: 12, cursor: 'pointer', borderRadius: 3 }}>
            {sidebarOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
        {/* ========== SIDEBAR ========== */}
        <aside className={`np-sidebar np-scroll${sidebarOpen ? " np-sidebar--open" : ""}`} style={{
          borderInlineEnd: '1px solid var(--border)',
          background: 'var(--bg-panel)',
          padding: '22px 20px',
          position: 'sticky', top: 0, alignSelf: 'start', height: '100vh', overflowY: 'auto',
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ width: 34, height: 34, border: '1.5px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)', borderRadius: 4 }}>
              <div style={{ width: 12, height: 12, background: 'var(--accent)', transform: 'rotate(45deg)' }} />
            </div>
            <div>
              <div className="np-sans" style={{ fontSize: 12, letterSpacing: 1.5, color: 'var(--fg-strong)', fontWeight: 700 }}>{t.brand}</div>
              <div className="np-mono" style={{ fontSize: 8.5, letterSpacing: 1.5, color: 'var(--fg-faint)', textTransform: 'uppercase', marginTop: 2 }}>{t.tagline}</div>
            </div>
          </div>

          {/* Author card */}
          <div className="np-glass np-sidebar-author" style={{ padding: 12, borderRadius: 4, marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-soft) 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-fg)', fontWeight: 800, fontSize: 14,
                boxShadow: 'var(--shadow-glow)',
                fontFamily: 'Inter, sans-serif',
                flexShrink: 0,
              }}>{lang === 'ar' ? 'ع.ح' : 'AH'}</div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="np-sans" style={{ fontSize: 12, color: 'var(--fg-strong)', fontWeight: 700, letterSpacing: 0.3, lineHeight: 1.2 }}>{displayedAuthor}</div>
                <div className="np-sans" style={{ fontSize: 9.5, color: 'var(--fg-dim)', letterSpacing: 0.5, marginTop: 2 }}>{t.role}</div>
              </div>
            </div>
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 5 }}>
              <SocialLink href={PORTFOLIO_URL} label={t.portfolio} icon="◈" />
              <SocialLink href={INSTAGRAM_URL} label={t.instagram} icon="◉" />
              <SocialLink href={GITHUB_URL} label={t.github} icon="⟠" />
            </div>
          </div>


          {/* ML Lab nav */}
          <div className="np-sidebar-nav-links" style={{ marginBottom: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Link
              to="/ml-lab"
              className="np-sans"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 4,
                background: 'var(--bg-panel)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)',
                fontSize: 10.5, letterSpacing: 1, fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer',
                transition: 'border-color .15s',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>⚗</span>
              <span>{lang === 'ar' ? 'مختبر ML' : 'ML Lab'}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, opacity: .5 }}>⟶</span>
            </Link>
            <Link
              to="/theory"
              className="np-sans"
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 4,
                background: 'var(--bg-panel)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)',
                fontSize: 10.5, letterSpacing: 1, fontWeight: 600,
                textDecoration: 'none', cursor: 'pointer',
              }}
            >
              <span style={{ color: 'var(--accent)' }}>📖</span>
              <span>{lang === 'ar' ? 'المحاضرات' : 'Theory'}</span>
              <span style={{ marginLeft: 'auto', fontSize: 9, opacity: .5 }}>⟶</span>
            </Link>
          </div>

          {/* Theme + Lang toggles */}
          <div className='np-sidebar-toggles' style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 20 }}>
            <button
              onClick={toggleTheme}
              className="np-sans"
              style={{
                padding: '8px 10px', background: 'var(--bg-panel)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)',
                fontSize: 10.5, letterSpacing: 1, fontWeight: 600,
                cursor: 'pointer', borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <span>{isLight ? '☀' : '☾'}</span>
              <span>{isLight ? t.light : t.dark}</span>
            </button>
            <button
              onClick={toggleLang}
              className="np-sans"
              style={{
                padding: '8px 10px', background: 'var(--bg-panel)', color: 'var(--fg)',
                border: '1px solid var(--border-strong)',
                fontSize: 10.5, letterSpacing: 1, fontWeight: 600,
                cursor: 'pointer', borderRadius: 3,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
            >
              <span>⟳</span>
              <span>{t.langToggle}</span>
            </button>
          </div>

          {/* Nav */}
          <SidebarLabel text={t.algorithms} />
          <div className="np-sidebar-algo-grid" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 5 }}>
            {ALGOS.map((a) => {
              const active = a.key === algo;
              return (
                <button
                  key={a.key}
                  onClick={() => handleAlgoChange(a.key)}
                  className="np-sans"
                  style={{
                    textAlign: 'start', padding: '10px 12px',
                    background: active ? 'var(--accent-soft)' : 'transparent',
                    border: '1px solid ' + (active ? 'var(--border-accent)' : 'var(--border)'),
                    borderInlineStart: active ? '2.5px solid var(--accent)' : '1px solid var(--border)',
                    color: active ? 'var(--fg-strong)' : 'var(--fg-muted)',
                    fontSize: 11.5, letterSpacing: 0.5, fontWeight: active ? 700 : 500,
                    cursor: 'pointer', borderRadius: 3,
                    boxShadow: active ? 'var(--shadow-glow)' : 'none',
                    transition: 'all 180ms',
                  }}
                >
                  {algoLabel[a.key]}
                </button>
              );
            })}
          </div>

          <div style={{ height: 20 }} />
          <div className='np-sidebar-stats'><SidebarLabel text={t.liveStats} />
          <div style={{ marginTop: 8 }}>
            <MiniStatRow label={t.statAlgorithm} value={algo} highlight />
            <MiniStatRow label={t.statExplored} value={`${sidebarStats.explored}/${sidebarStats.total}`} />
            <MiniStatRow label={t.statPath} value={String(sidebarStats.pathLen)} />
            <MiniStatRow label={t.statStatus} value={statusText} />
          </div>
          </div>

          <div style={{ height: 20 }} />
          <SidebarLabel text={t.gridVisualizer} />
          <button
            onClick={() => setDrawerOpen(true)}
            className="np-sans"
            style={{
              marginTop: 10, width: '100%', padding: '11px 12px',
              background: 'var(--accent)', color: 'var(--accent-fg)', border: '1px solid var(--accent)',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              cursor: 'pointer', borderRadius: 3, fontWeight: 700,
              boxShadow: 'var(--shadow-glow)', transition: 'all 160ms',
            }}
          >
            {t.openGrid}
          </button>
          <div className="np-sans" style={{ marginTop: 8, fontSize: 10, color: 'var(--fg-dim)', letterSpacing: 0.3, lineHeight: 1.5 }}>
            {t.gridHint}
          </div>

          <div style={{ height: 24 }} />
          <div className="np-mono" style={{ fontSize: 9, letterSpacing: 1.5, color: 'var(--fg-faint)', textTransform: 'uppercase' }}>
            <div>Σ BFS · DFS · Greedy · Hill</div>
            <div style={{ marginTop: 4 }}>H(n) = Manhattan</div>
          </div>
        </aside>

        {/* ========== MAIN ========== */}
        <main style={{ padding: '28px 40px 64px', maxWidth: 1160, width: '100%' }}>
          {/* Top strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
            <div>
              <div className="np-mono" style={{ fontSize: 10, letterSpacing: 2.5, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 500 }}>{t.interactiveLearning}</div>
              <h1 className="np-sans" style={{ margin: '8px 0 0', fontSize: 26, letterSpacing: 0.5, color: 'var(--fg-strong)', fontWeight: 800, lineHeight: 1.1 }}>
                {algoLabel[algo]}
              </h1>
              <div className="np-sans" style={{ marginTop: 6, fontSize: 11, color: 'var(--fg-dim)', letterSpacing: 0.3 }}>
                {lang === 'ar' ? 'بواسطة' : 'by'} <a href={PORTFOLIO_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--fg)', textDecoration: 'none', fontWeight: 700, borderBottom: '1px dashed var(--border-strong)' }}>{displayedAuthor}</a>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 8, height: 8, background: 'var(--accent)', borderRadius: '50%', boxShadow: '0 0 8px var(--accent-glow)' }} />
              <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--fg-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{t.runtimeOnline}</span>
            </div>
          </div>

          <div style={{ opacity: fadeIn ? 1 : 0, transition: 'opacity 200ms ease' }}>
            {/* ===== Section 1: Explanation ===== */}
            <SectionBar index="01" title={t.sectionExplanation} />
            <div className="np-glass" style={{ padding: 24, marginTop: 14, borderRadius: 4 }}>
              <div className="np-explain-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 230px', gap: 28 }}>
                <div>
                  {content.description.map((p, i) => (
                    <p key={i} className="np-sans" style={{
                      margin: i === 0 ? '0 0 12px' : '12px 0 0',
                      color: 'var(--fg)', fontSize: 14.5, lineHeight: 1.8, letterSpacing: 0.1,
                      fontWeight: 400,
                    }}>
                      {p}
                    </p>
                  ))}

                  <Divider />
                  <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    <Badge label={t.propComplete} value={content.properties.complete} />
                    <Badge label={t.propOptimal} value={content.properties.optimal} />
                    <Badge label={t.propTime} value={content.properties.time} mono />
                    <Badge label={t.propSpace} value={content.properties.space} mono />
                  </div>
                </div>

                <div>
                  <SidebarLabel text={t.controlFlow} />
                  <FlowDiagram steps={content.flow} />
                </div>
              </div>
            </div>

            {/* ===== Section 2: Python Code ===== */}
            <div style={{ height: 28 }} />
            <SectionBar index="02" title={t.sectionPython} />
            <div className="np-glass" style={{ marginTop: 14, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '11px 14px', borderBottom: '1px solid var(--border)',
                background: 'var(--bg-elevated)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ display: 'inline-flex', gap: 5 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)' }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', opacity: 0.7 }} />
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--border-strong)', opacity: 0.4 }} />
                  </span>
                  <span className="np-mono" style={{ fontSize: 11, letterSpacing: 1, color: 'var(--fg-muted)', fontWeight: 600 }}>{algo.toLowerCase()}.py</span>
                </div>
                <button
                  onClick={handleCopy}
                  className="np-sans"
                  style={{
                    padding: '6px 12px', background: copied ? 'var(--accent)' : 'var(--bg-panel)',
                    color: copied ? 'var(--accent-fg)' : 'var(--fg)',
                    border: '1px solid ' + (copied ? 'var(--accent)' : 'var(--border-strong)'),
                    fontSize: 10, letterSpacing: 1, fontWeight: 600,
                    cursor: 'pointer', borderRadius: 3, transition: 'all 140ms',
                  }}
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
              <CodeBlock code={content.python} />
            </div>

            {/* ===== Section 3: Graph traversal ===== */}
            <div style={{ height: 28 }} />
            <SectionBar index="03" title={t.sectionGraph} />
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

            {/* Footer */}
            <div className="np-sans" style={{
              marginTop: 44, padding: '18px 0 0',
              borderTop: '1px solid var(--border)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              color: 'var(--fg-dim)', fontSize: 10.5, letterSpacing: 0.3,
              flexWrap: 'wrap', gap: 14,
            }}>
              <span>{t.footerLeft}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                © {new Date().getFullYear()} <strong style={{ color: 'var(--fg)', fontWeight: 700 }}>{displayedAuthor}</strong>
              </span>
              <span>{t.footerRight}</span>
            </div>
          </div>
        </main>
      </div>

      {/* ========== GRID DRAWER ========== */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, background: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0.55)',
          opacity: drawerOpen ? 1 : 0, pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 260ms ease', zIndex: 40,
        }}
      />
      <div
        className={`np-drawer ${drawerOpen ? 'np-drawer-open' : ''}`}
        style={{
          position: 'fixed', top: 0,
          insetInlineEnd: 0,
          bottom: 0, width: 'min(520px, 100vw)',
          background: 'var(--bg-alt)',
          borderInlineStart: '1px solid var(--border)',
          transform: drawerOpen ? 'translateX(0)' : `translateX(${isRTL ? '-100%' : '100%'})`,
          transition: 'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: drawerOpen ? 'var(--shadow-panel)' : 'none',
          zIndex: 50, display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="np-mono" style={{ fontSize: 10, letterSpacing: 2, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 500 }}>{t.drawerTitle}</div>
            <div className="np-sans" style={{ fontSize: 14, letterSpacing: 0.3, color: 'var(--fg-strong)', fontWeight: 700, marginTop: 3 }}>{algoLabel[algo]} · 12 × 12</div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            style={{
              width: 32, height: 32, background: 'transparent', border: '1px solid var(--border-strong)',
              color: 'var(--fg)', cursor: 'pointer', borderRadius: 3, fontSize: 14,
            }}
          >✕</button>
        </div>

        <div className="np-scroll" style={{ padding: 18, overflowY: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${COLS}, ${cellSize}px)`,
                gridTemplateRows: `repeat(${ROWS}, ${cellSize}px)`,
                gap: 3, padding: 10,
                background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 4,
                direction: 'ltr',
              }}
            >
              {grid.map((row, r) => row.map((cell, c) => {
                const isStart = r === start.r && c === start.c;
                const isGoal = r === goal.r && c === goal.c;
                const isWall = cell.kind === 'wall';
                const isVisited = cell.visitOrder >= 0 && cell.visitOrder < gridRun.stepIdx;
                const isPath = cell.pathOrder >= 0 && cell.pathOrder < gridRun.pathIdx;

                let bg = 'var(--bg-panel)';
                let border = '1px solid var(--border)';
                let shadow = 'none';
                let animation: string | undefined;
                let cellContent: React.ReactNode = null;

                if (isWall) { bg = 'var(--wall)'; border = '1px solid var(--border)'; }
                else if (isPath) { bg = 'var(--path)'; border = '1px solid var(--path)'; animation = 'np-path-pulse 1.4s ease-in-out infinite'; }
                else if (isVisited) {
                  bg = 'var(--visited)'; border = '1px solid var(--visited-border)';
                  shadow = '0 0 6px var(--accent-glow)';
                  animation = 'np-ripple 260ms ease-out both';
                }
                if (isStart) {
                  bg = 'var(--accent-soft)'; border = '1px solid var(--accent)'; animation = 'np-start-pulse 1.6s ease-in-out infinite';
                  cellContent = <span style={{ color: 'var(--fg-strong)', fontSize: 10, fontWeight: 800 }}>S</span>;
                } else if (isGoal) {
                  bg = 'transparent'; border = '1px solid var(--accent)'; shadow = '0 0 8px var(--accent-glow)';
                  cellContent = <span style={{ width: 10, height: 10, background: 'var(--accent)', transform: 'rotate(45deg)', display: 'inline-block' }} />;
                }

                const delay = isVisited && cell.visitOrder >= 0 ? Math.min(cell.visitOrder * 6, 300)
                  : isPath && cell.pathOrder >= 0 ? Math.min(cell.pathOrder * 30, 900) : 0;

                return (
                  <div
                    key={`${r}-${c}`}
                    onMouseDown={() => handleCellDown(r, c)}
                    onMouseEnter={() => handleCellEnter(r, c)}
                    style={{
                      width: cellSize, height: cellSize, background: bg, border,
                      boxShadow: shadow, borderRadius: 2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      animation, animationDelay: `${delay}ms`,
                      userSelect: 'none',
                      cursor: isStart || isGoal ? 'grab' : 'crosshair',
                      transition: 'background 120ms, border-color 120ms, box-shadow 120ms',
                    }}
                  >{cellContent}</div>
                );
              }))}
            </div>
          </div>

          <div style={{ height: 14 }} />
          <Legend title={t.legend} items={legendItems} />

          <div style={{ height: 14 }} />
          <div className="np-glass" style={{ padding: 14, borderRadius: 4 }}>
            <SidebarLabel text={t.controls} />
            <div style={{ marginTop: 10, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
              <GhostButton label={gridRun.running ? t.btnPause : t.btnPlay} solid={!gridRun.running} onClick={() => (gridRun.running ? setGridRun(r => ({ ...r, running: false })) : playGrid())} />
              <GhostButton label={t.btnReset} onClick={resetGrid} />
              <GhostButton label={t.btnRandom} onClick={randomizeGrid} />
              <GhostButton label={t.btnClear} onClick={() => { setGrid(makeEmptyGrid()); resetGrid(); }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <LabelRow label={t.speed} value={`${gridSpeed}ms`} />
              <input className="np-range" type="range" min={10} max={300} step={5} value={gridSpeed} onChange={(e) => setGridSpeed(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ height: 14 }} />
          <div className="np-glass" style={{ padding: 14, borderRadius: 4 }}>
            <SidebarLabel text={t.telemetry} />
            <StatRowCompact label={t.tStatus} value={<StatusPill status={gridRun.status} labels={pillLabels} />} />
            <StatRowCompact label={t.tExplored} value={<Numeric n={gridRun.snap ? Math.min(gridRun.stepIdx, gridRun.snap.visitedOrder.length) : 0} />} />
            <StatRowCompact label={t.tPath} value={<Numeric n={gridRun.snap && gridRun.snap.found ? Math.min(gridRun.pathIdx, gridRun.snap.path.length) : 0} />} />
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 960px) {
          .np-shell { grid-template-columns: 1fr !important; }
          .np-sidebar { position: static !important; height: auto !important; }
          .np-explain-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 720px) {
          .np-graph-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="np-sans"
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
        padding: '7px 4px', borderRadius: 3,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border)',
        color: 'var(--fg)', textDecoration: 'none',
        fontSize: 9, letterSpacing: 0.3, fontWeight: 600,
        transition: 'all 150ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--accent-soft)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border-accent)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-elevated)';
        (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--border)';
      }}
    >
      <span style={{ fontSize: 14, color: 'var(--fg-strong)' }}>{icon}</span>
      <span style={{ fontSize: 9 }}>{label}</span>
    </a>
  );
}