import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const pattern132: AlgorithmDefinition = {
  id: '132-pattern',
  title: '132 Pattern',
  leetcodeNumber: 456,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array of integers, find if there is a 132 pattern: indices i < j < k such that nums[i] < nums[k] < nums[j]. Use a monotonic stack traversing from right to left. Maintain a variable "third" representing the largest nums[k] seen so far. When the stack top is popped (because current is larger), it becomes the best "third". If we find nums[i] < third, we have the pattern.',
  tags: ['stack', 'monotonic stack', 'array'],

  code: {
    pseudocode: `function find132pattern(nums):
  n = len(nums)
  stack = []
  third = -infinity  // best candidate for nums[k] (132 middle-small)
  for i from n-1 to 0:
    if nums[i] < third:
      return true  // nums[i] is the "1" in 132
    while stack and stack.top() < nums[i]:
      third = stack.pop()  // best "3" found, third is the "2"
    stack.push(nums[i])
  return false`,

    python: `def find132pattern(nums: list[int]) -> bool:
    n = len(nums)
    stack = []
    third = float('-inf')  # the "2" in 132
    for i in range(n - 1, -1, -1):
        if nums[i] < third:
            return True
        while stack and stack[-1] < nums[i]:
            third = stack.pop()
        stack.append(nums[i])
    return False`,

    javascript: `function find132pattern(nums) {
  const stack = [];
  let third = -Infinity;
  for (let i = nums.length - 1; i >= 0; i--) {
    if (nums[i] < third) return true;
    while (stack.length && stack[stack.length - 1] < nums[i]) {
      third = stack.pop();
    }
    stack.push(nums[i]);
  }
  return false;
}`,

    java: `public boolean find132pattern(int[] nums) {
    Deque<Integer> stack = new ArrayDeque<>();
    int third = Integer.MIN_VALUE;
    for (int i = nums.length - 1; i >= 0; i--) {
        if (nums[i] < third) return true;
        while (!stack.isEmpty() && stack.peek() < nums[i]) {
            third = stack.pop();
        }
        stack.push(nums[i]);
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [3, 1, 4, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 1, 4, 2],
      placeholder: '3,1,4,2',
      helperText: 'Array of integers to find 132 pattern',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const stack: number[] = [];
    let third = -Infinity;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: nums.map(String),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Find 132 pattern in [${nums.join(', ')}]. Traverse right-to-left. "third" tracks the best "2" in 132 pattern.`,
      variables: { nums: [...nums], stack: [], third: '-inf' },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = n - 1; i >= 0; i--) {
      const val = nums[i];

      steps.push({
        line: 5,
        explanation: `Index ${i}, value ${val}. Check if ${val} < third (${third === -Infinity ? '-inf' : third}).`,
        variables: { i, val, third: third === -Infinity ? '-inf' : third },
        visualization: makeViz(i, 'idle'),
      });

      if (val < third) {
        steps.push({
          line: 6,
          explanation: `nums[${i}]=${val} < third=${third}. Found 132 pattern! nums[i]=${val} is the "1", third=${third} is the "2", and some previous element is the "3".`,
          variables: { i, val, third, result: true },
          visualization: makeViz(i, 'match'),
        });
        steps.push({
          line: 7,
          explanation: `Return true. 132 pattern exists.`,
          variables: { result: true },
          visualization: makeViz(i, 'match'),
        });
        return steps;
      }

      while (stack.length > 0 && stack[stack.length - 1] < val) {
        third = stack.pop()!;
        steps.push({
          line: 8,
          explanation: `Stack top ${third} < nums[${i}]=${val}. Pop it as new "third" (best candidate for "2" in 132). third = ${third}.`,
          variables: { popped: third, val, newThird: third },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(val);
      steps.push({
        line: 9,
        explanation: `Push nums[${i}]=${val} onto stack as a potential "3" (largest element in 132).`,
        variables: { i, val, stack: [...stack], third: third === -Infinity ? '-inf' : third },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 10,
      explanation: `Traversal complete. No 132 pattern found. Return false.`,
      variables: { result: false },
      visualization: makeViz(-1, 'mismatch'),
    });

    return steps;
  },
};

export default pattern132;
