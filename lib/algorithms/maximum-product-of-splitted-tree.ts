import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumProductOfSplittedTree: AlgorithmDefinition = {
  id: 'maximum-product-of-splitted-tree',
  title: 'Maximum Product of Splitted Binary Tree',
  leetcodeNumber: 1339,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, remove one edge to split it into two subtrees, and return the maximum product of the two subtrees sums modulo 10^9 + 7. First compute the total sum of all nodes. Then for each subtree sum S, compute S * (total - S) and track the maximum. Use two DFS passes: first to get total sum, second to evaluate each possible split.',
  tags: ['tree', 'dfs', 'math', 'greedy'],

  code: {
    pseudocode: `function maxProduct(root):
  MOD = 10^9 + 7

  # First DFS: compute total sum
  function getSum(node):
    if node is null: return 0
    return node.val + getSum(node.left) + getSum(node.right)

  total = getSum(root)
  maxProd = 0

  # Second DFS: find best split
  function findMax(node):
    nonlocal maxProd
    if node is null: return 0
    subtreeSum = node.val + findMax(node.left) + findMax(node.right)
    maxProd = max(maxProd, subtreeSum * (total - subtreeSum))
    return subtreeSum

  findMax(root)
  return maxProd % MOD`,
    python: `def maxProduct(root):
    MOD = 10**9 + 7
    def get_sum(node):
        return 0 if not node else node.val + get_sum(node.left) + get_sum(node.right)
    total = get_sum(root)
    best = [0]
    def dfs(node):
        if not node: return 0
        s = node.val + dfs(node.left) + dfs(node.right)
        best[0] = max(best[0], s * (total - s))
        return s
    dfs(root)
    return best[0] % MOD`,
    javascript: `function maxProduct(root) {
  const MOD = 1e9 + 7;
  function getSum(node) {
    return !node ? 0 : node.val + getSum(node.left) + getSum(node.right);
  }
  const total = getSum(root);
  let best = 0;
  function dfs(node) {
    if (!node) return 0;
    const s = node.val + dfs(node.left) + dfs(node.right);
    best = Math.max(best, s * (total - s));
    return s;
  }
  dfs(root);
  return best % MOD;
}`,
    java: `long best = 0;
public int maxProduct(TreeNode root) {
    long total = getSum(root);
    dfs(root, total);
    return (int)(best % (long)(1e9 + 7));
}
private long getSum(TreeNode node) {
    return node == null ? 0 : node.val + getSum(node.left) + getSum(node.right);
}
private long dfs(TreeNode node, long total) {
    if (node == null) return 0;
    long s = node.val + dfs(node.left, total) + dfs(node.right, total);
    best = Math.max(best, s * (total - s));
    return s;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: '1,2,3,4,5,6',
      helperText: 'Level-order binary tree (0 = null node)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const MOD = 1_000_000_007;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    // First DFS: total sum
    function getSum(idx: number): number {
      if (idx >= nums.length || nums[idx] === 0) return 0;
      return nums[idx] + getSum(2 * idx + 1) + getSum(2 * idx + 2);
    }

    const total = getSum(0);

    steps.push({
      line: 1,
      explanation: `First DFS: compute total tree sum = ${total}. For each edge removal creating subtree sum S, product = S * (${total} - S).`,
      variables: { totalSum: total },
      visualization: makeViz({}, {}),
    });

    let best = 0;
    let bestSplit: number | null = null;
    const subtreeSums: Map<number, number> = new Map();

    function dfs(idx: number): number {
      if (idx >= nums.length || nums[idx] === 0) return 0;

      const s = nums[idx] + dfs(2 * idx + 1) + dfs(2 * idx + 2);
      subtreeSums.set(idx, s);

      const product = s * (total - s);
      const prevBest = best;
      best = Math.max(best, product);
      if (product > prevBest) bestSplit = idx;

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      subtreeSums.forEach((sum, i) => {
        const p = sum * (total - sum);
        highlights[i] = p === best ? 'found' : 'visited';
        labels[i] = `s=${sum}`;
      });
      highlights[idx] = product === best ? 'found' : 'active';
      labels[idx] = `s=${s},p=${product}`;

      steps.push({
        line: 14,
        explanation: `Subtree rooted at index ${idx} (val=${nums[idx]}): subtreeSum=${s}. If we cut this edge: product = ${s} * ${total - s} = ${product}. Best so far = ${best}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], subtreeSum: s, otherSum: total - s, product, best },
        visualization: makeViz(highlights, labels),
      });

      return s;
    }

    dfs(0);

    steps.push({
      line: 17,
      explanation: `Maximum product = ${best}. Result mod 10^9+7 = ${best % MOD}. Best split at index ${bestSplit} (subtree sum ${bestSplit !== null ? subtreeSums.get(bestSplit) : '?'}).`,
      variables: { result: best % MOD, bestProduct: best, bestSplitIdx: bestSplit },
      visualization: makeViz(
        Object.fromEntries([...subtreeSums.entries()].map(([i, s]) => [i, s * (total - s) === best ? 'found' : 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default maximumProductOfSplittedTree;
