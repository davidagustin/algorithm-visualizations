import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const centroidDecomposition: AlgorithmDefinition = {
  id: 'centroid-decomposition',
  title: 'Centroid Decomposition',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Centroid Decomposition decomposes a tree recursively. The centroid of a tree is the node whose removal results in all subtrees having size <= n/2. By recursively finding centroids, we build a centroid tree of height O(log n). This enables efficient O(n log n) solutions for path problems: any path passes through the centroid of some decomposed subtree.',
  tags: ['Tree', 'Dynamic Programming', 'Centroid Decomposition', 'Advanced'],
  code: {
    pseudocode: `function centroidDecompose(tree):
  function getSize(v, p, removed):
    size[v] = 1
    for child c (c != p, not removed):
      size[v] += getSize(c, v, removed)
    return size[v]

  function getCentroid(v, p, treeSize, removed):
    for child c (c != p, not removed):
      if size[c] > treeSize/2:
        return getCentroid(c, v, treeSize, removed)
    return v

  function decompose(v, parent, removed):
    getSize(v, -1, removed)
    c = getCentroid(v, -1, size[v], removed)
    centroidParent[c] = parent
    removed[c] = true
    for child ch of c (not removed):
      decompose(ch, c, removed)`,
    python: `def centroidDecompose(n, edges):
    g = [[] for _ in range(n)]
    for u,v in edges: g[u].append(v); g[v].append(u)
    size = [0]*n; removed = [False]*n; centpar = [-1]*n
    def getSize(v,p):
        size[v]=1
        for c in g[v]:
            if c!=p and not removed[c]:
                getSize(c,v); size[v]+=size[c]
    def getCentroid(v,p,ts):
        for c in g[v]:
            if c!=p and not removed[c] and size[c]>ts//2:
                return getCentroid(c,v,ts)
        return v
    def decompose(v,par):
        getSize(v,-1)
        cent=getCentroid(v,-1,size[v])
        centpar[cent]=par; removed[cent]=True
        for c in g[cent]:
            if not removed[c]: decompose(c,cent)
    decompose(0,-1)
    return centpar`,
    javascript: `function centroidDecompose(n, edges) {
  const g=Array.from({length:n},()=>[]);
  for(const[u,v]of edges){g[u].push(v);g[v].push(u);}
  const size=new Array(n).fill(0),removed=new Array(n).fill(false),centpar=new Array(n).fill(-1);
  function getSize(v,p){size[v]=1;for(const c of g[v])if(c!==p&&!removed[c]){getSize(c,v);size[v]+=size[c];}}
  function getCentroid(v,p,ts){for(const c of g[v])if(c!==p&&!removed[c]&&size[c]>ts>>1)return getCentroid(c,v,ts);return v;}
  function decompose(v,par){getSize(v,-1);const cent=getCentroid(v,-1,size[v]);centpar[cent]=par;removed[cent]=true;for(const c of g[cent])if(!removed[c])decompose(c,cent);}
  decompose(0,-1); return centpar;
}`,
    java: `int[] centroidDecompose(int n, int[][] edges) {
    List<List<Integer>> g=new ArrayList<>();
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[] e:edges){g.get(e[0]).add(e[1]);g.get(e[1]).add(e[0]);}
    int[] size=new int[n], centpar=new int[n];
    boolean[] removed=new boolean[n];
    Arrays.fill(centpar,-1);
    decompose(0,-1,g,size,removed,centpar);
    return centpar;
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
      helperText: 'Level-order tree. Centroid decomposition builds O(log n) height centroid tree.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;
    const size: number[] = new Array(tree.length).fill(1);
    const removed: boolean[] = new Array(tree.length).fill(false);
    const centpar: number[] = new Array(tree.length).fill(-1);

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      for (let i = 0; i < tree.length; i++) {
        if (removed[i] && tree[i] != null) highlights[i] = 'visited';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Centroid Decomposition: n=${n} nodes. Recursively find centroids (nodes whose removal splits tree into parts each <= n/2). Centroid tree has height O(log n).`,
      variables: { n },
      visualization: makeViz(0),
    });

    function getSize(idx: number, parentIdx: number): number {
      if (idx >= tree.length || tree[idx] == null || removed[idx]) return 0;
      size[idx] = 1;
      for (const childIdx of [2 * idx + 1, 2 * idx + 2]) {
        if (childIdx < tree.length && tree[childIdx] != null && childIdx !== parentIdx && !removed[childIdx]) {
          size[idx] += getSize(childIdx, idx);
        }
      }
      return size[idx];
    }

    function getCentroid(idx: number, parentIdx: number, treeSize: number): number {
      for (const childIdx of [2 * idx + 1, 2 * idx + 2]) {
        if (childIdx < tree.length && tree[childIdx] != null && childIdx !== parentIdx && !removed[childIdx]) {
          if (size[childIdx] > treeSize / 2) return getCentroid(childIdx, idx, treeSize);
        }
      }
      return idx;
    }

    function decompose(idx: number, parCentroid: number, depth: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const ts = getSize(idx, -1);
      const cent = getCentroid(idx, -1, ts);
      centpar[cent] = parCentroid;
      removed[cent] = true;

      steps.push({
        line: 14,
        explanation: `Decompose subtree at index ${idx}: centroid = node ${tree[cent]} (index ${cent}, size=${ts}). Marked removed. centroid parent = ${parCentroid >= 0 ? tree[parCentroid] : 'none'}.`,
        variables: { centroid: tree[cent], centroidIdx: cent, subtreeSize: ts, centroidParent: parCentroid >= 0 ? tree[parCentroid] : null, depth },
        visualization: makeViz(cent, { [cent]: 'found' }),
      });

      for (const childIdx of [2 * cent + 1, 2 * cent + 2]) {
        if (childIdx < tree.length && tree[childIdx] != null && !removed[childIdx]) {
          decompose(childIdx, cent, depth + 1);
        }
      }
    }

    decompose(0, -1, 0);

    steps.push({
      line: 17,
      explanation: `Centroid decomposition complete! Centroid tree has height O(log ${n}). Each path in original tree passes through centroid of some subtree.`,
      variables: { centparMap: centpar.slice(0, n) },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default centroidDecomposition;
