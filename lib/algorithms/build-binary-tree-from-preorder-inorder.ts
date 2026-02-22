import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const buildBinaryTreeFromPreorderInorder: AlgorithmDefinition = {
  id: 'build-binary-tree-from-preorder-inorder',
  title: 'Build Binary Tree From Preorder/Inorder',
  leetcodeNumber: 105,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given preorder and inorder traversal arrays, construct the binary tree. The first element of preorder is always the root. Find that root in inorder to split into left and right subtrees, then recurse.',
  tags: ['Tree', 'Recursion', 'Divide and Conquer'],
  code: {
    pseudocode: `function buildTree(preorder, inorder):
  if preorder is empty: return null
  root = new Node(preorder[0])
  mid = indexOf(preorder[0] in inorder)
  root.left = buildTree(preorder[1..mid+1],
                         inorder[0..mid])
  root.right = buildTree(preorder[mid+1..],
                          inorder[mid+1..])
  return root`,
    python: `def buildTree(preorder, inorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    mid = inorder.index(preorder[0])
    root.left = buildTree(preorder[1:mid+1],
                          inorder[:mid])
    root.right = buildTree(preorder[mid+1:],
                           inorder[mid+1:])
    return root`,
    javascript: `function buildTree(preorder, inorder) {
  if (preorder.length === 0) return null;
  const root = new TreeNode(preorder[0]);
  const mid = inorder.indexOf(preorder[0]);
  root.left = buildTree(preorder.slice(1, mid + 1),
                         inorder.slice(0, mid));
  root.right = buildTree(preorder.slice(mid + 1),
                          inorder.slice(mid + 1));
  return root;
}`,
    java: `public TreeNode buildTree(int[] preorder, int[] inorder) {
    return build(preorder, 0, preorder.length - 1,
                 inorder, 0, inorder.length - 1);
}
TreeNode build(int[] pre, int ps, int pe,
               int[] in, int is, int ie) {
    if (ps > pe) return null;
    TreeNode root = new TreeNode(pre[ps]);
    int mid = is;
    while (in[mid] != pre[ps]) mid++;
    int leftSize = mid - is;
    root.left = build(pre, ps+1, ps+leftSize, in, is, mid-1);
    root.right = build(pre, ps+leftSize+1, pe, in, mid+1, ie);
    return root;
}`,
  },
  defaultInput: { preorder: [3, 9, 20, 15, 7], inorder: [9, 3, 15, 20, 7] },
  inputFields: [
    {
      name: 'preorder',
      label: 'Preorder Traversal',
      type: 'array',
      defaultValue: [3, 9, 20, 15, 7],
      placeholder: 'e.g. 3,9,20,15,7',
      helperText: 'Preorder traversal of the tree.',
    },
    {
      name: 'inorder',
      label: 'Inorder Traversal',
      type: 'array',
      defaultValue: [9, 3, 15, 20, 7],
      placeholder: 'e.g. 9,3,15,20,7',
      helperText: 'Inorder traversal of the tree.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const preorder = (input.preorder as number[]).slice();
    const inorder = (input.inorder as number[]).slice();
    const steps: AlgorithmStep[] = [];

    // We build the tree as a level-order array
    const resultTree: (number | null)[] = [];

    function ensureSize(idx: number): void {
      while (resultTree.length <= idx) {
        resultTree.push(null);
      }
    }

    function makeViz(): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < resultTree.length; i++) {
        if (resultTree[i] != null) {
          highlights[i] = 'found';
        }
      }
      return { type: 'tree', nodes: resultTree.slice(), highlights };
    }

    function makeVizWithActive(activeIdx: number): TreeVisualization {
      const viz = makeViz();
      viz.highlights[activeIdx] = 'active';
      return viz;
    }

    steps.push({
      line: 1,
      explanation: `Build tree from preorder=[${preorder}] and inorder=[${inorder}]. First preorder element is always the root.`,
      variables: { preorder, inorder },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    function build(
      pre: number[], preStart: number, preEnd: number,
      ino: number[], inStart: number, inEnd: number,
      treeIdx: number,
    ): void {
      if (preStart > preEnd || inStart > inEnd) {
        steps.push({
          line: 2,
          explanation: `Empty subarray (preStart=${preStart} > preEnd=${preEnd}). No node to create.`,
          variables: { preStart, preEnd, inStart, inEnd },
          visualization: makeViz(),
        });
        return;
      }

      const rootVal = pre[preStart];
      ensureSize(treeIdx);
      resultTree[treeIdx] = rootVal;

      const mid = ino.indexOf(rootVal);
      const leftSize = mid - inStart;

      steps.push({
        line: 3,
        explanation: `Root = ${rootVal} (preorder[${preStart}]). Found at inorder[${mid}]. Left subtree has ${leftSize} node(s).`,
        variables: { root: rootVal, mid, leftSize, inorderLeft: ino.slice(inStart, mid), inorderRight: ino.slice(mid + 1, inEnd + 1) },
        visualization: makeVizWithActive(treeIdx),
      });

      // Build left subtree
      if (leftSize > 0) {
        steps.push({
          line: 5,
          explanation: `Build left subtree of ${rootVal}: preorder[${preStart + 1}..${preStart + leftSize}], inorder[${inStart}..${mid - 1}].`,
          variables: { parent: rootVal, side: 'left' },
          visualization: makeViz(),
        });
        build(pre, preStart + 1, preStart + leftSize, ino, inStart, mid - 1, 2 * treeIdx + 1);
      }

      // Build right subtree
      const rightSize = inEnd - mid;
      if (rightSize > 0) {
        steps.push({
          line: 7,
          explanation: `Build right subtree of ${rootVal}: preorder[${preStart + leftSize + 1}..${preEnd}], inorder[${mid + 1}..${inEnd}].`,
          variables: { parent: rootVal, side: 'right' },
          visualization: makeViz(),
        });
        build(pre, preStart + leftSize + 1, preEnd, ino, mid + 1, inEnd, 2 * treeIdx + 2);
      }
    }

    build(preorder, 0, preorder.length - 1, inorder, 0, inorder.length - 1, 0);

    steps.push({
      line: 9,
      explanation: `Tree construction complete! The tree has been built from the traversal arrays.`,
      variables: { tree: resultTree.filter(v => v != null) },
      visualization: makeViz(),
    });

    return steps;
  },
};

export default buildBinaryTreeFromPreorderInorder;
