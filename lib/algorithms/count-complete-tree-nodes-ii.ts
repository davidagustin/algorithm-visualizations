import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countCompleteTreeNodesIi: AlgorithmDefinition = {
  id: 'count-complete-tree-nodes-ii',
  title: 'Count Complete Tree Nodes (Binary Search)',
  leetcodeNumber: 222,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given a complete binary tree, count the number of nodes in O(log^2 n) time. A complete binary tree has all levels fully filled except possibly the last level, which is filled from left to right. Compare left-height and right-height: if equal, the tree is a perfect binary tree with 2^h - 1 nodes. Otherwise, recursively count left and right subtrees.',
  tags: ['tree', 'binary search', 'complete binary tree', 'math'],

  code: {
    pseudocode: `function countNodes(root):
  if root is null: return 0

  # Compute left height (go left)
  leftHeight = 0
  node = root
  while node is not null:
    leftHeight += 1
    node = node.left

  # Compute right height (go right)
  rightHeight = 0
  node = root
  while node is not null:
    rightHeight += 1
    node = node.right

  # If heights equal, perfect binary tree
  if leftHeight == rightHeight:
    return 2^leftHeight - 1

  # Otherwise recurse
  return 1 + countNodes(root.left) + countNodes(root.right)`,
    python: `def countNodes(root):
    if not root: return 0
    l = r = 0
    nl, nr = root, root
    while nl: l += 1; nl = nl.left
    while nr: r += 1; nr = nr.right
    if l == r: return 2**l - 1
    return 1 + countNodes(root.left) + countNodes(root.right)`,
    javascript: `function countNodes(root) {
  if (!root) return 0;
  let l = 0, r = 0, nl = root, nr = root;
  while (nl) { l++; nl = nl.left; }
  while (nr) { r++; nr = nr.right; }
  if (l === r) return (1 << l) - 1;
  return 1 + countNodes(root.left) + countNodes(root.right);
}`,
    java: `public int countNodes(TreeNode root) {
    if (root == null) return 0;
    int l = 0, r = 0;
    TreeNode nl = root, nr = root;
    while (nl != null) { l++; nl = nl.left; }
    while (nr != null) { r++; nr = nr.right; }
    if (l == r) return (1 << l) - 1;
    return 1 + countNodes(root.left) + countNodes(root.right);
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Complete Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Level-order complete binary tree (last level left-filled)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count nodes in complete tree of size ${nums.length}. Key insight: compare left-path and right-path heights. Equal heights = perfect tree with 2^h - 1 nodes.`,
      variables: { n: nums.length },
      visualization: makeViz({}, {}),
    });

    function countNodes(idx: number, depth: number): number {
      if (idx >= nums.length || nums[idx] === 0) return 0;

      // Compute left height
      let lh = 0;
      let li = idx;
      const leftPath: number[] = [];
      while (li < nums.length && nums[li] !== 0) {
        leftPath.push(li);
        lh++;
        li = 2 * li + 1;
      }

      // Compute right height
      let rh = 0;
      let ri = idx;
      const rightPath: number[] = [];
      while (ri < nums.length && nums[ri] !== 0) {
        rightPath.push(ri);
        rh++;
        ri = 2 * ri + 2;
      }

      const lHighlights: Record<number, string> = {};
      const rHighlights: Record<number, string> = {};
      leftPath.forEach(i => { lHighlights[i] = 'active'; });
      rightPath.forEach(i => { rHighlights[i] = 'comparing'; });

      steps.push({
        line: lh === rh ? 14 : 17,
        explanation: `Subtree at index ${idx} (depth=${depth}): leftHeight=${lh}, rightHeight=${rh}. ${lh === rh ? 'PERFECT subtree! Count = 2^' + lh + ' - 1 = ' + ((1 << lh) - 1) : 'Not perfect. Recurse into children.'}`,
        variables: { subtreeRoot: nums[idx], leftHeight: lh, rightHeight: rh, isPerfect: lh === rh, count: lh === rh ? (1 << lh) - 1 : 'recursive' },
        visualization: makeViz({ ...lHighlights, ...rHighlights }, { [idx]: `lh=${lh},rh=${rh}` }),
      });

      if (lh === rh) return (1 << lh) - 1;

      const leftCount = countNodes(2 * idx + 1, depth + 1);
      const rightCount = countNodes(2 * idx + 2, depth + 1);
      return 1 + leftCount + rightCount;
    }

    const total = countNodes(0, 0);

    const finalH: Record<number, string> = {};
    nums.forEach((v, i) => { if (v !== 0) finalH[i] = 'found'; });

    steps.push({
      line: 17,
      explanation: `Total node count = ${total}. Verification: actual array length = ${nums.filter(v => v !== 0).length}.`,
      variables: { result: total },
      visualization: makeViz(finalH, Object.fromEntries(nums.map((_, i) => [i, `${i + 1}`]))),
    });

    return steps;
  },
};

export default countCompleteTreeNodesIi;
