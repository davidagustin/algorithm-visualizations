import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const matrixInfection: AlgorithmDefinition = {
  id: 'matrix-infection',
  title: 'Matrix Infection',
  leetcodeNumber: 994,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a grid where 2 = rotten orange, 1 = fresh orange, 0 = empty, every minute each rotten orange infects adjacent fresh oranges. Return the minimum minutes until all oranges are rotten, or -1 if impossible. Uses multi-source BFS.',
  tags: ['Graph', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function orangesRotting(grid):
  queue = all cells with value 2
  fresh = count of cells with value 1
  minutes = 0
  while queue not empty and fresh > 0:
    minutes += 1
    for each cell in current queue level:
      (r, c) = queue.dequeue()
      for each neighbor (nr, nc):
        if in bounds and grid[nr][nc] == 1:
          grid[nr][nc] = 2
          fresh -= 1
          queue.enqueue((nr, nc))
  return fresh == 0 ? minutes : -1`,
    python: `def orangesRotting(grid):
    rows, cols = len(grid), len(grid[0])
    queue = deque()
    fresh = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 2:
                queue.append((r, c))
            elif grid[r][c] == 1:
                fresh += 1
    minutes = 0
    while queue and fresh > 0:
        minutes += 1
        for _ in range(len(queue)):
            r, c = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = r+dr, c+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]==1:
                    grid[nr][nc] = 2
                    fresh -= 1
                    queue.append((nr, nc))
    return minutes if fresh == 0 else -1`,
    javascript: `function orangesRotting(grid) {
  const rows = grid.length, cols = grid[0].length;
  const queue = [];
  let fresh = 0;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 2) queue.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  let minutes = 0;
  while (queue.length > 0 && fresh > 0) {
    minutes++;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const [r, c] = queue.shift();
      for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr = r+dr, nc = c+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]===1) {
          grid[nr][nc] = 2;
          fresh--;
          queue.push([nr, nc]);
        }
      }
    }
  }
  return fresh === 0 ? minutes : -1;
}`,
    java: `public int orangesRotting(int[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    Queue<int[]> queue = new LinkedList<>();
    int fresh = 0;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == 2) queue.add(new int[]{r, c});
            else if (grid[r][c] == 1) fresh++;
        }
    int minutes = 0;
    while (!queue.isEmpty() && fresh > 0) {
        minutes++;
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            int[] cell = queue.poll();
            int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
            for (int[] d : dirs) {
                int nr = cell[0]+d[0], nc = cell[1]+d[1];
                if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]==1) {
                    grid[nr][nc] = 2;
                    fresh--;
                    queue.add(new int[]{nr, nc});
                }
            }
        }
    }
    return fresh == 0 ? minutes : -1;
}`,
  },
  defaultInput: {
    grid: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid (2=rotten, 1=fresh, 0=empty)',
      type: 'array',
      defaultValue: [[2, 1, 1], [1, 1, 0], [0, 1, 1]],
      placeholder: '[[2,1,1],[1,1,0],[0,1,1]]',
      helperText: '2D grid: 2=rotten orange, 1=fresh orange, 0=empty cell',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => {
      const arr: number[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          arr.push(grid[r][c]);
      return arr;
    };

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      minutes: number,
      fresh: number
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(r, c);
          if (grid[r][c] === 2) baseHighlights[i] = 'swapping';
          else if (grid[r][c] === 1) baseHighlights[i] = 'found';
        }
      }
      return {
        type: 'array',
        array: flat(),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'BFS State',
          entries: [
            { key: 'Minute', value: String(minutes) },
            { key: 'Fresh Left', value: String(fresh) },
            { key: 'Grid', value: `${rows}x${cols}` },
          ],
        },
      };
    }

    // Find initial rotten and count fresh
    const queue: [number, number][] = [];
    let fresh = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 2) queue.push([r, c]);
        else if (grid[r][c] === 1) fresh++;
      }
    }

    steps.push({
      line: 1,
      explanation: `Initialize: found ${queue.length} rotten orange(s) and ${fresh} fresh orange(s). Enqueue all rotten oranges for multi-source BFS.`,
      variables: { rotten: queue.length, fresh, minutes: 0 },
      visualization: makeViz({}, {}, 0, fresh),
    });

    let minutes = 0;

    while (queue.length > 0 && fresh > 0) {
      minutes++;
      const size = queue.length;

      steps.push({
        line: 5,
        explanation: `Minute ${minutes}: processing ${size} rotten orange(s) from the queue. They will infect adjacent fresh oranges.`,
        variables: { minutes, queueSize: size, fresh },
        visualization: makeViz({}, {}, minutes, fresh),
      });

      const newlyInfected: [number, number][] = [];

      for (let i = 0; i < size; i++) {
        const [r, c] = queue.shift()!;
        const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
            grid[nr][nc] = 2;
            fresh--;
            queue.push([nr, nc]);
            newlyInfected.push([nr, nc]);
          }
        }
      }

      if (newlyInfected.length > 0) {
        const newHighlights: Record<number, string> = {};
        const newLabels: Record<number, string> = {};
        for (const [nr, nc] of newlyInfected) {
          newHighlights[idx(nr, nc)] = 'active';
          newLabels[idx(nr, nc)] = `m${minutes}`;
        }
        steps.push({
          line: 12,
          explanation: `Minute ${minutes}: infected ${newlyInfected.length} fresh orange(s) at ${newlyInfected.map(([r, c]) => `(${r},${c})`).join(', ')}. Fresh remaining: ${fresh}.`,
          variables: { minutes, newlyInfected: newlyInfected.length, fresh },
          visualization: makeViz(newHighlights, newLabels, minutes, fresh),
        });
      }
    }

    // Final result
    const result = fresh === 0 ? minutes : -1;
    steps.push({
      line: 13,
      explanation: fresh === 0
        ? `All oranges rotten after ${minutes} minute(s). Return ${minutes}.`
        : `Cannot infect all oranges. ${fresh} fresh orange(s) remain unreachable. Return -1.`,
      variables: { result, minutes, fresh },
      visualization: makeViz({}, {}, minutes, fresh),
    });

    return steps;
  },
};

export default matrixInfection;
