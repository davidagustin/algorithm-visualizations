import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const detonateMaximumBombs: AlgorithmDefinition = {
  id: 'detonate-maximum-bombs',
  title: 'Detonate the Maximum Bombs',
  leetcodeNumber: 2101,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a list of bombs where each bomb is [x, y, radius], find the maximum number of bombs that can be detonated by triggering one bomb. When bomb A is detonated, it detonates bomb B if B is within A\'s blast radius. Build a directed graph and use BFS/DFS from each bomb to count reachable bombs.',
  tags: ['graph', 'bfs', 'dfs', 'geometry', 'chain reaction'],

  code: {
    pseudocode: `function maximumDetonation(bombs):
  n = bombs.length
  build directed graph: edge a->b if b is in radius of a
    dist(a,b)^2 <= a.radius^2
  maxCount = 0
  for each bomb i:
    count = BFS(i, graph)
    maxCount = max(maxCount, count)
  return maxCount`,

    python: `def maximumDetonation(bombs):
    n = len(bombs)
    adj = [[] for _ in range(n)]
    for i in range(n):
        xi, yi, ri = bombs[i]
        for j in range(n):
            if i == j: continue
            xj, yj, _ = bombs[j]
            if (xi-xj)**2 + (yi-yj)**2 <= ri**2:
                adj[i].append(j)
    def bfs(start):
        visited = {start}
        queue = deque([start])
        while queue:
            node = queue.popleft()
            for nb in adj[node]:
                if nb not in visited:
                    visited.add(nb)
                    queue.append(nb)
        return len(visited)
    return max(bfs(i) for i in range(n))`,

    javascript: `function maximumDetonation(bombs) {
  const n = bombs.length;
  const adj = Array.from({length: n}, () => []);
  for (let i = 0; i < n; i++) {
    const [xi, yi, ri] = bombs[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const [xj, yj] = bombs[j];
      if ((xi-xj)**2 + (yi-yj)**2 <= ri**2) adj[i].push(j);
    }
  }
  function bfs(start) {
    const visited = new Set([start]);
    const queue = [start];
    while (queue.length) {
      const node = queue.shift();
      for (const nb of adj[node]) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb); }
      }
    }
    return visited.size;
  }
  return Math.max(...Array.from({length: n}, (_, i) => bfs(i)));
}`,

    java: `public int maximumDetonation(int[][] bombs) {
    int n = bombs.length;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int i = 0; i < n; i++) {
        long xi = bombs[i][0], yi = bombs[i][1], ri = bombs[i][2];
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            long xj = bombs[j][0], yj = bombs[j][1];
            if ((xi-xj)*(xi-xj) + (yi-yj)*(yi-yj) <= ri*ri) adj.get(i).add(j);
        }
    }
    int max = 0;
    for (int i = 0; i < n; i++) max = Math.max(max, bfs(i, adj));
    return max;
}`,
  },

  defaultInput: {
    bombs: [2, 1, 3, 6, 1, 4, 3, 8, 2],
  },

  inputFields: [
    {
      name: 'bombs',
      label: 'Bombs (x,y,radius flattened)',
      type: 'array',
      defaultValue: [2, 1, 3, 6, 1, 4, 3, 8, 2],
      placeholder: '2,1,3,6,1,4,3,8,2',
      helperText: 'Triplets [x1,y1,r1,x2,y2,r2,...] for each bomb',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.bombs as number[];
    const steps: AlgorithmStep[] = [];

    const bombs: [number, number, number][] = [];
    for (let i = 0; i + 2 < flat.length; i += 3) {
      bombs.push([flat[i], flat[i + 1], flat[i + 2]]);
    }

    const n = bombs.length;
    if (n === 0) return steps;

    const radii = bombs.map(b => b[2]);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: radii,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `${n} bombs. Build directed graph: edge A->B if bomb B is within A radius. Array shows radii: [${radii.join(', ')}].`,
      variables: { n, bombs: bombs.map(b => `(${b[0]},${b[1]},r=${b[2]})`).join(' ') },
      visualization: makeViz({}, {}),
    });

    // Build adjacency
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      const [xi, yi, ri] = bombs[i];
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const [xj, yj] = bombs[j];
        const dist2 = (xi - xj) ** 2 + (yi - yj) ** 2;
        if (dist2 <= ri * ri) {
          adj[i].push(j);
        }
      }
    }

    for (let i = 0; i < n; i++) {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[i] = 'active';
      lb[i] = `r=${bombs[i][2]}`;
      for (const j of adj[i]) {
        hl[j] = 'comparing';
        lb[j] = 'in range';
      }

      steps.push({
        line: 3,
        explanation: `Bomb ${i} at (${bombs[i][0]},${bombs[i][1]}) with radius ${bombs[i][2]} can detonate: [${adj[i].join(', ')}].`,
        variables: { bomb: i, neighbors: adj[i].join(',') },
        visualization: makeViz(hl, lb),
      });
    }

    let maxCount = 0;
    let bestBomb = 0;

    for (let start = 0; start < n; start++) {
      const visited = new Set<number>([start]);
      const queue: number[] = [start];

      while (queue.length > 0) {
        const node = queue.shift()!;
        for (const nb of adj[node]) {
          if (!visited.has(nb)) {
            visited.add(nb);
            queue.push(nb);
          }
        }
      }

      const count = visited.size;
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'found'; lb[v] = 'det'; }
      hl[start] = 'active';
      lb[start] = `start: ${count}`;

      steps.push({
        line: 6,
        explanation: `Detonate bomb ${start}: chain reaction detonates ${count} bombs. Current max: ${Math.max(maxCount, count)}.`,
        variables: { startBomb: start, detonated: count, maxSoFar: Math.max(maxCount, count) },
        visualization: makeViz(hl, lb),
      });

      if (count > maxCount) {
        maxCount = count;
        bestBomb = start;
      }
    }

    const finalHl: Record<number, string> = {};
    finalHl[bestBomb] = 'sorted';

    steps.push({
      line: 7,
      explanation: `Maximum detonations: ${maxCount} bombs when starting from bomb ${bestBomb}.`,
      variables: { result: maxCount, bestStartBomb: bestBomb },
      visualization: makeViz(finalHl, { [bestBomb]: `max=${maxCount}` }),
    });

    return steps;
  },
};

export default detonateMaximumBombs;
