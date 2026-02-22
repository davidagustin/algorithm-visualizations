import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const replaceWords: AlgorithmDefinition = {
  id: 'replace-words',
  title: 'Replace Words',
  leetcodeNumber: 648,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Replace words in a sentence with their shortest root from a dictionary. Insert all roots into a trie. For each word in the sentence, traverse the trie to find the shortest matching root prefix. If found, replace the word with that root; otherwise keep the original word.',
  tags: ['Trie', 'String', 'Hash Map'],
  code: {
    pseudocode: `function replaceWords(dictionary, sentence):
  build trie from dictionary roots
  words = sentence.split(" ")
  for i, word in words:
    node = trie.root
    for j, ch in word:
      if ch not in node.children: break
      node = node.children[ch]
      if node.isEnd:
        words[i] = word[0..j]  // replace with root
        break
  return words.join(" ")`,
    python: `def replaceWords(dictionary, sentence):
    trie = {}
    for root in dictionary:
        node = trie
        for ch in root:
            node = node.setdefault(ch, {})
        node['#'] = True
    words = sentence.split()
    result = []
    for word in words:
        node = trie
        replaced = word
        for i, ch in enumerate(word):
            if ch not in node: break
            node = node[ch]
            if '#' in node:
                replaced = word[:i+1]
                break
        result.append(replaced)
    return ' '.join(result)`,
    javascript: `function replaceWords(dictionary, sentence) {
  const trie = {};
  for (const root of dictionary) {
    let node = trie;
    for (const ch of root) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['#'] = true;
  }
  return sentence.split(' ').map(word => {
    let node = trie;
    for (let i = 0; i < word.length; i++) {
      if (!node[word[i]]) break;
      node = node[word[i]];
      if (node['#']) return word.slice(0, i + 1);
    }
    return word;
  }).join(' ');
}`,
    java: `public String replaceWords(List<String> dictionary, String sentence) {
    Map<String, Object> trie = new HashMap<>();
    for (String root : dictionary) {
        Map<String, Object> node = trie;
        for (char ch : root.toCharArray()) {
            node = (Map<String,Object>) node.computeIfAbsent(String.valueOf(ch), k -> new HashMap<>());
        }
        node.put("#", true);
    }
    String[] words = sentence.split(" ");
    for (int w = 0; w < words.length; w++) {
        Map<String,Object> node = trie;
        for (int i = 0; i < words[w].length(); i++) {
            String c = String.valueOf(words[w].charAt(i));
            if (!node.containsKey(c)) break;
            node = (Map<String,Object>) node.get(c);
            if (node.containsKey("#")) { words[w] = words[w].substring(0, i+1); break; }
        }
    }
    return String.join(" ", words);
}`,
  },
  defaultInput: {
    dictionary: ['cat', 'bat', 'rat'],
    sentence: 'the cattle was rattled by the battery',
  },
  inputFields: [
    {
      name: 'dictionary',
      label: 'Dictionary Roots',
      type: 'array',
      defaultValue: ['cat', 'bat', 'rat'],
      placeholder: '["cat","bat","rat"]',
      helperText: 'Array of root words',
    },
    {
      name: 'sentence',
      label: 'Sentence',
      type: 'string',
      defaultValue: 'the cattle was rattled by the battery',
      placeholder: 'the cattle was rattled by the battery',
      helperText: 'Sentence to process',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dictionary = input.dictionary as string[];
    const sentence = input.sentence as string;
    const steps: AlgorithmStep[] = [];

    // Build trie
    interface TrieNode { children: Record<string, TrieNode>; isEnd: boolean; }
    const root: TrieNode = { children: {}, isEnd: false };

    function insertWord(word: string): void {
      let node = root;
      for (const ch of word) {
        if (!node.children[ch]) node.children[ch] = { children: {}, isEnd: false };
        node = node.children[ch];
      }
      node.isEnd = true;
    }

    function trieEntries(): { key: string; value: string }[] {
      const entries: { key: string; value: string }[] = [];
      function traverse(node: TrieNode, prefix: string) {
        const kids = Object.keys(node.children).sort();
        entries.push({ key: prefix || 'root', value: `[${kids.join(',')}]${node.isEnd ? ' END' : ''}` });
        for (const ch of kids) traverse(node.children[ch], prefix + ch);
      }
      traverse(root, '');
      return entries;
    }

    function findRoot(word: string): string {
      let node = root;
      for (let i = 0; i < word.length; i++) {
        const ch = word[i];
        if (!node.children[ch]) break;
        node = node.children[ch];
        if (node.isEnd) return word.slice(0, i + 1);
      }
      return word;
    }

    steps.push({
      line: 2,
      explanation: `Build trie from dictionary: [${dictionary.join(', ')}]. Each root is inserted character by character with an end marker.`,
      variables: { dictionary },
      visualization: {
        type: 'array',
        array: dictionary.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(dictionary.map((w, i) => [i, w])),
        auxData: { label: 'Trie (building)', entries: [{ key: 'root', value: 'empty' }] },
      },
    });

    for (const word of dictionary) {
      insertWord(word);
      steps.push({
        line: 3,
        explanation: `Inserted root "${word}" into trie. Each character creates a node; last node marked as end of root.`,
        variables: { inserted: word },
        visualization: {
          type: 'array',
          array: word.split('').map((_, i) => i),
          highlights: Object.fromEntries(word.split('').map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(word.split('').map((ch, i) => [i, ch])),
          auxData: { label: 'Trie after insert', entries: trieEntries() },
        },
      });
    }

    const words = sentence.split(' ');
    const result: string[] = [];

    steps.push({
      line: 4,
      explanation: `Trie built. Now process sentence words: [${words.join(', ')}]. For each word, find shortest root prefix in trie.`,
      variables: { words },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, w])),
        auxData: { label: 'Sentence words', entries: trieEntries() },
      },
    });

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const replaced = findRoot(word);
      result.push(replaced);
      const wasReplaced = replaced !== word;

      const hl: Record<number, string> = {};
      for (let j = 0; j < words.length; j++) {
        if (j < wi) hl[j] = 'visited';
        else if (j === wi) hl[j] = wasReplaced ? 'found' : 'active';
      }

      steps.push({
        line: wasReplaced ? 8 : 6,
        explanation: wasReplaced
          ? `"${word}" → root "${replaced}" found in trie. Replace word.`
          : `"${word}" → no root prefix in trie. Keep as-is.`,
        variables: { word, replaced, wasReplaced },
        visualization: {
          type: 'array',
          array: words.map((_, i) => i),
          highlights: hl,
          labels: Object.fromEntries(words.map((w, i) => [i, i < wi ? result[i] : i === wi ? replaced : w])),
          auxData: {
            label: 'Replace Progress',
            entries: [
              { key: `word[${wi}]`, value: word },
              { key: 'root found', value: wasReplaced ? replaced : 'none' },
              { key: 'result so far', value: result.join(' ') },
            ],
          },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Done! Result: "${result.join(' ')}".`,
      variables: { result: result.join(' ') },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((w, i) => [i, w])),
        auxData: {
          label: 'Final Result',
          entries: [
            { key: 'original', value: sentence },
            { key: 'result', value: result.join(' ') },
          ],
        },
      },
    });

    return steps;
  },
};

export default replaceWords;
