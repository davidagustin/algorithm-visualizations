import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const middleOfLinkedList: AlgorithmDefinition = {
  id: 'middle-of-linked-list',
  title: 'Middle of the Linked List',
  leetcodeNumber: 876,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given the head of a singly linked list, return the middle node. If there are two middle nodes (even length), return the second one. Use the fast and slow pointer technique: slow moves one step, fast moves two steps. When fast reaches the end, slow is at the middle.',
  tags: ['linked list', 'two pointers', 'fast and slow pointers'],

  code: {
    pseudocode: `function middleNode(head):
  slow = head
  fast = head
  while fast != null and fast.next != null:
    slow = slow.next
    fast = fast.next.next
  return slow`,

    python: `def middleNode(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow`,

    javascript: `function middleNode(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
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
    nums: [1, 2, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers representing the linked list',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let slow = 0;
    let fast = 0;

    steps.push({
      line: 1,
      explanation: `Initialize slow and fast pointers both at head (index 0, value ${nums[0]}). Slow moves 1 step, fast moves 2 steps per iteration.`,
      variables: { slow: 0, fast: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'S/F' }),
    });

    let iteration = 0;
    while (fast < n && fast + 1 < n) {
      const prevSlow = slow;
      const prevFast = fast;
      slow++;
      fast += 2;
      iteration++;

      const hl: Record<number, string> = { [slow]: 'active' };
      const lab: Record<number, string> = { [slow]: 'S' };

      if (fast < n) {
        hl[fast] = 'pointer';
        lab[fast] = 'F';
      } else {
        // fast is out of bounds
        lab[slow] = 'S';
      }

      steps.push({
        line: 4,
        explanation: `Iteration ${iteration}: slow moves from ${prevSlow} to ${slow} (value ${nums[slow]}). Fast moves from ${prevFast} to ${Math.min(fast, n - 1)} (${fast < n ? `value ${nums[fast]}` : 'out of bounds'}).`,
        variables: { slow, fast: Math.min(fast, n - 1), 'slow value': nums[slow] },
        visualization: makeViz(hl, lab),
      });
    }

    steps.push({
      line: 6,
      explanation: `Fast pointer reached the end. Slow pointer at index ${slow} (value ${nums[slow]}) is the middle node.`,
      variables: { middle: slow, 'middle value': nums[slow] },
      visualization: makeViz({ [slow]: 'found' }, { [slow]: 'MIDDLE' }),
    });

    return steps;
  },
};

export default middleOfLinkedList;
