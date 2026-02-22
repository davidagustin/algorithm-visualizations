import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stringToIntegerAtoi: AlgorithmDefinition = {
  id: 'string-to-integer-atoi',
  title: 'String to Integer (atoi)',
  leetcodeNumber: 8,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Implement the atoi function: skip leading whitespace, read optional sign (+/-), then read digits until a non-digit is found. Clamp the result to the 32-bit integer range [-2^31, 2^31-1]. Handle edge cases like no digits, leading zeros, and overflow.',
  tags: ['String', 'Math'],
  code: {
    pseudocode: `function myAtoi(s):
  i = 0
  while s[i] == ' ': i++
  sign = 1
  if s[i] in ('+', '-'):
    if s[i] == '-': sign = -1
    i++
  result = 0
  while i < len(s) and s[i] is digit:
    result = result*10 + int(s[i])
    if result*sign < INT_MIN: return INT_MIN
    if result*sign > INT_MAX: return INT_MAX
    i++
  return result * sign`,
    python: `def myAtoi(s):
    INT_MAX, INT_MIN = 2**31 - 1, -(2**31)
    i, sign, result = 0, 1, 0
    while i < len(s) and s[i] == ' ': i += 1
    if i < len(s) and s[i] in ('+', '-'):
        sign = -1 if s[i] == '-' else 1
        i += 1
    while i < len(s) and s[i].isdigit():
        result = result * 10 + int(s[i])
        if result * sign < INT_MIN: return INT_MIN
        if result * sign > INT_MAX: return INT_MAX
        i += 1
    return result * sign`,
    javascript: `function myAtoi(s) {
  const INT_MAX = 2**31-1, INT_MIN = -(2**31);
  let i = 0, sign = 1, result = 0;
  while (s[i] === ' ') i++;
  if (s[i] === '+' || s[i] === '-') {
    sign = s[i] === '-' ? -1 : 1; i++;
  }
  while (i < s.length && s[i] >= '0' && s[i] <= '9') {
    result = result * 10 + parseInt(s[i++]);
    if (result * sign < INT_MIN) return INT_MIN;
    if (result * sign > INT_MAX) return INT_MAX;
  }
  return result * sign;
}`,
    java: `public int myAtoi(String s) {
    int i = 0, sign = 1;
    long result = 0;
    while (i < s.length() && s.charAt(i) == ' ') i++;
    if (i < s.length() && (s.charAt(i)=='+' || s.charAt(i)=='-'))
        sign = s.charAt(i++) == '-' ? -1 : 1;
    while (i < s.length() && Character.isDigit(s.charAt(i))) {
        result = result * 10 + (s.charAt(i++) - '0');
        if (result * sign < Integer.MIN_VALUE) return Integer.MIN_VALUE;
        if (result * sign > Integer.MAX_VALUE) return Integer.MAX_VALUE;
    }
    return (int)(result * sign);
}`,
  },
  defaultInput: { s: '   -42abc' },
  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: '   -42abc',
      placeholder: 'e.g. "   -42abc"',
      helperText: 'String to parse as integer (may have leading spaces and sign)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const INT_MAX = 2 ** 31 - 1;
    const INT_MIN = -(2 ** 31);
    const chars = s.split('');
    const arr = chars.map(c => c.charCodeAt(0));

    const makeViz = (
      idx: number,
      phase: string,
      sign: number,
      result: number,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < chars.length; k++) {
        labels[k] = chars[k] === ' ' ? '·' : chars[k];
        if (k < idx) {
          highlights[k] = 'visited';
        } else if (k === idx) {
          highlights[k] = 'active';
        } else {
          highlights[k] = 'default';
        }
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'atoi Parsing',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Index i', value: String(idx) },
            { key: 'Sign', value: sign === -1 ? '-1' : '+1' },
            { key: 'Result so far', value: String(result * sign) },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Parse "${s}" as integer. Steps: (1) skip whitespace, (2) read sign, (3) read digits, (4) clamp to 32-bit range.`,
      variables: { s },
      visualization: makeViz(0, 'Start', 1, 0),
    });

    let i = 0;
    let sign = 1;
    let result = 0;

    // Skip whitespace
    while (i < chars.length && chars[i] === ' ') {
      steps.push({
        line: 3,
        explanation: `s[${i}]='${chars[i]}' is whitespace. Skip it.`,
        variables: { i },
        visualization: makeViz(i, 'Skip whitespace', sign, result),
      });
      i++;
    }

    // Read sign
    if (i < chars.length && (chars[i] === '+' || chars[i] === '-')) {
      sign = chars[i] === '-' ? -1 : 1;
      steps.push({
        line: 5,
        explanation: `s[${i}]='${chars[i]}'. Sign detected: ${sign === -1 ? 'negative' : 'positive'}.`,
        variables: { i, sign },
        visualization: makeViz(i, 'Read sign', sign, result),
      });
      i++;
    }

    // Read digits
    while (i < chars.length && chars[i] >= '0' && chars[i] <= '9') {
      const digit = parseInt(chars[i]);
      result = result * 10 + digit;

      if (result * sign < INT_MIN) {
        steps.push({
          line: 10,
          explanation: `result=${result * sign} < INT_MIN=${INT_MIN}. Clamp to ${INT_MIN}.`,
          variables: { result: INT_MIN },
          visualization: makeViz(i, 'Overflow (clamp min)', sign, INT_MIN / sign),
        });
        return steps;
      }

      if (result * sign > INT_MAX) {
        steps.push({
          line: 11,
          explanation: `result=${result * sign} > INT_MAX=${INT_MAX}. Clamp to ${INT_MAX}.`,
          variables: { result: INT_MAX },
          visualization: makeViz(i, 'Overflow (clamp max)', sign, INT_MAX / sign),
        });
        return steps;
      }

      steps.push({
        line: 9,
        explanation: `s[${i}]='${chars[i]}' (digit=${digit}). result = ${result / 10} * 10 + ${digit} = ${result}. Signed: ${result * sign}.`,
        variables: { i, digit, result, signed: result * sign },
        visualization: makeViz(i, 'Read digit', sign, result),
      });

      i++;
    }

    if (i < chars.length) {
      steps.push({
        line: 8,
        explanation: `s[${i}]='${chars[i]}' is not a digit. Stop reading.`,
        variables: { i, char: chars[i] },
        visualization: makeViz(i, 'Non-digit — stop', sign, result),
      });
    }

    const finalResult = result * sign;
    steps.push({
      line: 12,
      explanation: `Final result: ${result} * sign(${sign}) = ${finalResult}.`,
      variables: { result: finalResult },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(chars.map((_, k) => [k, k < i ? 'found' : 'visited'])),
        labels: Object.fromEntries(chars.map((c, k) => [k, c === ' ' ? '·' : c])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Input', value: s },
            { key: 'Integer', value: String(finalResult) },
          ],
        },
      },
    });

    return steps;
  },
};

export default stringToIntegerAtoi;
