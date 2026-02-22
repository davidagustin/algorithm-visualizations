import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllAnagramsHash: AlgorithmDefinition = {
  id: 'find-all-anagrams-hash',
  title: 'Find All Anagrams in a String (Hash Map)',
  leetcodeNumber: 438,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Find all starting indices of anagram substrings of pattern p in string s. Uses a sliding window with two frequency hash maps: one for p and one for the current window. When both maps match, an anagram is found. Runs in O(n) time.',
  tags: ['hash map', 'sliding window', 'string', 'anagram'],

  code: {
    pseudocode: `function findAnagrams(s, p):
  pCount = frequency map of p
  wCount = {}
  result = []
  for r in range(len(s)):
    wCount[s[r]] += 1
    if r >= len(p):
      remove s[r - len(p)] from wCount
    if wCount == pCount:
      result.append(r - len(p) + 1)
  return result`,

    python: `from collections import Counter
def findAnagrams(s: str, p: str) -> list[int]:
    pCount = Counter(p)
    wCount = Counter()
    res = []
    for r in range(len(s)):
        wCount[s[r]] += 1
        if r >= len(p):
            c = s[r - len(p)]
            wCount[c] -= 1
            if wCount[c] == 0:
                del wCount[c]
        if wCount == pCount:
            res.append(r - len(p) + 1)
    return res`,

    javascript: `function findAnagrams(s, p) {
  const pCount = {}, wCount = {};
  for (const c of p) pCount[c] = (pCount[c] || 0) + 1;
  const res = [];
  for (let r = 0; r < s.length; r++) {
    wCount[s[r]] = (wCount[s[r]] || 0) + 1;
    if (r >= p.length) {
      const c = s[r - p.length];
      if (--wCount[c] === 0) delete wCount[c];
    }
    if (JSON.stringify(wCount) === JSON.stringify(pCount))
      res.push(r - p.length + 1);
  }
  return res;
}`,

    java: `public List<Integer> findAnagrams(String s, String p) {
    int[] pCount = new int[26], wCount = new int[26];
    for (char c : p.toCharArray()) pCount[c - 'a']++;
    List<Integer> res = new ArrayList<>();
    for (int r = 0; r < s.length(); r++) {
        wCount[s.charAt(r) - 'a']++;
        if (r >= p.length()) wCount[s.charAt(r - p.length()) - 'a']--;
        if (Arrays.equals(wCount, pCount)) res.add(r - p.length() + 1);
    }
    return res;
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
      helperText: 'The main string to search in',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: 'abc',
      placeholder: 'abc',
      helperText: 'The pattern to find anagrams of',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const steps: AlgorithmStep[] = [];
    const pCount: Record<string, number> = {};
    for (const c of p) pCount[c] = (pCount[c] || 0) + 1;
    const wCount: Record<string, number> = {};
    const result: number[] = [];

    const chars = Array.from(s).map((_, i) => i);

    steps.push({
      line: 1,
      explanation: `Build frequency map for pattern "${p}": ${JSON.stringify(pCount)}. Window size = ${p.length}.`,
      variables: { pCount: JSON.stringify(pCount), windowSize: p.length },
      visualization: { type: 'array', array: Array.from(s) as unknown as number[], highlights: {}, labels: {} },
    });

    for (let r = 0; r < s.length; r++) {
      wCount[s[r]] = (wCount[s[r]] || 0) + 1;

      steps.push({
        line: 5,
        explanation: `Expand window: add s[${r}]="${s[r]}". Window = "${s.slice(Math.max(0, r - p.length + 1), r + 1)}". wCount = ${JSON.stringify(wCount)}.`,
        variables: { r, char: s[r], wCount: JSON.stringify(wCount) },
        visualization: {
          type: 'array',
          array: Array.from(s) as unknown as number[],
          highlights: { [r]: 'active' },
          labels: { [r]: 'R' },
        },
      });

      if (r >= p.length) {
        const removed = s[r - p.length];
        wCount[removed]--;
        if (wCount[removed] === 0) delete wCount[removed];

        steps.push({
          line: 7,
          explanation: `Shrink window: remove s[${r - p.length}]="${removed}". wCount = ${JSON.stringify(wCount)}.`,
          variables: { removed, wCount: JSON.stringify(wCount) },
          visualization: {
            type: 'array',
            array: Array.from(s) as unknown as number[],
            highlights: { [r - p.length]: 'mismatch', [r]: 'active' },
            labels: { [r - p.length]: 'out', [r]: 'R' },
          },
        });
      }

      const match = JSON.stringify(wCount) === JSON.stringify(pCount);
      if (match) {
        const start = r - p.length + 1;
        result.push(start);
        steps.push({
          line: 9,
          explanation: `Window "${s.slice(start, r + 1)}" matches pattern "${p}"! Anagram found starting at index ${start}.`,
          variables: { start, window: s.slice(start, r + 1), result: JSON.stringify(result) },
          visualization: {
            type: 'array',
            array: Array.from(s) as unknown as number[],
            highlights: Object.fromEntries(
              Array.from({ length: p.length }, (_, k) => [start + k, 'found'])
            ),
            labels: { [start]: `idx=${start}` },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Anagram start indices: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: { type: 'array', array: Array.from(s) as unknown as number[], highlights: {}, labels: {} },
    });

    return steps;
  },
};

export default findAllAnagramsHash;
