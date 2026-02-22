import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const averageOfLevels: AlgorithmDefinition = {
  id: 'average-of-levels',
  title: 'Average of Levels in Binary Tree',
  leetcodeNumber: 637,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the average value of the nodes on each level as an array. Use BFS level-order traversal: for each level compute the sum of all node values and divide by the count of nodes at that level.',
  tags: ['tree', 'bfs', 'level order', 'average', 'sum'],

  code: {
    pseudocode: `function averageOfLevels(root):
  result = []
  queue = [root]
  while queue not empty:
    size = len(queue)
    levelSum = 0
    for i in range(size):
      node = dequeue(queue)
      levelSum += node.val
      if node.left: enqueue(node.left)
      if node.right: enqueue(node.right)
    result.append(levelSum / size)
  return result`,

    python: `def averageOfLevels(self, root):
    from collections import deque
    result = []
    queue = deque([root])
    while queue:
        size = len(queue)
        level_sum = 0
        for _ in range(size):
            node = queue.popleft()
            level_sum += node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level_sum / size)
    return result`,

    javascript: `function averageOfLevels(root) {
  const result = [];
  let queue = [root];
  while (queue.length > 0) {
    const size = queue.length;
    let levelSum = 0;
    const nextQueue = [];
    for (const node of queue) {
      levelSum += node.val;
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }
    result.push(levelSum / size);
    queue = nextQueue;
  }
  return result;
}`,

    java: `public double[] averageOfLevels(TreeNode root) {
    List<Double> result = new ArrayList<>();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        double levelSum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            levelSum += node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(levelSum / size);
    }
    return result.stream().mapToDouble(d -> d).toArray();
}`,
  },

  defaultInput: {
    nodes: [3, 9, 20, null, null, 15, 7],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: '3,9,20,null,null,15,7',
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

    // Tree: 3(root), 9(left), 20(right), 15(left of 20), 7(right of 20)
    steps.push({
      line: 2,
      explanation: 'Initialize BFS. Queue starts with root (val=3).',
      variables: { queue: '[3]', result: '[]' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 0
    steps.push({
      line: 5,
      explanation: 'Level 0: size=1. Process node 3. levelSum=3.',
      variables: { level: 0, size: 1, levelSum: 3, node: 3 },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 11,
      explanation: 'Level 0 average = 3 / 1 = 3.0. Append to result. Enqueue children: 9, 20.',
      variables: { result: '[3.0]', average: 3.0, queue: '[9,20]' },
      visualization: makeViz({ 0: 'found', 1: 'pointer', 2: 'pointer' }),
    });

    // Level 1
    steps.push({
      line: 5,
      explanation: 'Level 1: size=2. Process node 9: levelSum=9.',
      variables: { level: 1, size: 2, levelSum: 9, node: 9 },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'current' }),
    });

    steps.push({
      line: 8,
      explanation: 'Process node 20: levelSum=9+20=29.',
      variables: { level: 1, levelSum: 29, node: 20 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 11,
      explanation: 'Level 1 average = 29 / 2 = 14.5. Append to result. Enqueue: 15, 7.',
      variables: { result: '[3.0,14.5]', average: 14.5, queue: '[15,7]' },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'found', 5: 'pointer', 6: 'pointer' }),
    });

    // Level 2
    steps.push({
      line: 5,
      explanation: 'Level 2: size=2. Process node 15: levelSum=15.',
      variables: { level: 2, size: 2, levelSum: 15, node: 15 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'sorted', 5: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Process node 7: levelSum=15+7=22.',
      variables: { level: 2, levelSum: 22, node: 7 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'sorted', 5: 'sorted', 6: 'active' }),
    });

    steps.push({
      line: 11,
      explanation: 'Level 2 average = 22 / 2 = 11.0. Append to result. Queue is now empty.',
      variables: { result: '[3.0,14.5,11.0]', average: 11.0 },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 5: 'found', 6: 'found' }),
    });

    steps.push({
      line: 12,
      explanation: 'BFS complete. Average of each level: [3.0, 14.5, 11.0].',
      variables: { result: '[3.0,14.5,11.0]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 5: 'found', 6: 'found' }),
    });

    return steps;
  },
};

export default averageOfLevels;
