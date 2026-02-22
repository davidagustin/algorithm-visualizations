import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const triangleMinimumPathDp: AlgorithmDefinition = {
  id: 'triangle-minimum-path-dp',
  title: 'Triangle Minimum Path Sum (DP)',
  leetcodeNumber: 120,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a triangular array of numbers, find the minimum path sum from top to bottom. At each row, you can move to an adjacent number in the row below. Use bottom-up DP: start from the second-to-last row and add the minimum of the two adjacent values below. The answer is triangle[0][0].',
  tags: ['dynamic programming', 'triangle', 'path', 'bottom-up'],

  code: {
    pseudocode: `function minimumTotal(triangle):
  n = number of rows
  dp = copy of last row of triangle
  for row from n-2 downto 0:
    for col from 0 to row:
      dp[col] = triangle[row][col] + min(dp[col], dp[col+1])
  return dp[0]`,
    python: `def minimumTotal(triangle):
    dp = triangle[-1][:]
    for row in range(len(triangle)-2, -1, -1):
        for col in range(row+1):
            dp[col] = triangle[row][col] + min(dp[col], dp[col+1])
    return dp[0]`,
    javascript: `function minimumTotal(triangle) {
  const dp = [...triangle[triangle.length-1]];
  for (let row = triangle.length-2; row >= 0; row--)
    for (let col = 0; col <= row; col++)
      dp[col] = triangle[row][col] + Math.min(dp[col], dp[col+1]);
  return dp[0];
}`,
    java: `public int minimumTotal(List<List<Integer>> triangle) {
    int n = triangle.size();
    int[] dp = new int[n];
    for (int i = 0; i < n; i++) dp[i] = triangle.get(n-1).get(i);
    for (int row = n-2; row >= 0; row--)
        for (int col = 0; col <= row; col++)
            dp[col] = triangle.get(row).get(col) + Math.min(dp[col], dp[col+1]);
    return dp[0];
}`,
  },

  defaultInput: {
    triangle: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]],
  },

  inputFields: [
    {
      name: 'triangle',
      label: 'Triangle Array',
      type: 'array',
      defaultValue: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]],
      placeholder: '[[2],[3,4],[6,5,7],[4,1,8,3]]',
      helperText: 'Triangular array where row i has i+1 elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const triangle = input.triangle as number[][];
    const n = triangle.length;
    const steps: AlgorithmStep[] = [];

    const dp = [...triangle[n - 1]];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Triangle has ${n} rows. Initialize DP with last row: [${dp.join(', ')}]. Work bottom-up.`,
      variables: { n, lastRow: [...dp] },
      visualization: makeViz([...dp], {}, {}),
    });

    for (let row = n - 2; row >= 0; row--) {
      for (let col = 0; col <= row; col++) {
        const below1 = dp[col];
        const below2 = dp[col + 1];
        dp[col] = triangle[row][col] + Math.min(below1, below2);

        const hi: Record<number, string> = { [col]: 'active' };
        const lb: Record<number, string> = { [col]: `${dp[col]}` };

        steps.push({
          line: 4,
          explanation: `Row ${row}, col ${col}: triangle=${triangle[row][col]} + min(${below1}, ${below2}) = ${dp[col]}`,
          variables: { row, col, triangleVal: triangle[row][col], below1, below2, result: dp[col] },
          visualization: makeViz([...dp], hi, lb),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Minimum path sum from top to bottom = ${dp[0]}`,
      variables: { answer: dp[0] },
      visualization: makeViz([dp[0]], { 0: 'found' }, { 0: `ans:${dp[0]}` }),
    });

    return steps;
  },
};

export default triangleMinimumPathDp;
