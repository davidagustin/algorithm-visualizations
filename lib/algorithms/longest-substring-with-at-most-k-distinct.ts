import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubstringWithAtMostKDistinct: AlgorithmDefinition = {
  id: 'longest-substring-with-at-most-k-distinct',
  title: 'Longest Substring with At Most K Distinct Characters',
  leetcodeNumber: 340,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s and an integer k, find the length of the longest substring that contains at most k distinct characters. Use a sliding window with a frequency map. When the number of distinct characters exceeds k, shrink from the left until back to k distinct characters.',
  tags: ['sliding window', 'hash map', 'string', 'two pointers'],

  code: {
    pseudocode: `function lengthOfLongestSubstringKDistinct(s, k):
  left = 0
  freq = {}
  result = 0
  for right in range(len(s)):
    freq[s[right]] = freq.get(s[right], 0) + 1
    while len(freq) > k:
      freq[s[left]] -= 1
      if freq[s[left]] == 0:
        del freq[s[left]]
      left += 1
    result = max(result, right - left + 1)
  return result`,

    python: `def lengthOfLongestSubstringKDistinct(s: str, k: int) -> int:
    left = 0
    freq = {}
    result = 0
    for right in range(len(s)):
        freq[s[right]] = freq.get(s[right], 0) + 1
        while len(freq) > k:
            freq[s[left]] -= 1
            if freq[s[left]] == 0:
                del freq[s[left]]
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function lengthOfLongestSubstringKDistinct(s, k) {
  let left = 0, result = 0;
  const freq = new Map();
  for (let right = 0; right < s.length; right++) {
    freq.set(s[right], (freq.get(s[right]) || 0) + 1);
    while (freq.size > k) {
      freq.set(s[left], freq.get(s[left]) - 1);
      if (freq.get(s[left]) === 0) freq.delete(s[left]);
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int lengthOfLongestSubstringKDistinct(String s, int k) {
    Map<Character, Integer> freq = new HashMap<>();
    int left = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        freq.merge(s.charAt(right), 1, Integer::sum);
        while (freq.size() > k) {
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
    k: 2,
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
    {
      name: 'k',
      label: 'Max Distinct (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Maximum number of distinct characters allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
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
      explanation: `Find longest substring with at most k=${k} distinct characters. String="${s}".`,
      variables: { k, left: 0, result: 0, distinct: 0 },
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
        explanation: `Expand to index ${right} (char '${ch}'). Distinct chars=${freq.size}, k=${k}. ${freq.size > k ? 'Too many distinct!' : 'Within limit.'}`,
        variables: { left, right, char: ch, distinctCount: freq.size, k },
        visualization: makeViz(highlights, labels),
      });

      while (freq.size > k) {
        const leftChar = s[left];
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) shrinkHighlights[i] = 'active';
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `${freq.size} > k=${k}. Shrink from left, removing '${leftChar}' (count=${freq.get(leftChar)}).`,
          variables: { left, right, removedChar: leftChar, freq: freq.get(leftChar), distinct: freq.size },
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
        explanation: `Valid window "${s.slice(left, right + 1)}" with ${freq.size} distinct chars <= k=${k}. Length=${right - left + 1}. Best=${result}.`,
        variables: { left, right, distinct: freq.size, windowLength: right - left + 1, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 13,
      explanation: `Done. Longest substring with at most ${k} distinct characters has length ${result}.`,
      variables: { result, k },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestSubstringWithAtMostKDistinct;
