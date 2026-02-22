import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const nAryTreeLevelOrder: AlgorithmDefinition = {
  id: 'n-ary-tree-level-order',
  title: 'N-ary Tree Level Order Traversal',
  leetcodeNumber: 429,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an N-ary tree, return the level order traversal of its nodes values. Use BFS — at each level, collect all nodes and enqueue all their children. Visualized as a binary tree.',
  tags: ['Tree', 'BFS', 'Level Order'],
  code: {
    pseudocode: `function levelOrder(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue not empty:
    level = []
    for each node in current level:
      level.append(node.val)
      for child in node.children:
        enqueue child
    result.append(level)
  return result`,
    python: `def levelOrder(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level = []
        for _ in range(len(queue)):
            node = queue.popleft()
            level.append(node.val)
            for child in node.children:
                queue.append(child)
        result.append(level)
    return result`,
    javascript: `function levelOrder(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length) {
    const level = [];
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      level.push(node.val);
      for (const child of node.children) queue.push(child);
    }
    result.push(level);
  }
  return result;
}`,
    java: `public List<List<Integer>> levelOrder(Node root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int size = queue.size();
        List<Integer> level = new ArrayList<>();
        for (int i = 0; i < size; i++) {
            Node node = queue.poll();
            level.add(node.val);
            for (Node child : node.children) queue.offer(child);
        }
        result.add(level);
    }
    return result;
}`,
  },
  defaultInput: { tree: [1, null, 3, 2, 4, null, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'N-ary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: 'e.g. 1,null,3,2,4,null,5,6',
      helperText: 'Visualized as binary tree for display purposes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawTree = (input.tree as (number | null)[]).filter(v => v !== null) as number[];
    const tree: (number | null)[] = rawTree;
    const steps: AlgorithmStep[] = [];

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return [].', variables: { result: [] }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Start BFS level-order traversal for N-ary tree.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const result: number[][] = [];
    let current: number[] = [0];
    let depth = 0;
    const processed = new Set<number>();

    while (current.length > 0) {
      const valid = current.filter(i => i < tree.length && tree[i] != null);
      if (valid.length === 0) break;
      const levelVals = valid.map(i => tree[i] as number);
      const next: number[] = [];

      valid.forEach(idx => {
        processed.add(idx);
        const l = 2 * idx + 1, r = 2 * idx + 2;
        if (l < tree.length && tree[l] != null) next.push(l);
        if (r < tree.length && tree[r] != null) next.push(r);
      });

      result.push(levelVals);

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      valid.forEach(i => { highlights[i] = 'active'; });

      steps.push({
        line: 9,
        explanation: `Level ${depth}: [${levelVals.join(', ')}]. Enqueue children for next level.`,
        variables: { depth, level: levelVals },
        visualization: makeViz(highlights),
      });

      current = next;
      depth++;
    }

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 11,
      explanation: `Level order traversal complete. Result: ${JSON.stringify(result)}.`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default nAryTreeLevelOrder;
