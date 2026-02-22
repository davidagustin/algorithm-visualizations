import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const bucketSortVisualization: AlgorithmDefinition = {
  id: 'bucket-sort-visualization',
  title: 'Bucket Sort Visualization',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Bucket sort distributes elements into a number of buckets, sorts each bucket individually (typically with insertion sort), then concatenates. Works well when input is uniformly distributed over a range. Time complexity is O(n + k) average case. Each element is placed in bucket floor(val / bucketSize). Good for floating-point values in [0, 1].',
  tags: ['sorting', 'bucket', 'distribution sort', 'counting'],

  code: {
    pseudocode: `function bucketSort(arr, numBuckets):
  min_val = min(arr), max_val = max(arr)
  bucketSize = (max - min) / numBuckets
  buckets = [[] for _ in range(numBuckets)]
  for val in arr:
    idx = floor((val - min) / bucketSize)
    idx = min(idx, numBuckets-1)
    buckets[idx].append(val)
  for bucket in buckets:
    insertionSort(bucket)
  return concat(buckets)`,

    python: `def bucketSort(arr, num_buckets=5):
    if not arr: return arr
    min_val, max_val = min(arr), max(arr)
    bucket_size = (max_val - min_val) / num_buckets or 1
    buckets = [[] for _ in range(num_buckets)]
    for val in arr:
        idx = min(int((val - min_val) / bucket_size), num_buckets - 1)
        buckets[idx].append(val)
    result = []
    for bucket in buckets:
        result.extend(sorted(bucket))
    return result`,

    javascript: `function bucketSort(arr, numBuckets = 5) {
  const min = Math.min(...arr), max = Math.max(...arr);
  const size = (max - min) / numBuckets || 1;
  const buckets = Array.from({length: numBuckets}, () => []);
  for (const val of arr) {
    const idx = Math.min(Math.floor((val-min)/size), numBuckets-1);
    buckets[idx].push(val);
  }
  return buckets.flatMap(b => b.sort((a,b) => a-b));
}`,

    java: `public int[] bucketSort(int[] arr, int numBuckets) {
    int min = Arrays.stream(arr).min().getAsInt();
    int max = Arrays.stream(arr).max().getAsInt();
    double size = (max - min + 1.0) / numBuckets;
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i < numBuckets; i++) buckets.add(new ArrayList<>());
    for (int val : arr) {
        int idx = Math.min((int)((val - min) / size), numBuckets - 1);
        buckets.get(idx).add(val);
    }
    int i = 0;
    for (List<Integer> bucket : buckets) {
        Collections.sort(bucket);
        for (int val : bucket) arr[i++] = val;
    }
    return arr;
}`,
  },

  defaultInput: {
    nums: [42, 32, 33, 52, 37, 47, 51, 25, 60, 20],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [42, 32, 33, 52, 37, 47, 51, 25, 60, 20],
      placeholder: '42,32,33,52,37,47,51,25',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const numBuckets = 5;

    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const bucketSize = (maxVal - minVal) / numBuckets || 1;

    steps.push({
      line: 1,
      explanation: `Bucket Sort on [${arr.join(', ')}]. min=${minVal}, max=${maxVal}. Using ${numBuckets} buckets, each spanning ${bucketSize.toFixed(1)} values.`,
      variables: { minVal, maxVal, numBuckets, bucketSize: bucketSize.toFixed(1) },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: Object.fromEntries(arr.map((v, i) => [i, `${v}`])),
      },
    });

    const buckets: number[][] = Array.from({ length: numBuckets }, () => []);

    for (let i = 0; i < arr.length; i++) {
      const val = arr[i];
      const idx = Math.min(Math.floor((val - minVal) / bucketSize), numBuckets - 1);
      buckets[idx].push(val);

      steps.push({
        line: 5,
        explanation: `arr[${i}]=${val}: bucket index = floor((${val}-${minVal})/${bucketSize.toFixed(1)}) = ${idx}. Buckets: ${buckets.map((b, bi) => `B${bi}:[${b.join(',')}]`).join(' ')}.`,
        variables: { val, bucketIdx: idx },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: { [i]: 'active' },
          labels: Object.fromEntries(arr.map((v, j) => [j, j === i ? `->B${idx}` : `${v}`])),
        },
      });
    }

    steps.push({
      line: 7,
      explanation: `All elements distributed. Buckets: ${buckets.map((b, i) => `B${i}:[${b.join(',')}]`).join(', ')}.`,
      variables: { buckets: buckets.map((b, i) => `B${i}:[${b.join(',')}]`).join(', ') },
      visualization: {
        type: 'array',
        array: buckets.map(b => b.length),
        highlights: Object.fromEntries(buckets.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(buckets.map((b, i) => [i, `B${i}:[${b.join(',')}]`])),
      },
    });

    // Sort each bucket
    for (let bi = 0; bi < numBuckets; bi++) {
      if (buckets[bi].length > 1) {
        const before = [...buckets[bi]];
        buckets[bi].sort((a, b) => a - b);
        steps.push({
          line: 8,
          explanation: `Sort bucket ${bi}: [${before.join(',')}] => [${buckets[bi].join(',')}].`,
          variables: { bucket: bi, before: before.join(','), after: buckets[bi].join(',') },
          visualization: {
            type: 'array',
            array: buckets[bi],
            highlights: Object.fromEntries(buckets[bi].map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(buckets[bi].map((v, i) => [i, `${v}`])),
          },
        });
      }
    }

    const result = buckets.flat();

    steps.push({
      line: 9,
      explanation: `Concatenate all sorted buckets. Final sorted array: [${result.join(', ')}].`,
      variables: { sorted: `[${result.join(', ')}]` },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default bucketSortVisualization;
