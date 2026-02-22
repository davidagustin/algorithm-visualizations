import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const josephusProblemII: AlgorithmDefinition = {
  id: 'josephus-problem-ii',
  title: 'Josephus Problem II',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'n people stand in a circle. Every k-th person is eliminated. Find the position of the last survivor. Solved with the recurrence J(1)=0, J(n)=(J(n-1)+k) mod n.',
  tags: ['Math', 'Combinatorics', 'Josephus', 'Recursion'],
  code: {
    pseudocode: `function josephus(n, k):
  # Returns 0-indexed position of survivor
  pos = 0
  for i from 2 to n:
    pos = (pos + k) mod i
  return pos`,
    python: `def josephus(n, k):
    pos = 0
    for i in range(2, n + 1):
        pos = (pos + k) % i
    return pos  # 0-indexed`,
    javascript: `function josephus(n, k) {
  let pos = 0;
  for (let i = 2; i <= n; i++) {
    pos = (pos + k) % i;
  }
  return pos; // 0-indexed
}`,
    java: `public int josephus(int n, int k) {
    int pos = 0;
    for (int i = 2; i <= n; i++) {
        pos = (pos + k) % i;
    }
    return pos; // 0-indexed
}`,
  },
  defaultInput: { n: 7, k: 3 },
  inputFields: [
    { name: 'n', label: 'n (people)', type: 'number', defaultValue: 7, placeholder: 'e.g. 7', helperText: 'Number of people (2-15)' },
    { name: 'k', label: 'k (step)', type: 'number', defaultValue: 3, placeholder: 'e.g. 3', helperText: 'Every k-th person eliminated' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(2, input.n as number), 15);
    const k = Math.max(1, input.k as number);
    const steps: AlgorithmStep[] = [];

    // Compute actual elimination order for visualization
    const circle = Array.from({ length: n }, (_, i) => i + 1);
    const eliminated: number[] = [];
    let pos = 0;
    const circleSteps = JSON.parse(JSON.stringify(circle)) as number[];

    steps.push({
      line: 1,
      explanation: `Josephus problem: ${n} people, eliminate every ${k}-th. Circle: [${circle.join(', ')}].`,
      variables: { n, k },
      visualization: {
        type: 'array',
        array: circle.slice(),
        highlights: Object.fromEntries(circle.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(circle.map((v, i) => [i, `P${v}`])),
      },
    });

    // DP recurrence steps
    let dpPos = 0;
    const dpSteps: number[] = [0];

    steps.push({
      line: 2,
      explanation: `DP approach: J(1)=0. For i from 2 to ${n}: J(i)=(J(i-1)+${k}) mod i.`,
      variables: { base: 'J(1)=0' },
      visualization: {
        type: 'array',
        array: [0],
        highlights: { 0: 'active' },
        labels: { 0: 'J(1)=0' },
      },
    });

    for (let i = 2; i <= n; i++) {
      dpPos = (dpPos + k) % i;
      dpSteps.push(dpPos);
      steps.push({
        line: 4,
        explanation: `J(${i}) = (J(${i-1}) + ${k}) mod ${i} = (${dpSteps[i-2]} + ${k}) mod ${i} = ${dpPos}.`,
        variables: { i, prev: dpSteps[i - 2], current: dpPos },
        visualization: {
          type: 'array',
          array: dpSteps.slice(),
          highlights: { [i - 1]: 'active', ...Object.fromEntries(dpSteps.slice(0, i - 1).map((_, j) => [j, 'found'])) },
          labels: Object.fromEntries(dpSteps.map((_, j) => [j, `J(${j+1})`])),
        },
      });
    }

    // Simulate for visual confirmation
    const remaining = Array.from({ length: n }, (_, i) => i + 1);
    let simPos = 0;
    const elimOrder: number[] = [];
    while (remaining.length > 1) {
      simPos = (simPos + k - 1) % remaining.length;
      elimOrder.push(remaining[simPos]);
      remaining.splice(simPos, 1);
      if (simPos >= remaining.length) simPos = 0;
    }

    steps.push({
      line: 5,
      explanation: `Survivor is at 0-indexed position ${dpPos} (1-indexed: person ${dpPos + 1}). Elimination order: [${elimOrder.join(', ')}], survivor: ${remaining[0]}.`,
      variables: { survivorIndex: dpPos, survivorPerson: dpPos + 1, elimOrder },
      visualization: {
        type: 'array',
        array: [...elimOrder, remaining[0]],
        highlights: {
          [elimOrder.length]: 'sorted',
          ...Object.fromEntries(elimOrder.map((_, i) => [i, 'swapping'])),
        },
        labels: {
          [elimOrder.length]: 'survivor',
          ...Object.fromEntries(elimOrder.map((_, i) => [i, `elim${i+1}`])),
        },
      },
    });

    return steps;
  },
};

export default josephusProblemII;
