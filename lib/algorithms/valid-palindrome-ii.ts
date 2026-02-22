import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validPalindromeII: AlgorithmDefinition = {
  id: 'valid-palindrome-ii',
  title: 'Valid Palindrome II',
  leetcodeNumber: 680,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given a string, determine if it can be a palindrome after deleting at most one character. Use two pointers from both ends. When a mismatch is found, try skipping either the left or right character and check if the remaining substring is a palindrome.',
  tags: ['Two Pointers', 'String', 'Greedy'],
  code: {
    pseudocode: `function validPalindrome(s):
  function isPalin(l, r):
    while l < r:
      if s[l] != s[r]: return false
      l++; r--
    return true
  l, r = 0, len(s)-1
  while l < r:
    if s[l] != s[r]:
      return isPalin(l+1, r) or isPalin(l, r-1)
    l++; r--
  return true`,
    python: `def validPalindrome(s):
    def isPalin(l, r):
        while l < r:
            if s[l] != s[r]: return False
            l += 1; r -= 1
        return True
    l, r = 0, len(s) - 1
    while l < r:
        if s[l] != s[r]:
            return isPalin(l+1, r) or isPalin(l, r-1)
        l += 1; r -= 1
    return True`,
    javascript: `function validPalindrome(s) {
  function isPalin(l, r) {
    while (l < r) {
      if (s[l] !== s[r]) return false;
      l++; r--;
    }
    return true;
  }
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return isPalin(l+1,r) || isPalin(l,r-1);
    l++; r--;
  }
  return true;
}`,
    java: `public boolean validPalindrome(String s) {
    int l = 0, r = s.length() - 1;
    while (l < r) {
        if (s.charAt(l) != s.charAt(r))
            return isPalin(s,l+1,r) || isPalin(s,l,r-1);
        l++; r--;
    }
    return true;
}
boolean isPalin(String s, int l, int r) {
    while (l < r) {
        if (s.charAt(l) != s.charAt(r)) return false;
        l++; r--;
    }
    return true;
}`,
  },
  defaultInput: { s: 'abca' },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abca',
      placeholder: 'e.g. abca',
      helperText: 'String to check (at most one deletion allowed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');
    // Use char codes for array visualization
    const arr = chars.map(c => c.charCodeAt(0));

    const makeViz = (
      l: number,
      r: number,
      skipLeft: boolean | null,
      skipRight: boolean | null,
      phase: string,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < chars.length; k++) {
        highlights[k] = 'default';
        labels[k] = chars[k];
      }

      if (l >= 0 && l < chars.length) {
        highlights[l] = chars[l] === chars[r] ? 'match' : 'comparing';
        labels[l] = `L:${chars[l]}`;
      }
      if (r >= 0 && r < chars.length && r !== l) {
        highlights[r] = chars[l] === chars[r] ? 'match' : 'mismatch';
        labels[r] = `R:${chars[r]}`;
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Valid Palindrome II',
          entries: [
            { key: 'String', value: s },
            { key: 'L', value: String(l) },
            { key: 'R', value: String(r) },
            { key: 'Phase', value: phase },
          ],
        },
      };
    };

    steps.push({
      line: 7,
      explanation: `Check if "${s}" can be a palindrome with at most one deletion. Two-pointer approach from both ends.`,
      variables: { s },
      visualization: makeViz(0, chars.length - 1, null, null, 'Initialize'),
    });

    let l = 0;
    let r = chars.length - 1;

    const isPalin = (lo: number, hi: number): boolean => {
      while (lo < hi) {
        if (chars[lo] !== chars[hi]) return false;
        lo++; hi--;
      }
      return true;
    };

    while (l < r) {
      if (chars[l] === chars[r]) {
        steps.push({
          line: 10,
          explanation: `s[${l}]='${chars[l]}' == s[${r}]='${chars[r]}'. Match! Move pointers inward.`,
          variables: { l, r, 'chars[l]': chars[l], 'chars[r]': chars[r] },
          visualization: makeViz(l, r, null, null, 'Match'),
        });
        l++; r--;
      } else {
        steps.push({
          line: 9,
          explanation: `Mismatch: s[${l}]='${chars[l]}' != s[${r}]='${chars[r]}'. Try deleting one of them.`,
          variables: { l, r, 'chars[l]': chars[l], 'chars[r]': chars[r] },
          visualization: makeViz(l, r, null, null, 'Mismatch — try deletion'),
        });

        const skipLeftResult = isPalin(l + 1, r);
        const skipRightResult = isPalin(l, r - 1);
        const result = skipLeftResult || skipRightResult;

        steps.push({
          line: 10,
          explanation: `Skip s[${l}]='${chars[l]}': isPalin("${s.slice(l + 1, r + 1)}")=${skipLeftResult}. Skip s[${r}]='${chars[r]}': isPalin("${s.slice(l, r)}")=${skipRightResult}. Result: ${result}.`,
          variables: { skipLeftResult, skipRightResult, result },
          visualization: {
            type: 'array',
            array: arr,
            highlights: Object.fromEntries(
              chars.map((_, k) => [
                k,
                k === l ? 'swapping' : k === r ? 'swapping' : result ? 'found' : 'mismatch',
              ]),
            ),
            labels: Object.fromEntries(chars.map((c, k) => [k, c])),
            auxData: {
              label: 'Deletion Check',
              entries: [
                { key: `Skip '${chars[l]}' at [${l}]`, value: String(skipLeftResult) },
                { key: `Skip '${chars[r]}' at [${r}]`, value: String(skipRightResult) },
                { key: 'Valid Palindrome?', value: String(result) },
              ],
            },
          },
        });

        return steps;
      }
    }

    steps.push({
      line: 11,
      explanation: `All characters matched. "${s}" is already a palindrome. Return true.`,
      variables: { result: true },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(chars.map((_, k) => [k, 'found'])),
        labels: Object.fromEntries(chars.map((c, k) => [k, c])),
        auxData: {
          label: 'Result',
          entries: [{ key: 'Valid Palindrome?', value: 'true (no deletion needed)' }],
        },
      },
    });

    return steps;
  },
};

export default validPalindromeII;
