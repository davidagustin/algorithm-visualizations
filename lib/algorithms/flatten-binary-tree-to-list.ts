import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const flattenBinaryTreeToList: AlgorithmDefinition = {
  id: 'flatten-binary-tree-to-list',
  title: 'Flatten Binary Tree to Linked List',
  leetcodeNumber: 114,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, flatten it to a linked list in-place following preorder traversal. Each node\'s right pointer points to the next node in the flattened list; left pointers are all null. We use a recursive approach: flatten left and right subtrees, attach left subtree to the right of root, then attach the original right subtree at the end of the former left subtree.',
  tags: ['Tree', 'DFS', 'Linked List'],
  code: {
    pseudocode: `function flatten(root):
  if root is null: return
  flatten(root.left)
  flatten(root.right)
  rightSubtree = root.right
  root.right = root.left
  root.left = null
  curr = root
  while curr.right != null: curr = curr.right
  curr.right = rightSubtree`,
    python: `def flatten(root):
    if not root:
        return
    flatten(root.left)
    flatten(root.right)
    right_subtree = root.right
    root.right = root.left
    root.left = None
    curr = root
    while curr.right:
        curr = curr.right
    curr.right = right_subtree`,
    javascript: `function flatten(root) {
  if (!root) return;
  flatten(root.left);
  flatten(root.right);
  const rightSubtree = root.right;
  root.right = root.left;
  root.left = null;
  let curr = root;
  while (curr.right) curr = curr.right;
  curr.right = rightSubtree;
}`,
    java: `public void flatten(TreeNode root) {
    if (root == null) return;
    flatten(root.left);
    flatten(root.right);
    TreeNode rightSubtree = root.right;
    root.right = root.left;
    root.left = null;
    TreeNode curr = root;
    while (curr.right != null) curr = curr.right;
    curr.right = rightSubtree;
}`,
  },
  defaultInput: { tree: [1, 2, 5, 3, 4, null, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 5, 3, 4, null, 6],
      placeholder: 'e.g. 1,2,5,3,4,null,6',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Nothing to flatten.',
        variables: { root: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    // Collect preorder traversal
    const preorder: number[] = [];
    function collectPreorder(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      preorder.push(tree[idx] as number);
      collectPreorder(2 * idx + 1);
      collectPreorder(2 * idx + 2);
    }
    collectPreorder(0);

    steps.push({
      line: 1,
      explanation: `Flatten binary tree to linked list in preorder. Preorder sequence: [${preorder.join(' -> ')}].`,
      variables: { root: tree[0], preorderSequence: preorder },
      visualization: makeViz(0),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
      const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Flatten left subtree first.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      if (hasLeft) dfs(leftIdx);
      if (hasRight) dfs(rightIdx);

      visited.add(idx);

      steps.push({
        line: 5,
        explanation: `Node ${val}: both subtrees flattened. Now rewire: move left subtree to right, set left=null.`,
        variables: { node: val, hasLeft, hasRight },
        visualization: makeViz(idx),
      });
    }

    dfs(0);

    // Build the flattened tree representation
    const flattenedTree: (number | null)[] = new Array(preorder.length * 2 + 1).fill(null);
    for (let i = 0; i < preorder.length; i++) {
      const treeIdx = Math.pow(2, i) - 1; // right spine
      if (i === 0) {
        flattenedTree[0] = preorder[0];
      } else {
        // Place along right spine: 0 -> 2 -> 6 -> 14...
        let pos = 0;
        for (let j = 0; j < i; j++) pos = 2 * pos + 2;
        while (flattenedTree.length <= pos) flattenedTree.push(null);
        flattenedTree[pos] = preorder[i];
      }
    }

    // Simpler: represent as linear right-spine
    const spineTree: (number | null)[] = [];
    let pos = 0;
    for (let i = 0; i < preorder.length; i++) {
      while (spineTree.length <= pos) spineTree.push(null);
      spineTree[pos] = preorder[i];
      if (i < preorder.length - 1) pos = 2 * pos + 2;
    }

    steps.push({
      line: 9,
      explanation: `Flattening complete! Linked list (right spine): ${preorder.join(' -> ')}. All left pointers are null.`,
      variables: { flattenedOrder: preorder },
      visualization: {
        type: 'tree',
        nodes: spineTree,
        highlights: Object.fromEntries(
          spineTree.map((_, i) => [i, 'found']).filter(([i]) => spineTree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default flattenBinaryTreeToList;
