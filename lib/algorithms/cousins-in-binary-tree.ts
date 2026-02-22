import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const cousinsInBinaryTree: AlgorithmDefinition = {
  id: 'cousins-in-binary-tree',
  title: 'Cousins in Binary Tree',
  leetcodeNumber: 993,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Two nodes of a binary tree are cousins if they have the same depth but different parents. Given the root and two node values x and y, return true if they are cousins. Use BFS or DFS to find the depth and parent of each node, then compare.',
  tags: ['tree', 'bfs', 'dfs', 'depth', 'parent tracking'],

  code: {
    pseudocode: `function isCousins(root, x, y):
  xDepth, xParent = -1, null
  yDepth, yParent = -1, null
  function dfs(node, parent, depth):
    if node is null: return
    if node.val == x: xDepth=depth; xParent=parent
    if node.val == y: yDepth=depth; yParent=parent
    dfs(node.left, node, depth+1)
    dfs(node.right, node, depth+1)
  dfs(root, null, 0)
  return xDepth == yDepth and xParent != yParent`,

    python: `def isCousins(self, root, x, y):
    self.x_info = self.y_info = None
    def dfs(node, parent, depth):
        if not node: return
        if node.val == x: self.x_info = (depth, parent)
        if node.val == y: self.y_info = (depth, parent)
        dfs(node.left, node, depth + 1)
        dfs(node.right, node, depth + 1)
    dfs(root, None, 0)
    xd, xp = self.x_info
    yd, yp = self.y_info
    return xd == yd and xp != yp`,

    javascript: `function isCousins(root, x, y) {
  let xDepth, xParent, yDepth, yParent;
  function dfs(node, parent, depth) {
    if (!node) return;
    if (node.val === x) { xDepth = depth; xParent = parent; }
    if (node.val === y) { yDepth = depth; yParent = parent; }
    dfs(node.left, node, depth + 1);
    dfs(node.right, node, depth + 1);
  }
  dfs(root, null, 0);
  return xDepth === yDepth && xParent !== yParent;
}`,

    java: `public boolean isCousins(TreeNode root, int x, int y) {
    int[] xInfo = new int[2], yInfo = new int[2];
    TreeNode[] parents = new TreeNode[2];
    dfs(root, null, 0, x, y, xInfo, yInfo, parents);
    return xInfo[0] == yInfo[0] && parents[0] != parents[1];
}
private void dfs(TreeNode node, TreeNode par, int depth,
                  int x, int y, int[] xI, int[] yI, TreeNode[] parents) {
    if (node == null) return;
    if (node.val == x) { xI[0] = depth; parents[0] = par; }
    if (node.val == y) { yI[0] = depth; parents[1] = par; }
    dfs(node.left, node, depth+1, x, y, xI, yI, parents);
    dfs(node.right, node, depth+1, x, y, xI, yI, parents);
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, 4],
    x: 4,
    y: 3,
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Level-order array with null for missing nodes',
    },
    {
      name: 'x',
      label: 'Node X value',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'y',
      label: 'Node Y value',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const x = input.x as number;
    const y = input.y as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    // Tree: [1,2,3,4] -> 1(root), 2(left), 3(right), 4(left-left)
    // x=4 (depth=2, parent=2), y=3 (depth=1, parent=1)
    steps.push({
      line: 1,
      explanation: `Initialize DFS to find depth and parent of x=${x} and y=${y}.`,
      variables: { x, y, xDepth: -1, yDepth: -1 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit root (val=1, depth=0, parent=null). Not x or y.',
      variables: { current: 1, depth: 0, parent: 'null' },
      visualization: makeViz({ 0: 'current' }),
    });

    steps.push({
      line: 5,
      explanation: 'Visit node 2 (depth=1, parent=1). Not x or y. Continue to its children.',
      variables: { current: 2, depth: 1, parent: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'current' }),
    });

    steps.push({
      line: 6,
      explanation: `Visit node 4 (depth=2, parent=2). Val=4 matches x=${x}. Record: xDepth=2, xParent=2.`,
      variables: { current: 4, depth: 2, parent: 2, xDepth: 2, xParent: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 3: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Backtrack. Visit node 3 (depth=1, parent=1). Val=3 matches y=3. Record: yDepth=1, yParent=1.',
      variables: { current: 3, depth: 1, parent: 1, yDepth: 1, yParent: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'found', 3: 'sorted' }),
    });

    steps.push({
      line: 10,
      explanation: `DFS complete. Compare: xDepth=${2} vs yDepth=${1}. Depths differ.`,
      variables: { xDepth: 2, yDepth: 1, xParent: 2, yParent: 1 },
      visualization: makeViz({ 2: 'comparing', 3: 'comparing' }),
    });

    steps.push({
      line: 10,
      explanation: 'xDepth (2) != yDepth (1). Nodes are NOT at the same depth. Return false - they are not cousins.',
      variables: { result: false, reason: 'different depths' },
      visualization: makeViz({ 2: 'mismatch', 3: 'mismatch' }),
    });

    return steps;
  },
};

export default cousinsInBinaryTree;
