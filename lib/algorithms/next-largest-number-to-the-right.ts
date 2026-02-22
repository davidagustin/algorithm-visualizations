import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextLargestNumberToTheRight: AlgorithmDefinition = {
  id: 'next-largest-number-to-the-right',
  title: 'Next Largest Number to the Right',
  leetcodeNumber: 496,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'For each element in an array, find the next greater element to its right. We use a monotonic decreasing stack: iterate from right to left, popping smaller elements from the stack until we find a larger one or the stack is empty.',
  tags: ['Stack', 'Array', 'Monotonic Stack'],
  code: {
    pseudocode: `function nextGreaterElements(nums):
  n = length of nums
  result = array of size n, filled with -1
  stack = []
  for i from n-1 down to 0:
    while stack not empty and stack.top <= nums[i]:
      pop from stack
    if stack not empty:
      result[i] = stack.top
    push nums[i] onto stack
  return result`,
    python: `def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and stack[-1] <= nums[i]:
            stack.pop()
        if stack:
            result[i] = stack[-1]
        stack.append(nums[i])
    return result`,
    javascript: `function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && stack[stack.length - 1] <= nums[i]) {
      stack.pop();
    }
    if (stack.length) {
      result[i] = stack[stack.length - 1];
    }
    stack.push(nums[i]);
  }
  return result;
}`,
    java: `public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = n - 1; i >= 0; i--) {
        while (!stack.isEmpty() && stack.peek() <= nums[i]) {
            stack.pop();
        }
        if (!stack.isEmpty()) {
            result[i] = stack.peek();
        }
        stack.push(nums[i]);
    }
    return result;
}`,
  },
  defaultInput: { nums: [2, 1, 2, 4, 3] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 2, 4, 3],
      placeholder: 'e.g. 2,1,2,4,3',
      helperText: 'Comma-separated numbers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const result: number[] = new Array(n).fill(-1);
    const stack: number[] = [];

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (result[i] !== -1) {
          highlights[i] = 'found';
          labels[i] = `->${result[i]}`;
        } else if (i === activeIdx) {
          highlights[i] = 'active';
          labels[i] = 'curr';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: nums,
        highlights,
        labels,
        auxData: {
          label: 'Stack & Result',
          entries: [
            { key: 'Stack (top first)', value: stack.length > 0 ? [...stack].reverse().join(', ') : 'empty' },
            { key: 'Result', value: `[${result.join(', ')}]` },
          ],
        },
      };
    }

    // Initialize
    steps.push({
      line: 1,
      explanation: `Initialize result array with -1 and empty stack. Process from right to left.`,
      variables: { nums, result: [...result] },
      visualization: makeViz(null),
    });

    // Iterate right to left
    for (let i = n - 1; i >= 0; i--) {
      steps.push({
        line: 5,
        explanation: `Processing nums[${i}] = ${nums[i]}. Check stack for next greater element.`,
        variables: { i, 'nums[i]': nums[i], stack: [...stack] },
        visualization: makeViz(i),
      });

      // Pop smaller or equal elements
      let popped = false;
      while (stack.length > 0 && stack[stack.length - 1] <= nums[i]) {
        const removed = stack.pop()!;
        popped = true;
        steps.push({
          line: 6,
          explanation: `Stack top ${removed} <= ${nums[i]}. Pop it. ${stack.length > 0 ? `Next stack top: ${stack[stack.length - 1]}.` : 'Stack is now empty.'}`,
          variables: { i, popped: removed, stack: [...stack] },
          visualization: makeViz(i),
        });
      }

      if (!popped && stack.length > 0) {
        // No popping needed
      }

      if (stack.length > 0) {
        result[i] = stack[stack.length - 1];
        steps.push({
          line: 8,
          explanation: `Stack top ${stack[stack.length - 1]} > ${nums[i]}. So next greater element for ${nums[i]} is ${stack[stack.length - 1]}.`,
          variables: { i, 'result[i]': result[i], stack: [...stack] },
          visualization: makeViz(i),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Stack is empty. No greater element to the right of ${nums[i]}. result[${i}] stays -1.`,
          variables: { i, 'result[i]': -1, stack: [] },
          visualization: makeViz(i),
        });
      }

      // Push current element
      stack.push(nums[i]);
      steps.push({
        line: 9,
        explanation: `Push ${nums[i]} onto stack.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i),
      });
    }

    // Final result
    steps.push({
      line: 10,
      explanation: `Done! Result: [${result.join(', ')}]. Each value shows the next greater element to the right, or -1 if none exists.`,
      variables: { result: [...result] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          h[i] = 'found';
          l[i] = `->${result[i]}`;
        }
        return {
          type: 'array' as const,
          array: nums,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Result',
            entries: [{ key: 'Result', value: `[${result.join(', ')}]` }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default nextLargestNumberToTheRight;
