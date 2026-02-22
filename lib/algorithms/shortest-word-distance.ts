import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestWordDistance: AlgorithmDefinition = {
  id: 'shortest-word-distance',
  title: 'Shortest Word Distance',
  leetcodeNumber: 243,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given a list of words and two words word1 and word2, return the shortest distance between these two words in the list. Track the last seen positions of both words and compute the distance at each occurrence.',
  tags: ['two pointers', 'array', 'string'],

  code: {
    pseudocode: `function shortestDistance(words, word1, word2):
  pos1 = -1, pos2 = -1
  minDist = infinity
  for i = 0 to length(words)-1:
    if words[i] == word1: pos1 = i
    if words[i] == word2: pos2 = i
    if pos1 != -1 and pos2 != -1:
      minDist = min(minDist, |pos1 - pos2|)
  return minDist`,

    python: `def shortestDistance(words: list[str], word1: str, word2: str) -> int:
    pos1, pos2 = -1, -1
    min_dist = float('inf')
    for i, word in enumerate(words):
        if word == word1:
            pos1 = i
        if word == word2:
            pos2 = i
        if pos1 != -1 and pos2 != -1:
            min_dist = min(min_dist, abs(pos1 - pos2))
    return min_dist`,

    javascript: `function shortestDistance(words, word1, word2) {
  let pos1 = -1, pos2 = -1;
  let minDist = Infinity;
  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) pos1 = i;
    if (words[i] === word2) pos2 = i;
    if (pos1 !== -1 && pos2 !== -1) {
      minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
  }
  return minDist;
}`,

    java: `public int shortestDistance(String[] words, String word1, String word2) {
    int pos1 = -1, pos2 = -1, minDist = Integer.MAX_VALUE;
    for (int i = 0; i < words.length; i++) {
        if (words[i].equals(word1)) pos1 = i;
        if (words[i].equals(word2)) pos2 = i;
        if (pos1 != -1 && pos2 != -1)
            minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
    return minDist;
}`,
  },

  defaultInput: {
    words: ['practice', 'makes', 'perfect', 'coding', 'makes'],
    word1: 'coding',
    word2: 'practice',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words Array',
      type: 'array',
      defaultValue: ['practice', 'makes', 'perfect', 'coding', 'makes'],
      placeholder: 'practice,makes,perfect,coding,makes',
      helperText: 'Comma-separated words',
    },
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'coding',
      placeholder: 'coding',
      helperText: 'First target word',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'practice',
      placeholder: 'practice',
      helperText: 'Second target word',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const steps: AlgorithmStep[] = [];

    const indices = words.map((_, i) => i);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: indices,
      highlights,
      labels,
    });

    let pos1 = -1;
    let pos2 = -1;
    let minDist = Infinity;

    steps.push({
      line: 1,
      explanation: `Initialize pos1=-1, pos2=-1, minDist=Infinity. Searching for "${word1}" and "${word2}".`,
      variables: { pos1, pos2, minDist: 'Infinity' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < words.length; i++) {
      const isW1 = words[i] === word1;
      const isW2 = words[i] === word2;

      if (isW1) pos1 = i;
      if (isW2) pos2 = i;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      hl[i] = isW1 || isW2 ? 'active' : 'comparing';
      lb[i] = words[i];
      if (pos1 !== -1) lb[pos1] = `${words[pos1]}(p1)`;
      if (pos2 !== -1) lb[pos2] = `${words[pos2]}(p2)`;

      if (isW1 || isW2) {
        steps.push({
          line: isW1 ? 4 : 5,
          explanation: `Found "${words[i]}" at index ${i}. ${isW1 ? `pos1=${pos1}` : `pos2=${pos2}`}.`,
          variables: { i, word: words[i], pos1, pos2 },
          visualization: makeViz(hl, lb),
        });

        if (pos1 !== -1 && pos2 !== -1) {
          const dist = Math.abs(pos1 - pos2);
          if (dist < minDist) minDist = dist;
          steps.push({
            line: 7,
            explanation: `Both found. Distance = |${pos1} - ${pos2}| = ${dist}. minDist updated to ${minDist}.`,
            variables: { pos1, pos2, dist, minDist },
            visualization: makeViz({ [pos1]: 'found', [pos2]: 'found' }, { [pos1]: `p1(${pos1})`, [pos2]: `p2(${pos2})` }),
          });
        }
      } else {
        steps.push({
          line: 3,
          explanation: `Index ${i}: "${words[i]}" is neither word1 nor word2, skip.`,
          variables: { i, word: words[i] },
          visualization: makeViz(hl, lb),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Shortest distance between "${word1}" and "${word2}" is ${minDist}.`,
      variables: { minDist },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default shortestWordDistance;
