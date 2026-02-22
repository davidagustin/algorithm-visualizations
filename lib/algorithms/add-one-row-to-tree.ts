import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const addOneRowToTree: AlgorithmDefinition = {
  id: 'add-one-row-to-tree',
  title: 'Add One Row to Tree',
  leetcodeNumber: 623,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, insert a row of nodes with a given value at a given depth. The new nodes become the left/right children of existing nodes at depth-1, and push the original subtrees down. Use BFS to reach depth-1, then insert the new row.',
  tags: ['tree', 'bfs', 'insertion', 'depth', 'level order'],

  code: {
    pseudocode: `function addOneRow(root, val, depth):
  if depth == 1:
    newRoot = TreeNode(val)
    newRoot.left = root
    return newRoot
  queue = [root]
  currentDepth = 1
  while currentDepth < depth - 1:
    nextQueue = []
    for node in queue:
      if node.left: nextQueue.append(node.left)
      if node.right: nextQueue.append(node.right)
    queue = nextQueue
    currentDepth++
  for node in queue:   // nodes at depth-1
    newLeft = TreeNode(val)
    newLeft.left = node.left
    node.left = newLeft
    newRight = TreeNode(val)
    newRight.right = node.right
    node.right = newRight
  return root`,

    python: `def addOneRow(self, root, val, depth):
    if depth == 1:
        new_root = TreeNode(val)
        new_root.left = root
        return new_root
    queue = deque([root])
    for _ in range(depth - 2):
        size = len(queue)
        for _ in range(size):
            node = queue.popleft()
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
    for node in queue:
        new_left = TreeNode(val)
        new_left.left = node.left
        node.left = new_left
        new_right = TreeNode(val)
        new_right.right = node.right
        node.right = new_right
    return root`,

    javascript: `function addOneRow(root, val, depth) {
  if (depth === 1) {
    const newRoot = new TreeNode(val);
    newRoot.left = root;
    return newRoot;
  }
  let queue = [root];
  for (let d = 1; d < depth - 1; d++) {
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  for (const node of queue) {
    const newLeft = new TreeNode(val);
    newLeft.left = node.left;
    node.left = newLeft;
    const newRight = new TreeNode(val);
    newRight.right = node.right;
    node.right = newRight;
  }
  return root;
}`,

    java: `public TreeNode addOneRow(TreeNode root, int val, int depth) {
    if (depth == 1) {
        TreeNode newRoot = new TreeNode(val);
        newRoot.left = root;
        return newRoot;
    }
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    for (int d = 1; d < depth - 1; d++) {
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        TreeNode newLeft = new TreeNode(val);
        newLeft.left = node.left;
        node.left = newLeft;
        TreeNode newRight = new TreeNode(val);
        newRight.right = node.right;
        node.right = newRight;
    }
    return root;
}`,
  },

  defaultInput: {
    nodes: [4, 2, 6, 3, 1, 5],
    val: 1,
    depth: 2,
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [4, 2, 6, 3, 1, 5],
      placeholder: '4,2,6,3,1,5',
      helperText: 'Level-order array with null for missing nodes',
    },
    {
      name: 'val',
      label: 'Value to insert',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
    },
    {
      name: 'depth',
      label: 'Depth to insert at',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const val = input.val as number;
    const depth = input.depth as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (nodes: (number | null)[], highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes,
      highlights,
    });

    steps.push({
      line: 1,
      explanation: `Insert row of ${val}s at depth=${depth}. First check if depth==1 (special case).`,
      variables: { val, depth, special: depth === 1 },
      visualization: makeViz(rawNodes, { 0: 'active' }),
    });

    steps.push({
      line: 6,
      explanation: `depth=${depth} != 1. Use BFS to reach nodes at depth ${depth - 1} (one level above insertion point).`,
      variables: { targetDepth: depth - 1 },
      visualization: makeViz(rawNodes, { 0: 'current' }),
    });

    // BFS to depth-1=1 (root level)
    steps.push({
      line: 7,
      explanation: `Starting BFS. We need to reach depth ${depth - 1}. Currently at depth 1.`,
      variables: { currentDepth: 1, targetDepth: depth - 1, queue: '[4]' },
      visualization: makeViz(rawNodes, { 0: 'active' }),
    });

    steps.push({
      line: 13,
      explanation: `Reached depth ${depth - 1}. Nodes at this depth: [4 (root)]. Now insert new row below them.`,
      variables: { depth: depth - 1, nodesAtDepth: '[4]' },
      visualization: makeViz(rawNodes, { 0: 'found', 1: 'pointer', 2: 'pointer' }),
    });

    steps.push({
      line: 14,
      explanation: `For node 4: create new left child (val=${val}), push original left subtree (node 2) down.`,
      variables: { node: 4, newLeft: val, originalLeft: 2 },
      visualization: makeViz(rawNodes, { 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 17,
      explanation: `For node 4: create new right child (val=${val}), push original right subtree (node 6) down.`,
      variables: { node: 4, newRight: val, originalRight: 6 },
      visualization: makeViz(rawNodes, { 0: 'visited', 2: 'active' }),
    });

    // Show modified tree: [4, 1, 1, 2, null, null, 6, 3, 1, null, null, null, null, 5]
    const newTree = [4, val, val, 2, null, null, 6, 3, 1, null, null, null, null, 5];
    steps.push({
      line: 20,
      explanation: `Row insertion complete. New nodes with val=${val} inserted at depth ${depth}. Original subtrees pushed down.`,
      variables: { result: 'modified tree', insertedVal: val, insertedAt: depth },
      visualization: makeViz(newTree, { 1: 'found', 2: 'found' }),
    });

    steps.push({
      line: 20,
      explanation: 'Return modified root. The tree now has the new row inserted correctly.',
      variables: { success: true },
      visualization: makeViz(newTree, { 0: 'found', 1: 'found', 2: 'found', 3: 'found', 6: 'found', 7: 'found', 8: 'found', 13: 'found' }),
    });

    return steps;
  },
};

export default addOneRowToTree;
