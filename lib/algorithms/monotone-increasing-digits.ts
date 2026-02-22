import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const monotoneIncreasingDigits: AlgorithmDefinition = {
  id: 'monotone-increasing-digits',
  title: 'Monotone Increasing Digits',
  leetcodeNumber: 738,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an integer n, find the largest number <= n whose digits are non-decreasing (monotone increasing). Greedy: scan right to left. When digits[i-1] > digits[i], decrement digits[i-1] and mark position i and beyond as 9.',
  tags: ['greedy', 'string', 'math'],

  code: {
    pseudocode: `function monotoneIncreasingDigits(n):
  digits = array of digits of n
  mark = length of digits
  for i from length-1 down to 1:
    if digits[i-1] > digits[i]:
      digits[i-1]--
      mark = i
  for i from mark to end:
    digits[i] = '9'
  return join digits as number`,

    python: `def monotoneIncreasingDigits(n: int) -> int:
    digits = list(str(n))
    mark = len(digits)
    for i in range(len(digits) - 1, 0, -1):
        if digits[i - 1] > digits[i]:
            digits[i - 1] = str(int(digits[i - 1]) - 1)
            mark = i
    for i in range(mark, len(digits)):
        digits[i] = '9'
    return int(''.join(digits))`,

    javascript: `function monotoneIncreasingDigits(n) {
  const digits = String(n).split('');
  let mark = digits.length;
  for (let i = digits.length - 1; i > 0; i--) {
    if (digits[i - 1] > digits[i]) {
      digits[i - 1] = String(Number(digits[i - 1]) - 1);
      mark = i;
    }
  }
  for (let i = mark; i < digits.length; i++) {
    digits[i] = '9';
  }
  return parseInt(digits.join(''), 10);
}`,

    java: `public int monotoneIncreasingDigits(int n) {
    char[] digits = String.valueOf(n).toCharArray();
    int mark = digits.length;
    for (int i = digits.length - 1; i > 0; i--) {
        if (digits[i - 1] > digits[i]) {
            digits[i - 1]--;
            mark = i;
        }
    }
    for (int i = mark; i < digits.length; i++) {
        digits[i] = '9';
    }
    return Integer.parseInt(new String(digits));
}`,
  },

  defaultInput: {
    n: 332,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Integer n',
      type: 'number',
      defaultValue: 332,
      placeholder: '332',
      helperText: 'Find largest monotone increasing number <= n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const digits = String(n).split('');

    steps.push({
      line: 1,
      explanation: `Convert ${n} to digits: [${digits.join(', ')}]. Scan right to left for violations.`,
      variables: { n, digits: [...digits] },
      visualization: {
        type: 'array',
        array: digits.map(Number),
        highlights: {},
        labels: Object.fromEntries(digits.map((d, i) => [i, d])) as Record<number, string>,
      },
    });

    let mark = digits.length;

    for (let i = digits.length - 1; i > 0; i--) {
      if (digits[i - 1] > digits[i]) {
        steps.push({
          line: 4,
          explanation: `Violation: digits[${i - 1}]="${digits[i - 1]}" > digits[${i}]="${digits[i]}". Decrement digits[${i - 1}] and mark position ${i} and beyond as 9.`,
          variables: { i, 'digits[i-1]': digits[i - 1], 'digits[i]': digits[i] },
          visualization: {
            type: 'array',
            array: digits.map(Number),
            highlights: { [i - 1]: 'active', [i]: 'mismatch' } as Record<number, string>,
            labels: { [i - 1]: `>${digits[i]}` } as Record<number, string>,
          },
        });
        digits[i - 1] = String(Number(digits[i - 1]) - 1);
        mark = i;
        steps.push({
          line: 5,
          explanation: `After decrement: digits[${i - 1}]="${digits[i - 1]}". Mark = ${mark}.`,
          variables: { 'digits[i-1]': digits[i - 1], mark },
          visualization: {
            type: 'array',
            array: digits.map(Number),
            highlights: { [i - 1]: 'found', [i]: 'comparing' } as Record<number, string>,
            labels: { [i - 1]: digits[i - 1] } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 3,
          explanation: `digits[${i - 1}]="${digits[i - 1]}" <= digits[${i}]="${digits[i]}". No violation here.`,
          variables: { i },
          visualization: {
            type: 'array',
            array: digits.map(Number),
            highlights: { [i - 1]: 'comparing', [i]: 'visited' } as Record<number, string>,
            labels: {},
          },
        });
      }
    }

    for (let i = mark; i < digits.length; i++) {
      digits[i] = '9';
    }

    if (mark < digits.length) {
      steps.push({
        line: 6,
        explanation: `Set digits from position ${mark} to end to 9: [${digits.join(', ')}].`,
        variables: { mark, digits: [...digits] },
        visualization: {
          type: 'array',
          array: digits.map(Number),
          highlights: Object.fromEntries(Array.from({ length: digits.length - mark }, (_, j) => [mark + j, 'active'])) as Record<number, string>,
          labels: Object.fromEntries(Array.from({ length: digits.length - mark }, (_, j) => [mark + j, '9'])) as Record<number, string>,
        },
      });
    }

    const result = parseInt(digits.join(''), 10);
    steps.push({
      line: 7,
      explanation: `Result: ${result}. This is the largest number <= ${n} with non-decreasing digits.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: digits.map(Number),
        highlights: Object.fromEntries(digits.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: Object.fromEntries(digits.map((d, i) => [i, d])) as Record<number, string>,
      },
    });

    return steps;
  },
};

export default monotoneIncreasingDigits;
