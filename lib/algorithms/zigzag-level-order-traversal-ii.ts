import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const zigzagLevelOrderTraversalII: AlgorithmDefinition = {
  id: 'zigzag-level-order-traversal-ii',
  title: 'Binary Tree Zigzag Level Order Traversal',
  leetcodeNumber: 103,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the zigzag level order traversal of its nodes values. In zigzag order, odd levels go left-to-right and even levels go right-to-left. Use BFS level by level, reversing alternate levels.',
  tags: ['Tree', 'BFS', 'Level Order'],
  code: {
    pseudocode: `function zigzagLevelOrder(root):
  if root is null: return []
  result = []
  queue = [root]
  leftToRight = true
  while queue not empty:
    level = []
    for each node in current level:
      level.append(node.val)
      enqueue children
    if not leftToRight: reverse(level)
    result.append(level)
    leftToRight = not leftToRight
  return result`,
    python: `def zigzagLevelOrder(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    left_to_right = True
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        if not left_to_right:
            level.reverse()
        result.append(level)
        left_to_right = not left_to_right
    return result`,
    javascript: `function zigzagLevelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  let leftToRight = true;
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(leftToRight ? level : level.reverse());
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
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            level.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        if (!leftToRight) Collections.reverse(level);
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
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Return [].',
        variables: { result: [] },
        visualization: makeViz({}),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Start zigzag BFS. Level 0 goes left-to-right, level 1 right-to-left, alternating.',
      variables: { root: tree[0], leftToRight: true },
      visualization: makeViz({ 0: 'active' }),
    });

    const result: number[][] = [];
    let currentLevel: number[] = [0];
    let depth = 0;
    let leftToRight = true;
    const processed = new Set<number>();

    while (currentLevel.length > 0) {
      const levelValues: number[] = [];
      const nextLevel: number[] = [];

      for (const idx of currentLevel) {
        if (idx < tree.length && tree[idx] != null) {
          levelValues.push(tree[idx] as number);
          processed.add(idx);
          const l = 2 * idx + 1, r = 2 * idx + 2;
          if (l < tree.length && tree[l] != null) nextLevel.push(l);
          if (r < tree.length && tree[r] != null) nextLevel.push(r);
        }
      }

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      currentLevel.forEach(i => { if (tree[i] != null) highlights[i] = 'active'; });

      const ordered = leftToRight ? [...levelValues] : [...levelValues].reverse();
      result.push(ordered);

      steps.push({
        line: 10,
        explanation: `Level ${depth}: [${levelValues.join(', ')}]${!leftToRight ? ' → reversed to [' + ordered.join(', ') + ']' : ''}. Direction: ${leftToRight ? 'L→R' : 'R→L'}.`,
        variables: { depth, level: ordered, leftToRight },
        visualization: makeViz(highlights),
      });

      leftToRight = !leftToRight;
      currentLevel = nextLevel;
      depth++;
    }

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 13,
      explanation: `Zigzag traversal complete. Result: ${JSON.stringify(result)}.`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default zigzagLevelOrderTraversalII;
