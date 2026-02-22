import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const countBinarySubstrings: AlgorithmDefinition = {
  id: 'count-binary-substrings',
  title: 'Count Binary Substrings',
  leetcodeNumber: 696,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a binary string s, count the number of substrings that have equal numbers of consecutive 0s and 1s (like "01", "10", "0011", "1100"). Track group lengths of consecutive characters and count valid substrings at each group boundary.',
  tags: ['string', 'two pointers', 'counting', 'groups'],

  code: {
    pseudocode: `function countBinarySubstrings(s):
  prev = 0, curr = 1, count = 0
  for i from 1 to len(s)-1:
    if s[i] == s[i-1]:
      curr++
    else:
      count += min(prev, curr)
      prev = curr
      curr = 1
  count += min(prev, curr)
  return count`,

    python: `def countBinarySubstrings(s: str) -> int:
    prev, curr, count = 0, 1, 0
    for i in range(1, len(s)):
        if s[i] == s[i-1]:
            curr += 1
        else:
            count += min(prev, curr)
            prev, curr = curr, 1
    return count + min(prev, curr)`,

    javascript: `function countBinarySubstrings(s) {
  let prev = 0, curr = 1, count = 0;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i-1]) curr++;
    else {
      count += Math.min(prev, curr);
      prev = curr; curr = 1;
    }
  }
  return count + Math.min(prev, curr);
}`,

    java: `public int countBinarySubstrings(String s) {
    int prev = 0, curr = 1, count = 0;
    for (int i = 1; i < s.length(); i++) {
        if (s.charAt(i) == s.charAt(i-1)) curr++;
        else {
            count += Math.min(prev, curr);
            prev = curr; curr = 1;
        }
    }
    return count + Math.min(prev, curr);
}`,
  },

  defaultInput: {
    s: '00110011',
  },

  inputFields: [
    {
      name: 's',
      label: 'Binary String',
      type: 'string',
      defaultValue: '00110011',
      placeholder: '00110011',
      helperText: 'Binary string containing only 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: "${s}". Track consecutive group sizes. At each group boundary, min(prev, curr) substrings are valid.`,
      variables: { s, prev: 0, curr: 1, count: 0 },
      visualization: {
        type: 'array',
        array: s.split('').map(Number),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    let prev = 0;
    let curr = 1;
    let count = 0;

    for (let i = 1; i < s.length; i++) {
      if (s[i] === s[i - 1]) {
        curr++;
        steps.push({
          line: 4,
          explanation: `s[${i}]="${s[i]}" == s[${i - 1}]="${s[i - 1]}". Same character, extend current group. curr=${curr}.`,
          variables: { i, prev, curr, count },
          visualization: {
            type: 'array',
            array: s.split('').map(Number),
            highlights: {
              [i]: 'active',
              ...Object.fromEntries(Array.from({ length: curr - 1 }, (_, j) => [i - j - 1, 'comparing'])),
            },
            labels: Object.fromEntries(s.split('').map((c, idx) => [idx, c])),
          },
        });
      } else {
        count += Math.min(prev, curr);
        steps.push({
          line: 6,
          explanation: `s[${i}]="${s[i]}" != s[${i - 1}]="${s[i - 1]}". Group boundary! min(prev=${prev}, curr=${curr}) = ${Math.min(prev, curr)} new substrings. count=${count}.`,
          variables: { i, prev, curr, newSubstrings: Math.min(prev, curr), count },
          visualization: {
            type: 'array',
            array: s.split('').map(Number),
            highlights: {
              [i]: 'found',
              [i - 1]: 'found',
              ...Object.fromEntries(Array.from({ length: curr - 1 }, (_, j) => [i - 1 - j, 'sorted'])),
            },
            labels: Object.fromEntries(s.split('').map((c, idx) => [idx, c])),
          },
        });
        prev = curr;
        curr = 1;
      }
    }

    count += Math.min(prev, curr);
    steps.push({
      line: 9,
      explanation: `End of string. Add min(prev=${prev}, curr=${curr}) = ${Math.min(prev, curr)} for the last group boundary. Total count=${count}.`,
      variables: { prev, curr, lastAdded: Math.min(prev, curr), count },
      visualization: {
        type: 'array',
        array: s.split('').map(Number),
        highlights: Object.fromEntries(s.split('').map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default countBinarySubstrings;
