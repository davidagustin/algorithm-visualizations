import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countIslands: AlgorithmDefinition = {
  id: 'count-islands',
  title: 'Count Islands',
  leetcodeNumber: 200,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an m x n 2D grid of "1"s (land) and "0"s (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. We use BFS/DFS to flood-fill each island.',
  tags: ['Graph', 'BFS', 'DFS', 'Matrix'],
  code: {
    pseudocode: `function numIslands(grid):
  rows = grid.length
  cols = grid[0].length
  count = 0
  for r from 0 to rows-1:
    for c from 0 to cols-1:
      if grid[r][c] == "1":
        count += 1
        bfs(grid, r, c)
  return count

function bfs(grid, r, c):
  queue = [(r, c)]
  grid[r][c] = "0"
  while queue not empty:
    (cr, cc) = queue.dequeue()
    for each neighbor (nr, nc):
      if in bounds and grid[nr][nc] == "1":
        grid[nr][nc] = "0"
        queue.enqueue((nr, nc))`,
    python: `def numIslands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0
    def bfs(r, c):
        queue = deque([(r, c)])
        grid[r][c] = "0"
        while queue:
            cr, cc = queue.popleft()
            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
                nr, nc = cr+dr, cc+dc
                if 0<=nr<rows and 0<=nc<cols and grid[nr][nc]=="1":
                    grid[nr][nc] = "0"
                    queue.append((nr, nc))
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == "1":
                count += 1
                bfs(r, c)
    return count`,
    javascript: `function numIslands(grid) {
  const rows = grid.length, cols = grid[0].length;
  let count = 0;
  function bfs(r, c) {
    const queue = [[r, c]];
    grid[r][c] = "0";
    while (queue.length > 0) {
      const [cr, cc] = queue.shift();
      for (const [dr, dc] of [[0,1],[0,-1],[1,0],[-1,0]]) {
        const nr = cr+dr, nc = cc+dc;
        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]==="1") {
          grid[nr][nc] = "0";
          queue.push([nr, nc]);
        }
      }
    }
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (grid[r][c] === "1") { count++; bfs(r, c); }
  return count;
}`,
    java: `public int numIslands(char[][] grid) {
    int rows = grid.length, cols = grid[0].length;
    int count = 0;
    for (int r = 0; r < rows; r++) {
        for (int c = 0; c < cols; c++) {
            if (grid[r][c] == '1') {
                count++;
                Queue<int[]> queue = new LinkedList<>();
                queue.add(new int[]{r, c});
                grid[r][c] = '0';
                while (!queue.isEmpty()) {
                    int[] cell = queue.poll();
                    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};
                    for (int[] d : dirs) {
                        int nr = cell[0]+d[0], nc = cell[1]+d[1];
                        if (nr>=0 && nr<rows && nc>=0 && nc<cols && grid[nr][nc]=='1') {
                            grid[nr][nc] = '0';
                            queue.add(new int[]{nr, nc});
                        }
                    }
                }
            }
        }
    }
    return count;
}`,
  },
  defaultInput: {
    grid: [
      [1, 1, 0, 0, 0],
      [1, 1, 0, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 1, 1],
    ],
  },
  inputFields: [
    {
      name: 'grid',
      label: 'Grid (1=land, 0=water)',
      type: 'array',
      defaultValue: [
        [1, 1, 0, 0, 0],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 0, 0],
        [0, 0, 0, 1, 1],
      ],
      placeholder: '[[1,1,0],[1,0,0],[0,0,1]]',
      helperText: '2D grid of 1s (land) and 0s (water)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawGrid = input.grid as number[][];
    const rows = rawGrid.length;
    const cols = rawGrid[0].length;
    const grid = rawGrid.map(row => [...row]);
    const steps: AlgorithmStep[] = [];

    const flat = () => {
      const arr: number[] = [];
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++)
          arr.push(grid[r][c]);
      return arr;
    };

    const idx = (r: number, c: number) => r * cols + c;

    const islandColors = ['found', 'active', 'pointer', 'comparing', 'match'];
    const cellIsland: number[][] = Array.from({ length: rows }, () => new Array(cols).fill(-1));

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      count: number
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = idx(r, c);
          if (cellIsland[r][c] >= 0) {
            baseHighlights[i] = islandColors[cellIsland[r][c] % islandColors.length];
          }
        }
      }
      return {
        type: 'array',
        array: flat(),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'Grid Info',
          entries: [
            { key: 'Dimensions', value: `${rows} x ${cols}` },
            { key: 'Islands Found', value: String(count) },
          ],
        },
      };
    }

    // Initial step
    steps.push({
      line: 1,
      explanation: `Grid is ${rows}x${cols}. Scan each cell: when we find unvisited land ("1"), start BFS to mark the entire island.`,
      variables: { rows, cols, count: 0 },
      visualization: makeViz({}, {}, 0),
    });

    let count = 0;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c] === 1) {
          count++;
          const islandId = count - 1;

          steps.push({
            line: 7,
            explanation: `Found land at (${r},${c}). This is island #${count}. Start BFS flood fill.`,
            variables: { r, c, count },
            visualization: makeViz({ [idx(r, c)]: 'swapping' }, { [idx(r, c)]: 'start' }, count),
          });

          // BFS
          const queue: [number, number][] = [[r, c]];
          grid[r][c] = 0;
          cellIsland[r][c] = islandId;

          while (queue.length > 0) {
            const [cr, cc] = queue.shift()!;
            const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
            for (const [dr, dc] of dirs) {
              const nr = cr + dr;
              const nc = cc + dc;
              if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {
                grid[nr][nc] = 0;
                cellIsland[nr][nc] = islandId;
                queue.push([nr, nc]);

                steps.push({
                  line: 17,
                  explanation: `BFS from (${cr},${cc}): found land neighbor (${nr},${nc}). Mark as visited and enqueue.`,
                  variables: { cr, cc, nr, nc, islandNumber: count, queueSize: queue.length },
                  visualization: makeViz(
                    { [idx(cr, cc)]: 'current', [idx(nr, nc)]: 'swapping' },
                    { [idx(nr, nc)]: 'new' },
                    count
                  ),
                });
              }
            }
          }

          steps.push({
            line: 8,
            explanation: `BFS complete for island #${count}. All connected land cells marked.`,
            variables: { islandNumber: count },
            visualization: makeViz({}, {}, count),
          });
        }
      }
    }

    // Final step
    steps.push({
      line: 9,
      explanation: `Scan complete. Total islands found: ${count}.`,
      variables: { result: count },
      visualization: makeViz({}, {}, count),
    });

    return steps;
  },
};

export default countIslands;
