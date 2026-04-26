import { AlgoKey } from './np-types';

export type AlgoContent = {
  description: string[];
  properties: { complete: 'YES' | 'NO' | 'CONDITIONAL'; optimal: 'YES' | 'NO'; time: string; space: string };
  flow: string[];
  python: string;
};

export const CONTENT: Record<AlgoKey, AlgoContent> = {
  BFS: {
    description: [
      'Breadth-First Search (BFS) explores the search space one level at a time. Starting from the initial node, it visits every direct neighbor before moving deeper.',
      'It uses a FIFO queue to track the frontier. On an unweighted graph, the first time BFS reaches the goal it is guaranteed to be via the shortest path.',
      'BFS is a classic uninformed search - it has no knowledge of where the goal is and simply expands outward uniformly.',
    ],
    properties: { complete: 'YES', optimal: 'YES', time: 'O(b^d)', space: 'O(b^d)' },
    flow: ['START', 'ENQUEUE start', 'DEQUEUE front', 'GOAL?', 'EXPAND neighbors', 'ENQUEUE unseen', 'RETURN path'],
    python: `from collections import deque

# البحث بالعرض أولاً على شبكة ثنائية الأبعاد
def bfs(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    # طابور FIFO يحتوي على العقد المنتظرة للاستكشاف
    queue = deque([start])
    # قاموس لتتبع الأب من أجل إعادة بناء المسار
    parent = {start: None}

    while queue:
        current = queue.popleft()
        if current == goal:
            return reconstruct(parent, goal)

        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = current[0] + dr, current[1] + dc
            neighbor = (nr, nc)
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1:
                continue
            if neighbor in parent:
                continue
            parent[neighbor] = current
            queue.append(neighbor)

    return None

def reconstruct(parent, goal):
    path, node = [], goal
    while node is not None:
        path.append(node)
        node = parent[node]
    return list(reversed(path))
`,
  },
  DFS: {
    description: [
      'Depth-First Search (DFS) follows a single branch as deep as possible before backtracking. It uses a LIFO stack (or recursion) to manage the frontier.',
      'DFS is memory-efficient and explores boldly, but it does not guarantee an optimal path - it returns the first path it stumbles upon.',
      'On finite graphs it is complete; on infinite ones without a depth limit it can loop forever on a single branch.',
    ],
    properties: { complete: 'CONDITIONAL', optimal: 'NO', time: 'O(b^m)', space: 'O(bm)' },
    flow: ['START', 'PUSH start', 'POP top', 'VISITED?', 'GOAL?', 'PUSH neighbors', 'BACKTRACK / RETURN'],
    python: `# البحث بالعمق أولاً باستخدام مكدس (Stack)
def dfs(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    stack = [start]
    visited = set()
    parent = {start: None}

    while stack:
        current = stack.pop()
        if current in visited:
            continue
        visited.add(current)

        if current == goal:
            return reconstruct(parent, goal)

        for dr, dc in [(0,1),(1,0),(0,-1),(-1,0)]:
            nr, nc = current[0] + dr, current[1] + dc
            neighbor = (nr, nc)
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1 or neighbor in visited:
                continue
            if neighbor not in parent:
                parent[neighbor] = current
            stack.append(neighbor)

    return None

def reconstruct(parent, goal):
    path, node = [], goal
    while node is not None:
        path.append(node); node = parent[node]
    return list(reversed(path))
`,
  },
  GREEDY: {
    description: [
      'Greedy Best-First Search uses a heuristic h(n) to estimate how close a node is to the goal, and always expands the node that looks best right now.',
      'A priority queue orders the frontier by the heuristic. For grids, the Manhattan distance |dx| + |dy| is a typical h(n).',
      'Greedy is fast and often finds a reasonable path quickly - but it is not optimal: it can be lured down promising-looking dead ends.',
    ],
    properties: { complete: 'CONDITIONAL', optimal: 'NO', time: 'O(b^m)', space: 'O(b^m)' },
    flow: ['START', 'PUSH (start, h)', 'POP min h', 'GOAL?', 'EXPAND neighbors', 'PUSH (nb, h(nb))', 'RETURN path'],
    python: `import heapq

# الاستدلال: مسافة مانهاتن بين نقطتين
def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

# البحث الجشع الأفضل أولاً
def greedy_best_first(grid, start, goal):
    rows, cols = len(grid), len(grid[0])
    pq = [(manhattan(start, goal), 0, start)]
    counter = 1
    visited = set()
    parent = {start: None}

    while pq:
        _, _, current = heapq.heappop(pq)
        if current in visited:
            continue
        visited.add(current)

        if current == goal:
            return reconstruct(parent, goal)

        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = current[0] + dr, current[1] + dc
            neighbor = (nr, nc)
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1 or neighbor in visited:
                continue
            if neighbor not in parent:
                parent[neighbor] = current
            heapq.heappush(pq, (manhattan(neighbor, goal), counter, neighbor))
            counter += 1

    return None

def reconstruct(parent, goal):
    path, node = [], goal
    while node is not None:
        path.append(node); node = parent[node]
    return list(reversed(path))
`,
  },
  HILL: {
    description: [
      'Hill Climbing is a local search algorithm: it repeatedly moves to the neighbor with the best heuristic value, never looking back.',
      'The steepest-ascent variant evaluates all neighbors and picks the strictly better one. If no neighbor improves h(n), the search halts - even if the true goal has not been reached.',
      'This makes Hill Climbing fast and memory-light, but vulnerable to local optima, plateaus, and ridges. It is the foundation for variants like simulated annealing.',
    ],
    properties: { complete: 'NO', optimal: 'NO', time: 'O(inf) worst', space: 'O(1)' },
    flow: ['START', 'EVALUATE neighbors', 'BETTER FOUND?', 'YES -> MOVE', 'NO -> STOP (local optimum)'],
    python: `# خوارزمية التسلق (Steepest-Ascent Hill Climbing)
def hill_climbing(grid, start, goal):
    rows, cols = len(grid), len(grid[0])

    def h(node):
        return abs(node[0] - goal[0]) + abs(node[1] - goal[1])

    current = start
    path = [current]
    visited = {current}

    while current != goal:
        best_neighbor = None
        best_score = h(current)

        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = current[0] + dr, current[1] + dc
            neighbor = (nr, nc)
            if not (0 <= nr < rows and 0 <= nc < cols):
                continue
            if grid[nr][nc] == 1 or neighbor in visited:
                continue
            score = h(neighbor)
            if score < best_score:
                best_score = score
                best_neighbor = neighbor

        if best_neighbor is None:
            return None

        current = best_neighbor
        visited.add(current)
        path.append(current)

    return path
`,
  },
};

