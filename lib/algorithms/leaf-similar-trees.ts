import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const leafSimilarTrees: AlgorithmDefinition = {
  id: 'leaf-similar-trees',
  title: 'Leaf-Similar Trees',
  leetcodeNumber: 872,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given two binary trees, check if their leaf value sequences are the same. The leaf value sequence is the sequence of leaf node values from left to right. Use DFS on each tree to collect leaves in order, then compare the two sequences.',
  tags: ['tree', 'dfs', 'leaf sequence', 'comparison'],

  code: {
    pseudocode: `function leafSimilar(root1, root2):
  function getLeaves(node):
    if node is null: return []
    if isLeaf(node): return [node.val]
    return getLeaves(node.left) + getLeaves(node.right)
  leaves1 = getLeaves(root1)
  leaves2 = getLeaves(root2)
  return leaves1 == leaves2`,

    python: `def leafSimilar(self, root1, root2):
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
  const l1 = getLeaves(root1);
  const l2 = getLeaves(root2);
  return l1.length === l2.length && l1.every((v, i) => v === l2[i]);
}`,

    java: `public boolean leafSimilar(TreeNode root1, TreeNode root2) {
    List<Integer> l1 = new ArrayList<>();
    List<Integer> l2 = new ArrayList<>();
    getLeaves(root1, l1);
    getLeaves(root2, l2);
    return l1.equals(l2);
}
private void getLeaves(TreeNode node, List<Integer> list) {
    if (node == null) return;
    if (node.left == null && node.right == null) {
        list.add(node.val);
        return;
    }
    getLeaves(node.left, list);
    getLeaves(node.right, list);
}`,
  },

  defaultInput: {
    tree1: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4],
    tree2: [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8],
  },

  inputFields: [
    {
      name: 'tree1',
      label: 'Tree 1 (level order)',
      type: 'array',
      defaultValue: [3, 5, 1, 6, 2, 9, 8, null, null, 7, 4],
      placeholder: '3,5,1,6,2,9,8',
      helperText: 'First tree level-order with null for missing nodes',
    },
    {
      name: 'tree2',
      label: 'Tree 2 (level order)',
      type: 'array',
      defaultValue: [3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8],
      placeholder: '3,5,1,6,7,4,2',
      helperText: 'Second tree level-order with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = input.tree1 as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (nodes: (number | null)[], highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes,
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Start collecting leaf sequences from Tree 1 using DFS (left to right).',
      variables: { phase: 'tree1 leaves', leaves1: '[]' },
      visualization: makeViz(tree1, { 0: 'active' }),
    });

    // Tree 1 leaves: 6, 7, 4, 9, 8
    steps.push({
      line: 3,
      explanation: 'DFS tree 1: visit leftmost path. Node 6 (index 3) is a leaf. Collect 6.',
      variables: { leaves1: '[6]', current: 6 },
      visualization: makeViz(tree1, { 3: 'found', 0: 'visited', 1: 'visited' }),
    });

    steps.push({
      line: 3,
      explanation: 'Backtrack to node 2 (index 4). Node 7 (index 9) is a leaf. Collect 7.',
      variables: { leaves1: '[6,7]', current: 7 },
      visualization: makeViz(tree1, { 3: 'sorted', 9: 'found', 0: 'visited', 1: 'visited', 4: 'visited' }),
    });

    steps.push({
      line: 3,
      explanation: 'Node 4 (index 10) is a leaf. Collect 4.',
      variables: { leaves1: '[6,7,4]', current: 4 },
      visualization: makeViz(tree1, { 3: 'sorted', 9: 'sorted', 10: 'found', 0: 'visited', 1: 'visited' }),
    });

    steps.push({
      line: 3,
      explanation: 'Node 9 (index 5) is a leaf. Collect 9.',
      variables: { leaves1: '[6,7,4,9]', current: 9 },
      visualization: makeViz(tree1, { 3: 'sorted', 9: 'sorted', 10: 'sorted', 5: 'found', 0: 'visited', 2: 'visited' }),
    });

    steps.push({
      line: 3,
      explanation: 'Node 8 (index 6) is a leaf. Collect 8. Tree 1 leaf sequence complete.',
      variables: { leaves1: '[6,7,4,9,8]', current: 8 },
      visualization: makeViz(tree1, { 3: 'sorted', 5: 'sorted', 6: 'found', 9: 'sorted', 10: 'sorted' }),
    });

    steps.push({
      line: 5,
      explanation: 'Now collect leaves from Tree 2 using DFS. Tree 2 has same leaf order: [6,7,4,9,8].',
      variables: { leaves1: '[6,7,4,9,8]', leaves2: '[6,7,4,9,8]' },
      visualization: makeViz([3, 5, 1, 6, 7, 4, 2, null, null, null, null, null, null, 9, 8], { 3: 'found', 4: 'found', 5: 'found', 13: 'found', 14: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: 'Compare sequences: [6,7,4,9,8] vs [6,7,4,9,8]. All values match at every position.',
      variables: { leaves1: '[6,7,4,9,8]', leaves2: '[6,7,4,9,8]', match: true },
      visualization: makeViz(tree1, { 3: 'found', 5: 'found', 6: 'found', 9: 'found', 10: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: 'Both trees have the same leaf sequence. Return true.',
      variables: { result: true },
      visualization: makeViz(tree1, { 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found', 6: 'found', 9: 'found', 10: 'found' }),
    });

    return steps;
  },
};

export default leafSimilarTrees;
