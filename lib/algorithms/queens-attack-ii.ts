import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const queensAttackIi: AlgorithmDefinition = {
  id: 'queens-attack-ii',
  title: 'Queens Attack II',
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given a chessboard of size N, a queen position, and obstacles, count how many squares the queen can attack. The queen attacks in 8 directions but is blocked by obstacles. Uses backtracking-style directional exploration: for each of 8 directions, extend until blocked by an obstacle or board boundary.',
  tags: ['backtracking', 'hash set', 'geometry', 'simulation', 'directions'],

  code: {
    pseudocode: `function queensAttack(n, obstacles, qr, qc):
  count = 0
  directions = [(0,1),(0,-1),(1,0),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]
  obstacleSet = set of (r, c) obstacles
  for each direction (dr, dc):
    r, c = qr, qc
    while (r+dr, c+dc) in bounds and not in obstacles:
      r += dr, c += dc
      count++
  return count`,

    python: `def queensAttack(n, obstacles, qr, qc):
    obstacle_set = set(map(tuple, obstacles))
    directions = [(0,1),(0,-1),(1,0),(-1,0),(1,1),(1,-1),(-1,1),(-1,-1)]
    count = 0
    for dr, dc in directions:
        r, c = qr, qc
        while True:
            r += dr
            c += dc
            if r < 1 or r > n or c < 1 or c > n:
                break
            if (r, c) in obstacle_set:
                break
            count += 1
    return count`,

    javascript: `function queensAttack(n, obstacles, qr, qc) {
  const obsSet = new Set(obstacles.map(([r, c]) => r * (n + 1) + c));
  const dirs = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
  let count = 0;
  for (const [dr, dc] of dirs) {
    let r = qr, c = qc;
    while (true) {
      r += dr; c += dc;
      if (r < 1 || r > n || c < 1 || c > n) break;
      if (obsSet.has(r * (n + 1) + c)) break;
      count++;
    }
  }
  return count;
}`,

    java: `public int queensAttack(int n, int[][] obstacles, int r, int c) {
    Set<Long> obsSet = new HashSet<>();
    for (int[] obs : obstacles) obsSet.add((long) obs[0] * (n + 1) + obs[1]);
    int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0},{1,1},{1,-1},{-1,1},{-1,-1}};
    int count = 0;
    for (int[] dir : dirs) {
        int cr = r, cc = c;
        while (true) {
            cr += dir[0]; cc += dir[1];
            if (cr < 1 || cr > n || cc < 1 || cc > n) break;
            if (obsSet.contains((long) cr * (n + 1) + cc)) break;
            count++;
        }
    }
    return count;
}`,
  },

  defaultInput: {
    n: 5,
    queenRow: 3,
    queenCol: 3,
    obstacles: [[1, 1], [5, 5], [3, 1]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Board Size (N)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'N x N chessboard size',
    },
    {
      name: 'queenRow',
      label: 'Queen Row',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Queen row position (1-indexed)',
    },
    {
      name: 'queenCol',
      label: 'Queen Column',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Queen column position (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const qr = input.queenRow as number;
    const qc = input.queenCol as number;
    const obstacles = (input.obstacles as number[][]) || [[1, 1], [5, 5], [3, 1]];
    const steps: AlgorithmStep[] = [];

    const obsSet = new Set(obstacles.map(([r, c]) => `${r},${c}`));

    steps.push({
      line: 1,
      explanation: `Queen at (${qr},${qc}) on a ${n}x${n} board. Obstacles: [${obstacles.map(([r,c]) => `(${r},${c})`).join(', ')}]. Exploring 8 directions.`,
      variables: { queenRow: qr, queenCol: qc, boardSize: n, obstacleCount: obstacles.length },
      visualization: {
        type: 'array',
        array: [n, qr, qc, obstacles.length],
        highlights: { 0: 'default', 1: 'active', 2: 'active', 3: 'mismatch' },
        labels: { 0: 'N', 1: 'row', 2: 'col', 3: 'obs' },
      },
    });

    const dirNames = ['Right', 'Left', 'Up', 'Down', 'UpRight', 'UpLeft', 'DownRight', 'DownLeft'];
    const dirs: [number, number][] = [[0,1],[0,-1],[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
    let totalCount = 0;

    for (let d = 0; d < dirs.length; d++) {
      const [dr, dc] = dirs[d];
      let r = qr, c = qc;
      let dirCount = 0;

      steps.push({
        line: 4,
        explanation: `Exploring direction ${dirNames[d]} (dr=${dr}, dc=${dc}).`,
        variables: { direction: dirNames[d], dr, dc, attackedSoFar: totalCount },
        visualization: {
          type: 'array',
          array: dirs.map((_, i) => i),
          highlights: { [d]: 'active' },
          labels: dirs.reduce((acc, _, i) => ({ ...acc, [i]: dirNames[i] }), {} as Record<number, string>),
        },
      });

      while (true) {
        r += dr;
        c += dc;

        if (r < 1 || r > n || c < 1 || c > n) {
          steps.push({
            line: 6,
            explanation: `Hit board boundary at (${r},${c}) going ${dirNames[d]}. Stopped. Attacked ${dirCount} squares in this direction.`,
            variables: { direction: dirNames[d], stoppedAt: `(${r},${c})`, dirCount, reason: 'boundary' },
            visualization: {
              type: 'array',
              array: dirs.map((_, i) => i),
              highlights: { [d]: 'sorted' },
              labels: { [d]: `${dirNames[d]}:${dirCount}` },
            },
          });
          break;
        }

        if (obsSet.has(`${r},${c}`)) {
          steps.push({
            line: 7,
            explanation: `Obstacle at (${r},${c}) blocks ${dirNames[d]} direction. Stopped. Attacked ${dirCount} squares.`,
            variables: { direction: dirNames[d], obstacle: `(${r},${c})`, dirCount, reason: 'obstacle' },
            visualization: {
              type: 'array',
              array: dirs.map((_, i) => i),
              highlights: { [d]: 'mismatch' },
              labels: { [d]: `${dirNames[d]}:${dirCount}` },
            },
          });
          break;
        }

        dirCount++;
        totalCount++;

        steps.push({
          line: 8,
          explanation: `Attacked square (${r},${c}) going ${dirNames[d]}. Direction total: ${dirCount}, overall total: ${totalCount}.`,
          variables: { attacked: `(${r},${c})`, direction: dirNames[d], dirCount, totalCount },
          visualization: {
            type: 'array',
            array: dirs.map((_, i) => i),
            highlights: { [d]: 'comparing' },
            labels: { [d]: `${dirNames[d]}:${dirCount}` },
          },
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Queen attack analysis complete. Queen at (${qr},${qc}) can attack ${totalCount} squares total.`,
      variables: { queenRow: qr, queenCol: qc, totalAttacked: totalCount },
      visualization: {
        type: 'array',
        array: dirs.map((_, i) => i),
        highlights: dirs.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: { 0: `Total: ${totalCount}` },
      },
    });

    return steps;
  },
};

export default queensAttackIi;
