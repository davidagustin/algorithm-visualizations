import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kRadiusSubarrayAveragesII: AlgorithmDefinition = {
  id: 'k-radius-subarray-averages-ii',
  title: 'K Radius Subarray Averages II',
  leetcodeNumber: 2090,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'For each index i, compute the average of nums[i-k..i+k] if that window exists, else -1. Build a prefix sum array, then for each valid index the window sum is prefix[i+k+1] - prefix[i-k] and the average is that divided by (2k+1). O(n) time.',
  tags: ['Prefix Sum', 'Array', 'Sliding Window'],
  code: {
    pseudocode: `function getAverages(nums, k):
  n = len(nums)
  prefix = prefix sum of size n+1
  result = [-1] * n
  windowSize = 2*k + 1
  for i from k to n-1-k:
    windowSum = prefix[i+k+1] - prefix[i-k]
    result[i] = windowSum // windowSize
  return result`,
    python: `def getAverages(nums: list[int], k: int) -> list[int]:
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    result = [-1] * n
    window = 2 * k + 1
    for i in range(k, n - k):
        result[i] = (prefix[i + k + 1] - prefix[i - k]) // window
    return result`,
    javascript: `function getAverages(nums, k) {
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
  const result = new Array(n).fill(-1);
  const window = 2 * k + 1;
  for (let i = k; i < n - k; i++) {
    result[i] = Math.floor((prefix[i + k + 1] - prefix[i - k]) / window);
  }
  return result;
}`,
    java: `public int[] getAverages(int[] nums, int k) {
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];
    int[] result = new int[n];
    Arrays.fill(result, -1);
    int window = 2 * k + 1;
    for (int i = k; i < n - k; i++)
        result[i] = (int)((prefix[i + k + 1] - prefix[i - k]) / window);
    return result;
}`,
  },
  defaultInput: { nums: [7, 4, 3, 9, 1, 8, 5, 2, 6], k: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [7, 4, 3, 9, 1, 8, 5, 2, 6],
      placeholder: '7,4,3,9,1,8,5,2,6',
      helperText: 'Non-negative integers',
    },
    {
      name: 'k',
      label: 'Radius k',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Window radius',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr?: number[],
    ): ArrayVisualization => ({
      type: 'array',
      array: arr ?? [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compute k-radius averages (k=${k}) for nums = [${nums.join(', ')}]. Window size = ${2 * k + 1}. prefix = [${prefix.join(', ')}].`,
      variables: { k, windowSize: 2 * k + 1 },
      visualization: makeViz({}, {}),
    });

    const result: number[] = new Array(n).fill(-1);
    const window = 2 * k + 1;

    for (let i = 0; i < n; i++) {
      if (i < k || i >= n - k) {
        steps.push({
          line: 6,
          explanation: `Index ${i}: window [${i - k}..${i + k}] out of bounds. result[${i}] = -1.`,
          variables: { i },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: '-1' }),
        });
      } else {
        const windowSum = prefix[i + k + 1] - prefix[i - k];
        result[i] = Math.floor(windowSum / window);

        steps.push({
          line: 7,
          explanation: `Index ${i}: window [${i - k}..${i + k}]. sum = prefix[${i + k + 1}]-prefix[${i - k}] = ${windowSum}. avg = ${windowSum}/${window} = ${result[i]}.`,
          variables: { i, windowSum, avg: result[i] },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: window }, (_, w) => [i - k + w, 'active'])),
            { [i - k]: 'L', [i]: `avg=${result[i]}`, [i + k]: 'R' },
          ),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. result = [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(result.map((v, i) => [i, v === -1 ? 'mismatch' : 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)])),
        [...result],
      ),
    });

    return steps;
  },
};

export default kRadiusSubarrayAveragesII;
