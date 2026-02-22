import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverse32BitInteger: AlgorithmDefinition = {
  id: 'reverse-32-bit-integer',
  title: 'Reverse 32-Bit Integer',
  leetcodeNumber: 7,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Reverse the digits of a signed 32-bit integer. Extract the last digit using modulo, build the reversed number by multiplying by 10 and adding. Return 0 if the result overflows 32-bit range.',
  tags: ['Math'],
  code: {
    pseudocode: `function reverse(x):
  result = 0
  sign = 1 if x >= 0 else -1
  x = abs(x)
  while x > 0:
    digit = x mod 10
    x = x / 10 (integer division)
    result = result * 10 + digit
    if result > 2^31 - 1:
      return 0
  return sign * result`,
    python: `def reverse(x):
    sign = 1 if x >= 0 else -1
    x = abs(x)
    result = 0
    while x > 0:
        digit = x % 10
        x //= 10
        result = result * 10 + digit
        if result > 2**31 - 1:
            return 0
    return sign * result`,
    javascript: `function reverse(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  let result = 0;
  while (x > 0) {
    const digit = x % 10;
    x = Math.floor(x / 10);
    result = result * 10 + digit;
    if (result > 2**31 - 1) return 0;
  }
  return sign * result;
}`,
    java: `public int reverse(int x) {
    int sign = x >= 0 ? 1 : -1;
    long abs = Math.abs((long) x);
    long result = 0;
    while (abs > 0) {
        long digit = abs % 10;
        abs /= 10;
        result = result * 10 + digit;
        if (result > Integer.MAX_VALUE) return 0;
    }
    return (int)(sign * result);
}`,
  },
  defaultInput: { x: 123 },
  inputFields: [
    {
      name: 'x',
      label: 'Integer',
      type: 'number',
      defaultValue: 123,
      placeholder: 'e.g. 123',
      helperText: 'A 32-bit signed integer to reverse',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];
    const sign = x >= 0 ? 1 : -1;
    let remaining = Math.abs(x);
    let result = 0;

    // Build digit array for visualization
    const digits = String(Math.abs(x)).split('').map(Number);
    const n = digits.length;
    const reversedDigits: number[] = [];

    steps.push({
      line: 1,
      explanation: `Reverse the digits of ${x}. Sign: ${sign > 0 ? 'positive' : 'negative'}, absolute value: ${Math.abs(x)}.`,
      variables: { x, sign, remaining: Math.abs(x), result: 0 },
      visualization: {
        type: 'array',
        array: digits,
        highlights: Object.fromEntries(digits.map((_, i) => [i, 'default'])),
        labels: Object.fromEntries(digits.map((_, i) => [i, `d${i}`])),
        auxData: {
          label: 'Reversal',
          entries: [
            { key: 'Remaining', value: String(Math.abs(x)) },
            { key: 'Result', value: '0' },
          ],
        },
      },
    });

    let step = 0;
    while (remaining > 0) {
      const digit = remaining % 10;
      remaining = Math.floor(remaining / 10);
      result = result * 10 + digit;
      reversedDigits.push(digit);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (i < n - step - 1) {
          highlights[i] = 'default';
        } else if (i === n - step - 1) {
          highlights[i] = 'active';
          labels[i] = 'extract';
        } else {
          highlights[i] = 'visited';
        }
      }

      steps.push({
        line: 6,
        explanation: `Extract last digit: ${digit}. Remaining: ${remaining}. Build result: ${result}.`,
        variables: { digit, remaining, result, step: step + 1 },
        visualization: {
          type: 'array',
          array: digits,
          highlights,
          labels,
          auxData: {
            label: 'Reversal Progress',
            entries: [
              { key: 'Extracted digit', value: String(digit) },
              { key: 'Remaining', value: String(remaining) },
              { key: 'Result so far', value: String(result) },
              { key: 'Reversed digits', value: reversedDigits.join('') },
            ],
          },
        },
      });

      // Check overflow
      if (result > 2147483647) {
        steps.push({
          line: 8,
          explanation: `Overflow! ${result} > 2^31-1. Return 0.`,
          variables: { result: 0 },
          visualization: {
            type: 'array',
            array: digits,
            highlights: Object.fromEntries(digits.map((_, i) => [i, 'mismatch'])),
            labels: {},
          },
        });
        return steps;
      }

      step++;
    }

    const finalResult = sign * result;
    const finalDigits = String(Math.abs(finalResult)).split('').map(Number);

    steps.push({
      line: 10,
      explanation: `Reversal complete! ${x} reversed is ${finalResult}.`,
      variables: { result: finalResult },
      visualization: {
        type: 'array',
        array: finalDigits,
        highlights: Object.fromEntries(finalDigits.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(finalDigits.map((_, i) => [i, `d${i}`])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Input', value: String(x) },
            { key: 'Output', value: String(finalResult) },
          ],
        },
      },
    });

    return steps;
  },
};

export default reverse32BitInteger;
