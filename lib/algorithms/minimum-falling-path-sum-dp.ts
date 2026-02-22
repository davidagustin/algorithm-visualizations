import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumFallingPathSumDp: AlgorithmDefinition = {
  id: 'minimum-falling-path-sum-dp',
  title: 'Minimum Falling Path Sum (DP)',
  leetcodeNumber: 931,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an n x n matrix, find the minimum sum of a falling path. A falling path starts at any element in the first row, and moves to an adjacent element in the row below (diagonally left, straight down, or diagonally right). Use DP building from row 1 downward, tracking the running minimum at each cell.',
  tags: ['dynamic programming', 'grid', 'falling path', 'optimization'],

  code: {
    pseudocode: `function minFallingPathSum(matrix):
  n = len(matrix)
  dp = copy of first row
  for r from 1 to n-1:
    newDp = array of size n
    for c from 0 to n-1:
      best = dp[c]
      if c > 0: best = min(best, dp[c-1])
      if c < n-1: best = min(best, dp[c+1])
      newDp[c] = matrix[r][c] + best
    dp = newDp
  return min(dp)`,
    python: `def minFallingPathSum(matrix):
    n=len(matrix)
    dp=matrix[0][:]
    for r in range(1,n):
        ndp=[0]*n
        for c in range(n):
            best=dp[c]
            if c>0: best=min(best,dp[c-1])
            if c<n-1: best=min(best,dp[c+1])
            ndp[c]=matrix[r][c]+best
        dp=ndp
    return min(dp)`,
    javascript: `function minFallingPathSum(matrix) {
  const n=matrix.length;
  let dp=[...matrix[0]];
  for(let r=1;r<n;r++) {
    const ndp=Array(n).fill(0);
    for(let c=0;c<n;c++) {
      let best=dp[c];
      if(c>0) best=Math.min(best,dp[c-1]);
      if(c<n-1) best=Math.min(best,dp[c+1]);
      ndp[c]=matrix[r][c]+best;
    }
    dp=ndp;
  }
  return Math.min(...dp);
}`,
    java: `public int minFallingPathSum(int[][] matrix) {
    int n=matrix.length;
    int[] dp=Arrays.copyOf(matrix[0],n);
    for(int r=1;r<n;r++) {
        int[] ndp=new int[n];
        for(int c=0;c<n;c++) {
            int best=dp[c];
            if(c>0) best=Math.min(best,dp[c-1]);
            if(c<n-1) best=Math.min(best,dp[c+1]);
            ndp[c]=matrix[r][c]+best;
        }
        dp=ndp;
    }
    int ans=dp[0]; for(int v:dp) ans=Math.min(ans,v); return ans;
}`,
  },

  defaultInput: {
    matrix: [[2, 1, 3], [6, 5, 4], [7, 8, 9]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[2, 1, 3], [6, 5, 4], [7, 8, 9]],
      placeholder: '[[2,1,3],[6,5,4],[7,8,9]]',
      helperText: 'Square matrix of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const n = matrix.length;
    const steps: AlgorithmStep[] = [];

    let dp = [...matrix[0]];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Initialize DP with first row: [${dp.join(', ')}]. Each path can start at any column.`,
      variables: { n, firstRow: [...dp] },
      visualization: makeViz([...dp], {}, {}),
    });

    for (let r = 1; r < n; r++) {
      const ndp = Array(n).fill(0);
      for (let c = 0; c < n; c++) {
        let best = dp[c];
        if (c > 0) best = Math.min(best, dp[c - 1]);
        if (c < n - 1) best = Math.min(best, dp[c + 1]);
        ndp[c] = matrix[r][c] + best;
      }
      dp = ndp;

      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      const minVal = Math.min(...dp);
      for (let c = 0; c < n; c++) {
        hi[c] = dp[c] === minVal ? 'found' : 'active';
        lb[c] = `${dp[c]}`;
      }

      steps.push({
        line: 6,
        explanation: `Row ${r}: falling path sums = [${dp.join(', ')}]. Min so far = ${minVal}.`,
        variables: { row: r, dpRow: [...dp], minInRow: minVal },
        visualization: makeViz([...dp], hi, lb),
      });
    }

    const minFinal = Math.min(...dp);
    const minIdx = dp.indexOf(minFinal);
    steps.push({
      line: 8,
      explanation: `Minimum falling path sum = ${minFinal} (ending at column ${minIdx}).`,
      variables: { answer: minFinal, endingCol: minIdx },
      visualization: makeViz([...dp], { [minIdx]: 'found' }, { [minIdx]: `min:${minFinal}` }),
    });

    return steps;
  },
};

export default minimumFallingPathSumDp;
