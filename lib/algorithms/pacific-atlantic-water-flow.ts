import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pacificAtlanticWaterFlow: AlgorithmDefinition = {
  id: 'pacific-atlantic-water-flow',
  title: 'Pacific Atlantic Water Flow',
  leetcodeNumber: 417,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an m x n matrix of heights, find all cells from which water can flow to both the Pacific ocean (top/left border) and the Atlantic ocean (bottom/right border). Water flows from high to equal or lower elevation. Use reverse BFS from each ocean border inward.',
  tags: ['Graph', 'BFS', 'DFS', 'Matrix'],
  code: {
    pseudocode: `function pacificAtlantic(heights):
  rows, cols = dimensions
  pacific = BFS from top/left borders
  atlantic = BFS from bottom/right borders
  result = cells in both pacific AND atlantic
  return result

function bfs(queue, visited, heights):
  while queue not empty:
    (r, c) = queue.dequeue()
    for each neighbor (nr, nc):
      if in bounds and not visited
         and heights[nr][nc] >= heights[r][c]:
        visited.add((nr, nc))
        queue.enqueue((nr, nc))`,
    python: `def pacificAtlantic(heights):
    rows, cols = len(heights), len(heights[0])
    pac, atl = set(), set()
    def bfs(starts, visited):
        queue = deque(starts)
        visited.update(starts)
        while queue:
            r, c = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = r+dr, c+dc
                if (0<=nr<rows and 0<=nc<cols
                    and (nr,nc) not in visited
                    and heights[nr][nc] >= heights[r][c]):
                    visited.add((nr, nc))
                    queue.append((nr, nc))
    bfs([(r,0) for r in range(rows)] + [(0,c) for c in range(cols)], pac)
    bfs([(r,cols-1) for r in range(rows)] + [(rows-1,c) for c in range(cols)], atl)
    return [[r,c] for r in range(rows) for c in range(cols) if (r,c) in pac and (r,c) in atl]`,
    javascript: `function pacificAtlantic(heights) {
  const rows = heights.length, cols = heights[0].length;
  const pac = new Set(), atl = new Set();
  function bfs(starts, visited) {
    const queue = [...starts];
    starts.forEach(([r,c]) => visited.add(r*cols+c));
    while (queue.length) {
      const [r, c] = queue.shift();
      for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr=r+dr, nc=c+dc, key=nr*cols+nc;
        if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&!visited.has(key)&&heights[nr][nc]>=heights[r][c]) {
          visited.add(key); queue.push([nr,nc]);
        }
      }
    }
  }
  const pacStarts=[...Array(rows).keys()].map(r=>[r,0]).concat([...Array(cols).keys()].map(c=>[0,c]));
  const atlStarts=[...Array(rows).keys()].map(r=>[r,cols-1]).concat([...Array(cols).keys()].map(c=>[rows-1,c]));
  bfs(pacStarts, pac); bfs(atlStarts, atl);
  const res=[];
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++) if(pac.has(r*cols+c)&&atl.has(r*cols+c)) res.push([r,c]);
  return res;
}`,
    java: `public List<List<Integer>> pacificAtlantic(int[][] heights) {
    int rows = heights.length, cols = heights[0].length;
    boolean[][] pac = new boolean[rows][cols], atl = new boolean[rows][cols];
    Queue<int[]> pq = new LinkedList<>(), aq = new LinkedList<>();
    for (int r = 0; r < rows; r++) { pq.add(new int[]{r,0}); pac[r][0]=true; aq.add(new int[]{r,cols-1}); atl[r][cols-1]=true; }
    for (int c = 0; c < cols; c++) { pq.add(new int[]{0,c}); pac[0][c]=true; aq.add(new int[]{rows-1,c}); atl[rows-1][c]=true; }
    bfs(pq, pac, heights); bfs(aq, atl, heights);
    List<List<Integer>> res = new ArrayList<>();
    for (int r=0;r<rows;r++) for (int c=0;c<cols;c++) if(pac[r][c]&&atl[r][c]) res.add(Arrays.asList(r,c));
    return res;
}
void bfs(Queue<int[]> q, boolean[][] vis, int[][] h) {
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){int[]cur=q.poll();for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];if(nr>=0&&nr<h.length&&nc>=0&&nc<h[0].length&&!vis[nr][nc]&&h[nr][nc]>=h[cur[0]][cur[1]]){vis[nr][nc]=true;q.add(new int[]{nr,nc});}}}
}`,
  },
  defaultInput: {
    heights: [
      [1, 2, 2, 3, 5],
      [3, 2, 3, 4, 4],
      [2, 4, 5, 3, 1],
      [6, 7, 1, 4, 5],
      [5, 1, 1, 2, 4],
    ],
  },
  inputFields: [
    {
      name: 'heights',
      label: 'Height Matrix',
      type: 'array',
      defaultValue: [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ],
      placeholder: '[[1,2,2,3,5],[3,2,3,4,4]]',
      helperText: '2D grid of non-negative heights',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = input.heights as number[][];
    const rows = heights.length;
    const cols = heights[0].length;
    const steps: AlgorithmStep[] = [];

    const pacVisited = new Set<number>();
    const atlVisited = new Set<number>();
    const idx = (r: number, c: number) => r * cols + c;
    const flat = heights.flat();

    function makeViz(
      highlights: Record<number, string>,
      phase: string,
      resultCount: number
    ): ArrayVisualization {
      const base: Record<number, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(r, c);
          const inPac = pacVisited.has(i);
          const inAtl = atlVisited.has(i);
          if (inPac && inAtl) base[i] = 'found';
          else if (inPac) base[i] = 'active';
          else if (inAtl) base[i] = 'pointer';
        }
      }
      return {
        type: 'array',
        array: flat,
        highlights: { ...base, ...highlights },
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => [i, String(flat[i])])
        ),
        auxData: {
          label: 'Water Flow State',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Pacific reachable', value: String(pacVisited.size) },
            { key: 'Atlantic reachable', value: String(atlVisited.size) },
            { key: 'Both oceans', value: String(resultCount) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Grid is ${rows}x${cols}. BFS from Pacific borders (top/left) inward, then from Atlantic borders (bottom/right) inward. Cells reachable from both = answer.`,
      variables: { rows, cols },
      visualization: makeViz({}, 'Init', 0),
    });

    // BFS helper
    function bfs(starts: [number, number][], visited: Set<number>, label: string) {
      const queue: [number, number][] = [];
      for (const [r, c] of starts) {
        const i = idx(r, c);
        if (!visited.has(i)) {
          visited.add(i);
          queue.push([r, c]);
        }
      }

      steps.push({
        line: 8,
        explanation: `${label} BFS: seed border cells (${starts.length} cells). Blue=Pacific, Purple=Atlantic, Green=Both.`,
        variables: { queueSize: queue.length },
        visualization: makeViz({}, label + ' BFS seeding', 0),
      });

      while (queue.length > 0) {
        const [r, c] = queue.shift()!;
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          const ni = idx(nr, nc);
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited.has(ni) && heights[nr][nc] >= heights[r][c]) {
            visited.add(ni);
            queue.push([nr, nc]);

            steps.push({
              line: 12,
              explanation: `${label} BFS: (${nr},${nc}) height=${heights[nr][nc]} >= (${r},${c}) height=${heights[r][c]}. Water can flow back. Mark reachable.`,
              variables: { r, c, nr, nc },
              visualization: makeViz({ [idx(r, c)]: 'current', [ni]: 'swapping' }, label + ' expanding', 0),
            });
          }
        }
      }
    }

    const pacStarts: [number, number][] = [];
    for (let r = 0; r < rows; r++) pacStarts.push([r, 0]);
    for (let c = 1; c < cols; c++) pacStarts.push([0, c]);

    const atlStarts: [number, number][] = [];
    for (let r = 0; r < rows; r++) atlStarts.push([r, cols - 1]);
    for (let c = 0; c < cols - 1; c++) atlStarts.push([rows - 1, c]);

    bfs(pacStarts, pacVisited, 'Pacific');
    bfs(atlStarts, atlVisited, 'Atlantic');

    const result: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = idx(r, c);
        if (pacVisited.has(i) && atlVisited.has(i)) result.push([r, c]);
      }
    }

    steps.push({
      line: 5,
      explanation: `Intersection complete. ${result.length} cells can flow to both oceans: ${result.map(([r, c]) => `(${r},${c})`).join(', ')}.`,
      variables: { result },
      visualization: makeViz({}, 'Complete', result.length),
    });

    return steps;
  },
};

export default pacificAtlanticWaterFlow;
