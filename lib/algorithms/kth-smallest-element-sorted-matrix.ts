import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthSmallestElementSortedMatrix: AlgorithmDefinition = {
  id: 'kth-smallest-element-sorted-matrix',
  title: 'Kth Smallest Element in a Sorted Matrix',
  leetcodeNumber: 378,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given an n x n matrix where each row and column is sorted in ascending order, find the kth smallest element. Use a min heap that starts with the first column of the first row and expands right and down, popping k times.',
  tags: ['heap', 'binary search', 'matrix', 'sorted'],

  code: {
    pseudocode: `function kthSmallest(matrix, k):
  n = matrix.length
  minHeap = [(matrix[0][0], 0, 0)]
  visited = set with (0, 0)
  for i in 1..k:
    val, r, c = pop minHeap
    if i == k: return val
    if r+1 < n and (r+1,c) not visited:
      push (matrix[r+1][c], r+1, c)
      mark visited
    if c+1 < n and (r,c+1) not visited:
      push (matrix[r][c+1], r, c+1)
      mark visited
  return -1`,

    python: `import heapq

def kthSmallest(matrix: list[list[int]], k: int) -> int:
    n = len(matrix)
    heap = [(matrix[0][0], 0, 0)]
    visited = {(0, 0)}
    val = 0
    for _ in range(k):
        val, r, c = heapq.heappop(heap)
        if r + 1 < n and (r+1, c) not in visited:
            heapq.heappush(heap, (matrix[r+1][c], r+1, c))
            visited.add((r+1, c))
        if c + 1 < n and (r, c+1) not in visited:
            heapq.heappush(heap, (matrix[r][c+1], r, c+1))
            visited.add((r, c+1))
    return val`,

    javascript: `function kthSmallest(matrix, k) {
  const n = matrix.length;
  // Simulate min heap with sorted array
  let heap = [[matrix[0][0], 0, 0]];
  const visited = new Set(['0,0']);
  let val = 0;
  for (let i = 0; i < k; i++) {
    heap.sort((a, b) => a[0] - b[0]);
    const [v, r, c] = heap.shift();
    val = v;
    if (r + 1 < n && !visited.has((r+1)+','+c)) {
      heap.push([matrix[r+1][c], r+1, c]);
      visited.add((r+1)+','+c);
    }
    if (c + 1 < n && !visited.has(r+','+(c+1))) {
      heap.push([matrix[r][c+1], r, c+1]);
      visited.add(r+','+(c+1));
    }
  }
  return val;
}`,

    java: `public int kthSmallest(int[][] matrix, int k) {
    int n = matrix.length;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b) -> a[0]-b[0]);
    heap.offer(new int[]{matrix[0][0], 0, 0});
    boolean[][] visited = new boolean[n][n];
    visited[0][0] = true;
    int val = 0;
    for (int i = 0; i < k; i++) {
        int[] top = heap.poll();
        val = top[0]; int r = top[1], c = top[2];
        if (r+1 < n && !visited[r+1][c]) {
            heap.offer(new int[]{matrix[r+1][c], r+1, c});
            visited[r+1][c] = true;
        }
        if (c+1 < n && !visited[r][c+1]) {
            heap.offer(new int[]{matrix[r][c+1], r, c+1});
            visited[r][c+1] = true;
        }
    }
    return val;
}`,
  },

  defaultInput: {
    matrix: [1, 5, 9, 10, 11, 13, 12, 13, 15],
    k: 8,
    n: 3,
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (row by row)',
      type: 'array',
      defaultValue: [1, 5, 9, 10, 11, 13, 12, 13, 15],
      placeholder: '1,5,9,10,11,13,12,13,15',
      helperText: 'n x n matrix values row by row',
    },
    {
      name: 'n',
      label: 'Matrix Size (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Dimension of matrix (n x n)',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Find the kth smallest element',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.matrix as number[];
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    // Build 2D matrix
    const matrix: number[][] = [];
    for (let i = 0; i < n; i++) {
      matrix.push(flat.slice(i * n, (i + 1) * n));
    }

    let heap: [number, number, number][] = [[matrix[0][0], 0, 0]];
    const visited = new Set<string>(['0,0']);

    steps.push({
      line: 2,
      explanation: `Initialize min heap with matrix[0][0] = ${matrix[0][0]}. Finding the ${k}th smallest element.`,
      variables: { k, heapTop: matrix[0][0], heapSize: 1 },
      visualization: {
        type: 'array',
        array: flat,
        highlights: { 0: 'active' },
        labels: { 0: `(0,0)=${matrix[0][0]}` },
      } as ArrayVisualization,
    });

    let val = 0;

    for (let iter = 0; iter < k; iter++) {
      heap.sort((a, b) => a[0] - b[0]);
      const [v, r, c] = heap.shift()!;
      val = v;
      const flatIdx = r * n + c;

      steps.push({
        line: 5,
        explanation: `Pop ${iter + 1}th smallest: ${v} at (${r},${c}). ${iter + 1 === k ? `This is the answer!` : `Continue...`}`,
        variables: { iteration: iter + 1, value: v, row: r, col: c, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: flat,
          highlights: {
            [flatIdx]: iter + 1 === k ? 'found' : 'active',
            ...Object.fromEntries(heap.map(([hv, hr, hc]) => [hr * n + hc, 'comparing'])),
          },
          labels: {
            [flatIdx]: `pop#${iter + 1}`,
            ...Object.fromEntries(heap.map(([hv, hr, hc]) => [hr * n + hc, `h:${hv}`])),
          },
        } as ArrayVisualization,
      });

      if (iter + 1 === k) break;

      if (r + 1 < n && !visited.has(`${r + 1},${c}`)) {
        heap.push([matrix[r + 1][c], r + 1, c]);
        visited.add(`${r + 1},${c}`);
      }
      if (c + 1 < n && !visited.has(`${r},${c + 1}`)) {
        heap.push([matrix[r][c + 1], r, c + 1]);
        visited.add(`${r},${c + 1}`);
      }
    }

    steps.push({
      line: 13,
      explanation: `The ${k}th smallest element in the matrix is ${val}.`,
      variables: { k, result: val },
      visualization: {
        type: 'array',
        array: flat,
        highlights: {},
        labels: { 0: `ans=${val}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default kthSmallestElementSortedMatrix;
