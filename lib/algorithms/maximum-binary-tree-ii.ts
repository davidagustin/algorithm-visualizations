import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumBinaryTreeII: AlgorithmDefinition = {
  id: 'maximum-binary-tree-ii',
  title: 'Maximum Binary Tree II',
  leetcodeNumber: 998,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a maximum binary tree and an integer val, insert val into the tree. A maximum binary tree means each node is greater than all nodes in its subtrees. Insert val as a new right subtree node if val is smaller than root; otherwise make root the left child of a new node with value val.',
  tags: ['Tree', 'DFS', 'Recursion', 'Maximum Binary Tree'],
  code: {
    pseudocode: `function insertIntoMaxTree(root, val):
  if root is null or val > root.val:
    newNode = new Node(val)
    newNode.left = root
    return newNode
  root.right = insertIntoMaxTree(root.right, val)
  return root`,
    python: `def insertIntoMaxTree(root, val):
    if not root or val > root.val:
        node = TreeNode(val)
        node.left = root
        return node
    root.right = insertIntoMaxTree(root.right, val)
    return root`,
    javascript: `function insertIntoMaxTree(root, val) {
  if (!root || val > root.val) {
    const node = new TreeNode(val);
    node.left = root;
    return node;
  }
  root.right = insertIntoMaxTree(root.right, val);
  return root;
}`,
    java: `public TreeNode insertIntoMaxTree(TreeNode root, int val) {
    if (root == null || val > root.val) {
        TreeNode node = new TreeNode(val);
        node.left = root;
        return node;
    }
    root.right = insertIntoMaxTree(root.right, val);
    return root;
}`,
  },
  defaultInput: { tree: [4, 1, 3, null, null, 2], val: 5 },
  inputFields: [
    {
      name: 'tree',
      label: 'Maximum Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [4, 1, 3, null, null, 2],
      placeholder: 'e.g. 4,1,3,null,null,2',
    },
    {
      name: 'val',
      label: 'Value to Insert',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const val = input.val as number;
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null, nodes: (number | null)[]): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] != null) highlights[i] = 'visited';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: nodes.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Insert ${val} into the maximum binary tree. Root = ${tree[0]}.`,
      variables: { val, root: tree[0] },
      visualization: makeViz(0, tree),
    });

    // Find the rightmost path where val should be inserted
    let idx = 0;
    let parentIdx = -1;
    const path: number[] = [];

    while (idx < tree.length && tree[idx] != null && (tree[idx] as number) >= val) {
      path.push(idx);
      steps.push({
        line: 6,
        explanation: `Node ${tree[idx]} >= ${val}. Traverse right to insert val in right subtree.`,
        variables: { node: tree[idx], val, comparison: `${tree[idx]} >= ${val}` },
        visualization: makeViz(idx, tree),
      });
      parentIdx = idx;
      idx = 2 * idx + 2;
    }

    // Insert val here
    const newNode = val;
    // The current subtree at idx becomes new node's left child
    const currentSubtreeRoot = idx < tree.length ? tree[idx] : null;

    steps.push({
      line: 2,
      explanation: `${currentSubtreeRoot == null ? 'Reached null' : `Node ${currentSubtreeRoot} < ${val}`}. Create new node ${val}. Its left child will be ${currentSubtreeRoot ?? 'null'}.`,
      variables: { newNodeVal: newNode, leftChild: currentSubtreeRoot },
      visualization: makeViz(parentIdx >= 0 ? parentIdx : null, tree),
    });

    // Build new tree representation
    const newTree = tree.slice();
    if (parentIdx < 0) {
      // val is new root
      const oldTree = tree.slice();
      newTree[0] = val;
      // old tree goes as left subtree — simplified for visualization
      steps.push({
        line: 4,
        explanation: `${val} becomes the new root. Old root ${oldTree[0]} is now left child.`,
        variables: { newRoot: val, oldRoot: oldTree[0] },
        visualization: makeViz(0, newTree),
      });
    } else {
      if (idx < newTree.length) {
        newTree[idx] = val;
      } else {
        while (newTree.length <= idx) newTree.push(null);
        newTree[idx] = val;
      }
      steps.push({
        line: 6,
        explanation: `Inserted ${val} at position ${idx} (right child of ${newTree[parentIdx]}).`,
        variables: { insertedAt: idx, parent: newTree[parentIdx], val },
        visualization: makeViz(idx, newTree),
      });
    }

    steps.push({
      line: 7,
      explanation: `Insertion complete. ${val} is now part of the maximum binary tree.`,
      variables: { val, result: newTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: newTree.slice(),
        highlights: Object.fromEntries(newTree.map((_, i) => [i, i === idx ? 'found' : 'visited']).filter(([i]) => newTree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default maximumBinaryTreeII;
