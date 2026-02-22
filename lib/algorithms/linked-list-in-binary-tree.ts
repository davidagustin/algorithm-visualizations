import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListInBinaryTree: AlgorithmDefinition = {
  id: 'linked-list-in-binary-tree',
  title: 'Linked List in Binary Tree',
  leetcodeNumber: 1367,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a binary tree root and a linked list head, return true if all elements of the linked list correspond to a downward path in the binary tree. Use DFS from every tree node, checking if the linked list matches a root-to-node path.',
  tags: ['linked list', 'tree', 'dfs', 'recursion'],

  code: {
    pseudocode: `function isSubPath(head, root):
  if root is null: return false
  if matches(head, root): return true
  return isSubPath(head, root.left) or isSubPath(head, root.right)

function matches(listNode, treeNode):
  if listNode is null: return true
  if treeNode is null: return false
  if listNode.val != treeNode.val: return false
  return matches(listNode.next, treeNode.left) or
         matches(listNode.next, treeNode.right)`,

    python: `def isSubPath(head, root):
    def matches(l, t):
        if not l: return True
        if not t: return False
        if l.val != t.val: return False
        return matches(l.next, t.left) or matches(l.next, t.right)
    if not root: return False
    if matches(head, root): return True
    return isSubPath(head, root.left) or isSubPath(head, root.right)`,

    javascript: `function isSubPath(head, root) {
  function matches(l, t) {
    if (!l) return true;
    if (!t) return false;
    if (l.val !== t.val) return false;
    return matches(l.next, t.left) || matches(l.next, t.right);
  }
  if (!root) return false;
  if (matches(head, root)) return true;
  return isSubPath(head, root.left) || isSubPath(head, root.right);
}`,

    java: `public boolean isSubPath(ListNode head, TreeNode root) {
    if (root == null) return false;
    if (matches(head, root)) return true;
    return isSubPath(head, root.left) || isSubPath(head, root.right);
}
private boolean matches(ListNode l, TreeNode t) {
    if (l == null) return true;
    if (t == null) return false;
    if (l.val != t.val) return false;
    return matches(l.next, t.left) || matches(l.next, t.right);
}`,
  },

  defaultInput: {
    nums: [4, 2, 8],
    target: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List values',
      type: 'array',
      defaultValue: [4, 2, 8],
      placeholder: '4,2,8',
      helperText: 'Values of the linked list to search for',
    },
    {
      name: 'target',
      label: 'Tree path match (1=true expected)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: '1 if list should be found in tree, 0 otherwise',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start DFS through every tree node trying to match linked list: [${nums.join(' -> ')}].`,
      variables: { listLength: nums.length },
      visualization: makeViz({}, {}),
    });

    // Simulate matching from a hypothetical tree node
    for (let i = 0; i < nums.length; i++) {
      steps.push({
        line: 5,
        explanation: `Check if list node at index ${i} (value ${nums[i]}) matches current tree node.`,
        variables: { listIndex: i, listValue: nums[i] },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: 'check' }
        ),
      });

      steps.push({
        line: 7,
        explanation: `Values match at index ${i}. Advance both list pointer and tree pointer to continue checking.`,
        variables: { listIndex: i, matched: true },
        visualization: makeViz(
          { [i]: 'match' },
          { [i]: 'matched' }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `All ${nums.length} list nodes matched a downward path in the binary tree. Return true.`,
      variables: { result: true, matchedNodes: nums.length },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: 'start', [nums.length - 1]: 'end' }
      ),
    });

    return steps;
  },
};

export default linkedListInBinaryTree;
