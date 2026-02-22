import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const triangleMinimumPathSum: AlgorithmDefinition = {
  id: 'triangle-minimum-path-sum',
  title: 'Triangle Minimum Path Sum',
  leetcodeNumber: 120,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a triangle array, find the minimum path sum from top to bottom. Each step you may move to adjacent numbers in the row below. Work bottom-up: dp[i] = min path sum starting at each position in row i. Final answer is dp[0][0].',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function minimumTotal(triangle):
  dp = last row of triangle (copy)
  for row from second-to-last to 0:
    for col from 0 to len(row)-1:
      dp[col] = triangle[row][col] + min(dp[col], dp[col+1])
  return dp[0]`,
    python: `def minimumTotal(triangle):
    dp = triangle[-1][:]
    for row in range(len(triangle)-2, -1, -1):
        for col in range(len(triangle[row])):
            dp[col] = triangle[row][col] + min(dp[col], dp[col+1])
    return dp[0]`,
    javascript: `function minimumTotal(triangle) {
  const dp = [...triangle[triangle.length-1]];
  for (let row = triangle.length-2; row >= 0; row--) {
    for (let col = 0; col < triangle[row].length; col++) {
      dp[col] = triangle[row][col] + Math.min(dp[col], dp[col+1]);
    }
  }
  return dp[0];
}`,
    java: `public int minimumTotal(List<List<Integer>> triangle) {
    int n = triangle.size();
    int[] dp = triangle.get(n-1).stream().mapToInt(i->i).toArray();
    for (int row = n-2; row >= 0; row--) {
        for (int col = 0; col < triangle.get(row).size(); col++) {
            dp[col] = triangle.get(row).get(col) + Math.min(dp[col], dp[col+1]);
        }
    }
    return dp[0];
}`,
  },
  defaultInput: { triangle: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]] },
  inputFields: [
    {
      name: 'triangle',
      label: 'Triangle (rows as arrays)',
      type: 'array',
      defaultValue: [[2], [3, 4], [6, 5, 7], [4, 1, 8, 3]],
      placeholder: '2;3,4;6,5,7;4,1,8,3',
      helperText: 'Triangle rows. Max 5 rows for best visualization.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const triangle = input.triangle as number[][];
    const n = triangle.length;
    const steps: AlgorithmStep[] = [];

    // Bottom-up DP: flatten last row
    const dp: number[] = [...triangle[n - 1]];
    const dpFull: (number | null)[] = new Array(dp.length).fill(null);
    const labels: string[] = triangle[n - 1].map((v, i) => `row${n - 1}[${i}]=${v}`);

    function makeViz(activeIdx: number | null, comparingIndices: number[], vals: (number | null)[], lbls: string[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < vals.length; i++) {
        if (vals[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx < vals.length) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: vals.slice(), highlights, labels: lbls };
    }

    steps.push({
      line: 1,
      explanation: `Triangle Min Path Sum: ${n} rows. Start with bottom row as dp: [${triangle[n - 1].join(', ')}]. Work upward filling min paths.`,
      variables: { n, bottomRow: [...triangle[n - 1]] },
      visualization: makeViz(null, [], triangle[n - 1].map(v => v), triangle[n - 1].map((v, i) => `row${n - 1}[${i}]=${v}`)),
    });

    // Initialize dp with bottom row
    const dpState: number[] = [...triangle[n - 1]];
    const initVals: (number | null)[] = dpState.slice();
    const initLabels: string[] = dpState.map((v, i) => `row${n - 1}[${i}]=${triangle[n - 1][i]}`);
    steps.push({
      line: 1,
      explanation: `dp = last row = [${dpState.join(', ')}]. Each dp[col] = min path sum if we start at last row, column col.`,
      variables: { dp: [...dpState] },
      visualization: makeViz(null, [], initVals, initLabels),
    });

    // Process rows from second-to-last to top
    for (let row = n - 2; row >= 0; row--) {
      const newDp: number[] = [];
      const newVals: (number | null)[] = new Array(triangle[row].length).fill(null);
      const newLabels: string[] = triangle[row].map((v, i) => `row${row}[${i}]=${v}`);

      steps.push({
        line: 3,
        explanation: `Processing row ${row}: [${triangle[row].join(', ')}]. For each col, dp[col] = triangle[row][col] + min(dp[col], dp[col+1]).`,
        variables: { row, rowVals: [...triangle[row]] },
        visualization: makeViz(null, [], dpState.slice(), dpState.map((v, i) => `prev[${i}]=${v}`)),
      });

      for (let col = 0; col < triangle[row].length; col++) {
        const below1 = dpState[col];
        const below2 = dpState[col + 1];
        const val = triangle[row][col] + Math.min(below1, below2);
        newDp.push(val);
        newVals[col] = val;

        steps.push({
          line: 4,
          explanation: `row${row}[${col}]=${triangle[row][col]} + min(dp[${col}]=${below1}, dp[${col + 1}]=${below2}) = ${triangle[row][col]} + ${Math.min(below1, below2)} = ${val}.`,
          variables: { row, col, val, below1, below2 },
          visualization: makeViz(col, [col, col + 1], newVals.slice(), newLabels),
        });
      }

      dpState.splice(0, dpState.length, ...newDp);

      steps.push({
        line: 4,
        explanation: `Row ${row} done. dp = [${dpState.join(', ')}]. Each value is the min path sum from that position.`,
        variables: { row, dp: [...dpState] },
        visualization: makeViz(null, [], dpState.slice(), dpState.map((v, i) => `row${row}[${i}]:${v}`)),
      });
    }

    steps.push({
      line: 5,
      explanation: `dp[0] = ${dpState[0]}. Minimum path sum from top to bottom of triangle is ${dpState[0]}.`,
      variables: { result: dpState[0] },
      visualization: {
        type: 'dp-table',
        values: dpState.slice(),
        highlights: { 0: 'active' },
        labels: dpState.map((v, i) => `top[${i}]:${v}`),
      },
    });

    return steps;
  },
};

export default triangleMinimumPathSum;
