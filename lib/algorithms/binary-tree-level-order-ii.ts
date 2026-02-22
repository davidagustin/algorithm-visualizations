import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeLevelOrderII: AlgorithmDefinition = {
  id: 'binary-tree-level-order-ii',
  title: 'Binary Tree Level Order Traversal II',
  leetcodeNumber: 107,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the bottom-up level order traversal of its nodes values (from leaves to root, left to right at each level). Use standard BFS and then reverse the result.',
  tags: ['Tree', 'BFS', 'Level Order'],
  code: {
    pseudocode: `function levelOrderBottom(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue not empty:
    level = []
    for each node in current level:
      level.append(node.val)
      enqueue children
    result.append(level)
  reverse result
  return result`,
    python: `def levelOrderBottom(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(level)
    return result[::-1]`,
    javascript: `function levelOrderBottom(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }
  return result.reverse();
}`,
    java: `public List<List<Integer>> levelOrderBottom(TreeNode root) {
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
        result.add(0, level);
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
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return [].', variables: { result: [] }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Start BFS top-down, then reverse the collected levels for bottom-up result.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const levels: number[][] = [];
    let current: number[] = [0];
    let depth = 0;
    const processed = new Set<number>();

    while (current.length > 0) {
      const levelVals: number[] = [];
      const next: number[] = [];

      for (const idx of current) {
        if (idx < tree.length && tree[idx] != null) {
          levelVals.push(tree[idx] as number);
          processed.add(idx);
          const l = 2 * idx + 1, r = 2 * idx + 2;
          if (l < tree.length && tree[l] != null) next.push(l);
          if (r < tree.length && tree[r] != null) next.push(r);
        }
      }

      levels.push(levelVals);

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      current.forEach(i => { if (tree[i] != null) highlights[i] = 'active'; });

      steps.push({
        line: 6,
        explanation: `Process level ${depth}: [${levelVals.join(', ')}]. Add to result.`,
        variables: { depth, level: levelVals },
        visualization: makeViz(highlights),
      });

      current = next;
      depth++;
    }

    const reversed = [...levels].reverse();

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 10,
      explanation: `Reverse all levels. Bottom-up result: ${JSON.stringify(reversed)}.`,
      variables: { result: reversed },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default binaryTreeLevelOrderII;
