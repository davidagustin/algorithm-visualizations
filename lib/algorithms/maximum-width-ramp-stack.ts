import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maximumWidthRampStack: AlgorithmDefinition = {
  id: 'maximum-width-ramp-stack',
  title: 'Maximum Width Ramp (Stack)',
  leetcodeNumber: 962,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the maximum width of a ramp (i, j) where i < j and nums[i] <= nums[j]. Build a monotonic decreasing stack of candidate left indices, then scan right-to-left trying to match each element with the largest valid left index.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Two Pointers'],
  code: {
    pseudocode: `function maxWidthRamp(nums):
  n = len(nums)
  // Build monotonic decreasing stack (left candidates)
  stack = []
  for i from 0 to n-1:
    if stack empty or nums[stack.top] > nums[i]:
      stack.push(i)
  // Scan from right, try to extend ramp
  maxWidth = 0
  for j from n-1 down to 0:
    while stack not empty and nums[stack.top] <= nums[j]:
      maxWidth = max(maxWidth, j - stack.pop())
  return maxWidth`,
    python: `def maxWidthRamp(nums):
    n = len(nums)
    stack = []
    for i in range(n):
        if not stack or nums[stack[-1]] > nums[i]:
            stack.append(i)
    max_width = 0
    for j in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] <= nums[j]:
            max_width = max(max_width, j - stack.pop())
    return max_width`,
    javascript: `function maxWidthRamp(nums) {
  const n = nums.length;
  const stack = [];
  for (let i = 0; i < n; i++) {
    if (!stack.length || nums[stack[stack.length-1]] > nums[i])
      stack.push(i);
  }
  let maxWidth = 0;
  for (let j = n - 1; j >= 0; j--) {
    while (stack.length && nums[stack[stack.length-1]] <= nums[j]) {
      maxWidth = Math.max(maxWidth, j - stack.pop());
    }
  }
  return maxWidth;
}`,
    java: `public int maxWidthRamp(int[] nums) {
    int n = nums.length;
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++)
        if (stack.isEmpty() || nums[stack.peek()] > nums[i])
            stack.push(i);
    int maxWidth = 0;
    for (int j = n - 1; j >= 0; j--)
        while (!stack.isEmpty() && nums[stack.peek()] <= nums[j])
            maxWidth = Math.max(maxWidth, j - stack.pop());
    return maxWidth;
}`,
  },
  defaultInput: { nums: [6, 0, 8, 2, 1, 5] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [6, 0, 8, 2, 1, 5],
      placeholder: 'e.g. 6,0,8,2,1,5',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    let maxWidth = 0;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(${nums[idx]})`),
      inputChars: nums.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}]. Phase 1: Build monotonic decreasing stack of candidate left indices.`,
      variables: { nums: [...nums] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      if (stack.length === 0 || nums[stack[stack.length - 1]] > nums[i]) {
        stack.push(i);
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} < stack top. Push index ${i} as potential left bound.`,
          variables: { i, val: nums[i], stack: [...stack] },
          visualization: makeViz(i, 'push'),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} >= stack top ${nums[stack[stack.length - 1]]}. Skip (not a new minimum, cannot extend ramp).`,
          variables: { i, val: nums[i] },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Phase 2: Scan right-to-left. For each j, pop left candidates that form valid ramps.`,
      variables: { stack: [...stack] },
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let j = n - 1; j >= 0; j--) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] <= nums[j]) {
        const leftIdx = stack.pop()!;
        const width = j - leftIdx;
        maxWidth = Math.max(maxWidth, width);

        steps.push({
          line: 10,
          explanation: `nums[${leftIdx}]=${nums[leftIdx]} <= nums[${j}]=${nums[j]}. Ramp width = ${j} - ${leftIdx} = ${width}. maxWidth = ${maxWidth}.`,
          variables: { leftIdx, j, width, maxWidth },
          visualization: makeViz(j, 'pop'),
        });
      }

      if (stack.length === 0) break; // Optimization: no more candidates
    }

    steps.push({
      line: 11,
      explanation: `Done. Maximum ramp width = ${maxWidth}.`,
      variables: { result: maxWidth },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default maximumWidthRampStack;
