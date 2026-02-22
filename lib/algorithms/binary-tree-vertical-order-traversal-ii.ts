import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeVerticalOrderTraversalII: AlgorithmDefinition = {
  id: 'binary-tree-vertical-order-traversal-ii',
  title: 'Binary Tree Vertical Order Traversal II',
  leetcodeNumber: 314,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the vertical order traversal of its nodes values. For each node at position (row, col), the left child has position (row+1, col-1) and the right child has position (row+1, col+1). The column index determines the order. Use BFS with column tracking.',
  tags: ['Tree', 'BFS', 'Hash Map', 'Sorting'],
  code: {
    pseudocode: `function verticalOrder(root):
  if root is null: return []
  colMap = {}
  queue = [(root, 0)]
  minCol = maxCol = 0
  while queue not empty:
    node, col = dequeue
    colMap[col].append(node.val)
    minCol = min(minCol, col)
    maxCol = max(maxCol, col)
    if node.left: enqueue(node.left, col-1)
    if node.right: enqueue(node.right, col+1)
  return [colMap[c] for c in range(minCol, maxCol+1)]`,
    python: `def verticalOrder(root):
    if not root:
        return []
    col_map = defaultdict(list)
    queue = deque([(root, 0)])
    min_col = max_col = 0
    while queue:
        node, col = queue.popleft()
        col_map[col].append(node.val)
        min_col = min(min_col, col)
        max_col = max(max_col, col)
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    return [col_map[c] for c in range(min_col, max_col + 1)]`,
    javascript: `function verticalOrder(root) {
  if (!root) return [];
  const colMap = new Map();
  const queue = [[root, 0]];
  let minCol = 0, maxCol = 0;
  while (queue.length) {
    const [node, col] = queue.shift();
    if (!colMap.has(col)) colMap.set(col, []);
    colMap.get(col).push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }
  const result = [];
  for (let c = minCol; c <= maxCol; c++) result.push(colMap.get(c) || []);
  return result;
}`,
    java: `public List<List<Integer>> verticalOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Map<Integer, List<Integer>> colMap = new TreeMap<>();
    Queue<int[]> queue = new LinkedList<>();
    Map<TreeNode, Integer> nodeCol = new HashMap<>();
    queue.offer(new int[]{0});
    nodeCol.put(root, 0);
    Queue<TreeNode> nodeQueue = new LinkedList<>();
    nodeQueue.offer(root);
    while (!nodeQueue.isEmpty()) {
        TreeNode node = nodeQueue.poll();
        int col = nodeCol.get(node);
        colMap.computeIfAbsent(col, k -> new ArrayList<>()).add(node.val);
        if (node.left != null) { nodeQueue.offer(node.left); nodeCol.put(node.left, col - 1); }
        if (node.right != null) { nodeQueue.offer(node.right); nodeCol.put(node.right, col + 1); }
    }
    result.addAll(colMap.values());
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
      explanation: 'Start vertical order traversal. Use BFS, tracking column index for each node.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    // BFS simulation using tree array indices
    const colMap: Map<number, number[]> = new Map();
    const queue: Array<[number, number]> = [[0, 0]]; // [treeIdx, col]
    let minCol = 0, maxCol = 0;
    const processed = new Set<number>();

    while (queue.length > 0) {
      const [idx, col] = queue.shift()!;
      if (idx >= tree.length || tree[idx] == null) continue;

      if (!colMap.has(col)) colMap.set(col, []);
      colMap.get(col)!.push(tree[idx] as number);
      processed.add(idx);
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);

      const highlights: Record<number, string> = {};
      processed.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 7,
        explanation: `Visit node ${tree[idx]} at column ${col}. colMap[${col}] = [${colMap.get(col)!.join(', ')}].`,
        variables: { node: tree[idx], col, minCol, maxCol },
        visualization: makeViz(highlights),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      if (leftIdx < tree.length && tree[leftIdx] != null) queue.push([leftIdx, col - 1]);
      if (rightIdx < tree.length && tree[rightIdx] != null) queue.push([rightIdx, col + 1]);
    }

    const result: number[][] = [];
    for (let c = minCol; c <= maxCol; c++) result.push(colMap.get(c) || []);

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 13,
      explanation: `Vertical order traversal complete. Columns from ${minCol} to ${maxCol}. Result: ${JSON.stringify(result)}.`,
      variables: { result, minCol, maxCol },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default binaryTreeVerticalOrderTraversalII;