const PY_KEYWORDS = new Set(['def','return','if','elif','else','for','while','in','not','and','or','import','from','as','None','True','False','continue','break','pass','class','with','try','except','raise','lambda','is','yield','global','nonlocal']);

export type Token = { text: string; type: 'kw' | 'str' | 'com' | 'num' | 'fn' | 'txt' };

export function tokenizeLine(line: string): Token[] {
  const tokens: Token[] = []; let i = 0;
  while (i < line.length) {
    const ch = line[i];
    if (ch === '#') { tokens.push({ text: line.slice(i), type: 'com' }); break; }
    if (ch === '"' || ch === "'") {
      const quote = ch; let j = i + 1;
      while (j < line.length && line[j] !== quote) { if (line[j] === '\\' && j + 1 < line.length) j += 2; else j++; }
      j = Math.min(j + 1, line.length); tokens.push({ text: line.slice(i, j), type: 'str' }); i = j; continue;
    }
    if (/[0-9]/.test(ch)) {
      let j = i; while (j < line.length && /[0-9._]/.test(line[j])) j++;
      tokens.push({ text: line.slice(i, j), type: 'num' }); i = j; continue;
    }
    if (/[A-Za-z_]/.test(ch)) {
      let j = i; while (j < line.length && /[A-Za-z0-9_]/.test(line[j])) j++;
      const word = line.slice(i, j);
      if (PY_KEYWORDS.has(word)) tokens.push({ text: word, type: 'kw' });
      else if (line[j] === '(') tokens.push({ text: word, type: 'fn' });
      else tokens.push({ text: word, type: 'txt' });
      i = j; continue;
    }
    let j = i; while (j < line.length && !/[A-Za-z_0-9"'#]/.test(line[j])) j++;
    if (j === i) j = i + 1;
    tokens.push({ text: line.slice(i, j), type: 'txt' }); i = j;
  }
  return tokens;
}

export function tokenStyle(type: Token['type']): React.CSSProperties {
  switch (type) {
    case 'kw':  return { color: 'var(--fg-strong)', fontWeight: 700 };
    case 'str': return { color: 'var(--fg-muted)' };
    case 'com': return { color: 'var(--fg-faint)', fontStyle: 'italic' };
    case 'num': return { color: 'var(--fg)' };
    case 'fn':  return { color: 'var(--fg-strong)' };
    default:    return { color: 'var(--fg)' };
  }
}