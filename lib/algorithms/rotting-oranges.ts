import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rottingOranges: AlgorithmDefinition = {
  id: 'rotting-oranges',
  title: 'Rotting Oranges',
  leetcodeNumber: 994,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a grid where 0 is empty, 1 is a fresh orange, and 2 is a rotten orange, find the minimum minutes until no fresh orange remains. Each minute, any fresh orange adjacent to a rotten orange becomes rotten. Uses multi-source BFS from all initially rotten oranges simultaneously.',
  tags: ['graph', 'bfs', 'multi-source bfs', 'matrix', 'simulation'],

  code: {
    pseudocode: `function orangesRotting(grid):
  rows, cols = dimensions
  queue = all initially rotten oranges
  fresh = count of fresh oranges
  minutes = 0
  while queue not empty and fresh > 0:
    for size of current queue:
      r, c = queue.dequeue()
      for each direction (nr, nc):
        if valid fresh orange:
          make rotten, fresh -= 1
          queue.enqueue(nr, nc)
    minutes += 1
  return minutes if fresh == 0 else -1`,

    python: `def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2: queue.append((r,c))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    dirs = [(-1,0),(1,0),(0,-1),(0,1)]
    while queue and fresh > 0:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in dirs:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr,nc))
        minutes += 1
    return minutes if fresh == 0 else -1`,

    javascript: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r=0;r<rows;r++) for(let c=0;c<cols;c++) {
    if (grid[r][c]===2) queue.push([r,c]);
    else if (grid[r][c]===1) fresh++;
  }
  let minutes = 0;
  const dirs=[[-1,0],[1,0],[0,-1],[0,1]];
  while (queue.length && fresh > 0) {
    let size = queue.length;
    while (size-- > 0) {
      const [r,c] = queue.shift();
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc;
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]===1) {
          grid[nr][nc]=2; fresh--; queue.push([nr,nc]);
        }
      }
    }
    minutes++;
  }
  return fresh === 0 ? minutes : -1;
}`,

    java: `public int orangesRotting(int[][] grid) {
    int rows=grid.length, cols=grid[0].length, fresh=0, minutes=0;
    Queue<int[]> queue = new LinkedList<>();
    for (int r=0;r<rows;r++) for(int c=0;c<cols;c++) {
        if (grid[r][c]==2) queue.add(new int[]{r,c});
        else if (grid[r][c]==1) fresh++;
    }
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty() && fresh>0) {
        for (int size=queue.size();size>0;size--) {
            int[] curr=queue.poll();
            for (int[] d:dirs) {
                int nr=curr[0]+d[0],nc=curr[1]+d[1];
                if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]==1) {
                    grid[nr][nc]=2; fresh--; queue.add(new int[]{nr,nc});
                }
            }
        }
        minutes++;
    }
    return fresh==0?minutes:-1;
}`,
  },

  defaultInput: {
    grid: [2, 1, 1, 1, 1, 0, 0, 1, 1],
    rows: 3,
    cols: 3,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [2, 1, 1, 1, 1, 0, 0, 1, 1],
      placeholder: '2,1,1,1,1,0,0,1,1',
      helperText: 'Flattened grid: 0=empty, 1=fresh, 2=rotten',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatGrid = input.grid as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const g = flatGrid.slice(0, rows * cols);
    while (g.length < rows * cols) g.push(0);

    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    const queue: [number, number][] = [];
    let fresh = 0;

    const getHighlight = (val: number) => val === 2 ? 'mismatch' : val === 1 ? 'active' : 'visited';

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...g],
      highlights,
      labels,
    });

    // Initial state
    const initHl: Record<number, string> = {};
    const initLb: Record<number, string> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (g[idx] === 2) { queue.push([r, c]); initHl[idx] = 'mismatch'; initLb[idx] = 'rot'; }
        else if (g[idx] === 1) { fresh++; initHl[idx] = 'active'; initLb[idx] = 'fresh'; }
        else { initHl[idx] = 'visited'; initLb[idx] = 'empty'; }
      }
    }

    steps.push({
      line: 1,
      explanation: `Initial state: ${queue.length} rotten oranges, ${fresh} fresh oranges. Multi-source BFS begins.`,
      variables: { rotten: queue.length, fresh },
      visualization: makeViz(initHl, initLb),
    });

    let minutes = 0;

    while (queue.length > 0 && fresh > 0) {
      const size = queue.length;
      minutes++;

      const waveHl: Record<number, string> = {};
      const waveLb: Record<number, string> = {};
      for (let i = 0; i < rows * cols; i++) waveHl[i] = getHighlight(g[i]);

      steps.push({
        line: 5,
        explanation: `Minute ${minutes}: process ${size} rotten oranges from this wave.`,
        variables: { minute: minutes, waveFront: size, freshRemaining: fresh },
        visualization: makeViz(waveHl, waveLb),
      });

      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift()!;
        const idx = r * cols + c;

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const nIdx = nr * cols + nc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && g[nIdx] === 1) {
            g[nIdx] = 2;
            fresh--;
            queue.push([nr, nc]);

            const hl: Record<number, string> = {};
            const lb: Record<number, string> = {};
            for (let j = 0; j < rows * cols; j++) hl[j] = getHighlight(g[j]);
            hl[idx] = 'pointer';
            lb[idx] = 'src';
            hl[nIdx] = 'found';
            lb[nIdx] = `rot! m=${minutes}`;

            steps.push({
              line: 9,
              explanation: `Orange at (${nr},${nc}) is now rotten (spread from (${r},${c})). Fresh remaining: ${fresh}.`,
              variables: { spreadsTo: `(${nr},${nc})`, freshRemaining: fresh, minute: minutes },
              visualization: makeViz(hl, lb),
            });
          }
        }
      }
    }

    const finalHl: Record<number, string> = {};
    for (let i = 0; i < rows * cols; i++) finalHl[i] = getHighlight(g[i]);

    const result = fresh === 0 ? minutes : -1;
    steps.push({
      line: 12,
      explanation: `BFS complete. Fresh remaining: ${fresh}. Result: ${result === -1 ? 'Impossible (-1)' : `${result} minutes`}.`,
      variables: { freshLeft: fresh, result },
      visualization: makeViz(finalHl, { 0: `ans=${result}` }),
    });

    return steps;
  },
};

export default rottingOranges;
