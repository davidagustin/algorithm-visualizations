import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const constructBstFromPreorder: AlgorithmDefinition = {
  id: 'construct-bst-from-preorder',
  title: 'Construct Binary Search Tree from Preorder Traversal',
  leetcodeNumber: 1008,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an array of integers representing the preorder traversal of a BST, reconstruct the BST. The first element is always the root. Use BST property: elements less than root go left, elements greater go right. Recurse for each subtree.',
  tags: ['tree', 'BST', 'recursion', 'divide and conquer'],

  code: {
    pseudocode: `function bstFromPreorder(preorder):
  if preorder is empty: return null
  root = new Node(preorder[0])
  i = 1
  while i < len and preorder[i] < root.val: i++
  root.left = bstFromPreorder(preorder[1..i-1])
  root.right = bstFromPreorder(preorder[i..end])
  return root`,

    python: `def bstFromPreorder(preorder):
    if not preorder:
        return None
    root = TreeNode(preorder[0])
    i = 1
    while i < len(preorder) and preorder[i] < preorder[0]:
        i += 1
    root.left = bstFromPreorder(preorder[1:i])
    root.right = bstFromPreorder(preorder[i:])
    return root`,

    javascript: `function bstFromPreorder(preorder) {
  if (!preorder.length) return null;
  const root = new TreeNode(preorder[0]);
  let i = 1;
  while (i < preorder.length && preorder[i] < preorder[0]) i++;
  root.left = bstFromPreorder(preorder.slice(1, i));
  root.right = bstFromPreorder(preorder.slice(i));
  return root;
}`,

    java: `public TreeNode bstFromPreorder(int[] preorder) {
    if (preorder.length == 0) return null;
    TreeNode root = new TreeNode(preorder[0]);
    int i = 1;
    while (i < preorder.length && preorder[i] < preorder[0]) i++;
    root.left = bstFromPreorder(Arrays.copyOfRange(preorder, 1, i));
    root.right = bstFromPreorder(Arrays.copyOfRange(preorder, i, preorder.length));
    return root;
}`,
  },

  defaultInput: {
    preorder: [8, 5, 1, 7, 10, 12],
  },

  inputFields: [
    {
      name: 'preorder',
      label: 'Preorder Array',
      type: 'array',
      defaultValue: [8, 5, 1, 7, 10, 12],
      placeholder: '8,5,1,7,10,12',
      helperText: 'Preorder traversal of a valid BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const preorder = input.preorder as number[];
    const steps: AlgorithmStep[] = [];
    const treeNodes: (number | null)[] = [];

    steps.push({
      line: 1,
      explanation: `Start building BST from preorder: [${preorder}]. First element ${preorder[0]} is the root.`,
      variables: { preorder: JSON.stringify(preorder) },
      visualization: {
        type: 'array',
        array: [...preorder],
        highlights: { 0: 'active' },
        labels: { 0: 'root' },
      },
    });

    function build(arr: number[], pos: number): void {
      if (arr.length === 0) return;

      const rootVal = arr[0];
      while (treeNodes.length <= pos) treeNodes.push(null);
      treeNodes[pos] = rootVal;

      steps.push({
        line: 3,
        explanation: `Place ${rootVal} as node at position ${pos}. Values less than ${rootVal} go left, greater go right.`,
        variables: { rootVal, subarray: JSON.stringify(arr) },
        visualization: {
          type: 'tree',
          nodes: [...treeNodes],
          highlights: { [pos]: 'active' },
        },
      });

      let splitIdx = 1;
      while (splitIdx < arr.length && arr[splitIdx] < rootVal) splitIdx++;

      const leftArr = arr.slice(1, splitIdx);
      const rightArr = arr.slice(splitIdx);

      steps.push({
        line: 5,
        explanation: `Split point at index ${splitIdx}. Left subtree: [${leftArr}], Right subtree: [${rightArr}].`,
        variables: { leftSubarray: JSON.stringify(leftArr), rightSubarray: JSON.stringify(rightArr), splitIdx },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries([
            [0, 'current'],
            ...leftArr.map((_, i) => [i + 1, 'active'] as [number, string]),
            ...rightArr.map((_, i) => [i + splitIdx, 'comparing'] as [number, string]),
          ]),
          labels: { 0: 'root', [splitIdx]: 'right start' },
        },
      });

      if (leftArr.length > 0) build(leftArr, 2 * pos + 1);
      if (rightArr.length > 0) build(rightArr, 2 * pos + 2);
    }

    build(preorder, 0);

    steps.push({
      line: 8,
      explanation: `BST construction complete. Level-order result: [${treeNodes.map(v => v === null ? 'null' : v).join(', ')}]`,
      variables: { result: JSON.stringify(treeNodes) },
      visualization: {
        type: 'tree',
        nodes: [...treeNodes],
        highlights: Object.fromEntries(
          treeNodes.map((v, i) => [i, v !== null ? 'found' : 'default'])
        ),
      },
    });

    return steps;
  },
};

export default constructBstFromPreorder;
