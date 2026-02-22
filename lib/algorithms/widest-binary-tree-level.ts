import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const widestBinaryTreeLevel: AlgorithmDefinition = {
  id: 'widest-binary-tree-level',
  title: 'Widest Binary Tree Level',
  leetcodeNumber: 662,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the maximum width of the tree. The width of a level is the number of positions between the leftmost and rightmost non-null nodes (including null nodes in between). We use BFS with position indices: left child = 2*pos+1, right child = 2*pos+2.',
  tags: ['Tree', 'BFS'],
  code: {
    pseudocode: `function widthOfBinaryTree(root):
  if root is null: return 0
  maxWidth = 0
  queue = [(root, 0)]
  while queue is not empty:
    levelSize = queue.length
    first = queue[0].position
    last = first
    for i from 0 to levelSize-1:
      (node, pos) = queue.dequeue()
      last = pos
      if node.left: queue.enqueue((node.left, 2*pos+1))
      if node.right: queue.enqueue((node.right, 2*pos+2))
    maxWidth = max(maxWidth, last - first + 1)
  return maxWidth`,
    python: `def widthOfBinaryTree(root):
    if not root:
        return 0
    max_width = 0
    queue = deque([(root, 0)])
    while queue:
        level_size = len(queue)
        first = queue[0][1]
        for i in range(level_size):
            node, pos = queue.popleft()
            last = pos
            if node.left:
                queue.append((node.left, 2 * pos + 1))
            if node.right:
                queue.append((node.right, 2 * pos + 2))
        max_width = max(max_width, last - first + 1)
    return max_width`,
    javascript: `function widthOfBinaryTree(root) {
  if (!root) return 0;
  let maxWidth = 0;
  const queue = [[root, 0n]];
  while (queue.length > 0) {
    const levelSize = queue.length;
    const first = queue[0][1];
    let last = first;
    for (let i = 0; i < levelSize; i++) {
      const [node, pos] = queue.shift();
      last = pos;
      if (node.left) queue.push([node.left, 2n*pos+1n]);
      if (node.right) queue.push([node.right, 2n*pos+2n]);
    }
    maxWidth = Math.max(maxWidth, Number(last - first) + 1);
  }
  return maxWidth;
}`,
    java: `public int widthOfBinaryTree(TreeNode root) {
    if (root == null) return 0;
    int maxWidth = 0;
    Queue<Pair<TreeNode,Integer>> queue = new LinkedList<>();
    queue.offer(new Pair<>(root, 0));
    while (!queue.isEmpty()) {
        int size = queue.size();
        int first = queue.peek().getValue();
        int last = first;
        for (int i = 0; i < size; i++) {
            var pair = queue.poll();
            TreeNode node = pair.getKey();
            int pos = pair.getValue();
            last = pos;
            if (node.left != null) queue.offer(new Pair<>(node.left, 2*pos+1));
            if (node.right != null) queue.offer(new Pair<>(node.right, 2*pos+2));
        }
        maxWidth = Math.max(maxWidth, last - first + 1);
    }
    return maxWidth;
}`,
  },
  defaultInput: { tree: [1, 3, 2, 5, 3, null, 9] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 3, 2, 5, 3, null, 9],
      placeholder: 'e.g. 1,3,2,5,3,null,9',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function makeViz(levelIndices: number[], highlight: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const li of levelIndices) {
        if (li < tree.length && tree[li] != null) {
          highlights[li] = 'active';
        }
      }
      for (const [k, v] of Object.entries(highlight)) {
        highlights[Number(k)] = v;
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty. Maximum width is 0.',
        variables: { maxWidth: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start width calculation with BFS. Root = ${tree[0]}. We track position indices to compute width.`,
      variables: { root: tree[0] },
      visualization: makeViz([0]),
    });

    // BFS: queue entries are [treeIndex, position]
    let queue: [number, number][] = [[0, 0]];
    let maxWidth = 0;
    let maxLevel = -1;
    let level = 0;

    while (queue.length > 0) {
      const levelSize = queue.length;
      const firstPos = queue[0][1];
      let lastPos = firstPos;
      const levelTreeIndices = queue.map(([ti]) => ti);

      steps.push({
        line: 5,
        explanation: `Level ${level}: ${levelSize} node(s). Positions range starting at ${firstPos}.`,
        variables: { level, levelSize, firstPos },
        visualization: makeViz(levelTreeIndices),
      });

      const nextQueue: [number, number][] = [];

      for (let i = 0; i < levelSize; i++) {
        const [treeIdx, pos] = queue[i];
        lastPos = pos;

        const leftIdx = 2 * treeIdx + 1;
        const rightIdx = 2 * treeIdx + 2;

        if (leftIdx < tree.length && tree[leftIdx] != null) {
          nextQueue.push([leftIdx, 2 * pos + 1]);
        }
        if (rightIdx < tree.length && tree[rightIdx] != null) {
          nextQueue.push([rightIdx, 2 * pos + 2]);
        }
      }

      const width = lastPos - firstPos + 1;
      const prevMax = maxWidth;
      if (width > maxWidth) {
        maxWidth = width;
        maxLevel = level;
      }

      const widestHighlights: Record<number, string> = {};
      for (const ti of levelTreeIndices) {
        widestHighlights[ti] = width === maxWidth && width > prevMax ? 'found' : 'active';
      }

      steps.push({
        line: 13,
        explanation: `Level ${level}: width = ${lastPos} - ${firstPos} + 1 = ${width}. Max width so far = ${maxWidth}${width > prevMax ? ' (new max!)' : ''}.`,
        variables: { level, firstPos, lastPos, width, maxWidth },
        visualization: makeViz([], widestHighlights),
      });

      queue = nextQueue;
      level++;
    }

    steps.push({
      line: 14,
      explanation: `BFS complete. Maximum width = ${maxWidth} (found at level ${maxLevel}).`,
      variables: { maxWidth, maxLevel },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default widestBinaryTreeLevel;
