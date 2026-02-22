import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const decodeWaysIi: AlgorithmDefinition = {
  id: 'decode-ways-ii',
  title: 'Decode Ways II',
  leetcodeNumber: 639,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A message is decoded using letter-to-number mapping (A=1...Z=26). The character "*" can represent any digit 1-9. Given an encoded string s, return the number of ways to decode it modulo 10^9+7. Uses DP where each character can form a 1-digit or 2-digit code, accounting for wildcard expansions.',
  tags: ['dynamic programming', 'string', 'wildcard', 'modular arithmetic'],

  code: {
    pseudocode: `function numDecodings(s):
  MOD = 1e9+7
  dp = [0]*(n+1); dp[0]=1
  dp[1] = 9 if s[0]=="*" else (0 if s[0]=="0" else 1)
  for i from 2 to n:
    c = s[i-1], p = s[i-2]
    // single digit
    if c=="*": dp[i] += 9*dp[i-1]
    elif c!="0": dp[i] += dp[i-1]
    // two digits
    (handle * and digit combos)
    dp[i] %= MOD
  return dp[n]`,

    python: `def numDecodings(s: str) -> int:
    MOD = 10**9 + 7
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 9 if s[0] == '*' else (0 if s[0] == '0' else 1)
    for i in range(2, n + 1):
        c, p = s[i-1], s[i-2]
        if c == '*':
            dp[i] += 9 * dp[i-1]
            if p == '*': dp[i] += 15 * dp[i-2]
            elif p == '1': dp[i] += 9 * dp[i-2]
            elif p == '2': dp[i] += 6 * dp[i-2]
        else:
            if c != '0': dp[i] += dp[i-1]
            if p == '*':
                dp[i] += (2 if c <= '6' else 1) * dp[i-2]
            elif p == '1' or (p == '2' and c <= '6'):
                dp[i] += dp[i-2]
        dp[i] %= MOD
    return dp[n]`,

    javascript: `function numDecodings(s) {
  const MOD = 1e9 + 7;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] === '*' ? 9 : s[0] === '0' ? 0 : 1;
  for (let i = 2; i <= n; i++) {
    const c = s[i-1], p = s[i-2];
    if (c === '*') {
      dp[i] += 9 * dp[i-1];
      if (p === '*') dp[i] += 15 * dp[i-2];
      else if (p === '1') dp[i] += 9 * dp[i-2];
      else if (p === '2') dp[i] += 6 * dp[i-2];
    } else {
      if (c !== '0') dp[i] += dp[i-1];
      if (p === '*') dp[i] += (c <= '6' ? 2 : 1) * dp[i-2];
      else if (p === '1' || (p === '2' && c <= '6')) dp[i] += dp[i-2];
    }
    dp[i] %= MOD;
  }
  return dp[n];
}`,

    java: `public int numDecodings(String s) {
    int MOD = 1_000_000_007, n = s.length();
    long[] dp = new long[n + 1];
    dp[0] = 1;
    dp[1] = s.charAt(0) == '*' ? 9 : s.charAt(0) == '0' ? 0 : 1;
    for (int i = 2; i <= n; i++) {
        char c = s.charAt(i-1), p = s.charAt(i-2);
        if (c == '*') {
            dp[i] += 9 * dp[i-1];
            if (p == '*') dp[i] += 15 * dp[i-2];
            else if (p == '1') dp[i] += 9 * dp[i-2];
            else if (p == '2') dp[i] += 6 * dp[i-2];
        } else {
            if (c != '0') dp[i] += dp[i-1];
            if (p == '*') dp[i] += (c <= '6' ? 2 : 1) * dp[i-2];
            else if (p == '1' || (p == '2' && c <= '6')) dp[i] += dp[i-2];
        }
        dp[i] %= MOD;
    }
    return (int) dp[n];
}`,
  },

  defaultInput: { s: '1*2' },

  inputFields: [
    {
      name: 's',
      label: 'Encoded String',
      type: 'string',
      defaultValue: '1*2',
      placeholder: '1*2',
      helperText: 'String of digits and * wildcards to decode',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const MOD = 1_000_000_007;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = Array(n + 1).fill(0);
    dp[0] = 1;
    dp[1] = s[0] === '*' ? 9 : s[0] === '0' ? 0 : 1;

    const makeViz = (activeIdx: number): DPVisualization => ({
      type: 'dp-table',
      values: [...dp],
      highlights: Object.fromEntries(dp.map((_, i) => [i, i === activeIdx ? 'active' : i < activeIdx ? 'found' : 'default'])),
      labels: Array.from({ length: n + 1 }, (_, i) => i === 0 ? 'base' : `[${i - 1}]=${s[i - 1]}`),
    });

    steps.push({
      line: 3,
      explanation: `dp[0]=1 (empty string base case). dp[1]=${dp[1]} for first char "${s[0]}" (${"*"===s[0]?"wildcard gives 9 choices":s[0]==="0"?"zero: invalid":"one valid decoding"}).`,
      variables: { 'dp[0]': dp[0], 'dp[1]': dp[1] },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      const c = s[i - 1];
      const p = s[i - 2];

      if (c === '*') {
        dp[i] += 9 * dp[i - 1];
        if (p === '*') dp[i] += 15 * dp[i - 2];
        else if (p === '1') dp[i] += 9 * dp[i - 2];
        else if (p === '2') dp[i] += 6 * dp[i - 2];
      } else {
        if (c !== '0') dp[i] += dp[i - 1];
        if (p === '*') dp[i] += (c <= '6' ? 2 : 1) * dp[i - 2];
        else if (p === '1' || (p === '2' && c <= '6')) dp[i] += dp[i - 2];
      }
      dp[i] %= MOD;

      steps.push({
        line: 10,
        explanation: `i=${i}: char "${c}", prev "${p}". dp[${i}]=${dp[i]} (mod 10^9+7).`,
        variables: { i, char: c, prev: p, [`dp[${i}]`]: dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 11,
      explanation: `Total decode ways for "${s}" = dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: {
        type: 'dp-table',
        values: [...dp],
        highlights: { [n]: 'found' },
        labels: Array.from({ length: n + 1 }, (_, i) => i === 0 ? 'base' : `[${i - 1}]=${s[i - 1]}`),
      },
    });

    return steps;
  },
};

export default decodeWaysIi;
