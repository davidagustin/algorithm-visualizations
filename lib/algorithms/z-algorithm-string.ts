import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const zAlgorithmString: AlgorithmDefinition = {
  id: 'z-algorithm-string',
  title: 'Z-Algorithm String Matching',
  difficulty: 'Medium',
  category: 'String',
  description:
    'The Z-algorithm computes the Z-array where Z[i] is the length of the longest substring starting from s[i] that is also a prefix of s. Pattern matching: concatenate pattern+"#"+text, then find Z[i] == pattern.length.',
  tags: ['string', 'z-algorithm', 'pattern matching', 'prefix'],
  code: {
    pseudocode: `function buildZ(s):
  z = [0]*len(s); z[0] = len(s)
  l = r = 0
  for i in 1..len(s)-1:
    if i < r: z[i] = min(r-i, z[i-l])
    while i+z[i] < len(s) and s[z[i]] == s[i+z[i]]:
      z[i]++
    if i+z[i] > r: l=i; r=i+z[i]
  return z

function zSearch(text, pattern):
  s = pattern + '#' + text
  z = buildZ(s)
  matches = []
  m = len(pattern)
  for i in m+1..len(s)-1:
    if z[i] == m: matches.append(i - m - 1)
  return matches`,
    python: `def zSearch(text, pattern):
    s = pattern + '#' + text
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
    m = len(pattern)
    return [i - m - 1 for i in range(m + 1, n) if z[i] == m]`,
    javascript: `function zSearch(text, pattern) {
  const s = pattern + '#' + text;
  const n = s.length, z = new Array(n).fill(0);
  z[0] = n;
  let l = 0, r = 0;
  for (let i = 1; i < n; i++) {
    if (i < r) z[i] = Math.min(r - i, z[i - l]);
    while (i + z[i] < n && s[z[i]] === s[i + z[i]]) z[i]++;
    if (i + z[i] > r) { l = i; r = i + z[i]; }
  }
  const m = pattern.length;
  return [...Array(n - m - 1).keys()].map(i => i + m + 1)
    .filter(i => z[i] === m).map(i => i - m - 1);
}`,
    java: `public List<Integer> zSearch(String text, String pattern) {
    String s = pattern + "#" + text;
    int n = s.length();
    int[] z = new int[n];
    z[0] = n;
    int l = 0, r = 0;
    for (int i = 1; i < n; i++) {
        if (i < r) z[i] = Math.min(r - i, z[i - l]);
        while (i + z[i] < n && s.charAt(z[i]) == s.charAt(i + z[i])) z[i]++;
        if (i + z[i] > r) { l = i; r = i + z[i]; }
    }
    int m = pattern.length();
    List<Integer> res = new ArrayList<>();
    for (int i = m + 1; i < n; i++)
        if (z[i] == m) res.add(i - m - 1);
    return res;
}`,
  },
  defaultInput: { text: 'aabxaaabxaaabxaab', pattern: 'aab' },
  inputFields: [
    { name: 'text', label: 'Text', type: 'string', defaultValue: 'aabxaaabxaaabxaab', placeholder: 'aabxaaabxaaabxaab', helperText: 'Text to search in' },
    { name: 'pattern', label: 'Pattern', type: 'string', defaultValue: 'aab', placeholder: 'aab', helperText: 'Pattern to search for' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const pattern = input.pattern as string;
    const steps: AlgorithmStep[] = [];
    const combined = pattern + '#' + text;
    const n = combined.length;
    const z: number[] = new Array(n).fill(0);
    z[0] = n;
    let l = 0, r = 0;

    const makeViz = (pos: number, z: number[], matches: number[]): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      matches.forEach(m => {
        const start = m + pattern.length + 1;
        for (let x = start; x < start + pattern.length; x++) highlights[x] = 'found';
      });
      if (pos < n) highlights[pos] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = combined[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => z[x]),
        highlights,
        labels,
        auxData: {
          label: 'Z-Array',
          entries: [
            { key: 'combined', value: combined },
            { key: 'pos', value: String(pos) },
            { key: 'z[pos]', value: pos < n ? String(z[pos]) : '-' },
            { key: 'matches', value: matches.join(', ') || 'none' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Build Z-array for combined string: "${combined}" (pattern="#"text).`,
      variables: { combined, pattern, text },
      visualization: makeViz(0, [...z], []),
    });

    const m = pattern.length;
    const matches: number[] = [];

    for (let i = 1; i < n; i++) {
      if (i < r) z[i] = Math.min(r - i, z[i - l]);
      while (i + z[i] < n && combined[z[i]] === combined[i + z[i]]) z[i]++;
      if (i + z[i] > r) { l = i; r = i + z[i]; }

      if (z[i] === m) {
        const matchIdx = i - m - 1;
        matches.push(matchIdx);
        steps.push({
          line: 16,
          explanation: `Z[${i}]=${z[i]} equals pattern length ${m}. Pattern found at text index ${matchIdx}!`,
          variables: { i, zValue: z[i], matchAt: matchIdx },
          visualization: makeViz(i, [...z], [...matches]),
        });
      } else if (i < m) {
        steps.push({
          line: 5,
          explanation: `Z[${i}]=${z[i]}: in pattern region. Length of prefix match from position ${i}.`,
          variables: { i, zValue: z[i], l, r },
          visualization: makeViz(i, [...z], matches),
        });
      }
    }

    steps.push({
      line: 18,
      explanation: `Z-algorithm done. Found ${matches.length} match(es) at text indices: [${matches.join(', ')}].`,
      variables: { matches: [...matches] },
      visualization: makeViz(n, [...z], matches),
    });

    return steps;
  },
};

export default zAlgorithmString;
