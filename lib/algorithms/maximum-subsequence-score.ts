import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumSubsequenceScore: AlgorithmDefinition = {
  id: 'maximum-subsequence-score',
  title: 'Maximum Subsequence Score',
  leetcodeNumber: 2542,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given arrays nums1 and nums2, pick k indices to maximize the sum of nums1 values multiplied by the minimum nums2 value among chosen indices. Sort by nums2 descending, then sweep using a min heap of size k on nums1 values.',
  tags: ['heap', 'greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maxScore(nums1, nums2, k):
  pairs = sorted by nums2 descending
  minHeap = min heap
  sum1 = 0
  maxScore = 0
  for n1, n2 in pairs:
    push n1 to minHeap
    sum1 += n1
    if heap.size > k:
      sum1 -= pop minHeap
    if heap.size == k:
      maxScore = max(maxScore, sum1 * n2)
  return maxScore`,

    python: `import heapq

def maxScore(nums1: list[int], nums2: list[int], k: int) -> int:
    pairs = sorted(zip(nums1, nums2), key=lambda x: -x[1])
    heap = []
    sum1 = 0
    max_score = 0
    for n1, n2 in pairs:
        heapq.heappush(heap, n1)
        sum1 += n1
        if len(heap) > k:
            sum1 -= heapq.heappop(heap)
        if len(heap) == k:
            max_score = max(max_score, sum1 * n2)
    return max_score`,

    javascript: `function maxScore(nums1, nums2, k) {
  const pairs = nums1.map((n,i) => [n, nums2[i]]).sort((a,b) => b[1]-a[1]);
  let heap = [], sum1 = 0, maxScore = 0;
  for (const [n1, n2] of pairs) {
    heap.push(n1);
    heap.sort((a,b) => a-b);
    sum1 += n1;
    if (heap.length > k) sum1 -= heap.shift();
    if (heap.length === k) maxScore = Math.max(maxScore, sum1 * n2);
  }
  return maxScore;
}`,

    java: `public long maxScore(int[] nums1, int[] nums2, int k) {
    int n = nums1.length;
    Integer[] idx = new Integer[n];
    for (int i = 0; i < n; i++) idx[i] = i;
    Arrays.sort(idx, (a,b) -> nums2[b] - nums2[a]);
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    long sum1 = 0, maxScore = 0;
    for (int i : idx) {
        heap.offer(nums1[i]);
        sum1 += nums1[i];
        if (heap.size() > k) sum1 -= heap.poll();
        if (heap.size() == k) maxScore = Math.max(maxScore, sum1 * nums2[i]);
    }
    return maxScore;
}`,
  },

  defaultInput: {
    nums1: [1, 3, 3, 2],
    nums2: [2, 1, 3, 3],
    k: 3,
  },

  inputFields: [
    {
      name: 'nums1',
      label: 'nums1',
      type: 'array',
      defaultValue: [1, 3, 3, 2],
      placeholder: '1,3,3,2',
      helperText: 'First array (summed values)',
    },
    {
      name: 'nums2',
      label: 'nums2',
      type: 'array',
      defaultValue: [2, 1, 3, 3],
      placeholder: '2,1,3,3',
      helperText: 'Second array (multiplier is min chosen)',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of indices to choose',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const pairs = nums1.map((n, i) => [n, nums2[i]] as [number, number]);
    pairs.sort((a, b) => b[1] - a[1]);

    steps.push({
      line: 1,
      explanation: `Sort pairs by nums2 descending so min-nums2 among chosen is fixed as we sweep. Pairs: [${pairs.map(([a, b]) => `(${a},${b})`).join(', ')}]`,
      variables: { k, pairsCount: pairs.length },
      visualization: {
        type: 'array',
        array: pairs.map(([, b]) => b),
        highlights: {},
        labels: Object.fromEntries(pairs.map(([a, b], i) => [i, `n1=${a}`])),
      } as ArrayVisualization,
    });

    let heap: number[] = [];
    let sum1 = 0;
    let maxScore = 0;

    for (let i = 0; i < pairs.length; i++) {
      const [n1, n2] = pairs[i];
      heap.push(n1);
      heap.sort((a, b) => a - b);
      sum1 += n1;

      if (heap.length > k) {
        const removed = heap.shift()!;
        sum1 -= removed;
        steps.push({
          line: 8,
          explanation: `Heap size exceeds k. Remove smallest n1=${removed}. sum1=${sum1}. Current n2=${n2}.`,
          variables: { removed, sum1, n2, k },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: {},
            labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 6,
          explanation: `Add n1=${n1} to heap (n2=${n2} as current min). sum1=${sum1}. Heap: [${heap.join(',')}]`,
          variables: { n1, n2, sum1, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: Object.fromEntries([[heap.length - 1, 'current']]),
            labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
          } as ArrayVisualization,
        });
      }

      if (heap.length === k) {
        const score = sum1 * n2;
        const improved = score > maxScore;
        if (improved) maxScore = score;
        steps.push({
          line: 10,
          explanation: `k=${k} elements selected. Score = sum1(${sum1}) * n2(${n2}) = ${score}. ${improved ? 'New max!' : `Best is ${maxScore}`}`,
          variables: { score, maxScore, sum1, n2, k },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: Object.fromEntries(heap.map((_, i) => [i, improved ? 'found' : 'active'])),
            labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
          } as ArrayVisualization,
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Maximum subsequence score with k=${k} indices: ${maxScore}`,
      variables: { result: maxScore, k },
      visualization: {
        type: 'array',
        array: [maxScore],
        highlights: { 0: 'found' },
        labels: { 0: `score=${maxScore}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumSubsequenceScore;
