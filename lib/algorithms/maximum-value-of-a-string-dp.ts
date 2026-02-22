import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumValueOfAStringDp: AlgorithmDefinition = {
  id: 'maximum-value-of-a-string-dp',
  title: 'Maximum Value of a String in an Array',
  leetcodeNumber: 2498,
  difficulty: 'Easy',
  category: 'Dynamic Programming',
  description:
    'Given an array of strings, find the maximum "value" of any string. The value of a string is its numeric value if it consists entirely of digits, otherwise it is the length of the string. Iterate over each string, parse or measure, and track the maximum.',
  tags: ['dynamic programming', 'string', 'parsing', 'easy'],

  code: {
    pseudocode: `function maximumValue(strs):
  maxVal = 0
  for each str in strs:
    if str consists of all digits:
      val = parseInt(str)
    else:
      val = length of str
    maxVal = max(maxVal, val)
  return maxVal`,
    python: `def maximumValue(strs):
    return max(int(s) if s.isdigit() else len(s) for s in strs)`,
    javascript: `function maximumValue(strs) {
  return Math.max(...strs.map(s => /^\d+$/.test(s) ? parseInt(s) : s.length));
}`,
    java: `public int maximumValue(String[] strs) {
    int max = 0;
    for (String s : strs) {
        int val;
        try { val = Integer.parseInt(s); }
        catch (NumberFormatException e) { val = s.length(); }
        max = Math.max(max, val);
    }
    return max;
}`,
  },

  defaultInput: {
    strs: ['alic3', 'bob', '3', '4', '00000'],
  },

  inputFields: [
    {
      name: 'strs',
      label: 'Array of Strings',
      type: 'array',
      defaultValue: ['alic3', 'bob', '3', '4', '00000'],
      placeholder: 'alic3,bob,3,4,00000',
      helperText: 'Array of strings (mix of digits and letters)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strs = input.strs as string[];
    const steps: AlgorithmStep[] = [];

    const isAllDigits = (s: string) => /^\d+$/.test(s);
    const values: number[] = strs.map(s => isAllDigits(s) ? parseInt(s, 10) : s.length);

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Array: [${strs.join(', ')}]. Value = numeric if all digits, else string length.`,
      variables: { count: strs.length, maxVal: 0 },
      visualization: makeViz(values, {}, {}),
    });

    let maxVal = 0;
    let maxIdx = 0;

    for (let i = 0; i < strs.length; i++) {
      const s = strs[i];
      const allDigits = isAllDigits(s);
      const val = allDigits ? parseInt(s, 10) : s.length;
      const isNewMax = val > maxVal;
      if (isNewMax) { maxVal = val; maxIdx = i; }

      const hi: Record<number, string> = { [i]: isNewMax ? 'found' : 'active' };
      const lb: Record<number, string> = { [i]: `${val}` };
      if (maxIdx !== i) { hi[maxIdx] = 'found'; lb[maxIdx] = `max:${maxVal}`; }

      steps.push({
        line: 3,
        explanation: `String "${s}": ${allDigits ? 'all digits -> value=' : 'has letters -> length='}${val}. Max so far = ${maxVal}`,
        variables: { string: s, isAllDigits: allDigits, value: val, maxVal },
        visualization: makeViz(values, hi, lb),
      });
    }

    steps.push({
      line: 8,
      explanation: `Maximum value across all strings = ${maxVal} (from "${strs[maxIdx]}")`,
      variables: { answer: maxVal, bestString: strs[maxIdx] },
      visualization: makeViz(values, { [maxIdx]: 'found' }, { [maxIdx]: `max:${maxVal}` }),
    });

    return steps;
  },
};

export default maximumValueOfAStringDp;
