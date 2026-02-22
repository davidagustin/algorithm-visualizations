import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const increasingOrderSearchTreeII: AlgorithmDefinition = {
  id: 'increasing-order-search-tree-ii',
  title: 'Increasing Order Search Tree II',
  leetcodeNumber: 897,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Rearrange a BST so the leftmost node becomes the root and every node has no left child and only a right child. Perform an in-order traversal to get sorted values, then rebuild as a right-skewed tree.',
  tags: ['Tree', 'BST', 'DFS', 'In-order Traversal'],
  code: {
    pseudocode: `function increasingBST(root):
  values = []
  inOrder(root, values)  // collect sorted values
  dummy = new Node(0); cur = dummy
  for val in values:
    cur.right = new Node(val)
    cur = cur.right
  return dummy.right`,
    python: `def increasingBST(root):
    def inorder(node):
        if not node: return []
        return inorder(node.left) + [node.val] + inorder(node.right)
    vals = inorder(root)
    dummy = cur = TreeNode(0)
    for v in vals:
        cur.right = TreeNode(v)
        cur = cur.right
    return dummy.right`,
    javascript: `function increasingBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  let dummy = new TreeNode(0), cur = dummy;
  for (const v of vals) { cur.right = new TreeNode(v); cur = cur.right; }
  return dummy.right;
}`,
    java: `public TreeNode increasingBST(TreeNode root) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    TreeNode dummy = new TreeNode(0), cur = dummy;
    for (int v : vals) { cur.right = new TreeNode(v); cur = cur.right; }
    return dummy.right;
}
void inorder(TreeNode node, List<Integer> vals) {
    if (node == null) return;
    inorder(node.left, vals);
    vals.add(node.val);
    inorder(node.right, vals);
}`,
  },
  defaultInput: { tree: [5, 3, 6, 2, 4, null, 8, 1, null, null, null, null, null, 7, 9] },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [5, 3, 6, 2, 4, null, 8, 1, null, null, null, null, null, 7, 9],
      placeholder: 'e.g. 5,3,6,2,4,null,8,1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const sortedVals: number[] = [];
    const visitOrder: number[] = [];

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const i of visitOrder) if (tree[i] != null) highlights[i] = 'visited';
      if (activeIdx !== null && tree[activeIdx] != null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Rearrange BST into increasing order (right-skewed tree). Perform in-order traversal.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function inOrder(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      inOrder(2 * idx + 1);
      const val = tree[idx] as number;
      sortedVals.push(val);
      visitOrder.push(idx);
      steps.push({
        line: 3,
        explanation: `In-order: visit ${val}. Sorted so far: [${sortedVals.join(',')}].`,
        variables: { node: val, sortedSoFar: sortedVals.slice() },
        visualization: makeViz(idx),
      });
      inOrder(2 * idx + 2);
    }

    inOrder(0);

    // Build result as right-skewed array
    const resultTree: (number | null)[] = sortedVals.map((_, i) => null);
    // Right-skewed: root at 0, right child at 2, right child of that at 6, etc.
    // In level-order: index 0, 2, 6, 14, 30, ...
    let pos = 0;
    const resultArr: (number | null)[] = [];
    for (const val of sortedVals) {
      while (resultArr.length <= pos) resultArr.push(null);
      resultArr[pos] = val;
      pos = 2 * pos + 2;
    }

    steps.push({
      line: 7,
      explanation: `Sorted values: [${sortedVals.join(',')}]. Build right-skewed tree.`,
      variables: { sortedValues: sortedVals },
      visualization: { type: 'tree', nodes: resultArr.slice(), highlights: {} },
    });

    steps.push({
      line: 8,
      explanation: `Result: right-skewed BST with ${sortedVals.length} nodes.`,
      variables: { result: sortedVals },
      visualization: {
        type: 'tree',
        nodes: resultArr.slice(),
        highlights: Object.fromEntries(resultArr.map((_, i) => [i, 'found']).filter(([i]) => resultArr[i as number] != null)),
      },
    });

    return steps;
  },
};

export default increasingOrderSearchTreeII;
