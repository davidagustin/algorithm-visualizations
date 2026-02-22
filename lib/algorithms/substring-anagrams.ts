import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const substringAnagrams: AlgorithmDefinition = {
  id: 'substring-anagrams',
  title: 'Find All Anagrams in a String',
  leetcodeNumber: 438,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given two strings s and p, find all start indices of p\'s anagrams in s. Uses a sliding window of size p.length with a character frequency count, tracking how many characters are fully matched.',
  tags: ['sliding window', 'string', 'hash map'],

  code: {
    pseudocode: `function findAnagrams(s, p):
  if length(s) < length(p): return []
  pCount = frequency(p)
  sCount = {}
  result = []
  matched = 0, total = distinct chars in pCount
  for i = 0 to length(s) - 1:
    ch = s[i]
    sCount[ch]++
    if sCount[ch] == pCount[ch]: matched++
    if i >= length(p):
      old = s[i - length(p)]
      if sCount[old] == pCount[old]: matched--
      sCount[old]--
    if matched == total:
      result.add(i - length(p) + 1)
  return result`,

    python: `def findAnagrams(s: str, p: str) -> list[int]:
    if len(s) < len(p):
        return []
    from collections import Counter
    p_count = Counter(p)
    s_count = Counter()
    result = []
    matched = 0
    total = len(p_count)
    for i in range(len(s)):
        ch = s[i]
        s_count[ch] += 1
        if s_count[ch] == p_count[ch]:
            matched += 1
        if i >= len(p):
            old = s[i - len(p)]
            if s_count[old] == p_count[old]:
                matched -= 1
            s_count[old] -= 1
        if matched == total:
            result.append(i - len(p) + 1)
    return result`,

    javascript: `function findAnagrams(s, p) {
  if (s.length < p.length) return [];
  const pCount = {}, sCount = {};
  for (const ch of p) pCount[ch] = (pCount[ch] || 0) + 1;
  const result = [];
  let matched = 0;
  const total = Object.keys(pCount).length;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    sCount[ch] = (sCount[ch] || 0) + 1;
    if (sCount[ch] === pCount[ch]) matched++;
    if (i >= p.length) {
      const old = s[i - p.length];
      if (sCount[old] === pCount[old]) matched--;
      sCount[old]--;
    }
    if (matched === total)
      result.push(i - p.length + 1);
  }
  return result;
}`,

    java: `public List<Integer> findAnagrams(String s, String p) {
    List<Integer> result = new ArrayList<>();
    if (s.length() < p.length()) return result;
    int[] pCount = new int[26], sCount = new int[26];
    for (char c : p.toCharArray()) pCount[c - 'a']++;
    int total = 0;
    for (int c : pCount) if (c > 0) total++;
    int matched = 0;
    for (int i = 0; i < s.length(); i++) {
        int ch = s.charAt(i) - 'a';
        sCount[ch]++;
        if (sCount[ch] == pCount[ch]) matched++;
        if (i >= p.length()) {
            int old = s.charAt(i - p.length()) - 'a';
            if (sCount[old] == pCount[old]) matched--;
            sCount[old]--;
        }
        if (matched == total)
            result.add(i - p.length() + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'cbaebabacd',
    p: 'abc',
  },

  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'cbaebabacd',
      placeholder: 'cbaebabacd',
      helperText: 'The string to search in',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'The anagram pattern to find',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    if (s.length < p.length) {
      steps.push({
        line: 2,
        explanation: 's is shorter than p. No anagrams possible.',
        variables: { result: [] },
        visualization: {
          type: 'array',
          array: chars.map(c => c.charCodeAt(0)),
          highlights: {},
          labels: Object.fromEntries(chars.map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    const pCount: Record<string, number> = {};
    for (const ch of p) pCount[ch] = (pCount[ch] || 0) + 1;
    const sCount: Record<string, number> = {};
    let matched = 0;
    const total = Object.keys(pCount).length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: chars.map(c => c.charCodeAt(0)),
      highlights,
      labels: {
        ...Object.fromEntries(chars.map((c, i) => [i, c])),
        ...labels,
      },
      auxData: {
        label: 'Char Counts',
        entries: [
          { key: 'pCount', value: JSON.stringify(pCount) },
          { key: 'sCount', value: JSON.stringify(sCount) },
          { key: 'matched', value: `${matched}/${total}` },
        ],
      },
    });

    // Step: Initialize
    steps.push({
      line: 3,
      explanation: `Build frequency map for p = "${p}": ${JSON.stringify(pCount)}. Need ${total} character type(s) fully matched.`,
      variables: { pCount: { ...pCount }, total },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < s.length; i++) {
      const ch = s[i];
      sCount[ch] = (sCount[ch] || 0) + 1;
      if (sCount[ch] === (pCount[ch] || 0) && pCount[ch]) matched++;

      if (i >= p.length) {
        const old = s[i - p.length];
        if (sCount[old] === (pCount[old] || 0) && pCount[old]) matched--;
        sCount[old]--;
        if (sCount[old] === 0) delete sCount[old];
      }

      const windowStart = Math.max(0, i - p.length + 1);
      const highlights: Record<number, string> = {};
      for (let k = windowStart; k <= i; k++) {
        highlights[k] = 'active';
      }
      highlights[i] = 'comparing';

      const isAnagram = matched === total;
      if (isAnagram) {
        result.push(windowStart);
        for (let k = windowStart; k <= i; k++) {
          highlights[k] = 'found';
        }
      }

      steps.push({
        line: isAnagram ? 16 : 8,
        explanation: isAnagram
          ? `Window [${windowStart}..${i}] = "${s.substring(windowStart, i + 1)}" is an anagram of "${p}"! Add index ${windowStart} to results.`
          : `Add '${ch}' to window. Window [${windowStart}..${i}] = "${s.substring(windowStart, i + 1)}". Matched: ${matched}/${total}.`,
        variables: { i, ch, windowStart, matched, total, sCount: { ...sCount }, result: [...result] },
        visualization: makeViz(highlights, { [windowStart]: 'L', [i]: 'R' }),
      });
    }

    // Final
    steps.push({
      line: 17,
      explanation: `Done! Found ${result.length} anagram(s) at indices: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(
        Object.fromEntries(chars.map((_, i) => [i, result.some(r => i >= r && i < r + p.length) ? 'found' : 'default'])),
        {}
      ),
    });

    return steps;
  },
};

export default substringAnagrams;
