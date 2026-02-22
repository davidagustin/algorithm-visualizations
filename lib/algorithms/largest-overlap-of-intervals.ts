import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestOverlapOfIntervals: AlgorithmDefinition = {
  id: 'largest-overlap-of-intervals',
  title: 'Largest Overlap of Intervals (Meeting Rooms II)',
  leetcodeNumber: 253,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Determine the maximum number of intervals that overlap at any single point (i.e., the minimum number of meeting rooms needed). Use a sweep line approach: create events for each start (+1) and end (-1), sort them, then sweep through tracking the running count. O(n log n) time.',
  tags: ['Intervals', 'Sorting', 'Sweep Line'],
  code: {
    pseudocode: `function minMeetingRooms(intervals):
  events = []
  for each [start, end] in intervals:
    events.push([start, +1])
    events.push([end, -1])
  sort events by time (end events before start if same time)
  maxOverlap = 0, current = 0
  for each [time, type] in events:
    current += type
    maxOverlap = max(maxOverlap, current)
  return maxOverlap`,
    python: `def minMeetingRooms(intervals):
    events = []
    for start, end in intervals:
        events.append((start, 1))
        events.append((end, -1))
    events.sort()
    max_overlap = current = 0
    for time, typ in events:
        current += typ
        max_overlap = max(max_overlap, current)
    return max_overlap`,
    javascript: `function minMeetingRooms(intervals) {
  const events = [];
  for (const [start, end] of intervals) {
    events.push([start, 1]);
    events.push([end, -1]);
  }
  events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  let maxOverlap = 0, current = 0;
  for (const [time, type] of events) {
    current += type;
    maxOverlap = Math.max(maxOverlap, current);
  }
  return maxOverlap;
}`,
    java: `public int minMeetingRooms(int[][] intervals) {
    List<int[]> events = new ArrayList<>();
    for (int[] iv : intervals) {
        events.add(new int[]{iv[0], 1});
        events.add(new int[]{iv[1], -1});
    }
    events.sort((a, b) -> a[0] != b[0] ? a[0] - b[0] : a[1] - b[1]);
    int maxOverlap = 0, current = 0;
    for (int[] event : events) {
        current += event[1];
        maxOverlap = Math.max(maxOverlap, current);
    }
    return maxOverlap;
}`,
  },
  defaultInput: { intervals: [[0, 30], [5, 10], [15, 20]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[0, 30], [5, 10], [15, 20]],
      placeholder: '[[0,30],[5,10],[15,20]]',
      helperText: 'Array of [start, end] meeting intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    // Build events
    const events: [number, number][] = [];
    for (const [start, end] of intervals) {
      events.push([start, 1]);
      events.push([end, -1]);
    }
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    // Visualize events as flat array of time values
    const eventTimes = events.map(e => e[0]);
    const eventTypes = events.map(e => e[1]);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...eventTimes],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Sweep Line', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find maximum overlap for ${intervals.length} intervals: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { intervals },
      visualization: makeViz({}, {}),
    });

    // Show events
    const eventLabels: Record<number, string> = {};
    events.forEach((e, i) => {
      eventLabels[i] = e[1] === 1 ? `+1@${e[0]}` : `-1@${e[0]}`;
    });

    steps.push({
      line: 5,
      explanation: `Create and sort events: ${events.map(e => `(t=${e[0]}, ${e[1] > 0 ? 'start' : 'end'})`).join(', ')}.`,
      variables: { events: events.map(e => [...e]) },
      visualization: makeViz(
        Object.fromEntries(events.map((e, i) => [i, e[1] === 1 ? 'active' : 'comparing'])),
        eventLabels,
      ),
    });

    let maxOverlap = 0;
    let current = 0;

    steps.push({
      line: 6,
      explanation: `Initialize maxOverlap=0, current=0. Sweep through events.`,
      variables: { maxOverlap, current },
      visualization: makeViz({}, eventLabels, [
        { key: 'Current', value: '0' },
        { key: 'Max Overlap', value: '0' },
      ]),
    });

    for (let i = 0; i < events.length; i++) {
      const [time, type] = events[i];
      current += type;
      const prevMax = maxOverlap;
      maxOverlap = Math.max(maxOverlap, current);

      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) hl[j] = 'visited';
      hl[i] = type === 1 ? 'active' : 'comparing';

      steps.push({
        line: 8,
        explanation: `Event at time ${time}: ${type === 1 ? 'meeting STARTS' : 'meeting ENDS'}. current ${type === 1 ? '+' : '-'}1 = ${current}.${maxOverlap > prevMax ? ` New max overlap: ${maxOverlap}!` : ` Max remains ${maxOverlap}.`}`,
        variables: { time, type: type === 1 ? 'start' : 'end', current, maxOverlap },
        visualization: makeViz(hl, { [i]: `${type === 1 ? 'S' : 'E'}@${time}` }, [
          { key: 'Current rooms', value: String(current) },
          { key: 'Max overlap', value: String(maxOverlap) },
          { key: 'Event', value: `${type === 1 ? 'Start' : 'End'} at t=${time}` },
        ]),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done! Maximum overlap = ${maxOverlap} (minimum ${maxOverlap} meeting rooms needed).`,
      variables: { result: maxOverlap },
      visualization: makeViz(
        Object.fromEntries(events.map((_, i) => [i, 'found'])),
        eventLabels,
        [{ key: 'Answer', value: String(maxOverlap) }],
      ),
    });

    return steps;
  },
};

export default largestOverlapOfIntervals;
