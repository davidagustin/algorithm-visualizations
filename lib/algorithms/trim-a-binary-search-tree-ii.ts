import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const trimABinarySearchTreeII: AlgorithmDefinition = {
  id: 'trim-a-binary-search-tree-ii',
  title: 'Trim a Binary Search Tree II',
  leetcodeNumber: 669,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST and bounds [low, high], trim the BST so all values lie within [low, high]. If a node value is less than low, its left subtree is also out of range — return trimmed right subtree. If greater than high, return trimmed left subtree. Otherwise trim both children.',
  tags: ['Tree', 'BST', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function trimBST(root, low, high):
  if root is null: return null
  if root.val < low:
    return trimBST(root.right, low, high)
  if root.val > high:
    return trimBST(root.left, low, high)
  root.left = trimBST(root.left, low, high)
  root.right = trimBST(root.right, low, high)
  return root`,
    python: `def trimBST(root, low, high):
    if not root: return None
    if root.val < low:
        return trimBST(root.right, low, high)
    if root.val > high:
        return trimBST(root.left, low, high)
    root.left = trimBST(root.left, low, high)
    root.right = trimBST(root.right, low, high)
    return root`,
    javascript: `function trimBST(root, low, high) {
  if (!root) return null;
  if (root.val < low) return trimBST(root.right, low, high);
  if (root.val > high) return trimBST(root.left, low, high);
  root.left = trimBST(root.left, low, high);
  root.right = trimBST(root.right, low, high);
  return root;
}`,
    java: `public TreeNode trimBST(TreeNode root, int low, int high) {
    if (root == null) return null;
    if (root.val < low) return trimBST(root.right, low, high);
    if (root.val > high) return trimBST(root.left, low, high);
    root.left = trimBST(root.left, low, high);
    root.right = trimBST(root.right, low, high);
    return root;
}`,
  },
  defaultInput: { tree: [3, 0, 4, null, 2, null, null, null, 1], low: 1, high: 3 },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [3, 0, 4, null, 2, null, null, null, 1],
      placeholder: 'e.g. 3,0,4,null,2,null,null,null,1',
    },
    {
      name: 'low',
      label: 'Low Bound',
      type: 'number',
      defaultValue: 1,
      placeholder: 'e.g. 1',
    },
    {
      name: 'high',
      label: 'High Bound',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const low = input.low as number;
    const high = input.high as number;
    const steps: AlgorithmStep[] = [];
    const trimmed = new Set<number>();
    const kept = new Set<number>();

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const i of kept) highlights[i] = 'found';
      for (const i of trimmed) highlights[i] = 'swapping';
      if (activeIdx !== null && tree[activeIdx] != null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    function trim(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      const val = tree[idx] as number;

      if (val < low) {
        trimmed.add(idx);
        steps.push({
          line: 3,
          explanation: `Node ${val} < low=${low}. Trim this node and left subtree. Continue right.`,
          variables: { node: val, low, high, action: 'trim (too small)' },
          visualization: makeViz(idx),
        });
        trim(2 * idx + 2);
      } else if (val > high) {
        trimmed.add(idx);
        steps.push({
          line: 5,
          explanation: `Node ${val} > high=${high}. Trim this node and right subtree. Continue left.`,
          variables: { node: val, low, high, action: 'trim (too large)' },
          visualization: makeViz(idx),
        });
        trim(2 * idx + 1);
      } else {
        kept.add(idx);
        steps.push({
          line: 7,
          explanation: `Node ${val} is in [${low}, ${high}]. Keep it, trim both children.`,
          variables: { node: val, low, high, action: 'keep' },
          visualization: makeViz(idx),
        });
        trim(2 * idx + 1);
        trim(2 * idx + 2);
      }
    }

    steps.push({
      line: 1,
      explanation: `Trim BST to keep only nodes with values in [${low}, ${high}]. Root = ${tree[0]}.`,
      variables: { low, high, root: tree[0] },
      visualization: makeViz(0),
    });

    trim(0);

    steps.push({
      line: 9,
      explanation: `Trimming complete. Kept: [${[...kept].map(i => tree[i]).join(',')}], Removed: [${[...trimmed].map(i => tree[i]).join(',')}].`,
      variables: { kept: [...kept].map(i => tree[i]), removed: [...trimmed].map(i => tree[i]) },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default trimABinarySearchTreeII;
