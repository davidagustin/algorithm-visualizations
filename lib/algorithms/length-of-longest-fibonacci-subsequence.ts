import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lengthOfLongestFibonacciSubsequence: AlgorithmDefinition = {
  id: 'length-of-longest-fibonacci-subsequence',
  title: 'Length of Longest Fibonacci Subsequence',
  leetcodeNumber: 873,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a strictly increasing array, find the length of the longest Fibonacci-like subsequence. dp[i][j] = length of Fibonacci subsequence ending at indices i and j. For each pair (i,j), check if arr[j] - arr[i] exists in the set and look up dp for that pair.',
  tags: ['dynamic programming', 'hash set', 'sequence'],

  code: {
    pseudocode: `function lenLongestFibSubseq(arr):
  n = len(arr)
  index = {v: i for i, v in enumerate(arr)}
  dp = 2D array n x n, all 0
  result = 0
  for j from 1 to n-1:
    for i from 0 to j-1:
      diff = arr[j] - arr[i]
      if diff < arr[i] and diff in index:
        k = index[diff]
        dp[i][j] = dp[k][i] + 1
        result = max(result, dp[i][j] + 2)
  return result if result >= 3 else 0`,
    python: `def lenLongestFibSubseq(arr: list[int]) -> int:
    index = {v: i for i, v in enumerate(arr)}
    n = len(arr)
    dp = [[0] * n for _ in range(n)]
    result = 0
    for j in range(1, n):
        for i in range(j):
            diff = arr[j] - arr[i]
            if diff < arr[i] and diff in index:
                k = index[diff]
                dp[i][j] = dp[k][i] + 1
                result = max(result, dp[i][j] + 2)
    return result if result >= 3 else 0`,
    javascript: `function lenLongestFibSubseq(arr) {
  const n = arr.length;
  const index = new Map(arr.map((v, i) => [v, i]));
  const dp = Array.from({length: n}, () => new Array(n).fill(0));
  let result = 0;
  for (let j = 1; j < n; j++) {
    for (let i = 0; i < j; i++) {
      const diff = arr[j] - arr[i];
      if (diff < arr[i] && index.has(diff)) {
        const k = index.get(diff);
        dp[i][j] = dp[k][i] + 1;
        result = Math.max(result, dp[i][j] + 2);
      }
    }
  }
  return result >= 3 ? result : 0;
}`,
    java: `public int lenLongestFibSubseq(int[] arr) {
    int n = arr.length;
    Map<Integer, Integer> index = new HashMap<>();
    for (int i = 0; i < n; i++) index.put(arr[i], i);
    int[][] dp = new int[n][n];
    int result = 0;
    for (int j = 1; j < n; j++) {
        for (int i = 0; i < j; i++) {
            int diff = arr[j] - arr[i];
            if (diff < arr[i] && index.containsKey(diff)) {
                int k = index.get(diff);
                dp[i][j] = dp[k][i] + 1;
                result = Math.max(result, dp[i][j] + 2);
            }
        }
    }
    return result >= 3 ? result : 0;
}`,
  },

  defaultInput: {
    arr: [1, 2, 3, 4, 5, 6, 7, 8],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Strictly Increasing Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8],
      placeholder: '1,2,3,4,5,6,7,8',
      helperText: 'Strictly increasing integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const index = new Map(arr.map((v, i) => [v, i]));
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    let result = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 3,
      explanation: `Array: [${arr.join(', ')}]. Build index map and dp[i][j] = Fibonacci chain length ending at i,j.`,
      variables: { n },
      visualization: makeViz({}, Object.fromEntries(arr.map((v, i) => [i, String(v)]))),
    });

    for (let j = 1; j < n; j++) {
      for (let i = 0; i < j; i++) {
        const diff = arr[j] - arr[i];
        if (diff < arr[i] && index.has(diff)) {
          const k = index.get(diff)!;
          dp[i][j] = dp[k][i] + 1;
          const len = dp[i][j] + 2;
          if (len > result) result = len;
          steps.push({
            line: 10,
            explanation: `Fib triple: arr[${k}]=${arr[k]}, arr[${i}]=${arr[i]}, arr[${j}]=${arr[j]}. Chain length = ${len}.`,
            variables: { k, i, j, length: len, best: result },
            visualization: makeViz(
              { [k]: 'comparing', [i]: 'active', [j]: 'found' },
              { [k]: `k=${arr[k]}`, [i]: `i=${arr[i]}`, [j]: `j=${arr[j]}` }
            ),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Longest Fibonacci subsequence length = ${result >= 3 ? result : 0}.`,
      variables: { result: result >= 3 ? result : 0 },
      visualization: makeViz({}, Object.fromEntries(arr.map((v, i) => [i, String(v)]))),
    });

    return steps;
  },
};

export default lengthOfLongestFibonacciSubsequence;
