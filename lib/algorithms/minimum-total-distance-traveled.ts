import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const minimumTotalDistanceTraveled: AlgorithmDefinition = {
  id: 'minimum-total-distance-traveled',
  title: 'Minimum Total Distance Traveled',
  leetcodeNumber: 2463,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Assign robots to factories to minimize total travel distance. Each factory[i] has a position and limited capacity. Sort both by position. dp[i][j] = min total distance assigning first i robots to first j factories. Transition: assign k consecutive robots to factory j.',
  tags: ['Dynamic Programming', 'Sorting', 'Assignment'],
  code: {
    pseudocode: `function minimumTotalDistance(robot, factory):
  sort robot, sort factory by position
  // Expand factory to individual slots
  slots = []
  for pos, cap in factory: slots += [pos]*cap
  m = len(slots), n = len(robot)
  dp[i][j] = min dist assigning robot[0..i-1] to slots[0..j-1]
  for i from 1 to n:
    for j from i to m:
      dp[i][j] = min(dp[i][j-1], dp[i-1][j-1] + |robot[i-1]-slots[j-1]|)
  return dp[n][m]`,
    python: `def minimumTotalDistance(robot, factory):
    robot.sort()
    factory.sort()
    slots = []
    for pos, cap in factory:
        slots.extend([pos]*cap)
    n, m = len(robot), len(slots)
    INF = float('inf')
    dp = [[INF]*(m+1) for _ in range(n+1)]
    for j in range(m+1): dp[0][j] = 0
    for i in range(1, n+1):
        for j in range(i, m+1):
            dp[i][j] = dp[i][j-1]
            if dp[i-1][j-1] < INF:
                dp[i][j] = min(dp[i][j], dp[i-1][j-1]+abs(robot[i-1]-slots[j-1]))
    return dp[n][m]`,
    javascript: `function minimumTotalDistance(robot, factory) {
  robot.sort((a,b)=>a-b);
  factory.sort((a,b)=>a[0]-b[0]);
  const slots = [];
  for (const [pos,cap] of factory) for(let i=0;i<cap;i++) slots.push(pos);
  const n=robot.length, m=slots.length;
  const INF=1e15;
  const dp=Array.from({length:n+1},()=>new Array(m+1).fill(INF));
  for(let j=0;j<=m;j++) dp[0][j]=0;
  for(let i=1;i<=n;i++)
    for(let j=i;j<=m;j++){
      dp[i][j]=dp[i][j-1];
      if(dp[i-1][j-1]<INF) dp[i][j]=Math.min(dp[i][j],dp[i-1][j-1]+Math.abs(robot[i-1]-slots[j-1]));
    }
  return dp[n][m];
}`,
    java: `public long minimumTotalDistance(List<Integer> robot, int[][] factory) {
    Collections.sort(robot);
    Arrays.sort(factory,(a,b)->a[0]-b[0]);
    List<Integer> slots=new ArrayList<>();
    for(int[] f:factory) for(int i=0;i<f[1];i++) slots.add(f[0]);
    int n=robot.size(), m=slots.size();
    long INF=Long.MAX_VALUE/2;
    long[][] dp=new long[n+1][m+1];
    for(long[] row:dp) Arrays.fill(row,INF);
    for(int j=0;j<=m;j++) dp[0][j]=0;
    for(int i=1;i<=n;i++)
        for(int j=i;j<=m;j++){
            dp[i][j]=dp[i][j-1];
            if(dp[i-1][j-1]<INF) dp[i][j]=Math.min(dp[i][j],dp[i-1][j-1]+Math.abs(robot.get(i-1)-slots.get(j-1)));
        }
    return dp[n][m];
}`,
  },
  defaultInput: { robot: [0, 4, 6], factory: [[2, 2], [6, 2]] },
  inputFields: [
    {
      name: 'robot',
      label: 'Robot Positions',
      type: 'array',
      defaultValue: [0, 4, 6],
      placeholder: '0,4,6',
      helperText: 'Positions of robots on a number line',
    },
    {
      name: 'factory',
      label: 'Factory Slots (pos,cap,pos,cap,...)',
      type: 'array',
      defaultValue: [2, 2, 6, 2],
      placeholder: '2,2,6,2',
      helperText: 'Factory data as (position, capacity) pairs flattened',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const robot = (input.robot as number[]).slice().sort((a, b) => a - b);
    const rawFactory = input.factory as number[];
    const factory: [number, number][] = [];
    for (let i = 0; i < rawFactory.length; i += 2) {
      factory.push([rawFactory[i], rawFactory[i + 1] || 1]);
    }
    factory.sort((a, b) => a[0] - b[0]);

    const slots: number[] = [];
    for (const [pos, cap] of factory) {
      for (let i = 0; i < cap; i++) slots.push(pos);
    }

    const n = robot.length;
    const m = slots.length;
    const INF = 999999;
    const steps: AlgorithmStep[] = [];

    const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(INF));
    for (let j = 0; j <= m; j++) dp[0][j] = 0;

    function makeViz(activeI: number, activeJ: number): DPVisualization {
      const vals: (number | null)[] = [];
      const lbls: string[] = [];
      const highlights: Record<number, string> = {};
      const showI = Math.min(n, 4);
      const showJ = Math.min(m, 5);
      for (let i = 0; i <= showI; i++) {
        for (let j = 0; j <= showJ; j++) {
          const idx = i * (showJ + 1) + j;
          vals.push(dp[i][j] === INF ? null : dp[i][j]);
          lbls.push(`r${i}s${j}`);
          if (i === activeI && j === activeJ) highlights[idx] = 'active';
          else if (dp[i][j] < INF && dp[i][j] >= 0) highlights[idx] = 'found';
          else highlights[idx] = 'default';
        }
      }
      return { type: 'dp-table', values: vals, highlights, labels: lbls };
    }

    steps.push({
      line: 1,
      explanation: `Sorted robots: [${robot.join(',')}]. Expanded slots: [${slots.join(',')}]. dp[i][j] = min dist assigning ${n} robots to ${m} slots.`,
      variables: { robot, slots, n, m },
      visualization: makeViz(0, 0),
    });

    for (let i = 1; i <= n; i++) {
      for (let j = i; j <= m; j++) {
        dp[i][j] = dp[i][j - 1];
        if (dp[i - 1][j - 1] < INF) {
          dp[i][j] = Math.min(dp[i][j], dp[i - 1][j - 1] + Math.abs(robot[i - 1] - slots[j - 1]));
        }

        if (j <= 5) {
          steps.push({
            line: 8,
            explanation: `dp[${i}][${j}]=${dp[i][j] === INF ? 'INF' : dp[i][j]}. Robot ${i - 1} at pos ${robot[i - 1]}, slot ${j - 1} at pos ${slots[j - 1]}, dist=${Math.abs(robot[i - 1] - slots[j - 1])}.`,
            variables: { i, j, 'dp[i][j]': dp[i][j] === INF ? 'INF' : dp[i][j] },
            visualization: makeViz(i, j),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Answer = dp[${n}][${m}] = ${dp[n][m]}. Minimum total distance traveled by all robots.`,
      variables: { result: dp[n][m] },
      visualization: makeViz(n, m <= 5 ? m : 5),
    });

    return steps;
  },
};

export default minimumTotalDistanceTraveled;
