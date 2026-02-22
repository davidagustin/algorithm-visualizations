import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wallsAndGates: AlgorithmDefinition = {
  id: 'walls-and-gates',
  title: 'Walls and Gates',
  leetcodeNumber: 286,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Fill each empty room with its distance to the nearest gate. The grid has -1=wall, 0=gate, INF=empty room. Use multi-source BFS starting simultaneously from all gates. This guarantees each room gets the minimum distance in one pass.',
  tags: ['Graph', 'BFS', 'Multi-source BFS', 'Matrix'],
  code: {
    pseudocode: `function wallsAndGates(rooms):
  rows, cols = dimensions
  INF = 2^31 - 1
  queue = all gate positions (rooms[r][c] == 0)
  dist = 0
  while queue:
    for each (r, c) in current level:
      for each neighbor (nr, nc):
        if rooms[nr][nc] == INF:
          rooms[nr][nc] = dist + 1
          queue.enqueue((nr, nc))
    dist += 1`,
    python: `def wallsAndGates(rooms):
    INF = 2**31 - 1
    rows, cols = len(rooms), len(rooms[0])
    queue = deque()
    for r in range(rows):
        for c in range(cols):
            if rooms[r][c] == 0:
                queue.append((r, c))
    while queue:
        r, c = queue.popleft()
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and rooms[nr][nc]==INF:
                rooms[nr][nc] = rooms[r][c] + 1
                queue.append((nr, nc))`,
    javascript: `function wallsAndGates(rooms) {
  const INF = 2**31 - 1, rows=rooms.length, cols=rooms[0].length;
  const queue = [];
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) if(rooms[r][c]===0) queue.push([r,c]);
  while (queue.length) {
    const [r,c] = queue.shift();
    for (const [dr,dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&rooms[nr][nc]===INF) {
        rooms[nr][nc]=rooms[r][c]+1; queue.push([nr,nc]);
      }
    }
  }
}`,
    java: `public void wallsAndGates(int[][] rooms) {
    int INF=Integer.MAX_VALUE,rows=rooms.length,cols=rooms[0].length;
    Queue<int[]> q=new LinkedList<>();
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) if(rooms[r][c]==0) q.add(new int[]{r,c});
    int[][]dirs={{0,1},{0,-1},{1,0},{-1,0}};
    while(!q.isEmpty()){int[]cur=q.poll();for(int[]d:dirs){int nr=cur[0]+d[0],nc=cur[1]+d[1];if(nr>=0&&nr<rows&&nc>=0&&nc<cols&&rooms[nr][nc]==INF){rooms[nr][nc]=rooms[cur[0]][cur[1]]+1;q.add(new int[]{nr,nc});}}}
}`,
  },
  defaultInput: {
    rooms: [
      [2147483647, -1, 0, 2147483647],
      [2147483647, 2147483647, 2147483647, -1],
      [2147483647, -1, 2147483647, -1],
      [0, -1, 2147483647, 2147483647],
    ],
  },
  inputFields: [
    {
      name: 'rooms',
      label: 'Rooms (-1=wall, 0=gate, 2147483647=empty)',
      type: 'array',
      defaultValue: [
        [2147483647, -1, 0, 2147483647],
        [2147483647, 2147483647, 2147483647, -1],
        [2147483647, -1, 2147483647, -1],
        [0, -1, 2147483647, 2147483647],
      ],
      placeholder: '[[INF,-1,0,INF],[INF,INF,INF,-1]]',
      helperText: '-1=wall, 0=gate, 2147483647=empty room to fill',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawRooms = input.rooms as number[][];
    const rows = rawRooms.length;
    const cols = rawRooms[0].length;
    const INF = 2147483647;
    const rooms = rawRooms.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => rooms.flat().map(v => v === INF ? 999 : v);

    function makeViz(highlights: Record<number, string>, queueSize: number): ArrayVisualization {
      const base: Record<number, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const v = rooms[r][c];
          const i = idx(r, c);
          if (v === 0) base[i] = 'found';
          else if (v === -1) base[i] = 'visited';
          else if (v !== INF) base[i] = 'active';
        }
      }
      return {
        type: 'array',
        array: flat(),
        highlights: { ...base, ...highlights },
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => {
            const v = rooms[Math.floor(i / cols)][i % cols];
            return [i, v === INF ? 'INF' : v === -1 ? 'W' : v === 0 ? 'G' : String(v)];
          })
        ),
        auxData: {
          label: 'Multi-source BFS',
          entries: [
            { key: 'Queue size', value: String(queueSize) },
            { key: 'Filled rooms', value: String(rooms.flat().filter(v => v > 0 && v !== INF).length) },
            { key: 'Remaining INF', value: String(rooms.flat().filter(v => v === INF).length) },
          ],
        },
      };
    }

    // Seed queue with all gates
    const queue: [number, number][] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (rooms[r][c] === 0) queue.push([r, c]);
      }
    }

    steps.push({
      line: 1,
      explanation: `${rows}x${cols} room grid. Seed BFS with all ${queue.length} gate(s) (value=0). Walls=-1, INF=empty. Each BFS step fills rooms with distance to nearest gate.`,
      variables: { rows, cols, gates: queue.length },
      visualization: makeViz({}, queue.length),
    });

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      for (const [dr, dc] of dirs) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && rooms[nr][nc] === INF) {
          rooms[nr][nc] = rooms[r][c] + 1;
          queue.push([nr, nc]);
          steps.push({
            line: 10,
            explanation: `From (${r},${c}) dist=${rooms[r][c]}: neighbor (${nr},${nc}) is INF. Fill with dist ${rooms[nr][nc]}.`,
            variables: { r, c, nr, nc, dist: rooms[nr][nc] },
            visualization: makeViz({ [idx(r, c)]: 'current', [idx(nr, nc)]: 'swapping' }, queue.length),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Multi-source BFS complete. All reachable rooms filled with distance to nearest gate.`,
      variables: {},
      visualization: makeViz({}, 0),
    });

    return steps;
  },
};

export default wallsAndGates;
