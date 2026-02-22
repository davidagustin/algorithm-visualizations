import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const implementTrieIi: AlgorithmDefinition = {
  id: 'implement-trie-ii',
  title: 'Implement Trie II',
  leetcodeNumber: 1804,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'A Trie supports insert, countWordsEqualTo, and countWordsStartingWith operations. Each node tracks how many words pass through it (prefix count) and how many words end at it (word count). This lets you answer both prefix and exact-match queries in O(length) time.',
  tags: ['trie', 'design', 'string', 'prefix'],

  code: {
    pseudocode: `class Trie:
  root = TrieNode()

  insert(word):
    node = root
    for ch in word:
      node.children[ch] = node.children.get(ch, TrieNode())
      node = node.children[ch]
      node.prefixCount += 1
    node.wordCount += 1

  countWordsEqualTo(word):
    node = root
    for ch in word:
      if ch not in node.children: return 0
      node = node.children[ch]
    return node.wordCount

  countWordsStartingWith(prefix):
    node = root
    for ch in prefix:
      if ch not in node.children: return 0
      node = node.children[ch]
    return node.prefixCount`,

    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.word_count = 0
        self.prefix_count = 0

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
            node.prefix_count += 1
        node.word_count += 1

    def countWordsEqualTo(self, word: str) -> int:
        node = self.root
        for ch in word:
            if ch not in node.children:
                return 0
            node = node.children[ch]
        return node.word_count

    def countWordsStartingWith(self, prefix: str) -> int:
        node = self.root
        for ch in prefix:
            if ch not in node.children:
                return 0
            node = node.children[ch]
        return node.prefix_count`,

    javascript: `class TrieNode {
  constructor() {
    this.children = {};
    this.wordCount = 0;
    this.prefixCount = 0;
  }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
      node.prefixCount++;
    }
    node.wordCount++;
  }

  countWordsEqualTo(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) return 0;
      node = node.children[ch];
    }
    return node.wordCount;
  }

  countWordsStartingWith(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node.children[ch]) return 0;
      node = node.children[ch];
    }
    return node.prefixCount;
  }
}`,

    java: `class Trie {
    private TrieNode root = new TrieNode();

    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            node.children.putIfAbsent(c, new TrieNode());
            node = node.children.get(c);
            node.prefixCount++;
        }
        node.wordCount++;
    }

    public int countWordsEqualTo(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            if (!node.children.containsKey(c)) return 0;
            node = node.children.get(c);
        }
        return node.wordCount;
    }

    public int countWordsStartingWith(String prefix) {
        TrieNode node = root;
        for (char c : prefix.toCharArray()) {
            if (!node.children.containsKey(c)) return 0;
            node = node.children.get(c);
        }
        return node.prefixCount;
    }
}`,
  },

  defaultInput: {
    words: ['apple', 'app', 'apple', 'app'],
    queries: ['app', 'apple'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words to Insert',
      type: 'array',
      defaultValue: ['apple', 'app', 'apple', 'app'],
      placeholder: 'apple,app,apple,app',
      helperText: 'Words to insert into the trie',
    },
    {
      name: 'queries',
      label: 'Query Prefixes',
      type: 'array',
      defaultValue: ['app', 'apple'],
      placeholder: 'app,apple',
      helperText: 'Prefixes to query',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const queries = input.queries as string[];
    const steps: AlgorithmStep[] = [];

    // Simulate trie with prefix/word counts stored as array for visualization
    const trieState: Record<string, { prefixCount: number; wordCount: number }> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>, arr: number[]): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize empty Trie with root node. Each node tracks prefixCount and wordCount.',
      variables: { trie: 'empty', prefixCount: 0, wordCount: 0 },
      visualization: makeViz({}, {}, [0]),
    });

    const prefixCounts: number[] = [];
    const wordCounts: number[] = [];

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      steps.push({
        line: 4,
        explanation: `Inserting word "${word}" into the trie.`,
        variables: { word, step: 'insert' },
        visualization: makeViz({ [wi]: 'active' }, { [wi]: word }, words.map(() => 0)),
      });

      let prefix = '';
      for (let i = 0; i < word.length; i++) {
        prefix += word[i];
        if (!trieState[prefix]) {
          trieState[prefix] = { prefixCount: 0, wordCount: 0 };
        }
        trieState[prefix].prefixCount++;

        steps.push({
          line: 7,
          explanation: `Traversing to node for prefix "${prefix}". Increment prefixCount to ${trieState[prefix].prefixCount}.`,
          variables: { prefix, prefixCount: trieState[prefix].prefixCount },
          visualization: makeViz({ [i]: 'active' }, { [i]: prefix }, word.split('').map((_, idx) => trieState[word.slice(0, idx + 1)]?.prefixCount ?? 0)),
        });
      }
      trieState[word].wordCount++;
      steps.push({
        line: 9,
        explanation: `Word "${word}" fully inserted. wordCount at node "${word}" is now ${trieState[word].wordCount}.`,
        variables: { word, wordCount: trieState[word].wordCount, prefixCount: trieState[word].prefixCount },
        visualization: makeViz({ [word.length - 1]: 'found' }, { [word.length - 1]: word }, word.split('').map((_, idx) => trieState[word.slice(0, idx + 1)]?.prefixCount ?? 0)),
      });

      prefixCounts.push(trieState[word].prefixCount);
      wordCounts.push(trieState[word].wordCount);
    }

    for (let qi = 0; qi < queries.length; qi++) {
      const q = queries[qi];
      const pc = trieState[q]?.prefixCount ?? 0;
      const wc = trieState[q]?.wordCount ?? 0;
      steps.push({
        line: 17,
        explanation: `Query countWordsStartingWith("${q}"): ${pc} words start with "${q}". countWordsEqualTo("${q}"): ${wc} words equal "${q}".`,
        variables: { query: q, prefixCount: pc, wordCount: wc },
        visualization: makeViz({ [qi]: 'found' }, { [qi]: `${q}:${pc}` }, queries.map((qr) => trieState[qr]?.prefixCount ?? 0)),
      });
    }

    steps.push({
      line: 20,
      explanation: 'Trie operations complete. Both prefix count and exact-word count queries answered in O(length) time.',
      variables: { totalWords: words.length, totalQueries: queries.length },
      visualization: makeViz({}, {}, prefixCounts),
    });

    return steps;
  },
};

export default implementTrieIi;
