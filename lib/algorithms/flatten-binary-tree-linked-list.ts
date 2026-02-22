import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flattenBinaryTreeLinkedList: AlgorithmDefinition = {
  id: 'flatten-binary-tree-linked-list',
  title: 'Flatten Binary Tree to Linked List',
  leetcodeNumber: 114,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, flatten the tree into a linked list in-place following preorder traversal order. Each node right pointer points to the next node; left pointers are all null. Uses Morris traversal approach: for each node with a left subtree, find the rightmost node in the left subtree and redirect it to the right subtree, then move the left subtree to the right.',
  tags: ['tree', 'dfs', 'linked list', 'morris traversal'],

  code: {
    pseudocode: `function flatten(root):
  current = root
  while current is not null:
    if current.left is not null:
      # Find rightmost of left subtree
      rightmost = current.left
      while rightmost.right is not null:
        rightmost = rightmost.right
      # Connect right subtree to rightmost
      rightmost.right = current.right
      # Move left subtree to right
      current.right = current.left
      current.left = null
    current = current.right`,
    python: `def flatten(root):
    cur = root
    while cur:
        if cur.left:
            rightmost = cur.left
            while rightmost.right:
                rightmost = rightmost.right
            rightmost.right = cur.right
            cur.right = cur.left
            cur.left = None
        cur = cur.right`,
    javascript: `function flatten(root) {
  let cur = root;
  while (cur) {
    if (cur.left) {
      let rightmost = cur.left;
      while (rightmost.right) rightmost = rightmost.right;
      rightmost.right = cur.right;
      cur.right = cur.left;
      cur.left = null;
    }
    cur = cur.right;
  }
}`,
    java: `public void flatten(TreeNode root) {
    TreeNode cur = root;
    while (cur != null) {
        if (cur.left != null) {
            TreeNode rightmost = cur.left;
            while (rightmost.right != null) rightmost = rightmost.right;
            rightmost.right = cur.right;
            cur.right = cur.left;
            cur.left = null;
        }
        cur = cur.right;
    }
}`,
  },

  defaultInput: {
    nums: [1, 2, 5, 3, 4, 0, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 5, 3, 4, 0, 6],
      placeholder: '1,2,5,3,4,0,6',
      helperText: 'Level-order binary tree (0 means null node)',
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
      explanation: 'Flatten binary tree to linked list using Morris traversal (in-place). Preorder: root -> left -> right.',
      variables: { current: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'cur' }),
    });

    // Simulate the flattening by tracking preorder
    const preorder: number[] = [];

    function collectPreorder(idx: number) {
      if (idx >= nums.length || nums[idx] === 0) return;
      preorder.push(idx);
      collectPreorder(2 * idx + 1);
      collectPreorder(2 * idx + 2);
    }

    collectPreorder(0);

    steps.push({
      line: 3,
      explanation: `Preorder traversal gives indices: [${preorder.join(', ')}] with values [${preorder.map(i => nums[i]).join(', ')}].`,
      variables: { preorderValues: preorder.map(i => nums[i]) },
      visualization: makeViz(
        Object.fromEntries(preorder.map((idx, pos) => [idx, pos === 0 ? 'active' : 'visiting'])),
        Object.fromEntries(preorder.map((idx, pos) => [idx, `p${pos}`]))
      ),
    });

    for (let i = 0; i < preorder.length; i++) {
      const curIdx = preorder[i];
      const nextIdx = i + 1 < preorder.length ? preorder[i + 1] : null;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      highlights[curIdx] = 'active';
      labels[curIdx] = 'cur';
      if (nextIdx !== null) {
        highlights[nextIdx] = 'pointer';
        labels[nextIdx] = 'next';
      }

      steps.push({
        line: 10,
        explanation: nextIdx !== null
          ? `Node[${curIdx}]=${nums[curIdx]}: set right pointer to node[${nextIdx}]=${nums[nextIdx]}, set left to null.`
          : `Node[${curIdx}]=${nums[curIdx]}: last node, right = null.`,
        variables: {
          current: nums[curIdx],
          rightTo: nextIdx !== null ? nums[nextIdx] : 'null',
          left: 'null',
        },
        visualization: makeViz(highlights, labels),
      });
    }

    const finalHighlights: Record<number, string> = {};
    preorder.forEach((idx, pos) => {
      finalHighlights[idx] = pos === 0 ? 'found' : 'sorted';
    });

    steps.push({
      line: 12,
      explanation: `Tree flattened. Linked list order: [${preorder.map(i => nums[i]).join(' -> ')}].`,
      variables: { result: preorder.map(i => nums[i]) },
      visualization: makeViz(finalHighlights, Object.fromEntries(preorder.map((idx, pos) => [idx, `${pos + 1}`]))),
    });

    return steps;
  },
};

export default flattenBinaryTreeLinkedList;
