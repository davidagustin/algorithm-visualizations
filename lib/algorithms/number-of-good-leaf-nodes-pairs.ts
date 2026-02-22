import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfGoodLeafNodesPairs: AlgorithmDefinition = {
  id: 'number-of-good-leaf-nodes-pairs',
  title: 'Number of Good Leaf Nodes Pairs',
  leetcodeNumber: 1530,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree and an integer distance, count pairs of leaf nodes whose shortest path is at most distance. Use post-order DFS: each node returns a list of distances from it to all leaf nodes in its subtree. For each node, try all pairs (one from left subtree, one from right subtree) and count pairs where left + right + 2 is at most distance.',
  tags: ['tree', 'dfs', 'post-order', 'leaf nodes'],

  code: {
    pseudocode: `function countPairs(root, distance):
  result = 0

  function dfs(node):
    nonlocal result
    if node is null: return []
    if node is leaf: return [1]  # distance 1 to this leaf
    left = dfs(node.left)
    right = dfs(node.right)
    # Try all pairs
    for l in left:
      for r in right:
        if l + r <= distance:
          result += 1
    # Increment all distances by 1 (moving up)
    return [d + 1 for d in left + right if d + 1 <= distance]

  dfs(root)
  return result`,
    python: `def countPairs(root, distance):
    res = 0
    def dfs(node):
        nonlocal res
        if not node: return []
        if not node.left and not node.right: return [1]
        left = dfs(node.left)
        right = dfs(node.right)
        for l in left:
            for r in right:
                if l + r <= distance:
                    res += 1
        return [d + 1 for d in left + right if d + 1 <= distance]
    dfs(root)
    return res`,
    javascript: `function countPairs(root, distance) {
  let res = 0;
  function dfs(node) {
    if (!node) return [];
    if (!node.left && !node.right) return [1];
    const left = dfs(node.left), right = dfs(node.right);
    for (const l of left)
      for (const r of right)
        if (l + r <= distance) res++;
    return [...left, ...right].map(d => d + 1).filter(d => d <= distance);
  }
  dfs(root);
  return res;
}`,
    java: `int res = 0;
public int countPairs(TreeNode root, int distance) {
    dfs(root, distance);
    return res;
}
private List<Integer> dfs(TreeNode node, int dist) {
    if (node == null) return new ArrayList<>();
    if (node.left == null && node.right == null) return new ArrayList<>(List.of(1));
    List<Integer> left = dfs(node.left, dist), right = dfs(node.right, dist);
    for (int l : left) for (int r : right) if (l + r <= dist) res++;
    List<Integer> out = new ArrayList<>();
    for (int d : left) if (d + 1 <= dist) out.add(d + 1);
    for (int d : right) if (d + 1 <= dist) out.add(d + 1);
    return out;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 6, 7],
    distance: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: '1,2,3,4,5,6,7',
      helperText: 'Level-order binary tree (0 = null node)',
    },
    {
      name: 'distance',
      label: 'Max Distance',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum allowed path distance between leaf pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const distance = input.distance as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count leaf pairs with path distance <= ${distance}. Post-order DFS: each node returns distances to leaf nodes in its subtree. Count pairs where leftDist + rightDist <= ${distance}.`,
      variables: { distance, result: 0 },
      visualization: makeViz({}, {}),
    });

    let result = 0;
    const nodeLeafDists: Map<number, number[]> = new Map();

    function dfs(idx: number): number[] {
      if (idx >= nums.length || nums[idx] === 0) return [];

      const li = 2 * idx + 1;
      const ri = 2 * idx + 2;
      const isLeaf = (li >= nums.length || nums[li] === 0) && (ri >= nums.length || nums[ri] === 0);

      if (isLeaf) {
        nodeLeafDists.set(idx, [1]);
        steps.push({
          line: 4,
          explanation: `Node[${idx}]=${nums[idx]} is a LEAF. Returns [1] (distance 1 from this leaf to itself).`,
          variables: { nodeIdx: idx, nodeVal: nums[idx], leafDistances: [1] },
          visualization: makeViz({ [idx]: 'found' }, { [idx]: 'leaf' }),
        });
        return [1];
      }

      const left = dfs(li);
      const right = dfs(ri);

      let newPairs = 0;
      for (const l of left) {
        for (const r of right) {
          if (l + r <= distance) {
            newPairs++;
            result++;
          }
        }
      }

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      nodeLeafDists.forEach((_, i) => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';
      labels[idx] = `+${newPairs}pairs`;

      steps.push({
        line: 10,
        explanation: `Node[${idx}]=${nums[idx]}: left leaf dists=[${left.join(',')}], right leaf dists=[${right.join(',')}]. Found ${newPairs} good pair(s) (sum <= ${distance}). Total result = ${result}.`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], leftDists: left, rightDists: right, newPairs, result },
        visualization: makeViz(highlights, labels),
      });

      const merged = [...left, ...right].map(d => d + 1).filter(d => d <= distance);
      nodeLeafDists.set(idx, merged);
      return merged;
    }

    dfs(0);

    steps.push({
      line: 14,
      explanation: `Total good leaf node pairs = ${result}.`,
      variables: { result },
      visualization: makeViz(Object.fromEntries(nums.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default numberOfGoodLeafNodesPairs;
