import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findRightInterval: AlgorithmDefinition = {
  id: 'find-right-interval',
  title: 'Find Right Interval',
  leetcodeNumber: 436,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given an array of intervals, for each interval find the index of the minimum interval whose start point is greater than or equal to the end point of the current interval. Sort interval start points, then for each interval use binary search to find the earliest start >= current end.',
  tags: ['binary search', 'sorting', 'intervals'],

  code: {
    pseudocode: `function findRightInterval(intervals):
  starts = sorted [(start, idx) for idx, (start, end) in intervals]
  result = []
  for start, end in intervals:
    lo, hi = 0, len(starts)
    while lo < hi:
      mid = (lo + hi) / 2
      if starts[mid][0] < end:
        lo = mid + 1
      else:
        hi = mid
    result.append(starts[lo][1] if lo < len else -1)
  return result`,

    python: `def findRightInterval(intervals: list[list[int]]) -> list[int]:
    starts = sorted((s, i) for i, (s, _) in enumerate(intervals))
    result = []
    for s, e in intervals:
        lo, hi = 0, len(starts)
        while lo < hi:
            mid = (lo + hi) // 2
            if starts[mid][0] < e:
                lo = mid + 1
            else:
                hi = mid
        result.append(starts[lo][1] if lo < len(starts) else -1)
    return result`,

    javascript: `function findRightInterval(intervals) {
  const starts = intervals.map(([s], i) => [s, i]).sort((a, b) => a[0] - b[0]);
  return intervals.map(([, e]) => {
    let lo = 0, hi = starts.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (starts[mid][0] < e) lo = mid + 1;
      else hi = mid;
    }
    return lo < starts.length ? starts[lo][1] : -1;
  });
}`,

    java: `public int[] findRightInterval(int[][] intervals) {
    int n = intervals.length;
    int[][] starts = new int[n][2];
    for (int i = 0; i < n; i++) starts[i] = new int[]{intervals[i][0], i};
    Arrays.sort(starts, (a, b) -> a[0] - b[0]);
    int[] res = new int[n];
    for (int i = 0; i < n; i++) {
        int lo = 0, hi = n, end = intervals[i][1];
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (starts[mid][0] < end) lo = mid + 1;
            else hi = mid;
        }
        res[i] = lo < n ? starts[lo][1] : -1;
    }
    return res;
}`,
  },

  defaultInput: {
    intervals: [[1, 2], [2, 3], [0, 1], [3, 4]],
  },

  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 2], [2, 3], [0, 1], [3, 4]],
      placeholder: '1,2,2,3,0,1,3,4',
      helperText: 'Intervals as [start,end] pairs (flattened)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawIntervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    const intervals: [number, number][] = rawIntervals.map(iv => [iv[0], iv[1]]);
    const starts: [number, number][] = intervals
      .map((iv, i): [number, number] => [iv[0], i])
      .sort((a, b) => a[0] - b[0]);

    const startValues = starts.map(s => s[0]);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: startValues,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort interval start points: [${startValues.join(', ')}] with original indices [${starts.map(s => s[1]).join(', ')}].`,
      variables: { intervals: intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(' ') },
      visualization: makeViz(
        startValues.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        starts.reduce((acc, s, i) => ({ ...acc, [i]: `i=${s[1]}` }), {})
      ),
    });

    const result: number[] = [];

    for (let q = 0; q < intervals.length; q++) {
      const [, end] = intervals[q];

      steps.push({
        line: 3,
        explanation: `Process interval[${q}]=[${intervals[q][0]},${intervals[q][1]}]. Find first start >= ${end}.`,
        variables: { interval: `[${intervals[q][0]},${end}]`, endPoint: end },
        visualization: makeViz(
          startValues.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
          startValues.reduce((acc, s, i) => ({ ...acc, [i]: `${s}>=?${end}` }), {})
        ),
      });

      let lo = 0;
      let hi = starts.length;

      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);

        steps.push({
          line: 5,
          explanation: `Binary search: lo=${lo}, hi=${hi}, mid=${mid}. starts[${mid}][0]=${starts[mid][0]} vs end=${end}.`,
          variables: { lo, hi, mid, startAtMid: starts[mid][0], end },
          visualization: makeViz(
            { [lo]: 'active', [Math.min(hi, starts.length) - 1]: 'active', [mid]: 'comparing' },
            { [lo]: 'lo', [Math.min(hi, starts.length) - 1]: 'hi', [mid]: `${starts[mid][0]}` }
          ),
        });

        if (starts[mid][0] < end) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      const ans = lo < starts.length ? starts[lo][1] : -1;
      result.push(ans);

      steps.push({
        line: 10,
        explanation: `Right interval for [${intervals[q][0]},${end}] is index ${ans}${ans >= 0 ? ` (interval ${JSON.stringify(intervals[ans])})` : ' (none)'}.`,
        variables: { intervalIdx: q, result: ans },
        visualization: makeViz(
          ans >= 0 ? { [lo]: 'found' } : {},
          ans >= 0 ? { [lo]: `ans=${ans}` } : {}
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `Final result: [${result.join(', ')}].`,
      variables: { result: `[${result.join(', ')}]` },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default findRightInterval;
