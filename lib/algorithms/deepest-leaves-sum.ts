import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const deepestLeavesSum: AlgorithmDefinition = {
  id: 'deepest-leaves-sum',
  title: 'Deepest Leaves Sum',
  leetcodeNumber: 1302,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the sum of values of its deepest leaves. Use BFS level-order traversal: at each level, compute the sum of all nodes. The last level processed gives the sum of the deepest leaves. Alternatively, use DFS tracking max depth.',
  tags: ['tree', 'bfs', 'dfs', 'deepest leaves', 'sum', 'level order'],

  code: {
    pseudocode: `function deepestLeavesSum(root):
  queue = [root]
  lastLevelSum = 0
  while queue not empty:
    size = len(queue)
    lastLevelSum = 0
    for i in range(size):
      node = dequeue(queue)
      lastLevelSum += node.val
      if node.left: enqueue(node.left)
      if node.right: enqueue(node.right)
  return lastLevelSum`,

    python: `def deepestLeavesSum(self, root):
    from collections import deque
    queue = deque([root])
    last_sum = 0
    while queue:
        last_sum = 0
        for _ in range(len(queue)):
            node = queue.popleft()
            last_sum += node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    return last_sum`,

    javascript: `function deepestLeavesSum(root) {
  let queue = [root];
  let lastLevelSum = 0;
  while (queue.length > 0) {
    lastLevelSum = 0;
    const nextQueue = [];
    for (const node of queue) {
      lastLevelSum += node.val;
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }
    queue = nextQueue;
  }
  return lastLevelSum;
}`,

    java: `public int deepestLeavesSum(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int lastSum = 0;
    while (!queue.isEmpty()) {
        lastSum = 0;
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            lastSum += node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return lastSum;
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, 8],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, 8],
      placeholder: '1,2,3,4,5,null,6,7,null,null,null,null,8',
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

    steps.push({
      line: 1,
      explanation: 'Initialize BFS queue with root (val=1). lastLevelSum tracks sum of current level.',
      variables: { queue: '[1]', lastLevelSum: 0 },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 0
    steps.push({
      line: 5,
      explanation: 'Level 0: sum=1. Enqueue children: 2, 3.',
      variables: { level: 0, lastLevelSum: 1 },
      visualization: makeViz({ 0: 'current' }),
    });

    // Level 1
    steps.push({
      line: 5,
      explanation: 'Level 1: sum=2+3=5. Enqueue children: 4, 5, 6.',
      variables: { level: 1, lastLevelSum: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'active' }),
    });

    // Level 2
    steps.push({
      line: 5,
      explanation: 'Level 2: nodes [4, 5, 6]. sum=4+5+6=15. Enqueue children: 7 (from 4), 8 (from 6).',
      variables: { level: 2, lastLevelSum: 15 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'active', 4: 'active', 6: 'active' }),
    });

    // Level 3
    steps.push({
      line: 5,
      explanation: 'Level 3: nodes [7, 8]. These are leaves (no children). sum=7+8=15.',
      variables: { level: 3, lastLevelSum: 15 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'visited', 4: 'visited', 6: 'visited', 7: 'active', 12: 'active' }),
    });

    steps.push({
      line: 10,
      explanation: 'Queue is empty after level 3. lastLevelSum=15 is the sum of the deepest leaves (7 and 8).',
      variables: { deepestLeaves: '[7,8]', lastLevelSum: 15 },
      visualization: makeViz({ 7: 'found', 12: 'found', 0: 'sorted', 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'sorted', 6: 'sorted' }),
    });

    steps.push({
      line: 11,
      explanation: 'Return 15. The sum of the deepest leaves is 15.',
      variables: { result: 15 },
      visualization: makeViz({ 7: 'found', 12: 'found' }),
    });

    return steps;
  },
};

export default deepestLeavesSum;
