import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const editDistance: AlgorithmDefinition = {
  id: 'edit-distance',
  title: 'Edit Distance',
  leetcodeNumber: 72,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given two strings word1 and word2, return the minimum number of operations (insert, delete, replace) to convert word1 to word2. Uses a 2D DP table where dp[i][j] = min operations to convert word1[0..i-1] to word2[0..j-1].',
  tags: ['Dynamic Programming', 'String'],
  code: {
    pseudocode: `function minDistance(word1, word2):
  m = len(word1), n = len(word2)
  dp[i][0] = i, dp[0][j] = j  (base cases)
  for i from 1 to m:
    for j from 1 to n:
      if word1[i-1] == word2[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
  return dp[m][n]`,
    python: `def minDistance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0]*(n+1) for _ in range(m+1)]
    for i in range(m+1): dp[i][0] = i
    for j in range(n+1): dp[0][j] = j
    for i in range(1, m+1):
        for j in range(1, n+1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[m][n]`,
    javascript: `function minDistance(word1, word2) {
  const m = word1.length, n = word2.length;
  const dp = Array.from({length: m+1}, (_, i) =>
    Array.from({length: n+1}, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (word1[i-1] === word2[j-1]) {
        dp[i][j] = dp[i-1][j-1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
      }
    }
  }
  return dp[m][n];
}`,
    java: `public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m+1][n+1];
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i-1) == word2.charAt(j-1))
                dp[i][j] = dp[i-1][j-1];
            else
                dp[i][j] = 1 + Math.min(dp[i-1][j-1], Math.min(dp[i-1][j], dp[i][j-1]));
        }
    }
    return dp[m][n];
}`,
  },
  defaultInput: { word1: 'horse', word2: 'ros' },
  inputFields: [
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'horse',
      placeholder: 'horse',
      helperText: 'Source string to convert from',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'ros',
      placeholder: 'ros',
      helperText: 'Target string to convert to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const m = word1.length;
    const n = word2.length;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    const flatIdx = (i: number, j: number) => i * (n + 1) + j;
    const totalCells = (m + 1) * (n + 1);

    // Track which cells are filled
    const filled: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));

    function flatVals(): (number | null)[] {
      const arr: (number | null)[] = [];
      for (let i = 0; i <= m; i++)
        for (let j = 0; j <= n; j++)
          arr.push(filled[i][j] ? dp[i][j] : null);
      return arr;
    }

    function makeLabels(): string[] {
      const labels: string[] = [];
      for (let i = 0; i <= m; i++) {
        for (let j = 0; j <= n; j++) {
          if (i === 0 && j === 0) labels.push('""');
          else if (i === 0) labels.push(word2[j - 1]);
          else if (j === 0) labels.push(word1[i - 1]);
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
        if (filled[i][j]) highlights[k] = 'found';
      }
      for (const ci of comparingIndices) highlights[ci] = 'comparing';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: flatVals(), highlights, labels: makeLabels() };
    }

    steps.push({
      line: 1,
      explanation: `Edit Distance: convert "${word1}" to "${word2}". Build ${m + 1}x${n + 1} table. dp[i][j] = min ops to convert word1[0..i-1] to word2[0..j-1].`,
      variables: { word1, word2, m, n },
      visualization: makeViz(null, []),
    });

    // Base cases: first column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
      filled[i][0] = true;
    }
    // Base cases: first row
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
      filled[0][j] = true;
    }

    steps.push({
      line: 2,
      explanation: `Base cases: dp[i][0] = i (delete i chars) and dp[0][j] = j (insert j chars). Converting to/from empty string.`,
      variables: {},
      visualization: makeViz(null, []),
    });

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const comparing = [flatIdx(i - 1, j), flatIdx(i, j - 1), flatIdx(i - 1, j - 1)];

        if (word1[i - 1] === word2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
          filled[i][j] = true;
          steps.push({
            line: 6,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' == word2[${j - 1}]='${word2[j - 1]}'. Match! dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j]}. No operation needed.`,
            variables: { i, j, char: word1[i - 1], 'dp[i][j]': dp[i][j] },
            visualization: makeViz(flatIdx(i, j), [flatIdx(i - 1, j - 1)]),
          });
        } else {
          const del = dp[i - 1][j];
          const ins = dp[i][j - 1];
          const rep = dp[i - 1][j - 1];
          dp[i][j] = 1 + Math.min(del, ins, rep);
          filled[i][j] = true;
          const opName = rep <= del && rep <= ins ? 'replace' : del <= ins ? 'delete' : 'insert';
          steps.push({
            line: 8,
            explanation: `word1[${i - 1}]='${word1[i - 1]}' != word2[${j - 1}]='${word2[j - 1]}'. dp[${i}][${j}] = 1 + min(del=${del}, ins=${ins}, rep=${rep}) = ${dp[i][j]}. Best: ${opName}.`,
            variables: { i, j, del, ins, rep, 'dp[i][j]': dp[i][j] },
            visualization: makeViz(flatIdx(i, j), comparing),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `dp[${m}][${n}] = ${dp[m][n]}. Minimum ${dp[m][n]} operation(s) to convert "${word1}" to "${word2}".`,
      variables: { result: dp[m][n] },
      visualization: {
        type: 'dp-table',
        values: flatVals(),
        highlights: Object.fromEntries(
          Array.from({ length: totalCells }, (_, k) => [
            k,
            k === flatIdx(m, n) ? 'active' : 'found',
          ])
        ),
        labels: makeLabels(),
      },
    });

    return steps;
  },
};

export default editDistance;
