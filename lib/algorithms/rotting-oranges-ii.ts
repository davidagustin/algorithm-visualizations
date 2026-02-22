import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rottingOrangesII: AlgorithmDefinition = {
  id: 'rotting-oranges-ii',
  title: 'Rotting Oranges II',
  leetcodeNumber: 994,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'In a grid: 0=empty, 1=fresh orange, 2=rotten orange. Every minute, rotten oranges spread rot to adjacent fresh oranges. Find minimum minutes until no fresh oranges remain, or -1 if impossible. Classic multi-source BFS.',
  tags: ['Graph', 'BFS', 'Matrix', 'Multi-Source BFS'],
  code: {
    pseudocode: `function orangesRotting(grid):
  queue all initially rotten oranges
  count fresh oranges
  minutes = 0
  while queue not empty and fresh > 0:
    for all rotten in current level:
      rot all adjacent fresh oranges
      add them to queue, fresh--
    minutes++
  return fresh == 0 ? minutes : -1`,
    python: `def orangesRotting(grid):
    m, n = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 2: queue.append((r,c))
            elif grid[r][c] == 1: fresh += 1
    minutes = 0
    while queue and fresh > 0:
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr,dc in [(1,0),(-1,0),(0,1),(0,-1)]:
                nr,nc = r+dr,c+dc
                if 0<=nr<m and 0<=nc<n and grid[nr][nc]==1:
                    grid[nr][nc]=2; fresh-=1; queue.append((nr,nc))
        minutes += 1
    return minutes if fresh == 0 else -1`,
    javascript: `function orangesRotting(grid) {
  const m=grid.length, n=grid[0].length;
  const queue=[], dirs=[[1,0],[-1,0],[0,1],[0,-1]];
  let fresh=0;
  for (let r=0;r<m;r++) for (let c=0;c<n;c++) {
    if (grid[r][c]===2) queue.push([r,c]);
    else if (grid[r][c]===1) fresh++;
  }
  let minutes=0;
  while (queue.length>0 && fresh>0) {
    const size=queue.length;
    for (let k=0;k<size;k++) {
      const [r,c]=queue.shift();
      for (const [dr,dc] of dirs) {
        const nr=r+dr,nc=c+dc;
        if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===1){
          grid[nr][nc]=2;fresh--;queue.push([nr,nc]);
        }
      }
    }
    minutes++;
  }
  return fresh===0?minutes:-1;
}`,
    java: `public int orangesRotting(int[][] grid) {
    int m=grid.length,n=grid[0].length,fresh=0,minutes=0;
    Queue<int[]> q=new LinkedList<>();
    int[][]dirs={{1,0},{-1,0},{0,1},{0,-1}};
    for(int r=0;r<m;r++) for(int c=0;c<n;c++){
        if(grid[r][c]==2)q.offer(new int[]{r,c});
        else if(grid[r][c]==1)fresh++;
    }
    while(!q.isEmpty()&&fresh>0){
        int sz=q.size();
        for(int k=0;k<sz;k++){
            int[]cur=q.poll();
            for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];
                if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]==1){
                    grid[nr][nc]=2;fresh--;q.offer(new int[]{nr,nc});}}
        }
        minutes++;
    }
    return fresh==0?minutes:-1;
}`,
  },
  defaultInput: {
    grid: [[2,1,1],[1,1,0],[0,1,1]],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Orange Grid',
      type: 'array',
      defaultValue: [[2,1,1],[1,1,0],[0,1,1]],
      placeholder: '[[2,1,1],[1,1,0],[0,1,1]]',
      helperText: '0=empty, 1=fresh, 2=rotten',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const m = rawGrid.length;
    const n = rawGrid[0].length;
    const steps: AlgorithmStep[] = [];

    const grid = rawGrid.map(row => [...row]);
    const dirs = [[1,0],[-1,0],[0,1],[0,-1]];
    const queue: number[][] = [];
    let fresh = 0;

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 2) queue.push([r, c]);
        else if (grid[r][c] === 1) fresh++;
      }
    }

    function makeViz(highlights: Record<number, string>, minute: number, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: grid.flat(),
        highlights,
        labels: Object.fromEntries(grid.flat().map((v, i) => [i, `(${Math.floor(i/n)},${i%n}):${v===0?'_':v===1?'F':'R'}`])),
        auxData: {
          label: 'Rotting Oranges (Multi-BFS)',
          entries: [
            { key: 'Minute', value: String(minute) },
            { key: 'Fresh Left', value: String(fresh) },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    const initH: Record<number, string> = {};
    for (let i = 0; i < m * n; i++) {
      const v = grid.flat()[i];
      initH[i] = v === 2 ? 'mismatch' : v === 1 ? 'found' : 'default';
    }
    steps.push({
      line: 1,
      explanation: `Initial state: ${queue.length} rotten, ${fresh} fresh. Multi-source BFS from all rotten oranges.`,
      variables: { rottenCount: queue.length, freshCount: fresh },
      visualization: makeViz(initH, 0, `${queue.length} rotten sources`),
    });

    let minutes = 0;

    while (queue.length > 0 && fresh > 0) {
      const size = queue.length;
      minutes++;

      for (let k = 0; k < size; k++) {
        const [r, c] = queue.shift()!;
        for (const [dr, dc] of dirs) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {
            grid[nr][nc] = 2;
            fresh--;
            queue.push([nr, nc]);
          }
        }
      }

      const h: Record<number, string> = {};
      const flat = grid.flat();
      for (let i = 0; i < flat.length; i++) {
        h[i] = flat[i] === 2 ? 'mismatch' : flat[i] === 1 ? 'found' : 'default';
      }
      // Highlight newly rotten (the ones just added this minute)
      const newlyRotten = queue.slice(queue.length - (queue.length));
      for (const [r, c] of newlyRotten) h[r * n + c] = 'active';

      steps.push({
        line: 7,
        explanation: `Minute ${minutes}: rot spread. Fresh remaining = ${fresh}.`,
        variables: { minute: minutes, freshRemaining: fresh },
        visualization: makeViz(h, minutes, `Fresh left: ${fresh}`),
      });
    }

    const result = fresh === 0 ? minutes : -1;
    const finalFlat = grid.flat();
    const finalH: Record<number, string> = {};
    for (let i = 0; i < finalFlat.length; i++) {
      finalH[i] = finalFlat[i] === 2 ? 'sorted' : finalFlat[i] === 1 ? 'mismatch' : 'default';
    }

    steps.push({
      line: 9,
      explanation: result === -1
        ? `${fresh} fresh orange(s) unreachable. Return -1.`
        : `All oranges rotten in ${result} minute(s). Return ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, minutes, `Result: ${result}`),
    });

    return steps;
  },
};

export default rottingOrangesII;
