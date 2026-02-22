import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestUniformSubstringAfterReplacements: AlgorithmDefinition = {
  id: 'longest-uniform-substring-after-replacements',
  title: 'Longest Repeating Character Replacement',
  leetcodeNumber: 424,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s and an integer k, find the length of the longest substring where you can replace at most k characters to make all characters identical. Uses a sliding window tracking the most frequent character count; if windowSize - maxFreq > k, shrink the window.',
  tags: ['sliding window', 'string'],

  code: {
    pseudocode: `function characterReplacement(s, k):
  count = {}
  left = 0
  maxFreq = 0
  maxLen = 0
  for right = 0 to length(s) - 1:
    count[s[right]]++
    maxFreq = max(maxFreq, count[s[right]])
    if (right - left + 1) - maxFreq > k:
      count[s[left]]--
      left++
    maxLen = max(maxLen, right - left + 1)
  return maxLen`,

    python: `def characterReplacement(s: str, k: int) -> int:
    count = {}
    left = 0
    max_freq = 0
    max_len = 0
    for right in range(len(s)):
        count[s[right]] = count.get(s[right], 0) + 1
        max_freq = max(max_freq, count[s[right]])
        if (right - left + 1) - max_freq > k:
            count[s[left]] -= 1
            left += 1
        max_len = max(max_len, right - left + 1)
    return max_len`,

    javascript: `function characterReplacement(s, k) {
  const count = {};
  let left = 0, maxFreq = 0, maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    count[s[right]] = (count[s[right]] || 0) + 1;
    maxFreq = Math.max(maxFreq, count[s[right]]);
    if (right - left + 1 - maxFreq > k) {
      count[s[left]]--;
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,

    java: `public int characterReplacement(String s, int k) {
    int[] count = new int[26];
    int left = 0, maxFreq = 0, maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        count[s.charAt(right) - 'A']++;
        maxFreq = Math.max(maxFreq, count[s.charAt(right) - 'A']);
        if (right - left + 1 - maxFreq > k) {
            count[s.charAt(left) - 'A']--;
            left++;
        }
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },

  defaultInput: {
    s: 'AABABBA',
    k: 1,
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'AABABBA',
      placeholder: 'AABABBA',
      helperText: 'String of uppercase letters',
    },
    {
      name: 'k',
      label: 'Max Replacements (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Maximum number of character replacements allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];

    const count: Record<string, number> = {};
    let left = 0;
    let maxFreq = 0;
    let maxLen = 0;
    let bestStart = 0;

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
        entries: Object.entries(count)
          .filter(([, v]) => v > 0)
          .map(([ch, v]) => ({ key: ch, value: String(v) })),
      },
    });

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize sliding window. k = ${k} replacements allowed. Find the longest substring that can become uniform.`,
      variables: { k, left: 0, maxFreq: 0, maxLen: 0 },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < s.length; right++) {
      const ch = s[right];
      count[ch] = (count[ch] || 0) + 1;
      maxFreq = Math.max(maxFreq, count[ch]);
      const windowSize = right - left + 1;
      const replacements = windowSize - maxFreq;

      const highlights: Record<number, string> = {};
      for (let w = left; w <= right; w++) highlights[w] = 'active';
      highlights[right] = 'comparing';

      if (replacements > k) {
        // Need to shrink
        steps.push({
          line: 9,
          explanation: `Window [${left}..${right}] = "${s.substring(left, right + 1)}", size ${windowSize}. maxFreq = ${maxFreq}, replacements needed = ${replacements} > k = ${k}. Shrink window.`,
          variables: { left, right, windowSize, maxFreq, replacements, k },
          visualization: makeViz(
            { ...highlights, [left]: 'mismatch', [right]: 'comparing' },
            { [left]: 'L', [right]: 'R' }
          ),
        });

        count[s[left]]--;
        left++;
      } else {
        const newLen = right - left + 1;
        if (newLen > maxLen) {
          maxLen = newLen;
          bestStart = left;
        }

        steps.push({
          line: 11,
          explanation: `Window [${left}..${right}] = "${s.substring(left, right + 1)}", size ${windowSize}. maxFreq = ${maxFreq}, replacements = ${replacements} <= k = ${k}. Valid! maxLen = ${maxLen}.`,
          variables: { left, right, windowSize, maxFreq, replacements, maxLen },
          visualization: makeViz(
            highlights,
            { [left]: 'L', [right]: 'R' }
          ),
        });
      }
    }

    // Final result
    const finalHighlights: Record<number, string> = {};
    for (let i = bestStart; i < bestStart + maxLen; i++) {
      finalHighlights[i] = 'found';
    }

    steps.push({
      line: 12,
      explanation: `Done! Longest substring after at most ${k} replacements has length ${maxLen}: "${s.substring(bestStart, bestStart + maxLen)}".`,
      variables: { result: maxLen, bestSubstring: s.substring(bestStart, bestStart + maxLen) },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default longestUniformSubstringAfterReplacements;
