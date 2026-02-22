import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const relativeSortArray: AlgorithmDefinition = {
  id: 'relative-sort-array',
  title: 'Relative Sort Array',
  leetcodeNumber: 1122,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Sort arr1 such that elements appear in the order defined by arr2. Elements of arr1 not in arr2 appear at the end in ascending order. Use a hash map to record the index of each element in arr2, then sort arr1 with a custom comparator: elements in arr2 sorted by rank, rest sorted numerically.',
  tags: ['hash map', 'sorting', 'array', 'custom sort'],

  code: {
    pseudocode: `function relativeSortArray(arr1, arr2):
  rank = {}
  for i, val in enumerate(arr2):
    rank[val] = i

  sort arr1 using:
    if a in rank and b in rank: compare rank[a] vs rank[b]
    if a in rank: a comes first
    if b in rank: b comes first
    else: compare a vs b numerically

  return sorted arr1`,

    python: `def relativeSortArray(arr1: list[int], arr2: list[int]) -> list[int]:
    rank = {v: i for i, v in enumerate(arr2)}
    return sorted(arr1, key=lambda x: (rank[x] if x in rank else len(arr2) + x))`,

    javascript: `function relativeSortArray(arr1, arr2) {
  const rank = {};
  arr2.forEach((v, i) => rank[v] = i);
  return arr1.sort((a, b) => {
    const ra = a in rank ? rank[a] : arr2.length + a;
    const rb = b in rank ? rank[b] : arr2.length + b;
    return ra - rb;
  });
}`,

    java: `public int[] relativeSortArray(int[] arr1, int[] arr2) {
    Map<Integer,Integer> rank = new HashMap<>();
    for (int i = 0; i < arr2.length; i++) rank.put(arr2[i], i);
    Integer[] a1 = Arrays.stream(arr1).boxed().toArray(Integer[]::new);
    Arrays.sort(a1, (a, b) -> {
        int ra = rank.getOrDefault(a, arr2.length + a);
        int rb = rank.getOrDefault(b, arr2.length + b);
        return ra - rb;
    });
    return Arrays.stream(a1).mapToInt(Integer::intValue).toArray();
}`,
  },

  defaultInput: {
    nums: [2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort (arr1)',
      type: 'array',
      defaultValue: [2, 3, 1, 3, 2, 4, 6, 7, 9, 2, 19],
      placeholder: '2,3,1,3,2,4,6,7,9,2,19',
      helperText: 'Array to be sorted relative to order [2,3,1,4] (arr2)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr1 = [...(input.nums as number[])];
    const arr2 = [2, 3, 1, 4];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input arr1: [${arr1.join(', ')}]. Order arr2: [${arr2.join(', ')}]. Goal: sort arr1 so elements of arr2 come first in arr2 order.`,
      variables: { arr1: arr1.join(', '), arr2: arr2.join(', ') },
      visualization: {
        type: 'array',
        array: [...arr1],
        highlights: {},
        labels: {},
      },
    });

    // Build rank map
    const rank: Record<number, number> = {};
    for (let i = 0; i < arr2.length; i++) rank[arr2[i]] = i;

    steps.push({
      line: 2,
      explanation: `Build rank map from arr2: ${Object.entries(rank).map(([v, r]) => `${v}->${r}`).join(', ')}. Elements not in arr2 get rank = arr2.length + value.`,
      variables: { rankMap: JSON.stringify(rank) },
      visualization: {
        type: 'array',
        array: [...arr1],
        highlights: arr1.reduce((acc: Record<number, string>, v, i) => {
          acc[i] = v in rank ? 'found' : 'comparing';
          return acc;
        }, {}),
        labels: arr1.reduce((acc: Record<number, string>, v, i) => {
          acc[i] = v in rank ? `r=${rank[v]}` : `r=${arr2.length + v}`;
          return acc;
        }, {}),
      },
    });

    // Assign sort keys
    const withKeys = arr1.map(v => ({
      val: v,
      key: v in rank ? rank[v] : arr2.length + v,
    }));

    steps.push({
      line: 5,
      explanation: `Assign sort keys: elements in arr2 get their position as key (0,1,2,...), elements not in arr2 get key = ${arr2.length} + value.`,
      variables: { keys: withKeys.map(x => `${x.val}:key=${x.key}`).join(', ') },
      visualization: {
        type: 'array',
        array: arr1,
        highlights: arr1.reduce((acc: Record<number, string>, v, i) => {
          acc[i] = v in rank ? 'active' : 'pointer';
          return acc;
        }, {}),
        labels: withKeys.reduce((acc: Record<number, string>, x, i) => { acc[i] = `k=${x.key}`; return acc; }, {}),
      },
    });

    // Sort
    withKeys.sort((a, b) => a.key - b.key);
    const sorted = withKeys.map(x => x.val);

    const inArr2 = sorted.filter(v => v in rank);
    const notInArr2 = sorted.filter(v => !(v in rank));

    steps.push({
      line: 9,
      explanation: `After sorting: in-arr2 elements [${inArr2.join(', ')}] in correct order, then remaining [${notInArr2.join(', ')}] in ascending order.`,
      variables: { inArr2: inArr2.join(', '), notInArr2: notInArr2.join(', ') },
      visualization: {
        type: 'array',
        array: sorted,
        highlights: sorted.reduce((acc: Record<number, string>, v, i) => {
          acc[i] = v in rank ? 'found' : 'pointer';
          return acc;
        }, {}),
        labels: {
          0: 'sorted start',
          [inArr2.length - 1]: 'arr2 end',
          [inArr2.length]: notInArr2.length > 0 ? 'extra start' : '',
        },
      },
    });

    return steps;
  },
};

export default relativeSortArray;
