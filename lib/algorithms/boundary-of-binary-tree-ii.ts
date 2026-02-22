import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const boundaryOfBinaryTreeII: AlgorithmDefinition = {
  id: 'boundary-of-binary-tree-ii',
  title: 'Boundary of Binary Tree',
  leetcodeNumber: 545,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the values of its boundary nodes in counter-clockwise order: root, left boundary (excluding leaves), leaves (left to right), right boundary (excluding leaves, bottom to top).',
  tags: ['Tree', 'DFS', 'Boundary Traversal'],
  code: {
    pseudocode: `function boundaryOfBinaryTree(root):
  if root is null: return []
  result = [root.val]
  leftBoundary(root.left, result)
  leaves(root.left, result)
  leaves(root.right, result)
  rightBoundary(root.right, result)
  return result

function leftBoundary(node, res):
  if node is null or isLeaf(node): return
  res.append(node.val)
  if node.left: leftBoundary(node.left, res)
  else: leftBoundary(node.right, res)`,
    python: `def boundaryOfBinaryTree(root):
    if not root:
        return []
    def is_leaf(node):
        return not node.left and not node.right
    def left_boundary(node, res):
        if not node or is_leaf(node): return
        res.append(node.val)
        if node.left: left_boundary(node.left, res)
        else: left_boundary(node.right, res)
    def leaves(node, res):
        if not node: return
        if is_leaf(node): res.append(node.val); return
        leaves(node.left, res)
        leaves(node.right, res)
    def right_boundary(node, res):
        if not node or is_leaf(node): return
        if node.right: right_boundary(node.right, res)
        else: right_boundary(node.left, res)
        res.append(node.val)
    res = [root.val]
    left_boundary(root.left, res)
    leaves(root.left, res)
    leaves(root.right, res)
    right_boundary(root.right, res)
    return res`,
    javascript: `function boundaryOfBinaryTree(root) {
  if (!root) return [];
  const isLeaf = n => !n.left && !n.right;
  const leftBoundary = (node, res) => {
    if (!node || isLeaf(node)) return;
    res.push(node.val);
    node.left ? leftBoundary(node.left, res) : leftBoundary(node.right, res);
  };
  const leaves = (node, res) => {
    if (!node) return;
    if (isLeaf(node)) { res.push(node.val); return; }
    leaves(node.left, res); leaves(node.right, res);
  };
  const rightBoundary = (node, res) => {
    if (!node || isLeaf(node)) return;
    node.right ? rightBoundary(node.right, res) : rightBoundary(node.left, res);
    res.push(node.val);
  };
  const res = [root.val];
  leftBoundary(root.left, res);
  leaves(root.left, res);
  leaves(root.right, res);
  rightBoundary(root.right, res);
  return res;
}`,
    java: `public List<Integer> boundaryOfBinaryTree(TreeNode root) {
    List<Integer> res = new ArrayList<>();
    if (root == null) return res;
    res.add(root.val);
    leftBoundary(root.left, res);
    leaves(root.left, res);
    leaves(root.right, res);
    rightBoundary(root.right, res);
    return res;
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8, 9, 10],
      placeholder: 'e.g. 1,2,3,4,5,6,null',
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

    const result: number[] = [tree[0] as number];
    const boundaryIndices: number[] = [0];

    steps.push({
      line: 1,
      explanation: `Start boundary traversal. Add root ${tree[0]} to result.`,
      variables: { result: [...result] },
      visualization: makeViz({ 0: 'active' }),
    });

    function isLeaf(idx: number): boolean {
      const l = 2 * idx + 1, r = 2 * idx + 2;
      return (l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null);
    }

    function leftBoundary(idx: number): void {
      if (idx >= tree.length || tree[idx] == null || isLeaf(idx)) return;
      result.push(tree[idx] as number);
      boundaryIndices.push(idx);
      steps.push({
        line: 10,
        explanation: `Left boundary: add node ${tree[idx]}. Going deeper on left boundary.`,
        variables: { node: tree[idx], result: [...result] },
        visualization: makeViz({ ...Object.fromEntries(boundaryIndices.map(i => [i, 'pointer'])), [idx]: 'active' }),
      });
      const l = 2 * idx + 1, r = 2 * idx + 2;
      if (l < tree.length && tree[l] != null) leftBoundary(l);
      else leftBoundary(r);
    }

    function collectLeaves(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      if (isLeaf(idx)) {
        result.push(tree[idx] as number);
        boundaryIndices.push(idx);
        steps.push({
          line: 15,
          explanation: `Leaf node ${tree[idx]} found. Add to result.`,
          variables: { leaf: tree[idx], result: [...result] },
          visualization: makeViz({ ...Object.fromEntries(boundaryIndices.map(i => [i, 'found'])), [idx]: 'active' }),
        });
        return;
      }
      collectLeaves(2 * idx + 1);
      collectLeaves(2 * idx + 2);
    }

    const rightBoundaryStack: number[] = [];
    function rightBoundary(idx: number): void {
      if (idx >= tree.length || tree[idx] == null || isLeaf(idx)) return;
      const r = 2 * idx + 2, l = 2 * idx + 1;
      if (r < tree.length && tree[r] != null) rightBoundary(r);
      else rightBoundary(l);
      rightBoundaryStack.push(tree[idx] as number);
      boundaryIndices.push(idx);
    }

    const l1 = 1, r1 = 2;
    if (l1 < tree.length && tree[l1] != null) leftBoundary(l1);
    if (l1 < tree.length && tree[l1] != null) collectLeaves(l1);
    if (r1 < tree.length && tree[r1] != null) collectLeaves(r1);
    if (r1 < tree.length && tree[r1] != null) {
      rightBoundary(r1);
      result.push(...rightBoundaryStack);
      steps.push({
        line: 6,
        explanation: `Right boundary (bottom-to-top): ${rightBoundaryStack.join(', ')}. Added to result.`,
        variables: { rightBoundary: [...rightBoundaryStack], result: [...result] },
        visualization: makeViz(Object.fromEntries(boundaryIndices.map(i => [i, 'pointer']))),
      });
    }

    const finalHighlights: Record<number, string> = {};
    boundaryIndices.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 7,
      explanation: `Boundary traversal complete. Result: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default boundaryOfBinaryTreeII;
