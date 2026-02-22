import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfIslandsMatrix: AlgorithmDefinition = {
  id: 'number-of-islands-matrix',
  title: 'Number of Islands (Matrix)',
  leetcodeNumber: 200,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Count the number of islands in a 2D grid of 1s (land) and 0s (water). An island is surrounded by water and is formed by connecting adjacent land cells horizontally or vertically. Use DFS/BFS to mark each connected component.',
  tags: ['Matrix', 'DFS', 'BFS', 'Graph'],
  code: {
    pseudocode: `function numIslands(grid):
  count = 0
  for each cell (i,j):
    if grid[i][j] == '1':
      count += 1
      dfs(grid, i, j)
  return count

function dfs(grid, i, j):
  if out-of-bounds or grid[i][j] != '1': return
  grid[i][j] = '0'  # mark visited
  dfs all 4 neighbors`,
    python: `def numIslands(grid):
    count = 0
    def dfs(i, j):
        if i<0 or i>=len(grid) or j<0 or j>=len(grid[0]) or grid[i][j]!='1': return
        grid[i][j]='0'
        dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1)
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j]=='1': count+=1; dfs(i,j)
    return count`,
    javascript: `function numIslands(grid) {
  function dfs(i, j) {
    if (i<0||i>=grid.length||j<0||j>=grid[0].length||grid[i][j]!=='1') return;
    grid[i][j]='0';
    dfs(i+1,j); dfs(i-1,j); dfs(i,j+1); dfs(i,j-1);
  }
  let count=0;
  for (let i=0;i<grid.length;i++)
    for (let j=0;j<grid[0].length;j++)
      if (grid[i][j]==='1') { count++; dfs(i,j); }
  return count;
}`,
    java: `public int numIslands(char[][] grid) {
    int count=0;
    for(int i=0;i<grid.length;i++)
        for(int j=0;j<grid[0].length;j++)
            if(grid[i][j]=='1'){count++;dfs(grid,i,j);}
    return count;
}
void dfs(char[][] g,int i,int j){
    if(i<0||i>=g.length||j<0||j>=g[0].length||g[i][j]!='1') return;
    g[i][j]='0';dfs(g,i+1,j);dfs(g,i-1,j);dfs(g,i,j+1);dfs(g,i,j-1);
}`,
  },
  defaultInput: { matrix: [[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Grid (1=land, 0=water)',
      type: 'string',
      defaultValue: '1 1 0 0 0, 1 1 0 0 0, 0 0 1 0 0, 0 0 0 1 1',
      placeholder: 'e.g. 1 1 0 0 0, 1 1 0 0 0',
      helperText: 'Rows by commas, 1=land 0=water',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let grid: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      grid = (input.matrix as number[][]).map(r => [...r]);
    } else {
      grid = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = grid.length, n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    let islandCount = 0;

    function makeViz(curr: number, note: string): ArrayVisualization {
      const flat = grid.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = flat[i] === 0 ? '0' : flat[i] === 1 ? '1' : `${flat[i]}`;
        highlights[i] = flat[i] === 0 ? 'default' : flat[i] === 1 ? 'found' : 'visited';
      }
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Number of Islands', entries: [{ key: 'Islands', value: `${islandCount}` }, { key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count islands in ${m}x${n} grid using DFS. Each connected component of 1s is one island.`,
      variables: { m, n },
      visualization: makeViz(-1, 'Initial'),
    });

    function dfs(i: number, j: number) {
      if (i < 0 || i >= m || j < 0 || j >= n || grid[i][j] !== 1) return;
      grid[i][j] = 2; // mark visited
      const idx = i * n + j;
      steps.push({
        line: 9,
        explanation: `DFS: mark (${i},${j}) as visited (island #${islandCount}).`,
        variables: { i, j, island: islandCount },
        visualization: makeViz(idx, `Island #${islandCount}`),
      });
      dfs(i + 1, j); dfs(i - 1, j); dfs(i, j + 1); dfs(i, j - 1);
    }

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 1) {
          islandCount++;
          steps.push({
            line: 4,
            explanation: `Found unvisited land at (${i},${j}). Starting island #${islandCount}.`,
            variables: { i, j, islandCount },
            visualization: makeViz(i * n + j, `New island #${islandCount}`),
          });
          dfs(i, j);
        }
      }
    }

    steps.push({
      line: 6,
      explanation: `Total islands = ${islandCount}.`,
      variables: { islandCount },
      visualization: makeViz(-1, `Done: ${islandCount} islands`),
    });

    return steps;
  },
};

export default numberOfIslandsMatrix;
