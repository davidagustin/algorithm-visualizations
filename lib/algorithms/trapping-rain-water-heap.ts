import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const trappingRainWaterHeap: AlgorithmDefinition = {
  id: 'trapping-rain-water-heap',
  title: 'Trapping Rain Water II (2D Heap BFS)',
  leetcodeNumber: 407,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given a 2D elevation map, compute how much water can be trapped after raining. Use a BFS approach with a min heap: start from boundary cells, expand inward using the lowest boundary cell. Water trapped at each cell is max(0, minBoundary - height[r][c]).',
  tags: ['heap', 'BFS', 'matrix', 'two pointers'],

  code: {
    pseudocode: `function trapRainWater(heightMap):
  push all boundary cells to minHeap with their heights
  mark boundary as visited
  water = 0
  while heap not empty:
    h, r, c = pop min heap
    for each neighbor (nr, nc):
      if visited: continue
      mark visited
      water += max(0, h - heightMap[nr][nc])
      push (max(h, heightMap[nr][nc]), nr, nc) to heap
  return water`,

    python: `import heapq

def trapRainWater(heightMap: list[list[int]]) -> int:
    if not heightMap or len(heightMap) < 3 or len(heightMap[0]) < 3:
        return 0
    m, n = len(heightMap), len(heightMap[0])
    visited = [[False]*n for _ in range(m)]
    heap = []
    for r in range(m):
        for c in [0, n-1]:
            heapq.heappush(heap, (heightMap[r][c], r, c))
            visited[r][c] = True
    for c in range(n):
        for r in [0, m-1]:
            if not visited[r][c]:
                heapq.heappush(heap, (heightMap[r][c], r, c))
                visited[r][c] = True
    water = 0
    for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
        pass
    while heap:
        h, r, c = heapq.heappop(heap)
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<m and 0<=nc<n and not visited[nr][nc]:
                visited[nr][nc] = True
                water += max(0, h - heightMap[nr][nc])
                heapq.heappush(heap, (max(h, heightMap[nr][nc]), nr, nc))
    return water`,

    javascript: `function trapRainWater(heightMap) {
  const m = heightMap.length, n = heightMap[0].length;
  if (m < 3 || n < 3) return 0;
  const visited = Array.from({length:m},()=>new Array(n).fill(false));
  let heap = [];
  for (let r = 0; r < m; r++) {
    heap.push([heightMap[r][0], r, 0]); visited[r][0] = true;
    heap.push([heightMap[r][n-1], r, n-1]); visited[r][n-1] = true;
  }
  for (let c = 1; c < n-1; c++) {
    heap.push([heightMap[0][c], 0, c]); visited[0][c] = true;
    heap.push([heightMap[m-1][c], m-1, c]); visited[m-1][c] = true;
  }
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  let water = 0;
  while (heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [h, r, c] = heap.shift();
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<m&&nc>=0&&nc<n&&!visited[nr][nc]) {
        visited[nr][nc]=true;
        water+=Math.max(0,h-heightMap[nr][nc]);
        heap.push([Math.max(h,heightMap[nr][nc]),nr,nc]);
      }
    }
  }
  return water;
}`,

    java: `public int trapRainWater(int[][] heightMap) {
    int m = heightMap.length, n = heightMap[0].length;
    if (m < 3 || n < 3) return 0;
    boolean[][] visited = new boolean[m][n];
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b)->a[0]-b[0]);
    for (int r = 0; r < m; r++) {
        heap.offer(new int[]{heightMap[r][0],r,0}); visited[r][0]=true;
        heap.offer(new int[]{heightMap[r][n-1],r,n-1}); visited[r][n-1]=true;
    }
    for (int c = 1; c < n-1; c++) {
        heap.offer(new int[]{heightMap[0][c],0,c}); visited[0][c]=true;
        heap.offer(new int[]{heightMap[m-1][c],m-1,c}); visited[m-1][c]=true;
    }
    int water = 0;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!heap.isEmpty()) {
        int[] top = heap.poll();
        for (int[] d : dirs) {
            int nr=top[1]+d[0], nc=top[2]+d[1];
            if (nr>=0&&nr<m&&nc>=0&&nc<n&&!visited[nr][nc]) {
                visited[nr][nc]=true;
                water+=Math.max(0,top[0]-heightMap[nr][nc]);
                heap.offer(new int[]{Math.max(top[0],heightMap[nr][nc]),nr,nc});
            }
        }
    }
    return water;
}`,
  },

  defaultInput: {
    heightMap: [1, 4, 3, 1, 3, 2, 5, 6, 4, 1, 4, 5, 2, 1, 4, 2, 3, 1, 4, 1, 1, 1, 1, 1, 2],
    rows: 5,
    cols: 5,
  },

  inputFields: [
    {
      name: 'heightMap',
      label: 'Height Map (row by row)',
      type: 'array',
      defaultValue: [1, 4, 3, 1, 3, 2, 5, 6, 4, 1, 4, 5, 2, 1, 4, 2, 3, 1, 4, 1, 1, 1, 1, 1, 2],
      placeholder: '1,4,3,1,3,2,5,6,4,1,...',
      helperText: 'Height map values row by row',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of rows in the grid',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of columns in the grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.heightMap as number[];
    const m = input.rows as number;
    const n = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const heightMap: number[][] = [];
    for (let r = 0; r < m; r++) {
      heightMap.push(flat.slice(r * n, (r + 1) * n));
    }

    if (m < 3 || n < 3) {
      steps.push({
        line: 1,
        explanation: 'Grid is too small to trap any water. Need at least 3x3.',
        variables: { m, n, result: 0 },
        visualization: {
          type: 'array',
          array: flat,
          highlights: {},
          labels: {},
        } as ArrayVisualization,
      });
      return steps;
    }

    const visited: boolean[][] = Array.from({ length: m }, () => new Array(n).fill(false));
    let heap: [number, number, number][] = [];

    // Initialize boundary
    for (let r = 0; r < m; r++) {
      heap.push([heightMap[r][0], r, 0]); visited[r][0] = true;
      heap.push([heightMap[r][n - 1], r, n - 1]); visited[r][n - 1] = true;
    }
    for (let c = 1; c < n - 1; c++) {
      heap.push([heightMap[0][c], 0, c]); visited[0][c] = true;
      heap.push([heightMap[m - 1][c], m - 1, c]); visited[m - 1][c] = true;
    }
    heap.sort((a, b) => a[0] - b[0]);

    steps.push({
      line: 1,
      explanation: `Init: pushed ${heap.length} boundary cells to min heap. Smallest boundary height=${heap[0][0]} at (${heap[0][1]},${heap[0][2]}).`,
      variables: { m, n, boundaryCount: heap.length, minBoundary: heap[0][0] },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(
          Array.from({ length: m }, (_, r) => [r * n, 'active', (r + 1) * n - 1, 'active']).flat().map((v, i) => [i, v])
        ),
        labels: { 0: `min=${heap[0][0]}` },
      } as ArrayVisualization,
    });

    const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let water = 0;
    let iterations = 0;

    while (heap.length > 0) {
      heap.sort((a, b) => a[0] - b[0]);
      const [h, r, c] = heap.shift()!;
      iterations++;

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {
          visited[nr][nc] = true;
          const trapped = Math.max(0, h - heightMap[nr][nc]);
          water += trapped;
          heap.push([Math.max(h, heightMap[nr][nc]), nr, nc]);

          if (trapped > 0 || iterations <= 5) {
            steps.push({
              line: 8,
              explanation: `Expand from (${r},${c}) h=${h} to neighbor (${nr},${nc}) height=${heightMap[nr][nc]}. Trapped=${trapped}. Total water=${water}.`,
              variables: { from: `(${r},${c})`, to: `(${nr},${nc})`, trapped, totalWater: water, boundary: h },
              visualization: {
                type: 'array',
                array: flat,
                highlights: {
                  [r * n + c]: 'active',
                  [nr * n + nc]: trapped > 0 ? 'found' : 'comparing',
                },
                labels: {
                  [r * n + c]: `h=${h}`,
                  [nr * n + nc]: `trap=${trapped}`,
                },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `BFS complete after ${iterations} expansions. Total water trapped: ${water}`,
      variables: { result: water, iterations },
      visualization: {
        type: 'array',
        array: flat,
        highlights: {},
        labels: { 0: `water=${water}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default trappingRainWaterHeap;
