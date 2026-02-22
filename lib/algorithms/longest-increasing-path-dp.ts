import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestIncreasingPathDp: AlgorithmDefinition = {
  id: 'longest-increasing-path-dp',
  title: 'Longest Increasing Path in a Matrix (DFS + Memo)',
  leetcodeNumber: 329,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Find the length of the longest strictly increasing path in a matrix, moving up/down/left/right. Use DFS with memoization: memo[r][c] stores the length of the longest increasing path starting at (r,c). Each cell is computed once, giving O(mn) time. No visited set needed since the path is strictly increasing.',
  tags: ['dynamic programming', 'dfs', 'memoization', 'grid', 'topological sort'],

  code: {
    pseudocode: `function longestIncreasingPath(matrix):
  memo = empty map
  dfs(r, c):
    if (r,c) in memo: return memo[(r,c)]
    best = 1
    for each neighbor (nr, nc):
      if matrix[nr][nc] > matrix[r][c]:
        best = max(best, 1 + dfs(nr, nc))
    memo[(r,c)] = best
    return best
  return max(dfs(r,c) for all (r,c))`,
    python: `def longestIncreasingPath(matrix):
    rows,cols=len(matrix),len(matrix[0])
    memo={}
    def dfs(r,c):
        if (r,c) in memo: return memo[(r,c)]
        best=1
        for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr,nc=r+dr,c+dc
            if 0<=nr<rows and 0<=nc<cols and matrix[nr][nc]>matrix[r][c]:
                best=max(best,1+dfs(nr,nc))
        memo[(r,c)]=best
        return best
    return max(dfs(r,c) for r in range(rows) for c in range(cols))`,
    javascript: `function longestIncreasingPath(matrix) {
  const rows=matrix.length,cols=matrix[0].length;
  const memo=new Map();
  const dfs=(r,c)=>{
    const key=r*cols+c;
    if(memo.has(key)) return memo.get(key);
    let best=1;
    for(const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&matrix[nr][nc]>matrix[r][c])
        best=Math.max(best,1+dfs(nr,nc));
    }
    memo.set(key,best); return best;
  };
  let ans=0;
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) ans=Math.max(ans,dfs(r,c));
  return ans;
}`,
    java: `public int longestIncreasingPath(int[][] matrix) {
    int rows=matrix.length,cols=matrix[0].length,ans=0;
    int[][] memo=new int[rows][cols];
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) ans=Math.max(ans,dfs(matrix,memo,r,c,rows,cols,dirs));
    return ans;
}
int dfs(int[][] m,int[][] memo,int r,int c,int rows,int cols,int[][] dirs) {
    if(memo[r][c]>0) return memo[r][c];
    int best=1;
    for(int[] d:dirs) { int nr=r+d[0],nc=c+d[1]; if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&m[nr][nc]>m[r][c]) best=Math.max(best,1+dfs(m,memo,nr,nc,rows,cols,dirs)); }
    return memo[r][c]=best;
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
      helperText: '2D matrix of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const rows = matrix.length;
    const cols = matrix[0].length;
    const steps: AlgorithmStep[] = [];

    const memo: number[] = Array(rows * cols).fill(0);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Matrix ${rows}x${cols}. Use DFS+memoization to find longest strictly increasing path. Move up/down/left/right.`,
      variables: { rows, cols },
      visualization: makeViz(matrix.flat(), {}, {}),
    });

    const dfs = (r: number, c: number): number => {
      const key = r * cols + c;
      if (memo[key] > 0) return memo[key];
      let best = 1;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && matrix[nr][nc] > matrix[r][c]) {
          best = Math.max(best, 1 + dfs(nr, nc));
        }
      }
      memo[key] = best;
      return best;
    };

    let ans = 0;
    let bestR = 0, bestC = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const pathLen = dfs(r, c);
        if (pathLen > ans) { ans = pathLen; bestR = r; bestC = c; }

        const hi: Record<number, string> = { [r * cols + c]: pathLen === ans ? 'found' : 'active' };
        const lb: Record<number, string> = { [r * cols + c]: `${pathLen}` };

        steps.push({
          line: 8,
          explanation: `Cell (${r},${c}) value=${matrix[r][c]}: longest increasing path = ${pathLen}. Global max = ${ans}`,
          variables: { r, c, value: matrix[r][c], pathLength: pathLen, globalMax: ans },
          visualization: makeViz(memo.map(v => v === 0 ? matrix.flat()[memo.indexOf(v)] : v), hi, lb),
        });
      }
    }

    const finalHi: Record<number, string> = { [bestR * cols + bestC]: 'found' };
    const finalLb: Record<number, string> = { [bestR * cols + bestC]: `len:${ans}` };

    steps.push({
      line: 9,
      explanation: `Longest increasing path = ${ans}, starting from (${bestR},${bestC}) with value ${matrix[bestR][bestC]}.`,
      variables: { answer: ans, startRow: bestR, startCol: bestC },
      visualization: makeViz(memo, finalHi, finalLb),
    });

    return steps;
  },
};

export default longestIncreasingPathDp;
