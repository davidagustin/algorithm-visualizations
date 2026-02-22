import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const targetSum: AlgorithmDefinition = {
  id: 'target-sum',
  title: 'Target Sum',
  leetcodeNumber: 494,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    "Given an array of integers and a target, count the ways to assign '+' or '-' to each number so the expression evaluates to target. Uses a DP map: count[sum] = number of ways to reach that sum. Offset by total to handle negative indices.",
  tags: ['Dynamic Programming', 'Array', 'Backtracking'],
  code: {
    pseudocode: `function findTargetSumWays(nums, target):
  counts = {0: 1}  // map from sum to count of ways
  for each num in nums:
    next = {}
    for each sum, cnt in counts:
      next[sum + num] += cnt
      next[sum - num] += cnt
    counts = next
  return counts.get(target, 0)`,
    python: `def findTargetSumWays(nums, target):
    counts = {0: 1}
    for num in nums:
        next_counts = {}
        for s, cnt in counts.items():
            next_counts[s + num] = next_counts.get(s + num, 0) + cnt
            next_counts[s - num] = next_counts.get(s - num, 0) + cnt
        counts = next_counts
    return counts.get(target, 0)`,
    javascript: `function findTargetSumWays(nums, target) {
  let counts = new Map([[0, 1]]);
  for (const num of nums) {
    const next = new Map();
    for (const [s, cnt] of counts) {
      next.set(s+num, (next.get(s+num)||0) + cnt);
      next.set(s-num, (next.get(s-num)||0) + cnt);
    }
    counts = next;
  }
  return counts.get(target) || 0;
}`,
    java: `public int findTargetSumWays(int[] nums, int target) {
    Map<Integer, Integer> counts = new HashMap<>();
    counts.put(0, 1);
    for (int num : nums) {
        Map<Integer, Integer> next = new HashMap<>();
        for (Map.Entry<Integer, Integer> e : counts.entrySet()) {
            int s = e.getKey(), cnt = e.getValue();
            next.merge(s + num, cnt, Integer::sum);
            next.merge(s - num, cnt, Integer::sum);
        }
        counts = next;
    }
    return counts.getOrDefault(target, 0);
}`,
  },
  defaultInput: { nums: [1, 1, 1, 1, 1], target: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 1],
      placeholder: '1,1,1,1,1',
      helperText: 'Array of non-negative integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target sum value',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const total = nums.reduce((a, b) => a + b, 0);
    const offset = total;
    const size = 2 * total + 1;

    // Use array with offset to handle negative sums
    let counts: number[] = new Array(size).fill(0);
    counts[offset] = 1; // sum=0 has 1 way

    const makeLabels = (arr: number[]): string[] =>
      arr.map((_, i) => `sum=${i - offset}`);

    function makeViz(activeIndices: number[]): DPVisualization {
      const vals: (number | null)[] = counts.map(v => v === 0 ? null : v);
      const highlights: Record<number, string> = {};
      for (let i = 0; i < size; i++) {
        if (counts[i] > 0) highlights[i] = 'found';
      }
      for (const idx of activeIndices) {
        if (idx >= 0 && idx < size) highlights[idx] = 'active';
      }
      // highlight target
      const tIdx = target + offset;
      if (tIdx >= 0 && tIdx < size && counts[tIdx] > 0) highlights[tIdx] = 'current';
      return { type: 'dp-table', values: vals, highlights, labels: makeLabels(counts) };
    }

    steps.push({
      line: 1,
      explanation: `Target Sum: nums=[${nums.join(', ')}], target=${target}. Total possible range: [-${total}, +${total}]. dp[sum] = ways to reach that sum.`,
      variables: { nums, target, total },
      visualization: makeViz([offset]),
    });

    steps.push({
      line: 2,
      explanation: `Start with dp[0]=1. One way to reach sum=0 before processing any numbers.`,
      variables: { 'counts[0]': 1 },
      visualization: makeViz([offset]),
    });

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];
      const next: number[] = new Array(size).fill(0);
      const activeNew: number[] = [];

      steps.push({
        line: 3,
        explanation: `Processing nums[${ni}]=${num}. Each existing sum branches: add +${num} or -${num}.`,
        variables: { num, ni },
        visualization: makeViz([]),
      });

      for (let s = 0; s < size; s++) {
        if (counts[s] === 0) continue;
        const posIdx = s + num;
        const negIdx = s - num;
        if (posIdx < size) {
          next[posIdx] += counts[s];
          activeNew.push(posIdx);
        }
        if (negIdx >= 0) {
          next[negIdx] += counts[s];
          activeNew.push(negIdx);
        }
      }

      counts = next;

      const reachable = counts.map((v, i) => v > 0 ? `sum=${i - offset}:${v}` : '').filter(Boolean);
      steps.push({
        line: 4,
        explanation: `After nums[${ni}]=${num}: reachable sums = [${reachable.slice(0, 8).join(', ')}${reachable.length > 8 ? '...' : ''}].`,
        variables: { num },
        visualization: makeViz([...new Set(activeNew)]),
      });
    }

    const result = target + offset >= 0 && target + offset < size ? counts[target + offset] : 0;

    steps.push({
      line: 5,
      explanation: `counts[${target}] = ${result}. There are ${result} way(s) to assign +/- to reach target sum ${target}.`,
      variables: { result, target },
      visualization: makeViz([target + offset]),
    });

    return steps;
  },
};

export default targetSum;
