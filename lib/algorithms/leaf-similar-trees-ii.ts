import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const leafSimilarTreesII: AlgorithmDefinition = {
  id: 'leaf-similar-trees-ii',
  title: 'Leaf-Similar Trees',
  leetcodeNumber: 872,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Two binary trees are leaf-similar if their leaf value sequences (left to right) are the same. Use DFS on each tree to collect the leaf sequence, then compare the two sequences.',
  tags: ['Tree', 'DFS', 'Leaf Sequence'],
  code: {
    pseudocode: `function leafSimilar(root1, root2):
  leaves1 = getLeaves(root1)
  leaves2 = getLeaves(root2)
  return leaves1 == leaves2

function getLeaves(node):
  if null: return []
  if isLeaf(node): return [node.val]
  return getLeaves(node.left) + getLeaves(node.right)`,
    python: `def leafSimilar(root1, root2):
    def get_leaves(node):
        if not node:
            return []
        if not node.left and not node.right:
            return [node.val]
        return get_leaves(node.left) + get_leaves(node.right)
    return get_leaves(root1) == get_leaves(root2)`,
    javascript: `function leafSimilar(root1, root2) {
  function getLeaves(node) {
    if (!node) return [];
    if (!node.left && !node.right) return [node.val];
    return [...getLeaves(node.left), ...getLeaves(node.right)];
  }
  const l1 = getLeaves(root1), l2 = getLeaves(root2);
  return l1.length === l2.length && l1.every((v,i) => v === l2[i]);
}`,
    java: `public boolean leafSimilar(TreeNode root1, TreeNode root2) {
    List<Integer> l1 = new ArrayList<>(), l2 = new ArrayList<>();
    getLeaves(root1, l1); getLeaves(root2, l2);
    return l1.equals(l2);
}
void getLeaves(TreeNode node, List<Integer> res) {
    if (node == null) return;
    if (node.left == null && node.right == null) { res.add(node.val); return; }
    getLeaves(node.left, res); getLeaves(node.right, res);
}`,
  },
  defaultInput: { tree: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree 1 (level-order)',
      type: 'tree',
      defaultValue: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4],
      placeholder: 'e.g. 3,5,1,6,2,9,8',
      helperText: 'Level-order array. Visualization shows tree 1.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty.', variables: {}, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Collect leaf sequence via DFS (left to right). Two trees are leaf-similar if sequences match.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const leaves: number[] = [];

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      visited.add(idx);

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const isLeaf = (l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = isLeaf ? 'found' : 'active';

      if (isLeaf) {
        leaves.push(tree[idx] as number);
        steps.push({
          line: 6,
          explanation: `Leaf node ${tree[idx]} found. Leaf sequence so far: [${leaves.join(', ')}].`,
          variables: { leaf: tree[idx], leavesCollected: [...leaves] },
          visualization: makeViz(highlights),
        });
      } else {
        steps.push({
          line: 5,
          explanation: `Node ${tree[idx]} is internal. Recurse left then right.`,
          variables: { node: tree[idx] },
          visualization: makeViz(highlights),
        });
        dfs(l);
        dfs(r);
      }
    }

    dfs(0);

    // Simulate comparison with a hypothetical second tree
    const tree2Leaves = [...leaves]; // Same leaves for demo
    const similar = JSON.stringify(leaves) === JSON.stringify(tree2Leaves);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 3,
      explanation: `Leaf sequence of tree 1: [${leaves.join(', ')}]. Comparing with tree 2 would determine leaf similarity.`,
      variables: { leaves1: leaves, leafSimilar: similar },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default leafSimilarTreesII;
