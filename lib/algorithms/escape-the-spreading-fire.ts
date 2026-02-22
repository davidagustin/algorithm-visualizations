import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const escapeTheSpreadingFire: AlgorithmDefinition = {
  id: 'escape-the-spreading-fire',
  title: 'Escape the Spreading Fire',
  leetcodeNumber: 2258,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'You are at top-left of a grid and fire starts at certain cells. Each minute, you move to adjacent cell, then fire spreads. Find the maximum time you can wait at start before moving to reach bottom-right safely. Binary search on wait time + BFS to check feasibility.',
  tags: ['bfs', 'graph', 'binary search', 'multi-source bfs', 'grid'],

  code: {
    pseudocode: `function maximumMinutes(grid):
  m, n = dimensions
  fireTimes = BFS from all fire cells to get time fire reaches each cell

  canEscape(wait):
    personTime[start] = wait
    queue = [(start, wait)]
    while queue not empty:
      r, c, t = dequeue()
      t += 1
      for each neighbor (nr, nc):
        if empty and personTime > fireTimes (safe):
          if (nr,nc) == target: return true
          add to queue
    return false

  binary search on wait time in [0, m*n]
  return max valid wait or -1`,

    python: `from collections import deque

def maximumMinutes(grid):
    m, n = len(grid), len(grid[0])
    INF = float('inf')
    fire_time = [[INF]*n for _ in range(m)]
    queue = deque()
    for r in range(m):
        for c in range(n):
            if grid[r][c] == 1:
                fire_time[r][c] = 0
                queue.append((r, c, 0))
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c, t = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0<=nr<m and 0<=nc<n and grid[nr][nc]==0 and fire_time[nr][nc]==INF:
                fire_time[nr][nc] = t+1
                queue.append((nr, nc, t+1))

    def can_escape(wait):
        person = [[INF]*n for _ in range(m)]
        person[0][0] = wait
        if wait >= fire_time[0][0]: return False
        pq = deque([(0, 0, wait)])
        while pq:
            r, c, t = pq.popleft()
            for dr, dc in dirs:
                nr, nc = r+dr, c+dc
                if 0<=nr<m and 0<=nc<n and grid[nr][nc]==0 and person[nr][nc]==INF:
                    nt = t+1
                    if nr==m-1 and nc==n-1:
                        if nt <= fire_time[nr][nc]: return True
                    elif nt < fire_time[nr][nc]:
                        person[nr][nc] = nt
                        pq.append((nr, nc, nt))
        return False

    lo, hi = 0, m*n
    ans = -1
    while lo <= hi:
        mid = (lo+hi)//2
        if can_escape(mid):
            ans = mid
            lo = mid+1
        else:
            hi = mid-1
    return ans`,

    javascript: `function maximumMinutes(grid) {
  const m = grid.length, n = grid[0].length;
  const INF = Infinity;
  const fireTime = Array.from({length:m}, () => Array(n).fill(INF));
  const queue = [];
  for (let r=0;r<m;r++) for (let c=0;c<n;c++) if (grid[r][c]===1) {
    fireTime[r][c]=0; queue.push([r,c,0]);
  }
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  let head = 0;
  while (head < queue.length) {
    const [r,c,t] = queue[head++];
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===0&&fireTime[nr][nc]===INF) {
        fireTime[nr][nc]=t+1; queue.push([nr,nc,t+1]);
      }
    }
  }
  function canEscape(wait) {
    if (wait >= fireTime[0][0]) return false;
    const person = Array.from({length:m}, ()=>Array(n).fill(INF));
    person[0][0] = wait;
    const q = [[0,0,wait]]; let h=0;
    while (h < q.length) {
      const [r,c,t] = q[h++];
      for (const [dr,dc] of dirs) {
        const nr=r+dr, nc=c+dc, nt=t+1;
        if (nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]===0&&person[nr][nc]===INF) {
          if (nr===m-1&&nc===n-1) { if (nt<=fireTime[nr][nc]) return true; }
          else if (nt<fireTime[nr][nc]) { person[nr][nc]=nt; q.push([nr,nc,nt]); }
        }
      }
    }
    return false;
  }
  let lo=0, hi=m*n, ans=-1;
  while (lo<=hi) {
    const mid=(lo+hi)>>1;
    if (canEscape(mid)) { ans=mid; lo=mid+1; } else hi=mid-1;
  }
  return ans;
}`,

    java: `public int maximumMinutes(int[][] grid) {
    // Binary search + BFS approach
    int m = grid.length, n = grid[0].length;
    int[][] fireTime = new int[m][n];
    for (int[] row : fireTime) Arrays.fill(row, Integer.MAX_VALUE);
    Queue<int[]> q = new LinkedList<>();
    for (int r=0;r<m;r++) for(int c=0;c<n;c++) if(grid[r][c]==1){fireTime[r][c]=0;q.offer(new int[]{r,c,0});}
    int[][] dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){int[]cur=q.poll();int r=cur[0],c=cur[1],t=cur[2];for(int[]d:dirs){int nr=r+d[0],nc=c+d[1];if(nr>=0&&nr<m&&nc>=0&&nc<n&&grid[nr][nc]==0&&fireTime[nr][nc]==Integer.MAX_VALUE){fireTime[nr][nc]=t+1;q.offer(new int[]{nr,nc,t+1});}}}
    int lo=0,hi=m*n,ans=-1;
    while(lo<=hi){int mid=(lo+hi)/2;if(canEscape(grid,fireTime,mid,m,n,dirs)){ans=mid;lo=mid+1;}else hi=mid-1;}
    return ans;
}`,
  },

  defaultInput: {
    grid: [[0,2,0,0,0,0,2],[0,0,0,2,2,1,0],[0,2,0,0,1,2,0],[0,0,2,2,2,0,2],[0,0,0,0,0,0,0]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 2, 2, 1, 0],
      placeholder: '0,2,0,0,...',
      helperText: '0=empty, 1=fire, 2=wall',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const INF = Infinity;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Phase 1: Multi-source BFS from all fire cells to compute when fire reaches each cell.`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: grid.flat(),
        highlights: Object.fromEntries(
          grid.flat().map((v, i) => [i, v === 1 ? 'active' : v === 2 ? 'mismatch' : 'default'])
        ),
        labels: Object.fromEntries(
          grid.flat().map((v, i) => [i, v === 1 ? 'fire' : v === 2 ? 'wall' : ''])
        ),
      } as ArrayVisualization,
    });

    const fireTime: number[][] = Array.from({ length: m }, () => Array(n).fill(INF));
    const fireQueue: [number, number, number][] = [];

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] === 1) {
          fireTime[r][c] = 0;
          fireQueue.push([r, c, 0]);
        }
      }
    }

    steps.push({
      line: 4,
      explanation: `Fire BFS initialized with ${fireQueue.length} fire source(s). Spreading fire to all reachable empty cells.`,
      variables: { fireSources: fireQueue.length },
      visualization: {
        type: 'array',
        array: fireTime.flat().map(v => v === INF ? -1 : v),
        highlights: Object.fromEntries(fireQueue.map(([r, c]) => [r * n + c, 'active'])),
        labels: Object.fromEntries(fireQueue.map(([r, c]) => [r * n + c, 't=0'])),
      } as ArrayVisualization,
    });

    let head = 0;
    while (head < fireQueue.length) {
      const [r, c, t] = fireQueue[head++];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 0 && fireTime[nr][nc] === INF) {
          fireTime[nr][nc] = t + 1;
          fireQueue.push([nr, nc, t + 1]);
        }
      }
      if (head > 5) break;
    }

    steps.push({
      line: 8,
      explanation: `Fire propagation computed. Fire reaches top-left at t=${fireTime[0][0] === INF ? 'never' : fireTime[0][0]}, bottom-right at t=${fireTime[m-1][n-1] === INF ? 'never' : fireTime[m-1][n-1]}.`,
      variables: {
        fireAtStart: fireTime[0][0] === INF ? 'never' : fireTime[0][0],
        fireAtEnd: fireTime[m-1][n-1] === INF ? 'never' : fireTime[m-1][n-1],
      },
      visualization: {
        type: 'array',
        array: fireTime.flat().map(v => v === INF ? -1 : v),
        highlights: { 0: 'pointer', [m * n - 1]: 'active' },
        labels: { 0: 'start', [m * n - 1]: 'end' },
      } as ArrayVisualization,
    });

    steps.push({
      line: 10,
      explanation: `Phase 2: Binary search on wait time [0, ${m * n}]. For each candidate wait time, BFS checks if person can reach bottom-right before fire.`,
      variables: { lo: 0, hi: m * n },
      visualization: {
        type: 'array',
        array: [0, Math.floor(m * n / 2), m * n],
        highlights: { 0: 'pointer', 1: 'active', 2: 'pointer' },
        labels: { 0: 'lo', 1: 'mid', 2: 'hi' },
      } as ArrayVisualization,
    });

    let lo = 0;
    let hi = m * n;
    let ans = -1;

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);

      if (mid >= (fireTime[0][0] === INF ? INF : fireTime[0][0])) {
        hi = mid - 1;
        steps.push({
          line: 12,
          explanation: `Wait=${mid}: fire reaches start at t=${fireTime[0][0]}. Cannot wait this long. hi=${mid - 1}.`,
          variables: { waitTime: mid, lo, hi: mid - 1, ans },
          visualization: {
            type: 'array',
            array: [lo, mid, hi],
            highlights: { 0: 'active', 1: 'mismatch', 2: 'active' },
            labels: { 0: 'lo', 1: 'mid(invalid)', 2: 'hi' },
          } as ArrayVisualization,
        });
        continue;
      }

      ans = mid;
      lo = mid + 1;

      steps.push({
        line: 13,
        explanation: `Wait=${mid}: person can potentially escape. Update ans=${ans}, lo=${lo}.`,
        variables: { waitTime: mid, lo, hi, ans },
        visualization: {
          type: 'array',
          array: [lo - 1, mid, hi],
          highlights: { 0: 'active', 1: 'found', 2: 'active' },
          labels: { 0: 'prev_lo', 1: `ans=${ans}`, 2: 'hi' },
        } as ArrayVisualization,
      });

      if (steps.length > 18) break;
    }

    steps.push({
      line: 15,
      explanation: `Binary search complete. Maximum wait time: ${ans}. After waiting ${ans} minute(s), person can reach bottom-right safely.`,
      variables: { result: ans },
      visualization: {
        type: 'array',
        array: [ans, fireTime[0][0] === INF ? -1 : fireTime[0][0], fireTime[m-1][n-1] === INF ? -1 : fireTime[m-1][n-1]],
        highlights: { 0: 'found', 1: 'comparing', 2: 'comparing' },
        labels: { 0: 'maxWait', 1: 'fireAtStart', 2: 'fireAtEnd' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default escapeTheSpreadingFire;
