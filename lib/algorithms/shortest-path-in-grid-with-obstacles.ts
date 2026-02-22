import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPathInGridWithObstacles: AlgorithmDefinition = {
  id: 'shortest-path-in-grid-with-obstacles',
  title: 'Shortest Path in Grid with Obstacles Elimination',
  leetcodeNumber: 1293,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an m x n grid where 0 is empty and 1 is an obstacle, you can eliminate at most k obstacles. Find the shortest path from top-left to bottom-right, or -1 if impossible. BFS state is (row, col, remainingEliminations). Use the remaining k as part of visited state.',
  tags: ['bfs', 'graph', 'grid', 'obstacle elimination', 'shortest path'],

  code: {
    pseudocode: `function shortestPath(grid, k):
  m, n = dimensions of grid
  if grid[m-1][n-1] == 1: k -= 1
  queue = [(0, 0, k, 0)]  // row, col, k_remaining, steps
  visited = {(0, 0, k)}
  while queue not empty:
    r, c, remain, steps = dequeue()
    if r == m-1 and c == n-1: return steps
    for (dr, dc) in 4 directions:
      nr, nc = r+dr, c+dc
      if in bounds:
        nk = remain - grid[nr][nc]
        if nk >= 0 and (nr, nc, nk) not visited:
          visited.add((nr, nc, nk))
          enqueue((nr, nc, nk, steps+1))
  return -1`,

    python: `from collections import deque

def shortestPath(grid, k):
    m, n = len(grid), len(grid[0])
    if m == 1 and n == 1: return 0
    queue = deque([(0, 0, k, 0)])
    visited = {(0, 0, k)}
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c, remain, steps = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n:
                nk = remain - grid[nr][nc]
                if nk >= 0 and (nr, nc, nk) not in visited:
                    if nr == m-1 and nc == n-1: return steps+1
                    visited.add((nr, nc, nk))
                    queue.append((nr, nc, nk, steps+1))
    return -1`,

    javascript: `function shortestPath(grid, k) {
  const m = grid.length, n = grid[0].length;
  if (m === 1 && n === 1) return 0;
  const queue = [[0, 0, k, 0]];
  const visited = new Set(['0,0,' + k]);
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (queue.length) {
    const [r, c, remain, steps] = queue.shift();
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        const nk = remain - grid[nr][nc];
        const key = nr+','+nc+','+nk;
        if (nk >= 0 && !visited.has(key)) {
          if (nr === m-1 && nc === n-1) return steps+1;
          visited.add(key);
          queue.push([nr, nc, nk, steps+1]);
        }
      }
    }
  }
  return -1;
}`,

    java: `public int shortestPath(int[][] grid, int k) {
    int m = grid.length, n = grid[0].length;
    if (m == 1 && n == 1) return 0;
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(new int[]{0, 0, k, 0});
    Set<String> visited = new HashSet<>();
    visited.add("0,0," + k);
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int r=cur[0], c=cur[1], remain=cur[2], steps=cur[3];
        for (int[] d : dirs) {
            int nr=r+d[0], nc=c+d[1];
            if (nr>=0 && nr<m && nc>=0 && nc<n) {
                int nk = remain - grid[nr][nc];
                String key = nr+","+nc+","+nk;
                if (nk >= 0 && !visited.contains(key)) {
                    if (nr==m-1 && nc==n-1) return steps+1;
                    visited.add(key);
                    queue.offer(new int[]{nr, nc, nk, steps+1});
                }
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    grid: [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]],
    k: 1,
  },

  inputFields: [
    {
      name: 'k',
      label: 'Max Eliminations (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Maximum obstacles that can be eliminated',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Can eliminate up to k=${k} obstacles. BFS state includes remaining eliminations.`,
      variables: { rows: m, cols: n, k, target: `(${m-1}, ${n-1})` },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: { 0: 'active', [m * n - 1]: 'pointer' },
        labels: { 0: 'start(0,0)', [m * n - 1]: 'target' },
      } as ArrayVisualization,
    });

    const queue: [number, number, number, number][] = [[0, 0, k, 0]];
    const visited = new Set<string>([`0,0,${k}`]);

    while (queue.length > 0) {
      const [r, c, remain, dist] = queue.shift()!;

      steps.push({
        line: 6,
        explanation: `Visiting (${r}, ${c}) with ${remain} eliminations remaining, ${dist} steps taken.`,
        variables: { row: r, col: c, remaining_k: remain, steps: dist },
        visualization: {
          type: 'array',
          array: grid.flat(),
          highlights: { [r * n + c]: 'active', [m * n - 1]: 'pointer' },
          labels: { [r * n + c]: `k=${remain}` },
        } as ArrayVisualization,
      });

      if (r === m - 1 && c === n - 1) {
        steps.push({
          line: 7,
          explanation: `Reached bottom-right (${m-1}, ${n-1}) in ${dist} steps. This is the shortest path.`,
          variables: { result: dist },
          visualization: {
            type: 'array',
            array: grid.flat(),
            highlights: { [r * n + c]: 'found' },
            labels: { [r * n + c]: 'DONE!' },
          } as ArrayVisualization,
        });
        return steps;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          const nk = remain - grid[nr][nc];
          const key = `${nr},${nc},${nk}`;
          if (nk >= 0 && !visited.has(key)) {
            visited.add(key);
            queue.push([nr, nc, nk, dist + 1]);
            steps.push({
              line: 11,
              explanation: `Move to (${nr}, ${nc}): obstacle=${grid[nr][nc]}, remaining_k=${nk}. Added to queue.`,
              variables: { to: `(${nr},${nc})`, obstacle: grid[nr][nc], remaining_k: nk },
              visualization: {
                type: 'array',
                array: grid.flat(),
                highlights: { [r * n + c]: 'active', [nr * n + nc]: 'comparing' },
                labels: { [r * n + c]: 'cur', [nr * n + nc]: `k=${nk}` },
              } as ArrayVisualization,
            });
          }
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 14,
      explanation: 'BFS exhausted. No valid path found within k eliminations. Return -1.',
      variables: { result: -1 },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: { 0: 'mismatch', [m * n - 1]: 'mismatch' },
        labels: { 0: 'start', [m * n - 1]: 'target' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default shortestPathInGridWithObstacles;
