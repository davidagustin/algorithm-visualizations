import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countNumbersWithUniqueDigits: AlgorithmDefinition = {
  id: 'count-numbers-with-unique-digits',
  title: 'Count Numbers with Unique Digits',
  leetcodeNumber: 357,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an integer n, return the count of all numbers with unique digits x, where 0 <= x < 10^n. For each digit count k from 1 to n, compute the product of available choices: first digit has 9 choices (1-9), second has 9 (0-9 minus used), third has 8, and so on.',
  tags: ['backtracking', 'math', 'dynamic programming', 'counting'],

  code: {
    pseudocode: `function countNumbersWithUniqueDigits(n):
  if n == 0: return 1
  result = 10  // 0..9 for n=1
  uniqueDigits = 9
  availableNum = 9
  for i in 2..n:
    uniqueDigits *= availableNum
    result += uniqueDigits
    availableNum -= 1
  return result`,
    python: `def countNumbersWithUniqueDigits(n: int) -> int:
    if n == 0: return 1
    result = 10
    unique_digits = 9
    available = 9
    for i in range(2, n + 1):
        unique_digits *= available
        result += unique_digits
        available -= 1
    return result`,
    javascript: `function countNumbersWithUniqueDigits(n) {
  if (n === 0) return 1;
  let result = 10;
  let uniqueDigits = 9;
  let available = 9;
  for (let i = 2; i <= n; i++) {
    uniqueDigits *= available;
    result += uniqueDigits;
    available--;
  }
  return result;
}`,
    java: `public int countNumbersWithUniqueDigits(int n) {
    if (n == 0) return 1;
    int result = 10, uniqueDigits = 9, available = 9;
    for (int i = 2; i <= n; i++) {
        uniqueDigits *= available;
        result += uniqueDigits;
        available--;
    }
    return result;
}`,
  },

  defaultInput: { n: 3 },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Count numbers with unique digits from 0 to 10^n - 1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const counts: number[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...counts],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count numbers with all unique digits from 0 to 10^${n}-1. Build up counts by number of digits.`,
      variables: { n, range: `0 to ${Math.pow(10, n) - 1}` },
      visualization: makeViz({}, {}),
    });

    if (n === 0) {
      counts.push(1);
      steps.push({
        line: 2,
        explanation: 'n=0: only the number 0 itself, so return 1.',
        variables: { n, result: 1 },
        visualization: makeViz({ 0: 'found' }, { 0: '1-digit' }),
      });
      return steps;
    }

    counts.push(10);
    steps.push({
      line: 3,
      explanation: 'Base case for n=1: numbers 0-9, all 10 have unique digits (trivially).',
      variables: { digits: 1, count: 10, runningTotal: 10 },
      visualization: makeViz({ 0: 'active' }, { 0: '10 (0-9)' }),
    });

    let result = 10;
    let uniqueDigits = 9;
    let available = 9;

    for (let i = 2; i <= n; i++) {
      uniqueDigits *= available;
      result += uniqueDigits;
      counts.push(uniqueDigits);

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      counts.forEach((c, idx) => {
        h[idx] = idx === counts.length - 1 ? 'active' : 'visited';
        l[idx] = `${idx + 1}-digit: ${c}`;
      });

      steps.push({
        line: 6,
        explanation: `${i}-digit numbers with all unique digits: 9 * 9 * 8 * ... * ${available} = ${uniqueDigits}. Running total: ${result}.`,
        variables: { digits: i, newCount: uniqueDigits, available, runningTotal: result },
        visualization: makeViz(h, l),
      });

      available--;
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    counts.forEach((c, idx) => { finalH[idx] = 'found'; finalL[idx] = `${idx + 1}d: ${c}`; });

    steps.push({
      line: 8,
      explanation: `Total count of numbers with unique digits from 0 to 10^${n}-1 = ${result}.`,
      variables: { n, result, breakdown: counts },
      visualization: makeViz(finalH, finalL),
    });

    return steps;
  },
};

export default countNumbersWithUniqueDigits;
