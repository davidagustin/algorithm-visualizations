import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthLargestElementInArray: AlgorithmDefinition = {
  id: 'kth-largest-element-in-array',
  title: 'Kth Largest Element in an Array',
  leetcodeNumber: 215,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Find the kth largest element in an unsorted array. Use a min heap of size k: iterate through the array, maintaining a min heap of the k largest seen so far. The heap root is the kth largest element.',
  tags: ['heap', 'quickselect', 'divide and conquer', 'array', 'sorting'],

  code: {
    pseudocode: `function findKthLargest(nums, k):
  minHeap = min heap
  for num in nums:
    push num to minHeap
    if heap.size > k:
      pop minHeap (remove smallest)
  return minHeap.top  // kth largest`,

    python: `import heapq

def findKthLargest(nums: list[int], k: int) -> int:
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)
    return heap[0]`,

    javascript: `function findKthLargest(nums, k) {
  let heap = [];
  for (const num of nums) {
    heap.push(num);
    heap.sort((a,b)=>a-b);
    if (heap.length > k) heap.shift();
  }
  return heap[0];
}`,

    java: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int num : nums) {
        heap.offer(num);
        if (heap.size() > k) heap.poll();
    }
    return heap.peek();
}`,
  },

  defaultInput: {
    nums: [3, 2, 1, 5, 6, 4],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 1, 5, 6, 4],
      placeholder: '3,2,1,5,6,4',
      helperText: 'Unsorted array of integers',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Find the kth largest element',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    let heap: number[] = [];

    steps.push({
      line: 1,
      explanation: `Find the ${k}th largest element in [${nums.join(',')}] using a min heap of size ${k}.`,
      variables: { k, n: nums.length },
      visualization: {
        type: 'array',
        array: nums,
        highlights: {},
        labels: { 0: 'start' },
      } as ArrayVisualization,
    });

    for (let i = 0; i < nums.length; i++) {
      heap.push(nums[i]);
      heap.sort((a, b) => a - b);

      if (heap.length > k) {
        const removed = heap.shift()!;
        steps.push({
          line: 4,
          explanation: `Add nums[${i}]=${nums[i]}. Heap exceeds k=${k}. Remove smallest=${removed}. Heap: [${heap.join(',')}]`,
          variables: { i, added: nums[i], removed, heapSize: heap.length, heapMin: heap[0] },
          visualization: {
            type: 'array',
            array: nums,
            highlights: { [i]: 'active', ...Object.fromEntries(heap.map((v, hi) => [nums.indexOf(v), 'comparing'])) },
            labels: { [i]: `new=${nums[i]}` },
          } as ArrayVisualization,
        });
      } else {
        steps.push({
          line: 3,
          explanation: `Add nums[${i}]=${nums[i]}. Heap size=${heap.length}/${k}. Heap: [${heap.join(',')}]`,
          variables: { i, added: nums[i], heapSize: heap.length, k },
          visualization: {
            type: 'array',
            array: nums,
            highlights: { [i]: 'current' },
            labels: { [i]: `+${nums[i]}` },
          } as ArrayVisualization,
        });
      }
    }

    const result = heap[0];

    steps.push({
      line: 6,
      explanation: `Final heap: [${heap.join(',')}]. The ${k}th largest element is heap[0] = ${result}`,
      variables: { result, k, heap: heap.join(',') },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'found' },
        labels: { 0: `${k}th largest=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default kthLargestElementInArray;
