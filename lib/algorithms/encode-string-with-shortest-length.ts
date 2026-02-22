import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const encodeStringWithShortestLength: AlgorithmDefinition = {
  id: 'encode-string-with-shortest-length',
  title: 'Encode String with Shortest Length',
  leetcodeNumber: 471,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Encode a string to its shortest representation using the format k[encoded_string] where encoded_string is repeated k times. Uses interval DP: dp[i][j] = shortest encoding of s[i..j]. For each substring, try all splits and check if the string has a repeating pattern.',
  tags: ['dynamic programming', 'string', 'interval dp', 'encoding'],

  code: {
    pseudocode: `function encode(s):
  n = len(s)
  dp[i][j] = shortest encoding of s[i..j]
  for len from 1 to n:
    for i from 0 to n-len:
      j = i+len-1
      sub = s[i..j]
      dp[i][j] = sub (default: no encoding)
      t = sub+sub; pos = t.find(sub, 1)
      if pos < len: dp[i][j] = min by length with repeat encoding
      for m from i to j-1:
        candidate = dp[i][m] + dp[m+1][j]
        if len(candidate) < len(dp[i][j]): dp[i][j] = candidate
  return dp[0][n-1]`,
    python: `def encode(s: str) -> str:
    n = len(s)
    dp = [[''] * n for _ in range(n)]
    for length in range(1, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            sub = s[i:j+1]
            dp[i][j] = sub
            t = sub + sub
            pos = t.find(sub, 1)
            if pos < length:
                k = pos
                encoded = str(length // k) + '[' + dp[i][i+k-1] + ']'
                if len(encoded) < len(dp[i][j]):
                    dp[i][j] = encoded
            for m in range(i, j):
                candidate = dp[i][m] + dp[m+1][j]
                if len(candidate) < len(dp[i][j]):
                    dp[i][j] = candidate
    return dp[0][n-1]`,
    javascript: `function encode(s) {
  const n = s.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(''));
  for (let len = 1; len <= n; len++) {
    for (let i = 0; i <= n-len; i++) {
      const j = i+len-1;
      const sub = s.slice(i, j+1);
      dp[i][j] = sub;
      const t = sub+sub;
      const pos = t.indexOf(sub, 1);
      if (pos < len) {
        const encoded = (len/pos)+'['+dp[i][i+pos-1]+']';
        if (encoded.length < dp[i][j].length) dp[i][j] = encoded;
      }
      for (let m = i; m < j; m++) {
        const candidate = dp[i][m]+dp[m+1][j];
        if (candidate.length < dp[i][j].length) dp[i][j] = candidate;
      }
    }
  }
  return dp[0][n-1];
}`,
    java: `public String encode(String s) {
    int n = s.length();
    String[][] dp = new String[n][n];
    for (int len = 1; len <= n; len++) {
        for (int i = 0; i <= n-len; i++) {
            int j = i+len-1;
            String sub = s.substring(i, j+1);
            dp[i][j] = sub;
            String t = sub+sub;
            int pos = t.indexOf(sub, 1);
            if (pos < len) {
                String enc = (len/pos)+"["+dp[i][i+pos-1]+"]";
                if (enc.length() < dp[i][j].length()) dp[i][j] = enc;
            }
            for (int m = i; m < j; m++) {
                String c = dp[i][m]+dp[m+1][j];
                if (c.length() < dp[i][j].length()) dp[i][j] = c;
            }
        }
    }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'aabcaabcd',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aabcaabcd',
      placeholder: 'aabcaabcd',
      helperText: 'Input string to encode',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const chars = s.split('');

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: chars.map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Encode String: s="${s}". Find shortest encoding using k[pattern] notation.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    const dp: string[][] = Array.from({ length: n }, () => new Array(n).fill(''));

    for (let len = 1; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        const sub = s.slice(i, j + 1);
        dp[i][j] = sub;

        const t = sub + sub;
        const pos = t.indexOf(sub, 1);
        if (pos < len) {
          const encoded = (len / pos) + '[' + dp[i][i + pos - 1] + ']';
          if (encoded.length < dp[i][j].length) dp[i][j] = encoded;
        }

        for (let m = i; m < j; m++) {
          const candidate = dp[i][m] + dp[m + 1][j];
          if (candidate.length < dp[i][j].length) dp[i][j] = candidate;
        }

        if (len <= 4 || (i === 0 && j === n - 1)) {
          const highlights: Record<number, string> = {};
          for (let idx = i; idx <= j; idx++) highlights[idx] = 'comparing';
          highlights[i] = 'active';

          steps.push({
            line: 9,
            explanation: `dp[${i}][${j}]="${dp[i][j]}". Shortest encoding for "${sub}" (len ${len} -> encoded len ${dp[i][j].length}).`,
            variables: { i, j, substring: sub.slice(0, 10), encoded: dp[i][j].slice(0, 10) },
            visualization: makeViz(highlights, { [i]: dp[i][j].slice(0, 4) }),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Final encoding: "${dp[0][n - 1]}". Length reduced from ${n} to ${dp[0][n - 1].length}.`,
      variables: { original: s, encoded: dp[0][n - 1], 'length reduction': n - dp[0][n - 1].length },
      visualization: makeViz(
        Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        { 0: dp[0][n - 1].slice(0, 6) }
      ),
    });

    return steps;
  },
};

export default encodeStringWithShortestLength;
