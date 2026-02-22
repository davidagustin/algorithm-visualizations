import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const deleteNodeInBSTII: AlgorithmDefinition = {
  id: 'delete-node-in-bst-ii',
  title: 'Delete Node in a BST II',
  leetcodeNumber: 450,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Delete a node with a given key from a BST. Three cases: (1) node has no children — simply remove it; (2) node has one child — replace with that child; (3) node has two children — replace with in-order successor (smallest in right subtree), then delete successor.',
  tags: ['Tree', 'BST', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function deleteNode(root, key):
  if root is null: return null
  if key < root.val:
    root.left = deleteNode(root.left, key)
  elif key > root.val:
    root.right = deleteNode(root.right, key)
  else:
    if root has no left child: return root.right
    if root has no right child: return root.left
    successor = leftmost(root.right)
    root.val = successor.val
    root.right = deleteNode(root.right, successor.val)
  return root`,
    python: `def deleteNode(root, key):
    if not root: return None
    if key < root.val:
        root.left = deleteNode(root.left, key)
    elif key > root.val:
        root.right = deleteNode(root.right, key)
    else:
        if not root.left: return root.right
        if not root.right: return root.left
        cur = root.right
        while cur.left: cur = cur.left
        root.val = cur.val
        root.right = deleteNode(root.right, cur.val)
    return root`,
    javascript: `function deleteNode(root, key) {
  if (!root) return null;
  if (key < root.val) root.left = deleteNode(root.left, key);
  else if (key > root.val) root.right = deleteNode(root.right, key);
  else {
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    let cur = root.right;
    while (cur.left) cur = cur.left;
    root.val = cur.val;
    root.right = deleteNode(root.right, cur.val);
  }
  return root;
}`,
    java: `public TreeNode deleteNode(TreeNode root, int key) {
    if (root == null) return null;
    if (key < root.val) root.left = deleteNode(root.left, key);
    else if (key > root.val) root.right = deleteNode(root.right, key);
    else {
        if (root.left == null) return root.right;
        if (root.right == null) return root.left;
        TreeNode cur = root.right;
        while (cur.left != null) cur = cur.left;
        root.val = cur.val;
        root.right = deleteNode(root.right, cur.val);
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
    },
    {
      name: 'key',
      label: 'Key to Delete',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const key = input.key as number;
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const i of visited) if (tree[i] != null) highlights[i] = 'visited';
      if (activeIdx !== null && tree[activeIdx] != null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Delete node with key=${key} from BST. Root = ${tree[0]}.`,
      variables: { key, root: tree[0] },
      visualization: makeViz(0),
    });

    function search(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Reached null. Key ${key} not found in BST.`,
          variables: { key },
          visualization: makeViz(null),
        });
        return;
      }
      const val = tree[idx] as number;
      visited.add(idx);

      if (key < val) {
        steps.push({
          line: 3,
          explanation: `key=${key} < node=${val}. Go left.`,
          variables: { key, node: val },
          visualization: makeViz(idx),
        });
        search(2 * idx + 1);
      } else if (key > val) {
        steps.push({
          line: 5,
          explanation: `key=${key} > node=${val}. Go right.`,
          variables: { key, node: val },
          visualization: makeViz(idx),
        });
        search(2 * idx + 2);
      } else {
        // Found
        const leftIdx = 2 * idx + 1;
        const rightIdx = 2 * idx + 2;
        const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
        const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

        if (!hasLeft && !hasRight) {
          steps.push({
            line: 7,
            explanation: `Found node ${val}. It's a leaf — simply remove it.`,
            variables: { deleted: val, case: 'leaf' },
            visualization: makeViz(idx),
          });
          tree[idx] = null;
        } else if (!hasLeft) {
          steps.push({
            line: 8,
            explanation: `Found node ${val}. No left child — replace with right child ${tree[rightIdx]}.`,
            variables: { deleted: val, replacement: tree[rightIdx], case: 'no left' },
            visualization: makeViz(idx),
          });
          tree[idx] = tree[rightIdx];
          tree[rightIdx] = null;
        } else if (!hasRight) {
          steps.push({
            line: 9,
            explanation: `Found node ${val}. No right child — replace with left child ${tree[leftIdx]}.`,
            variables: { deleted: val, replacement: tree[leftIdx], case: 'no right' },
            visualization: makeViz(idx),
          });
          tree[idx] = tree[leftIdx];
          tree[leftIdx] = null;
        } else {
          // Find in-order successor (leftmost in right subtree)
          let succIdx = rightIdx;
          while (2 * succIdx + 1 < tree.length && tree[2 * succIdx + 1] != null) {
            succIdx = 2 * succIdx + 1;
          }
          const succVal = tree[succIdx] as number;
          steps.push({
            line: 10,
            explanation: `Found node ${val}. Has two children. In-order successor is ${succVal} (leftmost in right subtree). Replace ${val} with ${succVal}, then delete ${succVal} from right subtree.`,
            variables: { deleted: val, successor: succVal, case: 'two children' },
            visualization: makeViz(succIdx),
          });
          tree[idx] = succVal;
          tree[succIdx] = null;
        }
      }
    }

    search(0);

    steps.push({
      line: 13,
      explanation: `Deletion of ${key} complete.`,
      variables: { key, result: tree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default deleteNodeInBSTII;
