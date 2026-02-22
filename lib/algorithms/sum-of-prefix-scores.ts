import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfPrefixScores: AlgorithmDefinition = {
  id: 'sum-of-prefix-scores',
  title: 'Sum of Prefix Scores of Strings',
  leetcodeNumber: 2416,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given an array of words, compute for each word the sum of scores of all its prefixes. The score of a prefix is the number of words in the array that start with that prefix. Build a trie and count how many words pass through each node (prefix frequency). For each word, sum the prefix counts along its path in the trie.',
  tags: ['trie', 'string', 'counting', 'prefix'],

  code: {
    pseudocode: `function sumPrefixScores(words):
  trie = build trie with prefix counts
  for each word:
    node = root
    for ch in word:
      node.count += 1
      node = node.children[ch]

  scores = []
  for each word:
    node = root
    total = 0
    for ch in word:
      node = node.children[ch]
      total += node.count
    scores.append(total)
  return scores`,

    python: `def sumPrefixScores(words):
    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {'count': 0})
            node['count'] += 1
    res = []
    for w in words:
        node = trie; total = 0
        for ch in w:
            node = node[ch]; total += node['count']
        res.append(total)
    return res`,

    javascript: `function sumPrefixScores(words) {
  const trie = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) {
      node[ch] = node[ch] || { count: 0 };
      node = node[ch];
      node.count++;
    }
  }
  return words.map(w => {
    let node = trie, total = 0;
    for (const ch of w) { node = node[ch]; total += node.count; }
    return total;
  });
}`,

    java: `public int[] sumPrefixScores(String[] words) {
    Map<String, Integer> count = new HashMap<>();
    for (String w : words)
        for (int i = 1; i <= w.length(); i++)
            count.merge(w.substring(0, i), 1, Integer::sum);
    int[] res = new int[words.length];
    for (int i = 0; i < words.length; i++)
        for (int j = 1; j <= words[i].length(); j++)
            res[i] += count.get(words[i].substring(0, j));
    return res;
}`,
  },

  defaultInput: {
    words: ['abc', 'ab', 'bc', 'b'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['abc', 'ab', 'bc', 'b'],
      placeholder: 'abc,ab,bc,b',
      helperText: 'Words to compute prefix scores for',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build prefix frequency map
    const prefixCount: Record<string, number> = {};
    for (const w of words) {
      for (let i = 1; i <= w.length; i++) {
        const p = w.slice(0, i);
        prefixCount[p] = (prefixCount[p] ?? 0) + 1;
      }
    }

    steps.push({
      line: 1,
      explanation: `Building trie from words: [${words.join(', ')}]. Each node counts how many words pass through it.`,
      variables: { words: words.join(', ') },
      visualization: makeViz(words.map((w) => w.length), Object.fromEntries(words.map((_, i) => [i, 'active'])), Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    for (let wi = 0; wi < words.length; wi++) {
      const w = words[wi];
      steps.push({
        line: 3,
        explanation: `Insert "${w}": increment prefix count for each of its ${w.length} prefixes. Prefixes: ${w.split('').map((_, i) => '"' + w.slice(0, i + 1) + '"').join(', ')}.`,
        variables: { word: w, prefixes: w.split('').map((_, i) => w.slice(0, i + 1)).join(', ') },
        visualization: makeViz(words.map((ww) => ww.length), { [wi]: 'active' }, Object.fromEntries(words.map((ww, i) => [i, ww]))),
      });
    }

    steps.push({
      line: 8,
      explanation: `Prefix counts built. Example: "a" -> ${prefixCount['a'] ?? 0}, "ab" -> ${prefixCount['ab'] ?? 0}, "b" -> ${prefixCount['b'] ?? 0}.`,
      variables: Object.fromEntries(Object.entries(prefixCount).slice(0, 5).map(([k, v]) => [k, v])),
      visualization: makeViz(Object.values(prefixCount), Object.fromEntries(Object.values(prefixCount).map((_, i) => [i, 'active'])), Object.fromEntries(Object.entries(prefixCount).map(([k], i) => [i, k]))),
    });

    const scores = words.map((w) => {
      let total = 0;
      for (let i = 1; i <= w.length; i++) {
        total += prefixCount[w.slice(0, i)] ?? 0;
      }
      return total;
    });

    for (let wi = 0; wi < words.length; wi++) {
      const w = words[wi];
      const breakdown = w.split('').map((_, i) => {
        const p = w.slice(0, i + 1);
        return `"${p}"(${prefixCount[p] ?? 0})`;
      });
      steps.push({
        line: 13,
        explanation: `Score for "${w}": sum of prefix counts [${breakdown.join(' + ')}] = ${scores[wi]}.`,
        variables: { word: w, score: scores[wi] },
        visualization: makeViz(scores, { [wi]: 'found' }, Object.fromEntries(words.map((ww, i) => [i, ww]))),
      });
    }

    steps.push({
      line: 15,
      explanation: `All prefix scores computed: [${scores.join(', ')}]. Each score is the sum of how many words start with each prefix of the word.`,
      variables: { scores: scores.join(', ') },
      visualization: makeViz(scores, Object.fromEntries(scores.map((_, i) => [i, 'found'])), Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default sumOfPrefixScores;
