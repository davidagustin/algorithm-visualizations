import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const multiplyStringsIi: AlgorithmDefinition = {
  id: 'multiply-strings-ii',
  title: 'Multiply Strings',
  leetcodeNumber: 43,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Multiply two non-negative integers represented as strings without using BigInteger. For digits num1[i] and num2[j], their product contributes to result positions [i+j] and [i+j+1]. Process all digit pairs, then handle carries.',
  tags: ['string', 'math', 'multiplication', 'grade school'],
  code: {
    pseudocode: `function multiply(num1, num2):
  m = len(num1), n = len(num2)
  pos = [0] * (m + n)
  for i from m-1 down to 0:
    for j from n-1 down to 0:
      mul = (num1[i]-'0') * (num2[j]-'0')
      p1, p2 = i+j, i+j+1
      sum = mul + pos[p2]
      pos[p2] = sum % 10
      pos[p1] += sum // 10
  return trim leading zeros`,
    python: `def multiply(num1: str, num2: str) -> str:
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    for i in range(m - 1, -1, -1):
        for j in range(n - 1, -1, -1):
            mul = (ord(num1[i]) - 48) * (ord(num2[j]) - 48)
            p1, p2 = i + j, i + j + 1
            s = mul + pos[p2]
            pos[p2] = s % 10
            pos[p1] += s // 10
    result = ''.join(map(str, pos)).lstrip('0')
    return result or '0'`,
    javascript: `function multiply(num1, num2) {
  const m = num1.length, n = num2.length;
  const pos = new Array(m + n).fill(0);
  for (let i = m - 1; i >= 0; i--) {
    for (let j = n - 1; j >= 0; j--) {
      const mul = (num1[i] - '0') * (num2[j] - '0');
      const [p1, p2] = [i + j, i + j + 1];
      const sum = mul + pos[p2];
      pos[p2] = sum % 10;
      pos[p1] += Math.floor(sum / 10);
    }
  }
  return pos.join('').replace(/^0+/, '') || '0';
}`,
    java: `public String multiply(String num1, String num2) {
    int m = num1.length(), n = num2.length();
    int[] pos = new int[m + n];
    for (int i = m - 1; i >= 0; i--)
        for (int j = n - 1; j >= 0; j--) {
            int mul = (num1.charAt(i) - '0') * (num2.charAt(j) - '0');
            int p1 = i + j, p2 = i + j + 1;
            int sum = mul + pos[p2];
            pos[p2] = sum % 10;
            pos[p1] += sum / 10;
        }
    StringBuilder sb = new StringBuilder();
    for (int p : pos) if (!(sb.length() == 0 && p == 0)) sb.append(p);
    return sb.length() == 0 ? "0" : sb.toString();
}`,
  },
  defaultInput: { num1: '123', num2: '456' },
  inputFields: [
    { name: 'num1', label: 'Number 1', type: 'string', defaultValue: '123', placeholder: '123', helperText: 'First number as string' },
    { name: 'num2', label: 'Number 2', type: 'string', defaultValue: '456', placeholder: '456', helperText: 'Second number as string' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num1 = input.num1 as string;
    const num2 = input.num2 as string;
    const m = num1.length, n = num2.length;
    const steps: AlgorithmStep[] = [];
    const pos: number[] = new Array(m + n).fill(0);

    const makeViz = (i: number, j: number, pos: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const p1 = i + j, p2 = i + j + 1;
      if (p1 >= 0 && p1 < pos.length) highlights[p1] = 'active';
      if (p2 >= 0 && p2 < pos.length) highlights[p2] = 'comparing';
      const labels: Record<number, string> = {};
      for (let x = 0; x < pos.length; x++) labels[x] = String(pos[x]);
      return {
        type: 'array',
        array: [...pos],
        highlights,
        labels,
        auxData: {
          label: 'Multiply Strings',
          entries: [
            { key: 'num1[i]', value: i >= 0 && i < m ? num1[i] : '-' },
            { key: 'num2[j]', value: j >= 0 && j < n ? num2[j] : '-' },
            { key: 'product positions', value: i >= 0 && j >= 0 ? `${i + j}, ${i + j + 1}` : '-' },
            { key: 'pos array', value: pos.join('') },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Multiply "${num1}" x "${num2}". Create result array of size ${m + n}. Each digit pair contributes to two positions.`,
      variables: { num1, num2, m, n },
      visualization: makeViz(-1, -1, [...pos]),
    });

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        const d1 = num1.charCodeAt(i) - 48;
        const d2 = num2.charCodeAt(j) - 48;
        const mul = d1 * d2;
        const p1 = i + j, p2 = i + j + 1;
        const sum = mul + pos[p2];
        pos[p2] = sum % 10;
        pos[p1] += Math.floor(sum / 10);

        steps.push({
          line: 6,
          explanation: `num1[${i}]=${d1} x num2[${j}]=${d2} = ${mul}. pos[${p2}]=${pos[p2]}, carry ${Math.floor(sum / 10)} to pos[${p1}]=${pos[p1]}.`,
          variables: { i, j, d1, d2, mul, p1, p2, pos: [...pos] },
          visualization: makeViz(i, j, [...pos]),
        });
      }
    }

    const result = pos.join('').replace(/^0+/, '') || '0';
    steps.push({
      line: 9,
      explanation: `Result array: [${pos.join(', ')}]. Remove leading zeros: "${result}".`,
      variables: { result, posArray: [...pos] },
      visualization: makeViz(-1, -1, [...pos]),
    });

    return steps;
  },
};

export default multiplyStringsIi;
