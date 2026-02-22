import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const firstUniqueCharacterIi: AlgorithmDefinition = {
  id: 'first-unique-character-ii',
  title: 'First Unique Character in a String',
  leetcodeNumber: 387,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a string s, find the first non-repeating character and return its index. If it does not exist, return -1. Use a frequency map to count occurrences, then scan left to right for the first character with count 1.',
  tags: ['hash map', 'string', 'frequency', 'array'],

  code: {
    pseudocode: `function firstUniqChar(s):
  freq = {}
  for c in s:
    freq[c] = freq.get(c, 0) + 1
  for i, c in enumerate(s):
    if freq[c] == 1:
      return i
  return -1`,
    python: `def firstUniqChar(s: str) -> int:
    freq = {}
    for c in s:
        freq[c] = freq.get(c, 0) + 1
    for i, c in enumerate(s):
        if freq[c] == 1:
            return i
    return -1`,
    javascript: `function firstUniqChar(s) {
  const freq = {};
  for (const c of s) freq[c] = (freq[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (freq[s[i]] === 1) return i;
  }
  return -1;
}`,
    java: `public int firstUniqChar(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    for (char c : s.toCharArray()) freq.merge(c, 1, Integer::sum);
    for (int i = 0; i < s.length(); i++) {
        if (freq.get(s.charAt(i)) == 1) return i;
    }
    return -1;
}`,
  },

  defaultInput: {
    s: 'leetcode',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'leetcode',
      placeholder: 'leetcode',
      helperText: 'Input string to search',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: chars as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build frequency map for string "${s}".`,
      variables: { s, freq: '{}' },
      visualization: makeViz({}, {}),
    });

    const freq: Record<string, number> = {};
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      freq[c] = (freq[c] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `char '${c}' at index ${i}: freq['${c}'] = ${freq[c]}`,
        variables: { index: i, char: c, count: freq[c] },
        visualization: makeViz({ [i]: 'active' }, { [i]: `${freq[c]}x` }),
      });
    }

    steps.push({
      line: 5,
      explanation: `Frequency map built: ${Object.entries(freq).map(([k, v]) => `'${k}':${v}`).join(', ')}. Now scan for first unique.`,
      variables: { freq: JSON.stringify(freq) },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const count = freq[c];
      if (count === 1) {
        steps.push({
          line: 6,
          explanation: `Index ${i}: char '${c}' has frequency 1. This is the first unique character.`,
          variables: { i, char: c, freq: count, result: i },
          visualization: makeViz({ [i]: 'found' }, { [i]: 'result' }),
        });
        return steps;
      } else {
        steps.push({
          line: 6,
          explanation: `Index ${i}: char '${c}' has frequency ${count} (not unique). Skip.`,
          variables: { i, char: c, freq: count },
          visualization: makeViz({ [i]: 'mismatch' }, { [i]: `${count}x` }),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: 'No unique character found. Return -1.',
      variables: { result: -1 },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default firstUniqueCharacterIi;
