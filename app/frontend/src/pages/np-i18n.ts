export type Lang = 'en' | 'ar';
export type Theme = 'dark' | 'light';

export type Dict = {
  brand: string;
  tagline: string;
  algorithms: string;
  liveStats: string;
  gridVisualizer: string;
  openGrid: string;
  gridHint: string;

  statAlgorithm: string;
  statExplored: string;
  statPath: string;
  statStatus: string;

  statusRunning: string;
  statusDone: string;
  statusIdle: string;
  statusPaused: string;

  interactiveLearning: string;
  runtimeOnline: string;

  sectionExplanation: string;
  sectionPython: string;
  sectionGraph: string;

  propComplete: string;
  propOptimal: string;
  propTime: string;
  propSpace: string;
  controlFlow: string;

  copy: string;
  copied: string;

  graphNodes: string;
  graphEdges: string;
  btnRun: string;
  btnPause: string;
  btnReset: string;
  btnNewGraph: string;
  btnPlay: string;
  btnRandom: string;
  btnClear: string;
  speed: string;

  queueLabel: string;
  stackLabel: string;
  priorityLabel: string;
  hintQueue: string;
  hintStack: string;
  hintPriority: string;

  telemetry: string;
  tStatus: string;
  tExplored: string;
  tPath: string;
  tEfficiency: string;

  pillIdle: string;
  pillSearching: string;
  pillPathFound: string;
  pillNoPath: string;

  legend: string;
  legStart: string;
  legGoal: string;
  legWall: string;
  legExplored: string;
  legPath: string;

  drawerTitle: string;
  controls: string;

  empty: string;

  footerLeft: string;
  footerRight: string;

  author: string;
  role: string;
  portfolio: string;
  instagram: string;
  github: string;

  light: string;
  dark: string;
  langToggle: string;

  algoBFS: string;
  algoDFS: string;
  algoGreedy: string;
  algoHill: string;

  // Descriptions
  bfsDesc1: string; bfsDesc2: string; bfsDesc3: string;
  dfsDesc1: string; dfsDesc2: string; dfsDesc3: string;
  greDesc1: string; greDesc2: string; greDesc3: string;
  hilDesc1: string; hilDesc2: string; hilDesc3: string;
  algoASTAR: string;
  astarDesc1: string; astarDesc2: string; astarDesc3: string;
};

export const DICTS: Record<Lang, Dict> = {
  en: {
    brand: 'Neural Pathfinder',
    tagline: 'AI Search Engine v1.0',
    algorithms: 'Algorithms',
    liveStats: 'Live Stats',
    gridVisualizer: 'Grid Visualizer',
    openGrid: '▶ Open Grid',
    gridHint: 'Draw walls, place S/G, and run the selected algorithm on a 12×12 grid.',

    statAlgorithm: 'Algorithm',
    statExplored: 'Explored',
    statPath: 'Path',
    statStatus: 'Status',

    statusRunning: 'RUNNING',
    statusDone: 'DONE',
    statusIdle: 'IDLE',
    statusPaused: 'PAUSED',

    interactiveLearning: '// Interactive Learning Interface',
    runtimeOnline: 'Runtime Online',

    sectionExplanation: 'Explanation',
    sectionPython: 'Python Implementation',
    sectionGraph: 'Graph Traversal',

    propComplete: 'Complete',
    propOptimal: 'Optimal',
    propTime: 'Time',
    propSpace: 'Space',
    controlFlow: 'Control Flow',

    copy: '⧉ Copy',
    copied: '✓ Copied',

    graphNodes: 'Nodes',
    graphEdges: 'Edges',
    btnRun: '▶ Run',
    btnPause: '⏸ Pause',
    btnReset: '↺ Reset',
    btnNewGraph: '⟳ New Graph',
    btnPlay: '▶ Play',
    btnRandom: '⟳ Random',
    btnClear: '✕ Clear',
    speed: '⚡ Speed',

    queueLabel: 'QUEUE',
    stackLabel: 'STACK',
    priorityLabel: 'PRIORITY QUEUE',
    hintQueue: 'FIFO · first in · first out',
    hintStack: 'LIFO · last in · first out',
    hintPriority: 'Ordered by h(n) — closest first',

    telemetry: 'Telemetry',
    tStatus: 'Status',
    tExplored: 'Explored',
    tPath: 'Path',
    tEfficiency: 'Efficiency',

    pillIdle: 'IDLE',
    pillSearching: 'SEARCHING',
    pillPathFound: 'PATH FOUND',
    pillNoPath: 'NO PATH',

    legend: 'Legend',
    legStart: 'START',
    legGoal: 'GOAL',
    legWall: 'WALL',
    legExplored: 'EXPLORED',
    legPath: 'PATH',

    drawerTitle: '// Grid Visualizer',
    controls: 'Controls',

    empty: '(empty)',

    footerLeft: 'Powered by classical AI search theory',
    footerRight: 'Animated trace · live frontier · deterministic',

    author: 'Abdulmoin Hablas',
    role: 'AI & Software Engineer',
    portfolio: 'Portfolio',
    instagram: 'Instagram',
    github: 'GitHub',

    light: 'Light',
    dark: 'Dark',
    langToggle: 'العربية',

    algoBFS: 'Breadth-First Search',
    algoDFS: 'Depth-First Search',
    algoGreedy: 'Greedy Best-First',
    algoHill: 'Hill Climbing',

    bfsDesc1: 'Breadth-First Search (BFS) explores the search space one level at a time. Starting from the initial node, it visits every direct neighbor before moving deeper.',
    bfsDesc2: 'It uses a FIFO queue to track the frontier. On an unweighted graph, the first time BFS reaches the goal it is guaranteed to be via the shortest path.',
    bfsDesc3: 'BFS is a classic uninformed search — it has no knowledge of where the goal is and simply expands outward uniformly.',

    dfsDesc1: 'Depth-First Search (DFS) follows a single branch as deep as possible before backtracking. It uses a LIFO stack (or recursion) to manage the frontier.',
    dfsDesc2: 'DFS is memory-efficient and explores boldly, but it does not guarantee an optimal path — it returns the first path it stumbles upon.',
    dfsDesc3: 'On finite graphs it is complete; on infinite ones without a depth limit it can loop forever on a single branch.',

    greDesc1: 'Greedy Best-First Search uses a heuristic h(n) to estimate how close a node is to the goal, and always expands the node that looks best right now.',
    greDesc2: 'A priority queue orders the frontier by the heuristic. For grids, the Manhattan distance |dx| + |dy| is a typical h(n).',
    greDesc3: 'Greedy is fast and often finds a reasonable path quickly — but it is not optimal: it can be lured down promising-looking dead ends.',


    algoASTAR: 'A* Search',
    astarDesc1: 'A* (A-star) combines actual path cost g(n) with a heuristic estimate h(n) to produce f(n) = g(n) + h(n). It always expands the node with the lowest f(n).',
    astarDesc2: 'When the heuristic is admissible — it never overestimates the true cost — A* is both complete and optimal, guaranteeing the shortest path every time.',
    astarDesc3: 'On a 2D grid, Manhattan distance is admissible. A* is the algorithm behind GPS navigation, game AI pathfinding, and robotics motion planning.',

    hilDesc1: 'Hill Climbing is a local search algorithm: it repeatedly moves to the neighbor with the best heuristic value, never looking back.',
    hilDesc2: 'The steepest-ascent variant evaluates all neighbors and picks the strictly better one. If no neighbor improves h(n), the search halts — even if the true goal has not been reached.',
    hilDesc3: 'This makes Hill Climbing fast and memory-light, but vulnerable to local optima, plateaus, and ridges. It is the foundation for variants like simulated annealing.',
  },
  ar: {
    brand: 'المستكشف العصبي',
    tagline: 'محرك البحث الذكي · الإصدار 1.0',
    algorithms: 'الخوارزميات',
    liveStats: 'إحصائيات حيّة',
    gridVisualizer: 'مُحاكي الشبكة',
    openGrid: '▶ فتح الشبكة',
    gridHint: 'ارسم الجدران، حدّد البداية والهدف، ثم شغّل الخوارزمية على شبكة 12×12.',

    statAlgorithm: 'الخوارزمية',
    statExplored: 'المُستكشَف',
    statPath: 'المسار',
    statStatus: 'الحالة',

    statusRunning: 'قيد التشغيل',
    statusDone: 'مُكتمل',
    statusIdle: 'خامل',
    statusPaused: 'متوقّف',

    interactiveLearning: '// واجهة تعلّم تفاعلية',
    runtimeOnline: 'النظام يعمل',

    sectionExplanation: 'الشرح',
    sectionPython: 'تنفيذ بايثون',
    sectionGraph: 'اجتياز الرسم البياني',

    propComplete: 'مكتمل',
    propOptimal: 'أمثل',
    propTime: 'الزمن',
    propSpace: 'الذاكرة',
    controlFlow: 'تدفّق التحكم',

    copy: '⧉ نسخ',
    copied: '✓ تمّ النسخ',

    graphNodes: 'العُقد',
    graphEdges: 'الحواف',
    btnRun: '▶ تشغيل',
    btnPause: '⏸ إيقاف',
    btnReset: '↺ إعادة',
    btnNewGraph: '⟳ رسم جديد',
    btnPlay: '▶ تشغيل',
    btnRandom: '⟳ عشوائي',
    btnClear: '✕ مسح',
    speed: '⚡ السرعة',

    queueLabel: 'الطابور',
    stackLabel: 'المكدّس',
    priorityLabel: 'طابور الأولوية',
    hintQueue: 'FIFO · الأول دخولاً هو الأول خروجاً',
    hintStack: 'LIFO · الأخير دخولاً هو الأول خروجاً',
    hintPriority: 'مُرتّب حسب h(n) — الأقرب أولاً',

    telemetry: 'المقاييس',
    tStatus: 'الحالة',
    tExplored: 'المُستكشَف',
    tPath: 'المسار',
    tEfficiency: 'الكفاءة',

    pillIdle: 'خامل',
    pillSearching: 'يبحث',
    pillPathFound: 'تمّ العثور',
    pillNoPath: 'لا يوجد مسار',

    legend: 'الدليل',
    legStart: 'البداية',
    legGoal: 'الهدف',
    legWall: 'جدار',
    legExplored: 'مُستكشَف',
    legPath: 'المسار',

    drawerTitle: '// مُحاكي الشبكة',
    controls: 'عناصر التحكم',

    empty: '(فارغ)',

    footerLeft: 'مدعوم بنظرية البحث الكلاسيكية للذكاء الاصطناعي',
    footerRight: 'تتبّع متحرّك · حدود حيّة · نتائج حتميّة',

    author: 'عبدالمعين حبلص',
    role: 'مهندس ذكاء اصطناعي وبرمجيات',
    portfolio: 'البورتفوليو',
    instagram: 'إنستغرام',
    github: 'غيت هب',

    light: 'نهاري',
    dark: 'ليلي',
    langToggle: 'English',

    algoBFS: 'البحث بالعرض',
    algoDFS: 'البحث بالعمق',
    algoGreedy: 'الجشع الأفضل أولاً',
    algoHill: 'التسلّق',

    bfsDesc1: 'خوارزمية البحث بالعرض (BFS) تستكشف فضاء البحث مستوى تلو الآخر. تبدأ من العُقدة الابتدائية وتزور جميع الجيران المباشرين قبل الانتقال للأعمق.',
    bfsDesc2: 'تستخدم طابوراً بنمط FIFO لتتبّع الحدود. في الرسم غير الموزون، أول مسار تصل به BFS إلى الهدف مضمون أنه الأقصر.',
    bfsDesc3: 'BFS بحث غير مُعلَم كلاسيكي — لا تملك أي معرفة بموقع الهدف وتتوسّع بشكل موحّد للخارج.',

    dfsDesc1: 'خوارزمية البحث بالعمق (DFS) تتبع فرعاً واحداً إلى أقصى عمق ممكن قبل التراجع، وتستخدم مكدّساً بنمط LIFO (أو الاستدعاء الذاتي) لإدارة الحدود.',
    dfsDesc2: 'DFS مُوفّرة للذاكرة وتستكشف بجرأة، لكنها لا تضمن مساراً أمثل — تُعيد أول مسار تصادفه.',
    dfsDesc3: 'على الرسوم المحدودة فهي كاملة؛ أما على الرسوم اللامحدودة دون حدّ للعمق فقد تبقى في فرع واحد إلى الأبد.',

    greDesc1: 'البحث الجشع الأفضل أولاً يستخدم استدلالاً h(n) لتقدير قرب العُقدة من الهدف، ويوسّع دائماً العُقدة التي تبدو الأفضل الآن.',
    greDesc2: 'يرتّب طابور الأولوية الحدود وفق الاستدلال. في الشبكات تُعدّ مسافة مانهاتن |dx| + |dy| خياراً شائعاً لـ h(n).',
    greDesc3: 'الجشع سريع وغالباً ما يجد مساراً معقولاً بسرعة — لكنه ليس أمثل: قد ينجذب إلى طرق تبدو واعدة لكنها طرق مسدودة.',


    algoASTAR: 'بحث A*',
    astarDesc1: 'A* تجمع بين تكلفة المسار الفعلية g(n) وتقدير الاستدلال h(n) لإنتاج f(n) = g(n) + h(n). دائماً توسّع العُقدة ذات أدنى f(n).',
    astarDesc2: 'عندما يكون الاستدلال مقبولاً — لا يُبالغ في تقدير التكلفة الحقيقية — فإن A* مكتملة وأمثل في آنٍ واحد، وتضمن أقصر مسار في كل مرة.',
    astarDesc3: 'في الشبكة الثنائية الأبعاد، مسافة مانهاتن هي استدلال مقبول. A* هي الخوارزمية خلف تطبيقات GPS وذكاء الألعاب والروبوتات.',

    hilDesc1: 'التسلّق خوارزمية بحث محلّي: تنتقل مراراً إلى الجار الأفضل استدلالياً، دون أن تنظر وراءها.',
    hilDesc2: 'النسخة الأكثر انحداراً تُقيّم جميع الجيران وتختار الأفضل حقيقياً. إن لم يُحسّن أي جار h(n)، يتوقّف البحث — حتى لو لم يُبلغ الهدف فعلياً.',
    hilDesc3: 'هذا يجعل التسلّق سريعاً وخفيف الذاكرة، لكنه هشّ أمام الحدود المحلّية والهِضاب والحواجز. وهو أساس لمتغيّرات كالمحاكاة المُبرّدة.',
  },
};

export function getSavedLang(): Lang {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem('np-lang');
  if (saved === 'ar' || saved === 'en') return saved;
  return 'en';
}

export function getSavedTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem('np-theme');
  if (saved === 'light' || saved === 'dark') return saved;
  return 'dark';
}

export function applyDocumentLang(lang: Lang) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('lang', lang);
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
}

export function applyDocumentTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', theme);
}