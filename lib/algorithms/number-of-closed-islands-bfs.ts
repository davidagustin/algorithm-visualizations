import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfClosedIslandsBfs: AlgorithmDefinition = {
  id: 'number-of-closed-islands-bfs',
  title: 'Number of Closed Islands (BFS)',
  leetcodeNumber: 1254,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary grid where 0 is land and 1 is water, count the number of closed islands. A closed island is a group of 0 cells completely surrounded by 1 cells (not touching the border). BFS from each unvisited 0 cell, track if it reaches the border; if not, it is a closed island.',
  tags: ['bfs', 'graph', 'grid', 'island counting'],

  code: {
    pseudocode: `function closedIsland(grid):
  m, n = dimensions
  count = 0
  for r in range(m):
    for c in range(n):
      if grid[r][c] == 0:
        isClosed, cells = BFS(r, c)
        if isClosed: count += 1
        mark all visited cells
  return count

BFS(r, c):
  queue = [(r, c)], mark visited
  touchesBorder = false
  while queue:
    r, c = dequeue
    if border: touchesBorder = true
    for each neighbor 0-cell: enqueue, mark visited
  return not touchesBorder`,

    python: `from collections import deque

def closedIsland(grid):
    m, n = len(grid), len(grid[0])
    visited = [[False]*n for _ in range(m)]
    count = 0

    def bfs(r, c):
        queue = deque([(r, c)])
        visited[r][c] = True
        is_closed = True
        dirs = [(0,1),(0,-1),(1,0),(-1,0)]
        while queue:
            cr, cc = queue.popleft()
            if cr == 0 or cr == m-1 or cc == 0 or cc == n-1:
                is_closed = False
            for dr, dc in dirs:
                nr, nc = cr+dr, cc+dc
                if 0<=nr<m and 0<=nc<n and not visited[nr][nc] and grid[nr][nc]==0:
                    visited[nr][nc] = True
                    queue.append((nr, nc))
        return is_closed

    for r in range(m):
        for c in range(n):
            if grid[r][c] == 0 and not visited[r][c]:
                if bfs(r, c): count += 1
    return count`,

    javascript: `function closedIsland(grid) {
  const m = grid.length, n = grid[0].length;
  const visited = Array.from({length:m}, ()=>Array(n).fill(false));
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let count = 0;
  function bfs(r, c) {
    const queue = [[r, c]]; visited[r][c] = true; let isClosed = true;
    let head = 0;
    while (head < queue.length) {
      const [cr, cc] = queue[head++];
      if (cr===0||cr===m-1||cc===0||cc===n-1) isClosed=false;
      for (const [dr, dc] of dirs) {
        const nr=cr+dr, nc=cc+dc;
        if(nr>=0&&nr<m&&nc>=0&&nc<n&&!visited[nr][nc]&&grid[nr][nc]===0){
          visited[nr][nc]=true; queue.push([nr,nc]);
        }
      }
    }
    return isClosed;
  }
  for (let r=0;r<m;r++) for (let c=0;c<n;c++)
    if (grid[r][c]===0&&!visited[r][c]) if (bfs(r,c)) count++;
  return count;
}`,

    java: `public int closedIsland(int[][] grid) {
    int m=grid.length, n=grid[0].length;
    boolean[][] visited=new boolean[m][n];
    int count=0;
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    for(int r=0;r<m;r++) for(int c=0;c<n;c++) {
        if(grid[r][c]==0&&!visited[r][c]){
            Queue<int[]>q=new LinkedList<>(); q.offer(new int[]{r,c}); visited[r][c]=true;
            boolean closed=true;
            while(!q.isEmpty()){int[]cur=q.poll();int cr=cur[0],cc=cur[1];
                if(cr==0||cr==m-1||cc==0||cc==n-1) closed=false;
                for(int[]d:dirs){int nr=cr+d[0],nc=cc+d[1];
                    if(nr>=0&&nr<m&&nc>=0&&nc<n&&!visited[nr][nc]&&grid[nr][nc]==0){visited[nr][nc]=true;q.offer(new int[]{nr,nc});}
                }
            }
            if(closed) count++;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    grid: [[1,1,1,1,1,1,1,0],[1,0,0,0,0,1,1,0],[1,0,1,0,1,1,1,0],[1,0,0,0,0,1,0,1],[1,1,1,1,1,1,1,0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [1,1,1,1,1,1,1,0,1,0,0,0,0,1,1,0,1,0,1,0,1,1,1,0,1,0,0,0,0,1,0,1,1,1,1,1,1,1,1,0],
      placeholder: '1,1,1,1,...',
      helperText: '0=land, 1=water. Count land groups not touching border.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const visited: boolean[][] = Array.from({ length: m }, () => Array(n).fill(false));

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. BFS from each unvisited land cell (0). If BFS stays within interior, it is a closed island.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(grid.flat().map((v, i) => [i, v === 0 ? 'active' : 'default'])),
        labels: {},
      } as ArrayVisualization,
    });

    let count = 0;
    let islandNum = 0;

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 0 && !visited[r][c]) {
          islandNum++;
          const queue: [number, number][] = [[r, c]];
          visited[r][c] = true;
          let isClosed = true;
          let head = 0;
          const islandCells: number[] = [r * n + c];

          while (head < queue.length) {
            const [cr, cc] = queue[head++];
            if (cr === 0 || cr === m - 1 || cc === 0 || cc === n - 1) {
              isClosed = false;
            }
            for (const [dr, dc] of dirs) {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc] && grid[nr][nc] === 0) {
                visited[nr][nc] = true;
                queue.push([nr, nc]);
                islandCells.push(nr * n + nc);
              }
            }
          }

          if (isClosed) count++;

          const highlights: Record<number, string> = {};
          islandCells.forEach(idx => { highlights[idx] = isClosed ? 'found' : 'mismatch'; });

          steps.push({
            line: 6,
            explanation: `Island #${islandNum} found at (${r},${c}) with ${islandCells.length} cell(s). ${isClosed ? 'CLOSED (does not touch border).' : 'OPEN (touches border, not counted).'} Count: ${count}.`,
            variables: { island: islandNum, cells: islandCells.length, isClosed, count },
            visualization: {
              type: 'array',
              array: grid.flat(),
              highlights,
              labels: { [r * n + c]: isClosed ? 'closed' : 'open' },
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `All land cells explored. Total closed islands: ${count} (out of ${islandNum} total islands).`,
      variables: { result: count, totalIslands: islandNum },
      visualization: {
        type: 'array',
        array: [islandNum, count, islandNum - count],
        highlights: { 0: 'active', 1: 'found', 2: 'mismatch' },
        labels: { 0: 'total', 1: 'closed', 2: 'open' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfClosedIslandsBfs;
