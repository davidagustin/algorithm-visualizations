import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const robotBoundedInCircle: AlgorithmDefinition = {
  id: 'robot-bounded-in-circle',
  title: 'Robot Bounded in Circle',
  leetcodeNumber: 1041,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'A robot follows instructions on an infinite plane. After one cycle, if the robot is back at origin OR not facing north, it will be bounded in a circle. Simulate one cycle and check the two conditions.',
  tags: ['math', 'simulation', 'geometry'],

  code: {
    pseudocode: `function isRobotBounded(instructions):
  dx = [0,1,0,-1], dy = [1,0,-1,0]  // N,E,S,W
  x = y = dir = 0
  for c in instructions:
    if c == 'G': x += dx[dir]; y += dy[dir]
    elif c == 'L': dir = (dir+3) % 4
    else: dir = (dir+1) % 4
  return (x==0 and y==0) or dir != 0`,

    python: `def isRobotBounded(instructions: str) -> bool:
    dx = [0, 1, 0, -1]  # N, E, S, W
    dy = [1, 0, -1, 0]
    x = y = 0; dir = 0  # 0=N,1=E,2=S,3=W
    for c in instructions:
        if c == 'G':
            x += dx[dir]; y += dy[dir]
        elif c == 'L':
            dir = (dir + 3) % 4
        else:
            dir = (dir + 1) % 4
    return (x == 0 and y == 0) or dir != 0`,

    javascript: `function isRobotBounded(instructions) {
  const dx = [0,1,0,-1], dy = [1,0,-1,0]; // N,E,S,W
  let x=0, y=0, dir=0;
  for (const c of instructions) {
    if (c==='G') { x+=dx[dir]; y+=dy[dir]; }
    else if (c==='L') dir=(dir+3)%4;
    else dir=(dir+1)%4;
  }
  return (x===0 && y===0) || dir!==0;
}`,

    java: `public boolean isRobotBounded(String instructions) {
    int[] dx = {0,1,0,-1}, dy = {1,0,-1,0};
    int x=0, y=0, dir=0;
    for (char c : instructions.toCharArray()) {
        if (c=='G') { x+=dx[dir]; y+=dy[dir]; }
        else if (c=='L') dir=(dir+3)%4;
        else dir=(dir+1)%4;
    }
    return (x==0 && y==0) || dir!=0;
}`,
  },

  defaultInput: { instructions: 'GGLLGG' },

  inputFields: [
    { name: 'instructions', label: 'Instructions', type: 'string', defaultValue: 'GGLLGG', placeholder: 'GGLLGG', helperText: 'String of G (go), L (turn left), R (turn right)' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const instructions = (input.instructions as string).toUpperCase();
    const steps: AlgorithmStep[] = [];
    const dx = [0, 1, 0, -1];
    const dy = [1, 0, -1, 0];
    const dirNames = ['N', 'E', 'S', 'W'];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Simulate "${instructions}". Robot starts at (0,0) facing North. After one cycle: bounded if back at origin OR not facing North.`,
      variables: { x: 0, y: 0, dir: 'N', instructions },
      visualization: makeViz(
        instructions.split('').map((c) => c === 'G' ? 1 : c === 'L' ? 2 : 3),
        Object.fromEntries(instructions.split('').map((_, i) => [i, 'default'])),
        Object.fromEntries(instructions.split('').map((c, i) => [i, c]))
      ),
    });

    let x = 0, y = 0, dir = 0;

    for (let i = 0; i < instructions.length; i++) {
      const c = instructions[i];
      if (c === 'G') {
        x += dx[dir];
        y += dy[dir];
        steps.push({
          line: 5,
          explanation: `'G': Move forward (facing ${dirNames[dir]}). New position: (${x},${y}).`,
          variables: { x, y, dir: dirNames[dir], step: i },
          visualization: makeViz(
            instructions.split('').map((c) => c === 'G' ? 1 : c === 'L' ? 2 : 3),
            Object.fromEntries(instructions.split('').map((_, idx) => [idx, idx === i ? 'active' : idx < i ? 'visited' : 'default'])),
            Object.fromEntries(instructions.split('').map((c, idx) => [idx, idx === i ? `(${x},${y})` : c]))
          ),
        });
      } else if (c === 'L') {
        dir = (dir + 3) % 4;
        steps.push({
          line: 6,
          explanation: `'L': Turn left. New direction: ${dirNames[dir]}.`,
          variables: { x, y, dir: dirNames[dir], step: i },
          visualization: makeViz(
            instructions.split('').map((c) => c === 'G' ? 1 : c === 'L' ? 2 : 3),
            Object.fromEntries(instructions.split('').map((_, idx) => [idx, idx === i ? 'comparing' : idx < i ? 'visited' : 'default'])),
            Object.fromEntries(instructions.split('').map((c, idx) => [idx, idx === i ? dirNames[dir] : c]))
          ),
        });
      } else {
        dir = (dir + 1) % 4;
        steps.push({
          line: 7,
          explanation: `'R': Turn right. New direction: ${dirNames[dir]}.`,
          variables: { x, y, dir: dirNames[dir], step: i },
          visualization: makeViz(
            instructions.split('').map((c) => c === 'G' ? 1 : c === 'L' ? 2 : 3),
            Object.fromEntries(instructions.split('').map((_, idx) => [idx, idx === i ? 'comparing' : idx < i ? 'visited' : 'default'])),
            Object.fromEntries(instructions.split('').map((c, idx) => [idx, idx === i ? dirNames[dir] : c]))
          ),
        });
      }
    }

    const atOrigin = x === 0 && y === 0;
    const notNorth = dir !== 0;
    const bounded = atOrigin || notNorth;

    steps.push({
      line: 8,
      explanation: `After cycle: pos=(${x},${y}), dir=${dirNames[dir]}. At origin: ${atOrigin}. Not facing N: ${notNorth}. Bounded: ${bounded}.`,
      variables: { x, y, dir: dirNames[dir], atOrigin, notNorth, result: bounded },
      visualization: makeViz(
        [x, y, dir],
        { 0: bounded ? 'found' : 'mismatch', 1: bounded ? 'found' : 'mismatch', 2: bounded ? 'found' : 'mismatch' },
        { 0: `x=${x}`, 1: `y=${y}`, 2: `dir=${dirNames[dir]}` }
      ),
    });

    return steps;
  },
};

export default robotBoundedInCircle;
