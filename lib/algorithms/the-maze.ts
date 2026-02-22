import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const theMaze: AlgorithmDefinition = {
  id: 'the-maze',
  title: 'The Maze',
  leetcodeNumber: 490,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'A ball rolls in a maze (0=empty, 1=wall) and does not stop until it hits a wall. Given start and destination, determine if the ball can stop at destination. BFS/DFS explores all positions where the ball can stop by rolling in each direction until hitting a wall.',
  tags: ['bfs', 'dfs', 'graph', 'maze', 'simulation'],

  code: {
    pseudocode: `function hasPath(maze, start, destination):
  queue = [start]
  visited = {start as tuple}
  while queue not empty:
    r, c = dequeue()
    if [r, c] == destination: return true
    for each direction (dr, dc):
      nr, nc = r, c
      while in bounds and not wall:
        nr += dr, nc += dc
      nr -= dr, nc -= dc  // step back from wall
      if (nr, nc) not in visited:
        visited.add((nr, nc))
        enqueue(nr, nc)
  return false`,

    python: `from collections import deque

def hasPath(maze, start, destination):
    m, n = len(maze), len(maze[0])
    queue = deque([tuple(start)])
    visited = {tuple(start)}
    dirs = [(0,1),(0,-1),(1,0),(-1,0)]
    while queue:
        r, c = queue.popleft()
        if [r, c] == destination:
            return True
        for dr, dc in dirs:
            nr, nc = r, c
            while 0 <= nr+dr < m and 0 <= nc+dc < n and maze[nr+dr][nc+dc] == 0:
                nr += dr
                nc += dc
            if (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc))
    return False`,

    javascript: `function hasPath(maze, start, destination) {
  const m = maze.length, n = maze[0].length;
  const queue = [start.slice()];
  const visited = new Set([start.join(',')]);
  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
  while (queue.length) {
    const [r, c] = queue.shift();
    if (r === destination[0] && c === destination[1]) return true;
    for (const [dr, dc] of dirs) {
      let nr = r, nc = c;
      while (nr+dr >= 0 && nr+dr < m && nc+dc >= 0 && nc+dc < n && maze[nr+dr][nc+dc] === 0) {
        nr += dr; nc += dc;
      }
      const key = nr + ',' + nc;
      if (!visited.has(key)) {
        visited.add(key);
        queue.push([nr, nc]);
      }
    }
  }
  return false;
}`,

    java: `public boolean hasPath(int[][] maze, int[] start, int[] destination) {
    int m = maze.length, n = maze[0].length;
    Queue<int[]> queue = new LinkedList<>();
    queue.offer(start.clone());
    boolean[][] visited = new boolean[m][n];
    visited[start[0]][start[1]] = true;
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        int r = cur[0], c = cur[1];
        if (r == destination[0] && c == destination[1]) return true;
        for (int[] d : dirs) {
            int nr = r, nc = c;
            while (nr+d[0]>=0&&nr+d[0]<m&&nc+d[1]>=0&&nc+d[1]<n&&maze[nr+d[0]][nc+d[1]]==0) {
                nr += d[0]; nc += d[1];
            }
            if (!visited[nr][nc]) {
                visited[nr][nc] = true;
                queue.offer(new int[]{nr, nc});
            }
        }
    }
    return false;
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
    const dirs = [[0,1],[0,-1],[1,0],[-1,0]];
    const dirNames = ['Right', 'Left', 'Down', 'Up'];

    steps.push({
      line: 1,
      explanation: `Ball starts at (${start[0]}, ${start[1]}), destination is (${destination[0]}, ${destination[1]}). Ball rolls until hitting a wall.`,
      variables: { start: `(${start[0]},${start[1]})`, destination: `(${destination[0]},${destination[1]})` },
      visualization: {
        type: 'array',
        array: maze.flat(),
        highlights: { [start[0] * n + start[1]]: 'active', [destination[0] * n + destination[1]]: 'pointer' },
        labels: { [start[0] * n + start[1]]: 'ball', [destination[0] * n + destination[1]]: 'dest' },
      } as ArrayVisualization,
    });

    const queue: [number, number][] = [[start[0], start[1]]];
    const visited = new Set<string>([`${start[0]},${start[1]}`]);

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;

      const highlights: Record<number, string> = {};
      visited.forEach(key => {
        const [vr, vc] = key.split(',').map(Number);
        highlights[vr * n + vc] = 'visited';
      });
      highlights[r * n + c] = 'active';
      highlights[destination[0] * n + destination[1]] = 'pointer';

      steps.push({
        line: 5,
        explanation: `Ball can stop at (${r}, ${c}). Checking if this is the destination.`,
        variables: { position: `(${r},${c})`, isDestination: r === destination[0] && c === destination[1] },
        visualization: {
          type: 'array',
          array: maze.flat(),
          highlights,
          labels: { [r * n + c]: 'ball', [destination[0] * n + destination[1]]: 'dest' },
        } as ArrayVisualization,
      });

      if (r === destination[0] && c === destination[1]) {
        steps.push({
          line: 6,
          explanation: `Ball stopped at destination (${destination[0]}, ${destination[1]})! Return true.`,
          variables: { result: true },
          visualization: {
            type: 'array',
            array: maze.flat(),
            highlights: { [r * n + c]: 'found' },
            labels: { [r * n + c]: 'FOUND!' },
          } as ArrayVisualization,
        });
        return steps;
      }

      for (let d = 0; d < dirs.length; d++) {
        const [dr, dc] = dirs[d];
        let nr = r;
        let nc = c;
        while (nr + dr >= 0 && nr + dr < m && nc + dc >= 0 && nc + dc < n && maze[nr + dr][nc + dc] === 0) {
          nr += dr;
          nc += dc;
        }
        const key = `${nr},${nc}`;
        if (!visited.has(key)) {
          visited.add(key);
          queue.push([nr, nc]);
          steps.push({
            line: 8,
            explanation: `Rolling ${dirNames[d]}: ball stops at (${nr}, ${nc}) after hitting wall. Add to queue.`,
            variables: { direction: dirNames[d], from: `(${r},${c})`, to: `(${nr},${nc})` },
            visualization: {
              type: 'array',
              array: maze.flat(),
              highlights: { [r * n + c]: 'active', [nr * n + nc]: 'comparing' },
              labels: { [r * n + c]: 'from', [nr * n + nc]: 'stop' },
            } as ArrayVisualization,
          });
        }
      }

      if (steps.length > 18) break;
    }

    steps.push({
      line: 11,
      explanation: `BFS exhausted. Ball cannot stop at destination (${destination[0]}, ${destination[1]}). Return false.`,
      variables: { result: false },
      visualization: {
        type: 'array',
        array: maze.flat(),
        highlights: { [destination[0] * n + destination[1]]: 'mismatch' },
        labels: { [destination[0] * n + destination[1]]: 'unreachable' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default theMaze;
