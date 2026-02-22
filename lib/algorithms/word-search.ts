import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wordSearch: AlgorithmDefinition = {
  id: 'word-search',
  title: 'Word Search',
  leetcodeNumber: 79,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an m x n board of characters and a word, return true if the word exists in the grid. The word must be constructed from letters of sequentially adjacent cells (horizontally or vertically). The same cell may not be used more than once. Uses DFS backtracking.',
  tags: ['Graph', 'DFS', 'Backtracking', 'Matrix'],
  code: {
    pseudocode: `function exist(board, word):
  for each cell (r, c):
    if dfs(board, word, r, c, 0): return true
  return false

function dfs(board, word, r, c, index):
  if index == len(word): return true
  if out of bounds or board[r][c] != word[index]: return false
  temp = board[r][c]
  board[r][c] = '#'  // mark visited
  found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)
  board[r][c] = temp  // restore
  return found`,
    python: `def exist(board, word):
    rows, cols = len(board), len(board[0])
    def dfs(r, c, i):
        if i == len(word): return True
        if r<0 or r>=rows or c<0 or c>=cols or board[r][c]!=word[i]: return False
        tmp, board[r][c] = board[r][c], '#'
        found = dfs(r+1,c,i+1) or dfs(r-1,c,i+1) or dfs(r,c+1,i+1) or dfs(r,c-1,i+1)
        board[r][c] = tmp
        return found
    for r in range(rows):
        for c in range(cols):
            if dfs(r, c, 0): return True
    return False`,
    javascript: `function exist(board, word) {
  const rows = board.length, cols = board[0].length;
  function dfs(r, c, i) {
    if (i === word.length) return true;
    if (r<0||r>=rows||c<0||c>=cols||board[r][c]!==word[i]) return false;
    const tmp = board[r][c]; board[r][c]='#';
    const found = dfs(r+1,c,i+1)||dfs(r-1,c,i+1)||dfs(r,c+1,i+1)||dfs(r,c-1,i+1);
    board[r][c]=tmp;
    return found;
  }
  for (let r=0;r<rows;r++) for (let c=0;c<cols;c++) if (dfs(r,c,0)) return true;
  return false;
}`,
    java: `public boolean exist(char[][] board, String word) {
    int rows=board.length,cols=board[0].length;
    for(int r=0;r<rows;r++) for(int c=0;c<cols;c++) if(dfs(board,word,r,c,0)) return true;
    return false;
}
boolean dfs(char[][]board,String word,int r,int c,int i){
    if(i==word.length()) return true;
    if(r<0||r>=board.length||c<0||c>=board[0].length||board[r][c]!=word.charAt(i)) return false;
    char tmp=board[r][c]; board[r][c]='#';
    boolean found=dfs(board,word,r+1,c,i+1)||dfs(board,word,r-1,c,i+1)||dfs(board,word,r,c+1,i+1)||dfs(board,word,r,c-1,i+1);
    board[r][c]=tmp; return found;
}`,
  },
  defaultInput: {
    board: [
      [65, 66, 67, 69],
      [83, 70, 67, 83],
      [65, 68, 69, 69],
    ],
    word: 'ABCCED',
  },
  inputFields: [
    {
      name: 'board',
      label: 'Board (ASCII codes: A=65,B=66,C=67,D=68,E=69,F=70,S=83)',
      type: 'array',
      defaultValue: [
        [65, 66, 67, 69],
        [83, 70, 67, 83],
        [65, 68, 69, 69],
      ],
      placeholder: '[[65,66,67],[83,70,67],[65,68,69]]',
      helperText: 'Use ASCII codes for characters (A=65, B=66, ...)',
    },
    {
      name: 'word',
      label: 'Word to Search',
      type: 'string',
      defaultValue: 'ABCCED',
      placeholder: 'ABCCED',
      helperText: 'The word to find in the board',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoard = input.board as number[][];
    const word = input.word as string;
    const rows = rawBoard.length;
    const cols = rawBoard[0].length;
    // Convert ASCII codes to chars for the board
    const board = rawBoard.map(row => row.map(v => String.fromCharCode(v)));
    const steps: AlgorithmStep[] = [];

    const idx = (r: number, c: number) => r * cols + c;
    const flat = () => board.flat().map(ch => ch === '#' ? -1 : ch.charCodeAt(0));

    const path: Set<number> = new Set();
    let foundResult = false;

    function makeViz(highlights: Record<number, string>, charIndex: number, found: boolean | null): ArrayVisualization {
      return {
        type: 'array',
        array: flat(),
        highlights,
        labels: Object.fromEntries(
          Array.from({ length: rows * cols }, (_, i) => {
            const ch = board[Math.floor(i / cols)][i % cols];
            return [i, ch === '#' ? '#' : ch];
          })
        ),
        auxData: {
          label: 'Word Search',
          entries: [
            { key: 'Word', value: word },
            { key: 'Matching', value: `"${word.slice(0, charIndex)}"` },
            { key: 'Remaining', value: `"${word.slice(charIndex)}"` },
            { key: 'Found', value: found === null ? 'searching...' : String(found) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Search for word "${word}" in ${rows}x${cols} board. Try DFS from every cell. Board uses ASCII codes (shown as letters in labels).`,
      variables: { word, rows, cols },
      visualization: makeViz({}, 0, null),
    });

    function dfs(r: number, c: number, charIndex: number): boolean {
      if (charIndex === word.length) return true;
      if (r < 0 || r >= rows || c < 0 || c >= cols || board[r][c] !== word[charIndex]) return false;

      const i = idx(r, c);
      const tmp = board[r][c];
      board[r][c] = '#';
      path.add(i);

      const hlActive: Record<number, string> = {};
      for (const pi of path) hlActive[pi] = 'match';
      hlActive[i] = 'active';

      steps.push({
        line: 6,
        explanation: `DFS at (${r},${c})='${tmp}' matches word[${charIndex}]='${word[charIndex]}'. Matched ${charIndex + 1}/${word.length} chars. Explore neighbors.`,
        variables: { r, c, charIndex, char: tmp },
        visualization: makeViz(hlActive, charIndex + 1, null),
      });

      const found = dfs(r + 1, c, charIndex + 1)
        || dfs(r - 1, c, charIndex + 1)
        || dfs(r, c + 1, charIndex + 1)
        || dfs(r, c - 1, charIndex + 1);

      board[r][c] = tmp;
      path.delete(i);

      if (!found) {
        const hlBacktrack: Record<number, string> = {};
        for (const pi of path) hlBacktrack[pi] = 'match';
        hlBacktrack[i] = 'mismatch';
        steps.push({
          line: 9,
          explanation: `Backtrack from (${r},${c}): no valid path found. Restore '${tmp}'.`,
          variables: { r, c, charIndex },
          visualization: makeViz(hlBacktrack, charIndex, null),
        });
      }

      return found;
    }

    for (let r = 0; r < rows && !foundResult; r++) {
      for (let c = 0; c < cols && !foundResult; c++) {
        steps.push({
          line: 2,
          explanation: `Try starting DFS from cell (${r},${c})='${board[r][c]}'. First letter needed: '${word[0]}'.`,
          variables: { r, c, startChar: board[r][c] },
          visualization: makeViz({ [idx(r, c)]: 'comparing' }, 0, null),
        });

        if (dfs(r, c, 0)) {
          foundResult = true;
          const finalHL: Record<number, string> = {};
          for (let ri = 0; ri < rows; ri++) {
            for (let ci = 0; ci < cols; ci++) {
              finalHL[idx(ri, ci)] = 'visited';
            }
          }
          steps.push({
            line: 3,
            explanation: `Word "${word}" found starting at (${r},${c})!`,
            variables: { result: true, startR: r, startC: c },
            visualization: makeViz(finalHL, word.length, true),
          });
          return steps;
        }
      }
    }

    steps.push({
      line: 4,
      explanation: `Exhausted all starting positions. Word "${word}" not found in the board.`,
      variables: { result: false },
      visualization: makeViz({}, 0, false),
    });

    return steps;
  },
};

export default wordSearch;
