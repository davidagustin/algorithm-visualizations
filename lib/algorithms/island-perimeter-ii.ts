import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const islandPerimeterII: AlgorithmDefinition = {
  id: 'island-perimeter-ii',
  title: 'Island Perimeter',
  leetcodeNumber: 463,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Calculate the perimeter of the island in a grid. Each land cell (1) contributes 4 to the perimeter, but each shared edge with another land cell subtracts 2. Alternatively, count each land-to-water/border edge.',
  tags: ['Matrix', 'Math', 'Counting'],
  code: {
    pseudocode: `function islandPerimeter(grid):
  perimeter = 0
  for each cell (i,j):
    if grid[i][j] == 1:
      perimeter += 4
      if i>0 and grid[i-1][j]==1: perimeter -= 2
      if j>0 and grid[i][j-1]==1: perimeter -= 2
  return perimeter`,
    python: `def islandPerimeter(grid):
    perimeter = 0
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == 1:
                perimeter += 4
                if i > 0 and grid[i-1][j] == 1: perimeter -= 2
                if j > 0 and grid[i][j-1] == 1: perimeter -= 2
    return perimeter`,
    javascript: `function islandPerimeter(grid) {
  let p = 0;
  for (let i = 0; i < grid.length; i++)
    for (let j = 0; j < grid[0].length; j++)
      if (grid[i][j] === 1) {
        p += 4;
        if (i>0 && grid[i-1][j]===1) p -= 2;
        if (j>0 && grid[i][j-1]===1) p -= 2;
      }
  return p;
}`,
    java: `public int islandPerimeter(int[][] grid) {
    int p = 0;
    for (int i=0;i<grid.length;i++)
        for (int j=0;j<grid[0].length;j++)
            if (grid[i][j]==1) {
                p += 4;
                if (i>0 && grid[i-1][j]==1) p-=2;
                if (j>0 && grid[i][j-1]==1) p-=2;
            }
    return p;
}`,
  },
  defaultInput: { matrix: [[0, 1, 0, 0], [1, 1, 1, 0], [0, 1, 0, 0], [1, 1, 0, 0]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Grid (1=land, 0=water)',
      type: 'string',
      defaultValue: '0 1 0 0, 1 1 1 0, 0 1 0 0, 1 1 0 0',
      placeholder: 'e.g. 0 1 0 0, 1 1 1 0',
      helperText: 'Rows by commas, 1=land 0=water',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let grid: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      grid = input.matrix as number[][];
    } else {
      grid = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = grid.length, n = grid[0].length;
    const steps: AlgorithmStep[] = [];
    let perimeter = 0;

    function makeViz(curr: number, contribution: number): ArrayVisualization {
      const flat = grid.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        labels[i] = flat[i] === 1 ? '1' : '0';
        highlights[i] = flat[i] === 1 ? 'found' : 'default';
      }
      if (curr >= 0) highlights[curr] = contribution > 0 ? 'active' : 'comparing';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Island Perimeter', entries: [{ key: 'Perimeter', value: `${perimeter}` }, { key: 'Contribution', value: `${contribution > 0 ? '+' : ''}${contribution}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Calculate island perimeter in ${m}x${n} grid. Each land cell adds 4; each shared edge subtracts 2.`,
      variables: { m, n },
      visualization: makeViz(-1, 0),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === 1) {
          const idx = i * n + j;
          const before = perimeter;
          perimeter += 4;
          let contribution = 4;
          const sharedAbove = i > 0 && grid[i - 1][j] === 1;
          const sharedLeft = j > 0 && grid[i][j - 1] === 1;
          if (sharedAbove) { perimeter -= 2; contribution -= 2; }
          if (sharedLeft) { perimeter -= 2; contribution -= 2; }
          steps.push({
            line: 5,
            explanation: `Cell (${i},${j}): +4${sharedAbove ? ' -2(above)' : ''}${sharedLeft ? ' -2(left)' : ''} = ${contribution > 0 ? '+' : ''}${contribution}. Total perimeter: ${before} → ${perimeter}.`,
            variables: { i, j, contribution, perimeter },
            visualization: makeViz(idx, contribution),
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `Island perimeter = ${perimeter}.`,
      variables: { perimeter },
      visualization: makeViz(-1, 0),
    });

    return steps;
  },
};

export default islandPerimeterII;
