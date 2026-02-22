import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeIntervalsIII: AlgorithmDefinition = {
  id: 'merge-intervals-iii',
  title: 'Merge Intervals III',
  leetcodeNumber: 56,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given a collection of intervals, merge all overlapping intervals. Sort by start, then greedily merge: if the current interval overlaps with the last merged, extend the end; otherwise push a new interval. Returns the minimum number of non-overlapping intervals. O(n log n) time, O(n) space.',
  tags: ['Intervals', 'Sorting', 'Greedy'],
  code: {
    pseudocode: `function merge(intervals):
  sort intervals by start
  result = [intervals[0]]
  for each [s, e] in intervals[1:]:
    if s <= result.last.end:
      result.last.end = max(result.last.end, e)
    else:
      result.push([s, e])
  return result`,
    python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    for s, e in intervals[1:]:
        if s <= result[-1][1]:
            result[-1][1] = max(result[-1][1], e)
        else:
            result.append([s, e])
    return result`,
    javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const result = [intervals[0].slice()];
  for (let i = 1; i < intervals.length; i++) {
    const [s, e] = intervals[i];
    const last = result[result.length - 1];
    if (s <= last[1]) {
      last[1] = Math.max(last[1], e);
    } else {
      result.push([s, e]);
    }
  }
  return result;
}`,
    java: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> res = new ArrayList<>();
    res.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = res.get(res.size() - 1);
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            res.add(intervals[i]);
        }
    }
    return res.toArray(new int[0][]);
}`,
  },
  defaultInput: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] },
  inputFields: [
    {
      name: 'intervals',
      label: 'Intervals',
      type: 'array',
      defaultValue: [[1, 3], [2, 6], [8, 10], [15, 18]],
      placeholder: '[[1,3],[2,6],[8,10],[15,18]]',
      helperText: 'Array of [start, end] interval pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = (input.intervals as number[][]).map(iv => [iv[0], iv[1]]);
    raw.sort((a, b) => a[0] - b[0]);
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
      ...(auxEntries ? { auxData: { label: 'Merged', entries: auxEntries } } : {}),
    });

    const baseLabels: Record<number, string> = {};
    raw.forEach((_, i) => {
      baseLabels[i * 2] = `s${i}`;
      baseLabels[i * 2 + 1] = `e${i}`;
    });

    steps.push({
      line: 2,
      explanation: `Sort intervals by start: [${raw.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}].`,
      variables: { sorted: raw.map(iv => [...iv]) },
      visualization: makeViz({}, baseLabels),
    });

    const result: number[][] = [[raw[0][0], raw[0][1]]];
    steps.push({
      line: 3,
      explanation: `Initialize result with first interval [${raw[0][0]}, ${raw[0][1]}].`,
      variables: { result: result.map(r => [...r]) },
      visualization: makeViz({ 0: 'found', 1: 'found' }, { 0: 's0', 1: 'e0' },
        result.map((r, i) => ({ key: `R[${i}]`, value: `[${r[0]},${r[1]}]` }))),
    });

    for (let i = 1; i < raw.length; i++) {
      const [s, e] = raw[i];
      const last = result[result.length - 1];
      const ci = i * 2;

      const hl: Record<number, string> = {};
      for (let j = 0; j < i; j++) { hl[j * 2] = 'found'; hl[j * 2 + 1] = 'found'; }
      hl[ci] = 'active'; hl[ci + 1] = 'active';
      const lb: Record<number, string> = { [ci]: `s=${s}`, [ci + 1]: `e=${e}` };

      steps.push({
        line: 5,
        explanation: `Check [${s},${e}] vs last merged [${last[0]},${last[1]}]. ${s} <= ${last[1]}? ${s <= last[1]}.`,
        variables: { current: [s, e], last: [...last], overlaps: s <= last[1] },
        visualization: makeViz(hl, lb, result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
      });

      if (s <= last[1]) {
        const old = last[1];
        last[1] = Math.max(last[1], e);
        steps.push({
          line: 6,
          explanation: `Overlap. Extend end to max(${old},${e})=${last[1]}.`,
          variables: { result: result.map(r => [...r]) },
          visualization: makeViz({ ...hl, [ci]: 'swapping', [ci + 1]: 'swapping' }, {},
            result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
        });
      } else {
        result.push([s, e]);
        steps.push({
          line: 8,
          explanation: `No overlap. Add [${s},${e}] as new interval.`,
          variables: { result: result.map(r => [...r]) },
          visualization: makeViz({ ...hl, [ci]: 'active', [ci + 1]: 'active' }, {},
            result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
        });
      }
    }

    const finalHl: Record<number, string> = {};
    for (let j = 0; j < flat.length; j++) finalHl[j] = 'found';
    steps.push({
      line: 9,
      explanation: `Done. Merged ${raw.length} → ${result.length} intervals: [${result.map(r => `[${r[0]},${r[1]}]`).join(', ')}].`,
      variables: { result: result.map(r => [...r]) },
      visualization: makeViz(finalHl, {}, result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))),
    });

    return steps;
  },
};

export default mergeIntervalsIII;
