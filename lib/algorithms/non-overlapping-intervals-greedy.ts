import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nonOverlappingIntervalsGreedy: AlgorithmDefinition = {
  id: 'non-overlapping-intervals-greedy',
  title: 'Non-overlapping Intervals (Greedy)',
  leetcodeNumber: 435,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array of intervals, find the minimum number of intervals to remove to make the rest non-overlapping. Greedy: sort by end time, greedily keep intervals that finish earliest. When an overlap is found, remove the one with the later end time (i.e., keep the current one and skip the new overlapping one).',
  tags: ['greedy', 'sorting', 'intervals'],

  code: {
    pseudocode: `function eraseOverlapIntervals(intervals):
  sort intervals by end time
  count = 0
  prevEnd = -infinity
  for [start, end] in intervals:
    if start >= prevEnd:
      prevEnd = end  // keep this interval
    else:
      count++  // remove this interval (overlap)
  return count`,

    python: `def eraseOverlapIntervals(intervals: list[list[int]]) -> int:
    intervals.sort(key=lambda x: x[1])
    count = 0
    prev_end = float('-inf')
    for start, end in intervals:
        if start >= prev_end:
            prev_end = end
        else:
            count += 1
    return count`,

    javascript: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0, prevEnd = -Infinity;
  for (const [start, end] of intervals) {
    if (start >= prevEnd) {
      prevEnd = end;
    } else {
      count++;
    }
  }
  return count;
}`,

    java: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int count = 0;
    int prevEnd = Integer.MIN_VALUE;
    for (int[] interval : intervals) {
        if (interval[0] >= prevEnd) {
            prevEnd = interval[1];
        } else {
            count++;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    intervals: [[1, 2], [2, 3], [3, 4], [1, 3]],
  },

  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 2], [2, 3], [3, 4], [1, 3]],
      placeholder: '[[1,2],[2,3],[3,4],[1,3]]',
      helperText: 'Array of [start, end] intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervalsRaw = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals = [...intervalsRaw].sort((a, b) => a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `Sort intervals by end time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Keep intervals with earliest end times.`,
      variables: { sorted: intervals.map(iv => `[${iv}]`) },
      visualization: {
        type: 'array',
        array: intervals.map(iv => iv[1]),
        highlights: {},
        labels: Object.fromEntries(intervals.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])) as Record<number, string>,
      },
    });

    let count = 0;
    let prevEnd = -Infinity;

    for (let i = 0; i < intervals.length; i++) {
      const [start, end] = intervals[i];

      if (start >= prevEnd) {
        steps.push({
          line: 5,
          explanation: `Interval [${start},${end}]: start ${start} >= prevEnd ${prevEnd === -Infinity ? '-inf' : prevEnd}. No overlap. Keep it. prevEnd = ${end}.`,
          variables: { i, start, end, prevEnd: end, count },
          visualization: {
            type: 'array',
            array: intervals.map(iv => iv[1]),
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
              [i]: 'found',
            } as Record<number, string>,
            labels: { [i]: 'keep' } as Record<number, string>,
          },
        });
        prevEnd = end;
      } else {
        count++;
        steps.push({
          line: 7,
          explanation: `Interval [${start},${end}]: start ${start} < prevEnd ${prevEnd}. Overlap! Remove this interval (higher end time loses). Removals: ${count}.`,
          variables: { i, start, end, prevEnd, count },
          visualization: {
            type: 'array',
            array: intervals.map(iv => iv[1]),
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, j) => [j, 'sorted'])),
              [i]: 'mismatch',
            } as Record<number, string>,
            labels: { [i]: 'remove' } as Record<number, string>,
          },
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Minimum intervals to remove: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: intervals.map(iv => iv[1]),
        highlights: Object.fromEntries(intervals.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default nonOverlappingIntervalsGreedy;
