import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumWidthOfBinaryTree: AlgorithmDefinition = {
  id: 'maximum-width-of-binary-tree',
  title: 'Maximum Width of Binary Tree',
  leetcodeNumber: 662,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the maximum width of the tree. The width of a level is defined as the length from the leftmost non-null node to the rightmost non-null node, including nulls in between. Assign index numbers to each node (left child = 2*i, right child = 2*i+1) and track min/max index per level using BFS.',
  tags: ['tree', 'bfs', 'level order', 'index numbering', 'width'],

  code: {
    pseudocode: `function widthOfBinaryTree(root):
  if root is null: return 0
  maxWidth = 0
  queue = [(root, 0)]         // (node, index)
  while queue not empty:
    size = len(queue)
    minIdx = queue[0].index
    for i in range(size):
      node, idx = queue[i]
      normalizedIdx = idx - minIdx   // prevent overflow
      if node.left:
        queue.append((node.left, 2*normalizedIdx))
      if node.right:
        queue.append((node.right, 2*normalizedIdx+1))
    levelWidth = normalizedIdx - 0 + 1
    maxWidth = max(maxWidth, levelWidth)
  return maxWidth`,

    python: `def widthOfBinaryTree(self, root):
    if not root:
        return 0
    max_width = 0
    queue = deque([(root, 0)])
    while queue:
        size = len(queue)
        min_idx = queue[0][1]
        for _ in range(size):
            node, idx = queue.popleft()
            idx -= min_idx
            if node.left:
                queue.append((node.left, 2 * idx))
            if node.right:
                queue.append((node.right, 2 * idx + 1))
        max_width = max(max_width, idx + 1)
    return max_width`,

    javascript: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  let queue = [[root, 0n]];
  while (queue.length > 0) {
    const size = queue.length;
    const minIdx = queue[0][1];
    let lastIdx = 0n;
    const nextQueue = [];
    for (let i = 0; i < size; i++) {
      const [node, idx] = queue[i];
      const normIdx = idx - minIdx;
      lastIdx = normIdx;
      if (node.left) nextQueue.push([node.left, 2n * normIdx]);
      if (node.right) nextQueue.push([node.right, 2n * normIdx + 1n]);
    }
    maxWidth = Math.max(maxWidth, Number(lastIdx) + 1);
    queue = nextQueue;
  }
  return maxWidth;
}`,

    java: `public int widthOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    int maxWidth = 0;
    Queue<Pair<TreeNode, Long>> queue = new LinkedList<>();
    queue.offer(new Pair<>(root, 0L));
    while (!queue.isEmpty()) {
        int size = queue.size();
        long minIdx = queue.peek().getValue();
        long lastIdx = 0;
        for (int i = 0; i < size; i++) {
            Pair<TreeNode, Long> pair = queue.poll();
            TreeNode node = pair.getKey();
            long idx = pair.getValue() - minIdx;
            lastIdx = idx;
            if (node.left != null) queue.offer(new Pair<>(node.left, 2 * idx));
            if (node.right != null) queue.offer(new Pair<>(node.right, 2 * idx + 1));
        }
        maxWidth = Math.max(maxWidth, (int) lastIdx + 1);
    }
    return maxWidth;
}`,
  },

  defaultInput: {
    nodes: [1, 3, 2, 5, 3, null, 9],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order, null for missing)',
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

    steps.push({
      line: 1,
      explanation: 'Initialize BFS. Assign index 0 to root. left child index = 2*i, right = 2*i+1.',
      variables: { maxWidth: 0, queue: '[(root, 0)]' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 0: root at index 0
    steps.push({
      line: 6,
      explanation: 'Level 0: only root (index 0). Width = 1. maxWidth = 1.',
      variables: { level: 0, minIdx: 0, maxIdx: 0, width: 1, maxWidth: 1 },
      visualization: makeViz({ 0: 'found' }),
    });

    // Level 1: nodes at indices computed from root
    // root has left child (node 3, index 1) and right child (node 2, index 2)
    steps.push({
      line: 7,
      explanation: 'Level 1: Enqueue children. Root left child (node 3) gets index 2*0=0, right child (node 2) gets index 2*0+1=1.',
      variables: { level: 1, queue: '[(3,0),(2,1)]' },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Level 1: minIdx=0, lastIdx=1. Width = lastIdx - minIdx + 1 = 1 - 0 + 1 = 2. maxWidth = max(1,2) = 2.',
      variables: { level: 1, minIdx: 0, lastIdx: 1, width: 2, maxWidth: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'found' }),
    });

    // Level 2: nodes 5, 3 (children of node 3), null (left of 2), 9 (right of 2)
    steps.push({
      line: 7,
      explanation: 'Level 2: node 3 (idx 0) has children: 5 at idx 0, 3 at idx 1. Node 2 (idx 1) has right child 9 at idx 3 (null left).',
      variables: { level: 2, queue: '[(5,0),(3,1),(9,3)]' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'active', 4: 'active', 6: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Level 2: minIdx=0, lastIdx=3 (node 9). Width = 3 - 0 + 1 = 4. maxWidth = max(2,4) = 4.',
      variables: { level: 2, minIdx: 0, lastIdx: 3, width: 4, maxWidth: 4 },
      visualization: makeViz({ 3: 'found', 4: 'found', 6: 'found' }),
    });

    steps.push({
      line: 16,
      explanation: 'BFS complete. Maximum width of the binary tree is 4.',
      variables: { maxWidth: 4 },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 6: 'found' }),
    });

    return steps;
  },
};

export default maximumWidthOfBinaryTree;
