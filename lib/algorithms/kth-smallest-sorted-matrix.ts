import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthSmallestSortedMatrix: AlgorithmDefinition = {
  id: 'kth-smallest-sorted-matrix',
  title: 'Kth Smallest Element in Sorted Matrix',
  leetcodeNumber: 378,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Find the kth smallest element in an n×n matrix where each row and column is sorted in ascending order. Use a min-heap: push the first element of each row with its coordinates. Pop the minimum k times; each time push the next element in the same row if available.',
  tags: ['Heap', 'Matrix', 'Array'],
  code: {
    pseudocode: `function kthSmallest(matrix, k):
  n = matrix.length
  minHeap = [(matrix[r][0], r, 0) for r in range(n)]
  heapify(minHeap)
  for i from 1 to k:
    (val, r, c) = pop min from heap
    if c + 1 < n:
      push (matrix[r][c+1], r, c+1)
  return val`,
    python: `import heapq
def kthSmallest(matrix, k):
    n = len(matrix)
    heap = [(matrix[r][0], r, 0) for r in range(n)]
    heapq.heapify(heap)
    val = 0
    for _ in range(k):
        val, r, c = heapq.heappop(heap)
        if c + 1 < n:
            heapq.heappush(heap, (matrix[r][c+1], r, c+1))
    return val`,
    javascript: `function kthSmallest(matrix, k) {
  const n = matrix.length;
  // Min-heap simulation
  const heap = matrix.map((row, r) => [row[0], r, 0]);
  heap.sort((a, b) => a[0] - b[0]);
  let val;
  for (let i = 0; i < k; i++) {
    [val, r, c] = heap.shift();
    if (c + 1 < n) {
      heap.push([matrix[r][c + 1], r, c + 1]);
      heap.sort((a, b) => a[0] - b[0]);
    }
  }
  return val;
}`,
    java: `public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    for (int r = 0; r < n; r++) pq.offer(new int[]{matrix[r][0], r, 0});
    int val = 0;
    for (int i = 0; i < k; i++) {
        int[] cur = pq.poll();
        val = cur[0];
        if (cur[2] + 1 < n)
            pq.offer(new int[]{matrix[cur[1]][cur[2]+1], cur[1], cur[2]+1});
    }
    return val;
}`,
  },
  defaultInput: { matrix: [[1, 5, 9], [10, 11, 13], [12, 13, 15]], k: 8 },
  inputFields: [
    {
      name: 'matrix',
      label: 'Sorted Matrix (n×n)',
      type: 'array',
      defaultValue: [[1, 5, 9], [10, 11, 13], [12, 13, 15]],
      helperText: 'Each row and column sorted ascending',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 8,
      placeholder: 'e.g. 8',
      helperText: 'Find the kth smallest element (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const k = input.k as number;
    const n = matrix.length;
    const steps: AlgorithmStep[] = [];

    // Flatten matrix for visualization
    const flat = matrix.flat();
    const size = flat.length;

    // Min-heap: [value, row, col]
    let heap: [number, number, number][] = matrix.map((row, r) => [row[0], r, 0]);
    heap.sort((a, b) => a[0] - b[0]);

    const visited: Set<string> = new Set();
    for (let r = 0; r < n; r++) visited.add(`${r},0`);

    const popped: { val: number; r: number; c: number }[] = [];
    let lastPopped: { val: number; r: number; c: number } | null = null;

    function cellIdx(r: number, c: number): number { return r * n + c; }

    function makeViz(): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const idx = cellIdx(r, c);
          labels[idx] = String(matrix[r][c]);
          const key = `${r},${c}`;
          const inHeap = heap.find(h => h[1] === r && h[2] === c);
          if (popped.find(p => p.r === r && p.c === c)) highlights[idx] = 'visited';
          else if (lastPopped && lastPopped.r === r && lastPopped.c === c) highlights[idx] = 'found';
          else if (inHeap) highlights[idx] = 'active';
          else highlights[idx] = 'default';
        }
      }
      return {
        type: 'array',
        array: flat.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Min-Heap State',
          entries: [
            { key: `Min-Heap (size ${heap.length})`, value: heap.map(h => `${h[0]}@(${h[1]},${h[2]})`).join(', ') || 'empty' },
            { key: 'Popped so far', value: popped.map(p => String(p.val)).join(', ') || 'none' },
            { key: 'Last popped', value: lastPopped ? String(lastPopped.val) : '-' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Initialize min-heap with first column of each row: ${heap.map(h => `${h[0]}@(${h[1]},${h[2]})`).join(', ')}. Find kth=${k} smallest.`,
      variables: { k, n },
      visualization: makeViz(),
    });

    let val = 0;
    for (let i = 1; i <= k; i++) {
      const [v, r, c] = heap.shift()!;
      val = v;
      lastPopped = { val: v, r, c };
      popped.push({ val: v, r, c });

      steps.push({
        line: 5,
        explanation: `Pop #${i}: value=${v} at (${r},${c}). ${i === k ? `This is the ${k}th smallest!` : `Need ${k - i} more.`}`,
        variables: { iteration: i, value: v, row: r, col: c },
        visualization: makeViz(),
      });

      if (c + 1 < n) {
        heap.push([matrix[r][c + 1], r, c + 1]);
        heap.sort((a, b) => a[0] - b[0]);
        steps.push({
          line: 7,
          explanation: `Push next in row ${r}: value=${matrix[r][c + 1]} at (${r},${c + 1}). Heap: ${heap.map(h => `${h[0]}`).join(', ')}.`,
          variables: { pushed: matrix[r][c + 1], row: r, col: c + 1 },
          visualization: makeViz(),
        });
      }

      if (i === k) break;
    }

    steps.push({
      line: 9,
      explanation: `The ${k}th smallest element in the matrix is ${val}.`,
      variables: { k, answer: val },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let r = 0; r < n; r++) {
          for (let c = 0; c < n; c++) {
            const idx = cellIdx(r, c);
            l[idx] = String(matrix[r][c]);
            if (matrix[r][c] === val && lastPopped?.r === r && lastPopped?.c === c) h[idx] = 'found';
            else if (popped.find(p => p.r === r && p.c === c)) h[idx] = 'visited';
            else h[idx] = 'default';
          }
        }
        return {
          type: 'array' as const,
          array: flat.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: `${k}th smallest`, value: String(val) },
              { key: 'Elements popped', value: popped.map(p => p.val).join(', ') },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default kthSmallestSortedMatrix;
