import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const diameterOfTree: AlgorithmDefinition = {
  id: 'diameter-of-tree-dp',
  title: 'Diameter of Binary Tree (Tree DP)',
  leetcodeNumber: 543,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'The diameter of a binary tree is the length of the longest path between any two nodes (not necessarily through root). Use tree DP: for each node, compute the height of its left and right subtrees. The diameter through this node = leftHeight + rightHeight. Track the global maximum across all nodes.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Diameter'],
  code: {
    pseudocode: `function diameterOfBinaryTree(root):
  diameter = 0
  function dfs(node) -> height:
    if null: return 0
    leftH = dfs(node.left)
    rightH = dfs(node.right)
    diameter = max(diameter, leftH + rightH)
    return 1 + max(leftH, rightH)
  dfs(root)
  return diameter`,
    python: `def diameterOfBinaryTree(root):
    self.diameter = 0
    def dfs(node):
        if not node: return 0
        left = dfs(node.left)
        right = dfs(node.right)
        self.diameter = max(self.diameter, left + right)
        return 1 + max(left, right)
    dfs(root)
    return self.diameter`,
    javascript: `function diameterOfBinaryTree(root) {
  let diameter = 0;
  function dfs(node) {
    if (!node) return 0;
    const left = dfs(node.left), right = dfs(node.right);
    diameter = Math.max(diameter, left + right);
    return 1 + Math.max(left, right);
  }
  dfs(root);
  return diameter;
}`,
    java: `public int diameterOfBinaryTree(TreeNode root) {
    int[] diameter = {0};
    dfs(root, diameter);
    return diameter[0];
}
private int dfs(TreeNode node, int[] diameter) {
    if (node == null) return 0;
    int left = dfs(node.left, diameter), right = dfs(node.right, diameter);
    diameter[0] = Math.max(diameter[0], left + right);
    return 1 + Math.max(left, right);
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: 'e.g. 1,2,3,4,5',
      helperText: 'Level-order tree. Diameter = longest path between any two nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let diameter = 0;
    const heightMap: Record<number, number> = {};

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Diameter of Binary Tree via Tree DP. For each node, the diameter passing through it = leftHeight + rightHeight. We track the global max.',
      variables: { diameter: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx];
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 4,
        explanation: `Visit node ${val} at index ${idx}. Recurse into children to get their heights.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const leftH = dfs(leftIdx);
      const rightH = dfs(rightIdx);

      const pathThrough = leftH + rightH;
      if (pathThrough > diameter) diameter = pathThrough;
      const height = 1 + Math.max(leftH, rightH);
      heightMap[idx] = height;

      steps.push({
        line: 6,
        explanation: `Node ${val}: leftH=${leftH}, rightH=${rightH}. Path through this node=${pathThrough}. diameter=max(old, ${pathThrough})=${diameter}. Height=${height}.`,
        variables: { node: val, leftH, rightH, pathThrough, diameter, height },
        visualization: makeViz(idx, { [idx]: pathThrough === diameter ? 'found' : 'visited' }),
      });

      return height;
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Diameter = ${diameter} (longest path between any two nodes).`,
      variables: { answer: diameter },
      visualization: makeViz(null, Object.fromEntries(
        tree.map((v, i) => [i, v != null ? 'found' : 'default']).filter(([, c]) => c !== 'default')
      )),
    });

    return steps;
  },
};

export default diameterOfTree;
