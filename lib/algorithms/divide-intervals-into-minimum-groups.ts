import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const divideIntervalsIntoMinimumGroups: AlgorithmDefinition = {
  id: 'divide-intervals-into-minimum-groups',
  title: 'Divide Intervals Into Minimum Groups',
  leetcodeNumber: 2406,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Partition intervals into the minimum number of groups such that no two intervals in the same group overlap. The answer equals the maximum number of intervals active at any single point (the maximum depth). Use event-based sweep: +1 at each start, -1 at each end+1, track running max. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Heap', 'Sweep Line'],
  code: {
    pseudocode: `function minGroups(intervals):
  events = []
  for [s, e] in intervals:
    events.push([s, +1])
    events.push([e+1, -1])
  sort events by time
  cur = maxGroups = 0
  for [time, delta] in events:
    cur += delta
    maxGroups = max(maxGroups, cur)
  return maxGroups`,
    python: `def minGroups(intervals):
    events = []
    for s, e in intervals:
        events.append((s, 1))
        events.append((e + 1, -1))
    events.sort()
    cur = res = 0
    for _, delta in events:
        cur += delta
        res = max(res, cur)
    return res`,
    javascript: `function minGroups(intervals) {
  const events = [];
  for (const [s, e] of intervals) {
    events.push([s, 1]);
    events.push([e + 1, -1]);
  }
  events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
  let cur = 0, res = 0;
  for (const [, d] of events) {
    cur += d;
    res = Math.max(res, cur);
  }
  return res;
}`,
    java: `public int minGroups(int[][] intervals) {
    int[][] events = new int[intervals.length * 2][2];
    int k = 0;
    for (int[] iv : intervals) {
        events[k++] = new int[]{iv[0], 1};
        events[k++] = new int[]{iv[1] + 1, -1};
    }
    Arrays.sort(events, (a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int cur = 0, res = 0;
    for (int[] e : events) { cur += e[1]; res = Math.max(res, cur); }
    return res;
}`,
  },
  defaultInput: { intervals: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]],
      placeholder: '[[5,10],[6,8],[1,5],[2,3],[1,10]]',
      helperText: 'Array of [start, end] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    const flat = raw.flat();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Sweep', entries: auxEntries } } : {}),
    });

    const events: [number, number][] = [];
    for (const [s, e] of raw) { events.push([s, 1]); events.push([e + 1, -1]); }
    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    steps.push({ line: 2,
      explanation: `Build events: +1 at start, -1 at end+1. ${events.length} events total.`,
      variables: { events: events.map(e => ({ time: e[0], delta: e[1] })) },
      visualization: makeViz({}, {}) });

    let cur = 0, maxGroups = 0;
    const sweepLog: { key: string; value: string }[] = [];

    for (const [time, delta] of events) {
      cur += delta;
      maxGroups = Math.max(maxGroups, cur);
      sweepLog.push({ key: `t=${time}`, value: `Δ${delta > 0 ? '+' : ''}${delta}, active=${cur}` });

      const hl: Record<number, string> = {};
      for (let j = 0; j < raw.length; j++) {
        if (raw[j][0] <= time && time <= raw[j][1]) { hl[j * 2] = 'active'; hl[j * 2 + 1] = 'active'; }
        else if (raw[j][1] < time) { hl[j * 2] = 'visited'; hl[j * 2 + 1] = 'visited'; }
      }

      steps.push({ line: 9,
        explanation: `t=${time}: Δ${delta > 0 ? '+' : ''}${delta}. Active groups=${cur}. Max so far=${maxGroups}.`,
        variables: { time, delta, cur, maxGroups },
        visualization: makeViz(hl, {}, [...sweepLog.slice(-4), { key: 'maxGroups', value: String(maxGroups) }]) });
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({ line: 10, explanation: `Done. Minimum groups needed: ${maxGroups}.`,
      variables: { minGroups: maxGroups },
      visualization: makeViz(finalHl, {}, [{ key: 'Min Groups', value: String(maxGroups) }]) });

    return steps;
  },
};

export default divideIntervalsIntoMinimumGroups;
