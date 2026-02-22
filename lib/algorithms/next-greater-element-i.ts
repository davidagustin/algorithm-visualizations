import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const nextGreaterElementI: AlgorithmDefinition = {
  id: 'next-greater-element-i',
  title: 'Next Greater Element I',
  leetcodeNumber: 496,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Given two arrays nums1 (a subset of nums2), for each element in nums1 find the next greater element in nums2. The next greater element is the first element to the right in nums2 that is strictly greater. Use a monotonic stack on nums2 to build a hash map of element to its next greater, then look up each nums1 element.',
  tags: ['stack', 'monotonic stack', 'hash map', 'array'],

  code: {
    pseudocode: `function nextGreaterElement(nums1, nums2):
  map = {}
  stack = []
  for each num in nums2:
    while stack not empty and stack.top < num:
      map[stack.pop()] = num
    stack.push(num)
  while stack not empty:
    map[stack.pop()] = -1
  return [map[n] for n in nums1]`,

    python: `def nextGreaterElement(nums1: list[int], nums2: list[int]) -> list[int]:
    nge_map = {}
    stack = []
    for num in nums2:
        while stack and stack[-1] < num:
            nge_map[stack.pop()] = num
        stack.append(num)
    while stack:
        nge_map[stack.pop()] = -1
    return [nge_map[n] for n in nums1]`,

    javascript: `function nextGreaterElement(nums1, nums2) {
  const map = new Map();
  const stack = [];
  for (const num of nums2) {
    while (stack.length && stack.at(-1) < num) {
      map.set(stack.pop(), num);
    }
    stack.push(num);
  }
  while (stack.length) map.set(stack.pop(), -1);
  return nums1.map(n => map.get(n));
}`,

    java: `public int[] nextGreaterElement(int[] nums1, int[] nums2) {
    Map<Integer, Integer> map = new HashMap<>();
    Deque<Integer> stack = new ArrayDeque<>();
    for (int num : nums2) {
        while (!stack.isEmpty() && stack.peek() < num)
            map.put(stack.pop(), num);
        stack.push(num);
    }
    while (!stack.isEmpty()) map.put(stack.pop(), -1);
    return Arrays.stream(nums1).map(n -> map.get(n)).toArray();
}`,
  },

  defaultInput: {
    nums1: [4, 1, 2],
    nums2: [1, 3, 4, 2],
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'Query Array',
      type: 'array',
      defaultValue: [4, 1, 2],
      placeholder: '4,1,2',
      helperText: 'Subset of nums2 to query',
    },
    {
      name: 'nums2',
      label: 'Source Array',
      type: 'array',
      defaultValue: [1, 3, 4, 2],
      placeholder: '1,3,4,2',
      helperText: 'Source array containing all elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const steps: AlgorithmStep[] = [];
    const ngeMap = new Map<number, number>();
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => String(v)),
      inputChars: nums2.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `nums2 = [${nums2.join(', ')}]. Build next-greater map using monotonic stack.`,
      variables: { nums1: [...nums1], nums2: [...nums2], map: {}, stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < nums2.length; i++) {
      const num = nums2[i];

      while (stack.length > 0 && stack[stack.length - 1] < num) {
        const popped = stack.pop()!;
        ngeMap.set(popped, num);
        steps.push({
          line: 4,
          explanation: `nums2[${i}]=${num} > stack top ${popped}. Next greater of ${popped} is ${num}. Pop and record.`,
          variables: { num, popped, nge: num, map: Object.fromEntries(ngeMap) },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(num);
      steps.push({
        line: 5,
        explanation: `Push ${num} onto stack. Stack = [${stack.join(', ')}].`,
        variables: { num, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    while (stack.length > 0) {
      const popped = stack.pop()!;
      ngeMap.set(popped, -1);
    }

    steps.push({
      line: 7,
      explanation: `Remaining stack elements have no next greater. Map them to -1. Map = ${JSON.stringify(Object.fromEntries(ngeMap))}.`,
      variables: { map: Object.fromEntries(ngeMap) },
      visualization: makeViz(nums2.length, 'idle'),
    });

    const result = nums1.map(n => ngeMap.get(n) ?? -1);
    steps.push({
      line: 8,
      explanation: `Look up each element of nums1 = [${nums1.join(', ')}] in the map. Result = [${result.join(', ')}].`,
      variables: { nums1: [...nums1], result: [...result] },
      visualization: makeViz(nums2.length, 'match'),
    });

    return steps;
  },
};

export default nextGreaterElementI;
