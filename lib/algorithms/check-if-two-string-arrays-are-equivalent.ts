import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfTwoStringArraysAreEquivalent: AlgorithmDefinition = {
  id: 'check-if-two-string-arrays-are-equivalent',
  title: 'Check If Two String Arrays are Equivalent',
  leetcodeNumber: 1662,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given two string arrays word1 and word2, return true if they represent the same string when concatenated. Simply concatenate all strings in each array and compare.',
  tags: ['string', 'array'],

  code: {
    pseudocode: `function arrayStringsAreEqual(word1, word2):
  return word1.join("") == word2.join("")`,

    python: `def arrayStringsAreEqual(word1: list[str], word2: list[str]) -> bool:
    return ''.join(word1) == ''.join(word2)`,

    javascript: `function arrayStringsAreEqual(word1, word2) {
  return word1.join('') === word2.join('');
}`,

    java: `public boolean arrayStringsAreEqual(String[] word1, String[] word2) {
    return String.join("", word1).equals(String.join("", word2));
}`,
  },

  defaultInput: {
    word1: 'ab,c',
    word2: 'a,bc',
  },

  inputFields: [
    {
      name: 'word1',
      label: 'Word Array 1 (comma-separated)',
      type: 'string',
      defaultValue: 'ab,c',
      placeholder: 'ab,c',
      helperText: 'First string array',
    },
    {
      name: 'word2',
      label: 'Word Array 2 (comma-separated)',
      type: 'string',
      defaultValue: 'a,bc',
      placeholder: 'a,bc',
      helperText: 'Second string array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word1Raw = input.word1 as string;
    const word2Raw = input.word2 as string;
    const word1 = word1Raw.split(',').map(w => w.trim());
    const word2 = word2Raw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: word1 as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Compare string arrays [${word1.map(w => `"${w}"`).join(', ')}] and [${word2.map(w => `"${w}"`).join(', ')}] by concatenating each.`,
      variables: { word1: word1.join(','), word2: word2.join(',') },
      visualization: makeViz({}, {}),
    });

    let concat1 = '';
    for (let i = 0; i < word1.length; i++) {
      concat1 += word1[i];
      steps.push({
        line: 1,
        explanation: `Concatenating word1[${i}]="${word1[i]}": result so far = "${concat1}".`,
        variables: { i, word: word1[i], concat1 },
        visualization: makeViz({ [i]: 'active' }, { [i]: word1[i] }),
      });
    }

    let concat2 = '';
    const makeViz2 = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: word2 as unknown as number[],
      highlights,
      labels,
    });

    for (let i = 0; i < word2.length; i++) {
      concat2 += word2[i];
      steps.push({
        line: 1,
        explanation: `Concatenating word2[${i}]="${word2[i]}": result so far = "${concat2}".`,
        variables: { i, word: word2[i], concat2 },
        visualization: makeViz2({ [i]: 'comparing' }, { [i]: word2[i] }),
      });
    }

    const result = concat1 === concat2;
    steps.push({
      line: 2,
      explanation: `Compare "${concat1}" == "${concat2}" => ${result}. The arrays ${result ? 'DO' : 'do NOT'} represent the same string.`,
      variables: { concat1, concat2, result },
      visualization: makeViz(
        Object.fromEntries(word1.map((_, i) => [i, result ? 'found' : 'mismatch'])),
        {}
      ),
    });

    return steps;
  },
};

export default checkIfTwoStringArraysAreEquivalent;
