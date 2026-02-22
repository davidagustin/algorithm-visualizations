import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const countGoodNodesII: AlgorithmDefinition = {
  id: 'count-good-nodes-ii',
  title: 'Count Good Nodes in Binary Tree',
  leetcodeNumber: 1448,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree, a node X is "good" if on the path from root to X, no node has a value greater than X\'s value. Count all good nodes. Use DFS passing the maximum value seen so far on the path.',
  tags: ['Tree', 'DFS', 'Path Maximum'],
  code: {
    pseudocode: `function goodNodes(root):
  return dfs(root, -Infinity)

function dfs(node, maxSoFar):
  if node is null: return 0
  isGood = node.val >= maxSoFar ? 1 : 0
  newMax = max(maxSoFar, node.val)
  return isGood + dfs(node.left, newMax) + dfs(node.right, newMax)`,
    python: `def goodNodes(root):
    def dfs(node, max_so_far):
        if not node:
            return 0
        is_good = 1 if node.val >= max_so_far else 0
        new_max = max(max_so_far, node.val)
        return is_good + dfs(node.left, new_max) + dfs(node.right, new_max)
    return dfs(root, float('-inf'))`,
    javascript: `function goodNodes(root) {
  function dfs(node, maxSoFar) {
    if (!node) return 0;
    const isGood = node.val >= maxSoFar ? 1 : 0;
    const newMax = Math.max(maxSoFar, node.val);
    return isGood + dfs(node.left, newMax) + dfs(node.right, newMax);
  }
  return dfs(root, -Infinity);
}`,
    java: `public int goodNodes(TreeNode root) {
    return dfs(root, Integer.MIN_VALUE);
}
int dfs(TreeNode node, int maxSoFar) {
    if (node == null) return 0;
    int isGood = node.val >= maxSoFar ? 1 : 0;
    int newMax = Math.max(maxSoFar, node.val);
    return isGood + dfs(node.left, newMax) + dfs(node.right, newMax);
}`,
  },
  defaultInput: { tree: [3, 1, 4, 3, null, 1, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 1, 4, 3, null, 1, 5],
      placeholder: 'e.g. 3,1,4,3,null,1,5',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Good nodes = 0.', variables: { count: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Count good nodes. A node is good if no node on the path from root to it has a larger value.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number, maxSoFar: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);
      const val = tree[idx] as number;
      const isGood = val >= maxSoFar ? 1 : 0;
      const newMax = Math.max(maxSoFar, val);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = isGood ? 'found' : 'mismatch';

      steps.push({
        line: 5,
        explanation: `Node ${val}: maxSoFar=${maxSoFar}. ${val} >= ${maxSoFar} → isGood=${isGood === 1}. newMax=${newMax}.`,
        variables: { node: val, maxSoFar, isGood: isGood === 1, newMax },
        visualization: makeViz(highlights),
      });

      const leftCount = dfs(2 * idx + 1, newMax);
      const rightCount = dfs(2 * idx + 2, newMax);
      return isGood + leftCount + rightCount;
    }

    const totalGood = dfs(0, -Infinity);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 8,
      explanation: `Total good nodes = ${totalGood}.`,
      variables: { totalGoodNodes: totalGood },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default countGoodNodesII;
