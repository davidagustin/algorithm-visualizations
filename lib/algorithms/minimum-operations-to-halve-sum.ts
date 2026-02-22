import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumOperationsToHalveSum: AlgorithmDefinition = {
  id: 'minimum-operations-to-halve-sum',
  title: 'Minimum Operations to Halve Array Sum',
  leetcodeNumber: 2208,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given an array of numbers, in each operation you can halve any element. Return the minimum number of operations needed to reduce the total sum by at least half. Use a max heap to always halve the current largest element.',
  tags: ['heap', 'greedy', 'array'],

  code: {
    pseudocode: `function halveArray(nums):
  total = sum(nums)
  target = total / 2
  maxHeap = max heap of nums
  ops = 0
  reduced = 0.0
  while reduced < target:
    largest = pop maxHeap
    half = largest / 2
    reduced += half
    push half to maxHeap
    ops++
  return ops`,

    python: `import heapq

def halveArray(nums: list[int]) -> int:
    total = sum(nums)
    target = total / 2
    heap = [-x for x in nums]
    heapq.heapify(heap)
    ops = 0
    reduced = 0.0
    while reduced < target:
        largest = -heapq.heappop(heap)
        half = largest / 2
        reduced += half
        heapq.heappush(heap, -half)
        ops += 1
    return ops`,

    javascript: `function halveArray(nums) {
  const total = nums.reduce((a,b) => a+b, 0);
  let target = total / 2;
  let heap = [...nums].sort((a,b) => b-a);
  let ops = 0, reduced = 0;
  while (reduced < target) {
    heap.sort((a,b) => b-a);
    const largest = heap.shift();
    const half = largest / 2;
    reduced += half;
    heap.push(half);
    ops++;
  }
  return ops;
}`,

    java: `public int halveArray(int[] nums) {
    double total = 0;
    PriorityQueue<Double> heap = new PriorityQueue<>(Collections.reverseOrder());
    for (int n : nums) { total += n; heap.offer((double)n); }
    double target = total / 2, reduced = 0;
    int ops = 0;
    while (reduced < target) {
        double largest = heap.poll();
        double half = largest / 2;
        reduced += half;
        heap.offer(half);
        ops++;
    }
    return ops;
}`,
  },

  defaultInput: {
    nums: [5, 19, 8, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 19, 8, 1],
      placeholder: '5,19,8,1',
      helperText: 'Array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const total = nums.reduce((a, b) => a + b, 0);
    const target = total / 2;
    let heap = [...nums].map(x => x * 1.0);
    heap.sort((a, b) => b - a);

    steps.push({
      line: 1,
      explanation: `Total sum = ${total}. Target reduction = ${target}. Max heap initialized with elements.`,
      variables: { total, target, heapTop: heap[0] },
      visualization: {
        type: 'array',
        array: heap.map(v => Math.round(v * 100) / 100),
        highlights: { 0: 'active' },
        labels: { 0: `max=${heap[0]}` },
      } as ArrayVisualization,
    });

    let ops = 0;
    let reduced = 0.0;

    while (reduced < target) {
      heap.sort((a, b) => b - a);
      const largest = heap.shift()!;
      const half = largest / 2;
      reduced += half;
      heap.push(half);
      ops++;

      steps.push({
        line: 8,
        explanation: `Op ${ops}: Halve ${largest.toFixed(2)} -> ${half.toFixed(2)}. Reduced by ${half.toFixed(2)}. Total reduced: ${reduced.toFixed(2)} / ${target}`,
        variables: { ops, largest: largest.toFixed(2), half: half.toFixed(2), reduced: reduced.toFixed(2), target },
        visualization: {
          type: 'array',
          array: heap.sort((a, b) => b - a).map(v => Math.round(v * 100) / 100),
          highlights: { 0: reduced >= target ? 'found' : 'active' },
          labels: { 0: `top=${heap[0].toFixed(2)}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 11,
      explanation: `Reduced ${reduced.toFixed(2)} >= target ${target}. Minimum operations: ${ops}`,
      variables: { result: ops, reduced: reduced.toFixed(2), target },
      visualization: {
        type: 'array',
        array: [ops],
        highlights: { 0: 'found' },
        labels: { 0: `ops=${ops}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumOperationsToHalveSum;
