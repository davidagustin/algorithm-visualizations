import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addBinary: AlgorithmDefinition = {
  id: 'add-binary',
  title: 'Add Binary',
  leetcodeNumber: 67,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given two binary strings a and b, return their sum as a binary string. Use two pointers starting from the right ends of both strings, add bit by bit with a carry, and prepend each resulting bit to the output. Time complexity O(max(n, m)).',
  tags: ['Math', 'String', 'Bit Manipulation'],
  code: {
    pseudocode: `function addBinary(a, b):
  result = ""
  carry = 0
  i = len(a) - 1, j = len(b) - 1
  while i >= 0 or j >= 0 or carry:
    sum = carry
    if i >= 0: sum += a[i]; i--
    if j >= 0: sum += b[j]; j--
    result = (sum % 2) + result
    carry = sum / 2
  return result`,
    python: `def addBinary(a, b):
    result = ""
    carry = 0
    i, j = len(a) - 1, len(b) - 1
    while i >= 0 or j >= 0 or carry:
        s = carry
        if i >= 0:
            s += int(a[i]); i -= 1
        if j >= 0:
            s += int(b[j]); j -= 1
        result = str(s % 2) + result
        carry = s // 2
    return result`,
    javascript: `function addBinary(a, b) {
  let result = "", carry = 0;
  let i = a.length - 1, j = b.length - 1;
  while (i >= 0 || j >= 0 || carry) {
    let sum = carry;
    if (i >= 0) sum += parseInt(a[i--]);
    if (j >= 0) sum += parseInt(b[j--]);
    result = (sum % 2) + result;
    carry = Math.floor(sum / 2);
  }
  return result;
}`,
    java: `public String addBinary(String a, String b) {
    StringBuilder res = new StringBuilder();
    int carry = 0, i = a.length()-1, j = b.length()-1;
    while (i >= 0 || j >= 0 || carry != 0) {
        int sum = carry;
        if (i >= 0) sum += a.charAt(i--) - '0';
        if (j >= 0) sum += b.charAt(j--) - '0';
        res.insert(0, sum % 2);
        carry = sum / 2;
    }
    return res.toString();
}`,
  },
  defaultInput: { a: '1010', b: '1011' },
  inputFields: [
    {
      name: 'a',
      label: 'Binary String A',
      type: 'string',
      defaultValue: '1010',
      placeholder: 'e.g. 1010',
      helperText: 'First binary string (only 0s and 1s)',
    },
    {
      name: 'b',
      label: 'Binary String B',
      type: 'string',
      defaultValue: '1011',
      placeholder: 'e.g. 1011',
      helperText: 'Second binary string (only 0s and 1s)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const a = input.a as string;
    const b = input.b as string;
    const steps: AlgorithmStep[] = [];

    // Use char codes as array values (display '0'=48 '1'=49 is ugly, so use 0/1 integers)
    const aDigits = a.split('').map(Number);
    const bDigits = b.split('').map(Number);

    const makeViz = (
      iIdx: number,
      jIdx: number,
      resultSoFar: string,
      carry: number,
      action: string,
    ): ArrayVisualization => {
      // Show 'a' array with i pointer, then 'b' array with j pointer
      // Flatten: a digits followed by b digits
      const arr = [...aDigits, ...bDigits];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < aDigits.length; k++) highlights[k] = 'default';
      for (let k = 0; k < bDigits.length; k++) highlights[aDigits.length + k] = 'default';

      if (iIdx >= 0) {
        highlights[iIdx] = 'active';
        labels[iIdx] = 'i';
      }
      if (jIdx >= 0) {
        highlights[aDigits.length + jIdx] = 'comparing';
        labels[aDigits.length + jIdx] = 'j';
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Binary Addition',
          entries: [
            { key: 'a', value: a },
            { key: 'b', value: b },
            { key: 'Carry', value: String(carry) },
            { key: 'Result so far', value: resultSoFar || '(empty)' },
            { key: 'Action', value: action },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Add binary strings "${a}" + "${b}". Use two pointers from right to left with carry.`,
      variables: { a, b },
      visualization: makeViz(aDigits.length - 1, bDigits.length - 1, '', 0, 'Initialize'),
    });

    let result = '';
    let carry = 0;
    let i = aDigits.length - 1;
    let j = bDigits.length - 1;

    steps.push({
      line: 3,
      explanation: `Initialize carry=0, i=${i} (rightmost of a), j=${j} (rightmost of b).`,
      variables: { carry, i, j },
      visualization: makeViz(i, j, result, carry, 'Start'),
    });

    while (i >= 0 || j >= 0 || carry) {
      let sum = carry;
      const bitA = i >= 0 ? aDigits[i] : null;
      const bitB = j >= 0 ? bDigits[j] : null;

      if (i >= 0) sum += aDigits[i];
      if (j >= 0) sum += bDigits[j];

      const bit = sum % 2;
      const newCarry = Math.floor(sum / 2);
      result = String(bit) + result;

      steps.push({
        line: 6,
        explanation: `a[${i}]=${bitA ?? 0}, b[${j}]=${bitB ?? 0}, carry=${carry}. sum=${sum}. Prepend bit=${bit}, new carry=${newCarry}. Result: "${result}".`,
        variables: { i, j, bitA: bitA ?? 0, bitB: bitB ?? 0, carry, sum, bit, newCarry, result },
        visualization: makeViz(
          i >= 0 ? i : -1,
          j >= 0 ? j : -1,
          result,
          newCarry,
          `sum=${sum} → bit=${bit}, carry=${newCarry}`,
        ),
      });

      carry = newCarry;
      i--;
      j--;
    }

    steps.push({
      line: 9,
      explanation: `Loop complete. Final binary sum: "${result}".`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result.split('').map(Number),
        highlights: Object.fromEntries(result.split('').map((_, k) => [k, 'found'])),
        labels: {},
        auxData: {
          label: 'Result',
          entries: [
            { key: 'a', value: a },
            { key: 'b', value: b },
            { key: 'Sum', value: result },
          ],
        },
      },
    });

    return steps;
  },
};

export default addBinary;
