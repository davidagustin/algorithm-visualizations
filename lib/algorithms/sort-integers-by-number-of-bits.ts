import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortIntegersByNumberOfBits: AlgorithmDefinition = {
  id: 'sort-integers-by-number-of-bits',
  title: 'Sort Integers by The Number of 1 Bits',
  leetcodeNumber: 1356,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Sort an array in ascending order by the number of 1 bits in each element\'s binary representation (popcount). Break ties by value. Use a stable sort with a comparator: compare popcount(a) vs popcount(b), then a vs b.',
  tags: ['bit manipulation', 'sorting'],

  code: {
    pseudocode: `function sortByBits(arr):
  def popcount(n):
    count = 0
    while n: count += n & 1; n >>= 1
    return count
  return sort arr by (popcount(x), x)`,

    python: `def sortByBits(arr: list[int]) -> list[int]:
    return sorted(arr, key=lambda x: (bin(x).count('1'), x))`,

    javascript: `function sortByBits(arr) {
  const pop = n => n.toString(2).split('').filter(b => b === '1').length;
  return [...arr].sort((a, b) => pop(a) - pop(b) || a - b);
}`,

    java: `public int[] sortByBits(int[] arr) {
    Integer[] box = Arrays.stream(arr).boxed().toArray(Integer[]::new);
    Arrays.sort(box, (a, b) ->
        Integer.bitCount(a) != Integer.bitCount(b)
            ? Integer.bitCount(a) - Integer.bitCount(b)
            : a - b);
    return Arrays.stream(box).mapToInt(x -> x).toArray();
}`,
  },

  defaultInput: { arr: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4, 5, 6, 7, 8],
      placeholder: '0,1,2,3,4,5,6,7,8',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const popcount = (n: number) => n.toString(2).split('').filter(b => b === '1').length;

    const makeViz = (
      displayArr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: displayArr,
      highlights,
      labels,
      auxData: { label: 'Sort by Bits', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Sort [${arr.join(', ')}] by number of 1 bits, then by value for ties.`,
      variables: { arr },
      visualization: makeViz(
        [...arr],
        Object.fromEntries(arr.map((_, i) => [i, 'active'])),
        Object.fromEntries(arr.map((v, i) => [i, `${popcount(v)}b`])),
        arr.map(v => ({ key: String(v), value: `popcount=${popcount(v)}, bin=${v.toString(2)}` }))
      ),
    });

    // Show popcount for each
    for (let i = 0; i < Math.min(arr.length, 5); i++) {
      steps.push({
        line: 2,
        explanation: `arr[${i}]=${arr[i]} (binary: ${arr[i].toString(2)}) has ${popcount(arr[i])} set bit(s).`,
        variables: { element: arr[i], binary: arr[i].toString(2), popcount: popcount(arr[i]) },
        visualization: makeViz(
          [...arr],
          Object.fromEntries(arr.map((_, j) => [j, j === i ? 'active' : j < i ? 'visited' : 'default'])),
          Object.fromEntries(arr.map((v, j) => [j, `${popcount(v)}b`])),
          [{ key: `arr[${i}]=${arr[i]}`, value: `bits=${popcount(arr[i])}, bin=${arr[i].toString(2)}` }]
        ),
      });
    }

    const sorted = [...arr].sort((a, b) => popcount(a) - popcount(b) || a - b);

    steps.push({
      line: 5,
      explanation: `Sorted by (popcount, value): [${sorted.join(', ')}].`,
      variables: { result: sorted },
      visualization: makeViz(
        sorted,
        Object.fromEntries(sorted.map((_, i) => [i, 'found'])),
        Object.fromEntries(sorted.map((v, i) => [i, `${popcount(v)}b`])),
        sorted.map((v, i) => ({ key: `[${i}]=${v}`, value: `${v.toString(2)} (${popcount(v)} bits)` }))
      ),
    });

    return steps;
  },
};

export default sortIntegersByNumberOfBits;
