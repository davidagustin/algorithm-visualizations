import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseLinkedListRecursive: AlgorithmDefinition = {
  id: 'reverse-linked-list-recursive',
  title: 'Reverse Linked List (Recursive)',
  leetcodeNumber: 206,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Reverse a singly linked list using the recursive approach. The base case returns when head or head.next is null. For each node, recursively reverse the rest, then make head.next.next = head and head.next = null to flip the pointer.',
  tags: ['linked list', 'recursion', 'reverse'],

  code: {
    pseudocode: `function reverse(head):
  if head is null or head.next is null:
    return head
  newHead = reverse(head.next)
  head.next.next = head
  head.next = null
  return newHead`,

    python: `def reverseList(head):
    if not head or not head.next:
        return head
    new_head = reverseList(head.next)
    head.next.next = head
    head.next = None
    return new_head`,

    javascript: `function reverseList(head) {
  if (!head || !head.next) return head;
  const newHead = reverseList(head.next);
  head.next.next = head;
  head.next = null;
  return newHead;
}`,

    java: `public ListNode reverseList(ListNode head) {
    if (head == null || head.next == null) return head;
    ListNode newHead = reverseList(head.next);
    head.next.next = head;
    head.next = null;
    return newHead;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Nodes of the linked list to reverse',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      explanation: `Begin recursive reversal of list: [${nums.join(' -> ')}].`,
      variables: { n },
      visualization: makeViz([...nums], {}, {}),
    });

    // Simulate recursive call stack going down
    for (let i = 0; i < n; i++) {
      steps.push({
        line: 3,
        explanation: `Recursive call: head = node[${i}] (value ${nums[i]}). Not base case, recurse deeper.`,
        variables: { head: nums[i], depth: i },
        visualization: makeViz(
          [...nums],
          Object.fromEntries(Array.from({ length: i + 1 }, (_, x) => [x, 'active'])),
          { [i]: `depth ${i}` }
        ),
      });
    }

    steps.push({
      line: 2,
      explanation: `Base case reached at node[${n - 1}] (value ${nums[n - 1]}). This becomes the new head. Begin returning.`,
      variables: { newHead: nums[n - 1] },
      visualization: makeViz(
        [...nums],
        { [n - 1]: 'found' },
        { [n - 1]: 'newHead' }
      ),
    });

    // Simulate unwinding the call stack
    for (let i = n - 2; i >= 0; i--) {
      const partial = [...nums.slice(i + 1).reverse(), ...nums.slice(0, i + 1)];

      steps.push({
        line: 4,
        explanation: `Unwinding: node[${i}] (value ${nums[i]}). Set node[${i + 1}].next = node[${i}], then node[${i}].next = null. Pointer flipped.`,
        variables: { current: nums[i], next: nums[i + 1] },
        visualization: makeViz(
          partial,
          { [0]: 'found', [n - 1 - i - 1]: 'comparing', [n - 1 - i]: 'active' },
          { [0]: 'newHead', [n - 1 - i]: `node[${i}]` }
        ),
      });
    }

    const reversed = [...nums].reverse();

    steps.push({
      line: 6,
      explanation: `Reversal complete. Final list: [${reversed.join(' -> ')}]. Original head is now the tail.`,
      variables: { result: reversed.join(' -> ') },
      visualization: makeViz(
        reversed,
        Object.fromEntries(reversed.map((_, i) => [i, 'found'])),
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    return steps;
  },
};

export default reverseLinkedListRecursive;
