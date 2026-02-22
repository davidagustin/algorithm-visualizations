import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const robotReturnToOrigin: AlgorithmDefinition = {
  id: 'robot-return-to-origin',
  title: 'Robot Return to Origin',
  leetcodeNumber: 657,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a sequence of moves for a robot starting at the origin (0,0), determine if the robot returns to the origin after completing all moves. Moves are U (up), D (down), L (left), R (right).',
  tags: ['string', 'simulation', 'math'],

  code: {
    pseudocode: `function judgeCircle(moves):
  x = 0, y = 0
  for move in moves:
    if move == 'U': y++
    elif move == 'D': y--
    elif move == 'L': x--
    elif move == 'R': x++
  return x == 0 and y == 0`,

    python: `def judgeCircle(moves: str) -> bool:
    x, y = 0, 0
    for move in moves:
        if move == 'U': y += 1
        elif move == 'D': y -= 1
        elif move == 'L': x -= 1
        elif move == 'R': x += 1
    return x == 0 and y == 0`,

    javascript: `function judgeCircle(moves) {
  let x = 0, y = 0;
  for (const move of moves) {
    if (move === 'U') y++;
    else if (move === 'D') y--;
    else if (move === 'L') x--;
    else if (move === 'R') x++;
  }
  return x === 0 && y === 0;
}`,

    java: `public boolean judgeCircle(String moves) {
    int x = 0, y = 0;
    for (char move : moves.toCharArray()) {
        if (move == 'U') y++;
        else if (move == 'D') y--;
        else if (move == 'L') x--;
        else if (move == 'R') x++;
    }
    return x == 0 && y == 0;
}`,
  },

  defaultInput: {
    moves: 'UDLR',
  },

  inputFields: [
    {
      name: 'moves',
      label: 'Moves',
      type: 'string',
      defaultValue: 'UDLR',
      placeholder: 'UDLR',
      helperText: 'Sequence of U, D, L, R moves for the robot',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const moves = input.moves as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Robot starts at origin (0, 0). Processing ${moves.length} move(s): "${moves}"`,
      variables: { x: 0, y: 0, moves },
      visualization: {
        type: 'array',
        array: moves.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(moves.split('').map((c, i) => [i, c])),
      },
    });

    let x = 0;
    let y = 0;

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];
      const prevX = x;
      const prevY = y;

      if (move === 'U') y++;
      else if (move === 'D') y--;
      else if (move === 'L') x--;
      else if (move === 'R') x++;

      steps.push({
        line: 4,
        explanation: `Move[${i}]="${move}": (${prevX}, ${prevY}) -> (${x}, ${y})`,
        variables: { moveIndex: i, move, x, y },
        visualization: {
          type: 'array',
          array: moves.split('').map((_, idx) => idx),
          highlights: {
            [i]: 'active',
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
          },
          labels: {
            ...Object.fromEntries(moves.split('').map((c, idx) => [idx, c])),
            [i]: `${move}(${x},${y})`,
          },
        },
      });
    }

    const backAtOrigin = x === 0 && y === 0;
    steps.push({
      line: 8,
      explanation: `All moves done. Final position: (${x}, ${y}). ${backAtOrigin ? 'Robot IS back at origin (0,0)! Return true.' : `Robot is NOT at origin. x=${x}, y=${y}. Return false.`}`,
      variables: { finalX: x, finalY: y, result: backAtOrigin },
      visualization: {
        type: 'array',
        array: moves.split('').map((_, i) => i),
        highlights: Object.fromEntries(moves.split('').map((_, i) => [i, backAtOrigin ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(moves.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default robotReturnToOrigin;
