import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumLengthSubstringWithTwoOccurrences: AlgorithmDefinition = {
  id: 'maximum-length-substring-with-two-occurrences',
  title: 'Maximum Length Substring With Two Occurrences',
  leetcodeNumber: 3090,
  difficulty: 'Easy',
  category: 'Sliding Window',
  description:
    'Given a string s, return the maximum length of a substring such that it contains at most 2 occurrences of each character. Use a sliding window: expand right, and shrink left when any character appears more than 2 times.',
  tags: ['sliding window', 'hash map', 'string'],

  code: {
    pseudocode: `function maximumLengthSubstring(s):
  freq = {}
  left = 0
  result = 0
  for right in range(len(s)):
    freq[s[right]] = freq.get(s[right], 0) + 1
    while freq[s[right]] > 2:
      freq[s[left]] -= 1
      left++
    result = max(result, right - left + 1)
  return result`,

    python: `def maximumLengthSubstring(s: str) -> int:
    from collections import defaultdict
    freq = defaultdict(int)
    left = 0
    result = 0
    for right, c in enumerate(s):
        freq[c] += 1
        while freq[c] > 2:
            freq[s[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function maximumLengthSubstring(s) {
  const freq = new Map();
  let left = 0, result = 0;
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    while (freq.get(s[right]) > 2) {
      freq.set(s[left], freq.get(s[left]) - 1);
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int maximumLengthSubstring(String s) {
    int[] freq = new int[26];
    int left = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        freq[s.charAt(right) - 'a']++;
        while (freq[s.charAt(right) - 'a'] > 2) {
            freq[s.charAt(left++) - 'a']--;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'bcbbbcba',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'bcbbbcba',
      placeholder: 'bcbbbcba',
      helperText: 'Lowercase English string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const arr = s.split('').map(c => c.charCodeAt(0) - 96);

    steps.push({
      line: 1,
      explanation: `Find longest substring where each character appears at most 2 times in "${s}". Shrink window when any char count exceeds 2.`,
      variables: { result: 0, left: 0 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(s.split('').slice(0, 10).map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    const freq = new Map<string, number>();
    let left = 0;
    let result = 0;

    for (let right = 0; right < n; right++) {
      freq.set(s[right], (freq.get(s[right]) || 0) + 1);

      while (freq.get(s[right])! > 2) {
        steps.push({
          line: 7,
          explanation: `"${s[right]}" appears ${freq.get(s[right])} times (> 2). Shrink from left: remove "${s[left]}" at index ${left}.`,
          variables: { left, right, char: s[right], count: freq.get(s[right]) },
          visualization: {
            type: 'array',
            array: arr,
            highlights: { [left]: 'mismatch', [right]: 'active' },
            labels: { [left]: 'L--', [right]: `${s[right]}(${freq.get(s[right])})` },
          } as ArrayVisualization,
        });
        freq.set(s[left], freq.get(s[left])! - 1);
        left++;
      }

      const winSize = right - left + 1;
      if (winSize > result) result = winSize;

      steps.push({
        line: 9,
        explanation: `Window [${left}..${right}]: each char appears at most 2 times. Size = ${winSize}. Best = ${result}.`,
        variables: { left, right, windowSize: winSize, result, char: s[right], charCount: freq.get(s[right]) },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(Array.from({ length: winSize }, (_, i) => [left + i, 'active'])),
          labels: { [left]: 'L', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 10,
      explanation: `Maximum length substring with at most 2 of each character = ${result}.`,
      variables: { result },
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

export default maximumLengthSubstringWithTwoOccurrences;
