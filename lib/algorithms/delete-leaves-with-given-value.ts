import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deleteLeavesWithGivenValue: AlgorithmDefinition = {
  id: 'delete-leaves-with-given-value',
  title: 'Delete Leaves With a Given Value',
  leetcodeNumber: 1325,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree and a target value, delete all leaf nodes equal to target. After deleting, if the parent becomes a leaf equal to target, also delete it. Repeat until no more deletions are possible. Use post-order DFS: process children first, then check if the current node became a leaf with value target.',
  tags: ['tree', 'dfs', 'post-order', 'recursion'],

  code: {
    pseudocode: `function removeLeafNodes(root, target):
  function dfs(node):
    if node is null: return null
    node.left = dfs(node.left)
    node.right = dfs(node.right)
    # Check if current node is now a leaf with target value
    if node.left is null and node.right is null
       and node.val == target:
      return null  # delete this node
    return node

  return dfs(root)`,
    python: `def removeLeafNodes(root, target):
    def dfs(node):
        if not node: return None
        node.left = dfs(node.left)
        node.right = dfs(node.right)
        if not node.left and not node.right and node.val == target:
            return None
        return node
    return dfs(root)`,
    javascript: `function removeLeafNodes(root, target) {
  function dfs(node) {
    if (!node) return null;
    node.left = dfs(node.left);
    node.right = dfs(node.right);
    if (!node.left && !node.right && node.val === target)
      return null;
    return node;
  }
  return dfs(root);
}`,
    java: `public TreeNode removeLeafNodes(TreeNode root, int target) {
    if (root == null) return null;
    root.left = removeLeafNodes(root.left, target);
    root.right = removeLeafNodes(root.right, target);
    if (root.left == null && root.right == null && root.val == target)
        return null;
    return root;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 2, 0, 2, 4],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 3, 2, 0, 2, 4],
      placeholder: '1,2,3,2,0,2,4',
      helperText: 'Level-order binary tree (0 = null node)',
    },
    {
      name: 'target',
      label: 'Target Value',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Leaf node value to delete',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Delete all leaf nodes with value ${target}. Use post-order DFS: process children first, then check if current node is a leaf equal to target.`,
      variables: { target },
      visualization: makeViz({}, {}),
    });

    const deleted = new Set<number>();

    function isLeaf(idx: number): boolean {
      const l = 2 * idx + 1;
      const r = 2 * idx + 2;
      const hasLeft = l < nums.length && nums[l] !== 0 && !deleted.has(l);
      const hasRight = r < nums.length && nums[r] !== 0 && !deleted.has(r);
      return !hasLeft && !hasRight;
    }

    function dfs(idx: number): boolean {
      if (idx >= nums.length || nums[idx] === 0 || deleted.has(idx)) return false;

      const l = 2 * idx + 1;
      const r = 2 * idx + 2;

      dfs(l);
      dfs(r);

      const h: Record<number, string> = {};
      const lbl: Record<number, string> = {};

      nums.forEach((v, i) => {
        if (v !== 0) {
          h[i] = deleted.has(i) ? 'mismatch' : 'visited';
        }
      });
      h[idx] = 'active';
      lbl[idx] = `val=${nums[idx]}`;

      const leaf = isLeaf(idx);
      const shouldDelete = leaf && nums[idx] === target;

      steps.push({
        line: shouldDelete ? 7 : 8,
        explanation: `Node[${idx}]=${nums[idx]}: isLeaf=${leaf}, val==target(${target})=${nums[idx] === target}. ${shouldDelete ? 'DELETE this node!' : 'Keep this node.'}`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], isLeaf: leaf, shouldDelete },
        visualization: makeViz(h, lbl),
      });

      if (shouldDelete) {
        deleted.add(idx);
        const h2: Record<number, string> = {};
        nums.forEach((v, i) => {
          if (v !== 0) h2[i] = deleted.has(i) ? 'mismatch' : 'sorted';
        });
        steps.push({
          line: 8,
          explanation: `Deleted node[${idx}]=${nums[idx]} (was leaf with target value). Total deleted: ${deleted.size}.`,
          variables: { deleted: [...deleted].map(i => nums[i]) },
          visualization: makeViz(h2, {}),
        });
      }

      return shouldDelete;
    }

    dfs(0);

    const finalH: Record<number, string> = {};
    nums.forEach((v, i) => {
      if (v !== 0) finalH[i] = deleted.has(i) ? 'mismatch' : 'found';
    });

    steps.push({
      line: 10,
      explanation: `Deletion complete. Removed ${deleted.size} leaf node(s) with value ${target}. Remaining nodes shown in green.`,
      variables: { deletedCount: deleted.size, deletedVals: [...deleted].map(i => nums[i]) },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default deleteLeavesWithGivenValue;
