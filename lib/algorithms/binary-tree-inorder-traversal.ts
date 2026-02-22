import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeInorderTraversal: AlgorithmDefinition = {
  id: 'binary-tree-inorder-traversal',
  title: 'Binary Tree Inorder Traversal',
  leetcodeNumber: 94,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the inorder traversal of its nodes\' values. Inorder traversal visits nodes in the order: left subtree, current node, right subtree. For a BST, this produces values in sorted order. We use recursive DFS.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function inorderTraversal(root):
  result = []
  function dfs(node):
    if node is null: return
    dfs(node.left)
    result.append(node.val)
    dfs(node.right)
  dfs(root)
  return result`,
    python: `def inorderTraversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        result.append(node.val)
        dfs(node.right)
    dfs(root)
    return result`,
    javascript: `function inorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    result.push(node.val);
    dfs(node.right);
  }
  dfs(root);
  return result;
}`,
    java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}
private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    dfs(node.left, result);
    result.add(node.val);
    dfs(node.right, result);
}`,
  },
  defaultInput: { tree: [1, null, 2, null, null, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, null, 2, null, null, 3],
      placeholder: 'e.g. 1,null,2,null,null,3',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Return empty list.',
        variables: { root: null, result: [] },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Inorder traversal: left → root → right. Start at root (${tree[0]}).`,
      variables: { root: tree[0], result: [] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 4,
          explanation: `Null node encountered. Return (base case).`,
          variables: { node: null },
          visualization: makeViz(null),
        });
        return;
      }

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 5,
        explanation: `Visit node ${val}. Go left first (inorder: left before root).`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(leftIdx);

      result.push(val);
      visited.add(idx);

      steps.push({
        line: 6,
        explanation: `Back at node ${val} after left subtree. Record ${val}. Result so far: [${result.join(', ')}].`,
        variables: { node: val, result: [...result] },
        visualization: makeViz(idx),
      });

      steps.push({
        line: 7,
        explanation: `Now traverse right subtree of node ${val}.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(rightIdx);
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Inorder traversal complete! Result: [${result.join(', ')}].`,
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default binaryTreeInorderTraversal;
