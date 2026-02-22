import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reverseLinkedListII: AlgorithmDefinition = {
  id: 'reverse-linked-list-ii',
  title: 'Reverse Linked List II',
  leetcodeNumber: 92,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Reverse the nodes of a linked list from position left to position right in one pass. Uses a dummy head and pointer manipulation to extract the sublist, reverse it, and reconnect it.',
  tags: ['linked list', 'pointer manipulation', 'in-place', 'partial reverse'],

  code: {
    pseudocode: `function reverseBetween(head, left, right):
  dummy = ListNode(0)
  dummy.next = head
  prev = dummy
  // Advance prev to node before left
  for i = 1 to left-1:
    prev = prev.next
  curr = prev.next
  // Reverse from left to right
  for i = 0 to right-left-1:
    next = curr.next
    curr.next = next.next
    next.next = prev.next
    prev.next = next
  return dummy.next`,

    python: `def reverseBetween(head, left, right):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    curr = prev.next
    for _ in range(right - left):
        nxt = curr.next
        curr.next = nxt.next
        nxt.next = prev.next
        prev.next = nxt
    return dummy.next`,

    javascript: `function reverseBetween(head, left, right) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy;
  for (let i = 0; i < left - 1; i++) prev = prev.next;
  let curr = prev.next;
  for (let i = 0; i < right - left; i++) {
    const nxt = curr.next;
    curr.next = nxt.next;
    nxt.next = prev.next;
    prev.next = nxt;
  }
  return dummy.next;
}`,

    java: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    for (int i = 0; i < left - 1; i++) prev = prev.next;
    ListNode curr = prev.next;
    for (int i = 0; i < right - left; i++) {
        ListNode nxt = curr.next;
        curr.next = nxt.next;
        nxt.next = prev.next;
        prev.next = nxt;
    }
    return dummy.next;
}`,
  },

  defaultInput: { values: [1, 2, 3, 4, 5], left: 2, right: 4 },

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
      name: 'left',
      label: 'Left Position (1-indexed)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Start position of the reversal (1-indexed)',
    },
    {
      name: 'right',
      label: 'Right Position (1-indexed)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'End position of the reversal (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = (input.values as number[]) || [1, 2, 3, 4, 5];
    const left = (input.left as number) ?? 2;
    const right = (input.right as number) ?? 4;
    const steps: AlgorithmStep[] = [];
    const n = original.length;

    let arr = [...original];

    const leftIdx = left - 1;   // 0-indexed
    const rightIdx = right - 1; // 0-indexed

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Reverse Segment',
        entries: [
          { key: 'left position', value: `${left} (index ${leftIdx})` },
          { key: 'right position', value: `${right} (index ${rightIdx})` },
          { key: 'segment', value: arr.slice(leftIdx, rightIdx + 1).join(' → ') },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Create dummy node. Advance prev to position ${left - 1} (node before the reversal start).`,
      variables: { left, right, list: [...arr] },
      visualization: makeViz(
        {
          ...Object.fromEntries([...Array(n)].map((_, i) => [i,
            i < leftIdx ? 'visited' : i <= rightIdx ? 'active' : 'default'
          ])),
          [leftIdx > 0 ? leftIdx - 1 : 0]: 'pointer',
        },
        {
          [Math.max(0, leftIdx - 1)]: 'prev',
          [leftIdx]: 'curr (left)',
          [rightIdx]: 'right',
        }
      ),
    });

    steps.push({
      line: 5,
      explanation: `curr = node at position ${left} (value ${arr[leftIdx]}). We will insert elements before curr one at a time.`,
      variables: { prevNode: arr[leftIdx - 1] ?? 'dummy', curr: arr[leftIdx], left, right },
      visualization: makeViz(
        { ...Object.fromEntries([leftIdx, leftIdx + 1].map((i) => [i, 'comparing'])), [leftIdx - 1 >= 0 ? leftIdx - 1 : 0]: 'pointer' },
        { [leftIdx]: 'curr', [rightIdx]: 'end', [Math.max(0, leftIdx - 1)]: 'prev' }
      ),
    });

    // Simulate the reversal
    const reversalSteps = right - left;
    for (let step = 0; step < reversalSteps; step++) {
      // In the algorithm, we pick arr[leftIdx+1] and move it before arr[leftIdx]
      // equivalent: extract element at position leftIdx+1 and prepend to [leftIdx..leftIdx+step]
      const nxtVal = arr[leftIdx + 1];
      arr.splice(leftIdx + 1, 1);
      arr.splice(leftIdx, 0, nxtVal);

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        if (i < leftIdx) h[i] = 'visited';
        else if (i <= rightIdx) h[i] = 'active';
        else h[i] = 'default';
      }
      h[leftIdx] = 'found';
      l[leftIdx] = 'new front';
      l[leftIdx - 1 >= 0 ? leftIdx - 1 : 0] = 'prev';
      l[rightIdx] = 'right end';

      steps.push({
        line: 9,
        explanation: `Step ${step + 1}/${reversalSteps}: Move value ${nxtVal} to front of reversed segment. Segment now: [${arr.slice(leftIdx, rightIdx + 1).join(', ')}].`,
        variables: { moved: nxtVal, segmentState: arr.slice(leftIdx, rightIdx + 1), step: step + 1 },
        visualization: makeViz(h, l),
      });
    }

    steps.push({
      line: 12,
      explanation: `Reversal complete! Result: ${arr.join(' → ')}.`,
      variables: { result: [...arr] },
      visualization: makeViz(
        {
          ...Object.fromEntries(arr.map((_, i) => [i, i >= leftIdx && i <= rightIdx ? 'found' : 'sorted'])),
        },
        { 0: 'head', [n - 1]: 'tail', [leftIdx]: 'rev start', [rightIdx]: 'rev end' }
      ),
    });

    return steps;
  },
};

export default reverseLinkedListII;
