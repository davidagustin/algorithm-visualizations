import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfPointsWithCost: AlgorithmDefinition = {
  id: 'maximum-number-of-points-with-cost',
  title: 'Maximum Number of Points with Cost',
  leetcodeNumber: 1937,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an m x n matrix of points, pick one cell per row to maximize total score. The score for picking cell (r,c) is points[r][c] minus the absolute column difference from the previous row pick. Use DP with left-right pass optimization to avoid O(n^2) inner loop.',
  tags: ['dynamic programming', 'grid', 'optimization'],

  code: {
    pseudocode: `function maxPoints(points):
  rows, cols = dimensions
  dp = points[0] (first row)
  for r from 1 to rows-1:
    left = array of size cols
    right = array of size cols
    left pass: left[c] = max(left[c-1]-1, dp[c])
    right pass: right[c] = max(right[c+1]-1, dp[c])
    for c: dp[c] = points[r][c] + max(left[c], right[c])
  return max(dp)`,
    python: `def maxPoints(points):
    rows, cols = len(points), len(points[0])
    dp = points[0][:]
    for r in range(1, rows):
        left = [0]*cols
        right = [0]*cols
        left[0] = dp[0]
        for c in range(1, cols):
            left[c] = max(left[c-1]-1, dp[c])
        right[cols-1] = dp[cols-1]
        for c in range(cols-2, -1, -1):
            right[c] = max(right[c+1]-1, dp[c])
        for c in range(cols):
            dp[c] = points[r][c] + max(left[c], right[c])
    return max(dp)`,
    javascript: `function maxPoints(points) {
  const rows = points.length, cols = points[0].length;
  let dp = [...points[0]];
  for (let r = 1; r < rows; r++) {
    const left = Array(cols).fill(0);
    const right = Array(cols).fill(0);
    left[0] = dp[0];
    for (let c = 1; c < cols; c++) left[c] = Math.max(left[c-1]-1, dp[c]);
    right[cols-1] = dp[cols-1];
    for (let c = cols-2; c >= 0; c--) right[c] = Math.max(right[c+1]-1, dp[c]);
    for (let c = 0; c < cols; c++) dp[c] = points[r][c] + Math.max(left[c], right[c]);
  }
  return Math.max(...dp);
}`,
    java: `public long maxPoints(int[][] points) {
    int rows = points.length, cols = points[0].length;
    long[] dp = new long[cols];
    for (int c = 0; c < cols; c++) dp[c] = points[0][c];
    for (int r = 1; r < rows; r++) {
        long[] left = new long[cols], right = new long[cols], ndp = new long[cols];
        left[0] = dp[0];
        for (int c = 1; c < cols; c++) left[c] = Math.max(left[c-1]-1, dp[c]);
        right[cols-1] = dp[cols-1];
        for (int c = cols-2; c >= 0; c--) right[c] = Math.max(right[c+1]-1, dp[c]);
        for (int c = 0; c < cols; c++) ndp[c] = points[r][c] + Math.max(left[c], right[c]);
        dp = ndp;
    }
    long ans = 0;
    for (long v : dp) ans = Math.max(ans, v);
    return ans;
}`,
  },

  defaultInput: {
    points: [[1, 2, 3], [1, 5, 1], [3, 1, 1]],
  },

  inputFields: [
    {
      name: 'points',
      label: 'Points Grid',
      type: 'array',
      defaultValue: [[1, 2, 3], [1, 5, 1], [3, 1, 1]],
      placeholder: '[[1,2,3],[1,5,1],[3,1,1]]',
      helperText: '2D grid of point values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const rows = points.length;
    const cols = points[0].length;
    const steps: AlgorithmStep[] = [];

    let dp = [...points[0]];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 2,
      explanation: `Initialize DP with first row: [${dp.join(', ')}]`,
      variables: { row: 0, dp: [...dp] },
      visualization: makeViz([...dp], {}, {}),
    });

    for (let r = 1; r < rows; r++) {
      const left = Array(cols).fill(0);
      const right = Array(cols).fill(0);

      left[0] = dp[0];
      for (let c = 1; c < cols; c++) left[c] = Math.max(left[c - 1] - 1, dp[c]);

      steps.push({
        line: 5,
        explanation: `Row ${r}: Left pass - propagate best values with column penalty from left.`,
        variables: { row: r, left: [...left] },
        visualization: makeViz([...left], { 0: 'active' }, { 0: 'start' }),
      });

      right[cols - 1] = dp[cols - 1];
      for (let c = cols - 2; c >= 0; c--) right[c] = Math.max(right[c + 1] - 1, dp[c]);

      steps.push({
        line: 6,
        explanation: `Row ${r}: Right pass - propagate best values with column penalty from right.`,
        variables: { row: r, right: [...right] },
        visualization: makeViz([...right], { [cols - 1]: 'active' }, { [cols - 1]: 'start' }),
      });

      const newDp = Array(cols).fill(0);
      let bestIdx = 0;
      for (let c = 0; c < cols; c++) {
        newDp[c] = points[r][c] + Math.max(left[c], right[c]);
        if (newDp[c] > newDp[bestIdx]) bestIdx = c;
      }
      dp = newDp;

      const hi: Record<number, string> = { [bestIdx]: 'found' };
      const lb: Record<number, string> = { [bestIdx]: `${dp[bestIdx]}` };

      steps.push({
        line: 7,
        explanation: `Row ${r}: Updated DP = [${dp.join(', ')}]. Best so far at col ${bestIdx} = ${dp[bestIdx]}.`,
        variables: { row: r, dp: [...dp], bestCol: bestIdx, bestVal: dp[bestIdx] },
        visualization: makeViz([...dp], hi, lb),
      });
    }

    const maxVal = Math.max(...dp);
    const maxIdx = dp.indexOf(maxVal);

    steps.push({
      line: 9,
      explanation: `Maximum points = ${maxVal} (ending at column ${maxIdx})`,
      variables: { answer: maxVal, finalCol: maxIdx },
      visualization: makeViz([...dp], { [maxIdx]: 'found' }, { [maxIdx]: `max:${maxVal}` }),
    });

    return steps;
  },
};

export default maximumNumberOfPointsWithCost;
