import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minCostToConnectAllSticks: AlgorithmDefinition = {
  id: 'min-cost-to-connect-all-sticks',
  title: 'Minimum Cost to Connect Sticks',
  leetcodeNumber: 1167,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an array of sticks, combine two sticks at cost = sum of their lengths. Find the minimum cost to combine all sticks into one. Use a min-heap: always pick the two shortest sticks to minimize cost at each step.',
  tags: ['Graph', 'Heap', 'Greedy'],
  code: {
    pseudocode: `function connectSticks(sticks):
  pq = min-heap(sticks)
  totalCost = 0
  while len(pq) > 1:
    first = pq.extractMin()
    second = pq.extractMin()
    cost = first + second
    totalCost += cost
    pq.insert(cost)
  return totalCost`,
    python: `def connectSticks(sticks):
    heapq.heapify(sticks)
    total = 0
    while len(sticks) > 1:
        first = heapq.heappop(sticks)
        second = heapq.heappop(sticks)
        cost = first + second
        total += cost
        heapq.heappush(sticks, cost)
    return total`,
    javascript: `function connectSticks(sticks) {
  // Simulate min-heap with sorted array
  sticks.sort((a, b) => a - b);
  let total = 0;
  while (sticks.length > 1) {
    sticks.sort((a, b) => a - b);
    const first = sticks.shift();
    const second = sticks.shift();
    const cost = first + second;
    total += cost;
    sticks.push(cost);
  }
  return total;
}`,
    java: `public int connectSticks(int[] sticks) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int s : sticks) pq.offer(s);
    int total = 0;
    while (pq.size() > 1) {
        int first = pq.poll();
        int second = pq.poll();
        int cost = first + second;
        total += cost;
        pq.offer(cost);
    }
    return total;
}`,
  },
  defaultInput: {
    sticks: [2, 4, 3],
  },
  inputFields: [
    {
      name: 'sticks',
      label: 'Stick Lengths',
      type: 'array',
      defaultValue: [2, 4, 3],
      placeholder: '[2,4,3]',
      helperText: 'Array of stick lengths',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawSticks = input.sticks as number[];
    const steps: AlgorithmStep[] = [];

    const heap = [...rawSticks];
    let totalCost = 0;
    let round = 0;

    function makeViz(arr: number[], highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: [...arr],
        highlights,
        labels: Object.fromEntries(arr.map((v, i) => [i, `s${i}:${v}`])),
        auxData: {
          label: 'Connect Sticks (Min-Heap)',
          entries: [
            { key: 'Total Cost', value: String(totalCost) },
            { key: 'Round', value: String(round) },
            { key: 'Heap', value: `[${heap.join(', ')}]` },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    heap.sort((a, b) => a - b);
    steps.push({
      line: 1,
      explanation: `Initialize min-heap with sticks: [${heap.join(', ')}]. Greedily combine two smallest each time.`,
      variables: { sticks: [...heap] },
      visualization: makeViz(heap, Object.fromEntries(heap.map((_, i) => [i, 'default'])), 'Heap ready'),
    });

    while (heap.length > 1) {
      heap.sort((a, b) => a - b);
      round++;
      const first = heap.shift()!;
      const second = heap.shift()!;
      const cost = first + second;
      totalCost += cost;
      heap.push(cost);
      heap.sort((a, b) => a - b);

      steps.push({
        line: 4,
        explanation: `Round ${round}: Combine ${first} + ${second} = ${cost}. Total cost += ${cost} = ${totalCost}. New heap: [${heap.join(', ')}].`,
        variables: { round, first, second, cost, totalCost },
        visualization: makeViz(
          heap,
          { [heap.length - 1]: 'active', ...Object.fromEntries(heap.slice(0, heap.length - 1).map((_, i) => [i, 'default'])) },
          `Combined ${first}+${second}=${cost}`
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `All sticks combined. Minimum total cost = ${totalCost}.`,
      variables: { totalCost },
      visualization: makeViz(heap, { 0: 'sorted' }, `Min cost: ${totalCost}`),
    });

    return steps;
  },
};

export default minCostToConnectAllSticks;
