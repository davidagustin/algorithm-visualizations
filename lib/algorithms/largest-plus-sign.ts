import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestPlusSign: AlgorithmDefinition = {
  id: 'largest-plus-sign',
  title: 'Largest Plus Sign',
  leetcodeNumber: 764,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an n x n grid of 1s with some cells marked as 0s (mines), find the largest plus sign made of 1s. A plus sign of order k means a center cell with k-1 cells extending in all four directions. Use DP to precompute the consecutive 1s in each of the four directions, then take the minimum at each center.',
  tags: ['dynamic programming', 'grid', 'prefix sum'],

  code: {
    pseudocode: `function orderOfLargestPlusSign(n, mines):
  grid = n x n grid of 1s
  mark mines as 0
  for each row: compute left[r][c] and right[r][c]
  for each col: compute up[r][c] and down[r][c]
  ans = 0
  for each cell (r,c):
    ans = max(ans, min(left,right,up,down) at (r,c))
  return ans`,
    python: `def orderOfLargestPlusSign(n, mines):
    grid = set(map(tuple, mines))
    dp = [[n]*4 for _ in range(n*n)]
    ans = 0
    for r in range(n):
        cnt = 0
        for c in range(n):
            cnt = 0 if (r,c) in grid else cnt+1
            dp[r*n+c][0] = cnt
        cnt = 0
        for c in range(n-1,-1,-1):
            cnt = 0 if (r,c) in grid else cnt+1
            dp[r*n+c][1] = cnt
    for c in range(n):
        cnt = 0
        for r in range(n):
            cnt = 0 if (r,c) in grid else cnt+1
            dp[r*n+c][2] = cnt
        cnt = 0
        for r in range(n-1,-1,-1):
            cnt = 0 if (r,c) in grid else cnt+1
            dp[r*n+c][3] = cnt
    for i in range(n*n):
        ans = max(ans, min(dp[i]))
    return ans`,
    javascript: `function orderOfLargestPlusSign(n, mines) {
  const banned = new Set(mines.map(m => m[0]*n+m[1]));
  const left = Array.from({length:n}, () => Array(n).fill(0));
  const right = left.map(r=>[...r]), up = left.map(r=>[...r]), down = left.map(r=>[...r]);
  for (let r = 0; r < n; r++) {
    let cnt = 0;
    for (let c = 0; c < n; c++) left[r][c] = banned.has(r*n+c) ? cnt=0 : ++cnt;
    cnt = 0;
    for (let c = n-1; c >= 0; c--) right[r][c] = banned.has(r*n+c) ? cnt=0 : ++cnt;
  }
  for (let c = 0; c < n; c++) {
    let cnt = 0;
    for (let r = 0; r < n; r++) up[r][c] = banned.has(r*n+c) ? cnt=0 : ++cnt;
    cnt = 0;
    for (let r = n-1; r >= 0; r--) down[r][c] = banned.has(r*n+c) ? cnt=0 : ++cnt;
  }
  let ans = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      ans = Math.max(ans, Math.min(left[r][c],right[r][c],up[r][c],down[r][c]));
  return ans;
}`,
    java: `public int orderOfLargestPlusSign(int n, int[][] mines) {
    Set<Integer> banned = new HashSet<>();
    for (int[] m : mines) banned.add(m[0]*n+m[1]);
    int[][] dp = new int[n][n];
    int ans = 0;
    for (int r = 0; r < n; r++) {
        int cnt = 0;
        for (int c = 0; c < n; c++) dp[r][c] = banned.contains(r*n+c) ? (cnt=0) : ++cnt;
        cnt = 0;
        for (int c = n-1; c >= 0; c--) dp[r][c] = Math.min(dp[r][c], banned.contains(r*n+c) ? (cnt=0) : ++cnt);
    }
    for (int c = 0; c < n; c++) {
        int cnt = 0;
        for (int r = 0; r < n; r++) dp[r][c] = Math.min(dp[r][c], banned.contains(r*n+c) ? (cnt=0) : ++cnt);
        cnt = 0;
        for (int r = n-1; r >= 0; r--) { dp[r][c] = Math.min(dp[r][c], banned.contains(r*n+c) ? (cnt=0) : ++cnt); ans = Math.max(ans, dp[r][c]); }
    }
    return ans;
}`,
  },

  defaultInput: {
    n: 5,
    mines: [[4, 2]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Grid Size (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Size of the n x n grid',
    },
    {
      name: 'mines',
      label: 'Mine Positions [[r,c],...]',
      type: 'array',
      defaultValue: [[4, 2]],
      placeholder: '[[4,2]]',
      helperText: 'List of [row,col] mine positions',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const mines = input.mines as number[][];
    const steps: AlgorithmStep[] = [];

    const banned = new Set(mines.map(m => m[0] * n + m[1]));

    const left: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const right: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const up: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const down: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

    const gridFlat: number[] = [];
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++)
        gridFlat.push(banned.has(r * n + c) ? 0 : 1);

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Build ${n}x${n} grid with ${mines.length} mine(s). Mines set to 0, all others 1.`,
      variables: { n, mineCount: mines.length },
      visualization: makeViz(gridFlat, {}, {}),
    });

    // Fill left and right
    for (let r = 0; r < n; r++) {
      let cnt = 0;
      for (let c = 0; c < n; c++) left[r][c] = banned.has(r * n + c) ? (cnt = 0) : ++cnt;
      cnt = 0;
      for (let c = n - 1; c >= 0; c--) right[r][c] = banned.has(r * n + c) ? (cnt = 0) : ++cnt;
    }

    const leftFlat = left.flat();
    steps.push({
      line: 3,
      explanation: 'Compute left[] array: consecutive 1s going left to right in each row.',
      variables: { direction: 'left' },
      visualization: makeViz(leftFlat, {}, {}),
    });

    // Fill up and down
    for (let c = 0; c < n; c++) {
      let cnt = 0;
      for (let r = 0; r < n; r++) up[r][c] = banned.has(r * n + c) ? (cnt = 0) : ++cnt;
      cnt = 0;
      for (let r = n - 1; r >= 0; r--) down[r][c] = banned.has(r * n + c) ? (cnt = 0) : ++cnt;
    }

    const upFlat = up.flat();
    steps.push({
      line: 4,
      explanation: 'Compute up[] array: consecutive 1s going top to bottom in each column.',
      variables: { direction: 'up' },
      visualization: makeViz(upFlat, {}, {}),
    });

    let ans = 0;
    let bestR = 0, bestC = 0;
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const val = Math.min(left[r][c], right[r][c], up[r][c], down[r][c]);
        if (val > ans) { ans = val; bestR = r; bestC = c; }
      }
    }

    const resultFlat = [];
    const hi: Record<number, string> = {};
    const lb: Record<number, string> = {};
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const val = Math.min(left[r][c], right[r][c], up[r][c], down[r][c]);
        resultFlat.push(val);
        if (r === bestR && c === bestC) {
          hi[r * n + c] = 'found';
          lb[r * n + c] = `${val}`;
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Compute min(left,right,up,down) at each cell. Best center at (${bestR},${bestC}) gives order ${ans}.`,
      variables: { bestRow: bestR, bestCol: bestC, largestOrder: ans },
      visualization: makeViz(resultFlat, hi, lb),
    });

    steps.push({
      line: 8,
      explanation: `Largest plus sign order = ${ans}`,
      variables: { answer: ans },
      visualization: makeViz(resultFlat, hi, lb),
    });

    return steps;
  },
};

export default largestPlusSign;
