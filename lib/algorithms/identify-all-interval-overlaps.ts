import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const identifyAllIntervalOverlaps: AlgorithmDefinition = {
  id: 'identify-all-interval-overlaps',
  title: 'Identify All Interval Overlaps',
  leetcodeNumber: 986,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given two sorted lists of closed intervals, find the intersection of the two lists. Use two pointers, one for each list. At each step, compute the overlap (if any) as [max(starts), min(ends)], then advance the pointer whose interval ends first. O(m + n) time.',
  tags: ['Intervals', 'Two Pointers'],
  code: {
    pseudocode: `function intervalIntersection(A, B):
  i = 0, j = 0, result = []
  while i < len(A) and j < len(B):
    start = max(A[i].start, B[j].start)
    end = min(A[i].end, B[j].end)
    if start <= end:
      result.push([start, end])
    if A[i].end < B[j].end:
      i++
    else:
      j++
  return result`,
    python: `def intervalIntersection(A, B):
    i, j, result = 0, 0, []
    while i < len(A) and j < len(B):
        start = max(A[i][0], B[j][0])
        end = min(A[i][1], B[j][1])
        if start <= end:
            result.append([start, end])
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
    return result`,
    javascript: `function intervalIntersection(A, B) {
  let i = 0, j = 0;
  const result = [];
  while (i < A.length && j < B.length) {
    const start = Math.max(A[i][0], B[j][0]);
    const end = Math.min(A[i][1], B[j][1]);
    if (start <= end) {
      result.push([start, end]);
    }
    if (A[i][1] < B[j][1]) {
      i++;
    } else {
      j++;
    }
  }
  return result;
}`,
    java: `public int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> result = new ArrayList<>();
    int i = 0, j = 0;
    while (i < A.length && j < B.length) {
        int start = Math.max(A[i][0], B[j][0]);
        int end = Math.min(A[i][1], B[j][1]);
        if (start <= end) {
            result.add(new int[]{start, end});
        }
        if (A[i][1] < B[j][1]) {
            i++;
        } else {
            j++;
        }
    }
    return result.toArray(new int[0][]);
}`,
  },
  defaultInput: {
    A: [[0, 2], [5, 10], [13, 23], [24, 25]],
    B: [[1, 5], [8, 12], [15, 24], [25, 26]],
  },
  inputFields: [
    {
      name: 'A',
      label: 'Interval List A',
      type: 'array',
      defaultValue: [[0, 2], [5, 10], [13, 23], [24, 25]],
      placeholder: '[[0,2],[5,10],[13,23],[24,25]]',
      helperText: 'First sorted list of [start, end] pairs',
    },
    {
      name: 'B',
      label: 'Interval List B',
      type: 'array',
      defaultValue: [[1, 5], [8, 12], [15, 24], [25, 26]],
      placeholder: '[[1,5],[8,12],[15,24],[25,26]]',
      helperText: 'Second sorted list of [start, end] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const A = input.A as number[][];
    const B = input.B as number[][];
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    // Visualize both lists concatenated: A intervals then B intervals (as flat values)
    const flatA = A.flat();
    const flatB = B.flat();
    const combined = [...flatA, ...flatB];
    const aLen = flatA.length;

    const makeViz = (
      iPtr: number,
      jPtr: number,
      overlapHighlights?: { aIdx: number; bIdx: number; overlap: boolean },
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      // Label all intervals
      A.forEach((_, idx) => {
        labels[idx * 2] = `A${idx}.s`;
        labels[idx * 2 + 1] = `A${idx}.e`;
      });
      B.forEach((_, idx) => {
        labels[aLen + idx * 2] = `B${idx}.s`;
        labels[aLen + idx * 2 + 1] = `B${idx}.e`;
      });

      // Highlight current pointers
      if (iPtr < A.length) {
        highlights[iPtr * 2] = 'pointer';
        highlights[iPtr * 2 + 1] = 'pointer';
        labels[iPtr * 2] = `i=${iPtr}`;
      }
      if (jPtr < B.length) {
        highlights[aLen + jPtr * 2] = 'pointer';
        highlights[aLen + jPtr * 2 + 1] = 'pointer';
        labels[aLen + jPtr * 2] = `j=${jPtr}`;
      }

      if (overlapHighlights) {
        const ai = overlapHighlights.aIdx;
        const bi = overlapHighlights.bIdx;
        const color = overlapHighlights.overlap ? 'found' : 'mismatch';
        highlights[ai * 2] = color;
        highlights[ai * 2 + 1] = color;
        highlights[aLen + bi * 2] = color;
        highlights[aLen + bi * 2 + 1] = color;
      }

      return {
        type: 'array',
        array: [...combined],
        highlights,
        labels,
        ...(auxEntries ? { auxData: { label: 'Intersections', entries: auxEntries } } : {}),
      };
    };

    steps.push({
      line: 1,
      explanation: `Find intersections of A (${A.length} intervals) and B (${B.length} intervals). Two pointers i and j.`,
      variables: { A, B },
      visualization: makeViz(0, 0),
    });

    let i = 0;
    let j = 0;

    steps.push({
      line: 2,
      explanation: `Initialize i=0, j=0.`,
      variables: { i, j },
      visualization: makeViz(i, j),
    });

    while (i < A.length && j < B.length) {
      const start = Math.max(A[i][0], B[j][0]);
      const end = Math.min(A[i][1], B[j][1]);
      const overlaps = start <= end;

      steps.push({
        line: 4,
        explanation: `Compare A[${i}]=[${A[i][0]},${A[i][1]}] with B[${j}]=[${B[j][0]},${B[j][1]}]. Overlap = [max(${A[i][0]},${B[j][0]}), min(${A[i][1]},${B[j][1]})] = [${start}, ${end}]. ${overlaps ? 'Valid overlap!' : 'No overlap (start > end).'}`,
        variables: { i, j, start, end, overlaps },
        visualization: makeViz(i, j, { aIdx: i, bIdx: j, overlap: overlaps },
          result.map((r, idx) => ({ key: `#${idx + 1}`, value: `[${r[0]}, ${r[1]}]` })),
        ),
      });

      if (overlaps) {
        result.push([start, end]);
        steps.push({
          line: 6,
          explanation: `Add intersection [${start}, ${end}] to result. Total intersections: ${result.length}.`,
          variables: { result: result.map(r => [...r]) },
          visualization: makeViz(i, j, { aIdx: i, bIdx: j, overlap: true },
            result.map((r, idx) => ({ key: `#${idx}`, value: `[${r[0]}, ${r[1]}]` })),
          ),
        });
      }

      if (A[i][1] < B[j][1]) {
        steps.push({
          line: 8,
          explanation: `A[${i}].end (${A[i][1]}) < B[${j}].end (${B[j][1]}). Advance i to ${i + 1}.`,
          variables: { i: i + 1, j, reason: 'A ends first' },
          visualization: makeViz(i + 1, j, undefined,
            result.map((r, idx) => ({ key: `#${idx}`, value: `[${r[0]}, ${r[1]}]` })),
          ),
        });
        i++;
      } else {
        steps.push({
          line: 10,
          explanation: `A[${i}].end (${A[i][1]}) >= B[${j}].end (${B[j][1]}). Advance j to ${j + 1}.`,
          variables: { i, j: j + 1, reason: 'B ends first' },
          visualization: makeViz(i, j + 1, undefined,
            result.map((r, idx) => ({ key: `#${idx}`, value: `[${r[0]}, ${r[1]}]` })),
          ),
        });
        j++;
      }
    }

    steps.push({
      line: 11,
      explanation: `Done! Found ${result.length} intersections: [${result.map(r => `[${r[0]},${r[1]}]`).join(', ')}].`,
      variables: { result: result.map(r => [...r]) },
      visualization: makeViz(i, j, undefined,
        result.map((r, idx) => ({ key: `Result[${idx}]`, value: `[${r[0]}, ${r[1]}]` })),
      ),
    });

    return steps;
  },
};

export default identifyAllIntervalOverlaps;
