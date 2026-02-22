import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maxSumContinuousPath: AlgorithmDefinition = {
  id: 'max-sum-continuous-path',
  title: 'Max Sum Continuous Path',
  leetcodeNumber: 124,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Find the maximum path sum in a binary tree. A path is any sequence of connected nodes (not necessarily through the root). At each node, we compute the best single-branch sum (to extend upward) and also check if using the node as a "bend" (left + node + right) gives a better global max.',
  tags: ['Tree', 'DFS', 'Dynamic Programming'],
  code: {
    pseudocode: `function maxPathSum(root):
  globalMax = -infinity
  dfs(root)
  return globalMax

function dfs(node):
  if node is null: return 0
  left = max(0, dfs(node.left))
  right = max(0, dfs(node.right))
  globalMax = max(globalMax, left + right + node.val)
  return max(left, right) + node.val`,
    python: `def maxPathSum(root):
    global_max = [float('-inf')]
    def dfs(node):
        if not node:
            return 0
        left = max(0, dfs(node.left))
        right = max(0, dfs(node.right))
        global_max[0] = max(global_max[0], left + right + node.val)
        return max(left, right) + node.val
    dfs(root)
    return global_max[0]`,
    javascript: `function maxPathSum(root) {
  let globalMax = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const left = Math.max(0, dfs(node.left));
    const right = Math.max(0, dfs(node.right));
    globalMax = Math.max(globalMax, left + right + node.val);
    return Math.max(left, right) + node.val;
  }
  dfs(root);
  return globalMax;
}`,
    java: `int globalMax = Integer.MIN_VALUE;
public int maxPathSum(TreeNode root) {
    dfs(root);
    return globalMax;
}
int dfs(TreeNode node) {
    if (node == null) return 0;
    int left = Math.max(0, dfs(node.left));
    int right = Math.max(0, dfs(node.right));
    globalMax = Math.max(globalMax, left + right + node.val);
    return Math.max(left, right) + node.val;
}`,
  },
  defaultInput: { tree: [-10, 9, 20, null, null, 15, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [-10, 9, 20, null, null, 15, 7],
      placeholder: 'e.g. -10,9,20,null,null,15,7',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let globalMax = -Infinity;
    const visited = new Set<number>();

    function makeViz(activeIdx: number | null, pathIndices: number[] = [], extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'visited';
        }
      }
      for (const pi of pathIndices) {
        if (pi < tree.length && tree[pi] != null) {
          highlights[pi] = 'found';
        }
      }
      for (const [k, v] of Object.entries(extra)) {
        highlights[Number(k)] = v;
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 7,
        explanation: 'The tree is empty. No path exists.',
        variables: { globalMax: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start maxPathSum. Root = ${tree[0]}. globalMax starts at -infinity. DFS computes best single-branch sum at each node.`,
      variables: { root: tree[0], globalMax: '-inf' },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 7,
          explanation: `Node at index ${idx} is null. Return 0.`,
          variables: { node: null, returned: 0 },
          visualization: makeViz(null),
        });
        return 0;
      }

      const val = tree[idx] as number;

      steps.push({
        line: 6,
        explanation: `Visit node ${val} (index ${idx}). Recurse into left subtree first.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const rawLeft = dfs(leftIdx);
      const left = Math.max(0, rawLeft);

      steps.push({
        line: 8,
        explanation: `Back at node ${val}. Raw left = ${rawLeft}, clamped left = max(0, ${rawLeft}) = ${left}. Now recurse right.`,
        variables: { node: val, rawLeft, left },
        visualization: makeViz(idx),
      });

      const rawRight = dfs(rightIdx);
      const right = Math.max(0, rawRight);

      const pathSum = left + right + val;
      const prevMax = globalMax;
      globalMax = Math.max(globalMax, pathSum);

      visited.add(idx);

      steps.push({
        line: 10,
        explanation: `Node ${val}: left=${left}, right=${right}. Path through this node = ${left}+${val}+${right} = ${pathSum}. globalMax = max(${prevMax === -Infinity ? '-inf' : prevMax}, ${pathSum}) = ${globalMax}${pathSum > prevMax ? ' (new max!)' : ''}.`,
        variables: { node: val, left, right, pathSum, globalMax },
        visualization: makeViz(idx, [], { [idx]: pathSum >= globalMax ? 'found' : 'comparing' }),
      });

      const returnVal = Math.max(left, right) + val;

      steps.push({
        line: 11,
        explanation: `Node ${val} returns max(${left}, ${right}) + ${val} = ${returnVal} as best single-branch sum to parent.`,
        variables: { node: val, returnVal },
        visualization: makeViz(idx),
      });

      return returnVal;
    }

    dfs(0);

    steps.push({
      line: 4,
      explanation: `DFS complete. Maximum path sum = ${globalMax}.`,
      variables: { maxPathSum: globalMax },
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

export default maxSumContinuousPath;
