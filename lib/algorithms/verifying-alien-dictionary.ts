import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const verifyingAlienDictionary: AlgorithmDefinition = {
  id: 'verifying-alien-dictionary',
  title: 'Verifying an Alien Dictionary',
  leetcodeNumber: 953,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a list of words sorted in an alien language order and a string order representing the alien alphabet, return true if the words are sorted lexicographically according to the alien order. Map each character to its rank, then compare adjacent words character by character.',
  tags: ['hash map', 'string', 'array', 'sorting'],

  code: {
    pseudocode: `function isAlienSorted(words, order):
  rank = {c: i for i, c in enumerate(order)}
  for i in range(len(words)-1):
    w1, w2 = words[i], words[i+1]
    for j in range(len(w1)):
      if j == len(w2): return false
      if rank[w1[j]] < rank[w2[j]]: break
      if rank[w1[j]] > rank[w2[j]]: return false
  return true`,
    python: `def isAlienSorted(words, order):
    rank = {c: i for i, c in enumerate(order)}
    for i in range(len(words) - 1):
        w1, w2 = words[i], words[i+1]
        for j in range(len(w1)):
            if j == len(w2): return False
            if rank[w1[j]] < rank[w2[j]]: break
            if rank[w1[j]] > rank[w2[j]]: return False
    return True`,
    javascript: `function isAlienSorted(words, order) {
  const rank = {};
  for (let i = 0; i < order.length; i++) rank[order[i]] = i;
  for (let i = 0; i < words.length - 1; i++) {
    const [w1, w2] = [words[i], words[i+1]];
    for (let j = 0; j < w1.length; j++) {
      if (j === w2.length) return false;
      if (rank[w1[j]] < rank[w2[j]]) break;
      if (rank[w1[j]] > rank[w2[j]]) return false;
    }
  }
  return true;
}`,
    java: `public boolean isAlienSorted(String[] words, String order) {
    int[] rank = new int[26];
    for (int i = 0; i < order.length(); i++) rank[order.charAt(i)-'a'] = i;
    for (int i = 0; i < words.length-1; i++) {
        String w1 = words[i], w2 = words[i+1];
        for (int j = 0; j < w1.length(); j++) {
            if (j == w2.length()) return false;
            if (rank[w1.charAt(j)-'a'] < rank[w2.charAt(j)-'a']) break;
            if (rank[w1.charAt(j)-'a'] > rank[w2.charAt(j)-'a']) return false;
        }
    }
    return true;
}`,
  },

  defaultInput: {
    words: ['hello', 'leetcode'],
    order: 'hlabcdefgijkmnopqrstuvwxyz',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['hello', 'leetcode'],
      placeholder: 'hello,leetcode',
      helperText: 'Comma-separated words to verify',
    },
    {
      name: 'order',
      label: 'Alien Order',
      type: 'string',
      defaultValue: 'hlabcdefgijkmnopqrstuvwxyz',
      placeholder: 'hlabcdefgijkmnopqrstuvwxyz',
      helperText: 'All 26 letters in alien alphabetical order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const order = input.order as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words as unknown as number[],
      highlights,
      labels,
    });

    const rank: Record<string, number> = {};
    for (let i = 0; i < order.length; i++) rank[order[i]] = i;

    steps.push({
      line: 1,
      explanation: `Build rank map from alien order. e.g. rank['${order[0]}']=${0}, rank['${order[1]}']=${1}, ...`,
      variables: { orderSample: order.substring(0, 8) + '...' },
      visualization: makeViz({}, {}),
    });

    let valid = true;

    for (let i = 0; i < words.length - 1; i++) {
      const w1 = words[i];
      const w2 = words[i + 1];

      steps.push({
        line: 3,
        explanation: `Compare adjacent words: "${w1}" vs "${w2}"`,
        variables: { w1, w2 },
        visualization: makeViz({ [i]: 'active', [i + 1]: 'comparing' }, { [i]: 'w1', [i + 1]: 'w2' }),
      });

      let decided = false;
      for (let j = 0; j < w1.length; j++) {
        if (j === w2.length) {
          steps.push({
            line: 5,
            explanation: `"${w2}" is a prefix of "${w1}" but shorter. This violates alien order. Return false.`,
            variables: { result: false },
            visualization: makeViz({ [i]: 'mismatch', [i + 1]: 'mismatch' }, { [i]: 'longer', [i + 1]: 'prefix' }),
          });
          valid = false;
          decided = true;
          break;
        }
        const r1 = rank[w1[j]];
        const r2 = rank[w2[j]];
        if (r1 < r2) {
          steps.push({
            line: 6,
            explanation: `char '${w1[j]}'(rank ${r1}) < '${w2[j]}'(rank ${r2}). "${w1}" < "${w2}" confirmed. Move to next pair.`,
            variables: { char1: w1[j], char2: w2[j], rank1: r1, rank2: r2 },
            visualization: makeViz({ [i]: 'found', [i + 1]: 'found' }, { [i]: 'ok', [i + 1]: 'ok' }),
          });
          decided = true;
          break;
        }
        if (r1 > r2) {
          steps.push({
            line: 7,
            explanation: `char '${w1[j]}'(rank ${r1}) > '${w2[j]}'(rank ${r2}). "${w1}" > "${w2}". Not sorted. Return false.`,
            variables: { char1: w1[j], char2: w2[j], rank1: r1, rank2: r2, result: false },
            visualization: makeViz({ [i]: 'mismatch', [i + 1]: 'mismatch' }, { [i]: 'bad', [i + 1]: 'bad' }),
          });
          valid = false;
          decided = true;
          break;
        }
      }
      if (!decided) {
        steps.push({
          line: 8,
          explanation: `All chars matched. "${w1}" is equal to or a prefix of "${w2}". Order is valid for this pair.`,
          variables: { w1, w2 },
          visualization: makeViz({ [i]: 'found', [i + 1]: 'found' }, { [i]: 'ok', [i + 1]: 'ok' }),
        });
      }
      if (!valid) break;
    }

    if (valid) {
      steps.push({
        line: 8,
        explanation: `All adjacent pairs are in valid alien order. Return true.`,
        variables: { result: true },
        visualization: makeViz(
          Object.fromEntries(words.map((_, i) => [i, 'sorted'])),
          Object.fromEntries(words.map((_, i) => [i, words[i]]))
        ),
      });
    }

    return steps;
  },
};

export default verifyingAlienDictionary;
