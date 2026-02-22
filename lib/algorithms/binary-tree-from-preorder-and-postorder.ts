import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeFromPreorderAndPostorder: AlgorithmDefinition = {
  id: 'binary-tree-from-preorder-and-postorder',
  title: 'Construct Binary Tree from Preorder and Postorder',
  leetcodeNumber: 889,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given preorder and postorder traversal arrays, reconstruct a binary tree. The root is preorder[0]. The left subtree root is preorder[1]; find it in postorder to determine left subtree size, then recurse for both subtrees.',
  tags: ['Tree', 'DFS', 'Divide and Conquer', 'Recursion'],
  code: {
    pseudocode: `function constructFromPrePost(pre, post):
  if pre is empty: return null
  root = new Node(pre[0])
  if pre.length == 1: return root
  leftRootVal = pre[1]
  leftSize = postorder.indexOf(leftRootVal) + 1
  root.left = constructFromPrePost(pre[1..leftSize+1], post[0..leftSize])
  root.right = constructFromPrePost(pre[leftSize+1..], post[leftSize..n-1])
  return root`,
    python: `def constructFromPrePost(pre, post):
    if not pre: return None
    root = TreeNode(pre[0])
    if len(pre) == 1: return root
    L = post.index(pre[1]) + 1
    root.left = constructFromPrePost(pre[1:L+1], post[:L])
    root.right = constructFromPrePost(pre[L+1:], post[L:-1])
    return root`,
    javascript: `function constructFromPrePost(pre, post) {
  if (!pre.length) return null;
  const root = new TreeNode(pre[0]);
  if (pre.length === 1) return root;
  const L = post.indexOf(pre[1]) + 1;
  root.left = constructFromPrePost(pre.slice(1, L + 1), post.slice(0, L));
  root.right = constructFromPrePost(pre.slice(L + 1), post.slice(L, -1));
  return root;
}`,
    java: `public TreeNode constructFromPrePost(int[] pre, int[] post) {
    if (pre.length == 0) return null;
    TreeNode root = new TreeNode(pre[0]);
    if (pre.length == 1) return root;
    int L = 0; while (post[L] != pre[1]) L++; L++;
    root.left = constructFromPrePost(
      Arrays.copyOfRange(pre, 1, L + 1), Arrays.copyOfRange(post, 0, L));
    root.right = constructFromPrePost(
      Arrays.copyOfRange(pre, L + 1, pre.length), Arrays.copyOfRange(post, L, post.length - 1));
    return root;
}`,
  },
  defaultInput: {
    preorder: [1, 2, 4, 5, 3, 6, 7],
    postorder: [4, 5, 2, 6, 7, 3, 1],
  },
  inputFields: [
    {
      name: 'preorder',
      label: 'Preorder Traversal',
      type: 'array',
      defaultValue: [1, 2, 4, 5, 3, 6, 7],
      placeholder: 'e.g. 1,2,4,5,3,6,7',
    },
    {
      name: 'postorder',
      label: 'Postorder Traversal',
      type: 'array',
      defaultValue: [4, 5, 2, 6, 7, 3, 1],
      placeholder: 'e.g. 4,5,2,6,7,3,1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const preorder = (input.preorder as number[]).slice();
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

    function build(pre: number[], post: number[], treeIdx: number): void {
      if (pre.length === 0) {
        steps.push({
          line: 2,
          explanation: 'Empty arrays — no node to create.',
          variables: {},
          visualization: makeViz(null),
        });
        return;
      }

      const rootVal = pre[0];
      ensureSize(treeIdx);
      resultTree[treeIdx] = rootVal;

      if (pre.length === 1) {
        steps.push({
          line: 4,
          explanation: `Leaf node ${rootVal}. Only one element left.`,
          variables: { rootVal },
          visualization: makeViz(treeIdx),
        });
        return;
      }

      const leftRootVal = pre[1];
      const L = post.indexOf(leftRootVal) + 1;

      steps.push({
        line: 5,
        explanation: `Root: ${rootVal}. Left subtree root: ${leftRootVal} found at postorder index ${L - 1}. Left size: ${L}.`,
        variables: { rootVal, leftRootVal, leftSize: L },
        visualization: makeViz(treeIdx),
      });

      build(pre.slice(1, L + 1), post.slice(0, L), 2 * treeIdx + 1);
      build(pre.slice(L + 1), post.slice(L, -1), 2 * treeIdx + 2);
    }

    steps.push({
      line: 1,
      explanation: `Build tree from preorder [${preorder}] and postorder [${postorder}].`,
      variables: { preorder, postorder },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    build(preorder, postorder, 0);

    steps.push({
      line: 9,
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

export default binaryTreeFromPreorderAndPostorder;
