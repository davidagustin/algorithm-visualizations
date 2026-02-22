import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumProductAfterKIncrements: AlgorithmDefinition = {
  id: 'maximum-product-after-k-increments',
  title: 'Maximum Product After K Increments',
  leetcodeNumber: 2233,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given an array and k increments, each increment adds 1 to any element. Use a min heap to always increment the smallest element, which maximizes the final product. Return the product modulo 10^9+7.',
  tags: ['heap', 'greedy', 'array', 'math'],

  code: {
    pseudocode: `function maximumProduct(nums, k):
  minHeap = min heap of nums
  for _ in k:
    smallest = pop minHeap
    push smallest + 1 to minHeap
  product = 1
  for each val in minHeap:
    product = (product * val) % MOD
  return product`,

    python: `import heapq

def maximumProduct(nums: list[int], k: int) -> int:
    heapq.heapify(nums)
    for _ in range(k):
        heapq.heapreplace(nums, nums[0] + 1)
    MOD = 10**9 + 7
    product = 1
    for v in nums:
        product = (product * v) % MOD
    return product`,

    javascript: `function maximumProduct(nums, k) {
  nums.sort((a,b)=>a-b);
  for (let i = 0; i < k; i++) {
    nums.sort((a,b)=>a-b);
    nums[0]++;
  }
  const MOD = 1e9 + 7;
  return nums.reduce((p,v) => (p * v) % MOD, 1);
}`,

    java: `public int maximumProduct(int[] nums, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int n : nums) heap.offer(n);
    for (int i = 0; i < k; i++) heap.offer(heap.poll() + 1);
    long product = 1, MOD = 1_000_000_007L;
    while (!heap.isEmpty()) product = (product * heap.poll()) % MOD;
    return (int)product;
}`,
  },

  defaultInput: {
    nums: [0, 4],
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [0, 4],
      placeholder: '0,4',
      helperText: 'Array of non-negative integers',
    },
    {
      name: 'k',
      label: 'K (increments)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of increment operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    let heap = [...nums].sort((a, b) => a - b);

    steps.push({
      line: 1,
      explanation: `Initialize min heap: [${heap.join(',')}]. Will apply ${k} increments to minimize final product growth waste.`,
      variables: { heap: heap.join(','), k },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'active' },
        labels: { 0: `min=${heap[0]}` },
      } as ArrayVisualization,
    });

    for (let i = 0; i < k; i++) {
      heap.sort((a, b) => a - b);
      const prev = heap[0];
      heap[0] = prev + 1;
      heap.sort((a, b) => a - b);

      if (i < 8 || i === k - 1) {
        steps.push({
          line: 3,
          explanation: `Increment ${i + 1}: smallest=${prev} -> ${prev + 1}. Heap: [${heap.join(',')}]`,
          variables: { increment: i + 1, prev, newVal: prev + 1, heap: heap.join(',') },
          visualization: {
            type: 'array',
            array: [...heap],
            highlights: { 0: 'active' },
            labels: { 0: `min=${heap[0]}` },
          } as ArrayVisualization,
        });
      }
    }

    let product = 1;
    for (const v of heap) {
      product = (product * v) % MOD;
    }

    steps.push({
      line: 6,
      explanation: `All ${k} increments done. Final heap: [${heap.join(',')}]. Product mod 10^9+7 = ${product}`,
      variables: { result: product, finalHeap: heap.join(',') },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: Object.fromEntries(heap.map((_, i) => [i, 'found'])),
        labels: { 0: `product=${product}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumProductAfterKIncrements;
