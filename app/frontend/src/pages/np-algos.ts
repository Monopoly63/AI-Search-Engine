import {
  AlgoKey, AlgoSnapshot, CellState, Graph, GraphTrace, Landscape, Point,
  MinHeap, inBounds, key, manhattan, neighbors, pointsEqual,
} from './np-types';

function reconstruct(parent: Map<string, Point | null>, end: Point): Point[] {
  const path: Point[] = [];
  let cur: Point | null | undefined = end;
  while (cur) { path.push(cur); cur = parent.get(key(cur)) ?? null; }
  return path.reverse();
}

export function runBFS(grid: CellState[][], start: Point, goal: Point): AlgoSnapshot {
  const visitedOrder: Point[] = []; const seen = new Set<string>();
  const parent = new Map<string, Point | null>(); const queue: Point[] = [start];
  seen.add(key(start)); parent.set(key(start), null);
  while (queue.length > 0) {
    const cur = queue.shift()!; visitedOrder.push(cur);
    if (pointsEqual(cur, goal)) { const path = reconstruct(parent, cur); return { visitedOrder, path, found: true, nodesExplored: visitedOrder.length, pathLength: path.length }; }
    for (const nb of neighbors(cur)) {
      if (!inBounds(nb) || grid[nb.r][nb.c].kind === 'wall' || seen.has(key(nb))) continue;
      seen.add(key(nb)); parent.set(key(nb), cur); queue.push(nb);
    }
  }
  return { visitedOrder, path: [], found: false, nodesExplored: visitedOrder.length, pathLength: 0 };
}

export function runDFS(grid: CellState[][], start: Point, goal: Point): AlgoSnapshot {
  const visitedOrder: Point[] = []; const seen = new Set<string>();
  const parent = new Map<string, Point | null>(); const stack: Point[] = [start];
  parent.set(key(start), null);
  while (stack.length > 0) {
    const cur = stack.pop()!; if (seen.has(key(cur))) continue; seen.add(key(cur)); visitedOrder.push(cur);
    if (pointsEqual(cur, goal)) { const path = reconstruct(parent, cur); return { visitedOrder, path, found: true, nodesExplored: visitedOrder.length, pathLength: path.length }; }
    const nbs = neighbors(cur);
    for (let i = nbs.length - 1; i >= 0; i--) { const nb = nbs[i];
      if (!inBounds(nb) || grid[nb.r][nb.c].kind === 'wall' || seen.has(key(nb))) continue;
      if (!parent.has(key(nb))) parent.set(key(nb), cur); stack.push(nb);
    }
  }
  return { visitedOrder, path: [], found: false, nodesExplored: visitedOrder.length, pathLength: 0 };
}

export function runGreedy(grid: CellState[][], start: Point, goal: Point): AlgoSnapshot {
  const visitedOrder: Point[] = []; const seen = new Set<string>();
  const parent = new Map<string, Point | null>(); const pq = new MinHeap<Point>();
  pq.push(start, manhattan(start, goal)); parent.set(key(start), null);
  while (pq.size() > 0) {
    const cur = pq.pop()!; if (seen.has(key(cur))) continue; seen.add(key(cur)); visitedOrder.push(cur);
    if (pointsEqual(cur, goal)) { const path = reconstruct(parent, cur); return { visitedOrder, path, found: true, nodesExplored: visitedOrder.length, pathLength: path.length }; }
    for (const nb of neighbors(cur)) {
      if (!inBounds(nb) || grid[nb.r][nb.c].kind === 'wall' || seen.has(key(nb))) continue;
      if (!parent.has(key(nb))) parent.set(key(nb), cur); pq.push(nb, manhattan(nb, goal));
    }
  }
  return { visitedOrder, path: [], found: false, nodesExplored: visitedOrder.length, pathLength: 0 };
}

export function runHillClimbing(grid: CellState[][], start: Point, goal: Point): AlgoSnapshot {
  const visitedOrder: Point[] = []; const parent = new Map<string, Point | null>();
  const seen = new Set<string>(); let cur: Point = start;
  parent.set(key(cur), null); seen.add(key(cur)); visitedOrder.push(cur);
  while (!pointsEqual(cur, goal)) {
    const curH = manhattan(cur, goal); let best: Point | null = null; let bestH = curH;
    for (const nb of neighbors(cur)) {
      if (!inBounds(nb) || grid[nb.r][nb.c].kind === 'wall' || seen.has(key(nb))) continue;
      const h = manhattan(nb, goal); if (h < bestH) { bestH = h; best = nb; }
    }
    if (!best) return { visitedOrder, path: [], found: false, nodesExplored: visitedOrder.length, pathLength: 0 };
    parent.set(key(best), cur); seen.add(key(best)); visitedOrder.push(best); cur = best;
  }
  const path = reconstruct(parent, cur);
  return { visitedOrder, path, found: true, nodesExplored: visitedOrder.length, pathLength: path.length };
}

