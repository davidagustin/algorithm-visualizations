import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreePreorderTraversal: AlgorithmDefinition = {
  id: 'n-ary-tree-preorder-traversal',
  title: 'N-ary Tree Preorder Traversal',
  leetcodeNumber: 589,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given an n-ary tree, return the preorder traversal of its node values. In preorder traversal, the root is visited first, then all children are visited recursively from left to right. Can be done recursively or iteratively using a stack.',
  tags: ['tree', 'dfs', 'preorder', 'n-ary tree', 'recursion', 'stack'],

  code: {
    pseudocode: `function preorder(root):
  result = []
  function dfs(node):
    if node is null: return
    result.append(node.val)    // visit root first
    for child in node.children:
      dfs(child)               // visit each child
  dfs(root)
  return result`,

    python: `def preorder(self, root):
    result = []
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        for child in node.children:
            dfs(child)
    dfs(root)
    return result`,

    javascript: `function preorder(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    result.push(node.val);
    for (const child of node.children) {
      dfs(child);
    }
  }
  dfs(root);
  return result;
}`,

    java: `public List<Integer> preorder(Node root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}
private void dfs(Node node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val);
    for (Node child : node.children) {
        dfs(child, result);
    }
}`,
  },

  defaultInput: {
    nodes: [1, null, 3, 2, 4, null, 5, 6],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Tree (level order encoded)',
      type: 'array',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: '1,null,3,2,4,null,5,6',
      helperText: 'N-ary tree level-order encoding with null separators',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Tree: 1 -> [3,2,4], 3 -> [5,6]
    // Preorder: [1, 3, 5, 6, 2, 4]
    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: [1, 3, 2, 4, 5, 6, null, null],
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize result array. Start DFS from root node 1.',
      variables: { result: '[]', stack: '[1]' },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit root node 1 first (preorder: root before children). Append 1 to result.',
      variables: { result: '[1]', current: 1 },
      visualization: makeViz({ 0: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 1 has children [3, 2, 4]. Recursively visit first child: node 3.',
      variables: { result: '[1]', current: 3, childIndex: 0 },
      visualization: makeViz({ 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 3 (preorder: append value before visiting children). result=[1,3].',
      variables: { result: '[1,3]', current: 3 },
      visualization: makeViz({ 0: 'visited', 1: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 3 has children [5, 6]. Recursively visit first child: node 5.',
      variables: { result: '[1,3]', current: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 4: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 5. It has no children. Append 5 to result.',
      variables: { result: '[1,3,5]', current: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 4: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 5 has no children. Return to node 3, visit next child: node 6.',
      variables: { result: '[1,3,5]', current: 6 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 4: 'sorted', 5: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 6. It has no children. Append 6 to result.',
      variables: { result: '[1,3,5,6]', current: 6 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 4: 'sorted', 5: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'All children of node 3 visited. Return to node 1, visit next child: node 2.',
      variables: { result: '[1,3,5,6]', current: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 4: 'sorted', 5: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 2. No children. Append 2 to result.',
      variables: { result: '[1,3,5,6,2]', current: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 4: 'sorted', 5: 'sorted', 2: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Return to node 1, visit last child: node 4.',
      variables: { result: '[1,3,5,6,2]', current: 4 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'sorted', 4: 'sorted', 5: 'sorted', 3: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 4. No children. Append 4 to result.',
      variables: { result: '[1,3,5,6,2,4]', current: 4 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'sorted', 3: 'found', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 9,
      explanation: 'Preorder traversal complete. Final result: [1, 3, 5, 6, 2, 4].',
      variables: { result: '[1,3,5,6,2,4]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found' }),
    });

    return steps;
  },
};

export default nAryTreePreorderTraversal;
