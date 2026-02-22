import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const queensThatCanAttackTheKing: AlgorithmDefinition = {
  id: 'queens-that-can-attack-the-king',
  title: 'Queens That Can Attack the King',
  leetcodeNumber: 1222,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'On an 8x8 chessboard with queens and a king, find all queens that can directly attack the king (no other queen in between). Search in all 8 directions from the king position and return the first queen found in each direction.',
  tags: ['array', 'matrix', 'simulation', 'chess'],

  code: {
    pseudocode: `function queensAttacktheKing(queens, king):
  queenSet = set of queen positions
  result = []
  directions = 8 cardinal/diagonal directions
  for each direction (dr, dc):
    r, c = king[0]+dr, king[1]+dc
    while 0<=r<8 and 0<=c<8:
      if (r,c) in queenSet:
        result.append([r,c]); break
      r+=dr; c+=dc
  return result`,
    python: `def queensAttacktheKing(queens, king):
    queen_set = set(map(tuple, queens))
    result = []
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            if dr == 0 and dc == 0:
                continue
            r, c = king[0] + dr, king[1] + dc
            while 0 <= r < 8 and 0 <= c < 8:
                if (r, c) in queen_set:
                    result.append([r, c])
                    break
                r += dr; c += dc
    return result`,
    javascript: `function queensAttacktheKing(queens, king) {
  const queenSet = new Set(queens.map(q => q[0]*8+q[1]));
  const result = [];
  for (const dr of [-1,0,1]) {
    for (const dc of [-1,0,1]) {
      if (dr===0 && dc===0) continue;
      let r = king[0]+dr, c = king[1]+dc;
      while (r>=0 && r<8 && c>=0 && c<8) {
        if (queenSet.has(r*8+c)) { result.push([r,c]); break; }
        r+=dr; c+=dc;
      }
    }
  }
  return result;
}`,
    java: `public List<List<Integer>> queensAttacktheKing(int[][] queens, int[] king) {
    Set<Integer> queenSet = new HashSet<>();
    for (int[] q : queens) queenSet.add(q[0]*8+q[1]);
    List<List<Integer>> result = new ArrayList<>();
    for (int dr = -1; dr <= 1; dr++) {
        for (int dc = -1; dc <= 1; dc++) {
            if (dr==0 && dc==0) continue;
            int r=king[0]+dr, c=king[1]+dc;
            while (r>=0&&r<8&&c>=0&&c<8) {
                if (queenSet.contains(r*8+c)) {
                    result.add(Arrays.asList(r,c)); break;
                }
                r+=dr; c+=dc;
            }
        }
    }
    return result;
}`,
  },

  defaultInput: {
    queens: [[0, 1], [1, 0], [4, 0], [0, 4], [3, 3], [2, 4]],
    king: [0, 0],
  },

  inputFields: [
    {
      name: 'king',
      label: 'King Position [row,col]',
      type: 'array',
      defaultValue: [0, 0],
      placeholder: '0,0',
      helperText: 'King row and column (0-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const queens = [[0, 1], [1, 0], [4, 0], [0, 4], [3, 3], [2, 4]];
    const king = (input.king as number[]) || [0, 0];
    const steps: AlgorithmStep[] = [];

    // Represent the board as a 64-element flat array (visual: 0=empty, 1=queen, 2=king, 3=attacking queen)
    const board = new Array(64).fill(0);
    for (const [r, c] of queens) board[r * 8 + c] = 1;
    board[king[0] * 8 + king[1]] = 2;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...board],
      highlights,
      labels,
    });

    const queenSet = new Set(queens.map(q => q[0] * 8 + q[1]));
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: `Set up 8x8 board. King at [${king}]. ${queens.length} queens placed. Search 8 directions from king.`,
      variables: { king: king.join(','), queens: queens.length },
      visualization: makeViz(
        {
          ...Object.fromEntries(queens.map(([r, c]) => [r * 8 + c, 'comparing'])),
          [king[0] * 8 + king[1]]: 'found',
        },
        { [king[0] * 8 + king[1]]: 'K' }
      ),
    });

    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    for (const [dr, dc] of directions) {
      let r = king[0] + dr, c = king[1] + dc;
      let found = false;
      while (r >= 0 && r < 8 && c >= 0 && c < 8 && !found) {
        const idx = r * 8 + c;
        if (queenSet.has(idx)) {
          result.push([r, c]);
          found = true;
          steps.push({
            line: 8,
            explanation: `Direction [${dr},${dc}]: Found queen at [${r},${c}]. This queen can attack the king.`,
            variables: { direction: `[${dr},${dc}]`, queenAt: `[${r},${c}]` },
            visualization: makeViz(
              {
                [king[0] * 8 + king[1]]: 'found',
                [idx]: 'active',
              },
              { [king[0] * 8 + king[1]]: 'K', [idx]: 'Q' }
            ),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `Direction [${dr},${dc}]: Cell [${r},${c}] is empty, continue searching.`,
            variables: { direction: `[${dr},${dc}]`, checking: `[${r},${c}]` },
            visualization: makeViz(
              { [king[0] * 8 + king[1]]: 'found', [idx]: 'pointer' },
              { [king[0] * 8 + king[1]]: 'K' }
            ),
          });
        }
        r += dr; c += dc;
      }
    }

    steps.push({
      line: 9,
      explanation: `Found ${result.length} queens that can attack the king: ${result.map(q => `[${q}]`).join(', ')}.`,
      variables: { result: result.map(q => `[${q}]`).join(', '), count: result.length },
      visualization: makeViz(
        {
          [king[0] * 8 + king[1]]: 'found',
          ...Object.fromEntries(result.map(([r, c]) => [r * 8 + c, 'active'])),
        },
        { [king[0] * 8 + king[1]]: 'K' }
      ),
    });

    return steps;
  },
};

export default queensThatCanAttackTheKing;