export function runAlgorithm(algo: AlgoKey, grid: CellState[][], start: Point, goal: Point): AlgoSnapshot {
  switch (algo) {
    case 'BFS': return runBFS(grid, start, goal);
    case 'DFS': return runDFS(grid, start, goal);
    case 'GREEDY': return runGreedy(grid, start, goal);
    case 'HILL': return runHillClimbing(grid, start, goal);
  }
}

function labelFor(i: number): string { return i < 26 ? String.fromCharCode(65 + i) : `N${i}`; }

export function buildRandomGraph(_algo?: AlgoKey, nodeCount = 13): Graph {
  const nodes = [] as Graph['nodes'];
  const cols = 4;
  const rowsG = Math.ceil(nodeCount / cols);
  for (let i = 0; i < nodeCount; i++) {
    const col = i % cols; const row = Math.floor(i / cols);
    const jx = (Math.random() - 0.5) * 0.07; const jy = (Math.random() - 0.5) * 0.07;
    nodes.push({
      id: i, label: labelFor(i),
      x: 0.1 + (col / (cols - 1)) * 0.8 + jx,
      y: 0.12 + (row / Math.max(rowsG - 1, 1)) * 0.76 + jy,
    });
  }
  const edges: Graph['edges'] = []; const inTree = new Set<number>([0]); const outside = new Set<number>();
  for (let i = 1; i < nodeCount; i++) outside.add(i);
  while (outside.size > 0) {
    const outsideArr = Array.from(outside);
    const pick = outsideArr[Math.floor(Math.random() * outsideArr.length)];
    const treeArr = Array.from(inTree);
    treeArr.sort((a, b) => Math.hypot(nodes[a].x - nodes[pick].x, nodes[a].y - nodes[pick].y)
      - Math.hypot(nodes[b].x - nodes[pick].x, nodes[b].y - nodes[pick].y));
    edges.push({ a: treeArr[0], b: pick }); inTree.add(pick); outside.delete(pick);
  }
  const edgeSet = new Set<string>(edges.map((e) => e.a < e.b ? `${e.a}-${e.b}` : `${e.b}-${e.a}`));
  const extra = Math.floor(nodeCount / 2); let tries = 0;
  while (edgeSet.size < edges.length + extra && tries < 200) {
    tries++;
    const a = Math.floor(Math.random() * nodeCount); const b = Math.floor(Math.random() * nodeCount);
    if (a === b) continue;
    const k = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (edgeSet.has(k)) continue;
    const dist = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].y - nodes[b].y);
    if (dist > 0.45) continue;
    edgeSet.add(k); edges.push({ a, b });
  }
  const adj: number[][] = Array.from({ length: nodeCount }, () => []);
  edges.forEach((e) => { adj[e.a].push(e.b); adj[e.b].push(e.a); });
  adj.forEach((list) => list.sort((a, b) => a - b));
  let goal = nodeCount - 1; let bestD = -1;
  for (let i = 1; i < nodeCount; i++) {
    const d = Math.hypot(nodes[i].x - nodes[0].x, nodes[i].y - nodes[0].y);
    if (d > bestD) { bestD = d; goal = i; }
  }
  return { nodes, edges, adj, start: 0, goal };
}

export function traceGraphBFS(g: Graph): GraphTrace {
  const visited = new Set<number>([g.start]); const parent = new Map<number, number | null>([[g.start, null]]);
  const queue: number[] = [g.start]; const steps: GraphTrace['steps'] = []; let found = false;
  while (queue.length > 0) {
    const cur = queue.shift()!;
    steps.push({ current: cur, visited: Array.from(visited), frontier: [...queue] });
    if (cur === g.goal) { found = true; break; }
    for (const nb of g.adj[cur]) if (!visited.has(nb)) { visited.add(nb); parent.set(nb, cur); queue.push(nb); }
  }
  const finalPath: number[] = [];
  if (found) { let c: number | null | undefined = g.goal; while (c !== null && c !== undefined) { finalPath.push(c); c = parent.get(c) ?? null; } finalPath.reverse(); }
  return { steps, finalPath, found, frontierLabel: 'QUEUE' };
}

