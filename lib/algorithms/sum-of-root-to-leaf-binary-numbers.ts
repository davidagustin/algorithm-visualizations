import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const sumOfRootToLeafBinaryNumbers: AlgorithmDefinition = {
  id: 'sum-of-root-to-leaf-binary-numbers',
  title: 'Sum of Root To Leaf Binary Numbers',
  leetcodeNumber: 1022,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given a binary tree where each node has value 0 or 1, each root-to-leaf path represents a binary number. Return the sum of all these binary numbers. At each step, shift the current number left (multiply by 2) and add the current node value. At leaves, add the accumulated number to the result.',
  tags: ['tree', 'DFS', 'binary', 'bit manipulation', 'path sum'],

  code: {
    pseudocode: `function sumRootToLeaf(root):
  total = 0
  function dfs(node, currentNum):
    if node is null: return
    currentNum = currentNum * 2 + node.val
    if node is leaf:
      total += currentNum
    dfs(node.left, currentNum)
    dfs(node.right, currentNum)
  dfs(root, 0)
  return total`,

    python: `def sumRootToLeaf(root):
    total = 0
    def dfs(node, curr):
        nonlocal total
        if not node: return
        curr = curr * 2 + node.val
        if not node.left and not node.right:
            total += curr
        dfs(node.left, curr)
        dfs(node.right, curr)
    dfs(root, 0)
    return total`,

    javascript: `function sumRootToLeaf(root) {
  let total = 0;
  function dfs(node, curr) {
    if (!node) return;
    curr = curr * 2 + node.val;
    if (!node.left && !node.right) total += curr;
    dfs(node.left, curr);
    dfs(node.right, curr);
  }
  dfs(root, 0);
  return total;
}`,

    java: `public int sumRootToLeaf(TreeNode root) {
    int[] total = {0};
    dfs(root, 0, total);
    return total[0];
}
private void dfs(TreeNode node, int curr, int[] total) {
    if (node == null) return;
    curr = curr * 2 + node.val;
    if (node.left == null && node.right == null) total[0] += curr;
    dfs(node.left, curr, total);
    dfs(node.right, curr, total);
}`,
  },

  defaultInput: {
    tree: [1, 0, 1, 0, 1, 0, 1],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree with 0/1 values (level-order)',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1, 0, 1],
      placeholder: '1,0,1,0,1,0,1',
      helperText: 'Level-order binary tree where each node is 0 or 1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Sum binary numbers from root-to-leaf paths in tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Accumulate binary number as we go deeper.`,
      variables: { total: 0, currentNum: 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    let total = 0;
    const leafPaths: Array<{ path: number[], value: number }> = [];
    const activePath: number[] = [];

    function dfs(pos: number, curr: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;

      const val = tree[pos] as number;
      const newCurr = curr * 2 + val;
      activePath.push(pos);

      const leftPos = 2 * pos + 1;
      const rightPos = 2 * pos + 2;
      const hasLeft = leftPos < tree.length && tree[leftPos] !== null && tree[leftPos] !== undefined;
      const hasRight = rightPos < tree.length && tree[rightPos] !== null && tree[rightPos] !== undefined;
      const isLeaf = !hasLeft && !hasRight;

      steps.push({
        line: 4,
        explanation: `Node ${val}: currentNum = ${curr} * 2 + ${val} = ${newCurr} (binary: ${newCurr.toString(2)}). ${isLeaf ? `Leaf reached! Add ${newCurr} to total.` : 'Continue deeper.'}`,
        variables: { val, prevNum: curr, newNum: newCurr, binary: newCurr.toString(2), isLeaf, total },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(activePath.slice(0, -1).map(p => [p, 'active'])),
            [pos]: isLeaf ? 'found' : 'active',
          },
        },
      });

      if (isLeaf) {
        total += newCurr;
        leafPaths.push({ path: [...activePath], value: newCurr });
        steps.push({
          line: 6,
          explanation: `Leaf! Path binary number = ${newCurr} (${newCurr.toString(2)}). total = ${total - newCurr} + ${newCurr} = ${total}.`,
          variables: { leafValue: newCurr, total, binaryPath: newCurr.toString(2) },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: Object.fromEntries(activePath.map(p => [p, 'found'])),
          },
        });
      }

      dfs(leftPos, newCurr);
      dfs(rightPos, newCurr);
      activePath.pop();
    }

    dfs(0, 0);

    steps.push({
      line: 9,
      explanation: `All paths processed. Sum of binary numbers: ${total}. Paths found: ${leafPaths.map(lp => lp.value + '(' + lp.value.toString(2) + ')').join(', ')}.`,
      variables: { result: total, pathCount: leafPaths.length },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(
          tree.map((v, i) => [i, v !== null ? 'found' : 'default'])
        ),
      },
    });

    return steps;
  },
};

export default sumOfRootToLeafBinaryNumbers;
