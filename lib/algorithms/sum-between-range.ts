import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const sumBetweenRange: AlgorithmDefinition = {
  id: 'sum-between-range',
  title: 'Sum Between Range (Range Sum Query)',
  leetcodeNumber: 303,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Given an integer array, answer multiple range sum queries efficiently. Build a prefix sum array where prefix[i] = sum of nums[0..i-1]. Then sumRange(left, right) = prefix[right+1] - prefix[left]. O(n) precomputation, O(1) per query.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function buildPrefixSum(nums):
  prefix = array of size n+1, all zeros
  for i from 0 to n-1:
    prefix[i+1] = prefix[i] + nums[i]
  return prefix

function sumRange(prefix, left, right):
  return prefix[right+1] - prefix[left]`,
    python: `class NumArray:
    def __init__(self, nums):
        self.prefix = [0] * (len(nums) + 1)
        for i in range(len(nums)):
            self.prefix[i + 1] = self.prefix[i] + nums[i]

    def sumRange(self, left, right):
        return self.prefix[right + 1] - self.prefix[left]`,
    javascript: `class NumArray {
  constructor(nums) {
    this.prefix = new Array(nums.length + 1).fill(0);
    for (let i = 0; i < nums.length; i++) {
      this.prefix[i + 1] = this.prefix[i] + nums[i];
    }
  }

  sumRange(left, right) {
    return this.prefix[right + 1] - this.prefix[left];
  }
}`,
    java: `class NumArray {
    private int[] prefix;

    public NumArray(int[] nums) {
        prefix = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) {
            prefix[i + 1] = prefix[i] + nums[i];
        }
    }

    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
  },
  defaultInput: { nums: [-2, 0, 3, -5, 2, -1], queries: [[0, 2], [2, 5], [0, 5]] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [-2, 0, 3, -5, 2, -1],
      placeholder: '-2,0,3,-5,2,-1',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'queries',
      label: 'Queries',
      type: 'array',
      defaultValue: [[0, 2], [2, 5], [0, 5]],
      placeholder: '[[0,2],[2,5],[0,5]]',
      helperText: 'Array of [left, right] query pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const queries = input.queries as number[][];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    // Build prefix sum
    const prefix: (number | null)[] = new Array(n + 1).fill(null);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => `p[${i}]`);

    const makeDPViz = (
      activeIdx: number | null,
      comparingIndices: number[],
      computedUpTo: number,
    ): DPVisualization => {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= computedUpTo; i++) {
        if (prefix[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: prefix.slice(), highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Build prefix sum for nums = [${nums.join(', ')}]. prefix has ${n + 1} elements.`,
      variables: { nums, n },
      visualization: makeDPViz(null, [], -1),
    });

    prefix[0] = 0;
    steps.push({
      line: 2,
      explanation: `prefix[0] = 0 (empty sum base case).`,
      variables: { 'prefix[0]': 0 },
      visualization: makeDPViz(0, [], 0),
    });

    for (let i = 0; i < n; i++) {
      prefix[i + 1] = (prefix[i] as number) + nums[i];

      steps.push({
        line: 4,
        explanation: `prefix[${i + 1}] = prefix[${i}](${prefix[i]}) + nums[${i}](${nums[i]}) = ${prefix[i + 1]}.`,
        variables: { i, 'prefix[i]': prefix[i], 'nums[i]': nums[i], 'prefix[i+1]': prefix[i + 1] },
        visualization: makeDPViz(i + 1, [i], i + 1),
      });
    }

    steps.push({
      line: 5,
      explanation: `Prefix sum complete: [${prefix.join(', ')}]. Now answer queries.`,
      variables: { prefix: [...prefix] },
      visualization: makeDPViz(null, [], n),
    });

    // Process queries
    for (let q = 0; q < queries.length; q++) {
      const [left, right] = queries[q];
      const result = (prefix[right + 1] as number) - (prefix[left] as number);

      steps.push({
        line: 7,
        explanation: `Query [${left}, ${right}]: sumRange = prefix[${right + 1}](${prefix[right + 1]}) - prefix[${left}](${prefix[left]}) = ${result}.`,
        variables: { left, right, 'prefix[right+1]': prefix[right + 1], 'prefix[left]': prefix[left], result },
        visualization: (() => {
          const highlights: Record<number, string> = {};
          for (let i = 0; i <= n; i++) highlights[i] = 'found';
          highlights[left] = 'comparing';
          highlights[right + 1] = 'comparing';
          return {
            type: 'dp-table' as const,
            values: prefix.slice(),
            highlights,
            labels,
          };
        })(),
      });
    }

    // Final summary
    const results = queries.map(([l, r]) => (prefix[r + 1] as number) - (prefix[l] as number));
    steps.push({
      line: 7,
      explanation: `All queries answered: ${queries.map(([l, r], i) => `sumRange(${l},${r})=${results[i]}`).join(', ')}.`,
      variables: { results },
      visualization: (() => {
        const highlights: Record<number, string> = {};
        for (let i = 0; i <= n; i++) highlights[i] = 'found';
        return {
          type: 'dp-table' as const,
          values: prefix.slice(),
          highlights,
          labels,
        };
      })(),
    });

    return steps;
  },
};

export default sumBetweenRange;
