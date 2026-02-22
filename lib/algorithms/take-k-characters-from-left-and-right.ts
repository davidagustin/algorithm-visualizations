import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const takeKCharactersFromLeftAndRight: AlgorithmDefinition = {
  id: 'take-k-characters-from-left-and-right',
  title: 'Take K of Each Character From Left and Right',
  leetcodeNumber: 2516,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s containing only a, b, c and an integer k, each minute take one character from the left or right end. Return the minimum number of minutes to have taken at least k of each character. Use sliding window to find the largest middle portion to skip.',
  tags: ['sliding window', 'string', 'hash map'],

  code: {
    pseudocode: `function takeCharacters(s, k):
  total = count of each char in s
  if any count < k: return -1
  // Find largest window we can SKIP in the middle
  window = {a:0, b:0, c:0}
  left = 0
  maxSkip = 0
  for right in range(len(s)):
    window[s[right]]++
    while any char: total[char]-window[char] < k:
      window[s[left]]--
      left++
    maxSkip = max(maxSkip, right-left+1)
  return len(s) - maxSkip`,

    python: `def takeCharacters(s: str, k: int) -> int:
    from collections import Counter
    total = Counter(s)
    if any(total[c] < k for c in 'abc'): return -1
    if k == 0: return 0
    window = Counter()
    left = 0
    best = 0
    for right, c in enumerate(s):
        window[c] += 1
        while any(total[x] - window[x] < k for x in 'abc'):
            window[s[left]] -= 1
            left += 1
        best = max(best, right - left + 1)
    return len(s) - best`,

    javascript: `function takeCharacters(s, k) {
  if (k === 0) return 0;
  const total = {a:0,b:0,c:0};
  for (const c of s) total[c]++;
  if (Object.values(total).some(v => v < k)) return -1;
  const window = {a:0,b:0,c:0};
  let left = 0, best = 0;
  for (let right = 0; right < s.length; right++) {
    window[s[right]]++;
    while (['a','b','c'].some(c => total[c] - window[c] < k)) {
      window[s[left]]--;
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return s.length - best;
}`,

    java: `public int takeCharacters(String s, int k) {
    if (k == 0) return 0;
    int[] total = new int[3];
    for (char c : s.toCharArray()) total[c - 'a']++;
    for (int v : total) if (v < k) return -1;
    int[] window = new int[3];
    int left = 0, best = 0;
    for (int right = 0; right < s.length(); right++) {
        window[s.charAt(right) - 'a']++;
        while (total[0]-window[0]<k || total[1]-window[1]<k || total[2]-window[2]<k) {
            window[s.charAt(left++) - 'a']--;
        }
        best = Math.max(best, right - left + 1);
    }
    return s.length() - best;
}`,
  },

  defaultInput: {
    s: 'aabaaaacaabc',
    k: 2,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aabaaaacaabc',
      placeholder: 'aabaaaacaabc',
      helperText: 'String containing only a, b, c',
    },
    {
      name: 'k',
      label: 'Minimum k of each',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Need at least k of each character',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = s.length;

    const total = { a: 0, b: 0, c: 0 };
    for (const c of s) total[c as 'a' | 'b' | 'c']++;

    const arr = s.split('').map(c => c.charCodeAt(0) - 96);

    steps.push({
      line: 1,
      explanation: `Total counts: a=${total.a}, b=${total.b}, c=${total.c}. Need k=${k} of each. ${Object.values(total).some(v => v < k) ? 'Impossible! Return -1.' : 'Find largest middle window to skip.'}`,
      variables: { totalA: total.a, totalB: total.b, totalC: total.c, k },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    if (k === 0) {
      steps.push({ line: 2, explanation: 'k=0, no characters needed. Return 0.', variables: { result: 0 }, visualization: { type: 'array', array: arr, highlights: {}, labels: {} } as ArrayVisualization });
      return steps;
    }

    if (Object.values(total).some(v => v < k)) {
      steps.push({ line: 3, explanation: 'Not enough characters. Return -1.', variables: { result: -1 }, visualization: { type: 'array', array: arr, highlights: {}, labels: {} } as ArrayVisualization });
      return steps;
    }

    const window = { a: 0, b: 0, c: 0 };
    let left = 0;
    let best = 0;

    for (let right = 0; right < n; right++) {
      const rc = s[right] as 'a' | 'b' | 'c';
      window[rc]++;

      while (['a', 'b', 'c'].some(c => total[c as 'a' | 'b' | 'c'] - window[c as 'a' | 'b' | 'c'] < k)) {
        const lc = s[left] as 'a' | 'b' | 'c';
        window[lc]--;
        left++;
      }

      const winSize = right - left + 1;
      if (winSize > best) best = winSize;

      steps.push({
        line: 9,
        explanation: `Window [${left}..${right}]: skip region size=${winSize}. Outside window has a=${total.a - window.a}, b=${total.b - window.b}, c=${total.c - window.c} (all >= ${k}). Best skip=${best}.`,
        variables: { left, right, winSize, best, answer: n - best },
        visualization: {
          type: 'array',
          array: arr,
          highlights: {
            ...Object.fromEntries(Array.from({ length: left }, (_, i) => [i, 'found'])),
            ...Object.fromEntries(Array.from({ length: winSize }, (_, i) => [left + i, 'active'])),
            ...Object.fromEntries(Array.from({ length: n - right - 1 }, (_, i) => [right + 1 + i, 'found'])),
          },
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 12,
      explanation: `Largest skippable middle = ${best}. Must take ${n} - ${best} = ${n - best} characters from ends.`,
      variables: { result: n - best },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default takeKCharactersFromLeftAndRight;
