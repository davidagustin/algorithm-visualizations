import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const verticalOrderTraversal: AlgorithmDefinition = {
  id: 'vertical-order-traversal',
  title: 'Vertical Order Traversal of a Binary Tree',
  leetcodeNumber: 987,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the vertical order traversal. Each node is assigned a column (root=0, left child col-1, right child col+1) and row. For each column, sort nodes by row, then by value if same row. Uses DFS to collect (col, row, val) tuples then group and sort.',
  tags: ['tree', 'dfs', 'sorting', 'coordinate system', 'hash map'],

  code: {
    pseudocode: `function verticalTraversal(root):
  nodes = []
  function dfs(node, row, col):
    if node is null: return
    nodes.append((col, row, node.val))
    dfs(node.left, row+1, col-1)
    dfs(node.right, row+1, col+1)
  dfs(root, 0, 0)
  nodes.sort()               // sort by col, row, val
  result = []
  group by column:
    append group values to result
  return result`,

    python: `def verticalTraversal(self, root):
    nodes = []
    def dfs(node, row, col):
        if not node:
            return
        nodes.append((col, row, node.val))
        dfs(node.left, row + 1, col - 1)
        dfs(node.right, row + 1, col + 1)
    dfs(root, 0, 0)
    nodes.sort()
    result = []
    prev_col = float('-inf')
    for col, row, val in nodes:
        if col != prev_col:
            result.append([])
            prev_col = col
        result[-1].append(val)
    return result`,

    javascript: `function verticalTraversal(root) {
  const nodes = [];
  function dfs(node, row, col) {
    if (!node) return;
    nodes.push([col, row, node.val]);
    dfs(node.left, row + 1, col - 1);
    dfs(node.right, row + 1, col + 1);
  }
  dfs(root, 0, 0);
  nodes.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
  const result = [];
  let prevCol = -Infinity;
  for (const [col, , val] of nodes) {
    if (col !== prevCol) { result.push([]); prevCol = col; }
    result[result.length - 1].push(val);
  }
  return result;
}`,

    java: `public List<List<Integer>> verticalTraversal(TreeNode root) {
    List<int[]> nodes = new ArrayList<>();
    dfs(root, 0, 0, nodes);
    Collections.sort(nodes, (a, b) ->
        a[0] != b[0] ? a[0] - b[0] : a[1] != b[1] ? a[1] - b[1] : a[2] - b[2]);
    List<List<Integer>> result = new ArrayList<>();
    int prevCol = Integer.MIN_VALUE;
    for (int[] node : nodes) {
        if (node[0] != prevCol) { result.add(new ArrayList<>()); prevCol = node[0]; }
        result.get(result.size() - 1).add(node[2]);
    }
    return result;
}
private void dfs(TreeNode node, int row, int col, List<int[]> nodes) {
    if (node == null) return;
    nodes.add(new int[]{col, row, node.val});
    dfs(node.left, row + 1, col - 1, nodes);
    dfs(node.right, row + 1, col + 1, nodes);
}`,
  },

  defaultInput: {
    nodes: [3, 9, 20, null, null, 15, 7],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: '3,9,20,null,null,15,7',
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

    // Tree: 3 at col=0 row=0, 9 at col=-1 row=1, 20 at col=1 row=1
    //       15 at col=0 row=2, 7 at col=2 row=2
    steps.push({
      line: 2,
      explanation: 'Start DFS from root 3 at (row=0, col=0). Initialize nodes list.',
      variables: { nodes: '[]', row: 0, col: 0 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Record root: (col=0, row=0, val=3). Then recurse left to node 9.',
      variables: { nodes: '[(0,0,3)]', current: 3, col: 0, row: 0 },
      visualization: makeViz({ 0: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Visit left child 9 at (row=1, col=-1). Record (col=-1, row=1, val=9).',
      variables: { nodes: '[(0,0,3),(-1,1,9)]', current: 9, col: -1, row: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 6,
      explanation: 'Node 9 has no children. Return to root. Visit right child 20 at (row=1, col=1).',
      variables: { nodes: '[(0,0,3),(-1,1,9)]', current: 20, col: 1, row: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Record node 20: (col=1, row=1, val=20). Recurse to its left child 15.',
      variables: { nodes: '[(0,0,3),(-1,1,9),(1,1,20)]', current: 20, col: 1, row: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'found' }),
    });

    steps.push({
      line: 6,
      explanation: 'Visit left child 15 at (row=2, col=0). Record (col=0, row=2, val=15).',
      variables: { nodes: '[(0,0,3),(-1,1,9),(1,1,20),(0,2,15)]', current: 15, col: 0, row: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 3: 'active' }),
    });

    steps.push({
      line: 7,
      explanation: 'Visit right child 7 at (row=2, col=2). Record (col=2, row=2, val=7).',
      variables: { nodes: '[(0,0,3),(-1,1,9),(1,1,20),(0,2,15),(2,2,7)]', current: 7, col: 2, row: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'visited', 3: 'sorted', 4: 'active' }),
    });

    steps.push({
      line: 9,
      explanation: 'DFS complete. Sort all records by (col, row, val): [(-1,1,9),(0,0,3),(0,2,15),(1,1,20),(2,2,7)].',
      variables: { sorted: '[(-1,1,9),(0,0,3),(0,2,15),(1,1,20),(2,2,7)]' },
      visualization: makeViz({ 0: 'comparing', 1: 'comparing', 2: 'comparing', 3: 'comparing', 4: 'comparing' }),
    });

    steps.push({
      line: 11,
      explanation: 'Group by column: col=-1 -> [9], col=0 -> [3,15], col=1 -> [20], col=2 -> [7].',
      variables: { result: '[[9],[3,15],[20],[7]]' },
      visualization: makeViz({ 1: 'found', 0: 'found', 3: 'found', 2: 'found', 4: 'found' }),
    });

    steps.push({
      line: 12,
      explanation: 'Final result: [[9],[3,15],[20],[7]]. Each column sorted by row then value.',
      variables: { result: '[[9],[3,15],[20],[7]]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found' }),
    });

    return steps;
  },
};

export default verticalOrderTraversal;
