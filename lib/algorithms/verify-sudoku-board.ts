import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const verifySudokuBoard: AlgorithmDefinition = {
  id: 'verify-sudoku-board',
  title: 'Valid Sudoku',
  leetcodeNumber: 36,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Determine if a 9x9 Sudoku board is valid. Only the filled cells need to be validated: each row, each column, and each 3x3 sub-box must contain no duplicate digits. Uses hash sets for each row, column, and box.',
  tags: ['hash set', 'matrix', 'validation'],

  code: {
    pseudocode: `function isValidSudoku(board):
  for r = 0 to 8:
    for c = 0 to 8:
      num = board[r][c]
      if num == '.': continue
      boxIdx = (r/3)*3 + (c/3)
      key_r = "row" + r + num
      key_c = "col" + c + num
      key_b = "box" + boxIdx + num
      if key_r or key_c or key_b in seen:
        return false
      add key_r, key_c, key_b to seen
  return true`,

    python: `def isValidSudoku(board: list[list[str]]) -> bool:
    seen = set()
    for r in range(9):
        for c in range(9):
            num = board[r][c]
            if num == '.':
                continue
            box = (r // 3) * 3 + c // 3
            row_key = f"r{r}{num}"
            col_key = f"c{c}{num}"
            box_key = f"b{box}{num}"
            if row_key in seen or col_key in seen or box_key in seen:
                return False
            seen.update([row_key, col_key, box_key])
    return True`,

    javascript: `function isValidSudoku(board) {
  const seen = new Set();
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const num = board[r][c];
      if (num === '.') continue;
      const box = Math.floor(r / 3) * 3 + Math.floor(c / 3);
      const rk = \`r\${r}\${num}\`;
      const ck = \`c\${c}\${num}\`;
      const bk = \`b\${box}\${num}\`;
      if (seen.has(rk) || seen.has(ck) || seen.has(bk))
        return false;
      seen.add(rk); seen.add(ck); seen.add(bk);
    }
  }
  return true;
}`,

    java: `public boolean isValidSudoku(char[][] board) {
    Set<String> seen = new HashSet<>();
    for (int r = 0; r < 9; r++) {
        for (int c = 0; c < 9; c++) {
            char num = board[r][c];
            if (num == '.') continue;
            int box = (r / 3) * 3 + c / 3;
            if (!seen.add("r" + r + num) ||
                !seen.add("c" + c + num) ||
                !seen.add("b" + box + num))
                return false;
        }
    }
    return true;
}`,
  },

  defaultInput: {
    board: [
      5, 3, 0, 0, 7, 0, 0, 0, 0,
      6, 0, 0, 1, 9, 5, 0, 0, 0,
      0, 9, 8, 0, 0, 0, 0, 6, 0,
      8, 0, 0, 0, 6, 0, 0, 0, 3,
      4, 0, 0, 8, 0, 3, 0, 0, 1,
      7, 0, 0, 0, 2, 0, 0, 0, 6,
      0, 6, 0, 0, 0, 0, 2, 8, 0,
      0, 0, 0, 4, 1, 9, 0, 0, 5,
      0, 0, 0, 0, 8, 0, 0, 7, 9,
    ],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Sudoku Board (flat)',
      type: 'array',
      defaultValue: [
        5, 3, 0, 0, 7, 0, 0, 0, 0,
        6, 0, 0, 1, 9, 5, 0, 0, 0,
        0, 9, 8, 0, 0, 0, 0, 6, 0,
        8, 0, 0, 0, 6, 0, 0, 0, 3,
        4, 0, 0, 8, 0, 3, 0, 0, 1,
        7, 0, 0, 0, 2, 0, 0, 0, 6,
        0, 6, 0, 0, 0, 0, 2, 8, 0,
        0, 0, 0, 4, 1, 9, 0, 0, 5,
        0, 0, 0, 0, 8, 0, 0, 7, 9,
      ],
      placeholder: '5,3,0,...,7,9',
      helperText: '81 integers (0 = empty cell), row by row',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.board as number[];
    const steps: AlgorithmStep[] = [];
    const seen = new Set<string>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      seenEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...flat],
      highlights,
      labels,
      auxData: {
        label: 'Seen Keys (recent)',
        entries: seenEntries.slice(-8),
      },
    });

    const getRecentEntries = (): { key: string; value: string }[] =>
      Array.from(seen).slice(-8).map(k => ({ key: k, value: 'seen' }));

    // Step: Initialize
    steps.push({
      line: 1,
      explanation: 'Validate the Sudoku board. Check each filled cell for duplicates in its row, column, and 3x3 box.',
      variables: { totalCells: 81 },
      visualization: makeViz({}, {}, []),
    });

    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        const idx = r * 9 + c;
        const num = flat[idx];
        if (num === 0) continue;

        const boxIdx = Math.floor(r / 3) * 3 + Math.floor(c / 3);
        const rk = `r${r}:${num}`;
        const ck = `c${c}:${num}`;
        const bk = `b${boxIdx}:${num}`;

        // Highlight the current cell and its row/col/box peers
        const highlights: Record<number, string> = {};
        highlights[idx] = 'active';

        // Highlight same row
        for (let cc = 0; cc < 9; cc++) {
          if (cc !== c) {
            const peer = r * 9 + cc;
            if (!highlights[peer]) highlights[peer] = 'comparing';
          }
        }
        // Highlight same column
        for (let rr = 0; rr < 9; rr++) {
          if (rr !== r) {
            const peer = rr * 9 + c;
            if (!highlights[peer]) highlights[peer] = 'comparing';
          }
        }

        if (seen.has(rk) || seen.has(ck) || seen.has(bk)) {
          const conflictKey = seen.has(rk) ? `row ${r}` : seen.has(ck) ? `col ${c}` : `box ${boxIdx}`;
          steps.push({
            line: 10,
            explanation: `Duplicate! ${num} already seen in ${conflictKey}. Board is INVALID.`,
            variables: { r, c, num, conflict: conflictKey, result: false },
            visualization: makeViz(
              { ...highlights, [idx]: 'mismatch' },
              { [idx]: `${num}!` },
              getRecentEntries()
            ),
          });
          return steps;
        }

        seen.add(rk);
        seen.add(ck);
        seen.add(bk);

        // Only show steps for filled cells to keep step count manageable
        if (steps.length < 25) {
          steps.push({
            line: 12,
            explanation: `Cell (${r},${c}) = ${num}. Added keys: row${r}:${num}, col${c}:${num}, box${boxIdx}:${num}. No conflicts.`,
            variables: { r, c, num, boxIdx },
            visualization: makeViz(
              { ...highlights, [idx]: 'match' },
              { [idx]: `${num}` },
              getRecentEntries()
            ),
          });
        }
      }
    }

    // Valid
    steps.push({
      line: 13,
      explanation: 'All filled cells validated. No duplicates found in any row, column, or box. Board is VALID!',
      variables: { result: true },
      visualization: makeViz(
        Object.fromEntries(flat.map((v, i) => [i, v !== 0 ? 'found' : 'default'])),
        {},
        getRecentEntries()
      ),
    });

    return steps;
  },
};

export default verifySudokuBoard;
