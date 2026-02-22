import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateList: AlgorithmDefinition = {
  id: 'rotate-list',
  title: 'Rotate List',
  leetcodeNumber: 61,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a linked list, rotate the list to the right by k places. The key insight: after k rotations, the new head is at position (n - k % n). Form a circular list then break it at the right point.',
  tags: ['linked list', 'two pointers', 'modular arithmetic'],

  code: {
    pseudocode: `function rotateRight(head, k):
  if not head: return head
  length = 1, tail = head
  while tail.next:
    tail = tail.next; length++
  k = k % length
  if k == 0: return head
  tail.next = head  // make circular
  steps = length - k - 1
  newTail = head
  repeat steps times: newTail = newTail.next
  newHead = newTail.next
  newTail.next = null
  return newHead`,

    python: `def rotateRight(head, k):
    if not head or not head.next or k == 0:
        return head
    tail = head
    length = 1
    while tail.next:
        tail = tail.next
        length += 1
    k = k % length
    if k == 0:
        return head
    tail.next = head
    steps = length - k - 1
    new_tail = head
    for _ in range(steps):
        new_tail = new_tail.next
    new_head = new_tail.next
    new_tail.next = None
    return new_head`,

    javascript: `function rotateRight(head, k) {
  if (!head || !head.next || k === 0) return head;
  let tail = head, length = 1;
  while (tail.next) { tail = tail.next; length++; }
  k = k % length;
  if (k === 0) return head;
  tail.next = head;
  let steps = length - k - 1, newTail = head;
  for (let i = 0; i < steps; i++) newTail = newTail.next;
  const newHead = newTail.next;
  newTail.next = null;
  return newHead;
}`,

    java: `public ListNode rotateRight(ListNode head, int k) {
    if (head == null || head.next == null || k == 0) return head;
    ListNode tail = head;
    int length = 1;
    while (tail.next != null) { tail = tail.next; length++; }
    k = k % length;
    if (k == 0) return head;
    tail.next = head;
    int steps = length - k - 1;
    ListNode newTail = head;
    for (int i = 0; i < steps; i++) newTail = newTail.next;
    ListNode newHead = newTail.next;
    newTail.next = null;
    return newHead;
}`,
  },

  defaultInput: { values: [1, 2, 3, 4, 5], k: 2 },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Node values of the linked list',
    },
    {
      name: 'k',
      label: 'Rotation Steps (k)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of places to rotate right',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]) || [1, 2, 3, 4, 5];
    const kRaw = (input.k as number) ?? 2;
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    if (n === 0) {
      steps.push({ line: 1, explanation: 'Empty list. Return null.', variables: {}, visualization: { type: 'array', array: [], highlights: {}, labels: {} } });
      return steps;
    }

    const k = kRaw % n;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: values,
      highlights,
      labels,
      auxData: {
        label: 'Rotation Info',
        entries: [
          { key: 'length', value: `${n}` },
          { key: 'k (raw)', value: `${kRaw}` },
          { key: 'k % n', value: `${k}` },
          { key: 'new head at', value: `index ${k === 0 ? 0 : n - k}` },
        ],
      },
    });

    steps.push({
      line: 2,
      explanation: `Traverse to find tail and length. Length=${n}, tail value=${values[n - 1]}.`,
      variables: { length: n, tail: values[n - 1], k: kRaw },
      visualization: makeViz(
        { 0: 'active', [n - 1]: 'pointer' },
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    steps.push({
      line: 6,
      explanation: `k = ${kRaw} % ${n} = ${k}. ${k === 0 ? 'k=0, no rotation needed.' : `Need to rotate by ${k}. New head will be at index ${n - k}.`}`,
      variables: { k, n, effectiveK: k },
      visualization: makeViz(
        { [n - k]: 'comparing' },
        { 0: 'old head', [n - k]: `new head` }
      ),
    });

    if (k === 0) {
      steps.push({
        line: 7,
        explanation: `k % n = 0, list unchanged. Return original head.`,
        variables: { result: values },
        visualization: makeViz(
          Object.fromEntries(values.map((_, i) => [i, 'sorted'])),
          { 0: 'head' }
        ),
      });
      return steps;
    }

    const newTailIdx = n - k - 1;
    const newHeadIdx = n - k;

    steps.push({
      line: 8,
      explanation: `Connect tail to head to form circular list. Break point: newTail=index ${newTailIdx} (value ${values[newTailIdx]}), newHead=index ${newHeadIdx} (value ${values[newHeadIdx]}).`,
      variables: { newTailIdx, newHeadIdx, newTailVal: values[newTailIdx], newHeadVal: values[newHeadIdx] },
      visualization: makeViz(
        {
          ...Object.fromEntries(values.map((_, i) => [i, i < newHeadIdx ? 'visited' : 'active'])),
          [newTailIdx]: 'pointer',
          [newHeadIdx]: 'found',
        },
        { [newTailIdx]: 'newTail', [newHeadIdx]: 'newHead', [n - 1]: 'tail', 0: 'old head' }
      ),
    });

    steps.push({
      line: 12,
      explanation: `Set newTail.next = null to break the circle. The list is now rotated.`,
      variables: { newHeadIdx, newTailIdx },
      visualization: makeViz(
        { [newTailIdx]: 'pointer', [newHeadIdx]: 'found' },
        { [newTailIdx]: 'newTail→null', [newHeadIdx]: 'newHead' }
      ),
    });

    // Build rotated array for final display
    const rotated = [...values.slice(newHeadIdx), ...values.slice(0, newHeadIdx)];

    steps.push({
      line: 13,
      explanation: `Rotation complete! New list: ${rotated.join(' → ')} (rotated ${k} places to the right).`,
      variables: { result: rotated },
      visualization: {
        type: 'array',
        array: rotated,
        highlights: Object.fromEntries(rotated.map((_, i) => [i, 'found'])),
        labels: { 0: 'head', [rotated.length - 1]: 'tail' },
      },
    });

    return steps;
  },
};

export default rotateList;
