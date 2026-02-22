import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const reverseWordsInString: AlgorithmDefinition = {
  id: 'reverse-words-in-string',
  title: 'Reverse Words in a String',
  leetcodeNumber: 151,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an input string, reverse the order of the words. A word is defined as a sequence of non-space characters. The words in the result must be separated by a single space, and no leading or trailing spaces are allowed.',
  tags: ['string', 'two pointers', 'split', 'reverse'],

  code: {
    pseudocode: `function reverseWords(s):
  words = split s by spaces, filter empty
  reverse words array
  return join words with single space`,

    python: `def reverseWords(s: str) -> str:
    words = s.split()
    words.reverse()
    return ' '.join(words)`,

    javascript: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,

    java: `public String reverseWords(String s) {
    String[] words = s.trim().split("\\\\s+");
    StringBuilder sb = new StringBuilder();
    for (int i = words.length - 1; i >= 0; i--) {
        sb.append(words[i]);
        if (i > 0) sb.append(' ');
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    s: 'the sky is blue',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'the sky is blue',
      placeholder: 'the sky is blue',
      helperText: 'A string of words separated by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start with input string: "${s}"`,
      variables: { input: s },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: {},
      },
    });

    const words = s.split(/\s+/).filter(w => w.length > 0);

    steps.push({
      line: 2,
      explanation: `Split string by whitespace and filter empty strings. Found ${words.length} word(s): [${words.map(w => `"${w}"`).join(', ')}]`,
      variables: { words: words.join(', '), count: words.length },
      visualization: {
        type: 'array',
        array: words as unknown as number[],
        highlights: Object.fromEntries(words.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(words.map((_, i) => [i, `w${i}`])),
      },
    });

    const reversed = [...words];
    let left = 0;
    let right = reversed.length - 1;

    while (left < right) {
      steps.push({
        line: 3,
        explanation: `Swap word at index ${left} ("${reversed[left]}") with word at index ${right} ("${reversed[right]}")`,
        variables: { left, right, swapping: `"${reversed[left]}" <-> "${reversed[right]}"` },
        visualization: {
          type: 'array',
          array: reversed as unknown as number[],
          highlights: { [left]: 'swapping', [right]: 'swapping' },
          labels: { [left]: 'L', [right]: 'R' },
        },
      });

      const tmp = reversed[left];
      reversed[left] = reversed[right];
      reversed[right] = tmp;
      left++;
      right--;

      steps.push({
        line: 3,
        explanation: `After swap: [${reversed.map(w => `"${w}"`).join(', ')}]`,
        variables: { left, right, current: reversed.join(', ') },
        visualization: {
          type: 'array',
          array: reversed as unknown as number[],
          highlights: {
            ...Object.fromEntries(Array.from({ length: left }, (_, i) => [i, 'sorted'])),
            ...Object.fromEntries(Array.from({ length: reversed.length - right - 1 }, (_, i) => [reversed.length - 1 - i, 'sorted'])),
          },
          labels: {},
        },
      });
    }

    const result = reversed.join(' ');

    steps.push({
      line: 4,
      explanation: `Join reversed words with a single space. Result: "${result}"`,
      variables: { result },
      visualization: {
        type: 'array',
        array: reversed as unknown as number[],
        highlights: Object.fromEntries(reversed.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(reversed.map((_, i) => [i, `${i}`])),
      },
    });

    return steps;
  },
};

export default reverseWordsInString;
