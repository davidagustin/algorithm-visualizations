import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const crosswordPuzzleSolver: AlgorithmDefinition = {
  id: 'crossword-puzzle-solver',
  title: 'Crossword Puzzle Solver',
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given a crossword grid with some letters pre-filled and some slots to fill, and a word list, determine if the words can be placed to fill all empty slots. Uses backtracking to place words horizontally and vertically, checking that placements are consistent with pre-filled letters and existing placements.',
  tags: ['backtracking', 'string', 'constraint satisfaction', 'grid', 'recursion'],

  code: {
    pseudocode: `function solveCrossword(grid, words):
  slots = extractSlots(grid)
  words = sort by length
  return backtrack(slots, words, 0, {})

function backtrack(slots, words, index, assignments):
  if index == length(slots): return all words placed
  slot = slots[index]
  for word in words:
    if word not used and fits(slot, word, grid):
      assignments[slot] = word
      place(word, slot, grid)
      if backtrack(slots, words, index+1, assignments): return true
      unplace(word, slot, grid)
      delete assignments[slot]
  return false

function fits(slot, word, grid):
  if slot.length != word.length: return false
  for each position: if grid has letter and letter != word[pos]: return false
  return true`,

    python: `def solve_crossword(grid, words):
    rows = len(grid)
    cols = len(grid[0])
    slots = []
    # Extract horizontal slots
    for r in range(rows):
        start = -1
        for c in range(cols + 1):
            cell = grid[r][c] if c < cols else '#'
            if cell != '#' and start == -1:
                start = c
            elif cell == '#' and start != -1:
                if c - start > 1:
                    slots.append(('H', r, start, c - start))
                start = -1
    used = set()
    def fits(slot, word):
        direction, r, c, length = slot
        if length != len(word):
            return False
        for i, ch in enumerate(word):
            gr = r + (i if direction == 'V' else 0)
            gc = c + (i if direction == 'H' else 0)
            if grid[gr][gc] not in ('.', ch):
                return False
        return True
    def place(slot, word, val):
        direction, r, c, _ = slot
        for i, ch in enumerate(word):
            gr = r + (i if direction == 'V' else 0)
            gc = c + (i if direction == 'H' else 0)
            grid[gr][gc] = val if val else '.'
    def backtrack(idx):
        if idx == len(slots):
            return True
        slot = slots[idx]
        for word in words:
            if word not in used and fits(slot, word):
                used.add(word)
                orig = [grid[slot[1] + (i if slot[0]=='V' else 0)][slot[2] + (i if slot[0]=='H' else 0)] for i in range(slot[3])]
                place(slot, word, word)
                if backtrack(idx + 1):
                    return True
                used.discard(word)
                for i, ch in enumerate(orig):
                    gr = slot[1] + (i if slot[0]=='V' else 0)
                    gc = slot[2] + (i if slot[0]=='H' else 0)
                    grid[gr][gc] = ch
        return False
    return backtrack(0)`,

    javascript: `function solveCrossword(grid, words) {
  // Extract slots, then backtrack placing words
  const slots = extractSlots(grid);
  const used = new Set();
  function fits(slot, word) {
    if (slot.length !== word.length) return false;
    for (let i = 0; i < word.length; i++) {
      const cell = slot.direction === 'H'
        ? grid[slot.row][slot.col + i]
        : grid[slot.row + i][slot.col];
      if (cell !== '.' && cell !== word[i]) return false;
    }
    return true;
  }
  function backtrack(idx) {
    if (idx === slots.length) return true;
    for (const word of words) {
      if (!used.has(word) && fits(slots[idx], word)) {
        used.add(word); placeWord(slots[idx], word, grid);
        if (backtrack(idx + 1)) return true;
        used.delete(word); removeWord(slots[idx], word, grid);
      }
    }
    return false;
  }
  return backtrack(0);
}`,

    java: `// Crossword solver uses slot extraction + backtracking
// Each slot tracks direction (H/V), start position, length
// Fits check: length match + no letter conflict
// Place/unplace: write/erase letters in the grid`,
  },

  defaultInput: {
    grid: [
      ['#', 'W', '#'],
      ['C', 'A', 'T'],
      ['#', 'R', '#'],
    ],
    words: ['CAT', 'WAR'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words to Place',
      type: 'array',
      defaultValue: ['CAT', 'WAR'],
      placeholder: 'CAT,WAR',
      helperText: 'Comma-separated words to fill the crossword',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = (input.words as string[]).map(w => w.toUpperCase());
    const grid = (input.grid as string[][]) || [
      ['#', 'W', '#'],
      ['C', 'A', 'T'],
      ['#', 'R', '#'],
    ];
    const rows = grid.length;
    const cols = grid[0].length;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Crossword solver: ${rows}x${cols} grid with words [${words.map(w => `"${w}"`).join(', ')}]. Finding valid placements.`,
      variables: { words, gridSize: `${rows}x${cols}` },
      visualization: {
        type: 'array',
        array: grid.flat().map((_, i) => i),
        highlights: {},
        labels: grid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    type Slot = { direction: 'H' | 'V'; row: number; col: number; length: number };
    const slots: Slot[] = [];

    for (let r = 0; r < rows; r++) {
      let start = -1;
      for (let c = 0; c <= cols; c++) {
        const cell = c < cols ? grid[r][c] : '#';
        if (cell !== '#' && start === -1) start = c;
        else if (cell === '#' && start !== -1) {
          if (c - start > 1) slots.push({ direction: 'H', row: r, col: start, length: c - start });
          start = -1;
        }
      }
    }

    for (let c = 0; c < cols; c++) {
      let start = -1;
      for (let r = 0; r <= rows; r++) {
        const cell = r < rows ? grid[r][c] : '#';
        if (cell !== '#' && start === -1) start = r;
        else if (cell === '#' && start !== -1) {
          if (r - start > 1) slots.push({ direction: 'V', row: start, col: c, length: r - start });
          start = -1;
        }
      }
    }

    steps.push({
      line: 2,
      explanation: `Extracted ${slots.length} slots from grid: [${slots.map(s => `${s.direction}(${s.row},${s.col})len=${s.length}`).join(', ')}]. Now matching words to slots.`,
      variables: { slots: slots.map(s => `${s.direction}@(${s.row},${s.col})`) },
      visualization: {
        type: 'array',
        array: slots.map((_, i) => i + 1),
        highlights: slots.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
        labels: slots.reduce((acc, s, i) => ({ ...acc, [i]: `${s.direction}:${s.length}` }), {} as Record<number, string>),
      },
    });

    const localGrid = grid.map(r => [...r]);
    const used = new Set<string>();
    let solved = false;

    function fits(slot: Slot, word: string): boolean {
      if (slot.length !== word.length) return false;
      for (let i = 0; i < word.length; i++) {
        const r = slot.direction === 'V' ? slot.row + i : slot.row;
        const c = slot.direction === 'H' ? slot.col + i : slot.col;
        const cell = localGrid[r][c];
        if (cell !== '.' && cell !== word[i]) return false;
      }
      return true;
    }

    function placeWord(slot: Slot, word: string) {
      for (let i = 0; i < word.length; i++) {
        const r = slot.direction === 'V' ? slot.row + i : slot.row;
        const c = slot.direction === 'H' ? slot.col + i : slot.col;
        localGrid[r][c] = word[i];
      }
    }

    function removeWord(slot: Slot, original: string[]) {
      for (let i = 0; i < slot.length; i++) {
        const r = slot.direction === 'V' ? slot.row + i : slot.row;
        const c = slot.direction === 'H' ? slot.col + i : slot.col;
        localGrid[r][c] = original[i];
      }
    }

    function backtrack(idx: number): boolean {
      if (idx === slots.length) {
        solved = true;
        steps.push({
          line: 10,
          explanation: `All slots filled! Crossword solved successfully.`,
          variables: { solved: true },
          visualization: {
            type: 'array',
            array: localGrid.flat().map((_, i) => i),
            highlights: localGrid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c !== '#' ? 'found' : 'default' }), {}),
            labels: localGrid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
          },
        });
        return true;
      }

      const slot = slots[idx];

      for (const word of words) {
        if (!used.has(word)) {
          if (fits(slot, word)) {
            const orig = Array.from({ length: slot.length }, (_, i) => {
              const r = slot.direction === 'V' ? slot.row + i : slot.row;
              const c = slot.direction === 'H' ? slot.col + i : slot.col;
              return localGrid[r][c];
            });

            used.add(word);
            placeWord(slot, word);

            steps.push({
              line: 13,
              explanation: `Place "${word}" at slot ${idx + 1} (${slot.direction} at (${slot.row},${slot.col})). Fits and no conflicts.`,
              variables: { word, slotIndex: idx + 1, direction: slot.direction, position: `(${slot.row},${slot.col})` },
              visualization: {
                type: 'array',
                array: localGrid.flat().map((_, i) => i),
                highlights: localGrid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c !== '#' ? 'active' : 'default' }), {}),
                labels: localGrid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
              },
            });

            if (backtrack(idx + 1)) return true;

            used.delete(word);
            removeWord(slot, orig);

            steps.push({
              line: 16,
              explanation: `Backtrack: remove "${word}" from slot ${idx + 1}. Try next word.`,
              variables: { removed: word, slotIndex: idx + 1 },
              visualization: {
                type: 'array',
                array: localGrid.flat().map((_, i) => i),
                highlights: localGrid.flat().reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
                labels: localGrid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
              },
            });
          } else {
            steps.push({
              line: 12,
              explanation: `"${word}" does not fit slot ${idx + 1}: length ${word.length} vs slot ${slot.length}, or letter conflict.`,
              variables: { word, slotLength: slot.length, wordLength: word.length, reason: 'no fit' },
              visualization: {
                type: 'array',
                array: words.map((_, i) => i + 1),
                highlights: { [words.indexOf(word)]: 'mismatch' },
                labels: words.reduce((acc, w, i) => ({ ...acc, [i]: w }), {} as Record<number, string>),
              },
            });
          }
        }
      }

      return false;
    }

    backtrack(0);

    if (!solved) {
      steps.push({
        line: 5,
        explanation: `No valid crossword solution found with the given words.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: grid.flat().map((_, i) => i),
          highlights: grid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c !== '#' ? 'mismatch' : 'default' }), {}),
          labels: grid.flat().reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
        },
      });
    }

    return steps;
  },
};

export default crosswordPuzzleSolver;
