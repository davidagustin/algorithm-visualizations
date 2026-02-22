import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumLevelSum: AlgorithmDefinition = {
  id: 'maximum-level-sum',
  title: 'Maximum Level Sum of a Binary Tree',
  leetcodeNumber: 1161,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the smallest level number with the maximum sum. Use BFS level-order traversal to compute the sum of each level. Track the maximum sum and the corresponding level (return smallest level if tie).',
  tags: ['tree', 'bfs', 'level order', 'maximum sum', 'level sum'],

  code: {
    pseudocode: `function maxLevelSum(root):
  maxSum = -infinity
  maxLevel = 1
  level = 1
  queue = [root]
  while queue not empty:
    size = len(queue)
    levelSum = 0
    for i in range(size):
      node = dequeue(queue)
      levelSum += node.val
      if node.left: enqueue(node.left)
      if node.right: enqueue(node.right)
    if levelSum > maxSum:
      maxSum = levelSum
      maxLevel = level
    level++
  return maxLevel`,

    python: `def maxLevelSum(self, root):
    from collections import deque
    max_sum = float('-inf')
    max_level = 1
    level = 1
    queue = deque([root])
    while queue:
        level_sum = 0
        for _ in range(len(queue)):
            node = queue.popleft()
            level_sum += node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        if level_sum > max_sum:
            max_sum = level_sum
            max_level = level
        level += 1
    return max_level`,

    javascript: `function maxLevelSum(root) {
  let maxSum = -Infinity, maxLevel = 1, level = 1;
  let queue = [root];
  while (queue.length > 0) {
    let levelSum = 0;
    const nextQueue = [];
    for (const node of queue) {
      levelSum += node.val;
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }
    if (levelSum > maxSum) { maxSum = levelSum; maxLevel = level; }
    queue = nextQueue;
    level++;
  }
  return maxLevel;
}`,

    java: `public int maxLevelSum(TreeNode root) {
    int maxSum = Integer.MIN_VALUE, maxLevel = 1, level = 1;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size(), levelSum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            levelSum += node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        if (levelSum > maxSum) { maxSum = levelSum; maxLevel = level; }
        level++;
    }
    return maxLevel;
}`,
  },

  defaultInput: {
    nodes: [1, 7, 0, 7, -8, null, null],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 7, 0, 7, -8, null, null],
      placeholder: '1,7,0,7,-8,null,null',
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

    // Tree: 1(root), 7(left), 0(right), 7(LL), -8(LR)
    steps.push({
      line: 1,
      explanation: 'Initialize BFS. maxSum=-inf, maxLevel=1, level=1. Queue starts with root.',
      variables: { maxSum: '-inf', maxLevel: 1, level: 1, queue: '[1]' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 1
    steps.push({
      line: 7,
      explanation: 'Level 1: process root (val=1). levelSum=1.',
      variables: { level: 1, levelSum: 1 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 13,
      explanation: 'levelSum=1 > maxSum=-inf. Update: maxSum=1, maxLevel=1. Enqueue children: 7, 0.',
      variables: { levelSum: 1, maxSum: 1, maxLevel: 1, queue: '[7,0]' },
      visualization: makeViz({ 0: 'found', 1: 'pointer', 2: 'pointer' }),
    });

    // Level 2
    steps.push({
      line: 7,
      explanation: 'Level 2: process node 7 (levelSum=7), process node 0 (levelSum=7+0=7).',
      variables: { level: 2, levelSum: 7 },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'active' }),
    });

    steps.push({
      line: 13,
      explanation: 'levelSum=7 > maxSum=1. Update: maxSum=7, maxLevel=2. Enqueue: 7, -8.',
      variables: { levelSum: 7, maxSum: 7, maxLevel: 2, queue: '[7,-8]' },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'found', 3: 'pointer', 4: 'pointer' }),
    });

    // Level 3
    steps.push({
      line: 7,
      explanation: 'Level 3: process node 7 (levelSum=7), process node -8 (levelSum=7+(-8)=-1).',
      variables: { level: 3, levelSum: -1 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'active', 4: 'active' }),
    });

    steps.push({
      line: 13,
      explanation: 'levelSum=-1 is NOT > maxSum=7. No update. Queue is now empty.',
      variables: { levelSum: -1, maxSum: 7, maxLevel: 2, update: false },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'comparing', 4: 'comparing' }),
    });

    steps.push({
      line: 17,
      explanation: 'BFS complete. Level with maximum sum is level 2 (sum=7). Return 2.',
      variables: { result: 2, maxSum: 7, maxLevel: 2 },
      visualization: makeViz({ 0: 'sorted', 1: 'found', 2: 'found', 3: 'sorted', 4: 'sorted' }),
    });

    return steps;
  },
};

export default maximumLevelSum;
