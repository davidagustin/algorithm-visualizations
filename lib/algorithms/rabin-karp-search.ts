import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rabinKarpSearch: AlgorithmDefinition = {
  id: 'rabin-karp-search',
  title: 'Rabin-Karp String Search',
  difficulty: 'Medium',
  category: 'String',
  description:
    'Rabin-Karp uses rolling hash to search for a pattern in a text. The hash of the current window is computed in O(1) by subtracting the outgoing character and adding the incoming character. Average O(n+m), worst O(nm).',
  tags: ['string', 'rolling hash', 'rabin-karp', 'pattern matching'],
  code: {
    pseudocode: `function rabinKarp(text, pattern):
  BASE = 256, MOD = 1e9+7
  m = len(pattern), n = len(text)
  h = BASE^(m-1) mod MOD
  patHash = windowHash = 0
  for i in 0..m-1:
    patHash = (BASE*patHash + pattern[i]) % MOD
    windowHash = (BASE*windowHash + text[i]) % MOD
  for i in 0..n-m:
    if patHash == windowHash:
      if text[i:i+m] == pattern: record match at i
    if i < n-m:
      windowHash = (BASE*(windowHash - text[i]*h) + text[i+m]) % MOD`,
    python: `def rabinKarp(text, pattern):
    BASE, MOD = 256, 10**9 + 7
    m, n = len(pattern), len(text)
    if m > n: return []
    h = pow(BASE, m - 1, MOD)
    pat_hash = win_hash = 0
    for i in range(m):
        pat_hash = (BASE * pat_hash + ord(pattern[i])) % MOD
        win_hash = (BASE * win_hash + ord(text[i])) % MOD
    matches = []
    for i in range(n - m + 1):
        if pat_hash == win_hash and text[i:i+m] == pattern:
            matches.append(i)
        if i < n - m:
            win_hash = (BASE * (win_hash - ord(text[i]) * h) + ord(text[i + m])) % MOD
    return matches`,
    javascript: `function rabinKarp(text, pattern) {
  const BASE = 256, MOD = 1e9 + 7;
  const m = pattern.length, n = text.length;
  if (m > n) return [];
  let h = 1;
  for (let i = 0; i < m - 1; i++) h = (h * BASE) % MOD;
  let patHash = 0, winHash = 0;
  for (let i = 0; i < m; i++) {
    patHash = (BASE * patHash + pattern.charCodeAt(i)) % MOD;
    winHash = (BASE * winHash + text.charCodeAt(i)) % MOD;
  }
  const matches = [];
  for (let i = 0; i <= n - m; i++) {
    if (patHash === winHash && text.slice(i, i + m) === pattern)
      matches.push(i);
    if (i < n - m)
      winHash = (BASE * (winHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % MOD;
  }
  return matches;
}`,
    java: `public List<Integer> rabinKarp(String text, String pattern) {
    final int BASE = 256, MOD = 1_000_000_007;
    int m = pattern.length(), n = text.length();
    long h = 1;
    for (int i = 0; i < m - 1; i++) h = (h * BASE) % MOD;
    long patHash = 0, winHash = 0;
    for (int i = 0; i < m; i++) {
        patHash = (BASE * patHash + pattern.charAt(i)) % MOD;
        winHash = (BASE * winHash + text.charAt(i)) % MOD;
    }
    List<Integer> matches = new ArrayList<>();
    for (int i = 0; i <= n - m; i++) {
        if (patHash == winHash && text.substring(i, i + m).equals(pattern))
            matches.add(i);
        if (i < n - m)
            winHash = (BASE * (winHash - text.charAt(i) * h) + text.charAt(i + m)) % MOD;
    }
    return matches;
}`,
  },
  defaultInput: { text: 'abcabdabc', pattern: 'abc' },
  inputFields: [
    { name: 'text', label: 'Text', type: 'string', defaultValue: 'abcabdabc', placeholder: 'abcabdabc', helperText: 'Text to search in' },
    { name: 'pattern', label: 'Pattern', type: 'string', defaultValue: 'abc', placeholder: 'abc', helperText: 'Pattern to search for' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const pattern = input.pattern as string;
    const steps: AlgorithmStep[] = [];
    const BASE = 256, MOD = 1e9 + 7;
    const m = pattern.length, n = text.length;

    const makeViz = (windowStart: number, matches: number[], highlight: string = 'active'): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      matches.forEach(mi => { for (let x = mi; x < mi + m; x++) highlights[x] = 'found'; });
      for (let x = windowStart; x < Math.min(windowStart + m, n); x++) {
        if (!highlights[x]) highlights[x] = highlight;
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = text[x];
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'Rabin-Karp',
          entries: [
            { key: 'window', value: text.slice(windowStart, windowStart + m) },
            { key: 'pattern', value: pattern },
            { key: 'matches at', value: matches.join(', ') || 'none' },
          ],
        },
      };
    };

    let h = 1;
    for (let i = 0; i < m - 1; i++) h = (h * BASE) % MOD;
    let patHash = 0, winHash = 0;
    for (let i = 0; i < m; i++) {
      patHash = (BASE * patHash + pattern.charCodeAt(i)) % MOD;
      winHash = (BASE * winHash + text.charCodeAt(i)) % MOD;
    }

    steps.push({
      line: 1,
      explanation: `Pattern="${pattern}", Text="${text}". Initial hashes computed. patHash=${Math.round(patHash)}, winHash=${Math.round(winHash)}.`,
      variables: { patHash, winHash, m, n },
      visualization: makeViz(0, []),
    });

    const matches: number[] = [];
    for (let i = 0; i <= n - m; i++) {
      const isHashMatch = Math.round(patHash) === Math.round(winHash);
      const isActualMatch = isHashMatch && text.slice(i, i + m) === pattern;

      if (isActualMatch) {
        matches.push(i);
        steps.push({
          line: 10,
          explanation: `Hash match AND character match at index ${i}: "${text.slice(i, i + m)}" == "${pattern}". Match recorded!`,
          variables: { i, windowHash: Math.round(winHash), patternHash: Math.round(patHash) },
          visualization: makeViz(i, [...matches], 'match'),
        });
      } else if (isHashMatch) {
        steps.push({
          line: 10,
          explanation: `Hash collision at index ${i}: hashes equal but "${text.slice(i, i + m)}" != "${pattern}". False positive!`,
          variables: { i, windowHash: Math.round(winHash), patternHash: Math.round(patHash) },
          visualization: makeViz(i, matches, 'comparing'),
        });
      } else {
        steps.push({
          line: 9,
          explanation: `Window [${i}..${i + m - 1}]="${text.slice(i, i + m)}". winHash=${Math.round(winHash)} != patHash=${Math.round(patHash)}. No match.`,
          variables: { i, windowHash: Math.round(winHash), patternHash: Math.round(patHash) },
          visualization: makeViz(i, matches, 'active'),
        });
      }

      if (i < n - m) {
        winHash = (BASE * (winHash - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % MOD;
        if (winHash < 0) winHash += MOD;
      }
    }

    steps.push({
      line: 14,
      explanation: `Rabin-Karp done. Found ${matches.length} match(es) at: [${matches.join(', ')}].`,
      variables: { matches: [...matches] },
      visualization: makeViz(n, matches),
    });

    return steps;
  },
};

export default rabinKarpSearch;
