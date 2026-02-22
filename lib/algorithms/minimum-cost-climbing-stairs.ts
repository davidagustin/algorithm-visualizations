import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCostClimbingStairs: AlgorithmDefinition = {
  id: 'minimum-cost-climbing-stairs',
  title: 'Min Cost Climbing Stairs',
  leetcodeNumber: 746,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given an array cost where cost[i] is the cost to step on stair i, find the minimum cost to reach the top. You can start at index 0 or 1 and climb 1 or 2 steps at a time. dp[i] = min cost to reach step i. dp[i] = cost[i] + min(dp[i-1], dp[i-2]).',
  tags: ['Dynamic Programming', 'Array'],
  code: {
    pseudocode: `function minCostClimbingStairs(cost):
  n = length(cost)
  dp = array of size n+1
  dp[0] = 0, dp[1] = 0
  for i from 2 to n:
    dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
  return dp[n]`,
    python: `def minCostClimbingStairs(cost):
    n = len(cost)
    dp = [0] * (n + 1)
    for i in range(2, n + 1):
        dp[i] = min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2])
    return dp[n]`,
    javascript: `function minCostClimbingStairs(cost) {
  const n = cost.length;
  const dp = new Array(n + 1).fill(0);
  for (let i = 2; i <= n; i++) {
    dp[i] = Math.min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]);
  }
  return dp[n];
}`,
    java: `public int minCostClimbingStairs(int[] cost) {
    int n = cost.length;
    int[] dp = new int[n + 1];
    for (int i = 2; i <= n; i++) {
        dp[i] = Math.min(dp[i-1] + cost[i-1], dp[i-2] + cost[i-2]);
    }
    return dp[n];
}`,
  },
  defaultInput: { cost: [10, 15, 20] },
  inputFields: [
    {
      name: 'cost',
      label: 'Step Costs',
      type: 'array',
      defaultValue: [10, 15, 20],
      placeholder: '10,15,20',
      helperText: 'Cost at each step. You can start at step 0 or 1.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cost = input.cost as number[];
    const n = cost.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(n + 1).fill(null);
    const labels: string[] = [
      'start',
      ...Array.from({ length: n - 1 }, (_, i) => `step${i + 1}\ncost=${cost[i + 1]}`),
      'top',
    ];
    // Adjust labels: index 0 = "start(free)", index 1 = "step1(free)", i = "step i, cost[i-1]", n = "top"
    const lblArr: string[] = ['start\n(free)', 'step1\n(free)'];
    for (let i = 2; i < n; i++) lblArr.push(`step${i}\nc=${cost[i]}`);
    lblArr.push('TOP');

    // Fix labels for proper indexing
    const labelArr: string[] = [];
    labelArr.push('start\n(free)');
    labelArr.push('step1\n(free)');
    for (let i = 2; i <= n; i++) {
      labelArr.push(i < n ? `step${i}\nc=${cost[i]}` : 'TOP');
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels: labelArr };
    }

    steps.push({
      line: 1,
      explanation: `Min Cost Climbing Stairs: cost=[${cost.join(', ')}]. dp[i] = min cost to reach step i. Top is index ${n}. Can start at 0 or 1 for free.`,
      variables: { cost, n },
      visualization: makeViz(null, []),
    });

    dp[0] = 0;
    dp[1] = 0;
    steps.push({
      line: 2,
      explanation: 'dp[0] = 0 and dp[1] = 0. You can start at either stair 0 or stair 1 for free.',
      variables: { 'dp[0]': 0, 'dp[1]': 0 },
      visualization: makeViz(1, [0]),
    });

    for (let i = 2; i <= n; i++) {
      const from1 = (dp[i - 1] as number) + cost[i - 1];
      const from2 = (dp[i - 2] as number) + cost[i - 2];

      steps.push({
        line: 4,
        explanation: `i=${i}: from step ${i - 1} → dp[${i - 1}]+cost[${i - 1}]=${dp[i - 1]}+${cost[i - 1]}=${from1}. From step ${i - 2} → dp[${i - 2}]+cost[${i - 2}]=${dp[i - 2]}+${cost[i - 2]}=${from2}.`,
        variables: { i, from1, from2 },
        visualization: makeViz(i, [i - 1, i - 2]),
      });

      dp[i] = Math.min(from1, from2);

      steps.push({
        line: 4,
        explanation: `dp[${i}] = min(${from1}, ${from2}) = ${dp[i]}. ${dp[i] === from1 ? `Climbing from step ${i - 1}.` : `Climbing from step ${i - 2}.`}`,
        variables: { i, 'dp[i]': dp[i] },
        visualization: makeViz(i, []),
      });
    }

    steps.push({
      line: 5,
      explanation: `dp[${n}] = ${dp[n]}. Minimum cost to reach the top of the staircase: ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [i, i === n ? 'active' : 'found'])
        ),
        labels: labelArr,
      },
    });

    return steps;
  },
};

export default minimumCostClimbingStairs;
