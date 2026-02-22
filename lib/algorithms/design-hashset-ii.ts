import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHashsetIi: AlgorithmDefinition = {
  id: 'design-hashset-ii',
  title: 'Design HashSet',
  leetcodeNumber: 705,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Design a HashSet without using any built-in hash set libraries. Implement add, remove, and contains operations. Use an array of buckets with chaining for collision handling.',
  tags: ['Hash Map', 'Design', 'Array'],
  code: {
    pseudocode: `class MyHashSet:
  function init():
    this.SIZE = 1000
    this.buckets = array of SIZE empty lists
  function hash(key):
    return key mod SIZE
  function add(key):
    if not contains(key):
      buckets[hash(key)].append(key)
  function remove(key):
    buckets[hash(key)].remove(key)
  function contains(key):
    return key in buckets[hash(key)]`,
    python: `class MyHashSet:
    def __init__(self):
        self.SIZE = 1000
        self.buckets = [[] for _ in range(self.SIZE)]

    def _hash(self, key):
        return key % self.SIZE

    def add(self, key: int) -> None:
        if not self.contains(key):
            self.buckets[self._hash(key)].append(key)

    def remove(self, key: int) -> None:
        b = self._hash(key)
        if key in self.buckets[b]:
            self.buckets[b].remove(key)

    def contains(self, key: int) -> bool:
        return key in self.buckets[self._hash(key)]`,
    javascript: `class MyHashSet {
  constructor() {
    this.SIZE = 1000;
    this.buckets = Array.from({length: this.SIZE}, () => []);
  }
  _hash(key) { return key % this.SIZE; }
  add(key) {
    if (!this.contains(key)) this.buckets[this._hash(key)].push(key);
  }
  remove(key) {
    const b = this._hash(key);
    this.buckets[b] = this.buckets[b].filter(k => k !== key);
  }
  contains(key) {
    return this.buckets[this._hash(key)].includes(key);
  }
}`,
    java: `class MyHashSet {
    private static final int SIZE = 1000;
    private List<Integer>[] buckets;
    public MyHashSet() {
        buckets = new List[SIZE];
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }
    public void add(int key) {
        if (!contains(key)) buckets[hash(key)].add(key);
    }
    public void remove(int key) { buckets[hash(key)].remove(Integer.valueOf(key)); }
    public boolean contains(int key) { return buckets[hash(key)].contains(key); }
}`,
  },
  defaultInput: {
    operations: [['add', 1], ['add', 2], ['contains', 1], ['contains', 3], ['add', 2], ['contains', 2], ['remove', 2], ['contains', 2]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'add 1, add 2, contains 1, contains 3, add 2, contains 2, remove 2, contains 2',
      placeholder: 'add 1, contains 1, remove 1',
      helperText: 'Comma-separated: "add k", "remove k", "contains k"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return [parts[0], Number(parts[1])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const set = new Set<number>();

    function makeViz(activeKey: number, color: string, label: string): ArrayVisualization {
      const arr = Array.from(set);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      arr.forEach((k, i) => {
        highlights[i] = k === activeKey ? color : 'default';
        labels[i] = `${k}`;
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'HashSet State',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${set.size}` },
            { key: 'Elements', value: arr.join(', ') || 'empty' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty HashSet.',
      variables: { set: [] },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
        auxData: { label: 'HashSet State', entries: [{ key: 'Size', value: '0' }] },
      },
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();
      const key = Number(op[1]);

      if (opType === 'add') {
        const existed = set.has(key);
        set.add(key);
        steps.push({
          line: 7,
          explanation: existed
            ? `add(${key}): Key ${key} already in set, no change.`
            : `add(${key}): Insert ${key} into set.`,
          variables: { op: `add(${key})`, key, existed },
          visualization: makeViz(key, 'active', `add(${key})`),
        });
      } else if (opType === 'remove') {
        const existed = set.has(key);
        set.delete(key);
        steps.push({
          line: 10,
          explanation: existed
            ? `remove(${key}): Key ${key} removed from set.`
            : `remove(${key}): Key ${key} not in set, no change.`,
          variables: { op: `remove(${key})`, key, existed },
          visualization: makeViz(-1, 'default', `remove(${key})`),
        });
      } else if (opType === 'contains') {
        const result = set.has(key);
        steps.push({
          line: 12,
          explanation: `contains(${key}): Key ${key} ${result ? 'found' : 'not found'} in set. Return ${result}.`,
          variables: { op: `contains(${key})`, key, result },
          visualization: makeViz(key, result ? 'found' : 'mismatch', `contains(${key}) -> ${result}`),
        });
      }
    }

    steps.push({
      line: 13,
      explanation: `All operations complete. Final set: {${Array.from(set).join(', ')}}.`,
      variables: { finalSet: Array.from(set) },
      visualization: makeViz(-1, 'default', 'Complete'),
    });

    return steps;
  },
};

export default designHashsetIi;
