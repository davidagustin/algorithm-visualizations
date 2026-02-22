import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumSubarrayMinProduct: AlgorithmDefinition = {
  id: 'maximum-subarray-min-product',
  title: 'Maximum Subarray Min-Product',
  leetcodeNumber: 1856,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'The min-product of an array is defined as the minimum value of the array multiplied by the sum of the array. Given an array of positive integers, find the maximum min-product of any non-empty subarray. Use a monotonic stack to find the previous and next smaller elements for each index, then compute the sum of the subarray where each element is the minimum.',
  tags: ['stack', 'monotonic stack', 'prefix sum', 'array'],

  code: {
    pseudocode: `function maxSumMinProduct(nums):
  MOD = 10^9 + 7
  n = len(nums)
  prefix = [0] * (n+1)
  for i in 0..n-1: prefix[i+1] = prefix[i] + nums[i]
  left = [-1] * n   // prev smaller index
  right = [n] * n   // next smaller index
  stack = []
  for i in 0..n-1:
    while stack and nums[stack.top()] >= nums[i]:
      right[stack.pop()] = i
    if stack: left[i] = stack.top()
    stack.push(i)
  ans = 0
  for i in 0..n-1:
    subSum = prefix[right[i]] - prefix[left[i]+1]
    ans = max(ans, nums[i] * subSum)
  return ans % MOD`,

    python: `def maxSumMinProduct(nums):
    MOD = 10**9 + 7
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + nums[i]
    left = [-1] * n
    right = [n] * n
    stack = []
    for i in range(n):
        while stack and nums[stack[-1]] >= nums[i]:
            right[stack.pop()] = i
        if stack:
            left[i] = stack[-1]
        stack.append(i)
    ans = 0
    for i in range(n):
        s = prefix[right[i]] - prefix[left[i]+1]
        ans = max(ans, nums[i] * s)
    return ans % MOD`,

    javascript: `function maxSumMinProduct(nums) {
  const MOD = 1e9 + 7;
  const n = nums.length;
  const prefix = new Array(n + 1).fill(0);
  for (let i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
  const left = new Array(n).fill(-1);
  const right = new Array(n).fill(n);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack.at(-1)] >= nums[i]) {
      right[stack.pop()] = i;
    }
    if (stack.length) left[i] = stack.at(-1);
    stack.push(i);
  }
  let ans = 0;
  for (let i = 0; i < n; i++) {
    const s = prefix[right[i]] - prefix[left[i]+1];
    ans = Math.max(ans, nums[i] * s);
  }
  return ans % MOD;
}`,

    java: `public int maxSumMinProduct(int[] nums) {
    long MOD = 1_000_000_007L;
    int n = nums.length;
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) prefix[i+1] = prefix[i] + nums[i];
    int[] left = new int[n], right = new int[n];
    Arrays.fill(left, -1); Arrays.fill(right, n);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] >= nums[i])
            right[stack.pop()] = i;
        if (!stack.isEmpty()) left[i] = stack.peek();
        stack.push(i);
    }
    long ans = 0;
    for (int i = 0; i < n; i++) {
        long s = prefix[right[i]] - prefix[left[i]+1];
        ans = Math.max(ans, nums[i] * s);
    }
    return (int)(ans % MOD);
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 2],
      placeholder: '1,2,3,2',
      helperText: 'Array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const stack: number[] = [];
    const left: number[] = new Array(n).fill(-1);
    const right: number[] = new Array(n).fill(n);

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `idx${i}(${nums[i]})`),
      inputChars: nums.map(String),
      currentIndex: idx,
      action,
    });

    // Build prefix sums
    const prefix: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefix[i + 1] = prefix[i] + nums[i];

    steps.push({
      line: 1,
      explanation: `Build prefix sums. prefix = [${prefix.join(', ')}]. Now use monotonic stack to find left/right smaller bounds for each element.`,
      variables: { prefix: [...prefix], left: [...left], right: [...right] },
      visualization: makeViz(-1, 'idle'),
    });

    // Monotonic stack pass
    for (let i = 0; i < n; i++) {
      steps.push({
        line: 9,
        explanation: `Processing index ${i} (value ${nums[i]}). Pop elements from stack that are >= nums[${i}].`,
        variables: { i, val: nums[i], stackTop: stack.length > 0 ? nums[stack[stack.length - 1]] : 'empty' },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && nums[stack[stack.length - 1]] >= nums[i]) {
        const j = stack.pop()!;
        right[j] = i;
        steps.push({
          line: 10,
          explanation: `nums[${j}]=${nums[j]} >= nums[${i}]=${nums[i]}. Set right[${j}] = ${i}. Pop ${j} from stack.`,
          variables: { j, rightJ: i, val: nums[j] },
          visualization: makeViz(i, 'pop'),
        });
      }

      if (stack.length > 0) {
        left[i] = stack[stack.length - 1];
        steps.push({
          line: 11,
          explanation: `Stack top is index ${left[i]} (value ${nums[left[i]]}). Set left[${i}] = ${left[i]}.`,
          variables: { i, leftI: left[i] },
          visualization: makeViz(i, 'idle'),
        });
      }

      stack.push(i);
      steps.push({
        line: 12,
        explanation: `Push index ${i} onto stack.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 13,
      explanation: `Bounds computed. left=[${left.join(',')}], right=[${right.join(',')}]. Now compute max min-product.`,
      variables: { left: [...left], right: [...right] },
      visualization: makeViz(-1, 'idle'),
    });

    let ans = 0;
    let bestIdx = 0;
    for (let i = 0; i < n; i++) {
      const subSum = prefix[right[i]] - prefix[left[i] + 1];
      const minProduct = nums[i] * subSum;
      if (minProduct > ans) {
        ans = minProduct;
        bestIdx = i;
      }
      steps.push({
        line: 15,
        explanation: `index ${i}: min=${nums[i]}, subarray sum from left[${i}]+1=${left[i]+1} to right[${i}]-1=${right[i]-1} = ${subSum}. minProduct = ${minProduct}.`,
        variables: { i, min: nums[i], subSum, minProduct, currentBest: ans },
        visualization: makeViz(i, minProduct === ans ? 'match' : 'idle'),
      });
    }

    steps.push({
      line: 16,
      explanation: `Maximum min-product = ${ans} (at index ${bestIdx}, min value ${nums[bestIdx]}).`,
      variables: { result: ans % (1e9 + 7) },
      visualization: makeViz(bestIdx, 'found'),
    });

    return steps;
  },
};

export default maximumSubarrayMinProduct;
