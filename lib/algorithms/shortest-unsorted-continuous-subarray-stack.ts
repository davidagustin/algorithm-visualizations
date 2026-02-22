import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const shortestUnsortedContinuousSubarrayStack: AlgorithmDefinition = {
  id: 'shortest-unsorted-continuous-subarray-stack',
  title: 'Shortest Unsorted Continuous Subarray (Stack)',
  leetcodeNumber: 581,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the length of the shortest contiguous subarray that, if sorted, makes the whole array sorted. Use two monotonic stacks: scan left to right with an increasing stack to find the leftmost out-of-order index, then scan right to left with a decreasing stack to find the rightmost out-of-order index.',
  tags: ['stack', 'monotonic stack', 'array', 'sorting'],

  code: {
    pseudocode: `function findUnsortedSubarray(nums):
  stack = []
  left = n    // rightmost index where disorder starts from left
  for i = 0 to n-1:
    while stack not empty and nums[stack.top] > nums[i]:
      left = min(left, stack.pop())
    stack.push(i)
  stack = []
  right = -1  // leftmost index where disorder ends from right
  for i = n-1 to 0:
    while stack not empty and nums[stack.top] < nums[i]:
      right = max(right, stack.pop())
    stack.push(i)
  return 0 if right == -1 else right - left + 1`,

    python: `def findUnsortedSubarray(nums: list[int]) -> int:
    n = len(nums)
    stack = []
    left = n
    for i in range(n):
        while stack and nums[stack[-1]] > nums[i]:
            left = min(left, stack.pop())
        stack.append(i)
    stack = []
    right = -1
    for i in range(n - 1, -1, -1):
        while stack and nums[stack[-1]] < nums[i]:
            right = max(right, stack.pop())
        stack.append(i)
    return 0 if right == -1 else right - left + 1`,

    javascript: `function findUnsortedSubarray(nums) {
  const n = nums.length;
  let stack = [], left = n;
  for (let i = 0; i < n; i++) {
    while (stack.length && nums[stack.at(-1)] > nums[i])
      left = Math.min(left, stack.pop());
    stack.push(i);
  }
  stack = [];
  let right = -1;
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && nums[stack.at(-1)] < nums[i])
      right = Math.max(right, stack.pop());
    stack.push(i);
  }
  return right === -1 ? 0 : right - left + 1;
}`,

    java: `public int findUnsortedSubarray(int[] nums) {
    int n = nums.length;
    Deque<Integer> stack = new ArrayDeque<>();
    int left = n;
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] > nums[i])
            left = Math.min(left, stack.pop());
        stack.push(i);
    }
    stack.clear();
    int right = -1;
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i])
            right = Math.max(right, stack.pop());
        stack.push(i);
    }
    return right == -1 ? 0 : right - left + 1;
}`,
  },

  defaultInput: {
    nums: [2, 6, 4, 8, 10, 9, 15],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 6, 4, 8, 10, 9, 15],
      placeholder: '2,6,4,8,10,9,15',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    let stack: number[] = [];
    let left = n;
    let right = -1;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `[${i}]=${nums[i]}`),
      inputChars: nums.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums = [${nums.join(', ')}]. Left pass with increasing stack to find leftmost disorder.`,
      variables: { nums: [...nums], left: n, right: -1 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] > nums[i]) {
        const popped = stack.pop()!;
        left = Math.min(left, popped);
        steps.push({
          line: 4,
          explanation: `nums[${popped}]=${nums[popped]} > nums[${i}]=${nums[i]}: out-of-order. Pop ${popped}. left = min(${left}, ${popped}) = ${left}.`,
          variables: { i, popped, left, value: nums[i] },
          visualization: makeViz(i, 'pop'),
        });
      }
      stack.push(i);
      steps.push({
        line: 5,
        explanation: `Push index ${i} (val=${nums[i]}). Stack = [${stack.map(s => nums[s]).join(', ')}].`,
        variables: { i, left },
        visualization: makeViz(i, 'push'),
      });
    }

    stack = [];

    steps.push({
      line: 7,
      explanation: `Left pass complete. left = ${left}. Now right pass with decreasing stack.`,
      variables: { left, right },
      visualization: makeViz(n - 1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
        const popped = stack.pop()!;
        right = Math.max(right, popped);
        steps.push({
          line: 10,
          explanation: `nums[${popped}]=${nums[popped]} < nums[${i}]=${nums[i]}: out-of-order. Pop ${popped}. right = max(${right}, ${popped}) = ${right}.`,
          variables: { i, popped, right, value: nums[i] },
          visualization: makeViz(i, 'pop'),
        });
      }
      stack.push(i);
    }

    const result = right === -1 ? 0 : right - left + 1;
    steps.push({
      line: 12,
      explanation: `left = ${left}, right = ${right}. Length of shortest unsorted subarray = ${result === 0 ? '0 (already sorted)' : `${right} - ${left} + 1 = ${result}`}.`,
      variables: { left, right, result },
      visualization: makeViz(0, 'match'),
    });

    return steps;
  },
};

export default shortestUnsortedContinuousSubarrayStack;
