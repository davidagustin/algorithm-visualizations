import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumLengthOfPairChain: AlgorithmDefinition = {
  id: 'maximum-length-of-pair-chain',
  title: 'Maximum Length of Pair Chain',
  leetcodeNumber: 646,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given n pairs of numbers, find the longest chain. A chain [a,b] -> [c,d] is valid only if b < c. Sort pairs by end value, then apply greedy or DP. The greedy approach: always pick the pair with smallest end that connects.',
  tags: ['dynamic programming', 'greedy', 'sorting', 'intervals'],

  code: {
    pseudocode: `function findLongestChain(pairs):
  sort pairs by end value
  count = 1
  end = pairs[0][1]
  for i in 1..n-1:
    if pairs[i][0] > end:
      count += 1
      end = pairs[i][1]
  return count`,
    python: `def findLongestChain(pairs: list[list[int]]) -> int:
    pairs.sort(key=lambda x: x[1])
    count, end = 1, pairs[0][1]
    for i in range(1, len(pairs)):
        if pairs[i][0] > end:
            count += 1
            end = pairs[i][1]
    return count`,
    javascript: `function findLongestChain(pairs) {
  pairs.sort((a, b) => a[1] - b[1]);
  let count = 1, end = pairs[0][1];
  for (let i = 1; i < pairs.length; i++) {
    if (pairs[i][0] > end) {
      count++;
      end = pairs[i][1];
    }
  }
  return count;
}`,
    java: `public int findLongestChain(int[][] pairs) {
    Arrays.sort(pairs, (a, b) -> a[1] - b[1]);
    int count = 1, end = pairs[0][1];
    for (int i = 1; i < pairs.length; i++) {
        if (pairs[i][0] > end) {
            count++;
            end = pairs[i][1];
        }
    }
    return count;
}`,
  },

  defaultInput: {
    pairs: [[1, 2], [2, 3], [3, 4]],
  },

  inputFields: [
    {
      name: 'pairs',
      label: 'Pairs (as flat array: a1,b1,a2,b2,...)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 3, 4],
      placeholder: '1,2,2,3,3,4',
      helperText: 'Pairs encoded as flat even-length array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.pairs as number[];
    const pairs: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) pairs.push([flat[i], flat[i + 1]]);

    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input pairs: ${pairs.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}. Sort by end value.`,
      variables: { pairs: JSON.stringify(pairs) },
      visualization: {
        type: 'array',
        array: pairs.map(p => p[1]),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    pairs.sort((a, b) => a[1] - b[1]);

    steps.push({
      line: 2,
      explanation: `After sorting by end: ${pairs.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}.`,
      variables: { sorted: JSON.stringify(pairs) },
      visualization: {
        type: 'array',
        array: pairs.map(p => p[1]),
        highlights: {},
        labels: { 0: 'end' },
      } as ArrayVisualization,
    });

    let count = 1;
    let end = pairs[0][1];

    steps.push({
      line: 3,
      explanation: `Initialize: count=1, end=${end} (first pair [${pairs[0][0]},${pairs[0][1]}]).`,
      variables: { count, end },
      visualization: {
        type: 'array',
        array: pairs.map(p => p[1]),
        highlights: { 0: 'found' },
        labels: { 0: 'chain' },
      } as ArrayVisualization,
    });

    for (let i = 1; i < pairs.length; i++) {
      const [a, b] = pairs[i];
      if (a > end) {
        count++;
        end = b;
        steps.push({
          line: 6,
          explanation: `pairs[${i}]=[${a},${b}]: start ${a} > end ${a > end ? end : '...'} (before update). Extend chain! count=${count}, end=${end}.`,
          variables: { i, pair: `[${a},${b}]`, count, end },
          visualization: {
            type: 'array',
            array: pairs.map(p => p[1]),
            highlights: { [i]: 'found' },
            labels: { [i]: 'added' },
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 5,
          explanation: `pairs[${i}]=[${a},${b}]: start ${a} <= end ${end}. Skip this pair.`,
          variables: { i, pair: `[${a},${b}]`, count, end },
          visualization: {
            type: 'array',
            array: pairs.map(p => p[1]),
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'skip' },
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Longest chain length = ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: pairs.map(p => p[1]),
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumLengthOfPairChain;
