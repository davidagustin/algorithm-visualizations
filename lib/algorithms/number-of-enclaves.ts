import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfEnclaves: AlgorithmDefinition = {
  id: 'number-of-enclaves',
  title: 'Number of Enclaves',
  leetcodeNumber: 1020,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary grid where 1 is land and 0 is water, count the number of land cells that cannot walk off the boundary of the grid. Use BFS/DFS from all boundary land cells to mark them as reachable. Any remaining land cells are enclaves.',
  tags: ['graph', 'bfs', 'dfs', 'matrix', 'flood fill', 'boundary'],

  code: {
    pseudocode: `function numEnclaves(grid):
  rows, cols = dimensions
  // BFS from all boundary land cells
  queue = all land cells on boundary
  mark them visited
  while queue not empty:
    r, c = queue.dequeue()
    for each neighbor (nr, nc):
      if valid and land and not visited:
        visited.add((nr,nc))
        queue.enqueue((nr,nc))
  // Count unvisited land cells
  return count of land cells not in visited`,

    python: `def numEnclaves(grid):
    rows, cols = len(grid), len(grid[0])
    visited = set()
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if (r==0 or r==rows-1 or c==0 or c==cols-1) and grid[r][c]==1:
                queue.append((r,c))
                visited.add((r,c))
    while queue:
        r, c = queue.popleft()
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1 and (nr,nc) not in visited:
                visited.add((nr,nc))
                queue.append((nr,nc))
    return sum(grid[r][c]==1 and (r,c) not in visited for r in range(rows) for c in range(cols))`,

    javascript: `function numEnclaves(grid) {
  const rows = grid.length, cols = grid[0].length;
  const visited = new Set();
  const queue = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if ((r===0||r===rows-1||c===0||c===cols-1) && grid[r][c]===1) {
        queue.push([r,c]); visited.add(r*cols+c);
      }
  while (queue.length) {
    const [r,c] = queue.shift();
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]===1&&!visited.has(nr*cols+nc)) {
        visited.add(nr*cols+nc); queue.push([nr,nc]);
      }
    }
  }
  let count = 0;
  for (let r=0;r<rows;r++) for(let c=0;c<cols;c++)
    if (grid[r][c]===1 && !visited.has(r*cols+c)) count++;
  return count;
}`,

    java: `public int numEnclaves(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    boolean[][] visited = new boolean[rows][cols];
    Queue<int[]> queue = new LinkedList<>();
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if ((r==0||r==rows-1||c==0||c==cols-1) && grid[r][c]==1) {
                queue.add(new int[]{r,c}); visited[r][c]=true;
            }
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        for (int[] d : dirs) {
            int nr=curr[0]+d[0], nc=curr[1]+d[1];
            if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&grid[nr][nc]==1&&!visited[nr][nc]) {
                visited[nr][nc]=true; queue.add(new int[]{nr,nc});
            }
        }
    }
    int count = 0;
    for (int r=0;r<rows;r++) for(int c=0;c<cols;c++)
        if (grid[r][c]==1 && !visited[r][c]) count++;
    return count;
}`,
  },

  defaultInput: {
    grid: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
    rows: 4,
    cols: 4,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0],
      placeholder: '0,0,0,0,1,0,1,0,...',
      helperText: 'Flattened 4x4 grid (1=land, 0=water)',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatGrid = input.grid as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const grid = flatGrid.slice(0, rows * cols);
    while (grid.length < rows * cols) grid.push(0);

    const visited = new Set<number>();
    const queue: [number, number][] = [];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...grid],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count enclaves in ${rows}x${cols} grid. First, BFS from all boundary land cells to find reachable land.`,
      variables: { rows, cols },
      visualization: makeViz({}, {}),
    });

    // Seed from boundary
    const initHl: Record<number, string> = {};
    const initLb: Record<number, string> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if ((r === 0 || r === rows - 1 || c === 0 || c === cols - 1) && grid[idx] === 1) {
          queue.push([r, c]);
          visited.add(idx);
          initHl[idx] = 'active';
          initLb[idx] = 'border';
        }
      }
    }

    steps.push({
      line: 3,
      explanation: `Seed BFS with ${queue.length} boundary land cells. These land cells can reach the boundary.`,
      variables: { boundaryCells: queue.map(([r, c]) => `(${r},${c})`).join(',') },
      visualization: makeViz(initHl, initLb),
    });

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const idx = r * cols + c;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'visited'; lb[v] = 'reach'; }
      hl[idx] = 'active';
      lb[idx] = 'curr';

      steps.push({
        line: 7,
        explanation: `Process (${r},${c}). Expand to adjacent land cells not yet visited.`,
        variables: { row: r, col: c, visitedCount: visited.size },
        visualization: makeViz(hl, lb),
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const nIdx = nr * cols + nc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nIdx] === 1 && !visited.has(nIdx)) {
          visited.add(nIdx);
          queue.push([nr, nc]);

          const nhl = { ...hl };
          const nlb = { ...lb };
          nhl[nIdx] = 'comparing';
          nlb[nIdx] = 'reach';

          steps.push({
            line: 9,
            explanation: `Land cell (${nr},${nc}) is reachable from boundary. Mark and enqueue.`,
            variables: { neighbor: `(${nr},${nc})` },
            visualization: makeViz(nhl, nlb),
          });
        }
      }
    }

    // Count enclaves
    let count = 0;
    const finalHl: Record<number, string> = {};
    const finalLb: Record<number, string> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (grid[idx] === 1) {
          if (!visited.has(idx)) {
            count++;
            finalHl[idx] = 'found';
            finalLb[idx] = 'enclave';
          } else {
            finalHl[idx] = 'visited';
            finalLb[idx] = 'reach';
          }
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Count land cells not reachable from boundary. Found ${count} enclave cells.`,
      variables: { enclaveCount: count },
      visualization: makeViz(finalHl, finalLb),
    });

    return steps;
  },
};

export default numberOfEnclaves;
