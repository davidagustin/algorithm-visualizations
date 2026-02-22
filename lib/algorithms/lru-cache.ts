import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lruCache: AlgorithmDefinition = {
  id: 'lru-cache',
  title: 'LRU Cache',
  leetcodeNumber: 146,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get and put operations in O(1) time using a hash map and a doubly linked list to track usage order.',
  tags: ['Linked List', 'Hash Map', 'Design'],
  code: {
    pseudocode: `class LRUCache:
  function init(capacity):
    this.capacity = capacity
    this.cache = empty hash map
    this.order = empty doubly linked list
  function get(key):
    if key not in cache: return -1
    move key to front of order
    return cache[key]
  function put(key, value):
    if key in cache:
      update cache[key] = value
      move key to front of order
    else:
      if size == capacity:
        remove last from order
        delete from cache
      add key to front of order
      cache[key] = value`,
    python: `class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.cache = {}
        self.order = []

    def get(self, key):
        if key not in self.cache:
            return -1
        self.order.remove(key)
        self.order.insert(0, key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.order.remove(key)
        elif len(self.cache) == self.capacity:
            lru = self.order.pop()
            del self.cache[lru]
        self.order.insert(0, key)
        self.cache[key] = value`,
    javascript: `class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    else if (this.cache.size === this.capacity) {
      const lru = this.cache.keys().next().value;
      this.cache.delete(lru);
    }
    this.cache.set(key, value);
  }
}`,
    java: `class LRUCache extends LinkedHashMap<Integer, Integer> {
    private int capacity;
    public LRUCache(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }
    public int get(int key) {
        return super.getOrDefault(key, -1);
    }
    public void put(int key, int value) {
        super.put(key, value);
    }
    protected boolean removeEldestEntry(Map.Entry e) {
        return size() > capacity;
    }
}`,
  },
  defaultInput: {
    capacity: 2,
    operations: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2]],
  },
  inputFields: [
    {
      name: 'capacity',
      label: 'Cache Capacity',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Maximum number of items in the cache',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'put 1 1, put 2 2, get 1, put 3 3, get 2',
      placeholder: 'put 1 1, put 2 2, get 1',
      helperText: 'Comma-separated operations: "put k v" or "get k"',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const capacity = input.capacity as number;
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
    const cache = new Map<number, number>();
    const order: number[] = []; // front = most recent, end = LRU

    function makeViz(action: string): ArrayVisualization {
      const cacheArr = order.map(k => k);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < cacheArr.length; i++) {
        highlights[i] = i === 0 ? 'active' : (i === cacheArr.length - 1 ? 'visited' : 'default');
        labels[i] = `k=${cacheArr[i]}:v=${cache.get(cacheArr[i])}`;
      }

      if (cacheArr.length > 0) {
        labels[0] = (labels[0] || '') + ' (MRU)';
        if (cacheArr.length > 1) {
          labels[cacheArr.length - 1] = (labels[cacheArr.length - 1] || '') + ' (LRU)';
        }
      }

      return {
        type: 'array',
        array: cacheArr.map(k => cache.get(k) ?? 0),
        highlights,
        labels,
        auxData: {
          label: 'Cache State',
          entries: [
            { key: 'Operation', value: action },
            { key: 'Capacity', value: `${order.length}/${capacity}` },
            ...order.map(k => ({ key: `key=${k}`, value: `val=${cache.get(k)}` })),
          ],
        },
      };
    }

    // Initial state
    steps.push({
      line: 1,
      explanation: `Initialize LRU Cache with capacity ${capacity}.`,
      variables: { capacity, cache: {} },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
        auxData: {
          label: 'Cache State',
          entries: [{ key: 'Capacity', value: `0/${capacity}` }],
        },
      },
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();

      if (opType === 'put') {
        const key = Number(op[1]);
        const value = Number(op[2]);

        if (cache.has(key)) {
          // Update existing key
          cache.set(key, value);
          const idx = order.indexOf(key);
          order.splice(idx, 1);
          order.unshift(key);

          steps.push({
            line: 10,
            explanation: `put(${key}, ${value}): Key ${key} exists. Update value to ${value} and move to front (most recently used).`,
            variables: { operation: `put(${key},${value})`, cache: Object.fromEntries(cache), order: [...order] },
            visualization: makeViz(`put(${key}, ${value}) - update`),
          });
        } else {
          if (order.length === capacity) {
            const lruKey = order.pop()!;
            cache.delete(lruKey);

            steps.push({
              line: 14,
              explanation: `put(${key}, ${value}): Cache is full. Evict LRU key ${lruKey}.`,
              variables: { operation: `put(${key},${value})`, evicted: lruKey, cache: Object.fromEntries(cache), order: [...order] },
              visualization: makeViz(`put(${key}, ${value}) - evict ${lruKey}`),
            });
          }

          cache.set(key, value);
          order.unshift(key);

          steps.push({
            line: 16,
            explanation: `put(${key}, ${value}): Insert key ${key} with value ${value} at front.`,
            variables: { operation: `put(${key},${value})`, cache: Object.fromEntries(cache), order: [...order] },
            visualization: makeViz(`put(${key}, ${value})`),
          });
        }
      } else if (opType === 'get') {
        const key = Number(op[1]);

        if (!cache.has(key)) {
          steps.push({
            line: 7,
            explanation: `get(${key}): Key ${key} not found in cache. Return -1.`,
            variables: { operation: `get(${key})`, result: -1, cache: Object.fromEntries(cache), order: [...order] },
            visualization: makeViz(`get(${key}) -> -1`),
          });
        } else {
          const val = cache.get(key)!;
          const idx = order.indexOf(key);
          order.splice(idx, 1);
          order.unshift(key);

          steps.push({
            line: 8,
            explanation: `get(${key}): Key ${key} found with value ${val}. Move to front (most recently used). Return ${val}.`,
            variables: { operation: `get(${key})`, result: val, cache: Object.fromEntries(cache), order: [...order] },
            visualization: makeViz(`get(${key}) -> ${val}`),
          });
        }
      }
    }

    // Final state
    steps.push({
      line: 17,
      explanation: `All operations complete. Final cache: [${order.map(k => `${k}:${cache.get(k)}`).join(', ')}].`,
      variables: { finalCache: Object.fromEntries(cache), order: [...order] },
      visualization: makeViz('Complete'),
    });

    return steps;
  },
};

export default lruCache;
