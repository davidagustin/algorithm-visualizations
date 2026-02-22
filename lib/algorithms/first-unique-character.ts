import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const firstUniqueCharacter: AlgorithmDefinition = {
  id: 'first-unique-character',
  title: 'First Unique Character in a String',
  leetcodeNumber: 387,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a string s, find the first non-repeating character and return its index. If no such character exists, return -1. First count all character frequencies, then scan left to right for the first with frequency 1.',
  tags: ['hash map', 'string', 'counting', 'queue'],

  code: {
    pseudocode: `function firstUniqChar(s):
  count = {}
  for char in s:
    count[char] = count.get(char, 0) + 1
  for i = 0 to len(s)-1:
    if count[s[i]] == 1:
      return i
  return -1`,

    python: `def firstUniqChar(s: str) -> int:
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for i, c in enumerate(s):
        if count[c] == 1:
            return i
    return -1`,

    javascript: `function firstUniqChar(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (let i = 0; i < s.length; i++) {
    if (count[s[i]] === 1) return i;
  }
  return -1;
}`,

    java: `public int firstUniqChar(String s) {
    Map<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);
    for (int i = 0; i < s.length(); i++) {
        if (count.get(s.charAt(i)) == 1) return i;
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
      helperText: 'String to search for first unique character',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};

    const sArr = s.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      entries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sArr],
      highlights,
      labels,
      auxData: { label: 'Char Frequency', entries },
    });

    const mapToEntries = () =>
      Object.entries(count).map(([k, v]) => ({ key: `'${k}'`, value: String(v) }));

    steps.push({
      line: 1,
      explanation: `Find first non-repeating character in "${s}". First pass: count all frequencies.`,
      variables: { s },
      visualization: makeViz({}, {}, []),
    });

    // Count frequencies
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      count[ch] = (count[ch] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `s[${i}] = '${ch}'. Increment count['${ch}'] to ${count[ch]}.`,
        variables: { i, char: ch, 'count[char]': count[ch] },
        visualization: makeViz({ [i]: 'active' }, { [i]: ch }, mapToEntries()),
      });
    }

    steps.push({
      line: 4,
      explanation: `Frequency count complete. Now scan left-to-right for first character with count = 1.`,
      variables: { count: { ...count } },
      visualization: makeViz({}, {}, mapToEntries()),
    });

    // Find first unique
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      const freq = count[ch];

      steps.push({
        line: 5,
        explanation: `Check s[${i}] = '${ch}'. Frequency = ${freq}. ${freq === 1 ? 'This is the first unique character!' : 'Appears more than once, skip.'}`,
        variables: { i, char: ch, freq },
        visualization: makeViz(
          { [i]: freq === 1 ? 'found' : 'mismatch' },
          { [i]: `×${freq}` },
          mapToEntries()
        ),
      });

      if (freq === 1) {
        steps.push({
          line: 6,
          explanation: `First unique character is '${ch}' at index ${i}. Return ${i}.`,
          variables: { result: i, char: ch },
          visualization: makeViz(
            { ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'visited'])), [i]: 'found' },
            { [i]: `#${i}` },
            mapToEntries()
          ),
        });
        return steps;
      }
    }

    steps.push({
      line: 7,
      explanation: `No unique character found. All characters appear more than once. Return -1.`,
      variables: { result: -1 },
      visualization: makeViz(Object.fromEntries(sArr.map((_, i) => [i, 'mismatch'])), {}, mapToEntries()),
    });

    return steps;
  },
};

export default firstUniqueCharacter;
