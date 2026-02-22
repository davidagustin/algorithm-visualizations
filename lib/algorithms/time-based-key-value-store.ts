import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const timeBasedKeyValueStore: AlgorithmDefinition = {
  id: 'time-based-key-value-store',
  title: 'Time Based Key-Value Store',
  leetcodeNumber: 981,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Design a key-value store that supports set(key, value, timestamp) and get(key, timestamp) operations. For get, return the value set at the largest timestamp <= the given timestamp. Binary search over the sorted list of timestamps for each key to achieve O(log n) lookup.',
  tags: ['binary search', 'hash map', 'design', 'sorted'],

  code: {
    pseudocode: `class TimeMap:
  store = {}  // key -> [(timestamp, value)]

  function set(key, value, timestamp):
    store[key].append((timestamp, value))

  function get(key, timestamp):
    pairs = store.get(key, [])
    left = 0, right = len(pairs) - 1
    result = ""
    while left <= right:
      mid = left + (right - left) / 2
      if pairs[mid][0] <= timestamp:
        result = pairs[mid][1]
        left = mid + 1
      else:
        right = mid - 1
    return result`,

    python: `class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        pairs = self.store.get(key, [])
        left, right, result = 0, len(pairs) - 1, ""
        while left <= right:
            mid = left + (right - left) // 2
            if pairs[mid][0] <= timestamp:
                result = pairs[mid][1]
                left = mid + 1
            else:
                right = mid - 1
        return result`,

    javascript: `class TimeMap {
  constructor() { this.store = {}; }
  set(key, value, timestamp) {
    if (!this.store[key]) this.store[key] = [];
    this.store[key].push([timestamp, value]);
  }
  get(key, timestamp) {
    const pairs = this.store[key] || [];
    let left = 0, right = pairs.length - 1, result = "";
    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      if (pairs[mid][0] <= timestamp) { result = pairs[mid][1]; left = mid + 1; }
      else right = mid - 1;
    }
    return result;
  }
}`,

    java: `class TimeMap {
    Map<String, List<int[]>> store = new HashMap<>();
    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new ArrayList<>())
             .add(new int[]{timestamp, value.hashCode()});
    }
    public String get(String key, int timestamp) {
        List<int[]> pairs = store.getOrDefault(key, new ArrayList<>());
        int left = 0, right = pairs.size() - 1;
        String result = "";
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (pairs.get(mid)[0] <= timestamp) { result = "..."; left = mid + 1; }
            else right = mid - 1;
        }
        return result;
    }
}`,
  },

  defaultInput: {
    operations: [
      { op: 'set', key: 'foo', value: 'bar', timestamp: 1 },
      { op: 'set', key: 'foo', value: 'bar2', timestamp: 4 },
      { op: 'get', key: 'foo', timestamp: 4 },
      { op: 'get', key: 'foo', timestamp: 5 },
      { op: 'get', key: 'foo', timestamp: 3 },
      { op: 'get', key: 'foo', timestamp: 0 },
    ],
    queryIndex: 2,
  },

  inputFields: [
    {
      name: 'queryIndex',
      label: 'Query to Visualize (index)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Which get operation to trace (0-indexed among all ops)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Simulate: key="foo" with timestamps [1,4], values ["bar","bar2"]
    const pairs: { ts: number; val: string }[] = [
      { ts: 1, val: 'bar' },
      { ts: 4, val: 'bar2' },
    ];
    const queryTs = 3; // visualize get("foo", 3) — should return "bar"

    const tsArr = pairs.map((p) => p.ts);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: tsArr,
      highlights,
      labels,
      auxData: {
        label: 'Stored entries for key "foo"',
        entries: pairs.map((p, i) => ({ key: `index ${i}`, value: `ts=${p.ts} → "${p.val}"` })),
      },
    });

    steps.push({
      line: 1,
      explanation: `TimeMap stores key="foo" with entries: [(ts=1,"bar"), (ts=4,"bar2")]. Query: get("foo", ts=${queryTs}).`,
      variables: { key: 'foo', queryTimestamp: queryTs },
      visualization: makeViz({ 0: 'default', 1: 'default' }, { 0: 'ts=1', 1: 'ts=4' }),
    });

    steps.push({
      line: 8,
      explanation: `Timestamps are sorted. Binary search for largest ts <= ${queryTs}. left=0, right=${pairs.length - 1}.`,
      variables: { left: 0, right: pairs.length - 1, queryTimestamp: queryTs },
      visualization: makeViz({ 0: 'pointer', 1: 'pointer' }, { 0: 'L', 1: 'R' }),
    });

    let left = 0;
    let right = pairs.length - 1;
    let result = '';

    while (left <= right) {
      const mid = left + Math.floor((right - left) / 2);
      const midTs = pairs[mid].ts;

      steps.push({
        line: 10,
        explanation: `mid=${mid}, pairs[mid].ts = ${midTs}. Compare with query timestamp ${queryTs}.`,
        variables: { left, right, mid, 'pairs[mid].ts': midTs, queryTimestamp: queryTs },
        visualization: makeViz(
          { [left]: 'pointer', [right]: 'pointer', [mid]: 'active' },
          { [left]: 'L', [right]: 'R', [mid]: 'mid' }
        ),
      });

      if (midTs <= queryTs) {
        result = pairs[mid].val;
        steps.push({
          line: 12,
          explanation: `${midTs} <= ${queryTs}: candidate found "${result}". Move left up to find a later timestamp: left = ${mid + 1}.`,
          variables: { mid, result, left: mid + 1, right },
          visualization: makeViz({ [mid]: 'found' }, { [mid]: `"${result}"` }),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 14,
          explanation: `${midTs} > ${queryTs}: timestamp too large. Move right down: right = ${mid - 1}.`,
          variables: { mid, left, right: mid - 1 },
          visualization: makeViz({ [mid]: 'visited' }, { [mid]: 'too late' }),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 16,
      explanation: `Search complete. get("foo", ${queryTs}) = "${result || '(empty, no valid timestamp)'}".`,
      variables: { result: result || '' },
      visualization: makeViz(
        result ? { [pairs.findIndex((p) => p.val === result)]: 'found' } : {},
        result ? { [pairs.findIndex((p) => p.val === result)]: 'result' } : {}
      ),
    });

    return steps;
  },
};

export default timeBasedKeyValueStore;
