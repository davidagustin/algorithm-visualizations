import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nonOverlappingIntervalsII: AlgorithmDefinition = {
  id: 'non-overlapping-intervals-ii',
  title: 'Non-Overlapping Intervals II',
  leetcodeNumber: 435,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Find the minimum number of intervals to remove to make the rest non-overlapping. Sort by end time; greedily keep intervals that don\'t overlap the last kept interval\'s end. Count removals. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function eraseOverlapIntervals(intervals):
  sort by end time
  removals = 0
  prevEnd = -Infinity
  for [start, end] in intervals:
    if start >= prevEnd:
      prevEnd = end  // keep this interval
    else:
      removals++    // remove this interval
  return removals`,
    python: `def eraseOverlapIntervals(intervals):
    intervals.sort(key=lambda x: x[1])
    removals, prevEnd = 0, float('-inf')
    for s, e in intervals:
        if s >= prevEnd:
            prevEnd = e
        else:
            removals += 1
    return removals`,
    javascript: `function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]);
  let removals = 0, prevEnd = -Infinity;
  for (const [s, e] of intervals) {
    if (s >= prevEnd) {
      prevEnd = e;
    } else {
      removals++;
    }
  }
  return removals;
}`,
    java: `public int eraseOverlapIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[1] - b[1]);
    int removals = 0;
    int prevEnd = Integer.MIN_VALUE;
    for (int[] iv : intervals) {
        if (iv[0] >= prevEnd) {
            prevEnd = iv[1];
        } else {
            removals++;
        }
    }
    return removals;
}`,
  },
  defaultInput: { intervals: [[1, 2], [2, 3], [3, 4], [1, 3]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 2], [2, 3], [3, 4], [1, 3]],
      placeholder: '[[1,2],[2,3],[3,4],[1,3]]',
      helperText: 'Array of [start, end] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[1] - b[1]);
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
      ...(auxEntries ? { auxData: { label: 'Status', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 2,
      explanation: `Sort by end time: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) },
      visualization: makeViz({}, {}),
    });

    let removals = 0;
    let prevEnd = -Infinity;

    for (let i = 0; i < raw.length; i++) {
      const [s, e] = raw[i];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) {
        const kept = raw[j][0] >= (j === 0 ? -Infinity : raw[j - 1][1]);
        hl[j * 2] = kept ? 'found' : 'mismatch';
        hl[j * 2 + 1] = kept ? 'found' : 'mismatch';
      }

      steps.push({
        line: 5,
        explanation: `Interval [${s},${e}]: start ${s} >= prevEnd ${prevEnd === -Infinity ? '-∞' : prevEnd}? ${s >= prevEnd ? 'Yes, keep.' : 'No, remove.'}`,
        variables: { interval: [s, e], prevEnd, removals },
        visualization: makeViz(hl, { [ci]: `s=${s}`, [ci + 1]: `e=${e}` },
          [{ key: 'removals', value: String(removals) }, { key: 'prevEnd', value: String(prevEnd === -Infinity ? '-∞' : prevEnd) }]),
      });

      if (s >= prevEnd) {
        prevEnd = e;
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({
          line: 6,
          explanation: `Keep [${s},${e}]. Update prevEnd to ${e}.`,
          variables: { prevEnd, removals },
          visualization: makeViz(hl, {},
            [{ key: 'removals', value: String(removals) }, { key: 'prevEnd', value: String(prevEnd) }]),
        });
      } else {
        removals++;
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({
          line: 8,
          explanation: `Remove [${s},${e}]. Overlaps with prevEnd=${prevEnd}. removals=${removals}.`,
          variables: { prevEnd, removals },
          visualization: makeViz(hl, {},
            [{ key: 'removals', value: String(removals) }, { key: 'prevEnd', value: String(prevEnd) }]),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Minimum removals: ${removals}.`,
      variables: { removals },
      visualization: makeViz({}, {}, [{ key: 'Min Removals', value: String(removals) }]),
    });

    return steps;
  },
};

export default nonOverlappingIntervalsII;
