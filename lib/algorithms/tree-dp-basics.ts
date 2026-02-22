import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treeDPBasics: AlgorithmDefinition = {
  id: 'tree-dp-basics',
  title: 'Tree DP Basics',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Tree DP (Dynamic Programming on Trees) is a fundamental technique where we compute DP states for each node based on its children\'s states, using post-order DFS. Common patterns include: (1) computing subtree sums/sizes, (2) maximum independent set, (3) tree diameter. This tutorial demonstrates computing subtree sum, depth, and max path at each node.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Tutorial'],
  code: {
    pseudocode: `function treeDPBasics(root):
  subtreeSum[v] = 0
  depth[v] = 0

  function dfs(node):
    if null: return
    dfs(node.left)
    dfs(node.right)
    # Post-order: children already computed
    subtreeSum[node] = node.val
    depth[node] = 1
    if left:
      subtreeSum[node] += subtreeSum[left]
      depth[node] = max(depth[node], 1 + depth[left])
    if right:
      subtreeSum[node] += subtreeSum[right]
      depth[node] = max(depth[node], 1 + depth[right])

  dfs(root)`,
    python: `def treeDPBasics(root):
    subtreeSum = {}
    depth = {}
    def dfs(node):
        if not node: return
        dfs(node.left)
        dfs(node.right)
        subtreeSum[node] = node.val
        depth[node] = 1
        if node.left:
            subtreeSum[node] += subtreeSum[node.left]
            depth[node] = max(depth[node], 1 + depth[node.left])
        if node.right:
            subtreeSum[node] += subtreeSum[node.right]
            depth[node] = max(depth[node], 1 + depth[node.right])
    dfs(root)
    return subtreeSum, depth`,
    javascript: `function treeDPBasics(root) {
  const subtreeSum = new Map(), depth = new Map();
  function dfs(node) {
    if (!node) return;
    dfs(node.left); dfs(node.right);
    subtreeSum.set(node, node.val);
    depth.set(node, 1);
    if (node.left) {
      subtreeSum.set(node, subtreeSum.get(node) + subtreeSum.get(node.left));
      depth.set(node, Math.max(depth.get(node), 1 + depth.get(node.left)));
    }
    if (node.right) {
      subtreeSum.set(node, subtreeSum.get(node) + subtreeSum.get(node.right));
      depth.set(node, Math.max(depth.get(node), 1 + depth.get(node.right)));
    }
  }
  dfs(root);
}`,
    java: `void treeDPBasics(TreeNode root, int[] subSum, int[] depth, int idx) {
    if (root == null) return;
    int l = 2*idx+1, r = 2*idx+2;
    treeDPBasics(root.left, subSum, depth, l);
    treeDPBasics(root.right, subSum, depth, r);
    subSum[idx] = root.val;
    depth[idx] = 1;
    if (root.left != null) {
        subSum[idx] += subSum[l];
        depth[idx] = Math.max(depth[idx], 1 + depth[l]);
    }
    if (root.right != null) {
        subSum[idx] += subSum[r];
        depth[idx] = Math.max(depth[idx], 1 + depth[r]);
    }
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
      helperText: 'Tree for DP tutorial. Computes subtree sums and depths.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const subtreeSum: Record<number, number> = {};
    const depthMap: Record<number, number> = {};
    const processed = new Set<number>();

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of processed) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Tree DP Tutorial: post-order DFS computes DP state bottom-up. We compute subtreeSum (sum of all values in subtree) and depth (height of subtree) for each node.',
      variables: { concept: 'post-order DFS for tree DP' },
      visualization: makeViz(0),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 6,
        explanation: `Visit node ${val} at index ${idx}. First recurse into children (post-order).`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      dfs(leftIdx);
      dfs(rightIdx);

      // Post-order processing
      subtreeSum[idx] = val;
      depthMap[idx] = 1;

      if (leftIdx < tree.length && tree[leftIdx] != null) {
        subtreeSum[idx] += subtreeSum[leftIdx];
        depthMap[idx] = Math.max(depthMap[idx], 1 + depthMap[leftIdx]);
      }
      if (rightIdx < tree.length && tree[rightIdx] != null) {
        subtreeSum[idx] += subtreeSum[rightIdx];
        depthMap[idx] = Math.max(depthMap[idx], 1 + depthMap[rightIdx]);
      }

      processed.add(idx);

      steps.push({
        line: 14,
        explanation: `Post-order at node ${val}: subtreeSum[${idx}]=${subtreeSum[idx]}, depth[${idx}]=${depthMap[idx]}. Children's values aggregated bottom-up.`,
        variables: { node: val, subtreeSum: subtreeSum[idx], depth: depthMap[idx] },
        visualization: makeViz(idx),
      });
    }

    dfs(0);

    steps.push({
      line: 17,
      explanation: `Tree DP complete. Root subtreeSum=${subtreeSum[0]}, rootDepth=${depthMap[0]}. Key insight: tree DP always processes children before parent (post-order).`,
      variables: { rootSum: subtreeSum[0], rootDepth: depthMap[0] },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((v, i) => [i, v != null ? 'found' : 'default']).filter(([, c]) => c !== 'default')
        ),
      },
    });

    return steps;
  },
};

export default treeDPBasics;
