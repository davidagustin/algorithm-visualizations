import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingPath: AlgorithmDefinition = {
  id: 'longest-increasing-path',
  title: 'Longest Increasing Path',
  leetcodeNumber: 329,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an m x n integer matrix, find the length of the longest strictly increasing path. You can move in four directions (up, down, left, right). We use DFS with memoization: memo[r][c] stores the longest path starting from (r,c).',
  tags: ['Graph', 'DFS', 'Dynamic Programming', 'Matrix'],
  code: {
    pseudocode: `function longestIncreasingPath(matrix):
  rows = matrix.length, cols = matrix[0].length
  memo = matrix of size rows x cols, all 0
  result = 0
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      result = max(result, dfs(r, c))
  return result

function dfs(r, c):
  if memo[r][c] != 0: return memo[r][c]
  best = 1
  for each neighbor (nr, nc):
    if in bounds and matrix[nr][nc] > matrix[r][c]:
      best = max(best, 1 + dfs(nr, nc))
  memo[r][c] = best
  return best`,
    python: `def longestIncreasingPath(matrix):
    rows, cols = len(matrix), len(matrix[0])
    memo = [[0]*cols for _ in range(rows)]
    def dfs(r, c):
        if memo[r][c]: return memo[r][c]
        best = 1
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and matrix[nr][nc]>matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        memo[r][c] = best
        return best
    result = 0
    for r in range(rows):
        for c in range(cols):
            result = max(result, dfs(r, c))
    return result`,
    javascript: `function longestIncreasingPath(matrix) {
  const rows = matrix.length, cols = matrix[0].length;
  const memo = Array.from({length: rows}, () => new Array(cols).fill(0));
  function dfs(r, c) {
    if (memo[r][c]) return memo[r][c];
    let best = 1;
    for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<rows && nc>=0 && nc<cols && matrix[nr][nc]>matrix[r][c])
        best = Math.max(best, 1 + dfs(nr, nc));
    }
    memo[r][c] = best;
    return best;
  }
  let result = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      result = Math.max(result, dfs(r, c));
  return result;
}`,
    java: `public int longestIncreasingPath(int[][] matrix) {
    int rows = matrix.length, cols = matrix[0].length;
    int[][] memo = new int[rows][cols];
    int result = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            result = Math.max(result, dfs(matrix, memo, r, c, rows, cols));
    return result;
}
private int dfs(int[][] matrix, int[][] memo, int r, int c, int rows, int cols) {
    if (memo[r][c] != 0) return memo[r][c];
    int best = 1;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    for (int[] d : dirs) {
        int nr = r+d[0], nc = c+d[1];
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && matrix[nr][nc]>matrix[r][c])
            best = Math.max(best, 1 + dfs(matrix, memo, nr, nc, rows, cols));
    }
    memo[r][c] = best;
    return best;
}`,
  },
  defaultInput: {
    matrix: [[9, 9, 4], [6, 6, 8], [2, 1, 1]],
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[9, 9, 4], [6, 6, 8], [2, 1, 1]],
      placeholder: '[[9,9,4],[6,6,8],[2,1,1]]',
      helperText: '2D integer matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const steps: AlgorithmStep[] = [];
    const memo: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(0));

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => {
      const arr: number[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          arr.push(matrix[r][c]);
      return arr;
    };

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      result: number
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (memo[r][c] > 0) baseHighlights[idx(r, c)] = 'visited';
        }
      }
      return {
        type: 'array',
        array: flat(),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'Memo Table',
          entries: [
            { key: 'Best So Far', value: String(result) },
            ...Array.from({ length: rows }, (_, r) => ({
              key: `Row ${r}`,
              value: memo[r].map(v => v === 0 ? '?' : String(v)).join(', '),
            })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Matrix is ${rows}x${cols}. Run DFS with memoization from each cell to find the longest strictly increasing path.`,
      variables: { rows, cols },
      visualization: makeViz({}, {}, 0),
    });

    let result = 0;
    let stepCount = 0;
    const MAX_STEPS = 30;

    function dfs(r: number, c: number): number {
      if (memo[r][c] !== 0) return memo[r][c];

      let best = 1;
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

      if (stepCount < MAX_STEPS) {
        stepCount++;
        steps.push({
          line: 10,
          explanation: `DFS at (${r},${c}) with value ${matrix[r][c]}. Exploring neighbors for strictly increasing values.`,
          variables: { r, c, value: matrix[r][c] },
          visualization: makeViz({ [idx(r, c)]: 'active' }, { [idx(r, c)]: 'cur' }, result),
        });
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
          const pathLen = 1 + dfs(nr, nc);
          if (pathLen > best) best = pathLen;
        }
      }

      memo[r][c] = best;

      if (stepCount < MAX_STEPS) {
        stepCount++;
        steps.push({
          line: 14,
          explanation: `Memoize: longest path from (${r},${c}) = ${best}.`,
          variables: { r, c, 'memo[r][c]': best },
          visualization: makeViz({ [idx(r, c)]: 'found' }, { [idx(r, c)]: String(best) }, result),
        });
      }

      return best;
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pathLen = dfs(r, c);
        if (pathLen > result) {
          result = pathLen;
          if (stepCount < MAX_STEPS) {
            stepCount++;
            steps.push({
              line: 7,
              explanation: `New best! Path from (${r},${c}) has length ${pathLen}. Update result to ${result}.`,
              variables: { r, c, pathLen, result },
              visualization: makeViz({ [idx(r, c)]: 'match' }, { [idx(r, c)]: `best:${result}` }, result),
            });
          }
        }
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    const finalLabels: Record<number, string> = {};
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        finalLabels[idx(r, c)] = String(memo[r][c]);
        if (memo[r][c] === result) finalHighlights[idx(r, c)] = 'found';
      }
    steps.push({
      line: 8,
      explanation: `All cells computed. The longest increasing path has length ${result}.`,
      variables: { result },
      visualization: makeViz(finalHighlights, finalLabels, result),
    });

    return steps;
  },
};

export default longestIncreasingPath;
