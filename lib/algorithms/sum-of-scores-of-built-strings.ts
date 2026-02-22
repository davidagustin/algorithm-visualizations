import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfScoresOfBuiltStrings: AlgorithmDefinition = {
  id: 'sum-of-scores-of-built-strings',
  title: 'Sum of Scores of Built Strings',
  leetcodeNumber: 2223,
  difficulty: 'Hard',
  category: 'String',
  description:
    'The score of a string is the length of the longest common prefix between the string and any of its suffixes. Sum the scores for all built strings s[0..i]. This equals Z[0] + sum(Z[i]) where Z is the Z-array, with Z[0]=n.',
  tags: ['string', 'z-algorithm', 'z-array', 'prefix'],
  code: {
    pseudocode: `function sumScores(s):
  n = len(s)
  z = buildZ(s)
  z[0] = n  // score of full string is n
  return sum(z)

function buildZ(s):
  n = len(s); z = [0]*n; l = r = 0
  for i in 1..n-1:
    if i < r: z[i] = min(r-i, z[i-l])
    while i+z[i] < n and s[z[i]] == s[i+z[i]]:
      z[i]++
    if i+z[i] > r: l=i; r=i+z[i]
  return z`,
    python: `def sumScores(s: str) -> int:
    n = len(s)
    z = [0] * n
    z[0] = n
    l = r = 0
    for i in range(1, n):
        if i < r:
            z[i] = min(r - i, z[i - l])
        while i + z[i] < n and s[z[i]] == s[i + z[i]]:
            z[i] += 1
        if i + z[i] > r:
            l, r = i, i + z[i]
    return sum(z)`,
    javascript: `function sumScores(s) {
  const n = s.length, z = new Array(n).fill(0);
  z[0] = n;
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  return z.reduce((a, b) => a + b, 0);
}`,
    java: `public long sumScores(String s) {
    int n = s.length();
    int[] z = new int[n];
    z[0] = n;
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = Math.min(r - i, z[i - l]);
        while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    long sum = 0;
    for (int x : z) sum += x;
    return sum;
}`,
  },
  defaultInput: { s: 'babab' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'babab', placeholder: 'babab', helperText: 'Compute sum of scores for all built strings' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    const z: number[] = new Array(n).fill(0);
    z[0] = n;
    let l = 0, r = 0;

    const makeViz = (pos: number, z: number[], runningSum: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (pos >= 0 && pos < n) highlights[pos] = 'active';
      if (z[pos] > 0 && pos > 0) {
        for (let x = pos; x < pos + z[pos]; x++) highlights[x] = 'match';
        for (let x = 0; x < z[pos]; x++) highlights[x] = highlights[x] || 'sorted';
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = s[x];
      return {
        type: 'array',
        array: [...z],
        highlights,
        labels,
        auxData: {
          label: 'Z-Array (Scores)',
          entries: [
            { key: 'pos', value: String(pos) },
            { key: 'z[pos]', value: pos >= 0 && pos < n ? String(z[pos]) : '-' },
            { key: 'running sum', value: String(runningSum) },
            { key: 'l, r', value: `${l}, ${r}` },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `s="${s}" (n=${n}). Z[0]=n=${n} (full string score). Build Z-array for remaining positions.`,
      variables: { s, n },
      visualization: makeViz(0, [...z], n),
    });

    let runningSum = n;

    for (let i = 1; i < n; i++) {
      if (i < r) z[i] = Math.min(r - i, z[i - l]);
      while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
      if (i + z[i] > r) { l = i; r = i + z[i]; }
      runningSum += z[i];

      steps.push({
        line: 8,
        explanation: `Z[${i}]=${z[i]}: suffix "${s.slice(i)}" shares ${z[i]} chars with prefix "${s.slice(0, z[i])}". Running sum: ${runningSum}.`,
        variables: { i, zValue: z[i], l, r, runningSum },
        visualization: makeViz(i, [...z], runningSum),
      });
    }

    steps.push({
      line: 5,
      explanation: `Sum of all scores: ${runningSum}. Z-array: [${z.join(', ')}].`,
      variables: { totalScore: runningSum, zArray: [...z] },
      visualization: makeViz(-1, [...z], runningSum),
    });

    return steps;
  },
};

export default sumOfScoresOfBuiltStrings;
