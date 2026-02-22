import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestRepeatingCharacterReplacement: AlgorithmDefinition = {
  id: 'longest-repeating-character-replacement',
  title: 'Longest Repeating Character Replacement',
  leetcodeNumber: 424,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s and an integer k, find the length of the longest substring containing the same letter after replacing at most k characters. Track the count of the most frequent character in the window. If window size minus that count exceeds k, shrink the window from the left.',
  tags: ['sliding window', 'string', 'hash map', 'frequency count'],

  code: {
    pseudocode: `function characterReplacement(s, k):
  count = {}
  left = 0
  maxCount = 0
  result = 0
  for right in range(len(s)):
    count[s[right]] += 1
    maxCount = max(maxCount, count[s[right]])
    while (right - left + 1) - maxCount > k:
      count[s[left]] -= 1
      left += 1
    result = max(result, right - left + 1)
  return result`,

    python: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    left = 0
    maxCount = 0
    result = 0
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        maxCount = max(maxCount, count[s[right]])
        while (right - left + 1) - maxCount > k:
            count[s[left]] -= 1
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function characterReplacement(s, k) {
  const count = {};
  let left = 0;
  let maxCount = 0;
  let result = 0;
  for (let right = 0; right < s.length; right++) {
    count[s[right]] = (count[s[right]] || 0) + 1;
    maxCount = Math.max(maxCount, count[s[right]]);
    while ((right - left + 1) - maxCount > k) {
      count[s[left]]--;
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0, maxCount = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right) - 'A']++;
        maxCount = Math.max(maxCount, count[s.charAt(right) - 'A']);
        while ((right - left + 1) - maxCount > k) {
            count[s.charAt(left) - 'A']--;
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'AABABBA',
    k: 1,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'AABABBA',
      placeholder: 'AABABBA',
      helperText: 'Uppercase string of characters',
    },
    {
      name: 'k',
      label: 'Replacements (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Max number of character replacements allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const arr = s.split('').map((c) => c.charCodeAt(0) - 64);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    const count: Record<string, number> = {};
    let left = 0;
    let maxCount = 0;
    let result = 0;

    steps.push({
      line: 1,
      explanation: `Initialize sliding window on string "${s}" with k=${k} replacements allowed.`,
      variables: { left: 0, right: -1, maxCount: 0, result: 0, k },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      count[ch] = (count[ch] || 0) + 1;
      maxCount = Math.max(maxCount, count[ch]);

      const windowSize = right - left + 1;
      const replacementsNeeded = windowSize - maxCount;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = 'active';
      }
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 6,
        explanation: `Expand right to index ${right} (char '${ch}'). Window="${s.slice(left, right + 1)}", maxCount=${maxCount}, replacements needed=${replacementsNeeded}.`,
        variables: { left, right, char: ch, maxCount, windowSize, replacementsNeeded, k },
        visualization: makeViz(highlights, labels),
      });

      while (replacementsNeeded > k) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) {
          shrinkHighlights[i] = 'active';
        }
        shrinkHighlights[left] = 'comparing';
        shrinkLabels[left] = 'L--';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 9,
          explanation: `Window size - maxCount = ${windowSize} - ${maxCount} = ${replacementsNeeded} > k=${k}. Shrink from left, removing '${s[left]}'.`,
          variables: { left, right, removedChar: s[left], maxCount, replacementsNeeded, k },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        count[s[left]]--;
        left++;
        break;
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
        line: 11,
        explanation: `Window "${s.slice(left, right + 1)}" is valid. Length=${right - left + 1}. Best result so far=${result}.`,
        variables: { left, right, windowLength: right - left + 1, result },
        visualization: makeViz(finalHighlights, finalLabels),
      });
    }

    steps.push({
      line: 12,
      explanation: `Done. Longest substring with at most ${k} replacements has length ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestRepeatingCharacterReplacement;
