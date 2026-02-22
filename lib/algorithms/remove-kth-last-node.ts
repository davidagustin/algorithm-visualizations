import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const removeKthLastNode: AlgorithmDefinition = {
  id: 'remove-kth-last-node',
  title: 'Remove Kth Last Node',
  leetcodeNumber: 19,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a linked list, remove the nth node from the end and return the head. We use two pointers separated by a gap of n so that when the fast pointer reaches the end, the slow pointer is just before the node to remove.',
  tags: ['Linked List', 'Two Pointers'],
  code: {
    pseudocode: `function removeNthFromEnd(head, n):
  dummy = new Node(0)
  dummy.next = head
  fast = dummy
  slow = dummy
  for i from 0 to n:
    fast = fast.next
  while fast is not null:
    fast = fast.next
    slow = slow.next
  slow.next = slow.next.next
  return dummy.next`,
    python: `def removeNthFromEnd(head, n):
    dummy = ListNode(0)
    dummy.next = head
    fast = dummy
    slow = dummy
    for i in range(n + 1):
        fast = fast.next
    while fast is not None:
        fast = fast.next
        slow = slow.next
    slow.next = slow.next.next
    return dummy.next`,
    javascript: `function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0);
  dummy.next = head;
  let fast = dummy;
  let slow = dummy;
  for (let i = 0; i <= n; i++) {
    fast = fast.next;
  }
  while (fast !== null) {
    fast = fast.next;
    slow = slow.next;
  }
  slow.next = slow.next.next;
  return dummy.next;
}`,
    java: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0);
    dummy.next = head;
    ListNode fast = dummy;
    ListNode slow = dummy;
    for (int i = 0; i <= n; i++) {
        fast = fast.next;
    }
    while (fast != null) {
        fast = fast.next;
        slow = slow.next;
    }
    slow.next = slow.next.next;
    return dummy.next;
}`,
  },
  defaultInput: { nodes: [1, 2, 3, 4, 5], k: 2 },
  inputFields: [
    {
      name: 'nodes',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: 'e.g. 1,2,3,4,5',
      helperText: 'Comma-separated node values',
    },
    {
      name: 'k',
      label: 'K (position from end)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Remove the kth node from the end',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = (input.nodes as number[]).slice();
    const k = input.k as number;
    const n = nodes.length;
    const steps: AlgorithmStep[] = [];

    // We model with a dummy node at index -1 conceptually.
    // For visualization, we show the actual array and label fast/slow positions.
    // Positions: dummy = -1, first node = 0, etc.

    function makeViz(
      fastIdx: number,
      slowIdx: number,
      removedIdx: number | null
    ): ArrayVisualization {
      const displayArr = removedIdx !== null
        ? nodes.filter((_, i) => i !== removedIdx)
        : nodes.slice();
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      if (removedIdx !== null) {
        // Show result
        for (let i = 0; i < displayArr.length; i++) {
          highlights[i] = 'found';
        }
        return { type: 'array', array: displayArr, highlights, labels };
      }

      for (let i = 0; i < n; i++) {
        highlights[i] = 'default';
      }

      // fast pointer (could be beyond array)
      if (fastIdx >= 0 && fastIdx < n) {
        highlights[fastIdx] = 'active';
        labels[fastIdx] = (labels[fastIdx] ? labels[fastIdx] + '/fast' : 'fast');
      }

      // slow pointer
      if (slowIdx >= 0 && slowIdx < n) {
        highlights[slowIdx] = slowIdx === fastIdx ? 'active' : 'pointer';
        labels[slowIdx] = (labels[slowIdx] ? labels[slowIdx] + '/slow' : 'slow');
      }

      return { type: 'array', array: nodes, highlights, labels };
    }

    // Step 1: Initialize dummy, fast and slow at dummy
    steps.push({
      line: 1,
      explanation: `Create a dummy node before head. Both fast and slow point to dummy (before index 0).`,
      variables: { fast: 'dummy', slow: 'dummy', k },
      visualization: {
        type: 'array',
        array: nodes,
        highlights: {},
        labels: {},
      },
    });

    // Step 2-3: Advance fast by k+1 steps
    let fast = -1; // dummy position
    for (let i = 0; i <= k; i++) {
      fast++;
      steps.push({
        line: 6,
        explanation: fast < n
          ? `Advance fast pointer (step ${i + 1} of ${k + 1}). fast is now at node ${nodes[fast]}.`
          : `Advance fast pointer (step ${i + 1} of ${k + 1}). fast is now past the end.`,
        variables: { fast: fast < n ? nodes[fast] : 'null', slow: 'dummy', step: i + 1 },
        visualization: makeViz(fast, -1, null),
      });
    }

    steps.push({
      line: 7,
      explanation: `Fast is ${k + 1} steps ahead of slow. The gap of ${k + 1} means when fast reaches the end, slow.next is the node to remove.`,
      variables: { fast: fast < n ? nodes[fast] : 'null', slow: 'dummy', gap: k + 1 },
      visualization: makeViz(fast, -1, null),
    });

    // Step 4: Move both until fast reaches end
    let slow = -1; // dummy position
    while (fast < n) {
      fast++;
      slow++;
      steps.push({
        line: 8,
        explanation: fast < n
          ? `Move both pointers forward. fast -> ${nodes[fast]}, slow -> ${slow >= 0 ? nodes[slow] : 'dummy'}.`
          : `Move both pointers forward. fast is now past the end. slow -> ${slow >= 0 ? nodes[slow] : 'dummy'}.`,
        variables: {
          fast: fast < n ? nodes[fast] : 'null',
          slow: slow >= 0 ? nodes[slow] : 'dummy',
        },
        visualization: makeViz(fast, slow, null),
      });
    }

    // Step 5: Remove slow.next
    const removeIdx = slow + 1;
    const removedVal = nodes[removeIdx];
    steps.push({
      line: 10,
      explanation: `slow is at node ${nodes[slow]}. Remove slow.next which is node ${removedVal} (the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} node from the end).`,
      variables: { slow: nodes[slow], removing: removedVal, removeIndex: removeIdx },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) h[i] = 'default';
        if (slow >= 0 && slow < n) { h[slow] = 'pointer'; l[slow] = 'slow'; }
        h[removeIdx] = 'mismatch';
        l[removeIdx] = 'remove';
        return { type: 'array' as const, array: nodes, highlights: h, labels: l };
      })(),
    });

    // Step 6: Show result
    steps.push({
      line: 11,
      explanation: `Node ${removedVal} removed. Result: [${nodes.filter((_, i) => i !== removeIdx).join(' -> ')}].`,
      variables: { result: nodes.filter((_, i) => i !== removeIdx) },
      visualization: makeViz(-1, -1, removeIdx),
    });

    return steps;
  },
};

export default removeKthLastNode;
