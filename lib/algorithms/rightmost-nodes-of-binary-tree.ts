import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const rightmostNodesOfBinaryTree: AlgorithmDefinition = {
  id: 'rightmost-nodes-of-binary-tree',
  title: 'Rightmost Nodes of Binary Tree',
  leetcodeNumber: 199,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the values of the nodes you can see when looking at the tree from the right side. We perform a BFS (level-order traversal), and for each level, the last node in the queue is the rightmost visible node.',
  tags: ['Tree', 'BFS'],
  code: {
    pseudocode: `function rightSideView(root):
  if root is null: return []
  result = []
  queue = [root]
  while queue is not empty:
    levelSize = queue.length
    for i from 0 to levelSize-1:
      node = queue.dequeue()
      if i == levelSize - 1:
        result.append(node.val)
      if node.left: queue.enqueue(node.left)
      if node.right: queue.enqueue(node.right)
  return result`,
    python: `def rightSideView(root):
    if not root:
        return []
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == level_size - 1:
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    return result`,
    javascript: `function rightSideView(root) {
  if (!root) return [];
  const result = [];
  const queue = [root];
  while (queue.length > 0) {
    const levelSize = queue.length;
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (i === levelSize - 1) result.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
  return result;
}`,
    java: `public List<Integer> rightSideView(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    if (root == null) return result;
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            if (i == levelSize - 1) result.add(node.val);
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    return result;
}`,
  },
  defaultInput: { tree: [1, 2, 3, null, 5, null, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, null, 5, null, 4],
      placeholder: 'e.g. 1,2,3,null,5,null,4',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    function makeViz(levelIndices: number[], rightmostIdx: number | null, rightmostSoFar: number[]): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const ri of rightmostSoFar) {
        if (ri < tree.length && tree[ri] != null) {
          highlights[ri] = 'found';
        }
      }
      for (const li of levelIndices) {
        if (li < tree.length && tree[li] != null) {
          highlights[li] = 'active';
        }
      }
      if (rightmostIdx !== null && rightmostIdx < tree.length && tree[rightmostIdx] != null) {
        highlights[rightmostIdx] = 'found';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty. Return an empty list.',
        variables: { result: [] },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start right side view BFS. Root = ${tree[0]}. Process level by level, taking the last node of each level.`,
      variables: { root: tree[0] },
      visualization: makeViz([0], null, []),
    });

    // BFS using indices
    let queue: number[] = [0];
    const rightmostIndices: number[] = [];
    let level = 0;

    while (queue.length > 0) {
      const levelSize = queue.length;
      const levelIndices = queue.slice();

      steps.push({
        line: 5,
        explanation: `Level ${level}: ${levelSize} node(s) to process. Nodes: [${levelIndices.map(i => tree[i]).join(', ')}].`,
        variables: { level, levelSize, queue: levelIndices.map(i => tree[i]) },
        visualization: makeViz(levelIndices, null, rightmostIndices),
      });

      const nextQueue: number[] = [];

      for (let i = 0; i < levelSize; i++) {
        const idx = queue[i];
        const isLast = i === levelSize - 1;
        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;

        if (isLast) {
          result.push(tree[idx] as number);
          rightmostIndices.push(idx);

          steps.push({
            line: 9,
            explanation: `Node ${tree[idx]} is the LAST node at level ${level} => it's the rightmost visible node. Add to result.`,
            variables: { node: tree[idx], level, result: result.slice() },
            visualization: makeViz(levelIndices, idx, rightmostIndices),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `Process node ${tree[idx]} at level ${level} (not the last node, so not rightmost).`,
            variables: { node: tree[idx], i, levelSize },
            visualization: makeViz([idx], null, rightmostIndices),
          });
        }

        if (leftIdx < tree.length && tree[leftIdx] != null) {
          nextQueue.push(leftIdx);
        }
        if (rightIdx < tree.length && tree[rightIdx] != null) {
          nextQueue.push(rightIdx);
        }
      }

      queue = nextQueue;
      level++;
    }

    steps.push({
      line: 13,
      explanation: `BFS complete. Right side view: [${result.join(', ')}].`,
      variables: { result: result.slice() },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          rightmostIndices.map(i => [i, 'found'])
        ),
      },
    });

    return steps;
  },
};

export default rightmostNodesOfBinaryTree;
