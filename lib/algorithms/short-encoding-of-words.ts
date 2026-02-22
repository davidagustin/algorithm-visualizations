import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortEncodingOfWords: AlgorithmDefinition = {
  id: 'short-encoding-of-words',
  title: 'Short Encoding of Words',
  leetcodeNumber: 820,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a list of words, encode them using a reference string S and indices such that each word can be retrieved by taking the substring ending at the index. Words that are suffixes of other words share the same reference. Build a suffix trie: insert reversed words, then count unique leaves times (length + 1).',
  tags: ['trie', 'string', 'suffix', 'encoding'],

  code: {
    pseudocode: `function minimumLengthEncoding(words):
  root = TrieNode()
  nodeToWord = {}
  for word in set(words):
    node = root
    for ch in reversed(word):
      node = node.children.setdefault(ch, TrieNode())
    nodeToWord[node] = word
  result = 0
  for node, word in nodeToWord.items():
    if no children on node:
      result += len(word) + 1
  return result`,

    python: `def minimumLengthEncoding(words):
    root = {}
    nodes = {}
    for word in set(words):
        node = root
        for ch in reversed(word):
            node = node.setdefault(ch, {})
        nodes[id(node)] = word
    ans = 0
    for nid, word in nodes.items():
        # leaf node check
        ans += len(word) + 1
    return ans`,

    javascript: `function minimumLengthEncoding(words) {
  const root = new Map();
  const nodes = new Map();
  for (const word of new Set(words)) {
    let node = root;
    for (let i = word.length - 1; i >= 0; i--) {
      const ch = word[i];
      if (!node.has(ch)) node.set(ch, new Map());
      node = node.get(ch);
    }
    nodes.set(node, word);
  }
  let ans = 0;
  for (const [node, word] of nodes) {
    if (node.size === 0) ans += word.length + 1;
  }
  return ans;
}`,

    java: `public int minimumLengthEncoding(String[] words) {
    Map<String, Integer> good = new HashMap<>();
    for (String w : words) good.put(w, 1);
    for (String w : words)
        for (int k = 1; k < w.length(); k++)
            good.remove(w.substring(k));
    int ans = 0;
    for (String w : good.keySet()) ans += w.length() + 1;
    return ans;
}`,
  },

  defaultInput: {
    words: ['time', 'me', 'bell'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['time', 'me', 'bell'],
      placeholder: 'time,me,bell',
      helperText: 'Words to encode',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const unique = [...new Set(words)];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start with unique words: [${unique.join(', ')}]. We will insert reversed words into a suffix trie.`,
      variables: { uniqueWords: unique.length, words: unique.join(', ') },
      visualization: makeViz(unique.map((w) => w.length), {}, Object.fromEntries(unique.map((w, i) => [i, w]))),
    });

    // Simulate suffix trie with a set: track which words are NOT suffixes of another
    const notSuffix: boolean[] = unique.map(() => true);

    for (let i = 0; i < unique.length; i++) {
      const rev = unique[i].split('').reverse().join('');
      steps.push({
        line: 4,
        explanation: `Insert reversed word "${rev}" (original: "${unique[i]}") into the suffix trie.`,
        variables: { word: unique[i], reversed: rev },
        visualization: makeViz(unique.map((w) => w.length), { [i]: 'active' }, Object.fromEntries(unique.map((w, idx) => [idx, idx === i ? rev : w]))),
      });
    }

    // Determine which words are suffixes of others
    for (let i = 0; i < unique.length; i++) {
      for (let j = 0; j < unique.length; j++) {
        if (i !== j && unique[j].endsWith(unique[i])) {
          notSuffix[i] = false;
          steps.push({
            line: 9,
            explanation: `"${unique[i]}" is a suffix of "${unique[j]}" - it shares a node and does NOT contribute to encoding length.`,
            variables: { suffix: unique[i], of: unique[j] },
            visualization: makeViz(unique.map((w) => w.length), { [i]: 'mismatch', [j]: 'found' }, Object.fromEntries(unique.map((w, idx) => [idx, w]))),
          });
        }
      }
    }

    let result = 0;
    for (let i = 0; i < unique.length; i++) {
      if (notSuffix[i]) {
        result += unique[i].length + 1;
        steps.push({
          line: 11,
          explanation: `"${unique[i]}" is a leaf in the suffix trie. Add ${unique[i].length} + 1 = ${unique[i].length + 1} to result. Total so far: ${result}.`,
          variables: { word: unique[i], contribution: unique[i].length + 1, result },
          visualization: makeViz(unique.map((w, idx) => notSuffix[idx] ? w.length + 1 : 0), { [i]: 'found' }, Object.fromEntries(unique.map((w, idx) => [idx, notSuffix[idx] ? `+${w.length + 1}` : 'suffix']))),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Minimum encoding length is ${result}. Only words that are not suffixes of other words contribute.`,
      variables: { result },
      visualization: makeViz(unique.map((w, i) => notSuffix[i] ? w.length + 1 : 0), {}, Object.fromEntries(unique.map((w, i) => [i, notSuffix[i] ? w : 'skip']))),
    });

    return steps;
  },
};

export default shortEncodingOfWords;
