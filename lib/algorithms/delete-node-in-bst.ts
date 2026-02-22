import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const deleteNodeInBST: AlgorithmDefinition = {
  id: 'delete-node-in-bst',
  title: 'Delete Node in a BST',
  leetcodeNumber: 450,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated). There are three cases: (1) The node is a leaf — simply delete it. (2) The node has one child — replace with child. (3) The node has two children — replace with the in-order successor (smallest in right subtree), then delete the successor.',
  tags: ['Tree', 'BST', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function deleteNode(root, key):
  if root is null: return null
  if key < root.val:
    root.left = deleteNode(root.left, key)
  elif key > root.val:
    root.right = deleteNode(root.right, key)
  else:
    if root.left is null: return root.right
    if root.right is null: return root.left
    successor = findMin(root.right)
    root.val = successor.val
    root.right = deleteNode(root.right, successor.val)
  return root`,
    python: `def deleteNode(root, key):
    if not root:
        return None
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        successor = root.right
        while successor.left:
            successor = successor.left
        root.val = successor.val
        root.right = deleteNode(root.right, successor.val)
    return root`,
    javascript: `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) {
    root.left = deleteNode(root.left, key);
  } else if (key > root.val) {
    root.right = deleteNode(root.right, key);
  } else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let successor = root.right;
    while (successor.left) successor = successor.left;
    root.val = successor.val;
    root.right = deleteNode(root.right, successor.val);
  }
  return root;
}`,
    java: `public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) {
        root.left = deleteNode(root.left, key);
    } else if (key > root.val) {
        root.right = deleteNode(root.right, key);
    } else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode successor = root.right;
        while (successor.left != null) successor = successor.left;
        root.val = successor.val;
        root.right = deleteNode(root.right, successor.val);
    }
    return root;
}`,
  },
  defaultInput: { tree: [5, 3, 6, 2, 4, null, 7], key: 3 },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [5, 3, 6, 2, 4, null, 7],
      placeholder: 'e.g. 5,3,6,2,4,null,7',
      helperText: 'A valid BST in level-order. Use null for missing nodes.',
    },
    {
      name: 'key',
      label: 'Key to Delete',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'The value of the node to delete.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const key = input.key as number;
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Nothing to delete.',
        variables: { root: null, key },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Delete key=${key} from BST. Use BST property to navigate to the node.`,
      variables: { root: tree[0], key },
      visualization: makeViz(0),
    });

    // Find the node to delete
    let targetIdx = -1;
    function findNode(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      const val = tree[idx] as number;
      visited.add(idx);

      steps.push({
        line: 3,
        explanation: `Compare key=${key} with node ${val}. ${key < val ? 'Go left.' : key > val ? 'Go right.' : 'Found the node to delete!'}`,
        variables: { node: val, key, direction: key < val ? 'left' : key > val ? 'right' : 'found' },
        visualization: makeViz(idx),
      });

      if (key < val) {
        findNode(2 * idx + 1);
      } else if (key > val) {
        findNode(2 * idx + 2);
      } else {
        targetIdx = idx;
      }
    }

    findNode(0);

    if (targetIdx === -1) {
      steps.push({
        line: 2,
        explanation: `Key=${key} not found in BST. Tree unchanged.`,
        variables: { key, found: false },
        visualization: makeViz(null),
      });
      return steps;
    }

    const leftIdx = 2 * targetIdx + 1;
    const rightIdx = 2 * targetIdx + 2;
    const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
    const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

    steps.push({
      line: 7,
      explanation: `Found node ${key} at index ${targetIdx}. Has left child: ${hasLeft}, Has right child: ${hasRight}.`,
      variables: { node: key, hasLeft, hasRight },
      visualization: makeViz(targetIdx, { [targetIdx]: 'comparing' }),
    });

    if (!hasLeft && !hasRight) {
      // Leaf node: simply delete
      tree[targetIdx] = null;
      steps.push({
        line: 8,
        explanation: `Node ${key} is a leaf. Simply delete it (set to null).`,
        variables: { deleted: key },
        visualization: makeViz(null),
      });
    } else if (!hasLeft) {
      // No left child: replace with right child value (simplified for array representation)
      const rightVal = tree[rightIdx] as number;
      tree[targetIdx] = rightVal;
      tree[rightIdx] = null;
      steps.push({
        line: 8,
        explanation: `Node ${key} has no left child. Replace with right child (${rightVal}).`,
        variables: { deleted: key, replacedWith: rightVal },
        visualization: makeViz(targetIdx, { [targetIdx]: 'found' }),
      });
    } else if (!hasRight) {
      // No right child: replace with left child value
      const leftVal = tree[leftIdx] as number;
      tree[targetIdx] = leftVal;
      tree[leftIdx] = null;
      steps.push({
        line: 9,
        explanation: `Node ${key} has no right child. Replace with left child (${leftVal}).`,
        variables: { deleted: key, replacedWith: leftVal },
        visualization: makeViz(targetIdx, { [targetIdx]: 'found' }),
      });
    } else {
      // Two children: find in-order successor (min of right subtree)
      let successorIdx = rightIdx;
      while (2 * successorIdx + 1 < tree.length && tree[2 * successorIdx + 1] != null) {
        successorIdx = 2 * successorIdx + 1;
      }
      const successorVal = tree[successorIdx] as number;

      steps.push({
        line: 10,
        explanation: `Node ${key} has two children. Find in-order successor (min of right subtree) = ${successorVal}.`,
        variables: { node: key, successor: successorVal },
        visualization: makeViz(successorIdx, { [targetIdx]: 'comparing', [successorIdx]: 'found' }),
      });

      tree[targetIdx] = successorVal;
      tree[successorIdx] = null;

      steps.push({
        line: 11,
        explanation: `Replace node ${key} with successor ${successorVal}. Delete successor from right subtree.`,
        variables: { oldValue: key, newValue: successorVal },
        visualization: makeViz(targetIdx, { [targetIdx]: 'found' }),
      });
    }

    steps.push({
      line: 13,
      explanation: `Delete operation complete. BST property maintained.`,
      variables: { deletedKey: key },
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

export default deleteNodeInBST;
