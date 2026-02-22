import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const sumRootToLeafNumbers: AlgorithmDefinition = {
  id: 'sum-root-to-leaf-numbers',
  title: 'Sum Root to Leaf Numbers',
  leetcodeNumber: 129,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Each root-to-leaf path in a binary tree represents a number (e.g., path 1→2→3 represents 123). Return the total sum of all root-to-leaf numbers. We use DFS, accumulating the current number by multiplying by 10 and adding each node\'s value, then summing at the leaves.',
  tags: ['Tree', 'DFS', 'Math'],
  code: {
    pseudocode: `function sumNumbers(root):
  function dfs(node, currentNum):
    if node is null: return 0
    currentNum = currentNum * 10 + node.val
    if node is leaf: return currentNum
    return dfs(node.left, currentNum) + dfs(node.right, currentNum)
  return dfs(root, 0)`,
    python: `def sumNumbers(root):
    def dfs(node, current):
        if not node:
            return 0
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
private int dfs(TreeNode node, int current) {
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
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const currentPath: number[] = [];
    let totalSum = 0;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
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
        explanation: 'Tree is empty. Sum is 0.',
        variables: { root: null, result: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find sum of all root-to-leaf numbers. Start DFS at root (${tree[0]}) with currentNum=0.`,
      variables: { root: tree[0], currentNum: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number, currentNum: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx] as number;
      const newNum = currentNum * 10 + val;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
      const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

      currentPath.push(idx);

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. CurrentNum = ${currentNum} * 10 + ${val} = ${newNum}.`,
        variables: { node: val, currentNum, newNum },
        visualization: makeViz(idx),
      });

      if (!hasLeft && !hasRight) {
        totalSum += newNum;
        const pathVals = currentPath.map(i => tree[i]);
        steps.push({
          line: 5,
          explanation: `Leaf node ${val}! Path [${pathVals.join(' -> ')}] forms number ${newNum}. Running total: ${totalSum}.`,
          variables: { leafNumber: newNum, runningTotal: totalSum, path: pathVals },
          visualization: makeViz(null, Object.fromEntries(currentPath.map(i => [i, 'found']))),
        });
        currentPath.pop();
        return newNum;
      }

      steps.push({
        line: 6,
        explanation: `Node ${val} is not a leaf. Recurse left and right with currentNum=${newNum}.`,
        variables: { node: val, currentNum: newNum },
        visualization: makeViz(idx),
      });

      const leftSum = dfs(leftIdx, newNum);
      const rightSum = dfs(rightIdx, newNum);
      const subtreeSum = leftSum + rightSum;

      steps.push({
        line: 6,
        explanation: `Back at node ${val}. Left path sum=${leftSum}, Right path sum=${rightSum}. Subtree sum=${subtreeSum}.`,
        variables: { node: val, leftSum, rightSum, subtreeSum },
        visualization: makeViz(idx),
      });

      currentPath.pop();
      return subtreeSum;
    }

    const result = dfs(0, 0);

    steps.push({
      line: 7,
      explanation: `Sum of all root-to-leaf numbers = ${result}.`,
      variables: { result },
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

export default sumRootToLeafNumbers;
