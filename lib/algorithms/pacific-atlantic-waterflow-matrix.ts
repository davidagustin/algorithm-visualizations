import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pacificAtlanticWaterflowMatrix: AlgorithmDefinition = {
  id: 'pacific-atlantic-waterflow-matrix',
  title: 'Pacific Atlantic Water Flow',
  leetcodeNumber: 417,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find all cells in an m x n matrix from which water can flow to both the Pacific ocean (top/left border) and Atlantic ocean (bottom/right border). BFS/DFS from each border inward, marking reachable cells, then return the intersection.',
  tags: ['Matrix', 'BFS', 'DFS', 'Graph'],
  code: {
    pseudocode: `function pacificAtlantic(heights):
  bfs from Pacific border cells → pacific set
  bfs from Atlantic border cells → atlantic set
  return cells in both sets

function bfs(starts):
  queue = starts
  while queue not empty:
    (r,c) = dequeue
    for each neighbor (nr,nc):
      if not visited and heights[nr][nc] >= heights[r][c]:
        enqueue(nr,nc)`,
    python: `def pacificAtlantic(heights):
    m, n = len(heights), len(heights[0])
    def bfs(starts):
        q = deque(starts)
        vis = set(starts)
        while q:
            r,c = q.popleft()
            for dr,dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr,nc = r+dr,c+dc
                if 0<=nr<m and 0<=nc<n and (nr,nc) not in vis and heights[nr][nc]>=heights[r][c]:
                    vis.add((nr,nc)); q.append((nr,nc))
        return vis
    pac = bfs([(0,j) for j in range(n)]+[(i,0) for i in range(m)])
    atl = bfs([(m-1,j) for j in range(n)]+[(i,n-1) for i in range(m)])
    return [[r,c] for r,c in pac & atl]`,
    javascript: `function pacificAtlantic(heights) {
  const m=heights.length, n=heights[0].length;
  function bfs(starts) {
    const vis=new Set(starts.map(([r,c])=>r*n+c));
    const q=[...starts];
    while (q.length) {
      const [r,c]=q.shift();
      for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr=r+dr,nc=c+dc,k=nr*n+nc;
        if(nr>=0&&nr<m&&nc>=0&&nc<n&&!vis.has(k)&&heights[nr][nc]>=heights[r][c])
          { vis.add(k); q.push([nr,nc]); }
      }
    }
    return vis;
  }
  const pac=bfs([...Array.from({length:n},(_,j)=>[0,j]),...Array.from({length:m},(_,i)=>[i,0])]);
  const atl=bfs([...Array.from({length:n},(_,j)=>[m-1,j]),...Array.from({length:m},(_,i)=>[i,n-1])]);
  return [...pac].filter(k=>atl.has(k)).map(k=>[Math.floor(k/n),k%n]);
}`,
    java: `public List<List<Integer>> pacificAtlantic(int[][] h) {
    int m=h.length,n=h[0].length;
    boolean[][] pac=new boolean[m][n], atl=new boolean[m][n];
    Queue<int[]> q=new LinkedList<>();
    for(int j=0;j<n;j++){q.add(new int[]{0,j});pac[0][j]=true;}
    for(int i=1;i<m;i++){q.add(new int[]{i,0});pac[i][0]=true;}
    bfs(h,pac,q,m,n);
    q.clear();
    for(int j=0;j<n;j++){q.add(new int[]{m-1,j});atl[m-1][j]=true;}
    for(int i=0;i<m-1;i++){q.add(new int[]{i,n-1});atl[i][n-1]=true;}
    bfs(h,atl,q,m,n);
    List<List<Integer>> res=new ArrayList<>();
    for(int i=0;i<m;i++) for(int j=0;j<n;j++) if(pac[i][j]&&atl[i][j]) res.add(Arrays.asList(i,j));
    return res;
}`,
  },
  defaultInput: { matrix: [[1, 2, 2, 3, 5], [3, 2, 3, 4, 4], [2, 4, 5, 3, 1], [6, 7, 1, 4, 5], [5, 1, 1, 2, 4]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Heights Matrix',
      type: 'string',
      defaultValue: '1 2 2 3 5, 3 2 3 4 4, 2 4 5 3 1, 6 7 1 4 5, 5 1 1 2 4',
      placeholder: 'e.g. 1 2 2 3 5, 3 2 3 4 4',
      helperText: 'Rows by commas, values by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let heights: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      heights = input.matrix as number[][];
    } else {
      heights = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = heights.length, n = heights[0].length;
    const steps: AlgorithmStep[] = [];
    const pacVis = new Set<number>();
    const atlVis = new Set<number>();

    function makeViz(phase: 'pac' | 'atl' | 'both', curr: number): ArrayVisualization {
      const flat = heights.flat();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${flat[i]}`;
        const inP = pacVis.has(i), inA = atlVis.has(i);
        highlights[i] = (inP && inA) ? 'found' : inP ? 'active' : inA ? 'sorted' : 'default';
      }
      if (curr >= 0) highlights[curr] = 'comparing';
      const pacCount = pacVis.size, atlCount = atlVis.size;
      let both = 0;
      for (const k of pacVis) if (atlVis.has(k)) both++;
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Pacific Atlantic', entries: [{ key: 'Phase', value: phase === 'both' ? 'Intersection' : phase === 'pac' ? 'Pacific BFS' : 'Atlantic BFS' }, { key: 'Pac/Atl/Both', value: `${pacCount}/${atlCount}/${both}` }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find cells reachable from both oceans. BFS from Pacific borders (top/left) and Atlantic borders (bottom/right).`,
      variables: { m, n },
      visualization: makeViz('pac', -1),
    });

    // BFS helper
    function bfs(starts: number[], vis: Set<number>, label: 'pac' | 'atl') {
      const queue = [...starts];
      for (const s of starts) vis.add(s);
      while (queue.length) {
        const curr = queue.shift()!;
        const r = Math.floor(curr / n), c = curr % n;
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc, nk = nr * n + nc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && !vis.has(nk) && heights[nr][nc] >= heights[r][c]) {
            vis.add(nk);
            queue.push(nk);
            steps.push({
              line: 9,
              explanation: `${label === 'pac' ? 'Pacific' : 'Atlantic'} BFS: visit (${nr},${nc}) height=${heights[nr][nc]} from (${r},${c}) height=${heights[r][c]}.`,
              variables: { r, c, nr, nc, height: heights[nr][nc] },
              visualization: makeViz(label, nk),
            });
          }
        }
      }
    }

    const pacStarts: number[] = [];
    for (let j = 0; j < n; j++) pacStarts.push(0 * n + j);
    for (let i = 1; i < m; i++) pacStarts.push(i * n + 0);
    bfs(pacStarts, pacVis, 'pac');

    const atlStarts: number[] = [];
    for (let j = 0; j < n; j++) atlStarts.push((m - 1) * n + j);
    for (let i = 0; i < m - 1; i++) atlStarts.push(i * n + (n - 1));
    bfs(atlStarts, atlVis, 'atl');

    const result: number[] = [];
    for (const k of pacVis) if (atlVis.has(k)) result.push(k);

    steps.push({
      line: 4,
      explanation: `Intersection: ${result.length} cells can flow to both oceans. Blue=Pacific, Purple=Atlantic, Green=Both.`,
      variables: { count: result.length, cells: result.map(k => `(${Math.floor(k / n)},${k % n})`).join(', ') },
      visualization: makeViz('both', -1),
    });

    return steps;
  },
};

export default pacificAtlanticWaterflowMatrix;
