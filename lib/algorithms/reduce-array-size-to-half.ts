import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reduceArraySizeToHalf: AlgorithmDefinition = {
  id: 'reduce-array-size-to-half',
  title: 'Reduce Array Size to The Half',
  leetcodeNumber: 1338,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given an array, find the minimum number of unique integers to remove such that at least half of the array elements are removed. Greedy: sort element frequencies in descending order and keep removing the most frequent element until we have removed at least half the array.',
  tags: ['greedy', 'hash map', 'sorting', 'array'],

  code: {
    pseudocode: `function minSetSize(arr):
  freq = count frequency of each element
  sort freq values descending
  removed = 0, sets = 0
  target = length(arr) / 2
  for each count in sorted freq:
    removed += count
    sets += 1
    if removed >= target:
      return sets
  return sets`,

    python: `def minSetSize(arr: list[int]) -> int:
    from collections import Counter
    freq = sorted(Counter(arr).values(), reverse=True)
    removed = 0
    for i, count in enumerate(freq):
        removed += count
        if removed >= len(arr) // 2:
            return i + 1
    return len(freq)`,

    javascript: `function minSetSize(arr) {
  const freq = {};
  for (const x of arr) freq[x] = (freq[x] || 0) + 1;
  const counts = Object.values(freq).sort((a, b) => b - a);
  let removed = 0;
  for (let i = 0; i < counts.length; i++) {
    removed += counts[i];
    if (removed >= arr.length / 2) return i + 1;
  }
  return counts.length;
}`,

    java: `public int minSetSize(int[] arr) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : arr) freq.merge(x, 1, Integer::sum);
    List<Integer> counts = new ArrayList<>(freq.values());
    counts.sort(Collections.reverseOrder());
    int removed = 0;
    for (int i = 0; i < counts.size(); i++) {
        removed += counts.get(i);
        if (removed >= arr.length / 2) return i + 1;
    }
    return counts.size();
}`,
  },

  defaultInput: {
    arr: [3, 3, 3, 3, 5, 5, 5, 2, 2, 7],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 3, 3, 3, 5, 5, 5, 2, 2, 7],
      placeholder: '3,3,3,3,5,5,5,2,2,7',
      helperText: 'Input array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const target = Math.floor(arr.length / 2);

    steps.push({
      line: 1,
      explanation: `Count frequencies in array of length ${arr.length}. Need to remove at least ${target} elements.`,
      variables: { arrayLength: arr.length, target },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    const freq: Record<number, number> = {};
    for (const x of arr) freq[x] = (freq[x] || 0) + 1;

    const freqStr = Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ');

    steps.push({
      line: 2,
      explanation: `Frequencies: {${freqStr}}. Sort descending by frequency.`,
      variables: { freq: freqStr },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    const counts = Object.values(freq).sort((a, b) => b - a);

    steps.push({
      line: 3,
      explanation: `Sorted frequencies (descending): [${counts.join(', ')}]. Greedily remove the most frequent first.`,
      variables: { sortedCounts: counts.join(', ') },
      visualization: {
        type: 'array',
        array: counts,
        highlights: { 0: 'active' },
        labels: { 0: 'most freq' },
      },
    });

    let removed = 0;
    let sets = 0;

    for (let i = 0; i < counts.length; i++) {
      removed += counts[i];
      sets++;

      steps.push({
        line: 5,
        explanation: `Remove element with frequency ${counts[i]}. Total removed=${removed}/${arr.length}. Sets used=${sets}. ${removed >= target ? 'Reached target!' : 'Need more.'}`,
        variables: { sets, 'counts[i]': counts[i], removed, target },
        visualization: {
          type: 'array',
          array: counts,
          highlights: {
            ...Object.fromEntries(Array.from({ length: i + 1 }, (_, k) => [k, 'found'])),
            ...(i + 1 < counts.length ? { [i + 1]: 'active' } : {}),
          },
          labels: { [i]: 'removed' },
        },
      });

      if (removed >= target) {
        steps.push({
          line: 8,
          explanation: `Removed ${removed} >= target ${target}. Minimum sets to remove = ${sets}.`,
          variables: { result: sets, removed, target },
          visualization: {
            type: 'array',
            array: counts,
            highlights: Object.fromEntries(Array.from({ length: sets }, (_, k) => [k, 'found'])),
            labels: { [sets - 1]: 'done' },
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 8,
      explanation: `Minimum sets = ${sets}.`,
      variables: { result: sets },
      visualization: {
        type: 'array',
        array: counts,
        highlights: Object.fromEntries(counts.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default reduceArraySizeToHalf;
