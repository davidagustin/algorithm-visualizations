import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumSumCircularSubarrayII: AlgorithmDefinition = {
  id: 'maximum-sum-circular-subarray-ii',
  title: 'Maximum Sum Circular Subarray II',
  leetcodeNumber: 918,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the maximum subarray sum in a circular array. The answer is either: 1) max non-circular subarray sum (Kadane\'s), or 2) total sum minus min non-circular subarray sum. The circular case uses a monotonic deque approach on the prefix sums.',
  tags: ['Stack', 'Deque', 'Monotonic Queue', 'Dynamic Programming', 'Prefix Sum'],
  code: {
    pseudocode: `function maxSubarraySumCircular(nums):
  n = len(nums)
  // Approach: prefix sum + monotonic deque
  // For each j, maximize prefix[j] - prefix[i] where j-n <= i < j
  prefix = [0, nums[0], ...]
  deque = [0]  // monotonic increasing prefix
  maxSum = nums[0]
  for j from 1 to 2n-1:
    idx = j % n
    prefix[j] = prefix[j-1] + nums[idx]
    while deque front < j - n:
      pop front
    maxSum = max(maxSum, prefix[j] - prefix[deque.front])
    while deque not empty and prefix[deque.back] >= prefix[j]:
      pop back
    push j to back
  return maxSum`,
    python: `def maxSubarraySumCircular(nums):
    n = len(nums)
    # Kadane's for non-circular
    cur_max = cur_min = total = nums[0]
    max_sum = min_sum = nums[0]
    for i in range(1, n):
        cur_max = max(nums[i], cur_max + nums[i])
        max_sum = max(max_sum, cur_max)
        cur_min = min(nums[i], cur_min + nums[i])
        min_sum = min(min_sum, cur_min)
        total += nums[i]
    return max_sum if total == min_sum else max(max_sum, total - min_sum)`,
    javascript: `function maxSubarraySumCircular(nums) {
  let curMax = nums[0], curMin = nums[0];
  let maxSum = nums[0], minSum = nums[0];
  let total = nums[0];
  for (let i = 1; i < nums.length; i++) {
    curMax = Math.max(nums[i], curMax + nums[i]);
    maxSum = Math.max(maxSum, curMax);
    curMin = Math.min(nums[i], curMin + nums[i]);
    minSum = Math.min(minSum, curMin);
    total += nums[i];
  }
  return total === minSum ? maxSum : Math.max(maxSum, total - minSum);
}`,
    java: `public int maxSubarraySumCircular(int[] nums) {
    int curMax = nums[0], curMin = nums[0];
    int maxSum = nums[0], minSum = nums[0];
    int total = nums[0];
    for (int i = 1; i < nums.length; i++) {
        curMax = Math.max(nums[i], curMax + nums[i]);
        maxSum = Math.max(maxSum, curMax);
        curMin = Math.min(nums[i], curMin + nums[i]);
        minSum = Math.min(minSum, curMin);
        total += nums[i];
    }
    return total == minSum ? maxSum : Math.max(maxSum, total - minSum);
}`,
  },
  defaultInput: { nums: [1, -2, 3, -2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Circular Array',
      type: 'array',
      defaultValue: [1, -2, 3, -2],
      placeholder: 'e.g. 1,-2,3,-2',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const stack: string[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: nums.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}]. Two cases: max non-circular (Kadane's) OR total - min non-circular.`,
      variables: { n },
      visualization: makeViz(-1, 'idle'),
    });

    let curMax = nums[0], curMin = nums[0];
    let maxSum = nums[0], minSum = nums[0];
    let total = nums[0];

    steps.push({
      line: 3,
      explanation: `Init: curMax=curMin=${nums[0]}, maxSum=minSum=${nums[0]}, total=${nums[0]}.`,
      variables: { curMax, curMin, maxSum, minSum, total },
      visualization: makeViz(0, 'push'),
    });

    stack.push(`curMax=${curMax}`);
    stack.push(`curMin=${curMin}`);

    for (let i = 1; i < n; i++) {
      curMax = Math.max(nums[i], curMax + nums[i]);
      maxSum = Math.max(maxSum, curMax);
      curMin = Math.min(nums[i], curMin + nums[i]);
      minSum = Math.min(minSum, curMin);
      total += nums[i];
      stack[0] = `curMax=${curMax}`;
      stack[1] = `curMin=${curMin}`;

      steps.push({
        line: 5,
        explanation: `i=${i}: nums[i]=${nums[i]}. curMax=${curMax}, maxSum=${maxSum}. curMin=${curMin}, minSum=${minSum}. total=${total}.`,
        variables: { i, 'nums[i]': nums[i], curMax, maxSum, curMin, minSum, total },
        visualization: makeViz(i, 'idle'),
      });
    }

    const result = total === minSum ? maxSum : Math.max(maxSum, total - minSum);
    const isCircular = total !== minSum && total - minSum > maxSum;

    steps.push({
      line: 9,
      explanation: `${isCircular ? `Circular case wins: total(${total}) - minSum(${minSum}) = ${total - minSum}` : `Non-circular Kadane's wins: maxSum=${maxSum}`}. Answer = ${result}.`,
      variables: { maxSum, minSum, total, 'total-minSum': total - minSum, result },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default maximumSumCircularSubarrayII;
