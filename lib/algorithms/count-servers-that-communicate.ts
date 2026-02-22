import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countServersThatCommunicate: AlgorithmDefinition = {
  id: 'count-servers-that-communicate',
  title: 'Count Servers that Communicate',
  leetcodeNumber: 1267,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a grid where 1 represents a server, two servers can communicate if they are in the same row or column. Count the number of servers that can communicate with at least one other server. Count servers per row and column; a server communicates if its row or column has more than one server.',
  tags: ['graph', 'array', 'counting', 'row column'],

  code: {
    pseudocode: `function countServers(grid):
  m, n = dimensions
  rowCount = count of 1s in each row
  colCount = count of 1s in each column
  result = 0
  for each cell (r, c):
    if grid[r][c] == 1:
      if rowCount[r] > 1 or colCount[c] > 1:
        result += 1
  return result`,

    python: `def countServers(grid):
    m, n = len(grid), len(grid[0])
    row_count = [sum(row) for row in grid]
    col_count = [sum(grid[r][c] for r in range(m)) for c in range(n)]
    result = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                if row_count[r] > 1 or col_count[c] > 1:
                    result += 1
    return result`,

    javascript: `function countServers(grid) {
  const m = grid.length, n = grid[0].length;
  const rowCount = grid.map(row => row.reduce((a,b)=>a+b, 0));
  const colCount = Array(n).fill(0);
  for (let c = 0; c < n; c++)
    for (let r = 0; r < m; r++)
      colCount[c] += grid[r][c];
  let result = 0;
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++)
      if (grid[r][c] === 1 && (rowCount[r] > 1 || colCount[c] > 1))
        result++;
  return result;
}`,

    java: `public int countServers(int[][] grid) {
    int m = grid.length, n = grid[0].length;
    int[] rowCount = new int[m], colCount = new int[n];
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++) {
            rowCount[r] += grid[r][c];
            colCount[c] += grid[r][c];
        }
    int result = 0;
    for (int r = 0; r < m; r++)
        for (int c = 0; c < n; c++)
            if (grid[r][c] == 1 && (rowCount[r] > 1 || colCount[c] > 1))
                result++;
    return result;
}`,
  },

  defaultInput: {
    grid: [[1,0,0,1,0],[0,0,0,0,0],[0,0,0,1,0],[0,0,0,0,1],[0,0,0,0,0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Server Grid',
      type: 'array',
      defaultValue: [1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      placeholder: '1,0,0,1,0,...',
      helperText: '1=server, 0=empty',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Count servers per row and per column to determine which can communicate.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(
          grid.flat().map((v, i) => [i, v === 1 ? 'active' : 'default'])
        ),
        labels: Object.fromEntries(
          grid.flat().map((v, i) => [i, v === 1 ? 'server' : ''])
        ),
      } as ArrayVisualization,
    });

    const rowCount = grid.map(row => row.reduce((a, b) => a + b, 0));
    const colCount = Array(n).fill(0);
    for (let c = 0; c < n; c++) {
      for (let r = 0; r < m; r++) {
        colCount[c] += grid[r][c];
      }
    }

    steps.push({
      line: 3,
      explanation: `Row counts: [${rowCount.join(', ')}]. Column counts: [${colCount.join(', ')}].`,
      variables: { rowCount: rowCount.join(','), colCount: colCount.join(',') },
      visualization: {
        type: 'array',
        array: rowCount,
        highlights: Object.fromEntries(rowCount.map((v, i) => [i, v > 1 ? 'active' : 'default'])),
        labels: Object.fromEntries(rowCount.map((_, i) => [i, `row${i}`])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 4,
      explanation: `Column counts computed. A server communicates if rowCount[r] > 1 OR colCount[c] > 1.`,
      variables: { colCount: colCount.join(',') },
      visualization: {
        type: 'array',
        array: colCount,
        highlights: Object.fromEntries(colCount.map((v, i) => [i, v > 1 ? 'active' : 'default'])),
        labels: Object.fromEntries(colCount.map((_, i) => [i, `col${i}`])),
      } as ArrayVisualization,
    });

    let result = 0;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 1) {
          const canCommunicate = rowCount[r] > 1 || colCount[c] > 1;
          if (canCommunicate) result++;

          steps.push({
            line: 7,
            explanation: `Server at (${r}, ${c}): row${r} has ${rowCount[r]} server(s), col${c} has ${colCount[c]} server(s). ${canCommunicate ? 'CAN communicate!' : 'ISOLATED.'}`,
            variables: { server: `(${r},${c})`, rowServers: rowCount[r], colServers: colCount[c], canCommunicate, count: result },
            visualization: {
              type: 'array',
              array: grid.flat(),
              highlights: {
                [r * n + c]: canCommunicate ? 'found' : 'mismatch',
              },
              labels: { [r * n + c]: canCommunicate ? 'comm' : 'isolated' },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `All servers checked. Total servers that can communicate: ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(
          grid.flat().map((v, i) => {
            if (v !== 1) return [i, 'default'];
            const r = Math.floor(i / n);
            const c = i % n;
            return [i, (rowCount[r] > 1 || colCount[c] > 1) ? 'found' : 'mismatch'];
          })
        ),
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default countServersThatCommunicate;
