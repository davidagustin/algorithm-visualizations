import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const extraCharactersInString: AlgorithmDefinition = {
  id: 'extra-characters-in-string',
  title: 'Extra Characters in a String',
  leetcodeNumber: 2707,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a string s and a dictionary of words, split s into substrings where each substring is either in the dictionary or a single leftover character. Minimize the number of leftover (extra) characters. Use DP with a trie: dp[i] = minimum extra characters when considering s[0..i). For each position, either skip s[i] as extra or use the trie to find all words starting at i and update dp accordingly.',
  tags: ['trie', 'dynamic programming', 'string'],

  code: {
    pseudocode: `function minExtraChar(s, dictionary):
  trie = buildTrie(dictionary)
  n = len(s)
  dp = [infinity] * (n + 1)
  dp[0] = 0

  for i in range(n):
    dp[i + 1] = min(dp[i + 1], dp[i] + 1)  // skip s[i] as extra char
    node = trie.root
    for j in range(i, n):
      if s[j] not in node.children: break
      node = node.children[s[j]]
      if node.isEnd:
        dp[j + 1] = min(dp[j + 1], dp[i])  // use word s[i..j]
  return dp[n]`,

    python: `def minExtraChar(s, dictionary):
    trie = {}
    for w in dictionary:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node['#'] = True
    n = len(s)
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(n):
        dp[i + 1] = min(dp[i + 1], dp[i] + 1)
        node = trie
        for j in range(i, n):
            if s[j] not in node: break
            node = node[s[j]]
            if '#' in node:
                dp[j + 1] = min(dp[j + 1], dp[i])
    return dp[n]`,

    javascript: `function minExtraChar(s, dictionary) {
  const trie = {};
  for (const w of dictionary) {
    let node = trie;
    for (const ch of w) { node[ch] = node[ch] || {}; node = node[ch]; }
    node['#'] = true;
  }
  const n = s.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 0; i < n; i++) {
    dp[i + 1] = Math.min(dp[i + 1], dp[i] + 1);
    let node = trie;
    for (let j = i; j < n; j++) {
      if (!node[s[j]]) break;
      node = node[s[j]];
      if (node['#']) dp[j + 1] = Math.min(dp[j + 1], dp[i]);
    }
  }
  return dp[n];
}`,

    java: `public int minExtraChar(String s, String[] dictionary) {
    Set<String> dict = new HashSet<>(Arrays.asList(dictionary));
    int n = s.length();
    int[] dp = new int[n + 1];
    Arrays.fill(dp, n);
    dp[0] = 0;
    for (int i = 0; i < n; i++) {
        dp[i + 1] = Math.min(dp[i + 1], dp[i] + 1);
        for (int j = i + 1; j <= n; j++)
            if (dict.contains(s.substring(i, j)))
                dp[j] = Math.min(dp[j], dp[i]);
    }
    return dp[n];
}`,
  },

  defaultInput: {
    s: 'leetscode',
    dictionary: ['leet', 'code', 'leetcode'],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'leetscode',
      placeholder: 'leetscode',
      helperText: 'String to partition',
    },
    {
      name: 'dictionary',
      label: 'Dictionary',
      type: 'array',
      defaultValue: ['leet', 'code', 'leetcode'],
      placeholder: 'leet,code,leetcode',
      helperText: 'Dictionary words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const dictionary = input.dictionary as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const w of dictionary) {
      let node = trie as Record<string, unknown>;
      for (const ch of w) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    const n = s.length;
    const INF = n + 1;
    const dp = new Array(n + 1).fill(INF);
    dp[0] = 0;

    steps.push({
      line: 1,
      explanation: `Built trie from dictionary: [${dictionary.join(', ')}]. Initialize dp[0..${n}] = INF except dp[0] = 0.`,
      variables: { s, dictionary: dictionary.join(', '), n },
      visualization: makeViz(dp.map((v) => (v >= INF ? INF : v)), { 0: 'found' }, Object.fromEntries(dp.map((_, i) => [i, i.toString()]))),
    });

    for (let i = 0; i < n; i++) {
      if (dp[i] >= INF) {
        steps.push({
          line: 6,
          explanation: `dp[${i}] = INF, position ${i} unreachable. Skip.`,
          variables: { i },
          visualization: makeViz(dp.map((v) => Math.min(v, INF)), { [i]: 'mismatch' }, Object.fromEntries(dp.map((v, idx) => [idx, v >= INF ? 'INF' : v.toString()]))),
        });
        continue;
      }

      // Option 1: skip s[i] as extra character
      dp[i + 1] = Math.min(dp[i + 1], dp[i] + 1);
      steps.push({
        line: 7,
        explanation: `Position ${i} (char "${s[i]}"): Option 1 - skip as extra char. dp[${i + 1}] = min(dp[${i + 1}], dp[${i}] + 1) = ${dp[i + 1]}.`,
        variables: { i, char: s[i], 'dp[i]': dp[i], 'dp[i+1]': dp[i + 1] },
        visualization: makeViz(dp.map((v) => Math.min(v, INF)), { [i]: 'active', [i + 1]: 'comparing' }, Object.fromEntries(dp.map((v, idx) => [idx, v >= INF ? 'INF' : v.toString()]))),
      });

      // Option 2: use trie to find words starting at i
      let node = trie as Record<string, unknown>;
      for (let j = i; j < n; j++) {
        const ch = s[j];
        if (!node[ch]) break;
        node = node[ch] as Record<string, unknown>;
        if (node['#']) {
          const prev = dp[j + 1];
          dp[j + 1] = Math.min(dp[j + 1], dp[i]);
          steps.push({
            line: 11,
            explanation: `Found word "${s.slice(i, j + 1)}" in trie. dp[${j + 1}] = min(${prev >= INF ? 'INF' : prev}, ${dp[i]}) = ${dp[j + 1]}.`,
            variables: { word: s.slice(i, j + 1), start: i, end: j + 1, 'dp[j+1]': dp[j + 1] },
            visualization: makeViz(dp.map((v) => Math.min(v, INF)), { [i]: 'active', [j + 1]: 'found' }, Object.fromEntries(dp.map((v, idx) => [idx, v >= INF ? 'INF' : v.toString()]))),
          });
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `dp[${n}] = ${dp[n]}. Minimum extra characters needed: ${dp[n]}.`,
      variables: { result: dp[n], s },
      visualization: makeViz(dp.map((v) => Math.min(v, INF)), { [n]: 'found' }, Object.fromEntries(dp.map((v, i) => [i, v >= INF ? 'INF' : v.toString()]))),
    });

    return steps;
  },
};

export default extraCharactersInString;
