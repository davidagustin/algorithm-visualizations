import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const degreeOfAnArray: AlgorithmDefinition = {
  id: 'degree-of-an-array',
  title: 'Degree of an Array',
  leetcodeNumber: 697,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'The degree of an array is defined as the maximum frequency of any element. Find the length of the shortest contiguous subarray that has the same degree as the entire array. Track first and last occurrence of each element to compute the minimal subarray length.',
  tags: ['array', 'hash map', 'frequency'],

  code: {
    pseudocode: `function findShortestSubArray(nums):
  count = {}, first = {}, last = {}
  for i, x in enumerate(nums):
    count[x]++
    if x not in first: first[x] = i
    last[x] = i
  degree = max(count.values())
  result = len(nums)
  for x, freq in count.items():
    if freq == degree:
      result = min(result, last[x] - first[x] + 1)
  return result`,
    python: `def findShortestSubArray(nums):
    count, first, last = {}, {}, {}
    for i, x in enumerate(nums):
        count[x] = count.get(x, 0) + 1
        if x not in first:
            first[x] = i
        last[x] = i
    degree = max(count.values())
    result = len(nums)
    for x, freq in count.items():
        if freq == degree:
            result = min(result, last[x] - first[x] + 1)
    return result`,
    javascript: `function findShortestSubArray(nums) {
  const count = {}, first = {}, last = {};
  for (let i = 0; i < nums.length; i++) {
    const x = nums[i];
    count[x] = (count[x] || 0) + 1;
    if (first[x] === undefined) first[x] = i;
    last[x] = i;
  }
  const degree = Math.max(...Object.values(count));
  let result = nums.length;
  for (const x in count) {
    if (count[x] === degree) {
      result = Math.min(result, last[x] - first[x] + 1);
    }
  }
  return result;
}`,
    java: `public int findShortestSubArray(int[] nums) {
    Map<Integer,Integer> count = new HashMap<>(), first = new HashMap<>(), last = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        count.merge(nums[i], 1, Integer::sum);
        first.putIfAbsent(nums[i], i);
        last.put(nums[i], i);
    }
    int degree = Collections.max(count.values());
    int result = nums.length;
    for (int x : count.keySet()) {
        if (count.get(x) == degree)
            result = Math.min(result, last.get(x) - first.get(x) + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 3, 1, 4, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 1, 4, 2],
      placeholder: '1,2,2,3,1,4,2',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const count: Record<number, number> = {};
    const first: Record<number, number> = {};
    const last: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize count, first occurrence, and last occurrence maps.',
      variables: { count: '{}', first: '{}', last: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      const x = nums[i];
      count[x] = (count[x] || 0) + 1;
      if (first[x] === undefined) first[x] = i;
      last[x] = i;
      steps.push({
        line: 3,
        explanation: `Process nums[${i}] = ${x}. count[${x}]=${count[x]}, first[${x}]=${first[x]}, last[${x}]=${last[x]}.`,
        variables: { i, value: x, 'count[x]': count[x], 'first[x]': first[x], 'last[x]': last[x] },
        visualization: makeViz({ [i]: 'active' }, { [i]: String(x) }),
      });
    }

    const degree = Math.max(...Object.values(count));
    steps.push({
      line: 7,
      explanation: `Degree of array = max frequency = ${degree}.`,
      variables: { degree },
      visualization: makeViz({}, {}),
    });

    let result = nums.length;
    for (const xStr in count) {
      const x = Number(xStr);
      if (count[x] === degree) {
        const len = last[x] - first[x] + 1;
        result = Math.min(result, len);
        const highlights: Record<number, string> = {};
        for (let i = first[x]; i <= last[x]; i++) highlights[i] = 'found';
        steps.push({
          line: 9,
          explanation: `Element ${x} has degree ${count[x]}. Subarray from index ${first[x]} to ${last[x]} has length ${len}. Best so far: ${result}.`,
          variables: { element: x, subLen: len, best: result },
          visualization: makeViz(highlights, { [first[x]]: 'start', [last[x]]: 'end' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Shortest subarray with same degree as array has length ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default degreeOfAnArray;
