import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxAreaOfIsland: AlgorithmDefinition = {
  id: 'max-area-of-island',
  title: 'Max Area of Island',
  leetcodeNumber: 695,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary matrix (1=land, 0=water), find the area of the largest island. An island is a group of connected 1s (4-directionally). Use DFS to flood-fill each island and count its cells, tracking the maximum.',
  tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function maxAreaOfIsland(grid):
  rows, cols = dimensions
  maxArea = 0
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == 1:
        area = dfs(grid, r, c)
        maxArea = max(maxArea, area)
  return maxArea

function dfs(grid, r, c):
  if out of bounds or grid[r][c] != 1: return 0
  grid[r][c] = 0  // mark visited
  return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)`,
    python: `def maxAreaOfIsland(grid):
    rows, cols = len(grid), len(grid[0])
    def dfs(r, c):
        if r<0 or r>=rows or c<0 or c>=cols or grid[r][c]==0: return 0
        grid[r][c] = 0
        return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1)
    maxArea = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                maxArea = max(maxArea, dfs(r, c))
    return maxArea`,
    javascript: `function maxAreaOfIsland(grid) {
  const rows = grid.length, cols = grid[0].length;
  function dfs(r, c) {
    if (r<0||r>=rows||c<0||c>=cols||grid[r][c]===0) return 0;
    grid[r][c] = 0;
    return 1 + dfs(r+1,c) + dfs(r-1,c) + dfs(r,c+1) + dfs(r,c-1);
  }
  let maxArea = 0;
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++)
    if (grid[r][c]===1) maxArea = Math.max(maxArea, dfs(r,c));
  return maxArea;
}`,
    java: `public int maxAreaOfIsland(int[][] grid) {
    int rows=grid.length,cols=grid[0].length,maxArea=0;
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++)
        if(grid[r][c]==1) maxArea=Math.max(maxArea,dfs(grid,r,c));
    return maxArea;
}
int dfs(int[][]g,int r,int c){
    if(r<0||r>=g.length||c<0||c>=g[0].length||g[r][c]==0)return 0;
    g[r][c]=0;return 1+dfs(g,r+1,c)+dfs(g,r-1,c)+dfs(g,r,c+1)+dfs(g,r,c-1);
}`,
  },
  defaultInput: {
    grid: [
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
    ],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Binary Grid (1=land, 0=water)',
      type: 'array',
      defaultValue: [
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0],
        [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
      ],
      placeholder: '[[0,1,1],[1,1,0],[0,1,0]]',
      helperText: '2D binary grid: 1=land, 0=water',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const islandId = new Array(rows * cols).fill(-1);
    const islandColors = ['found', 'active', 'pointer', 'comparing', 'match'];
    let islandCount = 0;
    let maxArea = 0;

    function makeViz(highlights: Record<number, string>, area: number, max: number): ArrayVisualization {
      const base: Record<number, string> = {};
      for (let i = 0; i < rows * cols; i++) {
        if (islandId[i] >= 0) base[i] = islandColors[islandId[i] % islandColors.length];
      }
      return {
        type: 'array',
        array: grid.flat(),
        highlights: { ...base, ...highlights },
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => [i, grid[Math.floor(i / cols)][i % cols] === 0 ? '0' : '1'])
        ),
        auxData: {
          label: 'Island Areas',
          entries: [
            { key: 'Current island area', value: String(area) },
            { key: 'Max area so far', value: String(max) },
            { key: 'Islands found', value: String(islandCount) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${rows}x${cols} grid. DFS from each unvisited land cell, count connected area. Track maximum island area.`,
      variables: { rows, cols },
      visualization: makeViz({}, 0, 0),
    });

    function dfs(r: number, c: number, id: number): number {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] === 0) return 0;
      grid[r][c] = 0;
      islandId[idx(r, c)] = id;
      steps.push({
        line: 12,
        explanation: `DFS: visit (${r},${c}). Mark as visited. Count 1 for this cell.`,
        variables: { r, c, islandId: id },
        visualization: makeViz({ [idx(r, c)]: 'swapping' }, 0, maxArea),
      });
      return 1 + dfs(r + 1, c, id) + dfs(r - 1, c, id) + dfs(r, c + 1, id) + dfs(r, c - 1, id);
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          const id = islandCount;
          const area = dfs(r, c, id);
          islandCount++;
          if (area > maxArea) maxArea = area;
          steps.push({
            line: 7,
            explanation: `Island #${islandCount} starting at (${r},${c}) has area ${area}. Max area: ${maxArea}.`,
            variables: { islandCount, area, maxArea },
            visualization: makeViz({}, area, maxArea),
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Scan complete. Found ${islandCount} island(s). Maximum island area: ${maxArea}.`,
      variables: { result: maxArea },
      visualization: makeViz({}, 0, maxArea),
    });

    return steps;
  },
};

export default maxAreaOfIsland;
