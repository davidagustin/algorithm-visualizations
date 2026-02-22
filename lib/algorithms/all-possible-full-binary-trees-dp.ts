import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const allPossibleFullBinaryTrees: AlgorithmDefinition = {
  id: 'all-possible-full-binary-trees-dp',
  title: 'All Possible Full Binary Trees',
  leetcodeNumber: 894,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A full binary tree has every node with either 0 or 2 children. Given n (odd number), return all possible full binary trees with n nodes. Use recursive DP with memoization: for each odd left size l (1, 3, 5, ..., n-2), combine all trees of size l for left subtree with all trees of size n-l-1 for right subtree.',
  tags: ['Tree', 'Dynamic Programming', 'Recursion', 'Memoization'],
  code: {
    pseudocode: `function allPossibleFBT(n):
  memo = {}
  function dp(n):
    if n == 1: return [leaf node]
    if n in memo: return memo[n]
    result = []
    for leftSize = 1, 3, 5, ..., n-2:
      rightSize = n - 1 - leftSize
      for each leftTree in dp(leftSize):
        for each rightTree in dp(rightSize):
          root = new Node(0)
          root.left = leftTree
          root.right = rightTree
          result.append(root)
    memo[n] = result
    return result
  return dp(n)`,
    python: `def allPossibleFBT(n):
    memo = {}
    def dp(n):
        if n == 1: return [TreeNode(0)]
        if n in memo: return memo[n]
        res = []
        for l in range(1, n, 2):
            for left in dp(l):
                for right in dp(n-1-l):
                    root = TreeNode(0)
                    root.left, root.right = left, right
                    res.append(root)
        memo[n] = res
        return res
    return dp(n)`,
    javascript: `function allPossibleFBT(n) {
  const memo = new Map();
  function dp(n) {
    if (n === 1) return [{val:0,left:null,right:null}];
    if (memo.has(n)) return memo.get(n);
    const res = [];
    for (let l = 1; l < n; l += 2) {
      for (const left of dp(l))
        for (const right of dp(n-1-l))
          res.push({val:0, left, right});
    }
    memo.set(n, res);
    return res;
  }
  return dp(n);
}`,
    java: `public List<TreeNode> allPossibleFBT(int n) {
    Map<Integer, List<TreeNode>> memo = new HashMap<>();
    return dp(n, memo);
}
private List<TreeNode> dp(int n, Map<Integer, List<TreeNode>> memo) {
    if (n == 1) return List.of(new TreeNode(0));
    if (memo.containsKey(n)) return memo.get(n);
    List<TreeNode> res = new ArrayList<>();
    for (int l = 1; l < n; l += 2)
        for (TreeNode left : dp(l, memo))
            for (TreeNode right : dp(n-1-l, memo)) {
                TreeNode root = new TreeNode(0);
                root.left = left; root.right = right;
                res.add(root);
            }
    memo.put(n, res);
    return res;
}`,
  },
  defaultInput: { tree: [0, 0, 0, 0, 0, 0, 0] },
  inputFields: [
    {
      name: 'tree',
      label: 'Full Binary Tree (n=7 nodes)',
      type: 'tree',
      defaultValue: [0, 0, 0, 0, 0, 0, 0],
      placeholder: 'e.g. 0,0,0,0,0,0,0',
      helperText: 'Shows one of the full binary trees for n nodes. All non-null values shown.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const baseTree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = baseTree.filter(v => v != null).length;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < baseTree.length && baseTree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: baseTree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `All Possible Full Binary Trees with n=${n} nodes. A full binary tree has all nodes with 0 or 2 children. Use recursive DP.`,
      variables: { n },
      visualization: makeViz(0),
    });

    const memo: Record<number, number> = {};

    function countFBT(k: number): number {
      if (k % 2 === 0) return 0;
      if (k === 1) return 1;
      if (memo[k]) return memo[k];
      let count = 0;
      for (let l = 1; l < k; l += 2) {
        count += countFBT(l) * countFBT(k - 1 - l);
      }
      memo[k] = count;
      return count;
    }

    for (let size = 1; size <= n; size += 2) {
      const count = countFBT(size);
      const highlight: Record<number, string> = {};
      for (let i = 0; i < Math.min(size, baseTree.length); i++) {
        if (baseTree[i] != null) highlight[i] = 'visited';
      }
      steps.push({
        line: 6,
        explanation: `dp(${size}): there are ${count} full binary tree(s) with ${size} node(s). Each odd left size l creates subtree combinations.`,
        variables: { size, count },
        visualization: makeViz(null, highlight),
      });
    }

    const total = countFBT(n % 2 === 1 ? n : n - 1);
    steps.push({
      line: 13,
      explanation: `Total full binary trees with n=${n} nodes: ${total}. The visualization shows one example structure.`,
      variables: { n, totalTrees: total },
      visualization: makeViz(0, Object.fromEntries(
        baseTree.map((v, i) => [i, v != null ? 'found' : 'default']).filter(([, v]) => v !== 'default')
      )),
    });

    return steps;
  },
};

export default allPossibleFullBinaryTrees;
