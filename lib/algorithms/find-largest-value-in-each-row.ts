import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findLargestValueInEachRow: AlgorithmDefinition = {
  id: 'find-largest-value-in-each-row',
  title: 'Find Largest Value in Each Tree Row',
  leetcodeNumber: 515,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return an array of the largest value in each row. Use DFS with depth tracking: maintain a result array and update result[depth] with the maximum value seen at each depth level during traversal.',
  tags: ['tree', 'DFS', 'BFS', 'level order', 'row maximum'],

  code: {
    pseudocode: `function largestValues(root):
  result = []
  function dfs(node, depth):
    if node is null: return
    if depth == len(result):
      result.append(node.val)
    else:
      result[depth] = max(result[depth], node.val)
    dfs(node.left, depth + 1)
    dfs(node.right, depth + 1)
  dfs(root, 0)
  return result`,

    python: `def largestValues(root):
    result = []
    def dfs(node, depth):
        if not node: return
        if depth == len(result):
            result.append(node.val)
        else:
            result[depth] = max(result[depth], node.val)
        dfs(node.left, depth + 1)
        dfs(node.right, depth + 1)
    dfs(root, 0)
    return result`,

    javascript: `function largestValues(root) {
  const result = [];
  function dfs(node, depth) {
    if (!node) return;
    if (depth === result.length) result.push(node.val);
    else result[depth] = Math.max(result[depth], node.val);
    dfs(node.left, depth + 1);
    dfs(node.right, depth + 1);
  }
  dfs(root, 0);
  return result;
}`,

    java: `public List<Integer> largestValues(TreeNode root) {
    List<Integer> result = new ArrayList<>();
    dfs(root, 0, result);
    return result;
}
private void dfs(TreeNode node, int depth, List<Integer> result) {
    if (node == null) return;
    if (depth == result.size()) result.add(node.val);
    else result.set(depth, Math.max(result.get(depth), node.val));
    dfs(node.left, depth + 1, result);
    dfs(node.right, depth + 1, result);
}`,
  },

  defaultInput: {
    tree: [1, 3, 2, 5, 3, null, 9],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [1, 3, 2, 5, 3, null, 9],
      placeholder: '1,3,2,5,3,null,9',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find largest value in each row of tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. DFS tracks current depth and updates row maximums.`,
      variables: { result: '[]' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    const result: number[] = [];
    const visitOrder: number[] = [];

    function dfs(pos: number, depth: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;

      const val = tree[pos] as number;
      visitOrder.push(pos);

      const isNewDepth = depth === result.length;
      const improved = !isNewDepth && val > result[depth];

      if (isNewDepth) {
        result.push(val);
      } else if (improved) {
        result[depth] = val;
      }

      steps.push({
        line: isNewDepth ? 4 : 6,
        explanation: `Visit node ${val} at depth ${depth}. ${isNewDepth ? `First node at depth ${depth}, set result[${depth}] = ${val}.` : improved ? `${val} > current max ${result[depth]} - wait, updated to ${val}.` : `${val} <= current max ${result[depth]}, no update.`} result = [${result.join(', ')}]`,
        variables: { val, depth, isNewDepth, result: JSON.stringify(result) },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, 'visited'])),
            [pos]: isNewDepth || improved ? 'found' : 'comparing',
          },
          depthValues: { [pos]: depth },
        },
      });

      dfs(2 * pos + 1, depth + 1);
      dfs(2 * pos + 2, depth + 1);
    }

    dfs(0, 0);

    steps.push({
      line: 9,
      explanation: `DFS complete. Largest values per row: [${result.join(', ')}].`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: [...result],
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((_, i) => [i, `row ${i}`])),
      },
    });

    return steps;
  },
};

export default findLargestValueInEachRow;
