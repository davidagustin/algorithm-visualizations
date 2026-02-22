import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const reRootingTechnique: AlgorithmDefinition = {
  id: 're-rooting-technique',
  title: 'Re-Rooting Technique',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Re-rooting (or rerooting) is a tree DP technique that computes, for each node, the answer if that node were the root. First DFS computes values rooted at node 0 (subtree sizes, distances). Second DFS propagates to children: when we move the root from parent to child, we can update the child\'s answer in O(1) using the parent\'s answer. Used in Sum of Distances (LC 834), etc.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph', 'Advanced'],
  code: {
    pseudocode: `function reRooting(tree, n):
  # Pass 1: root at node 0
  function dfs1(node, parent):
    subtreeSize[node] = 1
    for child of node (child != parent):
      dfs1(child, node)
      subtreeSize[node] += subtreeSize[child]
      dp[node] += dp[child] + subtreeSize[child]

  # Pass 2: re-root from node 0 downward
  function dfs2(node, parent):
    for child of node (child != parent):
      # Move root from node to child
      dp[child] = dp[node] + (n - subtreeSize[child]) - subtreeSize[child]
      subtreeSize adjusted
      dfs2(child, node)

  dfs1(0, -1); dfs2(0, -1)
  return dp[]`,
    python: `def reRooting(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v); graph[v].append(u)
    size = [1]*n; dp = [0]*n
    def dfs1(u, p):
        for v in graph[u]:
            if v != p:
                dfs1(v, u)
                size[u] += size[v]
                dp[u] += dp[v] + size[v]
    def dfs2(u, p):
        for v in graph[u]:
            if v != p:
                dp[v] = dp[u] - size[v] + (n - size[v])
                dfs2(v, u)
    dfs1(0,-1); dfs2(0,-1)
    return dp`,
    javascript: `function reRooting(n, edges) {
  const g = Array.from({length:n},()=>[]);
  for(const [u,v] of edges){g[u].push(v);g[v].push(u);}
  const size=new Array(n).fill(1), dp=new Array(n).fill(0);
  function dfs1(u,p){for(const v of g[u])if(v!==p){dfs1(v,u);size[u]+=size[v];dp[u]+=dp[v]+size[v];}}
  function dfs2(u,p){for(const v of g[u])if(v!==p){dp[v]=dp[u]-size[v]+(n-size[v]);dfs2(v,u);}}
  dfs1(0,-1);dfs2(0,-1);
  return dp;
}`,
    java: `int[] reRooting(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<>();
    for(int i=0;i<n;i++) g.add(new ArrayList<>());
    for(int[] e:edges){g.get(e[0]).add(e[1]);g.get(e[1]).add(e[0]);}
    int[] size=new int[n], dp=new int[n];
    Arrays.fill(size,1);
    dfs1(0,-1,g,size,dp);
    dfs2(0,-1,n,g,size,dp);
    return dp;
}`,
  },
  defaultInput: { tree: [0, 1, 2, 3, 4, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'Tree nodes (level-order)',
      type: 'tree',
      defaultValue: [0, 1, 2, 3, 4, 5, 6],
      placeholder: 'e.g. 0,1,2,3,4,5,6',
      helperText: 'Node indices as binary tree. Re-rooting computes answer for every root.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;
    const size: number[] = new Array(n).fill(1);
    const dp: number[] = new Array(n).fill(0);

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Re-Rooting Technique: two-pass DFS on ${n}-node tree. Pass 1 computes subtree sizes and dp[0] (sum of distances from root 0). Pass 2 re-roots to every node in O(n).`,
      variables: { n, technique: 're-rooting' },
      visualization: makeViz(0),
    });

    // DFS1: compute subtree sizes and dp from root
    function dfs1(idx: number, parentIdx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 4,
        explanation: `DFS1: visit node ${tree[idx]} at index ${idx}. Processing children to compute subtree sizes.`,
        variables: { node: tree[idx], index: idx },
        visualization: makeViz(idx),
      });

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          dfs1(childIdx, idx);
          size[idx] += size[childIdx];
          dp[idx] += dp[childIdx] + size[childIdx];
        }
      }

      steps.push({
        line: 7,
        explanation: `DFS1 done at node ${tree[idx]}: size[${idx}]=${size[idx]}, dp[${idx}]=${dp[idx]} (sum of distances in subtree).`,
        variables: { node: tree[idx], subtreeSize: size[idx], dpVal: dp[idx] },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });
    }

    // DFS2: re-root
    function dfs2(idx: number, parentIdx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          const oldDp = dp[childIdx];
          dp[childIdx] = dp[idx] - size[childIdx] + (n - size[childIdx]);
          steps.push({
            line: 14,
            explanation: `DFS2: re-root from ${tree[idx]} to ${tree[childIdx]}. dp[${childIdx}] = dp[${idx}](${dp[idx]}) - size[${childIdx}](${size[childIdx]}) + (n-size[${childIdx}])(${n-size[childIdx]}) = ${dp[childIdx]}.`,
            variables: { parent: tree[idx], child: tree[childIdx], oldDp, newDp: dp[childIdx] },
            visualization: makeViz(childIdx, { [idx]: 'visited', [childIdx]: 'comparing' }),
          });
          dfs2(childIdx, idx);
        }
      }
    }

    dfs1(0, -1);
    steps.push({
      line: 15,
      explanation: `DFS1 complete. dp[0]=${dp[0]} is the sum of all distances from root 0. Now DFS2 re-roots to compute dp for all nodes.`,
      variables: { dp0: dp[0] },
      visualization: makeViz(0, { 0: 'found' }),
    });

    dfs2(0, -1);

    steps.push({
      line: 16,
      explanation: `Re-rooting complete! dp[i] for each node i: [${dp.slice(0, n).join(', ')}]. Each computed in O(1) during DFS2.`,
      variables: { allDp: dp.slice(0, n) },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default reRootingTechnique;
