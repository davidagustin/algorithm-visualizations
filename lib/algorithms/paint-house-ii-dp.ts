import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const paintHouseIIDP: AlgorithmDefinition = {
  id: 'paint-house-ii-dp',
  title: 'Paint House II',
  leetcodeNumber: 265,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Paint n houses with k colors such that no two adjacent houses have the same color. Minimize total cost. Optimized O(nk) DP: track the best and second-best costs from previous house to avoid O(k^2) transitions.',
  tags: ['Dynamic Programming', 'State Machine'],
  code: {
    pseudocode: `function minCostII(costs):
  n, k = dims(costs)
  for i from 1 to n-1:
    min1, min2 = two smallest in costs[i-1]
    for j from 0 to k-1:
      if costs[i-1][j] == min1:
        costs[i][j] += min2
      else:
        costs[i][j] += min1
  return min(costs[n-1])`,
    python: `def minCostII(costs):
    n, k = len(costs), len(costs[0])
    for i in range(1, n):
        sorted_prev = sorted(costs[i-1])
        min1, min2 = sorted_prev[0], sorted_prev[1]
        for j in range(k):
            costs[i][j] += (min2 if costs[i-1][j] == min1 else min1)
    return min(costs[-1])`,
    javascript: `function minCostII(costs) {
  const n = costs.length, k = costs[0].length;
  for (let i = 1; i < n; i++) {
    const sorted = [...costs[i-1]].sort((a,b) => a-b);
    const [min1, min2] = sorted;
    for (let j = 0; j < k; j++) {
      costs[i][j] += (costs[i-1][j] === min1 ? min2 : min1);
    }
  }
  return Math.min(...costs[n-1]);
}`,
    java: `public int minCostII(int[][] costs) {
    int n = costs.length, k = costs[0].length;
    for (int i = 1; i < n; i++) {
        int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE;
        for (int c : costs[i-1]) {
            if (c < min1) { min2 = min1; min1 = c; }
            else if (c < min2) min2 = c;
        }
        for (int j = 0; j < k; j++)
            costs[i][j] += (costs[i-1][j] == min1 ? min2 : min1);
    }
    return Arrays.stream(costs[n-1]).min().getAsInt();
}`,
  },
  defaultInput: { costs: [[1, 5, 3], [2, 9, 4]] },
  inputFields: [
    {
      name: 'costs',
      label: 'Costs (flatten rows: house1_c1,c2,...,house2_c1,...)',
      type: 'array',
      defaultValue: [1, 5, 3, 2, 9, 4],
      placeholder: '1,5,3,2,9,4',
      helperText: 'Flatten costs row by row. 2 houses, 3 colors each.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.costs as number[];
    const k = 3;
    const costs: number[][] = [];
    for (let i = 0; i < flat.length; i += k) {
      costs.push(flat.slice(i, i + k));
    }
    const n = costs.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[][] = costs.map(r => [...r]);

    function makeVizFlat(activeHouse: number, activeColor: number): DPVisualization {
      const vals: (number | null)[] = [];
      const lbls: string[] = [];
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        for (let c = 0; c < k; c++) {
          const idx = i * k + c;
          vals.push(dp[i][c]);
          lbls.push(`H${i}C${c}`);
          if (i === activeHouse && c === activeColor) highlights[idx] = 'active';
          else if (i < activeHouse) highlights[idx] = 'found';
          else highlights[idx] = 'default';
        }
      }
      return { type: 'dp-table', values: vals, highlights, labels: lbls };
    }

    steps.push({
      line: 1,
      explanation: `${n} houses, ${k} colors. dp[i][j] = min cost to paint house i with color j. No same-color adjacent.`,
      variables: { n, k },
      visualization: makeVizFlat(-1, -1),
    });

    steps.push({
      line: 3,
      explanation: `Base case: dp[0] = [${dp[0].join(', ')}]. First house can be any color.`,
      variables: { 'dp[0]': dp[0].slice() },
      visualization: makeVizFlat(0, -1),
    });

    for (let i = 1; i < n; i++) {
      const prev = dp[i - 1].slice().sort((a, b) => a - b);
      const min1 = prev[0];
      const min2 = prev[1];

      steps.push({
        line: 3,
        explanation: `House ${i}: two smallest in prev row are min1=${min1}, min2=${min2}.`,
        variables: { house: i, min1, min2 },
        visualization: makeVizFlat(i - 1, -1),
      });

      for (let j = 0; j < k; j++) {
        const add = dp[i - 1][j] === min1 ? min2 : min1;
        dp[i][j] = costs[i][j] + add;

        steps.push({
          line: 6,
          explanation: `H${i}C${j}: cost=${costs[i][j]} + ${add} = ${dp[i][j]}.`,
          variables: { house: i, color: j, 'dp[i][j]': dp[i][j] },
          visualization: makeVizFlat(i, j),
        });
      }
    }

    const result = Math.min(...dp[n - 1]);
    steps.push({
      line: 9,
      explanation: `Result = min(${dp[n - 1].join(', ')}) = ${result}.`,
      variables: { result },
      visualization: makeVizFlat(n - 1, dp[n - 1].indexOf(result)),
    });

    return steps;
  },
};

export default paintHouseIIDP;
