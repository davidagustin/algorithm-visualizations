import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const islandPerimeter: AlgorithmDefinition = {
  id: 'island-perimeter',
  title: 'Island Perimeter',
  leetcodeNumber: 463,
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Given a grid where 1 represents land and 0 represents water, calculate the perimeter of the island. For each land cell, it contributes 4 sides to the perimeter minus 2 for each shared side with another land cell. Iterate each cell and count contributions.',
  tags: ['graph', 'matrix', 'grid', 'counting'],

  code: {
    pseudocode: `function islandPerimeter(grid):
  perimeter = 0
  for each cell (r, c) in grid:
    if grid[r][c] == 1:
      perimeter += 4
      if r > 0 and grid[r-1][c] == 1: perimeter -= 2
      if c > 0 and grid[r][c-1] == 1: perimeter -= 2
  return perimeter`,

    python: `def islandPerimeter(grid):
    perimeter = 0
    rows, cols = len(grid), len(grid[0])
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                perimeter += 4
                if r > 0 and grid[r-1][c] == 1:
                    perimeter -= 2
                if c > 0 and grid[r][c-1] == 1:
                    perimeter -= 2
    return perimeter`,

    javascript: `function islandPerimeter(grid) {
  let perimeter = 0;
  const rows = grid.length, cols = grid[0].length;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        perimeter += 4;
        if (r > 0 && grid[r-1][c] === 1) perimeter -= 2;
        if (c > 0 && grid[r][c-1] === 1) perimeter -= 2;
      }
    }
  }
  return perimeter;
}`,

    java: `public int islandPerimeter(int[][] grid) {
    int perimeter = 0;
    int rows = grid.length, cols = grid[0].length;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 1) {
                perimeter += 4;
                if (r > 0 && grid[r-1][c] == 1) perimeter -= 2;
                if (c > 0 && grid[r][c-1] == 1) perimeter -= 2;
            }
        }
    }
    return perimeter;
}`,
  },

  defaultInput: {
    grid: [0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
    rows: 4,
    cols: 4,
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened)',
      type: 'array',
      defaultValue: [0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0],
      placeholder: '0,1,0,0,1,1,0,0,0,1,0,0,1,1,0,0',
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
    let perimeter = 0;

    steps.push({
      line: 1,
      explanation: `Start island perimeter calculation. Grid is ${rows}x${cols}. Count sides exposed for each land cell.`,
      variables: { perimeter: 0, rows, cols },
      visualization: {
        type: 'array',
        array: [...grid],
        highlights: {},
        labels: {},
      },
    });

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        if (grid[idx] === 1) {
          let contrib = 4;
          const hl: Record<number, string> = {};
          const lb: Record<number, string> = {};
          hl[idx] = 'active';
          lb[idx] = 'land';

          steps.push({
            line: 3,
            explanation: `Cell (${r},${c}) is land. Start with +4 sides.`,
            variables: { row: r, col: c, contribution: 4, perimeterBefore: perimeter },
            visualization: { type: 'array', array: [...grid], highlights: { ...hl }, labels: { ...lb } },
          });

          if (r > 0 && grid[(r - 1) * cols + c] === 1) {
            contrib -= 2;
            const topIdx = (r - 1) * cols + c;
            hl[topIdx] = 'comparing';
            lb[topIdx] = 'shared';

            steps.push({
              line: 5,
              explanation: `Cell above (${r - 1},${c}) is also land. Shared side: subtract 2. Contribution now ${contrib}.`,
              variables: { sharedWithTop: true, contribution: contrib },
              visualization: { type: 'array', array: [...grid], highlights: { ...hl }, labels: { ...lb } },
            });
          }

          if (c > 0 && grid[r * cols + (c - 1)] === 1) {
            contrib -= 2;
            const leftIdx = r * cols + (c - 1);
            hl[leftIdx] = 'comparing';
            lb[leftIdx] = 'shared';

            steps.push({
              line: 6,
              explanation: `Cell left (${r},${c - 1}) is also land. Shared side: subtract 2. Contribution now ${contrib}.`,
              variables: { sharedWithLeft: true, contribution: contrib },
              visualization: { type: 'array', array: [...grid], highlights: { ...hl }, labels: { ...lb } },
            });
          }

          perimeter += contrib;
          hl[idx] = 'found';
          lb[idx] = `+${contrib}`;

          steps.push({
            line: 7,
            explanation: `Cell (${r},${c}) contributes ${contrib} to perimeter. Total perimeter so far: ${perimeter}.`,
            variables: { contribution: contrib, totalPerimeter: perimeter },
            visualization: { type: 'array', array: [...grid], highlights: { ...hl }, labels: { ...lb } },
          });
        }
      }
    }

    steps.push({
      line: 8,
      explanation: `All land cells processed. Final island perimeter = ${perimeter}.`,
      variables: { result: perimeter },
      visualization: {
        type: 'array',
        array: [...grid],
        highlights: grid.reduce((acc, v, i) => { if (v === 1) acc[i] = 'sorted'; return acc; }, {} as Record<number, string>),
        labels: { 0: `perim=${perimeter}` },
      },
    });

    return steps;
  },
};

export default islandPerimeter;
