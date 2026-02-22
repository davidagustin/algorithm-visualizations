import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const topKFrequentElements: AlgorithmDefinition = {
  id: 'top-k-frequent-elements',
  title: 'Top K Frequent Elements',
  leetcodeNumber: 347,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array and integer k, return the k most frequent elements. Build a frequency map, then use bucket sort (index = frequency) to find top-k elements in O(n) time.',
  tags: ['hash map', 'bucket sort', 'heap', 'counting'],

  code: {
    pseudocode: `function topKFrequent(nums, k):
  count = {}
  for n in nums:
    count[n] = count.get(n, 0) + 1
  buckets = array of size n+1 (empty lists)
  for num, freq in count:
    buckets[freq].append(num)
  result = []
  for i = n down to 1:
    result.extend(buckets[i])
    if len(result) >= k: break
  return result[:k]`,

    python: `def topKFrequent(nums: list[int], k: int) -> list[int]:
    count = {}
    for n in nums:
        count[n] = count.get(n, 0) + 1
    freq = [[] for _ in range(len(nums) + 1)]
    for num, cnt in count.items():
        freq[cnt].append(num)
    result = []
    for i in range(len(freq) - 1, 0, -1):
        for n in freq[i]:
            result.append(n)
            if len(result) == k:
                return result
    return result`,

    javascript: `function topKFrequent(nums, k) {
  const count = new Map();
  for (const n of nums) count.set(n, (count.get(n) || 0) + 1);
  const buckets = Array.from({ length: nums.length + 1 }, () => []);
  for (const [num, freq] of count) buckets[freq].push(num);
  const result = [];
  for (let i = buckets.length - 1; i >= 1; i--) {
    for (const n of buckets[i]) {
      result.push(n);
      if (result.length === k) return result;
    }
  }
  return result;
}`,

    java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> count = new HashMap<>();
    for (int n : nums) count.merge(n, 1, Integer::sum);
    List<Integer>[] buckets = new List[nums.length + 1];
    for (int i = 0; i < buckets.length; i++) buckets[i] = new ArrayList<>();
    for (Map.Entry<Integer, Integer> e : count.entrySet()) buckets[e.getValue()].add(e.getKey());
    int[] result = new int[k];
    int idx = 0;
    for (int i = buckets.length - 1; i >= 1 && idx < k; i--)
        for (int n : buckets[i]) if (idx < k) result[idx++] = n;
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 1, 1, 2, 2, 3],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 1, 2, 2, 3],
      placeholder: '1,1,1,2,2,3',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'k',
      label: 'K (top k frequent)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of most frequent elements to return',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const count: Record<number, number> = {};

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      mapEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: { label: 'Frequency Map', entries: mapEntries },
    });

    const mapToEntries = () =>
      Object.entries(count).map(([k, v]) => ({ key: k, value: `freq=${v}` }));

    steps.push({
      line: 1,
      explanation: `Find top ${k} most frequent elements in [${nums.join(', ')}]. Build frequency map first.`,
      variables: { nums: [...nums], k },
      visualization: makeViz({}, {}, []),
    });

    // Build frequency map
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      count[n] = (count[n] || 0) + 1;
      steps.push({
        line: 3,
        explanation: `nums[${i}] = ${n}. Increment count[${n}] to ${count[n]}.`,
        variables: { i, n, 'count[n]': count[n] },
        visualization: makeViz({ [i]: 'active' }, { [i]: String(n) }, mapToEntries()),
      });
    }

    // Build buckets
    const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);
    for (const [numStr, freq] of Object.entries(count)) {
      buckets[freq].push(Number(numStr));
    }

    const bucketEntries = buckets
      .map((b, i) => ({ freq: i, nums: b }))
      .filter((b) => b.nums.length > 0)
      .map((b) => ({ key: `freq=${b.freq}`, value: `[${b.nums.join(', ')}]` }));

    steps.push({
      line: 5,
      explanation: `Build bucket array where index = frequency. Each bucket holds numbers with that frequency.`,
      variables: { buckets: buckets.map((b, i) => (b.length ? `[${i}]:${b.join(',')}` : null)).filter(Boolean) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        labels: {},
        auxData: { label: 'Buckets (freq → nums)', entries: bucketEntries },
      },
    });

    // Collect from high-frequency buckets
    const result: number[] = [];
    steps.push({
      line: 8,
      explanation: `Iterate buckets from highest frequency down to collect top ${k} elements.`,
      variables: { k },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
        auxData: { label: 'Buckets (scanning)', entries: bucketEntries },
      },
    });

    for (let i = buckets.length - 1; i >= 1 && result.length < k; i--) {
      for (const n of buckets[i]) {
        if (result.length < k) {
          result.push(n);
          steps.push({
            line: 9,
            explanation: `Frequency bucket[${i}] contains ${n}. Add to result. Result: [${result.join(', ')}].`,
            variables: { bucket: i, n, result: [...result] },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(nums.map((num, idx) => [idx, result.includes(num) ? 'found' : 'default'])),
              labels: {},
              auxData: {
                label: 'Result',
                entries: result.map((r, i) => ({ key: `#${i + 1}`, value: String(r) })),
              },
            },
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Done! Top ${k} most frequent elements: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((n, i) => [i, result.includes(n) ? 'found' : 'visited'])),
        labels: {},
        auxData: {
          label: 'Top K Result',
          entries: result.map((r, i) => ({ key: `#${i + 1}`, value: String(r) })),
        },
      },
    });

    return steps;
  },
};

export default topKFrequentElements;
