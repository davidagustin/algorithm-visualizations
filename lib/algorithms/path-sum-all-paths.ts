import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const pathSumAllPaths: AlgorithmDefinition = {
  id: 'path-sum-all-paths',
  title: 'Path Sum II (All Paths)',
  leetcodeNumber: 113,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree and a target sum, return all root-to-leaf paths where the sum of node values equals targetSum. Use DFS with backtracking: explore each path, and when a leaf is reached with the remaining sum = 0, record the path.',
  tags: ['Tree', 'DFS', 'Backtracking', 'Path Sum'],
  code: {
    pseudocode: `function pathSum(root, target):
  result = []
  dfs(root, target, [], result)
  return result

function dfs(node, remaining, path, result):
  if node is null: return
  path.append(node.val)
  remaining -= node.val
  if isLeaf(node) and remaining == 0:
    result.append(path.copy())
  else:
    dfs(node.left, remaining, path, result)
    dfs(node.right, remaining, path, result)
  path.pop()`,
    python: `def pathSum(root, targetSum):
    result = []
    def dfs(node, remaining, path):
        if not node: return
        path.append(node.val)
        remaining -= node.val
        if not node.left and not node.right and remaining == 0:
            result.append(list(path))
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
    if (!node.left && !node.right && remaining === 0)
      result.push([...path]);
    else {
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
void dfs(TreeNode node, int remaining, List<Integer> path, List<List<Integer>> result) {
    if (node == null) return;
    path.add(node.val);
    remaining -= node.val;
    if (node.left == null && node.right == null && remaining == 0)
        result.add(new ArrayList<>(path));
    else { dfs(node.left, remaining, path, result); dfs(node.right, remaining, path, result); }
    path.remove(path.size() - 1);
}`,
  },
  defaultInput: { tree: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, 5, 1], targetSum: 22 },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, null, 5, 1],
      placeholder: 'e.g. 5,4,8,11,null,13,4,7,2',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
    {
      name: 'targetSum',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 22,
      placeholder: 'e.g. 22',
      helperText: 'The target path sum.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const targetSum = input.targetSum as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return [].', variables: { result: [] }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find all root-to-leaf paths with sum = ${targetSum}.`,
      variables: { targetSum },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number, remaining: number, path: number[]): void {
      if (idx >= tree.length || tree[idx] == null) return;
      visited.add(idx);
      path.push(tree[idx] as number);
      const newRemaining = remaining - (tree[idx] as number);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      path.forEach((_, pi) => {
        // highlight current path
      });
      highlights[idx] = 'active';

      steps.push({
        line: 6,
        explanation: `Visit node ${tree[idx]}. Path so far: [${path.join('->')}]. Remaining: ${newRemaining}.`,
        variables: { node: tree[idx], path: [...path], remaining: newRemaining },
        visualization: makeViz(highlights),
      });

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const isLeaf = (l >= tree.length || tree[l] == null) && (r >= tree.length || tree[r] == null);

      if (isLeaf) {
        if (newRemaining === 0) {
          result.push([...path]);
          steps.push({
            line: 9,
            explanation: `Leaf node ${tree[idx]} reached! Path [${path.join('->')}] sums to ${targetSum}. Add to result!`,
            variables: { path: [...path], result: result.map(p => [...p]) },
            visualization: makeViz({ ...highlights, [idx]: 'found' }),
          });
        } else {
          steps.push({
            line: 9,
            explanation: `Leaf node ${tree[idx]} but remaining=${newRemaining} ≠ 0. Path does not match.`,
            variables: { path: [...path], remaining: newRemaining },
            visualization: makeViz({ ...highlights, [idx]: 'mismatch' }),
          });
        }
      } else {
        dfs(l, newRemaining, path);
        dfs(r, newRemaining, path);
      }

      path.pop();
    }

    dfs(0, targetSum, []);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'visited'; });

    steps.push({
      line: 13,
      explanation: `Found ${result.length} path(s): ${JSON.stringify(result)}.`,
      variables: { result },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default pathSumAllPaths;
