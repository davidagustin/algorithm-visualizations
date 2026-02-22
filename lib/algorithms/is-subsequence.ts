import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const isSubsequence: AlgorithmDefinition = {
  id: 'is-subsequence',
  title: 'Is Subsequence',
  leetcodeNumber: 392,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given strings s and t, determine if s is a subsequence of t. Use a two-pointer greedy approach: advance the s-pointer whenever characters match. Binary search variant: preprocess t character positions for efficient multi-query use.',
  tags: ['binary search', 'two pointers', 'string', 'greedy'],

  code: {
    pseudocode: `function isSubsequence(s, t):
  i = 0, j = 0
  while i < len(s) and j < len(t):
    if s[i] == t[j]:
      i++
    j++
  return i == len(s)`,
    python: `def isSubsequence(s: str, t: str) -> bool:
    i, j = 0, 0
    while i < len(s) and j < len(t):
        if s[i] == t[j]:
            i += 1
        j += 1
    return i == len(s)`,
    javascript: `function isSubsequence(s, t) {
  let i = 0, j = 0;
  while (i < s.length && j < t.length) {
    if (s[i] === t[j]) i++;
    j++;
  }
  return i === s.length;
}`,
    java: `public boolean isSubsequence(String s, String t) {
    int i = 0, j = 0;
    while (i < s.length() && j < t.length()) {
        if (s.charAt(i) == t.charAt(j)) i++;
        j++;
    }
    return i == s.length();
}`,
  },

  defaultInput: {
    s: 'ace',
    t: 'abcde',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s (subsequence candidate)',
      type: 'string',
      defaultValue: 'ace',
      placeholder: 'ace',
      helperText: 'The string to check as subsequence',
    },
    {
      name: 't',
      label: 'String t (source)',
      type: 'string',
      defaultValue: 'abcde',
      placeholder: 'abcde',
      helperText: 'The string to search within',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];

    const tArr = Array.from(t).map((_, i) => i);
    const makeVizT = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: Array.from(t) as unknown as number[],
      highlights,
      labels,
    });

    let i = 0;
    let j = 0;

    steps.push({
      line: 1,
      explanation: `Initialize: s="${s}", t="${t}". i=0 (pointer in s), j=0 (pointer in t).`,
      variables: { i, j, 's': s, 't': t },
      visualization: makeVizT({ [j]: 'active' }, { [j]: 'j' }),
    });

    while (i < s.length && j < t.length) {
      steps.push({
        line: 3,
        explanation: `Compare s[${i}]='${s[i]}' with t[${j}]='${t[j]}'.`,
        variables: { i, j, 's[i]': s[i], 't[j]': t[j] },
        visualization: makeVizT(
          { [j]: 'comparing' },
          { [j]: `t[${j}]` }
        ),
      });

      if (s[i] === t[j]) {
        steps.push({
          line: 4,
          explanation: `Match! s[${i}]='${s[i]}' == t[${j}]='${t[j]}'. Advance i to ${i + 1}.`,
          variables: { i: i + 1, j, matched: s[i] },
          visualization: makeVizT(
            { [j]: 'found' },
            { [j]: `matched '${s[i]}'` }
          ),
        });
        i++;
      } else {
        steps.push({
          line: 6,
          explanation: `No match. s[${i}]='${s[i]}' != t[${j}]='${t[j]}'. Advance j only.`,
          variables: { i, j: j + 1 },
          visualization: makeVizT(
            { [j]: 'mismatch' },
            { [j]: 'skip' }
          ),
        });
      }
      j++;
    }

    const result = i === s.length;
    steps.push({
      line: 7,
      explanation: `Done. i=${i}, len(s)=${s.length}. ${result ? `"${s}" IS a subsequence of "${t}".` : `"${s}" is NOT a subsequence of "${t}".`}`,
      variables: { i, 'len(s)': s.length, result },
      visualization: makeVizT({}, {}),
    });

    return steps;
  },
};

export default isSubsequence;
