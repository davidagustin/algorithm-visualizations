import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordSearchMatrix: AlgorithmDefinition = {
  id: 'word-search-matrix',
  title: 'Word Search',
  leetcodeNumber: 79,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an m x n character grid and a word, return true if the word exists in the grid. The word can be constructed from adjacent (horizontally or vertically) cells. Each cell may be used only once. Use DFS/backtracking.',
  tags: ['Matrix', 'DFS', 'Backtracking'],
  code: {
    pseudocode: `function exist(board, word):
  for each cell (i,j):
    if dfs(board, i, j, 0): return true
  return false

function dfs(board, i, j, k):
  if k == len(word): return true
  if out-of-bounds or board[i][j] != word[k]: return false
  temp = board[i][j]; board[i][j] = '#'
  found = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or ...
  board[i][j] = temp
  return found`,
    python: `def exist(board, word):
    m, n = len(board), len(board[0])
    def dfs(i, j, k):
        if k == len(word): return True
        if not (0<=i<m and 0<=j<n) or board[i][j]!=word[k]: return False
        tmp, board[i][j] = board[i][j], '#'
        res = dfs(i+1,j,k+1) or dfs(i-1,j,k+1) or dfs(i,j+1,k+1) or dfs(i,j-1,k+1)
        board[i][j] = tmp
        return res
    return any(dfs(i,j,0) for i in range(m) for j in range(n))`,
    javascript: `function exist(board, word) {
  const m = board.length, n = board[0].length;
  function dfs(i, j, k) {
    if (k === word.length) return true;
    if (i<0||i>=m||j<0||j>=n||board[i][j]!==word[k]) return false;
    const tmp = board[i][j]; board[i][j] = '#';
    const res = dfs(i+1,j,k+1)||dfs(i-1,j,k+1)||dfs(i,j+1,k+1)||dfs(i,j-1,k+1);
    board[i][j] = tmp;
    return res;
  }
  for (let i=0;i<m;i++) for(let j=0;j<n;j++) if(dfs(i,j,0)) return true;
  return false;
}`,
    java: `public boolean exist(char[][] board, String word) {
    int m = board.length, n = board[0].length;
    for (int i=0;i<m;i++) for(int j=0;j<n;j++)
        if (dfs(board,word,i,j,0)) return true;
    return false;
}
boolean dfs(char[][] b, String w, int i, int j, int k) {
    if (k==w.length()) return true;
    if (i<0||i>=b.length||j<0||j>=b[0].length||b[i][j]!=w.charAt(k)) return false;
    char tmp=b[i][j]; b[i][j]='#';
    boolean r=dfs(b,w,i+1,j,k+1)||dfs(b,w,i-1,j,k+1)||dfs(b,w,i,j+1,k+1)||dfs(b,w,i,j-1,k+1);
    b[i][j]=tmp; return r;
}`,
  },
  defaultInput: {
    matrix: [['A', 'B', 'C', 'E'], ['S', 'F', 'C', 'S'], ['A', 'D', 'E', 'E']],
    word: 'ABCCED',
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Board (letters)',
      type: 'string',
      defaultValue: 'A B C E, S F C S, A D E E',
      placeholder: 'e.g. A B C E, S F C S, A D E E',
      helperText: 'Rows separated by commas, letters by spaces',
    },
    { name: 'word', label: 'Word', type: 'string', defaultValue: 'ABCCED', placeholder: 'ABCCED' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let board: string[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      board = (input.matrix as string[][]).map(r => [...r]);
    } else {
      board = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/));
    }
    const word = (input.word as string).trim();
    const m = board.length, n = board[0].length;
    const steps: AlgorithmStep[] = [];
    const path: Set<number> = new Set();
    let found = false;

    function charBoard(): number[] {
      return board.flat().map(ch => ch === '#' ? -1 : ch.charCodeAt(0) - 64);
    }

    function makeViz(curr: number, note: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      const arr = charBoard();
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${board[ri][ci]}`;
        highlights[i] = path.has(i) ? 'active' : arr[i] === -1 ? 'comparing' : 'default';
      }
      if (curr >= 0) highlights[curr] = found ? 'found' : 'current';
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: { label: 'Word Search', entries: [{ key: 'Word', value: word }, { key: 'Phase', value: note }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Search for "${word}" in ${m}x${n} board using DFS + backtracking.`,
      variables: { word, m, n },
      visualization: makeViz(-1, 'Start'),
    });

    function dfs(i: number, j: number, k: number): boolean {
      if (k === word.length) return true;
      if (i < 0 || i >= m || j < 0 || j >= n || board[i][j] !== word[k]) return false;
      const idx = i * n + j;
      path.add(idx);
      const tmp = board[i][j]; board[i][j] = '#';
      steps.push({
        line: 6,
        explanation: `Match word[${k}]='${word[k]}' at (${i},${j}). Path so far: ${word.slice(0, k + 1)}.`,
        variables: { i, j, k, char: word[k] },
        visualization: makeViz(idx, `Matched ${k + 1}/${word.length}`),
      });
      const res = dfs(i + 1, j, k + 1) || dfs(i - 1, j, k + 1) || dfs(i, j + 1, k + 1) || dfs(i, j - 1, k + 1);
      board[i][j] = tmp;
      if (!res) path.delete(idx);
      return res;
    }

    for (let i = 0; i < m && !found; i++) {
      for (let j = 0; j < n && !found; j++) {
        if (board[i][j] === word[0]) {
          found = dfs(i, j, 0);
        }
      }
    }

    steps.push({
      line: 12,
      explanation: found ? `Word "${word}" FOUND in the board!` : `Word "${word}" NOT found in the board.`,
      variables: { found },
      visualization: makeViz(-1, found ? 'FOUND' : 'NOT FOUND'),
    });

    return steps;
  },
};

export default wordSearchMatrix;
