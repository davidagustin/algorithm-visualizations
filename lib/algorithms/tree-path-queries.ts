import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treePathQueries: AlgorithmDefinition = {
  id: 'tree-path-queries',
  title: 'Tree Path Queries',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Answer path queries on a tree efficiently. Given a binary tree and multiple queries asking for path sum or path max between two nodes, precompute using tree DP: depth[], parent[], subtree sums, and path sums from root. LCA (Lowest Common Ancestor) enables O(log n) query answering. This visualization shows precomputation of path sums using tree DP.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'LCA', 'Path Queries'],
  code: {
    pseudocode: `function treePathQueries(tree, queries):
  # Precompute depth and path sum from root
  depth[root] = 0
  pathSum[root] = root.val
  function dfs(node, parent):
    for each child:
      depth[child] = depth[node] + 1
      pathSum[child] = pathSum[node] + child.val
      dfs(child, node)

  # Answer query(u, v):
  lca = LCA(u, v)
  ans = pathSum[u] + pathSum[v] - 2*pathSum[lca] + lca.val`,
    python: `def treePathQueries(tree, queries):
    depth = [0] * len(tree)
    path_sum = [0] * len(tree)
    path_sum[0] = tree[0] or 0
    for i in range(len(tree)):
        if tree[i] is None: continue
        for child in [2*i+1, 2*i+2]:
            if child < len(tree) and tree[child] is not None:
                depth[child] = depth[i] + 1
                path_sum[child] = path_sum[i] + tree[child]
    results = []
    for u, v in queries:
        lca = find_lca(u, v, depth, tree)
        ans = path_sum[u] + path_sum[v] - 2*path_sum[lca] + tree[lca]
        results.append(ans)
    return results`,
    javascript: `function treePathQueries(tree, queries) {
  const depth = new Array(tree.length).fill(0);
  const pathSum = new Array(tree.length).fill(0);
  pathSum[0] = tree[0] || 0;
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] == null) continue;
    for (const c of [2*i+1, 2*i+2]) {
      if (c < tree.length && tree[c] != null) {
        depth[c] = depth[i] + 1;
        pathSum[c] = pathSum[i] + tree[c];
      }
    }
  }
  return queries.map(([u, v]) => {
    const lca = findLCA(u, v, depth, tree);
    return pathSum[u] + pathSum[v] - 2*pathSum[lca] + tree[lca];
  });
}`,
    java: `int[] treePathQueries(Integer[] tree, int[][] queries) {
    int n = tree.length;
    int[] depth = new int[n], pathSum = new int[n];
    pathSum[0] = tree[0] != null ? tree[0] : 0;
    for (int i = 0; i < n; i++) {
        if (tree[i] == null) continue;
        for (int c : new int[]{2*i+1, 2*i+2})
            if (c < n && tree[c] != null) {
                depth[c] = depth[i]+1;
                pathSum[c] = pathSum[i]+tree[c];
            }
    }
    // answer queries using LCA
    return new int[0];
}`,
  },
  defaultInput: { tree: [5, 3, 8, 1, 4, 7, 9] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [5, 3, 8, 1, 4, 7, 9],
      placeholder: 'e.g. 5,3,8,1,4,7,9',
      helperText: 'Level-order tree. Precomputes path sums from root for O(1) queries.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const depth: number[] = new Array(tree.length).fill(0);
    const pathSum: number[] = new Array(tree.length).fill(0);
    const processed = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      for (const idx of processed) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree[0] != null) {
      pathSum[0] = tree[0] as number;
    }

    steps.push({
      line: 1,
      explanation: 'Tree Path Queries: precompute depth[] and pathSum[] (root-to-node sum) for all nodes. Then answer path(u,v) = pathSum[u] + pathSum[v] - 2*pathSum[lca] + lca.val.',
      variables: { pathSumRoot: pathSum[0] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      processed.add(idx);
      const val = tree[idx] as number;

      steps.push({
        line: 4,
        explanation: `Node ${val} at index ${idx}: depth=${depth[idx]}, pathSum=${pathSum[idx]} (sum from root to this node).`,
        variables: { node: val, depth: depth[idx], pathSum: pathSum[idx] },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          depth[childIdx] = depth[idx] + 1;
          pathSum[childIdx] = pathSum[idx] + (tree[childIdx] as number);

          steps.push({
            line: 6,
            explanation: `Child ${tree[childIdx]} at index ${childIdx}: depth=${depth[childIdx]}, pathSum=${pathSum[childIdx]}.`,
            variables: { child: tree[childIdx], depth: depth[childIdx], pathSum: pathSum[childIdx] },
            visualization: makeViz(childIdx, { [childIdx]: 'comparing' }),
          });

          dfs(childIdx);
        }
      }
    }

    dfs(0);

    // Demo query: path from leaf to leaf
    const leaves = tree.reduce((acc: number[], v, i) => {
      if (v == null) return acc;
      const l = 2 * i + 1, r = 2 * i + 2;
      if ((l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null)) acc.push(i);
      return acc;
    }, []);

    if (leaves.length >= 2) {
      const u = leaves[0], v = leaves[leaves.length - 1];
      // Find LCA
      let a = u, b = v;
      while (a !== b) {
        if (depth[a] > depth[b]) a = Math.floor((a - 1) / 2);
        else b = Math.floor((b - 1) / 2);
      }
      const lca = a;
      const queryAns = pathSum[u] + pathSum[v] - 2 * pathSum[lca] + (tree[lca] as number);

      steps.push({
        line: 12,
        explanation: `Example query: path(${tree[u]}, ${tree[v]}). LCA=${tree[lca]}. pathSum[${u}]=${pathSum[u]} + pathSum[${v}]=${pathSum[v]} - 2*${pathSum[lca]} + ${tree[lca]} = ${queryAns}.`,
        variables: { u: tree[u], v: tree[v], lca: tree[lca], pathSum: queryAns },
        visualization: makeViz(null, { [u]: 'found', [v]: 'found', [lca]: 'comparing' }),
      });
    }

    return steps;
  },
};

export default treePathQueries;
