import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const duplicateZeros: AlgorithmDefinition = {
  id: 'duplicate-zeros',
  title: 'Duplicate Zeros',
  leetcodeNumber: 1089,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a fixed-length integer array, duplicate each occurrence of zero in-place, shifting the remaining elements to the right. Elements beyond the original array length are discarded. Use a two-pass approach: first count zeros to find the new write position, then copy from right to left.',
  tags: ['array', 'two pointers', 'in-place'],

  code: {
    pseudocode: `function duplicateZeros(arr):
  zeros = count zeros in arr
  i = n - 1; j = n + zeros - 1
  while i >= 0:
    if arr[i] == 0:
      if j < n: arr[j] = 0
      j--
      if j < n: arr[j] = 0
    else:
      if j < n: arr[j] = arr[i]
    i--; j--`,

    python: `def duplicateZeros(arr: list[int]) -> None:
    zeros = arr.count(0)
    i, j = len(arr) - 1, len(arr) + zeros - 1
    while i >= 0:
        if arr[i] == 0:
            if j < len(arr): arr[j] = 0
            j -= 1
            if j < len(arr): arr[j] = 0
        else:
            if j < len(arr): arr[j] = arr[i]
        i -= 1
        j -= 1`,

    javascript: `function duplicateZeros(arr) {
  let zeros = arr.filter(v => v === 0).length;
  let i = arr.length - 1, j = arr.length + zeros - 1;
  while (i >= 0) {
    if (arr[i] === 0) {
      if (j < arr.length) arr[j] = 0;
      j--;
      if (j < arr.length) arr[j] = 0;
    } else {
      if (j < arr.length) arr[j] = arr[i];
    }
    i--; j--;
  }
}`,

    java: `public void duplicateZeros(int[] arr) {
    int zeros = 0;
    for (int v : arr) if (v == 0) zeros++;
    int i = arr.length - 1, j = arr.length + zeros - 1;
    while (i >= 0) {
        if (arr[i] == 0) {
            if (j < arr.length) arr[j] = 0;
            j--;
            if (j < arr.length) arr[j] = 0;
        } else {
            if (j < arr.length) arr[j] = arr[i];
        }
        i--; j--;
    }
}`,
  },

  defaultInput: {
    nums: [1, 0, 2, 3, 0, 4, 5, 0],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 0, 2, 3, 0, 4, 5, 0],
      placeholder: '1,0,2,3,0,4,5,0',
      helperText: 'Fixed-length array; zeros will be duplicated in-place',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Array: ${JSON.stringify(arr)}, n=${n}. Count zeros to determine pointer offset.`,
      variables: { n },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
      },
    });

    let zeros = 0;
    for (const v of arr) if (v === 0) zeros++;

    steps.push({
      line: 2,
      explanation: `Found ${zeros} zero(s). Initialize i=${n - 1} (read from end), j=${n + zeros - 1} (write pointer, may be out of bounds).`,
      variables: { zeros, i: n - 1, j: n + zeros - 1, n },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
      },
    });

    let i = n - 1;
    let j = n + zeros - 1;

    while (i >= 0) {
      if (arr[i] === 0) {
        if (j < n) {
          arr[j] = 0;
          steps.push({
            line: 5,
            explanation: `arr[${i}]=0. Write first zero at j=${j}: arr[${j}]=0.`,
            variables: { i, j, value: 0 },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [i]: 'active', [j]: 'found' },
              labels: { [i]: 'read', [j]: 'write 0' },
            },
          });
        }
        j--;
        if (j < n) {
          arr[j] = 0;
          steps.push({
            line: 7,
            explanation: `Write duplicate zero at j=${j}: arr[${j}]=0 (duplicating the zero).`,
            variables: { i, j, value: 0 },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [i]: 'active', [j]: 'found' },
              labels: { [j]: 'dup 0' },
            },
          });
        }
      } else {
        if (j < n) {
          arr[j] = arr[i];
          steps.push({
            line: 9,
            explanation: `arr[${i}]=${arr[i]} is non-zero. Copy to j=${j}: arr[${j}]=${arr[j]}.`,
            variables: { i, j, value: arr[i] },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [i]: 'active', [j]: 'comparing' },
              labels: { [i]: 'read', [j]: `write ${arr[j]}` },
            },
          });
        } else {
          steps.push({
            line: 9,
            explanation: `arr[${i}]=${arr[i]}, but j=${j} >= n=${n}. Write position out of bounds. Discard.`,
            variables: { i, j, discarded: arr[i] },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [i]: 'mismatch' },
              labels: { [i]: 'discard' },
            },
          });
        }
      }
      i--;
      j--;
    }

    steps.push({
      line: 11,
      explanation: `In-place duplication complete. Result: ${JSON.stringify(arr)}.`,
      variables: { result: JSON.stringify(arr) },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((v, i) => [i, v === 0 ? 'found' : 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default duplicateZeros;
