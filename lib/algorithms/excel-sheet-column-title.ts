import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const excelSheetColumnTitle: AlgorithmDefinition = {
  id: 'excel-sheet-column-title',
  title: 'Excel Sheet Column Title',
  leetcodeNumber: 168,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an integer column number, return its corresponding Excel sheet column title. This is the reverse of base-26 conversion: repeatedly take (n-1) mod 26 to get the character, then divide by 26. Note: must use (n-1) since A=1 not 0.',
  tags: ['math', 'string'],

  code: {
    pseudocode: `function convertToTitle(n):
  result = ""
  while n > 0:
    n -= 1
    result = chr(n % 26 + ord('A')) + result
    n = floor(n / 26)
  return result`,

    python: `def convertToTitle(n: int) -> str:
    result = ""
    while n > 0:
        n -= 1
        result = chr(n % 26 + ord('A')) + result
        n //= 26
    return result`,

    javascript: `function convertToTitle(n) {
  let result = '';
  while (n > 0) {
    n -= 1;
    result = String.fromCharCode(n % 26 + 65) + result;
    n = Math.floor(n / 26);
  }
  return result;
}`,

    java: `public String convertToTitle(int n) {
    StringBuilder sb = new StringBuilder();
    while (n > 0) {
        n--;
        sb.append((char)('A' + n % 26));
        n /= 26;
    }
    return sb.reverse().toString();
}`,
  },

  defaultInput: { n: 701 },

  inputFields: [
    { name: 'n', label: 'Column Number', type: 'number', defaultValue: 701, placeholder: '701', helperText: 'Column number (1=A, 26=Z, 27=AA, 701=ZY)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const chars: string[] = [];
    const values: number[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Convert column number ${n} to Excel title. Repeatedly take (n-1) mod 26 to find each character.`,
      variables: { n, result: '' },
      visualization: makeViz([n], { 0: 'active' }, { 0: 'n' }),
    });

    let iteration = 0;
    while (n > 0 && iteration < 10) {
      iteration++;
      n -= 1;
      const charCode = n % 26;
      const char = String.fromCharCode(charCode + 65);
      chars.unshift(char);
      values.unshift(charCode + 1);
      n = Math.floor(n / 26);

      steps.push({
        line: 3,
        explanation: `n-1 = ${n + charCode + Math.floor((n + charCode) / 26) * 25}... charCode = ${charCode} → '${char}'. n = ${n}. result = "${chars.join('')}".`,
        variables: { n, charCode, char, result: chars.join('') },
        visualization: makeViz(
          values,
          Object.fromEntries(values.map((_, i) => [i, i === 0 ? 'active' : 'found'])),
          Object.fromEntries(chars.map((c, i) => [i, c]))
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `n = 0. Final column title: "${chars.join('')}".`,
      variables: { result: chars.join('') },
      visualization: makeViz(
        values,
        Object.fromEntries(values.map((_, i) => [i, 'found'])),
        Object.fromEntries(chars.map((c, i) => [i, c]))
      ),
    });

    return steps;
  },
};

export default excelSheetColumnTitle;
