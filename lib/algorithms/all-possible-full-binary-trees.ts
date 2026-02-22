import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const allPossibleFullBinaryTrees: AlgorithmDefinition = {
  id: 'all-possible-full-binary-trees',
  title: 'All Possible Full Binary Trees',
  leetcodeNumber: 894,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an odd integer n, return all structurally unique full binary trees with exactly n nodes. A full binary tree is one where every node has 0 or 2 children. We enumerate all ways to split n-1 nodes into left and right subtrees, recursing on each split.',
  tags: ['Tree', 'Recursion', 'Dynamic Programming', 'Memoization'],
  code: {
    pseudocode: `function allPossibleFBT(n):
  if n == 1: return [new Node(0)]
  if n is even: return []
  result = []
  for leftCount in 1, 3, 5, ..., n-2:
    leftTrees = allPossibleFBT(leftCount)
    rightTrees = allPossibleFBT(n - 1 - leftCount)
    for each l in leftTrees:
      for each r in rightTrees:
        root = new Node(0)
        root.left = l; root.right = r
        result.append(root)
  return result`,
    python: `def allPossibleFBT(n):
    if n == 1: return [TreeNode(0)]
    if n % 2 == 0: return []
    res = []
    for left in range(1, n, 2):
        for l in allPossibleFBT(left):
            for r in allPossibleFBT(n - 1 - left):
                root = TreeNode(0)
                root.left, root.right = l, r
                res.append(root)
    return res`,
    javascript: `function allPossibleFBT(n) {
  if (n === 1) return [new TreeNode(0)];
  if (n % 2 === 0) return [];
  const res = [];
  for (let left = 1; left < n; left += 2) {
    for (const l of allPossibleFBT(left))
      for (const r of allPossibleFBT(n - 1 - left)) {
        const root = new TreeNode(0);
        root.left = l; root.right = r;
        res.push(root);
      }
  }
  return res;
}`,
    java: `public List<TreeNode> allPossibleFBT(int n) {
    if (n == 1) return List.of(new TreeNode(0));
    if (n % 2 == 0) return List.of();
    List<TreeNode> res = new ArrayList<>();
    for (int left = 1; left < n; left += 2) {
        for (TreeNode l : allPossibleFBT(left))
            for (TreeNode r : allPossibleFBT(n - 1 - left)) {
                TreeNode root = new TreeNode(0);
                root.left = l; root.right = r;
                res.add(root);
            }
    }
    return res;
}`,
  },
  defaultInput: { n: 7 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes (odd)',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Must be an odd number.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find all full binary trees with n=${n} nodes. Even n → no solution. For odd n, enumerate left/right splits.`,
      variables: { n },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    if (n % 2 === 0) {
      steps.push({
        line: 2,
        explanation: `n=${n} is even. No full binary tree possible with even nodes. Return [].`,
        variables: { n, result: [] },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    const memo: Record<number, number[][]> = {};

    function countTrees(nodes: number): number[][] {
      if (nodes in memo) return memo[nodes];
      if (nodes === 1) return [[0]];
      if (nodes % 2 === 0) return [];
      const result: number[][] = [];
      for (let left = 1; left < nodes; left += 2) {
        const right = nodes - 1 - left;
        const leftTrees = countTrees(left);
        const rightTrees = countTrees(right);
        steps.push({
          line: 6,
          explanation: `n=${nodes}: trying left=${left}, right=${right}. Left trees: ${leftTrees.length}, right trees: ${rightTrees.length}. Combinations: ${leftTrees.length * rightTrees.length}.`,
          variables: { totalNodes: nodes, leftSize: left, rightSize: right, leftCount: leftTrees.length, rightCount: rightTrees.length },
          visualization: { type: 'tree', nodes: Array(nodes).fill(0), highlights: { 0: 'active' } },
        });
        for (let i = 0; i < leftTrees.length * rightTrees.length; i++) {
          result.push([nodes]);
        }
      }
      memo[nodes] = result;
      return result;
    }

    const allTrees = countTrees(n);

    steps.push({
      line: 11,
      explanation: `Total unique full binary trees with ${n} nodes: ${allTrees.length}.`,
      variables: { n, totalTrees: allTrees.length },
      visualization: { type: 'tree', nodes: Array(n).fill(0), highlights: Object.fromEntries(Array(n).fill(0).map((_, i) => [i, 'found'])) },
    });

    return steps;
  },
};

export default allPossibleFullBinaryTrees;
