import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const numberOfGoodLeafPairs: AlgorithmDefinition = {
  id: 'number-of-good-leaf-pairs-dp',
  title: 'Number of Good Leaf Node Pairs',
  leetcodeNumber: 1530,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a binary tree and integer distance, count pairs of leaf nodes whose shortest path distance is <= distance. Use tree DP: each dfs call returns an array of distances from current node to all leaves in its subtree. At each node, combine left and right leaf distance arrays, count pairs with sum <= distance, and return shifted-up distances.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function countPairs(root, distance):
  ans = 0
  function dfs(node) -> list of leaf distances:
    if null: return []
    if leaf: return [1]
    left = dfs(node.left)
    right = dfs(node.right)
    for ld in left:
      for rd in right:
        if ld + rd <= distance: ans++
    return [d+1 for d in left+right if d+1 <= distance]
  dfs(root)
  return ans`,
    python: `def countPairs(root, distance):
    ans = 0
    def dfs(node):
        nonlocal ans
        if not node: return []
        if not node.left and not node.right: return [1]
        left = dfs(node.left)
        right = dfs(node.right)
        for l in left:
            for r in right:
                if l + r <= distance: ans += 1
        return [d+1 for d in left+right if d+1 <= distance]
    dfs(root)
    return ans`,
    javascript: `function countPairs(root, distance) {
  let ans = 0;
  function dfs(node) {
    if (!node) return [];
    if (!node.left && !node.right) return [1];
    const left = dfs(node.left), right = dfs(node.right);
    for (const l of left) for (const r of right)
      if (l + r <= distance) ans++;
    return [...left, ...right].map(d => d+1).filter(d => d <= distance);
  }
  dfs(root);
  return ans;
}`,
    java: `public int countPairs(TreeNode root, int distance) {
    int[] ans = {0};
    dfs(root, distance, ans);
    return ans[0];
}
private List<Integer> dfs(TreeNode node, int dist, int[] ans) {
    if (node == null) return new ArrayList<>();
    if (node.left == null && node.right == null) return List.of(1);
    List<Integer> left = dfs(node.left, dist, ans), right = dfs(node.right, dist, ans);
    for (int l : left) for (int r : right) if (l+r <= dist) ans[0]++;
    List<Integer> res = new ArrayList<>();
    for (int d : left) if (d+1 <= dist) res.add(d+1);
    for (int d : right) if (d+1 <= dist) res.add(d+1);
    return res;
}`,
  },
  defaultInput: { tree: [1, 2, 3, null, 4] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, null, 4],
      placeholder: 'e.g. 1,2,3,null,4',
      helperText: 'Level-order tree. Leaf pairs with path distance <= 3 are counted.',
    },
    {
      name: 'distance',
      label: 'Max Distance',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Maximum allowed distance between leaf pairs.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const distance = (input.distance as number) ?? 3;
    const steps: AlgorithmStep[] = [];
    let ans = 0;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Good Leaf Pairs: count pairs of leaves with path <= ${distance}. Tree DP returns leaf-distance arrays from each node.`,
      variables: { distance, ans: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number[] {
      if (idx >= tree.length || tree[idx] == null) return [];

      const val = tree[idx];
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const isLeaf = (leftIdx >= tree.length || tree[leftIdx] == null) &&
        (rightIdx >= tree.length || tree[rightIdx] == null);

      if (isLeaf) {
        steps.push({
          line: 4,
          explanation: `Node ${val} at index ${idx} is a leaf. Return [1] (distance 1 to itself).`,
          variables: { node: val, distances: [1] },
          visualization: makeViz(idx, { [idx]: 'pointer' }),
        });
        return [1];
      }

      steps.push({
        line: 5,
        explanation: `Visit internal node ${val} at index ${idx}. Getting leaf distances from children.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const left = dfs(leftIdx);
      const right = dfs(rightIdx);

      // Count good pairs
      for (const l of left) {
        for (const r of right) {
          if (l + r <= distance) {
            ans++;
            steps.push({
              line: 8,
              explanation: `Good pair found! Left leaf dist=${l}, right leaf dist=${r}, total=${l+r} <= ${distance}. ans=${ans}.`,
              variables: { leftDist: l, rightDist: r, total: l+r, ans },
              visualization: makeViz(idx, { [idx]: 'found' }),
            });
          }
        }
      }

      const result = [...left, ...right].map(d => d + 1).filter(d => d <= distance);

      steps.push({
        line: 9,
        explanation: `Node ${val}: returning ${JSON.stringify(result)} (distances incremented by 1, pruned > ${distance}).`,
        variables: { node: val, returning: result },
        visualization: makeViz(idx, { [idx]: 'visited' }),
      });

      return result;
    }

    dfs(0);

    steps.push({
      line: 10,
      explanation: `Total good leaf pairs with distance <= ${distance}: ${ans}.`,
      variables: { answer: ans },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default numberOfGoodLeafPairs;
