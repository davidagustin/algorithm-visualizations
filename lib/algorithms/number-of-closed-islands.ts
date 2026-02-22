import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfClosedIslands: AlgorithmDefinition = {
  id: 'number-of-closed-islands',
  title: 'Number of Closed Islands',
  leetcodeNumber: 1254,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary matrix (0=land, 1=water), count islands that are completely surrounded by water (i.e., not touching the border). Strategy: first flood-fill all land connected to borders (mark as water), then count remaining land islands.',
  tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function closedIsland(grid):
  rows, cols = dimensions
  // Flood fill border-connected land
  for r in [0, rows-1]:
    for c in range(cols): dfs(r, c)
  for c in [0, cols-1]:
    for r in range(rows): dfs(r, c)
  // Count remaining islands
  count = 0
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == 0:
        dfs(r, c)
        count += 1
  return count`,
    python: `def closedIsland(grid):
    rows, cols = len(grid), len(grid[0])
    def dfs(r, c):
        if r<0 or r>=rows or c<0 or c>=cols or grid[r][c]!=0: return
        grid[r][c] = 1
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    for r in [0, rows-1]:
        for c in range(cols): dfs(r, c)
    for c in [0, cols-1]:
        for r in range(rows): dfs(r, c)
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 0:
                dfs(r, c)
                count += 1
    return count`,
    javascript: `function closedIsland(grid) {
  const rows=grid.length, cols=grid[0].length;
  function dfs(r,c){if(r<0||r>=rows||c<0||c>=cols||grid[r][c]!==0)return;grid[r][c]=1;dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);}
  for(let r of [0,rows-1]) for(let c=0;c<cols;c++) dfs(r,c);
  for(let c of [0,cols-1]) for(let r=0;r<rows;r++) dfs(r,c);
  let count=0;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(grid[r][c]===0){dfs(r,c);count++;}
  return count;
}`,
    java: `public int closedIsland(int[][] grid) {
    int rows=grid.length,cols=grid[0].length;
    for(int r:new int[]{0,rows-1}) for(int c=0;c<cols;c++) dfs(grid,r,c);
    for(int c:new int[]{0,cols-1}) for(int r=0;r<rows;r++) dfs(grid,r,c);
    int count=0;
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) if(grid[r][c]==0){dfs(grid,r,c);count++;}
    return count;
}
void dfs(int[][]g,int r,int c){if(r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]!=0)return;g[r][c]=1;dfs(g,r+1,c);dfs(g,r-1,c);dfs(g,r,c+1);dfs(g,r,c-1);}`,
  },
  defaultInput: {
    grid: [
      [1, 1, 1, 1, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 1, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 0],
      [1, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0],
    ],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid (0=land, 1=water)',
      type: 'array',
      defaultValue: [
        [1, 1, 1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 1, 1, 0],
        [1, 0, 1, 0, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 0],
      ],
      placeholder: '[[1,1,1],[1,0,1],[1,1,1]]',
      helperText: '0=land, 1=water. Count islands fully enclosed by water.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => grid.flat();
    const islandColors = ['found', 'active', 'pointer', 'comparing'];
    const islandId = new Array(rows * cols).fill(-1);

    function makeViz(highlights: Record<number, string>, phase: string, count: number): ArrayVisualization {
      const base: Record<number, string> = {};
      for (let i = 0; i < rows * cols; i++) {
        if (islandId[i] >= 0) base[i] = islandColors[islandId[i] % islandColors.length];
      }
      return {
        type: 'array',
        array: flat(),
        highlights: { ...base, ...highlights },
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => [i, grid[Math.floor(i / cols)][i % cols] === 0 ? 'L' : 'W'])
        ),
        auxData: {
          label: 'Closed Islands',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Grid', value: `${rows}x${cols}` },
            { key: 'Closed islands', value: String(count) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${rows}x${cols} grid. 0=land, 1=water. Phase 1: flood-fill border-connected land (open islands). Phase 2: count remaining enclosed islands.`,
      variables: { rows, cols },
      visualization: makeViz({}, 'Init', 0),
    });

    // Phase 1: flood fill border land
    function floodBorder(r: number, c: number) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 0) return;
      grid[r][c] = 1;
      steps.push({
        line: 6,
        explanation: `Border flood-fill: mark land at (${r},${c}) as water — it touches border and cannot be enclosed.`,
        variables: { r, c },
        visualization: makeViz({ [idx(r, c)]: 'visited' }, 'Border flood', 0),
      });
      floodBorder(r + 1, c);
      floodBorder(r - 1, c);
      floodBorder(r, c + 1);
      floodBorder(r, c - 1);
    }

    for (let c = 0; c < cols; c++) { floodBorder(0, c); floodBorder(rows - 1, c); }
    for (let r = 1; r < rows - 1; r++) { floodBorder(r, 0); floodBorder(r, cols - 1); }

    steps.push({
      line: 10,
      explanation: `Border flood-fill complete. All open (border-touching) land removed. Now count remaining enclosed land islands.`,
      variables: {},
      visualization: makeViz({}, 'Counting', 0),
    });

    // Phase 2: count closed islands
    let count = 0;

    function dfsIsland(r: number, c: number, id: number) {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== 0) return;
      grid[r][c] = 1;
      islandId[idx(r, c)] = id;
      dfsIsland(r + 1, c, id);
      dfsIsland(r - 1, c, id);
      dfsIsland(r, c + 1, id);
      dfsIsland(r, c - 1, id);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 0) {
          dfsIsland(r, c, count);
          count++;
          steps.push({
            line: 12,
            explanation: `Found closed island #${count} starting at (${r},${c}). DFS marks all connected land cells.`,
            variables: { r, c, islandNumber: count },
            visualization: makeViz({ [idx(r, c)]: 'swapping' }, 'Counting', count),
          });
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Done. Total closed islands: ${count}.`,
      variables: { result: count },
      visualization: makeViz({}, 'Complete', count),
    });

    return steps;
  },
};

export default numberOfClosedIslands;
