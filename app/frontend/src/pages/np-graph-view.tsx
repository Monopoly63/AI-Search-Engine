import { Graph, GraphTrace, RunStatus } from './np-types';
import { SidebarLabel, GhostButton, StatusPill, Numeric, StatRowCompact } from './np-ui';
import { Dict } from './np-i18n';

export function GraphView(props: {
  graph: Graph; trace: GraphTrace;
  gStepIdx: number; gPathIdx: number;
  running: boolean; speed: number;
  onPlay: () => void; onPause: () => void; onReset: () => void; onNewGraph: () => void;
  onSpeedChange: (n: number) => void;
  t: Dict;
}) {
  const { graph, trace, gStepIdx, gPathIdx, running, speed, t } = props;
  const activeStep = gStepIdx > 0 ? trace.steps[Math.min(gStepIdx - 1, trace.steps.length - 1)] : null;
  const visitedSet = new Set<number>(activeStep ? activeStep.visited : []);
  const currentId = activeStep ? activeStep.current : -1;
  const frontier = activeStep ? activeStep.frontier : [];

  const revealedPath = trace.finalPath.slice(0, gPathIdx);
  const pathEdgeSet = new Set<string>();
  for (let i = 0; i + 1 < revealedPath.length; i++) {
    const a = revealedPath[i], b = revealedPath[i + 1];
    pathEdgeSet.add(a < b ? `${a}-${b}` : `${b}-${a}`);
  }
  const pathNodeSet = new Set<number>(revealedPath);

  const W = 640; const H = 420;
  const stepTotal = trace.steps.length; const pathTotal = trace.finalPath.length;
  const isComplete = gStepIdx >= stepTotal && (!trace.found || gPathIdx >= pathTotal) && stepTotal > 0;
  const statusKey: RunStatus =
    running ? 'SEARCHING'
    : gStepIdx === 0 ? 'IDLE'
    : isComplete ? (trace.found ? 'PATH_FOUND' : 'NO_PATH')
    : 'SEARCHING';

  const pillLabels: Record<RunStatus, string> = {
    IDLE: t.pillIdle, SEARCHING: t.pillSearching, PATH_FOUND: t.pillPathFound, NO_PATH: t.pillNoPath,
  };

  const frontierTitle =
    trace.frontierLabel === 'QUEUE' ? t.queueLabel :
    trace.frontierLabel === 'STACK' ? t.stackLabel : t.priorityLabel;
  const frontierHint =
    trace.frontierLabel === 'QUEUE' ? t.hintQueue :
    trace.frontierLabel === 'STACK' ? t.hintStack : t.hintPriority;

  return (
    <div className="np-graph-grid" style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: 16 }}>
      <div className="np-glass" style={{ padding: 16, borderRadius: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span className="np-sans" style={{ fontSize: 10, letterSpacing: 2.5, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 600 }}>Graph</span>
          <span className="np-mono" style={{ fontSize: 10, letterSpacing: 1, color: 'var(--fg-faint)' }}>{t.graphNodes} {graph.nodes.length} · {t.graphEdges} {graph.edges.length}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block', background: 'transparent' }}>
          <defs>
            <filter id="np-glow-filter" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {graph.edges.map((e, i) => {
            const a = graph.nodes[e.a], b = graph.nodes[e.b];
            const k = e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`;
            const onPath = pathEdgeSet.has(k);
            const bothVisited = visitedSet.has(e.a) && visitedSet.has(e.b);
            const stroke = onPath ? 'var(--accent)' : bothVisited ? 'var(--border-accent)' : 'var(--border)';
            const width = onPath ? 2.6 : 1.2;
            return <line key={i} x1={a.x * W} y1={a.y * H} x2={b.x * W} y2={b.y * H} stroke={stroke} strokeWidth={width} filter={onPath ? 'url(#np-glow-filter)' : undefined} style={{ transition: 'stroke 240ms, stroke-width 240ms' }} />;
          })}
          {graph.nodes.map((n) => {
            const isStart = n.id === graph.start; const isGoal = n.id === graph.goal;
            const isCurrent = n.id === currentId;
            const isVisited = visitedSet.has(n.id); const isOnPath = pathNodeSet.has(n.id);
            const r = isCurrent ? 17 : 15;
            let fill = 'var(--bg-panel)'; let stroke = 'var(--border-strong)'; let strokeW = 1.4;
            let textFill = 'var(--fg-muted)';
            if (isVisited) { fill = 'var(--visited)'; stroke = 'var(--visited-border)'; textFill = 'var(--fg-strong)'; }
            if (isOnPath) { fill = 'var(--path)'; stroke = 'var(--path)'; textFill = 'var(--accent-fg)'; }
            if (isStart || isGoal) { stroke = 'var(--accent)'; strokeW = 2.2; }
            return (
              <g key={n.id}>
                {isCurrent && <circle cx={n.x * W} cy={n.y * H} r={r + 8} fill="none" stroke="var(--border-accent)" strokeWidth={1.4} style={{ animation: 'np-start-pulse 1.2s ease-in-out infinite' }} />}
                <circle cx={n.x * W} cy={n.y * H} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} filter={isCurrent || isOnPath ? 'url(#np-glow-filter)' : undefined} style={{ transition: 'fill 240ms, stroke 240ms' }} />
                <text x={n.x * W} y={n.y * H + 4} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={11} fontWeight={700} letterSpacing={1} fill={textFill} style={{ pointerEvents: 'none', transition: 'fill 240ms' }}>{n.label}</text>
                {(isStart || isGoal) && (
                  <text x={n.x * W} y={n.y * H - r - 8} textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize={8.5} fontWeight={700} letterSpacing={2} fill="var(--fg-strong)">{isStart ? t.legStart.toUpperCase() : t.legGoal.toUpperCase()}</text>
                )}
              </g>
            );
          })}
        </svg>
        <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <GhostButton label={running ? t.btnPause : t.btnRun} solid={!running} onClick={() => (running ? props.onPause() : props.onPlay())} />
          <GhostButton label={t.btnReset} onClick={props.onReset} />
          <GhostButton label={t.btnNewGraph} onClick={props.onNewGraph} />
          <div style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 10, minWidth: 200 }}>
            <span className="np-sans" style={{ fontSize: 10, letterSpacing: 1.5, color: 'var(--fg-dim)', textTransform: 'uppercase', fontWeight: 600 }}>{t.speed}</span>
            <input className="np-range" type="range" min={80} max={1500} step={20} value={speed} onChange={(e) => props.onSpeedChange(Number(e.target.value))} style={{ flex: 1 }} />
            <span className="np-mono" style={{ fontSize: 10.5, color: 'var(--fg)', fontVariantNumeric: 'tabular-nums', minWidth: 48, textAlign: 'end', fontWeight: 600 }}>{speed}ms</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
        <div className="np-glass" style={{ padding: 14, borderRadius: 4 }}>
          <SidebarLabel text={frontierTitle} />
          <div className="np-scroll" style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 240, overflowY: 'auto' }}>
            {frontier.length === 0 ? (
              <div className="np-sans" style={{ fontSize: 10, color: 'var(--fg-faint)', letterSpacing: 1, padding: '6px 2px' }}>{t.empty}</div>
            ) : frontier.map((id, i) => (
              <div key={`${id}-${i}`} className="np-mono" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px',
                background: i === 0 ? 'var(--accent-soft)' : 'var(--bg-panel)',
                border: `1px solid ${i === 0 ? 'var(--border-accent)' : 'var(--border)'}`,
                borderRadius: 3, fontSize: 11, letterSpacing: 1, color: 'var(--fg-strong)', fontWeight: 600,
              }}>
                <span style={{ color: 'var(--fg-faint)', fontSize: 9 }}>{String(i).padStart(2, '0')}</span>
                <span>{graph.nodes[id]?.label ?? id}</span>
              </div>
            ))}
          </div>
          <div className="np-sans" style={{ marginTop: 10, fontSize: 10, color: 'var(--fg-faint)', letterSpacing: 0.5, lineHeight: 1.5 }}>
            {frontierHint}
          </div>
        </div>

        <div className="np-glass" style={{ padding: 14, borderRadius: 4 }}>
          <SidebarLabel text={t.telemetry} />
          <StatRowCompact label={t.tStatus} value={<StatusPill status={statusKey} labels={pillLabels} />} />
          <StatRowCompact label={t.tExplored} value={<Numeric n={Math.min(gStepIdx, stepTotal)} />} />
          <StatRowCompact label={t.tPath} value={<Numeric n={trace.found ? Math.min(gPathIdx, pathTotal) : 0} />} />
          <StatRowCompact label={t.tEfficiency} value={
            <Numeric
              n={trace.found && trace.finalPath.length > 0 && trace.steps.length > 0
                ? Math.round((trace.finalPath.length / trace.steps.length) * 1000) / 10 : 0}
              suffix="%" />
          } />
        </div>
      </div>
    </div>
  );
}