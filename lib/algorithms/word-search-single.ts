import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const wordSearchSingle: AlgorithmDefinition = {
  id: 'word-search-single',
  title: 'Word Search (Detailed Step Tracking)',
  leetcodeNumber: 79,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an m x n grid of characters and a word, return true if the word exists in the grid. The word must be constructed from sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once. Tracks every DFS step and backtrack for full visualization.',
  tags: ['backtracking', 'matrix', 'dfs', 'string', 'recursion'],

  code: {
    pseudocode: `function exist(board, word):
  for each cell (r, c):
    if dfs(board, word, 0, r, c): return true
  return false

function dfs(board, word, index, r, c):
  if index == length(word): return true
  if r/c out of bounds or board[r][c] != word[index]: return false
  temp = board[r][c]
  board[r][c] = '#' (mark visited)
  found = dfs(r-1,c) or dfs(r+1,c) or dfs(r,c-1) or dfs(r,c+1)
  board[r][c] = temp (restore)
  return found`,

    python: `def exist(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])
    def dfs(r, c, index):
        if index == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return False
        if board[r][c] != word[index]:
            return False
        temp = board[r][c]
        board[r][c] = '#'
        found = (dfs(r-1, c, index+1) or dfs(r+1, c, index+1) or
                 dfs(r, c-1, index+1) or dfs(r, c+1, index+1))
        board[r][c] = temp
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0):
                return True
    return False`,

    javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, index) {
    if (index === word.length) return true;
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    if (board[r][c] !== word[index]) return false;
    const temp = board[r][c];
    board[r][c] = '#';
    const found = dfs(r-1, c, index+1) || dfs(r+1, c, index+1) ||
                  dfs(r, c-1, index+1) || dfs(r, c+1, index+1);
    board[r][c] = temp;
    return found;
  }
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      if (dfs(r, c, 0)) return true;
  return false;
}`,

    java: `public boolean exist(char[][] board, String word) {
    int rows = board.length, cols = board[0].length;
    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (dfs(board, word, r, c, 0)) return true;
    return false;
}
private boolean dfs(char[][] board, String word, int r, int c, int idx) {
    if (idx == word.length()) return true;
    if (r < 0 || r >= board.length || c < 0 || c >= board[0].length) return false;
    if (board[r][c] != word.charAt(idx)) return false;
    char temp = board[r][c];
    board[r][c] = '#';
    boolean found = dfs(board, word, r-1, c, idx+1) || dfs(board, word, r+1, c, idx+1) ||
                    dfs(board, word, r, c-1, idx+1) || dfs(board, word, r, c+1, idx+1);
    board[r][c] = temp;
    return found;
}`,
  },

  defaultInput: {
    board: [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']],
    word: 'ABCCED',
  },

  inputFields: [
    {
      name: 'word',
      label: 'Word to Find',
      type: 'string',
      defaultValue: 'ABCCED',
      placeholder: 'ABCCED',
      helperText: 'Word to search in the grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = (input.word as string) || 'ABCCED';
    const board = (input.board as string[][]) || [
      ['A','B','C','E'],
      ['S','F','C','S'],
      ['A','D','E','E'],
    ];
    const steps: AlgorithmStep[] = [];
    const rows = board.length;
    const cols = board[0].length;
    const localBoard = board.map(r => [...r]);
    let foundPath: [number, number][] = [];
    let searchComplete = false;

    steps.push({
      line: 1,
      explanation: `Searching for word "${word}" in a ${rows}x${cols} grid. Will try DFS from each cell.`,
      variables: { word, boardSize: `${rows}x${cols}` },
      visualization: {
        type: 'array',
        array: board.flat().map((_, i) => i),
        highlights: {},
        labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function dfs(r: number, c: number, index: number, path: [number, number][]): boolean {
      if (searchComplete) return false;
      if (index === word.length) {
        foundPath = [...path];
        searchComplete = true;
        steps.push({
          line: 6,
          explanation: `Word "${word}" FOUND! Complete path traced through the grid.`,
          variables: { word, found: true, pathLength: path.length },
          visualization: {
            type: 'array',
            array: board.flat().map((_, i) => i),
            highlights: path.reduce((acc, [pr, pc]) => ({ ...acc, [pr * cols + pc]: 'found' }), {}),
            labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
          },
        });
        return true;
      }

      if (r < 0 || r >= rows || c < 0 || c >= cols || localBoard[r][c] !== word[index]) {
        return false;
      }

      const temp = localBoard[r][c];
      localBoard[r][c] = '#';
      path.push([r, c]);

      steps.push({
        line: 8,
        explanation: `Match at (${r},${c})="${temp}" for word[${index}]="${word[index]}". Path: [${path.map(([pr, pc]) => `(${pr},${pc})`).join('->')}]`,
        variables: { row: r, col: c, char: temp, wordIndex: index, pathLen: path.length },
        visualization: {
          type: 'array',
          array: board.flat().map((_, i) => i),
          highlights: {
            ...path.reduce((acc, [pr, pc]) => ({ ...acc, [pr * cols + pc]: 'active' }), {}),
            [r * cols + c]: 'current',
          },
          labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
        },
      });

      const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
      let found = false;
      for (const [dr, dc] of dirs) {
        if (dfs(r + dr, c + dc, index + 1, path)) {
          found = true;
          break;
        }
      }

      if (!found) {
        path.pop();
        localBoard[r][c] = temp;

        if (!searchComplete) {
          steps.push({
            line: 11,
            explanation: `Backtrack from (${r},${c}): no valid extension found. Restore "${temp}".`,
            variables: { row: r, col: c, restored: temp, pathLen: path.length },
            visualization: {
              type: 'array',
              array: board.flat().map((_, i) => i),
              highlights: path.reduce((acc, [pr, pc]) => ({ ...acc, [pr * cols + pc]: 'comparing' }), {}),
              labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
        }
      }

      return found;
    }

    for (let r = 0; r < rows && !searchComplete; r++) {
      for (let c = 0; c < cols && !searchComplete; c++) {
        if (localBoard[r][c] === word[0]) {
          steps.push({
            line: 2,
            explanation: `Trying start cell (${r},${c})="${board[r][c]}" which matches word[0]="${word[0]}".`,
            variables: { startRow: r, startCol: c, char: board[r][c] },
            visualization: {
              type: 'array',
              array: board.flat().map((_, i) => i),
              highlights: { [r * cols + c]: 'pointer' },
              labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
          dfs(r, c, 0, []);
        }
      }
    }

    if (!searchComplete) {
      steps.push({
        line: 4,
        explanation: `Word "${word}" NOT FOUND in the grid. All starting positions exhausted.`,
        variables: { word, found: false },
        visualization: {
          type: 'array',
          array: board.flat().map((_, i) => i),
          highlights: board.flat().reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: board.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
        },
      });
    }

    return steps;
  },
};

export default wordSearchSingle;
