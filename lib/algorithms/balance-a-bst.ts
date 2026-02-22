import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const balanceABst: AlgorithmDefinition = {
  id: 'balance-a-bst',
  title: 'Balance a Binary Search Tree',
  leetcodeNumber: 1382,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST, return a balanced BST with the same node values. Perform inorder traversal to get a sorted array, then recursively build a balanced BST by always picking the middle element as the root of each subtree.',
  tags: ['tree', 'BST', 'inorder', 'divide and conquer', 'balancing'],

  code: {
    pseudocode: `function balanceBST(root):
  sorted = inorderTraversal(root)
  return buildBalanced(sorted, 0, len(sorted)-1)

function buildBalanced(arr, left, right):
  if left > right: return null
  mid = (left + right) / 2
  node = new Node(arr[mid])
  node.left = buildBalanced(arr, left, mid-1)
  node.right = buildBalanced(arr, mid+1, right)
  return node`,

    python: `def balanceBST(root):
    def inorder(node):
        if not node: return []
        return inorder(node.left) + [node.val] + inorder(node.right)

    def build(arr, lo, hi):
        if lo > hi: return None
        mid = (lo + hi) // 2
        node = TreeNode(arr[mid])
        node.left = build(arr, lo, mid - 1)
        node.right = build(arr, mid + 1, hi)
        return node

    return build(inorder(root), 0, len(inorder(root)) - 1)`,

    javascript: `function balanceBST(root) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  function build(lo, hi) {
    if (lo > hi) return null;
    const mid = Math.floor((lo + hi) / 2);
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
private TreeNode build(List<Integer> vals, int lo, int hi) {
    if (lo > hi) return null;
    int mid = (lo + hi) / 2;
    TreeNode node = new TreeNode(vals.get(mid));
    node.left = build(vals, lo, mid - 1);
    node.right = build(vals, mid + 1, hi);
    return node;
}`,
  },

  defaultInput: {
    tree: [1, null, 2, null, null, null, 3, null, null, null, null, null, null, null, 4],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Unbalanced BST (level-order)',
      type: 'array',
      defaultValue: [1, null, 2, null, null, null, 3, null, null, null, null, null, null, null, 4],
      placeholder: '1,null,2,null,3,null,4',
      helperText: 'Level-order representation of an unbalanced BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Balance BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Step 1: inorder traversal to get sorted values.`,
      variables: {},
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    // Inorder traversal
    const sorted: number[] = [];
    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);
      sorted.push(tree[pos] as number);
      inorder(2 * pos + 2);
    }
    inorder(0);

    steps.push({
      line: 2,
      explanation: `Sorted inorder values: [${sorted.join(', ')}]. Now build balanced BST by picking mid each time.`,
      variables: { sorted: JSON.stringify(sorted) },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: {},
        labels: {},
      },
    });

    const balanced: (number | null)[] = [];

    function build(lo: number, hi: number, pos: number): void {
      if (lo > hi) return;
      const mid = Math.floor((lo + hi) / 2);
      const val = sorted[mid];

      while (balanced.length <= pos) balanced.push(null);
      balanced[pos] = val;

      const midHighlight: Record<number, string> = {};
      for (let i = lo; i <= hi; i++) midHighlight[i] = i === mid ? 'active' : 'comparing';

      steps.push({
        line: 6,
        explanation: `Subarray [${lo}..${hi}]: mid=${mid}, value=${val}. Place ${val} as tree node. Left: [${lo}..${mid - 1}], Right: [${mid + 1}..${hi}].`,
        variables: { lo, hi, mid, val },
        visualization: {
          type: 'tree',
          nodes: [...balanced] as number[],
          highlights: { [pos]: 'active' },
        },
      });

      build(lo, mid - 1, 2 * pos + 1);
      build(mid + 1, hi, 2 * pos + 2);
    }

    build(0, sorted.length - 1, 0);

    steps.push({
      line: 9,
      explanation: `Balanced BST complete: [${balanced.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(balanced) },
      visualization: {
        type: 'tree',
        nodes: [...balanced] as number[],
        highlights: Object.fromEntries(
          balanced.map((v, i) => [i, v !== null ? 'found' : 'default'])
        ),
      },
    });

    return steps;
  },
};

export default balanceABst;
