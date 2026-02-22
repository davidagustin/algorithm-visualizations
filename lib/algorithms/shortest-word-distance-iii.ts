import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestWordDistanceIii: AlgorithmDefinition = {
  id: 'shortest-word-distance-iii',
  title: 'Shortest Word Distance III',
  leetcodeNumber: 245,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Similar to Shortest Word Distance, but word1 and word2 may be the same word. If they are the same, find the minimum distance between two different occurrences of that word. Track both pos1 and pos2 independently during the scan.',
  tags: ['two pointers', 'array', 'string'],

  code: {
    pseudocode: `function shortestDistance(words, word1, word2):
  pos1 = -1, pos2 = -1
  minDist = infinity
  same = (word1 == word2)
  for i = 0 to length(words)-1:
    if words[i] == word1:
      if same: pos2 = pos1
      pos1 = i
    else if words[i] == word2:
      pos2 = i
    if pos1 != -1 and pos2 != -1:
      minDist = min(minDist, |pos1 - pos2|)
  return minDist`,

    python: `def shortestDistance(words: list[str], word1: str, word2: str) -> int:
    pos1, pos2 = -1, -1
    min_dist = float('inf')
    same = word1 == word2
    for i, w in enumerate(words):
        if w == word1:
            if same:
                pos2 = pos1
            pos1 = i
        elif w == word2:
            pos2 = i
        if pos1 != -1 and pos2 != -1:
            min_dist = min(min_dist, abs(pos1 - pos2))
    return min_dist`,

    javascript: `function shortestDistance(words, word1, word2) {
  let pos1 = -1, pos2 = -1, minDist = Infinity;
  const same = word1 === word2;
  for (let i = 0; i < words.length; i++) {
    if (words[i] === word1) {
      if (same) pos2 = pos1;
      pos1 = i;
    } else if (words[i] === word2) {
      pos2 = i;
    }
    if (pos1 !== -1 && pos2 !== -1) {
      minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
  }
  return minDist;
}`,

    java: `public int shortestDistance(String[] words, String word1, String word2) {
    int pos1 = -1, pos2 = -1, minDist = Integer.MAX_VALUE;
    boolean same = word1.equals(word2);
    for (int i = 0; i < words.length; i++) {
        if (words[i].equals(word1)) {
            if (same) pos2 = pos1;
            pos1 = i;
        } else if (words[i].equals(word2)) {
            pos2 = i;
        }
        if (pos1 != -1 && pos2 != -1)
            minDist = Math.min(minDist, Math.abs(pos1 - pos2));
    }
    return minDist;
}`,
  },

  defaultInput: {
    words: ['a', 'c', 'b', 'b', 'a'],
    word1: 'b',
    word2: 'b',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words Array',
      type: 'array',
      defaultValue: ['a', 'c', 'b', 'b', 'a'],
      placeholder: 'a,c,b,b,a',
      helperText: 'Comma-separated words',
    },
    {
      name: 'word1',
      label: 'Word 1',
      type: 'string',
      defaultValue: 'b',
      placeholder: 'b',
      helperText: 'First target word (can equal word2)',
    },
    {
      name: 'word2',
      label: 'Word 2',
      type: 'string',
      defaultValue: 'b',
      placeholder: 'b',
      helperText: 'Second target word (can equal word1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const word1 = input.word1 as string;
    const word2 = input.word2 as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words.map((_, i) => i),
      highlights,
      labels,
    });

    const same = word1 === word2;
    let pos1 = -1;
    let pos2 = -1;
    let minDist = Infinity;

    steps.push({
      line: 1,
      explanation: `Initialize. word1="${word1}", word2="${word2}". Same word: ${same}. If same, we track two consecutive occurrences.`,
      variables: { pos1, pos2, same, minDist: 'Infinity' },
      visualization: makeViz({}, Object.fromEntries(words.map((w, i) => [i, w]))),
    });

    for (let i = 0; i < words.length; i++) {
      const isW1 = words[i] === word1;
      const isW2 = words[i] === word2;

      if (isW1) {
        if (same) {
          pos2 = pos1;
          steps.push({
            line: 6,
            explanation: `Found "${words[i]}" at index ${i}. Since word1==word2, shift: pos2=pos1=${pos2}.`,
            variables: { i, pos1, pos2 },
            visualization: makeViz({ [i]: 'active' }, { [i]: words[i] }),
          });
        }
        pos1 = i;
        steps.push({
          line: 7,
          explanation: `Set pos1=${pos1}.`,
          variables: { i, pos1, pos2 },
          visualization: makeViz({ [i]: 'active' }, { [i]: `p1` }),
        });
      } else if (isW2) {
        pos2 = i;
        steps.push({
          line: 9,
          explanation: `Found "${words[i]}" at index ${i}. Set pos2=${pos2}.`,
          variables: { i, pos1, pos2 },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `p2` }),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Index ${i}: "${words[i]}" does not match either word.`,
          variables: { i },
          visualization: makeViz({ [i]: 'default' }, { [i]: words[i] }),
        });
      }

      if (pos1 !== -1 && pos2 !== -1) {
        const dist = Math.abs(pos1 - pos2);
        if (dist < minDist) minDist = dist;
        steps.push({
          line: 11,
          explanation: `Both positions known. Distance = |${pos1} - ${pos2}| = ${dist}. minDist = ${minDist}.`,
          variables: { pos1, pos2, dist, minDist },
          visualization: makeViz({ [pos1]: 'found', [pos2]: 'found' }, { [pos1]: `p1`, [pos2]: `p2` }),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Minimum distance between "${word1}" and "${word2}" (same=${same}) is ${minDist}.`,
      variables: { minDist },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default shortestWordDistanceIii;
