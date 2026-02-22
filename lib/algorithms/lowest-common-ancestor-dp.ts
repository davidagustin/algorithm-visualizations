import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const lcaDP: AlgorithmDefinition = {
  id: 'lowest-common-ancestor-dp',
  title: 'Lowest Common Ancestor (DP)',
  leetcodeNumber: 1483,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Preprocess a binary tree so that LCA queries and k-th ancestor queries can be answered efficiently. Using DP: dp[node][j] = 2^j-th ancestor of node. For LCA(u, v): first equalize depths using binary lifting, then simultaneously move both nodes up. This DP-based approach answers each query in O(log n) after O(n log n) preprocessing.',
  tags: ['Tree', 'Dynamic Programming', 'LCA', 'Binary Lifting'],
  code: {
    pseudocode: `# Preprocess: build ancestor table
function preprocess(root):
  for each node v (BFS order):
    dp[v][0] = parent(v)
  for j from 1 to LOG:
    dp[v][j] = dp[dp[v][j-1]][j-1]

# Query: LCA(u, v)
function LCA(u, v):
  if depth[u] < depth[v]: swap(u, v)
  lift u by (depth[u] - depth[v])
  if u == v: return u
  for j from LOG to 0:
    if dp[u][j] != dp[v][j]:
      u = dp[u][j]; v = dp[v][j]
  return parent(u)`,
    python: `class TreeAncestor:
    def __init__(self, n, parent):
        import math
        LOG = int(math.log2(n)) + 1
        self.dp = [[-1]*LOG for _ in range(n)]
        for v, p in enumerate(parent):
            self.dp[v][0] = p
        for j in range(1, LOG):
            for v in range(n):
                if self.dp[v][j-1] != -1:
                    self.dp[v][j] = self.dp[self.dp[v][j-1]][j-1]
    def getKthAncestor(self, node, k):
        for j in range(len(self.dp[0])):
            if k >> j & 1:
                node = self.dp[node][j]
                if node == -1: return -1
        return node`,
    javascript: `class TreeAncestor {
  constructor(n, parent) {
    const LOG = Math.ceil(Math.log2(n)) + 1;
    this.dp = Array.from({length:n},()=>new Array(LOG).fill(-1));
    parent.forEach((p,v) => this.dp[v][0] = p);
    for(let j=1;j<LOG;j++) for(let v=0;v<n;v++)
      if(this.dp[v][j-1]!==-1) this.dp[v][j]=this.dp[this.dp[v][j-1]][j-1];
  }
  getKthAncestor(node, k) {
    for(let j=0;j<this.dp[0].length;j++)
      if(k>>j&1){node=this.dp[node][j];if(node===-1)return -1;}
    return node;
  }
}`,
    java: `class TreeAncestor {
    int[][] dp; int LOG;
    public TreeAncestor(int n, int[] parent) {
        LOG = (int)(Math.log(n)/Math.log(2))+2;
        dp = new int[n][LOG]; for(int[] r:dp) Arrays.fill(r,-1);
        for(int v=0;v<n;v++) dp[v][0]=parent[v];
        for(int j=1;j<LOG;j++) for(int v=0;v<n;v++)
            if(dp[v][j-1]!=-1) dp[v][j]=dp[dp[v][j-1]][j-1];
    }
    public int getKthAncestor(int node, int k) {
        for(int j=0;j<LOG;j++) if((k>>j&1)==1){node=dp[node][j];if(node==-1)return -1;}
        return node;
    }
}`,
  },
  defaultInput: { tree: [3, 5, 1, 6, 2, 0, 8], p: 5, q: 1 },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 5, 1, 6, 2, 0, 8],
      placeholder: 'e.g. 3,5,1,6,2,0,8',
      helperText: 'Level-order tree for LCA DP preprocessing.',
    },
    {
      name: 'p',
      label: 'Node p value',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'First node for LCA query.',
    },
    {
      name: 'q',
      label: 'Node q value',
      type: 'number',
      defaultValue: 1,
      placeholder: 'e.g. 1',
      helperText: 'Second node for LCA query.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const p = input.p as number;
    const q = input.q as number;
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;
    const LOG = Math.max(1, Math.ceil(Math.log2(Math.max(n, 2))));
    const dp: number[][] = Array.from({ length: tree.length }, () => new Array(LOG + 1).fill(-1));
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
      explanation: `LCA DP preprocessing: build ancestor table for ${n} nodes. dp[v][j] = 2^j-th ancestor. Query LCA(${p}, ${q}).`,
      variables: { n, LOG, queryP: p, queryQ: q },
      visualization: makeViz(0),
    });

    // Build dp[v][0] = direct parent
    for (let i = 0; i < tree.length; i++) {
      if (tree[i] == null) continue;
      dp[i][0] = i === 0 ? -1 : Math.floor((i - 1) / 2);
      if (i > 0) depth[i] = depth[dp[i][0]] + 1;
    }

    // Fill dp[v][j]
    for (let j = 1; j <= LOG; j++) {
      for (let v = 0; v < tree.length; v++) {
        if (tree[v] == null) continue;
        const mid = dp[v][j - 1];
        dp[v][j] = mid >= 0 ? dp[mid][j - 1] : -1;
      }
    }

    steps.push({
      line: 5,
      explanation: `Preprocessing complete: ancestor table built. Each dp[v][j] gives 2^j-th ancestor. Now query LCA(${p}, ${q}).`,
      variables: { LOG },
      visualization: makeViz(null, { 0: 'visited' }),
    });

    // Find indices of p and q
    const pIdx = tree.indexOf(p);
    const qIdx = tree.indexOf(q);

    if (pIdx < 0 || qIdx < 0) {
      steps.push({
        line: 9,
        explanation: `Node ${p} or ${q} not found in tree.`,
        variables: { p, q },
        visualization: makeViz(null),
      });
      return steps;
    }

    steps.push({
      line: 9,
      explanation: `LCA query: p=${p} at index ${pIdx} (depth=${depth[pIdx]}), q=${q} at index ${qIdx} (depth=${depth[qIdx]}).`,
      variables: { p, pIdx, depthP: depth[pIdx], q, qIdx, depthQ: depth[qIdx] },
      visualization: makeViz(null, { [pIdx]: 'pointer', [qIdx]: 'pointer' }),
    });

    // Equalize depths
    let a = pIdx, b = qIdx;
    while (depth[a] > depth[b] && dp[a][0] >= 0) {
      steps.push({
        line: 11,
        explanation: `Lifting ${tree[a]} (depth ${depth[a]}) to match depth of ${tree[b]} (depth ${depth[b]}).`,
        variables: { lifting: tree[a], to: tree[b] },
        visualization: makeViz(a, { [a]: 'comparing', [b]: 'pointer' }),
      });
      a = dp[a][0];
    }
    while (depth[b] > depth[a] && dp[b][0] >= 0) {
      b = dp[b][0];
    }

    if (a === b) {
      steps.push({
        line: 12,
        explanation: `After equalizing depths, ${tree[a]} = ${tree[b]}. LCA = ${tree[a]}.`,
        variables: { lca: tree[a] },
        visualization: makeViz(a, { [a]: 'found' }),
      });
      return steps;
    }

    // Move both up until they diverge
    for (let j = LOG; j >= 0; j--) {
      if (a < 0 || b < 0) break;
      if (dp[a][j] !== dp[b][j] && dp[a][j] >= 0) {
        a = dp[a][j];
        b = dp[b][j];
        steps.push({
          line: 14,
          explanation: `Jump both by 2^${j}. a=${tree[a]}, b=${tree[b]}. They differ, so LCA is above.`,
          variables: { a: tree[a], b: tree[b], jump: Math.pow(2, j) },
          visualization: makeViz(a, { [a]: 'comparing', [b]: 'comparing' }),
        });
      }
    }

    const lcaIdx = dp[a][0] >= 0 ? dp[a][0] : a;

    steps.push({
      line: 15,
      explanation: `LCA(${p}, ${q}) = ${tree[lcaIdx]} at index ${lcaIdx}.`,
      variables: { lca: tree[lcaIdx], p, q },
      visualization: makeViz(lcaIdx, {
        [pIdx]: 'pointer',
        [qIdx]: 'pointer',
        [lcaIdx]: 'found',
      }),
    });

    return steps;
  },
};

export default lcaDP;
