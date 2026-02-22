import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const paintHouseIi: AlgorithmDefinition = {
  id: 'paint-house-ii',
  title: 'Paint House II',
  leetcodeNumber: 265,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'There are n houses in a row and k colors to paint them. The cost of painting each house with a certain color is given. No two adjacent houses may have the same color. Find the minimum cost to paint all houses. Uses DP with O(nk) time by tracking the minimum and second minimum from the previous row.',
  tags: ['dynamic programming', 'array', 'dp optimization'],

  code: {
    pseudocode: `function minCostII(costs, k):
  n = len(costs)
  for i in 1..n-1:
    min1, min2, minIdx = findTwoMins(costs[i-1])
    for j in 0..k-1:
      if j == minIdx:
        costs[i][j] += min2
      else:
        costs[i][j] += min1
  return min(costs[n-1])`,

    python: `def minCostII(costs):
    n, k = len(costs), len(costs[0])
    for i in range(1, n):
        min1 = min2 = float('inf')
        minIdx = -1
        for j in range(k):
            if costs[i-1][j] < min1:
                min2 = min1
                min1 = costs[i-1][j]
                minIdx = j
            elif costs[i-1][j] < min2:
                min2 = costs[i-1][j]
        for j in range(k):
            costs[i][j] += min2 if j == minIdx else min1
    return min(costs[-1])`,

    javascript: `function minCostII(costs) {
  const n = costs.length, k = costs[0].length;
  for (let i = 1; i < n; i++) {
    let min1 = Infinity, min2 = Infinity, minIdx = -1;
    for (let j = 0; j < k; j++) {
      if (costs[i-1][j] < min1) {
        min2 = min1; min1 = costs[i-1][j]; minIdx = j;
      } else if (costs[i-1][j] < min2) {
        min2 = costs[i-1][j];
      }
    }
    for (let j = 0; j < k; j++) {
      costs[i][j] += j === minIdx ? min2 : min1;
    }
  }
  return Math.min(...costs[n-1]);
}`,

    java: `public int minCostII(int[][] costs) {
    int n = costs.length, k = costs[0].length;
    for (int i = 1; i < n; i++) {
        int min1 = Integer.MAX_VALUE, min2 = Integer.MAX_VALUE, minIdx = -1;
        for (int j = 0; j < k; j++) {
            if (costs[i-1][j] < min1) {
                min2 = min1; min1 = costs[i-1][j]; minIdx = j;
            } else if (costs[i-1][j] < min2) {
                min2 = costs[i-1][j];
            }
        }
        for (int j = 0; j < k; j++) {
            costs[i][j] += (j == minIdx) ? min2 : min1;
        }
    }
    int ans = Integer.MAX_VALUE;
    for (int c : costs[n-1]) ans = Math.min(ans, c);
    return ans;
}`,
  },

  defaultInput: {
    costs: [[1, 5, 3], [2, 9, 4], [6, 1, 2]],
  },

  inputFields: [
    {
      name: 'costs',
      label: 'Cost Matrix (rows = houses, cols = colors)',
      type: 'array',
      defaultValue: [[1, 5, 3], [2, 9, 4], [6, 1, 2]],
      placeholder: '[[1,5,3],[2,9,4],[6,1,2]]',
      helperText: 'Matrix where costs[i][j] is cost to paint house i with color j',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const costs = (input.costs as number[][]).map(row => [...row]);
    const steps: AlgorithmStep[] = [];
    const n = costs.length;
    const k = costs[0].length;

    const makeDP = (highlight: Record<string, string>, note: string) => ({
      type: 'dp' as const,
      table: {
        headers: ['House', ...Array.from({ length: k }, (_, j) => `Color ${j + 1}`)],
        rows: costs.map((row, i) => ({
          label: `House ${i + 1}`,
          cells: [
            { value: `H${i + 1}`, highlight: 'default' as string },
            ...row.map((v, j) => ({
              value: v,
              highlight: highlight[`${i},${j}`] || 'default',
            })),
          ],
        })),
      },
    });

    steps.push({
      line: 1,
      explanation: `Starting Paint House II with ${n} houses and ${k} colors. Initialized cost table with base costs.`,
      variables: { n, k, house: 0 },
      visualization: makeDP({}, 'initial'),
    });

    for (let i = 1; i < n; i++) {
      let min1 = Infinity, min2 = Infinity, minIdx = -1;
      for (let j = 0; j < k; j++) {
        if (costs[i - 1][j] < min1) {
          min2 = min1; min1 = costs[i - 1][j]; minIdx = j;
        } else if (costs[i - 1][j] < min2) {
          min2 = costs[i - 1][j];
        }
      }

      const prevHighlights: Record<string, string> = {};
      prevHighlights[`${i - 1},${minIdx}`] = 'found';

      steps.push({
        line: 3,
        explanation: `House ${i + 1}: Previous row min1=${min1} at color ${minIdx + 1}, min2=${min2}. These are the two lowest costs from house ${i}.`,
        variables: { house: i + 1, min1, min2, minIdx: minIdx + 1 },
        visualization: makeDP(prevHighlights, 'finding mins'),
      });

      for (let j = 0; j < k; j++) {
        const added = j === minIdx ? min2 : min1;
        costs[i][j] += added;
      }

      const curHighlights: Record<string, string> = {};
      for (let j = 0; j < k; j++) curHighlights[`${i},${j}`] = 'active';

      steps.push({
        line: 8,
        explanation: `Updated house ${i + 1} costs by adding optimal previous costs. Current row: [${costs[i].join(', ')}].`,
        variables: { house: i + 1, updatedCosts: costs[i] },
        visualization: makeDP(curHighlights, 'updated'),
      });
    }

    const minCost = Math.min(...costs[n - 1]);
    const minJ = costs[n - 1].indexOf(minCost);
    const finalHL: Record<string, string> = {};
    finalHL[`${n - 1},${minJ}`] = 'found';

    steps.push({
      line: 10,
      explanation: `Minimum cost to paint all houses is ${minCost}, achieved by using color ${minJ + 1} for the last house.`,
      variables: { minCost, bestColorLastHouse: minJ + 1 },
      visualization: makeDP(finalHL, 'result'),
    });

    return steps;
  },
};

export default paintHouseIi;
