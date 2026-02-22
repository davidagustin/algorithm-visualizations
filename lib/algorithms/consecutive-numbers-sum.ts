import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const consecutiveNumbersSum: AlgorithmDefinition = {
  id: 'consecutive-numbers-sum',
  title: 'Consecutive Numbers Sum',
  leetcodeNumber: 829,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Given a positive integer n, return the number of ways to express n as a sum of consecutive positive integers. For k consecutive integers starting at m: n = k*m + k*(k-1)/2, so m = (n - k*(k-1)/2) / k. Iterate k from 1 while k*(k+1)/2 < n; count valid (positive integer) m values.',
  tags: ['math', 'enumeration'],

  code: {
    pseudocode: `function consecutiveNumbersSum(n):
  count = 0
  k = 1
  while k*(k+1)/2 <= n:
    remainder = n - k*(k-1)/2
    if remainder % k == 0:
      count += 1
    k += 1
  return count`,

    python: `def consecutiveNumbersSum(n):
    count = 0
    k = 1
    while k * (k + 1) // 2 <= n:
        remainder = n - k * (k - 1) // 2
        if remainder % k == 0:
            count += 1
        k += 1
    return count`,

    javascript: `function consecutiveNumbersSum(n) {
  let count = 0;
  for (let k = 1; k * (k + 1) / 2 <= n; k++) {
    const rem = n - k * (k - 1) / 2;
    if (rem % k === 0) count++;
  }
  return count;
}`,

    java: `public int consecutiveNumbersSum(int n) {
    int count = 0;
    for (int k = 1; (long)k*(k+1)/2 <= n; k++) {
        int rem = n - k*(k-1)/2;
        if (rem % k == 0) count++;
    }
    return count;
}`,
  },

  defaultInput: {
    n: 15,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 15,
      placeholder: '15',
      helperText: 'Positive integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    let count = 0;
    const ways: string[] = [];

    steps.push({
      line: 1,
      explanation: `Count ways to write ${n} as sum of consecutive positive integers. For k consecutive numbers starting at m: n = k*m + k*(k-1)/2, so m = (n - k*(k-1)/2) / k must be a positive integer.`,
      variables: { n, count: 0 },
      visualization: { type: 'array', array: [n], highlights: { 0: 'active' }, labels: { 0: String(n) } } as ArrayVisualization,
    });

    let k = 1;
    while (k * (k + 1) / 2 <= n) {
      const triangleK = k * (k - 1) / 2;
      const remainder = n - triangleK;
      const m = remainder / k;
      const valid = remainder % k === 0 && m > 0;

      if (valid) {
        count++;
        const seq = Array.from({ length: k }, (_, i) => m + i);
        ways.push(`[${seq.join('+')}]=${seq.reduce((a,b)=>a+b,0)}`);
        steps.push({
          line: 5,
          explanation: `k = ${k} consecutive numbers: m = (${n} - ${triangleK}) / ${k} = ${m}. Valid! Sequence: ${seq.join(' + ')} = ${n}. count = ${count}.`,
          variables: { k, m, remainder, count, sequence: seq },
          visualization: {
            type: 'array',
            array: seq,
            highlights: Object.fromEntries(seq.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(seq.map((v, i) => [i, String(v)])),
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 4,
          explanation: `k = ${k}: m = (${n} - ${triangleK}) / ${k} = ${remainder / k}. ${remainder % k !== 0 ? 'Not an integer.' : 'm <= 0, invalid.'} Skip.`,
          variables: { k, remainder, m: remainder / k, valid: false, count },
          visualization: { type: 'array', array: [k], highlights: { 0: 'mismatch' }, labels: { 0: `k=${k}` } } as ArrayVisualization,
        });
      }
      k++;
    }

    steps.push({
      line: 7,
      explanation: `Total ways = ${count}. Valid representations: ${ways.join(', ')}.`,
      variables: { result: count, ways },
      visualization: { type: 'array', array: [count], highlights: { 0: 'found' }, labels: { 0: `ways=${count}` } } as ArrayVisualization,
    });

    return steps;
  },
};

export default consecutiveNumbersSum;
