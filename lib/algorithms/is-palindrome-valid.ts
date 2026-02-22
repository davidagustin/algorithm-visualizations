import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const isPalindromeValid: AlgorithmDefinition = {
  id: 'is-palindrome-valid',
  title: 'Valid Palindrome',
  leetcodeNumber: 125,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'A phrase is a palindrome if, after converting all uppercase letters to lowercase and removing all non-alphanumeric characters, it reads the same forward and backward. Uses two pointers from both ends, skipping non-alphanumeric characters.',
  tags: ['two pointers', 'string', 'palindrome'],

  code: {
    pseudocode: `function isPalindrome(s):
  left = 0
  right = length(s) - 1
  while left < right:
    while left < right and not isAlphaNum(s[left]):
      left++
    while left < right and not isAlphaNum(s[right]):
      right--
    if toLower(s[left]) != toLower(s[right]):
      return false
    left++
    right--
  return true`,

    python: `def isPalindrome(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True`,

    javascript: `function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;
  const isAlphaNum = c => /[a-zA-Z0-9]/.test(c);
  while (left < right) {
    while (left < right && !isAlphaNum(s[left])) left++;
    while (left < right && !isAlphaNum(s[right])) right--;
    if (s[left].toLowerCase() !== s[right].toLowerCase())
      return false;
    left++;
    right--;
  }
  return true;
}`,

    java: `public boolean isPalindrome(String s) {
    int left = 0, right = s.length() - 1;
    while (left < right) {
        while (left < right && !Character.isLetterOrDigit(s.charAt(left)))
            left++;
        while (left < right && !Character.isLetterOrDigit(s.charAt(right)))
            right--;
        if (Character.toLowerCase(s.charAt(left))
            != Character.toLowerCase(s.charAt(right)))
            return false;
        left++;
        right--;
    }
    return true;
}`,
  },

  defaultInput: {
    s: 'A man, a plan, a canal: Panama',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'A man, a plan, a canal: Panama',
      placeholder: 'A man, a plan, a canal: Panama',
      helperText: 'String to check if it is a valid palindrome',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const chars = s.split('');
    const steps: AlgorithmStep[] = [];

    const isAlphaNum = (c: string): boolean => /[a-zA-Z0-9]/.test(c);

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
    });

    let left = 0;
    let right = s.length - 1;

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize left = 0, right = ${right}. We will compare alphanumeric characters from both ends.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      // Skip non-alphanumeric on left
      if (!isAlphaNum(s[left])) {
        steps.push({
          line: 5,
          explanation: `'${s[left]}' at index ${left} is not alphanumeric. Skip it, move left forward.`,
          variables: { left, right, char: s[left] },
          visualization: makeViz(
            { [left]: 'visited', [right]: 'pointer' },
            { [left]: 'skip', [right]: 'R' }
          ),
        });
        left++;
        continue;
      }

      // Skip non-alphanumeric on right
      if (!isAlphaNum(s[right])) {
        steps.push({
          line: 7,
          explanation: `'${s[right]}' at index ${right} is not alphanumeric. Skip it, move right backward.`,
          variables: { left, right, char: s[right] },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'visited' },
            { [left]: 'L', [right]: 'skip' }
          ),
        });
        right--;
        continue;
      }

      const lChar = s[left].toLowerCase();
      const rChar = s[right].toLowerCase();

      if (lChar !== rChar) {
        steps.push({
          line: 9,
          explanation: `'${s[left]}' (${lChar}) != '${s[right]}' (${rChar}). Not a palindrome. Return false.`,
          variables: { left, right, leftChar: lChar, rightChar: rChar, result: false },
          visualization: makeViz(
            { [left]: 'mismatch', [right]: 'mismatch' },
            { [left]: 'L', [right]: 'R' }
          ),
        });
        return steps;
      }

      // Match
      steps.push({
        line: 8,
        explanation: `'${s[left]}' (${lChar}) == '${s[right]}' (${rChar}). Characters match! Move both pointers inward.`,
        variables: { left, right, leftChar: lChar, rightChar: rChar },
        visualization: makeViz(
          { [left]: 'match', [right]: 'match' },
          { [left]: 'L', [right]: 'R' }
        ),
      });

      left++;
      right--;
    }

    // Palindrome confirmed
    steps.push({
      line: 12,
      explanation: `All alphanumeric characters matched. The string is a valid palindrome! Return true.`,
      variables: { result: true },
      visualization: makeViz(
        Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default isPalindromeValid;
