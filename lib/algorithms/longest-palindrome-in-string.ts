import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestPalindromeInString: AlgorithmDefinition = {
  id: 'longest-palindrome-in-string',
  title: 'Longest Palindrome in String',
  leetcodeNumber: 5,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a string s, find the longest palindromic substring. We use the expand-around-center approach: for each possible center (including between characters), expand outward while characters match.',
  tags: ['Dynamic Programming', 'String', 'Palindrome'],
  code: {
    pseudocode: `function longestPalindrome(s):
  start = 0, maxLen = 1
  function expand(left, right):
    while left >= 0 and right < len(s) and s[left] == s[right]:
      if right - left + 1 > maxLen:
        start = left
        maxLen = right - left + 1
      left -= 1
      right += 1
  for i from 0 to len(s)-1:
    expand(i, i)       // odd-length
    expand(i, i + 1)   // even-length
  return s[start:start+maxLen]`,
    python: `def longestPalindrome(s):
    start, maxLen = 0, 1
    def expand(left, right):
        nonlocal start, maxLen
        while left >= 0 and right < len(s) and s[left] == s[right]:
            if right - left + 1 > maxLen:
                start = left
                maxLen = right - left + 1
            left -= 1
            right += 1
    for i in range(len(s)):
        expand(i, i)
        expand(i, i + 1)
    return s[start:start+maxLen]`,
    javascript: `function longestPalindrome(s) {
  let start = 0, maxLen = 1;
  function expand(left, right) {
    while (left >= 0 && right < s.length && s[left] === s[right]) {
      if (right - left + 1 > maxLen) {
        start = left;
        maxLen = right - left + 1;
      }
      left--;
      right++;
    }
  }
  for (let i = 0; i < s.length; i++) {
    expand(i, i);
    expand(i, i + 1);
  }
  return s.slice(start, start + maxLen);
}`,
    java: `public String longestPalindrome(String s) {
    int start = 0, maxLen = 1;
    for (int i = 0; i < s.length(); i++) {
        int len1 = expand(s, i, i);
        int len2 = expand(s, i, i + 1);
        int len = Math.max(len1, len2);
        if (len > maxLen) {
            maxLen = len;
            start = i - (len - 1) / 2;
        }
    }
    return s.substring(start, start + maxLen);
}
private int expand(String s, int left, int right) {
    while (left >= 0 && right < s.length() && s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}`,
  },
  defaultInput: { s: 'babad' },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'babad',
      placeholder: 'babad',
      helperText: 'Input string to find longest palindromic substring',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const n = s.length;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('').map((_, i) => i);

    let bestStart = 0;
    let maxLen = 1;

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      const baseLabels: Record<number, string> = {};
      for (let i = 0; i < n; i++) baseLabels[i] = s[i];
      // Highlight current best palindrome
      const baseHighlights: Record<number, string> = {};
      for (let i = bestStart; i < bestStart + maxLen; i++) {
        baseHighlights[i] = 'sorted';
      }
      return {
        type: 'array',
        array: chars,
        highlights: { ...baseHighlights, ...highlights },
        labels: { ...baseLabels, ...labels },
        auxData: {
          label: 'Palindrome Search',
          entries: [
            { key: 'Best', value: `"${s.slice(bestStart, bestStart + maxLen)}" (len=${maxLen})` },
            { key: 'Start', value: String(bestStart) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `String "${s}" has ${n} characters. Expand around each center to find the longest palindrome.`,
      variables: { s, n },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      // Odd-length expansion
      let left = i, right = i;

      steps.push({
        line: 10,
        explanation: `Center at index ${i} ('${s[i]}'). Try odd-length palindrome.`,
        variables: { center: i, char: s[i] },
        visualization: makeViz({ [i]: 'active' }, { [i]: 'center' }),
      });

      while (left >= 0 && right < n && s[left] === s[right]) {
        const len = right - left + 1;
        if (len > maxLen) {
          bestStart = left;
          maxLen = len;

          const highlights: Record<number, string> = {};
          for (let k = left; k <= right; k++) highlights[k] = 'match';
          steps.push({
            line: 5,
            explanation: `New longest palindrome found: "${s.slice(left, right + 1)}" (length ${len}) from index ${left} to ${right}.`,
            variables: { left, right, palindrome: s.slice(left, right + 1), length: len },
            visualization: makeViz(highlights, { [left]: 'L', [right]: 'R' }),
          });
        }
        left--;
        right++;
      }

      if (left >= 0 && right < n && s[left] !== s[right] && right - left > 2) {
        steps.push({
          line: 3,
          explanation: `Expansion stopped: '${s[left]}' != '${s[right]}'. Can't extend further.`,
          variables: { left, right },
          visualization: makeViz({ [left]: 'mismatch', [right]: 'mismatch' }, {}),
        });
      }

      // Even-length expansion
      left = i;
      right = i + 1;

      if (right < n) {
        if (s[left] === s[right]) {
          while (left >= 0 && right < n && s[left] === s[right]) {
            const len = right - left + 1;
            if (len > maxLen) {
              bestStart = left;
              maxLen = len;

              const highlights: Record<number, string> = {};
              for (let k = left; k <= right; k++) highlights[k] = 'match';
              steps.push({
                line: 5,
                explanation: `Even-length palindrome: "${s.slice(left, right + 1)}" (length ${len}).`,
                variables: { left, right, palindrome: s.slice(left, right + 1), length: len },
                visualization: makeViz(highlights, { [left]: 'L', [right]: 'R' }),
              });
            }
            left--;
            right++;
          }
        }
      }
    }

    // Final result
    const result = s.slice(bestStart, bestStart + maxLen);
    const finalHighlights: Record<number, string> = {};
    for (let i = bestStart; i < bestStart + maxLen; i++) {
      finalHighlights[i] = 'found';
    }

    steps.push({
      line: 12,
      explanation: `Longest palindromic substring: "${result}" (length ${maxLen}), starting at index ${bestStart}.`,
      variables: { result, length: maxLen, start: bestStart },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default longestPalindromeInString;
