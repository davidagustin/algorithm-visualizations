import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const findBottomLeftTreeValue: AlgorithmDefinition = {
  id: 'find-bottom-left-tree-value',
  title: 'Find Bottom Left Tree Value',
  leetcodeNumber: 513,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the leftmost value in the last row of the tree. Use BFS level-order traversal: process each level left to right, and the first node of the last level processed is the answer. Alternatively, use DFS tracking depth.',
  tags: ['tree', 'bfs', 'level order', 'leftmost', 'bottom left'],

  code: {
    pseudocode: `function findBottomLeftValue(root):
  queue = [root]
  result = root.val
  while queue not empty:
    size = len(queue)
    result = queue[0].val    // first of each level
    for i in range(size):
      node = dequeue(queue)
      if node.left: enqueue(node.left)
      if node.right: enqueue(node.right)
  return result`,

    python: `def findBottomLeftValue(self, root):
    from collections import deque
    queue = deque([root])
    result = 0
    while queue:
        result = queue[0].val
        for _ in range(len(queue)):
            node = queue.popleft()
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return result`,

    javascript: `function findBottomLeftValue(root) {
  let queue = [root];
  let result = 0;
  while (queue.length > 0) {
    result = queue[0].val;
    const nextQueue = [];
    for (const node of queue) {
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }
    queue = nextQueue;
  }
  return result;
}`,

    java: `public int findBottomLeftValue(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int result = 0;
    while (!queue.isEmpty()) {
        result = queue.peek().val;
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nodes: [2, 1, 3],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [2, 1, 3],
      placeholder: '2,1,3',
      helperText: 'Level-order array with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    // Tree: 2(root), 1(left), 3(right)
    // Bottom left: 1
    steps.push({
      line: 1,
      explanation: 'Initialize BFS queue with root node (val=2). result starts as root value.',
      variables: { queue: '[2]', result: 2 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Level 0: first node of queue is 2. Update result=2 (leftmost at this level).',
      variables: { level: 0, result: 2, levelFirst: 2 },
      visualization: makeViz({ 0: 'current' }),
    });

    steps.push({
      line: 6,
      explanation: 'Process level 0. Enqueue children of node 2: left=1, right=3.',
      variables: { node: 2, queue: '[1,3]' },
      visualization: makeViz({ 0: 'visited', 1: 'pointer', 2: 'pointer' }),
    });

    steps.push({
      line: 4,
      explanation: 'Level 1: first node of queue is 1. Update result=1 (leftmost at this level).',
      variables: { level: 1, result: 1, levelFirst: 1 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'current' }),
    });

    steps.push({
      line: 6,
      explanation: 'Process node 1: no children. Process node 3: no children. Queue is now empty.',
      variables: { node: '[1,3]', queue: '[]' },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'visited' }),
    });

    steps.push({
      line: 9,
      explanation: 'Queue is empty. The last value of result was the first (leftmost) node of the last level. Return 1.',
      variables: { result: 1, lastLevel: '[1,3]', leftmost: 1 },
      visualization: makeViz({ 0: 'sorted', 1: 'found', 2: 'sorted' }),
    });

    return steps;
  },
};

export default findBottomLeftTreeValue;
