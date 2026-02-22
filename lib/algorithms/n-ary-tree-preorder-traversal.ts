import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreePreorderTraversal: AlgorithmDefinition = {
  id: 'n-ary-tree-preorder-traversal',
  title: 'N-ary Tree Preorder Traversal',
  leetcodeNumber: 589,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of an N-ary tree, return the preorder traversal of its nodes values. In preorder, visit the root first, then recursively visit each child left to right.',
  tags: ['Tree', 'DFS', 'Preorder'],
  code: {
    pseudocode: `function preorder(root):
  if root is null: return []
  result = [root.val]
  for child in root.children:
    result += preorder(child)
  return result`,
    python: `def preorder(root):
    if not root:
        return []
    result = [root.val]
    for child in root.children:
        result.extend(preorder(child))
    return result`,
    javascript: `function preorder(root) {
  if (!root) return [];
  const result = [root.val];
  for (const child of root.children)
    result.push(...preorder(child));
  return result;
}`,
    java: `public List<Integer> preorder(Node root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    result.add(root.val);
    for (Node child : root.children)
        result.addAll(preorder(child));
    return result;
}`,
  },
  defaultInput: { tree: [1, null, 3, 2, 4, null, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'N-ary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: 'e.g. 1,null,3,2,4,null,5,6',
      helperText: 'Visualized as binary tree for display.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawTree = (input.tree as (number | null)[]).filter(v => v !== null) as number[];
    const tree: (number | null)[] = rawTree;
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return [].', variables: { result: [] }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Start DFS preorder: visit root, then each child left to right.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      visited.add(idx);
      result.push(tree[idx] as number);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 2,
        explanation: `Preorder visit node ${tree[idx]}. Current result: [${result.join(', ')}].`,
        variables: { node: tree[idx], result: [...result] },
        visualization: makeViz(highlights),
      });

      dfs(2 * idx + 1);
      dfs(2 * idx + 2);
    }

    dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Preorder traversal complete: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default nAryTreePreorderTraversal;
