import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToConnectSticksIi: AlgorithmDefinition = {
  id: 'minimum-cost-to-connect-sticks-ii',
  title: 'Minimum Cost to Connect Sticks II (Huffman)',
  leetcodeNumber: 1167,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given sticks of various lengths, at each step connect two sticks into one at a cost equal to their sum. Find the minimum total cost to connect all sticks into one. This is a Huffman coding style problem: always merge the two shortest sticks using a min heap.',
  tags: ['heap', 'greedy', 'huffman'],

  code: {
    pseudocode: `function connectSticks(sticks):
  minHeap = min heap of sticks
  totalCost = 0
  while heap.size > 1:
    a = pop minHeap
    b = pop minHeap
    combined = a + b
    totalCost += combined
    push combined to minHeap
  return totalCost`,

    python: `import heapq

def connectSticks(sticks: list[int]) -> int:
    heapq.heapify(sticks)
    total_cost = 0
    while len(sticks) > 1:
        a = heapq.heappop(sticks)
        b = heapq.heappop(sticks)
        combined = a + b
        total_cost += combined
        heapq.heappush(sticks, combined)
    return total_cost`,

    javascript: `function connectSticks(sticks) {
  sticks.sort((a,b)=>a-b);
  let totalCost = 0;
  while (sticks.length > 1) {
    sticks.sort((a,b)=>a-b);
    const a = sticks.shift(), b = sticks.shift();
    const combined = a + b;
    totalCost += combined;
    sticks.push(combined);
  }
  return totalCost;
}`,

    java: `public int connectSticks(int[] sticks) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    for (int s : sticks) heap.offer(s);
    int totalCost = 0;
    while (heap.size() > 1) {
        int a = heap.poll(), b = heap.poll();
        int combined = a + b;
        totalCost += combined;
        heap.offer(combined);
    }
    return totalCost;
}`,
  },

  defaultInput: {
    sticks: [2, 4, 3],
  },

  inputFields: [
    {
      name: 'sticks',
      label: 'Sticks',
      type: 'array',
      defaultValue: [2, 4, 3],
      placeholder: '2,4,3',
      helperText: 'Lengths of sticks to connect',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sticks = input.sticks as number[];
    const steps: AlgorithmStep[] = [];

    let heap = [...sticks].sort((a, b) => a - b);
    let totalCost = 0;
    let mergeCount = 0;

    steps.push({
      line: 1,
      explanation: `Initialize min heap: [${heap.join(',')}]. Will merge two shortest sticks repeatedly.`,
      variables: { heap: heap.join(','), size: heap.length },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'active', 1: 'active' },
        labels: { 0: `min1=${heap[0]}`, 1: `min2=${heap[1]}` },
      } as ArrayVisualization,
    });

    while (heap.length > 1) {
      heap.sort((a, b) => a - b);
      const a = heap.shift()!;
      const b = heap.shift()!;
      const combined = a + b;
      totalCost += combined;
      mergeCount++;
      heap.push(combined);
      heap.sort((a, b) => a - b);

      steps.push({
        line: 5,
        explanation: `Merge ${a} + ${b} = ${combined} (cost=${combined}). Total cost so far: ${totalCost}. Heap: [${heap.join(',')}]`,
        variables: { a, b, combined, totalCost, mergeCount, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: heap.length > 1 ? { 0: 'active', 1: 'active' } : { 0: 'found' },
          labels: heap.length > 1
            ? { 0: `${heap[0]}`, 1: `${heap[1]}`, [heap.length - 1]: `new=${combined}` }
            : { 0: `final=${heap[0]}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `All sticks merged after ${mergeCount} operations. Minimum total cost: ${totalCost}`,
      variables: { result: totalCost, merges: mergeCount },
      visualization: {
        type: 'array',
        array: [totalCost],
        highlights: { 0: 'found' },
        labels: { 0: `cost=${totalCost}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumCostToConnectSticksIi;
