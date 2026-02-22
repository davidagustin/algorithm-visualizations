import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uncommonWordsFromTwoSentences: AlgorithmDefinition = {
  id: 'uncommon-words-from-two-sentences',
  title: 'Uncommon Words from Two Sentences',
  leetcodeNumber: 884,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'A word is uncommon if it appears exactly once across both sentences combined. Split both sentences, combine all words, and count frequencies in a hash map. Return all words with a count of exactly 1.',
  tags: ['hash map', 'string', 'counting'],

  code: {
    pseudocode: `function uncommonFromSentences(s1, s2):
  words = (s1 + " " + s2).split()
  freq = {}
  for word in words:
    freq[word] = freq.get(word, 0) + 1
  return [w for w, c in freq.items() if c == 1]`,

    python: `from collections import Counter
def uncommonFromSentences(s1: str, s2: str) -> list[str]:
    freq = Counter((s1 + " " + s2).split())
    return [w for w, c in freq.items() if c == 1]`,

    javascript: `function uncommonFromSentences(s1, s2) {
  const freq = new Map();
  for (const w of (s1 + " " + s2).split(" "))
    freq.set(w, (freq.get(w) || 0) + 1);
  return [...freq.entries()].filter(([, c]) => c === 1).map(([w]) => w);
}`,

    java: `public String[] uncommonFromSentences(String s1, String s2) {
    Map<String, Integer> freq = new HashMap<>();
    for (String w : (s1 + " " + s2).split(" "))
        freq.merge(w, 1, Integer::sum);
    return freq.entrySet().stream()
        .filter(e -> e.getValue() == 1)
        .map(Map.Entry::getKey)
        .toArray(String[]::new);
}`,
  },

  defaultInput: {
    s1: 'this apple is sweet',
    s2: 'this apple is sour',
  },

  inputFields: [
    {
      name: 's1',
      label: 'Sentence 1',
      type: 'string',
      defaultValue: 'this apple is sweet',
      placeholder: 'this apple is sweet',
      helperText: 'First sentence',
    },
    {
      name: 's2',
      label: 'Sentence 2',
      type: 'string',
      defaultValue: 'this apple is sour',
      placeholder: 'this apple is sour',
      helperText: 'Second sentence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];
    const combined = (s1 + ' ' + s2).split(' ');
    const freq: Record<string, number> = {};

    steps.push({
      line: 1,
      explanation: `Combine both sentences: "${s1}" + "${s2}". Total words: [${combined.join(', ')}].`,
      variables: { combined: combined.join(', '), freq: '{}' },
      visualization: {
        type: 'array',
        array: combined as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < combined.length; i++) {
      const word = combined[i];
      freq[word] = (freq[word] || 0) + 1;

      steps.push({
        line: 4,
        explanation: `Word "${word}": freq["${word}"] = ${freq[word]}.`,
        variables: { i, word, freq: JSON.stringify(freq) },
        visualization: {
          type: 'array',
          array: combined as unknown as number[],
          highlights: { [i]: freq[word] === 1 ? 'active' : 'mismatch' },
          labels: { [i]: `f=${freq[word]}` },
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `Frequency map: ${JSON.stringify(freq)}. Filter words with count = 1.`,
      variables: { freq: JSON.stringify(freq) },
      visualization: {
        type: 'array',
        array: combined as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    const result: string[] = [];
    for (const [word, count] of Object.entries(freq)) {
      const idx = combined.indexOf(word);
      if (count === 1) {
        result.push(word);
        steps.push({
          line: 5,
          explanation: `"${word}" appears exactly once. Add to result: ${JSON.stringify(result)}.`,
          variables: { word, count, result: JSON.stringify(result) },
          visualization: {
            type: 'array',
            array: combined as unknown as number[],
            highlights: { [idx]: 'found' },
            labels: { [idx]: 'UNCOMMON' },
          },
        });
      } else {
        steps.push({
          line: 5,
          explanation: `"${word}" appears ${count} times. Not uncommon. Skip.`,
          variables: { word, count },
          visualization: {
            type: 'array',
            array: combined as unknown as number[],
            highlights: { [idx]: 'comparing' },
            labels: { [idx]: `x${count}` },
          },
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Done. Uncommon words: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: combined as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default uncommonWordsFromTwoSentences;
