import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeRightSideViewIi: AlgorithmDefinition = {
  id: 'binary-tree-right-side-view-ii',
  title: 'Binary Tree Right Side View (DFS Approach)',
  leetcodeNumber: 199,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree, return the values of the nodes you can see when standing on the right side. Using DFS: traverse right subtree before left, tracking depth. When visiting a depth for the first time, that node is visible from the right side. Add it to the result.',
  tags: ['tree', 'dfs', 'right side view', 'depth tracking', 'recursion'],

  code: {
    pseudocode: `function rightSideView(root):
  result = []
  function dfs(node, depth):
    if node is null: return
    if depth == len(result):
      result.append(node.val)   // first node at this depth
    dfs(node.right, depth + 1)  // visit right first
    dfs(node.left, depth + 1)
  dfs(root, 0)
  return result`,

    python: `def rightSideView(self, root):
    result = []
    def dfs(node, depth):
        if not node:
            return
        if depth == len(result):
            result.append(node.val)
        dfs(node.right, depth + 1)
        dfs(node.left, depth + 1)
    dfs(root, 0)
    return result`,

    javascript: `function rightSideView(root) {
  const result = [];
  function dfs(node, depth) {
    if (!node) return;
    if (depth === result.length) {
      result.push(node.val);
    }
    dfs(node.right, depth + 1);
    dfs(node.left, depth + 1);
  }
  dfs(root, 0);
  return result;
}`,

    java: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, 0, result);
    return result;
}
private void dfs(TreeNode node, int depth, List<Integer> result) {
    if (node == null) return;
    if (depth == result.size()) {
        result.add(node.val);
    }
    dfs(node.right, depth + 1, result);
    dfs(node.left, depth + 1, result);
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, null, 5, null, 4],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, null, 5, null, 4],
      placeholder: '1,2,3,null,5,null,4',
      helperText: 'Level-order array with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    // Tree: 1(root), left=2, right=3, 2.right=5, 3.right=4
    // Right side view: [1, 3, 4]
    steps.push({
      line: 1,
      explanation: 'Initialize result. Call dfs(root=1, depth=0). We always visit right child first.',
      variables: { result: '[]', depth: 0, node: 1 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'depth=0 equals result.length=0. Node 1 is the rightmost visible at depth 0. Append 1.',
      variables: { result: '[1]', depth: 0, node: 1 },
      visualization: makeViz({ 0: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Visit right child first: dfs(node=3, depth=1).',
      variables: { result: '[1]', depth: 1, node: 3 },
      visualization: makeViz({ 0: 'visited', 2: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'depth=1 equals result.length=1. Node 3 is first seen at depth 1 (rightmost). Append 3.',
      variables: { result: '[1,3]', depth: 1, node: 3 },
      visualization: makeViz({ 0: 'visited', 2: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Visit right child of 3: dfs(node=4, depth=2).',
      variables: { result: '[1,3]', depth: 2, node: 4 },
      visualization: makeViz({ 0: 'visited', 2: 'visited', 6: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'depth=2 equals result.length=2. Node 4 is rightmost at depth 2. Append 4.',
      variables: { result: '[1,3,4]', depth: 2, node: 4 },
      visualization: makeViz({ 0: 'visited', 2: 'visited', 6: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 4 has no children. Return up. Visit left child of 3: null. Return to depth 1.',
      variables: { result: '[1,3,4]', backtracking: true },
      visualization: makeViz({ 0: 'visited', 2: 'visited', 6: 'sorted' }),
    });

    steps.push({
      line: 7,
      explanation: 'Back at root. Now visit left child: dfs(node=2, depth=1).',
      variables: { result: '[1,3,4]', depth: 1, node: 2 },
      visualization: makeViz({ 0: 'visited', 2: 'sorted', 6: 'sorted', 1: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'depth=1, result.length=2. Depth 1 already has a value (3). Skip node 2 (not visible from right).',
      variables: { result: '[1,3,4]', depth: 1, node: 2, skipped: true },
      visualization: makeViz({ 0: 'visited', 1: 'comparing', 2: 'sorted', 6: 'sorted' }),
    });

    steps.push({
      line: 6,
      explanation: 'Visit right child of 2: dfs(node=5, depth=2).',
      variables: { result: '[1,3,4]', depth: 2, node: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'sorted', 4: 'active', 6: 'sorted' }),
    });

    steps.push({
      line: 4,
      explanation: 'depth=2, result.length=3. Depth 2 already has value 4. Skip node 5 (hidden behind node 4).',
      variables: { result: '[1,3,4]', depth: 2, node: 5, skipped: true },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'sorted', 4: 'comparing', 6: 'sorted' }),
    });

    steps.push({
      line: 9,
      explanation: 'DFS complete. Right side view result: [1, 3, 4].',
      variables: { result: '[1,3,4]' },
      visualization: makeViz({ 0: 'found', 2: 'found', 6: 'found', 1: 'visited', 4: 'visited' }),
    });

    return steps;
  },
};

export default binaryTreeRightSideViewIi;
