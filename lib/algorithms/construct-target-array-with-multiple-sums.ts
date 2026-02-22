import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const constructTargetArrayWithMultipleSums: AlgorithmDefinition = {
  id: 'construct-target-array-with-multiple-sums',
  title: 'Construct Target Array With Multiple Sums',
  leetcodeNumber: 1354,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Start with an array of ones. At each step, replace any element with the sum of the whole array. Given a target array, determine if it can be constructed. Work backwards: take the largest element and subtract the sum of the rest repeatedly using a max heap.',
  tags: ['heap', 'array', 'simulation'],

  code: {
    pseudocode: `function isPossible(target):
  maxHeap = max heap of target
  totalSum = sum(target)
  while maxHeap.max > 1:
    largest = pop maxHeap
    rest = totalSum - largest
    if rest == 0 or rest > largest: return false
    prev = largest % rest
    if prev == 0: prev = rest
    if prev == largest: return false
    totalSum = totalSum - largest + prev
    push prev to maxHeap
  return true`,

    python: `import heapq

def isPossible(target: list[int]) -> bool:
    heap = [-x for x in target]
    heapq.heapify(heap)
    total = sum(target)
    while -heap[0] > 1:
        largest = -heapq.heappop(heap)
        rest = total - largest
        if rest == 0 or rest > largest:
            return False
        prev = largest % rest
        if prev == 0:
            prev = rest
        if prev == largest:
            return False
        total = total - largest + prev
        heapq.heappush(heap, -prev)
    return True`,

    javascript: `function isPossible(target) {
  let heap = [...target].sort((a,b)=>b-a);
  let total = target.reduce((a,b)=>a+b,0);
  while (heap[0] > 1) {
    heap.sort((a,b)=>b-a);
    const largest = heap.shift();
    const rest = total - largest;
    if (rest === 0 || rest > largest) return false;
    let prev = largest % rest;
    if (prev === 0) prev = rest;
    if (prev === largest) return false;
    total = total - largest + prev;
    heap.push(prev);
  }
  return true;
}`,

    java: `public boolean isPossible(int[] target) {
    PriorityQueue<Long> heap = new PriorityQueue<>(Collections.reverseOrder());
    long total = 0;
    for (int t : target) { heap.offer((long)t); total += t; }
    while (heap.peek() > 1) {
        long largest = heap.poll();
        long rest = total - largest;
        if (rest == 0 || rest > largest) return false;
        long prev = largest % rest;
        if (prev == 0) prev = rest;
        if (prev == largest) return false;
        total = total - largest + prev;
        heap.offer(prev);
    }
    return true;
}`,
  },

  defaultInput: {
    target: [9, 3, 5],
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target Array',
      type: 'array',
      defaultValue: [9, 3, 5],
      placeholder: '9,3,5',
      helperText: 'Target array to check constructibility',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number[];
    const steps: AlgorithmStep[] = [];

    let heap = [...target].sort((a, b) => b - a);
    let total = target.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `Target: [${target.join(',')}]. Total=${total}. Work backwards from max using max heap.`,
      variables: { target: target.join(','), total, heapMax: heap[0] },
      visualization: {
        type: 'array',
        array: [...heap],
        highlights: { 0: 'active' },
        labels: { 0: `max=${heap[0]}` },
      } as ArrayVisualization,
    });

    let iteration = 0;

    while (heap[0] > 1) {
      heap.sort((a, b) => b - a);
      const largest = heap.shift()!;
      const rest = total - largest;
      iteration++;

      if (rest === 0 || rest > largest) {
        steps.push({
          line: 5,
          explanation: `Largest=${largest}, rest=${rest}. Impossible condition met (rest=0 or rest>largest). Return false.`,
          variables: { largest, rest, total },
          visualization: {
            type: 'array',
            array: [...heap, largest],
            highlights: { 0: 'mismatch' },
            labels: { 0: `INVALID rest=${rest}` },
          } as ArrayVisualization,
        });
        return steps;
      }

      let prev = largest % rest;
      if (prev === 0) prev = rest;

      if (prev === largest) {
        steps.push({
          line: 8,
          explanation: `prev=${prev} == largest=${largest}. Cannot reduce further. Return false.`,
          variables: { largest, prev, rest },
          visualization: {
            type: 'array',
            array: [...heap, largest],
            highlights: { 0: 'mismatch' },
            labels: { 0: 'STUCK' },
          } as ArrayVisualization,
        });
        return steps;
      }

      total = total - largest + prev;
      heap.push(prev);
      heap.sort((a, b) => b - a);

      steps.push({
        line: 9,
        explanation: `Iter ${iteration}: largest=${largest}, rest=${rest}. prev = ${largest} % ${rest} = ${prev}. New total=${total}. Heap: [${heap.join(',')}]`,
        variables: { largest, rest, prev, newTotal: total, heapMax: heap[0] },
        visualization: {
          type: 'array',
          array: [...heap],
          highlights: { 0: 'active' },
          labels: Object.fromEntries([[0, `max=${heap[0]}`], [heap.length - 1, `prev=${prev}`]]),
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 11,
      explanation: `All elements reduced to 1. Target [${target.join(',')}] IS constructible from all-ones. Return true.`,
      variables: { result: true },
      visualization: {
        type: 'array',
        array: target,
        highlights: Object.fromEntries(target.map((_, i) => [i, 'found'])),
        labels: { 0: 'POSSIBLE' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default constructTargetArrayWithMultipleSums;
