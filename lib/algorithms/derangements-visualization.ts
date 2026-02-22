import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const derangementsVisualization: AlgorithmDefinition = {
  id: 'derangements-visualization',
  title: 'Derangements Visualization',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Count derangements D(n) — permutations where no element appears in its original position. Recurrence: D(n) = (n-1)*(D(n-1) + D(n-2)).',
  tags: ['Math', 'Combinatorics', 'Derangements', 'DP'],
  code: {
    pseudocode: `function derangements(n):
  if n == 0: return 1
  if n == 1: return 0
  D[0] = 1; D[1] = 0
  for i from 2 to n:
    D[i] = (i - 1) * (D[i-1] + D[i-2])
  return D[n]`,
    python: `def derangements(n):
    if n == 0: return 1
    if n == 1: return 0
    D = [0] * (n + 1)
    D[0], D[1] = 1, 0
    for i in range(2, n + 1):
        D[i] = (i - 1) * (D[i-1] + D[i-2])
    return D[n]`,
    javascript: `function derangements(n) {
  if (n === 0) return 1;
  if (n === 1) return 0;
  const D = new Array(n + 1).fill(0);
  D[0] = 1; D[1] = 0;
  for (let i = 2; i <= n; i++) {
    D[i] = (i - 1) * (D[i-1] + D[i-2]);
  }
  return D[n];
}`,
    java: `public long derangements(int n) {
    if (n == 0) return 1;
    if (n == 1) return 0;
    long[] D = new long[n + 1];
    D[0] = 1; D[1] = 0;
    for (int i = 2; i <= n; i++)
        D[i] = (long)(i - 1) * (D[i-1] + D[i-2]);
    return D[n];
}`,
  },
  defaultInput: { n: 8 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 8,
      placeholder: 'e.g. 8',
      helperText: 'Compute D(n) — number of derangements (0-12)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(0, input.n as number), 12);
    const steps: AlgorithmStep[] = [];
    const D: number[] = new Array(n + 1).fill(0);

    const makeViz = (active: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        labels[i] = `D(${i})`;
        if (i === active) highlights[i] = 'active';
        else if (i < active) highlights[i] = 'found';
        else highlights[i] = 'visited';
      }
      return { type: 'array', array: D.slice(), highlights, labels };
    };

    if (n === 0) {
      D[0] = 1;
      steps.push({ line: 2, explanation: 'D(0)=1 (empty derangement).', variables: { D: 1 }, visualization: makeViz(0) });
      return steps;
    }
    if (n === 1) {
      D[0] = 1; D[1] = 0;
      steps.push({ line: 3, explanation: 'D(1)=0 (no derangement of 1 element).', variables: { D: 0 }, visualization: makeViz(1) });
      return steps;
    }

    D[0] = 1;
    D[1] = 0;
    steps.push({
      line: 4,
      explanation: 'Base cases: D(0)=1 (empty), D(1)=0 (no derangement of one element).',
      variables: { D0: 1, D1: 0 },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      D[i] = (i - 1) * (D[i - 1] + D[i - 2]);
      steps.push({
        line: 6,
        explanation: `D(${i}) = (${i}-1) * (D(${i-1}) + D(${i-2})) = ${i-1} * (${D[i-1]} + ${D[i-2]}) = ${D[i]}.`,
        variables: { i, prev1: D[i - 1], prev2: D[i - 2], result: D[i] },
        visualization: makeViz(i),
      });
    }

    // Show fraction of total permutations
    let factorial = 1;
    for (let i = 1; i <= n; i++) factorial *= i;
    const ratio = (D[n] / factorial).toFixed(4);

    steps.push({
      line: 7,
      explanation: `D(${n}) = ${D[n]}. Total permutations = ${factorial}. D(n)/n! ≈ ${ratio} → 1/e ≈ 0.3679.`,
      variables: { D: D[n], factorial, ratio },
      visualization: {
        type: 'array',
        array: [D[n], factorial],
        highlights: { 0: 'sorted', 1: 'visited' },
        labels: { 0: `D(${n})`, 1: `${n}!` },
      },
    });

    return steps;
  },
};

export default derangementsVisualization;
