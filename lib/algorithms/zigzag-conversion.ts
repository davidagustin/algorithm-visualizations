import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zigzagConversion: AlgorithmDefinition = {
  id: 'zigzag-conversion',
  title: 'Zigzag Conversion',
  leetcodeNumber: 6,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Write the string in a zigzag pattern on a given number of rows, then read off row by row. Simulate the pattern by tracking the current row and direction (going down or going up). Characters are placed into row buckets and concatenated at the end.',
  tags: ['String', 'Simulation'],
  code: {
    pseudocode: `function convert(s, numRows):
  if numRows == 1: return s
  rows = array of numRows empty strings
  row, direction = 0, 1
  for each char c in s:
    rows[row] += c
    if row == 0: direction = 1
    if row == numRows-1: direction = -1
    row += direction
  return join(rows)`,
    python: `def convert(s, numRows):
    if numRows == 1: return s
    rows = [''] * numRows
    row, direction = 0, 1
    for c in s:
        rows[row] += c
        if row == 0: direction = 1
        elif row == numRows - 1: direction = -1
        row += direction
    return ''.join(rows)`,
    javascript: `function convert(s, numRows) {
  if (numRows === 1) return s;
  const rows = Array.from({length: numRows}, () => '');
  let row = 0, dir = 1;
  for (const c of s) {
    rows[row] += c;
    if (row === 0) dir = 1;
    else if (row === numRows - 1) dir = -1;
    row += dir;
  }
  return rows.join('');
}`,
    java: `public String convert(String s, int numRows) {
    if (numRows == 1) return s;
    StringBuilder[] rows = new StringBuilder[numRows];
    for (int i=0;i<numRows;i++) rows[i]=new StringBuilder();
    int row = 0, dir = 1;
    for (char c : s.toCharArray()) {
        rows[row].append(c);
        if (row == 0) dir = 1;
        else if (row == numRows - 1) dir = -1;
        row += dir;
    }
    StringBuilder res = new StringBuilder();
    for (StringBuilder r : rows) res.append(r);
    return res.toString();
}`,
  },
  defaultInput: { s: 'PAYPALISHIRING', numRows: 3 },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'PAYPALISHIRING',
      placeholder: 'e.g. PAYPALISHIRING',
      helperText: 'Input string to convert',
    },
    {
      name: 'numRows',
      label: 'Number of Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Number of rows for zigzag pattern',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const numRows = input.numRows as number;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    const arr = chars.map(c => c.charCodeAt(0));

    if (numRows === 1) {
      steps.push({
        line: 1,
        explanation: `numRows=1, so the zigzag is just the string itself. Return "${s}".`,
        variables: { result: s },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(arr.map((_, k) => [k, 'found'])),
          labels: Object.fromEntries(chars.map((c, k) => [k, c])),
          auxData: { label: 'Result', entries: [{ key: 'Output', value: s }] },
        },
      });
      return steps;
    }

    const rows: string[] = Array.from({ length: numRows }, () => '');
    let row = 0;
    let dir = 1;

    steps.push({
      line: 2,
      explanation: `Convert "${s}" into ${numRows}-row zigzag. Initialize ${numRows} row buckets, start at row 0 going down.`,
      variables: { numRows, rows: [...rows] },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(chars.map((c, k) => [k, c])),
        auxData: {
          label: 'Zigzag Setup',
          entries: rows.map((_, k) => ({ key: `Row ${k}`, value: '(empty)' })),
        },
      },
    });

    for (let k = 0; k < chars.length; k++) {
      const c = chars[k];
      rows[row] += c;

      steps.push({
        line: 5,
        explanation: `Place '${c}' in row ${row}. Direction: ${dir === 1 ? 'down' : 'up'}.`,
        variables: { char: c, row, dir, rows: [...rows] },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(
            chars.map((_, j) => [
              j,
              j < k ? 'sorted' : j === k ? 'active' : 'default',
            ]),
          ),
          labels: Object.fromEntries(chars.map((ch, j) => [j, ch])),
          auxData: {
            label: 'Zigzag Fill',
            entries: [
              { key: 'Current row', value: String(row) },
              { key: 'Direction', value: dir === 1 ? 'down ↓' : 'up ↑' },
              ...rows.map((r, i) => ({ key: `Row ${i}`, value: r || '(empty)' })),
            ],
          },
        },
      });

      if (row === 0) dir = 1;
      else if (row === numRows - 1) dir = -1;
      row += dir;
    }

    const result = rows.join('');

    steps.push({
      line: 8,
      explanation: `All characters placed. Concatenate rows: "${rows.join('" + "')}" = "${result}".`,
      variables: { result, rows: [...rows] },
      visualization: {
        type: 'array',
        array: result.split('').map(c => c.charCodeAt(0)),
        highlights: Object.fromEntries(result.split('').map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(result.split('').map((c, k) => [k, c])),
        auxData: {
          label: 'Result',
          entries: [
            ...rows.map((r, i) => ({ key: `Row ${i}`, value: r })),
            { key: 'Output', value: result },
          ],
        },
      },
    });

    return steps;
  },
};

export default zigzagConversion;
