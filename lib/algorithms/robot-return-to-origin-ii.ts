import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const robotReturnToOriginII: AlgorithmDefinition = {
  id: 'robot-return-to-origin-ii',
  title: 'Robot Return to Origin II',
  leetcodeNumber: 657,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a sequence of moves (U, D, L, R), determine if a robot starting at (0,0) returns to the origin. The robot returns to origin if and only if the number of U moves equals D moves AND L moves equals R moves. O(n) time, O(1) space.',
  tags: ['Simulation', 'String'],
  code: {
    pseudocode: `function judgeCircle(moves):
  u = d = l = r = 0
  for move in moves:
    if move == 'U': u++
    elif move == 'D': d++
    elif move == 'L': l++
    elif move == 'R': r++
  return u == d and l == r`,
    python: `def judgeCircle(moves: str) -> bool:
    return moves.count('U') == moves.count('D') and moves.count('L') == moves.count('R')`,
    javascript: `function judgeCircle(moves) {
  let u = 0, d = 0, l = 0, r = 0;
  for (const move of moves) {
    if (move === 'U') u++;
    else if (move === 'D') d++;
    else if (move === 'L') l++;
    else if (move === 'R') r++;
  }
  return u === d && l === r;
}`,
    java: `public boolean judgeCircle(String moves) {
    int u = 0, d = 0, l = 0, r = 0;
    for (char c : moves.toCharArray()) {
        if (c == 'U') u++;
        else if (c == 'D') d++;
        else if (c == 'L') l++;
        else if (c == 'R') r++;
    }
    return u == d && l == r;
}`,
  },
  defaultInput: { moves: 'UDLR' },
  inputFields: [
    {
      name: 'moves',
      label: 'Moves',
      type: 'string',
      defaultValue: 'UDLR',
      placeholder: 'UDLR',
      helperText: 'String of moves: U, D, L, R',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const moves = (input.moves as string) || 'UDLR';
    const steps: AlgorithmStep[] = [];

    // Represent counts as array: [U, D, L, R]
    let u = 0, d = 0, l = 0, r = 0;
    const counts = [u, d, l, r];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...counts],
      highlights,
      labels,
      auxData: { label: 'Direction Counts', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Simulate robot moves: "${moves}". Track counts of U, D, L, R. Array indices: 0=U, 1=D, 2=L, 3=R.`,
      variables: { moves, u, d, l, r },
      visualization: makeViz(
        {},
        { 0: 'U', 1: 'D', 2: 'L', 3: 'R' },
        [{ key: 'Moves', value: moves }],
      ),
    });

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      let activeIdx = -1;
      if (move === 'U') { u++; activeIdx = 0; }
      else if (move === 'D') { d++; activeIdx = 1; }
      else if (move === 'L') { l++; activeIdx = 2; }
      else if (move === 'R') { r++; activeIdx = 3; }
      counts[0] = u; counts[1] = d; counts[2] = l; counts[3] = r;

      const hl: Record<number, string> = {};
      if (activeIdx >= 0) hl[activeIdx] = 'active';

      steps.push({
        line: 3,
        explanation: `Move ${i + 1}: '${move}'. Updated count: U=${u}, D=${d}, L=${l}, R=${r}.`,
        variables: { move, u, d, l, r, step: i + 1 },
        visualization: makeViz(
          hl,
          { 0: `U=${u}`, 1: `D=${d}`, 2: `L=${l}`, 3: `R=${r}` },
          [{ key: 'Current Move', value: move }, { key: 'Step', value: String(i + 1) }],
        ),
      });
    }

    const result = u === d && l === r;
    const finalHl: Record<number, string> = {};
    finalHl[0] = u === d ? 'found' : 'mismatch';
    finalHl[1] = u === d ? 'found' : 'mismatch';
    finalHl[2] = l === r ? 'found' : 'mismatch';
    finalHl[3] = l === r ? 'found' : 'mismatch';

    steps.push({
      line: 8,
      explanation: `Done! U(${u}) == D(${d})? ${u === d}. L(${l}) == R(${r})? ${l === r}. Returns to origin: ${result}.`,
      variables: { u, d, l, r, result },
      visualization: makeViz(
        finalHl,
        { 0: `U=${u}`, 1: `D=${d}`, 2: `L=${l}`, 3: `R=${r}` },
        [{ key: 'U=D', value: String(u === d) }, { key: 'L=R', value: String(l === r) }, { key: 'Returns to Origin', value: String(result) }],
      ),
    });

    return steps;
  },
};

export default robotReturnToOriginII;