export function traceGraphDFS(g: Graph): GraphTrace {
  const visited = new Set<number>(); const parent = new Map<number, number | null>([[g.start, null]]);
  const stack: number[] = [g.start]; const steps: GraphTrace['steps'] = []; let found = false;
  while (stack.length > 0) {
    const cur = stack.pop()!; if (visited.has(cur)) continue; visited.add(cur);
    steps.push({ current: cur, visited: Array.from(visited), frontier: [...stack] });
    if (cur === g.goal) { found = true; break; }
    const nbs = [...g.adj[cur]].sort((a, b) => b - a);
    for (const nb of nbs) if (!visited.has(nb)) { if (!parent.has(nb)) parent.set(nb, cur); stack.push(nb); }
  }
  const finalPath: number[] = [];
  if (found) { let c: number | null | undefined = g.goal; while (c !== null && c !== undefined) { finalPath.push(c); c = parent.get(c) ?? null; } finalPath.reverse(); }
  return { steps, finalPath, found, frontierLabel: 'STACK' };
}

export function traceGraphGreedy(g: Graph): GraphTrace {
  const gx = g.nodes[g.goal].x, gy = g.nodes[g.goal].y;
  const h = (i: number) => Math.hypot(g.nodes[i].x - gx, g.nodes[i].y - gy);
  const visited = new Set<number>(); const parent = new Map<number, number | null>([[g.start, null]]);
  const pq = new MinHeap<number>(); pq.push(g.start, h(g.start));
  const inPQ: { id: number; h: number }[] = [{ id: g.start, h: h(g.start) }];
  const steps: GraphTrace['steps'] = []; let found = false;
  while (pq.size() > 0) {
    const cur = pq.pop()!;
    const idx = inPQ.findIndex((e) => e.id === cur); if (idx >= 0) inPQ.splice(idx, 1);
    if (visited.has(cur)) continue; visited.add(cur);
    steps.push({ current: cur, visited: Array.from(visited), frontier: [...inPQ].sort((a, b) => a.h - b.h).map((e) => e.id) });
    if (cur === g.goal) { found = true; break; }
    for (const nb of g.adj[cur]) {
      if (visited.has(nb)) continue;
      if (!parent.has(nb)) parent.set(nb, cur);
      const hv = h(nb); pq.push(nb, hv); inPQ.push({ id: nb, h: hv });
    }
  }
  const finalPath: number[] = [];
  if (found) { let c: number | null | undefined = g.goal; while (c !== null && c !== undefined) { finalPath.push(c); c = parent.get(c) ?? null; } finalPath.reverse(); }
  return { steps, finalPath, found, frontierLabel: 'PRIORITY QUEUE' };
}

export function traceGraphHill(g: Graph): GraphTrace {
  const gx = g.nodes[g.goal].x, gy = g.nodes[g.goal].y;
  const h = (i: number) => Math.hypot(g.nodes[i].x - gx, g.nodes[i].y - gy);
  const visited = new Set<number>([g.start]);
  const parent = new Map<number, number | null>([[g.start, null]]);
  const steps: GraphTrace['steps'] = [];
  let cur = g.start; let found = false;
  steps.push({ current: cur, visited: Array.from(visited), frontier: [cur] });
  while (cur !== g.goal) {
    const curH = h(cur); let best: number | null = null; let bestH = curH;
    for (const nb of g.adj[cur]) {
      if (visited.has(nb)) continue;
      const hv = h(nb); if (hv < bestH) { bestH = hv; best = nb; }
    }
    if (best === null) { found = false; break; }
    parent.set(best, cur); visited.add(best); cur = best;
    steps.push({ current: cur, visited: Array.from(visited), frontier: [cur] });
    if (cur === g.goal) { found = true; break; }
  }
  const finalPath: number[] = [];
  if (found) {
    let c: number | null | undefined = g.goal;
    while (c !== null && c !== undefined) { finalPath.push(c); c = parent.get(c) ?? null; }
    finalPath.reverse();
  }
  return { steps, finalPath, found, frontierLabel: 'CURRENT' };
}

export function traceGraph(algo: AlgoKey, g: Graph): GraphTrace {
  if (algo === 'BFS') return traceGraphBFS(g);
  if (algo === 'DFS') return traceGraphDFS(g);
  if (algo === 'GREEDY') return traceGraphGreedy(g);
  return traceGraphHill(g);
}

export function buildLandscape(): Landscape {
  const N = 80; const xs: number[] = []; const ys: number[] = [];
  for (let i = 0; i < N; i++) {
    const t = i / (N - 1); xs.push(t);
    const y =
      0.55 * Math.exp(-Math.pow((t - 0.28) / 0.09, 2)) +
      0.85 * Math.exp(-Math.pow((t - 0.72) / 0.12, 2)) +
      0.22 + 0.04 * Math.sin(t * 18);
    ys.push(Math.min(1, Math.max(0, y)));
  }
  return { xs, ys };
}