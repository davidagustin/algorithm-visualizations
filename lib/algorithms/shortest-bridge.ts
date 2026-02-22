import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestBridge: AlgorithmDefinition = {
  id: 'shortest-bridge',
  title: 'Shortest Bridge',
  leetcodeNumber: 934,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary grid containing exactly two islands, find the minimum number of 0s that must be flipped to connect the two islands. Use DFS to find and mark the first island, then use multi-source BFS from all cells of the first island to reach the second island.',
  tags: ['graph', 'bfs', 'dfs', 'matrix', 'shortest path', 'two islands'],

  code: {
    pseudocode: `function shortestBridge(grid):
  n = grid size
  // Step 1: Find and mark first island using DFS
  find first land cell and DFS to mark entire island, add to queue
  // Step 2: BFS from first island toward second
  steps = 0
  while queue not empty:
    for each cell in current wave:
      for each neighbor (nr, nc):
        if grid[nr][nc] == 1: return steps
        if grid[nr][nc] == 0:
          grid[nr][nc] = -1
          queue.enqueue(nr, nc)
    steps += 1`,

    python: `def shortestBridge(grid):
    n = len(grid)
    def dfs(r, c):
        if r<0 or r>=n or c<0 or c>=n or grid[r][c]!=1: return
        grid[r][c] = 2
        queue.append((r,c))
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            dfs(r+dr, c+dc)
    queue = deque()
    found = False
    for r in range(n):
        if found: break
        for c in range(n):
            if grid[r][c] == 1:
                dfs(r, c); found = True; break
    steps = 0
    while queue:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<n and 0<=nc<n:
                    if grid[nr][nc] == 1: return steps
                    if grid[nr][nc] == 0:
                        grid[nr][nc] = -1
                        queue.append((nr,nc))
        steps += 1`,

    javascript: `function shortestBridge(grid) {
  const n = grid.length;
  const queue = [];
  function dfs(r, c) {
    if (r<0||r>=n||c<0||c>=n||grid[r][c]!==1) return;
    grid[r][c] = 2; queue.push([r,c]);
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) dfs(r+dr,c+dc);
  }
  let found = false;
  for (let r=0;r<n&&!found;r++) for(let c=0;c<n&&!found;c++)
    if (grid[r][c]===1) { dfs(r,c); found=true; }
  let steps = 0;
  while (queue.length) {
    let size = queue.length;
    while (size-- > 0) {
      const [r,c] = queue.shift();
      for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<n&&nc>=0&&nc<n) {
          if (grid[nr][nc]===1) return steps;
          if (grid[nr][nc]===0) { grid[nr][nc]=-1; queue.push([nr,nc]); }
        }
      }
    }
    steps++;
  }
}`,

    java: `public int shortestBridge(int[][] grid) {
    int n = grid.length;
    Queue<int[]> queue = new LinkedList<>();
    boolean found = false;
    for (int r=0;r<n&&!found;r++) for(int c=0;c<n&&!found;c++)
        if (grid[r][c]==1) { dfs(grid,r,c,queue,n); found=true; }
    int steps=0;
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty()) {
        for (int size=queue.size();size>0;size--) {
            int[] curr=queue.poll();
            for (int[] d:dirs) {
                int nr=curr[0]+d[0],nc=curr[1]+d[1];
                if (nr>=0&&nr<n&&nc>=0&&nc<n) {
                    if (grid[nr][nc]==1) return steps;
                    if (grid[nr][nc]==0) { grid[nr][nc]=-1; queue.add(new int[]{nr,nc}); }
                }
            }
        }
        steps++;
    }
    return -1;
}`,
  },

  defaultInput: {
    grid: [0, 1, 0, 0, 0, 0, 0, 0, 1],
    n: 3,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened NxN)',
      type: 'array',
      defaultValue: [0, 1, 0, 0, 0, 0, 0, 0, 1],
      placeholder: '0,1,0,0,0,0,0,0,1',
      helperText: 'Flattened NxN binary grid with exactly two islands',
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

    const g = flatGrid.slice(0, n * n);
    while (g.length < n * n) g.push(0);

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const queue: [number, number][] = [];

    const getCellColor = (val: number) => {
      if (val === 1) return 'active';  // second island
      if (val === 2) return 'found';   // first island
      if (val === -1) return 'comparing'; // explored water
      return 'visited'; // empty water
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...g],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find shortest bridge between two islands in a ${n}x${n} grid. First mark one island with DFS, then BFS to the other.`,
      variables: { n },
      visualization: makeViz(
        g.reduce((acc, v, i) => { acc[i] = v === 1 ? 'active' : 'visited'; return acc; }, {} as Record<number, string>),
        {}
      ),
    });

    // DFS to find and mark first island
    function dfs(r: number, c: number) {
      if (r < 0 || r >= n || c < 0 || c >= n || g[r * n + c] !== 1) return;
      g[r * n + c] = 2;
      queue.push([r, c]);
      for (const [dr, dc] of dirs) dfs(r + dr, c + dc);
    }

    let found = false;
    for (let r = 0; r < n && !found; r++) {
      for (let c = 0; c < n && !found; c++) {
        if (g[r * n + c] === 1) {
          dfs(r, c);
          found = true;
        }
      }
    }

    const afterDfsHl: Record<number, string> = {};
    const afterDfsLb: Record<number, string> = {};
    for (let i = 0; i < n * n; i++) { afterDfsHl[i] = getCellColor(g[i]); }
    for (const [r, c] of queue) { afterDfsLb[r * n + c] = 'isl1'; }

    steps.push({
      line: 3,
      explanation: `DFS complete. First island marked (shown as found). Added ${queue.length} cells to BFS queue. Now BFS toward second island.`,
      variables: { island1Size: queue.length },
      visualization: makeViz(afterDfsHl, afterDfsLb),
    });

    let stepCount = 0;
    let bridgeFound = false;

    outer: while (queue.length > 0) {
      const size = queue.length;
      stepCount++;

      steps.push({
        line: 8,
        explanation: `BFS step ${stepCount}: expanding ${size} cells from first island. Looking for second island.`,
        variables: { step: stepCount, queueSize: size },
        visualization: makeViz(
          g.reduce((acc, v, i) => { acc[i] = getCellColor(v); return acc; }, {} as Record<number, string>),
          { 0: `step=${stepCount}` }
        ),
      });

      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift()!;
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const nIdx = nr * n + nc;
          if (nr >= 0 && nr < n && nc >= 0 && nc < n) {
            if (g[nIdx] === 1) {
              // reached second island
              const hl: Record<number, string> = {};
              for (let j = 0; j < n * n; j++) hl[j] = getCellColor(g[j]);
              hl[nIdx] = 'sorted';

              steps.push({
                line: 10,
                explanation: `Reached second island at (${nr},${nc}) after ${stepCount - 1} steps! Bridge length = ${stepCount - 1}.`,
                variables: { result: stepCount - 1 },
                visualization: makeViz(hl, { [nIdx]: `bridge=${stepCount - 1}` }),
              });
              bridgeFound = true;
              break outer;
            }
            if (g[nIdx] === 0) {
              g[nIdx] = -1;
              queue.push([nr, nc]);
            }
          }
        }
      }
    }

    if (!bridgeFound) {
      steps.push({
        line: 11,
        explanation: `BFS ended without reaching second island.`,
        variables: { result: -1 },
        visualization: makeViz(
          g.reduce((acc, v, i) => { acc[i] = getCellColor(v); return acc; }, {} as Record<number, string>),
          {}
        ),
      });
    }

    return steps;
  },
};

export default shortestBridge;
