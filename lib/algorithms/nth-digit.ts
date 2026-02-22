import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nthDigit: AlgorithmDefinition = {
  id: 'nth-digit',
  title: 'Nth Digit',
  leetcodeNumber: 400,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'In the infinite sequence 1, 2, 3, 4, ..., 9, 10, 11, ..., find the nth digit. First determine how many digits each range of numbers contributes (1-digit numbers contribute 9, 2-digit contribute 180, etc.). Find which range contains the nth digit, then pinpoint the exact number and digit within it.',
  tags: ['math', 'binary search'],

  code: {
    pseudocode: `function findNthDigit(n):
  digits = 1
  start = 1
  count = 9
  while n > digits * count:
    n -= digits * count
    digits += 1
    start *= 10
    count *= 10
  num = start + (n - 1) / digits
  digitIndex = (n - 1) % digits
  return num[digitIndex]`,

    python: `def findNthDigit(n):
    digits, start, count = 1, 1, 9
    while n > digits * count:
        n -= digits * count
        digits += 1
        start *= 10
        count *= 10
    num = start + (n - 1) // digits
    return int(str(num)[(n - 1) % digits])`,

    javascript: `function findNthDigit(n) {
  let digits = 1, start = 1, count = 9;
  while (n > digits * count) {
    n -= digits * count;
    digits++;
    start *= 10;
    count *= 10;
  }
  const num = start + Math.floor((n - 1) / digits);
  return parseInt(String(num)[(n - 1) % digits]);
}`,

    java: `public int findNthDigit(int n) {
    long digits = 1, start = 1, count = 9;
    while (n > digits * count) {
        n -= digits * count;
        digits++;
        start *= 10;
        count *= 10;
    }
    long num = start + (n - 1) / digits;
    return String.valueOf(num).charAt((int)((n-1) % digits)) - '0';
}`,
  },

  defaultInput: {
    n: 11,
  },

  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 11,
      placeholder: '11',
      helperText: 'Find the nth digit in the infinite sequence 1,2,3,...',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nInput = input.n as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find the ${nInput}th digit in sequence 1,2,3,...,9,10,11,... Groups: 1-digit (1-9, 9 numbers x 1 digit = 9), 2-digit (10-99, 90 numbers x 2 digits = 180), etc.`,
      variables: { n: nInput },
      visualization: {
        type: 'array',
        array: [9, 90, 900],
        highlights: {},
        labels: { 0: '1-digit:9', 1: '2-digit:90', 2: '3-digit:900' },
      } as ArrayVisualization,
    });

    let n = nInput;
    let digits = 1;
    let start = 1;
    let count = 9;

    while (n > digits * count) {
      steps.push({
        line: 3,
        explanation: `n=${n} > ${digits}*${count}=${digits * count}. Skip all ${digits}-digit numbers. Remove ${digits * count} from n.`,
        variables: { n, digits, count, contribution: digits * count },
        visualization: {
          type: 'array',
          array: [digits * count, n],
          highlights: { 0: 'mismatch', 1: 'active' },
          labels: { 0: `${digits}-digit group`, 1: `remaining n=${n}` },
        } as ArrayVisualization,
      });
      n -= digits * count;
      digits++;
      start *= 10;
      count *= 10;
    }

    steps.push({
      line: 4,
      explanation: `n=${n} <= ${digits}*${count}=${digits * count}. We are in the ${digits}-digit number range starting at ${start}.`,
      variables: { n, digits, start, count },
      visualization: {
        type: 'array',
        array: [start, start + count - 1],
        highlights: { 0: 'active', 1: 'active' },
        labels: { 0: `start=${start}`, 1: `end=${start + count - 1}` },
      } as ArrayVisualization,
    });

    const num = start + Math.floor((n - 1) / digits);
    const digitIndex = (n - 1) % digits;
    const numStr = String(num);
    const result = parseInt(numStr[digitIndex]);

    steps.push({
      line: 5,
      explanation: `Target number: start + (n-1)/digits = ${start} + ${Math.floor((n - 1) / digits)} = ${num}. The number is "${numStr}".`,
      variables: { num, digitIndex, numStr },
      visualization: {
        type: 'array',
        array: numStr.split('').map(Number),
        highlights: {},
        labels: Object.fromEntries(numStr.split('').map((d, i) => [i, d])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 6,
      explanation: `Digit index within "${numStr}": (n-1) % digits = ${n - 1} % ${digits} = ${digitIndex}. The digit at index ${digitIndex} is ${result}.`,
      variables: { numStr, digitIndex, result },
      visualization: {
        type: 'array',
        array: numStr.split('').map(Number),
        highlights: { [digitIndex]: 'found' },
        labels: Object.fromEntries(numStr.split('').map((d, i) => [i, i === digitIndex ? `-> ${d}` : d])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default nthDigit;
