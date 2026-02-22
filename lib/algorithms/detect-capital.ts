import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const detectCapital: AlgorithmDefinition = {
  id: 'detect-capital',
  title: 'Detect Capital',
  leetcodeNumber: 520,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a word, check if its capital usage is correct. Capital usage is correct if: all letters are uppercase, all letters are lowercase, or only the first letter is uppercase. Return true if the capital usage is correct.',
  tags: ['string', 'character classification'],

  code: {
    pseudocode: `function detectCapitalUse(word):
  allUpper = all characters are uppercase
  allLower = all characters are lowercase
  firstOnly = word[0] is upper AND rest are lower
  return allUpper OR allLower OR firstOnly`,

    python: `def detectCapitalUse(word: str) -> bool:
    return word.isupper() or word.islower() or word.istitle()`,

    javascript: `function detectCapitalUse(word) {
  return word === word.toUpperCase() ||
         word === word.toLowerCase() ||
         word[0] === word[0].toUpperCase() && word.slice(1) === word.slice(1).toLowerCase();
}`,

    java: `public boolean detectCapitalUse(String word) {
    return word.equals(word.toUpperCase()) ||
           word.equals(word.toLowerCase()) ||
           Character.isUpperCase(word.charAt(0)) &&
           word.substring(1).equals(word.substring(1).toLowerCase());
}`,
  },

  defaultInput: {
    word: 'Google',
  },

  inputFields: [
    {
      name: 'word',
      label: 'Word',
      type: 'string',
      defaultValue: 'Google',
      placeholder: 'Google',
      helperText: 'Word to check for correct capital usage',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const steps: AlgorithmStep[] = [];
    const chars = word.split('');

    steps.push({
      line: 1,
      explanation: `Input: "${word}". Check three valid capitalization rules.`,
      variables: { word },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: {},
        labels: Object.fromEntries(chars.map((_, i) => [i, `${i}`])),
      },
    });

    const allUpper = word === word.toUpperCase();
    steps.push({
      line: 2,
      explanation: `Check rule 1: All letters uppercase? "${word}" vs "${word.toUpperCase()}" -> ${allUpper}`,
      variables: { rule: 'ALL_UPPER', result: allUpper },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: Object.fromEntries(
          chars.map((c, i) => [i, c === c.toUpperCase() && c !== c.toLowerCase() ? 'found' : (c === c.toLowerCase() ? 'mismatch' : 'active')])
        ),
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    if (allUpper) {
      steps.push({
        line: 5,
        explanation: `All letters are uppercase. Capital usage is CORRECT. Return true.`,
        variables: { rule: 'ALL_UPPER', result: true },
        visualization: {
          type: 'array',
          array: chars as unknown as number[],
          highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(chars.map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    const allLower = word === word.toLowerCase();
    steps.push({
      line: 3,
      explanation: `Check rule 2: All letters lowercase? "${word}" vs "${word.toLowerCase()}" -> ${allLower}`,
      variables: { rule: 'ALL_LOWER', result: allLower },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: Object.fromEntries(
          chars.map((c, i) => [i, c === c.toLowerCase() ? 'found' : 'mismatch'])
        ),
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    if (allLower) {
      steps.push({
        line: 5,
        explanation: `All letters are lowercase. Capital usage is CORRECT. Return true.`,
        variables: { rule: 'ALL_LOWER', result: true },
        visualization: {
          type: 'array',
          array: chars as unknown as number[],
          highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(chars.map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    const firstOnly =
      chars[0] === chars[0].toUpperCase() &&
      word.slice(1) === word.slice(1).toLowerCase();

    steps.push({
      line: 4,
      explanation: `Check rule 3: Only first letter uppercase? First="${chars[0]}" (upper=${chars[0] === chars[0].toUpperCase()}), rest lowercase=${word.slice(1) === word.slice(1).toLowerCase()} -> ${firstOnly}`,
      variables: { rule: 'FIRST_ONLY', firstChar: chars[0], rest: word.slice(1), result: firstOnly },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: {
          0: chars[0] === chars[0].toUpperCase() ? 'found' : 'mismatch',
          ...Object.fromEntries(
            chars.slice(1).map((c, i) => [i + 1, c === c.toLowerCase() ? 'found' : 'mismatch'])
          ),
        },
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    steps.push({
      line: 5,
      explanation: `Result: ${firstOnly}. Capital usage is ${firstOnly ? 'CORRECT' : 'INCORRECT'}.`,
      variables: { result: firstOnly },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: Object.fromEntries(chars.map((_, i) => [i, firstOnly ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default detectCapital;
