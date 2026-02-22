import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const equalRowAndColumnPairs: AlgorithmDefinition = {
  id: 'equal-row-and-column-pairs',
  title: 'Equal Row and Column Pairs',
  leetcodeNumber: 2352,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Count pairs (r, c) where row r equals column c in an n x n matrix. Serialize each row to a string key and store counts in a hash map. Then serialize each column and look up its count in the map. Sum of all column lookups gives the answer.',
  tags: ['hash map', 'matrix', 'array'],

  code: {
    pseudocode: `function equalPairs(grid):
  rowMap = {}
  for row in grid:
    key = str(row)
    rowMap[key] = rowMap.get(key, 0) + 1
  count = 0
  for c in range(n):
    col = [grid[r][c] for r in range(n)]
    key = str(col)
    count += rowMap.get(key, 0)
  return count`,

    python: `def equalPairs(grid: list[list[int]]) -> int:
    from collections import Counter
    rowMap = Counter(tuple(row) for row in grid)
    n = len(grid)
    count = 0
    for c in range(n):
        col = tuple(grid[r][c] for r in range(n))
        count += rowMap[col]
    return count`,

    javascript: `function equalPairs(grid) {
  const rowMap = new Map();
  for (const row of grid) {
    const key = row.join(',');
    rowMap.set(key, (rowMap.get(key) || 0) + 1);
  }
  let count = 0;
  const n = grid.length;
  for (let c = 0; c < n; c++) {
    const key = grid.map(r => r[c]).join(',');
    count += rowMap.get(key) || 0;
  }
  return count;
}`,

    java: `public int equalPairs(int[][] grid) {
    Map<String, Integer> rowMap = new HashMap<>();
    for (int[] row : grid) {
        String key = Arrays.toString(row);
        rowMap.merge(key, 1, Integer::sum);
    }
    int count = 0, n = grid.length;
    for (int c = 0; c < n; c++) {
        int[] col = new int[n];
        for (int r = 0; r < n; r++) col[r] = grid[r][c];
        count += rowMap.getOrDefault(Arrays.toString(col), 0);
    }
    return count;
}`,
  },

  defaultInput: {
    grid: [[3, 2, 1], [1, 7, 6], [2, 7, 7]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid (n x n matrix)',
      type: 'array',
      defaultValue: [[3, 2, 1], [1, 7, 6], [2, 7, 7]],
      placeholder: '3,2,1|1,7,6|2,7,7',
      helperText: 'Each row is a list of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const n = grid.length;
    const rowMap: Record<string, number> = {};

    steps.push({
      line: 1,
      explanation: `Grid is ${n}x${n}. Build a hash map of row signatures. Serialize each row to a string key.`,
      variables: { n, rowMap: '{}' },
      visualization: { type: 'array', array: grid[0], highlights: {}, labels: {} },
    });

    for (let r = 0; r < n; r++) {
      const key = grid[r].join(',');
      rowMap[key] = (rowMap[key] || 0) + 1;

      steps.push({
        line: 4,
        explanation: `Row ${r}: [${grid[r].join(', ')}] -> key="${key}". rowMap["${key}"] = ${rowMap[key]}.`,
        variables: { row: r, key, rowMap: JSON.stringify(rowMap) },
        visualization: {
          type: 'array',
          array: grid[r],
          highlights: Object.fromEntries(grid[r].map((_, i) => [i, 'active'])),
          labels: { 0: `row${r}` },
        },
      });
    }

    let count = 0;

    steps.push({
      line: 5,
      explanation: `Row map built: ${JSON.stringify(rowMap)}. Now check each column.`,
      variables: { rowMap: JSON.stringify(rowMap), count: 0 },
      visualization: { type: 'array', array: grid[0], highlights: {}, labels: {} },
    });

    for (let c = 0; c < n; c++) {
      const col = grid.map(row => row[c]);
      const key = col.join(',');
      const matches = rowMap[key] || 0;
      count += matches;

      steps.push({
        line: 9,
        explanation: `Column ${c}: [${col.join(', ')}] -> key="${key}". rowMap["${key}"] = ${matches}. count = ${count}.`,
        variables: { col: c, key, matches, count },
        visualization: {
          type: 'array',
          array: col,
          highlights: matches > 0 ? Object.fromEntries(col.map((_, i) => [i, 'found'])) : Object.fromEntries(col.map((_, i) => [i, 'comparing'])),
          labels: { 0: `col${c}` },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Total equal row-column pairs = ${count}.`,
      variables: { result: count },
      visualization: { type: 'array', array: grid[0], highlights: {}, labels: {} },
    });

    return steps;
  },
};

export default equalRowAndColumnPairs;
