import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const makeStringSubsequenceCyclic: AlgorithmDefinition = {
  id: 'make-string-subsequence-cyclic',
  title: 'Make String a Subsequence Using Cyclic Increments',
  leetcodeNumber: 2825,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given two strings str1 and str2, check if str2 can be made a subsequence of str1 by applying at most one cyclic increment operation on each character of str1 (a->b, b->c, ..., z->a). Use two pointers to greedily match characters, allowing one-step cyclic advance.',
  tags: ['two pointers', 'string', 'greedy', 'subsequence'],

  code: {
    pseudocode: `function canMakeSubsequence(str1, str2):
  i = 0, j = 0
  while i < len(str1) and j < len(str2):
    c1 = str1[i], c2 = str2[j]
    next_c1 = (c1 - 'a' + 1) % 26 + 'a'
    if c1 == c2 or next_c1 == c2:
      j += 1
    i += 1
  return j == len(str2)`,
    python: `def canMakeSubsequence(str1: str, str2: str) -> bool:
    i = j = 0
    while i < len(str1) and j < len(str2):
        c1, c2 = str1[i], str2[j]
        next_c1 = chr((ord(c1) - ord('a') + 1) % 26 + ord('a'))
        if c1 == c2 or next_c1 == c2:
            j += 1
        i += 1
    return j == len(str2)`,
    javascript: `function canMakeSubsequence(str1, str2) {
  let i = 0, j = 0;
  while (i < str1.length && j < str2.length) {
    const c1 = str1[i], c2 = str2[j];
    const nextC1 = String.fromCharCode((c1.charCodeAt(0) - 97 + 1) % 26 + 97);
    if (c1 === c2 || nextC1 === c2) j++;
    i++;
  }
  return j === str2.length;
}`,
    java: `public boolean canMakeSubsequence(String str1, String str2) {
    int i = 0, j = 0;
    while (i < str1.length() && j < str2.length()) {
        char c1 = str1.charAt(i), c2 = str2.charAt(j);
        char nextC1 = (char)((c1 - 'a' + 1) % 26 + 'a');
        if (c1 == c2 || nextC1 == c2) j++;
        i++;
    }
    return j == str2.length();
}`,
  },

  defaultInput: {
    str1: 'abc',
    str2: 'ad',
  },

  inputFields: [
    {
      name: 'str1',
      label: 'String 1 (source)',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'Source string (can increment chars cyclically)',
    },
    {
      name: 'str2',
      label: 'String 2 (target subsequence)',
      type: 'string',
      defaultValue: 'ad',
      placeholder: 'ad',
      helperText: 'Target string to match as subsequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const str1 = input.str1 as string;
    const str2 = input.str2 as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Check if str2="${str2}" can be a subsequence of str1="${str1}" after at most one cyclic increment per char.`,
      variables: { str1, str2 },
      visualization: {
        type: 'array',
        array: str1.split('').map(c => c.charCodeAt(0) - 96),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let i = 0, j = 0;

    while (i < str1.length && j < str2.length) {
      const c1 = str1[i];
      const c2 = str2[j];
      const nextC1 = String.fromCharCode((c1.charCodeAt(0) - 97 + 1) % 26 + 97);
      const matched = c1 === c2 || nextC1 === c2;

      steps.push({
        line: 3,
        explanation: `i=${i}: str1[i]='${c1}' (next='${nextC1}'), str2[j]='${c2}'. ${matched ? 'Match! j advances.' : 'No match, skip.'}`,
        variables: { i, j, c1, c2, nextC1, matched },
        visualization: {
          type: 'array',
          array: str1.split('').map(c => c.charCodeAt(0) - 96),
          highlights: { [i]: matched ? 'found' : 'mismatch' },
          labels: { [i]: `i`, [j]: `j=${j}` },
        } as ArrayVisualization,
      });

      if (matched) j++;
      i++;
    }

    const result = j === str2.length;
    steps.push({
      line: 8,
      explanation: `j=${j} == len(str2)=${str2.length}? ${result}. str2 ${result ? 'can' : 'cannot'} be made a subsequence.`,
      variables: { result, j, 'str2.length': str2.length },
      visualization: {
        type: 'array',
        array: str1.split('').map(c => c.charCodeAt(0) - 96),
        highlights: result ? {} : {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default makeStringSubsequenceCyclic;
