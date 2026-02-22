import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const mapSumPairs: AlgorithmDefinition = {
  id: 'map-sum-pairs',
  title: 'Map Sum Pairs',
  leetcodeNumber: 677,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Implement a MapSum class with insert and sum methods. insert(key, val) inserts a key-value pair. sum(prefix) returns the sum of all values whose keys have the given prefix. A trie is used where each node stores the cumulative prefix sum, updated on every insert. This allows O(prefix length) sum queries.',
  tags: ['trie', 'hash map', 'prefix', 'design'],

  code: {
    pseudocode: `class MapSum:
  trie = TrieNode
  keyMap = {}
  function insert(key, val):
    delta = val - keyMap.get(key, 0)
    keyMap[key] = val
    node = root
    for char in key:
      if char not in node: node[char] = TrieNode
      node = node[char]
      node.val += delta
  function sum(prefix):
    node = root
    for char in prefix:
      if char not in node: return 0
      node = node[char]
    return node.val`,

    python: `class MapSum:
    def __init__(self):
        self.root = {}
        self.key_map = {}

    def insert(self, key: str, val: int) -> None:
        delta = val - self.key_map.get(key, 0)
        self.key_map[key] = val
        node = self.root
        for ch in key:
            node = node.setdefault(ch, {'_val': 0})
            node['_val'] += delta

    def sum(self, prefix: str) -> int:
        node = self.root
        for ch in prefix:
            if ch not in node:
                return 0
            node = node[ch]
        return node.get('_val', 0)`,

    javascript: `class MapSum {
  constructor() { this.root = {}; this.keyMap = {}; }
  insert(key, val) {
    const delta = val - (this.keyMap[key] || 0);
    this.keyMap[key] = val;
    let node = this.root;
    for (const ch of key) {
      if (!node[ch]) node[ch] = { _val: 0 };
      node = node[ch];
      node._val += delta;
    }
  }
  sum(prefix) {
    let node = this.root;
    for (const ch of prefix) {
      if (!node[ch]) return 0;
      node = node[ch];
    }
    return node._val || 0;
  }
}`,

    java: `class MapSum {
    Map<String, Integer> keyMap = new HashMap<>();
    Map<String, Integer> trieVal = new HashMap<>();
    public void insert(String key, int val) {
        int delta = val - keyMap.getOrDefault(key, 0);
        keyMap.put(key, val);
        for (int i = 1; i <= key.length(); i++) {
            String prefix = key.substring(0, i);
            trieVal.merge(prefix, delta, Integer::sum);
        }
    }
    public int sum(String prefix) {
        return trieVal.getOrDefault(prefix, 0);
    }
}`,
  },

  defaultInput: {
    operations: [
      ['insert', 'apple', '3'],
      ['sum', 'ap', ''],
      ['insert', 'app', '2'],
      ['sum', 'ap', ''],
    ],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations (JSON)',
      type: 'string',
      defaultValue: '[["insert","apple","3"],["sum","ap",""],["insert","app","2"],["sum","ap",""]]',
      placeholder: '[["insert","apple","3"],["sum","ap",""]]',
      helperText: 'JSON: array of [op, key, value] where op is insert or sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = (typeof input.operations === 'string'
      ? JSON.parse(input.operations)
      : input.operations) as string[][];
    const steps: AlgorithmStep[] = [];

    // Trie stored as nested map
    const root: Record<string, unknown> = { _val: 0 };
    const keyMap: Record<string, number> = {};

    steps.push({
      line: 1,
      explanation: `Initialize MapSum with empty trie and key map. Processing ${operations.length} operations.`,
      variables: { operations: operations.length },
      visualization: {
        type: 'array',
        array: [0],
        highlights: {},
        labels: { 0: 'Trie root (val=0)' },
      },
    });

    const results: string[] = [];

    for (let opIdx = 0; opIdx < operations.length; opIdx++) {
      const [op, key, valStr] = operations[opIdx];

      if (op === 'insert') {
        const val = parseInt(valStr);
        const delta = val - (keyMap[key] || 0);
        keyMap[key] = val;

        steps.push({
          line: 4,
          explanation: `insert("${key}", ${val}). delta=${val}-(${keyMap[key] - delta})=${delta}. Traverse trie and add delta to each node.`,
          variables: { key, val, delta },
          visualization: {
            type: 'array',
            array: key.split('').map((_, i) => i),
            highlights: {},
            labels: Object.fromEntries(key.split('').map((ch, i) => [i, `'${ch}'`])),
          },
        });

        let node = root;
        for (let ci = 0; ci < key.length; ci++) {
          const ch = key[ci];
          if (!node[ch]) node[ch] = { _val: 0 };
          node = node[ch] as Record<string, unknown>;
          (node as Record<string, number>)._val = ((node as Record<string, number>)._val || 0) + delta;

          steps.push({
            line: 8,
            explanation: `Node for prefix "${key.slice(0, ci + 1)}" now has value ${(node as Record<string, number>)._val}.`,
            variables: { prefix: key.slice(0, ci + 1), nodeVal: (node as Record<string, number>)._val },
            visualization: {
              type: 'array',
              array: key.split('').map((_, i) => i),
              highlights: { [ci]: 'active' },
              labels: Object.fromEntries(key.split('').map((c, i) => [i, i <= ci ? `"${key.slice(0, i + 1)}"` : `'${c}'`])),
            },
          });
        }
        results.push(`insert done`);
      } else if (op === 'sum') {
        steps.push({
          line: 10,
          explanation: `sum("${key}"): traverse trie following prefix "${key}".`,
          variables: { prefix: key },
          visualization: {
            type: 'array',
            array: key.split('').map((_, i) => i),
            highlights: {},
            labels: Object.fromEntries(key.split('').map((ch, i) => [i, `'${ch}'`])),
          },
        });

        let node = root;
        let sumVal = 0;
        let found = true;
        for (const ch of key) {
          if (!node[ch]) { found = false; break; }
          node = node[ch] as Record<string, unknown>;
        }
        if (found) sumVal = (node as Record<string, number>)._val || 0;

        steps.push({
          line: 14,
          explanation: `sum("${key}") = ${sumVal}. This is the total of all values with prefix "${key}".`,
          variables: { prefix: key, result: sumVal },
          visualization: {
            type: 'array',
            array: [sumVal],
            highlights: { 0: 'found' },
            labels: { 0: `sum("${key}")=${sumVal}` },
          },
        });
        results.push(`sum("${key}")=${sumVal}`);
      }
    }

    steps.push({
      line: 14,
      explanation: `All operations complete. Results: ${results.join(', ')}.`,
      variables: { results: results.join(', ') },
      visualization: {
        type: 'array',
        array: results.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(results.map((r, i) => [i, r])),
      },
    });

    return steps;
  },
};

export default mapSumPairs;
