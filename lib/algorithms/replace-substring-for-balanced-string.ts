import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const replaceSubstringForBalancedString: AlgorithmDefinition = {
  id: 'replace-substring-for-balanced-string',
  title: 'Replace the Substring for Balanced String',
  leetcodeNumber: 1234,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s containing only Q, W, E, R where each should appear exactly n/4 times (balanced). Find the minimum length substring to replace to make the string balanced. Use a sliding window: the characters outside the window must already have counts at most n/4. Shrink the window while the outside characters satisfy the balance condition.',
  tags: ['sliding window', 'string', 'two pointers', 'frequency count'],

  code: {
    pseudocode: `function balancedString(s):
  n = len(s)
  target = n / 4
  freq = count of each char in s
  if all counts == target: return 0
  left = 0
  result = n
  for right in range(n):
    freq[s[right]] -= 1
    while all(freq[c] <= target for c in "QWER"):
      result = min(result, right - left + 1)
      freq[s[left]] += 1
      left += 1
  return result`,

    python: `def balancedString(s: str) -> int:
    from collections import Counter
    n = len(s)
    target = n // 4
    freq = Counter(s)
    if all(freq[c] == target for c in 'QWER'):
        return 0
    left = 0
    result = n
    for right in range(n):
        freq[s[right]] -= 1
        while all(freq[c] <= target for c in 'QWER'):
            result = min(result, right - left + 1)
            freq[s[left]] += 1
            left += 1
    return result`,

    javascript: `function balancedString(s) {
  const n = s.length, target = n / 4;
  const freq = {Q:0,W:0,E:0,R:0};
  for (const c of s) freq[c]++;
  if (Object.values(freq).every(v => v === target)) return 0;
  let left = 0, result = n;
  for (let right = 0; right < n; right++) {
    freq[s[right]]--;
    while (Object.values(freq).every(v => v <= target)) {
      result = Math.min(result, right - left + 1);
      freq[s[left]]++;
      left++;
    }
  }
  return result;
}`,

    java: `public int balancedString(String s) {
    int n = s.length(), target = n / 4;
    int[] freq = new int[128];
    for (char c : s.toCharArray()) freq[c]++;
    if (freq['Q']==target && freq['W']==target && freq['E']==target && freq['R']==target) return 0;
    int left = 0, result = n;
    for (int right = 0; right < n; right++) {
        freq[s.charAt(right)]--;
        while (freq['Q']<=target && freq['W']<=target && freq['E']<=target && freq['R']<=target) {
            result = Math.min(result, right - left + 1);
            freq[s.charAt(left++)]++;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'QWER',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'QWER',
      placeholder: 'QWER',
      helperText: 'String containing only Q, W, E, R (length divisible by 4)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const target = Math.floor(n / 4);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    const freq: Record<string, number> = { Q: 0, W: 0, E: 0, R: 0 };
    for (const c of s) if (c in freq) freq[c]++;

    steps.push({
      line: 1,
      explanation: `String="${s}", n=${n}, target=${target} per char. Initial counts: Q=${freq.Q}, W=${freq.W}, E=${freq.E}, R=${freq.R}.`,
      variables: { n, target, Q: freq.Q, W: freq.W, E: freq.E, R: freq.R },
      visualization: makeViz({}, {}),
    });

    const isBalanced = () =>
      freq.Q <= target && freq.W <= target && freq.E <= target && freq.R <= target;

    if (Object.values(freq).every((v) => v === target)) {
      steps.push({
        line: 4,
        explanation: `Already balanced! No replacement needed. Return 0.`,
        variables: { result: 0 },
        visualization: makeViz(
          Object.fromEntries(s.split('').map((_, i) => [i, 'found'])),
          {}
        ),
      });
      return steps;
    }

    let left = 0;
    let result = n;

    for (let right = 0; right < n; right++) {
      const rightChar = s[right];
      if (rightChar in freq) freq[rightChar]--;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) highlights[i] = 'active';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 7,
        explanation: `Expand window right to ${right} ('${rightChar}'). Outside window: Q=${freq.Q}, W=${freq.W}, E=${freq.E}, R=${freq.R}. Balanced outside? ${isBalanced()}.`,
        variables: { left, right, rightChar, Q: freq.Q, W: freq.W, E: freq.E, R: freq.R },
        visualization: makeViz(highlights, labels),
      });

      while (isBalanced()) {
        result = Math.min(result, right - left + 1);

        const foundHighlights: Record<number, string> = {};
        const foundLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) foundHighlights[i] = 'found';
        foundLabels[left] = 'L';
        foundLabels[right] = 'R';

        steps.push({
          line: 9,
          explanation: `Outside window is balanced! Window length=${right - left + 1}. Best result=${result}. Try shrinking from left.`,
          variables: { left, right, windowLength: right - left + 1, result },
          visualization: makeViz(foundHighlights, foundLabels),
        });

        const leftChar = s[left];
        if (leftChar in freq) freq[leftChar]++;
        left++;
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Minimum replacement substring length to balance the string = ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default replaceSubstringForBalancedString;
