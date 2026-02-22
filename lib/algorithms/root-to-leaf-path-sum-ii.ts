import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const rootToLeafPathSumII: AlgorithmDefinition = {
  id: 'root-to-leaf-path-sum-ii',
  title: 'Path Sum (Root to Leaf)',
  leetcodeNumber: 112,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree and a target sum, return true if there is a root-to-leaf path such that adding up all the values along the path equals targetSum. Use recursive DFS: subtract node value from target and check if any leaf gives remaining = 0.',
  tags: ['Tree', 'DFS', 'Path Sum'],
  code: {
    pseudocode: `function hasPathSum(root, targetSum):
  if root is null: return false
  if isLeaf(root): return root.val == targetSum
  remaining = targetSum - root.val
  return hasPathSum(root.left, remaining) or
         hasPathSum(root.right, remaining)`,
    python: `def hasPathSum(root, targetSum):
    if not root:
        return False
    if not root.left and not root.right:
        return root.val == targetSum
    remaining = targetSum - root.val
    return hasPathSum(root.left, remaining) or hasPathSum(root.right, remaining)`,
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
      placeholder: 'e.g. 5,4,8,11,null,13,4,7,2',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
    {
      name: 'targetSum',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 22,
      placeholder: 'e.g. 22',
      helperText: 'The target path sum to find.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const targetSum = input.targetSum as number;
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    let found = false;

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return false.', variables: { result: false }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Check if any root-to-leaf path sums to ${targetSum}.`,
      variables: { targetSum },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number, remaining: number): boolean {
      if (idx >= tree.length || tree[idx] == null) return false;
      visited.add(idx);
      const val = tree[idx] as number;
      const newRemaining = remaining - val;

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const isLeaf = (l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null);

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Remaining = ${remaining} - ${val} = ${newRemaining}. isLeaf=${isLeaf}.`,
        variables: { node: val, remaining: newRemaining, isLeaf },
        visualization: makeViz(highlights),
      });

      if (isLeaf) {
        if (newRemaining === 0) {
          found = true;
          steps.push({
            line: 3,
            explanation: `Leaf ${val} found with remaining=0! Path sum = ${targetSum}. Return true.`,
            variables: { node: val, result: true },
            visualization: makeViz({ ...highlights, [idx]: 'found' }),
          });
          return true;
        }
        steps.push({
          line: 3,
          explanation: `Leaf ${val} but remaining=${newRemaining} ≠ 0. Return false.`,
          variables: { node: val, remaining: newRemaining, result: false },
          visualization: makeViz({ ...highlights, [idx]: 'mismatch' }),
        });
        return false;
      }

      const leftResult = dfs(l, newRemaining);
      if (leftResult) return true;
      return dfs(r, newRemaining);
    }

    const result = dfs(0, targetSum);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = found ? 'found' : 'visited'; });

    steps.push({
      line: 5,
      explanation: `hasPathSum = ${result}. ${result ? 'A valid path was found!' : 'No valid path found.'}`,
      variables: { result, targetSum },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default rootToLeafPathSumII;
