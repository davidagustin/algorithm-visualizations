import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const formLargestIntegerWithDigits: AlgorithmDefinition = {
  id: 'form-largest-integer-with-digits',
  title: 'Form Largest Integer With Digits That Add Up to Target',
  leetcodeNumber: 1449,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a cost array where cost[i] is the cost to paint digit i+1, and a target budget, find the largest integer (as a string) you can form. Largest means most digits first, then lexicographically largest. Use DP where dp[j] = max number of digits achievable with budget j.',
  tags: ['dynamic programming', 'knapsack', 'greedy', 'string'],

  code: {
    pseudocode: `function largestNumber(cost, target):
  dp = array of size target+1, dp[0] = 0, rest = -Infinity
  for j from 1 to target:
    for d from 0 to 8:
      if j >= cost[d] and dp[j - cost[d]] != -Infinity:
        dp[j] = max(dp[j], dp[j - cost[d]] + 1)
  if dp[target] < 0: return "0"
  result = ""
  for d from 8 down to 0:
    while dp[target] > 0 and target >= cost[d] and dp[target - cost[d]] == dp[target] - 1:
      result += (d+1)
      target -= cost[d]
  return result`,
    python: `def largestNumber(cost: list[int], target: int) -> str:
    dp = [-float('inf')] * (target + 1)
    dp[0] = 0
    for j in range(1, target + 1):
        for d in range(9):
            if j >= cost[d] and dp[j - cost[d]] != -float('inf'):
                dp[j] = max(dp[j], dp[j - cost[d]] + 1)
    if dp[target] < 0:
        return "0"
    res = []
    for d in range(8, -1, -1):
        while target >= cost[d] and dp[target - cost[d]] == dp[target] - 1:
            res.append(str(d + 1))
            target -= cost[d]
    return "".join(res)`,
    javascript: `function largestNumber(cost, target) {
  const dp = new Array(target + 1).fill(-Infinity);
  dp[0] = 0;
  for (let j = 1; j <= target; j++) {
    for (let d = 0; d < 9; d++) {
      if (j >= cost[d] && dp[j - cost[d]] !== -Infinity) {
        dp[j] = Math.max(dp[j], dp[j - cost[d]] + 1);
      }
    }
  }
  if (dp[target] < 0) return "0";
  let res = "";
  for (let d = 8; d >= 0; d--) {
    while (target >= cost[d] && dp[target - cost[d]] === dp[target] - 1) {
      res += (d + 1);
      target -= cost[d];
    }
  }
  return res;
}`,
    java: `public String largestNumber(int[] cost, int target) {
    int[] dp = new int[target + 1];
    Arrays.fill(dp, Integer.MIN_VALUE);
    dp[0] = 0;
    for (int j = 1; j <= target; j++) {
        for (int d = 0; d < 9; d++) {
            if (j >= cost[d] && dp[j - cost[d]] != Integer.MIN_VALUE) {
                dp[j] = Math.max(dp[j], dp[j - cost[d]] + 1);
            }
        }
    }
    if (dp[target] < 0) return "0";
    StringBuilder sb = new StringBuilder();
    for (int d = 8; d >= 0; d--) {
        while (target >= cost[d] && dp[target - cost[d]] == dp[target] - 1) {
            sb.append(d + 1);
            target -= cost[d];
        }
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    cost: [4, 3, 2, 5, 6, 7, 2, 5, 5],
    target: 9,
  },

  inputFields: [
    {
      name: 'cost',
      label: 'Digit Costs (digits 1-9)',
      type: 'array',
      defaultValue: [4, 3, 2, 5, 6, 7, 2, 5, 5],
      placeholder: '4,3,2,5,6,7,2,5,5',
      helperText: 'Cost to paint each digit 1 through 9',
    },
    {
      name: 'target',
      label: 'Target Budget',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Total budget to spend',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const cost = input.cost as number[];
    const targetInput = input.target as number;
    const steps: AlgorithmStep[] = [];

    const dp = new Array(targetInput + 1).fill(-Infinity);
    dp[0] = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v === -Infinity ? -1 : v)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, String(i)])),
    });

    steps.push({
      line: 2,
      explanation: `Initialize dp[0..${targetInput}] = -INF, dp[0] = 0. dp[j] = max digits for budget j.`,
      variables: { target: targetInput },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let j = 1; j <= targetInput; j++) {
      for (let d = 0; d < 9; d++) {
        if (j >= cost[d] && dp[j - cost[d]] !== -Infinity) {
          const candidate = dp[j - cost[d]] + 1;
          if (candidate > dp[j]) {
            dp[j] = candidate;
            steps.push({
              line: 5,
              explanation: `Budget ${j}: digit ${d + 1} costs ${cost[d]}. dp[${j}] = dp[${j - cost[d]}] + 1 = ${dp[j]}.`,
              variables: { j, digit: d + 1, cost: cost[d], 'dp[j]': dp[j] },
              visualization: makeViz([...dp], { [j]: 'active', [j - cost[d]]: 'comparing' }),
            });
          }
        }
      }
    }

    if (dp[targetInput] < 0) {
      steps.push({
        line: 7,
        explanation: 'Cannot form any number with given budget. Return "0".',
        variables: { result: '0' },
        visualization: makeViz([...dp], { [targetInput]: 'mismatch' }),
      });
      return steps;
    }

    let res = '';
    let rem = targetInput;
    for (let d = 8; d >= 0; d--) {
      while (rem >= cost[d] && dp[rem - cost[d]] === dp[rem] - 1) {
        res += (d + 1);
        rem -= cost[d];
        steps.push({
          line: 10,
          explanation: `Greedily pick digit ${d + 1} (cost ${cost[d]}). Remaining budget = ${rem}. Result so far: "${res}".`,
          variables: { digit: d + 1, remainingBudget: rem, result: res },
          visualization: makeViz([...dp], { [rem]: 'found' }),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Final result: "${res}".`,
      variables: { result: res },
      visualization: makeViz([...dp], { [targetInput]: 'found' }),
    });

    return steps;
  },
};

export default formLargestIntegerWithDigits;
