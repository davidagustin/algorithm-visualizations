import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lruCacheIi: AlgorithmDefinition = {
  id: 'lru-cache-ii',
  title: 'LRU Cache (Ordered Map Approach)',
  leetcodeNumber: 146,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Implement a Least Recently Used (LRU) cache with get(key) and put(key, value) in O(1). Use a doubly linked list to maintain usage order (most recent at tail, least recent at head) combined with a hash map for O(1) key lookup. On get or put, move the accessed node to the tail. On capacity overflow, evict the head node.',
  tags: ['linked list', 'doubly linked list', 'hash map', 'design', 'LRU'],

  code: {
    pseudocode: `class LRUCache(capacity):
  map = {}  // key -> node
  head = dummy node (least recent)
  tail = dummy node (most recent)

  get(key):
    if key not in map: return -1
    node = map[key]
    moveToTail(node)
    return node.val

  put(key, value):
    if key in map:
      map[key].val = value
      moveToTail(map[key])
    else:
      node = new Node(key, value)
      map[key] = node
      insertAtTail(node)
      if len(map) > capacity:
        lru = removeHead()
        del map[lru.key]

  moveToTail(node): remove and re-insert at tail`,

    python: `from collections import OrderedDict
class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.cache = OrderedDict()
    def get(self, key):
        if key not in self.cache: return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)`,

    javascript: `class LRUCache {
  constructor(capacity) { this.cap = capacity; this.map = new Map(); }
  get(key) {
    if (!this.map.has(key)) return -1;
    const val = this.map.get(key);
    this.map.delete(key); this.map.set(key, val);
    return val;
  }
  put(key, value) {
    this.map.delete(key); this.map.set(key, value);
    if (this.map.size > this.cap) this.map.delete(this.map.keys().next().value);
  }
}`,

    java: `class LRUCache {
    int cap; LinkedHashMap<Integer,Integer> map;
    public LRUCache(int capacity) { this.cap = capacity; this.map = new LinkedHashMap<>(capacity, 0.75f, true); }
    public int get(int key) {
        return map.containsKey(key) ? map.get(key) : -1;
    }
    public void put(int key, int value) {
        map.put(key, value);
        if (map.size() > cap) map.remove(map.keySet().iterator().next());
    }
}`,
  },

  defaultInput: {
    nums: [1, 1, 2, 1, 3],
    capacity: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Keys to Access (put then get sequence)',
      type: 'array',
      defaultValue: [1, 1, 2, 1, 3],
      placeholder: '1,1,2,1,3',
      helperText: 'Sequence of key accesses to simulate',
    },
    {
      name: 'capacity',
      label: 'Cache Capacity',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of key-value pairs the cache holds',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const keys = input.nums as number[];
    const capacity = input.capacity as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const cache = new Map<number, number>();
    const order: number[] = [];

    steps.push({
      line: 1,
      explanation: `Initialize LRU cache with capacity = ${capacity}. Map stores key->value, order represents LRU (left=LRU, right=MRU).`,
      variables: { capacity, cache: {}, order: [] },
      visualization: makeViz([], {}, {}),
    });

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = key * 10;

      if (cache.has(key)) {
        // Move to end (most recently used)
        const val = cache.get(key)!;
        const orderIdx = order.indexOf(key);
        order.splice(orderIdx, 1);
        order.push(key);

        steps.push({
          line: 9,
          explanation: `get/put(${key}): Key ${key} exists in cache (value=${val}). Move to MRU position. Order: [${order.join(', ')}].`,
          variables: { key, value: val, 'cache size': cache.size, order: [...order] },
          visualization: makeViz([...order],
            { [order.length - 1]: 'found', ...Object.fromEntries(Array.from({ length: order.length - 1 }, (_, k) => [k, 'visited'])) },
            { 0: 'LRU', [order.length - 1]: `MRU(${key})` }),
        });
      } else {
        cache.set(key, value);
        order.push(key);

        if (cache.size > capacity) {
          const evicted = order.shift()!;
          cache.delete(evicted);

          steps.push({
            line: 17,
            explanation: `put(${key}=${value}): Cache full (capacity ${capacity}). Evict LRU key ${evicted}. Add key ${key}. Order: [${order.join(', ')}].`,
            variables: { key, value, evicted, 'cache size': cache.size, order: [...order] },
            visualization: makeViz([...order],
              { [order.length - 1]: 'active', ...Object.fromEntries(Array.from({ length: order.length - 1 }, (_, k) => [k, 'visited'])) },
              { 0: 'LRU', [order.length - 1]: `new(${key})` }),
          });
        } else {
          steps.push({
            line: 14,
            explanation: `put(${key}=${value}): Key ${key} is new. Insert at MRU position. Cache size = ${cache.size}/${capacity}. Order: [${order.join(', ')}].`,
            variables: { key, value, 'cache size': cache.size, order: [...order] },
            visualization: makeViz([...order],
              { [order.length - 1]: 'active', ...Object.fromEntries(Array.from({ length: order.length - 1 }, (_, k) => [k, 'visited'])) },
              { 0: 'LRU', [order.length - 1]: `new(${key})` }),
          });
        }
      }
    }

    steps.push({
      line: 20,
      explanation: `Final cache state. LRU order (left to right): [${order.join(', ')}]. Cache: {${order.map(k => `${k}:${k * 10}`).join(', ')}}.`,
      variables: { cache: Object.fromEntries(order.map(k => [k, k * 10])), order },
      visualization: makeViz([...order], Object.fromEntries(order.map((_, i) => [i, 'found'])), { 0: 'LRU', [order.length - 1]: 'MRU' }),
    });

    return steps;
  },
};

export default lruCacheIi;
