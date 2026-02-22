import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stirlingNumbers: AlgorithmDefinition = {
  id: 'stirling-numbers',
  title: 'Stirling Numbers (Second Kind)',
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Compute Stirling numbers of the second kind S(n,k) — the number of ways to partition n objects into k non-empty subsets. Recurrence: S(n,k) = k*S(n-1,k) + S(n-1,k-1).',
  tags: ['Math', 'Combinatorics', 'Stirling', 'DP'],
  code: {
    pseudocode: `function stirling(n, k):
  S[0][0] = 1
  for i from 1 to n:
    for j from 1 to k:
      S[i][j] = j * S[i-1][j] + S[i-1][j-1]
  return S[n][k]`,
    python: `def stirling(n, k):
    S = [[0] * (k + 1) for _ in range(n + 1)]
    S[0][0] = 1
    for i in range(1, n + 1):
        for j in range(1, k + 1):
            S[i][j] = j * S[i-1][j] + S[i-1][j-1]
    return S[n][k]`,
    javascript: `function stirling(n, k) {
  const S = Array.from({length: n+1}, () => new Array(k+1).fill(0));
  S[0][0] = 1;
  for (let i = 1; i <= n; i++)
    for (let j = 1; j <= k; j++)
      S[i][j] = j * S[i-1][j] + S[i-1][j-1];
  return S[n][k];
}`,
    java: `public long stirling(int n, int k) {
    long[][] S = new long[n+1][k+1];
    S[0][0] = 1;
    for (int i = 1; i <= n; i++)
        for (int j = 1; j <= k; j++)
            S[i][j] = j * S[i-1][j] + S[i-1][j-1];
    return S[n][k];
}`,
  },
  defaultInput: { n: 5, k: 3 },
  inputFields: [
    { name: 'n', label: 'n (objects)', type: 'number', defaultValue: 5, placeholder: 'e.g. 5', helperText: 'n <= 8' },
    { name: 'k', label: 'k (subsets)', type: 'number', defaultValue: 3, placeholder: 'e.g. 3' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 8);
    const k = Math.min(input.k as number, n);
    const steps: AlgorithmStep[] = [];
    const S: number[][] = Array.from({ length: n + 1 }, () => new Array(k + 1).fill(0));
    S[0][0] = 1;

    const makeViz = (activeI: number, activeJ: number): ArrayVisualization => {
      const flat: number[] = [];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      let idx = 0;
      for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= k; j++) {
          flat.push(S[i][j]);
          labels[idx] = `S(${i},${j})`;
          if (i === activeI && j === activeJ) highlights[idx] = 'active';
          else if (S[i][j] > 0) highlights[idx] = 'found';
          idx++;
        }
      }
      return { type: 'array', array: flat, highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Compute Stirling S(${n},${k}). S(0,0)=1. Build table up to row ${n}.`,
      variables: { n, k },
      visualization: makeViz(0, 0),
    });

    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= k; j++) {
        const keep = j * S[i - 1][j];
        const join = S[i - 1][j - 1];
        S[i][j] = keep + join;
        steps.push({
          line: 4,
          explanation: `S(${i},${j}) = ${j}*S(${i-1},${j}) + S(${i-1},${j-1}) = ${j}*${S[i-1][j]}+${S[i-1][j-1]} = ${S[i][j]}.`,
          variables: { i, j, keep, join, result: S[i][j] },
          visualization: makeViz(i, j),
        });
      }
    }

    steps.push({
      line: 6,
      explanation: `S(${n},${k}) = ${S[n][k]}: number of ways to partition ${n} objects into ${k} non-empty subsets.`,
      variables: { n, k, result: S[n][k] },
      visualization: makeViz(n, k),
    });

    return steps;
  },
};

export default stirlingNumbers;
