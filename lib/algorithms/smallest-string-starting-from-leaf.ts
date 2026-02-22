import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const smallestStringStartingFromLeaf: AlgorithmDefinition = {
  id: 'smallest-string-starting-from-leaf',
  title: 'Smallest String Starting From Leaf',
  leetcodeNumber: 988,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree where node values are 0-25 (representing a-z), find the lexicographically smallest string that starts at a leaf and ends at the root. Each path from leaf to root forms a string (leaf char first). Use DFS to explore all root-to-leaf paths, build leaf-to-root strings, and track the minimum.',
  tags: ['tree', 'dfs', 'string', 'lexicographic', 'leaf to root'],

  code: {
    pseudocode: `function smallestFromLeaf(root):
  result = null
  function dfs(node, path):
    if node is null: return
    path = char(node.val) + path   // prepend current char
    if isLeaf(node):
      if result is null or path < result:
        result = path
    dfs(node.left, path)
    dfs(node.right, path)
  dfs(root, "")
  return result`,

    python: `def smallestFromLeaf(self, root):
    self.result = None
    def dfs(node, path):
        if not node:
            return
        path = chr(ord('a') + node.val) + path
        if not node.left and not node.right:
            if self.result is None or path < self.result:
                self.result = path
            return
        dfs(node.left, path)
        dfs(node.right, path)
    dfs(root, "")
    return self.result`,

    javascript: `function smallestFromLeaf(root) {
  let result = null;
  function dfs(node, path) {
    if (!node) return;
    path = String.fromCharCode('a'.charCodeAt(0) + node.val) + path;
    if (!node.left && !node.right) {
      if (result === null || path < result) result = path;
      return;
    }
    dfs(node.left, path);
    dfs(node.right, path);
  }
  dfs(root, '');
  return result;
}`,

    java: `public String smallestFromLeaf(TreeNode root) {
    String[] result = {null};
    dfs(root, "", result);
    return result[0];
}
private void dfs(TreeNode node, String path, String[] result) {
    if (node == null) return;
    path = (char)('a' + node.val) + path;
    if (node.left == null && node.right == null) {
        if (result[0] == null || path.compareTo(result[0]) < 0)
            result[0] = path;
        return;
    }
    dfs(node.left, path, result);
    dfs(node.right, path, result);
}`,
  },

  defaultInput: {
    nodes: [0, 1, 2, 3, 4, 3, 4],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree node values 0-25 (level order)',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4, 3, 4],
      placeholder: '0,1,2,3,4,3,4',
      helperText: 'Values 0-25 represent letters a-z. Level-order with null for missing.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    const toChar = (v: number) => String.fromCharCode(97 + v);

    // Tree: a(0), b(1), c(2), d(3), e(4), d(3), e(4)
    // Paths (leaf to root):
    //   leaf d(idx3) -> b -> a = "dba"
    //   leaf e(idx4) -> b -> a = "eba"
    //   leaf d(idx5) -> c -> a = "dca"
    //   leaf e(idx6) -> c -> a = "eca"
    // Smallest: "dba"
    steps.push({
      line: 1,
      explanation: 'Start DFS. Nodes: a(0),b(1),c(2),d(3),e(4),d(3),e(4). Build leaf-to-root strings.',
      variables: { result: 'null', path: '""' },
      visualization: makeViz({ 0: 'active' }),
    });

    steps.push({
      line: 3,
      explanation: `Visit root (val=0 -> "${toChar(0)}"=a). path = "a" + "" = "a". Recurse left to b.`,
      variables: { node: 'a', path: 'a' },
      visualization: makeViz({ 0: 'current', 1: 'active' }),
    });

    steps.push({
      line: 3,
      explanation: `Visit node b (val=1). path = "b" + "a" = "ba". Recurse left to d.`,
      variables: { node: 'b', path: 'ba' },
      visualization: makeViz({ 0: 'visited', 1: 'current', 3: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: `Visit node d (val=3). path = "d" + "ba" = "dba". Leaf node! result = "dba".`,
      variables: { node: 'd', path: 'dba', result: 'dba', isLeaf: true },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 3: 'found' }),
    });

    steps.push({
      line: 7,
      explanation: `Back to node b. Recurse right to e (val=4). path = "e" + "a" = "ea". Then path = "e"+"ba"? Actually path = "eba". "eba" > "dba". No update.`,
      variables: { node: 'e', path: 'eba', result: 'dba', comparison: '"eba" > "dba"' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 3: 'sorted', 4: 'comparing' }),
    });

    steps.push({
      line: 3,
      explanation: `Recurse right from root to node c (val=2). path = "c"+"a"="ca". Go left to d.`,
      variables: { node: 'c', path: 'ca' },
      visualization: makeViz({ 0: 'visited', 2: 'current', 5: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: `Visit d (val=3). path = "d"+"ca"="dca". Leaf! Compare "dca" vs "dba": "dba" < "dca". No update.`,
      variables: { node: 'd', path: 'dca', result: 'dba', comparison: '"dca" > "dba"' },
      visualization: makeViz({ 0: 'visited', 2: 'visited', 5: 'comparing' }),
    });

    steps.push({
      line: 5,
      explanation: `Visit e (val=4) right of c. path = "e"+"ca"="eca". "eca" > "dba". No update.`,
      variables: { node: 'e', path: 'eca', result: 'dba' },
      visualization: makeViz({ 0: 'visited', 2: 'visited', 6: 'comparing' }),
    });

    steps.push({
      line: 10,
      explanation: 'DFS complete. All leaf-to-root strings checked. Smallest is "dba". Return "dba".',
      variables: { result: 'dba', allPaths: '["dba","eba","dca","eca"]' },
      visualization: makeViz({ 0: 'found', 1: 'found', 3: 'found' }),
    });

    return steps;
  },
};

export default smallestStringStartingFromLeaf;
