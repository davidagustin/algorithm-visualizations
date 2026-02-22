import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const diameterOfBinaryTree: AlgorithmDefinition = {
  id: 'diameter-of-binary-tree',
  title: 'Diameter of Binary Tree',
  leetcodeNumber: 543,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the length of the longest path between any two nodes (measured in number of edges). This path may or may not pass through the root. We use DFS: at each node, the diameter candidate is leftHeight + rightHeight, and we track the global maximum.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function diameterOfBinaryTree(root):
  maxDiameter = 0
  function dfs(node):
    if node is null: return 0
    leftH = dfs(node.left)
    rightH = dfs(node.right)
    maxDiameter = max(maxDiameter, leftH + rightH)
    return 1 + max(leftH, rightH)
  dfs(root)
  return maxDiameter`,
    python: `def diameterOfBinaryTree(root):
    max_diameter = 0
    def dfs(node):
        nonlocal max_diameter
        if not node:
            return 0
        left_h = dfs(node.left)
        right_h = dfs(node.right)
        max_diameter = max(max_diameter, left_h + right_h)
        return 1 + max(left_h, right_h)
    dfs(root)
    return max_diameter`,
    javascript: `function diameterOfBinaryTree(root) {
  let maxDiameter = 0;
  function dfs(node) {
    if (!node) return 0;
    const leftH = dfs(node.left);
    const rightH = dfs(node.right);
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH);
  }
  dfs(root);
  return maxDiameter;
}`,
    java: `int maxDiameter = 0;
public int diameterOfBinaryTree(TreeNode root) {
    dfs(root);
    return maxDiameter;
}
private int dfs(TreeNode node) {
    if (node == null) return 0;
    int leftH = dfs(node.left);
    int rightH = dfs(node.right);
    maxDiameter = Math.max(maxDiameter, leftH + rightH);
    return 1 + Math.max(leftH, rightH);
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: 'e.g. 1,2,3,4,5',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const heightMap: Record<number, number> = {};
    let maxDiameter = 0;
    let diameterNodeIdx = -1;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights, depthValues: { ...heightMap } };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Diameter is 0.',
        variables: { root: null, result: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find diameter of binary tree. At each node, diameter candidate = leftHeight + rightHeight. Track global max.`,
      variables: { root: tree[0], maxDiameter: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx] as number;
      visited.add(idx);

      steps.push({
        line: 4,
        explanation: `Visit node ${val}. Computing heights of left and right subtrees.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const leftH = dfs(leftIdx);
      const rightH = dfs(rightIdx);

      const candidate = leftH + rightH;
      if (candidate > maxDiameter) {
        maxDiameter = candidate;
        diameterNodeIdx = idx;
      }
      const myHeight = 1 + Math.max(leftH, rightH);
      heightMap[idx] = myHeight;

      steps.push({
        line: 7,
        explanation: `Node ${val}: leftH=${leftH}, rightH=${rightH}. Diameter candidate=${candidate}. MaxDiameter=${maxDiameter}. MyHeight=${myHeight}.`,
        variables: { node: val, leftH, rightH, candidate, maxDiameter, myHeight },
        visualization: makeViz(idx, candidate === maxDiameter ? { [idx]: 'comparing' } : {}),
      });

      return myHeight;
    }

    dfs(0);

    steps.push({
      line: 9,
      explanation: `Diameter of binary tree = ${maxDiameter} edges. The longest path passes through the highlighted node.`,
      variables: { diameter: maxDiameter },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: {
          ...Object.fromEntries(
            tree.map((_, i) => [i, 'visited']).filter(([i]) => tree[i as number] != null)
          ),
          ...(diameterNodeIdx >= 0 ? { [diameterNodeIdx]: 'found' } : {}),
        },
        depthValues: { ...heightMap },
      },
    });

    return steps;
  },
};

export default diameterOfBinaryTree;
