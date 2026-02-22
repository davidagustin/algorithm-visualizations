import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const heavyLightDecomposition: AlgorithmDefinition = {
  id: 'heavy-light-decomposition',
  title: 'Heavy-Light Decomposition',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Heavy-Light Decomposition (HLD) decomposes a tree into chains, allowing path queries to be answered efficiently using a segment tree or other data structure. Each node has a "heavy child" (child with largest subtree). HLD guarantees any root-to-leaf path crosses at most O(log n) chains, enabling O(log^2 n) path queries.',
  tags: ['Tree', 'Dynamic Programming', 'Heavy-Light Decomposition', 'Advanced'],
  code: {
    pseudocode: `function HLD(tree):
  # Pass 1: compute subtree sizes and heavy children
  function dfs1(v, p):
    size[v] = 1
    for child c of v (c != p):
      dfs1(c, v)
      size[v] += size[c]
      if size[c] > size[heavy[v]]:
        heavy[v] = c

  # Pass 2: assign positions and chain heads
  function dfs2(v, h):
    head[v] = h
    pos[v] = timer++
    if heavy[v] != -1:
      dfs2(heavy[v], h)  # continue chain
    for child c != heavy[v]:
      dfs2(c, c)  # start new chain

  # Query path(u, v):
  while head[u] != head[v]:
    if depth[head[u]] < depth[head[v]]: swap
    query segment [pos[head[u]], pos[u]]
    u = parent(head[u])
  query segment [pos[u], pos[v]] (or swap)`,
    python: `def HLD(n, edges, values):
    g = [[] for _ in range(n)]
    for u,v in edges: g[u].append(v); g[v].append(u)
    size=[1]*n; heavy=[-1]*n; depth=[0]*n; parent=[-1]*n
    def dfs1(v,p,d):
        parent[v]=p; depth[v]=d; mx=0
        for c in g[v]:
            if c!=p:
                dfs1(c,v,d+1); size[v]+=size[c]
                if size[c]>mx: mx=size[c]; heavy[v]=c
    dfs1(0,-1,0)
    head=[0]*n; pos=[0]*n; timer=[0]
    def dfs2(v,h):
        head[v]=h; pos[v]=timer[0]; timer[0]+=1
        if heavy[v]!=-1: dfs2(heavy[v],h)
        for c in g[v]:
            if c!=parent[v] and c!=heavy[v]: dfs2(c,c)
    dfs2(0,0)
    return head,pos,heavy`,
    javascript: `function buildHLD(n, edges) {
  const g=Array.from({length:n},()=>[]);
  for(const[u,v]of edges){g[u].push(v);g[v].push(u);}
  const size=new Array(n).fill(1),heavy=new Array(n).fill(-1);
  const depth=new Array(n).fill(0),parent=new Array(n).fill(-1);
  function dfs1(v,p,d){parent[v]=p;depth[v]=d;let mx=0;for(const c of g[v])if(c!==p){dfs1(c,v,d+1);size[v]+=size[c];if(size[c]>mx){mx=size[c];heavy[v]=c;}}}
  dfs1(0,-1,0);
  const head=new Array(n).fill(0),pos=new Array(n).fill(0);let timer=0;
  function dfs2(v,h){head[v]=h;pos[v]=timer++;if(heavy[v]!==-1)dfs2(heavy[v],h);for(const c of g[v])if(c!==parent[v]&&c!==heavy[v])dfs2(c,c);}
  dfs2(0,0);
  return{head,pos,heavy,depth,parent};
}`,
    java: `void buildHLD(int n, List<List<Integer>> g, int[] size, int[] heavy, int[] head, int[] pos) {
    dfs1(0,-1,g,size,heavy); int[] timer={0}; dfs2(0,0,-1,g,heavy,head,pos,timer);
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
      helperText: 'Level-order tree for HLD. Heavy edges connect node to its heaviest child.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;
    const size: number[] = new Array(tree.length).fill(1);
    const heavy: number[] = new Array(tree.length).fill(-1);
    const depth: number[] = new Array(tree.length).fill(0);
    const head: number[] = new Array(tree.length).fill(0);
    const pos: number[] = new Array(tree.length).fill(0);
    let timer = 0;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Heavy-Light Decomposition: n=${n} nodes. Pass 1 finds heavy child (child with largest subtree) for each node. Pass 2 assigns HLD positions and chain heads.`,
      variables: { n },
      visualization: makeViz(0),
    });

    // DFS1: subtree sizes and heavy children
    function dfs1(idx: number, parentIdx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      if (parentIdx >= 0) depth[idx] = depth[parentIdx] + 1;

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          dfs1(childIdx, idx);
          size[idx] += size[childIdx];
          if (heavy[idx] === -1 || size[childIdx] > size[heavy[idx]]) {
            heavy[idx] = childIdx;
          }
        }
      }

      steps.push({
        line: 6,
        explanation: `DFS1: node ${tree[idx]} at index ${idx}: size=${size[idx]}, heavy child=${heavy[idx] >= 0 ? tree[heavy[idx]] : 'none'}.`,
        variables: { node: tree[idx], size: size[idx], heavyChild: heavy[idx] >= 0 ? tree[heavy[idx]] : null },
        visualization: makeViz(idx, heavy[idx] >= 0 ? { [heavy[idx]]: 'found' } : {}),
      });
    }

    // DFS2: assign HLD positions and heads
    function dfs2(idx: number, chainHead: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      head[idx] = chainHead;
      pos[idx] = timer++;

      if (heavy[idx] >= 0) {
        dfs2(heavy[idx], chainHead); // continue heavy chain
      }

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null && childIdx !== heavy[idx]) {
          dfs2(childIdx, childIdx); // new chain
        }
      }
    }

    dfs1(0, -1);

    steps.push({
      line: 11,
      explanation: 'DFS1 complete. Heavy edges identified (connect each node to its heaviest child). Now running DFS2 to assign chain heads and positions.',
      variables: {},
      visualization: makeViz(null, Object.fromEntries(
        heavy.map((h, i) => h >= 0 && tree[i] != null ? [h, 'found'] : [-1, '']).filter(([k]) => (k as number) >= 0)
      )),
    });

    dfs2(0, 0);

    for (let i = 0; i < Math.min(tree.length, n); i++) {
      if (tree[i] == null) continue;
      steps.push({
        line: 18,
        explanation: `Node ${tree[i]}: HLD position=${pos[i]}, chain head=${tree[head[i]]}, depth=${depth[i]}.`,
        variables: { node: tree[i], pos: pos[i], head: tree[head[i]], depth: depth[i] },
        visualization: makeViz(i, { [head[i]]: 'visited', [i]: 'comparing' }),
      });
    }

    steps.push({
      line: 20,
      explanation: `HLD complete! Any root-to-leaf path crosses O(log ${n}) chains. Path queries are now O(log^2 n).`,
      variables: { n },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default heavyLightDecomposition;
