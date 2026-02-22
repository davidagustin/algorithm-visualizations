import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const swimInRisingWater: AlgorithmDefinition = {
  id: 'swim-in-rising-water',
  title: 'Swim in Rising Water',
  leetcodeNumber: 778,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an n x n grid where grid[i][j] represents the elevation at cell (i,j), find the minimum time T such that you can travel from top-left (0,0) to bottom-right (n-1,n-1). At time T you can swim to any cell with elevation at most T. Uses a min-heap (Dijkstra-style) tracking the maximum elevation on the path.',
  tags: ['graph', 'heap', 'dijkstra', 'binary search', 'bfs', 'matrix'],

  code: {
    pseudocode: `function swimInWater(grid):
  n = grid size
  heap = min-heap by max elevation so far
  push (grid[0][0], 0, 0)  // (elevation, row, col)
  visited = {(0,0)}
  while heap not empty:
    t, r, c = heap.pop()
    if r == n-1 and c == n-1: return t
    for each direction (nr, nc):
      if valid and not visited:
        visited.add((nr,nc))
        heap.push(max(t, grid[nr][nc]), nr, nc)`,

    python: `def swimInWater(grid):
    n = len(grid)
    heap = [(grid[0][0], 0, 0)]
    visited = {(0, 0)}
    while heap:
        t, r, c = heapq.heappop(heap)
        if r == n-1 and c == n-1:
            return t
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<n and 0<=nc<n and (nr,nc) not in visited:
                visited.add((nr,nc))
                heapq.heappush(heap, (max(t, grid[nr][nc]), nr, nc))`,

    javascript: `function swimInWater(grid) {
  const n = grid.length;
  // Use a min-heap (simulate with sorted array for clarity)
  const heap = [[grid[0][0], 0, 0]];
  const visited = new Set(['0,0']);
  while (heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [t, r, c] = heap.shift();
    if (r===n-1&&c===n-1) return t;
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&!visited.has(nr+','+nc)) {
        visited.add(nr+','+nc);
        heap.push([Math.max(t,grid[nr][nc]),nr,nc]);
      }
    }
  }
}`,

    java: `public int swimInWater(int[][] grid) {
    int n = grid.length;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{grid[0][0],0,0});
    boolean[][] visited = new boolean[n][n];
    visited[0][0]=true;
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    while (!pq.isEmpty()) {
        int[] curr=pq.poll();
        int t=curr[0],r=curr[1],c=curr[2];
        if (r==n-1&&c==n-1) return t;
        for (int[] d:dirs) {
            int nr=r+d[0],nc=c+d[1];
            if (nr>=0&&nr<n&&nc>=0&&nc<n&&!visited[nr][nc]) {
                visited[nr][nc]=true;
                pq.offer(new int[]{Math.max(t,grid[nr][nc]),nr,nc});
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    grid: [0, 2, 1, 3],
    n: 2,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid elevations (flattened NxN)',
      type: 'array',
      defaultValue: [0, 2, 1, 3],
      placeholder: '0,2,1,3',
      helperText: 'Flattened NxN grid of elevations (a permutation of 0..n^2-1)',
    },
    {
      name: 'n',
      label: 'Grid Size N',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatGrid = input.grid as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const grid = flatGrid.slice(0, n * n);
    while (grid.length < n * n) grid.push(0);

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const visited = new Set<string>();

    // Min-heap simulation (sorted array)
    const heap: [number, number, number][] = [[grid[0], 0, 0]];
    visited.add('0,0');

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...grid],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum time to swim from (0,0) to (${n - 1},${n - 1}) in a ${n}x${n} elevation grid. Use min-heap tracking max elevation on path.`,
      variables: { n, startElev: grid[0] },
      visualization: makeViz(
        { 0: 'active', [n * n - 1]: 'found' },
        { 0: 'start', [n * n - 1]: 'end' }
      ),
    });

    let result = -1;

    while (heap.length > 0) {
      // Sort to simulate min-heap
      heap.sort((a, b) => a[0] - b[0]);
      const [t, r, c] = heap.shift()!;
      const idx = r * n + c;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const key of visited) {
        const [vr, vc] = key.split(',').map(Number);
        hl[vr * n + vc] = 'visited';
      }
      hl[idx] = 'active';
      lb[idx] = `t=${t}`;
      hl[n * n - 1] = 'pointer';
      lb[n * n - 1] = 'goal';

      steps.push({
        line: 5,
        explanation: `Pop (${r},${c}) with max elevation so far = ${t}. Grid value=${grid[idx]}.`,
        variables: { row: r, col: c, maxElevSoFar: t, gridVal: grid[idx] },
        visualization: makeViz(hl, lb),
      });

      if (r === n - 1 && c === n - 1) {
        result = t;
        hl[idx] = 'found';
        lb[idx] = `DONE t=${t}`;

        steps.push({
          line: 6,
          explanation: `Reached destination (${n - 1},${n - 1})! Minimum time T = ${t}.`,
          variables: { result: t },
          visualization: makeViz(hl, lb),
        });
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && !visited.has(key)) {
          visited.add(key);
          const newT = Math.max(t, grid[nr * n + nc]);
          heap.push([newT, nr, nc]);

          const nhl = { ...hl };
          const nlb = { ...lb };
          nhl[nr * n + nc] = 'comparing';
          nlb[nr * n + nc] = `push t=${newT}`;

          steps.push({
            line: 9,
            explanation: `Push neighbor (${nr},${nc}) with max(${t}, ${grid[nr * n + nc]}) = ${newT}.`,
            variables: { neighbor: `(${nr},${nc})`, pushTime: newT },
            visualization: makeViz(nhl, nlb),
          });
        }
      }
    }

    if (result === -1) {
      steps.push({
        line: 10,
        explanation: `Heap exhausted. No path found.`,
        variables: { result: -1 },
        visualization: makeViz({}, {}),
      });
    }

    return steps;
  },
};

export default swimInRisingWater;
