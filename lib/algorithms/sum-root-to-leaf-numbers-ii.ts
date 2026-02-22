import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const sumRootToLeafNumbersII: AlgorithmDefinition = {
  id: 'sum-root-to-leaf-numbers-ii',
  title: 'Sum Root to Leaf Numbers',
  leetcodeNumber: 129,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Each root-to-leaf path in the tree represents a number. For example, path 1->2->3 represents 123. Return the total sum of all root-to-leaf numbers. Use DFS, passing the accumulated number down: num = num*10 + node.val.',
  tags: ['Tree', 'DFS', 'Math'],
  code: {
    pseudocode: `function sumNumbers(root):
  return dfs(root, 0)

function dfs(node, currentNum):
  if node is null: return 0
  currentNum = currentNum * 10 + node.val
  if isLeaf(node): return currentNum
  return dfs(node.left, currentNum) + dfs(node.right, currentNum)`,
    python: `def sumNumbers(root):
    def dfs(node, current):
        if not node: return 0
        current = current * 10 + node.val
        if not node.left and not node.right:
            return current
        return dfs(node.left, current) + dfs(node.right, current)
    return dfs(root, 0)`,
    javascript: `function sumNumbers(root) {
  function dfs(node, current) {
    if (!node) return 0;
    current = current * 10 + node.val;
    if (!node.left && !node.right) return current;
    return dfs(node.left, current) + dfs(node.right, current);
  }
  return dfs(root, 0);
}`,
    java: `public int sumNumbers(TreeNode root) {
    return dfs(root, 0);
}
int dfs(TreeNode node, int current) {
    if (node == null) return 0;
    current = current * 10 + node.val;
    if (node.left == null && node.right == null) return current;
    return dfs(node.left, current) + dfs(node.right, current);
}`,
  },
  defaultInput: { tree: [1, 2, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3],
      placeholder: 'e.g. 1,2,3',
      helperText: 'Level-order array. Single-digit values recommended.',
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
      steps.push({ line: 2, explanation: 'Tree is empty. Sum = 0.', variables: { sum: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Sum all root-to-leaf numbers. Each path forms a number (e.g., 1->2->3 = 123).',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number, current: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);
      const val = tree[idx] as number;
      const newNum = current * 10 + val;

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const isLeaf = (l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null);

      steps.push({
        line: 4,
        explanation: `Node ${val}: currentNum = ${current}*10 + ${val} = ${newNum}. isLeaf=${isLeaf}.`,
        variables: { node: val, currentNum: newNum, isLeaf },
        visualization: makeViz(highlights),
      });

      if (isLeaf) {
        steps.push({
          line: 6,
          explanation: `Leaf reached! This path contributes ${newNum} to the total sum.`,
          variables: { leafNumber: newNum },
          visualization: makeViz({ ...highlights, [idx]: 'found' }),
        });
        return newNum;
      }

      const leftSum = dfs(l, newNum);
      const rightSum = dfs(r, newNum);
      const total = leftSum + rightSum;

      steps.push({
        line: 7,
        explanation: `Node ${val}: leftSum=${leftSum}, rightSum=${rightSum}. Subtree contributes ${total}.`,
        variables: { node: val, leftSum, rightSum, subtreeSum: total },
        visualization: makeViz(highlights),
      });

      return total;
    }

    const totalSum = dfs(0, 0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 8,
      explanation: `Total sum of all root-to-leaf numbers = ${totalSum}.`,
      variables: { totalSum },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default sumRootToLeafNumbersII;
