import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertInterval: AlgorithmDefinition = {
  id: 'insert-interval',
  title: 'Insert Interval',
  leetcodeNumber: 57,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given a sorted list of non-overlapping intervals and a new interval, insert the new interval and merge any overlapping intervals. Iterate through: add intervals that end before the new one starts, merge overlapping intervals by expanding the new interval, then add remaining intervals.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function insert(intervals, newInterval):
  result = []
  i = 0
  // Add all intervals that end before newInterval starts
  while i < n and intervals[i].end < newInterval.start:
    result.push(intervals[i++])
  // Merge overlapping intervals
  while i < n and intervals[i].start <= newInterval.end:
    newInterval.start = min(newInterval.start, intervals[i].start)
    newInterval.end = max(newInterval.end, intervals[i].end)
    i++
  result.push(newInterval)
  // Add remaining intervals
  while i < n:
    result.push(intervals[i++])
  return result`,
    python: `def insert(intervals, newInterval):
    result = []
    i = 0
    while i < len(intervals) and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    while i < len(intervals) and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    while i < len(intervals):
        result.append(intervals[i])
        i += 1
    return result`,
    javascript: `function insert(intervals, newInterval) {
  const result = [];
  let i = 0;
  while (i < intervals.length && intervals[i][1] < newInterval[0]) {
    result.push(intervals[i++]);
  }
  while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
    i++;
  }
  result.push(newInterval);
  while (i < intervals.length) {
    result.push(intervals[i++]);
  }
  return result;
}`,
    java: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> result = new ArrayList<>();
    int i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0])
        result.add(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.add(newInterval);
    while (i < intervals.length) result.add(intervals[i++]);
    return result.toArray(new int[0][]);
}`,
  },
  defaultInput: {
    intervals: [[1, 3], [6, 9]],
    newInterval: [2, 5],
  },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals (sorted)',
      type: 'array',
      defaultValue: [[1, 3], [6, 9]],
      placeholder: '[[1,3],[6,9]]',
      helperText: 'Sorted non-overlapping intervals as [start, end] pairs',
    },
    {
      name: 'newInterval',
      label: 'New Interval',
      type: 'array',
      defaultValue: [2, 5],
      placeholder: '[2,5]',
      helperText: 'The new interval to insert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawIntervals = input.intervals as number[][];
    const rawNew = input.newInterval as number[];
    const steps: AlgorithmStep[] = [];

    const intervals = rawIntervals.map(iv => [iv[0], iv[1]]);
    const newInterval = [rawNew[0], rawNew[1]];

    // Flat array: [s0,e0, s1,e1, ...]
    const flat = intervals.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: { label: 'Insert State', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Start: intervals = [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Insert newInterval = [${newInterval[0]}, ${newInterval[1]}].`,
      variables: { intervals, newInterval: [...newInterval] },
      visualization: makeViz({}, {}, [
        { key: 'newInterval', value: `[${newInterval[0]}, ${newInterval[1]}]` },
        { key: 'i', value: '0' },
      ]),
    });

    const result: number[][] = [];
    let i = 0;

    // Phase 1: add intervals ending before newInterval starts
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'visited', [ci + 1]: 'visited' };
      result.push([...intervals[i]]);
      steps.push({
        line: 5,
        explanation: `Interval [${intervals[i][0]}, ${intervals[i][1]}] ends before ${newInterval[0]} (new start). Add to result as-is.`,
        variables: { i, current: intervals[i], condition: `${intervals[i][1]} < ${newInterval[0]}` },
        visualization: makeViz(hl, { [ci]: 'no overlap', [ci + 1]: 'no overlap' }, [
          { key: 'newInterval', value: `[${newInterval[0]}, ${newInterval[1]}]` },
          { key: 'result', value: result.map(iv => `[${iv[0]},${iv[1]}]`).join(', ') },
        ]),
      });
      i++;
    }

    // Phase 2: merge overlapping intervals
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
      const ci = i * 2;
      const oldStart = newInterval[0];
      const oldEnd = newInterval[1];
      newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
      newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
      const hl: Record<number, string> = { [ci]: 'swapping', [ci + 1]: 'swapping' };
      steps.push({
        line: 8,
        explanation: `Overlap! [${intervals[i][0]}, ${intervals[i][1]}] overlaps newInterval [${oldStart}, ${oldEnd}]. Expand: new=[${newInterval[0]}, ${newInterval[1]}].`,
        variables: { i, current: intervals[i], newInterval: [...newInterval] },
        visualization: makeViz(hl, { [ci]: 'overlap', [ci + 1]: 'overlap' }, [
          { key: 'newInterval', value: `[${newInterval[0]}, ${newInterval[1]}]` },
          { key: 'merged from', value: `[${oldStart}, ${oldEnd}] + [${intervals[i][0]}, ${intervals[i][1]}]` },
        ]),
      });
      i++;
    }

    result.push([...newInterval]);
    steps.push({
      line: 11,
      explanation: `Add merged newInterval [${newInterval[0]}, ${newInterval[1]}] to result.`,
      variables: { newInterval: [...newInterval], result: result.map(iv => [...iv]) },
      visualization: makeViz({}, {}, [
        { key: 'newInterval added', value: `[${newInterval[0]}, ${newInterval[1]}]` },
        { key: 'result so far', value: result.map(iv => `[${iv[0]},${iv[1]}]`).join(', ') },
      ]),
    });

    // Phase 3: add remaining intervals
    while (i < intervals.length) {
      const ci = i * 2;
      result.push([...intervals[i]]);
      const hl: Record<number, string> = { [ci]: 'found', [ci + 1]: 'found' };
      steps.push({
        line: 13,
        explanation: `Add remaining interval [${intervals[i][0]}, ${intervals[i][1]}] — starts after merged end.`,
        variables: { i, current: intervals[i] },
        visualization: makeViz(hl, {}, [
          { key: 'result', value: result.map(iv => `[${iv[0]},${iv[1]}]`).join(', ') },
        ]),
      });
      i++;
    }

    const allHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) allHl[j] = 'found';

    steps.push({
      line: 14,
      explanation: `Done! Result: [${result.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Inserted and merged ${rawIntervals.length} intervals → ${result.length}.`,
      variables: { result: result.map(iv => [...iv]) },
      visualization: makeViz(allHl, {}, result.map((iv, k) => ({ key: `Result[${k}]`, value: `[${iv[0]}, ${iv[1]}]` }))),
    });

    return steps;
  },
};

export default insertInterval;
