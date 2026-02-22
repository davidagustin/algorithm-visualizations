import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const binaryTreeInorderIterative: AlgorithmDefinition = {
  id: 'binary-tree-inorder-iterative',
  title: 'Binary Tree Inorder Traversal (Iterative)',
  leetcodeNumber: 94,
  difficulty: 'Easy',
  category: 'Stack',
  description:
    'Perform inorder traversal (left, root, right) of a binary tree iteratively using an explicit stack. Repeatedly push nodes to the left, then process a node, then move to the right child. This avoids recursion overhead and explicitly shows the call stack behavior.',
  tags: ['stack', 'tree', 'binary tree', 'inorder', 'iterative'],

  code: {
    pseudocode: `function inorderTraversal(root):
  result = []
  stack = []
  current = root
  while current != null or stack not empty:
    while current != null:
      stack.push(current)
      current = current.left
    current = stack.pop()
    result.append(current.val)
    current = current.right
  return result`,

    python: `def inorderTraversal(root):
    result = []
    stack = []
    current = root
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result`,

    javascript: `function inorderTraversal(root) {
  const result = [];
  const stack = [];
  let current = root;
  while (current || stack.length) {
    while (current) {
      stack.push(current);
      current = current.left;
    }
    current = stack.pop();
    result.push(current.val);
    current = current.right;
  }
  return result;
}`,

    java: `public List<Integer> inorderTraversal(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode current = root;
    while (current != null || !stack.isEmpty()) {
        while (current != null) {
            stack.push(current);
            current = current.left;
        }
        current = stack.pop();
        result.add(current.val);
        current = current.right;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [4, 2, 6, 1, 3, 5, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order)',
      type: 'array',
      defaultValue: [4, 2, 6, 1, 3, 5, 7],
      placeholder: '4,2,6,1,3,5,7',
      helperText: 'Level-order array representation of binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];
    const result: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(String),
      inputChars: nums.map(String),
      currentIndex: idx,
      action,
    });

    // Build simple tree from level-order array
    // Node at index i has left child at 2i+1, right child at 2i+2
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
      explanation: `Iterative inorder traversal of tree [${nums.join(', ')}]. Use stack to simulate recursion. Visit: left, node, right.`,
      variables: { result: [], stack: [], current: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    let current: number | null = 0; // index into nums array

    while (current !== null || stack.length > 0) {
      // Go left as far as possible
      while (current !== null) {
        steps.push({
          line: 5,
          explanation: `Push node ${nums[current]} (index ${current}) onto stack, go left.`,
          variables: { current: nums[current], stackSize: stack.length + 1 },
          visualization: makeViz(current, 'push'),
        });
        stack.push(current);
        current = getLeft(current);
      }

      // Pop and process
      const popped = stack.pop()!;
      result.push(nums[popped]);

      steps.push({
        line: 8,
        explanation: `Pop node ${nums[popped]} from stack. Visit it (add ${nums[popped]} to result). Result so far: [${result.join(', ')}].`,
        variables: { visited: nums[popped], result: [...result], stack: [...stack] },
        visualization: makeViz(popped, 'match'),
      });

      // Go right
      current = getRight(popped);
      if (current !== null) {
        steps.push({
          line: 9,
          explanation: `Move to right child of ${nums[popped]}: node ${nums[current]}.`,
          variables: { current: nums[current] },
          visualization: makeViz(current, 'idle'),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `Inorder traversal complete. Result: [${result.join(', ')}].`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default binaryTreeInorderIterative;
