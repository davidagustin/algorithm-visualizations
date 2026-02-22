import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreePostorderTraversal: AlgorithmDefinition = {
  id: 'n-ary-tree-postorder-traversal',
  title: 'N-ary Tree Postorder Traversal',
  leetcodeNumber: 590,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given an n-ary tree, return the postorder traversal of its node values. In postorder traversal, all children are visited recursively from left to right before the root node is visited. The root appears last in the output.',
  tags: ['tree', 'dfs', 'postorder', 'n-ary tree', 'recursion'],

  code: {
    pseudocode: `function postorder(root):
  result = []
  function dfs(node):
    if node is null: return
    for child in node.children:
      dfs(child)               // visit children first
    result.append(node.val)    // visit root last
  dfs(root)
  return result`,

    python: `def postorder(self, root):
    result = []
    def dfs(node):
        if not node:
            return
        for child in node.children:
            dfs(child)
        result.append(node.val)
    dfs(root)
    return result`,

    javascript: `function postorder(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    for (const child of node.children) {
      dfs(child);
    }
    result.push(node.val);
  }
  dfs(root);
  return result;
}`,

    java: `public List<Integer> postorder(Node root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}
private void dfs(Node node, List<Integer> result) {
    if (node == null) return;
    for (Node child : node.children) {
        dfs(child, result);
    }
    result.add(node.val);
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
    // Postorder: [5, 6, 3, 2, 4, 1]
    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: [1, 3, 2, 4, 5, 6, null, null],
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize result array. Start DFS from root node 1.',
      variables: { result: '[]', current: 1 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Postorder: visit children before root. Node 1 has children [3,2,4]. Enter child 3 first.',
      variables: { current: 3, result: '[]' },
      visualization: makeViz({ 0: 'current', 1: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Node 3 has children [5,6]. Enter child 5 first.',
      variables: { current: 5, result: '[]' },
      visualization: makeViz({ 0: 'current', 1: 'current', 4: 'active' }),
    });

    steps.push({
      line: 7,
      explanation: 'Node 5 has no children. Append 5 to result (postorder: leaf first).',
      variables: { result: '[5]', current: 5 },
      visualization: makeViz({ 0: 'current', 1: 'current', 4: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Return to node 3. Visit next child: node 6.',
      variables: { current: 6, result: '[5]' },
      visualization: makeViz({ 0: 'current', 1: 'current', 4: 'sorted', 5: 'active' }),
    });

    steps.push({
      line: 7,
      explanation: 'Node 6 has no children. Append 6 to result.',
      variables: { result: '[5,6]', current: 6 },
      visualization: makeViz({ 0: 'current', 1: 'current', 4: 'sorted', 5: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: 'All children of node 3 visited. Now append node 3 to result.',
      variables: { result: '[5,6,3]', current: 3 },
      visualization: makeViz({ 0: 'current', 1: 'found', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 5,
      explanation: 'Return to node 1. Visit next child: node 2. Node 2 has no children.',
      variables: { current: 2, result: '[5,6,3]' },
      visualization: makeViz({ 0: 'current', 1: 'sorted', 2: 'active', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 7,
      explanation: 'Node 2 has no children. Append 2 to result.',
      variables: { result: '[5,6,3,2]', current: 2 },
      visualization: makeViz({ 0: 'current', 1: 'sorted', 2: 'found', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 5,
      explanation: 'Return to node 1. Visit last child: node 4. Node 4 has no children.',
      variables: { current: 4, result: '[5,6,3,2]' },
      visualization: makeViz({ 0: 'current', 1: 'sorted', 2: 'sorted', 3: 'active', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 7,
      explanation: 'Node 4 has no children. Append 4 to result.',
      variables: { result: '[5,6,3,2,4]', current: 4 },
      visualization: makeViz({ 0: 'current', 1: 'sorted', 2: 'sorted', 3: 'found', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 7,
      explanation: 'All children of root 1 visited. Append root 1 to result last.',
      variables: { result: '[5,6,3,2,4,1]', current: 1 },
      visualization: makeViz({ 0: 'found', 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 9,
      explanation: 'Postorder traversal complete. Final result: [5, 6, 3, 2, 4, 1].',
      variables: { result: '[5,6,3,2,4,1]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found' }),
    });

    return steps;
  },
};

export default nAryTreePostorderTraversal;
