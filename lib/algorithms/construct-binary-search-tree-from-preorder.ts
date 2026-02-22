import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const constructBinarySearchTreeFromPreorder: AlgorithmDefinition = {
  id: 'construct-binary-search-tree-from-preorder',
  title: 'Construct BST from Preorder Traversal',
  leetcodeNumber: 1008,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a preorder traversal of a BST, reconstruct the BST. The first element is the root. Using BST bounds (min, max), place each preorder element in the correct position without needing the inorder.',
  tags: ['Tree', 'BST', 'Preorder', 'Divide and Conquer'],
  code: {
    pseudocode: `function bstFromPreorder(preorder):
  index = 0
  return build(-INF, INF)

function build(min, max):
  if index >= n or preorder[index] not in (min, max): return null
  val = preorder[index++]
  node = new Node(val)
  node.left = build(min, val)
  node.right = build(val, max)
  return node`,
    python: `def bstFromPreorder(preorder):
    idx = [0]
    def build(mn, mx):
        if idx[0] >= len(preorder): return None
        val = preorder[idx[0]]
        if val <= mn or val >= mx: return None
        idx[0] += 1
        node = TreeNode(val)
        node.left = build(mn, val)
        node.right = build(val, mx)
        return node
    return build(float('-inf'), float('inf'))`,
    javascript: `function bstFromPreorder(preorder) {
  let idx = 0;
  function build(min, max) {
    if (idx >= preorder.length) return null;
    const val = preorder[idx];
    if (val <= min || val >= max) return null;
    idx++;
    const node = new TreeNode(val);
    node.left = build(min, val);
    node.right = build(val, max);
    return node;
  }
  return build(-Infinity, Infinity);
}`,
    java: `int idx = 0;
public TreeNode bstFromPreorder(int[] preorder) {
    return build(preorder, Integer.MIN_VALUE, Integer.MAX_VALUE);
}
TreeNode build(int[] p, int min, int max) {
    if (idx >= p.length || p[idx] <= min || p[idx] >= max) return null;
    TreeNode node = new TreeNode(p[idx++]);
    node.left = build(p, min, node.val);
    node.right = build(p, node.val, max);
    return node;
}`,
  },
  defaultInput: { preorder: [8, 5, 1, 7, 10, 12] },
  inputFields: [
    {
      name: 'preorder',
      label: 'Preorder Traversal (BST)',
      type: 'array',
      defaultValue: [8, 5, 1, 7, 10, 12],
      placeholder: 'e.g. 8,5,1,7,10,12',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const preorder = (input.preorder as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const resultTree: (number | null)[] = [];
    let tokenIdx = 0;

    function ensureSize(idx: number): void {
      while (resultTree.length <= idx) resultTree.push(null);
    }

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < resultTree.length; i++) {
        if (resultTree[i] != null) highlights[i] = 'visited';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: resultTree.slice(), highlights };
    }

    function build(treeIdx: number, min: number, max: number): void {
      if (tokenIdx >= preorder.length) return;
      const val = preorder[tokenIdx];
      if (val <= min || val >= max) return;
      tokenIdx++;
      ensureSize(treeIdx);
      resultTree[treeIdx] = val;

      steps.push({
        line: 7,
        explanation: `Place ${val} at tree index ${treeIdx}. Bounds: (${min === -Infinity ? '-∞' : min}, ${max === Infinity ? '∞' : max}).`,
        variables: { val, treeIndex: treeIdx, min, max },
        visualization: makeViz(treeIdx),
      });

      build(2 * treeIdx + 1, min, val);
      build(2 * treeIdx + 2, val, max);
    }

    steps.push({
      line: 1,
      explanation: `Construct BST from preorder [${preorder}]. Use BST bounds to place each node.`,
      variables: { preorder },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    build(0, -Infinity, Infinity);

    steps.push({
      line: 10,
      explanation: 'BST construction complete!',
      variables: { tree: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default constructBinarySearchTreeFromPreorder;
