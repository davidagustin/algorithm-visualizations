import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumLengthOfStringAfterOperations: AlgorithmDefinition = {
  id: 'minimum-length-of-string-after-operations',
  title: 'Minimum Length of String After Operations',
  leetcodeNumber: 3223,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s, repeatedly select any index i where there is at least one equal character to the left and right, then delete the closest such characters. Return the minimum length of the resulting string. For each character, if its count is odd keep 1, if even keep 2.',
  tags: ['sliding window', 'hash map', 'string', 'greedy'],

  code: {
    pseudocode: `function minimumLength(s):
  freq = count frequency of each char in s
  result = 0
  for each char c:
    if freq[c] == 0: continue
    if freq[c] % 2 == 1:
      result += 1  // keep 1 of odd-count chars
    else:
      result += 2  // keep 2 of even-count chars
  return result`,

    python: `def minimumLength(s: str) -> int:
    from collections import Counter
    freq = Counter(s)
    result = 0
    for count in freq.values():
        result += 1 if count % 2 == 1 else 2
    return result`,

    javascript: `function minimumLength(s) {
  const freq = new Map();
  for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);
  let result = 0;
  for (const count of freq.values()) {
    result += count % 2 === 1 ? 1 : 2;
  }
  return result;
}`,

    java: `public int minimumLength(String s) {
    int[] freq = new int[26];
    for (char c : s.toCharArray()) freq[c - 'a']++;
    int result = 0;
    for (int count : freq) {
        if (count == 0) continue;
        result += count % 2 == 1 ? 1 : 2;
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'abaacbcbb',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abaacbcbb',
      placeholder: 'abaacbcbb',
      helperText: 'Lowercase English string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const arr = s.split('').map(c => c.charCodeAt(0) - 96);

    steps.push({
      line: 1,
      explanation: `Count character frequencies in "${s}". Each char with odd count contributes 1 to min length; even count contributes 2.`,
      variables: { length: s.length },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    const freq = new Map<string, number>();
    for (const c of s) freq.set(c, (freq.get(c) || 0) + 1);

    steps.push({
      line: 2,
      explanation: `Frequencies: ${[...freq.entries()].map(([c, f]) => `${c}:${f}`).join(', ')}. Odd-count chars keep 1; even-count chars keep 2 (must have one on each side).`,
      variables: Object.fromEntries([...freq.entries()].map(([c, f]) => [c, f])),
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(s.split('').map((c, i) => [i, freq.get(c)! % 2 === 1 ? 'active' : 'found'])),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    let result = 0;

    for (const [c, count] of freq) {
      const contribution = count % 2 === 1 ? 1 : 2;
      result += contribution;

      steps.push({
        line: 5,
        explanation: `Char "${c}": count = ${count} (${count % 2 === 1 ? 'odd' : 'even'}). Keeps ${contribution} occurrence(s). Running result = ${result}.`,
        variables: { char: c, count, contribution, result },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(
            s.split('').map((ch, i) => [i, ch === c ? 'found' : 'default'])
          ),
          labels: { 0: `"${c}" x${count}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 9,
      explanation: `Minimum length after all operations = ${result}. The string cannot be reduced further.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumLengthOfStringAfterOperations;
