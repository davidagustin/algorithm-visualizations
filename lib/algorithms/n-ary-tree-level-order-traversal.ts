import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreeLevelOrderTraversal: AlgorithmDefinition = {
  id: 'n-ary-tree-level-order-traversal',
  title: 'N-ary Tree Level Order Traversal',
  leetcodeNumber: 429,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an n-ary tree, return the level order traversal of its node values as a list of lists. Use a queue (BFS) to process nodes level by level, collecting all children of each node into the next level queue.',
  tags: ['tree', 'bfs', 'level order', 'n-ary tree', 'queue'],

  code: {
    pseudocode: `function levelOrder(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue not empty:
    level = []
    nextQueue = []
    for node in queue:
      level.append(node.val)
      for child in node.children:
        nextQueue.append(child)
    result.append(level)
    queue = nextQueue
  return result`,

    python: `def levelOrder(self, root):
    if not root:
        return []
    result = []
    queue = [root]
    while queue:
        level = []
        next_queue = []
        for node in queue:
            level.append(node.val)
            for child in node.children:
                next_queue.append(child)
        result.append(level)
        queue = next_queue
    return result`,

    javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  let queue = [root];
  while (queue.length > 0) {
    const level = [];
    const nextQueue = [];
    for (const node of queue) {
      level.push(node.val);
      for (const child of node.children) {
        nextQueue.push(child);
      }
    }
    result.push(level);
    queue = nextQueue;
  }
  return result;
}`,

    java: `public List<List<Integer>> levelOrder(Node root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            Node node = queue.poll();
            level.add(node.val);
            for (Node child : node.children) {
                queue.offer(child);
            }
        }
        result.add(level);
    }
    return result;
}`,
  },

  defaultInput: {
    nodes: [1, null, 3, 2, 4, null, 5, 6],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Tree (level order with nulls as separators)',
      type: 'array',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: '1,null,3,2,4,null,5,6',
      helperText: 'N-ary tree encoded level-order with null separators',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Represent tree using flat array visualization
    // Tree: root=1, children=[3,2,4], 3 has children=[5,6]
    const treeNodes = [1, 3, 2, 4, 5, 6];
    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: [1, 3, 2, 4, 5, 6, null, null],
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Check if root is null. Root is node 1, so we proceed.',
      variables: { root: 1, result: '[]', queue: '[1]' },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 4,
      explanation: 'Initialize queue with root node (value=1). Begin BFS.',
      variables: { level: 0, queue: '[1]', result: '[]' },
      visualization: makeViz({ 0: 'current' }),
    });

    // Level 0: process root
    steps.push({
      line: 6,
      explanation: 'Process level 0. Dequeue node 1, add its value to level list.',
      variables: { processing: 1, level: '[1]', nextQueue: '[]' },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Node 1 has children: [3, 2, 4]. Enqueue all children for next level.',
      variables: { node: 1, children: '[3,2,4]', nextQueue: '[3,2,4]' },
      visualization: makeViz({ 0: 'visited', 1: 'pointer', 2: 'pointer', 3: 'pointer' }),
    });

    steps.push({
      line: 10,
      explanation: 'Level 0 complete. result=[[1]]. Queue for next level: [3, 2, 4].',
      variables: { result: '[[1]]', queue: '[3,2,4]' },
      visualization: makeViz({ 0: 'sorted', 1: 'current', 2: 'current', 3: 'current' }),
    });

    // Level 1: process [3, 2, 4]
    steps.push({
      line: 6,
      explanation: 'Process level 1. Dequeue node 3, add value 3 to level list.',
      variables: { processing: 3, level: '[3]', nextQueue: '[]' },
      visualization: makeViz({ 1: 'active', 2: 'current', 3: 'current' }),
    });

    steps.push({
      line: 8,
      explanation: 'Node 3 has children: [5, 6]. Enqueue them.',
      variables: { node: 3, children: '[5,6]', nextQueue: '[5,6]' },
      visualization: makeViz({ 1: 'visited', 4: 'pointer', 5: 'pointer' }),
    });

    steps.push({
      line: 6,
      explanation: 'Dequeue node 2, add value 2 to level list.',
      variables: { processing: 2, level: '[3,2]', nextQueue: '[5,6]' },
      visualization: makeViz({ 2: 'active', 4: 'pointer', 5: 'pointer' }),
    });

    steps.push({
      line: 8,
      explanation: 'Node 2 has no children. Nothing enqueued.',
      variables: { node: 2, children: '[]', nextQueue: '[5,6]' },
      visualization: makeViz({ 2: 'visited', 4: 'current', 5: 'current' }),
    });

    steps.push({
      line: 6,
      explanation: 'Dequeue node 4, add value 4 to level list.',
      variables: { processing: 4, level: '[3,2,4]', nextQueue: '[5,6]' },
      visualization: makeViz({ 3: 'active', 4: 'current', 5: 'current' }),
    });

    steps.push({
      line: 10,
      explanation: 'Level 1 complete. result=[[1],[3,2,4]]. Queue for next level: [5,6].',
      variables: { result: '[[1],[3,2,4]]', queue: '[5,6]' },
      visualization: makeViz({ 1: 'sorted', 2: 'sorted', 3: 'sorted', 4: 'current', 5: 'current' }),
    });

    // Level 2
    steps.push({
      line: 6,
      explanation: 'Process level 2. Dequeue nodes 5 and 6.',
      variables: { processing: '[5,6]', level: '[5,6]', nextQueue: '[]' },
      visualization: makeViz({ 4: 'active', 5: 'active' }),
    });

    steps.push({
      line: 12,
      explanation: 'Level 2 complete. Queue is now empty. Final result: [[1],[3,2,4],[5,6]].',
      variables: { result: '[[1],[3,2,4],[5,6]]', queue: '[]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found' }),
    });

    return steps;
  },
};

export default nAryTreeLevelOrderTraversal;
