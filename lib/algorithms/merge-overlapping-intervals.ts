import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeOverlappingIntervals: AlgorithmDefinition = {
  id: 'merge-overlapping-intervals',
  title: 'Merge Overlapping Intervals',
  leetcodeNumber: 56,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given a collection of intervals, merge all overlapping intervals. Sort by start time, then iterate: if the current interval overlaps with the last merged interval, extend it; otherwise add a new interval. O(n log n) time.',
  tags: ['Intervals', 'Sorting', 'Greedy'],
  code: {
    pseudocode: `function merge(intervals):
  sort intervals by start time
  merged = [intervals[0]]
  for i from 1 to n-1:
    if intervals[i].start <= merged.last.end:
      merged.last.end = max(merged.last.end, intervals[i].end)
    else:
      merged.push(intervals[i])
  return merged`,
    python: `def merge(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)
        else:
            merged.append([start, end])
    return merged`,
    javascript: `function merge(intervals) {
  intervals.sort((a, b) => a[0] - b[0]);
  const merged = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    if (intervals[i][0] <= last[1]) {
      last[1] = Math.max(last[1], intervals[i][1]);
    } else {
      merged.push([...intervals[i]]);
    }
  }
  return merged;
}`,
    java: `public int[][] merge(int[][] intervals) {
    Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
    List<int[]> merged = new ArrayList<>();
    merged.add(intervals[0]);
    for (int i = 1; i < intervals.length; i++) {
        int[] last = merged.get(merged.size() - 1);
        if (intervals[i][0] <= last[1]) {
            last[1] = Math.max(last[1], intervals[i][1]);
        } else {
            merged.add(intervals[i]);
        }
    }
    return merged.toArray(new int[0][]);
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
      helperText: 'Array of [start, end] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawIntervals = input.intervals as number[][];
    const steps: AlgorithmStep[] = [];

    // Flatten intervals for visualization: [start1, end1, start2, end2, ...]
    const intervals = rawIntervals.map(iv => [iv[0], iv[1]]).sort((a, b) => a[0] - b[0]);
    const flat = intervals.flat();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Merged Intervals', entries: auxEntries } } : {}),
    });

    // Step: show sorted intervals
    const sortedLabels: Record<number, string> = {};
    intervals.forEach((_, i) => {
      sortedLabels[i * 2] = `s${i}`;
      sortedLabels[i * 2 + 1] = `e${i}`;
    });

    steps.push({
      line: 2,
      explanation: `Sort intervals by start time: [${intervals.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Visualized as flat pairs: [${flat.join(', ')}].`,
      variables: { intervals: intervals.map(iv => [...iv]) },
      visualization: makeViz({}, sortedLabels),
    });

    // Initialize merged with first interval
    const merged: number[][] = [[intervals[0][0], intervals[0][1]]];

    steps.push({
      line: 3,
      explanation: `Start merged list with first interval [${intervals[0][0]}, ${intervals[0][1]}].`,
      variables: { merged: merged.map(iv => [...iv]) },
      visualization: makeViz(
        { 0: 'found', 1: 'found' },
        { 0: 's', 1: 'e' },
        [{ key: 'Merged[0]', value: `[${merged[0][0]}, ${merged[0][1]}]` }],
      ),
    });

    for (let i = 1; i < intervals.length; i++) {
      const current = intervals[i];
      const last = merged[merged.length - 1];
      const ci = i * 2; // flat index for current interval start

      steps.push({
        line: 4,
        explanation: `Compare interval [${current[0]}, ${current[1]}] with last merged [${last[0]}, ${last[1]}]. Does ${current[0]} <= ${last[1]}?`,
        variables: { current, lastMerged: [...last], overlap: current[0] <= last[1] },
        visualization: (() => {
          const hl: Record<number, string> = {};
          // Highlight merged intervals
          let idx = 0;
          for (let m = 0; m < merged.length; m++) {
            // find this merged interval's position
            for (let j = 0; j < intervals.length; j++) {
              if (j * 2 < flat.length) {
                // highlight already merged
              }
            }
          }
          // Highlight current interval
          hl[ci] = 'active';
          hl[ci + 1] = 'active';
          // Highlight last merged interval boundary
          for (let j = 0; j < i; j++) {
            hl[j * 2] = 'found';
            hl[j * 2 + 1] = 'found';
          }
          const lb: Record<number, string> = {};
          lb[ci] = `cur.s=${current[0]}`;
          lb[ci + 1] = `cur.e=${current[1]}`;
          return makeViz(hl, lb,
            merged.map((iv, m) => ({ key: `Merged[${m}]`, value: `[${iv[0]}, ${iv[1]}]` })),
          );
        })(),
      });

      if (current[0] <= last[1]) {
        const oldEnd = last[1];
        last[1] = Math.max(last[1], current[1]);

        steps.push({
          line: 6,
          explanation: `Overlap! ${current[0]} <= ${oldEnd}. Extend last merged interval end to max(${oldEnd}, ${current[1]}) = ${last[1]}. Merged: [${last[0]}, ${last[1]}].`,
          variables: { merged: merged.map(iv => [...iv]) },
          visualization: (() => {
            const hl: Record<number, string> = {};
            for (let j = 0; j <= i; j++) {
              hl[j * 2] = 'found';
              hl[j * 2 + 1] = 'found';
            }
            hl[ci] = 'swapping';
            hl[ci + 1] = 'swapping';
            return makeViz(hl, {},
              merged.map((iv, m) => ({ key: `Merged[${m}]`, value: `[${iv[0]}, ${iv[1]}]` })),
            );
          })(),
        });
      } else {
        merged.push([current[0], current[1]]);

        steps.push({
          line: 8,
          explanation: `No overlap: ${current[0]} > ${last[1]}. Add [${current[0]}, ${current[1]}] as new merged interval.`,
          variables: { merged: merged.map(iv => [...iv]) },
          visualization: (() => {
            const hl: Record<number, string> = {};
            for (let j = 0; j <= i; j++) {
              hl[j * 2] = 'found';
              hl[j * 2 + 1] = 'found';
            }
            hl[ci] = 'active';
            hl[ci + 1] = 'active';
            return makeViz(hl, {},
              merged.map((iv, m) => ({ key: `Merged[${m}]`, value: `[${iv[0]}, ${iv[1]}]` })),
            );
          })(),
        });
      }
    }

    // Final result
    steps.push({
      line: 9,
      explanation: `Done! Merged intervals: [${merged.map(iv => `[${iv[0]},${iv[1]}]`).join(', ')}]. Reduced ${intervals.length} intervals to ${merged.length}.`,
      variables: { result: merged.map(iv => [...iv]) },
      visualization: (() => {
        const hl: Record<number, string> = {};
        for (let j = 0; j < flat.length; j++) hl[j] = 'found';
        return makeViz(hl, {},
          merged.map((iv, m) => ({ key: `Result[${m}]`, value: `[${iv[0]}, ${iv[1]}]` })),
        );
      })(),
    });

    return steps;
  },
};

export default mergeOverlappingIntervals;
