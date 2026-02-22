import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const excelSheetColumnNumber: AlgorithmDefinition = {
  id: 'excel-sheet-column-number',
  title: 'Excel Sheet Column Number',
  leetcodeNumber: 171,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Convert an Excel column title (like "A", "Z", "AA", "AB") to its corresponding column number. This is essentially a base-26 number system where A=1, B=2, ..., Z=26, AA=27, etc. For each character, multiply the running total by 26 and add the character\'s value.',
  tags: ['Math', 'String'],
  code: {
    pseudocode: `function titleToNumber(columnTitle):
  result = 0
  for each char c in columnTitle:
    result = result * 26 + (c - 'A' + 1)
  return result`,
    python: `def titleToNumber(columnTitle):
    result = 0
    for c in columnTitle:
        result = result * 26 + (ord(c) - ord('A') + 1)
    return result`,
    javascript: `function titleToNumber(columnTitle) {
  let result = 0;
  for (const c of columnTitle) {
    result = result * 26 + (c.charCodeAt(0) - 64);
  }
  return result;
}`,
    java: `public int titleToNumber(String columnTitle) {
    int result = 0;
    for (char c : columnTitle.toCharArray()) {
        result = result * 26 + (c - 'A' + 1);
    }
    return result;
}`,
  },
  defaultInput: { columnTitle: 'AZYX' },
  inputFields: [
    {
      name: 'columnTitle',
      label: 'Column Title',
      type: 'string',
      defaultValue: 'AZYX',
      placeholder: 'e.g. A, Z, AA, AB',
      helperText: 'Excel column title (uppercase letters only)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const columnTitle = (input.columnTitle as string).toUpperCase();
    const steps: AlgorithmStep[] = [];
    const chars = columnTitle.split('');

    const makeViz = (
      activeIdx: number,
      result: number,
      charVal: number | null,
    ): ArrayVisualization => {
      // Show char values (A=1, B=2 ... Z=26)
      const arr = chars.map(c => c.charCodeAt(0) - 64);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < chars.length; k++) {
        if (k < activeIdx) {
          highlights[k] = 'sorted';
        } else if (k === activeIdx) {
          highlights[k] = 'active';
          labels[k] = chars[k];
        } else {
          highlights[k] = 'default';
          labels[k] = chars[k];
        }
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Column Conversion',
          entries: [
            { key: 'Title', value: columnTitle },
            { key: 'Running Result', value: String(result) },
            ...(charVal !== null ? [{ key: 'Current Char Value', value: String(charVal) }] : []),
            { key: 'Formula', value: 'result = result * 26 + charValue' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Convert Excel column title "${columnTitle}" to number. Treat as base-26 where A=1, B=2, ..., Z=26.`,
      variables: { columnTitle },
      visualization: makeViz(-1, 0, null),
    });

    let result = 0;

    steps.push({
      line: 2,
      explanation: `Initialize result = 0. Process each character left to right.`,
      variables: { result },
      visualization: makeViz(-1, 0, null),
    });

    for (let k = 0; k < chars.length; k++) {
      const c = chars[k];
      const charVal = c.charCodeAt(0) - 64; // A=1, B=2, ..., Z=26
      const prevResult = result;
      result = result * 26 + charVal;

      steps.push({
        line: 3,
        explanation: `Character '${c}' has value ${charVal} (${c} - 'A' + 1 = ${charVal}). result = ${prevResult} * 26 + ${charVal} = ${result}.`,
        variables: { char: c, charVal, prevResult, result },
        visualization: makeViz(k, result, charVal),
      });
    }

    steps.push({
      line: 4,
      explanation: `All characters processed. "${columnTitle}" corresponds to column number ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: chars.map(c => c.charCodeAt(0) - 64),
        highlights: Object.fromEntries(chars.map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(chars.map((c, k) => [k, c])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Column Title', value: columnTitle },
            { key: 'Column Number', value: String(result) },
          ],
        },
      },
    });

    return steps;
  },
};

export default excelSheetColumnNumber;
