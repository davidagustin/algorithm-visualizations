import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const averageOfLevelsII: AlgorithmDefinition = {
  id: 'average-of-levels-ii',
  title: 'Average of Levels in Binary Tree',
  leetcodeNumber: 637,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the average value of the nodes on each level. Use BFS to process level by level, computing the average at each level.',
  tags: ['Tree', 'BFS', 'Level Order'],
  code: {
    pseudocode: `function averageOfLevels(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue not empty:
    size = len(queue)
    total = 0
    for i in range(size):
      node = dequeue
      total += node.val
      enqueue children
    result.append(total / size)
  return result`,
    python: `def averageOfLevels(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        size = len(queue)
        total = 0
        for _ in range(size):
            node = queue.popleft()
            total += node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        result.append(total / size)
    return result`,
    javascript: `function averageOfLevels(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const size = queue.length;
    let total = 0;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      total += node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(total / size);
  }
  return result;
}`,
    java: `public double[] averageOfLevels(TreeNode root) {
    List<Double> result = new ArrayList<>();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        double sum = 0;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            sum += node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        result.add(sum / size);
    }
    return result.stream().mapToDouble(d -> d).toArray();
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
      explanation: 'Use BFS to traverse level by level and compute averages.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const result: number[] = [];
    let current: number[] = [0];
    let depth = 0;
    const processed = new Set<number>();

    while (current.length > 0) {
      const valid = current.filter(i => i < tree.length && tree[i] != null);
      if (valid.length === 0) break;

      let total = 0;
      const next: number[] = [];

      for (const idx of valid) {
        total += tree[idx] as number;
        processed.add(idx);
        const l = 2 * idx + 1, r = 2 * idx + 2;
        if (l < tree.length && tree[l] != null) next.push(l);
        if (r < tree.length && tree[r] != null) next.push(r);
      }

      const avg = total / valid.length;
      result.push(avg);

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      valid.forEach(i => { highlights[i] = 'active'; });

      steps.push({
        line: 11,
        explanation: `Level ${depth}: values [${valid.map(i => tree[i]).join(', ')}], sum=${total}, count=${valid.length}, avg=${avg.toFixed(2)}.`,
        variables: { depth, total, count: valid.length, average: avg },
        visualization: makeViz(highlights),
      });

      current = next;
      depth++;
    }

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 12,
      explanation: `All level averages computed: [${result.map(v => v.toFixed(2)).join(', ')}].`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default averageOfLevelsII;
