import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreePostorderTraversal: AlgorithmDefinition = {
  id: 'binary-tree-postorder-traversal',
  title: 'Binary Tree Postorder Traversal',
  leetcodeNumber: 145,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the postorder traversal of its nodes\' values. Postorder traversal visits nodes in the order: left subtree, right subtree, then the current node (left → right → root). This is useful for deleting trees or evaluating expression trees.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function postorderTraversal(root):
  result = []
  function dfs(node):
    if node is null: return
    dfs(node.left)
    dfs(node.right)
    result.append(node.val)
  dfs(root)
  return result`,
    python: `def postorderTraversal(root):
    result = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        dfs(node.right)
        result.append(node.val)
    dfs(root)
    return result`,
    javascript: `function postorderTraversal(root) {
  const result = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    dfs(node.right);
    result.push(node.val);
  }
  dfs(root);
  return result;
}`,
    java: `public List<Integer> postorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, result);
    return result;
}
private void dfs(TreeNode node, List<Integer> result) {
    if (node == null) return;
    dfs(node.left, result);
    dfs(node.right, result);
    result.add(node.val);
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
      explanation: `Postorder traversal: left → right → root. Start at root (${tree[0]}).`,
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
        explanation: `At node ${val}. Go left first (postorder visits children before root).`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(leftIdx);

      steps.push({
        line: 6,
        explanation: `Left subtree of ${val} done. Traverse right subtree.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      dfs(rightIdx);

      result.push(val);
      visited.add(idx);

      steps.push({
        line: 7,
        explanation: `Both children of ${val} processed. Now record ${val} (postorder: root after children). Result: [${result.join(', ')}].`,
        variables: { node: val, result: [...result] },
        visualization: makeViz(idx),
      });
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Postorder traversal complete! Result: [${result.join(', ')}].`,
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

export default binaryTreePostorderTraversal;
