import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const constructBinaryTreeFromPreorderInorderII: AlgorithmDefinition = {
  id: 'construct-binary-tree-from-preorder-inorder-ii',
  title: 'Construct Binary Tree from Preorder & Inorder Traversal II',
  leetcodeNumber: 105,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given preorder and inorder traversal arrays, reconstruct the binary tree. The first element of preorder is always the root. Find that root in inorder to split left and right subtrees, then recurse.',
  tags: ['Tree', 'DFS', 'Divide and Conquer', 'Hash Map'],
  code: {
    pseudocode: `function buildTree(preorder, inorder):
  if preorder is empty: return null
  root = new Node(preorder[0])
  mid = inorder.indexOf(preorder[0])
  root.left = buildTree(preorder[1..mid+1], inorder[0..mid])
  root.right = buildTree(preorder[mid+1..], inorder[mid+1..])
  return root`,
    python: `def buildTree(preorder, inorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    mid = inorder.index(preorder[0])
    root.left = buildTree(preorder[1:mid+1], inorder[:mid])
    root.right = buildTree(preorder[mid+1:], inorder[mid+1:])
    return root`,
    javascript: `function buildTree(preorder, inorder) {
  if (!preorder.length) return null;
  const root = new TreeNode(preorder[0]);
  const mid = inorder.indexOf(preorder[0]);
  root.left = buildTree(preorder.slice(1, mid + 1), inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1), inorder.slice(mid + 1));
  return root;
}`,
    java: `public TreeNode buildTree(int[] preorder, int[] inorder) {
    if (preorder.length == 0) return null;
    TreeNode root = new TreeNode(preorder[0]);
    int mid = 0;
    while (inorder[mid] != preorder[0]) mid++;
    root.left = buildTree(Arrays.copyOfRange(preorder, 1, mid + 1),
                          Arrays.copyOfRange(inorder, 0, mid));
    root.right = buildTree(Arrays.copyOfRange(preorder, mid + 1, preorder.length),
                           Arrays.copyOfRange(inorder, mid + 1, inorder.length));
    return root;
}`,
  },
  defaultInput: {
    preorder: [3, 9, 20, 15, 7],
    inorder: [9, 3, 15, 20, 7],
  },
  inputFields: [
    {
      name: 'preorder',
      label: 'Preorder Traversal',
      type: 'array',
      defaultValue: [3, 9, 20, 15, 7],
      placeholder: 'e.g. 3,9,20,15,7',
    },
    {
      name: 'inorder',
      label: 'Inorder Traversal',
      type: 'array',
      defaultValue: [9, 3, 15, 20, 7],
      placeholder: 'e.g. 9,3,15,20,7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const preorder = (input.preorder as number[]).slice();
    const inorder = (input.inorder as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const resultTree: (number | null)[] = [];

    function ensureSize(idx: number): void {
      while (resultTree.length <= idx) resultTree.push(null);
    }

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < resultTree.length; i++) {
        if (resultTree[i] != null) highlights[i] = 'visited';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: resultTree.slice(), highlights };
    }

    function build(pre: number[], ino: number[], treeIdx: number): void {
      if (pre.length === 0) {
        steps.push({
          line: 2,
          explanation: 'Preorder is empty — no node to create (base case).',
          variables: { preorder: pre, inorder: ino },
          visualization: makeViz(null),
        });
        return;
      }

      const rootVal = pre[0];
      ensureSize(treeIdx);
      resultTree[treeIdx] = rootVal;
      const mid = ino.indexOf(rootVal);

      steps.push({
        line: 3,
        explanation: `Root is ${rootVal}. Found at inorder index ${mid}. Left subtree has ${mid} nodes, right has ${ino.length - mid - 1}.`,
        variables: { root: rootVal, inorderMid: mid, leftSize: mid, rightSize: ino.length - mid - 1 },
        visualization: makeViz(treeIdx),
      });

      build(pre.slice(1, mid + 1), ino.slice(0, mid), 2 * treeIdx + 1);
      build(pre.slice(mid + 1), ino.slice(mid + 1), 2 * treeIdx + 2);
    }

    steps.push({
      line: 1,
      explanation: `Build tree from preorder [${preorder}] and inorder [${inorder}].`,
      variables: { preorder, inorder },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    build(preorder, inorder, 0);

    steps.push({
      line: 7,
      explanation: 'Tree construction complete!',
      variables: { tree: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)),
      },
    });

    return steps;
  },
};

export default constructBinaryTreeFromPreorderInorderII;
