import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestChunkedPalindromeDecomposition: AlgorithmDefinition = {
  id: 'longest-chunked-palindrome-decomposition',
  title: 'Longest Chunked Palindrome Decomposition',
  leetcodeNumber: 1147,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Return the largest possible k such that a string s can be split into k non-empty substrings s1, s2, ..., sk where si == s(k+1-i) for all i. Use a greedy two-pointer approach: match prefixes and suffixes greedily, incrementing the chunk count for each matching pair.',
  tags: ['dynamic programming', 'greedy', 'string', 'two pointers', 'recursion'],

  code: {
    pseudocode: `function longestDecomposition(s):
  left = 0, right = len(s)-1
  count = 0
  l = "", r = ""
  while left <= right:
    l = l + s[left]
    r = s[right] + r
    if l == r:
      count += 2 if left < right else 1
      l = "", r = ""
    left++, right--
  return count`,
    python: `def longestDecomposition(s: str) -> int:
    left, right = 0, len(s) - 1
    count = 0
    l, r = "", ""
    while left <= right:
        l += s[left]
        r = s[right] + r
        if l == r:
            count += 2 if left < right else 1
            l, r = "", ""
        left += 1
        right -= 1
    return count`,
    javascript: `function longestDecomposition(s) {
  let left = 0, right = s.length - 1;
  let count = 0, l = "", r = "";
  while (left <= right) {
    l += s[left];
    r = s[right] + r;
    if (l === r) {
      count += left < right ? 2 : 1;
      l = ""; r = "";
    }
    left++; right--;
  }
  return count;
}`,
    java: `public int longestDecomposition(String s) {
    int left = 0, right = s.length() - 1, count = 0;
    StringBuilder l = new StringBuilder(), r = new StringBuilder();
    while (left <= right) {
        l.append(s.charAt(left));
        r.insert(0, s.charAt(right));
        if (l.toString().equals(r.toString())) {
            count += left < right ? 2 : 1;
            l.setLength(0); r.setLength(0);
        }
        left++; right--;
    }
    return count;
}`,
  },

  defaultInput: {
    s: 'ghiabcdefhelloadamhelloabcdefghi',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'ghiabcdefhelloadamhelloabcdefghi',
      placeholder: 'ghiabcdefhelloadamhelloabcdefghi',
      helperText: 'Input string to decompose',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const display = s.slice(0, Math.min(n, 15));

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: display.split('').map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Longest Chunked Palindrome on "${s.slice(0, 20)}...". Match prefix/suffix greedily to form palindrome chunks.`,
      variables: { length: n },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let right = n - 1;
    let count = 0;
    let l = '';
    let r = '';

    while (left <= right) {
      l += s[left];
      r = s[right] + r;

      const lIdx = Math.min(left, display.length - 1);
      const rIdx = Math.min(right, display.length - 1);

      steps.push({
        line: 5,
        explanation: `Extend: prefix="${l.slice(0, 10)}", suffix="${r.slice(0, 10)}". ${l === r ? 'They match!' : 'No match yet.'}`,
        variables: { left, right, prefix: l.slice(0, 8), suffix: r.slice(0, 8), count },
        visualization: makeViz(
          { [lIdx]: l === r ? 'found' : 'active', [rIdx]: l === r ? 'found' : 'comparing' },
          { [lIdx]: 'L', [rIdx]: 'R' }
        ),
      });

      if (l === r) {
        const inc = left < right ? 2 : 1;
        count += inc;
        steps.push({
          line: 7,
          explanation: `Match found! "${l.slice(0, 8)}" == "${r.slice(0, 8)}". Add ${inc} chunks (${left < right ? 'both sides' : 'center'}). Total count=${count}.`,
          variables: { count, added: inc, chunk: l.slice(0, 8) },
          visualization: makeViz(
            { [lIdx]: 'sorted', [rIdx]: 'sorted' },
            { [lIdx]: `+${inc}`, [rIdx]: 'match' }
          ),
        });
        l = '';
        r = '';
      }

      left++;
      right--;
    }

    steps.push({
      line: 10,
      explanation: `Done. Total chunks = ${count}. This is the largest k for a palindrome-like chunked decomposition.`,
      variables: { result: count },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestChunkedPalindromeDecomposition;
