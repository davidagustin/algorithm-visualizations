import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryLifting: AlgorithmDefinition = {
  id: 'binary-lifting',
  title: 'Binary Lifting (LCA)',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Binary Lifting is a technique for O(log n) LCA (Lowest Common Ancestor) queries after O(n log n) preprocessing. For each node v, precompute ancestor[v][j] = the 2^j-th ancestor of v. LCA(u, v): first bring u and v to same depth, then simultaneously jump both in decreasing powers of 2 until they diverge; the parent of that divergence point is the LCA.',
  tags: ['Tree', 'Dynamic Programming', 'LCA', 'Binary Lifting', 'Advanced'],
  code: {
    pseudocode: `function binaryLifting(tree, n):
  LOG = ceil(log2(n))
  ancestor[v][0] = parent(v)  # direct parent
  for j from 1 to LOG:
    for each node v:
      ancestor[v][j] = ancestor[ancestor[v][j-1]][j-1]

  function LCA(u, v):
    if depth[u] < depth[v]: swap u, v
    # Bring u to same depth as v
    diff = depth[u] - depth[v]
    for j in decreasing powers of 2:
      if diff >= 2^j: u = ancestor[u][j]; diff -= 2^j
    if u == v: return v
    # Move both up until they diverge
    for j from LOG down to 0:
      if ancestor[u][j] != ancestor[v][j]:
        u = ancestor[u][j]; v = ancestor[v][j]
    return parent(u)`,
    python: `def binaryLifting(n, edges):
    import math
    LOG = max(1, int(math.log2(n)) + 1)
    g = [[] for _ in range(n)]
    for u, v in edges: g[u].append(v); g[v].append(u)
    depth = [0]*n; par = [[0]*LOG for _ in range(n)]
    def dfs(u, p, d):
        depth[u]=d; par[u][0]=p
        for v in g[u]:
            if v!=p: dfs(v,u,d+1)
    dfs(0,-1,0)
    for j in range(1,LOG):
        for v in range(n):
            par[v][j] = par[par[v][j-1]][j-1] if par[v][j-1]!=-1 else -1
    def lca(u,v):
        if depth[u]<depth[v]: u,v=v,u
        diff=depth[u]-depth[v]
        for j in range(LOG):
            if diff>>j&1: u=par[u][j]
        if u==v: return u
        for j in range(LOG-1,-1,-1):
            if par[u][j]!=par[v][j]: u=par[u][j];v=par[v][j]
        return par[u][0]
    return lca`,
    javascript: `function binaryLifting(n, edges) {
  const LOG = Math.ceil(Math.log2(n)) + 1;
  const g = Array.from({length:n},()=>[]);
  for(const [u,v] of edges){g[u].push(v);g[v].push(u);}
  const depth=new Array(n).fill(0), par=Array.from({length:n},()=>new Array(LOG).fill(-1));
  function dfs(u,p,d){depth[u]=d;par[u][0]=p;for(const v of g[u])if(v!==p)dfs(v,u,d+1);}
  dfs(0,-1,0);
  for(let j=1;j<LOG;j++) for(let v=0;v<n;v++) if(par[v][j-1]!==-1) par[v][j]=par[par[v][j-1]][j-1];
  function lca(u,v){/* see pseudocode */}
  return lca;
}`,
    java: `void buildBinaryLifting(int n, int[][] edges) {
    int LOG = (int)(Math.log(n)/Math.log(2))+2;
    int[][] par = new int[n][LOG]; int[] depth = new int[n];
    Arrays.fill(par[0], -1);
    // build graph, DFS for depth and par[v][0]
    // fill par[v][j] = par[par[v][j-1]][j-1]
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Level-order tree. Binary lifting precomputes 2^j-th ancestors.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const n = tree.filter(v => v != null).length;
    const LOG = Math.max(1, Math.ceil(Math.log2(Math.max(n, 2))));
    const steps: AlgorithmStep[] = [];

    // ancestor[v][j] = 2^j-th ancestor (index in tree array)
    const ancestor: number[][] = Array.from({ length: tree.length }, () => new Array(LOG + 1).fill(-1));
    const depth: number[] = new Array(tree.length).fill(0);

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Binary Lifting: precompute ancestor[v][j] = 2^j-th ancestor of v. LOG=${LOG}. After O(n·log n) preprocessing, LCA queries run in O(log n).`,
      variables: { n, LOG },
      visualization: makeViz(0),
    });

    // Fill depth and ancestor[v][0] (direct parent)
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] == null) continue;
      const parentIdx = i === 0 ? -1 : Math.floor((i - 1) / 2);
      ancestor[i][0] = parentIdx;
      if (parentIdx >= 0) depth[i] = depth[parentIdx] + 1;

      steps.push({
        line: 2,
        explanation: `Node ${tree[i]} at index ${i}: depth=${depth[i]}, direct parent index=${parentIdx} (value=${parentIdx >= 0 ? tree[parentIdx] : 'none'}).`,
        variables: { node: tree[i], index: i, depth: depth[i], parent: parentIdx >= 0 ? tree[parentIdx] : null },
        visualization: makeViz(i, parentIdx >= 0 ? { [parentIdx]: 'visited' } : {}),
      });
    }

    // Fill ancestor[v][j] for j >= 1
    for (let j = 1; j <= LOG; j++) {
      for (let v = 0; v < tree.length; v++) {
        if (tree[v] == null) continue;
        const mid = ancestor[v][j - 1];
        ancestor[v][j] = mid >= 0 && mid < tree.length ? ancestor[mid][j - 1] : -1;
      }
      steps.push({
        line: 3,
        explanation: `Filled ancestor[][${j}] = 2^${j}-th ancestor. ancestor[v][${j}] = ancestor[ancestor[v][${j-1}]][${j-1}].`,
        variables: { j, power: Math.pow(2, j) },
        visualization: makeViz(null, { 0: 'comparing' }),
      });
    }

    // Demo LCA query on two leaf nodes
    const nodeIndices = tree.map((v, i) => v != null ? i : -1).filter(i => i >= 0);
    if (nodeIndices.length >= 2) {
      const u = nodeIndices[nodeIndices.length - 1];
      const v = nodeIndices[nodeIndices.length - 2];

      let a = u, b = v;
      while (depth[a] > depth[b]) a = ancestor[a][0];
      while (depth[b] > depth[a]) b = ancestor[b][0];
      while (a !== b) { a = ancestor[a][0]; b = ancestor[b][0]; }
      const lca = a;

      steps.push({
        line: 16,
        explanation: `LCA query: nodes ${tree[u]} (depth ${depth[u]}) and ${tree[v]} (depth ${depth[v]}). LCA = ${tree[lca]} (depth ${depth[lca]}).`,
        variables: { u: tree[u], v: tree[v], lca: tree[lca] },
        visualization: makeViz(lca, { [u]: 'pointer', [v]: 'pointer', [lca]: 'found' }),
      });
    }

    return steps;
  },
};

export default binaryLifting;
