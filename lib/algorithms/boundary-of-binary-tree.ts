import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const boundaryOfBinaryTree: AlgorithmDefinition = {
  id: 'boundary-of-binary-tree',
  title: 'Boundary of Binary Tree',
  leetcodeNumber: 545,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree, return the values of its boundary in anti-clockwise direction starting from the root. The boundary includes: the left boundary (top-down, excluding leaves), all leaf nodes (left-to-right), and the right boundary (bottom-up, excluding leaves). Combine these three parts for the full boundary.',
  tags: ['tree', 'dfs', 'boundary traversal', 'left boundary', 'right boundary', 'leaves'],

  code: {
    pseudocode: `function boundaryOfBinaryTree(root):
  if root is null: return []
  result = [root.val]
  addLeftBoundary(root.left, result)
  addLeaves(root, result)
  addRightBoundary(root.right, result)
  return result

function addLeftBoundary(node, result):
  if null or leaf: return
  result.append(node.val)
  if node.left: addLeftBoundary(node.left, result)
  else: addLeftBoundary(node.right, result)

function addLeaves(node, result):
  if null: return
  if leaf: result.append(node.val); return
  addLeaves(node.left, result)
  addLeaves(node.right, result)

function addRightBoundary(node, result):
  if null or leaf: return
  if node.right: addRightBoundary(node.right, result)
  else: addRightBoundary(node.left, result)
  result.append(node.val)   // append after recursion (bottom-up)`,

    python: `def boundaryOfBinaryTree(self, root):
    def is_leaf(node):
        return not node.left and not node.right
    def add_left(node, res):
        while node:
            if not is_leaf(node):
                res.append(node.val)
            node = node.left if node.left else node.right
    def add_leaves(node, res):
        if not node: return
        if is_leaf(node): res.append(node.val); return
        add_leaves(node.left, res)
        add_leaves(node.right, res)
    def add_right(node, res):
        stack = []
        while node:
            if not is_leaf(node):
                stack.append(node.val)
            node = node.right if node.right else node.left
        res.extend(reversed(stack))
    if not root: return []
    res = [root.val]
    if not is_leaf(root):
        add_left(root.left, res)
        add_leaves(root, res)
        add_right(root.right, res)
    return res`,

    javascript: `function boundaryOfBinaryTree(root) {
  if (!root) return [];
  const isLeaf = n => !n.left && !n.right;
  const addLeft = (node, res) => {
    while (node) {
      if (!isLeaf(node)) res.push(node.val);
      node = node.left || node.right;
    }
  };
  const addLeaves = (node, res) => {
    if (!node) return;
    if (isLeaf(node)) { res.push(node.val); return; }
    addLeaves(node.left, res);
    addLeaves(node.right, res);
  };
  const addRight = (node, res) => {
    const stack = [];
    while (node) {
      if (!isLeaf(node)) stack.push(node.val);
      node = node.right || node.left;
    }
    for (let i = stack.length - 1; i >= 0; i--) res.push(stack[i]);
  };
  const res = [root.val];
  if (!isLeaf(root)) {
    addLeft(root.left, res);
    addLeaves(root, res);
    addRight(root.right, res);
  }
  return res;
}`,

    java: `public List<Integer> boundaryOfBinaryTree(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    res.add(root.val);
    if (!isLeaf(root)) {
        addLeft(root.left, res);
        addLeaves(root, res);
        addRight(root.right, res);
    }
    return res;
}
boolean isLeaf(TreeNode n) { return n.left == null && n.right == null; }
void addLeft(TreeNode n, List<Integer> res) {
    while (n != null) {
        if (!isLeaf(n)) res.add(n.val);
        n = n.left != null ? n.left : n.right;
    }
}
void addLeaves(TreeNode n, List<Integer> res) {
    if (n == null) return;
    if (isLeaf(n)) { res.add(n.val); return; }
    addLeaves(n.left, res); addLeaves(n.right, res);
}
void addRight(TreeNode n, List<Integer> res) {
    Deque<Integer> stack = new ArrayDeque<>();
    while (n != null) {
        if (!isLeaf(n)) stack.push(n.val);
        n = n.right != null ? n.right : n.left;
    }
    while (!stack.isEmpty()) res.add(stack.pop());
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10],
      placeholder: '1,2,3,4,5,6,null,null,null,7,8,9,10',
      helperText: 'Level-order array with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    steps.push({
      line: 2,
      explanation: 'Start with root value 1 in result. Tree has left and right subtrees.',
      variables: { result: '[1]', phase: 'root' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Left boundary: 1 -> 2 -> 4 (top-down, exclude leaves)
    steps.push({
      line: 3,
      explanation: 'Phase 1: Left boundary (top-down, skip leaves). Start at root.left = node 2.',
      variables: { result: '[1]', phase: 'left boundary', current: 2 },
      visualization: makeViz({ 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 10,
      explanation: 'Node 2 is not a leaf. Add 2 to result. Move to its left child 4.',
      variables: { result: '[1,2]', current: 4 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 3: 'active' }),
    });

    steps.push({
      line: 10,
      explanation: 'Node 4 is a leaf. Do not add (leaves are collected separately). Left boundary done.',
      variables: { result: '[1,2]', phase: 'left boundary done' },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 3: 'pointer' }),
    });

    // Leaves: 4, 7, 8, 9, 10, 6
    steps.push({
      line: 14,
      explanation: 'Phase 2: Collect all leaves left-to-right. Node 4 is a leaf -> add 4.',
      variables: { result: '[1,2,4]', current: 4 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 3: 'found' }),
    });

    steps.push({
      line: 14,
      explanation: 'Node 5 is not a leaf. Visit its children 7 and 8.',
      variables: { result: '[1,2,4]', current: 5 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 3: 'sorted', 4: 'current' }),
    });

    steps.push({
      line: 14,
      explanation: 'Leaf nodes 7 and 8 (children of 5) are added. result=[1,2,4,7,8].',
      variables: { result: '[1,2,4,7,8]' },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 3: 'sorted', 4: 'visited', 9: 'found', 10: 'found' }),
    });

    steps.push({
      line: 14,
      explanation: 'Node 6 (right child of root.left=2? No, 6 is root.right child). Visit node 6 subtree leaves: 9, 10.',
      variables: { result: '[1,2,4,7,8,9,10]' },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'current', 11: 'found', 12: 'found' }),
    });

    // Right boundary: 3 -> 6 (bottom-up, exclude leaves)
    steps.push({
      line: 19,
      explanation: 'Phase 3: Right boundary (bottom-up, skip leaves). Collect: [3, 6] then reverse to get bottom-up order.',
      variables: { result: '[1,2,4,7,8,9,10]', rightBoundary: '[3]' },
      visualization: makeViz({ 0: 'visited', 2: 'active' }),
    });

    steps.push({
      line: 20,
      explanation: 'Node 3 is not a leaf. Stack: [3]. Move to right child of 3 which is node 6.',
      variables: { stack: '[3]', current: 6 },
      visualization: makeViz({ 0: 'visited', 2: 'found', 5: 'active' }),
    });

    steps.push({
      line: 20,
      explanation: 'Node 6 has children 9 and 10, so it is not a leaf. Stack: [3, 6]. No more right children.',
      variables: { stack: '[3,6]' },
      visualization: makeViz({ 0: 'visited', 2: 'found', 5: 'found' }),
    });

    steps.push({
      line: 21,
      explanation: 'Reverse stack and append to result: add 6 then 3. result=[1,2,4,7,8,9,10,6,3].',
      variables: { result: '[1,2,4,7,8,9,10,6,3]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found', 9: 'found', 10: 'found', 11: 'found', 12: 'found' }),
    });

    return steps;
  },
};

export default boundaryOfBinaryTree;
