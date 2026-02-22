import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const pathSum: AlgorithmDefinition = {
  id: 'path-sum',
  title: 'Path Sum',
  leetcodeNumber: 112,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all values along the path equals targetSum. We use DFS, subtracting the current node\'s value from the target at each step and checking if a leaf is reached with remaining = 0.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function hasPathSum(root, targetSum):
  if root is null: return false
  if root is leaf: return root.val == targetSum
  remaining = targetSum - root.val
  return hasPathSum(root.left, remaining) or
         hasPathSum(root.right, remaining)`,
    python: `def hasPathSum(root, targetSum):
    if not root:
        return False
    if not root.left and not root.right:
        return root.val == targetSum
    remaining = targetSum - root.val
    return (hasPathSum(root.left, remaining) or
            hasPathSum(root.right, remaining))`,
    javascript: `function hasPathSum(root, targetSum) {
  if (!root) return false;
  if (!root.left && !root.right) return root.val === targetSum;
  const remaining = targetSum - root.val;
  return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}`,
    java: `public boolean hasPathSum(TreeNode root, int targetSum) {
    if (root == null) return false;
    if (root.left == null && root.right == null) return root.val == targetSum;
    int remaining = targetSum - root.val;
    return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
}`,
  },
  defaultInput: { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1], targetSum: 22 },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1],
      placeholder: 'e.g. 5,4,8,11,null,13,4',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
    {
      name: 'targetSum',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 22,
      placeholder: 'e.g. 22',
      helperText: 'The target sum for a root-to-leaf path.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const targetSum = input.targetSum as number;
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const currentPath: number[] = [];
    let foundPath: number[] | null = null;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const idx of currentPath) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'comparing';
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
        explanation: 'Tree is empty. No path exists. Return false.',
        variables: { root: null, result: false },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Check if any root-to-leaf path sums to targetSum=${targetSum}. Start at root (${tree[0]}).`,
      variables: { root: tree[0], targetSum },
      visualization: makeViz(0),
    });

    function dfs(idx: number, remaining: number): boolean {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Reached null node. Return false.`,
          variables: { node: null, remaining },
          visualization: makeViz(null),
        });
        return false;
      }

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
      const hasRight = rightIdx < tree.length && tree[rightIdx] != null;
      const newRemaining = remaining - val;

      currentPath.push(idx);
      visited.add(idx);

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Remaining after subtracting: ${remaining} - ${val} = ${newRemaining}.`,
        variables: { node: val, remaining, newRemaining, isLeaf: !hasLeft && !hasRight },
        visualization: makeViz(idx),
      });

      if (!hasLeft && !hasRight) {
        const found = newRemaining === 0;
        if (found) {
          foundPath = [...currentPath];
        }
        steps.push({
          line: 3,
          explanation: `Leaf node ${val} reached. Remaining = ${newRemaining}. ${found ? 'Path found!' : 'No match.'}`,
          variables: { node: val, remaining: newRemaining, isLeaf: true, found },
          visualization: makeViz(null, found ? Object.fromEntries(currentPath.map(i => [i, 'found'])) : {}),
        });
        currentPath.pop();
        return found;
      }

      steps.push({
        line: 5,
        explanation: `Node ${val} is not a leaf. Recurse into left subtree with remaining=${newRemaining}.`,
        variables: { node: val, newRemaining },
        visualization: makeViz(idx),
      });

      const leftResult = dfs(leftIdx, newRemaining);
      if (leftResult) {
        currentPath.pop();
        return true;
      }

      steps.push({
        line: 6,
        explanation: `Left subtree returned false. Recurse into right subtree with remaining=${newRemaining}.`,
        variables: { node: val, newRemaining },
        visualization: makeViz(idx),
      });

      const rightResult = dfs(rightIdx, newRemaining);
      currentPath.pop();
      return rightResult;
    }

    const result = dfs(0, targetSum);

    steps.push({
      line: 6,
      explanation: `Path sum search complete. Result: ${result}. ${result ? `Found a path summing to ${targetSum}.` : `No root-to-leaf path sums to ${targetSum}.`}`,
      variables: { result, targetSum },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: foundPath !== null
          ? Object.fromEntries((foundPath as number[]).map(i => [i, 'found']))
          : Object.fromEntries(
              tree.map((_, i) => [i, 'visited']).filter(([i]) => tree[i as number] != null)
            ),
      },
    });

    return steps;
  },
};

export default pathSum;
