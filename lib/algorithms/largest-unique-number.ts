import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestUniqueNumber: AlgorithmDefinition = {
  id: 'largest-unique-number',
  title: 'Largest Unique Number',
  leetcodeNumber: 1133,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array A, return the largest integer that only occurs once. If no integer occurs once, return -1. Build a frequency map, then scan for the largest value with frequency exactly 1.',
  tags: ['hash map', 'array', 'frequency', 'sorting'],

  code: {
    pseudocode: `function largestUniqueNumber(A):
  freq = {}
  for n in A:
    freq[n] = freq.get(n, 0) + 1
  result = -1
  for n, cnt in freq.items():
    if cnt == 1:
      result = max(result, n)
  return result`,
    python: `def largestUniqueNumber(A):
    from collections import Counter
    freq = Counter(A)
    return max((n for n, c in freq.items() if c == 1), default=-1)`,
    javascript: `function largestUniqueNumber(A) {
  const freq = new Map();
  for (const n of A) freq.set(n, (freq.get(n)||0)+1);
  let result = -1;
  for (const [n, c] of freq) {
    if (c === 1) result = Math.max(result, n);
  }
  return result;
}`,
    java: `public int largestUniqueNumber(int[] A) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int n : A) freq.merge(n, 1, Integer::sum);
    int result = -1;
    for (Map.Entry<Integer,Integer> e : freq.entrySet()) {
        if (e.getValue() == 1) result = Math.max(result, e.getKey());
    }
    return result;
}`,
  },

  defaultInput: {
    A: [5, 7, 3, 9, 4, 9, 8, 3, 1],
  },

  inputFields: [
    {
      name: 'A',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 7, 3, 9, 4, 9, 8, 3, 1],
      placeholder: '5,7,3,9,4,9,8,3,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const A = input.A as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...A],
      highlights,
      labels,
    });

    const freq: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: 'Build frequency map for all elements.',
      variables: { freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < A.length; i++) {
      const n = A[i];
      freq[n] = (freq[n] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `A[${i}]=${n}: freq[${n}]=${freq[n]}`,
        variables: { i, value: n, [`freq[${n}]`]: freq[n] },
        visualization: makeViz({ [i]: freq[n] === 1 ? 'active' : 'comparing' }, { [i]: `${freq[n]}x` }),
      });
    }

    steps.push({
      line: 5,
      explanation: `Frequency map: ${Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(', ')}. Now find largest with count=1.`,
      variables: { freq: JSON.stringify(freq) },
      visualization: makeViz({}, {}),
    });

    let result = -1;
    for (let i = 0; i < A.length; i++) {
      const n = A[i];
      const cnt = freq[n];
      if (cnt === 1) {
        if (n > result) {
          result = n;
          steps.push({
            line: 7,
            explanation: `A[${i}]=${n} appears once and is larger than current best ${result === n ? '-inf' : result - 1}. Update result to ${result}.`,
            variables: { value: n, count: cnt, result },
            visualization: makeViz({ [i]: 'found' }, { [i]: `best=${n}` }),
          });
        }
      } else {
        steps.push({
          line: 6,
          explanation: `A[${i}]=${n} appears ${cnt} times. Skip (not unique).`,
          variables: { value: n, count: cnt },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: `${cnt}x` }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Largest unique number: ${result}`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(A.map((_, i) => [i, A[i] === result ? 'found' : 'sorted'])),
        Object.fromEntries(A.map((_, i) => [i, `${A[i]}`]))
      ),
    });

    return steps;
  },
};

export default largestUniqueNumber;
