import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minCostToConnectAllPoints: AlgorithmDefinition = {
  id: 'min-cost-to-connect-all-points',
  title: 'Min Cost to Connect All Points',
  leetcodeNumber: 1584,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n points on a 2D plane, find the minimum cost to connect all points where cost is the Manhattan distance between two points. This is a Minimum Spanning Tree problem solved with Kruskal algorithm: sort all edges by Manhattan distance and use Union-Find to avoid cycles.',
  tags: ['MST', 'Kruskal', 'union-find', 'Manhattan distance', 'graph'],

  code: {
    pseudocode: `function minCostConnectPoints(points):
  n = len(points)
  edges = all pairs (manhattan_dist, i, j)
  sort edges by cost
  parent = [0..n-1]
  total = 0, count = 0
  for each (cost, i, j) in edges:
    if find(i) != find(j):
      union(i, j)
      total += cost, count++
      if count == n-1: break
  return total`,

    python: `def minCostConnectPoints(points):
    n = len(points)
    edges = []
    for i in range(n):
        for j in range(i+1, n):
            d = abs(points[i][0]-points[j][0]) + abs(points[i][1]-points[j][1])
            edges.append((d, i, j))
    edges.sort()
    parent = list(range(n))
    def find(x):
        while parent[x] != x: parent[x] = parent[parent[x]]; x = parent[x]
        return x
    total = count = 0
    for cost, i, j in edges:
        pi, pj = find(i), find(j)
        if pi != pj:
            parent[pi] = pj
            total += cost; count += 1
            if count == n-1: break
    return total`,

    javascript: `function minCostConnectPoints(points) {
  const n = points.length;
  const edges = [];
  for (let i = 0; i < n; i++)
    for (let j = i+1; j < n; j++) {
      const d = Math.abs(points[i][0]-points[j][0]) + Math.abs(points[i][1]-points[j][1]);
      edges.push([d, i, j]);
    }
  edges.sort((a,b) => a[0]-b[0]);
  const parent = Array.from({length:n},(_,i)=>i);
  function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x; }
  let total=0, count=0;
  for (const [cost,i,j] of edges) {
    const pi=find(i), pj=find(j);
    if(pi!==pj){parent[pi]=pj;total+=cost;if(++count===n-1)break;}
  }
  return total;
}`,

    java: `public int minCostConnectPoints(int[][] points) {
    int n = points.length;
    List<int[]> edges = new ArrayList<>();
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++) {
            int d = Math.abs(points[i][0]-points[j][0])+Math.abs(points[i][1]-points[j][1]);
            edges.add(new int[]{d,i,j});
        }
    edges.sort((a,b)->a[0]-b[0]);
    int[] parent = new int[n];
    for (int i=0;i<n;i++) parent[i]=i;
    int total=0, count=0;
    for (int[] e : edges) {
        int pi=find(parent,e[1]), pj=find(parent,e[2]);
        if(pi!=pj){parent[pi]=pj;total+=e[0];if(++count==n-1)break;}
    }
    return total;
}`,
  },

  defaultInput: {
    points: [0, 0, 2, 2, 3, 10, 5, 2, 7, 0],
  },

  inputFields: [
    {
      name: 'points',
      label: 'Points (x,y pairs flat)',
      type: 'array',
      defaultValue: [0, 0, 2, 2, 3, 10, 5, 2, 7, 0],
      placeholder: '0,0,2,2,3,10,...',
      helperText: 'Flat list of x,y coordinate pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.points as number[];
    const steps: AlgorithmStep[] = [];

    const points: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) points.push([flat[i], flat[i + 1]]);

    const n = points.length;
    const edgeList: [number, number, number][] = [];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const d = Math.abs(points[i][0] - points[j][0]) + Math.abs(points[i][1] - points[j][1]);
        edgeList.push([d, i, j]);
      }
    }
    edgeList.sort((a, b) => a[0] - b[0]);

    const parent: number[] = Array.from({ length: n }, (_, i) => i);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    const makeViz = (highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: points.map((_, i) => i),
      highlights,
      labels: Object.fromEntries(points.map(([x, y], i) => [i, `(${x},${y})`])),
    });

    steps.push({
      line: 2,
      explanation: `Generated ${edgeList.length} edges sorted by Manhattan distance. Min edge: dist=${edgeList[0][0]} between points ${edgeList[0][1]} and ${edgeList[0][2]}.`,
      variables: { n, totalEdges: edgeList.length },
      visualization: makeViz({}),
    });

    let total = 0;
    let count = 0;

    for (const [cost, i, j] of edgeList) {
      const pi = find(i), pj = find(j);

      if (pi !== pj) {
        parent[pi] = pj;
        total += cost;
        count++;
        steps.push({
          line: 9,
          explanation: `Add edge between point ${i} and point ${j} (dist=${cost}). MST cost = ${total}. Edges added = ${count}.`,
          variables: { i, j, cost, total, edgesAdded: count },
          visualization: makeViz({ [i]: 'found', [j]: 'found' }),
        });
        if (count === n - 1) break;
      } else {
        steps.push({
          line: 7,
          explanation: `Skip edge ${i}-${j} (dist=${cost}): already in same component (would form cycle).`,
          variables: { i, j, cost, component: pi },
          visualization: makeViz({ [i]: 'mismatch', [j]: 'mismatch' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `MST complete. Minimum cost to connect all ${n} points = ${total}.`,
      variables: { result: total, pointsConnected: n },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'sorted']))),
    });

    return steps;
  },
};

export default minCostToConnectAllPoints;
