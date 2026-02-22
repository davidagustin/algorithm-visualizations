import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHashSet: AlgorithmDefinition = {
  id: 'design-hashset',
  title: 'Design HashSet',
  leetcodeNumber: 705,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Design a HashSet without using built-in libraries. Use an array of buckets (chaining). Each bucket holds a list of keys. Hash function: key % bucketSize. Supports add(key), remove(key), and contains(key). Demonstrates open hashing / separate chaining for collision resolution.',
  tags: ['Hash Map', 'Design', 'Array'],
  code: {
    pseudocode: `class MyHashSet:
  SIZE = 1000
  buckets = [[] for _ in range(SIZE)]

  function hash(key): return key % SIZE

  function add(key):
    h = hash(key)
    if key not in buckets[h]:
      buckets[h].append(key)

  function remove(key):
    h = hash(key)
    buckets[h] = [k for k in buckets[h] if k != key]

  function contains(key):
    return key in buckets[hash(key)]`,
    python: `class MyHashSet:
    def __init__(self):
        self.SIZE = 1000
        self.buckets = [[] for _ in range(self.SIZE)]
    def hash(self, key): return key % self.SIZE
    def add(self, key):
        h = self.hash(key)
        if key not in self.buckets[h]:
            self.buckets[h].append(key)
    def remove(self, key):
        h = self.hash(key)
        self.buckets[h] = [k for k in self.buckets[h] if k != key]
    def contains(self, key):
        return key in self.buckets[self.hash(key)]`,
    javascript: `class MyHashSet {
  constructor() {
    this.SIZE = 1000;
    this.buckets = Array.from({length:this.SIZE},()=>[]);
  }
  hash(key) { return key % this.SIZE; }
  add(key) {
    const h=this.hash(key);
    if(!this.buckets[h].includes(key)) this.buckets[h].push(key);
  }
  remove(key) {
    const h=this.hash(key);
    this.buckets[h]=this.buckets[h].filter(k=>k!==key);
  }
  contains(key) {
    return this.buckets[this.hash(key)].includes(key);
  }
}`,
    java: `class MyHashSet {
    private List<Integer>[] buckets;
    private static final int SIZE = 1000;
    public MyHashSet() {
        buckets = new List[SIZE];
        for (int i=0;i<SIZE;i++) buckets[i]=new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }
    public void add(int key) {
        if (!contains(key)) buckets[hash(key)].add(key);
    }
    public void remove(int key) { buckets[hash(key)].remove((Integer)key); }
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

    const SIZE = 11; // small for visualization
    const buckets: number[][] = Array.from({ length: SIZE }, () => []);
    const steps: AlgorithmStep[] = [];

    const hash = (key: number) => key % SIZE;

    const makeViz = (activeHash: number, action: string, result: string): ArrayVisualization => {
      const arr = buckets.map(b => b.length);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < SIZE; k++) {
        highlights[k] = k === activeHash ? 'active' : buckets[k].length > 0 ? 'sorted' : 'default';
        labels[k] = `[${k}]`;
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'HashSet Buckets',
          entries: [
            { key: 'Action', value: action },
            { key: 'Result', value: result },
            ...buckets
              .map((b, k) => b.length > 0 ? { key: `Bucket[${k}]`, value: `{${b.join(', ')}}` } : null)
              .filter((e): e is { key: string; value: string } => e !== null),
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Initialize HashSet with ${SIZE} buckets (visualized). Each bucket is a list of keys. Hash: key % ${SIZE}.`,
      variables: { SIZE },
      visualization: makeViz(-1, 'Init', '—'),
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();
      const key = Number(op[1]);
      const h = hash(key);

      if (opType === 'add') {
        if (!buckets[h].includes(key)) {
          buckets[h].push(key);
          steps.push({
            line: 7,
            explanation: `add(${key}): hash(${key})=${h}. Key not in bucket[${h}]. Added.`,
            variables: { key, hash: h },
            visualization: makeViz(h, `add(${key})`, 'Added'),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `add(${key}): hash(${key})=${h}. Key already in bucket[${h}]. No-op.`,
            variables: { key, hash: h },
            visualization: makeViz(h, `add(${key})`, 'Already exists'),
          });
        }
      } else if (opType === 'remove') {
        const before = buckets[h].length;
        buckets[h] = buckets[h].filter(k => k !== key);
        const removed = buckets[h].length < before;

        steps.push({
          line: 11,
          explanation: `remove(${key}): hash(${key})=${h}. ${removed ? `Removed from bucket[${h}].` : `Key not found.`}`,
          variables: { key, hash: h, removed },
          visualization: makeViz(h, `remove(${key})`, removed ? 'Removed' : 'Not found'),
        });
      } else if (opType === 'contains') {
        const found = buckets[h].includes(key);

        steps.push({
          line: 14,
          explanation: `contains(${key}): hash(${key})=${h}. Search bucket[${h}]: ${found ? 'FOUND' : 'NOT found'} → return ${found}.`,
          variables: { key, hash: h, result: found },
          visualization: makeViz(h, `contains(${key})`, String(found)),
        });
      }
    }

    steps.push({
      line: 15,
      explanation: `All operations complete.`,
      variables: {},
      visualization: makeViz(-1, 'Complete', '—'),
    });

    return steps;
  },
};

export default designHashSet;
