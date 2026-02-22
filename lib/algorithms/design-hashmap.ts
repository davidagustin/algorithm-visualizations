import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHashMap: AlgorithmDefinition = {
  id: 'design-hashmap',
  title: 'Design HashMap',
  leetcodeNumber: 706,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Design a HashMap without using built-in libraries. Use an array of buckets where each bucket holds a list of [key, value] pairs (chaining). Hash function: key % bucketSize. Supports put(key, value), get(key) returning -1 if not found, and remove(key). Demonstrates hash collision handling via chaining.',
  tags: ['Hash Map', 'Design', 'Array'],
  code: {
    pseudocode: `class MyHashMap:
  SIZE = 1000
  buckets = [[] for _ in range(SIZE)]

  function hash(key):
    return key % SIZE

  function put(key, value):
    h = hash(key)
    for pair in buckets[h]:
      if pair[0] == key: pair[1] = value; return
    buckets[h].append([key, value])

  function get(key):
    h = hash(key)
    for pair in buckets[h]:
      if pair[0] == key: return pair[1]
    return -1

  function remove(key):
    h = hash(key)
    buckets[h] = [p for p in buckets[h] if p[0] != key]`,
    python: `class MyHashMap:
    def __init__(self):
        self.SIZE = 1000
        self.buckets = [[] for _ in range(self.SIZE)]
    def hash(self, key):
        return key % self.SIZE
    def put(self, key, value):
        h = self.hash(key)
        for p in self.buckets[h]:
            if p[0] == key: p[1] = value; return
        self.buckets[h].append([key, value])
    def get(self, key):
        for p in self.buckets[self.hash(key)]:
            if p[0] == key: return p[1]
        return -1
    def remove(self, key):
        h = self.hash(key)
        self.buckets[h] = [p for p in self.buckets[h] if p[0] != key]`,
    javascript: `class MyHashMap {
  constructor() {
    this.SIZE = 1000;
    this.buckets = Array.from({length: this.SIZE}, () => []);
  }
  hash(key) { return key % this.SIZE; }
  put(key, value) {
    const h = this.hash(key), b = this.buckets[h];
    for (const p of b) if (p[0]===key) { p[1]=value; return; }
    b.push([key, value]);
  }
  get(key) {
    for (const p of this.buckets[this.hash(key)])
      if (p[0]===key) return p[1];
    return -1;
  }
  remove(key) {
    const h = this.hash(key);
    this.buckets[h] = this.buckets[h].filter(p => p[0]!==key);
  }
}`,
    java: `class MyHashMap {
    private List<int[]>[] buckets;
    private static final int SIZE = 1000;
    public MyHashMap() {
        buckets = new List[SIZE];
        for (int i=0;i<SIZE;i++) buckets[i]=new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }
    public void put(int key, int value) {
        int h=hash(key);
        for (int[] p : buckets[h]) if(p[0]==key){p[1]=value;return;}
        buckets[h].add(new int[]{key,value});
    }
    public int get(int key) {
        for (int[] p : buckets[hash(key)]) if(p[0]==key) return p[1];
        return -1;
    }
    public void remove(int key) {
        int h=hash(key);
        buckets[h].removeIf(p -> p[0]==key);
    }
}`,
  },
  defaultInput: {
    operations: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['get', 3], ['put', 2, 1], ['get', 2], ['remove', 2], ['get', 2]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'put 1 1, put 2 2, get 1, get 3, put 2 1, get 2, remove 2, get 2',
      placeholder: 'put 1 1, get 1, remove 1',
      helperText: 'Comma-separated: "put k v", "get k", "remove k"',
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
        return parts.length === 3
          ? [parts[0], Number(parts[1]), Number(parts[2])]
          : [parts[0], Number(parts[1])];
      });
    }

    const SIZE = 11; // small size for visualization
    const buckets: [number, number][][] = Array.from({ length: SIZE }, () => []);
    const steps: AlgorithmStep[] = [];

    const hash = (key: number) => key % SIZE;

    const makeViz = (activeHash: number, action: string, result: string): ArrayVisualization => {
      // Show bucket sizes as array
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
          label: 'HashMap Buckets',
          entries: [
            { key: 'Action', value: action },
            { key: 'Result', value: result },
            ...buckets
              .map((b, k) => b.length > 0 ? { key: `Bucket[${k}]`, value: b.map(([kk, v]) => `${kk}:${v}`).join(', ') } : null)
              .filter((e): e is { key: string; value: string } => e !== null),
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Initialize HashMap with ${SIZE} buckets (visualized). Each bucket holds key-value pairs. Hash function: key % ${SIZE}.`,
      variables: { SIZE },
      visualization: makeViz(-1, 'Init', '—'),
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();
      const key = Number(op[1]);
      const h = hash(key);

      if (opType === 'put') {
        const value = Number(op[2]);
        const existing = buckets[h].find(p => p[0] === key);

        if (existing) {
          existing[1] = value;
          steps.push({
            line: 8,
            explanation: `put(${key}, ${value}): hash(${key})=${h}. Key exists in bucket[${h}]. Update value to ${value}.`,
            variables: { key, value, hash: h },
            visualization: makeViz(h, `put(${key},${value}) — update`, `Updated bucket[${h}]`),
          });
        } else {
          buckets[h].push([key, value]);
          steps.push({
            line: 9,
            explanation: `put(${key}, ${value}): hash(${key})=${h}. Key not found. Append [${key}, ${value}] to bucket[${h}].`,
            variables: { key, value, hash: h },
            visualization: makeViz(h, `put(${key},${value}) — insert`, `Added to bucket[${h}]`),
          });
        }
      } else if (opType === 'get') {
        const found = buckets[h].find(p => p[0] === key);
        const result = found ? found[1] : -1;

        steps.push({
          line: 13,
          explanation: `get(${key}): hash(${key})=${h}. Search bucket[${h}]: ${found ? `found value=${result}` : 'not found → return -1'}.`,
          variables: { key, hash: h, result },
          visualization: makeViz(h, `get(${key})`, String(result)),
        });
      } else if (opType === 'remove') {
        const before = buckets[h].length;
        buckets[h] = buckets[h].filter(p => p[0] !== key);
        const removed = buckets[h].length < before;

        steps.push({
          line: 17,
          explanation: `remove(${key}): hash(${key})=${h}. ${removed ? `Removed key ${key} from bucket[${h}].` : `Key ${key} not found in bucket[${h}].`}`,
          variables: { key, hash: h, removed },
          visualization: makeViz(h, `remove(${key})`, removed ? 'Removed' : 'Not found'),
        });
      }
    }

    steps.push({
      line: 18,
      explanation: `All operations complete. Final state of HashMap buckets.`,
      variables: {},
      visualization: makeViz(-1, 'Complete', '—'),
    });

    return steps;
  },
};

export default designHashMap;
