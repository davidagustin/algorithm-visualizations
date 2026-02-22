import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designATrie: AlgorithmDefinition = {
  id: 'design-a-trie',
  title: 'Design a Trie',
  leetcodeNumber: 208,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Implement a trie (prefix tree) with insert, search, and startsWith operations. A trie stores strings character by character in a tree structure, enabling efficient prefix lookups in O(m) time where m is the word length.',
  tags: ['Trie', 'Design', 'String'],
  code: {
    pseudocode: `class TrieNode:
  children = {}
  isEnd = false

class Trie:
  root = new TrieNode()

  function insert(word):
    node = root
    for char in word:
      if char not in node.children:
        node.children[char] = new TrieNode()
      node = node.children[char]
    node.isEnd = true

  function search(word):
    node = findNode(word)
    return node != null and node.isEnd

  function startsWith(prefix):
    return findNode(prefix) != null

  function findNode(s):
    node = root
    for char in s:
      if char not in node.children:
        return null
      node = node.children[char]
    return node`,
    python: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._find(word)
        return node is not None and node.is_end

    def startsWith(self, prefix):
        return self._find(prefix) is not None

    def _find(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
    javascript: `class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}
class Trie {
  constructor() { this.root = new TrieNode(); }
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      if (!node.children[ch]) node.children[ch] = new TrieNode();
      node = node.children[ch];
    }
    node.isEnd = true;
  }
  search(word) {
    const node = this._find(word);
    return node !== null && node.isEnd;
  }
  startsWith(prefix) {
    return this._find(prefix) !== null;
  }
  _find(s) {
    let node = this.root;
    for (const ch of s) {
      if (!node.children[ch]) return null;
      node = node.children[ch];
    }
    return node;
  }
}`,
    java: `class Trie {
    private TrieNode root = new TrieNode();
    class TrieNode {
        Map<Character, TrieNode> children = new HashMap<>();
        boolean isEnd = false;
    }
    public void insert(String word) {
        TrieNode node = root;
        for (char ch : word.toCharArray()) {
            node.children.putIfAbsent(ch, new TrieNode());
            node = node.children.get(ch);
        }
        node.isEnd = true;
    }
    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }
    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
    private TrieNode find(String s) {
        TrieNode node = root;
        for (char ch : s.toCharArray()) {
            if (!node.children.containsKey(ch)) return null;
            node = node.children.get(ch);
        }
        return node;
    }
}`,
  },
  defaultInput: { operations: 'insert apple,insert app,search apple,search app,startsWith ap' },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'insert apple,insert app,search apple,search app,startsWith ap',
      placeholder: 'e.g. insert apple,search apple,startsWith ap',
      helperText: 'Comma-separated operations: insert <word>, search <word>, startsWith <prefix>.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const ops = opsStr.split(',').map(s => s.trim());
    const steps: AlgorithmStep[] = [];

    // Build a trie as a nested object
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
        if (prefix === '') {
          entries.push({ key: 'root', value: `children: [${childKeys.join(',')}]${marker}` });
        } else {
          entries.push({ key: prefix, value: `children: [${childKeys.join(',')}]${marker}` });
        }
        for (const ch of childKeys) {
          traverse(node.children[ch], prefix + ch);
        }
      }
      traverse(root, '');
      return entries;
    }

    function makeViz(word: string, charIdx: number, status: string): ArrayVisualization {
      const chars = word.split('').map((_, i) => i);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < word.length; i++) {
        labels[i] = word[i];
        if (i < charIdx) {
          highlights[i] = 'found';
        } else if (i === charIdx) {
          highlights[i] = status;
        }
      }
      return {
        type: 'array',
        array: chars,
        highlights,
        labels,
        auxData: {
          label: 'Trie Structure',
          entries: trieToEntries(),
        },
      };
    }

    steps.push({
      line: 5,
      explanation: `Initialize an empty Trie. Will process ${ops.length} operations.`,
      variables: { operationCount: ops.length },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        auxData: { label: 'Trie Structure', entries: [{ key: 'root', value: 'children: []' }] },
      },
    });

    for (const op of ops) {
      const parts = op.split(' ');
      const action = parts[0];
      const word = parts.slice(1).join(' ');

      if (action === 'insert') {
        steps.push({
          line: 8,
          explanation: `INSERT "${word}": traverse trie, creating nodes for new characters.`,
          variables: { operation: 'insert', word },
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
            line: 11,
            explanation: `INSERT "${word}": char '${ch}' (index ${i}). ${isNew ? 'Created new node.' : 'Node already exists.'}`,
            variables: { char: ch, index: i, created: isNew },
            visualization: makeViz(word, i, isNew ? 'comparing' : 'found'),
          });
        }

        node.isEnd = true;

        steps.push({
          line: 13,
          explanation: `INSERT "${word}" complete. Marked end-of-word.`,
          variables: { word, inserted: true },
          visualization: makeViz(word, word.length - 1, 'found'),
        });
      } else if (action === 'search') {
        steps.push({
          line: 15,
          explanation: `SEARCH "${word}": traverse trie and check isEnd flag.`,
          variables: { operation: 'search', word },
          visualization: makeViz(word, -1, 'active'),
        });

        let node: TrieNode | null = root;
        let found = true;
        for (let i = 0; i < word.length; i++) {
          const ch = word[i];
          if (!node || !(ch in node.children)) {
            found = false;
            steps.push({
              line: 26,
              explanation: `SEARCH "${word}": char '${ch}' (index ${i}) NOT found in trie. Search fails.`,
              variables: { char: ch, index: i, found: false },
              visualization: makeViz(word, i, 'mismatch'),
            });
            break;
          }
          node = node.children[ch];
          steps.push({
            line: 27,
            explanation: `SEARCH "${word}": char '${ch}' (index ${i}) found in trie.`,
            variables: { char: ch, index: i },
            visualization: makeViz(word, i, 'found'),
          });
        }

        if (found && node) {
          const isExact = node.isEnd;
          steps.push({
            line: 16,
            explanation: `SEARCH "${word}": all chars found. isEnd = ${isExact}. Result: ${isExact}.`,
            variables: { word, found: isExact },
            visualization: makeViz(word, word.length - 1, isExact ? 'found' : 'mismatch'),
          });
        }
      } else if (action === 'startsWith') {
        steps.push({
          line: 19,
          explanation: `STARTS_WITH "${word}": traverse trie to check if prefix exists.`,
          variables: { operation: 'startsWith', prefix: word },
          visualization: makeViz(word, -1, 'active'),
        });

        let node: TrieNode | null = root;
        let prefixFound = true;
        for (let i = 0; i < word.length; i++) {
          const ch = word[i];
          if (!node || !(ch in node.children)) {
            prefixFound = false;
            steps.push({
              line: 26,
              explanation: `STARTS_WITH "${word}": char '${ch}' (index ${i}) NOT found. Prefix doesn't exist.`,
              variables: { char: ch, index: i, prefixFound: false },
              visualization: makeViz(word, i, 'mismatch'),
            });
            break;
          }
          node = node.children[ch];
          steps.push({
            line: 27,
            explanation: `STARTS_WITH "${word}": char '${ch}' (index ${i}) found.`,
            variables: { char: ch, index: i },
            visualization: makeViz(word, i, 'found'),
          });
        }

        if (prefixFound) {
          steps.push({
            line: 20,
            explanation: `STARTS_WITH "${word}": prefix exists in trie. Result: true.`,
            variables: { prefix: word, result: true },
            visualization: makeViz(word, word.length - 1, 'found'),
          });
        }
      }
    }

    steps.push({
      line: 5,
      explanation: `All ${ops.length} operations processed.`,
      variables: { totalOps: ops.length },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        auxData: { label: 'Final Trie Structure', entries: trieToEntries() },
      },
    });

    return steps;
  },
};

export default designATrie;
