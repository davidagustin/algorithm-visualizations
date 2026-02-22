import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordBreakTrie: AlgorithmDefinition = {
  id: 'word-break-trie',
  title: 'Word Break (Trie + DP)',
  leetcodeNumber: 139,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a string s and a dictionary of words, determine if s can be segmented into a space-separated sequence of dictionary words. Use a trie built from the dictionary combined with DP: dp[i] = true if s[0..i) can be segmented. For each position i where dp[i] is true, traverse the trie from s[i] to find all words that start there, setting dp[i+len] = true.',
  tags: ['trie', 'dynamic programming', 'string', 'memoization'],

  code: {
    pseudocode: `function wordBreak(s, wordDict):
  trie = buildTrie(wordDict)
  n = len(s)
  dp = [False] * (n + 1)
  dp[0] = True
  for i in range(n):
    if not dp[i]: continue
    node = trie.root
    for j in range(i, n):
      ch = s[j]
      if ch not in node.children: break
      node = node.children[ch]
      if node.isEnd:
        dp[j + 1] = True
  return dp[n]`,

    python: `def wordBreak(s, wordDict):
    trie = {}
    for w in wordDict:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node['#'] = True
    n = len(s)
    dp = [False] * (n + 1)
    dp[0] = True
    for i in range(n):
        if not dp[i]: continue
        node = trie
        for j in range(i, n):
            if s[j] not in node: break
            node = node[s[j]]
            if '#' in node:
                dp[j + 1] = True
    return dp[n]`,

    javascript: `function wordBreak(s, wordDict) {
  const trie = {};
  for (const w of wordDict) {
    let node = trie;
    for (const ch of w) { node[ch] = node[ch] || {}; node = node[ch]; }
    node['#'] = true;
  }
  const n = s.length;
  const dp = new Array(n + 1).fill(false);
  dp[0] = true;
  for (let i = 0; i < n; i++) {
    if (!dp[i]) continue;
    let node = trie;
    for (let j = i; j < n; j++) {
      if (!node[s[j]]) break;
      node = node[s[j]];
      if (node['#']) dp[j + 1] = true;
    }
  }
  return dp[n];
}`,

    java: `public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> set = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    for (int i = 1; i <= n; i++)
        for (int j = 0; j < i; j++)
            if (dp[j] && set.contains(s.substring(j, i))) { dp[i] = true; break; }
    return dp[n];
}`,
  },

  defaultInput: {
    s: 'leetcode',
    wordDict: ['leet', 'code'],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'leetcode',
      placeholder: 'leetcode',
      helperText: 'String to segment',
    },
    {
      name: 'wordDict',
      label: 'Word Dictionary',
      type: 'array',
      defaultValue: ['leet', 'code'],
      placeholder: 'leet,code',
      helperText: 'Dictionary words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordDict = input.wordDict as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const w of wordDict) {
      let node = trie as Record<string, unknown>;
      for (const ch of w) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    const n = s.length;
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;

    steps.push({
      line: 1,
      explanation: `Built trie from dictionary: [${wordDict.join(', ')}]. Initialize dp array of size ${n + 1}. dp[0] = true (empty prefix can always be segmented).`,
      variables: { s, wordDict: wordDict.join(', '), n },
      visualization: makeViz(dp.map((v) => (v ? 1 : 0)), { 0: 'found' }, Object.fromEntries(dp.map((_, i) => [i, i === 0 ? 'T' : 'F']))),
    });

    for (let i = 0; i < n; i++) {
      if (!dp[i]) {
        steps.push({
          line: 6,
          explanation: `dp[${i}] = false. Position ${i} is not reachable, skip.`,
          variables: { i, dp: JSON.stringify(dp.map((v) => v ? 1 : 0)) },
          visualization: makeViz(dp.map((v) => (v ? 1 : 0)), { [i]: 'mismatch' }, Object.fromEntries(dp.map((v, idx) => [idx, v ? 'T' : 'F']))),
        });
        continue;
      }

      steps.push({
        line: 7,
        explanation: `dp[${i}] = true. Start trie traversal from s[${i}] = "${s[i]}".`,
        variables: { i, char: s[i] },
        visualization: makeViz(dp.map((v) => (v ? 1 : 0)), { [i]: 'active' }, Object.fromEntries(dp.map((v, idx) => [idx, v ? 'T' : 'F']))),
      });

      let node = trie as Record<string, unknown>;
      for (let j = i; j < n; j++) {
        const ch = s[j];
        if (!node[ch]) break;
        node = node[ch] as Record<string, unknown>;

        if (node['#']) {
          dp[j + 1] = true;
          steps.push({
            line: 11,
            explanation: `Found word "${s.slice(i, j + 1)}" in trie ending at position ${j}. Set dp[${j + 1}] = true.`,
            variables: { word: s.slice(i, j + 1), start: i, end: j, 'dp[j+1]': true },
            visualization: makeViz(dp.map((v) => (v ? 1 : 0)), { [j + 1]: 'found', [i]: 'active' }, Object.fromEntries(dp.map((v, idx) => [idx, v ? 'T' : 'F']))),
          });
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `dp[${n}] = ${dp[n]}. The string "${s}" ${dp[n] ? 'CAN' : 'CANNOT'} be segmented into dictionary words.`,
      variables: { result: dp[n], s },
      visualization: makeViz(dp.map((v) => (v ? 1 : 0)), { [n]: dp[n] ? 'found' : 'mismatch' }, Object.fromEntries(dp.map((v, i) => [i, v ? 'T' : 'F']))),
    });

    return steps;
  },
};

export default wordBreakTrie;
