import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeSumQueryImmutableII: AlgorithmDefinition = {
  id: 'range-sum-query-immutable-ii',
  title: 'Range Sum Query - Immutable II',
  leetcodeNumber: 303,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'Given an immutable integer array, handle multiple range sum queries efficiently. Precompute a prefix sum array so each query is answered in O(1) time. prefix[i] stores the sum of nums[0..i-1], and sumRange(left, right) = prefix[right+1] - prefix[left].',
  tags: ['Prefix Sum', 'Array', 'Design'],
  code: {
    pseudocode: `function NumArray(nums):
  n = length(nums)
  prefix = new array[n+1] filled with 0
  for i from 0 to n-1:
    prefix[i+1] = prefix[i] + nums[i]

function sumRange(left, right):
  return prefix[right+1] - prefix[left]`,
    python: `class NumArray:
    def __init__(self, nums: list[int]):
        self.prefix = [0] * (len(nums) + 1)
        for i, num in enumerate(nums):
            self.prefix[i + 1] = self.prefix[i] + num

    def sumRange(self, left: int, right: int) -> int:
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
        for (int i = 0; i < nums.length; i++)
            prefix[i + 1] = prefix[i] + nums[i];
    }
    public int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
}`,
  },
  defaultInput: { nums: [1, 3, 5, 7, 9], left: 1, right: 3 },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5, 7, 9],
      placeholder: '1,3,5,7,9',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'left',
      label: 'Left Index',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'right',
      label: 'Right Index',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const left = input.left as number;
    const right = input.right as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const prefix: number[] = new Array(n + 1).fill(0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize NumArray with nums = [${nums.join(', ')}]. Build prefix sum of size ${n + 1}.`,
      variables: { nums, n },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefix[i + 1] = prefix[i] + nums[i];
      steps.push({
        line: 4,
        explanation: `prefix[${i + 1}] = prefix[${i}](${prefix[i]}) + nums[${i}](${nums[i]}) = ${prefix[i + 1]}.`,
        variables: { i, 'prefix[i]': prefix[i], 'nums[i]': nums[i], 'prefix[i+1]': prefix[i + 1] },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `p=${prefix[i + 1]}` },
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `Query sumRange(${left}, ${right}): prefix[${right + 1}](${prefix[right + 1]}) - prefix[${left}](${prefix[left]}) = ${prefix[right + 1] - prefix[left]}.`,
      variables: { left, right, result: prefix[right + 1] - prefix[left] },
      visualization: makeViz(
        Object.fromEntries(
          Array.from({ length: right - left + 1 }, (_, i) => [left + i, 'found']),
        ),
        { [left]: 'L', [right]: 'R' },
      ),
    });

    return steps;
  },
};

export default rangeSumQueryImmutableII;
