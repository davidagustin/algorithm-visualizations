import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const largestValuesInTreeRows: AlgorithmDefinition = {
  id: 'largest-values-in-tree-rows',
  title: 'Find Largest Value in Each Tree Row',
  leetcodeNumber: 515,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return an array of the largest value in each row. Use BFS level-order traversal: for each level, track the maximum value among all nodes at that level and collect it into the result array.',
  tags: ['tree', 'bfs', 'level order', 'maximum', 'row maximum'],

  code: {
    pseudocode: `function largestValues(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue not empty:
    size = len(queue)
    levelMax = -infinity
    for i in range(size):
      node = dequeue(queue)
      levelMax = max(levelMax, node.val)
      if node.left: enqueue(node.left)
      if node.right: enqueue(node.right)
    result.append(levelMax)
  return result`,

    python: `def largestValues(self, root):
    from collections import deque
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_max = float('-inf')
        for _ in range(len(queue)):
            node = queue.popleft()
            level_max = max(level_max, node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level_max)
    return result`,

    javascript: `function largestValues(root) {
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length > 0) {
    let levelMax = -Infinity;
    const nextQueue = [];
    for (const node of queue) {
      levelMax = Math.max(levelMax, node.val);
      if (node.left) nextQueue.push(node.left);
      if (node.right) nextQueue.push(node.right);
    }
    result.push(levelMax);
    queue = nextQueue;
  }
  return result;
}`,

    java: `public List<Integer> largestValues(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        int levelMax = Integer.MIN_VALUE;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            levelMax = Math.max(levelMax, node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(levelMax);
    }
    return result;
}`,
  },

  defaultInput: {
    nodes: [1, 3, 2, 5, 3, null, 9],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 3, 2, 5, 3, null, 9],
      placeholder: '1,3,2,5,3,null,9',
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

    // Tree: 1(root), 3(left), 2(right), 5(left-left), 3(left-right), null, 9(right-right)
    steps.push({
      line: 2,
      explanation: 'Initialize BFS queue with root (val=1). result=[].',
      variables: { queue: '[1]', result: '[]' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 0
    steps.push({
      line: 7,
      explanation: 'Level 0: only root. levelMax=-inf. Check node 1: levelMax=max(-inf,1)=1.',
      variables: { level: 0, levelMax: 1, node: 1 },
      visualization: makeViz({ 0: 'found' }),
    });

    steps.push({
      line: 12,
      explanation: 'Level 0 done. Append max=1 to result. Enqueue children: 3, 2.',
      variables: { result: '[1]', queue: '[3,2]' },
      visualization: makeViz({ 0: 'sorted', 1: 'pointer', 2: 'pointer' }),
    });

    // Level 1
    steps.push({
      line: 7,
      explanation: 'Level 1: nodes [3, 2]. Check node 3: levelMax=3.',
      variables: { level: 1, levelMax: 3, node: 3 },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'current' }),
    });

    steps.push({
      line: 8,
      explanation: 'Check node 2: levelMax=max(3,2)=3. Node 3 is still the max.',
      variables: { level: 1, levelMax: 3, node: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'comparing' }),
    });

    steps.push({
      line: 12,
      explanation: 'Level 1 done. Append max=3. Enqueue children: 5, 3 (from node 3), 9 (from node 2).',
      variables: { result: '[1,3]', queue: '[5,3,9]' },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'sorted', 3: 'pointer', 4: 'pointer', 6: 'pointer' }),
    });

    // Level 2
    steps.push({
      line: 7,
      explanation: 'Level 2: nodes [5, 3, 9]. Check node 5: levelMax=5.',
      variables: { level: 2, levelMax: 5, node: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Check node 3: levelMax=max(5,3)=5. Check node 9: levelMax=max(5,9)=9.',
      variables: { level: 2, levelMax: 9, comparing: '[5,3,9]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'comparing', 4: 'comparing', 6: 'found' }),
    });

    steps.push({
      line: 12,
      explanation: 'Level 2 done. Append max=9 to result. Queue empty.',
      variables: { result: '[1,3,9]', queue: '[]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 6: 'found' }),
    });

    steps.push({
      line: 13,
      explanation: 'BFS complete. Largest value in each row: [1, 3, 9].',
      variables: { result: '[1,3,9]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 6: 'found' }),
    });

    return steps;
  },
};

export default largestValuesInTreeRows;
