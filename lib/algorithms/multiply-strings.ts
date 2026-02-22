import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const multiplyStrings: AlgorithmDefinition = {
  id: 'multiply-strings',
  title: 'Multiply Strings',
  leetcodeNumber: 43,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Multiply two non-negative integers represented as strings without using BigInteger or built-in multiplication. Use grade-school multiplication: each digit of num1 multiplied by each digit of num2 is accumulated in an output array where pos[i+j] and pos[i+j+1] correspond to the product of nums1[i] and nums2[j]. O(m*n) time.',
  tags: ['Math', 'String', 'Array'],
  code: {
    pseudocode: `function multiply(num1, num2):
  m, n = len(num1), len(num2)
  pos = array of zeros, size m+n
  for i from m-1 down to 0:
    for j from n-1 down to 0:
      mul = (num1[i]-'0') * (num2[j]-'0')
      p1, p2 = i+j, i+j+1
      sum = mul + pos[p2]
      pos[p2] = sum % 10
      pos[p1] += sum / 10
  strip leading zeros and return`,
    python: `def multiply(num1, num2):
    m, n = len(num1), len(num2)
    pos = [0] * (m + n)
    for i in range(m-1, -1, -1):
        for j in range(n-1, -1, -1):
            mul = (ord(num1[i])-48) * (ord(num2[j])-48)
            p1, p2 = i+j, i+j+1
            s = mul + pos[p2]
            pos[p2] = s % 10
            pos[p1] += s // 10
    result = ''.join(map(str, pos)).lstrip('0')
    return result or '0'`,
    javascript: `function multiply(num1, num2) {
  const m = num1.length, n = num2.length;
  const pos = new Array(m + n).fill(0);
  for (let i = m-1; i >= 0; i--) {
    for (let j = n-1; j >= 0; j--) {
      const mul = (num1[i]-'0') * (num2[j]-'0');
      const p1 = i+j, p2 = i+j+1;
      const sum = mul + pos[p2];
      pos[p2] = sum % 10;
      pos[p1] += Math.floor(sum/10);
    }
  }
  return pos.join('').replace(/^0+/, '') || '0';
}`,
    java: `public String multiply(String num1, String num2) {
    int m=num1.length(), n=num2.length();
    int[] pos = new int[m+n];
    for (int i=m-1;i>=0;i--) for (int j=n-1;j>=0;j--) {
        int mul=(num1.charAt(i)-'0')*(num2.charAt(j)-'0');
        int p1=i+j, p2=i+j+1, sum=mul+pos[p2];
        pos[p2]=sum%10; pos[p1]+=sum/10;
    }
    StringBuilder sb = new StringBuilder();
    for (int p : pos) if (!(sb.length()==0 && p==0)) sb.append(p);
    return sb.length()==0 ? "0" : sb.toString();
}`,
  },
  defaultInput: { num1: '123', num2: '45' },
  inputFields: [
    {
      name: 'num1',
      label: 'Number 1',
      type: 'string',
      defaultValue: '123',
      placeholder: 'e.g. 123',
      helperText: 'First non-negative integer as string',
    },
    {
      name: 'num2',
      label: 'Number 2',
      type: 'string',
      defaultValue: '45',
      placeholder: 'e.g. 45',
      helperText: 'Second non-negative integer as string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num1 = input.num1 as string;
    const num2 = input.num2 as string;
    const steps: AlgorithmStep[] = [];
    const m = num1.length;
    const n = num2.length;
    const pos = new Array(m + n).fill(0);

    const makeViz = (
      activeP1: number,
      activeP2: number,
      i: number,
      j: number,
      action: string,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < pos.length; k++) {
        highlights[k] = k === activeP1 ? 'comparing' : k === activeP2 ? 'active' : 'default';
        labels[k] = `pos[${k}]`;
      }

      return {
        type: 'array',
        array: [...pos],
        highlights,
        labels,
        auxData: {
          label: 'Multiply Strings',
          entries: [
            { key: 'num1', value: num1 },
            { key: 'num2', value: num2 },
            { key: 'i, j', value: `${i}, ${j}` },
            { key: 'Action', value: action },
            { key: 'pos[]', value: `[${pos.join(', ')}]` },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Multiply "${num1}" × "${num2}" without built-in multiplication. Result has at most ${m + n} digits. Maintain pos[] array.`,
      variables: { num1, num2, m, n },
      visualization: makeViz(-1, -1, -1, -1, 'Initialize pos array of zeros'),
    });

    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        const d1 = parseInt(num1[i]);
        const d2 = parseInt(num2[j]);
        const mul = d1 * d2;
        const p1 = i + j;
        const p2 = i + j + 1;
        const sum = mul + pos[p2];

        steps.push({
          line: 5,
          explanation: `num1[${i}]=${d1} × num2[${j}]=${d2} = ${mul}. p1=${p1}, p2=${p2}. sum=${mul}+pos[${p2}]=${pos[p2]}=${sum}. pos[${p2}]=${sum % 10}, pos[${p1}]+=${Math.floor(sum / 10)}.`,
          variables: { i, j, d1, d2, mul, p1, p2, sum, carry: Math.floor(sum / 10) },
          visualization: makeViz(p1, p2, i, j, `${d1}×${d2}=${mul}`),
        });

        pos[p2] = sum % 10;
        pos[p1] += Math.floor(sum / 10);
      }
    }

    const resultStr = pos.join('').replace(/^0+/, '') || '0';

    steps.push({
      line: 9,
      explanation: `pos[] = [${pos.join(', ')}]. Strip leading zeros: "${resultStr}". ${num1} × ${num2} = ${resultStr}.`,
      variables: { result: resultStr },
      visualization: {
        type: 'array',
        array: [...pos],
        highlights: Object.fromEntries(pos.map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(pos.map((_, k) => [k, `pos[${k}]`])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'pos[]', value: `[${pos.join(', ')}]` },
            { key: `${num1} × ${num2}`, value: resultStr },
          ],
        },
      },
    });

    return steps;
  },
};

export default multiplyStrings;
