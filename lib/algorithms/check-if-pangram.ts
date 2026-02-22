import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const checkIfPangram: AlgorithmDefinition = {
  id: 'check-if-pangram',
  title: 'Check if the Sentence Is Pangram',
  leetcodeNumber: 1832,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'A pangram is a sentence where every letter of the English alphabet appears at least once. Given a string sentence containing only lowercase English letters, return true if it is a pangram, false otherwise.',
  tags: ['hash map', 'hash set', 'string', 'alphabet'],

  code: {
    pseudocode: `function checkIfPangram(sentence):
  seen = set()
  for char in sentence:
    seen.add(char)
  return len(seen) == 26`,

    python: `def checkIfPangram(sentence: str) -> bool:
    return len(set(sentence)) == 26`,

    javascript: `function checkIfPangram(sentence) {
  return new Set(sentence).size === 26;
}`,

    java: `public boolean checkIfPangram(String sentence) {
    Set<Character> seen = new HashSet<>();
    for (char c : sentence.toCharArray()) seen.add(c);
    return seen.size() == 26;
}`,
  },

  defaultInput: {
    sentence: 'thequickbrownfoxjumpsoverthelazydog',
  },

  inputFields: [
    {
      name: 'sentence',
      label: 'Sentence',
      type: 'string',
      defaultValue: 'thequickbrownfoxjumpsoverthelazydog',
      placeholder: 'thequickbrownfoxjumpsoverthelazydog',
      helperText: 'Lowercase sentence to check for pangram',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sentence = input.sentence as string;
    const steps: AlgorithmStep[] = [];
    const seen = new Set<string>();

    steps.push({
      line: 1,
      explanation: `Input: "${sentence.length > 30 ? sentence.slice(0, 30) + '...' : sentence}". Need to find all 26 letters of the alphabet.`,
      variables: { sentence, seenCount: 0, needed: 26 },
      visualization: {
        type: 'array',
        array: Array.from({ length: 26 }, (_, i) => i),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: 26 }, (_, i) => [i, String.fromCharCode(97 + i)])),
      },
    });

    for (let i = 0; i < sentence.length; i++) {
      const c = sentence[i];
      const isNew = !seen.has(c);
      seen.add(c);

      if (isNew || i % 5 === 0) {
        const alphabetHighlights: Record<number, string> = {};
        for (const ch of seen) {
          alphabetHighlights[ch.charCodeAt(0) - 97] = 'found';
        }

        steps.push({
          line: 3,
          explanation: `char[${i}]="${c}": ${isNew ? `New letter! Added to set.` : 'Already seen.'} Letters found so far: ${seen.size}/26.`,
          variables: { index: i, char: c, isNew, seenCount: seen.size },
          visualization: {
            type: 'array',
            array: Array.from({ length: 26 }, (_, j) => j),
            highlights: {
              ...alphabetHighlights,
              [c.charCodeAt(0) - 97]: isNew ? 'active' : 'found',
            },
            labels: Object.fromEntries(Array.from({ length: 26 }, (_, j) => [j, String.fromCharCode(97 + j)])),
          },
        });
      }
    }

    const isPangram = seen.size === 26;

    const missing: string[] = [];
    for (let i = 0; i < 26; i++) {
      const ch = String.fromCharCode(97 + i);
      if (!seen.has(ch)) missing.push(ch);
    }

    steps.push({
      line: 4,
      explanation: `Finished scanning. Found ${seen.size} unique letters. ${isPangram ? 'All 26 letters present! It IS a pangram.' : `Missing ${missing.length} letter(s): [${missing.join(', ')}]. NOT a pangram.`}`,
      variables: { uniqueLetters: seen.size, isPangram, missing: missing.join(', ') || 'none' },
      visualization: {
        type: 'array',
        array: Array.from({ length: 26 }, (_, i) => i),
        highlights: Object.fromEntries(Array.from({ length: 26 }, (_, i) => [i, seen.has(String.fromCharCode(97 + i)) ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(Array.from({ length: 26 }, (_, i) => [i, String.fromCharCode(97 + i)])),
      },
    });

    return steps;
  },
};

export default checkIfPangram;
