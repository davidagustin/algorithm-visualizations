import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreePostorderTraversal: AlgorithmDefinition = {
  id: 'n-ary-tree-postorder-traversal',
  title: 'N-ary Tree Postorder Traversal',
  leetcodeNumber: 590,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of an N-ary tree, return the postorder traversal of its nodes values. In postorder, recursively visit each child left to right, then visit the root.',
  tags: ['Tree', 'DFS', 'Postorder'],
  code: {
    pseudocode: `function postorder(root):
  if root is null: return []
  result = []
  for child in root.children:
    result += postorder(child)
  result.append(root.val)
  return result`,
    python: `def postorder(root):
    if not root:
        return []
    result = []
    for child in root.children:
        result.extend(postorder(child))
    result.append(root.val)
    return result`,
    javascript: `function postorder(root) {
  if (!root) return [];
  const result = [];
  for (const child of root.children)
    result.push(...postorder(child));
  result.push(root.val);
  return result;
}`,
    java: `public List<Integer> postorder(Node root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    for (Node child : root.children)
        result.addAll(postorder(child));
    result.add(root.val);
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
      explanation: 'Start DFS postorder: visit each child left to right, then the root.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'comparing';

      steps.push({
        line: 3,
        explanation: `Postorder: recurse into children of node ${tree[idx]} before visiting it.`,
        variables: { node: tree[idx] },
        visualization: makeViz(highlights),
      });

      dfs(2 * idx + 1);
      dfs(2 * idx + 2);

      visited.add(idx);
      result.push(tree[idx] as number);

      const highlights2: Record<number, string> = {};
      visited.forEach(i => { highlights2[i] = 'visited'; });
      highlights2[idx] = 'active';

      steps.push({
        line: 5,
        explanation: `Postorder visit node ${tree[idx]}. Current result: [${result.join(', ')}].`,
        variables: { node: tree[idx], result: [...result] },
        visualization: makeViz(highlights2),
      });
    }

    dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 6,
      explanation: `Postorder traversal complete: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default nAryTreePostorderTraversal;
