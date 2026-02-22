import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumOperationsToMakeSubsequence: AlgorithmDefinition = {
  id: 'minimum-operations-to-make-subsequence',
  title: 'Minimum Operations to Make a Subsequence',
  leetcodeNumber: 1713,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given target (distinct elements) and arr, find minimum insertions to make target a subsequence of arr. Equivalent to: len(target) - LCS(target, arr). Since target has distinct elements, map target positions then find LIS in arr positions (O(n log n)).',
  tags: ['dynamic programming', 'lis', 'binary search', 'subsequence'],

  code: {
    pseudocode: `function minOperations(target, arr):
  pos = {val: idx for idx, val in enumerate(target)}
  mapped = [pos[x] for x in arr if x in pos]
  find LIS length of mapped (O(n log n) patience sort)
  return len(target) - LIS_length`,
    python: `def minOperations(target: list[int], arr: list[int]) -> int:
    pos = {v: i for i, v in enumerate(target)}
    mapped = [pos[x] for x in arr if x in pos]
    tails = []
    for x in mapped:
        lo, hi = 0, len(tails)
        while lo < hi:
            mid = (lo+hi)//2
            if tails[mid] < x: lo = mid+1
            else: hi = mid
        if lo == len(tails): tails.append(x)
        else: tails[lo] = x
    return len(target) - len(tails)`,
    javascript: `function minOperations(target, arr) {
  const pos = new Map(target.map((v,i)=>[v,i]));
  const mapped = arr.filter(x=>pos.has(x)).map(x=>pos.get(x));
  const tails = [];
  for (const x of mapped) {
    let lo=0, hi=tails.length;
    while (lo<hi) { const mid=(lo+hi)>>1; tails[mid]<x?lo=mid+1:hi=mid; }
    tails[lo] = x;
  }
  return target.length - tails.length;
}`,
    java: `public int minOperations(int[] target, int[] arr) {
    Map<Integer,Integer> pos = new HashMap<>();
    for (int i = 0; i < target.length; i++) pos.put(target[i], i);
    List<Integer> mapped = new ArrayList<>();
    for (int x : arr) if (pos.containsKey(x)) mapped.add(pos.get(x));
    List<Integer> tails = new ArrayList<>();
    for (int x : mapped) {
        int lo = Collections.binarySearch(tails, x);
        if (lo < 0) lo = -(lo+1);
        if (lo == tails.size()) tails.add(x);
        else tails.set(lo, x);
    }
    return target.length - tails.size();
}`,
  },

  defaultInput: {
    target: [5, 1, 3],
    arr: [9, 4, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target (distinct)',
      type: 'array',
      defaultValue: [5, 1, 3],
      placeholder: '5,1,3',
      helperText: 'Target array with distinct elements',
    },
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [9, 4, 2, 3, 4],
      placeholder: '9,4,2,3,4',
      helperText: 'Source array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number[];
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `target=[${target}], arr=[${arr}]. Map each target element to its index.`,
      variables: { target: JSON.stringify(target), arr: JSON.stringify(arr) },
      visualization: {
        type: 'array',
        array: [...target],
        highlights: {},
        labels: target.reduce((a, _, i) => ({ ...a, [i]: `pos=${i}` }), {}),
      } as ArrayVisualization,
    });

    const pos = new Map<number, number>(target.map((v, i) => [v, i]));
    const mapped: number[] = arr.filter(x => pos.has(x)).map(x => pos.get(x)!);

    steps.push({
      line: 2,
      explanation: `Map arr elements to target positions (skip elements not in target): mapped=[${mapped}].`,
      variables: { mapped: JSON.stringify(mapped) },
      visualization: {
        type: 'array',
        array: mapped.length > 0 ? mapped : [0],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    const tails: number[] = [];
    for (const x of mapped) {
      let lo = 0, hi = tails.length;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (tails[mid] < x) lo = mid + 1;
        else hi = mid;
      }
      const prevLen = tails.length;
      if (lo === tails.length) tails.push(x);
      else tails[lo] = x;

      steps.push({
        line: 8,
        explanation: `Process x=${x}: insert/replace at tails[${lo}]. tails=[${tails}]. LIS so far = ${tails.length}.`,
        variables: { x, lo, tails: JSON.stringify(tails), lisLen: tails.length },
        visualization: {
          type: 'array',
          array: [...tails, ...new Array(Math.max(0, mapped.length - tails.length)).fill(-1)],
          highlights: { [lo]: lo < prevLen ? 'comparing' : 'found' },
          labels: { [lo]: `pos=${lo}` },
        } as ArrayVisualization,
      });
    }

    const result = target.length - tails.length;
    steps.push({
      line: 5,
      explanation: `LIS length = ${tails.length}. Min insertions = ${target.length} - ${tails.length} = ${result}.`,
      variables: { lisLength: tails.length, targetLen: target.length, result },
      visualization: {
        type: 'array',
        array: [...tails],
        highlights: {},
        labels: { 0: `LIS=${tails.length}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumOperationsToMakeSubsequence;
