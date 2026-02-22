import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeLevelOrderTraversal: AlgorithmDefinition = {
  id: 'binary-tree-level-order-traversal',
  title: 'Binary Tree Level Order Traversal',
  leetcodeNumber: 102,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level). We use BFS with a queue: enqueue the root, then for each node dequeued, enqueue its children and collect values per level.',
  tags: ['Tree', 'BFS', 'Queue'],
  code: {
    pseudocode: `function levelOrder(root):
  if root is null: return []
  result = [], queue = [root]
  while queue is not empty:
    level = [], size = queue.length
    for i in 0..size-1:
      node = queue.dequeue()
      level.append(node.val)
      if node.left: queue.enqueue(node.left)
      if node.right: queue.enqueue(node.right)
    result.append(level)
  return result`,
    python: `def levelOrder(root):
    if not root:
        return []
    result, queue = [], [root]
    while queue:
        level, size = [], len(queue)
        for _ in range(size):
            node = queue.pop(0)
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result`,
    javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length) {
    const level = [], size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result;
}`,
    java: `public List<List<Integer>> levelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(level);
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
      explanation: `Start BFS level-order traversal. Initialize queue with root (${tree[0]}).`,
      variables: { root: tree[0], queue: [0] },
      visualization: makeViz([0]),
    });

    const result: number[][] = [];
    let queue: number[] = [0]; // indices into tree array

    while (queue.length > 0) {
      const size = queue.length;
      const levelIndices = queue.slice();
      const levelVals = levelIndices.map(i => tree[i]);
      const currentLevel: number[] = [];

      steps.push({
        line: 5,
        explanation: `Processing level with ${size} node(s): [${levelVals.join(', ')}].`,
        variables: { levelSize: size, currentQueue: levelVals },
        visualization: makeViz(levelIndices),
      });

      const nextQueue: number[] = [];

      for (const idx of levelIndices) {
        const val = tree[idx] as number;

        steps.push({
          line: 7,
          explanation: `Dequeue node ${val}. Add its value to current level.`,
          variables: { node: val, currentLevel: [...currentLevel, val] },
          visualization: makeViz([idx]),
        });

        currentLevel.push(val);
        visited.add(idx);

        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;

        if (leftIdx < tree.length && tree[leftIdx] != null) {
          nextQueue.push(leftIdx);
          steps.push({
            line: 9,
            explanation: `Enqueue left child ${tree[leftIdx]} of node ${val}.`,
            variables: { enqueueing: tree[leftIdx] },
            visualization: makeViz([leftIdx], Object.fromEntries(visited.has(leftIdx) ? [] : [[leftIdx, 'comparing']])),
          });
        }
        if (rightIdx < tree.length && tree[rightIdx] != null) {
          nextQueue.push(rightIdx);
          steps.push({
            line: 10,
            explanation: `Enqueue right child ${tree[rightIdx]} of node ${val}.`,
            variables: { enqueueing: tree[rightIdx] },
            visualization: makeViz([rightIdx], Object.fromEntries(visited.has(rightIdx) ? [] : [[rightIdx, 'comparing']])),
          });
        }
      }

      result.push(currentLevel);
      queue = nextQueue;

      steps.push({
        line: 11,
        explanation: `Level complete. Collected: [${currentLevel.join(', ')}]. Result so far: ${JSON.stringify(result)}.`,
        variables: { completedLevel: currentLevel, result: JSON.parse(JSON.stringify(result)) },
        visualization: makeViz([]),
      });
    }

    steps.push({
      line: 12,
      explanation: `BFS complete! Level-order result: ${JSON.stringify(result)}.`,
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

export default binaryTreeLevelOrderTraversal;
