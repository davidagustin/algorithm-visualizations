import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const verticalOrderTraversalII: AlgorithmDefinition = {
  id: 'vertical-order-traversal-ii',
  title: 'Vertical Order Traversal of a Binary Tree',
  leetcodeNumber: 987,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the vertical order traversal. For each node at (row, col), collect values sorted by (col, row, val). Nodes in the same position are sorted by value. Use DFS to collect (row, col, val) tuples, then sort and group by column.',
  tags: ['Tree', 'DFS', 'Sorting', 'Hash Map'],
  code: {
    pseudocode: `function verticalTraversal(root):
  nodes = []
  dfs(root, 0, 0, nodes)
  sort nodes by (col, row, val)
  group by column and return

function dfs(node, row, col, nodes):
  if node is null: return
  nodes.append((col, row, node.val))
  dfs(node.left, row+1, col-1, nodes)
  dfs(node.right, row+1, col+1, nodes)`,
    python: `def verticalTraversal(root):
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
    prev_col = None
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
  let prevCol = null;
  for (const [col, , val] of nodes) {
    if (col !== prevCol) { result.push([]); prevCol = col; }
    result[result.length - 1].push(val);
  }
  return result;
}`,
    java: `public List<List<Integer>> verticalTraversal(TreeNode root) {
    List<int[]> nodes = new ArrayList<>();
    dfs(root, 0, 0, nodes);
    Collections.sort(nodes, (a, b) -> a[0] != b[0] ? a[0]-b[0] : a[1] != b[1] ? a[1]-b[1] : a[2]-b[2]);
    List<List<Integer>> result = new ArrayList<>();
    int prevCol = Integer.MIN_VALUE;
    for (int[] node : nodes) {
        if (node[0] != prevCol) { result.add(new ArrayList<>()); prevCol = node[0]; }
        result.get(result.size()-1).add(node[2]);
    }
    return result;
}`,
  },
  defaultInput: { tree: [3, 1, 2, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 1, 2, 4, 5, 6, 7],
      placeholder: 'e.g. 3,1,2,4,5,6,7',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const collected: Array<[number, number, number, number]> = []; // [col, row, val, idx]

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Return [].',
        variables: { result: [] },
        visualization: makeViz({}),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Start DFS to collect (col, row, val) for each node, then sort.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const visited = new Set<number>();

    function dfs(idx: number, row: number, col: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      visited.add(idx);
      collected.push([col, row, tree[idx] as number, idx]);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 8,
        explanation: `Visit node ${tree[idx]} at row=${row}, col=${col}. Append to nodes list.`,
        variables: { node: tree[idx], row, col, collected: collected.length },
        visualization: makeViz(highlights),
      });

      dfs(2 * idx + 1, row + 1, col - 1);
      dfs(2 * idx + 2, row + 1, col + 1);
    }

    dfs(0, 0, 0);

    collected.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);

    steps.push({
      line: 3,
      explanation: `Collected ${collected.length} node entries. Now sorting by (col, row, val).`,
      variables: { nodes: collected.map(([c, r, v]) => ({ col: c, row: r, val: v })) },
      visualization: makeViz(Object.fromEntries(collected.map(([, , , i]) => [i, 'comparing']))),
    });

    const result: number[][] = [];
    let prevCol: number | null = null;
    for (const [col, , val] of collected) {
      if (col !== prevCol) { result.push([]); prevCol = col; }
      result[result.length - 1].push(val);
    }

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Grouping by column complete. Result: ${JSON.stringify(result)}.`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default verticalOrderTraversalII;
