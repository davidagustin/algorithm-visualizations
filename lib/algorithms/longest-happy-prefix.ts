import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestHappyPrefix: AlgorithmDefinition = {
  id: 'longest-happy-prefix',
  title: 'Longest Happy Prefix',
  leetcodeNumber: 1392,
  difficulty: 'Hard',
  category: 'String',
  description:
    'A "happy prefix" is a non-empty prefix that is also a suffix (not equal to the whole string). This is exactly the KMP failure function\'s last value: the length of the longest proper prefix that is also a suffix.',
  tags: ['string', 'kmp', 'failure function', 'prefix', 'suffix'],
  code: {
    pseudocode: `function longestPrefix(s):
  n = len(s)
  lps = [0] * n
  j = 0
  for i in 1..n-1:
    while j > 0 and s[i] != s[j]:
      j = lps[j-1]
    if s[i] == s[j]: j++
    lps[i] = j
  return s[:lps[n-1]]`,
    python: `def longestPrefix(s: str) -> str:
    n = len(s)
    lps = [0] * n
    j = 0
    for i in range(1, n):
        while j > 0 and s[i] != s[j]:
            j = lps[j - 1]
        if s[i] == s[j]:
            j += 1
        lps[i] = j
    return s[:lps[n - 1]]`,
    javascript: `function longestPrefix(s) {
  const n = s.length, lps = new Array(n).fill(0);
  let j = 0;
  for (let i = 1; i < n; i++) {
    while (j > 0 && s[i] !== s[j]) j = lps[j - 1];
    if (s[i] === s[j]) j++;
    lps[i] = j;
  }
  return s.slice(0, lps[n - 1]);
}`,
    java: `public String longestPrefix(String s) {
    int n = s.length();
    int[] lps = new int[n];
    int j = 0;
    for (int i = 1; i < n; i++) {
        while (j > 0 && s.charAt(i) != s.charAt(j)) j = lps[j - 1];
        if (s.charAt(i) == s.charAt(j)) j++;
        lps[i] = j;
    }
    return s.substring(0, lps[n - 1]);
}`,
  },
  defaultInput: { s: 'ababab' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'ababab', placeholder: 'ababab', helperText: 'Find the longest prefix that is also a suffix' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    const lps: number[] = new Array(n).fill(0);

    const makeViz = (i: number, j: number, lps: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (i < n) highlights[i] = 'active';
      if (j < n && j !== i) highlights[j] = 'comparing';
      const prefixLen = lps[n - 1];
      for (let x = 0; x < prefixLen; x++) highlights[x] = highlights[x] || 'sorted';
      for (let x = n - prefixLen; x < n; x++) highlights[x] = highlights[x] || 'sorted';
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = s[x];
      if (i < n) labels[i] = `i\n${s[i]}`;
      if (j < n && j !== i) labels[j] = `j\n${s[j]}`;
      return {
        type: 'array',
        array: [...lps],
        highlights,
        labels,
        auxData: {
          label: 'KMP Failure Function (LPS)',
          entries: [
            { key: 'i', value: String(i) },
            { key: 'j', value: String(j) },
            { key: 'lps[i]', value: i < n ? String(lps[i]) : '-' },
            { key: 'happy prefix', value: lps[n - 1] > 0 ? `"${s.slice(0, lps[n - 1])}"` : '""' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Build KMP failure function for "${s}". lps[i] = length of longest proper prefix of s[0..i] that is also a suffix.`,
      variables: { s, n },
      visualization: makeViz(0, 0, [...lps]),
    });

    let j = 0;
    for (let i = 1; i < n; i++) {
      while (j > 0 && s[i] !== s[j]) {
        j = lps[j - 1];
      }
      if (s[i] === s[j]) j++;
      lps[i] = j;

      steps.push({
        line: 7,
        explanation: `lps[${i}]=${j}: prefix "${s.slice(0, j)}" matches suffix "${s.slice(i - j + 1, i + 1)}".`,
        variables: { i, j, lpsValue: j },
        visualization: makeViz(i, j > 0 ? j - 1 : 0, [...lps]),
      });
    }

    const result = s.slice(0, lps[n - 1]);
    steps.push({
      line: 9,
      explanation: `lps[${n - 1}]=${lps[n - 1]}. Longest happy prefix: "${result}".`,
      variables: { result, length: lps[n - 1] },
      visualization: makeViz(-1, -1, [...lps]),
    });

    return steps;
  },
};

export default longestHappyPrefix;
