import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designHashmapIi: AlgorithmDefinition = {
  id: 'design-hashmap-ii',
  title: 'Design HashMap',
  leetcodeNumber: 706,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Design a HashMap without using any built-in hash table libraries. Implement put, get, and remove operations. Use an array of buckets with chaining to handle collisions.',
  tags: ['Hash Map', 'Design', 'Array'],
  code: {
    pseudocode: `class MyHashMap:
  function init():
    this.buckets = array of SIZE empty lists
  function hash(key):
    return key mod SIZE
  function put(key, value):
    bucket = hash(key)
    for pair in buckets[bucket]:
      if pair.key == key: pair.value = value; return
    buckets[bucket].append([key, value])
  function get(key):
    bucket = hash(key)
    for pair in buckets[bucket]:
      if pair.key == key: return pair.value
    return -1
  function remove(key):
    bucket = hash(key)
    remove pair with key from buckets[bucket]`,
    python: `class MyHashMap:
    def __init__(self):
        self.SIZE = 1000
        self.buckets = [[] for _ in range(self.SIZE)]

    def _hash(self, key):
        return key % self.SIZE

    def put(self, key: int, value: int) -> None:
        b = self._hash(key)
        for i, (k, v) in enumerate(self.buckets[b]):
            if k == key:
                self.buckets[b][i] = (key, value)
                return
        self.buckets[b].append((key, value))

    def get(self, key: int) -> int:
        b = self._hash(key)
        for k, v in self.buckets[b]:
            if k == key:
                return v
        return -1

    def remove(self, key: int) -> None:
        b = self._hash(key)
        self.buckets[b] = [(k, v) for k, v in self.buckets[b] if k != key]`,
    javascript: `class MyHashMap {
  constructor() {
    this.SIZE = 1000;
    this.buckets = Array.from({length: this.SIZE}, () => []);
  }
  _hash(key) { return key % this.SIZE; }
  put(key, value) {
    const b = this._hash(key);
    const idx = this.buckets[b].findIndex(([k]) => k === key);
    if (idx !== -1) this.buckets[b][idx][1] = value;
    else this.buckets[b].push([key, value]);
  }
  get(key) {
    const b = this._hash(key);
    const pair = this.buckets[b].find(([k]) => k === key);
    return pair ? pair[1] : -1;
  }
  remove(key) {
    const b = this._hash(key);
    this.buckets[b] = this.buckets[b].filter(([k]) => k !== key);
  }
}`,
    java: `class MyHashMap {
    private static final int SIZE = 1000;
    private List<int[]>[] buckets;
    public MyHashMap() {
        buckets = new List[SIZE];
        for (int i = 0; i < SIZE; i++) buckets[i] = new ArrayList<>();
    }
    private int hash(int key) { return key % SIZE; }
    public void put(int key, int value) {
        int b = hash(key);
        for (int[] pair : buckets[b]) {
            if (pair[0] == key) { pair[1] = value; return; }
        }
        buckets[b].add(new int[]{key, value});
    }
    public int get(int key) {
        for (int[] pair : buckets[hash(key)])
            if (pair[0] == key) return pair[1];
        return -1;
    }
    public void remove(int key) {
        buckets[hash(key)].removeIf(p -> p[0] == key);
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

    const steps: AlgorithmStep[] = [];
    const map = new Map<number, number>();

    function makeViz(highlight: number, color: string, label: string): ArrayVisualization {
      const keys = Array.from(map.keys());
      const arr = keys.map(k => map.get(k) ?? 0);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      keys.forEach((k, i) => {
        highlights[i] = k === highlight ? color : 'default';
        labels[i] = `k=${k}`;
      });
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'HashMap State',
          entries: [
            { key: 'Action', value: label },
            { key: 'Size', value: `${map.size}` },
            ...keys.map(k => ({ key: `key=${k}`, value: `val=${map.get(k)}` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize empty HashMap.',
      variables: { map: {} },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
        auxData: { label: 'HashMap State', entries: [{ key: 'Size', value: '0' }] },
      },
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();
      if (opType === 'put') {
        const key = Number(op[1]);
        const value = Number(op[2]);
        const existed = map.has(key);
        map.set(key, value);
        steps.push({
          line: existed ? 9 : 10,
          explanation: existed
            ? `put(${key}, ${value}): Key ${key} already exists. Update value to ${value}.`
            : `put(${key}, ${value}): Insert key ${key} with value ${value}.`,
          variables: { op: `put(${key},${value})`, key, value, existed },
          visualization: makeViz(key, 'active', `put(${key},${value})`),
        });
      } else if (opType === 'get') {
        const key = Number(op[1]);
        const result = map.has(key) ? map.get(key)! : -1;
        steps.push({
          line: 13,
          explanation: map.has(key)
            ? `get(${key}): Found key ${key}, return ${result}.`
            : `get(${key}): Key ${key} not found, return -1.`,
          variables: { op: `get(${key})`, key, result },
          visualization: makeViz(key, map.has(key) ? 'found' : 'mismatch', `get(${key}) -> ${result}`),
        });
      } else if (opType === 'remove') {
        const key = Number(op[1]);
        const existed = map.has(key);
        map.delete(key);
        steps.push({
          line: 16,
          explanation: existed
            ? `remove(${key}): Key ${key} removed from map.`
            : `remove(${key}): Key ${key} not found, nothing to remove.`,
          variables: { op: `remove(${key})`, key, existed },
          visualization: makeViz(-1, 'default', `remove(${key})`),
        });
      }
    }

    steps.push({
      line: 17,
      explanation: `All operations complete. Final map size: ${map.size}.`,
      variables: { finalMap: Object.fromEntries(map) },
      visualization: makeViz(-1, 'default', 'Complete'),
    });

    return steps;
  },
};

export default designHashmapIi;
