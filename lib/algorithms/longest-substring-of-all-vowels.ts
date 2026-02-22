import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestSubstringOfAllVowels: AlgorithmDefinition = {
  id: 'longest-substring-of-all-vowels',
  title: 'Longest Substring Of All Vowels in Order',
  leetcodeNumber: 1839,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A string is beautiful if it only contains vowels (a, e, i, o, u) and each vowel appears at least once, and it is alphabetically non-decreasing. Given a string word, return the length of the longest beautiful substring. Use sliding window tracking vowel count and current vowel.',
  tags: ['sliding window', 'string'],

  code: {
    pseudocode: `function longestBeautifulSubstring(word):
  result = 0
  left = 0
  distinct = 1
  for right in range(1, len(word)):
    if word[right] < word[right-1]:
      left = right
      distinct = 1
    elif word[right] > word[right-1]:
      distinct++
    if distinct == 5:
      result = max(result, right - left + 1)
  return result`,

    python: `def longestBeautifulSubstring(word: str) -> int:
    result = 0
    left = 0
    distinct = 1
    for right in range(1, len(word)):
        if word[right] < word[right-1]:
            left = right
            distinct = 1
        elif word[right] > word[right-1]:
            distinct += 1
        if distinct == 5:
            result = max(result, right - left + 1)
    return result`,

    javascript: `function longestBeautifulSubstring(word) {
  let result = 0, left = 0, distinct = 1;
  for (let right = 1; right < word.length; right++) {
    if (word[right] < word[right-1]) {
      left = right;
      distinct = 1;
    } else if (word[right] > word[right-1]) {
      distinct++;
    }
    if (distinct === 5) result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int longestBeautifulSubstring(String word) {
    int result = 0, left = 0, distinct = 1;
    for (int right = 1; right < word.length(); right++) {
        if (word.charAt(right) < word.charAt(right-1)) {
            left = right;
            distinct = 1;
        } else if (word.charAt(right) > word.charAt(right-1)) {
            distinct++;
        }
        if (distinct == 5) result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    word: 'aeiaaioaaaaeiiiiouuuooaauuaeiu',
  },

  inputFields: [
    {
      name: 'word',
      label: 'Word',
      type: 'string',
      defaultValue: 'aeiaaioaaaaeiiiiouuuooaauuaeiu',
      placeholder: 'aeiaaioaaaaeiiiiouuuooaauuaeiu',
      helperText: 'String of lowercase vowels only',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const steps: AlgorithmStep[] = [];
    const n = word.length;

    const arr = word.split('').map(c => ({ a: 1, e: 2, i: 3, o: 4, u: 5 }[c] || 0));

    steps.push({
      line: 1,
      explanation: `Find longest substring with all 5 vowels (a,e,i,o,u) in non-decreasing order. Each character must be >= previous. Track distinct vowel count.`,
      variables: { result: 0, distinct: 1, left: 0 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(word.split('').slice(0, 10).map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    let result = 0;
    let left = 0;
    let distinct = 1;

    for (let right = 1; right < n; right++) {
      if (word[right] < word[right - 1]) {
        steps.push({
          line: 5,
          explanation: `word[${right}]="${word[right]}" < word[${right - 1}]="${word[right - 1]}": decreasing! Reset window at index ${right}. Distinct vowels reset to 1.`,
          variables: { right, current: word[right], previous: word[right - 1], action: 'reset' },
          visualization: {
            type: 'array',
            array: arr,
            highlights: { [right - 1]: 'mismatch', [right]: 'active' },
            labels: { [right - 1]: word[right - 1], [right]: word[right] },
          } as ArrayVisualization,
        });
        left = right;
        distinct = 1;
      } else if (word[right] > word[right - 1]) {
        distinct++;
        steps.push({
          line: 8,
          explanation: `word[${right}]="${word[right]}" > word[${right - 1}]="${word[right - 1]}": new vowel encountered. Distinct count = ${distinct}.`,
          variables: { right, current: word[right], distinct, left },
          visualization: {
            type: 'array',
            array: arr,
            highlights: { [right]: 'found', [right - 1]: 'active' },
            labels: { [left]: 'L', [right]: `${word[right]}(${distinct})` },
          } as ArrayVisualization,
        });
      }

      if (distinct === 5) {
        const len = right - left + 1;
        if (len > result) result = len;
        steps.push({
          line: 10,
          explanation: `All 5 vowels present in window [${left}..${right}]! Length = ${len}. Best = ${result}.`,
          variables: { left, right, length: len, result },
          visualization: {
            type: 'array',
            array: arr,
            highlights: Object.fromEntries(Array.from({ length: len }, (_, i) => [left + i, 'found'])),
            labels: { [left]: 'L', [right]: 'R' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Longest beautiful substring length = ${result}.`,
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

export default longestSubstringOfAllVowels;
