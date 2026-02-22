import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const connectingCitiesWithMinimumCost: AlgorithmDefinition = {
  id: 'connecting-cities-with-minimum-cost',
  title: 'Connecting Cities With Minimum Cost',
  leetcodeNumber: 1135,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are N cities numbered 1 to N. Given connections where connections[i] = [city1, city2, cost], find the minimum cost to connect all cities. If impossible, return -1. Classic MST problem solved with Kruskal\'s algorithm.',
  tags: ['Graph', 'MST', 'Union-Find', 'Kruskal'],
  code: {
    pseudocode: `function minimumCost(N, connections):
  sort connections by cost
  parent = [0..N], rank = [0..0]
  total = 0, edges = 0
  for (c1, c2, cost) in connections:
    if find(c1) != find(c2):
      union(c1, c2)
      total += cost
      edges++
      if edges == N-1: return total
  return -1`,
    python: `def minimumCost(N, connections):
    connections.sort(key=lambda x: x[2])
    parent = list(range(N + 1))
    rank = [0] * (N + 1)
    def find(x):
        if parent[x] != x: parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        px, py = find(x), find(y)
        if px == py: return False
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
        return True
    total, edges = 0, 0
    for c1, c2, cost in connections:
        if union(c1, c2):
            total += cost
            edges += 1
            if edges == N - 1: return total
    return -1`,
    javascript: `function minimumCost(N, connections) {
  connections.sort((a, b) => a[2] - b[2]);
  const parent = Array.from({length: N+1}, (_,i) => i);
  const rank = new Array(N+1).fill(0);
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    let px = find(x), py = find(y);
    if (px === py) return false;
    if (rank[px] < rank[py]) [px,py] = [py,px];
    parent[py] = px;
    if (rank[px] === rank[py]) rank[px]++;
    return true;
  }
  let total = 0, edges = 0;
  for (const [c1, c2, cost] of connections) {
    if (union(c1, c2)) {
      total += cost; edges++;
      if (edges === N - 1) return total;
    }
  }
  return -1;
}`,
    java: `public int minimumCost(int N, int[][] connections) {
    Arrays.sort(connections, (a,b) -> a[2]-b[2]);
    int[] parent = new int[N+1], rank = new int[N+1];
    for (int i=0;i<=N;i++) parent[i]=i;
    int total=0, edges=0;
    for (int[] c : connections) {
        int pc1=find(parent,c[0]), pc2=find(parent,c[1]);
        if (pc1!=pc2) {
            if (rank[pc1]<rank[pc2]) {int t=pc1;pc1=pc2;pc2=t;}
            parent[pc2]=pc1;
            if (rank[pc1]==rank[pc2]) rank[pc1]++;
            total+=c[2]; edges++;
            if (edges==N-1) return total;
        }
    }
    return -1;
}`,
  },
  defaultInput: {
    N: 4,
    connections: [[1,2,3],[3,4,4],[2,3,2],[1,4,1]],
  },
  inputFields: [
    {
      name: 'N',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'connections',
      label: 'Connections [c1, c2, cost]',
      type: 'array',
      defaultValue: [[1,2,3],[3,4,4],[2,3,2],[1,4,1]],
      placeholder: '[[1,2,3],[2,3,2]]',
      helperText: 'Cities are 1-indexed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const N = input.N as number;
    const rawConns = input.connections as number[][];
    const steps: AlgorithmStep[] = [];

    const connections = [...rawConns].sort((a, b) => a[2] - b[2]);
    const parent = Array.from({ length: N + 1 }, (_, i) => i);
    const rank = new Array(N + 1).fill(0);
    let total = 0;
    let edgesAdded = 0;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: parent.slice(1),
        highlights,
        labels: Object.fromEntries(parent.slice(1).map((p, i) => [i, `c${i+1}→${p}`])),
        auxData: {
          label: 'Connecting Cities (Kruskal)',
          entries: [
            { key: 'Total Cost', value: String(total) },
            { key: 'Edges Added', value: `${edgesAdded}/${N-1}` },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort ${connections.length} connections by cost. Need to connect ${N} cities with ${N-1} edges (MST). Sorted costs: ${connections.map(c => c[2]).join(', ')}.`,
      variables: { N, edgesCount: connections.length },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: N }, (_, i) => [i, 'default'])),
        'Sorted, ready'
      ),
    });

    for (const [c1, c2, cost] of connections) {
      const pc1 = find(c1);
      const pc2 = find(c2);

      if (pc1 === pc2) {
        steps.push({
          line: 5,
          explanation: `Edge (${c1}-${c2}, cost=${cost}): Same component (root ${pc1}). Skip — would create cycle.`,
          variables: { c1, c2, cost, root: pc1 },
          visualization: makeViz({ [c1-1]: 'mismatch', [c2-1]: 'mismatch' }, 'Cycle — skip'),
        });
      } else {
        let rpx = pc1, rpy = pc2;
        if (rank[rpx] < rank[rpy]) { const tmp = rpx; rpx = rpy; rpy = tmp; }
        parent[rpy] = rpx;
        if (rank[rpx] === rank[rpy]) rank[rpx]++;
        total += cost;
        edgesAdded++;

        steps.push({
          line: 7,
          explanation: `Edge (${c1}-${c2}, cost=${cost}): Different components. Add to MST. Total cost = ${total}. Edges: ${edgesAdded}/${N-1}.`,
          variables: { c1, c2, cost, total, edgesAdded },
          visualization: makeViz(
            { [c1-1]: 'found', [c2-1]: 'found' },
            `Added edge, cost=${total}`
          ),
        });

        if (edgesAdded === N - 1) break;
      }
    }

    const result = edgesAdded === N - 1 ? total : -1;
    const finalH: Record<number, string> = {};
    for (let i = 0; i < N; i++) finalH[i] = result === -1 ? 'mismatch' : 'sorted';

    steps.push({
      line: 10,
      explanation: result === -1
        ? `Cannot connect all ${N} cities. Only ${edgesAdded} edges added. Return -1.`
        : `All ${N} cities connected! Minimum total cost = ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, `Result: ${result}`),
    });

    return steps;
  },
};

export default connectingCitiesWithMinimumCost;
