import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const invertBinaryTreeII: AlgorithmDefinition = {
  id: 'invert-binary-tree-ii',
  title: 'Invert Binary Tree II',
  leetcodeNumber: 226,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Mirror a binary tree by swapping left and right children at every node. Use iterative BFS (level-order) to swap children level by level, contrasting with the recursive DFS approach.',
  tags: ['Tree', 'BFS', 'Queue', 'Iterative', 'Mirror'],
  code: {
    pseudocode: `function invertTree(root):
  if root is null: return null
  queue = [root]
  while queue not empty:
    node = dequeue(queue)
    swap(node.left, node.right)
    if node.left: enqueue(node.left)
    if node.right: enqueue(node.right)
  return root`,
    python: `from collections import deque
def invertTree(root):
    if not root: return None
    q = deque([root])
    while q:
        node = q.popleft()
        node.left, node.right = node.right, node.left
        if node.left: q.append(node.left)
        if node.right: q.append(node.right)
    return root`,
    javascript: `function invertTree(root) {
  if (!root) return null;
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    [node.left, node.right] = [node.right, node.left];
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  return root;
}`,
    java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root);
    while (!q.isEmpty()) {
        TreeNode node = q.poll();
        TreeNode tmp = node.left;
        node.left = node.right; node.right = tmp;
        if (node.left != null) q.add(node.left);
        if (node.right != null) q.add(node.right);
    }
    return root;
}`,
  },
  defaultInput: { tree: [4, 2, 7, 1, 3, 6, 9] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [4, 2, 7, 1, 3, 6, 9],
      placeholder: 'e.g. 4,2,7,1,3,6,9',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function swapSubtrees(nodes: (number | null)[], li: number, ri: number): void {
      if (li >= nodes.length && ri >= nodes.length) return;
      while (nodes.length <= Math.max(li, ri)) nodes.push(null);
      const tmp = nodes[li] ?? null;
      nodes[li] = nodes[ri] ?? null;
      nodes[ri] = tmp;
      swapSubtrees(nodes, 2 * li + 1, 2 * ri + 1);
      swapSubtrees(nodes, 2 * li + 2, 2 * ri + 2);
    }

    steps.push({
      line: 1,
      explanation: `BFS invert of binary tree. Start with root ${tree[0]}.`,
      variables: { root: tree[0] },
      visualization: { type: 'tree', nodes: tree.slice(), highlights: { 0: 'active' } },
    });

    const current = tree.slice();
    const queue: number[] = [0];

    while (queue.length > 0) {
      const idx = queue.shift()!;
      if (idx >= current.length || current[idx] == null) continue;

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      swapSubtrees(current, leftIdx, rightIdx);

      steps.push({
        line: 5,
        explanation: `Swap children of node ${current[idx]}. Left ↔ Right.`,
        variables: {
          node: current[idx],
          newLeft: leftIdx < current.length ? current[leftIdx] : null,
          newRight: rightIdx < current.length ? current[rightIdx] : null,
        },
        visualization: {
          type: 'tree',
          nodes: current.slice(),
          highlights: { [idx]: 'active', ...(leftIdx < current.length && current[leftIdx] != null ? { [leftIdx]: 'found' } : {}), ...(rightIdx < current.length && current[rightIdx] != null ? { [rightIdx]: 'found' } : {}) },
        },
      });

      if (leftIdx < current.length && current[leftIdx] != null) queue.push(leftIdx);
      if (rightIdx < current.length && current[rightIdx] != null) queue.push(rightIdx);
    }

    steps.push({
      line: 9,
      explanation: 'BFS inversion complete! Tree is now mirrored.',
      variables: { result: current.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: current.slice(),
        highlights: Object.fromEntries(current.map((_, i) => [i, 'found']).filter(([i]) => current[i as number] != null)),
      },
    });

    return steps;
  },
};

export default invertBinaryTreeII;
