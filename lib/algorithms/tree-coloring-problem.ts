import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treeColoringProblem: AlgorithmDefinition = {
  id: 'tree-coloring-problem',
  title: 'Tree Coloring Problem',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Color a binary tree with k colors such that no two adjacent nodes (parent-child) share the same color. Use tree DP: dp[node][c] = minimum cost to color the subtree rooted at node with color c. For each node and color, sum the minimum cost of each child using any color different from c. Classic application of tree DP with state transitions.',
  tags: ['Tree', 'Dynamic Programming', 'Coloring', 'DFS'],
  code: {
    pseudocode: `function treeColoring(root, k, cost):
  function dfs(node) -> dp[k]:
    if null: return [0, 0, ..., 0]
    leftDP = dfs(node.left)
    rightDP = dfs(node.right)
    dp = new array[k]
    for c from 0 to k-1:
      minLeft = min(leftDP[c'] for c' != c)
      minRight = min(rightDP[c'] for c' != c)
      dp[c] = cost[node][c] + minLeft + minRight
    return dp
  return min(dfs(root))`,
    python: `def treeColoring(root, k, cost):
    def dfs(node, idx):
        if idx >= len(tree) or tree[idx] is None:
            return [0] * k
        left = dfs(node.left, 2*idx+1)
        right = dfs(node.right, 2*idx+2)
        dp = [0] * k
        for c in range(k):
            ml = min(left[c2] for c2 in range(k) if c2 != c) if any(True for c2 in range(k) if c2 != c and left[c2] < float('inf')) else 0
            mr = min(right[c2] for c2 in range(k) if c2 != c) if any(True for c2 in range(k) if c2 != c and right[c2] < float('inf')) else 0
            dp[c] = cost[idx][c] + ml + mr
        return dp
    return min(dfs(root, 0))`,
    javascript: `function treeColoring(tree, k) {
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] == null) return new Array(k).fill(0);
    const left = dfs(2*idx+1), right = dfs(2*idx+2);
    return Array.from({length:k}, (_,c) => {
      const ml = Math.min(...left.filter((_,i) => i !== c));
      const mr = Math.min(...right.filter((_,i) => i !== c));
      return (tree[idx] || 1) + ml + mr;
    });
  }
  return Math.min(...dfs(0));
}`,
    java: `int treeColoring(Integer[] tree, int k) {
    int[] res = dfs(tree, 0, k);
    int min = Integer.MAX_VALUE;
    for (int v : res) min = Math.min(min, v);
    return min;
}`,
  },
  defaultInput: { tree: [3, 1, 2, 4, 5, 1, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order, values as color costs)',
      type: 'tree',
      defaultValue: [3, 1, 2, 4, 5, 1, 3],
      placeholder: 'e.g. 3,1,2,4,5,1,3',
      helperText: 'Node values represent coloring cost. Adjacent nodes must differ.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const k = 3; // 3 colors
    const steps: AlgorithmStep[] = [];
    const dpMap: Record<number, number[]> = {};

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Tree Coloring: color with k=${k} colors, no adjacent nodes same color. dp[node][c] = min cost to color subtree with color c at root. Use post-order DP.`,
      variables: { k },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number[] {
      if (idx >= tree.length || tree[idx] == null) return new Array(k).fill(0);

      const val = tree[idx] as number;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 4,
        explanation: `Visit node ${val} at index ${idx}. Computing dp[${k} colors] using children's DP.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const left = dfs(leftIdx);
      const right = dfs(rightIdx);

      const dp: number[] = [];
      for (let c = 0; c < k; c++) {
        const ml = left.length > 0
          ? Math.min(...left.filter((_, i) => i !== c))
          : 0;
        const mr = right.length > 0
          ? Math.min(...right.filter((_, i) => i !== c))
          : 0;
        dp[c] = val + ml + mr;
      }

      dpMap[idx] = dp;

      steps.push({
        line: 9,
        explanation: `Node ${val}: dp = [${dp.join(', ')}] for colors 0..${k-1}. Each color c: cost=${val} + minLeft(excl c) + minRight(excl c).`,
        variables: { node: val, dp, left, right },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });

      return dp;
    }

    const rootDp = dfs(0);
    const minCost = Math.min(...rootDp);
    const bestColor = rootDp.indexOf(minCost);

    steps.push({
      line: 11,
      explanation: `Minimum coloring cost = ${minCost} with color ${bestColor} at root. dp[root] = [${rootDp.join(', ')}].`,
      variables: { answer: minCost, bestColor, rootDp },
      visualization: makeViz(0, { 0: 'found' }),
    });

    return steps;
  },
};

export default treeColoringProblem;
