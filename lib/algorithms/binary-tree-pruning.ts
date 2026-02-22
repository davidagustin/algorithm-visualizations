import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreePruning: AlgorithmDefinition = {
  id: 'binary-tree-pruning',
  title: 'Binary Tree Pruning',
  leetcodeNumber: 814,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree where every node has value 0 or 1, prune the tree so that subtrees containing only 0s are removed. Use postorder DFS: recursively prune left and right subtrees first, then if a node has value 0 and both children are null, remove it.',
  tags: ['tree', 'dfs', 'postorder', 'pruning', 'recursion'],

  code: {
    pseudocode: `function pruneTree(root):
  if root is null: return null
  root.left = pruneTree(root.left)    // prune left first
  root.right = pruneTree(root.right)  // prune right first
  if root.val == 0 and root.left is null and root.right is null:
    return null  // this node is a removable 0-only subtree
  return root`,

    python: `def pruneTree(self, root):
    if not root:
        return None
    root.left = self.pruneTree(root.left)
    root.right = self.pruneTree(root.right)
    if root.val == 0 and not root.left and not root.right:
        return None
    return root`,

    javascript: `function pruneTree(root) {
  if (!root) return null;
  root.left = pruneTree(root.left);
  root.right = pruneTree(root.right);
  if (root.val === 0 && !root.left && !root.right) {
    return null;
  }
  return root;
}`,

    java: `public TreeNode pruneTree(TreeNode root) {
    if (root == null) return null;
    root.left = pruneTree(root.left);
    root.right = pruneTree(root.right);
    if (root.val == 0 && root.left == null && root.right == null) {
        return null;
    }
    return root;
}`,
  },

  defaultInput: {
    nodes: [1, null, 0, 0, 1],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree with 0s and 1s (level order)',
      type: 'array',
      defaultValue: [1, null, 0, 0, 1],
      placeholder: '1,null,0,0,1',
      helperText: 'Level-order array. Only 0s and 1s. Null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (nodes: (number | null)[], highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes,
      highlights,
    });

    // Tree: 1(root, idx 0), null(left), 0(right, idx 2), 0(right.left, idx 5), 1(right.right, idx 6)
    // After pruning: remove 0 leaves, resulting in [1, null, 0, null, null, null, 1]
    steps.push({
      line: 1,
      explanation: 'Start postorder DFS. We prune children before evaluating the current node.',
      variables: { strategy: 'postorder - children first' },
      visualization: makeViz(rawNodes, { 0: 'active' }),
    });

    steps.push({
      line: 2,
      explanation: 'Visit root (val=1). Recurse left: null -> return null. Recurse right to node (val=0).',
      variables: { root: 1, leftResult: null },
      visualization: makeViz(rawNodes, { 0: 'current', 2: 'active' }),
    });

    steps.push({
      line: 3,
      explanation: 'At node val=0 (right child of root). Recurse to its left child (val=0, index 5).',
      variables: { node: 0, depth: 1 },
      visualization: makeViz(rawNodes, { 2: 'current', 5: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Node val=0 at index 5: val==0, left==null, right==null. This is a leaf with value 0. PRUNE it (return null).',
      variables: { node: 0, val: 0, isLeaf: true, pruned: true },
      visualization: makeViz(rawNodes, { 5: 'mismatch' }),
    });

    steps.push({
      line: 3,
      explanation: 'Back at node val=0 (index 2). Left child was pruned. Recurse right to val=1 (index 6).',
      variables: { node: 0, leftResult: null },
      visualization: makeViz(rawNodes, { 2: 'current', 6: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Node val=1 at index 6: val==1 (not 0). Keep it. Return node.',
      variables: { node: 1, val: 1, kept: true },
      visualization: makeViz(rawNodes, { 6: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Back at node val=0 (index 2). After pruning: left=null, right=node(1). val==0 but right child exists. KEEP this node.',
      variables: { node: 0, leftPruned: true, rightKept: 1 },
      visualization: makeViz(rawNodes, { 2: 'found', 6: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Back at root (val=1). Left=null, right=node(0 with child 1). Val==1 so root is kept.',
      variables: { root: 1, rightSubtree: 'node 0 with child 1' },
      visualization: makeViz(rawNodes, { 0: 'found', 2: 'found', 6: 'found' }),
    });

    const prunedTree = [1, null, 0, null, null, null, 1];
    steps.push({
      line: 7,
      explanation: 'Pruning complete. Node at index 5 (val=0 leaf) was removed. Result: [1,null,0,null,null,null,1].',
      variables: { result: '[1,null,0,null,null,null,1]' },
      visualization: makeViz(prunedTree, { 0: 'found', 2: 'found', 6: 'found' }),
    });

    return steps;
  },
};

export default binaryTreePruning;
