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
    <div className="graph-workstation">
      <div className="glass-card graph-canvas-card">
        <div className="graph-toolbar">
          <div>
            <div className="section-kicker">Traversal graph</div>
            <div className="graph-meta" style={{ marginTop: 6 }}>
              <span>{t.graphNodes} {graph.nodes.length}</span>
              <span>·</span>
              <span>{t.graphEdges} {graph.edges.length}</span>
            </div>
          </div>
          <StatusPill status={statusKey} labels={pillLabels} />
        </div>

        <div className="graph-svg-wrap">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" style={{ display: 'block', direction: 'ltr' }}>
            <defs>
              <radialGradient id="node-sheen" cx="35%" cy="24%" r="70%">
                <stop offset="0%" stopColor="rgba(255,255,255,.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,.02)" />
              </radialGradient>
            </defs>
            {graph.edges.map((e, i) => {
              const a = graph.nodes[e.a], b = graph.nodes[e.b];
              const k = e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`;
              const onPath = pathEdgeSet.has(k);
              const bothVisited = visitedSet.has(e.a) && visitedSet.has(e.b);
              const stroke = onPath ? 'var(--accent)' : bothVisited ? 'var(--visited-border)' : 'var(--border)';
              const width = onPath ? 3 : bothVisited ? 1.8 : 1.1;
              return <line key={i} x1={a.x * W} y1={a.y * H} x2={b.x * W} y2={b.y * H} stroke={stroke} strokeWidth={width} strokeLinecap="round" style={{ transition: 'stroke 260ms ease, stroke-width 260ms ease' }} />;
            })}
            {graph.nodes.map((n) => {
              const isStart = n.id === graph.start; const isGoal = n.id === graph.goal;
              const isCurrent = n.id === currentId;
              const isVisited = visitedSet.has(n.id); const isOnPath = pathNodeSet.has(n.id);
              const r = isCurrent ? 18 : 15;
              let fill = 'rgba(255,255,255,0.045)'; let stroke = 'var(--border-strong)'; let strokeW = 1.25;
              let textFill = 'var(--fg-muted)';
              if (isVisited) { fill = 'var(--visited)'; stroke = 'var(--visited-border)'; textFill = 'var(--fg-strong)'; }
              if (isOnPath) { fill = 'var(--path)'; stroke = 'var(--path)'; textFill = 'var(--accent-fg)'; }
              if (isStart || isGoal) { stroke = 'var(--accent)'; strokeW = 2.2; }
              return (
                <g key={n.id}>
                  {isCurrent && <circle cx={n.x * W} cy={n.y * H} r={r + 10} fill="none" stroke="var(--border-accent)" strokeWidth={1.2} style={{ animation: 'np-start-pulse 1.35s ease-in-out infinite' }} />}
                  <circle cx={n.x * W} cy={n.y * H} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} style={{ transition: 'fill 240ms ease, stroke 240ms ease, r 240ms ease' }} />
                  <circle cx={n.x * W - 4} cy={n.y * H - 5} r={Math.max(2, r * .2)} fill="rgba(255,255,255,.16)" opacity={isOnPath ? .32 : .7} />
                  <text x={n.x * W} y={n.y * H + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fontWeight={800} fill={textFill} style={{ pointerEvents: 'none', transition: 'fill 240ms ease' }}>{n.label}</text>
                  {(isStart || isGoal) && (
                    <text x={n.x * W} y={n.y * H - r - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={8.5} fontWeight={800} letterSpacing={2} fill="var(--fg-strong)">{isStart ? t.legStart.toUpperCase() : t.legGoal.toUpperCase()}</text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        <div className="graph-controls">
          <GhostButton label={running ? t.btnPause : t.btnRun} solid={!running} onClick={() => (running ? props.onPause() : props.onPlay())} />
          <GhostButton label={t.btnReset} onClick={props.onReset} />
          <GhostButton label={t.btnNewGraph} onClick={props.onNewGraph} />
          <label className="speed-control">
            <span>{t.speed}</span>
            <input className="np-range" type="range" min={80} max={1500} step={20} value={speed} onChange={(e) => props.onSpeedChange(Number(e.target.value))} />
            <output>{speed}ms</output>
          </label>
        </div>
      </div>

      <div className="graph-side">
        <div className="glass-card card-pad">
          <SidebarLabel text={frontierTitle} />
          <div className="frontier-list np-scroll">
            {frontier.length === 0 ? (
              <div className="empty-state">{t.empty}</div>
            ) : frontier.map((id, i) => (
              <div key={`${id}-${i}`} className={`frontier-row${i === 0 ? ' is-next' : ''}`}>
                <span>{String(i).padStart(2, '0')}</span>
                <span>{graph.nodes[id]?.label ?? id}</span>
              </div>
            ))}
          </div>
          <p className="section-description" style={{ marginTop: 12, fontSize: 12 }}>{frontierHint}</p>
        </div>

        <div className="glass-card card-pad">
          <SidebarLabel text={t.telemetry} />
          <div className="telemetry-list">
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
    </div>
  );
}
