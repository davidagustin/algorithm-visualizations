import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countIntegersInIntervals: AlgorithmDefinition = {
  id: 'count-integers-in-intervals',
  title: 'Count Integers in Intervals',
  leetcodeNumber: 2276,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Design a data structure that adds intervals and counts the total distinct integers covered. When adding [l, r], merge with any existing overlapping intervals and update the count. Uses a sorted interval list; each add is O(n) worst case but amortized O(log n) with sorted containers.',
  tags: ['Intervals', 'Design', 'Sorted List', 'Segment Tree'],
  code: {
    pseudocode: `class CountIntervals:
  intervals = [], count = 0
  def add(left, right):
    new = [left, right]
    toRemove = []
    for [s, e] in intervals:
      if s <= right+1 and e >= left-1:
        count -= (e - s + 1)
        new = [min(new[0],s), max(new[1],e)]
        toRemove.push([s,e])
    for iv in toRemove: remove iv from intervals
    intervals.insert(new sorted)
    count += new[1] - new[0] + 1
  def count(): return count`,
    python: `from sortedcontainers import SortedList
class CountIntervals:
    def __init__(self):
        self.sl = SortedList(key=lambda x: x[0])
        self.cnt = 0
    def add(self, left, right):
        lo, hi = left, right
        rm = []
        idx = self.sl.bisect_left([left])
        if idx > 0:
            idx -= 1
        while idx < len(self.sl) and self.sl[idx][0] <= hi + 1:
            s, e = self.sl[idx]
            if e >= lo - 1:
                rm.append((s, e))
                lo = min(lo, s); hi = max(hi, e)
            idx += 1
        for iv in rm:
            self.sl.remove(iv)
            self.cnt -= iv[1] - iv[0] + 1
        self.sl.add((lo, hi))
        self.cnt += hi - lo + 1
    def count(self): return self.cnt`,
    javascript: `class CountIntervals {
  constructor() { this.intervals = []; this.cnt = 0; }
  add(left, right) {
    let lo = left, hi = right;
    const keep = [];
    for (const [s, e] of this.intervals) {
      if (e < lo - 1 || s > hi + 1) { keep.push([s, e]); }
      else { lo = Math.min(lo, s); hi = Math.max(hi, e); this.cnt -= (e - s + 1); }
    }
    keep.push([lo, hi]);
    keep.sort((a, b) => a[0] - b[0]);
    this.intervals = keep;
    this.cnt += hi - lo + 1;
  }
  count() { return this.cnt; }
}`,
    java: `class CountIntervals {
    TreeMap<Integer, Integer> map = new TreeMap<>();
    int cnt = 0;
    public void add(int left, int right) {
        int lo = left, hi = right;
        Integer key = map.floorKey(right + 1);
        while (key != null && map.get(key) >= lo - 1) {
            lo = Math.min(lo, key);
            hi = Math.max(hi, map.get(key));
            cnt -= map.get(key) - key + 1;
            map.remove(key);
            key = map.floorKey(hi + 1);
        }
        map.put(lo, hi);
        cnt += hi - lo + 1;
    }
    public int count() { return cnt; }
}`,
  },
  defaultInput: { operations: [[1, 3], [1, 8], [2, 6]] },
  inputFields: [
    {
      name: 'operations',
      label: 'Add Intervals',
      type: 'array',
      defaultValue: [[1, 3], [1, 8], [2, 6]],
      placeholder: '[[1,3],[1,8],[2,6]]',
      helperText: 'Intervals to add in order; count distinct integers after each add',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = (input.operations as number[][]).map(iv => [iv[0], iv[1]]);
    const flat = operations.flat();
    const steps: AlgorithmStep[] = [];
    let intervals: number[][] = [];
    let cnt = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Coverage', entries: auxEntries } } : {}),
    });

    steps.push({ line: 1, explanation: `Initialize. Add ${operations.length} intervals, track total distinct integers covered.`,
      variables: { intervals: [], count: 0 }, visualization: makeViz({}, {}) });

    for (let i = 0; i < operations.length; i++) {
      const [left, right] = operations[i];
      let lo = left, hi = right;
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };

      const keep: number[][] = [];
      for (const [s, e] of intervals) {
        if (e < lo - 1 || s > hi + 1) { keep.push([s, e]); }
        else { lo = Math.min(lo, s); hi = Math.max(hi, e); cnt -= (e - s + 1); }
      }
      keep.push([lo, hi]);
      keep.sort((a, b) => a[0] - b[0]);
      intervals = keep;
      cnt += hi - lo + 1;

      for (let j = 0; j < i; j++) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }
      hl[ci] = 'found'; hl[ci + 1] = 'found';

      steps.push({ line: 6,
        explanation: `Add [${left},${right}]. Merged to [${lo},${hi}]. Total distinct integers: ${cnt}.`,
        variables: { added: [left, right], merged: [lo, hi], count: cnt, intervals: intervals.map(iv => [...iv]) },
        visualization: makeViz(hl, { [ci]: `l=${left}`, [ci + 1]: `r=${right}` },
          [...intervals.map((iv, k) => ({ key: `I${k}`, value: `[${iv[0]},${iv[1]}]` })),
           { key: 'count()', value: String(cnt) }]) });
    }

    steps.push({ line: 9, explanation: `Final count: ${cnt} distinct integers covered across ${intervals.length} disjoint intervals.`,
      variables: { count: cnt, intervals: intervals.map(iv => [...iv]) },
      visualization: makeViz({}, {}, [...intervals.map((iv, k) => ({ key: `I${k}`, value: `[${iv[0]},${iv[1]}]` })),
        { key: 'Total', value: String(cnt) }]) });

    return steps;
  },
};

export default countIntegersInIntervals;
