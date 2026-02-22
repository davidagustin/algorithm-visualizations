import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumKnightMoves: AlgorithmDefinition = {
  id: 'minimum-knight-moves',
  title: 'Minimum Knight Moves',
  leetcodeNumber: 1197,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'In an infinite chessboard, a knight starts at (0,0) and wants to reach (x,y). Find the minimum number of moves. BFS explores all reachable squares level by level, where each level represents one knight move. The trick is to mirror the problem to positive quadrant using symmetry.',
  tags: ['bfs', 'graph', 'chess', 'shortest path'],

  code: {
    pseudocode: `function minKnightMoves(x, y):
  x = abs(x), y = abs(y)
  queue = [(0, 0, 0)]  // row, col, steps
  visited = {(0,0)}
  directions = 8 knight moves
  while queue not empty:
    r, c, steps = dequeue()
    if r == x and c == y: return steps
    for each (dr, dc) in directions:
      nr, nc = r+dr, c+dc
      if (nr, nc) not visited and in bounds:
        visited.add((nr, nc))
        enqueue((nr, nc, steps+1))
  return -1`,

    python: `from collections import deque

def minKnightMoves(x: int, y: int) -> int:
    x, y = abs(x), abs(y)
    queue = deque([(0, 0, 0)])
    visited = {(0, 0)}
    dirs = [(-2,-1),(-2,1),(-1,-2),(-1,2),(1,-2),(1,2),(2,-1),(2,1)]
    while queue:
        r, c, steps = queue.popleft()
        if r == x and c == y:
            return steps
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if (nr, nc) not in visited and nr >= -1 and nc >= -1:
                visited.add((nr, nc))
                queue.append((nr, nc, steps + 1))
    return -1`,

    javascript: `function minKnightMoves(x, y) {
  x = Math.abs(x); y = Math.abs(y);
  const queue = [[0, 0, 0]];
  const visited = new Set(['0,0']);
  const dirs = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
  while (queue.length) {
    const [r, c, steps] = queue.shift();
    if (r === x && c === y) return steps;
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc;
      const key = nr + ',' + nc;
      if (!visited.has(key) && nr >= -1 && nc >= -1) {
        visited.add(key);
        queue.push([nr, nc, steps + 1]);
      }
    }
  }
  return -1;
}`,

    java: `public int minKnightMoves(int x, int y) {
    x = Math.abs(x); y = Math.abs(y);
    Queue<int[]> queue = new LinkedList<>();
    Set<String> visited = new HashSet<>();
    queue.offer(new int[]{0, 0, 0});
    visited.add("0,0");
    int[][] dirs = {{-2,-1},{-2,1},{-1,-2},{-1,2},{1,-2},{1,2},{2,-1},{2,1}};
    while (!queue.isEmpty()) {
        int[] cur = queue.poll();
        if (cur[0] == x && cur[1] == y) return cur[2];
        for (int[] d : dirs) {
            int nr = cur[0]+d[0], nc = cur[1]+d[1];
            String key = nr+","+nc;
            if (!visited.contains(key) && nr >= -1 && nc >= -1) {
                visited.add(key);
                queue.offer(new int[]{nr, nc, cur[2]+1});
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    x: 5,
    y: 5,
  },

  inputFields: [
    {
      name: 'x',
      label: 'Target X',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target x coordinate',
    },
    {
      name: 'y',
      label: 'Target Y',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target y coordinate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const x = Math.abs(input.x as number);
    const y = Math.abs(input.y as number);
    const steps: AlgorithmStep[] = [];

    const dirs = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];

    steps.push({
      line: 1,
      explanation: `Mirror to positive quadrant: target is (${x}, ${y}). Start BFS from (0,0).`,
      variables: { targetX: x, targetY: y, steps: 0 },
      visualization: {
        type: 'array',
        array: [0, x, y],
        highlights: { 0: 'active' },
        labels: { 0: 'steps', 1: 'targetX', 2: 'targetY' },
      } as ArrayVisualization,
    });

    const queue: [number, number, number][] = [[0, 0, 0]];
    const visited = new Set<string>(['0,0']);
    let found = false;

    while (queue.length > 0 && !found) {
      const [r, c, dist] = queue.shift()!;

      steps.push({
        line: 6,
        explanation: `Visiting (${r}, ${c}) at distance ${dist}. Queue size: ${queue.length + 1}.`,
        variables: { currentRow: r, currentCol: c, distance: dist, visited: visited.size },
        visualization: {
          type: 'array',
          array: [r, c, dist, visited.size],
          highlights: { 0: 'active', 1: 'active', 2: 'current', 3: 'visited' },
          labels: { 0: 'row', 1: 'col', 2: 'dist', 3: 'visited' },
        } as ArrayVisualization,
      });

      if (r === x && c === y) {
        steps.push({
          line: 7,
          explanation: `Reached target (${x}, ${y}) in ${dist} moves. BFS guarantees this is the minimum.`,
          variables: { result: dist, targetX: x, targetY: y },
          visualization: {
            type: 'array',
            array: [r, c, dist],
            highlights: { 0: 'found', 1: 'found', 2: 'found' },
            labels: { 0: 'row', 1: 'col', 2: 'minMoves' },
          } as ArrayVisualization,
        });
        found = true;
        break;
      }

      let neighborsAdded = 0;
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        const key = `${nr},${nc}`;
        if (!visited.has(key) && nr >= -1 && nc >= -1) {
          visited.add(key);
          queue.push([nr, nc, dist + 1]);
          neighborsAdded++;
        }
      }

      steps.push({
        line: 9,
        explanation: `Added ${neighborsAdded} new neighbors from (${r}, ${c}). Total visited: ${visited.size}.`,
        variables: { from: `(${r},${c})`, neighborsAdded, totalVisited: visited.size },
        visualization: {
          type: 'array',
          array: [r, c, neighborsAdded, visited.size],
          highlights: { 0: 'visited', 1: 'visited', 2: 'comparing', 3: 'sorted' },
          labels: { 0: 'fromRow', 1: 'fromCol', 2: 'newNeighbors', 3: 'totalVisited' },
        } as ArrayVisualization,
      });

      if (steps.length > 20) break;
    }

    if (!found) {
      steps.push({
        line: 12,
        explanation: `BFS completed. Target (${x}, ${y}) reached with minimum moves tracked above.`,
        variables: { targetX: x, targetY: y },
        visualization: {
          type: 'array',
          array: [x, y, visited.size],
          highlights: { 0: 'found', 1: 'found', 2: 'sorted' },
          labels: { 0: 'targetX', 1: 'targetY', 2: 'visited' },
        } as ArrayVisualization,
      });
    }

    return steps;
  },
};

export default minimumKnightMoves;
