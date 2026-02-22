import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const asFarFromLandAsPossible: AlgorithmDefinition = {
  id: 'as-far-from-land-as-possible',
  title: 'As Far from Land as Possible',
  leetcodeNumber: 1162,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n grid where 0 is water and 1 is land, find a water cell such that its Manhattan distance to the nearest land cell is maximized. Uses multi-source BFS starting from all land cells simultaneously, expanding outward. The last water cell reached has the maximum distance.',
  tags: ['graph', 'bfs', 'multi-source bfs', 'shortest path', 'matrix'],

  code: {
    pseudocode: `function maxDistance(grid):
  n = grid size
  queue = all land cells with distance 0
  if no land or no water: return -1
  maxDist = -1
  while queue not empty:
    r, c, dist = queue.dequeue()
    for each direction (nr, nc):
      if valid water cell:
        grid[nr][nc] = dist+1  // mark visited
        maxDist = dist+1
        queue.enqueue(nr, nc, dist+1)
  return maxDist`,

    python: `def maxDistance(grid):
    n = len(grid)
    queue = deque()
    for r in range(n):
        for c in range(n):
            if grid[r][c] == 1:
                queue.append((r, c, 0))
    if not queue or len(queue) == n*n:
        return -1
    maxDist = -1
    while queue:
        r, c, dist = queue.popleft()
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<n and 0<=nc<n and grid[nr][nc]==0:
                grid[nr][nc] = dist+1
                maxDist = dist+1
                queue.append((nr,nc,dist+1))
    return maxDist`,

    javascript: `function maxDistance(grid) {
  const n = grid.length;
  const queue = [];
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1) queue.push([r, c, 0]);
  if (queue.length === 0 || queue.length === n*n) return -1;
  let maxDist = -1;
  while (queue.length) {
    const [r, c, dist] = queue.shift();
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===0) {
        grid[nr][nc] = dist+1;
        maxDist = dist+1;
        queue.push([nr,nc,dist+1]);
      }
    }
  }
  return maxDist;
}`,

    java: `public int maxDistance(int[][] grid) {
    int n = grid.length;
    Queue<int[]> queue = new LinkedList<>();
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++)
            if (grid[r][c] == 1) queue.add(new int[]{r, c, 0});
    if (queue.isEmpty() || queue.size() == n*n) return -1;
    int maxDist = -1;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        for (int[] d : dirs) {
            int nr=curr[0]+d[0], nc=curr[1]+d[1];
            if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]==0) {
                grid[nr][nc] = curr[2]+1;
                maxDist = curr[2]+1;
                queue.add(new int[]{nr,nc,curr[2]+1});
            }
        }
    }
    return maxDist;
}`,
  },

  defaultInput: {
    grid: [1, 0, 1, 0, 0, 0, 1, 0, 1],
    n: 3,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 0, 0, 1, 0, 1],
      placeholder: '1,0,1,0,0,0,1,0,1',
      helperText: 'Flattened NxN grid (1=land, 0=water)',
    },
    {
      name: 'n',
      label: 'Grid Size N',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatGrid = input.grid as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const grid = flatGrid.slice(0, n * n);
    while (grid.length < n * n) grid.push(0);
    const g = [...grid]; // working copy

    const queue: [number, number, number][] = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...g],
      highlights,
      labels,
    });

    // Seed
    const seedHl: Record<number, string> = {};
    const seedLb: Record<number, string> = {};
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const idx = r * n + c;
        if (g[idx] === 1) {
          queue.push([r, c, 0]);
          seedHl[idx] = 'found';
          seedLb[idx] = 'land';
        }
      }
    }

    steps.push({
      line: 1,
      explanation: `Multi-source BFS from all ${queue.length} land cells simultaneously. Find maximum distance to any water cell.`,
      variables: { landCells: queue.length, n },
      visualization: makeViz(seedHl, seedLb),
    });

    const landCount = queue.length;
    const waterCount = n * n - landCount;

    if (landCount === 0 || waterCount === 0) {
      steps.push({
        line: 3,
        explanation: `Grid is all land or all water. No valid answer. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({}, { 0: 'ans=-1' }),
      });
      return steps;
    }

    let maxDist = -1;
    let lastCell = -1;

    steps.push({
      line: 4,
      explanation: `BFS initialized with ${landCount} land cells. Expanding outward to all water cells.`,
      variables: { queue: queue.map(([r, c, d]) => `(${r},${c},d=${d})`).join(',') },
      visualization: makeViz(seedHl, seedLb),
    });

    while (queue.length > 0) {
      const [r, c, dist] = queue.shift()!;
      const idx = r * n + c;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const nIdx = nr * n + nc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && g[nIdx] === 0) {
          g[nIdx] = dist + 1;
          maxDist = dist + 1;
          lastCell = nIdx;
          queue.push([nr, nc, dist + 1]);

          const hl: Record<number, string> = {};
          const lb: Record<number, string> = {};
          for (let i = 0; i < n * n; i++) {
            if (grid[i] === 1) { hl[i] = 'found'; lb[i] = 'land'; }
            else if (g[i] > 0) { hl[i] = 'visited'; lb[i] = `d=${g[i]}`; }
          }
          hl[nIdx] = 'active';
          lb[nIdx] = `d=${dist + 1}`;

          steps.push({
            line: 8,
            explanation: `Water cell (${nr},${nc}) reached at distance ${dist + 1} from nearest land. MaxDist=${maxDist}.`,
            variables: { cell: `(${nr},${nc})`, distance: dist + 1, maxDist },
            visualization: makeViz(hl, lb),
          });
        }
      }
    }

    const finalHl: Record<number, string> = {};
    const finalLb: Record<number, string> = {};
    for (let i = 0; i < n * n; i++) {
      if (grid[i] === 1) { finalHl[i] = 'found'; finalLb[i] = 'land'; }
      else if (g[i] > 0) { finalHl[i] = 'visited'; finalLb[i] = `d=${g[i]}`; }
    }
    if (lastCell >= 0) {
      finalHl[lastCell] = 'sorted';
      finalLb[lastCell] = `MAX=${maxDist}`;
    }

    steps.push({
      line: 9,
      explanation: `BFS complete. Maximum distance from any water cell to nearest land = ${maxDist}.`,
      variables: { result: maxDist },
      visualization: makeViz(finalHl, finalLb),
    });

    return steps;
  },
};

export default asFarFromLandAsPossible;
