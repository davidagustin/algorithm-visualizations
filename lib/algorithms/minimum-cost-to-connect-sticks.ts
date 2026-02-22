import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumCostToConnectSticks: AlgorithmDefinition = {
  id: 'minimum-cost-to-connect-sticks',
  title: 'Minimum Cost to Connect Sticks',
  leetcodeNumber: 1167,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given sticks of various lengths, you can connect any two sticks at a cost equal to their combined length. Find the minimum total cost to connect all sticks into one. Use a min-heap: repeatedly extract the two shortest sticks, combine them (adding cost), and push the combined stick back. This greedy approach minimizes cost.',
  tags: ['heap', 'greedy', 'priority queue', 'huffman coding'],

  code: {
    pseudocode: `function connectSticks(sticks):
  minHeap = heapify(sticks)
  totalCost = 0

  while minHeap.size > 1:
    a = minHeap.pop()  // smallest
    b = minHeap.pop()  // second smallest
    cost = a + b
    totalCost += cost
    minHeap.push(cost)

  return totalCost`,

    python: `import heapq

def connectSticks(sticks: list[int]) -> int:
    heapq.heapify(sticks)
    total = 0
    while len(sticks) > 1:
        a = heapq.heappop(sticks)
        b = heapq.heappop(sticks)
        cost = a + b
        total += cost
        heapq.heappush(sticks, cost)
    return total`,

    javascript: `function connectSticks(sticks) {
  // Simulate min-heap with sorted array
  sticks.sort((a, b) => a - b);
  let total = 0;
  while (sticks.length > 1) {
    const a = sticks.shift();
    const b = sticks.shift();
    const cost = a + b;
    total += cost;
    // Insert in sorted order
    let i = 0;
    while (i < sticks.length && sticks[i] < cost) i++;
    sticks.splice(i, 0, cost);
  }
  return total;
}`,

    java: `public int connectSticks(int[] sticks) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int s : sticks) pq.offer(s);
    int total = 0;
    while (pq.size() > 1) {
        int a = pq.poll(), b = pq.poll();
        int cost = a + b;
        total += cost;
        pq.offer(cost);
    }
    return total;
}`,
  },

  defaultInput: {
    nums: [2, 4, 3, 6, 1, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Stick Lengths',
      type: 'array',
      defaultValue: [2, 4, 3, 6, 1, 5],
      placeholder: '2,4,3,6,1,5',
      helperText: 'Lengths of sticks to connect',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sticks = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    let heap = [...sticks].sort((a, b) => a - b);
    let totalCost = 0;

    steps.push({
      line: 1,
      explanation: `Initialize min-heap with sticks [${heap.join(', ')}]. We will always merge the two shortest sticks to minimize total cost.`,
      variables: { sticks: heap.join(', '), totalCost: 0 },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'pointer', 1: 'pointer' },
        labels: { 0: `min:${heap[0]}`, 1: `2nd:${heap[1]}` },
      },
    });

    let mergeStep = 0;
    while (heap.length > 1) {
      const a = heap.shift()!;
      const b = heap.shift()!;
      const cost = a + b;
      totalCost += cost;
      mergeStep++;

      steps.push({
        line: 5,
        explanation: `Merge ${a} + ${b} = ${cost}. Add ${cost} to total cost. Total so far: ${totalCost}.`,
        variables: { a, b, mergeCost: cost, totalCost, step: mergeStep },
        visualization: {
          type: 'array',
          array: [...heap, cost],
          highlights: {
            [heap.length]: 'active',
          },
          labels: {
            0: heap.length > 0 ? `next:${heap[0]}` : 'only',
            [heap.length]: `new:${cost}`,
          },
        },
      });

      // Insert cost in sorted position
      let i = 0;
      while (i < heap.length && heap[i] < cost) i++;
      heap.splice(i, 0, cost);

      steps.push({
        line: 9,
        explanation: `Push merged stick ${cost} back to heap. Heap now: [${heap.join(', ')}]. ${heap.length} stick(s) remaining.`,
        variables: { heap: heap.join(', '), remaining: heap.length, totalCost },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: { [i]: 'found' },
          labels: { 0: `min:${heap[0]}`, [i]: `merged:${cost}` },
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `All sticks merged into one. Minimum total cost = ${totalCost}. Greedy approach always merges cheapest two first, like Huffman coding.`,
      variables: { totalCost, finalStick: heap[0] },
      visualization: {
        type: 'array',
        array: [totalCost],
        highlights: { 0: 'found' },
        labels: { 0: `min cost: ${totalCost}` },
      },
    });

    return steps;
  },
};

export default minimumCostToConnectSticks;
