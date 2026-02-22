import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const sumOfSubarrayRanges: AlgorithmDefinition = {
  id: 'sum-of-subarray-ranges',
  title: 'Sum of Subarray Ranges',
  leetcodeNumber: 2104,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'The range of an array is the difference between its largest and smallest elements. Given an integer array, return the sum of all subarray ranges. This equals (sum of subarray maximums) minus (sum of subarray minimums). Use two monotonic stack passes to compute both sums efficiently.',
  tags: ['stack', 'monotonic stack', 'array', 'math'],

  code: {
    pseudocode: `function subArrayRanges(nums):
  return sumMaximums(nums) - sumMinimums(nums)

function sumMinimums(nums):
  // Monotonic increasing stack (same as LC 907)
  ...

function sumMaximums(nums):
  // Monotonic decreasing stack
  for each element from left to right:
    while stack top is smaller than current:
      pop and compute contribution
    push current
  return total`,

    python: `def subArrayRanges(nums: list[int]) -> int:
    def helper(sign):
        stack, total = [], 0
        nums_ext = [sign * float('inf')] + nums + [sign * float('inf')]
        for i, v in enumerate(nums_ext):
            while stack and sign * nums_ext[stack[-1]] > sign * v:
                mid = stack.pop()
                left = stack[-1]
                total += nums_ext[mid] * (mid - left) * (i - mid)
            stack.append(i)
        return total
    return helper(1) - helper(-1)`,

    javascript: `function subArrayRanges(nums) {
  const n = nums.length;
  let ans = 0;
  for (let i = 0; i < n; i++) {
    let lo = nums[i], hi = nums[i];
    for (let j = i; j < n; j++) {
      lo = Math.min(lo, nums[j]);
      hi = Math.max(hi, nums[j]);
      ans += hi - lo;
    }
  }
  return ans;
}`,

    java: `public long subArrayRanges(int[] nums) {
    int n = nums.length;
    long ans = 0;
    for (int i = 0; i < n; i++) {
        int lo = nums[i], hi = nums[i];
        for (int j = i; j < n; j++) {
            lo = Math.min(lo, nums[j]);
            hi = Math.max(hi, nums[j]);
            ans += hi - lo;
        }
    }
    return ans;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    let totalRange = 0;
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: nums.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums = [${nums.join(', ')}]. Enumerate all subarrays, computing range (max - min) for each.`,
      variables: { nums: [...nums], totalRange: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      let lo = nums[i];
      let hi = nums[i];
      stack.length = 0;
      stack.push(`i=${i}`);

      steps.push({
        line: 3,
        explanation: `Start subarray at index ${i} (value=${nums[i]}). lo=${lo}, hi=${hi}.`,
        variables: { i, lo, hi, totalRange },
        visualization: makeViz(i, 'idle'),
      });

      for (let j = i; j < n; j++) {
        lo = Math.min(lo, nums[j]);
        hi = Math.max(hi, nums[j]);
        const range = hi - lo;
        totalRange += range;
        stack.length = 0;
        stack.push(`[${i}..${j}]`, `lo=${lo}`, `hi=${hi}`, `rng=${range}`);

        steps.push({
          line: 5,
          explanation: `Subarray [${i}..${j}] = [${nums.slice(i, j + 1).join(', ')}]. lo=${lo}, hi=${hi}, range=${range}. Running total=${totalRange}.`,
          variables: { i, j, lo, hi, range, totalRange },
          visualization: makeViz(j, 'idle'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `All subarrays processed. Sum of ranges = ${totalRange}.`,
      variables: { result: totalRange },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default sumOfSubarrayRanges;
