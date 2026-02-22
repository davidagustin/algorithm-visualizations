import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const indexPairsOfString: AlgorithmDefinition = {
  id: 'index-pairs-of-string',
  title: 'Index Pairs of a String',
  leetcodeNumber: 1065,
  difficulty: 'Easy',
  category: 'Trie',
  description:
    'Given a text string and a list of dictionary words, find all index pairs [i, j] such that text[i..j] is a word in the dictionary. Build a trie from dictionary words, then for each starting position in text, traverse the trie to find all matching words ending at various positions.',
  tags: ['trie', 'string', 'array'],

  code: {
    pseudocode: `function indexPairs(text, words):
  trie = buildTrie(words)
  result = []
  for i in range(len(text)):
    node = trie.root
    for j in range(i, len(text)):
      ch = text[j]
      if ch not in node.children: break
      node = node.children[ch]
      if node.isEnd:
        result.append([i, j])
  sort result
  return result`,

    python: `def indexPairs(text, words):
    trie = {}
    for w in words:
        node = trie
        for ch in w:
            node = node.setdefault(ch, {})
        node['#'] = True
    res = []
    for i in range(len(text)):
        node = trie
        for j in range(i, len(text)):
            if text[j] not in node: break
            node = node[text[j]]
            if '#' in node:
                res.append([i, j])
    return sorted(res)`,

    javascript: `function indexPairs(text, words) {
  const trie = {};
  for (const w of words) {
    let node = trie;
    for (const ch of w) {
      node[ch] = node[ch] || {};
      node = node[ch];
    }
    node['#'] = true;
  }
  const res = [];
  for (let i = 0; i < text.length; i++) {
    let node = trie;
    for (let j = i; j < text.length; j++) {
      if (!node[text[j]]) break;
      node = node[text[j]];
      if (node['#']) res.push([i, j]);
    }
  }
  return res;
}`,

    java: `public int[][] indexPairs(String text, String[] words) {
    Map<Character, Object> trie = new HashMap<>();
    for (String w : words) {
        Map node = trie;
        for (char c : w.toCharArray()) {
            node.putIfAbsent(c, new HashMap<>());
            node = (Map) node.get(c);
        }
        node.put('#', true);
    }
    List<int[]> res = new ArrayList<>();
    for (int i = 0; i < text.length(); i++) {
        Map node = trie;
        for (int j = i; j < text.length(); j++) {
            if (!node.containsKey(text.charAt(j))) break;
            node = (Map) node.get(text.charAt(j));
            if (node.containsKey('#')) res.add(new int[]{i, j});
        }
    }
    return res.stream().sorted(...).toArray(int[][]::new);
}`,
  },

  defaultInput: {
    text: 'thestoryofleetcodeandme',
    words: ['story', 'leet', 'the'],
  },

  inputFields: [
    {
      name: 'text',
      label: 'Text',
      type: 'string',
      defaultValue: 'thestoryofleetcodeandme',
      placeholder: 'thestoryofleetcodeandme',
      helperText: 'The text to search within',
    },
    {
      name: 'words',
      label: 'Dictionary Words',
      type: 'array',
      defaultValue: ['story', 'leet', 'the'],
      placeholder: 'story,leet,the',
      helperText: 'Words to find in the text',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const w of words) {
      let node = trie as Record<string, unknown>;
      for (const ch of w) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    steps.push({
      line: 1,
      explanation: `Built trie from words: [${words.join(', ')}]. Now scan text "${text}" starting from each position.`,
      variables: { text, words: words.join(', '), textLength: text.length },
      visualization: makeViz(text.split('').map(() => 0), {}, Object.fromEntries(text.split('').map((c, i) => [i, c]))),
    });

    const result: [number, number][] = [];

    for (let i = 0; i < text.length; i++) {
      let node = trie as Record<string, unknown>;
      let found = false;

      steps.push({
        line: 4,
        explanation: `Start at index ${i} (char "${text[i]}"). Traverse trie to find all words beginning here.`,
        variables: { startIndex: i, char: text[i] },
        visualization: makeViz(text.split('').map(() => 0), { [i]: 'active' }, Object.fromEntries(text.split('').map((c, idx) => [idx, c]))),
      });

      for (let j = i; j < text.length; j++) {
        const ch = text[j];
        if (!node[ch]) break;
        node = node[ch] as Record<string, unknown>;

        if (node['#']) {
          result.push([i, j]);
          found = true;
          steps.push({
            line: 9,
            explanation: `Found word "${text.slice(i, j + 1)}" at indices [${i}, ${j}]. Add to result.`,
            variables: { word: text.slice(i, j + 1), start: i, end: j },
            visualization: makeViz(
              text.split('').map(() => 0),
              Object.fromEntries([...Array(j - i + 1)].map((_, k) => [i + k, 'found'])),
              Object.fromEntries(text.split('').map((c, idx) => [idx, c]))
            ),
          });
        }
      }

      if (!found) {
        steps.push({
          line: 7,
          explanation: `No word starts at index ${i}. Moving to next position.`,
          variables: { startIndex: i },
          visualization: makeViz(text.split('').map(() => 0), { [i]: 'mismatch' }, Object.fromEntries(text.split('').map((c, idx) => [idx, c]))),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Found ${result.length} index pairs: ${result.map(([a, b]) => `[${a},${b}]`).join(', ')}.`,
      variables: { pairs: result.length, result: JSON.stringify(result) },
      visualization: makeViz(result.map(([a, b]) => b - a + 1), Object.fromEntries(result.map((_, i) => [i, 'found'])), Object.fromEntries(result.map(([a, b], i) => [i, `[${a},${b}]`]))),
    });

    return steps;
  },
};

export default indexPairsOfString;
