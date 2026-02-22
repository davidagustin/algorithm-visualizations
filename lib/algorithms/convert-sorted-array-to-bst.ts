import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const convertSortedArrayToBST: AlgorithmDefinition = {
  id: 'convert-sorted-array-to-bst',
  title: 'Convert Sorted Array to Binary Search Tree',
  leetcodeNumber: 108,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree. A height-balanced BST is one where the depth of the two subtrees of every node never differs by more than one. We pick the middle element as the root and recursively do the same for left and right halves.',
  tags: ['Tree', 'Binary Search', 'Divide and Conquer'],
  code: {
    pseudocode: `function sortedArrayToBST(nums):
  function build(left, right):
    if left > right: return null
    mid = (left + right) / 2
    root = new Node(nums[mid])
    root.left = build(left, mid - 1)
    root.right = build(mid + 1, right)
    return root
  return build(0, nums.length - 1)`,
    python: `def sortedArrayToBST(nums):
    def build(left, right):
        if left > right:
            return None
        mid = (left + right) // 2
        root = TreeNode(nums[mid])
        root.left = build(left, mid - 1)
        root.right = build(mid + 1, right)
        return root
    return build(0, len(nums) - 1)`,
    javascript: `function sortedArrayToBST(nums) {
  function build(left, right) {
    if (left > right) return null;
    const mid = Math.floor((left + right) / 2);
    const root = new TreeNode(nums[mid]);
    root.left = build(left, mid - 1);
    root.right = build(mid + 1, right);
    return root;
  }
  return build(0, nums.length - 1);
}`,
    java: `public TreeNode sortedArrayToBST(int[] nums) {
    return build(nums, 0, nums.length - 1);
}
private TreeNode build(int[] nums, int left, int right) {
    if (left > right) return null;
    int mid = (left + right) / 2;
    TreeNode root = new TreeNode(nums[mid]);
    root.left = build(nums, left, mid - 1);
    root.right = build(nums, mid + 1, right);
    return root;
}`,
  },
  defaultInput: { nums: [-10, -3, 0, 5, 9] },
  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [-10, -3, 0, 5, 9],
      placeholder: 'e.g. -10,-3,0,5,9',
      helperText: 'A sorted array of integers in ascending order.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];

    // Build the resulting BST as a level-order array
    const resultTree: (number | null)[] = [];
    const highlights: Record<number, string> = {};

    function setNode(treeIdx: number, val: number): void {
      while (resultTree.length <= treeIdx) resultTree.push(null);
      resultTree[treeIdx] = val;
    }

    function makeViz(activeTreeIdx: number | null): TreeVisualization {
      const h: Record<number, string> = {};
      for (const [k, v] of Object.entries(highlights)) h[Number(k)] = v;
      if (activeTreeIdx !== null && activeTreeIdx < resultTree.length) {
        h[activeTreeIdx] = 'active';
      }
      return { type: 'tree', nodes: resultTree.slice(), highlights: h };
    }

    if (nums.length === 0) {
      steps.push({
        line: 2,
        explanation: 'Empty array. Return null (empty tree).',
        variables: { nums: [], result: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Convert sorted array [${nums.join(', ')}] to height-balanced BST. Pick middle element as root each time.`,
      variables: { nums, left: 0, right: nums.length - 1 },
      visualization: makeViz(null),
    });

    function build(left: number, right: number, treeIdx: number): void {
      if (left > right) {
        steps.push({
          line: 3,
          explanation: `left (${left}) > right (${right}). This subtree is null.`,
          variables: { left, right },
          visualization: makeViz(null),
        });
        return;
      }

      const mid = Math.floor((left + right) / 2);
      const val = nums[mid];
      setNode(treeIdx, val);
      highlights[treeIdx] = 'comparing';

      steps.push({
        line: 4,
        explanation: `Array[${left}..${right}]: mid index = ${mid}, value = ${val}. Place ${val} as node at tree index ${treeIdx}.`,
        variables: { left, right, mid, value: val },
        visualization: makeViz(treeIdx),
      });

      build(left, mid - 1, 2 * treeIdx + 1);
      build(mid + 1, right, 2 * treeIdx + 2);

      highlights[treeIdx] = 'found';

      steps.push({
        line: 8,
        explanation: `Subtree rooted at ${val} complete. Both left [${left}..${mid - 1}] and right [${mid + 1}..${right}] subtrees built.`,
        variables: { node: val, leftRange: [left, mid - 1], rightRange: [mid + 1, right] },
        visualization: makeViz(null),
      });
    }

    build(0, nums.length - 1, 0);

    steps.push({
      line: 9,
      explanation: `Height-balanced BST constructed from sorted array [${nums.join(', ')}].`,
      variables: { tree: resultTree.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: resultTree.slice(),
        highlights: Object.fromEntries(
          resultTree.map((_, i) => [i, 'found']).filter(([i]) => resultTree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default convertSortedArrayToBST;
