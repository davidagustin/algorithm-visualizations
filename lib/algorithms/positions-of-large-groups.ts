import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const positionsOfLargeGroups: AlgorithmDefinition = {
  id: 'positions-of-large-groups',
  title: 'Positions of Large Groups',
  leetcodeNumber: 830,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'In a string, a "large group" is a consecutive run of the same character with length 3 or more. Return the start and end indices of every large group. Scan through the string tracking the start of each group; when the character changes or the string ends, check if the group length is at least 3.',
  tags: ['array', 'string', 'grouping'],

  code: {
    pseudocode: `function largeGroupPositions(s):
  result = []
  start = 0
  for i in range(1, len(s)+1):
    if i == len(s) or s[i] != s[start]:
      if i - start >= 3:
        result.append([start, i-1])
      start = i
  return result`,
    python: `def largeGroupPositions(s):
    result = []
    start = 0
    for i in range(1, len(s) + 1):
        if i == len(s) or s[i] != s[start]:
            if i - start >= 3:
                result.append([start, i - 1])
            start = i
    return result`,
    javascript: `function largeGroupPositions(s) {
  const result = [];
  let start = 0;
  for (let i = 1; i <= s.length; i++) {
    if (i === s.length || s[i] !== s[start]) {
      if (i - start >= 3) result.push([start, i - 1]);
      start = i;
    }
  }
  return result;
}`,
    java: `public List<List<Integer>> largeGroupPositions(String s) {
    List<List<Integer>> result = new ArrayList<>();
    int start = 0;
    for (int i = 1; i <= s.length(); i++) {
        if (i == s.length() || s.charAt(i) != s.charAt(start)) {
            if (i - start >= 3)
                result.add(Arrays.asList(start, i - 1));
            start = i;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'abbxxxxzzy',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abbxxxxzzy',
      placeholder: 'abbxxxxzzy',
      helperText: 'Lowercase alphabetic string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string) || 'abbxxxxzzy';
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const charCodes = s.split('').map(ch => ch.charCodeAt(0) - 96);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: charCodes,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Scan string "${s}" for consecutive groups of same character with length >= 3.`,
      variables: { s, length: s.length },
      visualization: makeViz({}, {}),
    });

    let start = 0;
    for (let i = 1; i <= s.length; i++) {
      if (i === s.length || s[i] !== s[start]) {
        const groupLen = i - start;
        if (groupLen >= 3) {
          result.push([start, i - 1]);
          const highlights: Record<number, string> = {};
          for (let j = start; j < i; j++) highlights[j] = 'found';
          steps.push({
            line: 5,
            explanation: `Large group "${s[start]}" from index ${start} to ${i - 1} (length ${groupLen} >= 3). Added to result.`,
            variables: { char: s[start], start, end: i - 1, length: groupLen, resultCount: result.length },
            visualization: makeViz(highlights, { [start]: 'start', [i - 1]: 'end' }),
          });
        } else {
          const highlights: Record<number, string> = {};
          for (let j = start; j < i; j++) highlights[j] = 'comparing';
          steps.push({
            line: 4,
            explanation: `Group "${s[start]}" from index ${start} to ${i - 1} (length ${groupLen} < 3). Not a large group.`,
            variables: { char: s[start], start, end: i - 1, length: groupLen },
            visualization: makeViz(highlights, {}),
          });
        }
        start = i;
      } else {
        steps.push({
          line: 3,
          explanation: `Index ${i}: s[${i}]="${s[i]}" same as s[${start}]="${s[start]}". Continue current group.`,
          variables: { i, char: s[i], groupStart: start, currentLen: i - start + 1 },
          visualization: makeViz({ [i]: 'active' }, {}),
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Done. Large groups: ${result.map(([a, b]) => `[${a},${b}]`).join(', ') || 'none'}.`,
      variables: { result: result.map(([a, b]) => `[${a},${b}]`).join(', ') },
      visualization: makeViz(
        Object.fromEntries(
          result.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, k) => [a + k, 'found']))
        ),
        {}
      ),
    });

    return steps;
  },
};

export default positionsOfLargeGroups;
