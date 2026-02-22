import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const intervalListIntersectionsIII: AlgorithmDefinition = {
  id: 'interval-list-intersections-iii',
  title: 'Interval List Intersections III',
  leetcodeNumber: 986,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given two lists of closed intervals A and B (each sorted and non-overlapping), return the intersection. Two-pointer approach: compute overlap as [max(starts), min(ends)]; if valid, record it. Advance the pointer for whichever interval ends first. O(m+n) time.',
  tags: ['Intervals', 'Two Pointers'],
  code: {
    pseudocode: `function intervalIntersection(A, B):
  i = 0, j = 0, result = []
  while i < |A| and j < |B|:
    lo = max(A[i][0], B[j][0])
    hi = min(A[i][1], B[j][1])
    if lo <= hi: result.push([lo, hi])
    if A[i][1] < B[j][1]: i++
    else: j++
  return result`,
    python: `def intervalIntersection(A, B):
    i, j, res = 0, 0, []
    while i < len(A) and j < len(B):
        lo = max(A[i][0], B[j][0])
        hi = min(A[i][1], B[j][1])
        if lo <= hi: res.append([lo, hi])
        if A[i][1] < B[j][1]: i += 1
        else: j += 1
    return res`,
    javascript: `function intervalIntersection(A, B) {
  let i = 0, j = 0;
  const res = [];
  while (i < A.length && j < B.length) {
    const lo = Math.max(A[i][0], B[j][0]);
    const hi = Math.min(A[i][1], B[j][1]);
    if (lo <= hi) res.push([lo, hi]);
    if (A[i][1] < B[j][1]) i++;
    else j++;
  }
  return res;
}`,
    java: `public int[][] intervalIntersection(int[][] A, int[][] B) {
    List<int[]> res = new ArrayList<>();
    int i = 0, j = 0;
    while (i < A.length && j < B.length) {
        int lo = Math.max(A[i][0], B[j][0]);
        int hi = Math.min(A[i][1], B[j][1]);
        if (lo <= hi) res.add(new int[]{lo, hi});
        if (A[i][1] < B[j][1]) i++;
        else j++;
    }
    return res.toArray(new int[0][]);
}`,
  },
  defaultInput: {
    A: [[0, 2], [5, 10], [13, 23], [24, 25]],
    B: [[1, 5], [8, 12], [15, 24], [25, 26]],
  },
  inputFields: [
    {
      name: 'A',
      label: 'List A',
      type: 'array',
      defaultValue: [[0, 2], [5, 10], [13, 23], [24, 25]],
      placeholder: '[[0,2],[5,10]]',
      helperText: 'First sorted interval list',
    },
    {
      name: 'B',
      label: 'List B',
      type: 'array',
      defaultValue: [[1, 5], [8, 12], [15, 24], [25, 26]],
      placeholder: '[[1,5],[8,12]]',
      helperText: 'Second sorted interval list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const A = (input.A as number[][]).map(iv => [iv[0], iv[1]]);
    const B = (input.B as number[][]).map(iv => [iv[0], iv[1]]);
    const flatA = A.flat();
    const flatB = B.flat();
    const combined = [...flatA, ...flatB];
    const aLen = flatA.length;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    const makeViz = (
      i: number,
      j: number,
      overlapColor?: string,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => {
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      A.forEach((_, idx) => { lb[idx * 2] = `A${idx}.s`; lb[idx * 2 + 1] = `A${idx}.e`; });
      B.forEach((_, idx) => { lb[aLen + idx * 2] = `B${idx}.s`; lb[aLen + idx * 2 + 1] = `B${idx}.e`; });
      if (i < A.length) { hl[i * 2] = overlapColor ?? 'pointer'; hl[i * 2 + 1] = overlapColor ?? 'pointer'; lb[i * 2] = `i=${i}`; }
      if (j < B.length) { hl[aLen + j * 2] = overlapColor ?? 'pointer'; hl[aLen + j * 2 + 1] = overlapColor ?? 'pointer'; lb[aLen + j * 2] = `j=${j}`; }
      return { type: 'array', array: [...combined], highlights: hl, labels: lb,
        ...(auxEntries ? { auxData: { label: 'Intersections', entries: auxEntries } } : {}) };
    };

    steps.push({ line: 1, explanation: `Intersect A (${A.length}) and B (${B.length}). i=0, j=0.`, variables: { A, B },
      visualization: makeViz(0, 0) });

    let i = 0, j = 0;
    while (i < A.length && j < B.length) {
      const lo = Math.max(A[i][0], B[j][0]);
      const hi = Math.min(A[i][1], B[j][1]);
      const valid = lo <= hi;
      steps.push({ line: 4,
        explanation: `A[${i}]=[${A[i][0]},${A[i][1]}] ∩ B[${j}]=[${B[j][0]},${B[j][1]}]: lo=${lo}, hi=${hi}. ${valid ? 'Intersects!' : 'No intersection.'}`,
        variables: { i, j, lo, hi, valid },
        visualization: makeViz(i, j, valid ? 'found' : 'mismatch',
          result.map((r, k) => ({ key: `#${k + 1}`, value: `[${r[0]},${r[1]}]` }))) });
      if (valid) {
        result.push([lo, hi]);
        steps.push({ line: 6, explanation: `Add [${lo},${hi}] to result. Total: ${result.length}.`,
          variables: { result: result.map(r => [...r]) },
          visualization: makeViz(i, j, 'found',
            result.map((r, k) => ({ key: `#${k}`, value: `[${r[0]},${r[1]}]` }))) });
      }
      if (A[i][1] < B[j][1]) { steps.push({ line: 7, explanation: `A[${i}] ends first. i++ → ${i + 1}.`, variables: { i: i + 1, j },
          visualization: makeViz(i + 1, j, undefined, result.map((r, k) => ({ key: `#${k}`, value: `[${r[0]},${r[1]}]` }))) }); i++;
      } else { steps.push({ line: 8, explanation: `B[${j}] ends first. j++ → ${j + 1}.`, variables: { i, j: j + 1 },
          visualization: makeViz(i, j + 1, undefined, result.map((r, k) => ({ key: `#${k}`, value: `[${r[0]},${r[1]}]` }))) }); j++; }
    }

    steps.push({ line: 9, explanation: `Done. ${result.length} intersections: [${result.map(r => `[${r[0]},${r[1]}]`).join(', ')}].`,
      variables: { result: result.map(r => [...r]) },
      visualization: makeViz(i, j, undefined, result.map((r, k) => ({ key: `R[${k}]`, value: `[${r[0]},${r[1]}]` }))) });

    return steps;
  },
};

export default intervalListIntersectionsIII;
