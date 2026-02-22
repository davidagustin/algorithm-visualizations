import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countWaysToBuildGoodStrings: AlgorithmDefinition = {
  id: 'count-ways-to-build-good-strings',
  title: 'Count Ways to Build Good Strings',
  leetcodeNumber: 2466,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Count strings of length between low and high (inclusive) that can be built by appending zero or more 0s followed by one or more 1s repeatedly. dp[i] = number of ways to build a string of exactly length i. Transitions: dp[i] += dp[i - zero] and dp[i] += dp[i - one].',
  tags: ['dynamic programming', 'counting', 'string building'],

  code: {
    pseudocode: `function countGoodStrings(low, high, zero, one):
  MOD = 1e9 + 7
  dp = array of size high+1, dp[0] = 1
  result = 0
  for i from 1 to high:
    if i >= zero: dp[i] = (dp[i] + dp[i - zero]) % MOD
    if i >= one:  dp[i] = (dp[i] + dp[i - one])  % MOD
    if i >= low:  result = (result + dp[i]) % MOD
  return result`,
    python: `def countGoodStrings(low: int, high: int, zero: int, one: int) -> int:
    MOD = 10**9 + 7
    dp = [0] * (high + 1)
    dp[0] = 1
    result = 0
    for i in range(1, high + 1):
        if i >= zero:
            dp[i] = (dp[i] + dp[i - zero]) % MOD
        if i >= one:
            dp[i] = (dp[i] + dp[i - one]) % MOD
        if i >= low:
            result = (result + dp[i]) % MOD
    return result`,
    javascript: `function countGoodStrings(low, high, zero, one) {
  const MOD = 1e9 + 7;
  const dp = new Array(high + 1).fill(0);
  dp[0] = 1;
  let result = 0;
  for (let i = 1; i <= high; i++) {
    if (i >= zero) dp[i] = (dp[i] + dp[i - zero]) % MOD;
    if (i >= one)  dp[i] = (dp[i] + dp[i - one])  % MOD;
    if (i >= low)  result = (result + dp[i]) % MOD;
  }
  return result;
}`,
    java: `public int countGoodStrings(int low, int high, int zero, int one) {
    final int MOD = 1_000_000_007;
    int[] dp = new int[high + 1];
    dp[0] = 1;
    int result = 0;
    for (int i = 1; i <= high; i++) {
        if (i >= zero) dp[i] = (dp[i] + dp[i - zero]) % MOD;
        if (i >= one)  dp[i] = (dp[i] + dp[i - one])  % MOD;
        if (i >= low)  result = (result + dp[i]) % MOD;
    }
    return result;
}`,
  },

  defaultInput: {
    low: 3,
    high: 3,
    zero: 1,
    one: 1,
  },

  inputFields: [
    {
      name: 'low',
      label: 'Low (min length)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minimum string length',
    },
    {
      name: 'high',
      label: 'High (max length)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum string length',
    },
    {
      name: 'zero',
      label: 'Zero (append zeros)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of 0s to append each step',
    },
    {
      name: 'one',
      label: 'One (append ones)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of 1s to append each step',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const low = input.low as number;
    const high = input.high as number;
    const zero = input.zero as number;
    const one = input.one as number;
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;
    const dp = new Array(high + 1).fill(0);
    dp[0] = 1;
    let result = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...dpArr],
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp[0..${high}] = 0, dp[0] = 1. low=${low}, high=${high}, zero=${zero}, one=${one}.`,
      variables: { low, high, zero, one },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= high; i++) {
      const highlights: Record<number, string> = { [i]: 'active' };
      if (i >= zero) {
        dp[i] = (dp[i] + dp[i - zero]) % MOD;
        highlights[i - zero] = 'comparing';
      }
      if (i >= one) {
        dp[i] = (dp[i] + dp[i - one]) % MOD;
        if (i - one !== i - zero) highlights[i - one] = 'comparing';
      }
      steps.push({
        line: 5,
        explanation: `Length ${i}: dp[${i}] = ${dp[i]}${i >= low ? '. Counts toward result (length in [low,high]).' : '.'}`,
        variables: { i, 'dp[i]': dp[i], result },
        visualization: makeViz([...dp], highlights),
      });
      if (i >= low) {
        result = (result + dp[i]) % MOD;
      }
    }

    steps.push({
      line: 8,
      explanation: `Total good strings with length in [${low}, ${high}] = ${result}.`,
      variables: { result },
      visualization: makeViz([...dp], Object.fromEntries(
        Array.from({ length: high - low + 1 }, (_, k) => [low + k, 'found'])
      )),
    });

    return steps;
  },
};

export default countWaysToBuildGoodStrings;
