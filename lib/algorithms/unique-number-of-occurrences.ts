import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniqueNumberOfOccurrences: AlgorithmDefinition = {
  id: 'unique-number-of-occurrences',
  title: 'Unique Number of Occurrences',
  leetcodeNumber: 1207,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer array, return true if the number of occurrences of each value in the array is unique. Count frequencies with a hash map, then check if the frequency values themselves are all distinct by putting them in a set and comparing sizes.',
  tags: ['hash map', 'hash set', 'array', 'counting'],

  code: {
    pseudocode: `function uniqueOccurrences(arr):
  freq = {}
  for num in arr:
    freq[num] = freq.get(num, 0) + 1
  occurrences = list(freq.values())
  return len(occurrences) == len(set(occurrences))`,

    python: `from collections import Counter
def uniqueOccurrences(arr: list[int]) -> bool:
    freq = Counter(arr)
    occurrences = list(freq.values())
    return len(occurrences) == len(set(occurrences))`,

    javascript: `function uniqueOccurrences(arr) {
  const freq = new Map();
  for (const n of arr) freq.set(n, (freq.get(n) || 0) + 1);
  const occ = [...freq.values()];
  return occ.length === new Set(occ).size;
}`,

    java: `public boolean uniqueOccurrences(int[] arr) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : arr) freq.merge(n, 1, Integer::sum);
    return freq.values().size() == new HashSet<>(freq.values()).size();
}`,
  },

  defaultInput: {
    arr: [1, 2, 2, 1, 1, 3],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 2, 1, 1, 3],
      placeholder: '1,2,2,1,1,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const freq: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Count the frequency of each element using a hash map.',
      variables: { freq: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < arr.length; i++) {
      freq[arr[i]] = (freq[arr[i]] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `arr[${i}]=${arr[i]}. freq[${arr[i]}] = ${freq[arr[i]]}.`,
        variables: { i, num: arr[i], freq: JSON.stringify(freq) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `f=${freq[arr[i]]}` }),
      });
    }

    const occurrences = Object.values(freq);
    const uniqueOcc = new Set(occurrences);

    steps.push({
      line: 4,
      explanation: `Frequency map complete: ${JSON.stringify(freq)}. Occurrences list = [${occurrences.join(', ')}].`,
      variables: { freq: JSON.stringify(freq), occurrences: occurrences.join(',') },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 5,
      explanation: `Unique occurrences set = {${Array.from(uniqueOcc).join(', ')}}. Size = ${uniqueOcc.size}. Total counts = ${occurrences.length}. Are they equal? ${occurrences.length === uniqueOcc.size}.`,
      variables: { occurrencesCount: occurrences.length, uniqueCount: uniqueOcc.size, result: occurrences.length === uniqueOcc.size },
      visualization: makeViz({}, {}),
    });

    const result = occurrences.length === uniqueOcc.size;

    if (result) {
      steps.push({
        line: 5,
        explanation: `All occurrence counts are unique: ${occurrences.join(', ')}. Return true.`,
        variables: { result: true },
        visualization: makeViz(
          Object.fromEntries(arr.map((_, i) => [i, 'found'])),
          Object.fromEntries(arr.map((n, i) => [i, `f=${freq[n]}`]))
        ),
      });
    } else {
      steps.push({
        line: 5,
        explanation: `Some occurrence counts are duplicated. [${occurrences.join(', ')}] has repeated values. Return false.`,
        variables: { result: false },
        visualization: makeViz(
          Object.fromEntries(arr.map((_, i) => [i, 'mismatch'])),
          Object.fromEntries(arr.map((n, i) => [i, `f=${freq[n]}`]))
        ),
      });
    }

    return steps;
  },
};

export default uniqueNumberOfOccurrences;
