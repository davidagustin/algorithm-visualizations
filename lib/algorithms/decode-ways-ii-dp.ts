import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const decodeWaysIIDP: AlgorithmDefinition = {
  id: 'decode-ways-ii-dp',
  title: 'Decode Ways II',
  leetcodeNumber: 639,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    "Count ways to decode a string containing digits and '*' (wildcard for 1-9). dp[i] = number of ways to decode s[0..i-1]. '*' acts as any digit 1-9, affecting single and two-character decoding. Answer modulo 10^9+7.",
  tags: ['Dynamic Programming', 'String', 'State Machine'],
  code: {
    pseudocode: `function numDecodings(s):
  MOD = 1e9 + 7
  dp = array size n+1, dp[0]=1
  dp[1] = 9 if s[0]=='*' else (0 if s[0]=='0' else 1)
  for i from 2 to n:
    if s[i-1] == '*':
      dp[i] = 9 * dp[i-1]
      dp[i] += 15*dp[i-2] if s[i-2]=='*' else valid2char combinations
    else:
      if s[i-1] != '0': dp[i] += dp[i-1]
      add dp[i-2] for valid two-char decode
  return dp[n] % MOD`,
    python: `def numDecodings(s):
    MOD = 10**9 + 7
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 9 if s[0] == '*' else (0 if s[0] == '0' else 1)
    for i in range(2, n + 1):
        c, p = s[i-1], s[i-2]
        if c == '*':
            dp[i] = 9 * dp[i-1]
            if p == '*': dp[i] += 15 * dp[i-2]
            elif p == '1': dp[i] += 9 * dp[i-2]
            elif p == '2': dp[i] += 6 * dp[i-2]
        else:
            if c != '0': dp[i] = dp[i-1]
            digit = int(c)
            if p == '*':
                if digit <= 6: dp[i] += 2 * dp[i-2]
                else: dp[i] += dp[i-2]
            elif p != '0':
                two = int(p)*10 + digit
                if 10 <= two <= 26: dp[i] += dp[i-2]
        dp[i] %= MOD
    return dp[n]`,
    javascript: `function numDecodings(s) {
  const MOD = 1000000007;
  const n = s.length;
  const dp = new Array(n + 1).fill(0);
  dp[0] = 1;
  dp[1] = s[0] === '*' ? 9 : s[0] === '0' ? 0 : 1;
  for (let i = 2; i <= n; i++) {
    const c = s[i-1], p = s[i-2];
    if (c === '*') {
      dp[i] = 9 * dp[i-1] % MOD;
      if (p === '*') dp[i] = (dp[i] + 15 * dp[i-2]) % MOD;
      else if (p === '1') dp[i] = (dp[i] + 9 * dp[i-2]) % MOD;
      else if (p === '2') dp[i] = (dp[i] + 6 * dp[i-2]) % MOD;
    } else {
      if (c !== '0') dp[i] = dp[i-1];
      const d = parseInt(c);
      if (p === '*') dp[i] = (dp[i] + (d <= 6 ? 2 : 1) * dp[i-2]) % MOD;
      else if (p !== '0') {
        const two = parseInt(p)*10 + d;
        if (two >= 10 && two <= 26) dp[i] = (dp[i] + dp[i-2]) % MOD;
      }
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
            dp[i] = 9 * dp[i-1] % MOD;
            if (p == '*') dp[i] = (dp[i] + 15 * dp[i-2]) % MOD;
            else if (p == '1') dp[i] = (dp[i] + 9 * dp[i-2]) % MOD;
            else if (p == '2') dp[i] = (dp[i] + 6 * dp[i-2]) % MOD;
        } else {
            if (c != '0') dp[i] = dp[i-1];
            int d = c - '0';
            if (p == '*') dp[i] = (dp[i] + (d <= 6 ? 2 : 1) * dp[i-2]) % MOD;
            else if (p != '0') {
                int two = (p-'0')*10 + d;
                if (two >= 10 && two <= 26) dp[i] = (dp[i] + dp[i-2]) % MOD;
            }
        }
    }
    return (int) dp[n];
}`,
  },
  defaultInput: { s: '1*' },
  inputFields: [
    {
      name: 's',
      label: 'Encoded String',
      type: 'string',
      defaultValue: '1*',
      placeholder: 'e.g. 1*',
      helperText: 'String of digits and * wildcards to decode',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const MOD = 1000000007;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    const dp: number[] = new Array(n + 1).fill(0);
    const labels: string[] = Array.from({ length: n + 1 }, (_, i) => `dp[${i}]`);

    function makeViz(activeIdx: number): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i <= n; i++) {
        if (i === activeIdx) highlights[i] = 'active';
        else if (dp[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    dp[0] = 1;
    steps.push({
      line: 2,
      explanation: 'dp[0]=1 (empty string has one way to decode). Initialize dp array.',
      variables: { n, s, 'dp[0]': 1 },
      visualization: makeViz(0),
    });

    dp[1] = s[0] === '*' ? 9 : s[0] === '0' ? 0 : 1;
    steps.push({
      line: 3,
      explanation: `dp[1]=${dp[1]}. s[0]='${s[0]}': ${s[0] === '*' ? '9 ways (1-9)' : s[0] === '0' ? '0 ways (invalid)' : '1 way'}.`,
      variables: { 'dp[1]': dp[1] },
      visualization: makeViz(1),
    });

    for (let i = 2; i <= n; i++) {
      const c = s[i - 1];
      const p = s[i - 2];
      if (c === '*') {
        dp[i] = (9 * dp[i - 1]) % MOD;
        if (p === '*') dp[i] = (dp[i] + 15 * dp[i - 2]) % MOD;
        else if (p === '1') dp[i] = (dp[i] + 9 * dp[i - 2]) % MOD;
        else if (p === '2') dp[i] = (dp[i] + 6 * dp[i - 2]) % MOD;
      } else {
        if (c !== '0') dp[i] = dp[i - 1];
        const d = parseInt(c);
        if (p === '*') dp[i] = (dp[i] + (d <= 6 ? 2 : 1) * dp[i - 2]) % MOD;
        else if (p !== '0') {
          const two = parseInt(p) * 10 + d;
          if (two >= 10 && two <= 26) dp[i] = (dp[i] + dp[i - 2]) % MOD;
        }
      }
      dp[i] %= MOD;

      steps.push({
        line: 5,
        explanation: `dp[${i}]=${dp[i]}. s[${i - 1}]='${c}', s[${i - 2}]='${p}'. Combined single/double char decode.`,
        variables: { i, char: c, prev: p, 'dp[i]': dp[i] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 10,
      explanation: `Answer = dp[${n}] = ${dp[n]}. Total decode ways mod 10^9+7.`,
      variables: { result: dp[n] },
      visualization: makeViz(n),
    });

    return steps;
  },
};

export default decodeWaysIIDP;
