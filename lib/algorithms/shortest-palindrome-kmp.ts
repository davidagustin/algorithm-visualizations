import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestPalindromeKmp: AlgorithmDefinition = {
  id: 'shortest-palindrome-kmp',
  title: 'Shortest Palindrome (KMP)',
  leetcodeNumber: 214,
  difficulty: 'Hard',
  category: 'String',
  description:
    'Find the shortest palindrome by adding characters in front of the given string. Key insight: find the longest palindromic prefix using KMP on the string combined with its reverse. Prepend the remaining suffix reversed.',
  tags: ['string', 'kmp', 'palindrome', 'failure function'],
  code: {
    pseudocode: `function shortestPalindrome(s):
  rev = reverse(s)
  combined = s + '#' + rev
  lps = buildKMPTable(combined)
  // lps[-1] = length of longest palindromic prefix
  palindromicPrefixLen = lps[len(combined)-1]
  suffix = s[palindromicPrefixLen:]
  return reverse(suffix) + s`,
    python: `def shortestPalindrome(s):
    rev = s[::-1]
    combined = s + '#' + rev
    n = len(combined)
    lps = [0] * n
    j = 0
    for i in range(1, n):
        while j > 0 and combined[i] != combined[j]:
            j = lps[j - 1]
        if combined[i] == combined[j]:
            j += 1
        lps[i] = j
    pal_len = lps[-1]
    return s[pal_len:][::-1] + s`,
    javascript: `function shortestPalindrome(s) {
  const rev = s.split('').reverse().join('');
  const combined = s + '#' + rev;
  const n = combined.length;
  const lps = new Array(n).fill(0);
  let j = 0;
  for (let i = 1; i < n; i++) {
    while (j > 0 && combined[i] !== combined[j]) j = lps[j - 1];
    if (combined[i] === combined[j]) j++;
    lps[i] = j;
  }
  const palLen = lps[n - 1];
  return s.slice(palLen).split('').reverse().join('') + s;
}`,
    java: `public String shortestPalindrome(String s) {
    String rev = new StringBuilder(s).reverse().toString();
    String combined = s + "#" + rev;
    int n = combined.length();
    int[] lps = new int[n];
    int j = 0;
    for (int i = 1; i < n; i++) {
        while (j > 0 && combined.charAt(i) != combined.charAt(j)) j = lps[j-1];
        if (combined.charAt(i) == combined.charAt(j)) j++;
        lps[i] = j;
    }
    int palLen = lps[n - 1];
    return new StringBuilder(s.substring(palLen)).reverse().toString() + s;
}`,
  },
  defaultInput: { s: 'aacecaaa' },
  inputFields: [
    { name: 's', label: 'String', type: 'string', defaultValue: 'aacecaaa', placeholder: 'aacecaaa', helperText: 'Input string to make shortest palindrome' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const rev = s.split('').reverse().join('');
    const combined = s + '#' + rev;
    const n = combined.length;
    const lps: number[] = new Array(n).fill(0);
    const steps: AlgorithmStep[] = [];

    const makeViz = (pos: number, lps: number[], result: string): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      if (pos < n) highlights[pos] = 'active';
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = combined[x];
      return {
        type: 'array',
        array: [...lps],
        highlights,
        labels,
        auxData: {
          label: 'KMP on combined string',
          entries: [
            { key: 'combined', value: combined },
            { key: 'pos', value: String(pos) },
            { key: 'lps[-1]', value: String(lps[n - 1]) },
            { key: 'result', value: result || '...' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `s="${s}", rev="${rev}". Combined: "${combined}". Build KMP failure function to find longest palindromic prefix.`,
      variables: { s, rev, combined },
      visualization: makeViz(0, [...lps], ''),
    });

    let j = 0;
    for (let i = 1; i < n; i++) {
      while (j > 0 && combined[i] !== combined[j]) j = lps[j - 1];
      if (combined[i] === combined[j]) j++;
      lps[i] = j;
    }

    steps.push({
      line: 6,
      explanation: `LPS table built. lps[last]=${lps[n - 1]}: longest palindromic prefix of "${s}" has length ${lps[n - 1]}.`,
      variables: { lps: [...lps], palindromicPrefixLen: lps[n - 1] },
      visualization: makeViz(n - 1, [...lps], ''),
    });

    const palLen = lps[n - 1];
    const suffix = s.slice(palLen);
    const toAdd = suffix.split('').reverse().join('');
    const result = toAdd + s;

    steps.push({
      line: 8,
      explanation: `Palindromic prefix: "${s.slice(0, palLen)}". Suffix to prepend (reversed): "${toAdd}". Result: "${result}".`,
      variables: { palindromicPrefix: s.slice(0, palLen), suffix, toAdd, result },
      visualization: makeViz(-1, [...lps], result),
    });

    return steps;
  },
};

export default shortestPalindromeKmp;
