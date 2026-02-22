import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeNthNodeFromEndOfList: AlgorithmDefinition = {
  id: 'remove-nth-node-from-end-of-list',
  title: 'Remove Nth Node From End of List',
  leetcodeNumber: 19,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, remove the nth node from the end of the list and return its head. Two-pass approach: first count the total length, then traverse to position (length - n) and remove that node. A dummy node handles edge cases where the head is removed.',
  tags: ['linked list', 'two pointers', 'dummy node'],

  code: {
    pseudocode: `function removeNthFromEnd(head, n):
  dummy = new Node(0, head)
  // First pass: count length
  length = 0
  cur = head
  while cur != null:
    length++, cur = cur.next
  // Second pass: find node to remove
  target = length - n
  prev = dummy
  for i in range(target):
    prev = prev.next
  prev.next = prev.next.next
  return dummy.next`,

    python: `def removeNthFromEnd(head, n):
    dummy = ListNode(0, head)
    length, cur = 0, head
    while cur: length += 1; cur = cur.next
    target = length - n
    prev = dummy
    for _ in range(target): prev = prev.next
    prev.next = prev.next.next
    return dummy.next`,

    javascript: `function removeNthFromEnd(head, n) {
  const dummy = { val: 0, next: head };
  let length = 0, cur = head;
  while (cur) { length++; cur = cur.next; }
  let target = length - n;
  let prev = dummy;
  while (target-- > 0) prev = prev.next;
  prev.next = prev.next.next;
  return dummy.next;
}`,

    java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    int length = 0; ListNode cur = head;
    while (cur != null) { length++; cur = cur.next; }
    int target = length - n;
    ListNode prev = dummy;
    for (int i = 0; i < target; i++) prev = prev.next;
    prev.next = prev.next.next;
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    n: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'n',
      label: 'n (Remove nth from end)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Remove the nth node from the end (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const arr = [...nums];
    const length = arr.length;

    const makeViz = (
      a: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: a,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Remove the ${n}th node from the end of [${arr.join(', ')}]. Use dummy node and two-pass approach.`,
      variables: { n, list: arr },
      visualization: makeViz([...arr], { 0: 'active' }, { 0: 'start' }),
    });

    // First pass: count
    steps.push({
      line: 3,
      explanation: `First pass: count length of list. Length = ${length}.`,
      variables: { length },
      visualization: makeViz([...arr], Object.fromEntries(arr.map((_, i) => [i, 'visited'])), { [length - 1]: `len=${length}` }),
    });

    const target = length - n;
    const removeIdx = target;

    steps.push({
      line: 8,
      explanation: `Target position = length - n = ${length} - ${n} = ${target}. Node at index ${removeIdx} (value ${arr[removeIdx]}) will be removed.`,
      variables: { target, 'remove index': removeIdx, 'remove value': arr[removeIdx] },
      visualization: makeViz([...arr],
        { ...Object.fromEntries(Array.from({ length: removeIdx }, (_, i) => [i, 'pointer'])), [removeIdx]: 'mismatch' },
        { [removeIdx]: 'REMOVE', ...(removeIdx > 0 ? { [removeIdx - 1]: 'prev' } : {}) }),
    });

    for (let i = 0; i < removeIdx; i++) {
      steps.push({
        line: 10,
        explanation: `Second pass step ${i + 1}: advance prev to index ${i} (value ${arr[i]}).`,
        variables: { prev: i, 'prev value': arr[i] },
        visualization: makeViz([...arr], { [i]: 'active', [removeIdx]: 'mismatch' }, { [i]: 'prev', [removeIdx]: 'target' }),
      });
    }

    steps.push({
      line: 11,
      explanation: `Remove node at index ${removeIdx} (value ${arr[removeIdx]}). prev.next = prev.next.next.`,
      variables: { 'removed index': removeIdx, 'removed value': arr[removeIdx] },
      visualization: makeViz([...arr], { [removeIdx]: 'mismatch', [Math.max(0, removeIdx - 1)]: 'active' }, { [removeIdx]: 'REMOVE' }),
    });

    arr.splice(removeIdx, 1);

    steps.push({
      line: 12,
      explanation: `Node removed. Result: [${arr.join(', ')}].`,
      variables: { result: arr },
      visualization: makeViz([...arr], Object.fromEntries(arr.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default removeNthNodeFromEndOfList;
