import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubstringWithAtMostTwoDistinct: AlgorithmDefinition = {
  id: 'longest-substring-with-at-most-two-distinct',
  title: 'Longest Substring with At Most Two Distinct Characters',
  leetcodeNumber: 159,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s, find the length of the longest substring that contains at most 2 distinct characters. This is a special case of the k-distinct problem with k=2. Use a sliding window: expand right, and whenever more than 2 distinct characters appear, shrink from the left until back to 2 or fewer distinct characters.',
  tags: ['sliding window', 'hash map', 'string', 'two pointers'],

  code: {
    pseudocode: `function lengthOfLongestSubstringTwoDistinct(s):
  left = 0
  freq = {}
  result = 0
  for right in range(len(s)):
    freq[s[right]] = freq.get(s[right], 0) + 1
    while len(freq) > 2:
      freq[s[left]] -= 1
      if freq[s[left]] == 0:
        del freq[s[left]]
      left += 1
    result = max(result, right - left + 1)
  return result`,

    python: `def lengthOfLongestSubstringTwoDistinct(s: str) -> int:
    left = 0
    freq = {}
    result = 0
    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1
        while len(freq) > 2:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function lengthOfLongestSubstringTwoDistinct(s) {
  let left = 0, result = 0;
  const freq = new Map();
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    while (freq.size > 2) {
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) freq.delete(s[left]);
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int lengthOfLongestSubstringTwoDistinct(String s) {
    Map<Character, Integer> freq = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        freq.merge(s.charAt(right), 1, Integer::sum);
        while (freq.size() > 2) {
            char lc = s.charAt(left);
            freq.put(lc, freq.get(lc) - 1);
            if (freq.get(lc) == 0) freq.remove(lc);
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'eceba',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'eceba',
      placeholder: 'eceba',
      helperText: 'Input string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    const freq = new Map<string, number>();
    let left = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `Find longest substring with at most 2 distinct characters. String="${s}". This is k-distinct with k=2.`,
      variables: { left: 0, result: 0, distinct: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      freq.set(ch, (freq.get(ch) || 0) + 1);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) highlights[i] = 'active';
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Expand to index ${right} (char '${ch}'). Distinct chars=${freq.size}. ${freq.size > 2 ? 'Exceeds 2 distinct! Shrink.' : 'At most 2 distinct, valid.'}`,
        variables: { left, right, char: ch, distinctCount: freq.size },
        visualization: makeViz(highlights, labels),
      });

      while (freq.size > 2) {
        const leftChar = s[left];
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) shrinkHighlights[i] = 'active';
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `${freq.size} distinct chars > 2. Remove '${leftChar}' from left (count was ${freq.get(leftChar)}).`,
          variables: { left, right, removedChar: leftChar, distinct: freq.size },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        const newCount = (freq.get(leftChar) || 0) - 1;
        if (newCount === 0) {
          freq.delete(leftChar);
        } else {
          freq.set(leftChar, newCount);
        }
        left++;
      }

      result = Math.max(result, right - left + 1);

      const finalHighlights: Record<number, string> = {};
      const finalLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        finalHighlights[i] = result === right - left + 1 ? 'found' : 'active';
      }
      finalLabels[left] = 'L';
      finalLabels[right] = 'R';

      steps.push({
        line: 12,
        explanation: `Window "${s.slice(left, right + 1)}" has ${freq.size} distinct chars. Length=${right - left + 1}. Best=${result}.`,
        variables: { left, right, distinct: freq.size, windowLength: right - left + 1, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 13,
      explanation: `Done. Longest substring with at most 2 distinct characters has length ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestSubstringWithAtMostTwoDistinct;
