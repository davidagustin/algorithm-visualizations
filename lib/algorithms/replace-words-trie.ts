import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const replaceWordsTrie: AlgorithmDefinition = {
  id: 'replace-words-trie',
  title: 'Replace Words (Trie)',
  leetcodeNumber: 648,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a dictionary of root words and a sentence, replace each word in the sentence with the shortest root from the dictionary that is a prefix of that word. Build a trie from the dictionary roots. For each word in the sentence, traverse the trie to find the shortest matching prefix. If found, replace the word with that prefix; otherwise, keep the original.',
  tags: ['trie', 'string', 'hash table', 'prefix'],

  code: {
    pseudocode: `function replaceWords(dictionary, sentence):
  trie = buildTrie(dictionary)
  words = sentence.split(" ")
  result = []
  for word in words:
    node = trie.root
    prefix = ""
    for ch in word:
      if ch not in node.children: break
      node = node.children[ch]
      prefix += ch
      if node.isEnd:
        break
    if node.isEnd:
      result.append(prefix)
    else:
      result.append(word)
  return " ".join(result)`,

    python: `def replaceWords(dictionary, sentence):
    trie = {}
    for root in dictionary:
        node = trie
        for ch in root:
            node = node.setdefault(ch, {})
        node['#'] = True
    def replace(word):
        node = trie; prefix = ""
        for ch in word:
            if ch not in node: return word
            node = node[ch]; prefix += ch
            if '#' in node: return prefix
        return word
    return ' '.join(replace(w) for w in sentence.split())`,

    javascript: `function replaceWords(dictionary, sentence) {
  const trie = {};
  for (const root of dictionary) {
    let node = trie;
    for (const ch of root) { node[ch] = node[ch] || {}; node = node[ch]; }
    node['#'] = true;
  }
  return sentence.split(' ').map(word => {
    let node = trie, prefix = '';
    for (const ch of word) {
      if (!node[ch]) return word;
      node = node[ch]; prefix += ch;
      if (node['#']) return prefix;
    }
    return word;
  }).join(' ');
}`,

    java: `public String replaceWords(List<String> dictionary, String sentence) {
    Map<String, Boolean> set = new HashMap<>();
    for (String r : dictionary) set.put(r, true);
    StringBuilder sb = new StringBuilder();
    for (String word : sentence.split(" ")) {
        boolean found = false;
        for (int i = 1; i <= word.length(); i++) {
            if (set.containsKey(word.substring(0, i))) {
                if (sb.length() > 0) sb.append(' ');
                sb.append(word, 0, i); found = true; break;
            }
        }
        if (!found) { if (sb.length() > 0) sb.append(' '); sb.append(word); }
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    dictionary: ['cat', 'bat', 'rat'],
    sentence: 'the cattle was rattled by the battery',
  },

  inputFields: [
    {
      name: 'dictionary',
      label: 'Dictionary (roots)',
      type: 'array',
      defaultValue: ['cat', 'bat', 'rat'],
      placeholder: 'cat,bat,rat',
      helperText: 'Root words to replace with',
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

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    // Build trie
    const trie: Record<string, unknown> = {};
    for (const root of dictionary) {
      let node = trie as Record<string, unknown>;
      for (const ch of root) {
        if (!node[ch]) node[ch] = {};
        node = node[ch] as Record<string, unknown>;
      }
      node['#'] = true;
    }

    steps.push({
      line: 1,
      explanation: `Built trie from dictionary roots: [${dictionary.join(', ')}]. Now process each word in the sentence.`,
      variables: { dictionary: dictionary.join(', '), sentence },
      visualization: makeViz(dictionary.map((w) => w.length), Object.fromEntries(dictionary.map((_, i) => [i, 'active'])), Object.fromEntries(dictionary.map((w, i) => [i, w]))),
    });

    const words = sentence.split(' ');
    const resultWords: string[] = [];

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      let node = trie as Record<string, unknown>;
      let prefix = '';
      let replaced = false;

      for (const ch of word) {
        if (!node[ch]) break;
        node = node[ch] as Record<string, unknown>;
        prefix += ch;
        if (node['#']) {
          replaced = true;
          break;
        }
      }

      const finalWord = replaced ? prefix : word;
      resultWords.push(finalWord);

      steps.push({
        line: 8,
        explanation: `Word "${word}": ${replaced ? `Found root "${prefix}" in trie. Replace with "${prefix}".` : `No root prefix found. Keep "${word}".`}`,
        variables: { word, prefix: prefix || 'none', replaced, result: finalWord },
        visualization: makeViz(
          words.map((w) => w.length),
          { [wi]: replaced ? 'found' : 'active' },
          Object.fromEntries(resultWords.map((r, i) => [i, r]))
        ),
      });
    }

    const result = resultWords.join(' ');
    steps.push({
      line: 16,
      explanation: `Replacement complete. Result sentence: "${result}".`,
      variables: { result },
      visualization: makeViz(resultWords.map((w) => w.length), Object.fromEntries(resultWords.map((_, i) => [i, 'found'])), Object.fromEntries(resultWords.map((w, i) => [i, w]))),
    });

    return steps;
  },
};

export default replaceWordsTrie;
