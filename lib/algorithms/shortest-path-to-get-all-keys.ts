import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const shortestPathToGetAllKeys: AlgorithmDefinition = {
  id: 'shortest-path-to-get-all-keys',
  title: 'Shortest Path to Get All Keys',
  leetcodeNumber: 864,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a grid with keys (a-f) and locks (A-F), find the shortest path to collect all keys. State is (row, col, keyMask). Uses BFS with bitmask state where each bit represents a collected key.',
  tags: ['Dynamic Programming', 'Bitmask', 'BFS', 'Graph', 'Bit Manipulation'],
  code: {
    pseudocode: `function shortestPathAllKeys(grid):
  find start position, count keys k
  queue = [(startR, startC, 0, 0)]  // row, col, keys, steps
  visited = set of (r, c, keys)
  while queue not empty:
    r, c, keys, steps = dequeue
    if keys == (1<<k)-1: return steps
    for each direction:
      nr, nc = r+dr, c+dc
      if out of bounds or wall: continue
      cell = grid[nr][nc]
      newKeys = keys
      if cell is key: newKeys |= (1 << key_index)
      if cell is lock and not have key: skip
      if (nr, nc, newKeys) not visited:
        enqueue(nr, nc, newKeys, steps+1)
  return -1`,
    python: `def shortestPathAllKeys(grid):
    from collections import deque
    m, n = len(grid), len(grid[0])
    start, total_keys = None, 0
    for i in range(m):
        for j in range(n):
            if grid[i][j] == '@': start = (i, j)
            if grid[i][j].islower(): total_keys += 1
    full = (1 << total_keys) - 1
    q = deque([(start[0], start[1], 0, 0)])
    visited = {(start[0], start[1], 0)}
    while q:
        r, c, keys, steps = q.popleft()
        if keys == full: return steps
        for dr, dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr, nc = r+dr, c+dc
            if not (0<=nr<m and 0<=nc<n): continue
            cell = grid[nr][nc]
            if cell == '#': continue
            nk = keys
            if cell.islower(): nk |= 1 << (ord(cell)-ord('a'))
            if cell.isupper() and not (nk >> (ord(cell)-ord('A')) & 1): continue
            if (nr,nc,nk) not in visited:
                visited.add((nr,nc,nk))
                q.append((nr,nc,nk,steps+1))
    return -1`,
    javascript: `function shortestPathAllKeys(grid) {
  const m = grid.length, n = grid[0].length;
  let start, totalKeys = 0;
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      if (grid[i][j] === '@') start = [i, j];
      if (grid[i][j] >= 'a' && grid[i][j] <= 'f') totalKeys++;
    }
  const full = (1 << totalKeys) - 1;
  const queue = [[start[0], start[1], 0, 0]];
  const visited = new Set([start[0]+','+start[1]+',0']);
  while (queue.length) {
    const [r, c, keys, steps] = queue.shift();
    if (keys === full) return steps;
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r+dr, nc = c+dc;
      if (nr<0||nr>=m||nc<0||nc>=n||grid[nr][nc]==='#') continue;
      const cell = grid[nr][nc];
      let nk = keys;
      if (cell>='a'&&cell<='f') nk |= 1<<(cell.charCodeAt(0)-97);
      if (cell>='A'&&cell<='F'&&!(nk>>(cell.charCodeAt(0)-65)&1)) continue;
      const key = nr+','+nc+','+nk;
      if (!visited.has(key)) { visited.add(key); queue.push([nr,nc,nk,steps+1]); }
    }
  }
  return -1;
}`,
    java: `public int shortestPathAllKeys(String[] grid) {
    int m = grid.length, n = grid[0].length(), sr = 0, sc = 0, k = 0;
    for (int i = 0; i < m; i++) for (int j = 0; j < n; j++) {
        if (grid[i].charAt(j)=='@') { sr=i; sc=j; }
        if (Character.isLowerCase(grid[i].charAt(j))) k++;
    }
    int full = (1<<k)-1;
    Queue<int[]> q = new LinkedList<>();
    q.add(new int[]{sr,sc,0,0});
    Set<String> vis = new HashSet<>();
    vis.add(sr+","+sc+",0");
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!q.isEmpty()) {
        int[] cur = q.poll();
        int r=cur[0],c=cur[1],keys=cur[2],steps=cur[3];
        if (keys==full) return steps;
        for (int[] d : dirs) {
            int nr=r+d[0], nc=c+d[1];
            if (nr<0||nr>=m||nc<0||nc>=n) continue;
            char ch = grid[nr].charAt(nc);
            if (ch=='#') continue;
            int nk = keys;
            if (Character.isLowerCase(ch)) nk |= 1<<(ch-'a');
            if (Character.isUpperCase(ch) && (nk>>(ch-'A')&1)==0) continue;
            String key = nr+","+nc+","+nk;
            if (vis.add(key)) q.add(new int[]{nr,nc,nk,steps+1});
        }
    }
    return -1;
}`,
  },
  defaultInput: { grid: ['@.a..', '###.#', 'b.A.B'] },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid (JSON array of strings)',
      type: 'array',
      defaultValue: ['@.a..', '###.#', 'b.A.B'],
      placeholder: '@.a..,###.#,b.A.B',
      helperText: 'Grid rows: @ = start, a-f = keys, A-F = locks, # = wall',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as string[];
    const m = grid.length;
    const n = grid[0]?.length || 0;
    let startR = 0, startC = 0;
    let totalKeys = 0;
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const ch = grid[i][j];
        if (ch === '@') { startR = i; startC = j; }
        if (ch >= 'a' && ch <= 'f') totalKeys++;
      }
    }
    const full = (1 << totalKeys) - 1;
    const keyCount = totalKeys;
    const size = 1 << keyCount;
    const dp: (number | null)[] = new Array(size).fill(null);
    dp[0] = 0;
    const labels: string[] = Array.from({ length: size }, (_, i) =>
      i.toString(2).padStart(Math.max(keyCount, 1), '0')
    );
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let mask = 0; mask < size; mask++) {
        if (dp[mask] !== null) highlights[mask] = 'found';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Grid ${m}x${n}, start=(@${startR},${startC}), keys=${totalKeys}. BFS state=(r,c,keyMask). dp[keyMask]=min steps to collect keys.`,
      variables: { m, n, totalKeys, full },
      visualization: makeViz(0),
    });

    const queue: [number, number, number, number][] = [[startR, startC, 0, 0]];
    const visited = new Set<string>([`${startR},${startC},0`]);
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    while (queue.length > 0) {
      const [r, c, keys, stepCount] = queue.shift()!;
      if (keys === full) {
        dp[keys] = stepCount;
        steps.push({
          line: 9,
          explanation: `All keys collected! keyMask=${keys.toString(2).padStart(Math.max(keyCount,1),'0')}. Minimum steps: ${stepCount}.`,
          variables: { steps: stepCount, keyMask: keys },
          visualization: makeViz(keys),
        });
        break;
      }

      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        const ch = grid[nr][nc];
        if (ch === '#') continue;
        let nk = keys;
        if (ch >= 'a' && ch <= 'f') nk |= 1 << (ch.charCodeAt(0) - 97);
        if (ch >= 'A' && ch <= 'F' && !(nk >> (ch.charCodeAt(0) - 65) & 1)) continue;
        const key = `${nr},${nc},${nk}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc, nk, stepCount + 1]);
          if (dp[nk] === null || stepCount + 1 < (dp[nk] as number)) {
            dp[nk] = stepCount + 1;
            steps.push({
              line: 14,
              explanation: `Move to (${nr},${nc}), keyMask=${nk.toString(2).padStart(Math.max(keyCount,1),'0')} (${ch}). Steps so far: ${stepCount+1}.`,
              variables: { r: nr, c: nc, keyMask: nk, steps: stepCount + 1 },
              visualization: makeViz(nk),
            });
          }
        }
      }
    }

    if (dp[full] === null) {
      steps.push({
        line: 17,
        explanation: 'Could not collect all keys. Return -1.',
        variables: { result: -1 },
        visualization: makeViz(null),
      });
    }

    return steps;
  },
};

export default shortestPathToGetAllKeys;
