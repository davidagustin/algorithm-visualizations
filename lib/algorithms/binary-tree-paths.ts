import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const binaryTreePaths: AlgorithmDefinition = {
  id: 'binary-tree-paths',
  title: 'Binary Tree Paths',
  leetcodeNumber: 257,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return all root-to-leaf paths in any order. A leaf is a node with no children. Use DFS with backtracking: build the current path as you go deeper, and when you reach a leaf, record the path as a string.',
  tags: ['tree', 'DFS', 'backtracking', 'path', 'leaf'],

  code: {
    pseudocode: `function binaryTreePaths(root):
  paths = []
  function dfs(node, path):
    if node is null: return
    path.append(node.val)
    if node is leaf:
      paths.append("->".join(path))
    else:
      dfs(node.left, path)
      dfs(node.right, path)
    path.pop()  // backtrack
  dfs(root, [])
  return paths`,

    python: `def binaryTreePaths(root):
    paths = []
    def dfs(node, path):
        if not node: return
        path.append(str(node.val))
        if not node.left and not node.right:
            paths.append("->".join(path))
        else:
            dfs(node.left, path)
            dfs(node.right, path)
        path.pop()
    dfs(root, [])
    return paths`,

    javascript: `function binaryTreePaths(root) {
  const paths = [];
  function dfs(node, path) {
    if (!node) return;
    path.push(node.val);
    if (!node.left && !node.right) {
      paths.push(path.join("->"));
    } else {
      dfs(node.left, path);
      dfs(node.right, path);
    }
    path.pop();
  }
  dfs(root, []);
  return paths;
}`,

    java: `public List<String> binaryTreePaths(TreeNode root) {
    List<String> paths = new ArrayList<>();
    dfs(root, new ArrayList<>(), paths);
    return paths;
}
private void dfs(TreeNode node, List<Integer> path, List<String> paths) {
    if (node == null) return;
    path.add(node.val);
    if (node.left == null && node.right == null) {
        paths.add(path.stream().map(String::valueOf).collect(Collectors.joining("->")));
    } else {
        dfs(node.left, path, paths);
        dfs(node.right, path, paths);
    }
    path.remove(path.size() - 1);
}`,
  },

  defaultInput: {
    tree: [1, 2, 3, null, 5],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, null, 5],
      placeholder: '1,2,3,null,5',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find all root-to-leaf paths in tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. DFS with backtracking.`,
      variables: { paths: '[]', currentPath: '[]' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    const paths: string[] = [];
    const currentPath: number[] = [];
    const activePath: number[] = [];

    function dfs(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;

      const val = tree[pos] as number;
      currentPath.push(val);
      activePath.push(pos);

      const leftPos = 2 * pos + 1;
      const rightPos = 2 * pos + 2;
      const hasLeft = leftPos < tree.length && tree[leftPos] !== null && tree[leftPos] !== undefined;
      const hasRight = rightPos < tree.length && tree[rightPos] !== null && tree[rightPos] !== undefined;
      const isLeaf = !hasLeft && !hasRight;

      steps.push({
        line: 4,
        explanation: `Visiting node ${val}. Current path: [${currentPath.join(' -> ')}]. ${isLeaf ? 'This is a leaf! Record path.' : 'Not a leaf, continue DFS.'}`,
        variables: {
          val,
          currentPath: currentPath.join(' -> '),
          isLeaf,
          paths: JSON.stringify(paths),
        },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(activePath.slice(0, -1).map(p => [p, 'active'])),
            [pos]: isLeaf ? 'found' : 'active',
          },
        },
      });

      if (isLeaf) {
        const pathStr = currentPath.join('->');
        paths.push(pathStr);
        steps.push({
          line: 6,
          explanation: `Leaf reached! Add path "${pathStr}" to results. Total paths found: ${paths.length}.`,
          variables: { newPath: pathStr, allPaths: JSON.stringify(paths) },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: Object.fromEntries(activePath.map(p => [p, 'found'])),
          },
        });
      } else {
        dfs(leftPos);
        dfs(rightPos);
      }

      currentPath.pop();
      activePath.pop();

      if (!isLeaf) {
        steps.push({
          line: 9,
          explanation: `Backtrack from node ${val}. Current path: [${currentPath.join(' -> ') || 'empty'}].`,
          variables: { backtrackFrom: val, currentPath: currentPath.join(' -> ') },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(activePath.map(p => [p, 'active'])),
              [pos]: 'visited',
            },
          },
        });
      }
    }

    dfs(0);

    steps.push({
      line: 10,
      explanation: `All paths found: ${JSON.stringify(paths)}.`,
      variables: { result: JSON.stringify(paths), count: paths.length },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, tree[i] !== null ? 'found' : 'default'])
        ),
      },
    });

    return steps;
  },
};

export default binaryTreePaths;
