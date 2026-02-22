import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const geometricSequenceTriplets: AlgorithmDefinition = {
  id: 'geometric-sequence-triplets',
  title: 'Geometric Sequence Triplets',
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Count the number of triplets (i, j, k) such that i < j < k and arr[j] = arr[i] * r and arr[k] = arr[j] * r for a given ratio r. Uses two hash maps: left counts how many times a value has appeared before, right counts how many times a value appears after.',
  tags: ['hash map', 'array', 'math'],

  code: {
    pseudocode: `function countTriplets(arr, r):
  left = {}
  right = {}
  for num in arr:
    right[num] = (right[num] or 0) + 1
  count = 0
  for num in arr:
    right[num] -= 1
    if num % r == 0:
      l = left[num / r] or 0
      rv = right[num * r] or 0
      count += l * rv
    left[num] = (left[num] or 0) + 1
  return count`,

    python: `def countTriplets(arr: list[int], r: int) -> int:
    from collections import Counter
    left = Counter()
    right = Counter(arr)
    count = 0
    for num in arr:
        right[num] -= 1
        if num % r == 0:
            count += left[num // r] * right[num * r]
        left[num] += 1
    return count`,

    javascript: `function countTriplets(arr, r) {
  const left = new Map();
  const right = new Map();
  for (const num of arr)
    right.set(num, (right.get(num) || 0) + 1);
  let count = 0;
  for (const num of arr) {
    right.set(num, right.get(num) - 1);
    if (num % r === 0) {
      const l = left.get(num / r) || 0;
      const rv = right.get(num * r) || 0;
      count += l * rv;
    }
    left.set(num, (left.get(num) || 0) + 1);
  }
  return count;
}`,

    java: `public long countTriplets(List<Long> arr, long r) {
    Map<Long, Long> left = new HashMap<>();
    Map<Long, Long> right = new HashMap<>();
    for (long num : arr)
        right.merge(num, 1L, Long::sum);
    long count = 0;
    for (long num : arr) {
        right.merge(num, -1L, Long::sum);
        if (num % r == 0) {
            long l = left.getOrDefault(num / r, 0L);
            long rv = right.getOrDefault(num * r, 0L);
            count += l * rv;
        }
        left.merge(num, 1L, Long::sum);
    }
    return count;
}`,
  },

  defaultInput: {
    arr: [1, 3, 9, 9, 27, 81],
    r: 3,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 9, 9, 27, 81],
      placeholder: '1,3,9,9,27,81',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'r',
      label: 'Common Ratio',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'The geometric ratio',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const r = input.r as number;
    const steps: AlgorithmStep[] = [];
    const left = new Map<number, number>();
    const right = new Map<number, number>();
    let count = 0;

    // Build right map
    for (const num of arr) {
      right.set(num, (right.get(num) || 0) + 1);
    }

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Maps',
        entries: [
          { key: 'left', value: JSON.stringify(Object.fromEntries(left)) },
          { key: 'right', value: JSON.stringify(Object.fromEntries(right)) },
          { key: 'count', value: String(count) },
        ],
      },
    });

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize: left = {}, right counts all elements. Ratio r = ${r}.`,
      variables: { r, right: Object.fromEntries(right) },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < arr.length; i++) {
      const num = arr[i];

      // Remove from right
      right.set(num, (right.get(num) || 0) - 1);

      const highlights: Record<number, string> = {};
      for (let k = 0; k < i; k++) highlights[k] = 'visited';
      highlights[i] = 'active';

      if (num % r === 0) {
        const prev = num / r;
        const next = num * r;
        const l = left.get(prev) || 0;
        const rv = right.get(next) || 0;
        const triplets = l * rv;
        count += triplets;

        // Highlight elements that could form triplets
        for (let k = 0; k < arr.length; k++) {
          if (k < i && arr[k] === prev) highlights[k] = 'pointer';
          if (k > i && arr[k] === next) highlights[k] = 'comparing';
        }

        steps.push({
          line: 9,
          explanation: `num = ${num}. Need ${prev} on left (count: ${l}) and ${next} on right (count: ${rv}). Triplets through this element: ${l} * ${rv} = ${triplets}. Total count = ${count}.`,
          variables: { i, num, prev, next, leftCount: l, rightCount: rv, triplets, count },
          visualization: makeViz(highlights, { [i]: `${num}` }),
        });
      } else {
        steps.push({
          line: 8,
          explanation: `num = ${num}. ${num} is not divisible by r = ${r}, so it cannot be the middle of a geometric triplet.`,
          variables: { i, num, count },
          visualization: makeViz(highlights, { [i]: `${num}` }),
        });
      }

      // Add to left
      left.set(num, (left.get(num) || 0) + 1);
    }

    // Final
    steps.push({
      line: 13,
      explanation: `Done! Total geometric triplets with ratio ${r}: ${count}.`,
      variables: { result: count, r },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default geometricSequenceTriplets;
