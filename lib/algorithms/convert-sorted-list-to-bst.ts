import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const convertSortedListToBst: AlgorithmDefinition = {
  id: 'convert-sorted-list-to-bst',
  title: 'Convert Sorted List to BST',
  leetcodeNumber: 109,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Convert a sorted linked list to a height-balanced binary search tree. Use slow/fast pointers to find the middle of the list as the root, then recursively build the left subtree from the left half and the right subtree from the right half.',
  tags: ['linked list', 'tree', 'binary search tree', 'divide and conquer', 'recursion'],

  code: {
    pseudocode: `function sortedListToBST(head):
  if head is null: return null
  if head.next is null: return TreeNode(head.val)
  // find middle
  prev = null, slow = fast = head
  while fast and fast.next:
    prev = slow
    slow = slow.next
    fast = fast.next.next
  if prev: prev.next = null  // cut left half
  root = TreeNode(slow.val)
  root.left = sortedListToBST(head)
  root.right = sortedListToBST(slow.next)
  return root`,

    python: `def sortedListToBST(head):
    if not head: return None
    if not head.next: return TreeNode(head.val)
    slow = fast = head
    prev = None
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    if prev: prev.next = None
    root = TreeNode(slow.val)
    root.left = sortedListToBST(head)
    root.right = sortedListToBST(slow.next)
    return root`,

    javascript: `function sortedListToBST(head) {
  if (!head) return null;
  if (!head.next) return new TreeNode(head.val);
  let slow = head, fast = head, prev = null;
  while (fast && fast.next) {
    prev = slow;
    slow = slow.next;
    fast = fast.next.next;
  }
  if (prev) prev.next = null;
  const root = new TreeNode(slow.val);
  root.left = sortedListToBST(head);
  root.right = sortedListToBST(slow.next);
  return root;
}`,

    java: `public TreeNode sortedListToBST(ListNode head) {
    if (head == null) return null;
    if (head.next == null) return new TreeNode(head.val);
    ListNode slow = head, fast = head, prev = null;
    while (fast != null && fast.next != null) {
        prev = slow;
        slow = slow.next;
        fast = fast.next.next;
    }
    if (prev != null) prev.next = null;
    TreeNode root = new TreeNode(slow.val);
    root.left = sortedListToBST(head);
    root.right = sortedListToBST(slow.next);
    return root;
}`,
  },

  defaultInput: {
    nums: [-10, -3, 0, 5, 9],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Linked List',
      type: 'array',
      defaultValue: [-10, -3, 0, 5, 9],
      placeholder: '-10,-3,0,5,9',
      helperText: 'Sorted values to convert to BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Convert sorted list [${nums.join(' -> ')}] to height-balanced BST. Find middle as root.`,
      variables: { length: nums.length },
      visualization: makeViz([...nums], {}, {}),
    });

    // Recursive simulation
    const buildBST = (arr: number[], depth: number): void => {
      if (arr.length === 0) return;

      const midIdx = Math.floor(arr.length / 2);
      const root = arr[midIdx];
      const left = arr.slice(0, midIdx);
      const right = arr.slice(midIdx + 1);

      // Find the actual index in nums
      const globalIdx = nums.indexOf(root);

      steps.push({
        line: 4,
        explanation: `Depth ${depth}: Find middle of [${arr.join(', ')}]. Middle = ${root} at index ${midIdx}. This becomes the root of subtree.`,
        variables: { subarray: arr.join(', '), root, left: left.join(', '), right: right.join(', ') },
        visualization: makeViz(
          [...nums],
          { [globalIdx]: 'active' },
          { [globalIdx]: `root(d${depth})` }
        ),
      });

      if (left.length > 0) {
        steps.push({
          line: 9,
          explanation: `Left subtree from [${left.join(', ')}]. Recursing...`,
          variables: { leftSubarray: left.join(', ') },
          visualization: makeViz(
            [...nums],
            Object.fromEntries(left.map(v => [nums.indexOf(v), 'comparing'])),
            { [globalIdx]: 'active' }
          ),
        });
        buildBST(left, depth + 1);
      }

      if (right.length > 0) {
        steps.push({
          line: 10,
          explanation: `Right subtree from [${right.join(', ')}]. Recursing...`,
          variables: { rightSubarray: right.join(', ') },
          visualization: makeViz(
            [...nums],
            Object.fromEntries(right.map(v => [nums.indexOf(v), 'pointer'])),
            { [globalIdx]: 'active' }
          ),
        });
        buildBST(right, depth + 1);
      }
    };

    buildBST(nums, 0);

    const midIdx = Math.floor(nums.length / 2);
    steps.push({
      line: 11,
      explanation: `BST construction complete. Root = ${nums[midIdx]}. Tree is height-balanced with height ~log2(${nums.length}).`,
      variables: { root: nums[midIdx], height: Math.ceil(Math.log2(nums.length + 1)) },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { [midIdx]: 'root' }
      ),
    });

    return steps;
  },
};

export default convertSortedListToBst;
