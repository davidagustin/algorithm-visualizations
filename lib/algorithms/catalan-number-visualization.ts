import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const catalanNumberVisualization: AlgorithmDefinition = {
  id: 'catalan-number-visualization',
  title: 'Catalan Number Visualization',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute the nth Catalan number using the recurrence C(n) = sum of C(i)*C(n-1-i) for i=0..n-1. Catalan numbers count balanced parentheses, binary trees, and more.',
  tags: ['Math', 'Combinatorics', 'DP', 'Catalan'],
  code: {
    pseudocode: `function catalan(n):
  C[0] = C[1] = 1
  for i from 2 to n:
    C[i] = 0
    for j from 0 to i-1:
      C[i] += C[j] * C[i-1-j]
  return C[n]`,
    python: `def catalan(n):
    C = [0] * (n + 1)
    C[0] = 1
    if n > 0: C[1] = 1
    for i in range(2, n + 1):
        for j in range(i):
            C[i] += C[j] * C[i - 1 - j]
    return C[n]`,
    javascript: `function catalan(n) {
  const C = new Array(n + 1).fill(0);
  C[0] = 1;
  if (n > 0) C[1] = 1;
  for (let i = 2; i <= n; i++)
    for (let j = 0; j < i; j++)
      C[i] += C[j] * C[i - 1 - j];
  return C[n];
}`,
    java: `public long catalan(int n) {
    long[] C = new long[n + 1];
    C[0] = 1;
    if (n > 0) C[1] = 1;
    for (int i = 2; i <= n; i++)
        for (int j = 0; j < i; j++)
            C[i] += C[j] * C[i - 1 - j];
    return C[n];
}`,
  },
  defaultInput: { n: 7 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Compute the nth Catalan number (0-10)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 10);
    const steps: AlgorithmStep[] = [];
    const C: number[] = new Array(n + 1).fill(0);
    C[0] = 1;
    if (n > 0) C[1] = 1;

    const makeViz = (activeIdx: number, comparing: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        labels[i] = `C(${i})`;
        if (i === activeIdx) highlights[i] = 'active';
        else if (comparing.includes(i)) highlights[i] = 'comparing';
        else if (C[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'array', array: C.slice(), highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Compute Catalan numbers C(0) through C(${n}). C(0)=1, C(1)=1.`,
      variables: { n },
      visualization: makeViz(-1, []),
    });

    for (let i = 2; i <= n; i++) {
      steps.push({
        line: 3,
        explanation: `Computing C(${i}) = sum of C(j)*C(${i}-1-j) for j=0..${i-1}.`,
        variables: { i, currentValue: C[i] },
        visualization: makeViz(i, []),
      });
      for (let j = 0; j < i; j++) {
        const contrib = C[j] * C[i - 1 - j];
        C[i] += contrib;
        steps.push({
          line: 5,
          explanation: `C(${i}) += C(${j})*C(${i-1-j}) = ${C[j]}*${C[i-1-j]} = ${contrib}. Running sum: ${C[i]}.`,
          variables: { i, j, contribution: contrib, sum: C[i] },
          visualization: makeViz(i, [j, i - 1 - j]),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Catalan numbers: [${C.join(', ')}]. C(${n}) = ${C[n]}.`,
      variables: { catalanNumbers: C.slice(), result: C[n] },
      visualization: makeViz(n, []),
    });

    return steps;
  },
};

export default catalanNumberVisualization;
