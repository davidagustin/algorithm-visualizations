import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const repeatedSubstringPattern: AlgorithmDefinition = {
  id: 'repeated-substring-pattern',
  title: 'Repeated Substring Pattern',
  leetcodeNumber: 459,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string s, check if it can be constructed by taking a substring of it and appending multiple copies of the substring together. For example, "abcabc" is made of "abc" repeated twice.',
  tags: ['string', 'pattern matching', 'KMP'],

  code: {
    pseudocode: `function repeatedSubstringPattern(s):
  n = length(s)
  for len from 1 to n/2:
    if n % len == 0:
      pattern = s[0..len]
      if pattern repeated (n/len) times == s:
        return true
  return false`,

    python: `def repeatedSubstringPattern(s: str) -> bool:
    n = len(s)
    for length in range(1, n // 2 + 1):
        if n % length == 0:
            pattern = s[:length]
            if pattern * (n // length) == s:
                return True
    return False`,

    javascript: `function repeatedSubstringPattern(s) {
  const n = s.length;
  for (let len = 1; len <= Math.floor(n / 2); len++) {
    if (n % len === 0) {
      const pattern = s.slice(0, len);
      if (pattern.repeat(n / len) === s) return true;
    }
  }
  return false;
}`,

    java: `public boolean repeatedSubstringPattern(String s) {
    int n = s.length();
    for (int len = 1; len <= n / 2; len++) {
        if (n % len == 0) {
            String pattern = s.substring(0, len);
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n / len; i++) sb.append(pattern);
            if (sb.toString().equals(s)) return true;
        }
    }
    return false;
}`,
  },

  defaultInput: {
    s: 'abcabc',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abcabc',
      placeholder: 'abcabc',
      helperText: 'String to check for repeated pattern',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}", length = ${n}. Try all substring lengths from 1 to ${Math.floor(n / 2)}.`,
      variables: { s, n },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    for (let len = 1; len <= Math.floor(n / 2); len++) {
      if (n % len !== 0) {
        steps.push({
          line: 3,
          explanation: `Length ${len}: ${n} % ${len} = ${n % len} != 0, not a divisor. Skip.`,
          variables: { len, divisible: false },
          visualization: {
            type: 'array',
            array: s.split('').map((_, i) => i),
            highlights: Object.fromEntries(Array.from({ length: len }, (_, i) => [i, 'mismatch'])),
            labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
          },
        });
        continue;
      }

      const pattern = s.slice(0, len);
      const repeated = pattern.repeat(n / len);

      steps.push({
        line: 4,
        explanation: `Length ${len}: ${n} % ${len} = 0, valid divisor. Pattern = "${pattern}", repeat ${n / len} times = "${repeated}"`,
        variables: { len, pattern, repeated, matches: repeated === s },
        visualization: {
          type: 'array',
          array: s.split('').map((_, i) => i),
          highlights: Object.fromEntries(Array.from({ length: len }, (_, i) => [i, 'active'])),
          labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
        },
      });

      if (repeated === s) {
        steps.push({
          line: 6,
          explanation: `"${pattern}" repeated ${n / len} times equals "${s}". Return true!`,
          variables: { pattern, repetitions: n / len, result: true },
          visualization: {
            type: 'array',
            array: s.split('').map((_, i) => i),
            highlights: Object.fromEntries(s.split('').map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
          },
        });
        return steps;
      } else {
        steps.push({
          line: 5,
          explanation: `"${pattern}" repeated does NOT equal "${s}". Try next length.`,
          variables: { pattern, repeated, matches: false },
          visualization: {
            type: 'array',
            array: s.split('').map((_, i) => i),
            highlights: Object.fromEntries(Array.from({ length: len }, (_, i) => [i, 'mismatch'])),
            labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: 'No valid repeating pattern found. Return false.',
      variables: { result: false },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default repeatedSubstringPattern;
