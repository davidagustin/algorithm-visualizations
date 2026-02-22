import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const romanToInteger: AlgorithmDefinition = {
  id: 'roman-to-integer',
  title: 'Roman to Integer',
  leetcodeNumber: 13,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Convert a Roman numeral string to an integer. Roman numerals use symbols I=1, V=5, X=10, L=50, C=100, D=500, M=1000. If a smaller value appears before a larger one (e.g. IV=4, IX=9), subtract it. Otherwise add it. Traverse left to right comparing each symbol with the next.',
  tags: ['Math', 'String', 'Hash Map'],
  code: {
    pseudocode: `function romanToInt(s):
  values = {I:1, V:5, X:10, L:50, C:100, D:500, M:1000}
  total = 0
  for i from 0 to len(s)-1:
    if i+1 < len(s) and values[s[i]] < values[s[i+1]]:
      total -= values[s[i]]
    else:
      total += values[s[i]]
  return total`,
    python: `def romanToInt(s):
    values = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    total = 0
    for i in range(len(s)):
        if i+1 < len(s) and values[s[i]] < values[s[i+1]]:
            total -= values[s[i]]
        else:
            total += values[s[i]]
    return total`,
    javascript: `function romanToInt(s) {
  const val = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && val[s[i]] < val[s[i+1]]) {
      total -= val[s[i]];
    } else {
      total += val[s[i]];
    }
  }
  return total;
}`,
    java: `public int romanToInt(String s) {
    Map<Character,Integer> map = new HashMap<>();
    map.put('I',1); map.put('V',5); map.put('X',10);
    map.put('L',50); map.put('C',100); map.put('D',500); map.put('M',1000);
    int total = 0;
    for (int i = 0; i < s.length(); i++) {
        if (i+1<s.length() && map.get(s.charAt(i)) < map.get(s.charAt(i+1)))
            total -= map.get(s.charAt(i));
        else
            total += map.get(s.charAt(i));
    }
    return total;
}`,
  },
  defaultInput: { s: 'MCMXCIV' },
  inputFields: [
    {
      name: 's',
      label: 'Roman Numeral',
      type: 'string',
      defaultValue: 'MCMXCIV',
      placeholder: 'e.g. III, IV, MCMXCIV',
      helperText: 'Valid Roman numeral string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const romanValues: Record<string, number> = {
      I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000,
    };

    const chars = s.split('');
    // Use char codes relative to 'A' for visualization array
    const arr = chars.map(c => romanValues[c] ?? 0);

    const makeViz = (
      idx: number,
      total: number,
      action: 'add' | 'subtract' | 'none',
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < chars.length; k++) {
        if (k < idx) {
          highlights[k] = 'sorted';
        } else if (k === idx) {
          highlights[k] = action === 'add' ? 'active' : action === 'subtract' ? 'comparing' : 'active';
          labels[k] = chars[k];
        } else if (k === idx + 1 && action === 'subtract') {
          highlights[k] = 'pointer';
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
          label: 'Roman to Integer',
          entries: [
            { key: 'String', value: s },
            { key: 'Running Total', value: String(total) },
            { key: 'Action', value: action === 'none' ? 'Start' : action === 'add' ? `+${arr[idx]}` : `-${arr[idx]}` },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Convert Roman numeral "${s}" to integer. Values: I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Subtract when a smaller symbol precedes a larger one.`,
      variables: { s },
      visualization: makeViz(-1, 0, 'none'),
    });

    let total = 0;

    for (let i = 0; i < chars.length; i++) {
      const curVal = romanValues[chars[i]] ?? 0;
      const nextVal = i + 1 < chars.length ? (romanValues[chars[i + 1]] ?? 0) : 0;

      if (curVal < nextVal) {
        steps.push({
          line: 5,
          explanation: `'${chars[i]}'=${curVal} < '${chars[i + 1]}'=${nextVal}. Subtract: total = ${total} - ${curVal} = ${total - curVal}.`,
          variables: { i, char: chars[i], curVal, nextChar: chars[i + 1], nextVal, total: total - curVal },
          visualization: makeViz(i, total - curVal, 'subtract'),
        });
        total -= curVal;
      } else {
        steps.push({
          line: 7,
          explanation: `'${chars[i]}'=${curVal}${nextVal > 0 ? ` >= '${chars[i + 1]}'=${nextVal}` : ' (last char)'}. Add: total = ${total} + ${curVal} = ${total + curVal}.`,
          variables: { i, char: chars[i], curVal, total: total + curVal },
          visualization: makeViz(i, total + curVal, 'add'),
        });
        total += curVal;
      }
    }

    steps.push({
      line: 8,
      explanation: `All characters processed. "${s}" = ${total}.`,
      variables: { result: total },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(arr.map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(chars.map((c, k) => [k, c])),
        auxData: {
          label: 'Result',
          entries: [
            { key: 'Roman', value: s },
            { key: 'Integer', value: String(total) },
          ],
        },
      },
    });

    return steps;
  },
};

export default romanToInteger;
