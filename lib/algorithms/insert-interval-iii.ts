import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const insertIntervalIII: AlgorithmDefinition = {
  id: 'insert-interval-iii',
  title: 'Insert Interval III',
  leetcodeNumber: 57,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given a sorted non-overlapping list of intervals and a new interval, insert it in the correct position and merge any overlaps. Three phases: add all intervals ending before newInterval starts, merge overlapping intervals, then add remaining. O(n) time.',
  tags: ['Intervals', 'Greedy'],
  code: {
    pseudocode: `function insert(intervals, newInterval):
  result = []
  i = 0
  // phase 1: before new interval
  while i < n and intervals[i].end < newInterval.start:
    result.push(intervals[i++])
  // phase 2: merge overlapping
  while i < n and intervals[i].start <= newInterval.end:
    newInterval.start = min(newInterval.start, intervals[i].start)
    newInterval.end   = max(newInterval.end,   intervals[i].end)
    i++
  result.push(newInterval)
  // phase 3: after new interval
  while i < n: result.push(intervals[i++])
  return result`,
    python: `def insert(intervals, newInterval):
    result, i, n = [], 0, len(intervals)
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i]); i += 1
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    result.extend(intervals[i:])
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
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}`,
    java: `public int[][] insert(int[][] intervals, int[] newInterval) {
    List<int[]> res = new ArrayList<>();
    int i = 0;
    while (i < intervals.length && intervals[i][1] < newInterval[0])
        res.add(intervals[i++]);
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    res.add(newInterval);
    while (i < intervals.length) res.add(intervals[i++]);
    return res.toArray(new int[0][]);
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
      helperText: 'Sorted non-overlapping [start,end] pairs',
    },
    {
      name: 'newInterval',
      label: 'New Interval',
      type: 'array',
      defaultValue: [2, 5],
      placeholder: '[2,5]',
      helperText: 'Interval to insert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    const ni = [...(input.newInterval as number[])];
    const flat = intervals.flat();
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
      ...(auxEntries ? { auxData: { label: 'Result', entries: auxEntries } } : {}),
    });

    const baseLabels: Record<number, string> = {};
    intervals.forEach((_, i) => { baseLabels[i * 2] = `s${i}`; baseLabels[i * 2 + 1] = `e${i}`; });

    steps.push({
      line: 1,
      explanation: `Insert newInterval [${ni[0]},${ni[1]}] into ${intervals.length} sorted intervals.`,
      variables: { intervals: intervals.map(iv => [...iv]), newInterval: [...ni] },
      visualization: makeViz({}, baseLabels),
    });

    const result: number[][] = [];
    let i = 0;

    // Phase 1
    while (i < intervals.length && intervals[i][1] < ni[0]) {
      result.push([...intervals[i]]);
      steps.push({
        line: 5,
        explanation: `[${intervals[i][0]},${intervals[i][1]}] ends before newInterval starts (${intervals[i][1]} < ${ni[0]}). Add to result.`,
        variables: { phase: 1, i },
        visualization: makeViz({ [i * 2]: 'visited', [i * 2 + 1]: 'visited' }, {},
          result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
      });
      i++;
    }

    // Phase 2
    while (i < intervals.length && intervals[i][0] <= ni[1]) {
      steps.push({
        line: 8,
        explanation: `Overlap with [${intervals[i][0]},${intervals[i][1]}]. Merge into newInterval.`,
        variables: { phase: 2, i, before: [...ni] },
        visualization: makeViz({ [i * 2]: 'comparing', [i * 2 + 1]: 'comparing' }, {},
          result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
      });
      ni[0] = Math.min(ni[0], intervals[i][0]);
      ni[1] = Math.max(ni[1], intervals[i][1]);
      i++;
    }

    result.push([...ni]);
    steps.push({
      line: 11,
      explanation: `Push merged newInterval [${ni[0]},${ni[1]}] to result.`,
      variables: { newInterval: [...ni], result: result.map(r => [...r]) },
      visualization: makeViz({}, {}, result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
    });

    // Phase 3
    while (i < intervals.length) {
      result.push([...intervals[i]]);
      steps.push({
        line: 13,
        explanation: `Add remaining interval [${intervals[i][0]},${intervals[i][1]}].`,
        variables: { phase: 3, i },
        visualization: makeViz({ [i * 2]: 'found', [i * 2 + 1]: 'found' }, {},
          result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
      });
      i++;
    }

    const hl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) hl[j] = 'found';
    steps.push({
      line: 14,
      explanation: `Done. Result: [${result.map(r => `[${r[0]},${r[1]}]`).join(', ')}].`,
      variables: { result: result.map(r => [...r]) },
      visualization: makeViz(hl, {}, result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
    });

    return steps;
  },
};

export default insertIntervalIII;
