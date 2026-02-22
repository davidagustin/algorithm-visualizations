import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const convertBSTToGreaterTreeII: AlgorithmDefinition = {
  id: 'convert-bst-to-greater-tree-ii',
  title: 'Convert BST to Greater Tree II',
  leetcodeNumber: 538,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Convert a BST so each node value becomes the original value plus the sum of all values greater than it in the BST. Use reverse in-order traversal (right → root → left) while accumulating a running sum.',
  tags: ['Tree', 'BST', 'DFS', 'In-order Traversal', 'Reverse In-order'],
  code: {
    pseudocode: `function convertBST(root):
  sum = 0
  function reverseInOrder(node):
    if node is null: return
    reverseInOrder(node.right)
    sum += node.val
    node.val = sum
    reverseInOrder(node.left)
  reverseInOrder(root)
  return root`,
    python: `def convertBST(root):
    self.sum = 0
    def dfs(node):
        if not node: return
        dfs(node.right)
        self.sum += node.val
        node.val = self.sum
        dfs(node.left)
    dfs(root)
    return root`,
    javascript: `function convertBST(root) {
  let sum = 0;
  function dfs(node) {
    if (!node) return;
    dfs(node.right);
    sum += node.val;
    node.val = sum;
    dfs(node.left);
  }
  dfs(root);
  return root;
}`,
    java: `int sum = 0;
public TreeNode convertBST(TreeNode root) {
    dfs(root);
    return root;
}
void dfs(TreeNode node) {
    if (node == null) return;
    dfs(node.right);
    sum += node.val;
    node.val = sum;
    dfs(node.left);
}`,
  },
  defaultInput: { tree: [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8] },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [4, 1, 6, 0, 2, 5, 7, null, null, null, 3, null, null, null, 8],
      placeholder: 'e.g. 4,1,6,0,2,5,7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const modified = tree.slice();
    let runningSum = 0;
    const processed = new Set<number>();

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const i of processed) if (modified[i] != null) highlights[i] = 'found';
      if (activeIdx !== null && modified[activeIdx] != null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: modified.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Convert BST to Greater Tree. Use reverse in-order (right→root→left) to accumulate sum from largest to smallest.`,
      variables: { root: tree[0], runningSum: 0 },
      visualization: makeViz(0),
    });

    function reverseInOrder(idx: number): void {
      if (idx >= modified.length || modified[idx] == null) return;

      reverseInOrder(2 * idx + 2); // right first

      const oldVal = modified[idx] as number;
      runningSum += oldVal;
      modified[idx] = runningSum;
      processed.add(idx);

      steps.push({
        line: 5,
        explanation: `Node original=${oldVal}. Running sum = ${runningSum - oldVal} + ${oldVal} = ${runningSum}. Node value updated to ${runningSum}.`,
        variables: { originalVal: oldVal, runningSum, newVal: runningSum },
        visualization: makeViz(idx),
      });

      reverseInOrder(2 * idx + 1); // left last
    }

    reverseInOrder(0);

    steps.push({
      line: 9,
      explanation: 'Greater Tree conversion complete! Each node now holds sum of all nodes >= original value.',
      variables: { result: modified.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: modified.slice(),
        highlights: Object.fromEntries(modified.map((_, i) => [i, 'found']).filter(([i]) => modified[i as number] != null)),
      },
    });

    return steps;
  },
};

export default convertBSTToGreaterTreeII;
