import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lastStoneWeightDp: AlgorithmDefinition = {
  id: 'last-stone-weight-dp',
  title: 'Last Stone Weight II - DP',
  leetcodeNumber: 1049,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Split stones into two groups and minimize the absolute difference of their sums. This reduces to finding the largest subset sum <= total/2, then the answer is total - 2*bestSum. Uses a 0/1 knapsack boolean DP approach identical to partition-equal-subset-sum.',
  tags: ['dynamic programming', 'knapsack', '0/1 knapsack', 'subset sum'],

  code: {
    pseudocode: `function lastStoneWeightII(stones):
  total = sum(stones)
  target = total / 2
  dp = boolean array of size target+1, dp[0] = true
  for stone in stones:
    for j from target down to stone:
      dp[j] = dp[j] OR dp[j - stone]
  bestSum = largest j where dp[j] is true
  return total - 2 * bestSum`,
    python: `def lastStoneWeightII(stones: list[int]) -> int:
    total = sum(stones)
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    for stone in stones:
        for j in range(target, stone - 1, -1):
            dp[j] = dp[j] or dp[j - stone]
    for j in range(target, -1, -1):
        if dp[j]:
            return total - 2 * j
    return total`,
    javascript: `function lastStoneWeightII(stones) {
  const total = stones.reduce((a, b) => a + b, 0);
  const target = Math.floor(total / 2);
  const dp = new Array(target + 1).fill(false);
  dp[0] = true;
  for (const stone of stones) {
    for (let j = target; j >= stone; j--) {
      dp[j] = dp[j] || dp[j - stone];
    }
  }
  for (let j = target; j >= 0; j--) {
    if (dp[j]) return total - 2 * j;
  }
  return total;
}`,
    java: `public int lastStoneWeightII(int[] stones) {
    int total = 0;
    for (int s : stones) total += s;
    int target = total / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    for (int stone : stones) {
        for (int j = target; j >= stone; j--) {
            dp[j] = dp[j] || dp[j - stone];
        }
    }
    for (int j = target; j >= 0; j--) {
        if (dp[j]) return total - 2 * j;
    }
    return total;
}`,
  },

  defaultInput: {
    stones: [2, 7, 4, 1, 8, 1],
  },

  inputFields: [
    {
      name: 'stones',
      label: 'Stones',
      type: 'array',
      defaultValue: [2, 7, 4, 1, 8, 1],
      placeholder: '2,7,4,1,8,1',
      helperText: 'Comma-separated stone weights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[];
    const steps: AlgorithmStep[] = [];

    const total = stones.reduce((a, b) => a + b, 0);
    const target = Math.floor(total / 2);
    const dp = new Array(target + 1).fill(false);
    dp[0] = true;

    const makeViz = (dpArr: boolean[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v ? 1 : 0)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `Total = ${total}, target = floor(${total}/2) = ${target}. We want largest subset sum <= ${target}.`,
      variables: { total, target },
      visualization: {
        type: 'array',
        array: [...stones],
        highlights: {},
        labels: Object.fromEntries(stones.map((_, i) => [i, `s${i}`])),
      },
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp boolean array of size ${target + 1}. dp[0] = true.`,
      variables: { target },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let si = 0; si < stones.length; si++) {
      const stone = stones[si];
      steps.push({
        line: 5,
        explanation: `Process stone ${stone} (index ${si}).`,
        variables: { stone, stoneIndex: si },
        visualization: makeViz([...dp], {}),
      });
      for (let j = target; j >= stone; j--) {
        if (!dp[j] && dp[j - stone]) {
          dp[j] = true;
          steps.push({
            line: 7,
            explanation: `dp[${j}] = true via dp[${j - stone}] + stone ${stone}.`,
            variables: { j, stone, 'dp[j]': true },
            visualization: makeViz([...dp], { [j]: 'found', [j - stone]: 'comparing' }),
          });
        }
      }
    }

    let bestSum = 0;
    for (let j = target; j >= 0; j--) {
      if (dp[j]) {
        bestSum = j;
        break;
      }
    }

    const result = total - 2 * bestSum;
    steps.push({
      line: 9,
      explanation: `Best subset sum <= target is ${bestSum}. Answer = ${total} - 2*${bestSum} = ${result}.`,
      variables: { bestSum, total, result },
      visualization: makeViz([...dp], { [bestSum]: 'found' }),
    });

    return steps;
  },
};

export default lastStoneWeightDp;
