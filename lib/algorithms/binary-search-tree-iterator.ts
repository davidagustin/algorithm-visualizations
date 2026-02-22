import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const binarySearchTreeIterator: AlgorithmDefinition = {
  id: 'binary-search-tree-iterator',
  title: 'Binary Search Tree Iterator',
  leetcodeNumber: 173,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Implement a BST iterator that returns nodes in ascending order. Initialize with the BST root. next() returns the next smallest number. hasNext() returns whether there is a next number. Use an explicit stack to simulate inorder traversal without fully traversing upfront.',
  tags: ['tree', 'BST', 'stack', 'inorder', 'iterator', 'design'],

  code: {
    pseudocode: `class BSTIterator:
  stack = []
  constructor(root):
    pushLeft(root)

  pushLeft(node):
    while node is not null:
      stack.push(node)
      node = node.left

  next():
    node = stack.pop()
    pushLeft(node.right)
    return node.val

  hasNext():
    return stack is not empty`,

    python: `class BSTIterator:
    def __init__(self, root):
        self.stack = []
        self._push_left(root)

    def _push_left(self, node):
        while node:
            self.stack.append(node.val)
            node = node.left  # conceptual

    def next(self):
        return self.stack.pop()

    def hasNext(self):
        return len(self.stack) > 0`,

    javascript: `class BSTIterator {
  constructor(root) {
    this.stack = [];
    this.pushLeft(root);
  }
  pushLeft(node) {
    while (node) {
      this.stack.push(node.val);
      node = node.left;
    }
  }
  next() {
    const val = this.stack.pop();
    // push left spine of right child
    return val;
  }
  hasNext() {
    return this.stack.length > 0;
  }
}`,

    java: `class BSTIterator {
    private Deque<TreeNode> stack = new ArrayDeque<>();
    public BSTIterator(TreeNode root) { pushLeft(root); }
    private void pushLeft(TreeNode node) {
        while (node != null) { stack.push(node); node = node.left; }
    }
    public int next() {
        TreeNode node = stack.pop();
        pushLeft(node.right);
        return node.val;
    }
    public boolean hasNext() { return !stack.isEmpty(); }
}`,
  },

  defaultInput: {
    tree: [7, 3, 15, null, null, 9, 20],
    calls: 5,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [7, 3, 15, null, null, 9, 20],
      placeholder: '7,3,15,null,null,9,20',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'calls',
      label: 'Number of next() calls',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'How many times to call next() on the iterator',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const callCount = Math.min((input.calls as number) || 5, 20);
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 2,
      explanation: `Initialize BST iterator on tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Push left spine of root onto stack.`,
      variables: { stack: '[]' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    // Simulate the iterator by collecting sorted values
    const inorderVals: number[] = [];
    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);
      inorderVals.push(tree[pos] as number);
      inorder(2 * pos + 2);
    }
    inorder(0);

    // Simulate stack-based inorder
    // Push left spine starting from root
    const stack: number[] = [];
    const visited: number[] = [];
    let returnedVals: number[] = [];

    // Build left spine positions for initial push
    function pushLeftSpine(pos: number): void {
      while (pos < tree.length && tree[pos] !== null && tree[pos] !== undefined) {
        stack.push(pos);
        pos = 2 * pos + 1;
      }
    }

    pushLeftSpine(0);

    steps.push({
      line: 4,
      explanation: `Stack initialized with left spine positions. Stack (values): [${stack.map(p => tree[p]).join(', ')}]. hasNext() = ${stack.length > 0}.`,
      variables: { stack: JSON.stringify(stack.map(p => tree[p])), hasNext: stack.length > 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(stack.map(p => [p, 'pointer'])),
      },
    });

    for (let call = 0; call < callCount && stack.length > 0; call++) {
      const topPos = stack.pop()!;
      const val = tree[topPos] as number;
      returnedVals.push(val);
      visited.push(topPos);

      steps.push({
        line: 10,
        explanation: `next() call ${call + 1}: Pop position ${topPos} (value ${val}). Return ${val}. Then push left spine of right child.`,
        variables: {
          returned: val,
          callNumber: call + 1,
          allReturned: JSON.stringify(returnedVals),
        },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visited.slice(0, -1).map(p => [p, 'visited'])),
            [topPos]: 'found',
            ...Object.fromEntries(stack.map(p => [p, 'pointer'])),
          },
        },
      });

      // Push left spine of right child
      pushLeftSpine(2 * topPos + 2);

      steps.push({
        line: 12,
        explanation: `hasNext() = ${stack.length > 0}. Stack now contains: [${stack.map(p => tree[p]).join(', ')}].`,
        variables: { hasNext: stack.length > 0, stack: JSON.stringify(stack.map(p => tree[p])) },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visited.map(p => [p, 'visited'])),
            ...Object.fromEntries(stack.map(p => [p, 'pointer'])),
          },
        },
      });
    }

    steps.push({
      line: 13,
      explanation: `Iterator demonstration complete. Values returned in order: [${returnedVals.join(', ')}].`,
      variables: { returnedValues: JSON.stringify(returnedVals) },
      visualization: {
        type: 'array',
        array: [...returnedVals],
        highlights: Object.fromEntries(returnedVals.map((_, i) => [i, 'found'])),
        labels: { 0: 'first', [returnedVals.length - 1]: 'last' },
      },
    });

    return steps;
  },
};

export default binarySearchTreeIterator;
