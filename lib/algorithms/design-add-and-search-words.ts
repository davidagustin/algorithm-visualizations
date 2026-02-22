import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designAddAndSearchWords: AlgorithmDefinition = {
  id: 'design-add-and-search-words',
  title: 'Design Add and Search Words Data Structure',
  leetcodeNumber: 211,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Implement a WordDictionary that supports addWord and search with wildcard "." which can match any character. Uses a trie for storage. The search function performs DFS: for regular characters it follows the trie node; for "." it recursively tries all child nodes. Each node tracks whether it marks a word end.',
  tags: ['trie', 'dfs', 'backtracking', 'design'],

  code: {
    pseudocode: `class WordDictionary:
  root = TrieNode
  function addWord(word):
    node = root
    for ch in word: node = node.children[ch]
    node.isEnd = true
  function search(word):
    return dfs(root, 0, word)
  function dfs(node, i, word):
    if i == len(word): return node.isEnd
    ch = word[i]
    if ch == '.':
      for child in node.children:
        if dfs(child, i+1, word): return true
    else:
      if ch not in node.children: return false
      return dfs(node.children[ch], i+1, word)
    return false`,

    python: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            node = node.setdefault(ch, {})
        node['#'] = True

    def search(self, word: str) -> bool:
        def dfs(node, i):
            if i == len(word):
                return '#' in node
            ch = word[i]
            if ch == '.':
                return any(dfs(child, i+1) for k, child in node.items() if k != '#')
            if ch not in node:
                return False
            return dfs(node[ch], i+1)
        return dfs(self.root, 0)`,

    javascript: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) {
    let node = this.root;
    for (const ch of word) { if (!node[ch]) node[ch] = {}; node = node[ch]; }
    node['#'] = true;
  }
  search(word) {
    const dfs = (node, i) => {
      if (i === word.length) return !!node['#'];
      const ch = word[i];
      if (ch === '.') return Object.entries(node).filter(([k]) => k !== '#').some(([, v]) => dfs(v, i+1));
      return !!node[ch] && dfs(node[ch], i+1);
    };
    return dfs(this.root, 0);
  }
}`,

    java: `class WordDictionary {
    Map<Character, WordDictionary> children = new HashMap<>();
    boolean isEnd = false;
    public void addWord(String word) {
        WordDictionary node = this;
        for (char c : word.toCharArray()) node = node.children.computeIfAbsent(c, k -> new WordDictionary());
        node.isEnd = true;
    }
    public boolean search(String word) { return dfs(this, word, 0); }
    boolean dfs(WordDictionary node, String word, int i) {
        if (i == word.length()) return node.isEnd;
        char c = word.charAt(i);
        if (c == '.') return node.children.values().stream().anyMatch(child -> dfs(child, word, i+1));
        return node.children.containsKey(c) && dfs(node.children.get(c), word, i+1);
    }
}`,
  },

  defaultInput: {
    operations: [
      ['addWord', 'bad'],
      ['addWord', 'dad'],
      ['addWord', 'mad'],
      ['search', 'pad'],
      ['search', 'bad'],
      ['search', '.ad'],
      ['search', 'b..'],
    ],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations (JSON)',
      type: 'string',
      defaultValue: '[["addWord","bad"],["addWord","dad"],["addWord","mad"],["search","pad"],["search","bad"],["search",".ad"],["search","b.."]]',
      placeholder: '[["addWord","bad"],["search",".ad"]]',
      helperText: 'JSON: array of [op, word] operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = (typeof input.operations === 'string'
      ? JSON.parse(input.operations)
      : input.operations) as string[][];
    const steps: AlgorithmStep[] = [];

    const root: Record<string, unknown> = {};
    const words: string[] = [];

    steps.push({
      line: 1,
      explanation: `Initialize WordDictionary with empty trie root.`,
      variables: { operations: operations.length },
      visualization: {
        type: 'array',
        array: [0],
        highlights: {},
        labels: { 0: 'empty trie' },
      },
    });

    function addWord(node: Record<string, unknown>, word: string): void {
      let cur = node;
      for (const ch of word) {
        if (!cur[ch]) cur[ch] = {};
        cur = cur[ch] as Record<string, unknown>;
      }
      cur['#'] = true;
    }

    function searchWord(node: Record<string, unknown>, word: string, i: number): boolean {
      if (i === word.length) return !!node['#'];
      const ch = word[i];
      if (ch === '.') {
        return Object.entries(node).filter(([k]) => k !== '#').some(([, v]) => searchWord(v as Record<string, unknown>, word, i + 1));
      }
      return !!node[ch] && searchWord(node[ch] as Record<string, unknown>, word, i + 1);
    }

    for (const [op, word] of operations) {
      if (op === 'addWord') {
        addWord(root, word);
        words.push(word);
        steps.push({
          line: 3,
          explanation: `addWord("${word}"): insert character by character into trie. Words stored: [${words.map(w => `"${w}"`).join(', ')}].`,
          variables: { word, wordsCount: words.length },
          visualization: {
            type: 'array',
            array: word.split('').map((_, i) => i),
            highlights: { [word.length - 1]: 'found' },
            labels: Object.fromEntries(word.split('').map((ch, i) => [i, `'${ch}'${i === word.length - 1 ? ' #' : ''}`])),
          },
        });
      } else if (op === 'search') {
        const result = searchWord(root, word, 0);
        steps.push({
          line: 7,
          explanation: `search("${word}"): DFS through trie. "." matches any character. Result: ${result}.`,
          variables: { word, result },
          visualization: {
            type: 'array',
            array: word.split('').map((_, i) => i),
            highlights: Object.fromEntries(word.split('').map((ch, i) => [i, ch === '.' ? 'comparing' : result ? 'found' : 'mismatch'])),
            labels: Object.fromEntries(word.split('').map((ch, i) => [i, `'${ch}'`])),
          },
        });

        steps.push({
          line: 13,
          explanation: `search("${word}") returned ${result}. ${result ? 'Match found in trie.' : 'No match in trie.'}`,
          variables: { word, result },
          visualization: {
            type: 'array',
            array: words.map((_, i) => i),
            highlights: Object.fromEntries(words.map((w, i) => {
              const matches = word.split('').every((ch, ci) => ch === '.' || ch === w[ci]) && word.length === w.length;
              return [i, matches ? 'found' : 'default'];
            })),
            labels: Object.fromEntries(words.map((w, i) => [i, `"${w}"`])),
          },
        });
      }
    }

    return steps;
  },
};

export default designAddAndSearchWords;
