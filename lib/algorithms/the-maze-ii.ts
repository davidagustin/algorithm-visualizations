import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const theMazeIi: AlgorithmDefinition = {
  id: 'the-maze-ii',
  title: 'The Maze II',
  leetcodeNumber: 505,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A ball rolls in a maze until hitting a wall. Find the shortest distance (in steps) from start to destination, or -1 if impossible. Use Dijkstra or BFS with distance tracking: from each stop point, roll in all directions and record the steps taken until hitting a wall.',
  tags: ['bfs', 'dijkstra', 'graph', 'maze', 'shortest path'],

  code: {
    pseudocode: `function shortestDistance(maze, start, destination):
  m, n = dimensions
  dist = infinity matrix
  dist[start] = 0
  queue = [(0, start)]  // (distance, position)
  while queue not empty:
    d, (r, c) = dequeue min
    if d > dist[r][c]: continue
    for each direction:
      nr, nc, steps = roll(r, c, direction)
      if dist[r][c] + steps < dist[nr][nc]:
        dist[nr][nc] = dist[r][c] + steps
        enqueue(dist[nr][nc], nr, nc)
  return dist[destination] if finite else -1`,

    python: `import heapq

def shortestDistance(maze, start, destination):
    m, n = len(maze), len(maze[0])
    dist = [[float('inf')]*n for _ in range(m)]
    dist[start[0]][start[1]] = 0
    heap = [(0, start[0], start[1])]
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while heap:
        d, r, c = heapq.heappop(heap)
        if d > dist[r][c]: continue
        for dr, dc in dirs:
            nr, nc, steps = r, c, 0
            while 0<=nr+dr<m and 0<=nc+dc<n and maze[nr+dr][nc+dc]==0:
                nr+=dr; nc+=dc; steps+=1
            if dist[r][c]+steps < dist[nr][nc]:
                dist[nr][nc] = dist[r][c]+steps
                heapq.heappush(heap, (dist[nr][nc], nr, nc))
    ans = dist[destination[0]][destination[1]]
    return ans if ans < float('inf') else -1`,

    javascript: `function shortestDistance(maze, start, destination) {
  const m = maze.length, n = maze[0].length;
  const dist = Array.from({length:m}, () => Array(n).fill(Infinity));
  dist[start[0]][start[1]] = 0;
  const queue = [[0, start[0], start[1]]];
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (queue.length) {
    queue.sort((a,b) => a[0]-b[0]);
    const [d, r, c] = queue.shift();
    if (d > dist[r][c]) continue;
    for (const [dr, dc] of dirs) {
      let nr = r, nc = c, steps = 0;
      while (nr+dr>=0&&nr+dr<m&&nc+dc>=0&&nc+dc<n&&maze[nr+dr][nc+dc]===0) {
        nr+=dr; nc+=dc; steps++;
      }
      if (dist[r][c]+steps < dist[nr][nc]) {
        dist[nr][nc] = dist[r][c]+steps;
        queue.push([dist[nr][nc], nr, nc]);
      }
    }
  }
  const ans = dist[destination[0]][destination[1]];
  return ans === Infinity ? -1 : ans;
}`,

    java: `public int shortestDistance(int[][] maze, int[] start, int[] destination) {
    int m = maze.length, n = maze[0].length;
    int[][] dist = new int[m][n];
    for (int[] row : dist) Arrays.fill(row, Integer.MAX_VALUE);
    dist[start[0]][start[1]] = 0;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0, start[0], start[1]});
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        int d=cur[0], r=cur[1], c=cur[2];
        if (d > dist[r][c]) continue;
        for (int[] dir : dirs) {
            int nr=r, nc=c, steps=0;
            while(nr+dir[0]>=0&&nr+dir[0]<m&&nc+dir[1]>=0&&nc+dir[1]<n&&maze[nr+dir[0]][nc+dir[1]]==0) {
                nr+=dir[0]; nc+=dir[1]; steps++;
            }
            if (dist[r][c]+steps < dist[nr][nc]) {
                dist[nr][nc] = dist[r][c]+steps;
                pq.offer(new int[]{dist[nr][nc], nr, nc});
            }
        }
    }
    int ans = dist[destination[0]][destination[1]];
    return ans == Integer.MAX_VALUE ? -1 : ans;
}`,
  },

  defaultInput: {
    maze: [[0,0,1,0,0],[0,0,0,0,0],[0,0,0,1,0],[1,1,0,1,1],[0,0,0,0,0]],
    start: [0, 4],
    destination: [4, 4],
  },

  inputFields: [
    {
      name: 'start',
      label: 'Start Position',
      type: 'array',
      defaultValue: [0, 4],
      placeholder: '0,4',
      helperText: 'Start row and column',
    },
    {
      name: 'destination',
      label: 'Destination',
      type: 'array',
      defaultValue: [4, 4],
      placeholder: '4,4',
      helperText: 'Destination row and column',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maze = input.maze as number[][];
    const start = input.start as number[];
    const destination = input.destination as number[];
    const steps: AlgorithmStep[] = [];
    const m = maze.length;
    const n = maze[0].length;
    const INF = Infinity;
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const dirNames = ['Right', 'Left', 'Down', 'Up'];

    const dist: number[][] = Array.from({ length: m }, () => Array(n).fill(INF));
    dist[start[0]][start[1]] = 0;

    steps.push({
      line: 1,
      explanation: `Maze is ${m}x${n}. Ball starts at (${start[0]}, ${start[1]}), target: (${destination[0]}, ${destination[1]}). Find shortest rolling distance.`,
      variables: { start: `(${start[0]},${start[1]})`, destination: `(${destination[0]},${destination[1]})` },
      visualization: {
        type: 'array',
        array: maze.flat(),
        highlights: { [start[0] * n + start[1]]: 'active', [destination[0] * n + destination[1]]: 'pointer' },
        labels: { [start[0] * n + start[1]]: 'start', [destination[0] * n + destination[1]]: 'dest' },
      } as ArrayVisualization,
    });

    const queue: [number, number, number][] = [[0, start[0], start[1]]];

    while (queue.length > 0) {
      queue.sort((a, b) => a[0] - b[0]);
      const [d, r, c] = queue.shift()!;

      if (d > dist[r][c]) continue;

      steps.push({
        line: 7,
        explanation: `Processing stop point (${r}, ${c}) with distance ${d}. Rolling in all 4 directions.`,
        variables: { position: `(${r},${c})`, distance: d },
        visualization: {
          type: 'array',
          array: dist.flat().map(v => v === INF ? -1 : v),
          highlights: { [r * n + c]: 'active', [destination[0] * n + destination[1]]: 'pointer' },
          labels: { [r * n + c]: `d=${d}` },
        } as ArrayVisualization,
      });

      for (let di = 0; di < dirs.length; di++) {
        const [dr, dc] = dirs[di];
        let nr = r;
        let nc = c;
        let rollSteps = 0;
        while (nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n && maze[nr + dr][nc + dc] === 0) {
          nr += dr;
          nc += dc;
          rollSteps++;
        }
        const newDist = dist[r][c] + rollSteps;
        if (newDist < dist[nr][nc]) {
          dist[nr][nc] = newDist;
          queue.push([newDist, nr, nc]);
          steps.push({
            line: 10,
            explanation: `Roll ${dirNames[di]}: stops at (${nr}, ${nc}) after ${rollSteps} steps. New dist = ${newDist}.`,
            variables: { direction: dirNames[di], stopAt: `(${nr},${nc})`, rollSteps, newDist },
            visualization: {
              type: 'array',
              array: dist.flat().map(v => v === INF ? -1 : v),
              highlights: { [r * n + c]: 'active', [nr * n + nc]: 'comparing' },
              labels: { [r * n + c]: `d=${d}`, [nr * n + nc]: `d=${newDist}` },
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 18) break;
    }

    const ans = dist[destination[0]][destination[1]];
    steps.push({
      line: 14,
      explanation: `Shortest distance to (${destination[0]}, ${destination[1]}): ${ans === INF ? -1 : ans}.`,
      variables: { result: ans === INF ? -1 : ans },
      visualization: {
        type: 'array',
        array: dist.flat().map(v => v === INF ? -1 : v),
        highlights: { [destination[0] * n + destination[1]]: ans === INF ? 'mismatch' : 'found' },
        labels: { [destination[0] * n + destination[1]]: `dist=${ans === INF ? -1 : ans}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default theMazeIi;
