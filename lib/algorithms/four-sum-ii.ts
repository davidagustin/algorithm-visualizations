import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fourSumIi: AlgorithmDefinition = {
  id: 'four-sum-ii',
  title: '4Sum II',
  leetcodeNumber: 454,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given four integer arrays, count tuples (i, j, k, l) such that nums1[i] + nums2[j] + nums3[k] + nums4[l] equals zero. Uses a hash map to store sums of all pairs from the first two arrays, then checks complements from the second two arrays.',
  tags: ['hash map', 'array', 'four sum'],

  code: {
    pseudocode: `function fourSumCount(A, B, C, D):
  map = {}
  for a in A:
    for b in B:
      map[a+b] = map.get(a+b, 0) + 1
  count = 0
  for c in C:
    for d in D:
      count += map.get(-(c+d), 0)
  return count`,

    python: `def fourSumCount(A, B, C, D):
    ab = {}
    for a in A:
        for b in B:
            ab[a+b] = ab.get(a+b, 0) + 1
    count = 0
    for c in C:
        for d in D:
            count += ab.get(-(c+d), 0)
    return count`,

    javascript: `function fourSumCount(A, B, C, D) {
  const ab = new Map();
  for (const a of A) {
    for (const b of B) {
      const s = a + b;
      ab.set(s, (ab.get(s) || 0) + 1);
    }
  }
  let count = 0;
  for (const c of C) {
    for (const d of D) {
      count += ab.get(-(c + d)) || 0;
    }
  }
  return count;
}`,

    java: `public int fourSumCount(int[] A, int[] B, int[] C, int[] D) {
    Map<Integer, Integer> ab = new HashMap<>();
    for (int a : A)
        for (int b : B)
            ab.merge(a + b, 1, Integer::sum);
    int count = 0;
    for (int c : C)
        for (int d : D)
            count += ab.getOrDefault(-(c + d), 0);
    return count;
}`,
  },

  defaultInput: {
    A: [1, 2],
    B: [-2, -1],
    C: [-1, 2],
    D: [0, 2],
  },

  inputFields: [
    {
      name: 'A',
      label: 'Array A',
      type: 'array',
      defaultValue: [1, 2],
      placeholder: '1,2',
      helperText: 'First integer array',
    },
    {
      name: 'B',
      label: 'Array B',
      type: 'array',
      defaultValue: [-2, -1],
      placeholder: '-2,-1',
      helperText: 'Second integer array',
    },
    {
      name: 'C',
      label: 'Array C',
      type: 'array',
      defaultValue: [-1, 2],
      placeholder: '-1,2',
      helperText: 'Third integer array',
    },
    {
      name: 'D',
      label: 'Array D',
      type: 'array',
      defaultValue: [0, 2],
      placeholder: '0,2',
      helperText: 'Fourth integer array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const A = input.A as number[];
    const B = input.B as number[];
    const C = input.C as number[];
    const D = input.D as number[];
    const steps: AlgorithmStep[] = [];
    const ab: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: 'Initialize hash map to count all pairwise sums from arrays A and B.',
      variables: { map: '{}', count: 0 },
      visualization: { type: 'array', array: [...A], highlights: {}, labels: {} },
    });

    for (let i = 0; i < A.length; i++) {
      for (let j = 0; j < B.length; j++) {
        const s = A[i] + B[j];
        ab[s] = (ab[s] || 0) + 1;
        steps.push({
          line: 4,
          explanation: `A[${i}]=${A[i]} + B[${j}]=${B[j]} = ${s}. Map[${s}] = ${ab[s]}.`,
          variables: { 'A[i]': A[i], 'B[j]': B[j], sum: s, mapEntry: ab[s], map: JSON.stringify(ab) },
          visualization: {
            type: 'array',
            array: [...A],
            highlights: { [i]: 'active' },
            labels: { [i]: `+${B[j]}=${s}` },
          },
        });
      }
    }

    let count = 0;

    steps.push({
      line: 5,
      explanation: `Finished building A+B map: ${JSON.stringify(ab)}. Now iterate C and D looking for complements.`,
      variables: { map: JSON.stringify(ab), count },
      visualization: { type: 'array', array: [...C], highlights: {}, labels: {} },
    });

    for (let k = 0; k < C.length; k++) {
      for (let l = 0; l < D.length; l++) {
        const need = -(C[k] + D[l]);
        const found = ab[need] || 0;
        count += found;
        steps.push({
          line: 8,
          explanation: `C[${k}]=${C[k]} + D[${l}]=${D[l]} = ${C[k]+D[l]}. Need complement ${need} in map. Found ${found} pair(s). Total count = ${count}.`,
          variables: { 'C[k]': C[k], 'D[l]': D[l], need, found, count },
          visualization: {
            type: 'array',
            array: [...C],
            highlights: { [k]: found > 0 ? 'found' : 'comparing' },
            labels: { [k]: `need ${need}` },
          },
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Total tuples with zero sum = ${count}.`,
      variables: { result: count },
      visualization: { type: 'array', array: [...C], highlights: {}, labels: {} },
    });

    return steps;
  },
};

export default fourSumIi;
