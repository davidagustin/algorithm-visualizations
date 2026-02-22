import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nonOverlappingIntervals: AlgorithmDefinition = {
  id: 'non-overlapping-intervals',
  title: 'Non-overlapping Intervals',
  leetcodeNumber: 435,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Find the minimum number of intervals to remove to make the rest non-overlapping. Sort by end time (greedy), then keep intervals with the earliest end time. When an overlap is detected, remove the one with the later end (keep the earlier-ending one to leave room for future intervals).',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function eraseOverlapIntervals(intervals):
  sort intervals by end time
  count = 0
  prevEnd = intervals[0].end
  for i from 1 to n-1:
    if intervals[i].start < prevEnd:
      count++   // must remove current interval
    else:
      prevEnd = intervals[i].end
  return count`,
    python: `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    count = 0
    prev_end = intervals[0][1]
    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            count += 1
        else:
            prev_end = intervals[i][1]
    return count`,
    javascript: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let count = 0;
  let prevEnd = intervals[0][1];
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < prevEnd) {
      count++;
    } else {
      prevEnd = intervals[i][1];
    }
  }
  return count;
}`,
    java: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int count = 0;
    int prevEnd = intervals[0][1];
    for (int i = 1; i < intervals.length; i++) {
        if (intervals[i][0] < prevEnd) {
            count++;
        } else {
            prevEnd = intervals[i][1];
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
    const rawIntervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals = rawIntervals.map(iv => [iv[0], iv[1]]).sort((a, b) => a[1] - b[1]);
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
      auxData: { label: 'Greedy State', entries: auxEntries },
    });

    steps.push({
      line: 2,
      explanation: `Sort intervals by end time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Greedy: keep the interval ending earliest.`,
      variables: { intervals },
      visualization: makeViz({}, {}, [{ key: 'count', value: '0' }, { key: 'prevEnd', value: String(intervals[0][1]) }]),
    });

    let count = 0;
    let prevEnd = intervals[0][1];
    const removed = new Set<number>();

    steps.push({
      line: 4,
      explanation: `Keep first interval [${intervals[0][0]}, ${intervals[0][1]}]. Set prevEnd = ${prevEnd}.`,
      variables: { prevEnd, count },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 0: 's0', 1: `e0=prevEnd` }, [
        { key: 'count', value: String(count) },
        { key: 'prevEnd', value: String(prevEnd) },
      ]),
    });

    for (let i = 1; i < intervals.length; i++) {
      const ci = i * 2;
      const current = intervals[i];

      if (current[0] < prevEnd) {
        // Overlap — remove current
        count++;
        removed.add(i);
        const hl: Record<number, string> = { [ci]: 'swapping', [ci + 1]: 'swapping' };
        for (let j = 0; j < i; j++) if (!removed.has(j)) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; }
        steps.push({
          line: 6,
          explanation: `Overlap! ${current[0]} < prevEnd(${prevEnd}). Remove [${current[0]}, ${current[1]}]. Removals = ${count}.`,
          variables: { i, current, prevEnd, count, overlap: true },
          visualization: makeViz(hl, { [ci]: 'REMOVE', [ci + 1]: 'REMOVE' }, [
            { key: 'count (removals)', value: String(count) },
            { key: 'prevEnd', value: String(prevEnd) },
            { key: 'conflict', value: `${current[0]} < ${prevEnd}` },
          ]),
        });
      } else {
        // No overlap — keep current, update prevEnd
        prevEnd = current[1];
        const hl: Record<number, string> = { [ci]: 'found', [ci + 1]: 'found' };
        for (let j = 0; j < i; j++) if (!removed.has(j)) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; }
        steps.push({
          line: 8,
          explanation: `No overlap: ${current[0]} >= prevEnd(${intervals[i - 1][1] ?? prevEnd}). Keep [${current[0]}, ${current[1]}]. Update prevEnd = ${prevEnd}.`,
          variables: { i, current, prevEnd, count },
          visualization: makeViz(hl, { [ci]: 'keep', [ci + 1]: `e=${prevEnd}` }, [
            { key: 'count (removals)', value: String(count) },
            { key: 'prevEnd', value: String(prevEnd) },
          ]),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < intervals.length; j++) {
      finalHl[j * 2] = removed.has(j) ? 'mismatch' : 'found';
      finalHl[j * 2 + 1] = removed.has(j) ? 'mismatch' : 'found';
    }

    steps.push({
      line: 9,
      explanation: `Done! Minimum removals = ${count}. Red = removed, green = kept.`,
      variables: { result: count },
      visualization: makeViz(finalHl, {}, [
        { key: 'Minimum removals', value: String(count) },
        { key: 'Kept intervals', value: String(intervals.length - count) },
      ]),
    });

    return steps;
  },
};

export default nonOverlappingIntervals;
