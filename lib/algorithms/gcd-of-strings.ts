import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const gcdOfStrings: AlgorithmDefinition = {
  id: 'gcd-of-strings',
  title: 'Greatest Common Divisor of Strings',
  leetcodeNumber: 1071,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'For two strings str1 and str2, we say t divides s if s = t + t + ... (t concatenated). Return the largest string t that divides both str1 and str2. First check if str1 + str2 == str2 + str1 (necessary condition). If so, the GCD string has length equal to the GCD of the two string lengths.',
  tags: ['math', 'string', 'gcd'],

  code: {
    pseudocode: `function gcdOfStrings(str1, str2):
  if str1 + str2 != str2 + str1:
    return ""
  g = gcd(len(str1), len(str2))
  return str1[0..g-1]`,

    python: `from math import gcd
def gcdOfStrings(str1, str2):
    if str1 + str2 != str2 + str1:
        return ""
    return str1[:gcd(len(str1), len(str2))]`,

    javascript: `function gcdOfStrings(str1, str2) {
  if (str1 + str2 !== str2 + str1) return "";
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  return str1.slice(0, gcd(str1.length, str2.length));
}`,

    java: `public String gcdOfStrings(String str1, String str2) {
    if (!(str1 + str2).equals(str2 + str1)) return "";
    int g = gcd(str1.length(), str2.length());
    return str1.substring(0, g);
}
private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
  },

  defaultInput: {
    str1: 'ABCABC',
    str2: 'ABC',
  },

  inputFields: [
    {
      name: 'str1',
      label: 'String 1',
      type: 'string',
      defaultValue: 'ABCABC',
      placeholder: 'ABCABC',
      helperText: 'First string',
    },
    {
      name: 'str2',
      label: 'String 2',
      type: 'string',
      defaultValue: 'ABC',
      placeholder: 'ABC',
      helperText: 'Second string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str1 = input.str1 as string;
    const str2 = input.str2 as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const charArr1 = str1.split('').map((_, i) => i);

    steps.push({
      line: 1,
      explanation: `Check if str1 + str2 == str2 + str1. This verifies a common divisor pattern exists. str1="${str1}", str2="${str2}".`,
      variables: { str1, str2 },
      visualization: makeViz(charArr1, {}, Object.fromEntries(str1.split('').map((c, i) => [i, c]))),
    });

    const concat1 = str1 + str2;
    const concat2 = str2 + str1;
    if (concat1 !== concat2) {
      steps.push({
        line: 2,
        explanation: `str1+str2 = "${concat1}" != str2+str1 = "${concat2}". No common divisor exists. Return "".`,
        variables: { 'str1+str2': concat1, 'str2+str1': concat2, result: '' },
        visualization: makeViz(charArr1, Object.fromEntries(charArr1.map(i => [i, 'mismatch'])), {}),
      });
      return steps;
    }

    steps.push({
      line: 2,
      explanation: `str1+str2 = str2+str1 = "${concat1}". A common divisor exists! Proceed.`,
      variables: { 'str1+str2': concat1, match: true },
      visualization: makeViz(charArr1, Object.fromEntries(charArr1.map(i => [i, 'found'])), Object.fromEntries(str1.split('').map((c, i) => [i, c]))),
    });

    const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
    let a = str1.length, b = str2.length;
    steps.push({
      line: 3,
      explanation: `Compute GCD(${str1.length}, ${str2.length}) using Euclidean algorithm.`,
      variables: { len1: str1.length, len2: str2.length },
      visualization: makeViz(charArr1, {}, Object.fromEntries(str1.split('').map((c, i) => [i, c]))),
    });

    while (b !== 0) {
      const r = a % b;
      steps.push({
        line: 3,
        explanation: `GCD step: GCD(${a}, ${b}). ${a} % ${b} = ${r}. Continue with GCD(${b}, ${r}).`,
        variables: { a, b, remainder: r },
        visualization: makeViz(charArr1, {}, {}),
      });
      a = b;
      b = r;
    }

    const g = gcd(str1.length, str2.length);
    const result = str1.slice(0, g);

    steps.push({
      line: 4,
      explanation: `GCD = ${g}. The GCD string is str1[0..${g - 1}] = "${result}".`,
      variables: { gcd: g, result },
      visualization: makeViz(
        charArr1,
        Object.fromEntries(charArr1.map(i => [i, i < g ? 'found' : 'visited'])),
        Object.fromEntries(str1.split('').map((c, i) => [i, i < g ? c : '']))
      ),
    });

    return steps;
  },
};

export default gcdOfStrings;
