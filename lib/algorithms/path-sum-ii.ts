import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const pathSumII: AlgorithmDefinition = {
  id: 'path-sum-ii',
  title: 'Path Sum II',
  leetcodeNumber: 113,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree and an integer targetSum, return all root-to-leaf paths where the sum of values equals targetSum. We use DFS backtracking: at each node, subtract the value from the remaining sum and track the current path. When a leaf is reached and remaining is 0, add the path to results.',
  tags: ['Tree', 'DFS', 'Backtracking'],
  code: {
    pseudocode: `function pathSum(root, targetSum):
  result = []
  function dfs(node, remaining, path):
    if node is null: return
    path.append(node.val)
    remaining -= node.val
    if node is leaf and remaining == 0:
      result.append(path.copy())
    else:
      dfs(node.left, remaining, path)
      dfs(node.right, remaining, path)
    path.pop()
  dfs(root, targetSum, [])
  return result`,
    python: `def pathSum(root, targetSum):
    result = []
    def dfs(node, remaining, path):
        if not node:
            return
        path.append(node.val)
        remaining -= node.val
        if not node.left and not node.right and remaining == 0:
            result.append(path[:])
        else:
            dfs(node.left, remaining, path)
            dfs(node.right, remaining, path)
        path.pop()
    dfs(root, targetSum, [])
    return result`,
    javascript: `function pathSum(root, targetSum) {
  const result = [];
  function dfs(node, remaining, path) {
    if (!node) return;
    path.push(node.val);
    remaining -= node.val;
    if (!node.left && !node.right && remaining === 0) {
      result.push([...path]);
    } else {
      dfs(node.left, remaining, path);
      dfs(node.right, remaining, path);
    }
    path.pop();
  }
  dfs(root, targetSum, []);
  return result;
}`,
    java: `public List<List<Integer>> pathSum(TreeNode root, int targetSum) {
    List<List<Integer>> result = new ArrayList<>();
    dfs(root, targetSum, new ArrayList<>(), result);
    return result;
}
private void dfs(TreeNode node, int remaining, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;
    path.add(node.val);
    remaining -= node.val;
    if (node.left == null && node.right == null && remaining == 0) {
        result.add(new ArrayList<>(path));
    } else {
        dfs(node.left, remaining, path, result);
        dfs(node.right, remaining, path, result);
    }
    path.remove(path.size() - 1);
}`,
  },
  defaultInput: { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, null, 1], targetSum: 22 },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, null, 1],
      placeholder: 'e.g. 5,4,8,11,null,13,4,7,2',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
    {
      name: 'targetSum',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 22,
      placeholder: 'e.g. 22',
      helperText: 'The target sum for root-to-leaf paths.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const targetSum = input.targetSum as number;
    const steps: AlgorithmStep[] = [];
    const currentPathIndices: number[] = [];
    const foundPaths: number[][] = [];

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of currentPathIndices) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'comparing';
      }
      for (const path of foundPaths) {
        for (const idx of path) {
          if (idx < tree.length && tree[idx] != null) highlights[idx] = 'found';
        }
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. No paths found.',
        variables: { root: null, result: [] },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find all root-to-leaf paths summing to targetSum=${targetSum}. Start DFS at root (${tree[0]}).`,
      variables: { root: tree[0], targetSum },
      visualization: makeViz(0),
    });

    function dfs(idx: number, remaining: number, pathVals: number[]): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const val = tree[idx] as number;
      const newRemaining = remaining - val;
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const hasLeft = leftIdx < tree.length && tree[leftIdx] != null;
      const hasRight = rightIdx < tree.length && tree[rightIdx] != null;

      currentPathIndices.push(idx);
      pathVals.push(val);

      steps.push({
        line: 3,
        explanation: `Visit node ${val}. Current path: [${pathVals.join(' -> ')}]. Remaining: ${remaining} - ${val} = ${newRemaining}.`,
        variables: { node: val, path: [...pathVals], remaining: newRemaining },
        visualization: makeViz(idx),
      });

      if (!hasLeft && !hasRight) {
        if (newRemaining === 0) {
          foundPaths.push([...currentPathIndices]);
          steps.push({
            line: 7,
            explanation: `Leaf node ${val} reached with remaining=0! Path [${pathVals.join(', ')}] sums to ${targetSum}. Add to result.`,
            variables: { path: [...pathVals], found: true, totalPaths: foundPaths.length },
            visualization: makeViz(null, Object.fromEntries(currentPathIndices.map(i => [i, 'found']))),
          });
        } else {
          steps.push({
            line: 7,
            explanation: `Leaf node ${val} reached but remaining=${newRemaining} != 0. Path does not sum to target.`,
            variables: { path: [...pathVals], found: false, remaining: newRemaining },
            visualization: makeViz(idx),
          });
        }
      } else {
        if (hasLeft) {
          steps.push({
            line: 9,
            explanation: `Node ${val}: recurse into left subtree.`,
            variables: { node: val, remaining: newRemaining },
            visualization: makeViz(idx),
          });
          dfs(leftIdx, newRemaining, pathVals);
        }
        if (hasRight) {
          steps.push({
            line: 10,
            explanation: `Node ${val}: recurse into right subtree.`,
            variables: { node: val, remaining: newRemaining },
            visualization: makeViz(idx),
          });
          dfs(rightIdx, newRemaining, pathVals);
        }
      }

      currentPathIndices.pop();
      pathVals.pop();

      steps.push({
        line: 11,
        explanation: `Backtrack from node ${val}. Path restored to [${pathVals.join(' -> ') || 'empty'}].`,
        variables: { backtrackFrom: val, path: [...pathVals] },
        visualization: makeViz(null),
      });
    }

    dfs(0, targetSum, []);

    const resultPaths = foundPaths.map(path => path.map(i => tree[i] as number));

    steps.push({
      line: 13,
      explanation: `Search complete. Found ${resultPaths.length} path(s) summing to ${targetSum}: ${JSON.stringify(resultPaths)}.`,
      variables: { result: resultPaths, count: resultPaths.length },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          foundPaths.flatMap(path => path.map(i => [i, 'found']))
        ),
      },
    });

    return steps;
  },
};

export default pathSumII;
