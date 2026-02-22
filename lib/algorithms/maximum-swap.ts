import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSwap: AlgorithmDefinition = {
  id: 'maximum-swap',
  title: 'Maximum Swap',
  leetcodeNumber: 670,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given an integer, swap two digits at most once to get the maximum valued number. Store the last occurrence index of each digit (0-9). Then from left to right, for each digit, check if a larger digit (9 down to current+1) appears later. If so, swap them and return the result.',
  tags: ['math', 'array', 'greedy'],

  code: {
    pseudocode: `function maximumSwap(num):
  digits = list of digits of num
  last = {digit: last_index for each digit}
  for i in range(len(digits)):
    for d from 9 down to digits[i]+1:
      if last.get(d, -1) > i:
        swap digits[i] and digits[last[d]]
        return int(digits as number)
  return num`,

    python: `def maximumSwap(num):
    digits = list(str(num))
    last = {int(d): i for i, d in enumerate(digits)}
    for i, d in enumerate(digits):
        for dig in range(9, int(d), -1):
            if last.get(dig, -1) > i:
                digits[i], digits[last[dig]] = digits[last[dig]], digits[i]
                return int("".join(digits))
    return num`,

    javascript: `function maximumSwap(num) {
  const digits = String(num).split('');
  const last = {};
  digits.forEach((d, i) => last[d] = i);
  for (let i = 0; i < digits.length; i++) {
    for (let d = 9; d > +digits[i]; d--) {
      if ((last[d] ?? -1) > i) {
        [digits[i], digits[last[d]]] = [digits[last[d]], digits[i]];
        return parseInt(digits.join(''));
      }
    }
  }
  return num;
}`,

    java: `public int maximumSwap(int num) {
    char[] digits = String.valueOf(num).toCharArray();
    int[] last = new int[10];
    for (int i = 0; i < digits.length; i++) last[digits[i]-'0'] = i;
    for (int i = 0; i < digits.length; i++) {
        for (int d = 9; d > digits[i]-'0'; d--) {
            if (last[d] > i) {
                char tmp = digits[i]; digits[i] = digits[last[d]]; digits[last[d]] = tmp;
                return Integer.parseInt(new String(digits));
            }
        }
    }
    return num;
}`,
  },

  defaultInput: {
    num: 2736,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number',
      type: 'number',
      defaultValue: 2736,
      placeholder: '2736',
      helperText: 'Non-negative integer',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as number;
    const steps: AlgorithmStep[] = [];
    const digits = String(num).split('').map(Number);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `num = ${num}. Digits: [${digits.join(', ')}]. Build last-occurrence map for each digit.`,
      variables: { num, digits: [...digits] },
      visualization: makeViz([...digits], {}, Object.fromEntries(digits.map((d, i) => [i, String(d)]))),
    });

    const last: Record<number, number> = {};
    for (let i = 0; i < digits.length; i++) {
      last[digits[i]] = i;
    }

    steps.push({
      line: 2,
      explanation: `Last occurrence map: {${Object.entries(last).map(([d, i]) => `${d}:idx${i}`).join(', ')}}. For each position, we want to swap with the rightmost larger digit.`,
      variables: { last: { ...last } },
      visualization: makeViz([...digits], {}, Object.fromEntries(digits.map((d, i) => [i, `${d}@${i}`]))),
    });

    for (let i = 0; i < digits.length; i++) {
      steps.push({
        line: 3,
        explanation: `Check position ${i} (digit ${digits[i]}). Look for larger digit (9 down to ${digits[i] + 1}) that appears later.`,
        variables: { i, currentDigit: digits[i] },
        visualization: makeViz([...digits], { [i]: 'active' }, Object.fromEntries(digits.map((d, idx) => [idx, String(d)]))),
      });

      let swapped = false;
      for (let d = 9; d > digits[i]; d--) {
        if ((last[d] ?? -1) > i) {
          const j = last[d];
          steps.push({
            line: 5,
            explanation: `Found digit ${d} at index ${j} > ${i}. Swapping digits[${i}]=${digits[i]} with digits[${j}]=${d}.`,
            variables: { i, j, digitAtI: digits[i], digitAtJ: d },
            visualization: makeViz([...digits], { [i]: 'swapping', [j]: 'swapping' }, { [i]: `${digits[i]}`, [j]: String(d) }),
          });
          const tmp = digits[i];
          digits[i] = digits[j];
          digits[j] = tmp;
          const result = parseInt(digits.join(''));
          steps.push({
            line: 6,
            explanation: `After swap: [${digits.join(', ')}]. Maximum number = ${result}.`,
            variables: { result, digits: [...digits] },
            visualization: makeViz([...digits], { [i]: 'found', [j]: 'found' }, Object.fromEntries(digits.map((d2, idx) => [idx, String(d2)]))),
          });
          swapped = true;
          return steps;
        }
      }
      if (!swapped) {
        steps.push({
          line: 3,
          explanation: `No larger digit found after position ${i}. Digit ${digits[i]} is already optimal here.`,
          variables: { i, digit: digits[i] },
          visualization: makeViz([...digits], { [i]: 'sorted' }, Object.fromEntries(digits.map((d, idx) => [idx, String(d)]))),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `No beneficial swap found. The number ${num} is already maximum.`,
      variables: { result: num },
      visualization: makeViz([...digits], Object.fromEntries(digits.map((_, i) => [i, 'sorted'])), Object.fromEntries(digits.map((d, i) => [i, String(d)]))),
    });

    return steps;
  },
};

export default maximumSwap;
