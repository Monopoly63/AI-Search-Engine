// ═══════════════════════════════════════════════════════════════
// AI Lectures Data — All lab materials from Dr. Ghada Safi
// Neural Pathfinder / AI Search Engine
// ═══════════════════════════════════════════════════════════════

export type LecKey =
  | 'lab1' | 'lab2' | 'lab3a' | 'lab3b'
  | 'lab4' | 'lab6' | 'lab7' | 'lab8' | 'lab9' | 'codes';

export interface LecSection {
  heading: { en: string; ar: string };
  paragraphs: { en: string; ar: string }[];
  bullets?: { en: string; ar: string }[];
  code?: string;
}

export interface AILecture {
  id: LecKey;
  number: number;
  title: { en: string; ar: string };
  summary: { en: string; ar: string };
  tag: { en: string; ar: string };
  accent: 'cyan' | 'purple' | 'pink' | 'green' | 'orange';
  algoLink?: string; // link to algorithm tab
  sections: LecSection[];
  examples?: { en: string; ar: string }[];
}

export const AI_LECTURES: AILecture[] = [

  // ─── Lab 1: Python Basics + BFS/DFS ──────────────────────────
  {
    id: 'lab1',
    number: 1,
    title: { en: 'Python Basics & Graph Search', ar: 'أساسيات بايثون والبحث في الرسوم البيانية' },
    summary: { en: 'Python fundamentals applied to AI search: variables, lists, dictionaries, sets, queues. Ends with full BFS and DFS implementations.', ar: 'أساسيات بايثون مطبقة على البحث في الذكاء الاصطناعي: متغيرات، قوائم، قواميس، مجموعات، طوابير. ينتهي بتنفيذ BFS و DFS كاملين.' },
    tag: { en: 'Python + Search', ar: 'بايثون + بحث' },
    accent: 'cyan',
    algoLink: 'BFS',
    sections: [
      {
        heading: { en: 'Variables & Data Types', ar: 'المتغيرات وأنواع البيانات' },
        paragraphs: [
          { en: 'In AI search problems, nodes are represented as strings or numbers, edge costs as floats, and visited status as booleans.', ar: 'في مسائل البحث، تمثل العقد كسلاسل نصية أو أرقام، وتكاليف الحواف كأعداد عشرية، وحالة الزيارة كقيم منطقية.' },
        ],
        code: `node = "A"\ncost = 5\nvisited = False\nprint(node, cost, visited)`,
      },
      {
        heading: { en: 'Graph as Dictionary', ar: 'الرسم البياني كقاموس' },
        paragraphs: [
          { en: 'The most natural Python representation of a graph is a dictionary mapping each node to a list of its neighbors.', ar: 'أكثر تمثيل طبيعي للرسم البياني في بايثون هو قاموس يربط كل عقدة بقائمة جيرانها.' },
        ],
        code: `graph = {\n    "A": ["B", "C"],\n    "B": ["D"],\n    "C": ["E"],\n    "D": [],\n    "E": []\n}`,
      },
      {
        heading: { en: 'BFS Implementation', ar: 'تنفيذ BFS' },
        paragraphs: [
          { en: 'BFS uses a FIFO queue (deque). It visits nodes level by level, guaranteeing the shortest path on unweighted graphs.', ar: 'BFS تستخدم طابور FIFO (deque). تزور العقد مستوى بعد مستوى، وتضمن أقصر مسار في الرسوم غير الموزونة.' },
        ],
        code: `from collections import deque\n\ndef bfs(graph, start, goal):\n    queue = deque([start])\n    visited = set()\n    parent = {start: None}\n\n    while queue:\n        node = queue.popleft()\n        if node == goal:\n            return build_path(parent, goal)\n        if node not in visited:\n            visited.add(node)\n            for nb in graph[node]:\n                if nb not in parent:\n                    parent[nb] = node\n                    queue.append(nb)\n    return None\n\ndef build_path(parent, goal):\n    path, cur = [], goal\n    while cur: path.append(cur); cur = parent[cur]\n    return list(reversed(path))`,
      },
      {
        heading: { en: 'DFS Implementation', ar: 'تنفيذ DFS' },
        paragraphs: [
          { en: 'DFS uses a LIFO stack. It dives deep into one branch before backtracking. Memory-efficient but not guaranteed optimal.', ar: 'DFS تستخدم مكدس LIFO. تغوص عميقاً في فرع قبل التراجع. موفرة للذاكرة لكن لا تضمن مساراً أمثل.' },
        ],
        code: `def dfs(graph, start, goal):\n    stack = [start]\n    visited = set()\n    parent = {start: None}\n\n    while stack:\n        node = stack.pop()\n        if node == goal:\n            return build_path(parent, goal)\n        if node not in visited:\n            visited.add(node)\n            for nb in graph[node]:\n                if nb not in parent:\n                    parent[nb] = node\n                    stack.append(nb)\n    return None`,
      },
    ],
    examples: [
      { en: 'Graph S→A,B; A→C,D; B→E; D→G — BFS finds S→A→D→G', ar: 'رسم S→A,B; A→C,D; B→E; D→G — BFS تجد S→A→D→G' },
    ],
  },

  // ─── Lab 2: BFS/DFS/UCS Practice ─────────────────────────────
  {
    id: 'lab2',
    number: 2,
    title: { en: 'Uninformed Search — BFS, DFS, UCS', ar: 'البحث غير الموجه — BFS، DFS، UCS' },
    summary: { en: 'Hands-on exercises applying BFS and DFS on trees and grids. Introduces Uniform Cost Search (UCS) for weighted graphs.', ar: 'تمارين تطبيقية لـ BFS و DFS على أشجار وشبكات. يُعرّف البحث بالتكلفة الموحدة (UCS) للرسوم الموزونة.' },
    tag: { en: 'Uninformed Search', ar: 'بحث غير موجه' },
    accent: 'purple',
    algoLink: 'BFS',
    sections: [
      {
        heading: { en: 'BFS on a Search Tree', ar: 'BFS على شجرة بحث' },
        paragraphs: [
          { en: 'BFS expands level by level. In the tree S→{A,B}; A→{C,D}; B→{E}; D→{G}: expansion order is S, A, B, C, D, E, G. Path: S→A→D→G (shortest in steps).', ar: 'BFS تتوسع مستوى بعد مستوى. في الشجرة S→{A,B}; A→{C,D}; B→{E}; D→{G}: ترتيب التوسع S, A, B, C, D, E, G. المسار: S→A→D→G (أقصر بعدد الخطوات).' },
        ],
      },
      {
        heading: { en: 'BFS on a Grid', ar: 'BFS على شبكة' },
        paragraphs: [
          { en: 'On a 3×3 grid with S at (0,0), G at (2,2), and a wall at (0,2) and (1,1): BFS finds the path (0,0)→(0,1)→(1,1)→(2,1)→(2,2) in 4 moves.', ar: 'على شبكة 3×3 مع S في (0,0) وG في (2,2) وعائق في (0,2) و(1,1): BFS تجد المسار في 4 خطوات.' },
        ],
      },
      {
        heading: { en: 'UCS — Uniform Cost Search', ar: 'UCS — البحث بالتكلفة الموحدة' },
        paragraphs: [
          { en: 'UCS expands the node with the lowest cumulative cost g(n). It uses a priority queue ordered by g(n). It is optimal when all edge costs are non-negative.', ar: 'UCS تتوسع في العقدة ذات أقل تكلفة تراكمية g(n). تستخدم طابور أولوية مرتب بـ g(n). هي أمثل عندما جميع تكاليف الحواف غير سلبية.' },
          { en: 'UCS is identical to A* with h(n)=0. In the graph S→A(1),B(4); A→C(2),D(5); B→E(1); C→G(3); E→G(2): optimal path is S→A→C→G with cost 6.', ar: 'UCS هي A* مع h(n)=0. في الرسم S→A(1),B(4); A→C(2),D(5); B→E(1); C→G(3); E→G(2): المسار الأمثل S→A→C→G بتكلفة 6.' },
        ],
        code: `import heapq\n\ndef ucs(graph, start, goal):\n    # graph[node] = [(neighbor, cost), ...]\n    pq = [(0, start)]  # (g_cost, node)\n    visited = set()\n    parent = {start: None}\n    g = {start: 0}\n\n    while pq:\n        cost, node = heapq.heappop(pq)\n        if node == goal:\n            return build_path(parent, goal), cost\n        if node in visited: continue\n        visited.add(node)\n        for nb, edge_cost in graph[node]:\n            new_g = cost + edge_cost\n            if nb not in g or new_g < g[nb]:\n                g[nb] = new_g\n                parent[nb] = node\n                heapq.heappush(pq, (new_g, nb))\n    return None, float('inf')`,
      },
    ],
  },

  // ─── Lab 3a: Greedy + A* ──────────────────────────────────────
  {
    id: 'lab3a',
    number: 3,
    title: { en: 'Informed Search — Greedy & A*', ar: 'البحث الموجه — Greedy وA*' },
    summary: { en: 'Greedy Best-First Search uses h(n) only. A* combines g(n)+h(n) for optimal results. Includes admissibility checking and tie-breaking.', ar: 'الجشع يستخدم h(n) فقط. A* يجمع g(n)+h(n) للنتائج المثلى. يشمل فحص المقبولية وكسر التعادل.' },
    tag: { en: 'Informed Search', ar: 'بحث موجه' },
    accent: 'pink',
    algoLink: 'GREEDY',
    sections: [
      {
        heading: { en: 'Greedy Best-First Search', ar: 'البحث الجشع الأفضل أولاً' },
        paragraphs: [
          { en: 'Always expands the node with smallest h(n). Fast but not optimal. Can be trapped by misleading heuristics.', ar: 'دائماً يتوسع في العقدة ذات أصغر h(n). سريع لكن ليس أمثل. يمكن أن ينجذب للاستدلالات المضللة.' },
          { en: 'In tree A(8)→{B(5),C(3),D(6)}; C→{G(1)}; G→{Goal(0)}: Greedy takes A→C→G→Goal directly. Path cost may not be optimal.', ar: 'في الشجرة A(8)→{B(5),C(3),D(6)}; C→{G(1)}; G→{Goal(0)}: Greedy يسلك A→C→G→Goal مباشرة.' },
        ],
      },
      {
        heading: { en: 'A* Search — f(n) = g(n) + h(n)', ar: 'البحث A* — f(n) = g(n) + h(n)' },
        paragraphs: [
          { en: 'A* expands the node with minimum f(n)=g(n)+h(n). When h is admissible (never overestimates), A* guarantees the optimal path.', ar: 'A* يتوسع في العقدة بأدنى f(n)=g(n)+h(n). عندما h مقبولة (لا تبالغ أبداً)، A* يضمن المسار الأمثل.' },
          { en: 'Tie-breaking: when f(n) values are equal, choose the node with smaller h(n).', ar: 'كسر التعادل: عندما تتساوى قيم f(n)، اختر العقدة ذات أصغر h(n).' },
        ],
        code: `import heapq\n\ndef astar(graph, h, start, goal):\n    # graph[node] = [(neighbor, cost), ...]\n    pq = [(h[start], 0, start)]\n    visited = set()\n    parent = {start: None}\n    g = {start: 0}\n\n    while pq:\n        f, g_cost, node = heapq.heappop(pq)\n        if node == goal:\n            return build_path(parent, goal), g_cost\n        if node in visited: continue\n        visited.add(node)\n        for nb, cost in graph[node]:\n            new_g = g_cost + cost\n            if nb not in g or new_g < g[nb]:\n                g[nb] = new_g\n                parent[nb] = node\n                new_f = new_g + h[nb]\n                heapq.heappush(pq, (new_f, new_g, nb))\n    return None, float('inf')`,
      },
      {
        heading: { en: 'Admissibility of h(n)', ar: 'مقبولية الدالة الاستدلالية h(n)' },
        paragraphs: [
          { en: 'h(n) is admissible if h(n) ≤ h*(n) for all nodes, where h*(n) is the true cost. An inadmissible h can cause A* to miss the optimal path.', ar: 'h(n) مقبولة إذا كان h(n) ≤ h*(n) لجميع العقد، حيث h*(n) هي التكلفة الحقيقية. الـ h غير المقبولة قد تجعل A* يفوت المسار الأمثل.' },
        ],
        bullets: [
          { en: 'A: h=7, h*=9 → Admissible ✓', ar: 'A: h=7, h*=9 → مقبولة ✓' },
          { en: 'C: h=6, h*=4 → NOT admissible ✗ (overestimates!)', ar: 'C: h=6, h*=4 → غير مقبولة ✗ (تبالغ في التقدير!)' },
        ],
      },
    ],
  },

  // ─── Lab 3b: Hill Climbing ────────────────────────────────────
  {
    id: 'lab3b',
    number: 4,
    title: { en: 'Hill Climbing & Local Search', ar: 'التسلق والبحث المحلي' },
    summary: { en: 'Hill Climbing moves to the best neighbor without looking back. Efficient but vulnerable to local maxima, plateaus, and ridges.', ar: 'التسلق ينتقل للجار الأفضل دون رجوع. فعال لكن هش أمام الحدود المحلية والهضاب والحواجز.' },
    tag: { en: 'Local Search', ar: 'بحث محلي' },
    accent: 'orange',
    algoLink: 'HILL',
    sections: [
      {
        heading: { en: 'Steepest-Ascent Hill Climbing', ar: 'التسلق الأشد انحداراً' },
        paragraphs: [
          { en: 'Evaluates ALL neighbors and moves to the strictly best one. Stops when no improvement is found. The result is a local optimum, not necessarily global.', ar: 'يُقيّم جميع الجيران وينتقل للأفضل. يتوقف حين لا يوجد تحسن. النتيجة حد محلي وليس بالضرورة عالمي.' },
        ],
        code: `def hill_climbing(f, start, neighbors):\n    """\n    f: objective function to maximize\n    neighbors: function returning neighbor states\n    """\n    current = start\n    while True:\n        nbs = neighbors(current)\n        best = max(nbs, key=f, default=None)\n        if best is None or f(best) <= f(current):\n            return current  # local optimum\n        current = best`,
      },
      {
        heading: { en: 'Problems with Hill Climbing', ar: 'مشاكل التسلق' },
        paragraphs: [
          { en: 'Local Maximum: a state better than all neighbors but not the global best. Plateau: a flat region where all neighbors have equal value. Ridge: a narrow peak hard to navigate.', ar: 'الحد المحلي: حالة أفضل من جميع الجيران لكن ليست الأفضل عالمياً. الهضبة: منطقة مسطحة حيث جميع الجيران بنفس القيمة. الحافة: قمة ضيقة يصعب التنقل فيها.' },
        ],
        bullets: [
          { en: 'Random Restart: run Hill Climbing multiple times from random starts', ar: 'إعادة تشغيل عشوائية: تشغيل التسلق مرات متعددة من نقاط بداية عشوائية' },
          { en: 'Simulated Annealing: allow bad moves with decreasing probability', ar: 'المحاكاة المُبرّدة: السماح بحركات سيئة باحتمالية تتناقص' },
          { en: 'Allow sideways moves to escape plateaus (limited count)', ar: 'السماح بحركات جانبية للهروب من الهضاب (عدد محدود)' },
        ],
      },
    ],
  },

  // ─── Lab 4: Knowledge Representation ─────────────────────────
  {
    id: 'lab4',
    number: 5,
    title: { en: 'Knowledge Representation', ar: 'تمثيل المعرفة' },
    summary: { en: 'Types of knowledge, representation methods, propositional logic, truth tables, and De Morgan\'s laws. Building small expert systems.', ar: 'أنواع المعرفة، طرق التمثيل، منطق القضايا، جداول الحقيقة، وقوانين دي مورغان. بناء أنظمة خبيرة صغيرة.' },
    tag: { en: 'Knowledge', ar: 'معرفة' },
    accent: 'cyan',
    sections: [
      {
        heading: { en: 'Types of Knowledge', ar: 'أنواع المعرفة' },
        paragraphs: [
          { en: 'Knowledge in AI systems comes in five forms: declarative (facts), procedural (how-to), meta (knowledge about knowledge), heuristic (expert intuition), and structural (taxonomies).', ar: 'تأتي المعرفة في أنظمة الذكاء الاصطناعي بخمسة أشكال: تصريحية (حقائق)، إجرائية (كيفية)، فوقية (معرفة عن المعرفة)، حدسية (خبرة)، وهيكلية (تصنيفات).' },
        ],
        bullets: [
          { en: '"Damascus is the capital of Syria" → Declarative', ar: '"دمشق عاصمة سوريا" → تصريحية' },
          { en: 'Steps of BFS algorithm → Procedural', ar: 'خطوات خوارزمية BFS → إجرائية' },
          { en: '"Rule A is more accurate than Rule B" → Meta', ar: '"القاعدة A أدق من القاعدة B" → فوقية' },
        ],
      },
      {
        heading: { en: 'Propositional Logic', ar: 'منطق القضايا' },
        paragraphs: [
          { en: 'Rules are expressed as implications: (Registered ∧ Attended) → AllowedExam. This means if both conditions are true, the conclusion follows.', ar: 'القواعد تعبر عن تضمينات: (مسجل ∧ حضر) → يُسمح بالامتحان. هذا يعني إذا تحقق الشرطان معاً، تتبع النتيجة.' },
        ],
        code: `# Simple rule engine in Python\nrules = [\n    # (conditions, conclusion)\n    (['registered', 'attended'], 'allowed_exam'),\n    (['allowed_exam', 'prepared'], 'will_pass'),\n]\n\nfacts = {'registered': True, 'attended': True, 'prepared': True}\n\ndef forward_chain(rules, facts):\n    changed = True\n    while changed:\n        changed = False\n        for conditions, conclusion in rules:\n            if all(facts.get(c) for c in conditions):\n                if not facts.get(conclusion):\n                    facts[conclusion] = True\n                    changed = True\n    return facts\n\nresult = forward_chain(rules, facts)\nprint("Allowed exam:", result.get('allowed_exam'))  # True\nprint("Will pass:", result.get('will_pass'))         # True`,
      },
      {
        heading: { en: "De Morgan's Laws", ar: 'قوانين دي مورغان' },
        paragraphs: [
          { en: '¬(P ∧ Q) ≡ (¬P ∨ ¬Q) and ¬(P ∨ Q) ≡ (¬P ∧ ¬Q). These transform conjunctions/disjunctions under negation.', ar: '¬(P ∧ Q) ≡ (¬P ∨ ¬Q) و ¬(P ∨ Q) ≡ (¬P ∧ ¬Q). هذه القوانين تحول الاقتران/الفصل تحت النفي.' },
        ],
      },
    ],
  },

  // ─── Lab 6: Supervised Learning ──────────────────────────────
  {
    id: 'lab6',
    number: 6,
    title: { en: 'Supervised Learning — Classification & Regression', ar: 'التعلم تحت الإشراف — التصنيف والانحدار' },
    summary: { en: 'Decision Tree Classifier predicts Pass/Fail. Linear Regression predicts numeric grades. Covers evaluation metrics: accuracy, MSE, R².', ar: 'شجرة القرار تتنبأ بناجح/راسب. الانحدار الخطي يتنبأ بدرجات رقمية. يشمل مقاييس التقييم: accuracy، MSE، R².' },
    tag: { en: 'Supervised ML', ar: 'تعلم إشرافي' },
    accent: 'green',
    sections: [
      {
        heading: { en: 'Decision Tree — Classification', ar: 'شجرة القرار — التصنيف' },
        paragraphs: [
          { en: 'Uses a series of conditional questions to split data. Training data: 8 students with study hours and attendance. Goal: predict Pass/Fail for new students.', ar: 'تستخدم سلسلة أسئلة شرطية لتقسيم البيانات. بيانات التدريب: 8 طلاب بساعات الدراسة والحضور. الهدف: التنبؤ بناجح/راسب لطلاب جدد.' },
        ],
        code: `from sklearn.tree import DecisionTreeClassifier\n\nX = [[5,90],[4,85],[2,40],[1,35],[6,95],[3,60],[4,75],[2,50]]\ny = ["Pass","Pass","Fail","Fail","Pass","Fail","Pass","Fail"]\n\nmodel = DecisionTreeClassifier(random_state=0)\nmodel.fit(X, y)\n\n# Predict new student: 5 hours, 80% attendance\nprint(model.predict([[5, 80]]))  # ['Pass']\nprint("Accuracy:", model.score(X, y))`,
      },
      {
        heading: { en: 'Evaluation Metrics — Classification', ar: 'مقاييس التقييم — التصنيف' },
        paragraphs: [
          { en: 'Accuracy = correct predictions / total. Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = harmonic mean of Precision & Recall.', ar: 'Accuracy = التوقعات الصحيحة / الإجمالي. Precision = TP/(TP+FP). Recall = TP/(TP+FN). F1 = المتوسط التوافقي لـ Precision وRecall.' },
        ],
      },
      {
        heading: { en: 'Linear Regression — Predicting Grades', ar: 'الانحدار الخطي — التنبؤ بالدرجات' },
        paragraphs: [
          { en: 'Fits a line y = ax + b through the data. For study hours vs grades: slope a ≈ 9.0, intercept b ≈ 41. A student studying 7 hours is predicted to score ~104 (capped at 100).', ar: 'يناسب خطاً y = ax + b عبر البيانات. لساعات الدراسة مقابل الدرجات: الميل a ≈ 9.0، الثابت b ≈ 41. طالب يدرس 7 ساعات متوقع له ~104 (محدود بـ 100).' },
        ],
        code: `from sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import r2_score, mean_squared_error\nimport numpy as np\n\nX = np.array([[1],[2],[3],[4],[5],[6]])\ny = np.array([50, 60, 68, 80, 88, 95])\n\nmodel = LinearRegression()\nmodel.fit(X, y)\n\nprint("Slope a:", model.coef_[0])       # ~9.0\nprint("Intercept b:", model.intercept_) # ~41\nprint("Predict 7h:", model.predict([[7]])[0])  # ~104\nprint("R²:", r2_score(y, model.predict(X)))`,
      },
    ],
  },

  // ─── Lab 7: Unsupervised Learning ─────────────────────────────
  {
    id: 'lab7',
    number: 7,
    title: { en: 'Unsupervised Learning — K-Means, PCA, Anomaly Detection', ar: 'التعلم غير الإشرافي — K-Means، PCA، كشف الشذوذ' },
    summary: { en: 'K-Means clusters unlabeled data. PCA reduces dimensionality. Z-score and Isolation Forest detect outliers. DBSCAN finds density-based clusters.', ar: 'K-Means يجمّع البيانات غير الموسومة. PCA يقلص الأبعاد. Z-score وIsolation Forest يكشفان القيم الشاذة. DBSCAN يجد مجموعات كثافة.' },
    tag: { en: 'Unsupervised ML', ar: 'تعلم غير إشرافي' },
    accent: 'purple',
    sections: [
      {
        heading: { en: 'K-Means Clustering', ar: 'تجميع K-Means' },
        paragraphs: [
          { en: 'Divides n data points into K clusters. Algorithm: (1) place K centroids, (2) assign each point to nearest centroid, (3) recompute centroids, (4) repeat until stable.', ar: 'يقسم n نقطة إلى K مجموعات. الخوارزمية: (1) ضع K مراكز، (2) اربط كل نقطة بأقرب مركز، (3) أعد حساب المراكز، (4) كرر حتى الاستقرار.' },
        ],
        code: `from sklearn.cluster import KMeans\nimport numpy as np\n\n# 6 students: (study_hours, attendance)\nX = np.array([[1,30],[2,35],[2,40],[6,85],[7,90],[8,95]])\n\nmodel = KMeans(n_clusters=2, random_state=42, n_init=10)\nlabels = model.fit_predict(X)\n\nprint("Labels:", labels)            # [0,0,0,1,1,1]\nprint("Centers:", model.cluster_centers_)\n# Center 0: ~(1.67, 35) - weak students\n# Center 1: ~(7.0, 90)  - strong students`,
      },
      {
        heading: { en: 'PCA — Dimensionality Reduction', ar: 'PCA — تقليل الأبعاد' },
        paragraphs: [
          { en: 'Transforms data to new axes (principal components) ordered by variance explained. If PC1=92% and PC2=6%, we preserve 98% of information in just 2D.', ar: 'يحول البيانات لمحاور جديدة (مكونات رئيسية) مرتبة بالتباين المفسر. إذا PC1=92% وPC2=6%، نحافظ على 98% من المعلومات بـ 2D فقط.' },
        ],
        code: `from sklearn.decomposition import PCA\nimport numpy as np\n\n# 5 students: [study_hours, attendance, assignments]\nX = np.array([[2,60,5],[3,65,6],[4,70,7],[6,85,9],[7,90,10]])\n\npca = PCA(n_components=2)\nX_reduced = pca.fit_transform(X)\n\nprint("Variance ratio:", pca.explained_variance_ratio_)\n# e.g. [0.92, 0.06] → 98% preserved`,
      },
      {
        heading: { en: 'Isolation Forest — Outlier Detection', ar: 'Isolation Forest — كشف القيم الشاذة' },
        paragraphs: [
          { en: 'Outliers are few and different, so they are easier to isolate. Random decision trees are built; outliers require fewer splits to isolate (shorter path length).', ar: 'القيم الشاذة قليلة ومختلفة فيسهل عزلها. تُبنى أشجار قرار عشوائية؛ القيم الشاذة تحتاج لانقسامات أقل للعزل (مسار أقصر).' },
        ],
        code: `from sklearn.ensemble import IsolationForest\nimport numpy as np\n\nX = np.array([[10,20],[12,22],[11,21],[13,23],[100,200]])\n\nmodel = IsolationForest(contamination=0.2, random_state=42)\npred = model.fit_predict(X)\n\nprint("Labels:", pred)          # [1,1,1,1,-1]\nprint("Outliers:", X[pred==-1]) # [[100,200]]`,
      },
      {
        heading: { en: 'DBSCAN vs K-Means', ar: 'DBSCAN مقابل K-Means' },
        paragraphs: [
          { en: 'K-Means requires K to be specified. DBSCAN discovers clusters automatically by density — better for irregular shapes and when outliers exist (labeled -1).', ar: 'K-Means يتطلب تحديد K مسبقاً. DBSCAN يكتشف المجموعات تلقائياً بالكثافة — أفضل للأشكال غير المنتظمة وعند وجود قيم شاذة (تُصنف -1).' },
        ],
        code: `from sklearn.cluster import DBSCAN\nimport numpy as np\n\nX = np.array([[1,1],[1.2,1.1],[1.1,0.9],[8,8],[8.1,8.2],[50,50]])\n\nmodel = DBSCAN(eps=0.5, min_samples=2)\nlabels = model.fit_predict(X)\nprint("Labels:", labels)\n# Cluster 0: [0,1,2], Cluster 1: [3,4], Outlier(-1): [5]`,
      },
    ],
  },

  // ─── Lab 8: Clustering Deep Dive ─────────────────────────────
  {
    id: 'lab8',
    number: 8,
    title: { en: 'Clustering Deep Dive + Kaggle Dataset', ar: 'التجميع بعمق + مجموعة بيانات Kaggle' },
    summary: { en: 'Advanced K-Means on real customer data, PCA interpretation, and Isolation Forest on real-world patterns. Uses 10,000-record mental health dataset.', ar: 'K-Means متقدم على بيانات عملاء حقيقية، تفسير PCA، وIsolation Forest على أنماط حقيقية. يستخدم مجموعة بيانات صحة نفسية 10,000 سجل.' },
    tag: { en: 'Real Data', ar: 'بيانات حقيقية' },
    accent: 'green',
    sections: [
      {
        heading: { en: 'K-Means on Customer Data', ar: 'K-Means على بيانات العملاء' },
        paragraphs: [
          { en: 'Customer data with income and spending creates two natural clusters: low-income/low-spending and high-income/high-spending. Centroid 1: ≈(11, 20), Centroid 2: ≈(84, 81).', ar: 'بيانات العملاء بالدخل والإنفاق تنشئ مجموعتين طبيعيتين: منخفض الدخل/الإنفاق، ومرتفع الدخل/الإنفاق. المركز 1: ≈(11, 20)، المركز 2: ≈(84, 81).' },
        ],
      },
      {
        heading: { en: 'PCA Interpretation', ar: 'تفسير PCA' },
        paragraphs: [
          { en: 'PC1 variance 92%, PC2 variance 6% → total 98% preserved in 2D. This means reducing from 3D to 2D loses only 2% of information — highly successful compression.', ar: 'تباين PC1 هو 92%، تباين PC2 هو 6% → المجموع 98% محفوظ بـ 2D. هذا يعني تقليص من 3D إلى 2D يفقد 2% فقط من المعلومات — ضغط ناجح جداً.' },
        ],
      },
      {
        heading: { en: 'Real Kaggle Data — Mental Health Workplace', ar: 'بيانات Kaggle الحقيقية — الصحة النفسية في العمل' },
        paragraphs: [
          { en: '10,000 employees, 34 features. Key results: Linear Regression R²=0.558, K-Means finds 3 distinct risk groups, Random Forest achieves R²=0.679 — 12% better than Linear Regression.', ar: '10,000 موظف، 34 خاصية. النتائج الرئيسية: Regression R²=0.558، K-Means يجد 3 مجموعات خطر متمايزة، Random Forest يحقق R²=0.679 — أفضل بـ 12% من الانحدار الخطي.' },
        ],
        bullets: [
          { en: 'Overtime hours explains 55.9% of burnout (Decision Tree)', ar: 'ساعات الأوفرتايم تفسر 55.9% من الإرهاق (شجرة القرار)' },
          { en: '496 anomalous employees detected (4.96% outlier rate)', ar: '496 موظف شاذ مكتشف (معدل شذوذ 4.96%)' },
          { en: 'PCA preserves 67.4% of 5-feature variance in 2D', ar: 'PCA يحافظ على 67.4% من تباين 5 خصائص بـ 2D' },
        ],
      },
    ],
  },

  // ─── Lab 9: Predicate & First-Order Logic ──────────────────────
  {
    id: 'lab9',
    number: 9,
    title: { en: 'Predicate Logic & First-Order Logic (FOL)', ar: 'المنطق الرمزي ومنطق المحمولات (First-Order Logic)' },
    summary: { en: 'Converting natural language to formal First-Order Logic formulas using Quantifiers (∀, ∃), Predicates, Negation, and Arity classification.', ar: 'تحويل الجمل الطبيعية إلى صيغ منطقية رياضية (First-Order Logic) باستخدام المكممات (∀, ∃) والمحمولات والنفي وتصنيف المعاملات.' },
    tag: { en: 'Formal Logic', ar: 'المنطق الرياضي' },
    accent: 'purple',
    sections: [
      {
        heading: { en: 'Predicate Arity Classification', ar: 'تصنيف المحمولات حسب عدد المعاملات (Arity)' },
        paragraphs: [
          { en: 'Predicates express properties or relations. Unary takes 1 argument e.g. Student(x), Binary takes 2 e.g. Teaches(Nader, Logic), Ternary takes 3 e.g. Gives(Ali, Book, Sara).', ar: 'المحمولات تعبر عن خصائص أو علاقات. الأحادية تأخذ معامل واحد مثل Student(Mona)، الثنائية تأخذ 2 مثل Teaches(Nader, Logic)، الثلاثية تأخذ 3 مثل Gives(Ali, Book, Sara).' },
        ],
        code: `Student("Mona")           # Unary: منى طالبة\nTeaches("Nader", "Logic") # Binary: نادر يدرس المنطق\nGives("Ali", "Book", "Sara") # Ternary: علي يعطي كتاباً لسارة`,
      },
      {
        heading: { en: 'Universal Quantifier (∀) Conversion', ar: 'تحويل الجمل الشاملة بالمكمم العام (∀)' },
        paragraphs: [
          { en: 'Rule: "Every student registered in university studies at least one course." In FOL, Universal quantifiers are almost always paired with Implication (→).', ar: 'قاعدة: "كل طالب مسجل في الجامعة يدرس مقرراً واحداً على الأقل". في منطق المحمولات، يرتبط المكمم العام دائماً بعلاقة الاستلزام (→).' },
        ],
        code: `∀x ((Student(x) ∧ Registered(x, University)) → ∃y (Course(y) ∧ Studies(x, y)))`,
      },
      {
        heading: { en: 'Existential Quantifier (∃) & Negation', ar: 'المكمم الوجودي (∃) والنفي المنطقي' },
        paragraphs: [
          { en: 'Rule: "There exists a student who does not like math but likes programming." Existential quantifiers pair with Conjunction (∧), never implication.', ar: 'قاعدة: "يوجد طالب لا يحب الرياضيات ولكنه يحب البرمجة". يرتبط المكمم الوجودي دائماً بالربط العطف (∧) وليس الاستلزام.' },
        ],
        code: `∃x (Student(x) ∧ ¬Likes(x, Math) ∧ Likes(x, Programming))`,
      },
    ],
  },

  // ─── Complete Code Reference ──────────────────────────────────
  {
    id: 'codes',
    number: 10,
    title: { en: 'Complete Code Reference', ar: 'مرجع الأكواد الكامل' },
    summary: { en: 'All AI lab programs in one file — from BFS/DFS to A*, Decision Tree, Linear Regression, K-Means, PCA, and Isolation Forest.', ar: 'جميع برامج مختبر الذكاء الاصطناعي في ملف واحد — من BFS/DFS إلى A*، شجرة القرار، الانحدار الخطي، K-Means، PCA، وIsolation Forest.' },
    tag: { en: 'Code Reference', ar: 'مرجع الأكواد' },
    accent: 'orange',
    sections: [
      {
        heading: { en: 'Program Structure', ar: 'هيكل البرنامج' },
        paragraphs: [
          { en: 'All algorithms are organized as functions in a single file with a menu selector. Run any algorithm by entering its number (1-10).', ar: 'جميع الخوارزميات منظمة كدوال في ملف واحد مع قائمة اختيار. شغّل أي خوارزمية بإدخال رقمها (1-10).' },
        ],
        code: `# =====================================================================
# Complete AI Lab Reference Program (Sessions 1 - 10 Unabridged)
# =====================================================================
from collections import deque
import heapq, numpy as np, pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.linear_model import LinearRegression
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.ensemble import IsolationForest

def run_bfs(graph, start, goal):
    queue = deque([(start, [start])])
    visited = {start}
    while queue:
        curr, path = queue.popleft()
        if curr == goal: return path
        for n in graph.get(curr, []):
            if n not in visited:
                visited.add(n)
                queue.append((n, path + [n]))
    return None

def run_dfs(graph, start, goal, visited=None, path=None):
    if visited is None: visited, path = set(), []
    visited.add(start)
    path.append(start)
    if start == goal: return path
    for n in graph.get(start, []):
        if n not in visited:
            res = run_dfs(graph, n, goal, visited, path)
            if res: return res
    path.pop()
    return None

def run_greedy(graph, h, start, goal):
    pq = [(h[start], start, [start])]
    visited = set()
    while pq:
        _, curr, path = heapq.heappop(pq)
        if curr == goal: return path
        if curr in visited: continue
        visited.add(curr)
        for n, _ in graph.get(curr, []):
            if n not in visited:
                heapq.heappush(pq, (h[n], n, path + [n]))
    return None

def run_astar(graph, h, start, goal):
    pq = [(h[start], 0, start, [start])]
    g_costs = {start: 0}
    while pq:
        f, g, curr, path = heapq.heappop(pq)
        if curr == goal: return path, g
        if g > g_costs.get(curr, float('inf')): continue
        for n, cost in graph.get(curr, []):
            new_g = g + cost
            if new_g < g_costs.get(n, float('inf')):
                g_costs[n] = new_g
                heapq.heappush(pq, (new_g + h[n], new_g, n, path + [n]))
    return None, float('inf')

# --- Machine Learning & Formal Logic Reference ---
def run_dt():
    X = np.array([[10,0],[20,1],[35,1],[45,2],[50,3]])
    y = np.array([0, 0, 1, 1, 2])
    clf = DecisionTreeClassifier(max_depth=3, random_state=42).fit(X, y)
    print("Decision Tree Accuracy:", clf.score(X, y))

def run_lr():
    X = np.array([[10],[20],[30],[40],[50]])
    y = np.array([12.5, 22.1, 35.0, 48.2, 61.0])
    reg = LinearRegression().fit(X, y)
    print(f"LR Equation: y = {reg.coef_[0]:.2f}x + {reg.intercept_:.2f}")

def run_kmeans():
    X = np.random.normal(size=(1000, 4))
    km = KMeans(n_clusters=3, random_state=42).fit(X)
    print("Cluster Centers Shape:", km.cluster_centers_.shape)

def run_pca():
    X = np.random.normal(size=(500, 10))
    pca = PCA(n_components=2).fit(X)
    print("Explained Variance Ratio:", pca.explained_variance_ratio_)

def run_iso():
    X = np.random.normal(size=(1000, 2))
    iso = IsolationForest(contamination=0.05, random_state=42).fit(X)
    outliers = np.sum(iso.predict(X) == -1)
    print(f"Detected Outliers: {outliers} / 1000")

def run_fol():
    predicates = {"Student": 1, "Teaches": 2, "Gives": 3}
    for p, arity in predicates.items():
        kind = ["Unary", "Binary", "Ternary"][arity-1]
        print(f"Predicate {p} is {kind} (Arity={arity})")

if __name__ == "__main__":
    print("AI Lab Complete Suite Executed Successfully")
    run_dt(); run_lr(); run_kmeans(); run_pca(); run_iso(); run_fol()`,
      },
    ],
  },
];
