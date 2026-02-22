import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeMaxNumberOfEdges: AlgorithmDefinition = {
  id: 'remove-max-number-of-edges',
  title: 'Remove Max Number of Edges to Keep Graph Fully Traversable',
  leetcodeNumber: 1579,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Alice and Bob share a graph. Type 1 edges are for Alice only, type 2 for Bob only, type 3 for both. Find the maximum number of removable edges while keeping the graph fully traversable for both. Use two separate union-finds (Alice and Bob). Process type 3 edges first (shared), then type 1 and 2. Remove any edge that does not reduce components.',
  tags: ['union find', 'graph', 'greedy'],

  code: {
    pseudocode: `function maxNumEdgesToRemove(n, edges):
  ufAlice = UnionFind(n)
  ufBob = UnionFind(n)
  removed = 0
  // Process type 3 (shared) edges first
  for [type, u, v] in edges where type == 3:
    usedAlice = ufAlice.union(u, v)
    usedBob = ufBob.union(u, v)
    if not usedAlice and not usedBob:
      removed += 1
  // Process type 1 (Alice) and type 2 (Bob)
  for [type, u, v] in edges where type != 3:
    uf = ufAlice if type == 1 else ufBob
    if not uf.union(u, v):
      removed += 1
  // Check if both are fully connected
  if ufAlice.components > 1 or ufBob.components > 1:
    return -1
  return removed`,

    python: `def maxNumEdgesToRemove(n, edges):
    class UF:
        def __init__(self, n):
            self.parent = list(range(n+1))
            self.comp = n
        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x
        def union(self, a, b):
            pa, pb = self.find(a), self.find(b)
            if pa == pb: return False
            self.parent[pa] = pb
            self.comp -= 1
            return True
    alice, bob = UF(n), UF(n)
    removed = 0
    for t, u, v in edges:
        if t == 3:
            ua = alice.union(u, v)
            ub = bob.union(u, v)
            if not ua and not ub: removed += 1
    for t, u, v in edges:
        if t == 1:
            if not alice.union(u, v): removed += 1
        elif t == 2:
            if not bob.union(u, v): removed += 1
    if alice.comp > 1 or bob.comp > 1: return -1
    return removed`,

    javascript: `function maxNumEdgesToRemove(n, edges) {
  class UF {
    constructor(n) { this.p=Array.from({length:n+1},(_,i)=>i); this.c=n; }
    find(x){while(this.p[x]!==x){this.p[x]=this.p[this.p[x]];x=this.p[x];}return x;}
    union(a,b){const pa=this.find(a),pb=this.find(b);if(pa===pb)return false;this.p[pa]=pb;this.c--;return true;}
  }
  const alice=new UF(n), bob=new UF(n);
  let removed=0;
  for(const[t,u,v]of edges)
    if(t===3){const ua=alice.union(u,v),ub=bob.union(u,v);if(!ua&&!ub)removed++;}
  for(const[t,u,v]of edges){
    if(t===1&&!alice.union(u,v))removed++;
    else if(t===2&&!bob.union(u,v))removed++;
  }
  if(alice.c>1||bob.c>1)return -1;
  return removed;
}`,

    java: `public int maxNumEdgesToRemove(int n, int[][] edges) {
    int[] pA=new int[n+1],pB=new int[n+1];
    int cA=n,cB=n,removed=0;
    for(int i=0;i<=n;i++){pA[i]=i;pB[i]=i;}
    for(int[]e:edges) if(e[0]==3){
        boolean ua=union(pA,e[1],e[2]),ub=union(pB,e[1],e[2]);
        if(ua)cA--; if(ub)cB--;
        if(!ua&&!ub) removed++;
    }
    for(int[]e:edges){
        if(e[0]==1){if(!union(pA,e[1],e[2]))removed++;else cA--;}
        else if(e[0]==2){if(!union(pB,e[1],e[2]))removed++;else cB--;}
    }
    if(cA>1||cB>1) return -1;
    return removed;
}`,
  },

  defaultInput: {
    n: 4,
    edges: [[3, 1, 2], [3, 2, 3], [1, 1, 3], [1, 2, 4], [1, 1, 2], [2, 3, 4]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Nodes labeled 1 to n',
    },
    {
      name: 'edges',
      label: 'Edges',
      type: 'array',
      defaultValue: [[3, 1, 2], [3, 2, 3], [1, 1, 3], [1, 2, 4], [1, 1, 2], [2, 3, 4]],
      placeholder: '[[3,1,2],[1,1,3],[2,3,4]]',
      helperText: 'Each edge is [type(1/2/3), u, v]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const parentA: number[] = Array.from({ length: n + 1 }, (_, i) => i);
    const parentB: number[] = Array.from({ length: n + 1 }, (_, i) => i);
    let compA = n;
    let compB = n;
    let removed = 0;

    function findA(x: number): number {
      while (parentA[x] !== x) { parentA[x] = parentA[parentA[x]]; x = parentA[x]; }
      return x;
    }
    function findB(x: number): number {
      while (parentB[x] !== x) { parentB[x] = parentB[parentB[x]]; x = parentB[x]; }
      return x;
    }
    function unionA(a: number, b: number): boolean {
      const pa = findA(a), pb = findA(b);
      if (pa === pb) return false;
      parentA[pa] = pb; compA--;
      return true;
    }
    function unionB(a: number, b: number): boolean {
      const pa = findB(a), pb = findB(b);
      if (pa === pb) return false;
      parentB[pa] = pb; compB--;
      return true;
    }

    steps.push({
      line: 1,
      explanation: `Initialize separate union-finds for Alice and Bob. ${n} nodes each. Process ${edges.length} edges.`,
      variables: { n, edgeCount: edges.length, compA, compB },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i + 1),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i + 1}`])),
      },
    });

    // Process type 3 edges first
    for (const [type, u, v] of edges) {
      if (type !== 3) continue;
      const ua = unionA(u, v);
      const ub = unionB(u, v);

      steps.push({
        line: 6,
        explanation: `Type 3 edge [${u}-${v}]: used by Alice=${ua}, used by Bob=${ub}. ${!ua && !ub ? 'Neither needed it - REMOVE.' : 'At least one used it - keep.'}`,
        variables: { type, u, v, usedAlice: ua, usedBob: ub, removed, compA, compB },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => i + 1),
          highlights: { [u - 1]: 'active', [v - 1]: 'comparing' },
          labels: { [u - 1]: `u:${u}`, [v - 1]: `v:${v}`, 0: `rem:${removed}` },
        },
      });

      if (!ua && !ub) removed++;
    }

    // Process type 1 and 2 edges
    for (const [type, u, v] of edges) {
      if (type === 3) continue;
      let used = false;
      if (type === 1) {
        used = unionA(u, v);
      } else {
        used = unionB(u, v);
      }

      steps.push({
        line: 11,
        explanation: `Type ${type} edge [${u}-${v}] (${type === 1 ? 'Alice' : 'Bob'} only): ${used ? 'needed - keep.' : 'redundant - REMOVE.'}`,
        variables: { type, u, v, used, removed: used ? removed : removed + 1, compA, compB },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => i + 1),
          highlights: { [u - 1]: type === 1 ? 'active' : 'comparing', [v - 1]: 'pointer' },
          labels: { [u - 1]: `u`, [v - 1]: `v`, 0: `rem:${used ? removed : removed + 1}` },
        },
      });

      if (!used) removed++;
    }

    if (compA > 1 || compB > 1) {
      steps.push({
        line: 15,
        explanation: `Alice has ${compA} component(s), Bob has ${compB}. Graph not fully traversable for both. Return -1.`,
        variables: { compA, compB, result: -1 },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => i + 1),
          highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'mismatch'])),
          labels: {},
        },
      });
    } else {
      steps.push({
        line: 16,
        explanation: `Both Alice (${compA} comp) and Bob (${compB} comp) are fully connected. Maximum removable edges: ${removed}.`,
        variables: { compA, compB, result: removed },
        visualization: {
          type: 'array',
          array: Array.from({ length: n }, (_, i) => i + 1),
          highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
          labels: { 0: `removed:${removed}` },
        },
      });
    }

    return steps;
  },
};

export default removeMaxNumberOfEdges;
