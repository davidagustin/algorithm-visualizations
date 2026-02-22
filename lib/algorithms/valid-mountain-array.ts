import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const validMountainArray: AlgorithmDefinition = {
  id: 'valid-mountain-array',
  title: 'Valid Mountain Array',
  leetcodeNumber: 941,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'An array is a valid mountain if it has at least 3 elements, strictly increases to a peak (not first or last element), then strictly decreases. Use a single pass: climb up while increasing, then descend while decreasing, and verify both phases occurred.',
  tags: ['array', 'two pointers'],

  code: {
    pseudocode: `function validMountainArray(arr):
  n = length(arr)
  i = 0
  while i+1 < n and arr[i] < arr[i+1]:
    i++
  if i == 0 or i == n-1:
    return false
  while i+1 < n and arr[i] > arr[i+1]:
    i++
  return i == n-1`,

    python: `def validMountainArray(arr: list[int]) -> bool:
    n = len(arr)
    i = 0
    while i + 1 < n and arr[i] < arr[i + 1]:
        i += 1
    if i == 0 or i == n - 1:
        return False
    while i + 1 < n and arr[i] > arr[i + 1]:
        i += 1
    return i == n - 1`,

    javascript: `function validMountainArray(arr) {
  const n = arr.length;
  let i = 0;
  while (i + 1 < n && arr[i] < arr[i + 1]) i++;
  if (i === 0 || i === n - 1) return false;
  while (i + 1 < n && arr[i] > arr[i + 1]) i++;
  return i === n - 1;
}`,

    java: `public boolean validMountainArray(int[] arr) {
    int n = arr.length, i = 0;
    while (i + 1 < n && arr[i] < arr[i + 1]) i++;
    if (i == 0 || i == n - 1) return false;
    while (i + 1 < n && arr[i] > arr[i + 1]) i++;
    return i == n - 1;
}`,
  },

  defaultInput: {
    nums: [0, 3, 2, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 3, 2, 1],
      placeholder: '0,3,2,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Array of length ${n}: ${JSON.stringify(arr)}. Climb up the increasing slope to find the peak.`,
      variables: { n, i: 0 },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      },
    });

    let i = 0;
    while (i + 1 < n && arr[i] < arr[i + 1]) {
      steps.push({
        line: 4,
        explanation: `arr[${i}]=${arr[i]} < arr[${i + 1}]=${arr[i + 1]}. Still ascending. Move i to ${i + 1}.`,
        variables: { i, 'arr[i]': arr[i], 'arr[i+1]': arr[i + 1] },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i]: 'active', [i + 1]: 'comparing' },
          labels: { [i]: `i=${i}` },
        },
      });
      i++;
    }

    steps.push({
      line: 5,
      explanation: `Peak found at i=${i} (value=${arr[i]}). Check it is not first or last element.`,
      variables: { i, peakValue: arr[i] },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: { [i]: 'found' },
        labels: { [i]: 'peak' },
      },
    });

    if (i === 0 || i === n - 1) {
      steps.push({
        line: 6,
        explanation: `Peak is at index ${i} which is ${i === 0 ? 'the first' : 'the last'} element. Not a valid mountain. Return false.`,
        variables: { i, result: false },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i]: 'mismatch' },
          labels: { [i]: 'invalid peak' },
        },
      });
      return steps;
    }

    while (i + 1 < n && arr[i] > arr[i + 1]) {
      steps.push({
        line: 8,
        explanation: `arr[${i}]=${arr[i]} > arr[${i + 1}]=${arr[i + 1]}. Still descending. Move i to ${i + 1}.`,
        variables: { i, 'arr[i]': arr[i], 'arr[i+1]': arr[i + 1] },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i]: 'active', [i + 1]: 'comparing' },
          labels: { [i]: `i=${i}` },
        },
      });
      i++;
    }

    const result = i === n - 1;

    steps.push({
      line: 9,
      explanation: `Descent ends at i=${i}. n-1=${n - 1}. ${result ? 'Reached end. Valid mountain!' : 'Did not reach end. Not a valid mountain.'}`,
      variables: { i, 'n-1': n - 1, result },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: { [i]: result ? 'found' : 'mismatch' },
        labels: { [i]: `i=${i}` },
      },
    });

    return steps;
  },
};

export default validMountainArray;
