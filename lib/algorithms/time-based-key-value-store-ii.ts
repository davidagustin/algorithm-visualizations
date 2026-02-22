import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const timeBasedKeyValueStoreIi: AlgorithmDefinition = {
  id: 'time-based-key-value-store-ii',
  title: 'Time Based Key-Value Store',
  leetcodeNumber: 981,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a time-based key-value store. Implement set(key, value, timestamp) and get(key, timestamp). get returns the value with the largest timestamp <= given timestamp for that key, or empty string if none exists.',
  tags: ['Hash Map', 'Design', 'Binary Search', 'String'],
  code: {
    pseudocode: `class TimeMap:
  function init():
    store = {}  // key -> [(timestamp, value)]
  function set(key, value, timestamp):
    store[key].append((timestamp, value))
  function get(key, timestamp):
    if key not in store: return ""
    // binary search for largest ts <= timestamp
    pairs = store[key]
    lo, hi = 0, len(pairs) - 1
    result = ""
    while lo <= hi:
      mid = (lo + hi) // 2
      if pairs[mid].ts <= timestamp:
        result = pairs[mid].value; lo = mid + 1
      else: hi = mid - 1
    return result`,
    python: `import bisect

class TimeMap:
    def __init__(self):
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store: self.store[key] = []
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        if key not in self.store: return ""
        pairs = self.store[key]
        i = bisect.bisect_right(pairs, (timestamp, chr(127))) - 1
        return pairs[i][1] if i >= 0 else ""`,
    javascript: `class TimeMap {
  constructor() { this.store = new Map(); }
  set(key, value, timestamp) {
    if (!this.store.has(key)) this.store.set(key, []);
    this.store.get(key).push([timestamp, value]);
  }
  get(key, timestamp) {
    if (!this.store.has(key)) return "";
    const pairs = this.store.get(key);
    let lo = 0, hi = pairs.length - 1, res = "";
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (pairs[mid][0] <= timestamp) { res = pairs[mid][1]; lo = mid + 1; }
      else hi = mid - 1;
    }
    return res;
  }
}`,
    java: `class TimeMap {
    Map<String, List<int[]>> store = new HashMap<>();
    Map<String, List<String>> vals = new HashMap<>();
    public void set(String key, String value, int timestamp) {
        store.computeIfAbsent(key, k -> new ArrayList<>()).add(new int[]{timestamp});
        vals.computeIfAbsent(key, k -> new ArrayList<>()).add(value);
    }
    public String get(String key, int timestamp) {
        if (!store.containsKey(key)) return "";
        List<int[]> ts = store.get(key);
        int lo = 0, hi = ts.size() - 1, idx = -1;
        while (lo <= hi) { int mid = (lo+hi)/2; if (ts.get(mid)[0] <= timestamp) { idx = mid; lo = mid+1; } else hi = mid-1; }
        return idx < 0 ? "" : vals.get(key).get(idx);
    }
}`,
  },
  defaultInput: {
    operations: [['set', 'foo', 'bar', 1], ['get', 'foo', 1], ['get', 'foo', 3], ['set', 'foo', 'bar2', 4], ['get', 'foo', 4], ['get', 'foo', 5]],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'set foo bar 1, get foo 1, get foo 3, set foo bar2 4, get foo 4, get foo 5',
      placeholder: 'set key val ts, get key ts',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number | string[])[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number | string[])[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === 'set') return [parts[0], parts[1], parts[2], Number(parts[3])];
        return [parts[0], parts[1], Number(parts[2])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const store = new Map<string, [number, string][]>();

    function makeViz(activeKey: string, label: string): ArrayVisualization {
      const keys = Array.from(store.keys());
      const arr = keys.map(k => (store.get(k) || []).length);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      keys.forEach((k, i) => {
        highlights[i] = k === activeKey ? 'active' : 'default';
        lbls[i] = k;
      });
      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Time-Based KV Store',
          entries: [
            { key: 'Action', value: label },
            { key: 'Keys', value: keys.join(', ') || 'none' },
            ...keys.map(k => ({ key: k, value: (store.get(k) || []).map(([ts, v]) => `${ts}:${v}`).join(', ') })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize TimeMap.', variables: {}, visualization: makeViz('', 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'set') {
        const key = String(op[1]);
        const value = String(op[2]);
        const timestamp = Number(op[3]);
        if (!store.has(key)) store.set(key, []);
        store.get(key)!.push([timestamp, value]);
        steps.push({ line: 4, explanation: `set("${key}", "${value}", ${timestamp}): Stored key="${key}" value="${value}" at timestamp ${timestamp}.`, variables: { key, value, timestamp }, visualization: makeViz(key, `set(${key},${value},${timestamp})`) });
      } else if (opType === 'get') {
        const key = String(op[1]);
        const timestamp = Number(op[2]);
        let result = '';
        if (store.has(key)) {
          const pairs = store.get(key)!;
          let lo = 0, hi = pairs.length - 1;
          while (lo <= hi) {
            const mid = (lo + hi) >> 1;
            if (pairs[mid][0] <= timestamp) { result = pairs[mid][1]; lo = mid + 1; }
            else hi = mid - 1;
          }
        }
        steps.push({ line: 9, explanation: `get("${key}", ${timestamp}): Binary search for largest ts <= ${timestamp}. Return "${result}".`, variables: { key, timestamp, result }, visualization: makeViz(key, `get(${key},${timestamp}) -> "${result}"`) });
      }
    }

    steps.push({ line: 14, explanation: 'All operations complete.', variables: { keys: store.size }, visualization: makeViz('', 'Complete') });

    return steps;
  },
};

export default timeBasedKeyValueStoreIi;
