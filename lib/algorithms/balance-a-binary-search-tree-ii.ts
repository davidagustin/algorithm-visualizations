import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const balanceABinarySearchTreeII: AlgorithmDefinition = {
  id: 'balance-a-binary-search-tree-ii',
  title: 'Balance a Binary Search Tree II',
  leetcodeNumber: 1382,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a BST, convert it into a balanced BST. Perform an in-order traversal to get sorted values, then build a balanced BST using the sorted array by always choosing the middle element as the root.',
  tags: ['Tree', 'BST', 'Divide and Conquer', 'In-order Traversal'],
  code: {
    pseudocode: `function balanceBST(root):
  values = inOrder(root)  // sorted array
  return buildBalanced(values, 0, len(values) - 1)

function buildBalanced(vals, lo, hi):
  if lo > hi: return null
  mid = (lo + hi) / 2
  node = new Node(vals[mid])
  node.left = buildBalanced(vals, lo, mid - 1)
  node.right = buildBalanced(vals, mid + 1, hi)
  return node`,
    python: `def balanceBST(root):
    def inorder(node):
        if not node: return []
        return inorder(node.left) + [node.val] + inorder(node.right)
    def build(vals, lo, hi):
        if lo > hi: return None
        mid = (lo + hi) // 2
        node = TreeNode(vals[mid])
        node.left = build(vals, lo, mid - 1)
        node.right = build(vals, mid + 1, hi)
        return node
    return build(inorder(root), 0, len(inorder(root)) - 1)`,
    javascript: `function balanceBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left); vals.push(node.val); inorder(node.right);
  }
  inorder(root);
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = (lo + hi) >> 1;
    const node = new TreeNode(vals[mid]);
    node.left = build(lo, mid - 1);
    node.right = build(mid + 1, hi);
    return node;
  }
  return build(0, vals.length - 1);
}`,
    java: `public TreeNode balanceBST(TreeNode root) {
    List<Integer> vals = new ArrayList<>();
    inorder(root, vals);
    return build(vals, 0, vals.size() - 1);
}
void inorder(TreeNode n, List<Integer> v) {
    if (n == null) return;
    inorder(n.left, v); v.add(n.val); inorder(n.right, v);
}
TreeNode build(List<Integer> v, int lo, int hi) {
    if (lo > hi) return null;
    int mid = (lo + hi) / 2;
    TreeNode n = new TreeNode(v.get(mid));
    n.left = build(v, lo, mid - 1);
    n.right = build(v, mid + 1, hi);
    return n;
}`,
  },
  defaultInput: { tree: [1, null, 2, null, null, null, 3, null, null, null, null, null, null, null, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Unbalanced BST (level-order)',
      type: 'tree',
      defaultValue: [1, null, 2, null, null, null, 3, null, null, null, null, null, null, null, 4],
      placeholder: 'e.g. 1,null,2,null,3',
      helperText: 'An unbalanced BST (e.g. right-skewed).',
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
      explanation: `Balance BST. Step 1: in-order traversal to get sorted values.`,
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
        line: 2,
        explanation: `In-order: visit ${val}. Sorted values: [${sortedVals.join(',')}].`,
        variables: { node: val, sorted: sortedVals.slice() },
        visualization: makeViz(idx),
      });
      inOrder(2 * idx + 2);
    }

    inOrder(0);

    steps.push({
      line: 3,
      explanation: `Sorted: [${sortedVals.join(',')}]. Step 2: build balanced BST from sorted array.`,
      variables: { sortedValues: sortedVals },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    // Build balanced BST
    const resultTree: (number | null)[] = [];

    function build(lo: number, hi: number, treeIdx: number): void {
      if (lo > hi) return;
      const mid = Math.floor((lo + hi) / 2);
      while (resultTree.length <= treeIdx) resultTree.push(null);
      resultTree[treeIdx] = sortedVals[mid];
      steps.push({
        line: 7,
        explanation: `Place vals[${mid}]=${sortedVals[mid]} at tree index ${treeIdx}. Range [${lo},${hi}].`,
        variables: { val: sortedVals[mid], treeIndex: treeIdx, lo, hi, mid },
        visualization: {
          type: 'tree',
          nodes: resultTree.slice(),
          highlights: { [treeIdx]: 'active' },
        },
      });
      build(lo, mid - 1, 2 * treeIdx + 1);
      build(mid + 1, hi, 2 * treeIdx + 2);
    }

    build(0, sortedVals.length - 1, 0);

    steps.push({
      line: 10,
      explanation: `Balanced BST built! Height is O(log n).`,
      variables: { result: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default balanceABinarySearchTreeII;
