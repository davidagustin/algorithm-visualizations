import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findKClosestElementsIi: AlgorithmDefinition = {
  id: 'find-k-closest-elements-ii',
  title: 'Find K Closest Elements (Heap Approach)',
  leetcodeNumber: 658,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given a sorted array, an integer k, and a target x, find the k closest elements to x. Heap approach: use a max-heap of size k keyed by (distance, value). Push each element with its distance; if the heap exceeds size k, pop the farthest. The remaining k elements are the closest. Sort the result.',
  tags: ['heap', 'binary search', 'two pointers', 'sorted array'],

  code: {
    pseudocode: `function findClosestElements(arr, k, x):
  // Max-heap by distance
  maxHeap = []

  for num in arr:
    dist = abs(num - x)
    maxHeap.push((dist, num))
    if maxHeap.size > k:
      maxHeap.pop()  // remove farthest

  result = [num for (_, num) in maxHeap]
  return sorted(result)`,

    python: `import heapq

def findClosestElements(arr: list[int], k: int, x: int) -> list[int]:
    # max-heap by (distance, -value) using negation
    heap = []
    for num in arr:
        d = abs(num - x)
        heapq.heappush(heap, (-d, -num))
        if len(heap) > k:
            heapq.heappop(heap)
    return sorted(-v for _, v in heap)`,

    javascript: `function findClosestElements(arr, k, x) {
  // Simulate max-heap
  const heap = [];
  for (const num of arr) {
    const dist = Math.abs(num - x);
    heap.push([dist, num]);
    heap.sort((a, b) => b[0] - a[0] || b[1] - a[1]); // max dist first
    if (heap.length > k) heap.shift();
  }
  return heap.map(([, n]) => n).sort((a, b) => a - b);
}`,

    java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    PriorityQueue<int[]> pq = new PriorityQueue<>(
        (a,b) -> a[0]!=b[0] ? b[0]-a[0] : b[1]-a[1]);
    for (int num : arr) {
        pq.offer(new int[]{Math.abs(num-x), num});
        if (pq.size() > k) pq.poll();
    }
    List<Integer> res = new ArrayList<>();
    while (!pq.isEmpty()) res.add(pq.poll()[1]);
    Collections.sort(res);
    return res;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7, 8],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8],
      placeholder: '1,2,3,4,5,6,7,8',
      helperText: 'Sorted array to find k closest elements (k=3, x=5 used for demo)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.nums as number[];
    const k = 3;
    const x = 5;
    const steps: AlgorithmStep[] = [];

    // Max-heap simulated as sorted array [farthest first]
    let heap: Array<[number, number]> = []; // [dist, val]

    steps.push({
      line: 1,
      explanation: `Find ${k} closest elements to x=${x} in [${arr.join(', ')}] using a max-heap of size k=${k}.`,
      variables: { k, x, arr: arr.join(', ') },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: arr.reduce((acc: Record<number, string>, v, i) => { acc[i] = `d=${Math.abs(v - x)}`; return acc; }, {}),
      },
    });

    for (const num of arr) {
      const dist = Math.abs(num - x);
      heap.push([dist, num]);
      heap.sort((a, b) => b[0] - a[0] || b[1] - a[1]); // max dist at front

      if (heap.length > k) {
        const removed = heap.shift()!;
        steps.push({
          line: 6,
          explanation: `Push (dist=${dist}, val=${num}). Heap size ${heap.length + 1} > k=${k}. Remove farthest: (dist=${removed[0]}, val=${removed[1]}). Heap: [${heap.map(([d, v]) => `(${d},${v})`).join(', ')}].`,
          variables: { pushed: num, dist, removed: removed[1], heapSize: heap.length },
          visualization: {
            type: 'array',
            array: arr.map(v => Math.abs(v - x)),
            highlights: {
              [arr.indexOf(num)]: 'active',
              [arr.indexOf(removed[1])]: 'mismatch',
            },
            labels: {
              [arr.indexOf(num)]: `d=${dist}`,
              [arr.indexOf(removed[1])]: 'removed',
            },
          },
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Push (dist=${dist}, val=${num}). Heap size = ${heap.length} <= k=${k}. Heap: [${heap.map(([d, v]) => `(${d},${v})`).join(', ')}].`,
          variables: { pushed: num, dist, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: arr.map(v => Math.abs(v - x)),
            highlights: { [arr.indexOf(num)]: 'active' },
            labels: { [arr.indexOf(num)]: `d=${dist}` },
          },
        });
      }
    }

    const result = heap.map(([, v]) => v).sort((a, b) => a - b);

    steps.push({
      line: 9,
      explanation: `Heap contains k=${k} closest elements: ${heap.map(([d, v]) => `val=${v}(d=${d})`).join(', ')}. Sorted result: [${result.join(', ')}].`,
      variables: { result: result.join(', '), k, x },
      visualization: {
        type: 'array',
        array: result,
        highlights: result.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: result.reduce((acc: Record<number, string>, v, i) => { acc[i] = `v=${v},d=${Math.abs(v - x)}`; return acc; }, {}),
      },
    });

    return steps;
  },
};

export default findKClosestElementsIi;
