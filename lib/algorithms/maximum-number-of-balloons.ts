import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfBalloons: AlgorithmDefinition = {
  id: 'maximum-number-of-balloons',
  title: 'Maximum Number of Balloons',
  leetcodeNumber: 1189,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a string text, find the maximum number of times you can form the word "balloon". The word "balloon" uses: b x1, a x1, l x2, o x2, n x1. Count each relevant character in text then find the bottleneck.',
  tags: ['string', 'hash map', 'frequency count'],

  code: {
    pseudocode: `function maxNumberOfBalloons(text):
  count = frequency map of text
  b = count['b']
  a = count['a']
  l = count['l'] // 2
  o = count['o'] // 2
  n = count['n']
  return min(b, a, l, o, n)`,

    python: `from collections import Counter
def maxNumberOfBalloons(text: str) -> int:
    c = Counter(text)
    return min(c['b'], c['a'], c['l'] // 2, c['o'] // 2, c['n'])`,

    javascript: `function maxNumberOfBalloons(text) {
  const c = {};
  for (const ch of text) c[ch] = (c[ch] || 0) + 1;
  return Math.min(c['b'] || 0, c['a'] || 0, Math.floor((c['l'] || 0) / 2), Math.floor((c['o'] || 0) / 2), c['n'] || 0);
}`,

    java: `public int maxNumberOfBalloons(String text) {
    int[] c = new int[26];
    for (char ch : text.toCharArray()) c[ch - 'a']++;
    return Math.min(Math.min(Math.min(c['b'-'a'], c['a'-'a']), Math.min(c['l'-'a']/2, c['o'-'a']/2)), c['n'-'a']);
}`,
  },

  defaultInput: {
    text: 'nlaebolko',
  },

  inputFields: [
    {
      name: 'text',
      label: 'Text',
      type: 'string',
      defaultValue: 'nlaebolko',
      placeholder: 'nlaebolko',
      helperText: 'Input text to form "balloon" from',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: text.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count how many times "balloon" can be formed from "${text}". Need: b x1, a x1, l x2, o x2, n x1.`,
      variables: { text },
      visualization: makeViz({}, {}),
    });

    // Count characters
    const count: Record<string, number> = {};
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      count[c] = (count[c] || 0) + 1;

      const highlights: Record<number, string> = {};
      const balloonLetters = new Set(['b', 'a', 'l', 'o', 'n']);
      if (balloonLetters.has(c)) {
        highlights[i] = 'found';
      } else {
        highlights[i] = 'visited';
      }

      steps.push({
        line: 2,
        explanation: `Character "${c}" at index ${i}. ${balloonLetters.has(c) ? 'Relevant to "balloon".' : 'Not in "balloon", ignored.'} Count[${c}]=${count[c]}.`,
        variables: { index: i, char: c, 'count[c]': count[c] },
        visualization: makeViz(highlights, { [i]: c }),
      });
    }

    const b = count['b'] || 0;
    const a = count['a'] || 0;
    const l = Math.floor((count['l'] || 0) / 2);
    const o = Math.floor((count['o'] || 0) / 2);
    const n = count['n'] || 0;

    steps.push({
      line: 3,
      explanation: `Counts: b=${count['b'] || 0}, a=${count['a'] || 0}, l=${count['l'] || 0}(need 2 each so ${l}), o=${count['o'] || 0}(need 2 each so ${o}), n=${count['n'] || 0}.`,
      variables: { b, a, l, o, n },
      visualization: makeViz({}, {}),
    });

    const result = Math.min(b, a, l, o, n);
    steps.push({
      line: 7,
      explanation: `min(b=${b}, a=${a}, l/2=${l}, o/2=${o}, n=${n}) = ${result}. The bottleneck limits how many times we can form "balloon".`,
      variables: { result, bottleneck: Math.min(b, a, l, o, n) },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default maximumNumberOfBalloons;
