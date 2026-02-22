import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const unionByRankVisualization: AlgorithmDefinition = {
  id: 'union-by-rank-visualization',
  title: 'Union by Rank Visualization',
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Union by rank is an optimization for union-find. When merging two components, always attach the shorter tree under the taller tree (by rank). This keeps trees balanced and ensures find operations run in O(log n) worst case. Combined with path compression, it achieves near-constant amortized time.',
  tags: ['union find', 'graph', 'union by rank', 'optimization'],

  code: {
    pseudocode: `// Union by rank
parent = [0..n-1]
rank = [0]*n

function find(x):
  while parent[x] != x:
    parent[x] = parent[parent[x]]
    x = parent[x]
  return x

function union(a, b):
  pa, pb = find(a), find(b)
  if pa == pb: return
  if rank[pa] < rank[pb]:
    parent[pa] = pb   // attach shorter under taller
  elif rank[pa] > rank[pb]:
    parent[pb] = pa
  else:
    parent[pb] = pa   // tie: attach b under a, increment a's rank
    rank[pa] += 1`,

    python: `parent = list(range(n))
rank = [0] * n

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    pa, pb = find(a), find(b)
    if pa == pb: return
    if rank[pa] < rank[pb]:
        parent[pa] = pb
    elif rank[pa] > rank[pb]:
        parent[pb] = pa
    else:
        parent[pb] = pa
        rank[pa] += 1`,

    javascript: `const parent = Array.from({length:n},(_,i)=>i);
const rank = new Array(n).fill(0);

function find(x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]];
    x = parent[x];
  }
  return x;
}

function union(a, b) {
  const pa = find(a), pb = find(b);
  if (pa === pb) return;
  if (rank[pa] < rank[pb]) parent[pa] = pb;
  else if (rank[pa] > rank[pb]) parent[pb] = pa;
  else { parent[pb] = pa; rank[pa]++; }
}`,

    java: `int[] parent = new int[n], rank = new int[n];
for(int i=0;i<n;i++) parent[i]=i;

int find(int x) {
    while(parent[x]!=x){parent[x]=parent[parent[x]];x=parent[x];}
    return x;
}

void union(int a, int b) {
    int pa=find(a), pb=find(b);
    if(pa==pb) return;
    if(rank[pa]<rank[pb]) parent[pa]=pb;
    else if(rank[pa]>rank[pb]) parent[pb]=pa;
    else { parent[pb]=pa; rank[pa]++; }
}`,
  },

  defaultInput: {
    n: 7,
    unions: [[0, 1], [2, 3], [4, 5], [0, 2], [0, 4], [0, 6]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total nodes in the union-find structure',
    },
    {
      name: 'unions',
      label: 'Union Operations',
      type: 'array',
      defaultValue: [[0, 1], [2, 3], [4, 5], [0, 2], [0, 4], [0, 6]],
      placeholder: '[[0,1],[2,3]]',
      helperText: 'Sequence of union(a, b) operations to visualize',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const unions = input.unions as number[][];
    const steps: AlgorithmStep[] = [];

    const parent: number[] = Array.from({ length: n }, (_, i) => i);
    const rank: number[] = new Array(n).fill(0);

    function find(x: number): number {
      while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
      return x;
    }

    steps.push({
      line: 1,
      explanation: `Initialize ${n} nodes. parent[i]=i, rank[i]=0 for all i. Each node is its own root with rank 0.`,
      variables: { n, parent: parent.join(','), rank: rank.join(',') },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: {},
        labels: Object.fromEntries(parent.map((_, i) => [i, `r:${rank[i]}`])),
      },
    });

    for (const [a, b] of unions) {
      const pa = find(a);
      const pb = find(b);

      steps.push({
        line: 10,
        explanation: `union(${a}, ${b}): find(${a})=${pa} (rank ${rank[pa]}), find(${b})=${pb} (rank ${rank[pb]}).`,
        variables: { a, b, rootA: pa, rootB: pb, rankA: rank[pa], rankB: rank[pb] },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: { [a]: 'active', [b]: 'comparing', [pa]: 'pointer', [pb]: 'pointer' },
          labels: Object.fromEntries(parent.map((_, i) => [i, `r:${rank[i]}`])),
        },
      });

      if (pa === pb) {
        steps.push({
          line: 11,
          explanation: `${a} and ${b} are already in same component (root=${pa}). No union needed.`,
          variables: { alreadyConnected: true },
          visualization: {
            type: 'array',
            array: [...parent],
            highlights: { [a]: 'found', [b]: 'found' },
            labels: Object.fromEntries(parent.map((_, i) => [i, `r:${rank[i]}`])),
          },
        });
        continue;
      }

      let explanation = '';
      if (rank[pa] < rank[pb]) {
        parent[pa] = pb;
        explanation = `rank[${pa}]=${rank[pa]} < rank[${pb}]=${rank[pb]}. Attach tree of ${pa} under ${pb}. rank unchanged.`;
      } else if (rank[pa] > rank[pb]) {
        parent[pb] = pa;
        explanation = `rank[${pa}]=${rank[pa]} > rank[${pb}]=${rank[pb]}. Attach tree of ${pb} under ${pa}. rank unchanged.`;
      } else {
        parent[pb] = pa;
        rank[pa]++;
        explanation = `Equal ranks (${rank[pa] - 1}). Attach ${pb} under ${pa}. Increment rank[${pa}] to ${rank[pa]}.`;
      }

      steps.push({
        line: 14,
        explanation,
        variables: { newRoot: find(a), rankOfNewRoot: rank[find(a)], parent: parent.join(',') },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: { [pa]: 'active', [pb]: 'visited' },
          labels: Object.fromEntries(parent.map((_, i) => [i, `p:${parent[i]},r:${rank[i]}`])),
        },
      });
    }

    steps.push({
      line: 18,
      explanation: `All union operations complete. Final parent array: [${parent}]. Ranks: [${rank}]. Union by rank keeps tree height at O(log n).`,
      variables: { parent: parent.join(','), rank: rank.join(',') },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: Object.fromEntries(parent.map((v, i) => [i, v === i ? 'found' : 'sorted'])),
        labels: Object.fromEntries(parent.map((_, i) => [i, `r${rank[i]}`])),
      },
    });

    return steps;
  },
};

export default unionByRankVisualization;
