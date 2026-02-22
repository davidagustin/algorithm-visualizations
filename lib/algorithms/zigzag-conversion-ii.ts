import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zigzagConversionIi: AlgorithmDefinition = {
  id: 'zigzag-conversion-ii',
  title: 'Zigzag Conversion',
  leetcodeNumber: 6,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Write a string in a zigzag pattern across numRows rows, then read row by row. Use an array of row strings and a direction flag: add each character to the current row, flip direction at top/bottom rows.',
  tags: ['string', 'simulation', 'zigzag', 'row traversal'],
  code: {
    pseudocode: `function convert(s, numRows):
  if numRows == 1: return s
  rows = [""] * numRows
  row = 0, going_down = False
  for c in s:
    rows[row] += c
    if row == 0 or row == numRows-1:
      going_down = not going_down
    row += 1 if going_down else -1
  return "".join(rows)`,
    python: `def convert(s: str, numRows: int) -> str:
    if numRows == 1:
        return s
    rows = [''] * numRows
    row, going_down = 0, False
    for c in s:
        rows[row] += c
        if row == 0 or row == numRows - 1:
            going_down = not going_down
        row += 1 if going_down else -1
    return ''.join(rows)`,
    javascript: `function convert(s, numRows) {
  if (numRows === 1) return s;
  const rows = Array(numRows).fill('');
  let row = 0, goingDown = false;
  for (const c of s) {
    rows[row] += c;
    if (row === 0 || row === numRows - 1) goingDown = !goingDown;
    row += goingDown ? 1 : -1;
  }
  return rows.join('');
}`,
    java: `public String convert(String s, int numRows) {
    if (numRows == 1) return s;
    StringBuilder[] rows = new StringBuilder[numRows];
    for (int i = 0; i < numRows; i++) rows[i] = new StringBuilder();
    int row = 0; boolean goingDown = false;
    for (char c : s.toCharArray()) {
        rows[row].append(c);
        if (row == 0 || row == numRows - 1) goingDown = !goingDown;
        row += goingDown ? 1 : -1;
    }
    StringBuilder res = new StringBuilder();
    for (StringBuilder r : rows) res.append(r);
    return res.toString();
}`,
  },
  defaultInput: { s: 'PAYPALISHIRING', numRows: 3 },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'PAYPALISHIRING', placeholder: 'PAYPALISHIRING', helperText: 'Input string' },
    { name: 'numRows', label: 'Number of Rows', type: 'number', defaultValue: 3, placeholder: '3', helperText: 'Number of zigzag rows' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const numRows = input.numRows as number;
    const steps: AlgorithmStep[] = [];

    if (numRows === 1) {
      steps.push({
        line: 2,
        explanation: `numRows=1: no zigzag, return the string as-is: "${s}".`,
        variables: { result: s },
        visualization: {
          type: 'array',
          array: Array.from({ length: s.length }, (_, x) => x),
          highlights: {},
          labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    const rows: string[] = new Array(numRows).fill('');
    let row = 0, goingDown = false;

    const makeViz = (charIdx: number, row: number, rows: string[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (charIdx < s.length) highlights[charIdx] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < s.length; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: Array.from({ length: s.length }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: `Zigzag (${numRows} rows)`,
          entries: [
            { key: 'current row', value: String(row) },
            { key: 'direction', value: goingDown ? 'down' : 'up' },
            ...rows.map((r, i) => ({ key: `row ${i}`, value: `"${r}"` })),
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Zigzag "${s}" across ${numRows} rows. Track current row and direction.`,
      variables: { s, numRows },
      visualization: makeViz(-1, 0, [...rows]),
    });

    for (let i = 0; i < s.length; i++) {
      rows[row] += s[i];
      if (row === 0 || row === numRows - 1) goingDown = !goingDown;
      const nextRow = row + (goingDown ? 1 : -1);

      steps.push({
        line: 5,
        explanation: `Char '${s[i]}' -> row ${row}. ${row === 0 ? 'Top row - flip to down.' : row === numRows - 1 ? 'Bottom row - flip to up.' : `Continue ${goingDown ? 'down' : 'up'}.`} Next row: ${nextRow}.`,
        variables: { char: s[i], row, goingDown, rows: rows.map(r => `"${r}"`) },
        visualization: makeViz(i, row, [...rows]),
      });

      row += goingDown ? 1 : -1;
    }

    const result = rows.join('');
    steps.push({
      line: 9,
      explanation: `Read rows: ${rows.map((r, i) => `row${i}="${r}"`).join(', ')}. Result: "${result}".`,
      variables: { rows: [...rows], result },
      visualization: makeViz(-1, 0, [...rows]),
    });

    return steps;
  },
};

export default zigzagConversionIi;
