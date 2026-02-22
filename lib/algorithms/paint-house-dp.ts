import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const paintHouseDP: AlgorithmDefinition = {
  id: 'paint-house-dp',
  title: 'Paint House',
  leetcodeNumber: 256,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Paint n houses with 3 colors (Red, Blue, Green) such that no two adjacent houses have the same color. Minimize total cost. dp[i][c] = min cost to paint house i with color c, considering no same-color constraint with house i-1.',
  tags: ['Dynamic Programming', 'State Machine'],
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
    return min(dp[-1])`,
    javascript: `function minCost(costs) {
  const n = costs.length;
  const dp = costs.map(r => [...r]);
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
    for (int c = 0; c < 3; c++) dp[0][c] = costs[0][c];
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
      label: 'Costs per House (flatten: R,G,B,R,G,B,...)',
      type: 'array',
      defaultValue: [17, 2, 17, 16, 16, 5, 14, 3, 19],
      placeholder: '17,2,17,16,16,5,14,3,19',
      helperText: 'Costs flattened: groups of 3 per house [R, G, B]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.costs as number[];
    const costs: number[][] = [];
    for (let i = 0; i < flat.length; i += 3) {
      costs.push([flat[i] ?? 0, flat[i + 1] ?? 0, flat[i + 2] ?? 0]);
    }
    const n = costs.length;
    const steps: AlgorithmStep[] = [];
    const colorNames = ['Red', 'Blue', 'Green'];

    // Flatten dp into 1D for visualization: [h0R, h0B, h0G, h1R, ...]
    const dp: number[][] = costs.map(r => [...r]);

    function makeVizFlat(activeHouse: number, activeColor: number): DPVisualization {
      const vals: (number | null)[] = [];
      const lbls: string[] = [];
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        for (let c = 0; c < 3; c++) {
          const idx = i * 3 + c;
          vals.push(dp[i][c]);
          lbls.push(`H${i}${colorNames[c][0]}`);
          if (i === activeHouse && c === activeColor) highlights[idx] = 'active';
          else if (i < activeHouse) highlights[idx] = 'found';
          else highlights[idx] = 'default';
        }
      }
      return { type: 'dp-table', values: vals, highlights, labels: lbls };
    }

    steps.push({
      line: 1,
      explanation: `${n} houses. dp[i][c] = min cost to paint house i with color c (R/B/G) with no adjacent same-color constraint.`,
      variables: { n, costs },
      visualization: makeVizFlat(-1, -1),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp with base costs. dp[0] = [${dp[0].join(', ')}].`,
      variables: { 'dp[0]': dp[0].slice() },
      visualization: makeVizFlat(0, -1),
    });

    for (let i = 1; i < n; i++) {
      for (let c = 0; c < 3; c++) {
        const others = [0, 1, 2].filter(x => x !== c);
        const best = Math.min(dp[i - 1][others[0]], dp[i - 1][others[1]]);
        dp[i][c] = costs[i][c] + best;

        steps.push({
          line: 5 + c,
          explanation: `House ${i}, ${colorNames[c]}: cost=${costs[i][c]} + min(dp[${i - 1}][others]) = ${costs[i][c]} + ${best} = ${dp[i][c]}.`,
          variables: { house: i, color: colorNames[c], 'dp[i][c]': dp[i][c] },
          visualization: makeVizFlat(i, c),
        });
      }
    }

    const result = Math.min(...dp[n - 1]);
    steps.push({
      line: 8,
      explanation: `Result: min(dp[${n - 1}]) = min(${dp[n - 1].join(', ')}) = ${result}.`,
      variables: { result },
      visualization: makeVizFlat(n - 1, dp[n - 1].indexOf(result)),
    });

    return steps;
  },
};

export default paintHouseDP;
