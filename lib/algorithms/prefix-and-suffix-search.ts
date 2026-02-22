import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const prefixAndSuffixSearch: AlgorithmDefinition = {
  id: 'prefix-and-suffix-search',
  title: 'Prefix and Suffix Search',
  leetcodeNumber: 745,
  difficulty: 'Hard',
  category: 'Trie',
  description:
    'Design a WordFilter that supports searching by both a prefix and a suffix simultaneously. The trick is to store combined keys of the form "suffix#prefix" in a trie (or hash map). For each word, generate all suffix+prefix combinations and map them to the word index. Query by looking up "suffix#prefix".',
  tags: ['trie', 'hash map', 'string', 'design', 'prefix', 'suffix'],

  code: {
    pseudocode: `class WordFilter:
  map = {}
  for i, word in enumerate(words):
    n = len(word)
    for j in range(n + 1):
      suffix = word[j:]
      prefix = word
      key = suffix + "#" + prefix
      map[key] = i

  f(prefix, suffix):
    key = suffix + "#" + prefix
    return map.get(key, -1)`,

    python: `class WordFilter:
    def __init__(self, words):
        self.lookup = {}
        for i, word in enumerate(words):
            n = len(word)
            for j in range(n + 1):
                key = word[j:] + "#" + word
                self.lookup[key] = i

    def f(self, prefix: str, suffix: str) -> int:
        return self.lookup.get(suffix + "#" + prefix, -1)`,

    javascript: `class WordFilter {
  constructor(words) {
    this.lookup = {};
    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      for (let j = 0; j <= w.length; j++) {
        this.lookup[w.slice(j) + '#' + w] = i;
      }
    }
  }
  f(prefix, suffix) {
    return this.lookup[suffix + '#' + prefix] ?? -1;
  }
}`,

    java: `class WordFilter {
    Map<String, Integer> lookup = new HashMap<>();
    public WordFilter(String[] words) {
        for (int i = 0; i < words.length; i++) {
            String w = words[i];
            for (int j = 0; j <= w.length(); j++)
                lookup.put(w.substring(j) + "#" + w, i);
        }
    }
    public int f(String prefix, String suffix) {
        return lookup.getOrDefault(suffix + "#" + prefix, -1);
    }
}`,
  },

  defaultInput: {
    words: ['apple', 'apply', 'apt'],
    prefix: 'ap',
    suffix: 'le',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['apple', 'apply', 'apt'],
      placeholder: 'apple,apply,apt',
      helperText: 'Words for the filter',
    },
    {
      name: 'prefix',
      label: 'Prefix Query',
      type: 'string',
      defaultValue: 'ap',
      placeholder: 'ap',
      helperText: 'Prefix to search',
    },
    {
      name: 'suffix',
      label: 'Suffix Query',
      type: 'string',
      defaultValue: 'le',
      placeholder: 'le',
      helperText: 'Suffix to search',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const prefix = input.prefix as string;
    const suffix = input.suffix as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const lookup: Record<string, number> = {};

    steps.push({
      line: 1,
      explanation: `WordFilter initialized with words: [${words.join(', ')}]. For each word, generate all suffix#word keys and map to word index.`,
      variables: { words: words.join(', ') },
      visualization: makeViz(words.map((w) => w.length), {}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    for (let i = 0; i < words.length; i++) {
      const w = words[i];
      const keysGenerated: string[] = [];
      for (let j = 0; j <= w.length; j++) {
        const key = w.slice(j) + '#' + w;
        lookup[key] = i;
        keysGenerated.push(key);
      }
      steps.push({
        line: 4,
        explanation: `Word "${w}" (index ${i}): generated ${keysGenerated.length} keys. Example: "${keysGenerated[0]}", "${keysGenerated[keysGenerated.length - 1]}".`,
        variables: { word: w, index: i, keysGenerated: keysGenerated.length },
        visualization: makeViz(words.map((w2) => w2.length), { [i]: 'active' }, Object.fromEntries(words.map((w2, idx) => [idx, idx === i ? `${keysGenerated.length} keys` : w2]))),
      });
    }

    const queryKey = suffix + '#' + prefix;
    steps.push({
      line: 9,
      explanation: `Query f("${prefix}", "${suffix}"): build lookup key = "${queryKey}".`,
      variables: { prefix, suffix, key: queryKey },
      visualization: makeViz(words.map((w) => w.length), {}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    const result = lookup[queryKey] ?? -1;
    if (result !== -1) {
      steps.push({
        line: 10,
        explanation: `Key "${queryKey}" found in map at index ${result}. Word "${words[result]}" starts with "${prefix}" and ends with "${suffix}". Return ${result}.`,
        variables: { key: queryKey, result, word: words[result] },
        visualization: makeViz(words.map((w) => w.length), { [result]: 'found' }, Object.fromEntries(words.map((w, i) => [i, i === result ? 'MATCH' : w]))),
      });
    } else {
      steps.push({
        line: 10,
        explanation: `Key "${queryKey}" not found. No word matches both prefix "${prefix}" and suffix "${suffix}". Return -1.`,
        variables: { key: queryKey, result: -1 },
        visualization: makeViz(words.map((w) => w.length), Object.fromEntries(words.map((_, i) => [i, 'mismatch'])), Object.fromEntries(words.map((w, i) => [i, w]))),
      });
    }

    return steps;
  },
};

export default prefixAndSuffixSearch;
