import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfDistinctIslands: AlgorithmDefinition = {
  id: 'number-of-distinct-islands',
  title: 'Number of Distinct Islands',
  leetcodeNumber: 694,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary grid where 1 is land, count the number of distinct islands. Two islands are the same if one can be translated (not rotated/reflected) to match the other. DFS traces each island shape as a path string, and a set of shape strings gives the count of distinct islands.',
  tags: ['dfs', 'graph', 'grid', 'hashing', 'island'],

  code: {
    pseudocode: `function numDistinctIslands(grid):
  m, n = dimensions
  visited = set of visited cells
  shapes = set of shape strings
  for each cell (r, c):
    if grid[r][c] == 1 and (r,c) not visited:
      shape = []
      dfs(r, c, 'O', shape)  // 'O' = origin
      shapes.add(tuple(shape))
  return len(shapes)

dfs(r, c, direction, shape):
  if out of bounds or visited or grid[r][c] == 0: return
  mark visited
  shape.append(direction)
  dfs(r+1, c, 'D', shape)
  dfs(r-1, c, 'U', shape)
  dfs(r, c+1, 'R', shape)
  dfs(r, c-1, 'L', shape)
  shape.append('B')  // backtrack marker`,

    python: `def numDistinctIslands(grid):
    m, n = len(grid), len(grid[0])
    visited = set()
    shapes = set()

    def dfs(r, c, direction, shape):
        if r < 0 or r >= m or c < 0 or c >= n: return
        if (r, c) in visited or grid[r][c] == 0: return
        visited.add((r, c))
        shape.append(direction)
        dfs(r+1, c, 'D', shape)
        dfs(r-1, c, 'U', shape)
        dfs(r, c+1, 'R', shape)
        dfs(r, c-1, 'L', shape)
        shape.append('B')

    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1 and (r, c) not in visited:
                shape = []
                dfs(r, c, 'O', shape)
                shapes.add(tuple(shape))
    return len(shapes)`,

    javascript: `function numDistinctIslands(grid) {
  const m = grid.length, n = grid[0].length;
  const visited = new Set();
  const shapes = new Set();

  function dfs(r, c, dir, shape) {
    if (r < 0 || r >= m || c < 0 || c >= n) return;
    if (visited.has(r+','+c) || grid[r][c] === 0) return;
    visited.add(r+','+c);
    shape.push(dir);
    dfs(r+1, c, 'D', shape);
    dfs(r-1, c, 'U', shape);
    dfs(r, c+1, 'R', shape);
    dfs(r, c-1, 'L', shape);
    shape.push('B');
  }

  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 1 && !visited.has(r+','+c)) {
        const shape = [];
        dfs(r, c, 'O', shape);
        shapes.add(shape.join(''));
      }
    }
  }
  return shapes.size;
}`,

    java: `public int numDistinctIslands(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    boolean[][] visited = new boolean[m][n];
    Set<String> shapes = new HashSet<>();

    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (grid[r][c] == 1 && !visited[r][c]) {
                StringBuilder shape = new StringBuilder();
                dfs(grid, visited, r, c, 'O', shape, m, n);
                shapes.add(shape.toString());
            }
        }
    }
    return shapes.size();
}

void dfs(int[][] g, boolean[][] vis, int r, int c, char dir, StringBuilder shape, int m, int n) {
    if (r<0||r>=m||c<0||c>=n||vis[r][c]||g[r][c]==0) return;
    vis[r][c] = true;
    shape.append(dir);
    dfs(g,vis,r+1,c,'D',shape,m,n);
    dfs(g,vis,r-1,c,'U',shape,m,n);
    dfs(g,vis,r,c+1,'R',shape,m,n);
    dfs(g,vis,r,c-1,'L',shape,m,n);
    shape.append('B');
}`,
  },

  defaultInput: {
    grid: [[1,1,0,1,1],[1,0,0,0,0],[0,0,0,0,1],[1,1,0,1,1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 1],
      placeholder: '1,1,0,1,1,...',
      helperText: '1=land, 0=water in row-major order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const visited = new Set<string>();
    const shapes = new Set<string>();

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Will DFS each unvisited land cell and record the traversal path as a shape signature.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(
          grid.flat().map((v, i) => [i, v === 1 ? 'active' : 'default'])
        ),
        labels: {},
      } as ArrayVisualization,
    });

    function dfs(r: number, c: number, dir: string, shape: string[]): void {
      if (r < 0 || r >= m || c < 0 || c >= n) return;
      if (visited.has(`${r},${c}`) || grid[r][c] === 0) return;
      visited.add(`${r},${c}`);
      shape.push(dir);
      dfs(r + 1, c, 'D', shape);
      dfs(r - 1, c, 'U', shape);
      dfs(r, c + 1, 'R', shape);
      dfs(r, c - 1, 'L', shape);
      shape.push('B');
    }

    let islandCount = 0;
    for (let r = 0; r < m && steps.length < 18; r++) {
      for (let c = 0; c < n && steps.length < 18; c++) {
        if (grid[r][c] === 1 && !visited.has(`${r},${c}`)) {
          islandCount++;
          const shape: string[] = [];
          dfs(r, c, 'O', shape);
          const shapeStr = shape.join('');
          const isNew = !shapes.has(shapeStr);
          shapes.add(shapeStr);

          const highlights: Record<number, string> = {};
          visited.forEach(key => {
            const [vr, vc] = key.split(',').map(Number);
            highlights[vr * n + vc] = 'visited';
          });
          highlights[r * n + c] = 'active';

          steps.push({
            line: 6,
            explanation: `Island #${islandCount} found at (${r}, ${c}). Shape: "${shapeStr}". ${isNew ? 'NEW distinct island!' : 'Duplicate shape - same as existing island.'}`,
            variables: { island: islandCount, shape: shapeStr, distinctSoFar: shapes.size, isNew },
            visualization: {
              type: 'array',
              array: grid.flat(),
              highlights,
              labels: { [r * n + c]: `island${islandCount}` },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Scanned entire grid. Total distinct islands: ${shapes.size}. Shape signatures used for deduplication.`,
      variables: { distinctIslands: shapes.size, totalIslands: islandCount },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(
          [...visited].map(key => {
            const [vr, vc] = key.split(',').map(Number);
            return [vr * n + vc, 'sorted'];
          })
        ),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfDistinctIslands;
