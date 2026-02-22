import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const connectTheDots: AlgorithmDefinition = {
  id: 'connect-the-dots',
  title: 'Connect the Dots',
  leetcodeNumber: 1584,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an array of points on a 2D plane, return the minimum cost to connect all points. The cost of connecting two points is their Manhattan distance |xi-xj| + |yi-yj|. Uses Prim\'s algorithm to build a Minimum Spanning Tree (MST).',
  tags: ['Graph', 'MST', 'Greedy'],
  code: {
    pseudocode: `function minCostConnectPoints(points):
  n = length(points)
  inMST = set()
  minCost = array of size n, all Infinity
  minCost[0] = 0
  totalCost = 0
  for i from 0 to n-1:
    u = node not in MST with smallest minCost
    inMST.add(u)
    totalCost += minCost[u]
    for v from 0 to n-1:
      if v not in inMST:
        dist = |points[u].x - points[v].x| + |points[u].y - points[v].y|
        minCost[v] = min(minCost[v], dist)
  return totalCost`,
    python: `def minCostConnectPoints(points):
    n = len(points)
    in_mst = [False] * n
    min_cost = [float('inf')] * n
    min_cost[0] = 0
    total = 0
    for _ in range(n):
        u = -1
        for v in range(n):
            if not in_mst[v] and (u == -1 or min_cost[v] < min_cost[u]):
                u = v
        in_mst[u] = True
        total += min_cost[u]
        for v in range(n):
            if not in_mst[v]:
                dist = abs(points[u][0]-points[v][0]) + abs(points[u][1]-points[v][1])
                min_cost[v] = min(min_cost[v], dist)
    return total`,
    javascript: `function minCostConnectPoints(points) {
  const n = points.length;
  const inMST = new Array(n).fill(false);
  const minCost = new Array(n).fill(Infinity);
  minCost[0] = 0;
  let total = 0;
  for (let i = 0; i < n; i++) {
    let u = -1;
    for (let v = 0; v < n; v++)
      if (!inMST[v] && (u === -1 || minCost[v] < minCost[u])) u = v;
    inMST[u] = true;
    total += minCost[u];
    for (let v = 0; v < n; v++) {
      if (!inMST[v]) {
        const dist = Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]);
        minCost[v] = Math.min(minCost[v], dist);
      }
    }
  }
  return total;
}`,
    java: `public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    boolean[] inMST = new boolean[n];
    int[] minCost = new int[n];
    Arrays.fill(minCost, Integer.MAX_VALUE);
    minCost[0] = 0;
    int total = 0;
    for (int i = 0; i < n; i++) {
        int u = -1;
        for (int v = 0; v < n; v++)
            if (!inMST[v] && (u == -1 || minCost[v] < minCost[u])) u = v;
        inMST[u] = true;
        total += minCost[u];
        for (int v = 0; v < n; v++) {
            if (!inMST[v]) {
                int dist = Math.abs(points[u][0]-points[v][0]) + Math.abs(points[u][1]-points[v][1]);
                minCost[v] = Math.min(minCost[v], dist);
            }
        }
    }
    return total;
}`,
  },
  defaultInput: {
    points: [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]],
  },
  inputFields: [
    {
      name: 'points',
      label: 'Points [x, y]',
      type: 'array',
      defaultValue: [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]],
      placeholder: '[[0,0],[2,2],[3,10],[5,2],[7,0]]',
      helperText: '2D points as [x, y] pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const n = points.length;
    const steps: AlgorithmStep[] = [];

    const inMST = new Array(n).fill(false);
    const minCost = new Array(n).fill(Infinity);
    minCost[0] = 0;
    let totalCost = 0;

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      const baseHighlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (inMST[i]) baseHighlights[i] = 'sorted';
      }
      return {
        type: 'array',
        array: minCost.map((c: number) => c === Infinity ? -1 : c),
        highlights: { ...baseHighlights, ...highlights },
        labels,
        auxData: {
          label: 'Prim\'s MST',
          entries: [
            { key: 'Total Cost', value: String(totalCost) },
            { key: 'In MST', value: Array.from({ length: n }, (_, i) => i).filter(i => inMST[i]).map(i => `P${i}`).join(', ') || 'none' },
            { key: 'Points', value: points.map((p, i) => `P${i}(${p[0]},${p[1]})`).join(' ') },
          ],
        },
      };
    }

    const pointLabels = () => {
      const l: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        l[i] = `P${i}:${minCost[i] === Infinity ? 'INF' : minCost[i]}`;
      }
      return l;
    };

    steps.push({
      line: 1,
      explanation: `${n} points to connect. Use Prim's algorithm. Start from point 0 with cost 0. Array shows min cost to connect each point to the MST (-1 = INF).`,
      variables: { n },
      visualization: makeViz({}, pointLabels()),
    });

    for (let iter = 0; iter < n; iter++) {
      // Find min cost node not in MST
      let u = -1;
      for (let v = 0; v < n; v++) {
        if (!inMST[v] && (u === -1 || minCost[v] < minCost[u])) u = v;
      }

      inMST[u] = true;
      totalCost += minCost[u];

      steps.push({
        line: 8,
        explanation: `Add point P${u} (${points[u][0]},${points[u][1]}) to MST with edge cost ${minCost[u]}. Total MST cost: ${totalCost}.`,
        variables: { u, edgeCost: minCost[u], totalCost },
        visualization: makeViz({ [u]: 'found' }, pointLabels()),
      });

      // Update costs for remaining nodes
      let updated = false;
      for (let v = 0; v < n; v++) {
        if (!inMST[v]) {
          const dist = Math.abs(points[u][0] - points[v][0]) + Math.abs(points[u][1] - points[v][1]);
          if (dist < minCost[v]) {
            minCost[v] = dist;
            updated = true;
          }
        }
      }

      if (updated && iter < n - 1) {
        steps.push({
          line: 12,
          explanation: `Updated min connection costs from P${u} to remaining points.`,
          variables: { u, minCost: [...minCost] },
          visualization: makeViz({ [u]: 'found' }, pointLabels()),
        });
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'found';

    steps.push({
      line: 14,
      explanation: `All ${n} points connected. Minimum total cost = ${totalCost}.`,
      variables: { result: totalCost },
      visualization: makeViz(finalHighlights, pointLabels()),
    });

    return steps;
  },
};

export default connectTheDots;
