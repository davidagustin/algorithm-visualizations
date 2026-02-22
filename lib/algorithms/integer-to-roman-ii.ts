import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const integerToRomanII: AlgorithmDefinition = {
  id: 'integer-to-roman-ii',
  title: 'Integer to Roman',
  leetcodeNumber: 12,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Convert an integer to a Roman numeral. Use a greedy approach with a table of values and symbols (including subtractive combinations like IV, IX). Repeatedly subtract the largest possible value and append the corresponding symbol.',
  tags: ['math', 'string', 'greedy'],

  code: {
    pseudocode: `function intToRoman(num):
  values = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
  symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
  result = ""
  for i from 0 to len(values)-1:
    while num >= values[i]:
      result += symbols[i]
      num -= values[i]
  return result`,

    python: `def intToRoman(num: int) -> str:
    values  = [1000,900,500,400,100,90,50,40,10,9,5,4,1]
    symbols = ["M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"]
    result = ""
    for i in range(len(values)):
        while num >= values[i]:
            result += symbols[i]
            num -= values[i]
    return result`,

    javascript: `function intToRoman(num) {
  const values  = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const symbols = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';
  for (let i = 0; i < values.length; i++) {
    while (num >= values[i]) {
      result += symbols[i];
      num -= values[i];
    }
  }
  return result;
}`,

    java: `public String intToRoman(int num) {
    int[] values = {1000,900,500,400,100,90,50,40,10,9,5,4,1};
    String[] symbols = {"M","CM","D","CD","C","XC","L","XL","X","IX","V","IV","I"};
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < values.length; i++) {
        while (num >= values[i]) {
            sb.append(symbols[i]);
            num -= values[i];
        }
    }
    return sb.toString();
}`,
  },

  defaultInput: { num: 1994 },

  inputFields: [
    { name: 'num', label: 'Integer', type: 'number', defaultValue: 1994, placeholder: '1994', helperText: 'Integer (1 to 3999) to convert to Roman numeral' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let num = input.num as number;
    const steps: AlgorithmStep[] = [];

    const values  = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Convert ${num} to Roman numeral. Greedy: subtract largest possible value at each step.`,
      variables: { num, result: '' },
      visualization: makeViz(values, Object.fromEntries(values.map((_, i) => [i, 'default'])), Object.fromEntries(symbols.map((s, i) => [i, s]))),
    });

    let result = '';
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i];
        num -= values[i];

        steps.push({
          line: 6,
          explanation: `num >= ${values[i]} (${symbols[i]}): append "${symbols[i]}", subtract ${values[i]}. num = ${num}, result = "${result}".`,
          variables: { num, result, symbol: symbols[i], value: values[i] },
          visualization: makeViz(
            values,
            Object.fromEntries(values.map((_, idx) => [idx, idx === i ? 'active' : 'default'])),
            Object.fromEntries(symbols.map((s, idx) => [idx, idx === i ? `${s}(${values[idx]})` : s]))
          ),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `num = 0. Result: "${result}".`,
      variables: { result },
      visualization: makeViz(
        result.split('').map(c => values[symbols.indexOf(c)] || 0),
        Object.fromEntries(result.split('').map((_, i) => [i, 'found'])),
        Object.fromEntries(result.split('').map((c, i) => [i, c]))
      ),
    });

    return steps;
  },
};

export default integerToRomanII;
