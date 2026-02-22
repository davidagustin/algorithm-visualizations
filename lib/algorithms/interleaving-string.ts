import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const interleavingString: AlgorithmDefinition = {
  id: 'interleaving-string',
  title: 'Interleaving String',
  leetcodeNumber: 97,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given strings s1, s2, and s3, determine if s3 is formed by interleaving s1 and s2. dp[i][j] = true if s3[0..i+j-1] can be formed by interleaving s1[0..i-1] and s2[0..j-1]. Flattened to 1D for visualization.',
  tags: ['Dynamic Programming', 'String'],
  code: {
    pseudocode: `function isInterleave(s1, s2, s3):
  m, n = len(s1), len(s2)
  if m + n != len(s3): return false
  dp[i][j] = true if s3[0..i+j-1] interleaves s1[0..i-1] & s2[0..j-1]
  dp[0][0] = true
  for i from 0 to m:
    for j from 0 to n:
      if i > 0: dp[i][j] |= dp[i-1][j] and s1[i-1]==s3[i+j-1]
      if j > 0: dp[i][j] |= dp[i][j-1] and s2[j-1]==s3[i+j-1]
  return dp[m][n]`,
    python: `def isInterleave(s1, s2, s3):
    m, n = len(s1), len(s2)
    if m + n != len(s3): return False
    dp = [[False]*(n+1) for _ in range(m+1)]
    dp[0][0] = True
    for i in range(m+1):
        for j in range(n+1):
            if i > 0:
                dp[i][j] = dp[i][j] or (dp[i-1][j] and s1[i-1] == s3[i+j-1])
            if j > 0:
                dp[i][j] = dp[i][j] or (dp[i][j-1] and s2[j-1] == s3[i+j-1])
    return dp[m][n]`,
    javascript: `function isInterleave(s1, s2, s3) {
  const m = s1.length, n = s2.length;
  if (m + n !== s3.length) return false;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(false));
  dp[0][0] = true;
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j <= n; j++) {
      if (i > 0) dp[i][j] = dp[i][j] || (dp[i-1][j] && s1[i-1] === s3[i+j-1]);
      if (j > 0) dp[i][j] = dp[i][j] || (dp[i][j-1] && s2[j-1] === s3[i+j-1]);
    }
  }
  return dp[m][n];
}`,
    java: `public boolean isInterleave(String s1, String s2, String s3) {
    int m = s1.length(), n = s2.length();
    if (m + n != s3.length()) return false;
    boolean[][] dp = new boolean[m+1][n+1];
    dp[0][0] = true;
    for (int i = 0; i <= m; i++) {
        for (int j = 0; j <= n; j++) {
            if (i > 0) dp[i][j] |= dp[i-1][j] && s1.charAt(i-1) == s3.charAt(i+j-1);
            if (j > 0) dp[i][j] |= dp[i][j-1] && s2.charAt(j-1) == s3.charAt(i+j-1);
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { s1: 'aab', s2: 'axy', s3: 'aaxyab' },
  inputFields: [
    {
      name: 's1',
      label: 'String s1',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'First string',
    },
    {
      name: 's2',
      label: 'String s2',
      type: 'string',
      defaultValue: 'axy',
      placeholder: 'axy',
      helperText: 'Second string',
    },
    {
      name: 's3',
      label: 'String s3',
      type: 'string',
      defaultValue: 'aaxyab',
      placeholder: 'aaxyab',
      helperText: 'Target interleaved string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const s3 = input.s3 as string;
    const m = s1.length;
    const n = s2.length;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Interleaving String: s1="${s1}", s2="${s2}", s3="${s3}". Is s3 an interleaving of s1 and s2?`,
      variables: { s1, s2, s3, m, n, 's3.length': s3.length },
      visualization: {
        type: 'dp-table',
        values: [m + n, s3.length],
        highlights: { 0: 'active', 1: 'active' },
        labels: ['m+n', '|s3|'],
      },
    });

    if (m + n !== s3.length) {
      steps.push({
        line: 2,
        explanation: `len(s1)+len(s2)=${m + n} != len(s3)=${s3.length}. Impossible to interleave. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'dp-table',
          values: [m + n, s3.length],
          highlights: { 0: 'mismatch', 1: 'mismatch' },
          labels: ['m+n', '|s3|'],
        },
      });
      return steps;
    }

    const dp: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    const filled: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));
    const flatIdx = (i: number, j: number) => i * (n + 1) + j;
    const totalCells = (m + 1) * (n + 1);

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          arr.push(filled[i][j] ? (dp[i][j] ? 1 : 0) : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
          if (i === 0 && j === 0) labels.push('""');
          else if (i === 0) labels.push(s2[j - 1]);
          else if (j === 0) labels.push(s1[i - 1]);
          else labels.push(`(${i},${j})`);
        }
      }
      return labels;
    }

    function makeViz(activeIdx: number | null, comparingIndices: number[]): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let k = 0; k < totalCells; k++) {
        const i = Math.floor(k / (n + 1));
        const j = k % (n + 1);
        if (filled[i][j]) highlights[k] = dp[i][j] ? 'found' : 'mismatch';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    dp[0][0] = true;
    filled[0][0] = true;
    steps.push({
      line: 4,
      explanation: 'dp[0][0] = true. Empty s1 and empty s2 interleave to form empty s3.',
      variables: {},
      visualization: makeViz(flatIdx(0, 0), []),
    });

    for (let i = 0; i <= m; i++) {
      for (let j = 0; j <= n; j++) {
        if (i === 0 && j === 0) continue;
        const k = flatIdx(i, j);
        const comparing: number[] = [];

        if (i > 0) {
          comparing.push(flatIdx(i - 1, j));
          if (dp[i - 1][j] && s1[i - 1] === s3[i + j - 1]) {
            dp[i][j] = true;
          }
        }
        if (j > 0) {
          comparing.push(flatIdx(i, j - 1));
          if (dp[i][j - 1] && s2[j - 1] === s3[i + j - 1]) {
            dp[i][j] = true;
          }
        }
        filled[i][j] = true;

        const s3char = s3[i + j - 1];
        steps.push({
          line: 6,
          explanation: `dp[${i}][${j}]: s3[${i + j - 1}]='${s3char}'. ${i > 0 ? `s1[${i - 1}]='${s1[i - 1]}'${s1[i - 1] === s3char ? '==' : '!='}'${s3char}' ` : ''}${j > 0 ? `s2[${j - 1}]='${s2[j - 1]}'${s2[j - 1] === s3char ? '==' : '!='}'${s3char}'` : ''}. Result: ${dp[i][j]}.`,
          variables: { i, j, 'dp[i][j]': dp[i][j] },
          visualization: makeViz(k, comparing),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[${m}][${n}] = ${dp[m][n]}. s3="${s3}" ${dp[m][n] ? 'IS' : 'IS NOT'} an interleaving of s1="${s1}" and s2="${s2}".`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => {
            const i = Math.floor(k / (n + 1));
            const j = k % (n + 1);
            if (k === flatIdx(m, n)) return [k, 'active'];
            if (filled[i][j]) return [k, dp[i][j] ? 'found' : 'mismatch'];
            return [k, 'default'];
          })
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default interleavingString;
