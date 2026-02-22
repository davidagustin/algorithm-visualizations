import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const distributeCandies: AlgorithmDefinition = {
  id: 'distribute-candies',
  title: 'Distribute Candies',
  leetcodeNumber: 575,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array of candy types, Alice can eat n/2 candies (half the total). Return the maximum number of different candy types she can eat. Use a hash set to count unique candy types, then the answer is min(uniqueTypes, n/2).',
  tags: ['hash map', 'hash set', 'array', 'greedy'],

  code: {
    pseudocode: `function distributeCandies(candyType):
  n = len(candyType)
  unique = len(set(candyType))
  return min(unique, n // 2)`,
    python: `def distributeCandies(candyType):
    return min(len(set(candyType)), len(candyType) // 2)`,
    javascript: `function distributeCandies(candyType) {
  const unique = new Set(candyType).size;
  return Math.min(unique, candyType.length >> 1);
}`,
    java: `public int distributeCandies(int[] candyType) {
    Set<Integer> unique = new HashSet<>();
    for (int c : candyType) unique.add(c);
    return Math.min(unique.size(), candyType.length / 2);
}`,
  },

  defaultInput: {
    candyType: [1, 1, 2, 2, 3, 3],
  },

  inputFields: [
    {
      name: 'candyType',
      label: 'Candy Types',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 3, 3],
      placeholder: '1,1,2,2,3,3',
      helperText: 'Array of candy type IDs (even length)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const candyType = input.candyType as number[];
    const steps: AlgorithmStep[] = [];
    const n = candyType.length;
    const allowed = Math.floor(n / 2);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...candyType],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Total candies n=${n}. Alice can eat n/2 = ${allowed} candies.`,
      variables: { n, allowed },
      visualization: makeViz({}, {}),
    });

    const unique = new Set<number>();
    for (let i = 0; i < candyType.length; i++) {
      const c = candyType[i];
      const isNew = !unique.has(c);
      unique.add(c);

      steps.push({
        line: 2,
        explanation: `candy[${i}]=${c}: ${isNew ? 'new type! unique count = ' + unique.size : 'already seen, unique stays at ' + unique.size}`,
        variables: { index: i, type: c, isNew, uniqueCount: unique.size },
        visualization: makeViz(
          { [i]: isNew ? 'found' : 'active' },
          { [i]: isNew ? 'new' : 'dup' }
        ),
      });
    }

    const result = Math.min(unique.size, allowed);

    steps.push({
      line: 3,
      explanation: `Unique candy types = ${unique.size}. Alice can eat at most ${allowed}. Answer = min(${unique.size}, ${allowed}) = ${result}.`,
      variables: { uniqueTypes: unique.size, allowed, result },
      visualization: makeViz(
        Object.fromEntries(candyType.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(candyType.map((_, i) => [i, `${candyType[i]}`]))
      ),
    });

    return steps;
  },
};

export default distributeCandies;
