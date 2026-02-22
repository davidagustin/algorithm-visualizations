import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const numberOfDiceRollsWithTargetII: AlgorithmDefinition = {
  id: 'number-of-dice-rolls-with-target-ii',
  title: 'Number of Dice Rolls With Target Sum',
  leetcodeNumber: 1155,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count ways to roll n dice each with k faces (1..k) so that the sum equals target. dp[i][s] = ways to achieve sum s using i dice. dp[i][s] = sum of dp[i-1][s-f] for f in 1..k. Answer modulo 10^9+7.',
  tags: ['Dynamic Programming', 'Combinatorics'],
  code: {
    pseudocode: `function numRollsToTarget(n, k, target):
  MOD = 1e9+7
  dp = array[target+1], dp[0]=1
  for i from 1 to n:
    ndp = array[target+1] filled 0
    for s from 1 to target:
      for f from 1 to min(k, s):
        ndp[s] = (ndp[s] + dp[s-f]) % MOD
    dp = ndp
  return dp[target]`,
    python: `def numRollsToTarget(n, k, target):
    MOD = 10**9 + 7
    dp = [0] * (target + 1)
    dp[0] = 1
    for i in range(n):
        ndp = [0] * (target + 1)
        for s in range(1, target + 1):
            for f in range(1, min(k, s) + 1):
                ndp[s] = (ndp[s] + dp[s - f]) % MOD
        dp = ndp
    return dp[target]`,
    javascript: `function numRollsToTarget(n, k, target) {
  const MOD = 1000000007;
  let dp = new Array(target + 1).fill(0);
  dp[0] = 1;
  for (let i = 0; i < n; i++) {
    const ndp = new Array(target + 1).fill(0);
    for (let s = 1; s <= target; s++) {
      for (let f = 1; f <= Math.min(k, s); f++) {
        ndp[s] = (ndp[s] + dp[s - f]) % MOD;
      }
    }
    dp = ndp;
  }
  return dp[target];
}`,
    java: `public int numRollsToTarget(int n, int k, int target) {
    int MOD = 1_000_000_007;
    int[] dp = new int[target + 1];
    dp[0] = 1;
    for (int i = 0; i < n; i++) {
        int[] ndp = new int[target + 1];
        for (int s = 1; s <= target; s++)
            for (int f = 1; f <= Math.min(k, s); f++)
                ndp[s] = (ndp[s] + dp[s - f]) % MOD;
        dp = ndp;
    }
    return dp[target];
}`,
  },
  defaultInput: { n: 2, k: 6, target: 7 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Dice (n)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of dice to roll',
    },
    {
      name: 'k',
      label: 'Faces per Die (k)',
      type: 'number',
      defaultValue: 6,
      placeholder: 'e.g. 6',
      helperText: 'Each die has faces labeled 1 to k',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Desired sum of all dice',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const target = input.target as number;
    const MOD = 1000000007;
    const steps: AlgorithmStep[] = [];

    let dp: number[] = new Array(target + 1).fill(0);
    dp[0] = 1;
    const labels: string[] = Array.from({ length: target + 1 }, (_, s) => `s=${s}`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= target; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 2,
      explanation: `n=${n} dice, k=${k} faces each, target=${target}. Initialize dp[0]=1 (0 dice summing to 0: 1 way).`,
      variables: { n, k, target },
      visualization: makeViz(0),
    });

    for (let i = 0; i < n; i++) {
      const ndp: number[] = new Array(target + 1).fill(0);
      for (let s = 1; s <= target; s++) {
        for (let f = 1; f <= Math.min(k, s); f++) {
          ndp[s] = (ndp[s] + dp[s - f]) % MOD;
        }
      }
      dp = ndp;

      steps.push({
        line: 5,
        explanation: `After die ${i + 1}: dp[target]=${dp[target]}. Each cell s accumulated ways to reach s with ${i + 1} dice.`,
        variables: { die: i + 1, 'dp[target]': dp[target] },
        visualization: makeViz(target),
      });
    }

    steps.push({
      line: 9,
      explanation: `Answer = dp[${target}] = ${dp[target]}. Ways to roll ${n} dice (1-${k}) summing to ${target}.`,
      variables: { result: dp[target] },
      visualization: makeViz(target),
    });

    return steps;
  },
};

export default numberOfDiceRollsWithTargetII;
