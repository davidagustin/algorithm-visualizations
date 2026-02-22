import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const romanToIntegerII: AlgorithmDefinition = {
  id: 'roman-to-integer-ii',
  title: 'Roman to Integer',
  leetcodeNumber: 13,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Convert a Roman numeral string to an integer. Scan left to right: if the current symbol is less than the next, subtract it; otherwise add it. Special cases include IV=4, IX=9, XL=40, XC=90, CD=400, CM=900.',
  tags: ['math', 'string', 'hash map'],

  code: {
    pseudocode: `function romanToInt(s):
  map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000}
  result = 0
  for i from 0 to len(s)-1:
    if i+1 < len(s) and map[s[i]] < map[s[i+1]]:
      result -= map[s[i]]
    else:
      result += map[s[i]]
  return result`,

    python: `def romanToInt(s: str) -> int:
    val = {'I':1,'V':5,'X':10,'L':50,'C':100,'D':500,'M':1000}
    result = 0
    for i in range(len(s)):
        if i + 1 < len(s) and val[s[i]] < val[s[i+1]]:
            result -= val[s[i]]
        else:
            result += val[s[i]]
    return result`,

    javascript: `function romanToInt(s) {
  const val = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000};
  let result = 0;
  for (let i = 0; i < s.length; i++) {
    if (i + 1 < s.length && val[s[i]] < val[s[i+1]]) {
      result -= val[s[i]];
    } else {
      result += val[s[i]];
    }
  }
  return result;
}`,

    java: `public int romanToInt(String s) {
    Map<Character,Integer> val = new HashMap<>();
    val.put('I',1);val.put('V',5);val.put('X',10);
    val.put('L',50);val.put('C',100);val.put('D',500);val.put('M',1000);
    int result = 0;
    for (int i = 0; i < s.length(); i++) {
        if (i+1 < s.length() && val.get(s.charAt(i)) < val.get(s.charAt(i+1)))
            result -= val.get(s.charAt(i));
        else
            result += val.get(s.charAt(i));
    }
    return result;
}`,
  },

  defaultInput: { s: 'MCMXCIV' },

  inputFields: [
    { name: 's', label: 'Roman Numeral', type: 'string', defaultValue: 'MCMXCIV', placeholder: 'MCMXCIV', helperText: 'Roman numeral string (e.g. MCMXCIV = 1994)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string).toUpperCase();
    const steps: AlgorithmStep[] = [];
    const valMap: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };

    const charCodes = s.split('').map(c => valMap[c] || 0);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: charCodes, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Convert "${s}" to integer. Values: ${s.split('').map(c => `${c}=${valMap[c]}`).join(', ')}.`,
      variables: { s, length: s.length },
      visualization: makeViz(
        Object.fromEntries(charCodes.map((_, i) => [i, 'default'])),
        Object.fromEntries(s.split('').map((c, i) => [i, c]))
      ),
    });

    let result = 0;
    for (let i = 0; i < s.length; i++) {
      const curr = valMap[s[i]] || 0;
      const next = i + 1 < s.length ? (valMap[s[i + 1]] || 0) : 0;
      const subtract = i + 1 < s.length && curr < next;

      if (subtract) {
        result -= curr;
        steps.push({
          line: 5,
          explanation: `s[${i}]='${s[i]}'(${curr}) < s[${i + 1}]='${s[i + 1]}'(${next}): subtract ${curr}. result = ${result}.`,
          variables: { i, char: s[i], value: curr, action: 'subtract', result },
          visualization: makeViz(
            Object.fromEntries(charCodes.map((_, idx) => [idx, idx === i ? 'mismatch' : idx < i ? 'visited' : 'default'])),
            Object.fromEntries(s.split('').map((c, idx) => [idx, idx === i ? `−${curr}` : c]))
          ),
        });
      } else {
        result += curr;
        steps.push({
          line: 7,
          explanation: `s[${i}]='${s[i]}'(${curr}): add ${curr}. result = ${result}.`,
          variables: { i, char: s[i], value: curr, action: 'add', result },
          visualization: makeViz(
            Object.fromEntries(charCodes.map((_, idx) => [idx, idx === i ? 'found' : idx < i ? 'visited' : 'default'])),
            Object.fromEntries(s.split('').map((c, idx) => [idx, idx === i ? `+${curr}` : c]))
          ),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. "${s}" = ${result}.`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(charCodes.map((_, i) => [i, 'found'])),
        Object.fromEntries(s.split('').map((c, i) => [i, c]))
      ),
    });

    return steps;
  },
};

export default romanToIntegerII;
