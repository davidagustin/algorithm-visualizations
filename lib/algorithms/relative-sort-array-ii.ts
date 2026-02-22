import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const relativeSortArrayII: AlgorithmDefinition = {
  id: 'relative-sort-array-ii',
  title: 'Relative Sort Array II',
  leetcodeNumber: 1122,
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'LC 1122: Sort arr1 such that elements appear in the same relative order as arr2. Elements not in arr2 appear at end sorted in ascending order.',
  tags: ['Sorting', 'Array', 'Hash Map', 'Custom Sort'],
  code: {
    pseudocode: `function relativeSortArray(arr1, arr2):
  rank = map each arr2[i] -> i
  sort arr1 by:
    if a in rank and b in rank: compare rank[a] vs rank[b]
    if only a in rank: a comes first
    if neither in rank: compare a vs b
  return arr1`,
    python: `def relativeSortArray(arr1, arr2):
    rank = {v: i for i, v in enumerate(arr2)}
    return sorted(arr1, key=lambda x: (rank[x] if x in rank else len(arr2) + x))`,
    javascript: `function relativeSortArray(arr1, arr2) {
  const rank = new Map(arr2.map((v, i) => [v, i]));
  return arr1.sort((a, b) => {
    const ra = rank.has(a) ? rank.get(a) : arr2.length + a;
    const rb = rank.has(b) ? rank.get(b) : arr2.length + b;
    return ra - rb;
  });
}`,
    java: `public int[] relativeSortArray(int[] arr1, int[] arr2) {
    Map<Integer, Integer> rank = new HashMap<>();
    for (int i = 0; i < arr2.length; i++) rank.put(arr2[i], i);
    Integer[] arr = Arrays.stream(arr1).boxed().toArray(Integer[]::new);
    Arrays.sort(arr, (a, b) -> {
        int ra = rank.getOrDefault(a, arr2.length + a);
        int rb = rank.getOrDefault(b, arr2.length + b);
        return ra - rb;
    });
    return Arrays.stream(arr).mapToInt(Integer::intValue).toArray();
}`,
  },
  defaultInput: { arr1: [2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19], arr2: [2, 1, 4, 3, 9, 6] },
  inputFields: [
    {
      name: 'arr1',
      label: 'Array 1',
      type: 'array',
      defaultValue: [2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19],
      placeholder: '2,3,1,3,2,4,6,7,9,2,19',
      helperText: 'Array to sort',
    },
    {
      name: 'arr2',
      label: 'Array 2 (order)',
      type: 'array',
      defaultValue: [2, 1, 4, 3, 9, 6],
      placeholder: '2,1,4,3,9,6',
      helperText: 'Defines the relative order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr1 = (input.arr1 as number[]).slice();
    const arr2 = (input.arr2 as number[]).slice();
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Relative Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Relative sort arr1=[${arr1.join(',')}] by order of arr2=[${arr2.join(',')}].`,
      variables: { arr1: [...arr1], arr2: [...arr2] },
      visualization: makeViz(arr1,
        Object.fromEntries(arr1.map((_, i) => [i, 'comparing'])),
        {},
        [{ key: 'arr2 order', value: arr2.join(',') }],
      ),
    });

    const rank = new Map(arr2.map((v, i) => [v, i]));

    steps.push({
      line: 2,
      explanation: `Build rank map from arr2: ${arr2.map((v, i) => `${v}→rank ${i}`).join(', ')}.`,
      variables: { rank: Object.fromEntries(rank) },
      visualization: makeViz(arr1,
        Object.fromEntries(arr1.map((v, i) => [i, rank.has(v) ? 'active' : 'comparing'])),
        Object.fromEntries(arr1.map((v, i) => [i, rank.has(v) ? `r${rank.get(v)}` : '?'])),
        [{ key: 'Rank', value: arr2.map((v, i) => `${v}:${i}`).join(',') }],
      ),
    });

    arr1.sort((a, b) => {
      const ra = rank.has(a) ? rank.get(a)! : arr2.length + a;
      const rb = rank.has(b) ? rank.get(b)! : arr2.length + b;
      return ra - rb;
    });

    steps.push({
      line: 3,
      explanation: `Sort arr1 using rank as key. Elements in arr2 come first by their rank order.`,
      variables: { arr1: [...arr1] },
      visualization: makeViz(arr1,
        Object.fromEntries(arr1.map((v, i) => [i, rank.has(v) ? 'found' : 'pointer'])),
        Object.fromEntries(arr1.map((v, i) => [i, rank.has(v) ? `r${rank.get(v)}` : 'end'])),
        [{ key: 'Sorted', value: arr1.join(',') }],
      ),
    });

    steps.push({
      line: 1,
      explanation: `Relative sort complete! [${arr1.join(', ')}].`,
      variables: { result: [...arr1] },
      visualization: makeViz(arr1,
        Object.fromEntries(arr1.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Result', value: arr1.join(', ') }],
      ),
    });

    return steps;
  },
};

export default relativeSortArrayII;
