import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseLinkedListBetween: AlgorithmDefinition = {
  id: 'reverse-linked-list-between',
  title: 'Reverse Linked List Between Positions',
  leetcodeNumber: 92,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Reverse a portion of a linked list from position left to right in one pass. Use a sentinel node, advance to position left-1, then repeatedly move the node right after the current sublist to just after the sentinel node position, effectively reversing the sublist.',
  tags: ['linked list', 'reverse', 'in-place'],

  code: {
    pseudocode: `function reverseBetween(head, left, right):
  sentinel = Node(0, head)
  pre = sentinel
  advance pre to position left-1
  cur = pre.next
  for i from 0 to right-left-1:
    next = cur.next
    cur.next = next.next
    next.next = pre.next
    pre.next = next
  return sentinel.next`,

    python: `def reverseBetween(head, left, right):
    sentinel = ListNode(0, head)
    pre = sentinel
    for _ in range(left - 1):
        pre = pre.next
    cur = pre.next
    for _ in range(right - left):
        nxt = cur.next
        cur.next = nxt.next
        nxt.next = pre.next
        pre.next = nxt
    return sentinel.next`,

    javascript: `function reverseBetween(head, left, right) {
  const sentinel = { val: 0, next: head };
  let pre = sentinel;
  for (let i = 0; i < left - 1; i++) pre = pre.next;
  let cur = pre.next;
  for (let i = 0; i < right - left; i++) {
    const nxt = cur.next;
    cur.next = nxt.next;
    nxt.next = pre.next;
    pre.next = nxt;
  }
  return sentinel.next;
}`,

    java: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode sentinel = new ListNode(0, head);
    ListNode pre = sentinel;
    for (int i = 0; i < left - 1; i++) pre = pre.next;
    ListNode cur = pre.next;
    for (int i = 0; i < right - left; i++) {
        ListNode nxt = cur.next;
        cur.next = nxt.next;
        nxt.next = pre.next;
        pre.next = nxt;
    }
    return sentinel.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    target: 2,
    k: 4,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Linked list nodes',
    },
    {
      name: 'target',
      label: 'left position (1-indexed)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Start position of reversal (1-indexed)',
    },
    {
      name: 'k',
      label: 'right position (1-indexed)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'End position of reversal (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const left = input.target as number;
    const right = input.k as number;
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

    const l = left - 1; // 0-indexed
    const r = Math.min(right - 1, n - 1); // 0-indexed

    steps.push({
      line: 1,
      explanation: `Reverse list from position ${left} to ${right} (1-indexed). 0-indexed: [${l}, ${r}].`,
      variables: { left, right },
      visualization: makeViz([...nums], {}, {}),
    });

    steps.push({
      line: 3,
      explanation: `Advance pre pointer to position ${left - 1} (index ${l - 1}). Pre points to node just before reversal start.`,
      variables: { preIdx: l - 1, preVal: l > 0 ? nums[l - 1] : 'sentinel' },
      visualization: makeViz(
        [...nums],
        { [Math.max(0, l - 1)]: 'pointer' },
        { [Math.max(0, l - 1)]: 'pre', [l]: 'cur' }
      ),
    });

    // Show the subarray to reverse
    steps.push({
      line: 4,
      explanation: `Current sublist to reverse: [${nums.slice(l, r + 1).join(', ')}]. Will use repeated front-insertion.`,
      variables: { sublist: nums.slice(l, r + 1).join(', ') },
      visualization: makeViz(
        [...nums],
        Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, 'active'])),
        { [l]: 'start', [r]: 'end' }
      ),
    });

    // Simulate the reversal step by step
    const arr = [...nums];
    for (let i = 0; i < r - l; i++) {
      // Move element at position l+i+1 to position l
      const moved = arr.splice(l + 1, 1)[0];
      arr.splice(l, 0, moved);

      steps.push({
        line: 6,
        explanation: `Step ${i + 1}: Move node with value ${moved} to front of sublist. Sublist now: [${arr.slice(l, r + 1).join(', ')}].`,
        variables: { moved, step: i + 1 },
        visualization: makeViz(
          [...arr],
          { [l]: 'swapping', ...Object.fromEntries(Array.from({ length: r - l }, (_, x) => [l + 1 + x, 'active'])) },
          { [l]: 'moved' }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Reversal complete. Final list: [${arr.join(' -> ')}].`,
      variables: { result: arr.join(' -> ') },
      visualization: makeViz(
        arr,
        Object.fromEntries(Array.from({ length: r - l + 1 }, (_, i) => [l + i, 'found'])),
        { [l]: 'reversed_start', [r]: 'reversed_end' }
      ),
    });

    return steps;
  },
};

export default reverseLinkedListBetween;
