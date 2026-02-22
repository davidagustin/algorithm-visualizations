import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mapOfHighestPeak: AlgorithmDefinition = {
  id: 'map-of-highest-peak',
  title: 'Map of Highest Peak',
  leetcodeNumber: 1765,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a matrix where 1 represents water cells (height must be 0) and 0 represents land, assign heights to maximize the highest peak. No two adjacent cells can differ by more than 1. Use multi-source BFS starting from all water cells simultaneously, expanding outward.',
  tags: ['bfs', 'graph', 'grid', 'multi-source bfs', 'matrix'],

  code: {
    pseudocode: `function highestPeak(isWater):
  m, n = dimensions
  height = matrix of -1
  queue = []
  for each water cell (r, c):
    height[r][c] = 0
    enqueue(r, c)
  while queue not empty:
    r, c = dequeue()
    for each neighbor (nr, nc):
      if in bounds and height[nr][nc] == -1:
        height[nr][nc] = height[r][c] + 1
        enqueue(nr, nc)
  return height`,

    python: `from collections import deque

def highestPeak(isWater):
    m, n = len(isWater), len(isWater[0])
    height = [[-1]*n for _ in range(m)]
    queue = deque()
    for r in range(m):
        for c in range(n):
            if isWater[r][c] == 1:
                height[r][c] = 0
                queue.append((r, c))
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0 <= nr < m and 0 <= nc < n and height[nr][nc] == -1:
                height[nr][nc] = height[r][c] + 1
                queue.append((nr, nc))
    return height`,

    javascript: `function highestPeak(isWater) {
  const m = isWater.length, n = isWater[0].length;
  const height = Array.from({length: m}, () => Array(n).fill(-1));
  const queue = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (isWater[r][c] === 1) {
        height[r][c] = 0;
        queue.push([r, c]);
      }
    }
  }
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let head = 0;
  while (head < queue.length) {
    const [r, c] = queue[head++];
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr >= 0 && nr < m && nc >= 0 && nc < n && height[nr][nc] === -1) {
        height[nr][nc] = height[r][c] + 1;
        queue.push([nr, nc]);
      }
    }
  }
  return height;
}`,

    java: `public int[][] highestPeak(int[][] isWater) {
    int m = isWater.length, n = isWater[0].length;
    int[][] height = new int[m][n];
    for (int[] row : height) Arrays.fill(row, -1);
    Queue<int[]> queue = new LinkedList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (isWater[r][c] == 1) {
                height[r][c] = 0;
                queue.offer(new int[]{r, c});
            }
        }
    }
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int r = cur[0], c = cur[1];
        for (int[] d : dirs) {
            int nr = r+d[0], nc = c+d[1];
            if (nr>=0 && nr<m && nc>=0 && nc<n && height[nr][nc]==-1) {
                height[nr][nc] = height[r][c] + 1;
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    return height;
}`,
  },

  defaultInput: {
    isWater: [[0,1],[0,0]],
  },

  inputFields: [
    {
      name: 'isWater',
      label: 'Water Matrix',
      type: 'array',
      defaultValue: [0, 1, 0, 0],
      placeholder: '0,1,0,0',
      helperText: '1 = water cell, 0 = land cell',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const isWater = input.isWater as number[][];
    const steps: AlgorithmStep[] = [];
    const m = isWater.length;
    const n = isWater[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    const height: number[][] = Array.from({ length: m }, () => Array(n).fill(-1));

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Initialize all heights to -1 (unvisited). Water cells get height 0 and seed the BFS.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: isWater.flat(),
        highlights: Object.fromEntries(
          isWater.flat().map((v, i) => [i, v === 1 ? 'active' : 'default'])
        ),
        labels: Object.fromEntries(
          isWater.flat().map((v, i) => [i, v === 1 ? 'water' : 'land'])
        ),
      } as ArrayVisualization,
    });

    const queue: [number, number][] = [];
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (isWater[r][c] === 1) {
          height[r][c] = 0;
          queue.push([r, c]);
        }
      }
    }

    steps.push({
      line: 5,
      explanation: `Seeded BFS with ${queue.length} water cell(s) at height 0. Multi-source BFS expands outward.`,
      variables: { waterCells: queue.length },
      visualization: {
        type: 'array',
        array: height.flat(),
        highlights: Object.fromEntries(
          height.flat().map((v, i) => [i, v === 0 ? 'active' : 'default'])
        ),
        labels: Object.fromEntries(
          height.flat().map((v, i) => [i, v >= 0 ? `h=${v}` : '?'])
        ),
      } as ArrayVisualization,
    });

    let head = 0;
    while (head < queue.length) {
      const [r, c] = queue[head++];

      steps.push({
        line: 8,
        explanation: `Processing cell (${r}, ${c}) with height ${height[r][c]}. Expanding to neighbors.`,
        variables: { row: r, col: c, height: height[r][c] },
        visualization: {
          type: 'array',
          array: height.flat(),
          highlights: { [r * n + c]: 'active' },
          labels: Object.fromEntries(
            height.flat().map((v, i) => [i, v >= 0 ? `h=${v}` : '?'])
          ),
        } as ArrayVisualization,
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && height[nr][nc] === -1) {
          height[nr][nc] = height[r][c] + 1;
          queue.push([nr, nc]);

          steps.push({
            line: 10,
            explanation: `Neighbor (${nr}, ${nc}) gets height ${height[nr][nc]} = ${height[r][c]} + 1.`,
            variables: { neighbor: `(${nr},${nc})`, newHeight: height[nr][nc] },
            visualization: {
              type: 'array',
              array: height.flat(),
              highlights: { [r * n + c]: 'visited', [nr * n + nc]: 'comparing' },
              labels: Object.fromEntries(
                height.flat().map((v, i) => [i, v >= 0 ? `h=${v}` : '?'])
              ),
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 12,
      explanation: `BFS complete. All cells assigned heights. Max height = ${Math.max(...height.flat())}.`,
      variables: { maxHeight: Math.max(...height.flat()) },
      visualization: {
        type: 'array',
        array: height.flat(),
        highlights: Object.fromEntries(
          height.flat().map((v, i) => [i, v === Math.max(...height.flat()) ? 'found' : 'sorted'])
        ),
        labels: Object.fromEntries(
          height.flat().map((v, i) => [i, `h=${v}`])
        ),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default mapOfHighestPeak;
