import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextGreaterElementII: AlgorithmDefinition = {
  id: 'next-greater-element-ii',
  title: 'Next Greater Element II',
  leetcodeNumber: 503,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Find the next greater element for each element in a circular array. Iterate the array twice (2n) using modulo to simulate circularity. Use a monotonic decreasing stack of indices. When a greater element is found, pop and record the result.',
  tags: ['Stack', 'Array', 'Monotonic Stack'],
  code: {
    pseudocode: `function nextGreaterElements(nums):
  n = length of nums
  result = array of n, filled with -1
  stack = []  // indices
  for i from 0 to 2n-1:
    while stack not empty and nums[stack.top] < nums[i % n]:
      result[stack.pop()] = nums[i % n]
    if i < n: stack.push(i)
  return result`,
    python: `def nextGreaterElements(nums):
    n = len(nums)
    result = [-1] * n
    stack = []
    for i in range(2 * n):
        while stack and nums[stack[-1]] < nums[i % n]:
            result[stack.pop()] = nums[i % n]
        if i < n:
            stack.append(i)
    return result`,
    javascript: `function nextGreaterElements(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack = [];
  for (let i = 0; i < 2 * n; i++) {
    while (stack.length && nums[stack[stack.length - 1]] < nums[i % n]) {
      result[stack.pop()] = nums[i % n];
    }
    if (i < n) stack.push(i);
  }
  return result;
}`,
    java: `public int[] nextGreaterElements(int[] nums) {
    int n = nums.length;
    int[] result = new int[n];
    Arrays.fill(result, -1);
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < 2 * n; i++) {
        while (!stack.isEmpty() && nums[stack.peek()] < nums[i % n]) {
            result[stack.pop()] = nums[i % n];
        }
        if (i < n) stack.push(i);
    }
    return result;
}`,
  },
  defaultInput: { nums: [1, 2, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Circular Array',
      type: 'array',
      defaultValue: [1, 2, 1],
      placeholder: 'e.g. 1,2,1',
      helperText: 'Circular array of numbers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const result: number[] = new Array(n).fill(-1);
    const stack: number[] = [];

    function makeViz(i: number): ArrayVisualization {
      const actualIdx = i % n;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < n; k++) {
        if (result[k] !== -1) {
          highlights[k] = 'found';
          labels[k] = `->${result[k]}`;
        } else if (stack.includes(k)) {
          highlights[k] = 'active';
          labels[k] = 'stk';
        } else {
          highlights[k] = 'default';
        }
        if (k === actualIdx) {
          highlights[k] = 'current';
          labels[k] = (labels[k] ? labels[k] + ' ' : '') + (i >= n ? `i%n=${actualIdx}` : 'curr');
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
            { key: 'Pass', value: i < n ? '1st pass' : '2nd pass (circular)' },
            { key: 'i (mod n)', value: `${i} (idx=${actualIdx})` },
            { key: 'Stack', value: stack.length > 0 ? `[${stack.join(', ')}]` : 'empty' },
            { key: 'Result', value: `[${result.join(', ')}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize result=-1 and empty stack. Iterate 2n=${2 * n} times to simulate circular array.`,
      variables: { nums, result: [...result] },
      visualization: makeViz(0),
    });

    for (let i = 0; i < 2 * n; i++) {
      const actualIdx = i % n;
      const isSecondPass = i >= n;

      steps.push({
        line: 5,
        explanation: `i=${i} (${isSecondPass ? '2nd pass, ' : ''}actual index ${actualIdx}): nums[${actualIdx}]=${nums[actualIdx]}. Check stack for elements smaller.`,
        variables: { i, actualIdx, value: nums[actualIdx], stack: [...stack] },
        visualization: makeViz(i),
      });

      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[actualIdx]) {
        const poppedIdx = stack.pop()!;
        result[poppedIdx] = nums[actualIdx];
        steps.push({
          line: 6,
          explanation: `nums[${poppedIdx}]=${nums[poppedIdx]} < nums[${actualIdx}]=${nums[actualIdx]}. Pop idx ${poppedIdx}. result[${poppedIdx}]=${nums[actualIdx]}.`,
          variables: { poppedIdx, result: [...result], stack: [...stack] },
          visualization: makeViz(i),
        });
      }

      if (i < n) {
        stack.push(i);
        steps.push({
          line: 7,
          explanation: `1st pass: push index ${i} onto stack.`,
          variables: { i, stack: [...stack] },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done! Result: [${result.join(', ')}]. Any remaining -1 means no greater element exists in the circular array.`,
      variables: { result: [...result] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let k = 0; k < n; k++) {
          h[k] = result[k] !== -1 ? 'found' : 'visited';
          l[k] = `${result[k]}`;
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

export default nextGreaterElementII;
