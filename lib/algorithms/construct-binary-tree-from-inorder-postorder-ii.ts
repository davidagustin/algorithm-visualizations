import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const constructBinaryTreeFromInorderPostorderII: AlgorithmDefinition = {
  id: 'construct-binary-tree-from-inorder-postorder-ii',
  title: 'Construct Binary Tree from Inorder & Postorder Traversal II',
  leetcodeNumber: 106,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given inorder and postorder traversal arrays, reconstruct the binary tree. The last element of postorder is always the root. Find that root in inorder to split left and right subtrees, then recurse.',
  tags: ['Tree', 'DFS', 'Divide and Conquer'],
  code: {
    pseudocode: `function buildTree(inorder, postorder):
  if postorder is empty: return null
  root = new Node(postorder[-1])
  mid = inorder.indexOf(postorder[-1])
  root.left = buildTree(inorder[0..mid], postorder[0..mid])
  root.right = buildTree(inorder[mid+1..], postorder[mid..n-1])
  return root`,
    python: `def buildTree(inorder, postorder):
    if not postorder:
        return None
    root = TreeNode(postorder[-1])
    mid = inorder.index(postorder[-1])
    root.left = buildTree(inorder[:mid], postorder[:mid])
    root.right = buildTree(inorder[mid+1:], postorder[mid:-1])
    return root`,
    javascript: `function buildTree(inorder, postorder) {
  if (!postorder.length) return null;
  const rootVal = postorder[postorder.length - 1];
  const root = new TreeNode(rootVal);
  const mid = inorder.indexOf(rootVal);
  root.left = buildTree(inorder.slice(0, mid), postorder.slice(0, mid));
  root.right = buildTree(inorder.slice(mid + 1), postorder.slice(mid, -1));
  return root;
}`,
    java: `public TreeNode buildTree(int[] inorder, int[] postorder) {
    if (postorder.length == 0) return null;
    int rootVal = postorder[postorder.length - 1];
    TreeNode root = new TreeNode(rootVal);
    int mid = 0;
    while (inorder[mid] != rootVal) mid++;
    root.left = buildTree(Arrays.copyOfRange(inorder, 0, mid),
                          Arrays.copyOfRange(postorder, 0, mid));
    root.right = buildTree(Arrays.copyOfRange(inorder, mid + 1, inorder.length),
                           Arrays.copyOfRange(postorder, mid, postorder.length - 1));
    return root;
}`,
  },
  defaultInput: {
    inorder: [9, 3, 15, 20, 7],
    postorder: [9, 15, 7, 20, 3],
  },
  inputFields: [
    {
      name: 'inorder',
      label: 'Inorder Traversal',
      type: 'array',
      defaultValue: [9, 3, 15, 20, 7],
      placeholder: 'e.g. 9,3,15,20,7',
    },
    {
      name: 'postorder',
      label: 'Postorder Traversal',
      type: 'array',
      defaultValue: [9, 15, 7, 20, 3],
      placeholder: 'e.g. 9,15,7,20,3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const inorder = (input.inorder as number[]).slice();
    const postorder = (input.postorder as number[]).slice();
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

    function build(ino: number[], post: number[], treeIdx: number): void {
      if (post.length === 0) {
        steps.push({
          line: 2,
          explanation: 'Postorder is empty — no node to create (base case).',
          variables: { inorder: ino, postorder: post },
          visualization: makeViz(null),
        });
        return;
      }

      const rootVal = post[post.length - 1];
      ensureSize(treeIdx);
      resultTree[treeIdx] = rootVal;
      const mid = ino.indexOf(rootVal);

      steps.push({
        line: 3,
        explanation: `Root is ${rootVal} (last of postorder). Found at inorder index ${mid}. Left size: ${mid}, right size: ${ino.length - mid - 1}.`,
        variables: { root: rootVal, mid, leftSize: mid, rightSize: ino.length - mid - 1 },
        visualization: makeViz(treeIdx),
      });

      build(ino.slice(0, mid), post.slice(0, mid), 2 * treeIdx + 1);
      build(ino.slice(mid + 1), post.slice(mid, -1), 2 * treeIdx + 2);
    }

    steps.push({
      line: 1,
      explanation: `Build tree from inorder [${inorder}] and postorder [${postorder}].`,
      variables: { inorder, postorder },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    build(inorder, postorder, 0);

    steps.push({
      line: 7,
      explanation: 'Tree construction from inorder+postorder complete!',
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

export default constructBinaryTreeFromInorderPostorderII;
