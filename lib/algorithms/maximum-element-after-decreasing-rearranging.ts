import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumElementAfterDecreasingRearranging: AlgorithmDefinition = {
  id: 'maximum-element-after-decreasing-rearranging',
  title: 'Maximum Value After Insertion',
  leetcodeNumber: 1846,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array of positive integers, you may: rearrange elements in any order, and replace any element with a smaller or equal value. Find the maximum possible value of the last element. Greedy: sort ascending, then for each position i (1-indexed), set arr[i] = min(arr[i], i). The answer is the last element.',
  tags: ['greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maximumElementAfterDecrAndRearrange(arr):
  sort arr ascending
  arr[0] = 1
  for i from 1 to n-1:
    arr[i] = min(arr[i], arr[i-1] + 1)
  return arr[n-1]`,

    python: `def maximumElementAfterDecrAndRearrange(arr: list[int]) -> int:
    arr.sort()
    arr[0] = 1
    for i in range(1, len(arr)):
        arr[i] = min(arr[i], arr[i - 1] + 1)
    return arr[-1]`,

    javascript: `function maximumElementAfterDecrAndRearrange(arr) {
  arr.sort((a, b) => a - b);
  arr[0] = 1;
  for (let i = 1; i < arr.length; i++) {
    arr[i] = Math.min(arr[i], arr[i - 1] + 1);
  }
  return arr[arr.length - 1];
}`,

    java: `public int maximumElementAfterDecrAndRearrange(int[] arr) {
    Arrays.sort(arr);
    arr[0] = 1;
    for (int i = 1; i < arr.length; i++) {
        arr[i] = Math.min(arr[i], arr[i - 1] + 1);
    }
    return arr[arr.length - 1];
}`,
  },

  defaultInput: {
    arr: [2, 2, 1, 2, 1],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 2, 1, 2, 1],
      placeholder: '2,2,1,2,1',
      helperText: 'Comma-separated positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.arr as number[])];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Original array: [${arr.join(', ')}]. Sort ascending so we can greedily assign max feasible values.`,
      variables: { arr: [...arr] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
      },
    });

    arr.sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Sorted: [${arr.join(', ')}]. Set arr[0] = 1 (must be at least 1 and cannot exceed original value >= 1).`,
      variables: { sorted: [...arr] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
      },
    });

    arr[0] = 1;
    steps.push({
      line: 2,
      explanation: `Set arr[0] = 1.`,
      variables: { 'arr[0]': 1 },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: { 0: 'active' } as Record<number, string>,
        labels: { 0: '1' } as Record<number, string>,
      },
    });

    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i];
      arr[i] = Math.min(arr[i], arr[i - 1] + 1);
      steps.push({
        line: 4,
        explanation: `Index ${i}: arr[${i}] = min(${prev}, arr[${i - 1}]+1) = min(${prev}, ${arr[i - 1] + 1}) = ${arr[i]}.`,
        variables: { i, original: prev, 'arr[i]': arr[i], 'arr[i-1]': arr[i - 1] },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i - 1]: 'comparing', [i]: 'active' } as Record<number, string>,
          labels: { [i]: `${arr[i]}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `Maximum possible value of the last element: ${arr[arr.length - 1]}.`,
      variables: { result: arr[arr.length - 1] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, i === arr.length - 1 ? 'found' : 'sorted'])) as Record<number, string>,
        labels: { [arr.length - 1]: 'max' } as Record<number, string>,
      },
    });

    return steps;
  },
};

export default maximumElementAfterDecreasingRearranging;
