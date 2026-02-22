import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergingCommunities: AlgorithmDefinition = {
  id: 'merging-communities',
  title: 'Merging Communities',
  leetcodeNumber: 547,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n matrix isConnected where isConnected[i][j] = 1 means city i and city j are directly connected, find the total number of provinces (connected components). We use Union-Find with path compression and union by rank.',
  tags: ['Graph', 'Union-Find'],
  code: {
    pseudocode: `function findCircleNum(isConnected):
  n = length(isConnected)
  parent = [0, 1, 2, ..., n-1]
  rank = [0, 0, ..., 0]
  provinces = n

  function find(x):
    if parent[x] != x:
      parent[x] = find(parent[x])
    return parent[x]

  function union(x, y):
    px, py = find(x), find(y)
    if px == py: return
    if rank[px] < rank[py]: swap(px, py)
    parent[py] = px
    if rank[px] == rank[py]: rank[px] += 1
    provinces -= 1

  for i from 0 to n-1:
    for j from i+1 to n-1:
      if isConnected[i][j] == 1:
        union(i, j)
  return provinces`,
    python: `def findCircleNum(isConnected):
    n = len(isConnected)
    parent = list(range(n))
    rank = [0] * n
    provinces = n
    def find(x):
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]
    def union(x, y):
        nonlocal provinces
        px, py = find(x), find(y)
        if px == py: return
        if rank[px] < rank[py]: px, py = py, px
        parent[py] = px
        if rank[px] == rank[py]: rank[px] += 1
        provinces -= 1
    for i in range(n):
        for j in range(i+1, n):
            if isConnected[i][j] == 1:
                union(i, j)
    return provinces`,
    javascript: `function findCircleNum(isConnected) {
  const n = isConnected.length;
  const parent = Array.from({length: n}, (_, i) => i);
  const rank = new Array(n).fill(0);
  let provinces = n;
  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(x, y) {
    let px = find(x), py = find(y);
    if (px === py) return;
    if (rank[px] < rank[py]) [px, py] = [py, px];
    parent[py] = px;
    if (rank[px] === rank[py]) rank[px]++;
    provinces--;
  }
  for (let i = 0; i < n; i++)
    for (let j = i+1; j < n; j++)
      if (isConnected[i][j] === 1) union(i, j);
  return provinces;
}`,
    java: `public int findCircleNum(int[][] isConnected) {
    int n = isConnected.length;
    int[] parent = new int[n], rank = new int[n];
    for (int i = 0; i < n; i++) parent[i] = i;
    int provinces = n;
    for (int i = 0; i < n; i++)
        for (int j = i+1; j < n; j++)
            if (isConnected[i][j] == 1) {
                int px = find(parent, i), py = find(parent, j);
                if (px != py) {
                    if (rank[px] < rank[py]) { int t=px; px=py; py=t; }
                    parent[py] = px;
                    if (rank[px] == rank[py]) rank[px]++;
                    provinces--;
                }
            }
    return provinces;
}
private int find(int[] parent, int x) {
    if (parent[x] != x) parent[x] = find(parent, parent[x]);
    return parent[x];
}`,
  },
  defaultInput: {
    isConnected: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
  },
  inputFields: [
    {
      name: 'isConnected',
      label: 'Connection Matrix',
      type: 'array',
      defaultValue: [[1, 1, 0], [1, 1, 0], [0, 0, 1]],
      placeholder: '[[1,1,0],[1,1,0],[0,0,1]]',
      helperText: 'n x n matrix where isConnected[i][j]=1 means cities i and j are connected',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const isConnected = input.isConnected as number[][];
    const n = isConnected.length;
    const steps: AlgorithmStep[] = [];

    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    let provinces = n;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...parent],
        highlights,
        labels,
        auxData: {
          label: 'Union-Find State',
          entries: [
            { key: 'Parent', value: parent.join(', ') },
            { key: 'Rank', value: rank.join(', ') },
            { key: 'Provinces', value: String(provinces) },
          ],
        },
      };
    }

    const nodeLabels: Record<number, string> = {};
    for (let i = 0; i < n; i++) nodeLabels[i] = `p[${i}]=${parent[i]}`;

    steps.push({
      line: 1,
      explanation: `Initialize Union-Find for ${n} cities. Each city is its own parent (its own province). Total provinces = ${n}.`,
      variables: { n, parent: [...parent], rank: [...rank], provinces },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        nodeLabels
      ),
    });

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (isConnected[i][j] === 1) {
          const px = find(i);
          const py = find(j);

          if (px === py) {
            steps.push({
              line: 18,
              explanation: `Cities ${i} and ${j} are connected but already in same province (root ${px}). Skip.`,
              variables: { i, j, rootI: px, rootJ: py, provinces },
              visualization: makeViz(
                { [i]: 'visited', [j]: 'visited' },
                Object.fromEntries(Array.from({ length: n }, (_, k) => [k, `p=${parent[k]}`]))
              ),
            });
          } else {
            steps.push({
              line: 14,
              explanation: `Cities ${i} and ${j} are connected. Roots differ: find(${i})=${px}, find(${j})=${py}. Merging.`,
              variables: { i, j, rootI: px, rootJ: py },
              visualization: makeViz(
                { [i]: 'active', [j]: 'active', [px]: 'comparing', [py]: 'comparing' },
                Object.fromEntries(Array.from({ length: n }, (_, k) => [k, `p=${parent[k]}`]))
              ),
            });

            // Union by rank
            let rpx = px, rpy = py;
            if (rank[rpx] < rank[rpy]) { const tmp = rpx; rpx = rpy; rpy = tmp; }
            parent[rpy] = rpx;
            if (rank[rpx] === rank[rpy]) rank[rpx]++;
            provinces--;

            steps.push({
              line: 16,
              explanation: `Merged: parent[${rpy}] = ${rpx}. Provinces now = ${provinces}.`,
              variables: { parent: [...parent], rank: [...rank], provinces },
              visualization: makeViz(
                { [rpx]: 'found', [rpy]: 'pointer' },
                Object.fromEntries(Array.from({ length: n }, (_, k) => [k, `p=${parent[k]}`]))
              ),
            });
          }
        }
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    const roots = new Set<number>();
    for (let i = 0; i < n; i++) roots.add(find(i));
    const colors = ['found', 'pointer', 'active', 'comparing'];
    const rootList = [...roots];
    for (let i = 0; i < n; i++) {
      const r = find(i);
      finalHighlights[i] = colors[rootList.indexOf(r) % colors.length];
    }

    steps.push({
      line: 19,
      explanation: `Union-Find complete. Total provinces (connected components): ${provinces}.`,
      variables: { result: provinces, parent: [...parent] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, k) => [k, `city ${k}`]))
      ),
    });

    return steps;
  },
};

export default mergingCommunities;
