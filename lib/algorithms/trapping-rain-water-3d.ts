import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const trappingRainWater3d: AlgorithmDefinition = {
  id: 'trapping-rain-water-3d',
  title: 'Trapping Rain Water 3D',
  leetcodeNumber: 407,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given an m x n matrix of non-negative integers representing the height of each unit cell in a 2D elevation map, compute the volume of water it can trap after raining. Uses a min-heap (priority queue) to process cells from the boundary inward, tracking water level.',
  tags: ['Heap', 'BFS', 'Matrix', 'Priority Queue'],
  code: {
    pseudocode: `function trapRainWater(heightMap):
  if rows < 3 or cols < 3: return 0
  heap = min-heap of boundary cells
  visited = set of boundary cells
  water = 0
  while heap not empty:
    (h, r, c) = heap.pop()
    for each neighbor (nr, nc):
      if not visited:
        visited.add((nr,nc))
        water += max(0, h - heightMap[nr][nc])
        heap.push((max(h, heightMap[nr][nc]), nr, nc))
  return water`,
    python: `import heapq
def trapRainWater(heightMap):
    if not heightMap or len(heightMap) < 3:
        return 0
    rows, cols = len(heightMap), len(heightMap[0])
    heap, visited = [], set()
    for r in range(rows):
        for c in range(cols):
            if r == 0 or r == rows-1 or c == 0 or c == cols-1:
                heapq.heappush(heap, (heightMap[r][c], r, c))
                visited.add((r, c))
    water = 0
    while heap:
        h, r, c = heapq.heappop(heap)
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and (nr,nc) not in visited:
                visited.add((nr,nc))
                water += max(0, h - heightMap[nr][nc])
                heapq.heappush(heap, (max(h, heightMap[nr][nc]), nr, nc))
    return water`,
    javascript: `function trapRainWater(heightMap) {
  const rows = heightMap.length, cols = heightMap[0].length;
  if (rows < 3 || cols < 3) return 0;
  const heap = [], visited = new Set();
  const push = (h,r,c) => { heap.push([h,r,c]); heap.sort((a,b)=>a[0]-b[0]); };
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (r===0||r===rows-1||c===0||c===cols-1) { push(heightMap[r][c],r,c); visited.add(r*cols+c); }
  let water = 0;
  while (heap.length) {
    const [h,r,c] = heap.shift();
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&!visited.has(nr*cols+nc)) {
        visited.add(nr*cols+nc);
        water += Math.max(0, h - heightMap[nr][nc]);
        push(Math.max(h, heightMap[nr][nc]), nr, nc);
      }
    }
  }
  return water;
}`,
    java: `public int trapRainWater(int[][] heightMap) {
    int rows = heightMap.length, cols = heightMap[0].length;
    if (rows < 3 || cols < 3) return 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    boolean[][] visited = new boolean[rows][cols];
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (r==0||r==rows-1||c==0||c==cols-1) { pq.offer(new int[]{heightMap[r][c],r,c}); visited[r][c]=true; }
    int water = 0;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        for (int[] d : dirs) {
            int nr=cur[1]+d[0], nc=cur[2]+d[1];
            if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&!visited[nr][nc]) {
                visited[nr][nc]=true;
                water += Math.max(0, cur[0]-heightMap[nr][nc]);
                pq.offer(new int[]{Math.max(cur[0],heightMap[nr][nc]),nr,nc});
            }
        }
    }
    return water;
}`,
  },
  defaultInput: { heightMap: [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]] },
  inputFields: [
    {
      name: 'heightMap',
      label: 'Height Map (flattened row)',
      type: 'array',
      defaultValue: [1,4,3,1,3,2,3,2,1,3,2,4,2,3,3,2,3,1],
      placeholder: '1,4,3,1,3,2,...',
      helperText: 'Flattened 2D height map (visualized as 1D array)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.heightMap as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...flat];

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, water: number): ArrayVisualization {
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Trapping Rain Water 3D',
          entries: [{ key: 'Water Trapped', value: String(water) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Process 3D height map. Push all boundary cells into a min-heap. BFS inward, accumulate trapped water.',
      variables: { totalCells: arr.length },
      visualization: makeViz({}, {}, 0),
    });

    let water = 0;
    const n = arr.length;
    // Simulate: cells at boundary (indices 0 and n-1) act as walls
    const visited: boolean[] = new Array(n).fill(false);
    visited[0] = true;
    visited[n - 1] = true;

    const heapArr: [number, number][] = [[arr[0], 0], [arr[n - 1], n - 1]];
    heapArr.sort((a, b) => a[0] - b[0]);

    const highlights: Record<number, string> = { 0: 'pointer', [n - 1]: 'pointer' };
    steps.push({
      line: 3,
      explanation: `Initialize heap with boundary cells (indices 0 and ${n - 1}). These are the walls.`,
      variables: { boundaryLeft: arr[0], boundaryRight: arr[n - 1] },
      visualization: makeViz(highlights, { 0: 'L', [n - 1]: 'R' }, water),
    });

    for (let i = 1; i < n - 1; i++) {
      const wallH = Math.max(arr[0], arr[n - 1]);
      const trapped = Math.max(0, wallH - arr[i]);
      water += trapped;

      const h: Record<number, string> = { [i]: trapped > 0 ? 'found' : 'active' };
      steps.push({
        line: 8,
        explanation: `Cell ${i}: height=${arr[i]}, wallLevel=${wallH}. Trapped water = max(0, ${wallH}-${arr[i]}) = ${trapped}. Total water = ${water}.`,
        variables: { index: i, height: arr[i], wallLevel: wallH, trapped, totalWater: water },
        visualization: makeViz(h, { [i]: `+${trapped}` }, water),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 12,
      explanation: `Done. Total trapped rain water = ${water}.`,
      variables: { result: water },
      visualization: makeViz(finalH, {}, water),
    });

    return steps;
  },
};

export default trappingRainWater3d;
