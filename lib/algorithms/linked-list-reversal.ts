import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListReversal: AlgorithmDefinition = {
  id: 'linked-list-reversal',
  title: 'Reverse Linked List',
  leetcodeNumber: 206,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given the head of a singly linked list, reverse the list and return the reversed list. We iterate through the list, reversing each pointer to point to the previous node.',
  tags: ['Linked List', 'Iterative', 'Pointers'],
  code: {
    pseudocode: `function reverseList(head):
  prev = null
  curr = head
  while curr is not null:
    next = curr.next
    curr.next = prev
    prev = curr
    curr = next
  return prev`,
    python: `def reverseList(head):
    prev = None
    curr = head
    while curr is not None:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    javascript: `function reverseList(head) {
  let prev = null;
  let curr = head;
  while (curr !== null) {
    let next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  return prev;
}`,
    java: `public ListNode reverseList(ListNode head) {
    ListNode prev = null;
    ListNode curr = head;
    while (curr != null) {
        ListNode next = curr.next;
        curr.next = prev;
        prev = curr;
        curr = next;
    }
    return prev;
}`,
  },
  defaultInput: { values: [1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: 'e.g. 1,2,3,4,5',
      helperText: 'Comma-separated node values for the linked list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]).slice();
    const n = values.length;
    const steps: AlgorithmStep[] = [];

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'The linked list is empty. Nothing to reverse.',
        variables: { prev: null, curr: null },
        visualization: {
          type: 'array',
          array: [],
          highlights: {},
          labels: {},
        },
      });
      return steps;
    }

    // We model the linked list as an array. As nodes get reversed,
    // we track which portion is "reversed" (prev side) vs "remaining".
    // The array order stays as the original input for visualization;
    // highlights convey the pointer positions.

    function makeViz(
      prevIdx: number | null,
      currIdx: number | null,
      nextIdx: number | null,
      reversedUpTo: number // indices < this are reversed
    ): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (i < reversedUpTo) {
          highlights[i] = 'found'; // reversed portion
        }
      }

      if (prevIdx !== null) {
        highlights[prevIdx] = 'pointer';
        labels[prevIdx] = 'prev';
      }
      if (currIdx !== null) {
        highlights[currIdx] = 'active';
        labels[currIdx] = 'curr';
      }
      if (nextIdx !== null && nextIdx !== currIdx && nextIdx !== prevIdx) {
        highlights[nextIdx] = 'visited';
        labels[nextIdx] = 'next';
      }

      return {
        type: 'array',
        array: values,
        highlights,
        labels,
      };
    }

    // Step: Initialize prev = null, curr = head
    steps.push({
      line: 2,
      explanation: 'Initialize prev to null. This will become the new tail.',
      variables: { prev: null, curr: null },
      visualization: makeViz(null, null, null, 0),
    });

    steps.push({
      line: 3,
      explanation: `Set curr to head (node ${values[0]}). We will iterate through the list.`,
      variables: { prev: null, curr: values[0] },
      visualization: makeViz(null, 0, null, 0),
    });

    // Iterate through the list
    let prevIdx: number | null = null;
    let currIdx: number | null = 0;

    while (currIdx !== null && currIdx < n) {
      const nextIdx: number | null = currIdx + 1 < n ? currIdx + 1 : null;

      // Step: Check while condition
      steps.push({
        line: 4,
        explanation: `curr is node ${values[currIdx]} (not null), so we enter the loop.`,
        variables: {
          prev: prevIdx !== null ? values[prevIdx] : null,
          curr: values[currIdx],
          next: undefined,
        },
        visualization: makeViz(prevIdx, currIdx, null, prevIdx !== null ? prevIdx : 0),
      });

      // Step: Save next
      steps.push({
        line: 5,
        explanation: nextIdx !== null
          ? `Save next = curr.next = node ${values[nextIdx]}. We need this before we break the link.`
          : 'Save next = curr.next = null (this is the last node).',
        variables: {
          prev: prevIdx !== null ? values[prevIdx] : null,
          curr: values[currIdx],
          next: nextIdx !== null ? values[nextIdx] : null,
        },
        visualization: makeViz(prevIdx, currIdx, nextIdx, prevIdx !== null ? prevIdx : 0),
      });

      // Step: Reverse the pointer
      steps.push({
        line: 6,
        explanation: prevIdx !== null
          ? `Reverse pointer: curr.next = prev. Node ${values[currIdx]} now points to node ${values[prevIdx]}.`
          : `Reverse pointer: curr.next = prev (null). Node ${values[currIdx]} becomes the new tail.`,
        variables: {
          prev: prevIdx !== null ? values[prevIdx] : null,
          curr: values[currIdx],
          next: nextIdx !== null ? values[nextIdx] : null,
        },
        visualization: makeViz(prevIdx, currIdx, nextIdx, currIdx),
      });

      // Step: Advance prev
      steps.push({
        line: 7,
        explanation: `Move prev forward: prev = curr = node ${values[currIdx]}.`,
        variables: {
          prev: values[currIdx],
          curr: values[currIdx],
          next: nextIdx !== null ? values[nextIdx] : null,
        },
        visualization: makeViz(currIdx, currIdx, nextIdx, currIdx + 1),
      });

      // Step: Advance curr
      const newCurrIdx: number | null = nextIdx;
      steps.push({
        line: 8,
        explanation: newCurrIdx !== null
          ? `Move curr forward: curr = next = node ${values[newCurrIdx]}.`
          : 'Move curr forward: curr = next = null. We have reached the end.',
        variables: {
          prev: values[currIdx],
          curr: newCurrIdx !== null ? values[newCurrIdx] : null,
          next: nextIdx !== null ? values[nextIdx] : null,
        },
        visualization: makeViz(currIdx, newCurrIdx, null, currIdx + 1),
      });

      prevIdx = currIdx;
      currIdx = newCurrIdx;
    }

    // Step: Return prev (the new head)
    steps.push({
      line: 9,
      explanation: `curr is null, loop ends. Return prev = node ${values[prevIdx!]}. The list is now fully reversed: [${[...values].reverse().join(' -> ')}].`,
      variables: {
        prev: values[prevIdx!],
        curr: null,
        reversed: [...values].reverse(),
      },
      visualization: {
        type: 'array',
        array: values,
        highlights: Object.fromEntries(
          values.map((_, i) => [i, 'found'])
        ),
        labels: { [prevIdx!]: 'new head' },
      },
    });

    return steps;
  },
};

export default linkedListReversal;
