import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bucketSortVisualization: AlgorithmDefinition = {
  id: 'bucket-sort-visualization',
  title: 'Bucket Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Bucket sort distributes elements into buckets, sorts each bucket, then concatenates. Best for uniformly distributed data. Average O(n+k), worst O(n²) if all in one bucket.',
  tags: ['Sorting', 'Bucket Sort', 'Distribution', 'Non-comparative'],
  code: {
    pseudocode: `function bucketSort(arr):
  n = arr.length
  buckets = array of n empty lists
  for x in arr:
    idx = floor(n * x / (max+1))
    buckets[idx].append(x)
  for bucket in buckets:
    insertionSort(bucket)
  return concat all buckets`,
    python: `def bucket_sort(arr):
    if not arr: return arr
    n = len(arr)
    max_val = max(arr) + 1
    buckets = [[] for _ in range(n)]
    for x in arr:
        idx = int(n * x / max_val)
        buckets[idx].append(x)
    result = []
    for b in buckets:
        result.extend(sorted(b))
    return result`,
    javascript: `function bucketSort(arr) {
  const n = arr.length;
  const max = Math.max(...arr) + 1;
  const buckets = Array.from({length: n}, () => []);
  for (const x of arr) {
    const idx = Math.floor(n * x / max);
    buckets[idx].push(x);
  }
  return buckets.flatMap(b => b.sort((a, b) => a - b));
}`,
    java: `public int[] bucketSort(int[] arr) {
    int n = arr.length;
    int max = Arrays.stream(arr).max().getAsInt() + 1;
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < n; i++) buckets.add(new ArrayList<>());
    for (int x : arr) buckets.get(n * x / max).add(x);
    int idx = 0;
    for (List<Integer> b : buckets) {
        Collections.sort(b);
        for (int x : b) arr[idx++] = x;
    }
    return arr;
}`,
  },
  defaultInput: { nums: [29, 25, 3, 49, 9, 37, 21, 43] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [29, 25, 3, 49, 9, 37, 21, 43],
      placeholder: '29,25,3,49,9,37,21,43',
      helperText: 'Comma-separated non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      ...(auxEntries ? { auxData: { label: 'Bucket Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin bucket sort on [${nums.join(', ')}]. Distribute elements into ${n} buckets.`,
      variables: { nums: [...nums], buckets: n },
      visualization: makeViz(nums, {}, {}),
    });

    const maxVal = Math.max(...nums) + 1;
    const buckets: number[][] = Array.from({ length: n }, () => []);

    for (let i = 0; i < n; i++) {
      const idx = Math.floor(n * nums[i] / maxVal);
      buckets[idx].push(nums[i]);
      steps.push({
        line: 4,
        explanation: `Place ${nums[i]} into bucket ${idx} (= floor(${n} * ${nums[i]} / ${maxVal})).`,
        variables: { value: nums[i], bucket: idx },
        visualization: makeViz(nums, { [i]: 'active' }, { [i]: `b${idx}` },
          [{ key: 'Value', value: String(nums[i]) }, { key: 'Bucket', value: String(idx) },
           { key: 'Buckets', value: buckets.map((b, j) => `b${j}:[${b.join(',')}]`).filter(s => !s.includes('[]')).join(' ') }]),
      });
    }

    steps.push({
      line: 6,
      explanation: `All elements distributed. Now sort each bucket.`,
      variables: { buckets: buckets.map(b => [...b]) },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'comparing'])),
        {},
        [{ key: 'Buckets', value: buckets.map((b, j) => b.length ? `b${j}:[${b.join(',')}]` : '').filter(Boolean).join(' ') }],
      ),
    });

    const result: number[] = [];
    for (const bucket of buckets) {
      bucket.sort((a, b) => a - b);
      result.push(...bucket);
    }

    steps.push({
      line: 8,
      explanation: `Each bucket sorted. Concatenate: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: result.join(', ') }],
      ),
    });

    return steps;
  },
};

export default bucketSortVisualization;
