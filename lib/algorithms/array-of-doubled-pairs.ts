import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const arrayOfDoubledPairs: AlgorithmDefinition = {
  id: 'array-of-doubled-pairs',
  title: 'Array of Doubled Pairs',
  leetcodeNumber: 954,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array of even length, determine if it can be rearranged so that for every element x, there is a corresponding 2x. Sort elements by absolute value, then greedily match each element x with its double 2x using a hash map of remaining counts.',
  tags: ['hash map', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function canReorderDoubled(arr):
  freq = frequency map of arr
  for x in sorted(arr, key=abs):
    if freq[x] == 0: continue
    if freq[2*x] == 0: return False
    freq[x] -= 1
    freq[2*x] -= 1
  return True`,

    python: `from collections import Counter
def canReorderDoubled(arr: list[int]) -> bool:
    freq = Counter(arr)
    for x in sorted(arr, key=abs):
        if freq[x] == 0:
            continue
        if freq[2*x] == 0:
            return False
        freq[x] -= 1
        freq[2*x] -= 1
    return True`,

    javascript: `function canReorderDoubled(arr) {
  const freq = new Map();
  for (const n of arr) freq.set(n, (freq.get(n) || 0) + 1);
  const sorted = [...arr].sort((a, b) => Math.abs(a) - Math.abs(b));
  for (const x of sorted) {
    if (!freq.get(x)) continue;
    if (!freq.get(2 * x)) return false;
    freq.set(x, freq.get(x) - 1);
    freq.set(2 * x, freq.get(2 * x) - 1);
  }
  return true;
}`,

    java: `public boolean canReorderDoubled(int[] arr) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int n : arr) freq.merge(n, 1, Integer::sum);
    Integer[] sorted = Arrays.stream(arr).boxed()
        .sorted(Comparator.comparingInt(Math::abs)).toArray(Integer[]::new);
    for (int x : sorted) {
        if (freq.get(x) == 0) continue;
        if (freq.getOrDefault(2*x, 0) == 0) return false;
        freq.merge(x, -1, Integer::sum);
        freq.merge(2*x, -1, Integer::sum);
    }
    return true;
}`,
  },

  defaultInput: {
    arr: [4, -2, 2, -4],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [4, -2, 2, -4],
      placeholder: '4,-2,2,-4',
      helperText: 'Even-length array of integers',
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

    for (const n of arr) {
      freq[n] = (freq[n] || 0) + 1;
    }

    steps.push({
      line: 1,
      explanation: `Build frequency map: ${JSON.stringify(freq)}. Sort by absolute value to process small magnitudes first.`,
      variables: { freq: JSON.stringify(freq) },
      visualization: makeViz({}, {}),
    });

    const sorted = [...arr].sort((a, b) => Math.abs(a) - Math.abs(b));

    steps.push({
      line: 2,
      explanation: `Sorted by absolute value: [${sorted.join(', ')}]. Process each element greedily.`,
      variables: { sorted: sorted.join(',') },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: {},
        labels: {},
      },
    });

    let canReorder = true;

    for (let i = 0; i < sorted.length; i++) {
      const x = sorted[i];

      if (!freq[x]) {
        steps.push({
          line: 4,
          explanation: `x=${x}: already fully consumed (freq[${x}]=0). Skip.`,
          variables: { x, freq: JSON.stringify(freq) },
          visualization: { type: 'array', array: sorted, highlights: { [i]: 'visited' }, labels: { [i]: 'skip' } },
        });
        continue;
      }

      if (!freq[2 * x]) {
        canReorder = false;
        steps.push({
          line: 6,
          explanation: `x=${x}: freq[${x}]=${freq[x]} but freq[${2 * x}]=${freq[2 * x] || 0}. Cannot pair! Return false.`,
          variables: { x, double: 2 * x, freq: JSON.stringify(freq), result: false },
          visualization: { type: 'array', array: sorted, highlights: { [i]: 'mismatch' }, labels: { [i]: 'NO PAIR' } },
        });
        break;
      }

      freq[x]--;
      freq[2 * x]--;

      steps.push({
        line: 7,
        explanation: `Paired x=${x} with 2x=${2 * x}. freq[${x}]=${freq[x]}, freq[${2 * x}]=${freq[2 * x]}.`,
        variables: { x, double: 2 * x, freq: JSON.stringify(freq) },
        visualization: { type: 'array', array: sorted, highlights: { [i]: 'found' }, labels: { [i]: `+${2 * x}` } },
      });
    }

    steps.push({
      line: 8,
      explanation: `Done. Can reorder array into doubled pairs? ${canReorder}.`,
      variables: { result: canReorder },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default arrayOfDoubledPairs;
