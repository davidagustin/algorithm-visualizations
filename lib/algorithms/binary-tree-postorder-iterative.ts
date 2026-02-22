import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const binaryTreePostorderIterative: AlgorithmDefinition = {
  id: 'binary-tree-postorder-iterative',
  title: 'Binary Tree Postorder Traversal (Iterative)',
  leetcodeNumber: 145,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Perform postorder traversal (left, right, root) of a binary tree iteratively using an explicit stack. The trick is to do a modified preorder (root, right, left) and then reverse the result. Alternatively, use two stacks. This gives the correct postorder sequence without recursion.',
  tags: ['stack', 'tree', 'binary tree', 'postorder', 'iterative'],

  code: {
    pseudocode: `function postorderTraversal(root):
  if root is null: return []
  result = []
  stack = [root]
  while stack not empty:
    node = stack.pop()
    result.prepend(node.val)  // insert at front
    if node.left: stack.push(node.left)
    if node.right: stack.push(node.right)
  return result  // already in postorder`,

    python: `def postorderTraversal(root):
    if not root:
        return []
    result = []
    stack = [root]
    while stack:
        node = stack.pop()
        result.append(node.val)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return result[::-1]`,

    javascript: `function postorderTraversal(root) {
  if (!root) return [];
  const result = [];
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    result.unshift(node.val);
    if (node.left) stack.push(node.left);
    if (node.right) stack.push(node.right);
  }
  return result;
}`,

    java: `public List<Integer> postorderTraversal(TreeNode root) {
    LinkedList<Integer> result = new LinkedList<>();
    if (root == null) return result;
    Deque<TreeNode> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        TreeNode node = stack.pop();
        result.addFirst(node.val);
        if (node.left != null) stack.push(node.left);
        if (node.right != null) stack.push(node.right);
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
      explanation: `Iterative postorder traversal. Strategy: modified preorder (root, right, left) then reverse result to get (left, right, root).`,
      variables: { result: [], stack: [nums[0]] },
      visualization: makeViz(-1, 'idle'),
    });

    stack.push(0);
    steps.push({
      line: 4,
      explanation: `Push root (value ${nums[0]}) onto stack.`,
      variables: { stack: [nums[0]] },
      visualization: makeViz(0, 'push'),
    });

    while (stack.length > 0) {
      const idx = stack.pop()!;
      result.unshift(nums[idx]); // prepend to result

      steps.push({
        line: 5,
        explanation: `Pop node ${nums[idx]}. Prepend to result (reversed order trick). Result buffer: [${result.join(', ')}].`,
        variables: { popped: nums[idx], resultBuffer: [...result] },
        visualization: makeViz(idx, 'match'),
      });

      // Push left first so right is processed first (modified preorder: root, right, left)
      const li = getLeft(idx);
      if (li !== null) {
        stack.push(li);
        steps.push({
          line: 7,
          explanation: `Push left child ${nums[li]} (processed before right in this modified traversal).`,
          variables: { leftChild: nums[li] },
          visualization: makeViz(li, 'push'),
        });
      }

      const ri = getRight(idx);
      if (ri !== null) {
        stack.push(ri);
        steps.push({
          line: 8,
          explanation: `Push right child ${nums[ri]} (processed next: gives us root-right-left order which reverses to left-right-root).`,
          variables: { rightChild: nums[ri] },
          visualization: makeViz(ri, 'push'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Postorder traversal complete. Final result (already reversed during insertion): [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'match'),
    });

    return steps;
  },
};

export default binaryTreePostorderIterative;
