import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const optimizeWaterDistribution: AlgorithmDefinition = {
  id: 'optimize-water-distribution',
  title: 'Optimize Water Distribution in a Village',
  leetcodeNumber: 1168,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'There are n houses and you can build a well in any house or lay pipes between houses. Find minimum cost to supply water to all houses. Trick: add virtual node 0 connected to each house with well cost, then run Kruskal\'s MST on the expanded graph.',
  tags: ['Graph', 'MST', 'Union-Find', 'Kruskal'],
  code: {
    pseudocode: `function minCostToSupplyWater(n, wells, pipes):
  // Add virtual node 0; connect 0→i with well cost wells[i-1]
  allEdges = pipes + [(0, i, wells[i-1]) for i in 1..n]
  sort allEdges by cost
  parent = [0..n], rank = [0..0]
  total = 0
  for (u, v, cost) in allEdges:
    if find(u) != find(v):
      union(u, v)
      total += cost
  return total`,
    python: `def minCostToSupplyWater(n, wells, pipes):
    edges = [[0, i+1, wells[i]] for i in range(n)]
    edges.extend(pipes)
    edges.sort(key=lambda x: x[2])
    parent = list(range(n+1))
    rank = [0]*(n+1)
    def find(x):
        if parent[x]!=x: parent[x]=find(parent[x])
        return parent[x]
    def union(x,y):
        px,py=find(x),find(y)
        if px==py: return False
        if rank[px]<rank[py]: px,py=py,px
        parent[py]=px
        if rank[px]==rank[py]: rank[px]+=1
        return True
    total=0
    for u,v,c in edges:
        if union(u,v): total+=c
    return total`,
    javascript: `function minCostToSupplyWater(n, wells, pipes) {
  const edges = wells.map((w, i) => [0, i+1, w]);
  edges.push(...pipes);
  edges.sort((a,b) => a[2]-b[2]);
  const parent = Array.from({length:n+1},(_,i)=>i);
  const rank = new Array(n+1).fill(0);
  function find(x) {
    if (parent[x]!==x) parent[x]=find(parent[x]);
    return parent[x];
  }
  function union(x,y) {
    let px=find(x),py=find(y);
    if (px===py) return false;
    if (rank[px]<rank[py]) [px,py]=[py,px];
    parent[py]=px;
    if (rank[px]===rank[py]) rank[px]++;
    return true;
  }
  let total=0;
  for (const [u,v,c] of edges)
    if (union(u,v)) total+=c;
  return total;
}`,
    java: `public int minCostToSupplyWater(int n, int[] wells, int[][] pipes) {
    int[][] edges = new int[n + pipes.length][3];
    for (int i=0;i<n;i++) edges[i]=new int[]{0,i+1,wells[i]};
    System.arraycopy(pipes,0,edges,n,pipes.length);
    Arrays.sort(edges,(a,b)->a[2]-b[2]);
    int[] parent=new int[n+1], rank=new int[n+1];
    for (int i=0;i<=n;i++) parent[i]=i;
    int total=0;
    for (int[] e:edges) {
        int pu=find(parent,e[0]),pv=find(parent,e[1]);
        if (pu!=pv) {
            if(rank[pu]<rank[pv]){int t=pu;pu=pv;pv=t;}
            parent[pv]=pu;
            if(rank[pu]==rank[pv])rank[pu]++;
            total+=e[2];
        }
    }
    return total;
}`,
  },
  defaultInput: {
    n: 3,
    wells: [1, 2, 2],
    pipes: [[1,2,1],[2,3,1]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Houses',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'wells',
      label: 'Well Costs',
      type: 'array',
      defaultValue: [1, 2, 2],
      placeholder: '[1,2,2]',
      helperText: 'Cost to build well in each house',
    },
    {
      name: 'pipes',
      label: 'Pipes [house1, house2, cost]',
      type: 'array',
      defaultValue: [[1,2,1],[2,3,1]],
      placeholder: '[[1,2,1]]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const wells = input.wells as number[];
    const pipes = input.pipes as number[][];
    const steps: AlgorithmStep[] = [];

    // Build edges: virtual node 0 connected to each house with well cost
    const edges: number[][] = wells.map((w, i) => [0, i + 1, w]);
    edges.push(...pipes);
    edges.sort((a, b) => a[2] - b[2]);

    // Union-Find with nodes 0..n
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    const rank = new Array(n + 1).fill(0);
    let total = 0;

    function find(x: number): number {
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: parent.slice(1),
        highlights,
        labels: Object.fromEntries(parent.slice(1).map((p, i) => [i, `h${i+1}→${p === 0 ? 'well' : p}`])),
        auxData: {
          label: 'Water Distribution MST',
          entries: [
            { key: 'Total Cost', value: String(total) },
            { key: 'Wells', value: wells.join(', ') },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Add virtual node 0 connected to each house with well cost. Total ${edges.length} edges. Sorted: ${edges.map(e => `(${e[0]}-${e[1]}: ${e[2]})`).join(', ')}.`,
      variables: { n, wells, edgeCount: edges.length },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])),
        'Virtual node added, edges sorted'
      ),
    });

    for (const [u, v, cost] of edges) {
      const pu = find(u);
      const pv = find(v);

      if (pu === pv) {
        steps.push({
          line: 8,
          explanation: `Edge (${u === 0 ? 'WELL' : `h${u}`}→h${v}, cost=${cost}): Same component. Skip.`,
          variables: { u, v, cost },
          visualization: makeViz({ [v-1]: 'mismatch' }, 'Skip — cycle'),
        });
      } else {
        let rpx = pu, rpy = pv;
        if (rank[rpx] < rank[rpy]) { const tmp = rpx; rpx = rpy; rpy = tmp; }
        parent[rpy] = rpx;
        if (rank[rpx] === rank[rpy]) rank[rpx]++;
        total += cost;

        const label = u === 0 ? `Build well in h${v}` : `Pipe ${u}→${v}`;
        steps.push({
          line: 8,
          explanation: `${label} (cost=${cost}). Total = ${total}.`,
          variables: { u, v, cost, total },
          visualization: makeViz(
            u === 0 ? { [v-1]: 'found' } : { [u-1]: 'active', [v-1]: 'active' },
            label
          ),
        });
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 10,
      explanation: `All ${n} houses have water supply. Minimum total cost = ${total}.`,
      variables: { total },
      visualization: makeViz(finalH, `Min cost: ${total}`),
    });

    return steps;
  },
};

export default optimizeWaterDistribution;
