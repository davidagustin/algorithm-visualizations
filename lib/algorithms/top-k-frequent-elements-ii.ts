import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const topKFrequentElementsII: AlgorithmDefinition = {
  id: 'top-k-frequent-elements-ii',
  title: 'Top K Frequent Elements II',
  leetcodeNumber: 347,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 347: Return the k most frequent elements. Uses bucket sort by frequency. Build frequency map, place in buckets indexed by frequency, scan from highest bucket.',
  tags: ['Sorting', 'Hash Map', 'Bucket Sort', 'Heap', 'Top K'],
  code: {
    pseudocode: `function topKFrequent(nums, k):
  freq = frequency map
  buckets = array of n+1 empty lists
  for num, count in freq:
    buckets[count].append(num)
  result = []
  for i = n down to 1:
    result.extend(buckets[i])
    if len(result) >= k: break
  return result[:k]`,
    python: `def topKFrequent(nums, k):
    from collections import Counter
    freq = Counter(nums)
    n = len(nums)
    buckets = [[] for _ in range(n + 1)]
    for num, cnt in freq.items():
        buckets[cnt].append(num)
    result = []
    for i in range(n, 0, -1):
        result.extend(buckets[i])
        if len(result) >= k: break
    return result[:k]`,
    javascript: `function topKFrequent(nums, k) {
  const freq = {};
  for (const x of nums) freq[x] = (freq[x] || 0) + 1;
  const buckets = Array.from({length: nums.length + 1}, () => []);
  for (const [num, cnt] of Object.entries(freq)) buckets[cnt].push(+num);
  const result = [];
  for (let i = nums.length; i >= 1 && result.length < k; i--) {
    result.push(...buckets[i]);
  }
  return result.slice(0, k);
}`,
    java: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> freq = new HashMap<>();
    for (int x : nums) freq.merge(x, 1, Integer::sum);
    List<List<Integer>> buckets = new ArrayList<>();
    for (int i = 0; i <= nums.length; i++) buckets.add(new ArrayList<>());
    for (Map.Entry<Integer, Integer> e : freq.entrySet()) buckets.get(e.getValue()).add(e.getKey());
    int[] result = new int[k]; int idx = 0;
    for (int i = nums.length; i >= 1 && idx < k; i--) {
        for (int x : buckets.get(i)) if (idx < k) result[idx++] = x;
    }
    return result;
}`,
  },
  defaultInput: { nums: [1, 1, 1, 2, 2, 3], k: 2 },
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
      label: 'k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of top frequent elements',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const k = input.k as number;
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
      ...(auxEntries ? { auxData: { label: 'Top K Frequent', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find top ${k} frequent elements in [${nums.join(', ')}].`,
      variables: { nums: [...nums], k },
      visualization: makeViz(nums, Object.fromEntries(nums.map((_, i) => [i, 'comparing'])), {},
        [{ key: 'k', value: String(k) }]),
    });

    const freq: Record<number, number> = {};
    for (const x of nums) freq[x] = (freq[x] || 0) + 1;

    steps.push({
      line: 2,
      explanation: `Frequency map: ${Object.entries(freq).map(([k, v]) => `${k}:${v}`).join(', ')}.`,
      variables: { freq: { ...freq } },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        Object.fromEntries(nums.map((v, i) => [i, `f${freq[v]}`])),
        [{ key: 'Freq', value: Object.entries(freq).map(([k, v]) => `${k}→${v}`).join(', ') }],
      ),
    });

    const buckets: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [num, cnt] of Object.entries(freq)) {
      buckets[cnt].push(Number(num));
    }

    const bucketDisplay = buckets.map((b, i) => b.length ? `[${i}]:${b.join(',')}` : '').filter(Boolean).join(' ');
    steps.push({
      line: 4,
      explanation: `Place in frequency buckets: ${bucketDisplay}.`,
      variables: { buckets: buckets.map(b => [...b]) },
      visualization: makeViz(nums,
        Object.fromEntries(nums.map((_, i) => [i, 'pointer'])),
        {},
        [{ key: 'Buckets', value: bucketDisplay }],
      ),
    });

    const result: number[] = [];
    for (let i = n; i >= 1 && result.length < k; i--) {
      if (buckets[i].length > 0) {
        result.push(...buckets[i]);
        steps.push({
          line: 8,
          explanation: `Bucket[${i}] (freq=${i}): add [${buckets[i].join(', ')}] to result.`,
          variables: { freq: i, added: [...buckets[i]], result: [...result] },
          visualization: makeViz(result.slice(0, k),
            Object.fromEntries(result.slice(0, k).map((_, j) => [j, 'found'])),
            {},
            [{ key: 'Result so far', value: result.slice(0, k).join(', ') }],
          ),
        });
      }
    }

    const finalResult = result.slice(0, k);
    steps.push({
      line: 1,
      explanation: `Top ${k} frequent: [${finalResult.join(', ')}].`,
      variables: { result: finalResult },
      visualization: makeViz(finalResult,
        Object.fromEntries(finalResult.map((_, i) => [i, 'found'])),
        Object.fromEntries(finalResult.map((v, i) => [i, `f${freq[v]}`])),
        [{ key: 'Top K', value: finalResult.join(', ') }],
      ),
    });

    return steps;
  },
};

export default topKFrequentElementsII;
