import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addDigits: AlgorithmDefinition = {
  id: 'add-digits',
  title: 'Add Digits',
  leetcodeNumber: 258,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an integer num, repeatedly add all its digits until the result has only one digit, and return it. The O(1) solution uses the digital root formula: 0 if num=0, 9 if num%9==0, else num%9.',
  tags: ['math', 'digital root', 'number theory'],

  code: {
    pseudocode: `function addDigits(num):
  // O(1) digital root formula
  if num == 0: return 0
  return 1 + (num - 1) % 9

// Simulation approach:
function addDigitsSim(num):
  while num >= 10:
    sum = 0
    while num > 0:
      sum += num % 10
      num = floor(num / 10)
    num = sum
  return num`,

    python: `def addDigits(num: int) -> int:
    # O(1) digital root
    if num == 0:
        return 0
    return 1 + (num - 1) % 9

# Simulation:
def addDigitsSim(num):
    while num >= 10:
        num = sum(int(d) for d in str(num))
    return num`,

    javascript: `function addDigits(num) {
  // O(1): digital root
  if (num === 0) return 0;
  return 1 + (num - 1) % 9;
}

// Simulation:
function addDigitsSim(num) {
  while (num >= 10) {
    let s = 0;
    while (num > 0) { s += num % 10; num = Math.floor(num/10); }
    num = s;
  }
  return num;
}`,

    java: `public int addDigits(int num) {
    if (num == 0) return 0;
    return 1 + (num - 1) % 9;
}`,
  },

  defaultInput: { num: 493 },

  inputFields: [
    { name: 'num', label: 'Number', type: 'number', defaultValue: 493, placeholder: '493', helperText: 'Integer to repeatedly sum digits of until single digit' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.num as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Add digits of ${original} until single digit. Will simulate step by step, then verify with O(1) formula.`,
      variables: { num: original },
      visualization: makeViz(
        String(original).split('').map(Number),
        Object.fromEntries(String(original).split('').map((_, i) => [i, 'default'])),
        Object.fromEntries(String(original).split('').map((c, i) => [i, c]))
      ),
    });

    let num = original;
    while (num >= 10) {
      const digits = String(num).split('').map(Number);
      const sum = digits.reduce((s, d) => s + d, 0);

      steps.push({
        line: 8,
        explanation: `num = ${num}. Digits: ${digits.join(' + ')} = ${sum}. New num = ${sum}.`,
        variables: { num, digits: digits.join('+'), sum },
        visualization: makeViz(
          digits,
          Object.fromEntries(digits.map((_, i) => [i, 'comparing'])),
          Object.fromEntries(digits.map((d, i) => [i, String(d)]))
        ),
      });

      num = sum;
    }

    const formula = original === 0 ? 0 : 1 + (original - 1) % 9;

    steps.push({
      line: 4,
      explanation: `Single digit reached: ${num}. O(1) formula: ${original}==0 ? 0 : 1 + (${original}-1)%9 = ${formula}. Both give ${num}.`,
      variables: { result: num, formula },
      visualization: makeViz([num], { 0: 'found' }, { 0: String(num) }),
    });

    return steps;
  },
};

export default addDigits;
