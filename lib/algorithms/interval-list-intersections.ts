import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const intervalListIntersections: AlgorithmDefinition = {
  id: 'interval-list-intersections',
  title: 'Interval List Intersections',
  leetcodeNumber: 986,
  difficulty: 'Medium',
  category: 'Interval',
  description:
    'Given two lists of closed intervals, each list of intervals is pairwise disjoint and in sorted order. Return the intersection of these two interval lists. Two pointers advance through both lists, computing overlap when intervals intersect.',
  tags: ['two pointers', 'interval', 'merge'],

  code: {
    pseudocode: `function intervalIntersection(A, B):
  i = 0, j = 0, result = []
  while i < len(A) and j < len(B):
    lo = max(A[i][0], B[j][0])
    hi = min(A[i][1], B[j][1])
    if lo <= hi:
      result.append([lo, hi])
    if A[i][1] < B[j][1]:
      i++
    else:
      j++
  return result`,

    python: `def intervalIntersection(firstList, secondList):
    i, j = 0, 0
    result = []
    while i < len(firstList) and j < len(secondList):
        lo = max(firstList[i][0], secondList[j][0])
        hi = min(firstList[i][1], secondList[j][1])
        if lo <= hi:
            result.append([lo, hi])
        if firstList[i][1] < secondList[j][1]:
            i += 1
        else:
            j += 1
    return result`,

    javascript: `function intervalIntersection(firstList, secondList) {
  let i = 0, j = 0;
  const result = [];
  while (i < firstList.length && j < secondList.length) {
    const lo = Math.max(firstList[i][0], secondList[j][0]);
    const hi = Math.min(firstList[i][1], secondList[j][1]);
    if (lo <= hi) result.push([lo, hi]);
    if (firstList[i][1] < secondList[j][1]) i++;
    else j++;
  }
  return result;
}`,

    java: `public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
    List<int[]> res = new ArrayList<>();
    int i = 0, j = 0;
    while (i < firstList.length && j < secondList.length) {
        int lo = Math.max(firstList[i][0], secondList[j][0]);
        int hi = Math.min(firstList[i][1], secondList[j][1]);
        if (lo <= hi) res.add(new int[]{lo, hi});
        if (firstList[i][1] < secondList[j][1]) i++;
        else j++;
    }
    return res.toArray(new int[0][]);
}`,
  },

  defaultInput: {
    firstList: [[0, 2], [5, 10], [13, 23], [24, 25]],
    secondList: [[1, 5], [8, 12], [15, 24], [25, 26]],
  },

  inputFields: [
    {
      name: 'firstList',
      label: 'First Interval List (JSON)',
      type: 'string',
      defaultValue: '[[0,2],[5,10],[13,23],[24,25]]',
      placeholder: '[[0,2],[5,10]]',
      helperText: 'JSON array of intervals',
    },
    {
      name: 'secondList',
      label: 'Second Interval List (JSON)',
      type: 'string',
      defaultValue: '[[1,5],[8,12],[15,24],[25,26]]',
      placeholder: '[[1,5],[8,12]]',
      helperText: 'JSON array of intervals',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const firstList = (typeof input.firstList === 'string'
      ? JSON.parse(input.firstList)
      : input.firstList) as number[][];
    const secondList = (typeof input.secondList === 'string'
      ? JSON.parse(input.secondList)
      : input.secondList) as number[][];
    const steps: AlgorithmStep[] = [];

    const flatA = firstList.map(iv => `[${iv[0]},${iv[1]}]`).join(' ');
    const flatB = secondList.map(iv => `[${iv[0]},${iv[1]}]`).join(' ');

    steps.push({
      line: 1,
      explanation: `Initialize two pointers i=0 and j=0. List A: ${flatA}. List B: ${flatB}.`,
      variables: { i: 0, j: 0, result: '[]' },
      visualization: {
        type: 'array',
        array: firstList.map(iv => iv[0]),
        highlights: { 0: 'active' },
        labels: { 0: 'i' },
      },
    });

    let i = 0;
    let j = 0;
    const result: number[][] = [];

    while (i < firstList.length && j < secondList.length) {
      const A = firstList[i];
      const B = secondList[j];
      const lo = Math.max(A[0], B[0]);
      const hi = Math.min(A[1], B[1]);

      steps.push({
        line: 4,
        explanation: `Compare A[${i}]=[${A[0]},${A[1]}] with B[${j}]=[${B[0]},${B[1]}]. lo=max(${A[0]},${B[0]})=${lo}, hi=min(${A[1]},${B[1]})=${hi}.`,
        variables: { i, j, A: `[${A[0]},${A[1]}]`, B: `[${B[0]},${B[1]}]`, lo, hi },
        visualization: {
          type: 'array',
          array: firstList.map(iv => iv[0]),
          highlights: { [i]: 'active' },
          labels: { [i]: 'i' },
        },
      });

      if (lo <= hi) {
        result.push([lo, hi]);
        steps.push({
          line: 6,
          explanation: `Overlap found! [${lo},${hi}] added to result. Result so far: ${JSON.stringify(result)}.`,
          variables: { lo, hi, result: JSON.stringify(result) },
          visualization: {
            type: 'array',
            array: firstList.map(iv => iv[0]),
            highlights: { [i]: 'found' },
            labels: { [i]: 'match' },
          },
        });
      } else {
        steps.push({
          line: 5,
          explanation: `No overlap: lo=${lo} > hi=${hi}. Skip this pair.`,
          variables: { lo, hi },
          visualization: {
            type: 'array',
            array: firstList.map(iv => iv[0]),
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'no match' },
          },
        });
      }

      if (A[1] < B[1]) {
        i++;
        steps.push({
          line: 8,
          explanation: `A[${i - 1}] ends earlier (${A[1]} < ${B[1]}), advance i to ${i}.`,
          variables: { i, j },
          visualization: {
            type: 'array',
            array: firstList.map(iv => iv[0]),
            highlights: i < firstList.length ? { [i]: 'pointer' } : {},
            labels: i < firstList.length ? { [i]: 'i' } : {},
          },
        });
      } else {
        j++;
        steps.push({
          line: 10,
          explanation: `B[${j - 1}] ends earlier or equal (${B[1]} <= ${A[1]}), advance j to ${j}.`,
          variables: { i, j },
          visualization: {
            type: 'array',
            array: secondList.map(iv => iv[0]),
            highlights: j < secondList.length ? { [j]: 'pointer' } : {},
            labels: j < secondList.length ? { [j]: 'j' } : {},
          },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Final intersections: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: result.map(iv => iv[0]),
        highlights: Object.fromEntries(result.map((_, idx) => [idx, 'found'])),
        labels: Object.fromEntries(result.map((_, idx) => [idx, `[${result[idx][0]},${result[idx][1]}]`])),
      },
    });

    return steps;
  },
};

export default intervalListIntersections;
