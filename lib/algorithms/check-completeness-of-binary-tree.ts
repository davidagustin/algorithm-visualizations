import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const checkCompletenessOfBinaryTree: AlgorithmDefinition = {
  id: 'check-completeness-of-binary-tree',
  title: 'Check Completeness of a Binary Tree',
  leetcodeNumber: 958,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, determine if it is a complete binary tree. In a complete binary tree, every level except possibly the last is completely filled, and all nodes in the last level are as far left as possible. Use BFS: once a null is encountered, no more non-null nodes should appear.',
  tags: ['tree', 'bfs', 'completeness', 'level order', 'queue'],

  code: {
    pseudocode: `function isCompleteTree(root):
  if root is null: return true
  queue = [root]
  seenNull = false
  while queue not empty:
    node = dequeue(queue)
    if node is null:
      seenNull = true
    else:
      if seenNull: return false  // non-null after null
      enqueue(node.left)
      enqueue(node.right)
  return true`,

    python: `def isCompleteTree(self, root):
    from collections import deque
    if not root:
        return True
    queue = deque([root])
    seen_null = False
    while queue:
        node = queue.popleft()
        if node is None:
            seen_null = True
        else:
            if seen_null:
                return False
            queue.append(node.left)
            queue.append(node.right)
    return True`,

    javascript: `function isCompleteTree(root) {
  if (!root) return true;
  const queue = [root];
  let seenNull = false;
  while (queue.length > 0) {
    const node = queue.shift();
    if (node === null) {
      seenNull = true;
    } else {
      if (seenNull) return false;
      queue.push(node.left);
      queue.push(node.right);
    }
  }
  return true;
}`,

    java: `public boolean isCompleteTree(TreeNode root) {
    if (root == null) return true;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean seenNull = false;
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        if (node == null) {
            seenNull = true;
        } else {
            if (seenNull) return false;
            queue.offer(node.left);
            queue.offer(node.right);
        }
    }
    return true;
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Level-order array; null means missing node',
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

    // Tree: [1,2,3,4,5,6] is complete
    steps.push({
      line: 2,
      explanation: 'Initialize BFS queue with root node 1. seenNull=false.',
      variables: { queue: '[1]', seenNull: false },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 1. Not null and seenNull=false. Enqueue children: 2 (left) and 3 (right).',
      variables: { node: 1, seenNull: false, queue: '[2,3]' },
      visualization: makeViz({ 0: 'found', 1: 'pointer', 2: 'pointer' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 2. Not null and seenNull=false. Enqueue children: 4 (left) and 5 (right).',
      variables: { node: 2, seenNull: false, queue: '[3,4,5]' },
      visualization: makeViz({ 0: 'visited', 1: 'found', 3: 'pointer', 4: 'pointer' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 3. Not null and seenNull=false. Enqueue children: 6 (left) and null (right, missing).',
      variables: { node: 3, seenNull: false, queue: '[4,5,6,null]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'found', 5: 'pointer' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 4. Not null and seenNull=false. Enqueue null (left) and null (right).',
      variables: { node: 4, seenNull: false, queue: '[5,6,null,null,null]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 5. Not null and seenNull=false. Enqueue null, null.',
      variables: { node: 5, seenNull: false, queue: '[6,null,null,null,null]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'sorted', 4: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'Dequeue node 6. Not null and seenNull=false. Enqueue null, null.',
      variables: { node: 6, seenNull: false, queue: '[null,null,null,null,null]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'sorted', 4: 'sorted', 5: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: 'Dequeue null. Set seenNull=true. Continue draining the queue.',
      variables: { node: null, seenNull: true, queue: '[null,null,null,null]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'sorted', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 7,
      explanation: 'All remaining dequeued values are null. seenNull=true, but no non-null found after it.',
      variables: { seenNull: true, nonNullAfterNull: false },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'sorted', 4: 'sorted', 5: 'sorted' }),
    });

    steps.push({
      line: 12,
      explanation: 'Queue empty. No non-null node appeared after a null. Tree is COMPLETE. Return true.',
      variables: { result: true },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found' }),
    });

    return steps;
  },
};

export default checkCompletenessOfBinaryTree;
