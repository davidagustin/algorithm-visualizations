import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfEquivalentDominoPairs: AlgorithmDefinition = {
  id: 'number-of-equivalent-domino-pairs',
  title: 'Number of Equivalent Domino Pairs',
  leetcodeNumber: 1128,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a list of dominoes, a domino [a, b] is equivalent to [b, a]. Count the number of pairs (i, j) where i < j and domino i is equivalent to domino j. Normalize each domino so the smaller value comes first, then use a frequency map to count pairs.',
  tags: ['hash map', 'array', 'counting', 'math'],

  code: {
    pseudocode: `function numEquivDominoPairs(dominoes):
  freq = {}
  count = 0
  for [a, b] in dominoes:
    key = (min(a,b), max(a,b))
    count += freq.get(key, 0)
    freq[key] = freq.get(key, 0) + 1
  return count`,
    python: `def numEquivDominoPairs(dominoes):
    freq = {}
    count = 0
    for a, b in dominoes:
        key = (min(a, b), max(a, b))
        count += freq.get(key, 0)
        freq[key] = freq.get(key, 0) + 1
    return count`,
    javascript: `function numEquivDominoPairs(dominoes) {
  const freq = new Map();
  let count = 0;
  for (const [a, b] of dominoes) {
    const key = \`\${Math.min(a,b)},\${Math.max(a,b)}\`;
    count += freq.get(key) || 0;
    freq.set(key, (freq.get(key)||0)+1);
  }
  return count;
}`,
    java: `public int numEquivDominoPairs(int[][] dominoes) {
    Map<Integer,Integer> freq = new HashMap<>();
    int count = 0;
    for (int[] d : dominoes) {
        int key = Math.min(d[0],d[1])*10 + Math.max(d[0],d[1]);
        count += freq.getOrDefault(key, 0);
        freq.merge(key, 1, Integer::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    dominoes: [[1, 2], [2, 1], [3, 4], [5, 6]],
  },

  inputFields: [
    {
      name: 'dominoes',
      label: 'Dominoes',
      type: 'array',
      defaultValue: [[1, 2], [2, 1], [3, 4], [5, 6]],
      placeholder: '[[1,2],[2,1],[3,4],[5,6]]',
      helperText: 'Array of [a, b] domino pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dominoes = input.dominoes as number[][];
    const steps: AlgorithmStep[] = [];

    const dominoLabels = dominoes.map((d) => `[${d[0]},${d[1]}]`);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: dominoLabels as unknown as number[],
      highlights,
      labels,
    });

    const freq = new Map<string, number>();
    let count = 0;

    steps.push({
      line: 1,
      explanation: 'Initialize frequency map and count=0. Normalize each domino: smaller value first.',
      variables: { count, freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < dominoes.length; i++) {
      const [a, b] = dominoes[i];
      const key = `${Math.min(a, b)},${Math.max(a, b)}`;
      const prevCount = freq.get(key) || 0;
      const newPairs = prevCount;

      steps.push({
        line: 4,
        explanation: `domino[${i}]=[${a},${b}]: key="${key}". Found ${prevCount} previous equivalent dominoes. +${newPairs} pairs. count=${count + newPairs}`,
        variables: { i, domino: `[${a},${b}]`, key, prevCount, count: count + newPairs },
        visualization: makeViz(
          { [i]: newPairs > 0 ? 'found' : 'active' },
          { [i]: `key=${key}` }
        ),
      });

      count += newPairs;
      freq.set(key, prevCount + 1);

      steps.push({
        line: 6,
        explanation: `freq["${key}"] = ${freq.get(key)}. Total pairs so far: ${count}.`,
        variables: { [`freq["${key}"]`]: freq.get(key), count },
        visualization: makeViz({ [i]: 'sorted' }, { [i]: `c=${count}` }),
      });
    }

    steps.push({
      line: 7,
      explanation: `Total equivalent domino pairs: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(dominoes.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(dominoes.map((_, i) => [i, dominoLabels[i]]))
      ),
    });

    return steps;
  },
};

export default numberOfEquivalentDominoPairs;
