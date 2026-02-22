import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lfuCache: AlgorithmDefinition = {
  id: 'lfu-cache',
  title: 'LFU Cache',
  leetcodeNumber: 460,
  difficulty: 'Hard',
  category: 'Linked List',
  description:
    'Least Frequently Used (LFU) Cache: evict the item with the lowest access frequency. Ties broken by least recent use (LRU among equals). Implemented with a key-value map, a key-frequency map, and a frequency-to-keys map (ordered by insertion). Track minimum frequency for O(1) eviction.',
  tags: ['Linked List', 'Hash Map', 'Design'],
  code: {
    pseudocode: `class LFUCache:
  function init(capacity):
    this.cap = capacity
    this.keyVal = {}, this.keyFreq = {}, this.freqKeys = {}
    this.minFreq = 0

  function get(key):
    if key not in keyVal: return -1
    increment freq of key
    return keyVal[key]

  function put(key, value):
    if key in keyVal: update value; increment freq
    else:
      if size == cap: evict LFU key (minFreq bucket, oldest)
      insert key; keyFreq[key]=1; minFreq=1`,
    python: `class LFUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.kv = {}        # key -> value
        self.kf = {}        # key -> freq
        self.fk = defaultdict(OrderedDict)  # freq -> {key: None}
        self.min_freq = 0

    def _increment(self, key):
        f = self.kf[key]
        del self.fk[f][key]
        if not self.fk[f] and f == self.min_freq:
            self.min_freq += 1
        self.kf[key] = f + 1
        self.fk[f+1][key] = None

    def get(self, key):
        if key not in self.kv: return -1
        self._increment(key)
        return self.kv[key]

    def put(self, key, value):
        if not self.cap: return
        if key in self.kv:
            self.kv[key] = value
            self._increment(key)
        else:
            if len(self.kv) == self.cap:
                evict, _ = self.fk[self.min_freq].popitem(last=False)
                del self.kv[evict]; del self.kf[evict]
            self.kv[key] = value
            self.kf[key] = 1
            self.fk[1][key] = None
            self.min_freq = 1`,
    javascript: `class LFUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.kv = new Map(); // key -> val
    this.kf = new Map(); // key -> freq
    this.fk = new Map(); // freq -> Set of keys (insertion order)
    this.minFreq = 0;
  }
  _inc(key) {
    const f = this.kf.get(key);
    this.fk.get(f).delete(key);
    if (this.fk.get(f).size === 0 && f === this.minFreq) this.minFreq++;
    this.kf.set(key, f + 1);
    if (!this.fk.has(f+1)) this.fk.set(f+1, new Set());
    this.fk.get(f+1).add(key);
  }
  get(key) {
    if (!this.kv.has(key)) return -1;
    this._inc(key); return this.kv.get(key);
  }
  put(key, value) {
    if (!this.cap) return;
    if (this.kv.has(key)) { this.kv.set(key, value); this._inc(key); return; }
    if (this.kv.size === this.cap) {
      const evict = this.fk.get(this.minFreq).values().next().value;
      this.fk.get(this.minFreq).delete(evict);
      this.kv.delete(evict); this.kf.delete(evict);
    }
    this.kv.set(key, value); this.kf.set(key, 1);
    if (!this.fk.has(1)) this.fk.set(1, new Set());
    this.fk.get(1).add(key); this.minFreq = 1;
  }
}`,
    java: `// See LC 460 for full Java implementation
// Uses HashMap + HashMap<Integer,LinkedHashSet>`,
  },
  defaultInput: {
    capacity: 2,
    operations: [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['get', 3]],
  },
  inputFields: [
    {
      name: 'capacity',
      label: 'Capacity',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Maximum items in LFU cache',
    },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'put 1 1, put 2 2, get 1, put 3 3, get 2, get 3',
      placeholder: 'put 1 1, get 1',
      helperText: 'Comma-separated: "put k v" or "get k"',
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

    // LFU state
    const kv = new Map<number, number>();           // key -> value
    const kf = new Map<number, number>();           // key -> frequency
    const fk = new Map<number, Map<number, true>>(); // freq -> ordered keys
    let minFreq = 0;

    const incFreq = (key: number) => {
      const f = kf.get(key)!;
      fk.get(f)!.delete(key);
      if (fk.get(f)!.size === 0 && f === minFreq) minFreq++;
      const nf = f + 1;
      kf.set(key, nf);
      if (!fk.has(nf)) fk.set(nf, new Map());
      fk.get(nf)!.set(key, true);
    };

    const makeViz = (action: string, result: string, highlightKey: number | null): ArrayVisualization => {
      const keys = [...kv.keys()];
      const arr = keys.map(k => kv.get(k)!);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        highlights[i] = k === highlightKey ? 'active' : 'sorted';
        labels[i] = `k${k}(f${kf.get(k) ?? 0})`;
      }

      const freqGroups: string[] = [];
      fk.forEach((keys2, freq) => {
        if (keys2.size > 0) freqGroups.push(`freq${freq}:[${[...keys2.keys()].join(',')}]`);
      });

      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels,
        auxData: {
          label: 'LFU Cache',
          entries: [
            { key: 'Action', value: action },
            { key: 'Result', value: result },
            { key: 'minFreq', value: String(minFreq) },
            { key: 'Size', value: `${kv.size}/${capacity}` },
            { key: 'Freq groups', value: freqGroups.join(' | ') || '(empty)' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Initialize LFU Cache with capacity=${capacity}. Tracks key-value, key-frequency, and frequency-to-keys maps.`,
      variables: { capacity },
      visualization: makeViz('Init', '—', null),
    });

    for (const op of operations) {
      const opType = String(op[0]).toLowerCase();
      const key = Number(op[1]);

      if (opType === 'put') {
        const value = Number(op[2]);

        if (kv.has(key)) {
          kv.set(key, value);
          incFreq(key);
          steps.push({
            line: 12,
            explanation: `put(${key}, ${value}): Key exists. Update value and increment frequency to ${kf.get(key)}.`,
            variables: { key, value, freq: kf.get(key) },
            visualization: makeViz(`put(${key},${value}) — update`, '—', key),
          });
        } else {
          if (kv.size === capacity) {
            const evictKey = fk.get(minFreq)!.keys().next().value!;
            fk.get(minFreq)!.delete(evictKey);
            kv.delete(evictKey);
            kf.delete(evictKey);
            steps.push({
              line: 14,
              explanation: `put(${key}, ${value}): Cache full. Evict LFU key=${evictKey} (freq=${minFreq}).`,
              variables: { evicted: evictKey },
              visualization: makeViz(`put(${key},${value}) — evict ${evictKey}`, `Evicted key ${evictKey}`, null),
            });
          }

          kv.set(key, value);
          kf.set(key, 1);
          if (!fk.has(1)) fk.set(1, new Map());
          fk.get(1)!.set(key, true);
          minFreq = 1;

          steps.push({
            line: 15,
            explanation: `put(${key}, ${value}): Inserted with freq=1. minFreq reset to 1.`,
            variables: { key, value },
            visualization: makeViz(`put(${key},${value}) — insert`, '—', key),
          });
        }
      } else if (opType === 'get') {
        if (!kv.has(key)) {
          steps.push({
            line: 9,
            explanation: `get(${key}): Key not found. Return -1.`,
            variables: { key, result: -1 },
            visualization: makeViz(`get(${key})`, '-1', null),
          });
        } else {
          const val = kv.get(key)!;
          incFreq(key);
          steps.push({
            line: 10,
            explanation: `get(${key}): Found value=${val}. Increment freq to ${kf.get(key)}. minFreq=${minFreq}.`,
            variables: { key, value: val, freq: kf.get(key) },
            visualization: makeViz(`get(${key})`, String(val), key),
          });
        }
      }
    }

    steps.push({
      line: 16,
      explanation: `All operations complete.`,
      variables: { cache: Object.fromEntries(kv) },
      visualization: makeViz('Complete', '—', null),
    });

    return steps;
  },
};

export default lfuCache;
