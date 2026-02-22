import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const slidingWindowUniqueChars: AlgorithmDefinition = {
  id: 'sliding-window-unique-chars',
  title: 'Longest Substring Without Repeating Characters',
  leetcodeNumber: 3,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given a string, find the length of the longest substring without repeating characters. Uses a sliding window with a set to track characters in the current window.',
  tags: ['sliding window', 'hash set', 'string', 'two pointers'],

  code: {
    pseudocode: `function lengthOfLongestSubstring(s):
  charSet = {}
  left = 0
  maxLen = 0
  for right = 0 to length(s) - 1:
    while s[right] in charSet:
      remove s[left] from charSet
      left = left + 1
    add s[right] to charSet
    maxLen = max(maxLen, right - left + 1)
  return maxLen`,

    python: `def lengthOfLongestSubstring(s: str) -> int:
    char_set = set()
    left = 0
    max_len = 0
    for right in range(len(s)):
        while s[right] in char_set:
            char_set.discard(s[left])
            left += 1
        char_set.add(s[right])
        max_len = max(max_len, right - left + 1)
    return max_len`,

    javascript: `function lengthOfLongestSubstring(s) {
  const charSet = new Set();
  let left = 0;
  let maxLen = 0;
  for (let right = 0; right < s.length; right++) {
    while (charSet.has(s[right])) {
      charSet.delete(s[left]);
      left++;
    }
    charSet.add(s[right]);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,

    java: `public int lengthOfLongestSubstring(String s) {
    Set<Character> charSet = new HashSet<>();
    int left = 0;
    int maxLen = 0;
    for (int right = 0; right < s.length(); right++) {
        while (charSet.contains(s.charAt(right))) {
            charSet.remove(s.charAt(left));
            left++;
        }
        charSet.add(s.charAt(right));
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
  },

  defaultInput: {
    s: 'abcabcbb',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'abcabcbb',
      placeholder: 'abcabcbb',
      helperText: 'String to find the longest substring without repeating characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const chars = s.split('');
    const charArray = chars.map((_, i) => i); // use indices as "numbers" for the array viz
    const steps: AlgorithmStep[] = [];
    const charSet = new Set<string>();

    // We store the best window start/end for the "found" highlight
    let bestStart = 0;
    let bestEnd = -1;

    const makeViz = (
      left: number,
      right: number,
      highlights: Record<number, string>,
      labels: Record<number, string>,
      setEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      // We use char codes so the array visualizer shows something,
      // but more importantly we rely on labels/highlights.
      // Using the character's charCode for numeric display.
      type: 'array',
      array: chars.map((c) => c.charCodeAt(0)),
      highlights,
      labels: {
        ...Object.fromEntries(chars.map((c, i) => [i, c])),
        ...labels,
      },
      auxData: {
        label: 'Character Set',
        entries: setEntries,
      },
    });

    const getSetEntries = (): { key: string; value: string }[] =>
      Array.from(charSet)
        .sort()
        .map((c) => ({ key: c, value: 'in window' }));

    let left = 0;
    let maxLen = 0;

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: 'Initialize an empty character set, left pointer at 0, and maxLen at 0.',
      variables: { left: 0, maxLen: 0, charSet: [] },
      visualization: makeViz(0, -1, {}, {}, []),
    });

    for (let right = 0; right < chars.length; right++) {
      const currentChar = chars[right];

      // Step: Expand window to include chars[right]
      const expandHighlights: Record<number, string> = {};
      const expandLabels: Record<number, string> = {};

      // Show best window found so far dimly
      if (bestEnd >= bestStart) {
        for (let b = bestStart; b <= bestEnd; b++) {
          expandHighlights[b] = 'found';
        }
      }

      // Show current window
      for (let w = left; w < right; w++) {
        expandHighlights[w] = 'active';
      }
      expandHighlights[right] = 'comparing';
      if (left <= right) expandLabels[left] = 'L';
      expandLabels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Expand window: right = ${right}, character '${currentChar}'. Check if '${currentChar}' is in the set.`,
        variables: { left, right, currentChar, maxLen, charSet: Array.from(charSet) },
        visualization: makeViz(left, right, expandHighlights, expandLabels, getSetEntries()),
      });

      // Shrink window if duplicate
      if (charSet.has(currentChar)) {
        steps.push({
          line: 6,
          explanation: `'${currentChar}' is already in the set! Must shrink window from the left until it is removed.`,
          variables: { left, right, currentChar, maxLen, charSet: Array.from(charSet) },
          visualization: makeViz(left, right, { ...expandHighlights, [right]: 'mismatch' }, expandLabels, getSetEntries()),
        });

        while (charSet.has(currentChar)) {
          const removedChar = chars[left];
          charSet.delete(removedChar);

          const shrinkHighlights: Record<number, string> = {};
          // Show best found so far
          if (bestEnd >= bestStart) {
            for (let b = bestStart; b <= bestEnd; b++) {
              shrinkHighlights[b] = 'found';
            }
          }
          // Mark removed element
          shrinkHighlights[left] = 'visited';
          // Mark remaining window
          for (let w = left + 1; w < right; w++) {
            shrinkHighlights[w] = 'active';
          }
          shrinkHighlights[right] = 'comparing';

          const shrinkLabels: Record<number, string> = {};
          shrinkLabels[left] = 'L';
          shrinkLabels[right] = 'R';

          steps.push({
            line: 7,
            explanation: `Remove '${removedChar}' (index ${left}) from set. Move left to ${left + 1}.`,
            variables: { left: left + 1, right, removed: removedChar, maxLen, charSet: Array.from(charSet) },
            visualization: makeViz(left, right, shrinkHighlights, shrinkLabels, getSetEntries()),
          });

          left++;
        }
      }

      // Add current character to set
      charSet.add(currentChar);
      const windowLen = right - left + 1;

      const addHighlights: Record<number, string> = {};
      // Show best found window
      if (bestEnd >= bestStart) {
        for (let b = bestStart; b <= bestEnd; b++) {
          addHighlights[b] = 'found';
        }
      }
      // Current window
      for (let w = left; w <= right; w++) {
        addHighlights[w] = 'active';
      }
      const addLabels: Record<number, string> = {};
      addLabels[left] = 'L';
      addLabels[right] = 'R';

      steps.push({
        line: 9,
        explanation: `Add '${currentChar}' to set. Window [${left}..${right}] = "${s.substring(left, right + 1)}", length ${windowLen}.`,
        variables: { left, right, windowLen, maxLen, charSet: Array.from(charSet) },
        visualization: makeViz(left, right, addHighlights, addLabels, getSetEntries()),
      });

      // Update maxLen
      if (windowLen > maxLen) {
        maxLen = windowLen;
        bestStart = left;
        bestEnd = right;

        const bestHighlights: Record<number, string> = {};
        for (let b = bestStart; b <= bestEnd; b++) {
          bestHighlights[b] = 'found';
        }
        const bestLabels: Record<number, string> = {};
        bestLabels[bestStart] = 'L';
        bestLabels[bestEnd] = 'R';

        steps.push({
          line: 10,
          explanation: `New maximum length! maxLen = ${maxLen} from substring "${s.substring(bestStart, bestEnd + 1)}".`,
          variables: { left, right, maxLen, bestSubstring: s.substring(bestStart, bestEnd + 1) },
          visualization: makeViz(left, right, bestHighlights, bestLabels, getSetEntries()),
        });
      }
    }

    // Final result
    const finalHighlights: Record<number, string> = {};
    for (let b = bestStart; b <= bestEnd; b++) {
      finalHighlights[b] = 'found';
    }
    const finalLabels: Record<number, string> = {};
    if (bestEnd >= bestStart) {
      finalLabels[bestStart] = 'start';
      finalLabels[bestEnd] = 'end';
    }

    steps.push({
      line: 11,
      explanation: `Done! Longest substring without repeating characters has length ${maxLen}: "${s.substring(bestStart, bestEnd + 1)}".`,
      variables: { maxLen, bestSubstring: s.substring(bestStart, bestEnd + 1), result: maxLen },
      visualization: makeViz(bestStart, bestEnd, finalHighlights, finalLabels, getSetEntries()),
    });

    return steps;
  },
};

export default slidingWindowUniqueChars;
