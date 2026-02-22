import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateLinkedList: AlgorithmDefinition = {
  id: 'rotate-linked-list',
  title: 'Rotate List',
  leetcodeNumber: 61,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, rotate the list to the right by k places. The key insight is to find the new tail at position (n - k % n - 1) and reconnect the list. First compute the length, then use modulo to handle k larger than n.',
  tags: ['linked list', 'two pointers', 'rotation'],

  code: {
    pseudocode: `function rotateRight(head, k):
  if head is null or k == 0: return head
  n = length of list
  k = k % n
  if k == 0: return head
  slow = fast = head
  advance fast by k steps
  while fast.next != null:
    slow = slow.next
    fast = fast.next
  newHead = slow.next
  slow.next = null
  fast.next = head
  return newHead`,

    python: `def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    n, cur = 1, head
    while cur.next:
        cur = cur.next
        n += 1
    cur.next = head  # make circular
    k = k % n
    steps = n - k
    for _ in range(steps):
        cur = cur.next
    new_head = cur.next
    cur.next = None
    return new_head`,

    javascript: `function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  let n = 1, cur = head;
  while (cur.next) { cur = cur.next; n++; }
  cur.next = head;
  k = k % n;
  let steps = n - k;
  for (let i = 0; i < steps; i++) cur = cur.next;
  const newHead = cur.next;
  cur.next = null;
  return newHead;
}`,

    java: `public ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null || k == 0) return head;
    int n = 1;
    ListNode cur = head;
    while (cur.next != null) { cur = cur.next; n++; }
    cur.next = head;
    k = k % n;
    int steps = n - k;
    for (int i = 0; i < steps; i++) cur = cur.next;
    ListNode newHead = cur.next;
    cur.next = null;
    return newHead;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List (as array)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Nodes of the linked list',
    },
    {
      name: 'k',
      label: 'k (rotation amount)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of places to rotate right',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    if (n === 0) return steps;

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
      explanation: `Start: list has ${n} nodes. k = ${k}.`,
      variables: { n, k },
      visualization: makeViz({}, {}),
    });

    const effectiveK = k % n;

    steps.push({
      line: 3,
      explanation: `Effective rotation: k % n = ${k} % ${n} = ${effectiveK}. Rotating by ${effectiveK} positions.`,
      variables: { n, k, effectiveK },
      visualization: makeViz({}, {}),
    });

    if (effectiveK === 0) {
      steps.push({
        line: 4,
        explanation: 'Effective k is 0, list stays unchanged.',
        variables: { effectiveK },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    // The new tail is at index n - effectiveK - 1
    const newTailIdx = n - effectiveK - 1;
    const newHeadIdx = n - effectiveK;

    steps.push({
      line: 6,
      explanation: `Move pointer to find new tail at index ${newTailIdx} (n - k - 1 = ${n} - ${effectiveK} - 1).`,
      variables: { newTailIdx, newHeadIdx },
      visualization: makeViz(
        { [newTailIdx]: 'active', [newHeadIdx]: 'pointer' },
        { [newTailIdx]: 'newTail', [newHeadIdx]: 'newHead' }
      ),
    });

    steps.push({
      line: 9,
      explanation: `Old tail at index ${n - 1} will connect to old head (index 0) to complete rotation.`,
      variables: { oldTail: n - 1, oldHead: 0 },
      visualization: makeViz(
        { [n - 1]: 'comparing', [0]: 'comparing', [newTailIdx]: 'active', [newHeadIdx]: 'pointer' },
        { [n - 1]: 'oldTail', [0]: 'oldHead', [newTailIdx]: 'newTail', [newHeadIdx]: 'newHead' }
      ),
    });

    // Build the rotated array
    const rotated = [...nums.slice(newHeadIdx), ...nums.slice(0, newHeadIdx)];

    steps.push({
      line: 11,
      explanation: `Reconnect: newTail.next = null, oldTail.next = oldHead. New list starts at index ${newHeadIdx} (value ${nums[newHeadIdx]}).`,
      variables: { newHead: nums[newHeadIdx], result: rotated.join(' -> ') },
      visualization: {
        type: 'array',
        array: rotated,
        highlights: { 0: 'found' },
        labels: { 0: 'head' },
      },
    });

    return steps;
  },
};

export default rotateLinkedList;
