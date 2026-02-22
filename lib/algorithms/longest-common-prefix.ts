import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestCommonPrefix: AlgorithmDefinition = {
  id: 'longest-common-prefix',
  title: 'Longest Common Prefix',
  leetcodeNumber: 14,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Find the longest common prefix string among an array of strings. Vertical scanning: for each character position of the first string, check whether all other strings have the same character at that position. Stop when a mismatch or shorter string is found. O(S) time where S is total characters.',
  tags: ['String', 'Array'],
  code: {
    pseudocode: `function longestCommonPrefix(strs):
  if strs is empty: return ""
  for i from 0 to len(strs[0])-1:
    c = strs[0][i]
    for each str in strs[1:]:
      if i >= len(str) or str[i] != c:
        return strs[0][0:i]
  return strs[0]`,
    python: `def longestCommonPrefix(strs):
    if not strs: return ""
    for i in range(len(strs[0])):
        c = strs[0][i]
        for s in strs[1:]:
            if i >= len(s) or s[i] != c:
                return strs[0][:i]
    return strs[0]`,
    javascript: `function longestCommonPrefix(strs) {
  if (!strs.length) return "";
  for (let i = 0; i < strs[0].length; i++) {
    const c = strs[0][i];
    for (let j = 1; j < strs.length; j++) {
      if (i >= strs[j].length || strs[j][i] !== c)
        return strs[0].slice(0, i);
    }
  }
  return strs[0];
}`,
    java: `public String longestCommonPrefix(String[] strs) {
    for (int i = 0; i < strs[0].length(); i++) {
        char c = strs[0].charAt(i);
        for (int j = 1; j < strs.length; j++) {
            if (i >= strs[j].length() || strs[j].charAt(i) != c)
                return strs[0].substring(0, i);
        }
    }
    return strs[0];
}`,
  },
  defaultInput: { strs: ['flower', 'flow', 'flight'] },
  inputFields: [
    {
      name: 'strs',
      label: 'Strings',
      type: 'string',
      defaultValue: 'flower,flow,flight',
      placeholder: 'flower,flow,flight',
      helperText: 'Comma-separated list of strings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let strs: string[];
    if (Array.isArray(input.strs)) {
      strs = input.strs as string[];
    } else {
      strs = (input.strs as string).split(',').map(s => s.trim());
    }
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      colIdx: number,
      prefix: string,
      matchStatus: ('match' | 'mismatch' | 'default')[],
    ): ArrayVisualization => {
      // Show each string's current-column char code
      const arr = strs.map(s => colIdx < s.length ? s.charCodeAt(colIdx) : -1);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < strs.length; k++) {
        highlights[k] = matchStatus[k] === 'match' ? 'found'
          : matchStatus[k] === 'mismatch' ? 'mismatch'
          : 'default';
        labels[k] = colIdx < strs[k].length ? strs[k][colIdx] : '∅';
      }

      return {
        type: 'array',
        array: arr.map(v => v < 0 ? 0 : v),
        highlights,
        labels,
        auxData: {
          label: 'LCP Scan',
          entries: [
            { key: 'Column', value: String(colIdx) },
            { key: 'Prefix so far', value: prefix || '(empty)' },
            ...strs.map(s => ({ key: s, value: colIdx < s.length ? `[${colIdx}]='${s[colIdx]}'` : '(end)' })),
          ],
        },
      };
    };

    if (strs.length === 0) {
      steps.push({
        line: 1,
        explanation: 'No strings provided. Return empty string.',
        variables: { result: '' },
        visualization: { type: 'array', array: [], highlights: {}, labels: {} },
      });
      return steps;
    }

    steps.push({
      line: 2,
      explanation: `Find longest common prefix of [${strs.map(s => `"${s}"`).join(', ')}]. Scan column by column.`,
      variables: { strs },
      visualization: makeViz(0, '', strs.map(() => 'default')),
    });

    const first = strs[0];
    let prefix = '';

    for (let i = 0; i < first.length; i++) {
      const c = first[i];
      const matchStatus: ('match' | 'mismatch' | 'default')[] = strs.map(() => 'default');
      matchStatus[0] = 'match';

      let mismatchFound = false;

      for (let j = 1; j < strs.length; j++) {
        if (i >= strs[j].length || strs[j][i] !== c) {
          matchStatus[j] = 'mismatch';
          mismatchFound = true;
        } else {
          matchStatus[j] = 'match';
        }
      }

      if (mismatchFound) {
        steps.push({
          line: 5,
          explanation: `Column ${i}: strs[0][${i}]='${c}'. Mismatch found. Common prefix = "${prefix}".`,
          variables: { col: i, char: c, prefix },
          visualization: makeViz(i, prefix, matchStatus),
        });
        break;
      }

      prefix += c;

      steps.push({
        line: 3,
        explanation: `Column ${i}: all strings have '${c}'. Prefix extended to "${prefix}".`,
        variables: { col: i, char: c, prefix },
        visualization: makeViz(i, prefix, matchStatus),
      });
    }

    steps.push({
      line: 7,
      explanation: `Scan complete. Longest Common Prefix = "${prefix}".`,
      variables: { result: prefix },
      visualization: {
        type: 'array',
        array: strs.map(s => s.startsWith(prefix) ? prefix.length : 0),
        highlights: Object.fromEntries(strs.map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(strs.map((s, k) => [k, `"${s}"`])),
        auxData: {
          label: 'Result',
          entries: [{ key: 'Longest Common Prefix', value: `"${prefix}"` }],
        },
      },
    });

    return steps;
  },
};

export default longestCommonPrefix;
