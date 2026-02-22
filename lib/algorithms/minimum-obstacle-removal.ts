import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumObstacleRemoval: AlgorithmDefinition = {
  id: 'minimum-obstacle-removal',
  title: 'Minimum Obstacle Removal to Reach Corner',
  leetcodeNumber: 2290,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a 0-indexed m x n binary matrix where 0 is empty and 1 is an obstacle, find the minimum number of obstacles to remove to move from top-left to bottom-right. Use 0-1 BFS with a deque: empty cells have edge weight 0 (push front), obstacles have weight 1 (push back).',
  tags: ['0-1 bfs', 'graph', 'grid', 'deque', 'shortest path'],

  code: {
    pseudocode: `function minimumObstacles(grid):
  m, n = dimensions
  dist = infinity matrix
  dist[0][0] = 0
  deque = [(0, 0, 0)]  // cost, row, col
  while deque not empty:
    cost, r, c = pop from front
    if r == m-1 and c == n-1: return cost
    for (dr, dc) in 4 directions:
      nr, nc = r+dr, c+dc
      if in bounds:
        newCost = cost + grid[nr][nc]
        if newCost < dist[nr][nc]:
          dist[nr][nc] = newCost
          if grid[nr][nc] == 0: push_front
          else: push_back
  return dist[m-1][n-1]`,

    python: `from collections import deque

def minimumObstacles(grid):
    m, n = len(grid), len(grid[0])
    dist = [[float('inf')] * n for _ in range(m)]
    dist[0][0] = 0
    dq = deque([(0, 0, 0)])
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while dq:
        cost, r, c = dq.popleft()
        if r == m-1 and c == n-1:
            return cost
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n:
                new_cost = cost + grid[nr][nc]
                if new_cost < dist[nr][nc]:
                    dist[nr][nc] = new_cost
                    if grid[nr][nc] == 0:
                        dq.appendleft((new_cost, nr, nc))
                    else:
                        dq.append((new_cost, nr, nc))
    return dist[m-1][n-1]`,

    javascript: `function minimumObstacles(grid) {
  const m = grid.length, n = grid[0].length;
  const dist = Array.from({length: m}, () => Array(n).fill(Infinity));
  dist[0][0] = 0;
  const deque = [[0, 0, 0]];
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let head = 0;
  while (head < deque.length) {
    const [cost, r, c] = deque[head++];
    if (cost > dist[r][c]) continue;
    if (r === m-1 && c === n-1) return cost;
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
        const newCost = cost + grid[nr][nc];
        if (newCost < dist[nr][nc]) {
          dist[nr][nc] = newCost;
          if (grid[nr][nc] === 0) deque.unshift([newCost, nr, nc]);
          else deque.push([newCost, nr, nc]);
        }
      }
    }
  }
  return dist[m-1][n-1];
}`,

    java: `public int minimumObstacles(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[0][0] = 0;
    Deque<int[]> deque = new ArrayDeque<>();
    deque.offerFirst(new int[]{0, 0, 0});
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!deque.isEmpty()) {
        int[] cur = deque.pollFirst();
        int cost = cur[0], r = cur[1], c = cur[2];
        if (r == m-1 && c == n-1) return cost;
        for (int[] d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
                int newCost = cost + grid[nr][nc];
                if (newCost < dist[nr][nc]) {
                    dist[nr][nc] = newCost;
                    if (grid[nr][nc] == 0) deque.offerFirst(new int[]{newCost, nr, nc});
                    else deque.offerLast(new int[]{newCost, nr, nc});
                }
            }
        }
    }
    return dist[m-1][n-1];
}`,
  },

  defaultInput: {
    grid: [[0,1,1],[1,1,0],[1,1,0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [0, 1, 1, 1, 1, 0, 1, 1, 0],
      placeholder: '0,1,1,1,1,0,1,1,0',
      helperText: '0=empty, 1=obstacle in row-major order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const INF = Infinity;

    const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(INF));
    dist[0][0] = 0;

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Using 0-1 BFS: empty cells (0) add 0 cost pushed to front, obstacles (1) add 1 cost pushed to back.`,
      variables: { rows: m, cols: n, startObstacles: grid[0][0] },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: { 0: 'active', [m * n - 1]: 'pointer' },
        labels: { 0: 'start', [m * n - 1]: 'target' },
      } as ArrayVisualization,
    });

    const deque: [number, number, number][] = [[0, 0, 0]];
    let head = 0;

    while (head < deque.length) {
      const [cost, r, c] = deque[head++];

      if (cost > dist[r][c]) continue;

      steps.push({
        line: 6,
        explanation: `Processing (${r}, ${c}) with removal cost ${cost}. ${r === m-1 && c === n-1 ? 'Reached target!' : 'Exploring neighbors.'}`,
        variables: { row: r, col: c, cost, dist: dist[r][c] },
        visualization: {
          type: 'array',
          array: dist.flat().map(v => v === INF ? -1 : v),
          highlights: { [r * n + c]: 'active', [m * n - 1]: 'pointer' },
          labels: { [r * n + c]: `cost=${cost}` },
        } as ArrayVisualization,
      });

      if (r === m - 1 && c === n - 1) {
        steps.push({
          line: 7,
          explanation: `Reached bottom-right corner! Minimum obstacles to remove: ${cost}.`,
          variables: { result: cost },
          visualization: {
            type: 'array',
            array: dist.flat().map(v => v === INF ? -1 : v),
            highlights: { [r * n + c]: 'found' },
            labels: { [r * n + c]: `min=${cost}` },
          } as ArrayVisualization,
        });
        return steps;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n) {
          const newCost = cost + grid[nr][nc];
          if (newCost < dist[nr][nc]) {
            dist[nr][nc] = newCost;
            if (grid[nr][nc] === 0) {
              deque.splice(head, 0, [newCost, nr, nc]);
            } else {
              deque.push([newCost, nr, nc]);
            }
            steps.push({
              line: 11,
              explanation: `(${nr}, ${nc}) is ${grid[nr][nc] === 1 ? 'an obstacle (push back)' : 'empty (push front)'}. New cost: ${newCost}.`,
              variables: { neighbor: `(${nr},${nc})`, newCost, isObstacle: grid[nr][nc] },
              visualization: {
                type: 'array',
                array: dist.flat().map(v => v === INF ? -1 : v),
                highlights: { [r * n + c]: 'visited', [nr * n + nc]: grid[nr][nc] === 1 ? 'comparing' : 'active' },
                labels: { [nr * n + nc]: `cost=${newCost}` },
              } as ArrayVisualization,
            });
          }
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 14,
      explanation: `0-1 BFS complete. Minimum obstacles to remove: ${dist[m-1][n-1]}.`,
      variables: { result: dist[m-1][n-1] },
      visualization: {
        type: 'array',
        array: dist.flat().map(v => v === INF ? -1 : v),
        highlights: { [m * n - 1]: 'found' },
        labels: { [m * n - 1]: `min=${dist[m-1][n-1]}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumObstacleRemoval;
