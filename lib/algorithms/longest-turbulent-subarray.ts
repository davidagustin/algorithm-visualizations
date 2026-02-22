import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const longestTurbulentSubarray: AlgorithmDefinition = {
  id: 'longest-turbulent-subarray',
  title: 'Longest Turbulent Subarray',
  leetcodeNumber: 978,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A subarray is turbulent if the comparison sign strictly alternates between each adjacent pair. Given integer array arr, return the length of the maximum turbulent subarray. Track inc (ends with increase) and dec (ends with decrease) DP values to handle both alternating directions.',
  tags: ['dynamic programming', 'sliding window', 'array'],

  code: {
    pseudocode: `function maxTurbulenceSize(arr):
  n = len(arr)
  if n < 2: return n
  inc = dec = 1, result = 1
  for i from 1 to n-1:
    if arr[i] > arr[i-1]:
      inc = dec + 1; dec = 1
    elif arr[i] < arr[i-1]:
      dec = inc + 1; inc = 1
    else:
      inc = dec = 1
    result = max(result, inc, dec)
  return result`,

    python: `def maxTurbulenceSize(arr: list[int]) -> int:
    n = len(arr)
    if n < 2: return n
    inc = dec = 1
    result = 1
    for i in range(1, n):
        if arr[i] > arr[i-1]:
            inc = dec + 1; dec = 1
        elif arr[i] < arr[i-1]:
            dec = inc + 1; inc = 1
        else:
            inc = dec = 1
        result = max(result, inc, dec)
    return result`,

    javascript: `function maxTurbulenceSize(arr) {
  const n = arr.length;
  if (n < 2) return n;
  let inc = 1, dec = 1, result = 1;
  for (let i = 1; i < n; i++) {
    if (arr[i] > arr[i-1]) {
      inc = dec + 1; dec = 1;
    } else if (arr[i] < arr[i-1]) {
      dec = inc + 1; inc = 1;
    } else {
      inc = dec = 1;
    }
    result = Math.max(result, inc, dec);
  }
  return result;
}`,

    java: `public int maxTurbulenceSize(int[] arr) {
    int n = arr.length;
    if (n < 2) return n;
    int inc = 1, dec = 1, result = 1;
    for (int i = 1; i < n; i++) {
        if (arr[i] > arr[i-1]) {
            inc = dec + 1; dec = 1;
        } else if (arr[i] < arr[i-1]) {
            dec = inc + 1; inc = 1;
        } else {
            inc = dec = 1;
        }
        result = Math.max(result, inc, dec);
    }
    return result;
}`,
  },

  defaultInput: { arr: [9, 4, 2, 10, 7, 8, 8, 1, 9] },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [9, 4, 2, 10, 7, 8, 8, 1, 9],
      placeholder: '9,4,2,10,7,8,8,1,9',
      helperText: 'Integer array to find longest turbulent subarray',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const n = arr.length;
    const steps: AlgorithmStep[] = [];

    if (n < 2) {
      steps.push({
        line: 2,
        explanation: `Array length ${n} < 2. Return ${n}.`,
        variables: { result: n },
        visualization: { type: 'dp-table', values: [...arr], highlights: {}, labels: arr.map((_, i) => `${i}`) },
      });
      return steps;
    }

    let inc = 1;
    let dec = 1;
    let result = 1;

    steps.push({
      line: 4,
      explanation: 'Initialize inc=1, dec=1, result=1. Start from index 1.',
      variables: { inc, dec, result },
      visualization: {
        type: 'dp-table',
        values: [...arr],
        highlights: { 0: 'active' },
        labels: arr.map((v, i) => `[${i}]=${v}`),
      },
    });

    for (let i = 1; i < n; i++) {
      const diff = arr[i] - arr[i - 1];
      const prevInc = inc;
      const prevDec = dec;

      if (diff > 0) {
        inc = dec + 1;
        dec = 1;
        steps.push({
          line: 7,
          explanation: `arr[${i}]=${arr[i]} > arr[${i - 1}]=${arr[i - 1]} (rising). inc = prevDec+1 = ${prevDec + 1}, dec resets to 1. result=${Math.max(result, inc, dec)}.`,
          variables: { i, inc, dec, result: Math.max(result, inc, dec) },
          visualization: {
            type: 'dp-table',
            values: [...arr],
            highlights: { [i]: 'active', [i - 1]: 'comparing' },
            labels: arr.map((v, k) => `[${k}]=${v}`),
          },
        });
      } else if (diff < 0) {
        dec = inc + 1;
        inc = 1;
        steps.push({
          line: 9,
          explanation: `arr[${i}]=${arr[i]} < arr[${i - 1}]=${arr[i - 1]} (falling). dec = prevInc+1 = ${prevInc + 1}, inc resets to 1. result=${Math.max(result, inc, dec)}.`,
          variables: { i, inc, dec, result: Math.max(result, inc, dec) },
          visualization: {
            type: 'dp-table',
            values: [...arr],
            highlights: { [i]: 'active', [i - 1]: 'comparing' },
            labels: arr.map((v, k) => `[${k}]=${v}`),
          },
        });
      } else {
        inc = 1;
        dec = 1;
        steps.push({
          line: 11,
          explanation: `arr[${i}]=${arr[i]} == arr[${i - 1}]=${arr[i - 1]} (equal). Reset inc=dec=1. result stays ${result}.`,
          variables: { i, inc, dec, result },
          visualization: {
            type: 'dp-table',
            values: [...arr],
            highlights: { [i]: 'mismatch', [i - 1]: 'mismatch' },
            labels: arr.map((v, k) => `[${k}]=${v}`),
          },
        });
      }

      result = Math.max(result, inc, dec);
    }

    steps.push({
      line: 12,
      explanation: `Longest turbulent subarray length = ${result}.`,
      variables: { result },
      visualization: {
        type: 'dp-table',
        values: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        labels: arr.map((v, i) => `[${i}]=${v}`),
      },
    });

    return steps;
  },
};

export default longestTurbulentSubarray;
