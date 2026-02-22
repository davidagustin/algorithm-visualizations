import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const paintHouse: AlgorithmDefinition = {
  id: 'paint-house',
  title: 'Paint House',
  leetcodeNumber: 256,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'There are n houses and each can be painted Red, Blue, or Green. Adjacent houses must not have the same color. Given a cost matrix costs[i][j] = cost to paint house i with color j, find the minimum cost to paint all houses. dp[i][c] = min cost to paint houses 0..i with house i color c.',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function minCost(costs):
  n = length(costs)
  dp = copy of costs
  for i from 1 to n-1:
    dp[i][0] += min(dp[i-1][1], dp[i-1][2])
    dp[i][1] += min(dp[i-1][0], dp[i-1][2])
    dp[i][2] += min(dp[i-1][0], dp[i-1][1])
  return min(dp[n-1])`,
    python: `def minCost(costs):
    n = len(costs)
    dp = [row[:] for row in costs]
    for i in range(1, n):
        dp[i][0] += min(dp[i-1][1], dp[i-1][2])
        dp[i][1] += min(dp[i-1][0], dp[i-1][2])
        dp[i][2] += min(dp[i-1][0], dp[i-1][1])
    return min(dp[n-1])`,
    javascript: `function minCost(costs) {
  const n = costs.length;
  const dp = costs.map(row => [...row]);
  for (let i = 1; i < n; i++) {
    dp[i][0] += Math.min(dp[i-1][1], dp[i-1][2]);
    dp[i][1] += Math.min(dp[i-1][0], dp[i-1][2]);
    dp[i][2] += Math.min(dp[i-1][0], dp[i-1][1]);
  }
  return Math.min(...dp[n-1]);
}`,
    java: `public int minCost(int[][] costs) {
    int n = costs.length;
    int[][] dp = new int[n][3];
    dp[0] = costs[0].clone();
    for (int i = 1; i < n; i++) {
        dp[i][0] = costs[i][0] + Math.min(dp[i-1][1], dp[i-1][2]);
        dp[i][1] = costs[i][1] + Math.min(dp[i-1][0], dp[i-1][2]);
        dp[i][2] = costs[i][2] + Math.min(dp[i-1][0], dp[i-1][1]);
    }
    return Math.min(dp[n-1][0], Math.min(dp[n-1][1], dp[n-1][2]));
}`,
  },
  defaultInput: { costs: [[17, 2, 17], [16, 16, 5], [14, 3, 19]] },
  inputFields: [
    {
      name: 'costs',
      label: 'Cost Matrix [house][color: R,G,B]',
      type: 'array',
      defaultValue: [[17, 2, 17], [16, 16, 5], [14, 3, 19]],
      placeholder: '17,2,17;16,16,5;14,3,19',
      helperText: 'Each row is [Red cost, Green cost, Blue cost] for one house.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const costs = input.costs as number[][];
    const n = costs.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = costs.map(row => [...row]);
    const colorNames = ['Red', 'Green', 'Blue'];
    const filled: boolean[][] = Array.from({ length: n }, () => [true, true, true]);

    // Reset dp to costs, track as filled
    for (let i = 0; i < n; i++)
      for (let j = 0; j < 3; j++)
        dp[i][j] = costs[i][j];

    const flatIdx = (i: number, j: number) => i * 3 + j;
    const totalCells = n * 3;

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < 3; j++)
          arr.push(dp[i][j]);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i < n; i++)
        for (let j = 0; j < 3; j++)
          labels.push(`H${i}-${colorNames[j][0]}`);
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < totalCells; k++) {
        highlights[k] = 'visited';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Paint House: ${n} houses, 3 colors (R/G/B). Adjacent houses must differ. dp[i][c] = min cost to paint houses 0..i with house i color c.`,
      variables: { n, costs },
      visualization: makeViz(null, []),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp = costs. House 0: R=${costs[0][0]}, G=${costs[0][1]}, B=${costs[0][2]}.`,
      variables: { 'dp[0]': [...costs[0]] },
      visualization: makeViz(null, [0, 1, 2]),
    });

    for (let i = 1; i < n; i++) {
      const prev = dp[i - 1];
      const r0 = costs[i][0] + Math.min(prev[1], prev[2]);
      const r1 = costs[i][1] + Math.min(prev[0], prev[2]);
      const r2 = costs[i][2] + Math.min(prev[0], prev[1]);

      steps.push({
        line: 4,
        explanation: `House ${i}: dp[${i}][Red] = cost[${i}][0](${costs[i][0]}) + min(dp[${i - 1}][G]=${prev[1]}, dp[${i - 1}][B]=${prev[2]}) = ${r0}.`,
        variables: { i, color: 'Red', val: r0 },
        visualization: makeViz(flatIdx(i, 0), [flatIdx(i - 1, 1), flatIdx(i - 1, 2)]),
      });
      dp[i][0] = r0;

      steps.push({
        line: 5,
        explanation: `House ${i}: dp[${i}][Green] = cost[${i}][1](${costs[i][1]}) + min(dp[${i - 1}][R]=${prev[0]}, dp[${i - 1}][B]=${prev[2]}) = ${r1}.`,
        variables: { i, color: 'Green', val: r1 },
        visualization: makeViz(flatIdx(i, 1), [flatIdx(i - 1, 0), flatIdx(i - 1, 2)]),
      });
      dp[i][1] = r1;

      steps.push({
        line: 6,
        explanation: `House ${i}: dp[${i}][Blue] = cost[${i}][2](${costs[i][2]}) + min(dp[${i - 1}][R]=${prev[0]}, dp[${i - 1}][G]=${prev[1]}) = ${r2}.`,
        variables: { i, color: 'Blue', val: r2 },
        visualization: makeViz(flatIdx(i, 2), [flatIdx(i - 1, 0), flatIdx(i - 1, 1)]),
      });
      dp[i][2] = r2;
    }

    const result = Math.min(dp[n - 1][0], dp[n - 1][1], dp[n - 1][2]);
    const bestColor = colorNames[dp[n - 1].indexOf(result)];

    steps.push({
      line: 7,
      explanation: `min(dp[${n - 1}]) = min(${dp[n - 1].join(', ')}) = ${result}. Minimum cost to paint all ${n} houses: ${result} (last house ${bestColor}).`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => {
            const i = Math.floor(k / 3);
            const j = k % 3;
            if (i === n - 1 && dp[i][j] === result) return [k, 'active'];
            return [k, 'found'];
          })
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default paintHouse;
