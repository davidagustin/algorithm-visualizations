import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfDistinctSubstrings: AlgorithmDefinition = {
  id: 'number-of-distinct-substrings',
  title: 'Number of Distinct Substrings in a String',
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Count the number of distinct non-empty substrings of a given string using a trie. For each starting position i, insert s[i..n) into the trie character by character. Each new node created represents a new distinct substring. The total count of new nodes created equals the number of distinct substrings.',
  tags: ['trie', 'string', 'counting'],

  code: {
    pseudocode: `function countDistinctSubstrings(s):
  root = TrieNode()
  count = 0
  n = len(s)
  for i in range(n):
    node = root
    for j in range(i, n):
      ch = s[j]
      if ch not in node.children:
        node.children[ch] = TrieNode()
        count += 1  // new distinct substring found
      node = node.children[ch]
  return count`,

    python: `def countDistinctSubstrings(s: str) -> int:
    trie = {}
    count = 0
    for i in range(len(s)):
        node = trie
        for j in range(i, len(s)):
            ch = s[j]
            if ch not in node:
                node[ch] = {}
                count += 1
            node = node[ch]
    return count`,

    javascript: `function countDistinctSubstrings(s) {
  const trie = {};
  let count = 0;
  for (let i = 0; i < s.length; i++) {
    let node = trie;
    for (let j = i; j < s.length; j++) {
      const ch = s[j];
      if (!node[ch]) { node[ch] = {}; count++; }
      node = node[ch];
    }
  }
  return count;
}`,

    java: `public int countDistinctSubstrings(String s) {
    Map<Character, Object> root = new HashMap<>();
    int count = 0;
    for (int i = 0; i < s.length(); i++) {
        Map node = root;
        for (int j = i; j < s.length(); j++) {
            char ch = s.charAt(j);
            if (!node.containsKey(ch)) { node.put(ch, new HashMap<>()); count++; }
            node = (Map) node.get(ch);
        }
    }
    return count;
}`,
  },

  defaultInput: {
    s: 'abab',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abab',
      placeholder: 'abab',
      helperText: 'String to count distinct substrings of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const n = s.length;
    const trie: Record<string, unknown> = {};
    let count = 0;
    const countPerStart: number[] = new Array(n).fill(0);

    steps.push({
      line: 1,
      explanation: `Count distinct substrings of "${s}" using a trie. For each starting position i, insert all suffixes s[i..] into the trie. Each new node = one new distinct substring.`,
      variables: { s, length: n },
      visualization: makeViz(s.split('').map(() => 0), {}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    for (let i = 0; i < n; i++) {
      let node = trie as Record<string, unknown>;
      let newFromHere = 0;

      steps.push({
        line: 4,
        explanation: `Starting position ${i}: insert suffix "${s.slice(i)}" into trie.`,
        variables: { startIndex: i, suffix: s.slice(i) },
        visualization: makeViz(s.split('').map(() => count), { [i]: 'active' }, Object.fromEntries(s.split('').map((c, idx) => [idx, c]))),
      });

      for (let j = i; j < n; j++) {
        const ch = s[j];
        const isNew = !node[ch];
        if (!node[ch]) {
          node[ch] = {};
          count++;
          newFromHere++;
        }
        node = node[ch] as Record<string, unknown>;

        if (isNew) {
          steps.push({
            line: 8,
            explanation: `New node created for "${s.slice(i, j + 1)}" (char "${ch}" at depth ${j - i + 1}). Total distinct substrings so far: ${count}.`,
            variables: { substring: s.slice(i, j + 1), totalCount: count },
            visualization: makeViz(
              s.split('').map((_, idx) => (idx >= i && idx <= j ? 1 : 0)),
              { [i]: 'active', ...Object.fromEntries([...Array(j - i + 1)].map((_, k) => [i + k, k === j - i ? 'found' : 'active'])) },
              Object.fromEntries(s.split('').map((c, idx) => [idx, c]))
            ),
          });
        }
      }

      countPerStart[i] = newFromHere;
      steps.push({
        line: 11,
        explanation: `Suffix starting at ${i}: added ${newFromHere} new distinct substring(s). Running total: ${count}.`,
        variables: { startIndex: i, newSubstrings: newFromHere, total: count },
        visualization: makeViz(countPerStart, { [i]: 'found' }, Object.fromEntries(s.split('').map((c, idx) => [idx, c]))),
      });
    }

    steps.push({
      line: 12,
      explanation: `Total distinct substrings in "${s}": ${count}. Trie nodes created = distinct substrings (each new node = new unique prefix = new unique substring).`,
      variables: { result: count, s },
      visualization: makeViz(countPerStart, Object.fromEntries(countPerStart.map((_, i) => [i, 'found'])), Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default numberOfDistinctSubstrings;
