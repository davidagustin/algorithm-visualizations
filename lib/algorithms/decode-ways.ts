import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const decodeWays: AlgorithmDefinition = {
  id: 'decode-ways',
  title: 'Decode Ways',
  leetcodeNumber: 91,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A message containing letters A-Z can be encoded into numbers where A=1, B=2, ..., Z=26. Given a string of digits, count the number of ways to decode it. dp[i] = number of ways to decode the first i characters.',
  tags: ['Dynamic Programming', 'String'],
  code: {
    pseudocode: `function numDecodings(s):
  n = length(s)
  dp = array of size n+1
  dp[0] = 1
  dp[1] = 1 if s[0] != '0' else 0
  for i from 2 to n:
    oneDigit = int(s[i-1])
    twoDigit = int(s[i-2..i-1])
    if oneDigit >= 1: dp[i] += dp[i-1]
    if 10 <= twoDigit <= 26: dp[i] += dp[i-2]
  return dp[n]`,
    python: `def numDecodings(s):
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1 if s[0] != '0' else 0
    for i in range(2, n + 1):
        one = int(s[i-1])
        two = int(s[i-2:i])
        if one >= 1:
            dp[i] += dp[i-1]
        if 10 <= two <= 26:
            dp[i] += dp[i-2]
    return dp[n]`,
    javascript: `function numDecodings(s) {
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] !== '0' ? 1 : 0;
  for (let i = 2; i <= n; i++) {
    const one = parseInt(s[i-1]);
    const two = parseInt(s.slice(i-2, i));
    if (one >= 1) dp[i] += dp[i-1];
    if (two >= 10 && two <= 26) dp[i] += dp[i-2];
  }
  return dp[n];
}`,
    java: `public int numDecodings(String s) {
    int n = s.length();
    int[] dp = new int[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) != '0' ? 1 : 0;
    for (int i = 2; i <= n; i++) {
        int one = s.charAt(i-1) - '0';
        int two = Integer.parseInt(s.substring(i-2, i));
        if (one >= 1) dp[i] += dp[i-1];
        if (two >= 10 && two <= 26) dp[i] += dp[i-2];
    }
    return dp[n];
}`,
  },
  defaultInput: { s: '226' },
  inputFields: [
    {
      name: 's',
      label: 'Encoded String',
      type: 'string',
      defaultValue: '226',
      placeholder: '226',
      helperText: 'String of digits to decode (e.g. 226)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];

    const dp: (number | null)[] = new Array(n + 1).fill(null);
    const labels: string[] = ['""', ...Array.from({ length: n }, (_, i) => `s[0..${i}]`)];

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (dp[i] !== null) highlights[i] = 'found';
      }
      for (const idx of comparingIndices) {
        if (idx >= 0 && idx <= n) highlights[idx] = 'comparing';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Decode Ways: count ways to decode "${s}". dp[i] = number of ways to decode first i characters.`,
      variables: { s, n },
      visualization: makeViz(null, []),
    });

    dp[0] = 1;
    steps.push({
      line: 3,
      explanation: 'dp[0] = 1 (base case). Empty string has one decoding: the empty sequence.',
      variables: { 'dp[0]': 1 },
      visualization: makeViz(0, []),
    });

    dp[1] = s[0] !== '0' ? 1 : 0;
    steps.push({
      line: 4,
      explanation: `dp[1] = ${dp[1]}. s[0]='${s[0]}' — ${s[0] !== '0' ? 'non-zero so 1 way to decode' : 'zero means 0 ways (leading zero invalid)'}.`,
      variables: { 'dp[1]': dp[1], 's[0]': s[0] },
      visualization: makeViz(1, [0]),
    });

    for (let i = 2; i <= n; i++) {
      const one = parseInt(s[i - 1]);
      const two = parseInt(s.slice(i - 2, i));
      dp[i] = 0;

      steps.push({
        line: 6,
        explanation: `i=${i}: one-digit="${s[i - 1]}" (${one}), two-digit="${s.slice(i - 2, i)}" (${two}). Check if each is a valid encoding.`,
        variables: { i, one, two },
        visualization: makeViz(i, [i - 1, i - 2]),
      });

      if (one >= 1) {
        (dp[i] as number) += dp[i - 1] as number;
        steps.push({
          line: 8,
          explanation: `one-digit ${one} is valid (1-9). Add dp[${i - 1}]=${dp[i - 1]} ways. dp[${i}] now = ${dp[i]}.`,
          variables: { i, 'dp[i]': dp[i] },
          visualization: makeViz(i, [i - 1]),
        });
      }
      if (two >= 10 && two <= 26) {
        (dp[i] as number) += dp[i - 2] as number;
        steps.push({
          line: 9,
          explanation: `two-digit ${two} is valid (10-26). Add dp[${i - 2}]=${dp[i - 2]} ways. dp[${i}] now = ${dp[i]}.`,
          variables: { i, 'dp[i]': dp[i] },
          visualization: makeViz(i, [i - 2]),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `dp[${n}] = ${dp[n]}. There are ${dp[n]} ways to decode "${s}".`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: dp.slice(),
        highlights: Object.fromEntries(
          Array.from({ length: n + 1 }, (_, i) => [i, i === n ? 'active' : 'found'])
        ),
        labels,
      },
    });

    return steps;
  },
};

export default decodeWays;
