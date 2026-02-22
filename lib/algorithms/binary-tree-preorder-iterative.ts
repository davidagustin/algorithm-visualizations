import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const binaryTreePreorderIterative: AlgorithmDefinition = {
  id: 'binary-tree-preorder-iterative',
  title: 'Binary Tree Preorder Traversal (Iterative)',
  leetcodeNumber: 144,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Perform preorder traversal (root, left, right) of a binary tree iteratively using an explicit stack. Push the right child first, then the left child so the left is processed first. Visit the node immediately upon popping it from the stack.',
  tags: ['stack', 'tree', 'binary tree', 'preorder', 'iterative'],

  code: {
    pseudocode: `function preorderTraversal(root):
  if root is null: return []
  result = []
  stack = [root]
  while stack not empty:
    node = stack.pop()
    result.append(node.val)
    if node.right: stack.push(node.right)
    if node.left: stack.push(node.left)
  return result`,

    python: `def preorderTraversal(root):
    if not root:
        return []
    result = []
    stack = [root]
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return result`,

    javascript: `function preorderTraversal(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return result;
}`,

    java: `public List<Integer> preorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.add(node.val);
        if (node.right != null) stack.push(node.right);
        if (node.left != null) stack.push(node.left);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: '1,2,3,4,5,6,7',
      helperText: 'Level-order array representation of binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = []; // stores indices
    const result: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => String(nums[i])),
      inputChars: nums.map(String),
      currentIndex: idx,
      action,
    });

    const getLeft = (i: number): number | null => {
      const li = 2 * i + 1;
      return li < nums.length ? li : null;
    };
    const getRight = (i: number): number | null => {
      const ri = 2 * i + 2;
      return ri < nums.length ? ri : null;
    };

    steps.push({
      line: 1,
      explanation: `Iterative preorder traversal of tree [${nums.join(', ')}]. Push root first. Pop, visit, push right then left.`,
      variables: { result: [], stack: [nums[0]] },
      visualization: makeViz(-1, 'idle'),
    });

    stack.push(0); // push root index
    steps.push({
      line: 4,
      explanation: `Push root (value ${nums[0]}) onto stack.`,
      variables: { stack: [nums[0]] },
      visualization: makeViz(0, 'push'),
    });

    while (stack.length > 0) {
      const idx = stack.pop()!;
      result.push(nums[idx]);

      steps.push({
        line: 5,
        explanation: `Pop node ${nums[idx]}. Visit it (preorder: root first). Result so far: [${result.join(', ')}].`,
        variables: { visited: nums[idx], result: [...result] },
        visualization: makeViz(idx, 'match'),
      });

      // Push right first so left is processed first
      const ri = getRight(idx);
      if (ri !== null) {
        stack.push(ri);
        steps.push({
          line: 7,
          explanation: `Push right child ${nums[ri]} onto stack (will be processed after left).`,
          variables: { rightChild: nums[ri], stack: stack.map(i => nums[i]) },
          visualization: makeViz(ri, 'push'),
        });
      }

      const li = getLeft(idx);
      if (li !== null) {
        stack.push(li);
        steps.push({
          line: 8,
          explanation: `Push left child ${nums[li]} onto stack (will be processed next).`,
          variables: { leftChild: nums[li], stack: stack.map(i => nums[i]) },
          visualization: makeViz(li, 'push'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Preorder traversal complete. Result: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'match'),
    });

    return steps;
  },
};

export default binaryTreePreorderIterative;
