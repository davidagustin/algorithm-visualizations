import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lastStoneWeight: AlgorithmDefinition = {
  id: 'last-stone-weight',
  title: 'Last Stone Weight',
  leetcodeNumber: 1046,
  difficulty: 'Easy',
  category: 'Heap',
  description:
    'You have stones with weights. Each turn, pick the two heaviest stones and smash them together. If equal, both are destroyed; if different, the smaller is destroyed and the larger loses the smaller stone\'s weight. Repeat until at most one stone remains. Use a max-heap to efficiently pick the two heaviest stones.',
  tags: ['Heap', 'Array', 'Simulation'],
  code: {
    pseudocode: `function lastStoneWeight(stones):
  maxHeap = build max-heap from stones
  while heap.size > 1:
    y = pop max (heaviest)
    x = pop max (second heaviest)
    if x != y:
      push (y - x) back to heap
  return heap[0] if heap not empty else 0`,
    python: `import heapq
def lastStoneWeight(stones):
    heap = [-s for s in stones]
    heapq.heapify(heap)
    while len(heap) > 1:
        y = -heapq.heappop(heap)
        x = -heapq.heappop(heap)
        if x != y:
            heapq.heappush(heap, -(y - x))
    return -heap[0] if heap else 0`,
    javascript: `function lastStoneWeight(stones) {
  // Simulate max-heap with sorted array (desc)
  let heap = [...stones].sort((a, b) => b - a);
  while (heap.length > 1) {
    const y = heap.shift();
    const x = heap.shift();
    if (x !== y) {
      heap.push(y - x);
      heap.sort((a, b) => b - a);
    }
  }
  return heap.length ? heap[0] : 0;
}`,
    java: `public int lastStoneWeight(int[] stones) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
    for (int s : stones) pq.offer(s);
    while (pq.size() > 1) {
        int y = pq.poll(), x = pq.poll();
        if (x != y) pq.offer(y - x);
    }
    return pq.isEmpty() ? 0 : pq.peek();
}`,
  },
  defaultInput: { stones: [2, 7, 4, 1, 8, 1] },
  inputFields: [
    {
      name: 'stones',
      label: 'Stone Weights',
      type: 'array',
      defaultValue: [2, 7, 4, 1, 8, 1],
      placeholder: 'e.g. 2,7,4,1,8,1',
      helperText: 'Positive integers representing stone weights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stonesInput = input.stones as number[];
    const steps: AlgorithmStep[] = [];
    let heap = stonesInput.slice().sort((a, b) => b - a);
    const history: string[] = [];

    function makeViz(y: number | null, x: number | null, newStone: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < heap.length; i++) {
        labels[i] = String(heap[i]);
        if (y !== null && i === 0) highlights[i] = 'active';
        else if (x !== null && i === 1) highlights[i] = 'comparing';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: heap.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Stone Smashing',
          entries: [
            { key: 'Max-heap', value: heap.join(', ') || 'empty' },
            ...(y !== null ? [{ key: 'Heaviest (y)', value: String(y) }] : []),
            ...(x !== null ? [{ key: '2nd heaviest (x)', value: String(x) }] : []),
            ...(newStone !== null ? [{ key: 'New stone (y-x)', value: String(newStone) }] : []),
            { key: 'Smash history', value: history.join(' | ') || 'none' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build max-heap from stones [${stonesInput.join(', ')}]: [${heap.join(', ')}]. Smash two heaviest each round.`,
      variables: { stones: heap.slice() },
      visualization: makeViz(null, null, null),
    });

    let round = 0;
    while (heap.length > 1) {
      round++;
      const y = heap.shift()!;
      const x = heap.shift()!;

      steps.push({
        line: 3,
        explanation: `Round ${round}: Pop heaviest y=${y} and x=${x}. ${y === x ? 'Equal weights: both destroyed.' : `y>x: new stone weight = ${y}-${x}=${y - x}.`}`,
        variables: { y, x, equal: y === x },
        visualization: makeViz(y, x, y !== x ? y - x : null),
      });

      if (y === x) {
        history.push(`${y}==${x}→both destroyed`);
      } else {
        const newStone = y - x;
        history.push(`${y}-${x}=${newStone}`);
        heap.push(newStone);
        heap.sort((a, b) => b - a);
        steps.push({
          line: 6,
          explanation: `Push new stone ${newStone} back to heap. Heap: [${heap.join(', ')}].`,
          variables: { newStone, heap: heap.slice() },
          visualization: makeViz(null, null, newStone),
        });
      }
    }

    const result = heap.length > 0 ? heap[0] : 0;
    steps.push({
      line: 7,
      explanation: heap.length === 0
        ? `All stones destroyed. Last stone weight = 0.`
        : `One stone remains. Last stone weight = ${result}.`,
      variables: { result },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        if (heap.length > 0) { l[0] = String(heap[0]); h[0] = 'found'; }
        return {
          type: 'array' as const,
          array: heap.length > 0 ? heap.slice() : [0],
          highlights: heap.length > 0 ? h : { 0: 'visited' },
          labels: heap.length > 0 ? l : { 0: '0' },
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Last stone weight', value: String(result) },
              { key: 'Rounds', value: String(round) },
              { key: 'History', value: history.join(' | ') || 'none' },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default lastStoneWeight;
