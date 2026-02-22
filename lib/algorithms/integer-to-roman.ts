import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const integerToRoman: AlgorithmDefinition = {
  id: 'integer-to-roman',
  title: 'Integer to Roman',
  leetcodeNumber: 12,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Convert an integer to a Roman numeral string. Use a lookup table of values and symbols ordered from largest to smallest. Greedily subtract the largest possible value at each step, appending the corresponding symbol. Works for numbers 1 to 3999.',
  tags: ['Math', 'String', 'Greedy'],
  code: {
    pseudocode: `function intToRoman(num):
  vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
  result = ""
  for i from 0 to len(vals)-1:
    while num >= vals[i]:
      result += syms[i]
      num -= vals[i]
  return result`,
    python: `def intToRoman(num):
    vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
    syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
    result = ""
    for i in range(len(vals)):
        while num >= vals[i]:
            result += syms[i]
            num -= vals[i]
    return result`,
    javascript: `function intToRoman(num) {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"];
  let result = "";
  for (let i = 0; i < vals.length; i++) {
    while (num >= vals[i]) {
      result += syms[i];
      num -= vals[i];
    }
  }
  return result;
}`,
    java: `public String intToRoman(int num) {
    int[] vals = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
    String[] syms = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    StringBuilder res = new StringBuilder();
    for (int i = 0; i < vals.length; i++) {
        while (num >= vals[i]) {
            res.append(syms[i]);
            num -= vals[i];
        }
    }
    return res.toString();
}`,
  },
  defaultInput: { num: 1994 },
  inputFields: [
    {
      name: 'num',
      label: 'Integer',
      type: 'number',
      defaultValue: 1994,
      placeholder: 'e.g. 1994',
      helperText: 'Integer between 1 and 3999',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const originalNum = input.num as number;
    let num = originalNum;
    const steps: AlgorithmStep[] = [];

    const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const syms = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    const makeViz = (
      activeIdx: number,
      remaining: number,
      result: string,
    ): ArrayVisualization => ({
      type: 'array',
      array: vals,
      highlights: Object.fromEntries(
        vals.map((v, k) => [
          k,
          k === activeIdx ? 'active' : remaining < v ? 'visited' : 'default',
        ]),
      ),
      labels: Object.fromEntries(syms.map((s, k) => [k, s])),
      auxData: {
        label: 'Integer to Roman',
        entries: [
          { key: 'Original', value: String(originalNum) },
          { key: 'Remaining', value: String(remaining) },
          { key: 'Result so far', value: result || '(empty)' },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Convert ${originalNum} to Roman numeral. Greedily subtract largest possible values, appending their symbols.`,
      variables: { num },
      visualization: makeViz(-1, num, ''),
    });

    let result = '';

    for (let i = 0; i < vals.length; i++) {
      if (num < vals[i]) continue;

      steps.push({
        line: 5,
        explanation: `Check value ${vals[i]} (symbol "${syms[i]}"): remaining num=${num} >= ${vals[i]}.`,
        variables: { i, value: vals[i], symbol: syms[i], num },
        visualization: makeViz(i, num, result),
      });

      while (num >= vals[i]) {
        result += syms[i];
        num -= vals[i];

        steps.push({
          line: 6,
          explanation: `Append "${syms[i]}", subtract ${vals[i]}. Remaining = ${num}. Result = "${result}".`,
          variables: { symbol: syms[i], value: vals[i], remaining: num, result },
          visualization: makeViz(i, num, result),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `All values processed. ${originalNum} in Roman numerals is "${result}".`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result.split('').map(c => {
          const idx = syms.indexOf(c);
          return idx >= 0 ? vals[idx] : 0;
        }),
        highlights: Object.fromEntries(result.split('').map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(result.split('').map((c, k) => [k, c])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Integer', value: String(originalNum) },
            { key: 'Roman', value: result },
          ],
        },
      },
    });

    return steps;
  },
};

export default integerToRoman;
