import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validAnagram: AlgorithmDefinition = {
  id: 'valid-anagram',
  title: 'Valid Anagram',
  leetcodeNumber: 242,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given two strings s and t, return true if t is an anagram of s. An anagram uses all characters of the original string exactly once. Count character frequencies with a hash map and compare.',
  tags: ['hash map', 'string', 'sorting', 'counting'],

  code: {
    pseudocode: `function isAnagram(s, t):
  if len(s) != len(t): return false
  count = {}
  for char in s:
    count[char] = count.get(char, 0) + 1
  for char in t:
    count[char] = count.get(char, 0) - 1
    if count[char] < 0: return false
  return true`,

    python: `def isAnagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        count[c] = count.get(c, 0) - 1
        if count[c] < 0:
            return False
    return True`,

    javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  for (const c of t) {
    count[c] = (count[c] || 0) - 1;
    if (count[c] < 0) return false;
  }
  return true;
}`,

    java: `public boolean isAnagram(String s, String t) {
    if (s.length() != t.length()) return false;
    Map<Character, Integer> count = new HashMap<>();
    for (char c : s.toCharArray()) count.merge(c, 1, Integer::sum);
    for (char c : t.toCharArray()) {
        count.merge(c, -1, Integer::sum);
        if (count.get(c) < 0) return false;
    }
    return true;
}`,
  },

  defaultInput: {
    s: 'anagram',
    t: 'nagaram',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'anagram',
      placeholder: 'anagram',
      helperText: 'First string to compare',
    },
    {
      name: 't',
      label: 'String T',
      type: 'string',
      defaultValue: 'nagaram',
      placeholder: 'nagaram',
      helperText: 'Second string to compare',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];
    const count: Record<string, number> = {};

    const sArr = s.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      mapEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: { label: 'Char Count Map', entries: mapEntries },
    });

    const mapToEntries = () =>
      Object.entries(count).map(([k, v]) => ({ key: k, value: String(v) }));

    steps.push({
      line: 1,
      explanation: `Check if "${t}" is an anagram of "${s}". ${s.length !== t.length ? `Lengths differ (${s.length} vs ${t.length}) — immediately false.` : `Both have length ${s.length}.`}`,
      variables: { s, t, 'len(s)': s.length, 'len(t)': t.length },
      visualization: makeViz(sArr, {}, {}, []),
    });

    if (s.length !== t.length) {
      steps.push({
        line: 2,
        explanation: `Lengths differ (${s.length} != ${t.length}). Return false immediately.`,
        variables: { result: false },
        visualization: makeViz(sArr, Object.fromEntries(sArr.map((_, i) => [i, 'mismatch'])), {}, []),
      });
      return steps;
    }

    // Count s characters
    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      count[ch] = (count[ch] || 0) + 1;
      steps.push({
        line: 4,
        explanation: `Count s[${i}] = '${ch}'. Increment count['${ch}'] to ${count[ch]}.`,
        variables: { i, char: ch, 'count[char]': count[ch] },
        visualization: makeViz(sArr, { [i]: 'active' }, { [i]: ch }, mapToEntries()),
      });
    }

    // Decrement for t characters
    const tArr = t.split('').map((c) => c.charCodeAt(0));
    for (let i = 0; i < t.length; i++) {
      const ch = t[i];
      count[ch] = (count[ch] || 0) - 1;

      if (count[ch] < 0) {
        steps.push({
          line: 7,
          explanation: `t[${i}] = '${ch}': count['${ch}'] = ${count[ch]} < 0. '${ch}' appears more in t than s. Return false.`,
          variables: { i, char: ch, 'count[char]': count[ch] },
          visualization: makeViz(tArr, { [i]: 'mismatch' }, { [i]: ch }, mapToEntries()),
        });
        return steps;
      }

      steps.push({
        line: 6,
        explanation: `t[${i}] = '${ch}'. Decrement count['${ch}'] to ${count[ch]}.`,
        variables: { i, char: ch, 'count[char]': count[ch] },
        visualization: makeViz(tArr, { [i]: 'comparing' }, { [i]: ch }, mapToEntries()),
      });
    }

    const allZero = Object.values(count).every((v) => v === 0);
    steps.push({
      line: 8,
      explanation: `All counts are zero (every character balanced). "${t}" IS an anagram of "${s}". Return true.`,
      variables: { result: true, count: { ...count } },
      visualization: makeViz(
        tArr,
        Object.fromEntries(tArr.map((_, i) => [i, 'found'])),
        {},
        mapToEntries()
      ),
    });

    void allZero;
    return steps;
  },
};

export default validAnagram;
