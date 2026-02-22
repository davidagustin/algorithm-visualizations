import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const dataStreamAsDisjointIntervals: AlgorithmDefinition = {
  id: 'data-stream-as-disjoint-intervals',
  title: 'Data Stream as Disjoint Intervals',
  leetcodeNumber: 352,
  difficulty: 'Hard',
  category: 'Interval',
  description:
    'Given a stream of integers, maintain a sorted list of disjoint intervals. When a new integer arrives, insert it as [val, val] and merge with any adjacent or overlapping intervals. Uses a sorted structure to efficiently find and merge neighboring intervals.',
  tags: ['interval', 'sorted set', 'merge', 'stream'],

  code: {
    pseudocode: `class SummaryRanges:
  intervals = sorted list
  function addNum(val):
    new_interval = [val, val]
    find all intervals that overlap [val-1, val+1]
    merge them all into one interval
    insert merged interval
  function getIntervals():
    return intervals`,

    python: `import sortedcontainers
class SummaryRanges:
    def __init__(self):
        self.intervals = []

    def addNum(self, val: int) -> None:
        new_iv = [val, val]
        updated = []
        inserted = False
        for iv in self.intervals:
            if iv[1] + 1 < new_iv[0]:
                updated.append(iv)
            elif new_iv[1] + 1 < iv[0]:
                if not inserted:
                    updated.append(new_iv)
                    inserted = True
                updated.append(iv)
            else:
                new_iv = [min(new_iv[0], iv[0]), max(new_iv[1], iv[1])]
        if not inserted:
            updated.append(new_iv)
        self.intervals = updated

    def getIntervals(self):
        return self.intervals`,

    javascript: `class SummaryRanges {
  constructor() { this.intervals = []; }
  addNum(val) {
    const newIv = [val, val];
    const updated = [];
    let inserted = false;
    for (const iv of this.intervals) {
      if (iv[1] + 1 < newIv[0]) { updated.push(iv); }
      else if (newIv[1] + 1 < iv[0]) {
        if (!inserted) { updated.push(newIv); inserted = true; }
        updated.push(iv);
      } else {
        newIv[0] = Math.min(newIv[0], iv[0]);
        newIv[1] = Math.max(newIv[1], iv[1]);
      }
    }
    if (!inserted) updated.push(newIv);
    this.intervals = updated;
  }
  getIntervals() { return this.intervals; }
}`,

    java: `class SummaryRanges {
    TreeMap<Integer, Integer> map = new TreeMap<>();
    public void addNum(int val) {
        if (map.containsKey(val)) return;
        Integer lo = map.floorKey(val), hi = map.ceilingKey(val);
        boolean mergeLeft = lo != null && map.get(lo) + 1 >= val;
        boolean mergeRight = hi != null && hi - 1 <= val;
        if (mergeLeft && mergeRight) { map.put(lo, map.get(hi)); map.remove(hi); }
        else if (mergeLeft) { map.put(lo, Math.max(map.get(lo), val)); }
        else if (mergeRight) { map.put(val, map.get(hi)); map.remove(hi); }
        else { map.put(val, val); }
    }
    public int[][] getIntervals() {
        return map.entrySet().stream().map(e -> new int[]{e.getKey(), e.getValue()}).toArray(int[][]::new);
    }
}`,
  },

  defaultInput: {
    stream: [1, 3, 7, 2, 6],
  },

  inputFields: [
    {
      name: 'stream',
      label: 'Number Stream',
      type: 'array',
      defaultValue: [1, 3, 7, 2, 6],
      placeholder: '1,3,7,2,6',
      helperText: 'Comma-separated integers arriving in stream order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stream = input.stream as number[];
    const steps: AlgorithmStep[] = [];
    let intervals: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Initialize empty interval set. Stream will deliver: [${stream.join(', ')}].`,
      variables: { intervals: '[]' },
      visualization: {
        type: 'array',
        array: stream,
        highlights: {},
        labels: Object.fromEntries(stream.map((v, i) => [i, `${v}`])),
      },
    });

    for (let si = 0; si < stream.length; si++) {
      const val = stream[si];

      steps.push({
        line: 2,
        explanation: `addNum(${val}). Current intervals before insert: ${JSON.stringify(intervals)}.`,
        variables: { val, intervals: JSON.stringify(intervals) },
        visualization: {
          type: 'array',
          array: stream,
          highlights: { [si]: 'active' },
          labels: Object.fromEntries(stream.map((v, i) => [i, i === si ? `adding ${v}` : `${v}`])),
        },
      });

      const newIv = [val, val];
      const updated: number[][] = [];
      let inserted = false;

      for (const iv of intervals) {
        if (iv[1] + 1 < newIv[0]) {
          updated.push(iv);
        } else if (newIv[1] + 1 < iv[0]) {
          if (!inserted) {
            updated.push([...newIv]);
            inserted = true;
          }
          updated.push(iv);
        } else {
          const prevIv = [...newIv];
          newIv[0] = Math.min(newIv[0], iv[0]);
          newIv[1] = Math.max(newIv[1], iv[1]);
          steps.push({
            line: 5,
            explanation: `Merge ${JSON.stringify(prevIv)} with adjacent interval [${iv[0]},${iv[1]}] => [${newIv[0]},${newIv[1]}].`,
            variables: { merged: JSON.stringify(newIv) },
            visualization: {
              type: 'array',
              array: intervals.map(iv2 => iv2[0]),
              highlights: {},
              labels: Object.fromEntries(intervals.map((iv2, i) => [i, `[${iv2[0]},${iv2[1]}]`])),
            },
          });
        }
      }

      if (!inserted) updated.push([...newIv]);
      intervals = updated;

      steps.push({
        line: 6,
        explanation: `After addNum(${val}): intervals = ${JSON.stringify(intervals)}.`,
        variables: { intervals: JSON.stringify(intervals) },
        visualization: {
          type: 'array',
          array: intervals.map(iv => iv[0]),
          highlights: Object.fromEntries(intervals.map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(intervals.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
        },
      });
    }

    return steps;
  },
};

export default dataStreamAsDisjointIntervals;
