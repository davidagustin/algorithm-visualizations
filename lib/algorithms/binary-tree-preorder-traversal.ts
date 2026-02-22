import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreePreorderTraversal: AlgorithmDefinition = {
  id: 'binary-tree-preorder-traversal',
  title: 'Binary Tree Preorder Traversal',
  leetcodeNumber: 144,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the preorder traversal of its nodes\' values. Preorder traversal visits the current node first, then recursively visits the left subtree, then the right subtree (root → left → right). This is useful for copying a tree or serializing its structure.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function preorderTraversal(root):
  result = []
  function dfs(node):
    if node is null: return
    result.append(node.val)
    dfs(node.left)
    dfs(node.right)
  dfs(root)
  return result`,
    python: `def preorderTraversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        result.append(node.val)
        dfs(node.left)
        dfs(node.right)
    dfs(root)
    return result`,
    javascript: `function preorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    result.push(node.val);
    dfs(node.left);
    dfs(node.right);
  }
  dfs(root);
  return result;
}`,
    java: `public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}
private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    result.add(node.val);
    dfs(node.left, result);
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
      explanation: `Preorder traversal: root → left → right. Start at root (${tree[0]}).`,
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

      result.push(val);
      visited.add(idx);

      steps.push({
        line: 5,
        explanation: `Visit node ${val} first (preorder: root before children). Result: [${result.join(', ')}].`,
        variables: { node: val, result: [...result] },
        visualization: makeViz(idx),
      });

      steps.push({
        line: 6,
        explanation: `Traverse left subtree of node ${val}.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(leftIdx);

      steps.push({
        line: 7,
        explanation: `Left subtree of ${val} done. Now traverse right subtree.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(rightIdx);
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Preorder traversal complete! Result: [${result.join(', ')}].`,
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

export default binaryTreePreorderTraversal;
