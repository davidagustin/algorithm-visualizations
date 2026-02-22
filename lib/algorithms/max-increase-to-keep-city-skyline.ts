import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxIncreaseToKeepCitySkyline: AlgorithmDefinition = {
  id: 'max-increase-to-keep-city-skyline',
  title: 'Max Increase to Keep City Skyline',
  leetcodeNumber: 807,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given a 2D grid of building heights, you can increase any building height without changing the skyline (max height) from any cardinal direction. The skyline from North/South is the max of each column. The skyline from East/West is the max of each row. Each building can grow to min(rowMax, colMax). Return the total increase.',
  tags: ['array', 'matrix', 'greedy'],

  code: {
    pseudocode: `function maxIncreaseKeepingSkyline(grid):
  n = len(grid)
  rowMax = [max(row) for row in grid]
  colMax = [max(grid[r][c] for r in range(n)) for c in range(n)]
  total = 0
  for r in range(n):
    for c in range(n):
      total += min(rowMax[r], colMax[c]) - grid[r][c]
  return total`,
    python: `def maxIncreaseKeepingSkyline(grid):
    n = len(grid)
    row_max = [max(row) for row in grid]
    col_max = [max(grid[r][c] for r in range(n)) for c in range(n)]
    total = 0
    for r in range(n):
        for c in range(n):
            total += min(row_max[r], col_max[c]) - grid[r][c]
    return total`,
    javascript: `function maxIncreaseKeepingSkyline(grid) {
  const n = grid.length;
  const rowMax = grid.map(row => Math.max(...row));
  const colMax = Array.from({length: n}, (_, c) =>
    Math.max(...grid.map(row => row[c])));
  let total = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      total += Math.min(rowMax[r], colMax[c]) - grid[r][c];
  return total;
}`,
    java: `public int maxIncreaseKeepingSkyline(int[][] grid) {
    int n = grid.length;
    int[] rowMax = new int[n], colMax = new int[n];
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++) {
            rowMax[r] = Math.max(rowMax[r], grid[r][c]);
            colMax[c] = Math.max(colMax[c], grid[r][c]);
        }
    int total = 0;
    for (int r = 0; r < n; r++)
        for (int c = 0; c < n; c++)
            total += Math.min(rowMax[r], colMax[c]) - grid[r][c];
    return total;
}`,
  },

  defaultInput: {
    grid: [[3, 0, 8, 4], [2, 4, 5, 7], [9, 2, 6, 3], [0, 3, 1, 0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (flattened 4x4)',
      type: 'array',
      defaultValue: [3, 0, 8, 4, 2, 4, 5, 7, 9, 2, 6, 3, 0, 3, 1, 0],
      placeholder: '3,0,8,4,2,4,5,7,9,2,6,3,0,3,1,0',
      helperText: 'Row-major flattened 4x4 grid of building heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = [[3, 0, 8, 4], [2, 4, 5, 7], [9, 2, 6, 3], [0, 3, 1, 0]];
    const steps: AlgorithmStep[] = [];
    const n = grid.length;

    const flat = (): number[] => grid.flat();

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: flat(),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Analyze ${n}x${n} grid of building heights. Compute row and column maximums.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    const rowMax = grid.map(row => Math.max(...row));
    const colMax = Array.from({ length: n }, (_, c) => Math.max(...grid.map(row => row[c])));

    steps.push({
      line: 2,
      explanation: `Row maximums (East-West skyline): [${rowMax.join(', ')}].`,
      variables: { rowMax: rowMax.join(', ') },
      visualization: makeViz(
        Object.fromEntries(rowMax.map((_, r) => {
          const maxIdx = grid[r].indexOf(rowMax[r]);
          return [r * n + maxIdx, 'found'];
        })),
        {}
      ),
    });

    steps.push({
      line: 3,
      explanation: `Column maximums (North-South skyline): [${colMax.join(', ')}].`,
      variables: { colMax: colMax.join(', ') },
      visualization: makeViz(
        Object.fromEntries(colMax.map((_, c) => {
          const maxRow = grid.reduce((best, row, r) => row[c] > grid[best][c] ? r : best, 0);
          return [maxRow * n + c, 'comparing'];
        })),
        {}
      ),
    });

    let total = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const cap = Math.min(rowMax[r], colMax[c]);
        const gain = cap - grid[r][c];
        total += gain;
        steps.push({
          line: 7,
          explanation: `grid[${r}][${c}] = ${grid[r][c]}. Cap = min(rowMax[${r}]=${rowMax[r]}, colMax[${c}]=${colMax[c]}) = ${cap}. Gain = ${gain}. Total = ${total}.`,
          variables: { r, c, current: grid[r][c], cap, gain, total },
          visualization: makeViz({ [r * n + c]: 'active' }, { [r * n + c]: `+${gain}` }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Total increase in building heights without changing skyline: ${total}.`,
      variables: { result: total },
      visualization: makeViz(Object.fromEntries(flat().map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default maxIncreaseToKeepCitySkyline;
