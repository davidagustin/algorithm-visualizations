import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumWidthRamp: AlgorithmDefinition = {
  id: 'maximum-width-ramp',
  title: 'Maximum Width Ramp',
  leetcodeNumber: 962,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'A ramp in an integer array nums is a pair (i, j) where i < j and nums[i] <= nums[j]. The width of such a ramp is j - i. Find the maximum width. Build a decreasing stack of candidate left boundaries, then scan from right to find the furthest left boundary where nums[i] <= nums[j].',
  tags: ['stack', 'monotonic stack', 'array', 'greedy'],

  code: {
    pseudocode: `function maxWidthRamp(nums):
  n = len(nums)
  stack = []
  // Build decreasing stack of left candidates
  for i = 0 to n-1:
    if stack empty or nums[i] < nums[stack.top]:
      stack.push(i)
  maxW = 0
  // Scan from right, try to match with stack
  for j = n-1 to 0:
    while stack not empty and nums[stack.top] <= nums[j]:
      maxW = max(maxW, j - stack.top)
      stack.pop()
  return maxW`,

    python: `def maxWidthRamp(nums: list[int]) -> int:
    n = len(nums)
    stack = []
    for i in range(n):
        if not stack or nums[i] < nums[stack[-1]]:
            stack.append(i)
    max_w = 0
    for j in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[j]:
            max_w = max(max_w, j - stack[-1])
            stack.pop()
    return max_w`,

    javascript: `function maxWidthRamp(nums) {
  const n = nums.length;
  const stack = [];
  for (let i = 0; i < n; i++) {
    if (!stack.length || nums[i] < nums[stack.at(-1)]) stack.push(i);
  }
  let maxW = 0;
  for (let j = n - 1; j >= 0; j--) {
    while (stack.length && nums[stack.at(-1)] <= nums[j]) {
      maxW = Math.max(maxW, j - stack.pop());
    }
  }
  return maxW;
}`,

    java: `public int maxWidthRamp(int[] nums) {
    int n = nums.length;
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        if (stack.isEmpty() || nums[i] < nums[stack.peek()])
            stack.push(i);
    }
    int maxW = 0;
    for (int j = n - 1; j >= 0; j--) {
        while (!stack.isEmpty() && nums[stack.peek()] <= nums[j]) {
            maxW = Math.max(maxW, j - stack.pop());
        }
    }
    return maxW;
}`,
  },

  defaultInput: {
    nums: [6, 0, 8, 2, 1, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [6, 0, 8, 2, 1, 5],
      placeholder: '6,0,8,2,1,5',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let maxW = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `[${i}]=${nums[i]}`),
      inputChars: nums.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Build decreasing stack of candidate left indices from nums = [${nums.join(', ')}].`,
      variables: { nums: [...nums], stack: [], maxW: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      if (stack.length === 0 || nums[i] < nums[stack[stack.length - 1]]) {
        stack.push(i);
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} is smaller than stack top (or stack empty). Push index ${i}. Stack = [${stack.map(s => `${s}(${nums[s]})`).join(', ')}].`,
          variables: { i, value: nums[i], stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} >= stack top. Skip (not a valid left candidate).`,
          variables: { i, value: nums[i], stack: [...stack] },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Stack of left candidates built: [${stack.map(s => `${s}(${nums[s]})`).join(', ')}]. Now scan from right.`,
      variables: { stack: [...stack], maxW },
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let j = n - 1; j >= 0; j--) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[j]) {
        const i = stack.pop()!;
        const w = j - i;
        maxW = Math.max(maxW, w);
        steps.push({
          line: 10,
          explanation: `j=${j}(val=${nums[j]}), i=${i}(val=${nums[i]}): nums[i]<= nums[j], width=${w}. maxW = ${maxW}.`,
          variables: { j, i, width: w, maxW },
          visualization: makeViz(j, 'pop'),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Maximum width ramp = ${maxW}.`,
      variables: { result: maxW },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default maximumWidthRamp;
