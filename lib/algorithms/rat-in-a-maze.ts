import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const ratInAMaze: AlgorithmDefinition = {
  id: 'rat-in-a-maze',
  title: 'Rat in a Maze',
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Classic backtracking problem: find all paths a rat can take from top-left (0,0) to bottom-right (N-1,N-1) of an N x N maze. Cells with value 1 are open, 0 are blocked. The rat can move in 4 directions (or sometimes 2). Uses DFS with backtracking and records all valid paths.',
  tags: ['backtracking', 'matrix', 'dfs', 'path finding', 'recursion'],

  code: {
    pseudocode: `function findPaths(maze, n):
  result = []
  if maze[0][0] == 0: return []
  visited = n x n grid of false
  backtrack(maze, 0, 0, n, "", visited, result)
  return result

function backtrack(maze, r, c, n, path, visited, result):
  if r == n-1 and c == n-1:
    result.push(path)
    return
  moves = [(1,0,'D'), (-1,0,'U'), (0,1,'R'), (0,-1,'L')]
  for each (dr, dc, dir) in moves:
    nr, nc = r+dr, c+dc
    if inBounds(nr, nc, n) and maze[nr][nc]==1 and not visited[nr][nc]:
      visited[nr][nc] = true
      backtrack(maze, nr, nc, n, path+dir, visited, result)
      visited[nr][nc] = false`,

    python: `def findPaths(maze):
    n = len(maze)
    if not maze[0][0]:
        return []
    result = []
    visited = [[False] * n for _ in range(n)]
    moves = [(1, 0, 'D'), (-1, 0, 'U'), (0, 1, 'R'), (0, -1, 'L')]
    def backtrack(r, c, path):
        if r == n - 1 and c == n - 1:
            result.append(path)
            return
        for dr, dc, d in moves:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < n and maze[nr][nc] and not visited[nr][nc]:
                visited[nr][nc] = True
                backtrack(nr, nc, path + d)
                visited[nr][nc] = False
    visited[0][0] = True
    backtrack(0, 0, '')
    return result`,

    javascript: `function findPaths(maze) {
  const n = maze.length;
  if (!maze[0][0]) return [];
  const result = [];
  const visited = Array.from({length: n}, () => new Array(n).fill(false));
  const moves = [[1,0,'D'],[-1,0,'U'],[0,1,'R'],[0,-1,'L']];
  function backtrack(r, c, path) {
    if (r === n-1 && c === n-1) { result.push(path); return; }
    for (const [dr, dc, d] of moves) {
      const nr = r + dr, nc = c + dc;
      if (nr>=0 && nr<n && nc>=0 && nc<n && maze[nr][nc] && !visited[nr][nc]) {
        visited[nr][nc] = true;
        backtrack(nr, nc, path + d);
        visited[nr][nc] = false;
      }
    }
  }
  visited[0][0] = true;
  backtrack(0, 0, '');
  return result;
}`,

    java: `public List<String> findPaths(int[][] maze) {
    int n = maze.length;
    List<String> result = new ArrayList<>();
    if (maze[0][0] == 0) return result;
    boolean[][] visited = new boolean[n][n];
    int[][] moves = {{1,0},{-1,0},{0,1},{0,-1}};
    char[] dirs = {'D','U','R','L'};
    backtrack(maze, 0, 0, n, new StringBuilder(), visited, moves, dirs, result);
    return result;
}`,
  },

  defaultInput: {
    maze: [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]],
  },

  inputFields: [
    {
      name: 'maze',
      label: 'Maze Grid (1=open, 0=blocked)',
      type: 'array',
      defaultValue: [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]],
      placeholder: '[[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]]',
      helperText: 'N x N grid where 1 is passable, 0 is blocked',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const maze = (input.maze as number[][]) || [[1,0,0,0],[1,1,0,1],[1,1,0,0],[0,1,1,1]];
    const n = maze.length;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];
    const visited = Array.from({ length: n }, () => new Array(n).fill(false));

    steps.push({
      line: 1,
      explanation: `Rat in a ${n}x${n} maze. Start at (0,0), goal at (${n-1},${n-1}). Finding all paths. 1=open, 0=blocked.`,
      variables: { size: n, start: '(0,0)', goal: `(${n-1},${n-1})` },
      visualization: {
        type: 'array',
        array: maze.flat(),
        highlights: { 0: 'active', [n * n - 1]: 'found' },
        labels: { 0: 'START', [n * n - 1]: 'END' },
      },
    });

    if (!maze[0][0]) {
      steps.push({
        line: 3,
        explanation: 'Starting cell (0,0) is blocked. No paths possible.',
        variables: { result: [] },
        visualization: {
          type: 'array',
          array: maze.flat(),
          highlights: { 0: 'mismatch' },
          labels: { 0: 'BLOCKED' },
        },
      });
      return steps;
    }

    const moves: [number, number, string][] = [[1, 0, 'D'], [-1, 0, 'U'], [0, 1, 'R'], [0, -1, 'L']];

    function backtrack(r: number, c: number, path: string) {
      if (r === n - 1 && c === n - 1) {
        result.push(path);
        steps.push({
          line: 9,
          explanation: `Reached goal (${n-1},${n-1})! Path: "${path}". Total paths found: ${result.length}.`,
          variables: { path, totalPaths: result.length },
          visualization: {
            type: 'array',
            array: maze.flat(),
            highlights: { 0: 'active', [n * n - 1]: 'found' },
            labels: { [n * n - 1]: path },
          },
        });
        return;
      }

      for (const [dr, dc, dir] of moves) {
        const nr = r + dr;
        const nc = c + dc;

        if (nr >= 0 && nr < n && nc >= 0 && nc < n && maze[nr][nc] === 1 && !visited[nr][nc]) {
          visited[nr][nc] = true;

          steps.push({
            line: 14,
            explanation: `Move ${dir}: (${r},${c}) -> (${nr},${nc}). Path so far: "${path + dir}".`,
            variables: { from: `(${r},${c})`, to: `(${nr},${nc})`, direction: dir, path: path + dir },
            visualization: {
              type: 'array',
              array: maze.flat(),
              highlights: {
                [r * n + c]: 'active',
                [nr * n + nc]: 'comparing',
              },
              labels: { [nr * n + nc]: dir },
            },
          });

          backtrack(nr, nc, path + dir);
          visited[nr][nc] = false;

          steps.push({
            line: 16,
            explanation: `Backtrack from (${nr},${nc}) to (${r},${c}). Unmark visited.`,
            variables: { backtrackFrom: `(${nr},${nc})`, backtrackTo: `(${r},${c})` },
            visualization: {
              type: 'array',
              array: maze.flat(),
              highlights: { [r * n + c]: 'pointer' },
              labels: { [nr * n + nc]: 'back' },
            },
          });
        }
      }
    }

    visited[0][0] = true;
    backtrack(0, 0, '');

    steps.push({
      line: 7,
      explanation: `Search complete. Found ${result.length} path(s): [${result.map(p => `"${p}"`).join(', ')}]`,
      variables: { paths: result, count: result.length },
      visualization: {
        type: 'array',
        array: maze.flat(),
        highlights: { 0: 'found', [n * n - 1]: 'found' },
        labels: { 0: 'S', [n * n - 1]: `${result.length} paths` },
      },
    });

    return steps;
  },
};

export default ratInAMaze;
