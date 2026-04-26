export type CellKind = 'empty' | 'wall';
export type AlgoKey = 'BFS' | 'DFS' | 'GREEDY' | 'HILL';
export type Point = { r: number; c: number };

export type CellState = {
  kind: CellKind;
  visitOrder: number;
  pathOrder: number;
};

export type AlgoSnapshot = {
  visitedOrder: Point[];
  path: Point[];
  found: boolean;
  nodesExplored: number;
  pathLength: number;
};

export type RunStatus = 'IDLE' | 'SEARCHING' | 'PATH_FOUND' | 'NO_PATH';

export type RunState = {
  running: boolean;
  paused: boolean;
  stepIndex: number;
  pathStepIndex: number;
  snapshot: AlgoSnapshot | null;
  status: RunStatus;
};

export const ROWS = 12;
export const COLS = 12;

export const ALGOS: { key: AlgoKey; name: string; short: string; tagline: string }[] = [
  { key: 'BFS',    name: 'Breadth-First Search',     short: 'BFS',           tagline: 'Level-by-level exploration. The safe navigator.' },
  { key: 'DFS',    name: 'Depth-First Search',       short: 'DFS',           tagline: 'Dive deep first. The relentless explorer.' },
  { key: 'GREEDY', name: 'Greedy Best-First Search', short: 'GREEDY BFS',    tagline: 'Always chase the closest goal. Fast, but not always right.' },
  { key: 'HILL',   name: 'Hill Climbing',            short: 'HILL CLIMBING', tagline: 'Only move uphill. Beware local optima.' },
];

export type GraphNode = { id: number; label: string; x: number; y: number };
export type GraphEdge = { a: number; b: number };
export type Graph = { nodes: GraphNode[]; edges: GraphEdge[]; adj: number[][]; start: number; goal: number };

export type GraphStep = { current: number; visited: number[]; frontier: number[] };
export type GraphTrace = {
  steps: GraphStep[];
  finalPath: number[];
  found: boolean;
  frontierLabel: 'QUEUE' | 'STACK' | 'PRIORITY QUEUE' | 'CURRENT';
};

export type Landscape = { xs: number[]; ys: number[] };

export function makeEmptyGrid(): CellState[][] {
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ kind: 'empty' as CellKind, visitOrder: -1, pathOrder: -1 })),
  );
}
export function pointsEqual(a: Point, b: Point) { return a.r === b.r && a.c === b.c; }
export function key(p: Point) { return `${p.r},${p.c}`; }
export function neighbors(p: Point): Point[] {
  return [
    { r: p.r - 1, c: p.c }, { r: p.r, c: p.c + 1 },
    { r: p.r + 1, c: p.c }, { r: p.r, c: p.c - 1 },
  ];
}
export function inBounds(p: Point) { return p.r >= 0 && p.r < ROWS && p.c >= 0 && p.c < COLS; }
export function manhattan(a: Point, b: Point) { return Math.abs(a.r - b.r) + Math.abs(a.c - b.c); }

export class MinHeap<T> {
  private heap: { priority: number; item: T }[] = [];
  size() { return this.heap.length; }
  push(item: T, priority: number) { this.heap.push({ priority, item }); this.bubbleUp(this.heap.length - 1); }
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0]; const last = this.heap.pop()!;
    if (this.heap.length > 0) { this.heap[0] = last; this.sinkDown(0); }
    return top.item;
  }
  private bubbleUp(i: number) {
    while (i > 0) { const p = Math.floor((i - 1) / 2); if (this.heap[p].priority <= this.heap[i].priority) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]]; i = p; }
  }
  private sinkDown(i: number) {
    const n = this.heap.length;
    while (true) { const l = i * 2 + 1, r = i * 2 + 2; let s = i;
      if (l < n && this.heap[l].priority < this.heap[s].priority) s = l;
      if (r < n && this.heap[r].priority < this.heap[s].priority) s = r;
      if (s === i) break;
      [this.heap[s], this.heap[i]] = [this.heap[i], this.heap[s]]; i = s;
    }
  }
}