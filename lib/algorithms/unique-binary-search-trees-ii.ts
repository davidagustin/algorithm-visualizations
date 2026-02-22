import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const uniqueBinarySearchTreesII: AlgorithmDefinition = {
  id: 'unique-binary-search-trees-ii',
  title: 'Unique Binary Search Trees II',
  leetcodeNumber: 95,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an integer n, generate all structurally unique BSTs that store values 1 to n. For each possible root r (1 to n), all values less than r form the left subtree and all values greater form the right subtree. Recurse and combine all left/right pairs.',
  tags: ['Tree', 'BST', 'Dynamic Programming', 'Backtracking', 'Recursion'],
  code: {
    pseudocode: `function generateTrees(n):
  return generate(1, n)

function generate(start, end):
  if start > end: return [null]
  trees = []
  for root in start to end:
    leftTrees = generate(start, root - 1)
    rightTrees = generate(root + 1, end)
    for each l in leftTrees:
      for each r in rightTrees:
        node = new Node(root)
        node.left = l; node.right = r
        trees.append(node)
  return trees`,
    python: `def generateTrees(n):
    def generate(s, e):
        if s > e: return [None]
        trees = []
        for root in range(s, e + 1):
            for l in generate(s, root - 1):
                for r in generate(root + 1, e):
                    node = TreeNode(root)
                    node.left, node.right = l, r
                    trees.append(node)
        return trees
    return generate(1, n)`,
    javascript: `function generateTrees(n) {
  function generate(s, e) {
    if (s > e) return [null];
    const trees = [];
    for (let root = s; root <= e; root++) {
      for (const l of generate(s, root - 1))
        for (const r of generate(root + 1, e)) {
          const node = new TreeNode(root);
          node.left = l; node.right = r;
          trees.push(node);
        }
    }
    return trees;
  }
  return generate(1, n);
}`,
    java: `public List<TreeNode> generateTrees(int n) {
    return generate(1, n);
}
List<TreeNode> generate(int s, int e) {
    if (s > e) return List.of((TreeNode) null);
    List<TreeNode> trees = new ArrayList<>();
    for (int root = s; root <= e; root++)
        for (TreeNode l : generate(s, root - 1))
            for (TreeNode r : generate(root + 1, e)) {
                TreeNode node = new TreeNode(root);
                node.left = l; node.right = r;
                trees.add(node);
            }
    return trees;
}`,
  },
  defaultInput: { n: 3 },
  inputFields: [
    {
      name: 'n',
      label: 'n',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Generate all unique BSTs with values 1..n.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Generate all unique BSTs with values 1 to ${n}. For each root r, left uses [1..r-1] and right uses [r+1..n].`,
      variables: { n },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    function countTrees(s: number, e: number): number {
      if (s > e) return 1;
      let total = 0;
      for (let root = s; root <= e; root++) {
        const left = countTrees(s, root - 1);
        const right = countTrees(root + 1, e);
        steps.push({
          line: 7,
          explanation: `Root=${root} in [${s},${e}]: left subtrees=${left}, right subtrees=${right}, combinations=${left * right}.`,
          variables: { root, range: `[${s},${e}]`, leftCount: left, rightCount: right, combos: left * right },
          visualization: {
            type: 'tree',
            nodes: Array.from({ length: e - s + 1 }, (_, i) => s + i),
            highlights: { [root - s]: 'active' },
          },
        });
        total += left * right;
      }
      return total;
    }

    const total = countTrees(1, n);

    steps.push({
      line: 14,
      explanation: `Total unique BSTs for n=${n}: ${total} (Catalan number C(${n})).`,
      variables: { n, totalUniqueBSTs: total },
      visualization: {
        type: 'tree',
        nodes: Array.from({ length: n }, (_, i) => i + 1),
        highlights: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
      },
    });

    return steps;
  },
};

export default uniqueBinarySearchTreesII;
