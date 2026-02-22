import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfAllOddLengthSubarrays: AlgorithmDefinition = {
  id: 'sum-of-all-odd-length-subarrays',
  title: 'Sum of All Odd Length Subarrays',
  leetcodeNumber: 1588,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a positive integer array, compute the sum of all elements from every odd-length subarray. Enumerate all odd lengths (1, 3, 5, ...) and for each length, slide a window summing elements. Alternatively, each element at index i contributes to a calculable number of odd-length subarrays based on its position.',
  tags: ['array', 'prefix sum', 'math'],

  code: {
    pseudocode: `function sumOddLengthSubarrays(arr):
  total = 0
  n = len(arr)
  for length in 1, 3, 5, ..., n (odd):
    for start in 0..n-length:
      for i in start..start+length-1:
        total += arr[i]
  return total`,
    python: `def sumOddLengthSubarrays(arr):
    total = 0
    n = len(arr)
    for length in range(1, n + 1, 2):
        for start in range(n - length + 1):
            total += sum(arr[start:start + length])
    return total`,
    javascript: `function sumOddLengthSubarrays(arr) {
  let total = 0;
  const n = arr.length;
  for (let len = 1; len <= n; len += 2)
    for (let start = 0; start + len <= n; start++)
      for (let i = start; i < start + len; i++)
        total += arr[i];
  return total;
}`,
    java: `public int sumOddLengthSubarrays(int[] arr) {
    int total = 0, n = arr.length;
    for (int len = 1; len <= n; len += 2)
        for (int start = 0; start + len <= n; start++)
            for (int i = start; i < start + len; i++)
                total += arr[i];
    return total;
}`,
  },

  defaultInput: {
    arr: [1, 4, 2, 5, 3],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 4, 2, 5, 3],
      placeholder: '1,4,2,5,3',
      helperText: 'Comma-separated positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sum all odd-length subarrays of [${arr.join(', ')}]. Odd lengths: 1, 3, 5, ...`,
      variables: { n, array: arr.join(', ') },
      visualization: makeViz({}, {}),
    });

    let total = 0;
    for (let len = 1; len <= n; len += 2) {
      steps.push({
        line: 3,
        explanation: `Processing all subarrays of length ${len}.`,
        variables: { length: len, totalSoFar: total },
        visualization: makeViz({}, {}),
      });

      for (let start = 0; start + len <= n; start++) {
        const subArr = arr.slice(start, start + len);
        const subSum = subArr.reduce((a, b) => a + b, 0);
        total += subSum;
        const highlights: Record<number, string> = {};
        for (let i = start; i < start + len; i++) highlights[i] = 'active';
        steps.push({
          line: 5,
          explanation: `Subarray [${start}..${start + len - 1}] = [${subArr.join(', ')}], sum=${subSum}. Running total=${total}.`,
          variables: { start, end: start + len - 1, subSum, total },
          visualization: makeViz(highlights, { [start]: 'start', [start + len - 1]: 'end' }),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Sum of all odd-length subarrays = ${total}.`,
      variables: { result: total },
      visualization: makeViz(Object.fromEntries(arr.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default sumOfAllOddLengthSubarrays;
