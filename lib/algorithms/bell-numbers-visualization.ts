import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bellNumbersVisualization: AlgorithmDefinition = {
  id: 'bell-numbers-visualization',
  title: 'Bell Numbers Visualization',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Compute Bell numbers B(n) — the total number of partitions of a set of n elements — using the Bell triangle (Aitken\'s array). Each Bell number is the sum of the previous row.',
  tags: ['Math', 'Combinatorics', 'Bell Numbers', 'Set Partitions'],
  code: {
    pseudocode: `function bellNumbers(n):
  B[0] = 1
  # Bell triangle rows
  row = [1]
  for i from 1 to n:
    new_row = [row[-1]]
    for j from 0 to i-1:
      new_row.append(new_row[-1] + row[j])
    row = new_row
    B[i] = row[0]
  return B`,
    python: `def bell_numbers(n):
    B = [0] * (n + 1)
    row = [1]
    B[0] = 1
    for i in range(1, n + 1):
        new_row = [row[-1]]
        for j in range(len(row)):
            new_row.append(new_row[-1] + row[j])
        row = new_row
        B[i] = row[0]
    return B`,
    javascript: `function bellNumbers(n) {
  const B = [1];
  let row = [1];
  for (let i = 1; i <= n; i++) {
    const newRow = [row[row.length - 1]];
    for (let j = 0; j < row.length; j++)
      newRow.push(newRow[newRow.length - 1] + row[j]);
    row = newRow;
    B.push(row[0]);
  }
  return B;
}`,
    java: `public long[] bellNumbers(int n) {
    long[] B = new long[n + 1];
    long[] row = {1};
    B[0] = 1;
    for (int i = 1; i <= n; i++) {
        long[] newRow = new long[i + 1];
        newRow[0] = row[row.length - 1];
        for (int j = 0; j < row.length; j++)
            newRow[j+1] = newRow[j] + row[j];
        row = newRow;
        B[i] = row[0];
    }
    return B;
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
      helperText: 'Compute Bell numbers B(0)..B(n), n <= 10',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(input.n as number, 10);
    const steps: AlgorithmStep[] = [];
    const B: number[] = [1];
    let row: number[] = [1];

    const makeViz = (bells: number[], activeIdx: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < bells.length; i++) {
        labels[i] = `B(${i})`;
        if (i === activeIdx) highlights[i] = 'active';
        else highlights[i] = 'found';
      }
      return { type: 'array', array: bells.slice(), highlights, labels };
    };

    steps.push({
      line: 1,
      explanation: `Compute Bell numbers using Bell triangle. B(0)=1.`,
      variables: { n, B0: 1 },
      visualization: makeViz(B, 0),
    });

    for (let i = 1; i <= n; i++) {
      const newRow: number[] = [row[row.length - 1]];
      steps.push({
        line: 5,
        explanation: `Row ${i}: start with last element of previous row = ${newRow[0]}.`,
        variables: { row: i, start: newRow[0] },
        visualization: {
          type: 'array',
          array: [...newRow, ...row],
          highlights: { 0: 'active', ...Object.fromEntries(row.map((_, j) => [j + 1, 'comparing'])) },
          labels: { 0: 'new[0]', ...Object.fromEntries(row.map((_, j) => [j + 1, `prev[${j}]`])) },
        },
      });
      for (let j = 0; j < row.length; j++) {
        newRow.push(newRow[newRow.length - 1] + row[j]);
        steps.push({
          line: 7,
          explanation: `Row ${i}[${j+1}] = ${newRow[newRow.length-2]} + ${row[j]} = ${newRow[newRow.length-1]}.`,
          variables: { i, j, newVal: newRow[newRow.length - 1] },
          visualization: {
            type: 'array',
            array: newRow.slice(),
            highlights: { [newRow.length - 1]: 'active', ...Object.fromEntries(newRow.slice(0,-1).map((_,k) => [k,'found'])) },
            labels: Object.fromEntries(newRow.map((_, k) => [k, `r${i}[${k}]`])),
          },
        });
      }
      row = newRow;
      B.push(row[0]);
      steps.push({
        line: 8,
        explanation: `B(${i}) = row[0] = ${row[0]}. Bell numbers so far: [${B.join(', ')}].`,
        variables: { i, bellNumber: row[0], B: [...B] },
        visualization: makeViz(B, i),
      });
    }

    steps.push({
      line: 9,
      explanation: `Bell numbers B(0)..B(${n}): [${B.join(', ')}].`,
      variables: { B: [...B] },
      visualization: makeViz(B, n),
    });

    return steps;
  },
};

export default bellNumbersVisualization;
