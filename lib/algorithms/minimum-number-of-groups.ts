import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfGroups: AlgorithmDefinition = {
  id: 'minimum-number-of-groups',
  title: 'Divide Intervals Into Minimum Number of Groups',
  leetcodeNumber: 2406,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given intervals, partition them into groups where no two intervals in the same group overlap. Find the minimum number of groups needed. This equals the maximum number of overlapping intervals at any point, which can be found by sorting events (start/end) and sweeping with a counter.',
  tags: ['greedy', 'sorting', 'sweep line', 'intervals'],

  code: {
    pseudocode: `function minGroups(intervals):
  events = []
  for [l, r] in intervals:
    events.append((l, 1))   // start event
    events.append((r+1, -1)) // end event
  sort events
  groups = 0, current = 0
  for (time, type) in events:
    current += type
    groups = max(groups, current)
  return groups`,

    python: `def minGroups(intervals: list[list[int]]) -> int:
    events = []
    for l, r in intervals:
        events.append((l, 1))
        events.append((r + 1, -1))
    events.sort()
    groups = current = 0
    for _, t in events:
        current += t
        groups = max(groups, current)
    return groups`,

    javascript: `function minGroups(intervals) {
  const events = [];
  for (const [l, r] of intervals) {
    events.push([l, 1]);
    events.push([r + 1, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let groups = 0, current = 0;
  for (const [, type] of events) {
    current += type;
    groups = Math.max(groups, current);
  }
  return groups;
}`,

    java: `public int minGroups(int[][] intervals) {
    List<int[]> events = new ArrayList<>();
    for (int[] iv : intervals) {
        events.add(new int[]{iv[0], 1});
        events.add(new int[]{iv[1] + 1, -1});
    }
    events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int groups = 0, current = 0;
    for (int[] e : events) {
        current += e[1];
        groups = Math.max(groups, current);
    }
    return groups;
}`,
  },

  defaultInput: {
    intervals: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]],
  },

  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[5, 10], [6, 8], [1, 5], [2, 3], [1, 10]],
      placeholder: '[[5,10],[6,8],[1,5],[2,3],[1,10]]',
      helperText: 'Array of [left, right] intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const events: [number, number][] = [];
    for (const [l, r] of intervals) {
      events.push([l, 1]);
      events.push([r + 1, -1]);
    }
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `Create sweep line events: +1 at interval start, -1 just after interval end. Sort by time.`,
      variables: { events: events.map(e => `(${e[0]}, ${e[1] > 0 ? '+1' : '-1'})`) },
      visualization: {
        type: 'array',
        array: events.map(e => e[0]),
        highlights: {},
        labels: Object.fromEntries(events.map((e, i) => [i, e[1] > 0 ? `+${e[0]}` : `-${e[0]}`])) as Record<number, string>,
      },
    });

    let groups = 0;
    let current = 0;

    for (let i = 0; i < events.length; i++) {
      const [time, type] = events[i];
      current += type;
      const prevGroups = groups;
      groups = Math.max(groups, current);

      steps.push({
        line: 7,
        explanation: `Event at time ${time}: ${type > 0 ? 'interval starts (+1)' : 'interval ends (-1)'}. Concurrent intervals = ${current}. Groups = max(${prevGroups}, ${current}) = ${groups}.`,
        variables: { time, type, current, groups },
        visualization: {
          type: 'array',
          array: events.map(e => e[0]),
          highlights: {
            [i]: type > 0 ? 'active' : 'comparing',
            ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
          } as Record<number, string>,
          labels: { [i]: `cur=${current}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Minimum number of groups needed: ${groups}.`,
      variables: { result: groups },
      visualization: {
        type: 'array',
        array: events.map(e => e[0]),
        highlights: Object.fromEntries(events.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumNumberOfGroups;
