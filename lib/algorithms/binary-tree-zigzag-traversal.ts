import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeZigzagTraversal: AlgorithmDefinition = {
  id: 'binary-tree-zigzag-traversal',
  title: 'Binary Tree Zigzag Level Order Traversal',
  leetcodeNumber: 103,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the zigzag level order traversal of its nodes\' values. In zigzag traversal, odd levels go left-to-right and even levels go right-to-left (or vice versa). We use BFS and alternate the direction of each level.',
  tags: ['Tree', 'BFS', 'Queue'],
  code: {
    pseudocode: `function zigzagLevelOrder(root):
  if root is null: return []
  result = [], queue = [root], leftToRight = true
  while queue is not empty:
    size = queue.length, level = []
    for i in 0..size-1:
      node = queue.dequeue()
      if leftToRight: level.append(node.val)
      else: level.prepend(node.val)
      if node.left: queue.enqueue(node.left)
      if node.right: queue.enqueue(node.right)
    result.append(level)
    leftToRight = !leftToRight
  return result`,
    python: `def zigzagLevelOrder(root):
    if not root:
        return []
    result, queue, left_to_right = [], [root], True
    while queue:
        size, level = len(queue), []
        for _ in range(size):
            node = queue.pop(0)
            if left_to_right:
                level.append(node.val)
            else:
                level.insert(0, node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
        left_to_right = not left_to_right
    return result`,
    javascript: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const size = queue.length, level = [];
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (leftToRight) level.push(node.val);
      else level.unshift(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
    leftToRight = !leftToRight;
  }
  return result;
}`,
    java: `public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean leftToRight = true;
    while (!queue.isEmpty()) {
        int size = queue.size();
        LinkedList<Integer> level = new LinkedList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (leftToRight) level.addLast(node.val);
            else level.addFirst(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
        leftToRight = !leftToRight;
    }
    return result;
}`,
  },
  defaultInput: { tree: [3, 9, 20, null, null, 15, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: 'e.g. 3,9,20,null,null,15,7',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(activeIndices: number[], extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      for (const idx of activeIndices) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Return empty result.',
        variables: { root: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 3,
      explanation: `Start zigzag BFS. Initialize queue with root (${tree[0]}). First level direction: left-to-right.`,
      variables: { root: tree[0], leftToRight: true },
      visualization: makeViz([0]),
    });

    const result: number[][] = [];
    let queue: number[] = [0];
    let leftToRight = true;

    while (queue.length > 0) {
      const levelIndices = queue.slice();
      const levelVals = levelIndices.map(i => tree[i]);

      steps.push({
        line: 5,
        explanation: `Level has ${levelIndices.length} node(s): [${levelVals.join(', ')}]. Direction: ${leftToRight ? 'left-to-right' : 'right-to-left'}.`,
        variables: { levelSize: levelIndices.length, leftToRight },
        visualization: makeViz(levelIndices),
      });

      const nextQueue: number[] = [];
      const levelArr: number[] = [];

      for (const idx of levelIndices) {
        const val = tree[idx] as number;
        visited.add(idx);

        if (leftToRight) {
          levelArr.push(val);
        } else {
          levelArr.unshift(val);
        }

        steps.push({
          line: 7,
          explanation: `Node ${val}: ${leftToRight ? 'append' : 'prepend'} to level array. Level so far: [${levelArr.join(', ')}].`,
          variables: { node: val, direction: leftToRight ? 'left-to-right' : 'right-to-left', level: [...levelArr] },
          visualization: makeViz([idx]),
        });

        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;
        if (leftIdx < tree.length && tree[leftIdx] != null) nextQueue.push(leftIdx);
        if (rightIdx < tree.length && tree[rightIdx] != null) nextQueue.push(rightIdx);
      }

      result.push(levelArr);
      queue = nextQueue;
      leftToRight = !leftToRight;

      steps.push({
        line: 12,
        explanation: `Level done: [${levelArr.join(', ')}]. Flip direction to ${leftToRight ? 'left-to-right' : 'right-to-left'} for next level.`,
        variables: { completedLevel: levelArr, nextDirection: leftToRight ? 'left-to-right' : 'right-to-left' },
        visualization: makeViz([]),
      });
    }

    steps.push({
      line: 14,
      explanation: `Zigzag traversal complete! Result: ${JSON.stringify(result)}.`,
      variables: { result },
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

export default binaryTreeZigzagTraversal;
