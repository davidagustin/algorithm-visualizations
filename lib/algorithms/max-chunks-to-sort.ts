import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maxChunksToSort: AlgorithmDefinition = {
  id: 'max-chunks-to-sort',
  title: 'Max Chunks To Make Sorted',
  leetcodeNumber: 769,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an array that is a permutation of [0, n-1], find the maximum number of chunks to split the array so that sorting each chunk independently results in a sorted array. A chunk can end at index i if the maximum value seen so far equals i.',
  tags: ['array', 'greedy', 'sorting'],

  code: {
    pseudocode: `function maxChunksToSorted(arr):
  chunks = 0
  maxSeen = 0
  for i from 0 to length(arr)-1:
    maxSeen = max(maxSeen, arr[i])
    if maxSeen == i:
      chunks++
  return chunks`,

    python: `def maxChunksToSorted(arr: list[int]) -> int:
    chunks = 0
    max_seen = 0
    for i, val in enumerate(arr):
        max_seen = max(max_seen, val)
        if max_seen == i:
            chunks += 1
    return chunks`,

    javascript: `function maxChunksToSorted(arr) {
  let chunks = 0, maxSeen = 0;
  for (let i = 0; i < arr.length; i++) {
    maxSeen = Math.max(maxSeen, arr[i]);
    if (maxSeen === i) chunks++;
  }
  return chunks;
}`,

    java: `public int maxChunksToSorted(int[] arr) {
    int chunks = 0, maxSeen = 0;
    for (int i = 0; i < arr.length; i++) {
        maxSeen = Math.max(maxSeen, arr[i]);
        if (maxSeen == i) chunks++;
    }
    return chunks;
}`,
  },

  defaultInput: {
    nums: [1, 0, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array (permutation of 0..n-1)',
      type: 'array',
      defaultValue: [1, 0, 2, 3, 4],
      placeholder: '1,0,2,3,4',
      helperText: 'Permutation of integers from 0 to n-1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    let chunks = 0;
    let maxSeen = 0;

    steps.push({
      line: 1,
      explanation: `Array: ${JSON.stringify(arr)}. A chunk boundary exists at index i when maxSeen up to i equals i (all values 0..i are in the first i+1 elements).`,
      variables: { chunks: 0, maxSeen: 0 },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < arr.length; i++) {
      const prev = maxSeen;
      maxSeen = Math.max(maxSeen, arr[i]);

      const isBoundary = maxSeen === i;

      steps.push({
        line: 4,
        explanation: `i=${i}, arr[i]=${arr[i]}. maxSeen updated from ${prev} to ${maxSeen}. ${isBoundary ? `maxSeen == i => chunk boundary! chunks=${chunks + 1}.` : `maxSeen (${maxSeen}) != i (${i}), no boundary yet.`}`,
        variables: { i, value: arr[i], maxSeen, chunks: isBoundary ? chunks + 1 : chunks },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i]: isBoundary ? 'found' : 'active' },
          labels: { [i]: isBoundary ? `chunk ${chunks + 1}` : `max=${maxSeen}` },
        },
      });

      if (isBoundary) chunks++;
    }

    steps.push({
      line: 7,
      explanation: `Maximum number of chunks: ${chunks}.`,
      variables: { result: chunks },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default maxChunksToSort;
