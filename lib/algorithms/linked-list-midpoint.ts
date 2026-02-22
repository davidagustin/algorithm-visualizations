import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const linkedListMidpoint: AlgorithmDefinition = {
  id: 'linked-list-midpoint',
  title: 'Middle of the Linked List',
  leetcodeNumber: 876,
  difficulty: 'Easy',
  category: 'Fast And Slow Pointers',
  description:
    'Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node. Slow pointer moves 1 step, fast moves 2 steps. When fast reaches the end, slow is at the middle.',
  tags: ['linked list', 'fast slow pointers'],

  code: {
    pseudocode: `function middleNode(head):
  slow = head
  fast = head
  while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
  return slow`,

    python: `def middleNode(head: ListNode) -> ListNode:
    slow = head
    fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,

    javascript: `function middleNode(head) {
  let slow = head;
  let fast = head;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow;
}`,

    java: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow;
}`,
  },

  defaultInput: {
    nodes: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Node Values',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated node values',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = input.nodes as number[];
    const n = nodes.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nodes],
      highlights,
      labels,
    });

    if (n === 0) {
      steps.push({
        line: 1,
        explanation: 'Empty list. No middle node.',
        variables: { result: null },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    let slow = 0;
    let fast = 0;

    // Step: Initialize
    steps.push({
      line: 2,
      explanation: `Initialize slow and fast at head (index 0, value ${nodes[0]}).`,
      variables: { slow: 0, fast: 0, slowVal: nodes[0], fastVal: nodes[0] },
      visualization: makeViz({ [0]: 'active' }, { [0]: 'S,F' }),
    });

    while (fast < n - 1 && fast + 1 < n) {
      // Move slow by 1
      slow++;
      // Move fast by 2
      fast += 2;
      if (fast >= n) fast = n - 1;

      const atEnd = fast >= n - 1;

      steps.push({
        line: 5,
        explanation: `Move slow to index ${slow} (${nodes[slow]}), fast to index ${fast} (${nodes[fast]}).${atEnd ? ' Fast reached the end!' : ''}`,
        variables: { slow, fast, slowVal: nodes[slow], fastVal: nodes[fast] },
        visualization: makeViz(
          {
            ...(slow !== fast ? { [slow]: 'pointer', [fast]: 'active' } : { [slow]: 'active' }),
          },
          slow === fast ? { [slow]: 'S,F' } : { [slow]: 'S', [fast]: 'F' }
        ),
      });

      if (atEnd) break;
    }

    // Result
    steps.push({
      line: 6,
      explanation: `Fast has reached the end. Slow is at index ${slow}, value ${nodes[slow]}. This is the middle node!`,
      variables: { middle: nodes[slow], middleIndex: slow, result: nodes[slow] },
      visualization: makeViz(
        { ...Object.fromEntries(nodes.map((_, i) => [i, 'visited'])), [slow]: 'found' },
        { [slow]: 'mid' }
      ),
    });

    return steps;
  },
};

export default linkedListMidpoint;
