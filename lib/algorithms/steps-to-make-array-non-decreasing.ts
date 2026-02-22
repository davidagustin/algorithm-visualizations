import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const stepsToMakeArrayNonDecreasing: AlgorithmDefinition = {
  id: 'steps-to-make-array-non-decreasing',
  title: 'Steps to Make Array Non-Decreasing',
  leetcodeNumber: 2289,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an integer array, in one step remove all elements that are strictly less than the element immediately to their left. Return the number of steps until the array is non-decreasing. Use a monotonic stack where each entry tracks how many steps it takes for that element to "survive".',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Simulation'],
  code: {
    pseudocode: `function totalSteps(nums):
  stack = []  // (value, steps) pairs
  maxSteps = 0
  for each num in nums:
    steps = 0
    while stack and stack.top.val <= num:
      steps = max(steps, stack.pop().steps)
    if stack not empty:
      steps += 1
    maxSteps = max(maxSteps, steps)
    stack.push((num, steps))
  return maxSteps`,
    python: `def totalSteps(nums):
    stack = []  # (value, steps)
    max_steps = 0
    for num in nums:
        steps = 0
        while stack and stack[-1][0] <= num:
            steps = max(steps, stack.pop()[1])
        if stack:
            steps += 1
        max_steps = max(max_steps, steps)
        stack.append((num, steps))
    return max_steps`,
    javascript: `function totalSteps(nums) {
  const stack = []; // [value, steps]
  let maxSteps = 0;
  for (const num of nums) {
    let steps = 0;
    while (stack.length && stack[stack.length-1][0] <= num) {
      steps = Math.max(steps, stack.pop()[1]);
    }
    if (stack.length) steps++;
    maxSteps = Math.max(maxSteps, steps);
    stack.push([num, steps]);
  }
  return maxSteps;
}`,
    java: `public int totalSteps(int[] nums) {
    Deque<int[]> stack = new ArrayDeque<>();
    int maxSteps = 0;
    for (int num : nums) {
        int steps = 0;
        while (!stack.isEmpty() && stack.peek()[0] <= num)
            steps = Math.max(steps, stack.pop()[1]);
        if (!stack.isEmpty()) steps++;
        maxSteps = Math.max(maxSteps, steps);
        stack.push(new int[]{num, steps});
    }
    return maxSteps;
}`,
  },
  defaultInput: { nums: [5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 3, 4, 4, 7, 3, 6, 11, 8, 5, 11],
      placeholder: 'e.g. 5,3,4,4,7,3,6,11,8,5,11',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const stack: [number, number][] = []; // [value, steps]
    let maxSteps = 0;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(([v, s]) => `(${v},s=${s})`),
      inputChars: nums.map(n => String(n)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Initialize empty stack. Track (value, steps) for each element. Find max steps to non-decreasing.`,
      variables: { maxSteps: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];
      let s = 0;

      steps.push({
        line: 4,
        explanation: `Processing nums[${i}]=${num}. Start with steps=0.`,
        variables: { i, num, currentSteps: s },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && stack[stack.length - 1][0] <= num) {
        const [v, ps] = stack.pop()!;
        s = Math.max(s, ps);
        steps.push({
          line: 6,
          explanation: `Pop (${v}, steps=${ps}) because ${v} <= ${num}. Inherit steps=${s}.`,
          variables: { popped: v, poppedSteps: ps, currentSteps: s },
          visualization: makeViz(i, 'pop'),
        });
      }

      if (stack.length > 0) {
        s++;
        steps.push({
          line: 8,
          explanation: `Stack has larger element ${stack[stack.length - 1][0]}. Increment steps to ${s} (this element will be deleted).`,
          variables: { currentSteps: s },
          visualization: makeViz(i, 'mismatch'),
        });
      }

      maxSteps = Math.max(maxSteps, s);
      stack.push([num, s]);

      steps.push({
        line: 9,
        explanation: `Push (${num}, steps=${s}). maxSteps=${maxSteps}.`,
        variables: { num, steps: s, maxSteps },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Total steps to make array non-decreasing = ${maxSteps}.`,
      variables: { result: maxSteps },
      visualization: makeViz(nums.length - 1, 'match'),
    });

    return steps;
  },
};

export default stepsToMakeArrayNonDecreasing;
