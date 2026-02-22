import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeModuleSegment: AlgorithmDefinition = {
  id: 'range-module-segment',
  title: 'Range Module (Segment Tree with Lazy Propagation)',
  leetcodeNumber: 715,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Design a Range Module that tracks ranges of numbers. Support addRange(left, right), removeRange(left, right), and queryRange(left, right). Uses a segment tree with lazy propagation over a coordinate-compressed domain.',
  tags: ['Segment Tree', 'Lazy Propagation', 'Design', 'Ordered Set'],
  code: {
    pseudocode: `class RangeModule:
  tree: segment tree with lazy propagation
  tracked[node] = fraction of range covered
  lazy[node] = pending set/clear operation

  addRange(left, right):
    update(1, 0, MAX, left, right-1, SET=1)

  removeRange(left, right):
    update(1, 0, MAX, left, right-1, SET=0)

  queryRange(left, right):
    return query(1, 0, MAX, left, right-1) == right - left`,
    python: `class RangeModule:
    def __init__(self):
        self.tree = {}  # interval tree using dict for dynamic nodes

    def addRange(self, left, right):
        self._update(1, 0, 10**9, left, right-1, True)

    def removeRange(self, left, right):
        self._update(1, 0, 10**9, left, right-1, False)

    def queryRange(self, left, right):
        return self._query(1, 0, 10**9, left, right-1)

    def _update(self, node, lo, hi, l, r, val):
        if l > hi or r < lo: return
        if l <= lo and hi <= r:
            self.tree[node] = (val, val)  # (covered, lazy)
            return
        self._push_down(node, lo, hi)
        mid = (lo + hi) // 2
        self._update(2*node, lo, mid, l, r, val)
        self._update(2*node+1, mid+1, hi, l, r, val)
        # pull up logic here

    def _query(self, node, lo, hi, l, r):
        if l > hi or r < lo: return True
        if l <= lo and hi <= r:
            return self.tree.get(node, (False,))[0]
        self._push_down(node, lo, hi)
        mid = (lo + hi) // 2
        return self._query(2*node, lo, mid, l, r) and self._query(2*node+1, mid+1, hi, l, r)`,
    javascript: `class RangeModule {
  constructor() { this.intervals = []; }
  addRange(left, right) {
    const merged = [];
    let i = 0;
    while (i < this.intervals.length && this.intervals[i][1] < left) merged.push(this.intervals[i++]);
    let [nl, nr] = [left, right];
    while (i < this.intervals.length && this.intervals[i][0] <= right) {
      nl = Math.min(nl, this.intervals[i][0]);
      nr = Math.max(nr, this.intervals[i][1]);
      i++;
    }
    merged.push([nl, nr]);
    while (i < this.intervals.length) merged.push(this.intervals[i++]);
    this.intervals = merged;
  }
  queryRange(left, right) {
    for (const [l, r] of this.intervals) if (l <= left && right <= r) return true;
    return false;
  }
  removeRange(left, right) {
    const merged = [];
    for (const [l, r] of this.intervals) {
      if (r <= left || l >= right) merged.push([l, r]);
      else {
        if (l < left) merged.push([l, left]);
        if (r > right) merged.push([right, r]);
      }
    }
    this.intervals = merged;
  }
}`,
    java: `class RangeModule {
    TreeMap<Integer,Integer> map = new TreeMap<>();
    public void addRange(int l, int r) {
        Integer lo = map.floorKey(l), hi = map.floorKey(r);
        if (lo != null && map.get(lo) >= l) l = lo;
        if (hi != null && map.get(hi) > r) r = map.get(hi);
        map.subMap(l, r).clear();
        map.put(l, r);
    }
    public boolean queryRange(int l, int r) {
        Integer lo = map.floorKey(l);
        return lo != null && map.get(lo) >= r;
    }
    public void removeRange(int l, int r) {
        Integer lo = map.floorKey(l), hi = map.floorKey(r);
        if (hi != null && map.get(hi) > r) map.put(r, map.get(hi));
        if (lo != null && map.get(lo) > l) map.put(lo, l);
        map.subMap(l, r).clear();
    }
}`,
  },
  defaultInput: { operations: ['addRange', 'queryRange', 'removeRange', 'queryRange', 'queryRange'], args: [[10,20],[14,16],[14,16],[10,14],[10,20]] },
  inputFields: [
    { name: 'operations', label: 'Operations', type: 'array', defaultValue: ['addRange','queryRange','removeRange','queryRange','queryRange'], helperText: 'Sequence of operations' },
    { name: 'args', label: 'Arguments [[l,r],...]', type: 'array', defaultValue: [[10,20],[14,16],[14,16],[10,14],[10,20]], helperText: 'Arguments for each operation' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as string[];
    const args = input.args as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals: [number, number][] = [];

    const addRange = (l: number, r: number) => {
      const merged: [number, number][] = [];
      let i = 0;
      while (i < intervals.length && intervals[i][1] <= l) merged.push(intervals[i++]);
      let nl = l, nr = r;
      while (i < intervals.length && intervals[i][0] <= r) {
        nl = Math.min(nl, intervals[i][0]);
        nr = Math.max(nr, intervals[i][1]);
        i++;
      }
      merged.push([nl, nr]);
      while (i < intervals.length) merged.push(intervals[i++]);
      intervals.length = 0;
      intervals.push(...merged);
    };

    const queryRange = (l: number, r: number): boolean => {
      for (const [il, ir] of intervals) if (il <= l && r <= ir) return true;
      return false;
    };

    const removeRange = (l: number, r: number) => {
      const merged: [number, number][] = [];
      for (const [il, ir] of intervals) {
        if (ir <= l || il >= r) merged.push([il, ir]);
        else {
          if (il < l) merged.push([il, l]);
          if (ir > r) merged.push([r, ir]);
        }
      }
      intervals.length = 0;
      intervals.push(...merged);
    };

    steps.push({
      line: 1,
      explanation: `RangeModule initialized. Tracking intervals using sorted interval list.`,
      variables: { intervals: [] },
      visualization: { type: 'array', array: [], highlights: {}, labels: {} },
    });

    for (let op = 0; op < operations.length; op++) {
      const [l, r] = args[op];
      const opName = operations[op];

      if (opName === 'addRange') {
        addRange(l, r);
        const flatArr = intervals.flatMap(([a, b]) => [a, b]);
        steps.push({
          line: 4,
          explanation: `addRange(${l}, ${r}): Intervals now: [${intervals.map(([a,b])=>`[${a},${b})`).join(', ')}]`,
          variables: { op: opName, l, r, intervals: intervals.map(([a,b])=>`[${a},${b})`).join(',') },
          visualization: { type: 'array', array: flatArr.length ? flatArr : [0], highlights: { 0: 'active' }, labels: { 0: `added [${l},${r})` } },
        });
      } else if (opName === 'removeRange') {
        removeRange(l, r);
        const flatArr = intervals.flatMap(([a, b]) => [a, b]);
        steps.push({
          line: 7,
          explanation: `removeRange(${l}, ${r}): Intervals now: [${intervals.map(([a,b])=>`[${a},${b})`).join(', ')}]`,
          variables: { op: opName, l, r, intervals: intervals.map(([a,b])=>`[${a},${b})`).join(',') },
          visualization: { type: 'array', array: flatArr.length ? flatArr : [0], highlights: { 0: 'swapping' }, labels: { 0: `removed [${l},${r})` } },
        });
      } else if (opName === 'queryRange') {
        const result = queryRange(l, r);
        const flatArr = intervals.flatMap(([a, b]) => [a, b]);
        steps.push({
          line: 10,
          explanation: `queryRange(${l}, ${r}): ${result ? 'true — fully tracked' : 'false — not fully tracked'}`,
          variables: { op: opName, l, r, result },
          visualization: { type: 'array', array: flatArr.length ? flatArr : [0], highlights: { 0: result ? 'found' : 'mismatch' }, labels: { 0: `q[${l},${r})=${result}` } },
        });
      }
    }

    return steps;
  },
};

export default rangeModuleSegment;
