import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const bricksFallingWhenHit: AlgorithmDefinition = {
  id: 'bricks-falling-when-hit',
  title: 'Bricks Falling When Hit',
  leetcodeNumber: 803,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a grid of bricks and a sequence of hits, determine how many bricks fall after each hit. A brick falls if it is no longer connected to the top row (directly or indirectly). Use reverse-time union find: process hits in reverse, adding bricks back and computing how many join the roof. The difference in roof-connected size gives bricks that fall (minus the re-added brick).',
  tags: ['union find', 'graph', 'reverse thinking', 'grid'],

  code: {
    pseudocode: `function hitBricks(grid, hits):
  m, n = dimensions
  // Apply all hits first
  copy = deepcopy(grid)
  for r, c in hits: copy[r][c] = 0
  // Virtual roof node = m * n
  parent = [0..m*n], roof = m*n
  // Build union-find on remaining bricks
  for each brick in copy:
    union with neighbors, union top row with roof
  // Process hits in reverse
  result = []
  for r, c in reversed(hits):
    if original grid had no brick here: result.append(0); continue
    before = size of roof component
    copy[r][c] = 1  // restore brick
    union with neighbors
    if r == 0: union(r*n+c, roof)
    after = size of roof component
    result.append(max(0, after - before - 1))
  return reversed(result)`,

    python: `def hitBricks(grid, hits):
    m, n = len(grid), len(grid[0])
    copy = [row[:] for row in grid]
    for r, c in hits: copy[r][c] = 0
    parent = list(range(m*n+1))
    size = [1]*(m*n+1)
    roof = m*n
    def find(x):
        while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
        return x
    def union(a,b):
        pa,pb=find(a),find(b)
        if pa==pb: return
        if size[pa]<size[pb]: pa,pb=pb,pa
        parent[pb]=pa; size[pa]+=size[pb]
    for r in range(m):
        for c in range(n):
            if copy[r][c]==1:
                if r==0: union(r*n+c,roof)
                if r>0 and copy[r-1][c]==1: union(r*n+c,(r-1)*n+c)
                if c>0 and copy[r][c-1]==1: union(r*n+c,r*n+c-1)
    res = []
    for r,c in reversed(hits):
        if grid[r][c]==0: res.append(0); continue
        before = size[find(roof)]
        copy[r][c]=1
        for dr,dc in [(-1,0),(1,0),(0,-1),(0,1)]:
            nr,nc=r+dr,c+dc
            if 0<=nr<m and 0<=nc<n and copy[nr][nc]==1: union(r*n+c,nr*n+nc)
        if r==0: union(r*n+c,roof)
        after=size[find(roof)]
        res.append(max(0,after-before-1))
    return res[::-1]`,

    javascript: `function hitBricks(grid, hits) {
  const m=grid.length,n=grid[0].length,roof=m*n;
  const copy=grid.map(r=>[...r]);
  for(const[r,c]of hits) copy[r][c]=0;
  const parent=Array.from({length:m*n+1},(_,i)=>i);
  const sz=new Array(m*n+1).fill(1);
  function find(x){while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x;}
  function union(a,b){let pa=find(a),pb=find(b);if(pa===pb)return;if(sz[pa]<sz[pb])[pa,pb]=[pb,pa];parent[pb]=pa;sz[pa]+=sz[pb];}
  for(let r=0;r<m;r++) for(let c=0;c<n;c++) if(copy[r][c]===1){
    if(r===0) union(r*n+c,roof);
    if(r>0&&copy[r-1][c]===1) union(r*n+c,(r-1)*n+c);
    if(c>0&&copy[r][c-1]===1) union(r*n+c,r*n+c-1);
  }
  const res=[];
  for(let i=hits.length-1;i>=0;i--){
    const[r,c]=hits[i];
    if(grid[r][c]===0){res.push(0);continue;}
    const before=sz[find(roof)];
    copy[r][c]=1;
    for(const[dr,dc]of[[-1,0],[1,0],[0,-1],[0,1]]){
      const nr=r+dr,nc=c+dc;
      if(nr>=0&&nr<m&&nc>=0&&nc<n&&copy[nr][nc]===1) union(r*n+c,nr*n+nc);
    }
    if(r===0) union(r*n+c,roof);
    res.push(Math.max(0,sz[find(roof)]-before-1));
  }
  return res.reverse();
}`,

    java: `public int[] hitBricks(int[][] grid, int[][] hits) {
    // ... reverse-time union find implementation
    return new int[hits.length];
}`,
  },

  defaultInput: {
    grid: [[1, 0, 0, 0], [1, 1, 0, 0]],
    hits: [[1, 1]],
  },

  inputFields: [
    {
      name: 'grid',
      label: 'Grid',
      type: 'array',
      defaultValue: [[1, 0, 0, 0], [1, 1, 0, 0]],
      placeholder: '[[1,0],[1,1]]',
      helperText: 'Grid of bricks (1) and empty spaces (0)',
    },
    {
      name: 'hits',
      label: 'Hits',
      type: 'array',
      defaultValue: [[1, 1]],
      placeholder: '[[1,1],[0,0]]',
      helperText: 'Sequence of brick positions to hit [row, col]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const grid = input.grid as number[][];
    const hits = input.hits as number[][];
    const steps: AlgorithmStep[] = [];
    const m = grid.length;
    const n = grid[0].length;
    const roof = m * n;

    // Deep copy and apply all hits
    const copy = grid.map(r => [...r]);
    for (const [r, c] of hits) copy[r][c] = 0;

    const parent: number[] = Array.from({ length: m * n + 1 }, (_, i) => i);
    const sz: number[] = new Array(m * n + 1).fill(1);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    function union(a: number, b: number): void {
      let pa = find(a), pb = find(b);
      if (pa === pb) return;
      if (sz[pa] < sz[pb]) { const tmp = pa; pa = pb; pb = tmp; }
      parent[pb] = pa;
      sz[pa] += sz[pb];
    }

    steps.push({
      line: 1,
      explanation: `Apply all ${hits.length} hit(s) to get the post-hit state. Build union-find on remaining bricks. Virtual roof node = ${roof}.`,
      variables: { m, n, hitCount: hits.length, roof },
      visualization: {
        type: 'array',
        array: copy.flat(),
        highlights: {},
        labels: { 0: 'post-hit state', [roof]: 'roof' },
      },
    });

    // Build initial union-find
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (copy[r][c] === 1) {
          if (r === 0) union(r * n + c, roof);
          if (r > 0 && copy[r - 1][c] === 1) union(r * n + c, (r - 1) * n + c);
          if (c > 0 && copy[r][c - 1] === 1) union(r * n + c, r * n + c - 1);
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Initial union-find built. Roof-connected bricks: ${sz[find(roof)] - 1} (excluding virtual node). Now process hits in REVERSE.`,
      variables: { roofConnected: sz[find(roof)] - 1 },
      visualization: {
        type: 'array',
        array: copy.flat(),
        highlights: Object.fromEntries(copy.flat().map((v, i) => [i, find(i) === find(roof) && i < m * n ? 'found' : 'visited'])),
        labels: { 0: `roof-sz:${sz[find(roof)] - 1}` },
      },
    });

    const results: number[] = [];

    for (let i = hits.length - 1; i >= 0; i--) {
      const [r, c] = hits[i];

      if (grid[r][c] === 0) {
        results.unshift(0);
        steps.push({
          line: 13,
          explanation: `Hit ${i}: (${r},${c}) had no brick originally. 0 bricks fall.`,
          variables: { hit: i, r, c, fallen: 0 },
          visualization: {
            type: 'array',
            array: copy.flat(),
            highlights: { [r * n + c]: 'mismatch' },
            labels: { [r * n + c]: 'no brick' },
          },
        });
        continue;
      }

      const before = sz[find(roof)];
      copy[r][c] = 1;

      const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < m && nc >= 0 && nc < n && copy[nr][nc] === 1) {
          union(r * n + c, nr * n + nc);
        }
      }
      if (r === 0) union(r * n + c, roof);

      const after = sz[find(roof)];
      const fallen = Math.max(0, after - before - 1);
      results.unshift(fallen);

      steps.push({
        line: 17,
        explanation: `Restore hit ${i} at (${r},${c}). Roof size before=${before - 1}, after=${after - 1}. Bricks that fall when hit: ${fallen}.`,
        variables: { hit: i, r, c, before: before - 1, after: after - 1, fallen },
        visualization: {
          type: 'array',
          array: copy.flat(),
          highlights: { [r * n + c]: 'active' },
          labels: { [r * n + c]: `+${fallen}`, 0: `roof:${after - 1}` },
        },
      });
    }

    steps.push({
      line: 19,
      explanation: `Result: [${results.join(', ')}]. Each value is the number of bricks that fall after each hit.`,
      variables: { result: results.join(',') },
      visualization: {
        type: 'array',
        array: results,
        highlights: Object.fromEntries(results.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(results.map((v, i) => [i, String(v)])),
      },
    });

    return steps;
  },
};

export default bricksFallingWhenHit;
