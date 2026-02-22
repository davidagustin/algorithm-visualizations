import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingPathMatrixII: AlgorithmDefinition = {
  id: 'longest-increasing-path-matrix-ii',
  title: 'Longest Increasing Path in a Matrix',
  leetcodeNumber: 329,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find the length of the longest increasing path in an m x n matrix, moving only up/down/left/right. Use DFS with memoization: for each cell, compute the longest path starting from it, caching results to avoid recomputation.',
  tags: ['Matrix', 'DFS', 'Memoization', 'Dynamic Programming'],
  code: {
    pseudocode: `function longestIncreasingPath(matrix):
  memo = {}
  def dfs(i, j):
    if (i,j) in memo: return memo[(i,j)]
    best = 1
    for each neighbor (ni,nj):
      if valid and matrix[ni][nj] > matrix[i][j]:
        best = max(best, 1 + dfs(ni,nj))
    memo[(i,j)] = best
    return best
  return max(dfs(i,j) for all i,j)`,
    python: `def longestIncreasingPath(matrix):
    m, n = len(matrix), len(matrix[0])
    memo = {}
    def dfs(i, j):
        if (i,j) in memo: return memo[(i,j)]
        best = 1
        for di,dj in [(0,1),(0,-1),(1,0),(-1,0)]:
            ni,nj = i+di, j+dj
            if 0<=ni<m and 0<=nj<n and matrix[ni][nj]>matrix[i][j]:
                best = max(best, 1+dfs(ni,nj))
        memo[(i,j)] = best
        return best
    return max(dfs(i,j) for i in range(m) for j in range(n))`,
    javascript: `function longestIncreasingPath(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const memo = new Map();
  function dfs(i, j) {
    const key = i*n+j;
    if (memo.has(key)) return memo.get(key);
    let best = 1;
    for (const [di,dj] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const ni=i+di, nj=j+dj;
      if (ni>=0&&ni<m&&nj>=0&&nj<n&&matrix[ni][nj]>matrix[i][j])
        best = Math.max(best, 1+dfs(ni,nj));
    }
    memo.set(key, best);
    return best;
  }
  let res = 0;
  for (let i=0;i<m;i++) for(let j=0;j<n;j++) res=Math.max(res,dfs(i,j));
  return res;
}`,
    java: `public int longestIncreasingPath(int[][] matrix) {
    int m=matrix.length, n=matrix[0].length;
    int[][] memo = new int[m][n];
    int res = 0;
    for (int i=0;i<m;i++) for(int j=0;j<n;j++) res=Math.max(res,dfs(matrix,memo,i,j,m,n));
    return res;
}
int dfs(int[][] mat, int[][] memo, int i, int j, int m, int n) {
    if (memo[i][j]!=0) return memo[i][j];
    int best=1;
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    for (int[] d:dirs) { int ni=i+d[0],nj=j+d[1];
        if(ni>=0&&ni<m&&nj>=0&&nj<n&&mat[ni][nj]>mat[i][j])
            best=Math.max(best,1+dfs(mat,memo,ni,nj,m,n)); }
    return memo[i][j]=best;
}`,
  },
  defaultInput: { matrix: [[9, 9, 4], [6, 6, 8], [2, 1, 1]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'string',
      defaultValue: '9 9 4, 6 6 8, 2 1 1',
      placeholder: 'e.g. 9 9 4, 6 6 8, 2 1 1',
      helperText: 'Rows by commas, values by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = matrix.length, n = matrix[0].length;
    const memo: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const steps: AlgorithmStep[] = [];
    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    function makeViz(curr: number, note: string): ArrayVisualization {
      const flat = matrix.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = memo[ri][ci] > 0 ? `${flat[i]}(${memo[ri][ci]})` : `${flat[i]}`;
        highlights[i] = memo[ri][ci] > 0 ? 'visited' : 'default';
      }
      if (curr >= 0) highlights[curr] = 'active';
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Longest Increasing Path', entries: [{ key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find longest increasing path in ${m}x${n} matrix using DFS + memoization.`,
      variables: { m, n },
      visualization: makeViz(-1, 'Start'),
    });

    function dfs(i: number, j: number): number {
      if (memo[i][j] !== 0) return memo[i][j];
      let best = 1;
      for (const [di, dj] of dirs) {
        const ni = i + di, nj = j + dj;
        if (ni >= 0 && ni < m && nj >= 0 && nj < n && matrix[ni][nj] > matrix[i][j]) {
          best = Math.max(best, 1 + dfs(ni, nj));
        }
      }
      memo[i][j] = best;
      steps.push({
        line: 8,
        explanation: `memo[${i}][${j}] = ${best}. Longest path starting at (${i},${j}) with value ${matrix[i][j]}.`,
        variables: { i, j, val: matrix[i][j], pathLen: best },
        visualization: makeViz(i * n + j, `LIP from (${i},${j}) = ${best}`),
      });
      return best;
    }

    let result = 0;
    for (let i = 0; i < m; i++)
      for (let j = 0; j < n; j++)
        result = Math.max(result, dfs(i, j));

    const bestIdx = (() => {
      let bi = 0, bj = 0;
      for (let i = 0; i < m; i++)
        for (let j = 0; j < n; j++)
          if (memo[i][j] > memo[bi][bj]) { bi = i; bj = j; }
      return bi * n + bj;
    })();

    steps.push({
      line: 10,
      explanation: `Longest increasing path length = ${result}.`,
      variables: { result },
      visualization: makeViz(bestIdx, `Result = ${result}`),
    });

    return steps;
  },
};

export default longestIncreasingPathMatrixII;
