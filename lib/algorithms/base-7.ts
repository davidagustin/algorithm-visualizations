import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const base7: AlgorithmDefinition = {
  id: 'base-7',
  title: 'Base 7',
  leetcodeNumber: 504,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an integer num, return a string of its base 7 representation. Repeatedly divide by 7 and collect remainders. The remainders read in reverse order form the base-7 number. Handle negative numbers and zero as special cases.',
  tags: ['math', 'string'],

  code: {
    pseudocode: `function convertToBase7(num):
  if num == 0: return "0"
  negative = num < 0
  num = abs(num)
  digits = []
  while num > 0:
    digits.append(num % 7)
    num = num // 7
  if negative: digits.append("-")
  return reverse(digits) as string`,

    python: `def convertToBase7(num):
    if num == 0:
        return "0"
    negative = num < 0
    num = abs(num)
    digits = []
    while num:
        digits.append(str(num % 7))
        num //= 7
    if negative:
        digits.append("-")
    return "".join(reversed(digits))`,

    javascript: `function convertToBase7(num) {
  if (num === 0) return "0";
  const neg = num < 0;
  num = Math.abs(num);
  let result = "";
  while (num > 0) {
    result = (num % 7) + result;
    num = Math.floor(num / 7);
  }
  return neg ? "-" + result : result;
}`,

    java: `public String convertToBase7(int num) {
    if (num == 0) return "0";
    boolean neg = num < 0;
    num = Math.abs(num);
    StringBuilder sb = new StringBuilder();
    while (num > 0) { sb.append(num % 7); num /= 7; }
    if (neg) sb.append("-");
    return sb.reverse().toString();
}`,
  },

  defaultInput: {
    num: 100,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number',
      type: 'number',
      defaultValue: 100,
      placeholder: '100',
      helperText: 'Integer to convert to base 7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as number;
    const steps: AlgorithmStep[] = [];
    const digits: number[] = [];

    if (num === 0) {
      steps.push({
        line: 1,
        explanation: 'num = 0. Special case: return "0".',
        variables: { num, result: '0' },
        visualization: { type: 'array', array: [0], highlights: { 0: 'found' }, labels: { 0: '0' } } as ArrayVisualization,
      });
      return steps;
    }

    const negative = num < 0;
    let n = Math.abs(num);

    steps.push({
      line: 2,
      explanation: `num = ${num}. ${negative ? 'Negative number, record sign and work with abs value.' : 'Positive number.'} Will repeatedly divide by 7 and collect remainders.`,
      variables: { num, negative, workingValue: n },
      visualization: { type: 'array', array: [n], highlights: { 0: 'active' }, labels: { 0: String(n) } } as ArrayVisualization,
    });

    while (n > 0) {
      const remainder = n % 7;
      const quotient = Math.floor(n / 7);
      digits.unshift(remainder);

      steps.push({
        line: 5,
        explanation: `${n} / 7 = ${quotient} remainder ${remainder}. Prepend digit ${remainder}.`,
        variables: { current: n, quotient, remainder, digits: [...digits] },
        visualization: {
          type: 'array',
          array: [...digits],
          highlights: { 0: 'active' },
          labels: Object.fromEntries(digits.map((d, i) => [i, String(d)])),
        } as ArrayVisualization,
      });

      n = quotient;
    }

    const result = (negative ? '-' : '') + digits.join('');
    steps.push({
      line: 8,
      explanation: `Digits collected: [${digits.join(', ')}]. ${negative ? 'Prepend minus sign.' : ''} Result = "${result}".`,
      variables: { result, digits },
      visualization: {
        type: 'array',
        array: [...digits],
        highlights: Object.fromEntries(digits.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(digits.map((d, i) => [i, String(d)])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default base7;
