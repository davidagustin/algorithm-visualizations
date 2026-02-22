import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestDistanceToCharacter: AlgorithmDefinition = {
  id: 'shortest-distance-to-character',
  title: 'Shortest Distance to a Character',
  leetcodeNumber: 821,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a string s and a character c, return an array where each element is the shortest distance from that index to any occurrence of character c. Do two passes: left-to-right tracking the last seen position of c, then right-to-left doing the same, taking the minimum.',
  tags: ['array', 'string', 'two pass'],

  code: {
    pseudocode: `function shortestToChar(s, c):
  n = len(s)
  result = [n] * n
  // Left pass
  prev = -n
  for i in range(n):
    if s[i] == c: prev = i
    result[i] = min(result[i], abs(i - prev))
  // Right pass
  prev = 2*n
  for i in range(n-1, -1, -1):
    if s[i] == c: prev = i
    result[i] = min(result[i], abs(i - prev))
  return result`,
    python: `def shortestToChar(s, c):
    n = len(s)
    result = [n] * n
    prev = -n
    for i in range(n):
        if s[i] == c: prev = i
        result[i] = min(result[i], abs(i - prev))
    prev = 2 * n
    for i in range(n - 1, -1, -1):
        if s[i] == c: prev = i
        result[i] = min(result[i], abs(i - prev))
    return result`,
    javascript: `function shortestToChar(s, c) {
  const n = s.length;
  const result = new Array(n).fill(n);
  let prev = -n;
  for (let i = 0; i < n; i++) {
    if (s[i] === c) prev = i;
    result[i] = Math.min(result[i], Math.abs(i - prev));
  }
  prev = 2 * n;
  for (let i = n - 1; i >= 0; i--) {
    if (s[i] === c) prev = i;
    result[i] = Math.min(result[i], Math.abs(i - prev));
  }
  return result;
}`,
    java: `public int[] shortestToChar(String s, char c) {
    int n = s.length();
    int[] result = new int[n];
    Arrays.fill(result, n);
    int prev = -n;
    for (int i = 0; i < n; i++) {
        if (s.charAt(i) == c) prev = i;
        result[i] = Math.min(result[i], Math.abs(i - prev));
    }
    prev = 2 * n;
    for (int i = n - 1; i >= 0; i--) {
        if (s.charAt(i) == c) prev = i;
        result[i] = Math.min(result[i], Math.abs(i - prev));
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'loveleetcode',
    c: 'e',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'loveleetcode',
      placeholder: 'loveleetcode',
      helperText: 'Input string',
    },
    {
      name: 'c',
      label: 'Target Character',
      type: 'string',
      defaultValue: 'e',
      placeholder: 'e',
      helperText: 'Character guaranteed to appear in string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string) || 'loveleetcode';
    const c = (input.c as string) || 'e';
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const result = new Array(n).fill(n);
    const chars = s.split('').map(ch => ch.charCodeAt(0) - 96);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `String: "${s}", target char: "${c}". Initialize result array with large values. Two-pass approach.`,
      variables: { n, targetChar: c },
      visualization: makeViz(result, {}, {}),
    });

    // Left pass
    let prev = -n;
    for (let i = 0; i < n; i++) {
      if (s[i] === c) prev = i;
      result[i] = Math.min(result[i], Math.abs(i - prev));
      steps.push({
        line: 5,
        explanation: `Left pass index ${i} (${s[i]}): ${s[i] === c ? `Found target! prev=${prev}.` : `dist to last ${c} = |${i}-${prev}| = ${Math.abs(i - prev)}.`} result[${i}]=${result[i]}.`,
        variables: { i, char: s[i], prev, 'result[i]': result[i] },
        visualization: makeViz(
          [...result],
          { [i]: s[i] === c ? 'found' : 'active' },
          { [i]: String(result[i]) }
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `Left pass complete. Now do right-to-left pass to catch closer targets from the right.`,
      variables: { afterLeftPass: result.join(', ') },
      visualization: makeViz([...result], Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    // Right pass
    prev = 2 * n;
    for (let i = n - 1; i >= 0; i--) {
      if (s[i] === c) prev = i;
      result[i] = Math.min(result[i], Math.abs(i - prev));
      steps.push({
        line: 10,
        explanation: `Right pass index ${i} (${s[i]}): ${s[i] === c ? `Found target! prev=${prev}.` : `dist to next ${c} = |${i}-${prev}| = ${Math.abs(i - prev)}.`} result[${i}]=${result[i]}.`,
        variables: { i, char: s[i], prev, 'result[i]': result[i] },
        visualization: makeViz(
          [...result],
          { [i]: s[i] === c ? 'found' : 'active' },
          { [i]: String(result[i]) }
        ),
      });
    }

    steps.push({
      line: 12,
      explanation: `Final result: [${result.join(', ')}]. Each value is shortest distance to character "${c}".`,
      variables: { result: result.join(', ') },
      visualization: makeViz(result, Object.fromEntries(result.map((v, i) => [i, v === 0 ? 'found' : 'sorted'])), {}),
    });

    return steps;
  },
};

export default shortestDistanceToCharacter;
