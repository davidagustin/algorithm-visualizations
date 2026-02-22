import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestArithmeticSubsequenceOfGivenDiff: AlgorithmDefinition = {
  id: 'longest-arithmetic-subsequence-of-given-diff',
  title: 'Longest Arithmetic Subsequence of Given Difference',
  leetcodeNumber: 1218,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an integer array arr and an integer difference, find the length of the longest subsequence in arr which is an arithmetic sequence where the difference between adjacent elements equals the given difference. Use a hash map dp where dp[v] = length of the longest arithmetic subsequence ending with value v. For each number, dp[num] = dp[num - difference] + 1.',
  tags: ['dp', 'hash map', 'arithmetic', 'subsequence', 'greedy'],

  code: {
    pseudocode: `function longestSubsequence(arr, difference):
  dp = hash map, default 0
  result = 1
  for num in arr:
    dp[num] = dp[num - difference] + 1
    result = max(result, dp[num])
  return result`,
    python: `def longestSubsequence(arr: list, difference: int) -> int:
    dp = {}
    result = 1
    for num in arr:
        dp[num] = dp.get(num - difference, 0) + 1
        result = max(result, dp[num])
    return result`,
    javascript: `function longestSubsequence(arr, difference) {
  const dp = new Map();
  let result = 1;
  for (const num of arr) {
    const prev = dp.get(num - difference) || 0;
    dp.set(num, prev + 1);
    result = Math.max(result, dp.get(num));
  }
  return result;
}`,
    java: `public int longestSubsequence(int[] arr, int difference) {
    Map<Integer,Integer> dp = new HashMap<>();
    int result = 1;
    for (int num : arr) {
        int prev = dp.getOrDefault(num - difference, 0);
        dp.put(num, prev + 1);
        result = Math.max(result, dp.get(num));
    }
    return result;
}`,
  },

  defaultInput: {
    arr: [1, 2, 3, 4],
    difference: 1,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Integer array',
    },
    {
      name: 'difference',
      label: 'Difference',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Required common difference between consecutive elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const difference = input.difference as number;
    const steps: AlgorithmStep[] = [];
    const dp = new Map<number, number>();
    let result = 1;

    const dpSnapshot = (): number[] => arr.map(v => dp.get(v) ?? 0);
    const makeViz = (highlights: Record<number, string>): DPVisualization => ({
      type: 'dp-table',
      values: dpSnapshot(),
      highlights,
      labels: arr.map((v, i) => `arr[${i}]=${v}`),
    });

    steps.push({
      line: 1,
      explanation: `Find longest subsequence with difference=${difference} in [${arr.join(', ')}]. Use hash map dp[num] = longest chain ending at num.`,
      variables: { difference, result },
      visualization: makeViz({}),
    });

    for (let idx = 0; idx < arr.length; idx++) {
      const num = arr[idx];
      const prev = dp.get(num - difference) ?? 0;
      dp.set(num, prev + 1);

      steps.push({
        line: 4,
        explanation: `num=${num}: dp[${num} - ${difference}] = dp[${num - difference}] = ${prev}. dp[${num}] = ${prev + 1}.`,
        variables: { num, prev, 'dp[num]': prev + 1, result },
        visualization: makeViz({ [idx]: 'active' }),
      });

      if (dp.get(num)! > result) {
        result = dp.get(num)!;
        steps.push({
          line: 5,
          explanation: `New best! result = ${result} (subsequence ending at ${num} with diff ${difference}).`,
          variables: { num, result },
          visualization: makeViz({ [idx]: 'found' }),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `Longest arithmetic subsequence with difference ${difference} has length ${result}.`,
      variables: { result },
      visualization: makeViz({}),
    });

    return steps;
  },
};

export default longestArithmeticSubsequenceOfGivenDiff;
