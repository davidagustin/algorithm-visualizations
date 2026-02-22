import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortKSortedArray: AlgorithmDefinition = {
  id: 'sort-k-sorted-array',
  title: 'Sort K-Sorted Array',
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Sort a nearly sorted (k-sorted) array where each element is at most k positions from its final sorted position. Use a min-heap of size k+1: the smallest in the heap must be the next in sorted order.',
  tags: ['Heap', 'Array', 'Sorting'],
  code: {
    pseudocode: `function sortKSorted(arr, k):
  heap = min-heap
  result = []
  for i from 0 to n-1:
    push arr[i] onto heap
    if heap.size > k + 1:
      result.append(pop min from heap)
  while heap not empty:
    result.append(pop min from heap)
  return result`,
    python: `import heapq
def sortKSorted(arr, k):
    heap = arr[:k+1]
    heapq.heapify(heap)
    result = []
    for i in range(k+1, len(arr)):
        result.append(heapq.heappushpop(heap, arr[i]))
    while heap:
        result.append(heapq.heappop(heap))
    return result`,
    javascript: `function sortKSorted(arr, k) {
  const heap = []; // min-heap simulation
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    heap.push(arr[i]);
    heap.sort((a, b) => a - b);
    if (heap.length > k + 1) {
      result.push(heap.shift());
    }
  }
  while (heap.length) {
    result.push(heap.shift());
  }
  return result;
}`,
    java: `public int[] sortKSorted(int[] arr, int k) {
    PriorityQueue<Integer> heap = new PriorityQueue<>();
    int[] result = new int[arr.length];
    int idx = 0;
    for (int i = 0; i < arr.length; i++) {
        heap.offer(arr[i]);
        if (heap.size() > k + 1) {
            result[idx++] = heap.poll();
        }
    }
    while (!heap.isEmpty()) {
        result[idx++] = heap.poll();
    }
    return result;
}`,
  },
  defaultInput: { arr: [6, 5, 3, 2, 8, 10, 9], k: 3 },
  inputFields: [
    {
      name: 'arr',
      label: 'K-Sorted Array',
      type: 'array',
      defaultValue: [6, 5, 3, 2, 8, 10, 9],
      placeholder: 'e.g. 6,5,3,2,8,10,9',
      helperText: 'Nearly sorted array',
    },
    {
      name: 'k',
      label: 'K (max displacement)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Each element is at most k positions from its sorted position',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const k = input.k as number;
    const n = arr.length;
    const steps: AlgorithmStep[] = [];
    const heap: number[] = [];
    const result: number[] = [];

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (i < result.length) {
          highlights[i] = 'sorted';
        } else if (i === activeIdx) {
          highlights[i] = 'active';
          labels[i] = 'curr';
        } else {
          highlights[i] = 'default';
        }
      }

      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Heap & Result',
          entries: [
            { key: 'Min-Heap', value: heap.length > 0 ? `[${heap.join(', ')}]` : 'empty' },
            { key: 'Heap size', value: `${heap.length}/${k + 1}` },
            { key: 'Sorted output', value: result.length > 0 ? `[${result.join(', ')}]` : 'empty' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Array is k=${k}-sorted. Use a min-heap of size ${k + 1} to sort efficiently.`,
      variables: { arr: [...arr], k },
      visualization: makeViz(null),
    });

    for (let i = 0; i < n; i++) {
      heap.push(arr[i]);
      heap.sort((a, b) => a - b);

      steps.push({
        line: 4,
        explanation: `Push arr[${i}]=${arr[i]} onto heap. Heap: [${heap.join(', ')}].`,
        variables: { i, val: arr[i], heap: [...heap] },
        visualization: makeViz(i),
      });

      if (heap.length > k + 1) {
        const min = heap.shift()!;
        result.push(min);

        steps.push({
          line: 6,
          explanation: `Heap size ${heap.length + 1} > k+1=${k + 1}. Pop min=${min} to result. Result: [${result.join(', ')}].`,
          variables: { popped: min, result: [...result], heap: [...heap] },
          visualization: makeViz(i),
        });
      }
    }

    // Drain remaining heap
    while (heap.length > 0) {
      const min = heap.shift()!;
      result.push(min);

      steps.push({
        line: 8,
        explanation: `Drain heap: pop min=${min}. Result: [${result.join(', ')}].`,
        variables: { popped: min, result: [...result], heap: [...heap] },
        visualization: (() => {
          const h: Record<number, string> = {};
          for (let i = 0; i < n; i++) h[i] = 'sorted';
          return {
            type: 'array' as const,
            array: arr,
            highlights: h,
            labels: {},
            auxData: {
              label: 'Heap & Result',
              entries: [
                { key: 'Min-Heap', value: heap.length > 0 ? `[${heap.join(', ')}]` : 'empty' },
                { key: 'Sorted output', value: `[${result.join(', ')}]` },
              ],
            },
          };
        })(),
      });
    }

    // Final
    steps.push({
      line: 9,
      explanation: `Sorting complete! Result: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: {},
        auxData: {
          label: 'Final Result',
          entries: [{ key: 'Sorted', value: result.join(', ') }],
        },
      },
    });

    return steps;
  },
};

export default sortKSortedArray;
