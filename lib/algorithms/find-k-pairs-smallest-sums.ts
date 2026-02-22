import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findKPairsSmallestSums: AlgorithmDefinition = {
  id: 'find-k-pairs-smallest-sums',
  title: 'Find K Pairs with Smallest Sums',
  leetcodeNumber: 373,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given two sorted arrays nums1 and nums2, find the k pairs (u, v) with the smallest sums. Use a min-heap seeded with (nums1[i], nums2[0]) for all i. Pop the smallest pair; if the popped pair used nums2[j], push (nums1[i], nums2[j+1]) if valid.',
  tags: ['Heap', 'Array', 'Sorting'],
  code: {
    pseudocode: `function kSmallestPairs(nums1, nums2, k):
  if nums1 or nums2 empty: return []
  minHeap = [(nums1[i]+nums2[0], i, 0) for i in range(min(k, len(nums1)))]
  heapify(minHeap)
  result = []
  while heap not empty and len(result) < k:
    (sum, i, j) = pop min
    result.append([nums1[i], nums2[j]])
    if j + 1 < len(nums2):
      push (nums1[i]+nums2[j+1], i, j+1)
  return result`,
    python: `import heapq
def kSmallestPairs(nums1, nums2, k):
    if not nums1 or not nums2:
        return []
    heap = [(nums1[i]+nums2[0], i, 0) for i in range(min(k, len(nums1)))]
    heapq.heapify(heap)
    result = []
    while heap and len(result) < k:
        s, i, j = heapq.heappop(heap)
        result.append([nums1[i], nums2[j]])
        if j + 1 < len(nums2):
            heapq.heappush(heap, (nums1[i]+nums2[j+1], i, j+1))
    return result`,
    javascript: `function kSmallestPairs(nums1, nums2, k) {
  if (!nums1.length || !nums2.length) return [];
  const heap = nums1.slice(0, k).map((v, i) => [v + nums2[0], i, 0]);
  heap.sort((a, b) => a[0] - b[0]);
  const result = [];
  while (heap.length && result.length < k) {
    const [s, i, j] = heap.shift();
    result.push([nums1[i], nums2[j]]);
    if (j + 1 < nums2.length) {
      heap.push([nums1[i] + nums2[j + 1], i, j + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
  return result;
}`,
    java: `public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    List<List<Integer>> res = new ArrayList<>();
    if (nums1.length == 0 || nums2.length == 0) return res;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    for (int i = 0; i < Math.min(k, nums1.length); i++)
        pq.offer(new int[]{nums1[i]+nums2[0], i, 0});
    while (!pq.isEmpty() && res.size() < k) {
        int[] cur = pq.poll();
        res.add(Arrays.asList(nums1[cur[1]], nums2[cur[2]]));
        if (cur[2]+1 < nums2.length)
            pq.offer(new int[]{nums1[cur[1]]+nums2[cur[2]+1], cur[1], cur[2]+1});
    }
    return res;
}`,
  },
  defaultInput: { nums1: [1, 7, 11], nums2: [2, 4, 6], k: 3 },
  inputFields: [
    {
      name: 'nums1',
      label: 'nums1 (sorted)',
      type: 'array',
      defaultValue: [1, 7, 11],
      placeholder: 'e.g. 1,7,11',
      helperText: 'First sorted array',
    },
    {
      name: 'nums2',
      label: 'nums2 (sorted)',
      type: 'array',
      defaultValue: [2, 4, 6],
      placeholder: 'e.g. 2,4,6',
      helperText: 'Second sorted array',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Number of smallest-sum pairs to return',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums1 = input.nums1 as number[];
    const nums2 = input.nums2 as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];

    // Seed heap: [sum, i, j]
    let heap: [number, number, number][] = nums1.slice(0, k).map((v, i) => [v + nums2[0], i, 0]);
    heap.sort((a, b) => a[0] - b[0]);

    function makeViz(): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < nums1.length; i++) {
        labels[i] = String(nums1[i]);
        const inHeap = heap.some(h => h[1] === i);
        const inResult = result.some(p => p[0] === nums1[i]);
        if (inResult) highlights[i] = 'found';
        else if (inHeap) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: nums1.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Heap State',
          entries: [
            { key: 'nums1', value: nums1.join(', ') },
            { key: 'nums2', value: nums2.join(', ') },
            { key: 'Min-heap', value: heap.map(h => `(${nums1[h[1]]},${nums2[h[2]]}):${h[0]}`).join(', ') || 'empty' },
            { key: 'Result pairs', value: result.map(p => `[${p.join(',')}]`).join(', ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Seed heap with (nums1[i], nums2[0]) for i=0..${Math.min(k, nums1.length) - 1}: ${heap.map(h => `(${nums1[h[1]]},${nums2[h[2]]})→${h[0]}`).join(', ')}.`,
      variables: { nums1, nums2, k },
      visualization: makeViz(),
    });

    while (heap.length > 0 && result.length < k) {
      const [sum, i, j] = heap.shift()!;
      result.push([nums1[i], nums2[j]]);

      steps.push({
        line: 6,
        explanation: `Pop min: (${nums1[i]}, ${nums2[j]}) with sum=${sum}. Pair #${result.length} found.`,
        variables: { pair: [nums1[i], nums2[j]], sum, resultCount: result.length },
        visualization: makeViz(),
      });

      if (j + 1 < nums2.length) {
        const newEntry: [number, number, number] = [nums1[i] + nums2[j + 1], i, j + 1];
        heap.push(newEntry);
        heap.sort((a, b) => a[0] - b[0]);
        steps.push({
          line: 8,
          explanation: `Push next: (${nums1[i]}, ${nums2[j + 1]}) sum=${newEntry[0]}. Heap: ${heap.map(h => `${h[0]}`).join(', ')}.`,
          variables: { pushed: [nums1[i], nums2[j + 1]], newSum: newEntry[0] },
          visualization: makeViz(),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. ${result.length} pair(s) with smallest sums: ${result.map(p => `[${p.join(',')}]`).join(', ')}.`,
      variables: { result },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < nums1.length; i++) { l[i] = String(nums1[i]); h[i] = 'found'; }
        return {
          type: 'array' as const,
          array: nums1.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: `Top ${k} Pairs`,
            entries: result.map((p, idx) => ({ key: `#${idx + 1}`, value: `[${p.join(', ')}] sum=${p[0] + p[1]}` })),
          },
        };
      })(),
    });

    return steps;
  },
};

export default findKPairsSmallestSums;
