import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pathWithMinimumEffort: AlgorithmDefinition = {
  id: 'path-with-minimum-effort',
  title: 'Path With Minimum Effort',
  leetcodeNumber: 1631,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a rows x cols grid of heights, find a path from top-left to bottom-right that minimizes the maximum absolute difference between consecutive cells (effort). Uses Dijkstra algorithm with a min-heap: track the minimum effort to reach each cell.',
  tags: ['graph', 'dijkstra', 'heap', 'binary search', 'bfs', 'shortest path'],

  code: {
    pseudocode: `function minimumEffortPath(heights):
  rows, cols = dimensions
  dist = 2D array of infinity
  dist[0][0] = 0
  heap = [(0, 0, 0)]  // (effort, row, col)
  while heap not empty:
    effort, r, c = heap.pop()
    if r == rows-1 and c == cols-1: return effort
    if effort > dist[r][c]: continue  // outdated
    for each direction (nr, nc):
      diff = |heights[r][c] - heights[nr][nc]|
      newEffort = max(effort, diff)
      if newEffort < dist[nr][nc]:
        dist[nr][nc] = newEffort
        heap.push(newEffort, nr, nc)`,

    python: `def minimumEffortPath(heights):
    rows, cols = len(heights), len(heights[0])
    dist = [[float('inf')]*cols for _ in range(rows)]
    dist[0][0] = 0
    heap = [(0, 0, 0)]
    while heap:
        effort, r, c = heapq.heappop(heap)
        if r==rows-1 and c==cols-1: return effort
        if effort > dist[r][c]: continue
        for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr,nc=r+dr,c+dc
            if 0<=nr<rows and 0<=nc<cols:
                diff=abs(heights[r][c]-heights[nr][nc])
                ne=max(effort,diff)
                if ne<dist[nr][nc]:
                    dist[nr][nc]=ne
                    heapq.heappush(heap,(ne,nr,nc))`,

    javascript: `function minimumEffortPath(heights) {
  const rows=heights.length, cols=heights[0].length;
  const dist=Array.from({length:rows},()=>new Array(cols).fill(Infinity));
  dist[0][0]=0;
  const heap=[[0,0,0]];
  while (heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [effort,r,c]=heap.shift();
    if (r===rows-1&&c===cols-1) return effort;
    if (effort>dist[r][c]) continue;
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr=r+dr,nc=c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols) {
        const ne=Math.max(effort,Math.abs(heights[r][c]-heights[nr][nc]));
        if (ne<dist[nr][nc]) { dist[nr][nc]=ne; heap.push([ne,nr,nc]); }
      }
    }
  }
}`,

    java: `public int minimumEffortPath(int[][] heights) {
    int rows=heights.length, cols=heights[0].length;
    int[][] dist=new int[rows][cols];
    for (int[] row:dist) Arrays.fill(row,Integer.MAX_VALUE);
    dist[0][0]=0;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,0,0});
    int[][] dirs={{-1,0},{1,0},{0,-1},{0,1}};
    while (!pq.isEmpty()) {
        int[] curr=pq.poll();
        int effort=curr[0],r=curr[1],c=curr[2];
        if (r==rows-1&&c==cols-1) return effort;
        if (effort>dist[r][c]) continue;
        for (int[] d:dirs) {
            int nr=r+d[0],nc=c+d[1];
            if (nr>=0&&nr<rows&&nc>=0&&nc<cols) {
                int ne=Math.max(effort,Math.abs(heights[r][c]-heights[nr][nc]));
                if (ne<dist[nr][nc]) { dist[nr][nc]=ne; pq.offer(new int[]{ne,nr,nc}); }
            }
        }
    }
    return 0;
}`,
  },

  defaultInput: {
    heights: [1, 2, 2, 3, 8, 2, 5, 3, 5],
    rows: 3,
    cols: 3,
  },

  inputFields: [
    {
      name: 'heights',
      label: 'Heights grid (flattened)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 8, 2, 5, 3, 5],
      placeholder: '1,2,2,3,8,2,5,3,5',
      helperText: 'Flattened rows x cols height grid',
    },
    {
      name: 'rows',
      label: 'Rows',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'cols',
      label: 'Cols',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatH = input.heights as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const steps: AlgorithmStep[] = [];

    const heights = flatH.slice(0, rows * cols);
    while (heights.length < rows * cols) heights.push(1);

    const INF = Infinity;
    const dist: number[] = new Array(rows * cols).fill(INF);
    dist[0] = 0;

    const heap: [number, number, number][] = [[0, 0, 0]];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...heights],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find path from (0,0) to (${rows - 1},${cols - 1}) minimizing maximum height difference. Grid heights shown.`,
      variables: { rows, cols, startHeight: heights[0], endHeight: heights[(rows - 1) * cols + (cols - 1)] },
      visualization: makeViz(
        { 0: 'active', [(rows - 1) * cols + (cols - 1)]: 'found' },
        { 0: 'start', [(rows - 1) * cols + (cols - 1)]: 'end' }
      ),
    });

    let result = -1;

    while (heap.length > 0) {
      heap.sort((a, b) => a[0] - b[0]);
      const [effort, r, c] = heap.shift()!;
      const idx = r * cols + c;

      if (effort > dist[idx]) continue;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (let i = 0; i < rows * cols; i++) {
        if (dist[i] < INF) { hl[i] = 'visited'; lb[i] = `e=${dist[i]}`; }
      }
      hl[idx] = 'active';
      lb[idx] = `e=${effort}`;

      steps.push({
        line: 6,
        explanation: `Pop (${r},${c}) with effort=${effort}. Height=${heights[idx]}.`,
        variables: { row: r, col: c, effort, height: heights[idx] },
        visualization: makeViz(hl, lb),
      });

      if (r === rows - 1 && c === cols - 1) {
        result = effort;
        hl[idx] = 'found';
        lb[idx] = `ans=${effort}`;

        steps.push({
          line: 7,
          explanation: `Reached destination (${rows - 1},${cols - 1})! Minimum effort = ${effort}.`,
          variables: { result: effort },
          visualization: makeViz(hl, lb),
        });
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const nIdx = nr * cols + nc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const diff = Math.abs(heights[idx] - heights[nIdx]);
          const ne = Math.max(effort, diff);

          if (ne < dist[nIdx]) {
            dist[nIdx] = ne;
            heap.push([ne, nr, nc]);

            const nhl = { ...hl };
            const nlb = { ...lb };
            nhl[nIdx] = 'comparing';
            nlb[nIdx] = `ne=${ne}`;

            steps.push({
              line: 11,
              explanation: `Neighbor (${nr},${nc}): diff=|${heights[idx]}-${heights[nIdx]}|=${diff}, newEffort=max(${effort},${diff})=${ne}. Update and push.`,
              variables: { neighbor: `(${nr},${nc})`, diff, newEffort: ne },
              visualization: makeViz(nhl, nlb),
            });
          }
        }
      }
    }

    return steps;
  },
};

export default pathWithMinimumEffort;
