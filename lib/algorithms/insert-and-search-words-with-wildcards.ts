import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertAndSearchWordsWithWildcards: AlgorithmDefinition = {
  id: 'insert-and-search-words-with-wildcards',
  title: 'Insert and Search Words with Wildcards',
  leetcodeNumber: 211,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Design a data structure that supports adding words and searching with wildcard "." characters. The "." matches any single letter. We use a trie for storage and DFS for wildcard search, branching into all children when encountering a dot.',
  tags: ['Trie', 'Design', 'String', 'Backtracking'],
  code: {
    pseudocode: `class WordDictionary:
  root = new TrieNode()

  function addWord(word):
    node = root
    for char in word:
      if char not in node.children:
        node.children[char] = new TrieNode()
      node = node.children[char]
    node.isEnd = true

  function search(word):
    return dfs(root, word, 0)

  function dfs(node, word, index):
    if index == word.length:
      return node.isEnd
    char = word[index]
    if char == '.':
      for child in node.children.values():
        if dfs(child, word, index+1): return true
      return false
    if char not in node.children: return false
    return dfs(node.children[char], word, index+1)`,
    python: `class WordDictionary:
    def __init__(self):
        self.root = {}

    def addWord(self, word):
        node = self.root
        for ch in word:
            if ch not in node:
                node[ch] = {}
            node = node[ch]
        node['$'] = True

    def search(self, word):
        return self._dfs(self.root, word, 0)

    def _dfs(self, node, word, i):
        if i == len(word):
            return '$' in node
        ch = word[i]
        if ch == '.':
            return any(self._dfs(node[k], word, i+1)
                       for k in node if k != '$')
        if ch not in node:
            return False
        return self._dfs(node[ch], word, i+1)`,
    javascript: `class WordDictionary {
  constructor() { this.root = {}; }
  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node[ch]) node[ch] = {};
      node = node[ch];
    }
    node['$'] = true;
  }
  search(word) {
    return this._dfs(this.root, word, 0);
  }
  _dfs(node, word, i) {
    if (i === word.length) return !!node['$'];
    const ch = word[i];
    if (ch === '.') {
      for (const k in node) {
        if (k !== '$' && this._dfs(node[k], word, i+1)) return true;
      }
      return false;
    }
    if (!node[ch]) return false;
    return this._dfs(node[ch], word, i+1);
  }
}`,
    java: `class WordDictionary {
    TrieNode root = new TrieNode();
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }
    public void addWord(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        return dfs(root, word, 0);
    }
    boolean dfs(TrieNode node, String word, int i) {
        if (i == word.length()) return node.isEnd;
        char ch = word.charAt(i);
        if (ch == '.') {
            for (TrieNode child : node.children.values())
                if (dfs(child, word, i+1)) return true;
            return false;
        }
        if (!node.children.containsKey(ch)) return false;
        return dfs(node.children.get(ch), word, i+1);
    }
}`,
  },
  defaultInput: { operations: 'addWord bad,addWord dad,addWord mad,search pad,search bad,search .ad' },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'addWord bad,addWord dad,addWord mad,search pad,search bad,search .ad',
      placeholder: 'e.g. addWord bad,search .ad',
      helperText: 'Comma-separated: addWord <word>, search <word> (use . as wildcard).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const ops = opsStr.split(',').map(s => s.trim());
    const steps: AlgorithmStep[] = [];

    interface TrieNode {
      children: Record<string, TrieNode>;
      isEnd: boolean;
    }

    const root: TrieNode = { children: {}, isEnd: false };

    function trieToEntries(): { key: string; value: string }[] {
      const entries: { key: string; value: string }[] = [];
      function traverse(node: TrieNode, prefix: string): void {
        const childKeys = Object.keys(node.children).sort();
        const marker = node.isEnd ? ' [END]' : '';
        entries.push({ key: prefix || 'root', value: `[${childKeys.join(',')}]${marker}` });
        for (const ch of childKeys) {
          traverse(node.children[ch], prefix + ch);
        }
      }
      traverse(root, '');
      return entries;
    }

    function makeViz(word: string, charIdx: number, status: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < word.length; i++) {
        labels[i] = word[i];
        if (i < charIdx) highlights[i] = 'found';
        else if (i === charIdx) highlights[i] = status;
      }
      return {
        type: 'array',
        array: Array.from({ length: word.length }, (_, i) => i),
        highlights,
        labels,
        auxData: { label: 'Trie Structure', entries: trieToEntries() },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize WordDictionary (Trie with wildcard support). Processing ${ops.length} operations.`,
      variables: { operationCount: ops.length },
      visualization: { type: 'array', array: [], highlights: {}, auxData: { label: 'Trie', entries: [{ key: 'root', value: '[]' }] } },
    });

    for (const op of ops) {
      const spaceIdx = op.indexOf(' ');
      const action = op.substring(0, spaceIdx);
      const word = op.substring(spaceIdx + 1);

      if (action === 'addWord') {
        steps.push({
          line: 4,
          explanation: `ADD WORD "${word}": insert into trie character by character.`,
          variables: { operation: 'addWord', word },
          visualization: makeViz(word, -1, 'active'),
        });

        let node = root;
        for (let i = 0; i < word.length; i++) {
          const ch = word[i];
          const isNew = !(ch in node.children);
          if (isNew) {
            node.children[ch] = { children: {}, isEnd: false };
          }
          node = node.children[ch];

          steps.push({
            line: 7,
            explanation: `ADD "${word}": char '${ch}' at index ${i}. ${isNew ? 'Created new node.' : 'Exists.'}`,
            variables: { char: ch, index: i, created: isNew },
            visualization: makeViz(word, i, isNew ? 'comparing' : 'found'),
          });
        }

        node.isEnd = true;

        steps.push({
          line: 9,
          explanation: `ADD "${word}" complete. Marked end-of-word.`,
          variables: { word },
          visualization: makeViz(word, word.length - 1, 'found'),
        });
      } else if (action === 'search') {
        steps.push({
          line: 11,
          explanation: `SEARCH "${word}": use DFS with wildcard support.${word.includes('.') ? ' Contains wildcard "." - will try all branches.' : ''}`,
          variables: { operation: 'search', word },
          visualization: makeViz(word, -1, 'active'),
        });

        function dfs(node: TrieNode, idx: number): boolean {
          if (idx === word.length) {
            const result = node.isEnd;
            steps.push({
              line: 15,
              explanation: `SEARCH "${word}": reached end. isEnd = ${result}. ${result ? 'FOUND!' : 'Not a complete word.'}`,
              variables: { result },
              visualization: makeViz(word, word.length - 1, result ? 'found' : 'mismatch'),
            });
            return result;
          }

          const ch = word[idx];

          if (ch === '.') {
            const childKeys = Object.keys(node.children).sort();
            steps.push({
              line: 18,
              explanation: `SEARCH "${word}": wildcard '.' at index ${idx}. Try all children: [${childKeys.join(', ')}].`,
              variables: { char: '.', index: idx, branches: childKeys },
              visualization: makeViz(word, idx, 'comparing'),
            });

            for (const key of childKeys) {
              steps.push({
                line: 19,
                explanation: `SEARCH "${word}": wildcard '.' trying branch '${key}'.`,
                variables: { branch: key, index: idx },
                visualization: makeViz(word, idx, 'active'),
              });
              if (dfs(node.children[key], idx + 1)) return true;
            }
            return false;
          }

          if (!(ch in node.children)) {
            steps.push({
              line: 21,
              explanation: `SEARCH "${word}": char '${ch}' at index ${idx} NOT in trie. Search fails.`,
              variables: { char: ch, index: idx, found: false },
              visualization: makeViz(word, idx, 'mismatch'),
            });
            return false;
          }

          steps.push({
            line: 22,
            explanation: `SEARCH "${word}": char '${ch}' at index ${idx} found. Continue.`,
            variables: { char: ch, index: idx },
            visualization: makeViz(word, idx, 'found'),
          });

          return dfs(node.children[ch], idx + 1);
        }

        const searchResult = dfs(root, 0);

        steps.push({
          line: 12,
          explanation: `SEARCH "${word}": result = ${searchResult}.`,
          variables: { word, result: searchResult },
          visualization: makeViz(word, word.length - 1, searchResult ? 'found' : 'mismatch'),
        });
      }
    }

    steps.push({
      line: 1,
      explanation: `All ${ops.length} operations complete.`,
      variables: { totalOps: ops.length },
      visualization: { type: 'array', array: [], highlights: {}, auxData: { label: 'Final Trie', entries: trieToEntries() } },
    });

    return steps;
  },
};

export default insertAndSearchWordsWithWildcards;
