import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const removeCoveredIntervals: AlgorithmDefinition = {
  id: 'remove-covered-intervals',
  title: 'Remove Covered Intervals',
  leetcodeNumber: 1288,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given a list of intervals, remove all intervals that are covered by another interval in the list. An interval [a,b] is covered by [c,d] if c<=a and b<=d. Sort by start ascending then end descending, then greedily track the maximum right boundary seen.',
  tags: ['interval', 'greedy', 'sorting'],

  code: {
    pseudocode: `function removeCoveredIntervals(intervals):
  sort by start asc, end desc
  count = 0, maxRight = 0
  for each [start, end] in intervals:
    if end > maxRight:
      count++
      maxRight = end
  return count`,

    python: `def removeCoveredIntervals(intervals):
    intervals.sort(key=lambda x: (x[0], -x[1]))
    count = 0
    max_right = 0
    for start, end in intervals:
        if end > max_right:
            count += 1
            max_right = end
    return count`,

    javascript: `function removeCoveredIntervals(intervals) {
  intervals.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
  let count = 0, maxRight = 0;
  for (const [start, end] of intervals) {
    if (end > maxRight) {
      count++;
      maxRight = end;
    }
  }
  return count;
}`,

    java: `public int removeCoveredIntervals(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] == b[0] ? b[1] - a[1] : a[0] - b[0]);
    int count = 0, maxRight = 0;
    for (int[] iv : intervals) {
        if (iv[1] > maxRight) {
            count++;
            maxRight = iv[1];
        }
    }
    return count;
}`,
  },

  defaultInput: {
    intervals: [[1, 4], [3, 6], [2, 8]],
  },

  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals (JSON)',
      type: 'string',
      defaultValue: '[[1,4],[3,6],[2,8]]',
      placeholder: '[[1,4],[3,6],[2,8]]',
      helperText: 'JSON array of [start, end] intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const intervals = (typeof input.intervals === 'string'
      ? JSON.parse(input.intervals)
      : input.intervals) as number[][];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start with intervals: ${JSON.stringify(intervals)}. Sort by start ascending, end descending.`,
      variables: { intervals: JSON.stringify(intervals) },
      visualization: {
        type: 'array',
        array: intervals.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(intervals.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
      },
    });

    const sorted = [...intervals].sort((a, b) => a[0] - b[0] || b[1] - a[1]);

    steps.push({
      line: 2,
      explanation: `After sorting: ${JSON.stringify(sorted)}. Now track maxRight to detect covered intervals.`,
      variables: { sorted: JSON.stringify(sorted) },
      visualization: {
        type: 'array',
        array: sorted.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(sorted.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
      },
    });

    let count = 0;
    let maxRight = 0;

    steps.push({
      line: 3,
      explanation: 'Initialize count=0 and maxRight=0 to track remaining (non-covered) intervals.',
      variables: { count, maxRight },
      visualization: {
        type: 'array',
        array: sorted.map(iv => iv[0]),
        highlights: {},
        labels: Object.fromEntries(sorted.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
      },
    });

    for (let idx = 0; idx < sorted.length; idx++) {
      const [start, end] = sorted[idx];

      steps.push({
        line: 4,
        explanation: `Check interval [${start},${end}]. Current maxRight=${maxRight}. Is end=${end} > maxRight=${maxRight}?`,
        variables: { idx, start, end, maxRight, count },
        visualization: {
          type: 'array',
          array: sorted.map(iv => iv[0]),
          highlights: { [idx]: 'active' },
          labels: Object.fromEntries(sorted.map((iv, i) => [i, `[${iv[0]},${iv[1]}]`])),
        },
      });

      if (end > maxRight) {
        count++;
        maxRight = end;
        steps.push({
          line: 5,
          explanation: `Interval [${start},${end}] is NOT covered. Increment count to ${count}, update maxRight to ${maxRight}.`,
          variables: { count, maxRight },
          visualization: {
            type: 'array',
            array: sorted.map(iv => iv[0]),
            highlights: { [idx]: 'found' },
            labels: Object.fromEntries(sorted.map((iv, i) => [i, i === idx ? 'kept' : `[${iv[0]},${iv[1]}]`])),
          },
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Interval [${start},${end}] IS covered (end=${end} <= maxRight=${maxRight}). Skip it.`,
          variables: { count, maxRight },
          visualization: {
            type: 'array',
            array: sorted.map(iv => iv[0]),
            highlights: { [idx]: 'mismatch' },
            labels: Object.fromEntries(sorted.map((iv, i) => [i, i === idx ? 'removed' : `[${iv[0]},${iv[1]}]`])),
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Done. ${count} intervals remain after removing all covered ones.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: sorted.map(iv => iv[0]),
        highlights: {},
        labels: { 0: `Result: ${count}` },
      },
    });

    return steps;
  },
};

export default removeCoveredIntervals;
