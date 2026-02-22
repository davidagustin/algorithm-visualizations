import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfMutatedArrayClosestToTarget: AlgorithmDefinition = {
  id: 'sum-of-mutated-array-closest-to-target',
  title: 'Sum of Mutated Array Closest to Target',
  leetcodeNumber: 1300,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Choose a value such that when every element greater than this value is replaced by it, the array sum is as close as possible to the target. Binary search on the mutation value from 0 to max(arr).',
  tags: ['binary search', 'array', 'sorting'],

  code: {
    pseudocode: `function findBestValue(arr, target):
  sort arr
  lo = 0, hi = max(arr)
  while lo < hi:
    mid = (lo + hi + 1) / 2
    if computeSum(arr, mid) < target:
      lo = mid
    else:
      hi = mid - 1
  check lo and lo+1, return closer one

function computeSum(arr, val):
  sum = 0
  for x in arr:
    sum += min(x, val)
  return sum`,
    python: `def findBestValue(arr: list[int], target: int) -> int:
    arr.sort()
    n = len(arr)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + arr[i]

    def computeSum(val):
        pos = bisect.bisect_right(arr, val)
        return prefix[pos] + val * (n - pos)

    lo, hi = 0, max(arr)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if computeSum(mid) < target:
            lo = mid
        else:
            hi = mid - 1
    s1 = abs(computeSum(lo) - target)
    s2 = abs(computeSum(lo + 1) - target)
    return lo if s1 <= s2 else lo + 1`,
    javascript: `function findBestValue(arr, target) {
  arr.sort((a, b) => a - b);
  const computeSum = (val) => arr.reduce((s, x) => s + Math.min(x, val), 0);
  let lo = 0, hi = Math.max(...arr);
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (computeSum(mid) < target) lo = mid;
    else hi = mid - 1;
  }
  const s1 = Math.abs(computeSum(lo) - target);
  const s2 = Math.abs(computeSum(lo + 1) - target);
  return s1 <= s2 ? lo : lo + 1;
}`,
    java: `public int findBestValue(int[] arr, int target) {
    Arrays.sort(arr);
    int lo = 0, hi = arr[arr.length - 1];
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        if (computeSum(arr, mid) < target) lo = mid;
        else hi = mid - 1;
    }
    int s1 = Math.abs(computeSum(arr, lo) - target);
    int s2 = Math.abs(computeSum(arr, lo + 1) - target);
    return s1 <= s2 ? lo : lo + 1;
}
private int computeSum(int[] arr, int val) {
    int s = 0;
    for (int x : arr) s += Math.min(x, val);
    return s;
}`,
  },

  defaultInput: {
    arr: [4, 9, 3],
    target: 10,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 9, 3],
      placeholder: '4,9,3',
      helperText: 'Comma-separated positive integers',
    },
    {
      name: 'target',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Desired sum after mutation',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.arr as number[])].sort((a, b) => a - b);
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const computeSum = (val: number) => arr.reduce((s, x) => s + Math.min(x, val), 0);

    const makeViz = (val: number, highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr.map(x => Math.min(x, val)),
      highlights,
      labels: arr.reduce((acc, x, i) => ({ ...acc, [i]: x > val ? `capped` : `${x}` }), {}),
    });

    let lo = 0;
    let hi = Math.max(...arr);

    steps.push({
      line: 1,
      explanation: `Sorted array: [${arr.join(', ')}]. Binary search mutation value from 0 to ${hi}. Target=${target}.`,
      variables: { lo, hi, target },
      visualization: makeViz(hi, {}),
    });

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const s = computeSum(mid);

      steps.push({
        line: 5,
        explanation: `mid=${mid}. computeSum(${mid})=${s}. Target=${target}.`,
        variables: { lo, mid, hi, sum: s, target },
        visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {})),
      });

      if (s < target) {
        steps.push({
          line: 6,
          explanation: `Sum ${s} < target ${target}. Need larger value. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {})),
        });
        lo = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `Sum ${s} >= target ${target}. Try smaller value. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: makeViz(mid, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {})),
        });
        hi = mid - 1;
      }
    }

    const s1 = Math.abs(computeSum(lo) - target);
    const s2 = Math.abs(computeSum(lo + 1) - target);
    const result = s1 <= s2 ? lo : lo + 1;

    steps.push({
      line: 9,
      explanation: `Check value=${lo} (diff=${s1}) vs value=${lo + 1} (diff=${s2}). Best value = ${result}. Sum = ${computeSum(result)}.`,
      variables: { value: result, sum: computeSum(result), target },
      visualization: makeViz(result, arr.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {})),
    });

    return steps;
  },
};

export default sumOfMutatedArrayClosestToTarget;
