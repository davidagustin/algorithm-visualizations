import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const swapNodesInPairs: AlgorithmDefinition = {
  id: 'swap-nodes-in-pairs',
  title: 'Swap Nodes in Pairs',
  leetcodeNumber: 24,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a linked list, swap every two adjacent nodes and return the head. Uses a dummy node and three pointers (prev, first, second) to rewire pairs without modifying node values.',
  tags: ['linked list', 'pointer manipulation', 'dummy node'],

  code: {
    pseudocode: `function swapPairs(head):
  dummy = ListNode(0)
  dummy.next = head
  prev = dummy
  while prev.next and prev.next.next:
    first = prev.next
    second = prev.next.next
    first.next = second.next
    second.next = first
    prev.next = second
    prev = first
  return dummy.next`,

    python: `def swapPairs(head):
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        first.next = second.next
        second.next = first
        prev.next = second
        prev = first
    return dummy.next`,

    javascript: `function swapPairs(head) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let prev = dummy;
  while (prev.next && prev.next.next) {
    const first = prev.next;
    const second = prev.next.next;
    first.next = second.next;
    second.next = first;
    prev.next = second;
    prev = first;
  }
  return dummy.next;
}`,

    java: `public ListNode swapPairs(ListNode head) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode prev = dummy;
    while (prev.next != null && prev.next.next != null) {
        ListNode first = prev.next;
        ListNode second = prev.next.next;
        first.next = second.next;
        second.next = first;
        prev.next = second;
        prev = first;
    }
    return dummy.next;
}`,
  },

  defaultInput: { values: [1, 2, 3, 4] },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Node values (will swap each pair of adjacent nodes)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = (input.values as number[]) || [1, 2, 3, 4];
    const steps: AlgorithmStep[] = [];
    const n = original.length;

    // Work on a mutable copy
    let arr = [...original];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'List State',
        entries: [
          { key: 'current order', value: arr.join(' → ') },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Create dummy node. Connect it to head. Use prev pointer starting at dummy. Input: ${original.join(' → ')}.`,
      variables: { list: [...arr] },
      visualization: makeViz(
        {},
        { 0: 'head', [n - 1]: 'tail' }
      ),
    });

    let prevIdx = -1; // -1 = dummy
    let pairStart = 0;

    while (pairStart + 1 < arr.length) {
      const firstIdx = pairStart;
      const secondIdx = pairStart + 1;

      steps.push({
        line: 5,
        explanation: `Identify pair: first=arr[${firstIdx}]=${arr[firstIdx]}, second=arr[${secondIdx}]=${arr[secondIdx]}.`,
        variables: { first: arr[firstIdx], second: arr[secondIdx], prevIdx },
        visualization: makeViz(
          { [firstIdx]: 'comparing', [secondIdx]: 'active' },
          { [firstIdx]: 'first', [secondIdx]: 'second' }
        ),
      });

      // Swap in array
      const temp = arr[firstIdx];
      arr[firstIdx] = arr[secondIdx];
      arr[secondIdx] = temp;

      steps.push({
        line: 8,
        explanation: `Swap: second(${arr[firstIdx]}) comes before first(${arr[secondIdx]}). Link rewired: prev→second→first→next.`,
        variables: { swapped: [arr[firstIdx], arr[secondIdx]], list: [...arr] },
        visualization: makeViz(
          { [firstIdx]: 'found', [secondIdx]: 'found' },
          { [firstIdx]: 'second', [secondIdx]: 'first', [pairStart]: 'prev→' }
        ),
      });

      steps.push({
        line: 10,
        explanation: `Advance prev to first (now at index ${secondIdx}). Move to next pair.`,
        variables: { prevVal: arr[secondIdx], nextPairStart: pairStart + 2, list: [...arr] },
        visualization: makeViz(
          { [firstIdx]: 'sorted', [secondIdx]: 'sorted' },
          { [secondIdx]: 'prev', [Math.min(pairStart + 2, arr.length - 1)]: pairStart + 2 < arr.length ? 'next' : '' }
        ),
      });

      pairStart += 2;
    }

    if (n % 2 !== 0) {
      steps.push({
        line: 11,
        explanation: `Odd number of nodes. Last node (${arr[n - 1]}) stays in place.`,
        variables: { lastNode: arr[n - 1] },
        visualization: makeViz(
          { ...Object.fromEntries(arr.map((_, i) => [i, i < n - 1 ? 'sorted' : 'active'])) },
          { [n - 1]: 'no swap' }
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `Done! Swapped result: ${arr.join(' → ')}.`,
      variables: { result: [...arr] },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        { 0: 'head', [arr.length - 1]: 'tail' }
      ),
    });

    return steps;
  },
};

export default swapNodesInPairs;
