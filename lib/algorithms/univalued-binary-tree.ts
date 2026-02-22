import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const univaluedBinaryTree: AlgorithmDefinition = {
  id: 'univalued-binary-tree',
  title: 'Univalued Binary Tree',
  leetcodeNumber: 965,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return true if the tree is univalued. A binary tree is univalued if every node in the tree has the same value. Use DFS to check every node against the root value.',
  tags: ['tree', 'dfs', 'univalued', 'recursion'],

  code: {
    pseudocode: `function isUnivalTree(root):
  function dfs(node):
    if node is null: return true
    if node.val != root.val: return false
    return dfs(node.left) and dfs(node.right)
  return dfs(root)`,

    python: `def isUnivalTree(self, root):
    def dfs(node):
        if not node:
            return True
        if node.val != root.val:
            return False
        return dfs(node.left) and dfs(node.right)
    return dfs(root)`,

    javascript: `function isUnivalTree(root) {
  function dfs(node) {
    if (!node) return true;
    if (node.val !== root.val) return false;
    return dfs(node.left) && dfs(node.right);
  }
  return dfs(root);
}`,

    java: `public boolean isUnivalTree(TreeNode root) {
    return dfs(root, root.val);
}
private boolean dfs(TreeNode node, int val) {
    if (node == null) return true;
    if (node.val != val) return false;
    return dfs(node.left, val) && dfs(node.right, val);
}`,
  },

  defaultInput: {
    nodes: [1, 1, 1, 1, 1, null, 1],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 1, 1, 1, 1, null, 1],
      placeholder: '1,1,1,1,1,null,1',
      helperText: 'Level-order array; null means missing node',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];
    const rootVal = rawNodes[0] as number;

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    steps.push({
      line: 1,
      explanation: `Start DFS from root. Target value to match: ${rootVal}.`,
      variables: { rootVal, result: '?' },
      visualization: makeViz({ 0: 'active' }),
    });

    let allMatch = true;
    for (let i = 0; i < rawNodes.length; i++) {
      const val = rawNodes[i];
      if (val === null) continue;

      const matches = val === rootVal;
      if (!matches) allMatch = false;

      steps.push({
        line: matches ? 4 : 3,
        explanation: matches
          ? `Node at index ${i} has value ${val} which matches root value ${rootVal}. Continue.`
          : `Node at index ${i} has value ${val} which does NOT match root value ${rootVal}. Return false.`,
        variables: { index: i, nodeVal: val, rootVal, matches },
        visualization: makeViz({ [i]: matches ? 'found' : 'mismatch' }),
      });

      if (!matches) break;
    }

    if (allMatch) {
      steps.push({
        line: 5,
        explanation: `All nodes checked. Every node has value ${rootVal}. Tree is univalued. Return true.`,
        variables: { result: true, rootVal },
        visualization: makeViz(
          rawNodes.reduce((acc, v, i) => {
            if (v !== null) acc[i] = 'found';
            return acc;
          }, {} as Record<number, string>)
        ),
      });
    } else {
      steps.push({
        line: 3,
        explanation: 'A node with a different value was found. Tree is NOT univalued. Return false.',
        variables: { result: false },
        visualization: makeViz({}),
      });
    }

    return steps;
  },
};

export default univaluedBinaryTree;
