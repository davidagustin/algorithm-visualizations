import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeCoveredIntervalsII: AlgorithmDefinition = {
  id: 'remove-covered-intervals-ii',
  title: 'Remove Covered Intervals II',
  leetcodeNumber: 1288,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Count the number of remaining intervals after removing all intervals covered by another interval. An interval [a,b] is covered by [c,d] if c<=a and b<=d. Sort by start ascending and end descending; greedily track max end seen — if current end <= maxEnd, it is covered. O(n log n) time.',
  tags: ['Intervals', 'Greedy', 'Sorting'],
  code: {
    pseudocode: `function removeCoveredIntervals(intervals):
  sort by start asc, end desc
  count = 0, maxEnd = 0
  for [start, end] in intervals:
    if end > maxEnd:
      count++
      maxEnd = end
  return count`,
    python: `def removeCoveredIntervals(intervals):
    intervals.sort(key=lambda x: (x[0], -x[1]))
    count, maxEnd = 0, 0
    for s, e in intervals:
        if e > maxEnd:
            count += 1
            maxEnd = e
    return count`,
    javascript: `function removeCoveredIntervals(intervals) {
  intervals.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
  let count = 0, maxEnd = 0;
  for (const [s, e] of intervals) {
    if (e > maxEnd) {
      count++;
      maxEnd = e;
    }
  }
  return count;
}`,
    java: `public int removeCoveredIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? a[0] - b[0] : b[1] - a[1]);
    int count = 0, maxEnd = 0;
    for (int[] iv : intervals) {
        if (iv[1] > maxEnd) {
            count++;
            maxEnd = iv[1];
        }
    }
    return count;
}`,
  },
  defaultInput: { intervals: [[1, 4], [3, 6], [2, 8]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 4], [3, 6], [2, 8]],
      placeholder: '[[1,4],[3,6],[2,8]]',
      helperText: 'Array of [start, end] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : b[1] - a[1]);
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

    steps.push({ line: 2, explanation: `Sort by start asc, end desc: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) }, visualization: makeViz({}, {}) });

    let count = 0, maxEnd = 0;

    for (let i = 0; i < raw.length; i++) {
      const [s, e] = raw[i];
      const ci = i * 2;
      const hl: Record<number, string> = { [ci]: 'active', [ci + 1]: 'active' };
      for (let j = 0; j < i; j++) { hl[j * 2] = j % 2 === 0 ? 'found' : 'mismatch'; hl[j * 2 + 1] = hl[j * 2]; }

      steps.push({ line: 4,
        explanation: `[${s},${e}]: end ${e} > maxEnd ${maxEnd}? ${e > maxEnd ? 'Not covered, keep.' : 'Covered, remove.'}`,
        variables: { start: s, end: e, maxEnd, count },
        visualization: makeViz(hl, { [ci]: `s=${s}`, [ci + 1]: `e=${e}` },
          [{ key: 'count', value: String(count) }, { key: 'maxEnd', value: String(maxEnd) }]) });

      if (e > maxEnd) {
        count++;
        maxEnd = e;
        hl[ci] = 'found'; hl[ci + 1] = 'found';
        steps.push({ line: 5, explanation: `Keep [${s},${e}]. count=${count}, maxEnd=${maxEnd}.`,
          variables: { count, maxEnd },
          visualization: makeViz(hl, {},
            [{ key: 'count', value: String(count) }, { key: 'maxEnd', value: String(maxEnd) }]) });
      } else {
        hl[ci] = 'mismatch'; hl[ci + 1] = 'mismatch';
        steps.push({ line: 6, explanation: `Remove [${s},${e}]: covered (end ${e} <= maxEnd ${maxEnd}).`,
          variables: { count, maxEnd },
          visualization: makeViz(hl, {},
            [{ key: 'count', value: String(count) }, { key: 'maxEnd', value: String(maxEnd) }]) });
      }
    }

    steps.push({ line: 7, explanation: `Done. ${count} intervals remain after removing covered ones.`,
      variables: { count },
      visualization: makeViz({}, {}, [{ key: 'Remaining', value: String(count) }]) });

    return steps;
  },
};

export default removeCoveredIntervalsII;
