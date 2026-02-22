import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pascalsTriangleII: AlgorithmDefinition = {
  id: 'pascals-triangle-ii',
  title: "Pascal's Triangle II",
  leetcodeNumber: 119,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    "Return the rowIndex-th (0-indexed) row of Pascal's Triangle. Space-optimized: maintain a single row array. Update right-to-left (or use a new array) to avoid overwriting values needed for the current computation. O(n) space, O(n²) time.",
  tags: ['Dynamic Programming', 'Array', 'Math'],
  code: {
    pseudocode: `function getRow(rowIndex):
  row = [1]
  for i from 1 to rowIndex:
    newRow = [1]
    for j from 1 to i-1:
      newRow.append(row[j-1] + row[j])
    newRow.append(1)
    row = newRow
  return row`,
    python: `def getRow(rowIndex: int):
    row = [1]
    for i in range(1, rowIndex+1):
        row = [1] + [row[j-1]+row[j] for j in range(1,i)] + [1]
    return row`,
    javascript: `function getRow(rowIndex) {
  let row = [1];
  for (let i = 1; i <= rowIndex; i++) {
    const newRow = [1];
    for (let j = 1; j < i; j++) newRow.push(row[j-1]+row[j]);
    newRow.push(1);
    row = newRow;
  }
  return row;
}`,
    java: `public List<Integer> getRow(int rowIndex) {
    List<Integer> row = new ArrayList<>(); row.add(1);
    for (int i=1; i<=rowIndex; i++) {
        List<Integer> newRow = new ArrayList<>(); newRow.add(1);
        for (int j=1; j<i; j++) newRow.add(row.get(j-1)+row.get(j));
        newRow.add(1); row=newRow;
    }
    return row;
}`,
  },
  defaultInput: { rowIndex: 5 },
  inputFields: [
    {
      name: 'rowIndex',
      label: 'Row Index',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: '0-indexed row of Pascal\'s Triangle to return',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rowIndex = input.rowIndex as number;
    const steps: AlgorithmStep[] = [];

    let row = [1];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: { label: "Pascal's Triangle Row", entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `getRow(${rowIndex}): Build Pascal's Triangle row by row. Start: row 0 = [1].`,
      variables: { rowIndex, row: [...row] },
      visualization: makeViz(
        row,
        {},
        { 0: '1' },
        [{ key: 'Current Row', value: '0' }, { key: 'Values', value: '[1]' }],
      ),
    });

    for (let i = 1; i <= rowIndex; i++) {
      const newRow = [1];
      for (let j = 1; j < i; j++) {
        const val = row[j - 1] + row[j];
        newRow.push(val);

        steps.push({
          line: 5,
          explanation: `Row ${i}, position ${j}: ${row[j-1]} + ${row[j]} = ${val}.`,
          variables: { row: i, pos: j, left: row[j - 1], right: row[j], val },
          visualization: makeViz(
            row,
            { [j - 1]: 'comparing', [j]: 'comparing' },
            Object.fromEntries(row.map((v, k) => [k, String(v)])),
            [{ key: `Row ${i}`, value: `[${newRow.join(',')}...]` }, { key: 'Computing', value: `${row[j-1]}+${row[j]}=${val}` }],
          ),
        });
      }
      newRow.push(1);
      row = newRow;

      steps.push({
        line: 7,
        explanation: `Row ${i} complete: [${row.join(',')}].`,
        variables: { currentRow: i, row: [...row] },
        visualization: makeViz(
          row,
          Object.fromEntries(row.map((_, k) => [k, k === 0 || k === row.length - 1 ? 'sorted' : 'active'])),
          Object.fromEntries(row.map((v, k) => [k, String(v)])),
          [{ key: 'Row', value: String(i) }, { key: 'Values', value: row.join(',') }],
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `Done! Row ${rowIndex} of Pascal's Triangle: [${row.join(',')}].`,
      variables: { result: row },
      visualization: makeViz(
        row,
        Object.fromEntries(row.map((_, k) => [k, 'found'])),
        Object.fromEntries(row.map((v, k) => [k, String(v)])),
        [{ key: 'Answer', value: row.join(',') }],
      ),
    });

    return steps;
  },
};

export default pascalsTriangleII;
