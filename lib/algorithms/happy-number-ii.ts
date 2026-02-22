import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const happyNumberIi: AlgorithmDefinition = {
  id: 'happy-number-ii',
  title: 'Happy Number',
  leetcodeNumber: 202,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'A happy number is defined by: starting with any positive integer, replace it by the sum of squares of its digits. Repeat until it equals 1 (happy) or loops endlessly (unhappy, always reaching 4). Use a set to detect cycles or use Floyd cycle detection.',
  tags: ['math', 'hash set', 'cycle detection'],

  code: {
    pseudocode: `function isHappy(n):
  seen = empty set
  while n != 1:
    if n in seen: return false
    seen.add(n)
    n = sum of (digit^2 for digit in n)
  return true`,

    python: `def isHappy(n):
    seen = set()
    while n != 1:
        if n in seen:
            return False
        seen.add(n)
        n = sum(int(d)**2 for d in str(n))
    return True`,

    javascript: `function isHappy(n) {
  const seen = new Set();
  while (n !== 1) {
    if (seen.has(n)) return false;
    seen.add(n);
    n = String(n).split('').reduce((s, d) => s + d*d, 0);
  }
  return true;
}`,

    java: `public boolean isHappy(int n) {
    Set<Integer> seen = new HashSet<>();
    while (n != 1) {
        if (seen.contains(n)) return false;
        seen.add(n);
        int s = 0;
        while (n > 0) { int d = n % 10; s += d*d; n /= 10; }
        n = s;
    }
    return true;
}`,
  },

  defaultInput: {
    n: 19,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number',
      type: 'number',
      defaultValue: 19,
      placeholder: '19',
      helperText: 'Positive integer to check for happiness',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const seen = new Set<number>();
    const sequence: number[] = [n];

    const digitSumSquares = (x: number): number =>
      String(x).split('').reduce((s, d) => s + Number(d) * Number(d), 0);

    steps.push({
      line: 1,
      explanation: `Check if ${n} is a happy number. Repeatedly replace by sum of digit squares.`,
      variables: { n, seen: [] },
      visualization: {
        type: 'array',
        array: [n],
        highlights: { 0: 'active' },
        labels: { 0: String(n) },
      } as ArrayVisualization,
    });

    let current = n;
    let isHappy = false;

    while (current !== 1 && !seen.has(current)) {
      seen.add(current);
      const digits = String(current).split('').map(Number);
      const squareSum = digits.reduce((s, d) => s + d * d, 0);

      steps.push({
        line: 4,
        explanation: `n = ${current}. Digits: [${digits.join(', ')}]. Sum of squares: ${digits.map(d => `${d}^2=${d*d}`).join(' + ')} = ${squareSum}.`,
        variables: { n: current, digits, squareSum, seen: [...seen] },
        visualization: {
          type: 'array',
          array: [...sequence],
          highlights: { [sequence.length - 1]: 'active' },
          labels: Object.fromEntries(sequence.map((v, i) => [i, String(v)])),
        } as ArrayVisualization,
      });

      current = squareSum;
      sequence.push(current);
    }

    if (current === 1) {
      isHappy = true;
      steps.push({
        line: 6,
        explanation: `Reached 1! ${n} is a HAPPY number. Sequence: ${sequence.join(' -> ')}.`,
        variables: { result: true, sequence },
        visualization: {
          type: 'array',
          array: [...sequence],
          highlights: Object.fromEntries(sequence.map((_, i) => [i, i === sequence.length - 1 ? 'found' : 'sorted'])),
          labels: Object.fromEntries(sequence.map((v, i) => [i, String(v)])),
        } as ArrayVisualization,
      });
    } else {
      steps.push({
        line: 2,
        explanation: `${current} was seen before. Cycle detected! ${n} is NOT a happy number. Sequence so far: ${sequence.join(' -> ')}.`,
        variables: { result: false, cycle: current, sequence },
        visualization: {
          type: 'array',
          array: [...sequence],
          highlights: Object.fromEntries(sequence.map((v, i) => [i, v === current ? 'mismatch' : 'visited'])),
          labels: Object.fromEntries(sequence.map((v, i) => [i, String(v)])),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 7,
      explanation: `Result: ${n} is ${isHappy ? 'happy' : 'not happy'}.`,
      variables: { result: isHappy },
      visualization: {
        type: 'array',
        array: sequence,
        highlights: { [sequence.length - 1]: isHappy ? 'found' : 'mismatch' },
        labels: { [sequence.length - 1]: isHappy ? 'HAPPY' : 'CYCLE' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default happyNumberIi;
