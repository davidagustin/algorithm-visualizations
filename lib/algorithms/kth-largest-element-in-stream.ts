import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const kthLargestElementInStream: AlgorithmDefinition = {
  id: 'kth-largest-element-in-stream',
  title: 'Kth Largest Element in a Stream',
  leetcodeNumber: 703,
  difficulty: 'Easy',
  category: 'Heap',
  description:
    'Design a class that finds the k-th largest element in a stream. Maintain a min-heap of size k. The k-th largest is always at the top of the heap. When adding a new number, push it to the heap and pop if the heap exceeds size k. The top then holds the k-th largest.',
  tags: ['heap', 'priority queue', 'design', 'data stream'],

  code: {
    pseudocode: `class KthLargest:
  minHeap = min-heap of size k
  k = k

  init(k, nums):
    for num in nums:
      add(num)

  add(val):
    minHeap.push(val)
    if minHeap.size > k:
      minHeap.pop()  // remove smallest
    return minHeap.top()  // k-th largest`,

    python: `import heapq

class KthLargest:
    def __init__(self, k: int, nums: list[int]):
        self.k = k
        self.heap = []
        for n in nums:
            self.add(n)

    def add(self, val: int) -> int:
        heapq.heappush(self.heap, val)
        if len(self.heap) > self.k:
            heapq.heappop(self.heap)
        return self.heap[0]`,

    javascript: `class KthLargest {
  constructor(k, nums) {
    this.k = k;
    this.heap = [];
    for (const n of nums) this.add(n);
  }

  add(val) {
    this.heap.push(val);
    this.heap.sort((a, b) => a - b); // min at front
    if (this.heap.length > this.k) this.heap.shift();
    return this.heap[0];
  }
}`,

    java: `class KthLargest {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    int k;

    public KthLargest(int k, int[] nums) {
        this.k = k;
        for (int n : nums) add(n);
    }

    public int add(int val) {
        heap.offer(val);
        if (heap.size() > k) heap.poll();
        return heap.peek();
    }
}`,
  },

  defaultInput: {
    nums: [4, 5, 8, 2, 3, 9, 1, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Stream Values',
      type: 'array',
      defaultValue: [4, 5, 8, 2, 3, 9, 1, 6],
      placeholder: '4,5,8,2,3,9,1,6',
      helperText: 'Numbers arriving in the stream (k=3 is used for this demo)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const k = 3;
    let heap: number[] = []; // min-heap simulated as sorted array

    steps.push({
      line: 1,
      explanation: `Initialize KthLargest with k=${k}. We maintain a min-heap of exactly k elements. The top = k-th largest overall.`,
      variables: { k, heap: '[]' },
      visualization: {
        type: 'array',
        array: [],
        highlights: {},
        labels: {},
      },
    });

    for (const val of nums) {
      heap.push(val);
      heap.sort((a, b) => a - b);

      if (heap.length > k) {
        const removed = heap.shift()!;
        steps.push({
          line: 9,
          explanation: `add(${val}): Push ${val}, heap size exceeds k=${k}. Remove minimum (${removed}) - it cannot be in top-k. Heap: [${heap.join(', ')}].`,
          variables: { added: val, removed, heapSize: heap.length, kthLargest: heap[0] },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'pointer' },
            labels: { 0: `k-th:${heap[0]}` },
          },
        });
      } else {
        steps.push({
          line: 8,
          explanation: `add(${val}): Push ${val}, heap size = ${heap.length} (not yet k=${k}). Heap: [${heap.join(', ')}]. ${heap.length === k ? `K-th largest = ${heap[0]}.` : 'Building up heap.'}`,
          variables: { added: val, heapSize: heap.length, kthLargest: heap.length === k ? heap[0] : 'N/A' },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: {
              [heap.length - 1]: 'active',
              0: heap.length === k ? 'found' : 'pointer',
            },
            labels: {
              [heap.length - 1]: 'new',
              0: heap.length === k ? `k-th:${heap[0]}` : 'min',
            },
          },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Final heap: [${heap.join(', ')}]. The ${k}-th largest element in the stream is ${heap[0]} (min of the k-element heap).`,
      variables: { heap: heap.join(', '), kthLargest: heap[0], k },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'found' },
        labels: { 0: `${k}-th largest: ${heap[0]}` },
      },
    });

    return steps;
  },
};

export default kthLargestElementInStream;
