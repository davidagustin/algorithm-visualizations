import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minCostClimbingStairsIi: AlgorithmDefinition = {
  id: 'min-cost-climbing-stairs-ii',
  title: 'Min Cost Climbing Stairs (Detailed)',
  leetcodeNumber: 746,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'You are given an integer array cost where cost[i] is the cost of the ith step. Once you pay the cost you can climb one or two steps. You can start from index 0 or 1. Return the minimum cost to reach the top of the floor (beyond the last step). This detailed version tracks the optimal decision at each step.',
  tags: ['dynamic programming', 'array', 'bottom-up'],

  code: {
    pseudocode: `function minCostClimbingStairs(cost):
  n = length(cost)
  dp = array of size n+1
  dp[0] = 0, dp[1] = 0
  for i from 2 to n:
    oneStep = dp[i-1] + cost[i-1]
    twoStep = dp[i-2] + cost[i-2]
    dp[i] = min(oneStep, twoStep)
  return dp[n]`,

    python: `def minCostClimbingStairs(cost: list[int]) -> int:
    n = len(cost)
    dp = [0] * (n + 1)
    for i in range(2, n + 1):
        one_step = dp[i-1] + cost[i-1]
        two_step = dp[i-2] + cost[i-2]
        dp[i] = min(one_step, two_step)
    return dp[n]`,

    javascript: `function minCostClimbingStairs(cost) {
  const n = cost.length;
  const dp = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    const oneStep = dp[i-1] + cost[i-1];
    const twoStep = dp[i-2] + cost[i-2];
    dp[i] = Math.min(oneStep, twoStep);
  }
  return dp[n];
}`,

    java: `public int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    int[] dp = new int[n + 1];
    for (int i = 2; i <= n; i++) {
        int oneStep = dp[i-1] + cost[i-1];
        int twoStep = dp[i-2] + cost[i-2];
        dp[i] = Math.min(oneStep, twoStep);
    }
    return dp[n];
}`,
  },

  defaultInput: { cost: [10, 15, 20, 5, 30] },

  inputFields: [
    {
      name: 'cost',
      label: 'Step Costs',
      type: 'array',
      defaultValue: [10, 15, 20, 5, 30],
      placeholder: '10,15,20,5,30',
      helperText: 'Cost to climb from each step',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cost = input.cost as number[];
    const n = cost.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = Array(n + 1).fill(null);

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp] as number[],
      highlights: Object.fromEntries(
        dp.map((v, i) => [i, i === activeIdx ? 'active' : v !== null ? 'found' : 'default'])
      ),
      labels: Array.from({ length: n + 1 }, (_, i) => i === n ? 'TOP' : `s${i}`),
    });

    dp[0] = 0;
    dp[1] = 0;

    steps.push({
      line: 2,
      explanation: 'Initialize dp[0] = 0 and dp[1] = 0. Both starting positions are free.',
      variables: { 'dp[0]': 0, 'dp[1]': 0, n },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      const oneStep = (dp[i - 1] as number) + cost[i - 1];
      const twoStep = (dp[i - 2] as number) + cost[i - 2];
      dp[i] = Math.min(oneStep, twoStep);
      const chosen = oneStep <= twoStep ? 'one step' : 'two steps';

      steps.push({
        line: 6,
        explanation: `Step ${i}: oneStep = dp[${i - 1}] + cost[${i - 1}] = ${dp[i - 1]} + ${cost[i - 1]} = ${oneStep}; twoStep = dp[${i - 2}] + cost[${i - 2}] = ${dp[i - 2]} + ${cost[i - 2]} = ${twoStep}. Choose ${chosen}: dp[${i}] = ${dp[i]}.`,
        variables: { i, oneStep, twoStep, [`dp[${i}]`]: dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 8,
      explanation: `Minimum cost to reach the top is dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp as number[],
        highlights: Object.fromEntries((dp as number[]).map((_, i) => [i, i === n ? 'found' : 'sorted'])),
        labels: Array.from({ length: n + 1 }, (_, i) => i === n ? 'TOP' : `s${i}`),
      },
    });

    return steps;
  },
};

export default minCostClimbingStairsIi;
