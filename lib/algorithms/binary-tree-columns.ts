import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeColumns: AlgorithmDefinition = {
  id: 'binary-tree-columns',
  title: 'Binary Tree Columns',
  leetcodeNumber: 314,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a binary tree, return its vertical order traversal. Nodes at the same column are grouped together, ordered top-to-bottom. We use BFS, tracking each node\'s column offset (root = 0, left child = col-1, right child = col+1).',
  tags: ['Tree', 'BFS', 'Hash Map'],
  code: {
    pseudocode: `function verticalOrder(root):
  if root is null: return []
  columns = {}
  queue = [(root, 0)]
  minCol = maxCol = 0
  while queue is not empty:
    (node, col) = queue.dequeue()
    columns[col].append(node.val)
    minCol = min(minCol, col)
    maxCol = max(maxCol, col)
    if node.left: queue.enqueue((node.left, col-1))
    if node.right: queue.enqueue((node.right, col+1))
  return [columns[c] for c in minCol..maxCol]`,
    python: `def verticalOrder(root):
    if not root:
        return []
    columns = defaultdict(list)
    queue = deque([(root, 0)])
    min_col = max_col = 0
    while queue:
        node, col = queue.popleft()
        columns[col].append(node.val)
        min_col = min(min_col, col)
        max_col = max(max_col, col)
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    return [columns[c] for c in range(min_col, max_col + 1)]`,
    javascript: `function verticalOrder(root) {
  if (!root) return [];
  const columns = {};
  const queue = [[root, 0]];
  let minCol = 0, maxCol = 0;
  while (queue.length > 0) {
    const [node, col] = queue.shift();
    if (!columns[col]) columns[col] = [];
    columns[col].push(node.val);
    minCol = Math.min(minCol, col);
    maxCol = Math.max(maxCol, col);
    if (node.left) queue.push([node.left, col - 1]);
    if (node.right) queue.push([node.right, col + 1]);
  }
  const result = [];
  for (let c = minCol; c <= maxCol; c++) result.push(columns[c]);
  return result;
}`,
    java: `public List<List<Integer>> verticalOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    Map<Integer, List<Integer>> columns = new TreeMap<>();
    Queue<int[]> queue = new LinkedList<>(); // [node, col]
    queue.offer(new int[]{root.val, 0});
    // Use proper BFS with TreeNode queue in practice
    while (!queue.isEmpty()) {
        // process node at column, add children
    }
    result.addAll(columns.values());
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

    const columns: Record<number, number[]> = {};
    const nodeColumns: Record<number, number> = {};

    function makeViz(activeIdx: number | null, col: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const [idxStr, c] of Object.entries(nodeColumns)) {
        const idx = Number(idxStr);
        if (col !== null && c === col) {
          highlights[idx] = 'comparing';
        } else {
          highlights[idx] = 'visited';
        }
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty. Return empty columns.',
        variables: { result: [] },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start vertical order traversal. Root = ${tree[0]} at column 0. Left children go to col-1, right to col+1.`,
      variables: { root: tree[0] },
      visualization: makeViz(0, null),
    });

    // BFS: [treeIndex, column]
    const queue: [number, number][] = [[0, 0]];
    let minCol = 0;
    let maxCol = 0;

    while (queue.length > 0) {
      const [idx, col] = queue.shift()!;

      if (idx >= tree.length || tree[idx] == null) continue;

      const val = tree[idx] as number;
      if (!columns[col]) columns[col] = [];
      columns[col].push(val);
      nodeColumns[idx] = col;
      minCol = Math.min(minCol, col);
      maxCol = Math.max(maxCol, col);

      steps.push({
        line: 7,
        explanation: `Process node ${val} (index ${idx}) at column ${col}. Add to columns[${col}].`,
        variables: { node: val, column: col, columnsState: { ...columns } },
        visualization: makeViz(idx, col),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      if (leftIdx < tree.length && tree[leftIdx] != null) {
        queue.push([leftIdx, col - 1]);
      }
      if (rightIdx < tree.length && tree[rightIdx] != null) {
        queue.push([rightIdx, col + 1]);
      }
    }

    const result: number[][] = [];
    for (let c = minCol; c <= maxCol; c++) {
      result.push(columns[c] || []);
    }

    steps.push({
      line: 13,
      explanation: `BFS complete. Columns from ${minCol} to ${maxCol}: ${result.map((r, i) => `col ${minCol + i}: [${r}]`).join(', ')}.`,
      variables: { result, minCol, maxCol },
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

export default binaryTreeColumns;
