import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const constructBinaryTreeFromInorderPostorder: AlgorithmDefinition = {
  id: 'construct-binary-tree-from-inorder-postorder',
  title: 'Construct Binary Tree from Inorder and Postorder Traversal',
  leetcodeNumber: 106,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given two integer arrays representing the inorder and postorder traversal of a binary tree, reconstruct the tree. The last element of postorder is always the root. Find that root in inorder to determine left and right subtrees, then recurse.',
  tags: ['tree', 'recursion', 'divide and conquer', 'hash map'],

  code: {
    pseudocode: `function buildTree(inorder, postorder):
  if postorder is empty: return null
  rootVal = postorder[last]
  root = new Node(rootVal)
  mid = index of rootVal in inorder
  leftSize = mid
  root.left = buildTree(inorder[0..mid-1], postorder[0..leftSize-1])
  root.right = buildTree(inorder[mid+1..end], postorder[leftSize..end-1])
  return root`,

    python: `def buildTree(inorder, postorder):
    if not postorder:
        return None
    root_val = postorder[-1]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
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
      label: 'Inorder Array',
      type: 'array',
      defaultValue: [9, 3, 15, 20, 7],
      placeholder: '9,3,15,20,7',
      helperText: 'Inorder traversal of the binary tree',
    },
    {
      name: 'postorder',
      label: 'Postorder Array',
      type: 'array',
      defaultValue: [9, 15, 7, 20, 3],
      placeholder: '9,15,7,20,3',
      helperText: 'Postorder traversal of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const inorder = input.inorder as number[];
    const postorder = input.postorder as number[];
    const steps: AlgorithmStep[] = [];

    // We build the tree and record steps, representing the tree as a level-order array
    const treeNodes: (number | null)[] = [];
    const highlights: Record<number, string> = {};

    steps.push({
      line: 1,
      explanation: `Start building tree. Inorder: [${inorder}], Postorder: [${postorder}]. Last element of postorder is the root.`,
      variables: { inorder: JSON.stringify(inorder), postorder: JSON.stringify(postorder) },
      visualization: {
        type: 'array',
        array: [...postorder],
        highlights: { [postorder.length - 1]: 'active' },
        labels: { [postorder.length - 1]: 'root' },
      },
    });

    let nodeIndex = 0;

    function build(
      ino: number[],
      post: number[],
      pos: number
    ): void {
      if (post.length === 0 || ino.length === 0) return;

      const rootVal = post[post.length - 1];
      const mid = ino.indexOf(rootVal);

      while (treeNodes.length <= pos) treeNodes.push(null);
      treeNodes[pos] = rootVal;

      steps.push({
        line: 3,
        explanation: `Root of current subtree is ${rootVal} (last in postorder [${post}]). Found at index ${mid} in inorder [${ino}].`,
        variables: {
          rootVal,
          inorderSubarray: JSON.stringify(ino),
          postorderSubarray: JSON.stringify(post),
          mid,
          leftSize: mid,
        },
        visualization: {
          type: 'tree',
          nodes: [...treeNodes],
          highlights: { [pos]: 'active' },
        },
      });

      const leftInorder = ino.slice(0, mid);
      const leftPost = post.slice(0, mid);
      const rightInorder = ino.slice(mid + 1);
      const rightPost = post.slice(mid, post.length - 1);

      if (leftPost.length > 0) {
        steps.push({
          line: 6,
          explanation: `Build left subtree with inorder [${leftInorder}] and postorder [${leftPost}].`,
          variables: { leftInorder: JSON.stringify(leftInorder), leftPost: JSON.stringify(leftPost) },
          visualization: {
            type: 'tree',
            nodes: [...treeNodes],
            highlights: { [pos]: 'visited', [2 * pos + 1]: 'comparing' },
          },
        });
        build(leftInorder, leftPost, 2 * pos + 1);
      }

      if (rightPost.length > 0) {
        steps.push({
          line: 7,
          explanation: `Build right subtree with inorder [${rightInorder}] and postorder [${rightPost}].`,
          variables: { rightInorder: JSON.stringify(rightInorder), rightPost: JSON.stringify(rightPost) },
          visualization: {
            type: 'tree',
            nodes: [...treeNodes],
            highlights: { [pos]: 'visited', [2 * pos + 2]: 'comparing' },
          },
        });
        build(rightInorder, rightPost, 2 * pos + 2);
      }
    }

    build(inorder, postorder, 0);

    steps.push({
      line: 8,
      explanation: `Tree construction complete. Result: [${treeNodes.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(treeNodes) },
      visualization: {
        type: 'tree',
        nodes: [...treeNodes],
        highlights: Object.fromEntries(treeNodes.map((_, i) => [i, 'found'])),
      },
    });

    return steps;
  },
};

export default constructBinaryTreeFromInorderPostorder;
