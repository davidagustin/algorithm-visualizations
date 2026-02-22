import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const nextGreaterElementIV: AlgorithmDefinition = {
  id: 'next-greater-element-iv',
  title: 'Next Greater Element IV',
  leetcodeNumber: 2454,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'For each index i, find the second next greater element (the next greater element of the next greater element). Use two monotonic stacks: the first processes the array and the second tracks elements waiting for their second greater element.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Hard'],
  code: {
    pseudocode: `function secondGreaterElement(nums):
  n = len(nums)
  result = array of -1s
  stack1 = []  // first monotonic decreasing stack
  stack2 = []  // second stack: elements needing 2nd greater
  for i from 0 to n-1:
    // stack2 elements found their 2nd greater
    while stack2 and nums[stack2.top] < nums[i]:
      result[stack2.pop()] = nums[i]
    // tmp collects elements whose 1st greater = nums[i]
    tmp = []
    while stack1 and nums[stack1.top] < nums[i]:
      tmp.push(stack1.pop())
    stack2.extend(tmp reversed)
    stack1.push(i)
  return result`,
    python: `def secondGreaterElement(nums):
    n = len(nums)
    result = [-1] * n
    stack1 = []  # first next greater
    stack2 = []  # second next greater pending
    for i in range(n):
        while stack2 and nums[stack2[-1]] < nums[i]:
            result[stack2.pop()] = nums[i]
        tmp = []
        while stack1 and nums[stack1[-1]] < nums[i]:
            tmp.append(stack1.pop())
        stack2.extend(tmp[::-1])
        stack1.append(i)
    return result`,
    javascript: `function secondGreaterElement(nums) {
  const n = nums.length;
  const result = new Array(n).fill(-1);
  const stack1 = [];
  const stack2 = [];
  for (let i = 0; i < n; i++) {
    while (stack2.length && nums[stack2[stack2.length-1]] < nums[i])
      result[stack2.pop()] = nums[i];
    const tmp = [];
    while (stack1.length && nums[stack1[stack1.length-1]] < nums[i])
      tmp.push(stack1.pop());
    stack2.push(...tmp.reverse());
    stack1.push(i);
  }
  return result;
}`,
    java: `public int[] secondGreaterElement(int[] nums) {
    int n = nums.length;
    int[] result = new int[n]; Arrays.fill(result, -1);
    Deque<Integer> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!s2.isEmpty() && nums[s2.peek()] < nums[i])
            result[s2.pop()] = nums[i];
        Deque<Integer> tmp = new ArrayDeque<>();
        while (!s1.isEmpty() && nums[s1.peek()] < nums[i])
            tmp.push(s1.pop());
        while (!tmp.isEmpty()) s2.push(tmp.pop());
        s1.push(i);
    }
    return result;
}`,
  },
  defaultInput: { nums: [2, 4, 0, 9, 6] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 4, 0, 9, 6],
      placeholder: 'e.g. 2,4,0,9,6',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const n = nums.length;
    const steps: AlgorithmStep[] = [];
    const result: number[] = new Array(n).fill(-1);
    const stack1: number[] = [];
    const stack2: number[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [
        ...stack1.map(idx => `s1:i${idx}(${nums[idx]})`),
        ...stack2.map(idx => `s2:i${idx}(${nums[idx]})`),
      ],
      inputChars: nums.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums=[${nums.join(', ')}]. Two stacks: stack1 for first next-greater, stack2 for second next-greater candidates.`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 6,
        explanation: `i=${i}, nums[i]=${nums[i]}. First check stack2 for second-greater completions.`,
        variables: { i, val: nums[i] },
        visualization: makeViz(i, 'idle'),
      });

      while (stack2.length > 0 && nums[stack2[stack2.length - 1]] < nums[i]) {
        const idx = stack2.pop()!;
        result[idx] = nums[i];
        steps.push({
          line: 7,
          explanation: `stack2: nums[${idx}]=${nums[idx]} < ${nums[i]}. Found 2nd greater for index ${idx}. result[${idx}]=${nums[i]}.`,
          variables: { idx, 'result[idx]': nums[i], result: [...result] },
          visualization: makeViz(i, 'pop'),
        });
      }

      const tmp: number[] = [];
      while (stack1.length > 0 && nums[stack1[stack1.length - 1]] < nums[i]) {
        const idx = stack1.pop()!;
        tmp.push(idx);
        steps.push({
          line: 10,
          explanation: `stack1: nums[${idx}]=${nums[idx]} < ${nums[i]}. Found 1st greater for index ${idx}. Move to stack2 pending 2nd greater.`,
          variables: { idx },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack2.push(...tmp.reverse());
      stack1.push(i);

      steps.push({
        line: 12,
        explanation: `Push ${i} to stack1. stack1=[${stack1.map(x => nums[x]).join(',')}], stack2=[${stack2.map(x => nums[x]).join(',')}].`,
        variables: { stack1: [...stack1], stack2: [...stack2] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 13,
      explanation: `Done. Second next greater elements: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default nextGreaterElementIV;
