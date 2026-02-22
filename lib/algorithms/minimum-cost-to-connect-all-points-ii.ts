import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostToConnectAllPointsII: AlgorithmDefinition = {
  id: 'minimum-cost-to-connect-all-points-ii',
  title: 'Minimum Cost to Connect All Points II',
  leetcodeNumber: 1584,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an array of points where points[i] = [xi, yi], connect all points with minimum total cost. Cost between two points is their Manhattan distance. Uses Prim\'s algorithm with adjacency approach for efficiency.',
  tags: ['Graph', 'MST', 'Prim', 'Manhattan Distance'],
  code: {
    pseudocode: `function minCostConnectPoints(points):
  n = len(points)
  inMST = [false] * n
  minDist = [Infinity] * n
  minDist[0] = 0
  total = 0
  for _ in range(n):
    pick u = unvisited node with min minDist
    inMST[u] = true
    total += minDist[u]
    for v in 0..n-1:
      if not inMST[v]:
        d = manhattan(points[u], points[v])
        minDist[v] = min(minDist[v], d)
  return total`,
    python: `def minCostConnectPoints(points):
    n = len(points)
    inMST = [False] * n
    minDist = [float('inf')] * n
    minDist[0] = 0
    total = 0
    for _ in range(n):
        u = min((i for i in range(n) if not inMST[i]), key=lambda x: minDist[x])
        inMST[u] = True
        total += minDist[u]
        for v in range(n):
            if not inMST[v]:
                d = abs(points[u][0]-points[v][0]) + abs(points[u][1]-points[v][1])
                minDist[v] = min(minDist[v], d)
    return total`,
    javascript: `function minCostConnectPoints(points) {
  const n = points.length;
  const inMST = new Array(n).fill(false);
  const minDist = new Array(n).fill(Infinity);
  minDist[0] = 0;
  let total = 0;
  for (let iter = 0; iter < n; iter++) {
    let u = -1;
    for (let i = 0; i < n; i++)
      if (!inMST[i] && (u === -1 || minDist[i] < minDist[u])) u = i;
    inMST[u] = true;
    total += minDist[u];
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const d = Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]);
        minDist[v] = Math.min(minDist[v], d);
      }
    }
  }
  return total;
}`,
    java: `public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    boolean[] inMST = new boolean[n];
    int[] minDist = new int[n];
    Arrays.fill(minDist, Integer.MAX_VALUE);
    minDist[0] = 0;
    int total = 0;
    for (int iter = 0; iter < n; iter++) {
        int u = -1;
        for (int i = 0; i < n; i++)
            if (!inMST[i] && (u == -1 || minDist[i] < minDist[u])) u = i;
        inMST[u] = true;
        total += minDist[u];
        for (int v = 0; v < n; v++)
            if (!inMST[v]) {
                int d = Math.abs(points[u][0]-points[v][0])+Math.abs(points[u][1]-points[v][1]);
                minDist[v] = Math.min(minDist[v], d);
            }
    }
    return total;
}`,
  },
  defaultInput: {
    points: [[0,0],[2,2],[3,10],[5,2],[7,0]],
  },
  inputFields: [
    {
      name: 'points',
      label: 'Points [x, y]',
      type: 'array',
      defaultValue: [[0,0],[2,2],[3,10],[5,2],[7,0]],
      placeholder: '[[0,0],[2,2],[3,10]]',
      helperText: '2D points to connect',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const n = points.length;
    const steps: AlgorithmStep[] = [];

    const inMST = new Array(n).fill(false);
    const minDist = new Array(n).fill(Infinity);
    minDist[0] = 0;
    let total = 0;

    function manhattan(a: number[], b: number[]): number {
      return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: minDist.map(d => d === Infinity ? -1 : d),
        highlights,
        labels: Object.fromEntries(minDist.map((d, i) => [i, `p${i}:${d === Infinity ? 'INF' : d}`])),
        auxData: {
          label: "Prim's on Points",
          entries: [
            { key: 'Total MST Cost', value: String(total) },
            { key: 'In MST', value: inMST.map((v, i) => v ? `p${i}` : null).filter(x => x !== null).join(', ') || 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} points to connect. minDist[0]=0, others INF. Use Prim's with Manhattan distance = |x1-x2|+|y1-y2|.`,
      variables: { n, points },
      visualization: makeViz({ 0: 'active' }, 'Initialized'),
    });

    for (let iter = 0; iter < n; iter++) {
      let u = -1;
      for (let i = 0; i < n; i++) {
        if (!inMST[i] && (u === -1 || minDist[i] < minDist[u])) u = i;
      }

      inMST[u] = true;
      total += minDist[u];

      const h: Record<number, string> = {};
      for (let i = 0; i < n; i++) h[i] = inMST[i] ? 'sorted' : 'default';
      steps.push({
        line: 7,
        explanation: `Add point ${u} (${points[u]}) to MST with cost ${minDist[u]}. Total = ${total}.`,
        variables: { u, cost: minDist[u], total },
        visualization: makeViz({ ...h, [u]: 'found' }, `Added p${u}, cost=${minDist[u]}`),
      });

      for (let v = 0; v < n; v++) {
        if (!inMST[v]) {
          const d = manhattan(points[u], points[v]);
          if (d < minDist[v]) {
            minDist[v] = d;
            const h2: Record<number, string> = {};
            for (let i = 0; i < n; i++) h2[i] = inMST[i] ? 'sorted' : 'default';
            steps.push({
              line: 12,
              explanation: `Update minDist[${v}] = ${d} (Manhattan from p${u} to p${v}).`,
              variables: { u, v, d, newMinDist: d },
              visualization: makeViz({ ...h2, [u]: 'found', [v]: 'active' }, `Update p${v} dist=${d}`),
            });
          }
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 14,
      explanation: `All ${n} points connected. Minimum total cost (Manhattan) = ${total}.`,
      variables: { total },
      visualization: makeViz(finalH, `Min cost: ${total}`),
    });

    return steps;
  },
};

export default minimumCostToConnectAllPointsII;
