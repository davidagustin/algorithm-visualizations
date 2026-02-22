import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestPalindromicSubstringManacher: AlgorithmDefinition = {
  id: 'longest-palindromic-substring-manacher',
  title: "Longest Palindromic Substring (Manacher's)",
  leetcodeNumber: 5,
  difficulty: 'Hard',
  category: 'String',
  description:
    "Manacher's algorithm finds the longest palindromic substring in O(n) time. It transforms the string by inserting '#' between characters, then computes palindrome radii using a center-mirror trick to avoid recomputation.",
  tags: ['string', 'manacher', 'palindrome', 'linear time'],
  code: {
    pseudocode: `function manacher(s):
  t = '#' + '#'.join(s) + '#'
  n = len(t), p = [0]*n
  c = r = 0
  for i in 1..n-1:
    mirror = 2*c - i
    if i < r: p[i] = min(r-i, p[mirror])
    while i+p[i]+1 < n and i-p[i]-1 >= 0
          and t[i+p[i]+1] == t[i-p[i]-1]:
      p[i]++
    if i+p[i] > r: c=i; r=i+p[i]
  best = max(p)
  center = p.index(best)
  return s[(center-best)//2 : (center+best)//2]`,
    python: `def longestPalindrome(s):
    t = '#' + '#'.join(s) + '#'
    n = len(t)
    p = [0] * n
    c = r = 0
    for i in range(1, n):
        mirror = 2 * c - i
        if i < r:
            p[i] = min(r - i, p[mirror])
        while i + p[i] + 1 < n and i - p[i] - 1 >= 0 and t[i + p[i] + 1] == t[i - p[i] - 1]:
            p[i] += 1
        if i + p[i] > r:
            c, r = i, i + p[i]
    best = max(p)
    center = p.index(best)
    return s[(center - best) // 2:(center + best) // 2]`,
    javascript: `function longestPalindrome(s) {
  const t = '#' + s.split('').join('#') + '#';
  const n = t.length, p = new Array(n).fill(0);
  let c = 0, r = 0;
  for (let i = 1; i < n; i++) {
    const mirror = 2 * c - i;
    if (i < r) p[i] = Math.min(r - i, p[mirror]);
    while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] === t[i - p[i] - 1])
      p[i]++;
    if (i + p[i] > r) { c = i; r = i + p[i]; }
  }
  const best = Math.max(...p);
  const center = p.indexOf(best);
  return s.slice((center - best) / 2, (center + best) / 2);
}`,
    java: `public String longestPalindrome(String s) {
    String t = "#" + String.join("#", s.split("")) + "#";
    int n = t.length();
    int[] p = new int[n];
    int c = 0, r = 0;
    for (int i = 1; i < n; i++) {
        int mirror = 2 * c - i;
        if (i < r) p[i] = Math.min(r - i, p[mirror]);
        while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t.charAt(i + p[i] + 1) == t.charAt(i - p[i] - 1))
            p[i]++;
        if (i + p[i] > r) { c = i; r = i + p[i]; }
    }
    int best = 0, center = 0;
    for (int i = 0; i < n; i++) if (p[i] > best) { best = p[i]; center = i; }
    return s.substring((center - best) / 2, (center + best) / 2);
}`,
  },
  defaultInput: { s: 'cbbd' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'cbbd', placeholder: 'cbbd', helperText: 'String to find longest palindrome in' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = '#' + s.split('').join('#') + '#';
    const n = t.length;
    const p: number[] = new Array(n).fill(0);
    const steps: AlgorithmStep[] = [];
    let c = 0, r = 0;

    const makeViz = (pos: number, p: number[], best: number, bestCenter: number): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (pos < n) highlights[pos] = 'active';
      for (let x = bestCenter - best; x <= bestCenter + best; x++) {
        if (x >= 0 && x < n && !highlights[x]) highlights[x] = 'sorted';
      }
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = t[x];
      return {
        type: 'array',
        array: [...p],
        highlights,
        labels,
        auxData: {
          label: "Manacher's P-array",
          entries: [
            { key: 'transformed', value: t },
            { key: 'center c', value: String(c) },
            { key: 'right bound r', value: String(r) },
            { key: 'best palindrome', value: bestCenter > 0 ? s.slice((bestCenter - best) / 2, (bestCenter + best) / 2) : '-' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Transform "${s}" to "${t}" by inserting '#'. Now find palindrome radii for each center.`,
      variables: { original: s, transformed: t },
      visualization: makeViz(-1, [...p], 0, 0),
    });

    let bestP = 0, bestC = 0;

    for (let i = 1; i < n; i++) {
      const mirror = 2 * c - i;
      if (i < r) p[i] = Math.min(r - i, p[mirror]);
      while (i + p[i] + 1 < n && i - p[i] - 1 >= 0 && t[i + p[i] + 1] === t[i - p[i] - 1]) p[i]++;
      if (i + p[i] > r) { c = i; r = i + p[i]; }
      if (p[i] > bestP) { bestP = p[i]; bestC = i; }

      if (p[i] > 0) {
        steps.push({
          line: 9,
          explanation: `Center ${i} ('${t[i]}'): palindrome radius p[${i}]=${p[i]}, covers "${t.slice(i - p[i], i + p[i] + 1)}".`,
          variables: { i, char: t[i], radius: p[i], c, r },
          visualization: makeViz(i, [...p], bestP, bestC),
        });
      }
    }

    const result = s.slice((bestC - bestP) / 2, (bestC + bestP) / 2);
    steps.push({
      line: 14,
      explanation: `Manacher's done. Longest palindrome: "${result}" (length ${bestP}).`,
      variables: { result, length: bestP },
      visualization: makeViz(-1, [...p], bestP, bestC),
    });

    return steps;
  },
};

export default longestPalindromicSubstringManacher;
