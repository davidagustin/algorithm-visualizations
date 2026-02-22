import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const deepestLeavesSumII: AlgorithmDefinition = {
  id: 'deepest-leaves-sum-ii',
  title: 'Deepest Leaves Sum',
  leetcodeNumber: 1302,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the sum of values of its deepest leaves. Use BFS level by level — the sum of the last level gives the answer. Alternatively, use DFS tracking maximum depth.',
  tags: ['Tree', 'BFS', 'DFS'],
  code: {
    pseudocode: `function deepestLeavesSum(root):
  queue = [root]
  lastLevelSum = 0
  while queue not empty:
    lastLevelSum = 0
    for each node in current level:
      lastLevelSum += node.val
      enqueue children
  return lastLevelSum`,
    python: `def deepestLeavesSum(root):
    queue = deque([root])
    last_sum = 0
    while queue:
        last_sum = sum(node.val for node in queue)
        next_queue = deque()
        for node in queue:
            if node.left: next_queue.append(node.left)
            if node.right: next_queue.append(node.right)
        queue = next_queue
    return last_sum`,
    javascript: `function deepestLeavesSum(root) {
  let queue = [root];
  let lastSum = 0;
  while (queue.length) {
    lastSum = queue.reduce((s, n) => s + n.val, 0);
    const next = [];
    for (const node of queue) {
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
  }
  return lastSum;
}`,
    java: `public int deepestLeavesSum(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int sum = 0;
    while (!queue.isEmpty()) {
        sum = 0;
        int size = queue.size();
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            sum += node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return sum;
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, null, null, 8] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, null, 6, 7, null, null, null, null, null, null, 8],
      placeholder: 'e.g. 1,2,3,4,5,null,6,7',
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
      steps.push({ line: 2, explanation: 'Tree is empty. Sum = 0.', variables: { sum: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Use BFS level by level. The sum of the last (deepest) level is the answer.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    let current: number[] = [0];
    let lastSum = 0;
    let depth = 0;
    const processed = new Set<number>();

    while (current.length > 0) {
      const valid = current.filter(i => i < tree.length && tree[i] != null);
      if (valid.length === 0) break;

      lastSum = valid.reduce((sum, i) => sum + (tree[i] as number), 0);
      const next: number[] = [];

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      valid.forEach(i => {
        processed.add(i);
        highlights[i] = 'active';
        const l = 2 * i + 1, r = 2 * i + 2;
        if (l < tree.length && tree[l] != null) next.push(l);
        if (r < tree.length && tree[r] != null) next.push(r);
      });

      steps.push({
        line: 4,
        explanation: `Level ${depth}: values=[${valid.map(i => tree[i]).join(',')}], sum=${lastSum}. ${next.length === 0 ? 'This is the deepest level!' : 'Continue to next level.'}`,
        variables: { depth, levelValues: valid.map(i => tree[i]), levelSum: lastSum, isDeepest: next.length === 0 },
        visualization: makeViz(highlights),
      });

      current = next;
      depth++;
    }

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 8,
      explanation: `Deepest leaves sum = ${lastSum}.`,
      variables: { deepestLeavesSum: lastSum },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default deepestLeavesSumII;
