import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumCostToSplitArray: AlgorithmDefinition = {
  id: 'minimum-cost-to-split-array',
  title: 'Minimum Cost to Split an Array',
  leetcodeNumber: 2547,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Split array into subarrays where cost = k * (number of splits) + sum of trimmed subarray costs. Trimmed cost of a subarray = count of elements that appear more than once. dp[i] = min cost to split nums[0..i-1]. For each split point, compute trimmed cost using frequency counting.',
  tags: ['Dynamic Programming', 'Hash Map', 'Counting'],
  code: {
    pseudocode: `function minCost(nums, k):
  n = length(nums)
  dp = array[n+1], dp[0]=0, others=Infinity
  for i from 1 to n:
    freq = {}
    trimmed = 0
    for j from i-1 down to 0:
      freq[nums[j]]++
      if freq[nums[j]] == 2: trimmed += 2
      elif freq[nums[j]] > 2: trimmed += 1
      dp[i] = min(dp[i], dp[j] + trimmed + k)
  return dp[n]`,
    python: `def minCost(nums, k):
    n = len(nums)
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        freq = {}
        trimmed = 0
        for j in range(i - 1, -1, -1):
            freq[nums[j]] = freq.get(nums[j], 0) + 1
            if freq[nums[j]] == 2: trimmed += 2
            elif freq[nums[j]] > 2: trimmed += 1
            dp[i] = min(dp[i], dp[j] + trimmed + k)
    return dp[n]`,
    javascript: `function minCost(nums, k) {
  const n = nums.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    const freq = new Map();
    let trimmed = 0;
    for (let j = i - 1; j >= 0; j--) {
      const c = (freq.get(nums[j]) || 0) + 1;
      freq.set(nums[j], c);
      if (c === 2) trimmed += 2;
      else if (c > 2) trimmed += 1;
      dp[i] = Math.min(dp[i], dp[j] + trimmed + k);
    }
  }
  return dp[n];
}`,
    java: `public int minCost(int[] nums, int k) {
    int n = nums.length;
    int[] dp = new int[n+1];
    Arrays.fill(dp, Integer.MAX_VALUE/2);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        Map<Integer,Integer> freq = new HashMap<>();
        int trimmed = 0;
        for (int j = i-1; j >= 0; j--) {
            int c = freq.merge(nums[j], 1, Integer::sum);
            if (c == 2) trimmed += 2;
            else if (c > 2) trimmed++;
            dp[i] = Math.min(dp[i], dp[j] + trimmed + k);
        }
    }
    return dp[n];
}`,
  },
  defaultInput: { nums: [1, 2, 1, 2, 1, 3, 3], k: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 1, 3, 3],
      placeholder: '1,2,1,2,1,3,3',
      helperText: 'Array to split into subarrays',
    },
    {
      name: 'k',
      label: 'Split Cost (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Fixed cost added for each subarray created',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    const INF = 999999;
    const dp: number[] = new Array(n + 1).fill(INF);
    dp[0] = 0;
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`);

    function makeViz(activeIdx: number): DPVisualization {
      const vals: (number | null)[] = dp.map(v => v === INF ? null : v);
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] !== INF && dp[i] > 0) highlights[i] = 'found';
        else if (dp[i] === 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: vals, highlights, labels };
    }

    steps.push({
      line: 2,
      explanation: `n=${n}, k=${k}. dp[0]=0, all others=Infinity. dp[i] = min cost to split nums[0..i-1].`,
      variables: { n, k },
      visualization: makeViz(0),
    });

    for (let i = 1; i <= n; i++) {
      const freq = new Map<number, number>();
      let trimmed = 0;

      for (let j = i - 1; j >= 0; j--) {
        const c = (freq.get(nums[j]) || 0) + 1;
        freq.set(nums[j], c);
        if (c === 2) trimmed += 2;
        else if (c > 2) trimmed += 1;

        const candidate = dp[j] + trimmed + k;
        if (candidate < dp[i]) dp[i] = candidate;
      }

      steps.push({
        line: 6,
        explanation: `dp[${i}]=${dp[i]}. Best split ending at index ${i}: trimmed cost + k for subarray.`,
        variables: { i, 'dp[i]': dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 9,
      explanation: `Answer = dp[${n}] = ${dp[n]}. Minimum cost to split the entire array.`,
      variables: { result: dp[n] },
      visualization: makeViz(n),
    });

    return steps;
  },
};

export default minimumCostToSplitArray;
