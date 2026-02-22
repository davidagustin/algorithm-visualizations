import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const coloringABorder: AlgorithmDefinition = {
  id: 'coloring-a-border',
  title: 'Coloring A Border',
  leetcodeNumber: 1034,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a 2D grid, a starting cell (row, col) with original color, and a new color, find the connected component containing the start, then color only its border cells with the new color. Border cells are those on the grid edge or adjacent to a different-color cell.',
  tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function colorBorder(grid, row, col, color):
  origColor = grid[row][col]
  visited = set()
  component = set()
  dfs(row, col)
  for (r, c) in component:
    if isBorder(r, c, origColor):
      grid[r][c] = color
  return grid

function isBorder(r, c, origColor):
  return r==0 or r==m-1 or c==0 or c==n-1 or
         any neighbor has different color`,
    python: `def colorBorder(grid, row, col, color):
    m, n = len(grid), len(grid[0])
    orig = grid[row][col]
    visited = set()
    component = set()
    def dfs(r, c):
        if (r,c) in visited: return
        if r<0 or r>=m or c<0 or c>=n: return
        if grid[r][c] != orig: return
        visited.add((r,c)); component.add((r,c))
        dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1)
    dfs(row, col)
    for r,c in component:
        if (r==0 or r==m-1 or c==0 or c==n-1 or
            any(grid[r+dr][c+dc]!=orig for dr,dc in [(1,0),(-1,0),(0,1),(0,-1)]
                if 0<=r+dr<m and 0<=c+dc<n)):
            grid[r][c]=color
    return grid`,
    javascript: `function colorBorder(grid, row, col, color) {
  const m=grid.length, n=grid[0].length;
  const orig=grid[row][col];
  const visited=new Set();
  const component=[];
  function dfs(r,c) {
    const key=r*n+c;
    if(visited.has(key)||r<0||r>=m||c<0||c>=n||grid[r][c]!==orig) return;
    visited.add(key); component.push([r,c]);
    dfs(r+1,c);dfs(r-1,c);dfs(r,c+1);dfs(r,c-1);
  }
  dfs(row,col);
  for(const[r,c] of component){
    let border=r===0||r===m-1||c===0||c===n-1;
    if(!border) for(const[dr,dc] of [[1,0],[-1,0],[0,1],[0,-1]])
      if(grid[r+dr][c+dc]!==orig){border=true;break;}
    if(border) grid[r][c]=color;
  }
  return grid;
}`,
    java: `public int[][] colorBorder(int[][] grid, int row, int col, int color) {
    int m=grid.length,n=grid[0].length,orig=grid[row][col];
    Set<Integer> vis=new HashSet<>(); List<int[]> comp=new ArrayList<>();
    dfs(grid,row,col,orig,vis,comp,m,n);
    int[][]dirs={{1,0},{-1,0},{0,1},{0,-1}};
    for(int[]rc:comp){
        boolean bdr=rc[0]==0||rc[0]==m-1||rc[1]==0||rc[1]==n-1;
        if(!bdr) for(int[]d:dirs){int nr=rc[0]+d[0],nc=rc[1]+d[1];
            if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]!=orig){bdr=true;break;}}
        if(bdr)grid[rc[0]][rc[1]]=color;
    }
    return grid;
}`,
  },
  defaultInput: {
    grid: [[1,1,1],[1,1,0],[1,0,1]],
    row: 1,
    col: 1,
    color: 2,
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [[1,1,1],[1,1,0],[1,0,1]],
      placeholder: '[[1,1,1],[1,1,0],[1,0,1]]',
    },
    {
      name: 'row',
      label: 'Start Row',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'col',
      label: 'Start Col',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'color',
      label: 'New Color',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const row = input.row as number;
    const col = input.col as number;
    const color = input.color as number;
    const m = rawGrid.length;
    const n = rawGrid[0].length;
    const steps: AlgorithmStep[] = [];

    const grid = rawGrid.map(r => [...r]);
    const orig = grid[row][col];

    const visited = new Set<number>();
    const component: number[][] = [];

    function dfs(r: number, c: number) {
      const key = r * n + c;
      if (visited.has(key) || r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== orig) return;
      visited.add(key);
      component.push([r, c]);
      dfs(r+1,c); dfs(r-1,c); dfs(r,c+1); dfs(r,c-1);
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: grid.flat(),
        highlights,
        labels: Object.fromEntries(grid.flat().map((v, i) => [i, `(${Math.floor(i/n)},${i%n}):${v}`])),
        auxData: {
          label: 'Coloring A Border',
          entries: [
            { key: 'Original Color', value: String(orig) },
            { key: 'New Color', value: String(color) },
            { key: 'Component Size', value: String(component.length) },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Start at (${row},${col}) with color ${orig}. Find connected component, then color its border cells with ${color}.`,
      variables: { row, col, orig, color },
      visualization: makeViz(
        { [row * n + col]: 'active', ...Object.fromEntries(grid.flat().map((_, i) => [i, 'default'])) },
        `Start: (${row},${col})`
      ),
    });

    dfs(row, col);

    const compH: Record<number, string> = {};
    for (const [r, c] of component) compH[r * n + c] = 'found';
    steps.push({
      line: 8,
      explanation: `DFS complete. Component has ${component.length} cells with color ${orig}.`,
      variables: { componentSize: component.length },
      visualization: makeViz(compH, `Component: ${component.length} cells`),
    });

    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    let borderCount = 0;

    for (const [r, c] of component) {
      let isBorder = r === 0 || r === m-1 || c === 0 || c === n-1;
      if (!isBorder) {
        for (const [dr, dc] of dirs) {
          if (grid[r+dr][c+dc] !== orig) { isBorder = true; break; }
        }
      }
      if (isBorder) {
        grid[r][c] = color;
        borderCount++;
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        finalH[i * n + j] = grid[i][j] === color ? 'active' : 'default';
      }
    }
    steps.push({
      line: 14,
      explanation: `Colored ${borderCount} border cells with new color ${color}.`,
      variables: { borderCount, newColor: color },
      visualization: makeViz(finalH, `${borderCount} border cells colored`),
    });

    return steps;
  },
};

export default coloringABorder;
