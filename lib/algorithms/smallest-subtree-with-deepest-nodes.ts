import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const smallestSubtreeWithDeepestNodes: AlgorithmDefinition = {
  id: 'smallest-subtree-with-deepest-nodes',
  title: 'Smallest Subtree with all the Deepest Nodes',
  leetcodeNumber: 865,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the smallest subtree such that it contains all the deepest nodes. This is equivalent to finding the Lowest Common Ancestor (LCA) of the deepest leaves. Use DFS: for each node return the depth of the deepest node in its subtree. If left and right depths are equal, the current node is the LCA. Otherwise, go in the direction of the deeper subtree.',
  tags: ['tree', 'dfs', 'lca', 'depth'],

  code: {
    pseudocode: `function subtreeWithAllDeepest(root):
  function dfs(node):
    if node is null: return (null, 0)
    leftNode, leftDepth = dfs(node.left)
    rightNode, rightDepth = dfs(node.right)
    if leftDepth == rightDepth:
      return (node, leftDepth + 1)  # current node is LCA
    elif leftDepth > rightDepth:
      return (leftNode, leftDepth + 1)
    else:
      return (rightNode, rightDepth + 1)

  result, _ = dfs(root)
  return result`,
    python: `def subtreeWithAllDeepest(root):
    def dfs(node):
        if not node: return None, 0
        lnode, ld = dfs(node.left)
        rnode, rd = dfs(node.right)
        if ld == rd: return node, ld + 1
        elif ld > rd: return lnode, ld + 1
        else: return rnode, rd + 1
    return dfs(root)[0]`,
    javascript: `function subtreeWithAllDeepest(root) {
  function dfs(node) {
    if (!node) return [null, 0];
    const [ln, ld] = dfs(node.left);
    const [rn, rd] = dfs(node.right);
    if (ld === rd) return [node, ld + 1];
    return ld > rd ? [ln, ld + 1] : [rn, rd + 1];
  }
  return dfs(root)[0];
}`,
    java: `int[] res = {-1, 0}; // [nodeVal, depth]
public TreeNode subtreeWithAllDeepest(TreeNode root) {
    return dfs(root)[0];
}
private TreeNode[] dfs(TreeNode node) {
    if (node == null) return new TreeNode[]{null};
    // ... (simplified)
}`,
  },

  defaultInput: {
    nums: [3, 5, 1, 6, 2, 0, 8, 0, 0, 7, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [3, 5, 1, 6, 2, 0, 8, 0, 0, 7, 4],
      placeholder: '3,5,1,6,2,0,8,0,0,7,4',
      helperText: 'Level-order binary tree (0 = null node)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Find LCA of all deepest leaves. DFS returns (lcaNode, depth). If left depth equals right depth, current node is the LCA of deepest leaves in its subtree.',
      variables: { strategy: 'DFS returning (node, depth) pairs' },
      visualization: makeViz({}, {}),
    });

    const nodeDepths: Map<number, { depth: number; lcaIdx: number }> = new Map();

    function dfs(idx: number): [number, number] {
      if (idx >= nums.length || nums[idx] === 0) return [-1, 0];

      const [ln, ld] = dfs(2 * idx + 1);
      const [rn, rd] = dfs(2 * idx + 2);

      let resultIdx: number;
      let depth: number;

      if (ld === rd) {
        resultIdx = idx;
        depth = ld + 1;
      } else if (ld > rd) {
        resultIdx = ln;
        depth = ld + 1;
      } else {
        resultIdx = rn;
        depth = rd + 1;
      }

      nodeDepths.set(idx, { depth, lcaIdx: resultIdx });

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      nodeDepths.forEach((info, i) => {
        highlights[i] = 'visited';
        labels[i] = `d=${info.depth}`;
      });
      highlights[idx] = ld === rd ? 'found' : 'active';
      labels[idx] = `ld=${ld},rd=${rd}`;
      if (resultIdx >= 0) {
        highlights[resultIdx] = 'comparing';
      }

      steps.push({
        line: ld === rd ? 6 : 7,
        explanation: `Node[${idx}]=${nums[idx]}: leftDepth=${ld}, rightDepth=${rd}. ${ld === rd ? 'Equal depths -> current node is LCA!' : ld > rd ? 'Left is deeper -> propagate left LCA' : 'Right is deeper -> propagate right LCA'}. Result LCA val=${resultIdx >= 0 ? nums[resultIdx] : 'null'}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], leftDepth: ld, rightDepth: rd, resultLCA: resultIdx >= 0 ? nums[resultIdx] : null, depth },
        visualization: makeViz(highlights, labels),
      });

      return [resultIdx, depth];
    }

    const [finalLCA] = dfs(0);

    const finalH: Record<number, string> = {};
    nums.forEach((v, i) => {
      if (v !== 0) finalH[i] = i === finalLCA ? 'found' : 'sorted';
    });

    steps.push({
      line: 11,
      explanation: `Smallest subtree containing all deepest nodes is rooted at node with value ${finalLCA >= 0 ? nums[finalLCA] : 'null'} (index ${finalLCA}).`,
      variables: { result: finalLCA >= 0 ? nums[finalLCA] : null, resultIdx: finalLCA },
      visualization: makeViz(finalH, { [finalLCA]: 'LCA' }),
    });

    return steps;
  },
};

export default smallestSubtreeWithDeepestNodes;
