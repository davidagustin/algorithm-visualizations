import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nearestExitFromEntrance: AlgorithmDefinition = {
  id: 'nearest-exit-from-entrance',
  title: 'Nearest Exit from Entrance in Maze',
  leetcodeNumber: 1926,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a maze represented as a grid where "." is empty and "+" is a wall, find the nearest exit from the entrance cell. An exit is any empty cell on the border that is not the entrance. Uses multi-source BFS to find the shortest path in terms of steps.',
  tags: ['graph', 'bfs', 'shortest path', 'maze', 'grid'],

  code: {
    pseudocode: `function nearestExit(maze, entrance):
  rows, cols = dimensions of maze
  queue = [(entrance.row, entrance.col, 0)]
  visited = set with entrance
  while queue not empty:
    r, c, steps = queue.dequeue()
    for each direction [dr, dc]:
      nr, nc = r+dr, c+dc
      if valid and not wall and not visited:
        if on border: return steps+1
        visited.add((nr, nc))
        queue.enqueue((nr, nc, steps+1))
  return -1`,

    python: `def nearestExit(maze, entrance):
    rows, cols = len(maze), len(maze[0])
    er, ec = entrance
    queue = deque([(er, ec, 0)])
    visited = {(er, ec)}
    dirs = [(-1,0),(1,0),(0,-1),(0,1)]
    while queue:
        r, c, steps = queue.popleft()
        for dr, dc in dirs:
            nr, nc = r+dr, c+dc
            if 0<=nr<rows and 0<=nc<cols and maze[nr][nc]=='.' and (nr,nc) not in visited:
                if nr==0 or nr==rows-1 or nc==0 or nc==cols-1:
                    return steps+1
                visited.add((nr,nc))
                queue.append((nr,nc,steps+1))
    return -1`,

    javascript: `function nearestExit(maze, entrance) {
  const rows = maze.length, cols = maze[0].length;
  const [er, ec] = entrance;
  const queue = [[er, ec, 0]];
  const visited = new Set([er*cols+ec]);
  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
  while (queue.length) {
    const [r, c, steps] = queue.shift();
    for (const [dr,dc] of dirs) {
      const nr=r+dr, nc=c+dc;
      if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&maze[nr][nc]==='.'&&!visited.has(nr*cols+nc)) {
        if (nr===0||nr===rows-1||nc===0||nc===cols-1) return steps+1;
        visited.add(nr*cols+nc);
        queue.push([nr,nc,steps+1]);
      }
    }
  }
  return -1;
}`,

    java: `public int nearestExit(char[][] maze, int[] entrance) {
    int rows = maze.length, cols = maze[0].length;
    Queue<int[]> queue = new LinkedList<>();
    queue.add(new int[]{entrance[0], entrance[1], 0});
    boolean[][] visited = new boolean[rows][cols];
    visited[entrance[0]][entrance[1]] = true;
    int[][] dirs = {{-1,0},{1,0},{0,-1},{0,1}};
    while (!queue.isEmpty()) {
        int[] curr = queue.poll();
        for (int[] d : dirs) {
            int nr=curr[0]+d[0], nc=curr[1]+d[1];
            if (nr>=0&&nr<rows&&nc>=0&&nc<cols&&maze[nr][nc]=='.'&&!visited[nr][nc]) {
                if (nr==0||nr==rows-1||nc==0||nc==cols-1) return curr[2]+1;
                visited[nr][nc]=true;
                queue.add(new int[]{nr,nc,curr[2]+1});
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    maze: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
    rows: 3,
    cols: 7,
    er: 1,
    ec: 2,
  },

  inputFields: [
    {
      name: 'maze',
      label: 'Maze (1=empty, 0=wall, flattened)',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      placeholder: '1,1,1,1,1,0,1,...',
      helperText: 'Flattened maze: 1 is empty (.), 0 is wall (+)',
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
      defaultValue: 7,
      placeholder: '7',
    },
    {
      name: 'er',
      label: 'Entrance Row',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'ec',
      label: 'Entrance Col',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatMaze = input.maze as number[];
    const rows = input.rows as number;
    const cols = input.cols as number;
    const er = input.er as number;
    const ec = input.ec as number;
    const steps: AlgorithmStep[] = [];

    const maze = flatMaze.slice(0, rows * cols);
    while (maze.length < rows * cols) maze.push(0);

    const isOpen = (r: number, c: number) => r >= 0 && r < rows && c >= 0 && c < cols && maze[r * cols + c] === 1;
    const isBorder = (r: number, c: number) => r === 0 || r === rows - 1 || c === 0 || c === cols - 1;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...maze],
      highlights,
      labels,
    });

    const entranceIdx = er * cols + ec;
    steps.push({
      line: 1,
      explanation: `Maze is ${rows}x${cols}. Find nearest exit from entrance (${er},${ec}). 1=empty, 0=wall.`,
      variables: { entrance: `(${er},${ec})`, rows, cols },
      visualization: makeViz({ [entranceIdx]: 'active' }, { [entranceIdx]: 'enter' }),
    });

    const visited = new Set<number>([entranceIdx]);
    const queue: [number, number, number][] = [[er, ec, 0]];
    const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    let result = -1;

    steps.push({
      line: 3,
      explanation: `Initialize BFS queue with entrance (${er},${ec}) at distance 0.`,
      variables: { queue: [`(${er},${ec},0)`] },
      visualization: makeViz({ [entranceIdx]: 'current' }, { [entranceIdx]: 'start' }),
    });

    while (queue.length > 0 && result === -1) {
      const [r, c, dist] = queue.shift()!;
      const idx = r * cols + c;

      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'visited'; }
      hl[idx] = 'active';
      lb[idx] = `d=${dist}`;
      hl[entranceIdx] = 'pointer';
      lb[entranceIdx] = 'E';

      steps.push({
        line: 5,
        explanation: `Process cell (${r},${c}) at distance ${dist}. Check 4 neighbors.`,
        variables: { row: r, col: c, dist, queueSize: queue.length },
        visualization: makeViz(hl, lb),
      });

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const nIdx = nr * cols + nc;

        if (!isOpen(nr, nc) || visited.has(nIdx)) continue;

        if (isBorder(nr, nc) && nIdx !== entranceIdx) {
          result = dist + 1;
          const rhl = { ...hl };
          const rlb = { ...lb };
          rhl[nIdx] = 'found';
          rlb[nIdx] = `EXIT! d=${result}`;

          steps.push({
            line: 7,
            explanation: `Cell (${nr},${nc}) is on the border and is an empty cell. Exit found! Distance = ${result}.`,
            variables: { exitRow: nr, exitCol: nc, distance: result },
            visualization: makeViz(rhl, rlb),
          });
          break;
        }

        visited.add(nIdx);
        queue.push([nr, nc, dist + 1]);

        const nhl = { ...hl };
        const nlb = { ...lb };
        nhl[nIdx] = 'comparing';
        nlb[nIdx] = `d=${dist + 1}`;

        steps.push({
          line: 8,
          explanation: `Enqueue (${nr},${nc}) at distance ${dist + 1}.`,
          variables: { next: `(${nr},${nc})`, distance: dist + 1 },
          visualization: makeViz(nhl, nlb),
        });
      }
    }

    if (result === -1) {
      steps.push({
        line: 10,
        explanation: `BFS exhausted with no exit found. Return -1.`,
        variables: { result: -1 },
        visualization: makeViz(
          Object.fromEntries([...visited].map(v => [v, 'mismatch'])),
          { [entranceIdx]: 'no exit' }
        ),
      });
    }

    return steps;
  },
};

export default nearestExitFromEntrance;
