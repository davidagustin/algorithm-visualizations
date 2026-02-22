import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const appendCharactersToString: AlgorithmDefinition = {
  id: 'append-characters-to-string',
  title: 'Append Characters to String to Make Subsequence',
  leetcodeNumber: 2486,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given strings s and t, find the minimum number of characters to append to s so that t becomes a subsequence of s. Use a pointer j on t: scan s and advance j whenever s[i] == t[j]. The answer is t.length - j (remaining unmatched characters in t).',
  tags: ['two pointers', 'string', 'greedy'],

  code: {
    pseudocode: `function appendCharacters(s, t):
  j = 0
  for i = 0 to len(s)-1:
    if j < len(t) and s[i] == t[j]:
      j++
  return len(t) - j`,

    python: `def appendCharacters(s: str, t: str) -> int:
    j = 0
    for ch in s:
        if j < len(t) and ch == t[j]:
            j += 1
    return len(t) - j`,

    javascript: `function appendCharacters(s, t) {
  let j = 0;
  for (let i = 0; i < s.length; i++) {
    if (j < t.length && s[i] === t[j]) j++;
  }
  return t.length - j;
}`,

    java: `public int appendCharacters(String s, String t) {
    int j = 0;
    for (char c : s.toCharArray()) {
        if (j < t.length() && c == t.charAt(j)) j++;
    }
    return t.length() - j;
}`,
  },

  defaultInput: {
    s: 'coaching',
    t: 'coding',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'coaching',
      placeholder: 'coaching',
      helperText: 'Base string to scan',
    },
    {
      name: 't',
      label: 'String t',
      type: 'string',
      defaultValue: 'coding',
      placeholder: 'coding',
      helperText: 'Target subsequence string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    const sIndices = s.split('').map((_, i) => i);
    const tIndices = t.split('').map((_, i) => i);

    let j = 0;

    steps.push({
      line: 1,
      explanation: `Scan s="${s}" matching characters from t="${t}". j tracks progress in t.`,
      variables: { j, 's.length': s.length, 't.length': t.length },
      visualization: makeViz(
        sIndices,
        {},
        Object.fromEntries(s.split('').map((c, i) => [i, c]))
      ),
    });

    for (let i = 0; i < s.length; i++) {
      if (j < t.length && s[i] === t[j]) {
        steps.push({
          line: 3,
          explanation: `s[${i}]="${s[i]}" == t[${j}]="${t[j]}". Match found! Advance j to ${j + 1}.`,
          variables: { i, j, 's[i]': s[i], 't[j]': t[j] },
          visualization: makeViz(
            sIndices,
            { [i]: 'found' },
            { ...Object.fromEntries(s.split('').map((c, k) => [k, c])), [i]: `${s[i]}(match)` }
          ),
        });
        j++;
      } else {
        steps.push({
          line: 3,
          explanation: `s[${i}]="${s[i]}" ${j < t.length ? `!= t[${j}]="${t[j]}"` : '(t fully matched)'}. No match, continue.`,
          variables: { i, j, 's[i]': s[i], 't[j]': j < t.length ? t[j] : 'done' },
          visualization: makeViz(
            sIndices,
            { [i]: 'comparing' },
            Object.fromEntries(s.split('').map((c, k) => [k, c]))
          ),
        });
      }
    }

    const result = t.length - j;
    steps.push({
      line: 5,
      explanation: `Matched ${j} characters of t. Need to append ${result} more characters: "${t.slice(j)}".`,
      variables: { matched: j, toAppend: result, appendStr: t.slice(j) },
      visualization: makeViz(
        tIndices,
        {
          ...Object.fromEntries(Array.from({ length: j }, (_, k) => [k, 'found'])),
          ...Object.fromEntries(Array.from({ length: t.length - j }, (_, k) => [k + j, 'mismatch'])),
        },
        Object.fromEntries(t.split('').map((c, i) => [i, c]))
      ),
    });

    return steps;
  },
};

export default appendCharactersToString;
