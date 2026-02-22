import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumBinaryTree: AlgorithmDefinition = {
  id: 'maximum-binary-tree',
  title: 'Maximum Binary Tree',
  leetcodeNumber: 654,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given an integer array with no duplicates, build the maximum binary tree. The root is the maximum element. Recursively build the left subtree from elements to the left of the max, and the right subtree from elements to the right of the max.',
  tags: ['tree', 'recursion', 'divide and conquer', 'array'],

  code: {
    pseudocode: `function constructMaximumBinaryTree(nums):
  if nums is empty: return null
  maxIdx = index of max in nums
  root = new Node(nums[maxIdx])
  root.left = constructMaximumBinaryTree(nums[0..maxIdx-1])
  root.right = constructMaximumBinaryTree(nums[maxIdx+1..end])
  return root`,

    python: `def constructMaximumBinaryTree(nums):
    if not nums:
        return None
    max_idx = nums.index(max(nums))
    root = TreeNode(nums[max_idx])
    root.left = constructMaximumBinaryTree(nums[:max_idx])
    root.right = constructMaximumBinaryTree(nums[max_idx + 1:])
    return root`,

    javascript: `function constructMaximumBinaryTree(nums) {
  if (!nums.length) return null;
  const maxIdx = nums.indexOf(Math.max(...nums));
  const root = new TreeNode(nums[maxIdx]);
  root.left = constructMaximumBinaryTree(nums.slice(0, maxIdx));
  root.right = constructMaximumBinaryTree(nums.slice(maxIdx + 1));
  return root;
}`,

    java: `public TreeNode constructMaximumBinaryTree(int[] nums) {
    if (nums.length == 0) return null;
    int maxIdx = 0;
    for (int i = 1; i < nums.length; i++)
        if (nums[i] > nums[maxIdx]) maxIdx = i;
    TreeNode root = new TreeNode(nums[maxIdx]);
    root.left = constructMaximumBinaryTree(Arrays.copyOfRange(nums, 0, maxIdx));
    root.right = constructMaximumBinaryTree(Arrays.copyOfRange(nums, maxIdx + 1, nums.length));
    return root;
}`,
  },

  defaultInput: {
    nums: [3, 2, 1, 6, 0, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 1, 6, 0, 5],
      placeholder: '3,2,1,6,0,5',
      helperText: 'Array of unique integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const treeNodes: (number | null)[] = [];

    steps.push({
      line: 1,
      explanation: `Build maximum binary tree from [${nums}]. Find the maximum element to use as root.`,
      variables: { nums: JSON.stringify(nums) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    function build(arr: number[], pos: number): void {
      if (arr.length === 0) return;

      let maxIdx = 0;
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > arr[maxIdx]) maxIdx = i;
      }
      const maxVal = arr[maxIdx];

      while (treeNodes.length <= pos) treeNodes.push(null);
      treeNodes[pos] = maxVal;

      const highlightsArr: Record<number, string> = {};
      arr.forEach((_, i) => {
        highlightsArr[i] = i === maxIdx ? 'active' : 'comparing';
      });

      steps.push({
        line: 2,
        explanation: `In subarray [${arr}], maximum is ${maxVal} at local index ${maxIdx}. Place it as tree node.`,
        variables: { subarray: JSON.stringify(arr), maxVal, maxIdx },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: highlightsArr,
          labels: { [maxIdx]: 'max' },
        },
      });

      steps.push({
        line: 3,
        explanation: `Node ${maxVal} placed in tree. Left subarray: [${arr.slice(0, maxIdx)}], Right subarray: [${arr.slice(maxIdx + 1)}].`,
        variables: {
          node: maxVal,
          leftSub: JSON.stringify(arr.slice(0, maxIdx)),
          rightSub: JSON.stringify(arr.slice(maxIdx + 1)),
        },
        visualization: {
          type: 'tree',
          nodes: [...treeNodes],
          highlights: { [pos]: 'active' },
        },
      });

      build(arr.slice(0, maxIdx), 2 * pos + 1);
      build(arr.slice(maxIdx + 1), 2 * pos + 2);
    }

    build(nums, 0);

    steps.push({
      line: 6,
      explanation: `Maximum binary tree complete: [${treeNodes.map(v => v === null ? 'null' : v).join(', ')}]`,
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

export default maximumBinaryTree;
