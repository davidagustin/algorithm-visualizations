import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maxNumberOfVowels: AlgorithmDefinition = {
  id: 'max-number-of-vowels',
  title: 'Maximum Number of Vowels in a Substring of Given Length',
  leetcodeNumber: 1456,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string s and an integer k, return the maximum number of vowel letters in any substring of s with length k. Use a fixed-size sliding window: count vowels in the first window of size k, then slide by adding the right character and removing the left character, updating the maximum at each step.',
  tags: ['sliding window', 'string', 'fixed window'],

  code: {
    pseudocode: `function maxVowels(s, k):
  vowels = set('aeiou')
  count = 0
  for i in range(k):
    if s[i] in vowels: count += 1
  result = count
  for i in range(k, len(s)):
    if s[i] in vowels: count += 1
    if s[i-k] in vowels: count -= 1
    result = max(result, count)
  return result`,

    python: `def maxVowels(s: str, k: int) -> int:
    vowels = set('aeiou')
    count = sum(1 for c in s[:k] if c in vowels)
    result = count
    for i in range(k, len(s)):
        if s[i] in vowels:
            count += 1
        if s[i - k] in vowels:
            count -= 1
        result = max(result, count)
    return result`,

    javascript: `function maxVowels(s, k) {
  const vowels = new Set(['a','e','i','o','u']);
  let count = 0;
  for (let i = 0; i < k; i++) {
    if (vowels.has(s[i])) count++;
  }
  let result = count;
  for (let i = k; i < s.length; i++) {
    if (vowels.has(s[i])) count++;
    if (vowels.has(s[i - k])) count--;
    result = Math.max(result, count);
  }
  return result;
}`,

    java: `public int maxVowels(String s, int k) {
    Set<Character> vowels = new HashSet<>(Arrays.asList('a','e','i','o','u'));
    int count = 0;
    for (int i = 0; i < k; i++) {
        if (vowels.contains(s.charAt(i))) count++;
    }
    int result = count;
    for (int i = k; i < s.length(); i++) {
        if (vowels.contains(s.charAt(i))) count++;
        if (vowels.contains(s.charAt(i - k))) count--;
        result = Math.max(result, count);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'abciiidef',
    k: 3,
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'abciiidef',
      placeholder: 'abciiidef',
      helperText: 'Lowercase string',
    },
    {
      name: 'k',
      label: 'Window Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Length of substring to examine',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize fixed-size window of size k=${k} on string "${s}".`,
      variables: { k, stringLength: s.length },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    const initHighlights: Record<number, string> = {};
    const initLabels: Record<number, string> = {};

    for (let i = 0; i < k && i < s.length; i++) {
      if (vowels.has(s[i])) {
        count++;
        initHighlights[i] = 'found';
      } else {
        initHighlights[i] = 'active';
      }
    }
    if (k - 1 < s.length) {
      initLabels[0] = 'L';
      initLabels[k - 1] = 'R';
    }

    steps.push({
      line: 3,
      explanation: `Count vowels in first window "${s.slice(0, k)}": found ${count} vowels.`,
      variables: { window: s.slice(0, k), vowelCount: count },
      visualization: makeViz(initHighlights, initLabels),
    });

    let result = count;

    for (let i = k; i < s.length; i++) {
      const addChar = s[i];
      const removeChar = s[i - k];
      const added = vowels.has(addChar);
      const removed = vowels.has(removeChar);

      if (added) count++;
      if (removed) count--;
      result = Math.max(result, count);

      const left = i - k + 1;
      const right = i;
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let j = left; j <= right; j++) {
        highlights[j] = 'active';
      }
      if (added) highlights[right] = 'found';
      if (removed) highlights[left - 1] = 'mismatch';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 7,
        explanation: `Slide window to "${s.slice(left, right + 1)}". Add '${addChar}' (${added ? 'vowel' : 'not vowel'}), remove '${removeChar}' (${removed ? 'vowel' : 'not vowel'}). Vowel count=${count}, best=${result}.`,
        variables: { left, right, addChar, removeChar, vowelCount: count, result },
        visualization: makeViz(highlights, labels),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum vowels in any window of size ${k} = ${result}.`,
      variables: { result, k },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maxNumberOfVowels;
