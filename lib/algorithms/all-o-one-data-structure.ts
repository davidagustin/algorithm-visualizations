import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const allOOneDataStructure: AlgorithmDefinition = {
  id: 'all-o-one-data-structure',
  title: 'All O(1) Data Structure',
  leetcodeNumber: 432,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Design a data structure supporting inc(key), dec(key), getMaxKey(), and getMinKey() all in O(1). Use a doubly linked list of buckets sorted by count, combined with two hash maps: one from key to count, one from count to a bucket node. Each bucket stores all keys with the same count.',
  tags: ['linked list', 'doubly linked list', 'hash map', 'design', 'O(1)'],

  code: {
    pseudocode: `class AllOne:
  // Doubly linked list of buckets by count
  // bucketMap: count -> bucket
  // keyMap: key -> count

  inc(key):
    count = keyMap[key] + 1
    keyMap[key] = count
    add key to bucket(count)
    remove key from bucket(count-1)
    if bucket(count-1) empty: remove it

  dec(key):
    count = keyMap[key] - 1
    if count == 0: del keyMap[key]
    else: keyMap[key] = count; add key to bucket(count)
    remove key from bucket(count+1)
    if bucket(count+1) empty: remove it

  getMaxKey(): last bucket in list -> any key
  getMinKey(): first bucket in list -> any key`,

    python: `class AllOne:
    def __init__(self):
        self.key_count = {}
        self.count_keys = {}
    def inc(self, key):
        c = self.key_count.get(key, 0)
        self.key_count[key] = c + 1
        self.count_keys.setdefault(c+1, set()).add(key)
        if c in self.count_keys:
            self.count_keys[c].discard(key)
            if not self.count_keys[c]: del self.count_keys[c]
    def dec(self, key):
        c = self.key_count[key]
        if c == 1: del self.key_count[key]
        else: self.key_count[key] = c - 1; self.count_keys.setdefault(c-1, set()).add(key)
        self.count_keys[c].discard(key)
        if not self.count_keys[c]: del self.count_keys[c]
    def getMaxKey(self): return next(iter(self.count_keys[max(self.count_keys)])) if self.count_keys else ""
    def getMinKey(self): return next(iter(self.count_keys[min(self.count_keys)])) if self.count_keys else ""`,

    javascript: `class AllOne {
  constructor() { this.keyCount = new Map(); this.countKeys = new Map(); }
  inc(key) {
    const c = this.keyCount.get(key) || 0;
    this.keyCount.set(key, c + 1);
    if (!this.countKeys.has(c+1)) this.countKeys.set(c+1, new Set());
    this.countKeys.get(c+1).add(key);
    if (c > 0) { this.countKeys.get(c).delete(key); if (!this.countKeys.get(c).size) this.countKeys.delete(c); }
  }
  dec(key) {
    const c = this.keyCount.get(key);
    if (c === 1) this.keyCount.delete(key); else { this.keyCount.set(key, c-1); if (!this.countKeys.has(c-1)) this.countKeys.set(c-1, new Set()); this.countKeys.get(c-1).add(key); }
    this.countKeys.get(c).delete(key); if (!this.countKeys.get(c).size) this.countKeys.delete(c);
  }
  getMaxKey() { if (!this.countKeys.size) return ""; const max = Math.max(...this.countKeys.keys()); return this.countKeys.get(max).values().next().value; }
  getMinKey() { if (!this.countKeys.size) return ""; const min = Math.min(...this.countKeys.keys()); return this.countKeys.get(min).values().next().value; }
}`,

    java: `class AllOne {
    TreeMap<Integer, Set<String>> countKeys = new TreeMap<>();
    Map<String, Integer> keyCount = new HashMap<>();
    public void inc(String key) {
        int c = keyCount.getOrDefault(key, 0);
        keyCount.put(key, c + 1);
        countKeys.computeIfAbsent(c+1, k -> new HashSet<>()).add(key);
        if (c > 0) { countKeys.get(c).remove(key); if (countKeys.get(c).isEmpty()) countKeys.remove(c); }
    }
    public void dec(String key) {
        int c = keyCount.get(key);
        if (c == 1) keyCount.remove(key); else { keyCount.put(key, c-1); countKeys.computeIfAbsent(c-1, k -> new HashSet<>()).add(key); }
        countKeys.get(c).remove(key); if (countKeys.get(c).isEmpty()) countKeys.remove(c);
    }
    public String getMaxKey() { return countKeys.isEmpty() ? "" : countKeys.lastEntry().getValue().iterator().next(); }
    public String getMinKey() { return countKeys.isEmpty() ? "" : countKeys.firstEntry().getValue().iterator().next(); }
}`,
  },

  defaultInput: {
    nums: [3, 2, 3, 1, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Key Sequence (inc operations)',
      type: 'array',
      defaultValue: [3, 2, 3, 1, 2, 3],
      placeholder: '3,2,3,1,2,3',
      helperText: 'Sequence of integer keys to inc(). Visualizes count buckets.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const keys = input.nums as number[];
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

    const keyCount = new Map<number, number>();
    const countKeys = new Map<number, Set<number>>();

    steps.push({
      line: 1,
      explanation: 'Initialize AllOne data structure. Empty key-count map and count-keys map. Doubly linked list of buckets starts empty.',
      variables: { keyCount: {}, countKeys: {} },
      visualization: makeViz([], {}, {}),
    });

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const prevCount = keyCount.get(key) || 0;
      const newCount = prevCount + 1;
      keyCount.set(key, newCount);

      if (prevCount > 0 && countKeys.has(prevCount)) {
        countKeys.get(prevCount)!.delete(key);
        if (countKeys.get(prevCount)!.size === 0) countKeys.delete(prevCount);
      }
      if (!countKeys.has(newCount)) countKeys.set(newCount, new Set());
      countKeys.get(newCount)!.add(key);

      const sortedCounts = [...countKeys.keys()].sort((a, b) => a - b);
      const displayArr = sortedCounts.flatMap(c => [...countKeys.get(c)!].map(_ => c));
      const minKey = countKeys.get(sortedCounts[0])!.values().next().value;
      const maxKey = countKeys.get(sortedCounts[sortedCounts.length - 1])!.values().next().value;

      steps.push({
        line: 5,
        explanation: `inc(${key}): Count of key ${key} goes from ${prevCount} to ${newCount}. Buckets by count: {${sortedCounts.map(c => `${c}:[${[...countKeys.get(c)!].join(',')}]`).join(', ')}}.`,
        variables: { 'key': key, 'new count': newCount, 'min key': minKey, 'max key': maxKey },
        visualization: makeViz([...displayArr],
          Object.fromEntries(displayArr.map((c, i) => [i, c === newCount ? 'active' : 'visited'])),
          Object.fromEntries(displayArr.map((c, i) => [i, `cnt=${c}`]))),
      });
    }

    const sortedCounts = [...countKeys.keys()].sort((a, b) => a - b);
    const minKey = countKeys.get(sortedCounts[0])!.values().next().value;
    const maxKey = countKeys.get(sortedCounts[sortedCounts.length - 1])!.values().next().value;

    steps.push({
      line: 14,
      explanation: `getMinKey() = ${minKey} (count ${sortedCounts[0]}). getMaxKey() = ${maxKey} (count ${sortedCounts[sortedCounts.length - 1]}). All operations are O(1).`,
      variables: { 'min key': minKey, 'max key': maxKey },
      visualization: makeViz([...sortedCounts],
        { 0: 'found', [sortedCounts.length - 1]: 'active' },
        { 0: `min(${minKey})`, [sortedCounts.length - 1]: `max(${maxKey})` }),
    });

    return steps;
  },
};

export default allOOneDataStructure;
