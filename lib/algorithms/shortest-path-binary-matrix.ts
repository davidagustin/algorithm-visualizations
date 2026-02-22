import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPathBinaryMatrix: AlgorithmDefinition = {
  id: 'shortest-path-binary-matrix',
  title: 'Shortest Path in Binary Matrix',
  leetcodeNumber: 1091,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n binary matrix, find the shortest clear path from top-left (0,0) to bottom-right (n-1,n-1). A clear path uses only 0 cells and can move in 8 directions. Uses BFS layer by layer — the first time we reach the destination gives the shortest distance.',
  tags: ['Graph', 'BFS', 'Matrix', 'Shortest Path'],
  code: {
    pseudocode: `function shortestPathBinaryMatrix(grid):
  n = len(grid)
  if grid[0][0] == 1 or grid[n-1][n-1] == 1: return -1
  queue = deque([(0, 0, 1)])
  grid[0][0] = 1  // mark visited
  while queue:
    r, c, dist = queue.popleft()
    if r == n-1 and c == n-1: return dist
    for (nr, nc) in 8 directions:
      if in bounds and grid[nr][nc] == 0:
        grid[nr][nc] = 1
        queue.append((nr, nc, dist+1))
  return -1`,
    python: `def shortestPathBinaryMatrix(grid):
    n = len(grid)
    if grid[0][0] or grid[n-1][n-1]: return -1
    queue = deque([(0, 0, 1)])
    grid[0][0] = 1
    while queue:
        r, c, dist = queue.popleft()
        if r==n-1 and c==n-1: return dist
        for dr in [-1,0,1]:
            for dc in [-1,0,1]:
                if dr==0 and dc==0: continue
                nr, nc = r+dr, c+dc
                if 0<=nr<n and 0<=nc<n and grid[nr][nc]==0:
                    grid[nr][nc]=1
                    queue.append((nr,nc,dist+1))
    return -1`,
    javascript: `function shortestPathBinaryMatrix(grid) {
  const n = grid.length;
  if (grid[0][0] || grid[n-1][n-1]) return -1;
  const queue = [[0, 0, 1]];
  grid[0][0] = 1;
  while (queue.length) {
    const [r, c, dist] = queue.shift();
    if (r===n-1 && c===n-1) return dist;
    for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++) {
      if (!dr&&!dc) continue;
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===0) { grid[nr][nc]=1; queue.push([nr,nc,dist+1]); }
    }
  }
  return -1;
}`,
    java: `public int shortestPathBinaryMatrix(int[][] grid) {
    int n=grid.length;
    if(grid[0][0]==1||grid[n-1][n-1]==1) return -1;
    Queue<int[]> q=new LinkedList<>();q.add(new int[]{0,0,1});grid[0][0]=1;
    while(!q.isEmpty()){int[]cur=q.poll();int r=cur[0],c=cur[1],d=cur[2];if(r==n-1&&c==n-1)return d;for(int dr=-1;dr<=1;dr++)for(int dc=-1;dc<=1;dc++){if(dr==0&&dc==0)continue;int nr=r+dr,nc=c+dc;if(nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]==0){grid[nr][nc]=1;q.add(new int[]{nr,nc,d+1});}}}
    return -1;
}`,
  },
  defaultInput: {
    grid: [
      [0, 0, 0],
      [1, 1, 0],
      [1, 1, 0],
    ],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Binary Matrix (0=clear, 1=blocked)',
      type: 'array',
      defaultValue: [
        [0, 0, 0],
        [1, 1, 0],
        [1, 1, 0],
      ],
      placeholder: '[[0,0,0],[1,1,0],[1,1,0]]',
      helperText: '0=passable, 1=blocked. Move in 8 directions from (0,0) to (n-1,n-1).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const n = rawGrid.length;
    const grid = rawGrid.map(row => [...row]);
    const steps: AlgorithmStep[] = [];
    const idx = (r: number, c: number) => r * n + c;

    const distGrid = new Array(n * n).fill(-1);

    function makeViz(
      highlights: Record<number, string>,
      currentDist: number,
      queueSize: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: grid.flat(),
        highlights,
        labels: Object.fromEntries(
          Array.from({ length: n * n }, (_, i) => [
            i,
            distGrid[i] >= 0 ? `d${distGrid[i]}` : (grid[Math.floor(i / n)][i % n] === 1 ? 'X' : '·')
          ])
        ),
        auxData: {
          label: 'BFS Shortest Path',
          entries: [
            { key: 'Grid', value: `${n}x${n}` },
            { key: 'Current dist', value: String(currentDist) },
            { key: 'Queue size', value: String(queueSize) },
            { key: 'Target', value: `(${n - 1},${n - 1})` },
          ],
        },
      };
    }

    if (grid[0][0] === 1 || grid[n - 1][n - 1] === 1) {
      steps.push({
        line: 2,
        explanation: `Start or end cell is blocked. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz({ 0: 'mismatch', [idx(n - 1, n - 1)]: 'mismatch' }, 0, 0),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find shortest 8-directional path in ${n}x${n} grid from (0,0) to (${n - 1},${n - 1}). 0=clear, 1=blocked. BFS layer by layer.`,
      variables: { n },
      visualization: makeViz({ 0: 'active', [idx(n - 1, n - 1)]: 'pointer' }, 0, 1),
    });

    const queue: [number, number, number][] = [[0, 0, 1]];
    grid[0][0] = 1;
    distGrid[0] = 1;

    while (queue.length > 0) {
      const [r, c, dist] = queue.shift()!;
      const i = idx(r, c);

      if (r === n - 1 && c === n - 1) {
        const finalHL: Record<number, string> = {};
        for (let k = 0; k < n * n; k++) {
          finalHL[k] = distGrid[k] >= 0 ? 'found' : 'visited';
        }
        finalHL[0] = 'active';
        finalHL[i] = 'found';
        steps.push({
          line: 7,
          explanation: `Reached destination (${n - 1},${n - 1}) with distance ${dist}. Shortest clear path length: ${dist}.`,
          variables: { result: dist },
          visualization: makeViz(finalHL, dist, queue.length),
        });
        return steps;
      }

      const hl: Record<number, string> = {};
      for (let k = 0; k < n * n; k++) {
        if (distGrid[k] >= 0) hl[k] = 'sorted';
      }
      hl[i] = 'current';

      steps.push({
        line: 6,
        explanation: `Process (${r},${c}) at distance ${dist}. Explore 8 neighbors.`,
        variables: { r, c, dist },
        visualization: makeViz(hl, dist, queue.length),
      });

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 0) {
            grid[nr][nc] = 1;
            distGrid[idx(nr, nc)] = dist + 1;
            queue.push([nr, nc, dist + 1]);
            const hl2 = { ...hl, [idx(nr, nc)]: 'active' };
            steps.push({
              line: 11,
              explanation: `Enqueue neighbor (${nr},${nc}) at distance ${dist + 1}.`,
              variables: { nr, nc, dist: dist + 1 },
              visualization: makeViz(hl2, dist + 1, queue.length),
            });
          }
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `BFS exhausted. No clear path from (0,0) to (${n - 1},${n - 1}). Return -1.`,
      variables: { result: -1 },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n * n }, (_, i) => [i, distGrid[i] >= 0 ? 'visited' : 'mismatch'])),
        -1, 0
      ),
    });

    return steps;
  },
};

export default shortestPathBinaryMatrix;
