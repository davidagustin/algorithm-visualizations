import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const walkingRobotSimulationII: AlgorithmDefinition = {
  id: 'walking-robot-simulation-ii',
  title: 'Walking Robot Simulation II',
  leetcodeNumber: 874,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'A robot on an infinite grid faces North, East, South, or West. Given commands (-2=left turn, -1=right turn, 1-9=move forward) and obstacle positions, simulate movement. Return the maximum Euclidean distance squared from origin. O(n+k) where n=commands, k=obstacles.',
  tags: ['Simulation', 'Hash Set', 'Array'],
  code: {
    pseudocode: `function robotSim(commands, obstacles):
  obstacleSet = set of obstacles
  dirs = [[0,1],[1,0],[0,-1],[-1,0]] // N,E,S,W
  x = y = di = 0; best = 0
  for cmd in commands:
    if cmd == -2: di = (di + 3) % 4  // turn left
    elif cmd == -1: di = (di + 1) % 4 // turn right
    else:
      for k in 1..cmd:
        nx = x + dirs[di][0]
        ny = y + dirs[di][1]
        if (nx,ny) not in obstacles:
          x, y = nx, ny
          best = max(best, x*x + y*y)
  return best`,
    python: `def robotSim(commands, obstacles):
    obstacle_set = set(map(tuple, obstacles))
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    x = y = di = 0; best = 0
    for cmd in commands:
        if cmd == -2: di = (di + 3) % 4
        elif cmd == -1: di = (di + 1) % 4
        else:
            for _ in range(cmd):
                nx, ny = x + dirs[di][0], y + dirs[di][1]
                if (nx, ny) not in obstacle_set:
                    x, y = nx, ny
                    best = max(best, x*x + y*y)
    return best`,
    javascript: `function robotSim(commands, obstacles) {
  const obstacleSet = new Set(obstacles.map(o => o[0] * 60001 + o[1]));
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  let x = 0, y = 0, di = 0, best = 0;
  for (const cmd of commands) {
    if (cmd === -2) di = (di + 3) % 4;
    else if (cmd === -1) di = (di + 1) % 4;
    else {
      for (let k = 0; k < cmd; k++) {
        const nx = x + dirs[di][0], ny = y + dirs[di][1];
        if (!obstacleSet.has(nx * 60001 + ny)) {
          x = nx; y = ny;
          best = Math.max(best, x*x + y*y);
        }
      }
    }
  }
  return best;
}`,
    java: `public int robotSim(int[] commands, int[][] obstacles) {
    Set<Long> obstacleSet = new HashSet<>();
    for (int[] o : obstacles) obstacleSet.add((long)o[0] * 60001 + o[1]);
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    int x = 0, y = 0, di = 0, best = 0;
    for (int cmd : commands) {
        if (cmd == -2) di = (di + 3) % 4;
        else if (cmd == -1) di = (di + 1) % 4;
        else for (int k = 0; k < cmd; k++) {
            int nx = x + dirs[di][0], ny = y + dirs[di][1];
            if (!obstacleSet.contains((long)nx * 60001 + ny)) {
                x = nx; y = ny;
                best = Math.max(best, x*x + y*y);
            }
        }
    }
    return best;
}`,
  },
  defaultInput: { commands: [4, -1, 3], obstacles: [] },
  inputFields: [
    {
      name: 'commands',
      label: 'Commands',
      type: 'array',
      defaultValue: [4, -1, 3],
      placeholder: '4,-1,3',
      helperText: '-2=left turn, -1=right turn, 1-9=steps forward',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const commands = input.commands as number[];
    const steps: AlgorithmStep[] = [];
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const dirNames = ['N', 'E', 'S', 'W'];
    let x = 0, y = 0, di = 0, best = 0;

    // Represent state as array: [x, y, direction_index, best_dist_sq]
    const state = [x, y, di, best];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...state],
      highlights,
      labels,
      auxData: { label: 'Robot State', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Simulate robot: commands=[${commands.join(',')}]. State: [x, y, dir, bestDist²]. Starting at (0,0) facing North.`,
      variables: { x, y, direction: dirNames[di], best },
      visualization: makeViz(
        {},
        { 0: 'x=0', 1: 'y=0', 2: 'dir=N', 3: 'best=0' },
        [{ key: 'Position', value: '(0,0)' }, { key: 'Facing', value: 'North' }],
      ),
    });

    for (let ci = 0; ci < commands.length; ci++) {
      const cmd = commands[ci];

      if (cmd === -2) {
        di = (di + 3) % 4;
        state[2] = di;
        steps.push({
          line: 5,
          explanation: `Command ${ci + 1}: Turn left. Now facing ${dirNames[di]}.`,
          variables: { command: cmd, newDirection: dirNames[di] },
          visualization: makeViz(
            { 2: 'active' },
            { 0: `x=${x}`, 1: `y=${y}`, 2: `dir=${dirNames[di]}`, 3: `best=${best}` },
            [{ key: 'Command', value: 'Turn Left' }, { key: 'Now Facing', value: dirNames[di] }],
          ),
        });
      } else if (cmd === -1) {
        di = (di + 1) % 4;
        state[2] = di;
        steps.push({
          line: 6,
          explanation: `Command ${ci + 1}: Turn right. Now facing ${dirNames[di]}.`,
          variables: { command: cmd, newDirection: dirNames[di] },
          visualization: makeViz(
            { 2: 'active' },
            { 0: `x=${x}`, 1: `y=${y}`, 2: `dir=${dirNames[di]}`, 3: `best=${best}` },
            [{ key: 'Command', value: 'Turn Right' }, { key: 'Now Facing', value: dirNames[di] }],
          ),
        });
      } else {
        for (let k = 0; k < cmd; k++) {
          const nx = x + dirs[di][0];
          const ny = y + dirs[di][1];
          x = nx; y = ny;
          best = Math.max(best, x * x + y * y);
          state[0] = x; state[1] = y; state[3] = best;

          steps.push({
            line: 10,
            explanation: `Command ${ci + 1}, step ${k + 1}/${cmd}: Move ${dirNames[di]} to (${x},${y}). Dist²=${x * x + y * y}, best=${best}.`,
            variables: { x, y, direction: dirNames[di], distSq: x * x + y * y, best },
            visualization: makeViz(
              { 0: 'active', 1: 'active', 3: best === x * x + y * y ? 'found' : 'sorted' },
              { 0: `x=${x}`, 1: `y=${y}`, 2: `dir=${dirNames[di]}`, 3: `best=${best}` },
              [{ key: 'Position', value: `(${x},${y})` }, { key: 'Dist²', value: String(x * x + y * y) }, { key: 'Best', value: String(best) }],
            ),
          });
        }
      }
    }

    steps.push({
      line: 14,
      explanation: `Done! Maximum Euclidean distance squared = ${best}.`,
      variables: { x, y, best },
      visualization: makeViz(
        { 0: 'found', 1: 'found', 3: 'found' },
        { 0: `x=${x}`, 1: `y=${y}`, 2: `dir=${dirNames[di]}`, 3: `best=${best}` },
        [{ key: 'Final Position', value: `(${x},${y})` }, { key: 'Answer', value: String(best) }],
      ),
    });

    return steps;
  },
};

export default walkingRobotSimulationII;
