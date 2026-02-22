import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const pascalTriangleIi: AlgorithmDefinition = {
  id: 'pascal-triangle-ii',
  title: "Pascal's Triangle II",
  leetcodeNumber: 119,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an integer rowIndex, return the rowIndex-th (0-indexed) row of Pascal triangle. Each element is the sum of the two elements directly above it in the previous row. Optimize by updating the array in-place from right to left.',
  tags: ['array', 'dynamic programming', 'pascal triangle', 'math'],

  code: {
    pseudocode: `function getRow(rowIndex):
  row = [1]
  for i from 1 to rowIndex:
    for j from i-1 down to 1:
      row[j] = row[j] + row[j-1]
    row.append(1)
  return row`,

    python: `def getRow(rowIndex: int) -> list[int]:
    row = [1]
    for i in range(1, rowIndex + 1):
        for j in range(i - 1, 0, -1):
            row[j] = row[j] + row[j - 1]
        row.append(1)
    return row`,

    javascript: `function getRow(rowIndex) {
  const row = [1];
  for (let i = 1; i <= rowIndex; i++) {
    for (let j = i - 1; j >= 1; j--) {
      row[j] = row[j] + row[j - 1];
    }
    row.push(1);
  }
  return row;
}`,

    java: `public List<Integer> getRow(int rowIndex) {
    List<Integer> row = new ArrayList<>();
    row.add(1);
    for (int i = 1; i <= rowIndex; i++) {
        for (int j = i - 1; j >= 1; j--) {
            row.set(j, row.get(j) + row.get(j - 1));
        }
        row.add(1);
    }
    return row;
}`,
  },

  defaultInput: {
    rowIndex: 4,
  },

  inputFields: [
    {
      name: 'rowIndex',
      label: 'Row Index',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: '0-indexed row number of Pascal triangle',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rowIndex = input.rowIndex as number;
    const steps: AlgorithmStep[] = [];

    let row = [1];

    steps.push({
      line: 1,
      explanation: `Initialize row with [1]. We will build up to row index ${rowIndex}.`,
      variables: { row: JSON.stringify(row), rowIndex },
      visualization: {
        type: 'array',
        array: [...row],
        highlights: { 0: 'active' },
        labels: { 0: '1' },
      },
    });

    for (let i = 1; i <= rowIndex; i++) {
      steps.push({
        line: 3,
        explanation: `Building row ${i}. Current row: ${JSON.stringify(row)}.`,
        variables: { i, row: JSON.stringify(row) },
        visualization: {
          type: 'array',
          array: [...row],
          highlights: {},
          labels: {},
        },
      });

      for (let j = i - 1; j >= 1; j--) {
        const oldVal = row[j];
        const addVal = row[j - 1];
        row[j] = oldVal + addVal;

        steps.push({
          line: 4,
          explanation: `row[${j}] = ${oldVal} + ${addVal} = ${row[j]} (sum of two elements above).`,
          variables: { i, j, newVal: row[j], row: JSON.stringify(row) },
          visualization: {
            type: 'array',
            array: [...row],
            highlights: { [j]: 'comparing', [j - 1]: 'active' },
            labels: { [j]: `+${addVal}` },
          },
        });
      }

      row.push(1);

      steps.push({
        line: 6,
        explanation: `Append 1 to end of row. Row ${i} complete: ${JSON.stringify(row)}.`,
        variables: { i, row: JSON.stringify(row) },
        visualization: {
          type: 'array',
          array: [...row],
          highlights: { [row.length - 1]: 'found' },
          labels: { 0: '1', [row.length - 1]: '1' },
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `Row ${rowIndex} of Pascal triangle is ${JSON.stringify(row)}.`,
      variables: { result: JSON.stringify(row) },
      visualization: {
        type: 'array',
        array: [...row],
        highlights: Object.fromEntries(row.map((_, idx) => [idx, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default pascalTriangleIi;
