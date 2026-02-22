import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumProductPath: AlgorithmDefinition = {
  id: 'maximum-product-path-tree',
  title: 'Maximum Product of Splitted Binary Tree',
  leetcodeNumber: 1339,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a binary tree, remove one edge to split it into two subtrees. Return the maximum product of their subtree sums modulo 1e9+7. First compute the total sum. Then for each possible split (each node\'s subtree sum), compute subSum * (totalSum - subSum) and take the maximum. Two-pass tree DP: pass 1 gets total sum and all subtree sums, pass 2 finds the best split.',
  tags: ['Tree', 'Dynamic Programming', 'DFS'],
  code: {
    pseudocode: `function maxProduct(root):
  sums = []
  function getSum(node):
    if null: return 0
    s = node.val + getSum(left) + getSum(right)
    sums.append(s)
    return s
  total = getSum(root)
  ans = 0
  for s in sums:
    ans = max(ans, s * (total - s))
  return ans % (10^9 + 7)`,
    python: `def maxProduct(root):
    MOD = 10**9 + 7
    sums = []
    def getSum(node):
        if not node: return 0
        s = node.val + getSum(node.left) + getSum(node.right)
        sums.append(s)
        return s
    total = getSum(root)
    return max(s * (total - s) for s in sums) % MOD`,
    javascript: `function maxProduct(root) {
  const MOD = 1e9 + 7;
  const sums = [];
  function getSum(node) {
    if (!node) return 0;
    const s = node.val + getSum(node.left) + getSum(node.right);
    sums.push(s);
    return s;
  }
  const total = getSum(root);
  return Math.max(...sums.map(s => s * (total - s))) % MOD;
}`,
    java: `public int maxProduct(TreeNode root) {
    List<Long> sums = new ArrayList<>();
    long total = getSum(root, sums);
    long ans = 0;
    for (long s : sums) ans = Math.max(ans, s * (total - s));
    return (int)(ans % (long)(1e9+7));
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6],
      placeholder: 'e.g. 1,2,3,4,5,6',
      helperText: 'Level-order tree. Split one edge to maximize product of subtree sums.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const subtreeSums: Record<number, number> = {};
    const MOD = 1e9 + 7;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Maximum Product of Splitted Tree: first compute all subtree sums, then find the split that maximizes subSum * (total - subSum).',
      variables: {},
      visualization: makeViz(0),
    });

    function getSum(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const leftSum = getSum(leftIdx);
      const rightSum = getSum(rightIdx);
      const s = val + leftSum + rightSum;
      subtreeSums[idx] = s;

      steps.push({
        line: 5,
        explanation: `Node ${val} at index ${idx}: subtreeSum = ${val} + ${leftSum} + ${rightSum} = ${s}.`,
        variables: { node: val, leftSum, rightSum, subtreeSum: s },
        visualization: makeViz(idx, { [idx]: 'visited' }),
      });

      return s;
    }

    const total = getSum(0);

    steps.push({
      line: 7,
      explanation: `Total tree sum = ${total}. Now check each possible split.`,
      variables: { total },
      visualization: makeViz(0, { 0: 'found' }),
    });

    let bestProduct = 0;
    let bestIdx = 0;

    for (const [idxStr, s] of Object.entries(subtreeSums)) {
      const idx = Number(idxStr);
      if (idx === 0) continue; // don't split at root
      const product = s * (total - s);
      if (product > bestProduct) {
        bestProduct = product;
        bestIdx = idx;
      }
      steps.push({
        line: 9,
        explanation: `Split edge above node ${tree[idx]}: subSum=${s}, otherSum=${total - s}. Product=${product}. Best so far=${bestProduct}.`,
        variables: { node: tree[idx], subSum: s, otherSum: total - s, product, bestProduct },
        visualization: makeViz(idx, { [idx]: product === bestProduct ? 'found' : 'comparing' }),
      });
    }

    steps.push({
      line: 10,
      explanation: `Best split at node index ${bestIdx} (value=${tree[bestIdx]}). Max product = ${bestProduct} % MOD = ${Math.floor(bestProduct) % Math.floor(MOD)}.`,
      variables: { answer: Math.floor(bestProduct) % Math.floor(MOD), bestSplit: tree[bestIdx] },
      visualization: makeViz(bestIdx, { [bestIdx]: 'found' }),
    });

    return steps;
  },
};

export default maximumProductPath;
