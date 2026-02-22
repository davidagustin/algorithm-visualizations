import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestBridgeII: AlgorithmDefinition = {
  id: 'shortest-bridge-ii',
  title: 'Shortest Bridge II',
  leetcodeNumber: 934,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary matrix with exactly two islands (groups of 1s), find the minimum number of 0s to flip to connect them. Use DFS to mark the first island, then BFS expanding outward to reach the second island.',
  tags: ['Graph', 'BFS', 'DFS', 'Matrix'],
  code: {
    pseudocode: `function shortestBridge(grid):
  find any cell in island 1
  dfs to mark all cells of island 1 as 2
  BFS from all island-1 cells outward
  for each expansion step (distance d):
    expand all frontier cells
    if we hit a 1 (island 2): return d
  return -1`,
    python: `def shortestBridge(grid):
    n = len(grid)
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    def dfs(r,c):
        grid[r][c]=2; queue.append((r,c))
        for dr,dc in dirs:
            nr,nc=r+dr,c+dc
            if 0<=nr<n and 0<=nc<n and grid[nr][nc]==1:
                dfs(nr,nc)
    queue=deque()
    found=False
    for i in range(n):
        if found: break
        for j in range(n):
            if grid[i][j]==1:
                dfs(i,j); found=True; break
    steps=0
    while queue:
        for _ in range(len(queue)):
            r,c=queue.popleft()
            for dr,dc in dirs:
                nr,nc=r+dr,c+dc
                if 0<=nr<n and 0<=nc<n:
                    if grid[nr][nc]==1: return steps
                    if grid[nr][nc]==0:
                        grid[nr][nc]=2; queue.append((nr,nc))
        steps+=1`,
    javascript: `function shortestBridge(grid) {
  const n = grid.length;
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  const queue = [];
  function dfs(r, c) {
    grid[r][c] = 2; queue.push([r, c]);
    for (const [dr, dc] of dirs) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0&&nr<n&&nc>=0&&nc<n&&grid[nr][nc]===1) dfs(nr, nc);
    }
  }
  let found = false;
  for (let i = 0; i < n && !found; i++)
    for (let j = 0; j < n && !found; j++)
      if (grid[i][j]===1) { dfs(i,j); found=true; }
  let steps = 0;
  while (queue.length > 0) {
    const size = queue.length;
    for (let k = 0; k < size; k++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of dirs) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0&&nr<n&&nc>=0&&nc<n) {
          if (grid[nr][nc]===1) return steps;
          if (grid[nr][nc]===0) { grid[nr][nc]=2; queue.push([nr,nc]); }
        }
      }
    }
    steps++;
  }
}`,
    java: `public int shortestBridge(int[][] grid) {
    int n = grid.length;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    Queue<int[]> q = new LinkedList<>();
    boolean found = false;
    for (int i=0;i<n&&!found;i++)
        for (int j=0;j<n&&!found;j++)
            if (grid[i][j]==1) { dfs(grid,q,i,j,n); found=true; }
    int steps=0;
    while (!q.isEmpty()) {
        int sz=q.size();
        for (int k=0;k<sz;k++) {
            int[] cur=q.poll();
            for (int[] d:dirs) {
                int nr=cur[0]+d[0],nc=cur[1]+d[1];
                if (nr>=0&&nr<n&&nc>=0&&nc<n) {
                    if (grid[nr][nc]==1) return steps;
                    if (grid[nr][nc]==0) {grid[nr][nc]=2;q.add(new int[]{nr,nc});}
                }
            }
        }
        steps++;
    }
    return -1;
}`,
  },
  defaultInput: {
    grid: [[0,1,0],[0,0,0],[0,0,1]],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Binary Grid',
      type: 'array',
      defaultValue: [[0,1,0],[0,0,0],[0,0,1]],
      placeholder: '[[0,1,0],[0,0,0],[0,0,1]]',
      helperText: 'Binary matrix with exactly 2 islands',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const n = rawGrid.length;
    const steps: AlgorithmStep[] = [];

    const grid = rawGrid.map(row => [...row]);
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const bfsQueue: number[][] = [];

    // Flatten grid for visualization
    function flatGrid(): number[] {
      return grid.flat();
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      const flat = flatGrid();
      return {
        type: 'array',
        array: flat,
        highlights,
        labels: Object.fromEntries(flat.map((v, i) => [i, `(${Math.floor(i/n)},${i%n}):${v === 0 ? '.' : v === 1 ? 'I2' : 'I1'}`])),
        auxData: {
          label: 'Shortest Bridge (DFS+BFS)',
          entries: [
            { key: 'Grid Size', value: `${n}x${n}` },
            { key: 'Legend', value: '0=water, 1=island2, 2=island1/visited' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    function dfs(r: number, c: number) {
      grid[r][c] = 2;
      bfsQueue.push([r, c]);
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < n && nc >= 0 && nc < n && grid[nr][nc] === 1) {
          dfs(nr, nc);
        }
      }
    }

    steps.push({
      line: 1,
      explanation: `${n}x${n} grid with two islands. Step 1: DFS to mark first island as 2. Step 2: BFS expansion to reach second island.`,
      variables: { n },
      visualization: makeViz(Object.fromEntries(flatGrid().map((_, i) => [i, 'default'])), 'Initial grid'),
    });

    // Find and DFS first island
    let found = false;
    for (let i = 0; i < n && !found; i++) {
      for (let j = 0; j < n && !found; j++) {
        if (grid[i][j] === 1) {
          dfs(i, j);
          found = true;
        }
      }
    }

    const afterDFS = flatGrid();
    const dfsH: Record<number, string> = {};
    for (let i = 0; i < afterDFS.length; i++) {
      dfsH[i] = afterDFS[i] === 2 ? 'found' : afterDFS[i] === 1 ? 'active' : 'default';
    }
    steps.push({
      line: 2,
      explanation: `DFS complete. Island 1 marked as 2 (${bfsQueue.length} cells). Queue initialized with all island-1 cells.`,
      variables: { queueSize: bfsQueue.length },
      visualization: makeViz(dfsH, `Island 1 marked, ${bfsQueue.length} cells in BFS queue`),
    });

    // BFS expansion
    let dist = 0;
    let result = -1;
    const queue = [...bfsQueue];

    outer: while (queue.length > 0) {
      const size = queue.length;
      for (let k = 0; k < size; k++) {
        const [r, c] = queue.shift()!;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            if (grid[nr][nc] === 1) {
              result = dist;
              const h2: Record<number, string> = {};
              const fg = flatGrid();
              for (let i = 0; i < fg.length; i++) h2[i] = fg[i] === 2 ? 'sorted' : fg[i] === 1 ? 'found' : 'default';
              h2[nr * n + nc] = 'mismatch';
              steps.push({
                line: 6,
                explanation: `Reached island 2 at (${nr},${nc}) after ${dist} expansions. Minimum bridge = ${dist} flips.`,
                variables: { result: dist },
                visualization: makeViz(h2, `Bridge found: ${dist} flips`),
              });
              break outer;
            }
            if (grid[nr][nc] === 0) {
              grid[nr][nc] = 2;
              queue.push([nr, nc]);
            }
          }
        }
      }

      if (result === -1) {
        const fg = flatGrid();
        const h2: Record<number, string> = {};
        for (let i = 0; i < fg.length; i++) h2[i] = fg[i] === 2 ? 'comparing' : fg[i] === 1 ? 'active' : 'default';
        steps.push({
          line: 5,
          explanation: `BFS level ${dist + 1}: expanded ${size} cells. Still searching for island 2.`,
          variables: { dist, queueSize: queue.length },
          visualization: makeViz(h2, `Expanded level ${dist + 1}`),
        });
        dist++;
      }
    }

    return steps;
  },
};

export default shortestBridgeII;
